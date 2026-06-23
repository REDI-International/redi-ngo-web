/**
 * Batch create / update REDI admin users in Supabase Auth and admin_users table.
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   DATABASE_URL
 *
 * Usage:
 *   npm run create-users
 *   npm run create-users -- '<password>'
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { loadLocalEnv } from "./lib/load-env";
import { adminUsers } from "../src/db/schema";
import type { AdminRole } from "../src/lib/admin/roles";

const USERS: { email: string; role: AdminRole }[] = [
  { email: "petrica@redi-ngo.eu", role: "superadmin" },
  { email: "richard@redi-ngo.eu", role: "admin" },
  { email: "ghita@redi-ngo.eu", role: "admin" },
  { email: "delia@redi-ngo.eu", role: "editor" },
  { email: "gloria@redi-ngo.eu", role: "editor" },
  { email: "maria@redi-ngo.eu", role: "editor" },
  { email: "marius@redi-ngo.eu", role: "editor" },
  { email: "laura@redi-ngo.eu", role: "editor" },
  { email: "fatima@redi-ngo.eu", role: "editor" },
  { email: "barbara@redi-ngo.eu", role: "editor" },
  { email: "merve@redi-ngo.eu", role: "editor" },
  { email: "andreea@redi-ngo.eu", role: "editor" },
];

async function upsertAuthUser(
  supabase: SupabaseClient,
  email: string,
  password: string,
): Promise<string | undefined> {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (!error) return data.user?.id;

  const exists = /already.*registered|already been registered|exists/i.test(error.message);
  if (!exists) throw new Error(`${email}: ${error.message}`);

  const { data: list, error: listErr } = await supabase.auth.admin.listUsers();
  if (listErr) throw new Error(listErr.message);
  const existing = list.users.find((u) => u.email?.toLowerCase() === email);
  if (!existing) throw new Error(`${email}: exists but not found`);

  const { error: updErr } = await supabase.auth.admin.updateUserById(existing.id, {
    password,
    email_confirm: true,
  });
  if (updErr) throw new Error(`${email}: ${updErr.message}`);
  return existing.id;
}

async function main() {
  loadLocalEnv();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const dbUrl = process.env.DATABASE_URL;
  const password = process.argv[2] ?? process.env.ADMIN_PASSWORD ?? "Welcome2REDI*";

  if (!url || !serviceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
  }
  if (!dbUrl) {
    console.error("Missing DATABASE_URL — required to write admin_users rows.");
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const client = postgres(dbUrl, { prepare: false, max: 1 });
  const db = drizzle(client);

  console.log(`Creating/updating ${USERS.length} admin users…`);

  for (const { email, role } of USERS) {
    const normalized = email.toLowerCase();
    const supabaseUserId = await upsertAuthUser(supabase, normalized, password);

    const existing = await db.select().from(adminUsers).where(eq(adminUsers.email, normalized)).limit(1);
    if (existing[0]) {
      await db
        .update(adminUsers)
        .set({
          role,
          supabaseUserId: supabaseUserId ?? existing[0].supabaseUserId,
          mustChangePassword: true,
          updatedAt: new Date(),
        })
        .where(eq(adminUsers.id, existing[0].id));
      console.log(`✓ Updated ${normalized} (${role})`);
    } else {
      await db.insert(adminUsers).values({
        email: normalized,
        role,
        supabaseUserId,
        mustChangePassword: true,
      });
      console.log(`✓ Created ${normalized} (${role})`);
    }
  }

  await client.end();
  console.log("\nDone. Users can sign in at /admin/login and must change password on first login.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
