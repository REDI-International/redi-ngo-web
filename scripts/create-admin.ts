/**
 * Creates (or updates) a Supabase admin user for the REDI admin panel.
 *
 * Requires these env vars (in .env.local or the shell):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage:
 *   npm run create-admin -- 'Welcome2REDI*'
 *   npm run create-admin -- '<password>' '<email>'
 *
 * Defaults: email = petrica@redi-ngo.eu
 * The password is taken from the CLI (or ADMIN_PASSWORD env) so it is never
 * committed to the repository.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadLocalEnv() {
  const file = resolve(process.cwd(), ".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1];
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  loadLocalEnv();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
        "Add them to .env.local (see .env.example) and try again.",
    );
    process.exit(1);
  }

  const password = process.argv[2] ?? process.env.ADMIN_PASSWORD;
  const email = process.argv[3] ?? process.env.ADMIN_EMAIL ?? "petrica@redi-ngo.eu";
  if (!password) {
    console.error("Provide a password:  npm run create-admin -- '<password>' [email]");
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Try to create; if the user already exists, update the password instead.
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    const exists = /already.*registered|already been registered|exists/i.test(error.message);
    if (!exists) {
      console.error("Failed to create admin user:", error.message);
      process.exit(1);
    }
    // Find the existing user and reset the password.
    const { data: list, error: listErr } = await supabase.auth.admin.listUsers();
    if (listErr) {
      console.error("User exists but lookup failed:", listErr.message);
      process.exit(1);
    }
    const existing = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (!existing) {
      console.error(`User ${email} reported as existing but was not found.`);
      process.exit(1);
    }
    const { error: updErr } = await supabase.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
    });
    if (updErr) {
      console.error("Failed to update password:", updErr.message);
      process.exit(1);
    }
    console.log(`✓ Updated existing admin user: ${email}`);
  } else {
    console.log(`✓ Created admin user: ${email} (id: ${data.user?.id})`);
  }

  console.log("You can now sign in at /admin/login");
}

main();
