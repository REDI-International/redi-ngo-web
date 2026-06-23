"use client";

import { LivePageEditor } from "./LivePageEditor";
import { BlockPreview } from "./BlockPreview";
import type { PageBlock } from "@/lib/blocks/types";

export function EditablePageShell({
  pageSlug,
  locale,
  initialBlocks,
  fallbackContent,
  serverRenderedBlocks,
}: {
  pageSlug: string;
  locale: string;
  initialBlocks: PageBlock[];
  fallbackContent: React.ReactNode;
  serverRenderedBlocks?: React.ReactNode;
}) {
  return (
    <LivePageEditor
      pageSlug={pageSlug}
      locale={locale}
      initialBlocks={initialBlocks}
      fallbackContent={fallbackContent}
      renderBlock={(block) => <BlockPreview block={block} />}
      serverRenderedBlocks={serverRenderedBlocks}
    />
  );
}
