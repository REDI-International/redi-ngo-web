"use client";

import { Plus } from "lucide-react";
import { BLOCK_TYPE_LABELS, BLOCK_TYPES, createEmptyBlock, type BlockType } from "@/lib/blocks/types";
import { useState } from "react";

const QUICK_TYPES: BlockType[] = ["text", "image", "hero", "cta", "spacer", "empowerment"];

export function AddBlockMenu({
  pageSlug,
  locale,
  sortOrder,
  onAdd,
}: {
  pageSlug: string;
  locale: string;
  sortOrder: number;
  onAdd: (block: ReturnType<typeof createEmptyBlock>) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex justify-center py-3">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full border-2 border-dashed border-primary/30 bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/5"
        >
          <Plus className="h-4 w-4" />
          Add section
        </button>
      ) : (
        <div className="w-full max-w-lg rounded-2xl border border-black/10 bg-white p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-text">Choose section type</p>
            <button type="button" onClick={() => setOpen(false)} className="text-xs text-text-muted hover:text-text">
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {QUICK_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  onAdd(createEmptyBlock(pageSlug, type, locale, sortOrder));
                  setOpen(false);
                }}
                className="rounded-xl border border-black/10 px-3 py-3 text-left text-sm font-medium transition hover:border-primary/40 hover:bg-primary/5"
              >
                {BLOCK_TYPE_LABELS[type]}
              </button>
            ))}
          </div>
          <details className="mt-3">
            <summary className="cursor-pointer text-xs font-medium text-text-muted">More section types</summary>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {BLOCK_TYPES.filter((t) => !QUICK_TYPES.includes(t)).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    onAdd(createEmptyBlock(pageSlug, type, locale, sortOrder));
                    setOpen(false);
                  }}
                  className="rounded-lg border border-black/10 px-2 py-2 text-left text-xs font-medium hover:bg-black/[0.02]"
                >
                  {BLOCK_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
