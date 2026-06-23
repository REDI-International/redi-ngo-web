import { asc, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "./client";
import {
  opportunities,
  newsPosts,
  galleryImages,
  navItems,
  siteSettings,
  type Opportunity,
  type NewsPost,
  type GalleryImage,
  type NavItem,
} from "./schema";

// --- Opportunities (tenders / jobs / grants) ------------------------------

export async function listOpportunities(types?: string[]): Promise<Opportunity[]> {
  const db = getDb();
  if (!db) return [];
  const base = db.select().from(opportunities);
  const rows = types
    ? await base.where(inArray(opportunities.type, types)).orderBy(asc(opportunities.sortOrder), desc(opportunities.publishedAt))
    : await base.orderBy(asc(opportunities.sortOrder), desc(opportunities.publishedAt));
  return rows;
}

export async function getOpportunityById(id: string): Promise<Opportunity | undefined> {
  const db = getDb();
  if (!db) return undefined;
  const rows = await db.select().from(opportunities).where(eq(opportunities.id, id)).limit(1);
  return rows[0];
}

// --- News ------------------------------------------------------------------

export async function listNews(): Promise<NewsPost[]> {
  const db = getDb();
  if (!db) return [];
  return db.select().from(newsPosts).orderBy(asc(newsPosts.sortOrder), desc(newsPosts.publishedAt));
}

export async function getNewsById(id: string): Promise<NewsPost | undefined> {
  const db = getDb();
  if (!db) return undefined;
  const rows = await db.select().from(newsPosts).where(eq(newsPosts.id, id)).limit(1);
  return rows[0];
}

// --- Gallery ---------------------------------------------------------------

export async function listGallery(): Promise<GalleryImage[]> {
  const db = getDb();
  if (!db) return [];
  return db.select().from(galleryImages).orderBy(asc(galleryImages.sortOrder));
}

export async function getGalleryById(id: string): Promise<GalleryImage | undefined> {
  const db = getDb();
  if (!db) return undefined;
  const rows = await db.select().from(galleryImages).where(eq(galleryImages.id, id)).limit(1);
  return rows[0];
}

// --- Navigation ------------------------------------------------------------

export async function listNav(): Promise<NavItem[]> {
  const db = getDb();
  if (!db) return [];
  return db.select().from(navItems).orderBy(asc(navItems.location), asc(navItems.sortOrder));
}

export async function getNavById(id: string): Promise<NavItem | undefined> {
  const db = getDb();
  if (!db) return undefined;
  const rows = await db.select().from(navItems).where(eq(navItems.id, id)).limit(1);
  return rows[0];
}

// --- Settings --------------------------------------------------------------

export async function listSettings() {
  const db = getDb();
  if (!db) return [];
  return db.select().from(siteSettings).orderBy(asc(siteSettings.key));
}
