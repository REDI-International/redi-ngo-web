import { desc, asc, eq } from "drizzle-orm";
import teamData from "@/content/extracted/team.json";
import newsData from "@/content/extracted/news.json";
import tendersData from "@/content/extracted/tenders.json";
import { heroImages, img, galleryPhotos as staticGallery, type GalleryPhoto } from "@/content/media";
import type { Opportunity } from "@/components/OpportunityCard";
import { classifyOpportunity } from "@/lib/opportunities";
import { parseDeadline, parseReference, formatDate } from "@/lib/deadlines";
import { getDb } from "@/db/client";
import { opportunities, newsPosts, galleryImages } from "@/db/schema";

const IMAGE_BASE = "https://redi-ngo.eu";

export function mediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export type OppType = "tender" | "job" | "grant";

export interface NewsArticle {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  image?: string;
  publishedAt?: string;
}

export interface RawOpportunity {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  publishedAt?: string;
  country?: string;
  deadline?: string;
}

export interface EnrichedOpportunity extends RawOpportunity {
  type: OppType;
  parsedStatus: "open" | "closed" | "ongoing";
  deadlineLabel: string;
  deadlineDate?: string;
  reference?: string;
  image?: string;
}

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  group: "team" | "board";
  image?: string;
}

const TEAM_ROLES: Record<string, { role: string; group: "team" | "board" }> = {
  "petrica-dulgheru": { role: "Executive Director", group: "team" },
  "marius-cristea": { role: "Program Director", group: "team" },
  "bogdan-merfea": { role: "Country Manager, Romania", group: "team" },
  "lejla-zekirovska": { role: "Country Manager, North Macedonia", group: "team" },
  "zarko-savic": { role: "Country Manager, Serbia", group: "team" },
  "jelena-kasumovic": { role: "Communications Officer", group: "team" },
  "ljubica-toseva": { role: "Program Assistant", group: "team" },
  "asib-zekir": { role: "Business Facilitator", group: "team" },
  "board-kinga": { role: "Board Chair", group: "board" },
  "board-lucian": { role: "Board Member", group: "board" },
  "board-ileana": { role: "Board Member", group: "board" },
};

function parseCountry(text: string): string | undefined {
  const countries = [
    "North Macedonia", "Serbia", "Romania", "Turkey", "Türkiye", "Albania",
    "Montenegro", "Kosovo", "Bosnia and Herzegovina", "Bulgaria", "BiH",
  ];
  for (const c of countries) {
    if (text.includes(c)) return c;
  }
  const op = text.match(/Operating Countries:\s*([^\n]+)/i);
  const val = op?.[1]?.trim();
  if (val && val.length > 1 && val.length < 60) return val;
  return undefined;
}

function classifyItem(slug: string, title: string) {
  return classifyOpportunity(slug, title);
}

// ---------------------------------------------------------------------------
// JSON fallback enrichment
// ---------------------------------------------------------------------------

function enrichFromJson(raw: RawOpportunity): EnrichedOpportunity {
  const text = `${raw.excerpt} ${raw.body}`;
  const parsed = parseDeadline(text, raw.publishedAt);
  const cls = classifyItem(raw.slug, raw.title);
  const type: OppType = cls === "job" ? "job" : cls === "grant" ? "grant" : "tender";
  return {
    ...raw,
    type,
    country: raw.country ?? parseCountry(text),
    parsedStatus: parsed.status,
    deadlineLabel: parsed.label,
    deadlineDate: parsed.date?.toISOString().slice(0, 10),
    reference: parseReference(text),
  };
}

function jsonOpportunities(): EnrichedOpportunity[] {
  const all = [...(tendersData as RawOpportunity[]), ...(newsData as RawOpportunity[])];
  const seen = new Set<string>();
  return all
    .filter((t) => {
      if (seen.has(t.slug)) return false;
      seen.add(t.slug);
      return classifyItem(t.slug, t.title) !== null;
    })
    .map(enrichFromJson);
}

// ---------------------------------------------------------------------------
// DB mapping
// ---------------------------------------------------------------------------

function deriveDeadline(deadline: Date | null, text: string, publishedAt?: string) {
  if (deadline) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(deadline);
    const isOpen = d >= today;
    return {
      status: (isOpen ? "open" : "closed") as "open" | "closed",
      label: `${isOpen ? "Closes" : "Closed"} ${formatDate(d)}`,
      date: d.toISOString().slice(0, 10),
    };
  }
  const parsed = parseDeadline(text, publishedAt);
  return { status: parsed.status, label: parsed.label, date: parsed.date?.toISOString().slice(0, 10) };
}

function mapDbOpportunity(row: typeof opportunities.$inferSelect): EnrichedOpportunity {
  const text = `${row.excerpt ?? ""} ${row.body ?? ""}`;
  const dl = deriveDeadline(row.deadline, text, row.publishedAt?.toISOString());
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    body: row.body ?? "",
    publishedAt: row.publishedAt?.toISOString(),
    country: row.country ?? parseCountry(text),
    type: (row.type as OppType) ?? "tender",
    parsedStatus: dl.status,
    deadlineLabel: dl.label,
    deadlineDate: dl.date,
    reference: row.reference ?? parseReference(text) ?? undefined,
    image: row.image ?? undefined,
  };
}

