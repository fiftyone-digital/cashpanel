## API

### Environment Variables

The API requires the following environment variables:

#### Redis Configuration
```bash
# Local development (Docker):
REDIS_URL=redis://localhost:6379
REDIS_QUEUE_URL=redis://localhost:6379

# Production:
# REDIS_URL=redis://...railway.internal:6379
# REDIS_QUEUE_URL=redis://...railway.internal:6379 (Railway Redis - BullMQ queue)
```

Redis can be shared by the API cache and BullMQ queue in this single-region Railway deployment:

- **`REDIS_URL`** — Railway Redis for app-level caching.
- **`REDIS_QUEUE_URL`** — Railway Redis for BullMQ job queues. This can point at the same Redis service as `REDIS_URL`.

#### Local Development Setup

1. **Start Redis with Docker:**
   ```bash
   docker run -d --name redis -p 6379:6379 redis:alpine
   ```

2. **Set environment variable:**
   ```bash
   export REDIS_URL=redis://localhost:6379
   ```

#### Database Configuration
```bash
DATABASE_PRIMARY_URL=postgresql://...
DATABASE_REPLICA_URL=postgresql://...  # Optional EU read replica
DB_POOL_MAX=4
```

Keep `DB_POOL_MAX` conservative when using the Supabase session pooler. Railway
may run multiple replicas, and each process creates its own Postgres pool.

### Development

```bash
bun dev
```

### Production

```bash
bun start
```

### Cache Implementation

The API uses Redis for shared cache state:

- **apiKeyCache**: Caches API key lookups (30 min TTL)
- **userCache**: Caches user data (30 min TTL)
- **teamCache**: Caches team access permissions (30 min TTL)
- **teamPermissionsCache**: Caches team permission lookups (30 min TTL)
- **replicationCache**: Tracks recent mutations for read-after-write consistency (10 sec TTL)

The client gracefully degrades when Redis is unavailable — cache misses return `undefined` and operations no-op instead of throwing.
