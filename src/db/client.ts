import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type Db = ReturnType<typeof createDb>;

function createDb(connectionString: string) {
  const sql = neon(connectionString);
  return drizzle(sql, { schema });
}

let _db: Db | null | undefined;

/**
 * Returns a Drizzle client, or `null` when `DATABASE_URL` is not configured.
 * Callers must handle the null case and fall back to static content.
 */
export function getDb(): Db | null {
  if (_db !== undefined) return _db;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    _db = null;
    return null;
  }
  _db = createDb(connectionString);
  return _db;
}

export { schema };
