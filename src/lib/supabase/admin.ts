import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const MEDIA_BUCKET = "media";

let instance: SupabaseClient | null | undefined;

/**
 * Service-role Supabase client for privileged server-side operations
 * (Storage uploads/deletes). Never import this into client code.
 * Returns `null` when the service role key is not configured.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (instance !== undefined) return instance;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    instance = null;
    return null;
  }
  instance = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return instance;
}
