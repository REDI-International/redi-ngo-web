"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { opportunities } from "@/db/schema";
import { getAdminUser } from "@/lib/supabase/server";
import { slugify, str, optionalStr, bool, int, dateOrNull } from "./helpers";

async function requireAuth() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
}

export async function saveOpportunity(formData: FormData) {
  await requireAuth();
  const db = getDb();
  if (!db) throw new Error("Database not configured");

  const id = optionalStr(formData, "id");
  const title = str(formData, "title");
  const slug = optionalStr(formData, "slug") || slugify(title);
  const type = str(formData, "type") || "tender";

  const values = {
    type,
    title,
    slug,
    excerpt: optionalStr(formData, "excerpt"),
    body: optionalStr(formData, "body"),
    country: optionalStr(formData, "country"),
    reference: optionalStr(formData, "reference"),
    deadline: dateOrNull(formData, "deadline"),
    image: optionalStr(formData, "image"),
    published: bool(formData, "published"),
    sortOrder: int(formData, "sortOrder"),
    publishedAt: dateOrNull(formData, "publishedAt") ?? new Date(),
    updatedAt: new Date(),
  };

  if (id) {
    await db.update(opportunities).set(values).where(eq(opportunities.id, id));
  } else {
    await db.insert(opportunities).values(values);
  }

  revalidatePath("/", "layout");
  redirect(type === "job" ? "/admin/jobs" : "/admin/tenders");
}

export async function deleteOpportunity(formData: FormData) {
  await requireAuth();
  const db = getDb();
  if (!db) throw new Error("Database not configured");

  const id = str(formData, "id");
  const type = str(formData, "type");
  await db.delete(opportunities).where(eq(opportunities.id, id));

  revalidatePath("/", "layout");
  redirect(type === "job" ? "/admin/jobs" : "/admin/tenders");
}
