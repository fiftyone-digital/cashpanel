import { createLoggerWithContext } from "@midday/logger";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { drizzle } from "drizzle-orm/node-postgres";
import type { PgTransaction } from "drizzle-orm/pg-core";
import { Pool } from "pg";
import { createDrizzleLogger, instrumentPool } from "./instrument";
import { withReplicas } from "./replicas";
import * as schema from "./schema";

const logger = createLoggerWithContext("db");

const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.RAILWAY_ENVIRONMENT_NAME === "production";
const DEBUG_PERF = process.env.DEBUG_PERF === "true";
const DB_POOL_EVENT_LOGGING = process.env.DB_POOL_EVENT_LOGGING === "true";

function getPositiveIntegerEnv(name: string, fallback: number) {
  const value = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

const maxConnections = isDevelopment
  ? 8
  : getPositiveIntegerEnv("DB_POOL_MAX", 4);

const connectionConfig = {
  // Supabase session pooler has a low per-project connection cap. Keep this
  // conservative because Railway may run multiple replicas at once.
  max: maxConnections,
  min: 0,
  idleTimeoutMillis: isDevelopment ? 5000 : isProduction ? 30000 : 10000,
  connectionTimeoutMillis: 5000,
  maxUses: isDevelopment ? 100 : 7500,
  allowExitOnIdle: !isProduction,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10_000,
  ssl: isDevelopment ? false : { rejectUnauthorized: false },
};

const drizzleLogger = DEBUG_PERF ? createDrizzleLogger() : undefined;

function getPgErrorDetails(error: unknown) {
  const details: Record<string, unknown> = {};

  if (error && typeof error === "object") {
    const err = error as Record<string, unknown>;
    const fields = [
      "name",
      "message",
      "code",
      "errno",
      "syscall",
      "address",
      "port",
      "stack",
    ];

    for (const field of fields) {
      if (err[field] !== undefined) {
        details[field] = err[field];
      }
    }
  } else {
    details.message = String(error);
  }

  return details;
}

function getSinglePoolStats(pool: Pool) {
  return {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount,
  };
}

function attachPoolMonitoring(pool: Pool, poolName: "primary" | "replica") {
  pool.on("error", (err) => {
    logger.error(`${poolName} pool: idle client error`, {
      pool: poolName,
      ...getPgErrorDetails(err),
      stats: getSinglePoolStats(pool),
    });
  });

  if (!DB_POOL_EVENT_LOGGING) {
    return;
  }

  pool.on("connect", () => {
    logger.info(`${poolName} pool: client connected`, {
      pool: poolName,
      stats: getSinglePoolStats(pool),
    });
  });

  pool.on("acquire", () => {
    logger.info(`${poolName} pool: client acquired`, {
      pool: poolName,
      stats: getSinglePoolStats(pool),
    });
  });

  pool.on("remove", () => {
    logger.info(`${poolName} pool: client removed`, {
      pool: poolName,
      stats: getSinglePoolStats(pool),
    });
  });
}

// Primary pool — DATABASE_PRIMARY_URL
const primaryPool = new Pool({
  connectionString: process.env.DATABASE_PRIMARY_URL!,
  ...connectionConfig,
});

if (DEBUG_PERF) instrumentPool(primaryPool, "primary");
attachPoolMonitoring(primaryPool, "primary");

export const primaryDb = drizzle(primaryPool, {
  schema,
  casing: "snake_case",
  logger: drizzleLogger,
});

const rawReplicaUrl =
  process.env.DATABASE_REPLICA_URL ?? process.env.DATABASE_FRA_URL;
const replicaUrl =
  rawReplicaUrl && rawReplicaUrl !== process.env.DATABASE_PRIMARY_URL
    ? rawReplicaUrl
    : undefined;

if (!isDevelopment) {
  if (!rawReplicaUrl) {
    logger.info("No DATABASE_REPLICA_URL set — all reads will use primary");
  } else if (!replicaUrl) {
    logger.info("Replica URL matches primary — sharing pool");
  }
}

const replicaPool = replicaUrl
  ? new Pool({ connectionString: replicaUrl, ...connectionConfig })
  : null;

if (DEBUG_PERF && replicaPool) instrumentPool(replicaPool, "replica");
if (replicaPool) {
  attachPoolMonitoring(replicaPool, "replica");
}

const replicaDb = replicaPool
  ? drizzle(replicaPool, {
      schema,
      casing: "snake_case",
      logger: drizzleLogger,
    })
  : primaryDb;

export const db = withReplicas(
  primaryDb,
  [replicaDb],
  (replicas) => replicas[0]!,
);

export const connectDb = async () => {
  return db;
};

export type Database = Awaited<ReturnType<typeof connectDb>>;

export type TransactionClient = PgTransaction<
  NodePgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

/** Use in query functions that should work both standalone and within transactions */
export type DatabaseOrTransaction = Database | TransactionClient;

export type DatabaseWithPrimary = Database & {
  $primary?: Database;
  usePrimaryOnly?: () => Database;
};

export function getPoolStats() {
  return {
    primary: {
      total: primaryPool.totalCount,
      idle: primaryPool.idleCount,
      waiting: primaryPool.waitingCount,
    },
    replica: replicaPool
      ? {
          total: replicaPool.totalCount,
          idle: replicaPool.idleCount,
          waiting: replicaPool.waitingCount,
        }
      : null,
  };
}

/**
 * Close all database pools gracefully
 */
export const closeDb = async (): Promise<void> => {
  await Promise.all([primaryPool.end(), replicaPool?.end()]);
};
