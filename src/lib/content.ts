import teamData from "@/content/extracted/team.json";
import newsData from "@/content/extracted/news.json";
import tendersData from "@/content/extracted/tenders.json";
import { heroImages, img } from "@/content/media";
import type { Opportunity } from "@/components/OpportunityCard";

const IMAGE_BASE = "https://redi-ngo.eu";

export function mediaUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

import { classifyOpportunity } from "@/lib/opportunities";

export interface NewsArticle {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  image?: string;
  publishedAt?: string;
}

export interface Tender {
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

function parseDeadline(text: string): string | undefined {
  const match = text.match(/Deadline[:\s]+([0-9]{1,2}[./][0-9]{1,2}[./][0-9]{2,4}[^,\s]*)/i);
  return match?.[1];
}

function parseCountry(text: string): string | undefined {
  const countries = [
    "North Macedonia", "Serbia", "Romania", "Turkey", "Türkiye", "Albania",
    "Montenegro", "Kosovo", "Bosnia and Herzegovina", "Bulgaria", "BiH",
  ];
  for (const c of countries) {
    if (text.includes(c)) return c;
  }
  const op = text.match(/Operating Countries:\s*([^\n]+)/i);
  return op?.[1]?.trim();
}

function classifyItem(slug: string, title: string): "job" | "tender" | "grant" | null {
  return classifyOpportunity(slug, title);
}

function rawOpportunities(): Tender[] {
  const all = [...(tendersData as Tender[]), ...(newsData as Tender[])];
  const seen = new Set<string>();
  return all.filter((t) => {
    if (seen.has(t.slug)) return false;
    seen.add(t.slug);
    return classifyItem(t.slug, t.title) !== null;
  }).map((t) => ({
    ...t,
    country: parseCountry(t.excerpt + t.body),
    deadline: parseDeadline(t.excerpt + t.body) ?? t.publishedAt,
  }));
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

export function getTenders(limit?: number): Tender[] {
  const items = rawOpportunities().filter(
    (t) => classifyItem(t.slug, t.title) === "tender" || classifyItem(t.slug, t.title) === "grant",
  );
  return limit ? items.slice(0, limit) : items;
}

export function getJobs(limit?: number): Tender[] {
  const items = rawOpportunities().filter(
    (t) => classifyItem(t.slug, t.title) === "job",
  );
  return limit ? items.slice(0, limit) : items;
}

export function getTender(slug: string): Tender | undefined {
  return getTenders().find((t) => t.slug === slug);
}

export function getJob(slug: string): Tender | undefined {
  return getJobs().find((t) => t.slug === slug);
}

export function toOpportunity(item: Tender, type: "tender" | "job" | "grant"): Opportunity {
  const basePath = type === "job" ? "/work-with-us/jobs" : "/work-with-us/tenders";
  return {
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    type,
    country: item.country,
    deadline: item.deadline,
    image: type === "job" ? heroImages.jobs : heroImages.tenders,
    href: `${basePath}/${item.slug}`,
  };
}

export function getFeaturedOpportunities(limit = 6): Opportunity[] {
  const tenders = getTenders(4).map((t) =>
    toOpportunity(t, classifyItem(t.slug, t.title) === "grant" ? "grant" : "tender"),
  );
  const jobs = getJobs(4).map((j) => toOpportunity(j, "job"));
  return [...tenders, ...jobs].slice(0, limit);
}

export { img, heroImages };
