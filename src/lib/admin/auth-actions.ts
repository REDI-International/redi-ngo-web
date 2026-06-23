"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { adminUsers } from "@/db/schema";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/admin/auth";

export interface AuthState {
  error?: string;
}

export async function signIn(_prev: AuthState | undefined, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = await getSupabaseServer();
  if (!supabase) return { error: "Supabase is not configured yet." };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  const session = await getAdminSession();
  if (!session) {
    await supabase.auth.signOut();
    return { error: "Your account is not authorized for the admin panel." };
  }

  if (session.profile.mustChangePassword) {
    redirect("/admin/change-password");
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await getSupabaseServer();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function changePassword(_prev: AuthState | undefined, formData: FormData): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!password || password.length < 10) {
    return { error: "Password must be at least 10 characters." };
  }
  if (password !== confirm) {
    return { error: "Passwords do not match." };
  }

  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const supabase = await getSupabaseServer();
  if (!supabase) return { error: "Supabase is not configured." };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  const db = getDb();
  if (db) {
    await db
      .update(adminUsers)
      .set({ mustChangePassword: false, updatedAt: new Date() })
      .where(eq(adminUsers.id, session.profile.id));
  }

  redirect("/admin");
}
