"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useEditMode } from "./EditModeProvider";
import { LiveEditorToolbar, EditingBanner } from "./LiveEditorToolbar";
import { BlockEditorPanel } from "./BlockEditorPanel";
import { AddBlockMenu } from "./AddBlockMenu";
import type { PageBlock } from "@/lib/blocks/types";
import { BLOCK_TYPE_LABELS } from "@/lib/blocks/types";

function SortableBlockShell({
  block,
  isSelected,
  onSelect,
  children,
}: {
  block: PageBlock;
  isSelected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  if (!block.published) {
    return (
      <div ref={setNodeRef} style={style} className="relative opacity-50">
        <div className="rounded-xl border-2 border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          Hidden: {block.title ?? BLOCK_TYPE_LABELS[block.blockType]}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative ${isSelected ? "ring-2 ring-amber-400 ring-offset-2" : ""}`}
    >
      <div className="pointer-events-none absolute inset-0 z-10 rounded-xl border-2 border-dashed border-transparent transition group-hover:border-amber-400/60" />
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute left-2 top-2 z-20 flex cursor-grab items-center gap-1 rounded-lg bg-amber-400/90 px-2 py-1 text-xs font-semibold text-amber-950 opacity-0 shadow transition group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="h-3.5 w-3.5" />
        Drag
      </button>
      <button
        type="button"
        onClick={onSelect}
        className="absolute right-2 top-2 z-20 rounded-lg bg-white/90 px-2 py-1 text-xs font-semibold text-primary opacity-0 shadow transition group-hover:opacity-100"
      >
        Edit
      </button>
      <div onClick={onSelect} className="cursor-pointer">
        {children}
      </div>
    </div>
  );
}

export function LivePageEditor({
  pageSlug,
  locale,
  initialBlocks,
  renderBlock,
  fallbackContent,
  serverRenderedBlocks,
}: {
  pageSlug: string;
  locale: string;
  initialBlocks: PageBlock[];
  renderBlock: (block: PageBlock) => React.ReactNode;
  fallbackContent?: React.ReactNode;
  serverRenderedBlocks?: React.ReactNode;
}) {
  const router = useRouter();
  const {
    canEdit,
    dbConfigured,
    isEditing,
    setPageSlug,
    setLocale,
    blocks,
    setBlocks,
    dirty,
    setDirty,
    selectedBlockId,
    setSelectedBlockId,
    toast,
  } = useEditMode();

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPageSlug(pageSlug);
    setLocale(locale);
    setBlocks(initialBlocks);
    setDirty(false);
  }, [pageSlug, locale, initialBlocks, setPageSlug, setLocale, setBlocks, setDirty]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const updateBlock = useCallback(
    (id: string, patch: Partial<PageBlock>) => {
      setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
      setDirty(true);
    },
    [setBlocks, setDirty],
  );

  const deleteBlock = useCallback(
    (id: string) => {
      setBlocks((prev) => prev.filter((b) => b.id !== id));
      setSelectedBlockId(null);
      setDirty(true);
    },
    [setBlocks, setSelectedBlockId, setDirty],
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setBlocks((items) => {
      const oldIndex = items.findIndex((b) => b.id === active.id);
      const newIndex = items.findIndex((b) => b.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return items;
      const next = [...items];
      const [moved] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, moved);
      return next.map((b, i) => ({ ...b, sortOrder: i }));
    });
    setDirty(true);
  };

  const handleSave = async () => {
    if (!dbConfigured) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/blocks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageSlug, locale, blocks }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast(json.error ?? "Save failed", "error");
        return;
      }
      setBlocks(json.blocks ?? blocks);
      setDirty(false);
      toast("Changes saved and published");
      router.refresh();
    } catch {
      toast("Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) ?? null;
  const hasBlocks = initialBlocks.length > 0;

  return (
    <>
      {canEdit && <LiveEditorToolbar onSave={handleSave} saving={saving} />}
      {canEdit && isEditing && <EditingBanner />}

      {isEditing && canEdit && dbConfigured ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {blocks.length === 0 && (
                <div className="mx-auto max-w-lg rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 p-10 text-center">
                  <p className="font-heading text-lg font-bold text-amber-950">No sections yet</p>
                  <p className="mt-2 text-sm text-amber-800">
                    Click + below to add your first section, or save default content below as blocks.
                  </p>
                </div>
              )}

              {blocks.map((block) => (
                <div key={block.id}>
                  <SortableBlockShell
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    onSelect={() => setSelectedBlockId(block.id)}
                  >
                    {renderBlock(block)}
                  </SortableBlockShell>
                  <AddBlockMenu
                    pageSlug={pageSlug}
                    locale={locale}
                    sortOrder={block.sortOrder + 1}
                    onAdd={(newBlock) => {
                      setBlocks((prev) => {
                        const idx = prev.findIndex((b) => b.id === block.id);
                        const next = [...prev];
                        next.splice(idx + 1, 0, newBlock);
                        return next.map((b, i) => ({ ...b, sortOrder: i }));
                      });
                      setDirty(true);
                      setSelectedBlockId(newBlock.id);
                    }}
                  />
                </div>
              ))}

              {blocks.length === 0 && (
                <AddBlockMenu
                  pageSlug={pageSlug}
                  locale={locale}
                  sortOrder={0}
                  onAdd={(newBlock) => {
                    setBlocks([newBlock]);
                    setDirty(true);
                    setSelectedBlockId(newBlock.id);
                  }}
                />
              )}

              {!hasBlocks && fallbackContent && (
                <div className="relative mt-8">
                  <div className="absolute inset-0 z-10 flex items-start justify-center bg-white/60 pt-8 backdrop-blur-[1px]">
                    <p className="rounded-full bg-white px-4 py-2 text-sm font-medium shadow">
                      Default content preview — add sections above to customize
                    </p>
                  </div>
                  {fallbackContent}
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      ) : hasBlocks ? (
        serverRenderedBlocks ?? (
          <div>{initialBlocks.filter((b) => b.published).map((block) => <div key={block.id}>{renderBlock(block)}</div>)}</div>
        )
      ) : (
        fallbackContent
      )}

      {selectedBlock && isEditing && (
        <BlockEditorPanel
          block={selectedBlock}
          onUpdate={(patch) => updateBlock(selectedBlock.id, patch)}
          onDelete={() => deleteBlock(selectedBlock.id)}
          onClose={() => setSelectedBlockId(null)}
        />
      )}

      {isEditing && dirty && (
        <div className="sr-only" aria-live="polite">
          Unsaved changes
        </div>
      )}
    </>
  );
}
