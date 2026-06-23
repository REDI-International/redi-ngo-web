import { asc, eq, and } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { getDb } from "@/db/client";
import { navItems as navItemsTable } from "@/db/schema";
import { navItems as staticNavItems } from "@/content/site";

export interface ResolvedNavItem {
  href: string;
  label: string;
}

async function dbNav(location: "header" | "footer"): Promise<ResolvedNavItem[] | null> {
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
}

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
