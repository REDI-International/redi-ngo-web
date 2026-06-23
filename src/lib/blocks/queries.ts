import { unstable_cache } from "next/cache";
import { and, asc, eq, or } from "drizzle-orm";
import { getDb } from "@/db/client";
import { pageSections } from "@/db/schema";
import { CONTENT_TAGS, CONTENT_REVALIDATE_SECONDS } from "@/lib/cache";
import { denormalizePageSlug, sectionToBlock, type PageBlock } from "./types";

const cachedPageBlocks = unstable_cache(
  fetchPageBlocks,
  ["page-blocks"],
  { tags: [CONTENT_TAGS.blocks], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export async function listPageBlocks(pageSlug: string, locale: string): Promise<PageBlock[]> {
  return cachedPageBlocks(pageSlug, locale);
}

async function fetchPageBlocks(pageSlug: string, locale: string): Promise<PageBlock[]> {
  const db = getDb();
  if (!db) return [];

  try {
    const pageKey = denormalizePageSlug(pageSlug);
    const rows = await db
      .select()
      .from(pageSections)
      .where(
        and(
          eq(pageSections.pageKey, pageKey),
          or(eq(pageSections.language, locale), eq(pageSections.language, "en")),
        ),
      )
      .orderBy(asc(pageSections.sortOrder));

    const localeRows = rows.filter((r) => r.language === locale);
    const source = localeRows.length ? localeRows : rows.filter((r) => r.language === "en");
    return source.map(sectionToBlock);
  } catch {
    return [];
  }
}
