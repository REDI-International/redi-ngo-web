import * as fs from "node:fs";
import * as path from "node:path";
import { socialPosts } from "../src/content/social-posts";

const OUT = path.resolve(__dirname, "../src/content/social-stories.json");

async function fetchOgImage(url: string): Promise<string | undefined> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; REDI-bot/1.0)" },
      redirect: "follow",
    });
    const html = await res.text();
    const match = html.match(/property="og:image"\s+content="([^"]+)"/);
    if (!match) return undefined;
    return match[1].replace(/&amp;/g, "&");
  } catch {
    return undefined;
  }
}

async function main() {
  const stories = [];
  for (const post of socialPosts) {
    const image = await fetchOgImage(post.url);
    stories.push({ ...post, image });
    console.log(`${post.id}: ${image ? "✓" : "✗"} ${post.title}`);
  }
  fs.writeFileSync(OUT, JSON.stringify(stories, null, 2));
  console.log(`Wrote ${stories.length} stories to social-stories.json`);
}

main();
