"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { galleryImages } from "@/db/schema";
import { getAdminUser } from "@/lib/supabase/server";
import { getSupabaseAdmin, MEDIA_BUCKET } from "@/lib/supabase/admin";
import { str, optionalStr, bool, int } from "./helpers";

async function requireAuth() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
}

export async function saveGalleryImage(formData: FormData) {
  await requireAuth();
  const db = getDb();
  if (!db) throw new Error("Database not configured");

  const id = optionalStr(formData, "id");
  const url = str(formData, "url");
  if (!url) throw new Error("An image URL is required");

  const values = {
    url,
    alt: optionalStr(formData, "alt"),
    caption: optionalStr(formData, "caption"),
    category: str(formData, "category") || "community",
    published: bool(formData, "published"),
    sortOrder: int(formData, "sortOrder"),
    updatedAt: new Date(),
  };

  if (id) {
    await db.update(galleryImages).set(values).where(eq(galleryImages.id, id));
  } else {
    await db.insert(galleryImages).values(values);
  }

  revalidatePath("/", "layout");
  redirect("/admin/media?toast=saved");
}

export async function deleteGalleryImage(formData: FormData) {
  await requireAuth();
  const db = getDb();
  if (!db) throw new Error("Database not configured");

  const id = str(formData, "id");
  const path = optionalStr(formData, "storagePath");

  await db.delete(galleryImages).where(eq(galleryImages.id, id));

  // Best-effort removal from storage if the image lived in our bucket.
  if (path) {
    const admin = getSupabaseAdmin();
    if (admin) await admin.storage.from(MEDIA_BUCKET).remove([path]).catch(() => {});
  }

  revalidatePath("/", "layout");
  redirect("/admin/media?toast=deleted");
}
