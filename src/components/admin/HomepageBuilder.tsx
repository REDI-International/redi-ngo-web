"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { ExternalLink, GripVertical, Plus } from "lucide-react";
import type { PageSection } from "@/db/schema";
import type { SectionContent, SectionWidth } from "@/lib/admin/page-section-actions";
import { saveHomeSection, reorderHomeSections, createHomeSection } from "@/lib/admin/page-section-actions";
import { UploadField } from "./UploadField";
import { StatusBadge } from "./DataTable";

const WIDTHS: { value: SectionWidth; label: string }[] = [
  { value: "full", label: "Full width" },
  { value: "half", label: "Half width" },
  { value: "third", label: "Third width" },
];

function contentOf(section: PageSection): SectionContent {
  if (!section.content || typeof section.content !== "object") return {};
  return section.content as SectionContent;
}

export function HomepageBuilder({ sections }: { sections: PageSection[] }) {
  const [items, setItems] = useState(sections);
  const [dragId, setDragId] = useState<string | null>(null);

  const persistOrder = useCallback(async (ordered: PageSection[]) => {
    const fd = new FormData();
    fd.set("order", ordered.map((s) => s.id).join(","));
    await reorderHomeSections(fd);
  }, []);

  const onDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const from = items.findIndex((s) => s.id === dragId);
    const to = items.findIndex((s) => s.id === targetId);
    if (from < 0 || to < 0) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
    setDragId(null);
    persistOrder(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-[#86868b]">
          Drag blocks to reorder. Edit text, images, and panel width. Changes appear on the public homepage.
        </p>
        <div className="flex gap-3">
          <a
            href="/en"
            target="_blank"
            rel="noreferrer"
            className="admin-btn-secondary"
          >
            <ExternalLink className="h-4 w-4" />
            Preview site
          </a>
          <form action={createHomeSection}>
            <button type="submit" className="admin-btn-primary">
              <Plus className="h-4 w-4" />
              Add block
            </button>
          </form>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="admin-card p-10 text-center text-[#86868b]">
          No homepage blocks yet. Add a block or create sections from{" "}
          <Link href="/admin/pages/new" className="font-semibold text-[#1b4332] hover:underline">Page sections</Link>.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((section) => {
            const content = contentOf(section);
            return (
              <div
                key={section.id}
                draggable
                onDragStart={() => setDragId(section.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(section.id)}
                className="admin-card overflow-hidden"
              >
                <div className="flex items-center gap-3 border-b border-black/[0.06] bg-[#fafafa] px-4 py-3">
                  <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-[#86868b]" />
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs text-[#86868b]">{section.sectionKey}</p>
                    <p className="truncate font-medium text-[#1d1d1f]">{section.title ?? "Untitled block"}</p>
                  </div>
                  <StatusBadge published={section.published} />
                </div>
                <form action={saveHomeSection} className="space-y-4 p-5">
                  <input type="hidden" name="id" value={section.id} />
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-medium text-[#1d1d1f]">Title</span>
                      <input name="title" defaultValue={section.title ?? ""} className="admin-input mt-1.5" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-[#1d1d1f]">Panel width</span>
                      <select name="width" defaultValue={content.width ?? "full"} className="admin-input mt-1.5">
                        {WIDTHS.map((w) => (
                          <option key={w.value} value={w.value}>{w.label}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-sm font-medium text-[#1d1d1f]">Body text</span>
                    <textarea
                      name="body"
                      rows={4}
                      defaultValue={content.body ?? content.text ?? ""}
                      className="admin-input mt-1.5"
                    />
                  </label>
                  <UploadField name="image" label="Image" defaultValue={content.image} />
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="published" defaultChecked={section.published} className="rounded" />
                    Published on homepage
                  </label>
                  <button type="submit" className="admin-btn-primary">Save block</button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
