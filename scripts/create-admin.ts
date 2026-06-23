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
 * Prefer `npm run create-users` for the full team roster.
 */
import { createClient } from "@supabase/supabase-js";
import { loadLocalEnv } from "./lib/load-env";

async function main() {
  loadLocalEnv();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || (!serviceKey && !anonKey)) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL and a key (SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY).\n" +
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

  // Without a service-role key we can't auto-confirm. Fall back to public sign-up.
  if (!serviceKey) {
    const supabase = createClient(url, anonKey!, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error("Sign-up failed:", error.message);
      process.exit(1);
    }
    const confirmed = Boolean(data.user?.confirmed_at || data.user?.email_confirmed_at);
    console.log(`✓ Sign-up submitted for ${email} (id: ${data.user?.id ?? "?"})`);
    if (confirmed) {
      console.log("Email confirmation is disabled — you can sign in now at /admin/login");
    } else {
      console.log(
        "NOTE: email confirmation appears to be ON. Add SUPABASE_SERVICE_ROLE_KEY or run npm run create-users.",
      );
    }
    return;
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

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
