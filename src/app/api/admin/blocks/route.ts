import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { pageSections } from "@/db/schema";
import { getAdminSession } from "@/lib/admin/auth";
import { CONTENT_TAGS, revalidateContentTags } from "@/lib/cache";
import { canEditContent } from "@/lib/admin/can-edit-content";
import {
  blockToSectionValues,
  denormalizePageSlug,
  type BlockType,
  type PageBlock,
  BLOCK_TYPES,
} from "@/lib/blocks/types";

async function requireEditor() {
  const session = await getAdminSession();
  if (!session || !canEditContent(session.role)) {
    return null;
  }
  return session;
}

export async function GET(request: Request) {
  const session = await requireEditor();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { searchParams } = new URL(request.url);
  const pageSlug = searchParams.get("pageSlug") ?? "home";
  const locale = searchParams.get("locale") ?? "en";
  const pageKey = denormalizePageSlug(pageSlug);

  const rows = await db
    .select()
    .from(pageSections)
    .where(eq(pageSections.pageKey, pageKey))
    .orderBy(asc(pageSections.sortOrder));

  const localeRows = rows.filter((r) => r.language === locale);
  const blocks = (localeRows.length ? localeRows : rows.filter((r) => r.language === "en")).map((row) => ({
    id: row.id,
    pageSlug,
    blockType: row.sectionKey,
    language: row.language,
    title: row.title,
    subtitle: (row.content as { subtitle?: string } | null)?.subtitle ?? null,
    body: (row.content as { body?: string; text?: string } | null)?.body ?? (row.content as { text?: string } | null)?.text ?? null,
    imageUrl: (row.content as { image?: string } | null)?.image ?? null,
    link: (row.content as { link?: string } | null)?.link ?? null,
    width: (row.content as { width?: string } | null)?.width ?? "full",
    published: row.published,
    sortOrder: row.sortOrder,
    metadata: (row.content as { metadata?: Record<string, unknown> } | null)?.metadata ?? {},
  }));

  return NextResponse.json({ blocks });
}

interface SavePayload {
  pageSlug: string;
  locale: string;
  blocks: PageBlock[];
}

function isValidBlock(block: PageBlock): boolean {
  return Boolean(block.blockType && BLOCK_TYPES.includes(block.blockType as BlockType));
}

export async function PUT(request: Request) {
  const session = await requireEditor();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  let payload: SavePayload;
  try {
    payload = (await request.json()) as SavePayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { pageSlug, locale, blocks } = payload;
  if (!pageSlug || !locale || !Array.isArray(blocks)) {
    return NextResponse.json({ error: "pageSlug, locale, and blocks are required" }, { status: 400 });
  }

  const pageKey = denormalizePageSlug(pageSlug);
  const now = new Date();

  const existing = await db.select().from(pageSections).where(eq(pageSections.pageKey, pageKey));
  const existingForLocale = existing.filter((r) => r.language === locale);
  const existingIds = new Set(existingForLocale.map((r) => r.id));
  const incomingIds = new Set(blocks.filter((b) => !b.id.startsWith("new-")).map((b) => b.id));

  for (const id of existingIds) {
    if (!incomingIds.has(id)) {
      await db.delete(pageSections).where(eq(pageSections.id, id));
    }
  }

  const saved: PageBlock[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = { ...blocks[i], sortOrder: i, language: locale, pageSlug };
    if (!isValidBlock(block)) continue;

    const values = {
      ...blockToSectionValues(block),
      updatedAt: now,
    };

    if (block.id.startsWith("new-")) {
      const [inserted] = await db
        .insert(pageSections)
        .values({ ...values, sortOrder: i })
        .returning();
      if (inserted) {
        saved.push({ ...block, id: inserted.id, sortOrder: i });
      }
    } else {
      await db.update(pageSections).set({ ...values, sortOrder: i }).where(eq(pageSections.id, block.id));
      saved.push({ ...block, sortOrder: i });
    }
  }

  revalidateContentTags(CONTENT_TAGS.blocks);
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true, blocks: saved });
}

export async function DELETE(request: Request) {
  const session = await requireEditor();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  await db.delete(pageSections).where(eq(pageSections.id, id));

  revalidateContentTags(CONTENT_TAGS.blocks);
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}
