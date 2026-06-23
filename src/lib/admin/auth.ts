import { cache } from "react";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { adminUsers, type AdminUser } from "@/db/schema";
import { getAdminUser } from "@/lib/supabase/server";
import { type AdminRole, canManageUsers } from "@/lib/admin/roles";

export interface AdminSession {
  userId: string;
  email: string;
  profile: AdminUser;
  role: AdminRole;
}

export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  const user = await getAdminUser();
  if (!user?.email) return null;

  const db = getDb();
  if (!db) {
    // If DB is not connected, allow login with a fallback session so they can see the setup instructions.
    return {
      userId: user.id,
      email: user.email,
      profile: {
        id: user.id,
        email: user.email,
        role: "superadmin",
        supabaseUserId: user.id,
        mustChangePassword: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      role: "superadmin",
    };
  }

  try {
    const rows = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, user.email.toLowerCase()))
      .limit(1);

    const profile = rows[0];
    if (!profile) return null;

    return {
      userId: user.id,
      email: user.email,
      profile,
      role: profile.role as AdminRole,
    };
  } catch {
    return null;
  }
});

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function requireUserManagers(): Promise<AdminSession> {
  const session = await requireAdminSession();
  if (!canManageUsers(session.role)) redirect("/admin");
  return session;
}

export function mustChangePassword(profile: AdminUser): boolean {
  return profile.mustChangePassword;
}
