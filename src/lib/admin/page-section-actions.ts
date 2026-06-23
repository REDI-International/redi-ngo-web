"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { pageSections } from "@/db/schema";
import { getAdminUser } from "@/lib/supabase/server";
import { str, optionalStr, bool, int } from "./helpers";

async function requireAuth() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
}

function parseContent(raw: string): unknown {
  if (!raw.trim()) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return { text: raw };
  }
}

export async function savePageSection(formData: FormData) {
  await requireAuth();
  const db = getDb();
  if (!db) throw new Error("Database not configured");

  const id = optionalStr(formData, "id");
  const values = {
    pageKey: str(formData, "pageKey") || "homepage",
    sectionKey: str(formData, "sectionKey"),
    title: optionalStr(formData, "title"),
    content: parseContent(str(formData, "content")),
    published: bool(formData, "published"),
    sortOrder: int(formData, "sortOrder"),
    updatedAt: new Date(),
  };

  if (!values.sectionKey) throw new Error("Section key is required");

  if (id) {
    await db.update(pageSections).set(values).where(eq(pageSections.id, id));
  } else {
    await db.insert(pageSections).values(values);
  }

  revalidatePath("/", "layout");
  redirect("/admin/pages?toast=saved");
}

export async function deletePageSection(formData: FormData) {
  await requireAuth();
  const db = getDb();
  if (!db) throw new Error("Database not configured");

  await db.delete(pageSections).where(eq(pageSections.id, str(formData, "id")));
  revalidatePath("/", "layout");
  redirect("/admin/pages?toast=deleted");
}
