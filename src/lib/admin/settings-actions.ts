"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { siteSettings } from "@/db/schema";
import { getAdminUser } from "@/lib/supabase/server";
import { str } from "./helpers";

async function requireAuth() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
}

export async function saveSetting(formData: FormData) {
  await requireAuth();
  const db = getDb();
  if (!db) throw new Error("Database not configured");

  const key = str(formData, "key");
  if (!key) throw new Error("A key is required");

  const raw = str(formData, "value");
  let value: unknown = raw;
  try {
    value = raw ? JSON.parse(raw) : null;
  } catch {
    value = raw; // store as plain string when not valid JSON
  }

  const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
  if (existing[0]) {
    await db.update(siteSettings).set({ value, updatedAt: new Date() }).where(eq(siteSettings.key, key));
  } else {
    await db.insert(siteSettings).values({ key, value });
  }

  revalidatePath("/", "layout");
  redirect("/admin/settings");
}

export async function deleteSetting(formData: FormData) {
  await requireAuth();
  const db = getDb();
  if (!db) throw new Error("Database not configured");

  await db.delete(siteSettings).where(eq(siteSettings.key, str(formData, "key")));
  revalidatePath("/", "layout");
  redirect("/admin/settings");
}
