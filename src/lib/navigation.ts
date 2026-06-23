import { unstable_cache } from "next/cache";
import { asc, eq, and } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { getDb } from "@/db/client";
import { navItems as navItemsTable } from "@/db/schema";
import { navItems as staticNavItems } from "@/content/site";
import { CONTENT_TAGS, CONTENT_REVALIDATE_SECONDS } from "@/lib/cache";

export interface ResolvedNavItem {
  href: string;
  label: string;
}

const dbNav = unstable_cache(
  async (location: "header" | "footer"): Promise<ResolvedNavItem[] | null> => {
    const db = getDb();
    if (!db) return null;
    try {
      const rows = await db
        .select()
        .from(navItemsTable)
        .where(and(eq(navItemsTable.location, location), eq(navItemsTable.published, true)))
        .orderBy(asc(navItemsTable.sortOrder));
      if (rows.length === 0) return null;
      return rows.map((r) => ({ href: r.href, label: r.label }));
    } catch {
      return null;
    }
  },
  ["nav-items"],
  { tags: [CONTENT_TAGS.nav], revalidate: CONTENT_REVALIDATE_SECONDS },
);

/**
 * Returns navigation links for a location, DB-first.
 * Falls back to the static, translated nav from content/site.ts.
 */
export async function getNavItems(location: "header" | "footer" = "header"): Promise<ResolvedNavItem[]> {
  const fromDb = await dbNav(location);
  if (fromDb) return fromDb;
  const t = await getTranslations();
  return staticNavItems.map((item) => ({ href: item.href, label: t(item.labelKey) }));
}
