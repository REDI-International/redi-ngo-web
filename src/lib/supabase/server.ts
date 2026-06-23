import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cleanEnvValue } from "@/lib/env";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "") &&
      cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""),
  );
}

/**
 * Cookie-bound Supabase client for Server Components / Server Actions.
 * Returns `null` when Supabase env vars are not configured.
 */
export async function getSupabaseServer() {
  const url = cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
  const key = cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "");
  if (!url || !key) return null;

  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component without a mutable cookie store — safe to ignore.
        }
      },
    },
  });
}

/** Returns the signed-in admin user, or null. */
export async function getAdminUser() {
  const supabase = await getSupabaseServer();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
