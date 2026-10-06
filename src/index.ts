import { serve } from "@hono/node-server";
import { createApp } from "./app.ts";
import { openDatabase } from "./db.ts";
import { seedIncident } from "./seed.ts";

const dbPath = process.env.DB_PATH ?? "data/repasses.sqlite";
const db = openDatabase(dbPath);
seedIncident(db);
const port = Number(process.env.PORT ?? 3001);

serve({ fetch: createApp(db).fetch, port }, (info) => {
  console.log(`repasses em http://127.0.0.1:${info.port}`);
});
