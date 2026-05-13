import { registerCashPanelBotRuntime } from "@api/bot/runtime";
import type { Context } from "@api/rest/types";
import { bot } from "@cashpanel/bot";
import { OpenAPIHono } from "@hono/zod-openapi";

const app = new OpenAPIHono<Context>();

registerCashPanelBotRuntime();

app.post("/", async (c) => {
  await bot.initialize();
  return bot.webhooks.telegram(c.req.raw);
});

export const telegramWebhookRouter = app;
