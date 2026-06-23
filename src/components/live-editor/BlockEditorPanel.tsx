"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Upload, Loader2, ImageIcon, X } from "lucide-react";
import type { BlockType, BlockWidth, PageBlock } from "@/lib/blocks/types";
import { BLOCK_TYPE_LABELS } from "@/lib/blocks/types";

const IMAGE_BLOCK_TYPES: BlockType[] = ["hero", "empowerment", "image", "collage", "cta"];

export function ImageUploadField({
  value,
  onChange,
  label = "Image",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error ?? "Upload failed");
        } else {
          onChange(json.url);
        }
      } catch {
        setError("Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onChange],
  );

  return (
    <div>
      <span className="block text-sm font-medium text-[#1d1d1f]">{label}</span>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files[0];
          if (file?.type.startsWith("image/")) uploadFile(file);
          else setError("Please drop an image file");
        }}
        className={`mt-2 rounded-xl border-2 border-dashed p-4 transition ${
          dragOver ? "border-primary bg-primary/5" : "border-black/10 bg-[#fafafa]"
        }`}
      >
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Preview" className="h-20 w-28 rounded-lg border object-cover" />
          ) : (
            <div className="flex h-20 w-28 items-center justify-center rounded-lg border bg-white">
              <ImageIcon className="h-7 w-7 text-[#86868b]" />
            </div>
          )}
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium hover:bg-black/[0.02]">
                <Upload className="h-4 w-4" />
                Upload image
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadFile(file);
                  }}
                />
              </label>
              {value && (
                <button
                  type="button"
                  onClick={() => onChange(null)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                  Remove
                </button>
              )}
            </div>
            {uploading && (
              <div className="flex items-center gap-2 text-xs text-[#86868b]">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Uploading…
              </div>
            )}
          </div>
        </div>
      </div>
      <input
        type="url"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        placeholder="Or paste image URL"
        className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function BlockEditorPanel({
  block,
  onUpdate,
  onDelete,
  onClose,
}: {
  block: PageBlock;
  onUpdate: (patch: Partial<PageBlock>) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [mounted, setMounted] = useState(false);
  const showImageField = IMAGE_BLOCK_TYPES.includes(block.blockType);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <>
      <button
        type="button"
        aria-label="Close editor"
        onClick={onClose}
        className="fixed inset-0 z-[170] cursor-default bg-black/20"
      />
      <aside className="pointer-events-auto fixed inset-y-0 right-0 z-[180] flex w-full max-w-md flex-col border-l border-black/10 bg-white shadow-2xl sm:max-w-lg">
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#86868b]">Edit section</p>
            <h2 className="font-heading text-lg font-bold text-text">
              {block.title ?? BLOCK_TYPE_LABELS[block.blockType]}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-black/5">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <label className="block">
            <span className="text-sm font-medium">Title</span>
            <input
              value={block.title ?? ""}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
              autoFocus
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Subtitle</span>
            <input
              value={block.subtitle ?? ""}
              onChange={(e) => onUpdate({ subtitle: e.target.value })}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Body</span>
            <textarea
              value={block.body ?? ""}
              onChange={(e) => onUpdate({ body: e.target.value })}
              rows={5}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            />
          </label>

          {showImageField && (
            <ImageUploadField
              value={block.imageUrl}
              onChange={(url) => onUpdate({ imageUrl: url })}
              label={block.blockType === "hero" ? "Hero image" : "Image"}
            />
          )}

          <label className="block">
            <span className="text-sm font-medium">Link URL</span>
            <input
              value={block.link ?? ""}
              onChange={(e) => onUpdate({ link: e.target.value })}
              placeholder="/projects"
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Panel width</span>
            <select
              value={block.width}
              onChange={(e) => onUpdate({ width: e.target.value as BlockWidth })}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            >
              <option value="full">Full width</option>
              <option value="half">Half width</option>
              <option value="third">Third width</option>
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={block.published}
              onChange={(e) => onUpdate({ published: e.target.checked })}
              className="rounded"
            />
            Visible on site
          </label>
        </div>

        <div className="border-t border-black/10 p-5">
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="w-full rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            >
              Delete section
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-red-700">Delete this section?</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onDelete}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Yes, delete
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 rounded-lg border border-black/10 px-4 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>,
    document.body,
  );
}
