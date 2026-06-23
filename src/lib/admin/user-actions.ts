"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { adminUsers } from "@/db/schema";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireUserManagers } from "@/lib/admin/auth";
import { isAdminRole, type AdminRole } from "@/lib/admin/roles";
import { str, optionalStr } from "./helpers";

const DEFAULT_PASSWORD = "Welcome2REDI*";

async function requireManagers() {
  return requireUserManagers();
}

export async function createAdminUser(formData: FormData) {
  const session = await requireManagers();
  const email = str(formData, "email").toLowerCase();
  const roleRaw = str(formData, "role");

  if (!email || !email.includes("@")) throw new Error("Valid email is required");
  if (!isAdminRole(roleRaw)) throw new Error("Invalid role");

  const role = roleRaw as AdminRole;
  if (role === "superadmin" && session.role !== "superadmin") {
    throw new Error("Only superadmins can create superadmin accounts.");
  }

  const db = getDb();
  if (!db) throw new Error("Database not configured");

  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required to create users.");

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: DEFAULT_PASSWORD,
    email_confirm: true,
  });

  let supabaseUserId = data.user?.id;

  if (error) {
    const exists = /already.*registered|already been registered|exists/i.test(error.message);
    if (!exists) throw new Error(error.message);

    const { data: list, error: listErr } = await supabase.auth.admin.listUsers();
    if (listErr) throw new Error(listErr.message);
    const existing = list.users.find((u) => u.email?.toLowerCase() === email);
    if (!existing) throw new Error(`User ${email} exists but could not be found.`);

    supabaseUserId = existing.id;
    await supabase.auth.admin.updateUserById(existing.id, {
      password: DEFAULT_PASSWORD,
      email_confirm: true,
    });
  }

  const existingRow = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
  if (existingRow[0]) {
    await db
      .update(adminUsers)
      .set({
        role,
        supabaseUserId: supabaseUserId ?? existingRow[0].supabaseUserId,
        mustChangePassword: true,
        updatedAt: new Date(),
      })
      .where(eq(adminUsers.id, existingRow[0].id));
  } else {
    await db.insert(adminUsers).values({
      email,
      role,
      supabaseUserId,
      mustChangePassword: true,
    });
  }

  revalidatePath("/admin/users");
  redirect("/admin/users?toast=saved");
}

export async function updateAdminUserRole(formData: FormData) {
  const session = await requireManagers();
  const id = str(formData, "id");
  const roleRaw = str(formData, "role");
  if (!id || !isAdminRole(roleRaw)) throw new Error("Invalid request");

  const role = roleRaw as AdminRole;
  const db = getDb();
  if (!db) throw new Error("Database not configured");

  const rows = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
  const target = rows[0];
  if (!target) throw new Error("User not found");

  if (target.id === session.profile.id) throw new Error("You cannot change your own role.");

  if (target.role === "superadmin" && session.role !== "superadmin") {
    throw new Error("Only superadmins can change superadmin roles.");
  }
  if (role === "superadmin" && session.role !== "superadmin") {
    throw new Error("Only superadmins can assign the superadmin role.");
  }

  await db.update(adminUsers).set({ role, updatedAt: new Date() }).where(eq(adminUsers.id, id));
  revalidatePath("/admin/users");
  redirect("/admin/users?toast=saved");
}

export async function removeAdminUser(formData: FormData) {
  const session = await requireManagers();
  const id = str(formData, "id");
  if (!id) throw new Error("Invalid request");

  const db = getDb();
  if (!db) throw new Error("Database not configured");

  const rows = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
  const target = rows[0];
  if (!target) throw new Error("User not found");

  if (target.id === session.profile.id) throw new Error("You cannot remove your own account.");

  if (target.role === "superadmin" && session.role !== "superadmin") {
    throw new Error("Only superadmins can remove superadmin accounts.");
  }

  const supabase = getSupabaseAdmin();
  if (supabase && target.supabaseUserId) {
    await supabase.auth.admin.deleteUser(target.supabaseUserId);
  }

  await db.delete(adminUsers).where(eq(adminUsers.id, id));
  revalidatePath("/admin/users");
  redirect("/admin/users?toast=deleted");
}
