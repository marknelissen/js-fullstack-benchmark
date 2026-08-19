import { serve } from "@hono/node-server";
import crypto from "crypto";
import { Hono } from "hono";
import { compress } from "hono/compress";
import { secureHeaders } from "hono/secure-headers";

const app = new Hono();

app.use(compress());
app.use(secureHeaders());

app.get("/api/id", (c) => {
  return c.json({ id: crypto.randomUUID() });
});

serve({
  fetch: app.fetch,
  port: 3000,
});