let _oppCache: EnrichedOpportunity[] | undefined;

async function allOpportunities(): Promise<EnrichedOpportunity[]> {
  const db = getDb();
  if (db) {
    try {
      const rows = await db
        .select()
        .from(opportunities)
        .where(eq(opportunities.published, true))
        .orderBy(asc(opportunities.sortOrder), desc(opportunities.publishedAt));
      if (rows.length > 0) return rows.map(mapDbOpportunity);
    } catch {
      // fall through to JSON
    }
  }
  if (!_oppCache) _oppCache = jsonOpportunities();
  return _oppCache;
}

// ---------------------------------------------------------------------------
// Public readers — DB-first, JSON fallback
// ---------------------------------------------------------------------------

export async function getTenders(): Promise<EnrichedOpportunity[]> {
  return (await allOpportunities()).filter((t) => t.type === "tender" || t.type === "grant");
}

export async function getJobs(): Promise<EnrichedOpportunity[]> {
  return (await allOpportunities()).filter((t) => t.type === "job");
}

export async function getTender(slug: string) {
  return (await getTenders()).find((t) => t.slug === slug);
}

export async function getJob(slug: string) {
  return (await getJobs()).find((t) => t.slug === slug);
}

export async function getNewsArticles(limit?: number): Promise<NewsArticle[]> {
  const db = getDb();
  if (db) {
    try {
      const rows = await db
        .select()
        .from(newsPosts)
        .where(eq(newsPosts.published, true))
        .orderBy(asc(newsPosts.sortOrder), desc(newsPosts.publishedAt));
      if (rows.length > 0) {
        const mapped = rows.map((r) => ({
          slug: r.slug,
          title: r.title,
          excerpt: r.excerpt ?? "",
          body: r.body ?? "",
          image: mediaUrl(r.image),
          publishedAt: r.publishedAt?.toISOString().slice(0, 10),
        }));
        return limit ? mapped.slice(0, limit) : mapped;
      }
    } catch {
      // fall through
    }
  }
  const articles = (newsData as NewsArticle[])
    .filter((a) => !classifyItem(a.slug, a.title) && a.title.length < 120)
    .map((a) => ({ ...a, image: mediaUrl(a.image) }));
  return limit ? articles.slice(0, limit) : articles;
}

export async function getNewsArticle(slug: string): Promise<NewsArticle | undefined> {
  return (await getNewsArticles()).find((a) => a.slug === slug);
}

export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  const db = getDb();
  if (db) {
    try {
      const rows = await db
        .select()
        .from(galleryImages)
        .where(eq(galleryImages.published, true))
        .orderBy(asc(galleryImages.sortOrder));
      if (rows.length > 0) {
        return rows.map((r) => ({
          src: mediaUrl(r.url)!,
          alt: r.alt ?? "",
          caption: r.caption ?? undefined,
          category: (r.category as GalleryPhoto["category"]) ?? "community",
        }));
      }
    } catch {
      // fall through
    }
  }
  return staticGallery;
}

export function getTeam(): TeamMember[] {
  return (teamData as Array<{ slug: string; name: string; image?: string }>).map((m) => ({
    ...m,
    role: TEAM_ROLES[m.slug]?.role ?? "Team Member",
    group: TEAM_ROLES[m.slug]?.group ?? "team",
    image: mediaUrl(m.image),
  }));
}

// ---------------------------------------------------------------------------
// Mappers / derived
// ---------------------------------------------------------------------------

export function toOpportunity(item: EnrichedOpportunity, type: OppType): Opportunity {
  const basePath = type === "job" ? "/work-with-us/jobs" : "/work-with-us/tenders";
  return {
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    type,
    status: item.parsedStatus,
    country: item.country,
    deadline: item.deadlineDate ? formatDate(new Date(item.deadlineDate)) : undefined,
    deadlineDate: item.deadlineDate,
    deadlineLabel: item.deadlineLabel,
    reference: item.reference,
    image: item.image ?? (type === "job" ? heroImages.jobs : heroImages.tenders),
    href: `${basePath}/${item.slug}`,
  };
}

export async function getFeaturedOpportunities(limit = 6): Promise<Opportunity[]> {
  const openTenders = (await getTenders())
    .filter((t) => t.parsedStatus === "open")
    .slice(0, 4)
    .map((t) => toOpportunity(t, t.type === "grant" ? "grant" : "tender"));
  const openJobs = (await getJobs())
    .filter((t) => t.parsedStatus === "open")
    .slice(0, 4)
    .map((j) => toOpportunity(j, "job"));
  return [...openTenders, ...openJobs].slice(0, limit);
}

export { img, heroImages };
