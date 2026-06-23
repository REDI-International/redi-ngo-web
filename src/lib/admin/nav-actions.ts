"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { navItems } from "@/db/schema";
import { getAdminUser } from "@/lib/supabase/server";
import { CONTENT_TAGS, revalidateContentTags } from "@/lib/cache";
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
  revalidateContentTags(CONTENT_TAGS.nav);
  redirect("/admin/menu?toast=saved");
}

export async function reorderNavItem(formData: FormData) {
  await requireAuth();
  const db = getDb();
  if (!db) throw new Error("Database not configured");

  const id = str(formData, "id");
  const direction = str(formData, "direction");
  const current = await db.select().from(navItems).where(eq(navItems.id, id)).limit(1);
  const item = current[0];
  if (!item) return;

  const siblings = await db
    .select()
    .from(navItems)
    .where(eq(navItems.location, item.location))
    .orderBy(asc(navItems.sortOrder));

  const idx = siblings.findIndex((s) => s.id === id);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= siblings.length) return;

  const swap = siblings[swapIdx];
  await db.update(navItems).set({ sortOrder: swap.sortOrder, updatedAt: new Date() }).where(eq(navItems.id, item.id));
  await db.update(navItems).set({ sortOrder: item.sortOrder, updatedAt: new Date() }).where(eq(navItems.id, swap.id));

  revalidatePath("/", "layout");
  revalidatePath("/admin/menu");
  revalidateContentTags(CONTENT_TAGS.nav);
}

export async function deleteNavItem(formData: FormData) {
  await requireAuth();
  const db = getDb();
  if (!db) throw new Error("Database not configured");

  await db.delete(navItems).where(eq(navItems.id, str(formData, "id")));
  revalidatePath("/", "layout");
  revalidateContentTags(CONTENT_TAGS.nav);
  redirect("/admin/menu?toast=deleted");
}
