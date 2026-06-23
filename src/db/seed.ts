/**
 * Seeds the database from the existing JSON/static content so the admin panel
 * starts populated. Idempotent: existing slugs are skipped.
 *
 * Run after configuring DATABASE_URL:  npm run db:seed
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// --- Minimal .env.local loader (no dotenv dependency) ----------------------
function loadLocalEnv() {
  const file = resolve(process.cwd(), ".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1];
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    // `vercel env pull` can append a literal "\n" to single-line values.
    value = value.replace(/\\n$/, "").replace(/[\r\n]+$/, "").trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadLocalEnv();

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. Add it to .env.local before seeding.");
    process.exit(1);
  }

  const { getDb } = await import("./client");
  const { opportunities, newsPosts, galleryImages } = await import("./schema");
  const { classifyOpportunity } = await import("../lib/opportunities");
  const { parseDeadline, parseReference } = await import("../lib/deadlines");
  const tendersData = (await import("../content/extracted/tenders.json")).default as RawItem[];
  const newsData = (await import("../content/extracted/news.json")).default as RawItem[];
  const { galleryPhotos } = await import("../content/media");

  const db = getDb();
  if (!db) {
    console.error("Could not create database client.");
    process.exit(1);
  }

  const BASE = "https://redi-ngo.eu";
  const abs = (p?: string) => (!p ? null : p.startsWith("http") ? p : `${BASE}${p.startsWith("/") ? p : `/${p}`}`);

  // 1) Opportunities (tenders / jobs / grants) -----------------------------
  const seen = new Set<string>();
  const all = [...tendersData, ...newsData];
  let oppCount = 0;
  for (const item of all) {
    if (seen.has(item.slug)) continue;
    seen.add(item.slug);
    const cls = classifyOpportunity(item.slug, item.title);
    if (!cls) continue;
    const text = `${item.excerpt ?? ""} ${item.body ?? ""}`;
    const dl = parseDeadline(text, item.publishedAt);
    await db
      .insert(opportunities)
      .values({
        slug: item.slug,
        type: cls,
        title: item.title,
        excerpt: item.excerpt ?? null,
        body: item.body ?? null,
        country: item.country ?? null,
        reference: parseReference(text) ?? null,
        deadline: dl.date ?? null,
        image: abs(item.image),
        published: true,
        publishedAt: item.publishedAt ? new Date(item.publishedAt) : new Date(),
      })
      .onConflictDoNothing({ target: opportunities.slug });
    oppCount++;
  }

  // 2) News ----------------------------------------------------------------
  let newsCount = 0;
  for (const item of newsData) {
    if (classifyOpportunity(item.slug, item.title)) continue;
    if (item.title.length >= 120) continue;
    await db
      .insert(newsPosts)
      .values({
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt ?? null,
        body: item.body ?? null,
        image: abs(item.image),
        language: item.language ?? "en",
        published: true,
        publishedAt: item.publishedAt ? new Date(item.publishedAt) : new Date(),
      })
      .onConflictDoNothing({ target: newsPosts.slug });
    newsCount++;
  }

  // 3) Gallery -------------------------------------------------------------
  let galleryCount = 0;
  const existingGallery = await db.select({ id: galleryImages.id }).from(galleryImages).limit(1);
  if (existingGallery.length > 0) {
    console.log("Gallery already has images — skipping gallery seed.");
  } else {
    for (let i = 0; i < galleryPhotos.length; i++) {
      const p = galleryPhotos[i];
      await db.insert(galleryImages).values({
        url: p.src,
        alt: p.alt,
        caption: p.caption ?? null,
        category: p.category,
        published: true,
        sortOrder: i,
      });
      galleryCount++;
    }
  }

  console.log(`Seed complete. Opportunities: ${oppCount}, News: ${newsCount}, Gallery: ${galleryCount}.`);
  process.exit(0);
}

interface RawItem {
  slug: string;
  title: string;
  excerpt?: string;
  body?: string;
  image?: string;
  publishedAt?: string;
  country?: string;
  language?: string;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
