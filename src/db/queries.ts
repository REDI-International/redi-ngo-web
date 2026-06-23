import { asc, desc, eq, inArray, sql } from "drizzle-orm";
import { getDb } from "./client";
import {
  opportunities,
  newsPosts,
  galleryImages,
  navItems,
  siteSettings,
  pageSections,
  adminUsers,
  type Opportunity,
  type NewsPost,
  type GalleryImage,
  type NavItem,
  type PageSection,
  type AdminUser,
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

// --- Page sections ---------------------------------------------------------

export async function listPageSections(pageKey?: string): Promise<PageSection[]> {
  const db = getDb();
  if (!db) return [];
  const base = db.select().from(pageSections);
  const rows = pageKey
    ? await base.where(eq(pageSections.pageKey, pageKey)).orderBy(asc(pageSections.sortOrder))
    : await base.orderBy(asc(pageSections.pageKey), asc(pageSections.sortOrder));
  return rows;
}

export async function getPageSectionById(id: string): Promise<PageSection | undefined> {
  const db = getDb();
  if (!db) return undefined;
  const rows = await db.select().from(pageSections).where(eq(pageSections.id, id)).limit(1);
  return rows[0];
}

// --- Admin users -----------------------------------------------------------

export async function listAdminUsers(): Promise<AdminUser[]> {
  const db = getDb();
  if (!db) return [];
  return db.select().from(adminUsers).orderBy(asc(adminUsers.email));
}

export async function getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
  const db = getDb();
  if (!db) return undefined;
  const rows = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email.toLowerCase()))
    .limit(1);
  return rows[0];
}

// --- Dashboard -------------------------------------------------------------

export interface DashboardStats {
  news: number;
  tenders: number;
  jobs: number;
  media: number;
  nav: number;
  sections: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const db = getDb();
  if (!db) return { news: 0, tenders: 0, jobs: 0, media: 0, nav: 0, sections: 0 };

  const [news, opps, media, nav, sections] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(newsPosts),
    db.select({ type: opportunities.type, count: sql<number>`count(*)::int` }).from(opportunities).groupBy(opportunities.type),
    db.select({ count: sql<number>`count(*)::int` }).from(galleryImages),
    db.select({ count: sql<number>`count(*)::int` }).from(navItems),
    db.select({ count: sql<number>`count(*)::int` }).from(pageSections),
  ]);

  const typeCounts = Object.fromEntries(opps.map((r) => [r.type, r.count]));
  return {
    news: news[0]?.count ?? 0,
    tenders: (typeCounts.tender ?? 0) + (typeCounts.grant ?? 0),
    jobs: typeCounts.job ?? 0,
    media: media[0]?.count ?? 0,
    nav: nav[0]?.count ?? 0,
    sections: sections[0]?.count ?? 0,
  };
}

export interface RecentEdit {
  id: string;
  title: string;
  type: "news" | "opportunity" | "media" | "nav" | "section" | "setting";
  updatedAt: Date | null;
  href: string;
}

export async function getRecentEdits(limit = 8): Promise<RecentEdit[]> {
  const db = getDb();
  if (!db) return [];

  const [news, opps, media, nav, sections, settings] = await Promise.all([
    db.select({ id: newsPosts.id, title: newsPosts.title, updatedAt: newsPosts.updatedAt }).from(newsPosts).orderBy(desc(newsPosts.updatedAt)).limit(limit),
    db.select({ id: opportunities.id, title: opportunities.title, updatedAt: opportunities.updatedAt, type: opportunities.type }).from(opportunities).orderBy(desc(opportunities.updatedAt)).limit(limit),
    db.select({ id: galleryImages.id, title: galleryImages.caption, updatedAt: galleryImages.updatedAt }).from(galleryImages).orderBy(desc(galleryImages.updatedAt)).limit(limit),
    db.select({ id: navItems.id, title: navItems.label, updatedAt: navItems.updatedAt }).from(navItems).orderBy(desc(navItems.updatedAt)).limit(limit),
    db.select({ id: pageSections.id, title: pageSections.title, updatedAt: pageSections.updatedAt, sectionKey: pageSections.sectionKey }).from(pageSections).orderBy(desc(pageSections.updatedAt)).limit(limit),
    db.select({ id: siteSettings.id, title: siteSettings.key, updatedAt: siteSettings.updatedAt }).from(siteSettings).orderBy(desc(siteSettings.updatedAt)).limit(limit),
  ]);

  const edits: RecentEdit[] = [
    ...news.map((r) => ({ id: r.id, title: r.title, type: "news" as const, updatedAt: r.updatedAt, href: `/admin/news/${r.id}` })),
    ...opps.map((r) => ({
      id: r.id,
      title: r.title,
      type: "opportunity" as const,
      updatedAt: r.updatedAt,
      href: r.type === "job" ? `/admin/jobs/${r.id}` : `/admin/tenders/${r.id}`,
    })),
    ...media.map((r) => ({ id: r.id, title: r.title ?? "Untitled image", type: "media" as const, updatedAt: r.updatedAt, href: `/admin/media/${r.id}` })),
    ...nav.map((r) => ({ id: r.id, title: r.title, type: "nav" as const, updatedAt: r.updatedAt, href: `/admin/menu/${r.id}` })),
    ...sections.map((r) => ({ id: r.id, title: r.title ?? r.sectionKey, type: "section" as const, updatedAt: r.updatedAt, href: `/admin/pages/${r.id}` })),
    ...settings.map((r) => ({ id: r.id, title: r.title, type: "setting" as const, updatedAt: r.updatedAt, href: "/admin/settings" })),
  ];

  return edits
    .sort((a, b) => (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0))
    .slice(0, limit);
}
