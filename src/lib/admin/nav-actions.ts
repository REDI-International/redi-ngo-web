"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { navItems } from "@/db/schema";
import { getAdminUser } from "@/lib/supabase/server";
import { str, optionalStr, bool, int } from "./helpers";

async function requireAuth() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
}

export async function saveNavItem(formData: FormData) {
  await requireAuth();
  const db = getDb();
  if (!db) throw new Error("Database not configured");

  const id = optionalStr(formData, "id");
  const values = {
    label: str(formData, "label"),
    href: str(formData, "href"),
    location: str(formData, "location") || "header",
    published: bool(formData, "published"),
    sortOrder: int(formData, "sortOrder"),
    updatedAt: new Date(),
  };

  if (id) {
    await db.update(navItems).set(values).where(eq(navItems.id, id));
  } else {
    await db.insert(navItems).values(values);
  }

  revalidatePath("/", "layout");
  redirect("/admin/menu");
}

export async function deleteNavItem(formData: FormData) {
  await requireAuth();
  const db = getDb();
  if (!db) throw new Error("Database not configured");

  await db.delete(navItems).where(eq(navItems.id, str(formData, "id")));
  revalidatePath("/", "layout");
  redirect("/admin/menu");
}
