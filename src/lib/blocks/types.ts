import type { PageSection } from "@/db/schema";

export const BLOCK_TYPES = [
  "hero",
  "empowerment",
  "pillars",
  "stats",
  "projects",
  "collage",
  "news",
  "text",
  "image",
  "cta",
  "spacer",
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

export type BlockWidth = "full" | "half" | "third";

export interface BlockContent {
  subtitle?: string;
  body?: string;
  text?: string;
  headline?: string;
  image?: string;
  link?: string;
  linkLabel?: string;
  width?: BlockWidth;
  metadata?: Record<string, unknown>;
}

export interface PageBlock {
  id: string;
  pageSlug: string;
  blockType: BlockType;
  language: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  imageUrl: string | null;
  link: string | null;
  width: BlockWidth;
  published: boolean;
  sortOrder: number;
  metadata: Record<string, unknown>;
}

export const EDITABLE_PAGE_SLUGS = ["home", "about"] as const;
export type EditablePageSlug = (typeof EDITABLE_PAGE_SLUGS)[number];

export function isEditablePageSlug(value: string): value is EditablePageSlug {
  return EDITABLE_PAGE_SLUGS.includes(value as EditablePageSlug);
}

export function pageSlugFromPathname(pathname: string): EditablePageSlug | null {
  const parts = pathname.split("/").filter(Boolean);
  const localeIndex = parts[0] === "en" || parts[0] === "ro" ? 1 : 0;
  const segment = parts[localeIndex];
  if (!segment) return "home";
  if (segment === "about") return "about";
  return null;
}

export function sectionToBlock(section: PageSection): PageBlock {
  const content = (section.content as BlockContent | null) ?? {};
  return {
    id: section.id,
    pageSlug: normalizePageSlug(section.pageKey),
    blockType: normalizeBlockType(section.sectionKey),
    language: section.language ?? "en",
    title: section.title,
    subtitle: content.subtitle ?? null,
    body: content.body ?? content.text ?? null,
    imageUrl: content.image ?? null,
    link: content.link ?? null,
    width: content.width ?? "full",
    published: section.published,
    sortOrder: section.sortOrder,
    metadata: content.metadata ?? {},
  };
}

export function blockToSectionValues(block: PageBlock) {
  return {
    pageKey: denormalizePageSlug(block.pageSlug),
    sectionKey: block.blockType,
    language: block.language,
    title: block.title,
    content: {
      subtitle: block.subtitle ?? undefined,
      body: block.body ?? undefined,
      image: block.imageUrl ?? undefined,
      link: block.link ?? undefined,
      linkLabel: (block.metadata.linkLabel as string | undefined) ?? undefined,
      width: block.width,
      metadata: block.metadata,
    } satisfies BlockContent,
    published: block.published,
    sortOrder: block.sortOrder,
  };
}

export function normalizePageSlug(pageKey: string): string {
  if (pageKey === "homepage") return "home";
  return pageKey;
}

export function denormalizePageSlug(pageSlug: string): string {
  if (pageSlug === "home") return "homepage";
  return pageSlug;
}

export function normalizeBlockType(sectionKey: string): BlockType {
  if (BLOCK_TYPES.includes(sectionKey as BlockType)) return sectionKey as BlockType;
  return "text";
}

export function createEmptyBlock(pageSlug: string, blockType: BlockType, language: string, sortOrder: number): PageBlock {
  return {
    id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    pageSlug,
    blockType,
    language,
    title: defaultTitle(blockType),
    subtitle: null,
    body: "",
    imageUrl: null,
    link: null,
    width: blockType === "spacer" ? "full" : blockType === "image" ? "half" : "full",
    published: true,
    sortOrder,
    metadata: {},
  };
}

function defaultTitle(blockType: BlockType): string {
  switch (blockType) {
    case "hero":
      return "Hero";
    case "empowerment":
      return "Empowerment";
    case "pillars":
      return "Pillars";
    case "stats":
      return "Statistics";
    case "projects":
      return "Projects";
    case "collage":
      return "Photo collage";
    case "news":
      return "Latest news";
    case "text":
      return "Text block";
    case "image":
      return "Image";
    case "cta":
      return "Call to action";
    case "spacer":
      return "Spacer";
  }
}

export const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  hero: "Hero strip",
  empowerment: "Empowerment",
  pillars: "Pillars",
  stats: "Statistics bar",
  projects: "Projects grid",
  collage: "Photo collage",
  news: "News feed",
  text: "Text",
  image: "Image",
  cta: "Call to action",
  spacer: "Spacer",
};
