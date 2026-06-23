import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { cleanEnvValue } from "@/lib/env";
import * as schema from "./schema";

type Db = ReturnType<typeof createDb>;

function createDb(connectionString: string) {
  const client = postgres(connectionString, {
    // Supabase/pgbouncer transaction pooler does not support prepared statements.
    prepare: false,
    // One connection per serverless instance; the pooler fans out on its side.
    max: 1,
    // Close idle sockets quickly so warm lambdas don't hold pooler slots.
    idle_timeout: 20,
    // Fail fast instead of hanging the request when the DB is unreachable.
    connect_timeout: 10,
  });
  return drizzle(client, { schema });
}

let _db: Db | null | undefined;

/**
 * Returns a Drizzle client, or `null` when `DATABASE_URL` is not configured.
 * Callers must handle the null case and fall back to static content.
 */
export function getDb(): Db | null {
  if (_db !== undefined) return _db;
  const raw = process.env.DATABASE_URL;
  const connectionString = raw ? cleanEnvValue(raw) : undefined;
  if (!connectionString) {
    _db = null;
    return null;
  }
  _db = createDb(connectionString);
  return _db;
}

export { schema };
