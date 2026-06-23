/**
 * Apply drizzle SQL migrations via Supabase Management API.
 * Usage: npx tsx scripts/apply-migrations.ts
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { loadLocalEnv } from "./lib/load-env";

const PROJECT_REF = "zkojldtwgweqvtnokfpn";

async function runSql(query: string) {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  if (!token) throw new Error("Set SUPABASE_ACCESS_TOKEN (sbp_… from Supabase CLI login)");

  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(body);
  return body;
}

function splitStatements(sql: string): string[] {
  return sql
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function main() {
  loadLocalEnv();

  const drizzleDir = resolve(process.cwd(), "drizzle");
  const files = ["0000_zippy_luke_cage.sql", "0001_page_sections.sql", "0002_admin_users.sql"];

  for (const file of files) {
    const path = resolve(drizzleDir, file);
    if (!existsSync(path)) continue;
    console.log(`Applying ${file}…`);
    const sql = readFileSync(path, "utf8");
    for (const statement of splitStatements(sql)) {
      await runSql(statement);
    }
  }

  await runSql(
    "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO redi_app; ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO redi_app;",
  );

  console.log("Migrations applied.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
