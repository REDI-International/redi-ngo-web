"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { pageSections } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin/auth";
import { CONTENT_TAGS, revalidateContentTags } from "@/lib/cache";
import { str, optionalStr, bool, int } from "./helpers";

export type SectionWidth = "full" | "half" | "third";

export interface SectionContent {
  body?: string;
  image?: string;
  width?: SectionWidth;
  text?: string;
  headline?: string;
}

function parseContent(raw: string, width: SectionWidth, image: string | null, body: string | null): SectionContent {
  let base: SectionContent = {};
  if (raw.trim()) {
    try {
      base = JSON.parse(raw) as SectionContent;
    } catch {
      base = { text: raw };
    }
  }
  if (body) base.body = body;
  if (image) base.image = image;
  base.width = width;
  return base;
}

export async function savePageSection(formData: FormData) {
  await requireAdminSession();
  const db = getDb();
  if (!db) throw new Error("Database not configured");

  const id = optionalStr(formData, "id");
  const width = (str(formData, "width") || "full") as SectionWidth;
  const values = {
    pageKey: str(formData, "pageKey") || "homepage",
    sectionKey: str(formData, "sectionKey"),
    title: optionalStr(formData, "title"),
    content: parseContent(
      str(formData, "content"),
      width,
      optionalStr(formData, "image"),
      optionalStr(formData, "body"),
    ),
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
  revalidateContentTags(CONTENT_TAGS.blocks);
  revalidatePath("/admin/pages");
  revalidatePath("/admin/pages/home");
  redirect("/admin/pages?toast=saved");
}

export async function saveHomeSection(formData: FormData) {
  await requireAdminSession();
  const db = getDb();
  if (!db) throw new Error("Database not configured");

  const id = str(formData, "id");
  if (!id) throw new Error("Section id required");

  const width = (str(formData, "width") || "full") as SectionWidth;
  const existing = await db.select().from(pageSections).where(eq(pageSections.id, id)).limit(1);
  const prev = (existing[0]?.content as SectionContent | null) ?? {};

  await db
    .update(pageSections)
    .set({
      title: optionalStr(formData, "title"),
      content: {
        ...prev,
        body: optionalStr(formData, "body"),
        image: optionalStr(formData, "image") ?? prev.image,
        width,
      },
      published: bool(formData, "published"),
      updatedAt: new Date(),
    })
    .where(eq(pageSections.id, id));

  revalidatePath("/", "layout");
  revalidateContentTags(CONTENT_TAGS.blocks);
  revalidatePath("/admin/pages/home");
}

export async function reorderHomeSections(formData: FormData) {
  await requireAdminSession();
  const db = getDb();
  if (!db) throw new Error("Database not configured");

  const orderRaw = str(formData, "order");
  const ids = orderRaw.split(",").map((s) => s.trim()).filter(Boolean);
  if (!ids.length) return;

  await Promise.all(
    ids.map((id, index) =>
      db.update(pageSections).set({ sortOrder: index, updatedAt: new Date() }).where(eq(pageSections.id, id)),
    ),
  );

  revalidatePath("/", "layout");
  revalidateContentTags(CONTENT_TAGS.blocks);
  revalidatePath("/admin/pages/home");
}

export async function deletePageSection(formData: FormData) {
  await requireAdminSession();
  const db = getDb();
  if (!db) throw new Error("Database not configured");

  await db.delete(pageSections).where(eq(pageSections.id, str(formData, "id")));
  revalidatePath("/", "layout");
  revalidateContentTags(CONTENT_TAGS.blocks);
  redirect("/admin/pages?toast=deleted");
}

export async function createHomeSection(formData: FormData) {
  await requireAdminSession();
  const db = getDb();
  if (!db) throw new Error("Database not configured");

  const sectionKey = str(formData, "sectionKey") || `block-${Date.now()}`;
  const sections = await db.select().from(pageSections).where(eq(pageSections.pageKey, "homepage"));
  const maxOrder = sections.reduce((m, s) => Math.max(m, s.sortOrder), -1);

  await db.insert(pageSections).values({
    pageKey: "homepage",
    sectionKey,
    title: optionalStr(formData, "title") ?? "New block",
    content: { body: "", image: "", width: "full" as SectionWidth },
    published: true,
    sortOrder: maxOrder + 1,
  });

  revalidatePath("/", "layout");
  revalidateContentTags(CONTENT_TAGS.blocks);
  revalidatePath("/admin/pages/home");
  redirect("/admin/pages/home?toast=saved");
}
