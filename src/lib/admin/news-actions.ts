"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { newsPosts } from "@/db/schema";
import { getAdminUser } from "@/lib/supabase/server";
import { CONTENT_TAGS, revalidateContentTags } from "@/lib/cache";
import { slugify, str, optionalStr, bool, int, dateOrNull } from "./helpers";

async function requireAuth() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
}

export async function saveNews(formData: FormData) {
  await requireAuth();
  const db = getDb();
  if (!db) throw new Error("Database not configured");

  const id = optionalStr(formData, "id");
  const title = str(formData, "title");
  const slug = optionalStr(formData, "slug") || slugify(title);

  const values = {
    title,
    slug,
    excerpt: optionalStr(formData, "excerpt"),
    body: optionalStr(formData, "body"),
    image: optionalStr(formData, "image"),
    country: optionalStr(formData, "country"),
    language: str(formData, "language") || "en",
    published: bool(formData, "published"),
    sortOrder: int(formData, "sortOrder"),
    publishedAt: dateOrNull(formData, "publishedAt") ?? new Date(),
    updatedAt: new Date(),
  };

  if (id) {
    await db.update(newsPosts).set(values).where(eq(newsPosts.id, id));
  } else {
    await db.insert(newsPosts).values(values);
  }

  revalidatePath("/", "layout");
  revalidateContentTags(CONTENT_TAGS.news);
  redirect("/admin/news?toast=saved");
}

export async function deleteNews(formData: FormData) {
  await requireAuth();
  const db = getDb();
  if (!db) throw new Error("Database not configured");

  await db.delete(newsPosts).where(eq(newsPosts.id, str(formData, "id")));
  revalidatePath("/", "layout");
  revalidateContentTags(CONTENT_TAGS.news);
  redirect("/admin/news?toast=deleted");
}
