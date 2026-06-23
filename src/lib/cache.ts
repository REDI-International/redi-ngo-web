import { revalidateTag } from "next/cache";

/**
 * Cache tags for public content read via `unstable_cache`.
 *
 * Public pages render the same DB-backed content for every anonymous visitor,
 * so we cache the query results across requests and invalidate them explicitly
 * from the admin mutation actions (see `revalidateContentTags`). This removes
 * per-request DB round-trips against the (cross-region) Postgres pooler while
 * keeping editor changes effectively instant.
 */
export const CONTENT_TAGS = {
  blocks: "content:blocks",
  nav: "content:nav",
  opportunities: "content:opportunities",
  news: "content:news",
  gallery: "content:gallery",
} as const;

export type ContentTag = (typeof CONTENT_TAGS)[keyof typeof CONTENT_TAGS];

/**
 * Default revalidation window (seconds) for cached content. Acts as a safety
 * net so content is never stale for longer than this even if a tag-based
 * invalidation is ever missed. Mutations invalidate immediately via tags.
 */
export const CONTENT_REVALIDATE_SECONDS = 300;

/**
 * Invalidate one or more content caches. Call after a successful mutation.
 *
 * Next.js 16 requires a cache-life profile as the second argument to
 * `revalidateTag`. We pass `{ expire: 0 }` so the tagged entry is purged
 * immediately (next request recomputes), giving editors instant updates on the
 * public site. Works from both Server Actions and Route Handlers.
 */
export function revalidateContentTags(...tags: ContentTag[]): void {
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
}
