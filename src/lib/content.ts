import teamData from "@/content/extracted/team.json";
import newsData from "@/content/extracted/news.json";
import tendersData from "@/content/extracted/tenders.json";
import { heroImages, img } from "@/content/media";
import type { Opportunity } from "@/components/OpportunityCard";
import { classifyOpportunity } from "@/lib/opportunities";
import { parseDeadline, parseReference, formatDate } from "@/lib/deadlines";

const IMAGE_BASE = "https://redi-ngo.eu";

export function mediaUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

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

function enrichOpportunity(raw: RawOpportunity): RawOpportunity & {
  parsedStatus: "open" | "closed" | "ongoing";
  deadlineLabel: string;
  deadlineDate?: string;
  reference?: string;
} {
  const text = `${raw.excerpt} ${raw.body}`;
  const parsed = parseDeadline(text, raw.publishedAt);
  return {
    ...raw,
    country: raw.country ?? parseCountry(text),
    parsedStatus: parsed.status,
    deadlineLabel: parsed.label,
    deadlineDate: parsed.date?.toISOString().slice(0, 10),
    reference: parseReference(text),
  };
}

function rawOpportunities(): ReturnType<typeof enrichOpportunity>[] {
  const all = [...(tendersData as RawOpportunity[]), ...(newsData as RawOpportunity[])];
  const seen = new Set<string>();
  return all
    .filter((t) => {
      if (seen.has(t.slug)) return false;
      seen.add(t.slug);
      return classifyItem(t.slug, t.title) !== null;
    })
    .map(enrichOpportunity);
}

export function getTeam(): TeamMember[] {
  return (teamData as Array<{ slug: string; name: string; image?: string }>).map(
    (m) => ({
      ...m,
      role: TEAM_ROLES[m.slug]?.role ?? "Team Member",
      group: TEAM_ROLES[m.slug]?.group ?? "team",
      image: mediaUrl(m.image),
    }),
  );
}

export function getNewsArticles(limit?: number): NewsArticle[] {
  const articles = (newsData as NewsArticle[])
    .filter((a) => !classifyItem(a.slug, a.title) && a.title.length < 120)
    .map((a) => ({ ...a, image: mediaUrl(a.image) }));
  return limit ? articles.slice(0, limit) : articles;
}

export function getNewsArticle(slug: string): NewsArticle | undefined {
  return getNewsArticles().find((a) => a.slug === slug);
}

export function getTenders(): ReturnType<typeof enrichOpportunity>[] {
  return rawOpportunities().filter(
    (t) => classifyItem(t.slug, t.title) === "tender" || classifyItem(t.slug, t.title) === "grant",
  );
}

export function getJobs(): ReturnType<typeof enrichOpportunity>[] {
  return rawOpportunities().filter((t) => classifyItem(t.slug, t.title) === "job");
}

export function getTender(slug: string) {
  return getTenders().find((t) => t.slug === slug);
}

export function getJob(slug: string) {
  return getJobs().find((t) => t.slug === slug);
}

export function toOpportunity(
  item: ReturnType<typeof enrichOpportunity>,
  type: "tender" | "job" | "grant",
): Opportunity {
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
    image: type === "job" ? heroImages.jobs : heroImages.tenders,
    href: `${basePath}/${item.slug}`,
  };
}

export function getFeaturedOpportunities(limit = 6): Opportunity[] {
  const openTenders = getTenders()
    .filter((t) => t.parsedStatus === "open")
    .slice(0, 4)
    .map((t) => toOpportunity(t, classifyItem(t.slug, t.title) === "grant" ? "grant" : "tender"));
  const openJobs = getJobs()
    .filter((t) => t.parsedStatus === "open")
    .slice(0, 4)
    .map((j) => toOpportunity(j, "job"));
  return [...openTenders, ...openJobs].slice(0, limit);
}

export { img, heroImages };
