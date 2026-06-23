import { and, asc, eq, or } from "drizzle-orm";
import { getDb } from "@/db/client";
import { pageSections } from "@/db/schema";
import { denormalizePageSlug, sectionToBlock, type PageBlock } from "./types";

export async function listPageBlocks(pageSlug: string, locale: string): Promise<PageBlock[]> {
  const db = getDb();
  if (!db) return [];

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
}
