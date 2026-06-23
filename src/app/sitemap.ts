import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";
import { projects } from "@/content/projects";
import { impactInitiatives } from "@/content/impact";
import { getNewsArticles, getTenders } from "@/lib/content";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://redi-ngo.eu";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = ["", "/about", "/impact", "/projects", "/news", "/work-with-us", "/work-with-us/tenders", "/contact"];
  const locales = ["", "/ro"];

  const entries: MetadataRoute.Sitemap = [];
  const [newsArticles, tenders] = await Promise.all([getNewsArticles(), getTenders()]);

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}${locale}${page}`,
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1 : 0.8,
      });
    }

    for (const initiative of impactInitiatives) {
      entries.push({ url: `${baseUrl}${locale}/impact/${initiative.slug}`, changeFrequency: "monthly", priority: 0.7 });
    }

    for (const project of projects) {
      entries.push({ url: `${baseUrl}${locale}/projects#${project.slug}`, changeFrequency: "monthly", priority: 0.7 });
    }

    for (const article of newsArticles) {
      entries.push({ url: `${baseUrl}${locale}/news/${article.slug}`, changeFrequency: "monthly", priority: 0.6 });
    }

    for (const tender of tenders) {
      entries.push({ url: `${baseUrl}${locale}/work-with-us/tenders/${tender.slug}`, changeFrequency: "weekly", priority: 0.5 });
    }
  }

  return entries;
}
