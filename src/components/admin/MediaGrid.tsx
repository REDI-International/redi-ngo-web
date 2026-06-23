"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Copy, Check, Filter } from "lucide-react";
import { deleteGalleryImage } from "@/lib/admin/gallery-actions";
import { DeleteButton } from "./DeleteButton";
import { EmptyState } from "./ui";
import type { GalleryImage } from "@/db/schema";

const CATEGORIES = ["all", "community", "events", "projects", "team", "other"];

export function MediaGrid({ items }: { items: GalleryImage[] }) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          (item.caption?.toLowerCase().includes(q) ?? false) ||
          (item.alt?.toLowerCase().includes(q) ?? false) ||
          item.url.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [items, category, query]);

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  if (items.length === 0) {
    return (
      <EmptyState
        message="No images in your media library yet."
        action={{ href: "/admin/media/new", label: "Upload first image" }}
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search media…"
          className="admin-input max-w-xs"
        />
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#86868b]" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition ${
                category === cat ? "bg-[#1b4332] text-white" : "bg-black/5 text-[#86868b] hover:bg-black/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-[#86868b]">No media matches your filters.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <div key={item.id} className="admin-card group overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.alt ?? ""} className="aspect-[4/3] w-full object-cover" />
              <div className="p-3">
                <p className="truncate text-sm font-medium text-[#1d1d1f]">{item.caption ?? item.alt ?? "Untitled"}</p>
                <p className="mt-0.5 text-[11px] capitalize text-[#86868b]">{item.category}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <Link href={`/admin/media/${item.id}`} className="text-xs font-semibold text-[#1b4332] hover:underline">
                    Edit
                  </Link>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyUrl(item.url)}
                      className="inline-flex items-center gap-1 text-xs text-[#86868b] hover:text-[#1d1d1f]"
                    >
                      {copied === item.url ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      URL
                    </button>
                    <DeleteButton action={deleteGalleryImage} hiddenFields={{ id: item.id }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
