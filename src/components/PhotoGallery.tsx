"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { GalleryPhoto } from "@/content/media";
import { CloseIcon, ArrowRightIcon } from "@/components/icons";

const CATEGORIES: Array<{ key: GalleryPhoto["category"] | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "events", label: "Events" },
  { key: "community", label: "Community" },
  { key: "entrepreneurs", label: "Entrepreneurs" },
  { key: "projects", label: "Projects" },
  { key: "team", label: "Team" },
];

export function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [filter, setFilter] = useState<GalleryPhoto["category"] | "all">("all");
  const [active, setActive] = useState<number | null>(null);

  const available = useMemo(() => {
    const present = new Set(photos.map((p) => p.category));
    return CATEGORIES.filter((c) => c.key === "all" || present.has(c.key as GalleryPhoto["category"]));
  }, [photos]);

  const filtered = useMemo(
    () => (filter === "all" ? photos : photos.filter((p) => p.category === filter)),
    [photos, filter],
  );

  const close = useCallback(() => setActive(null), []);
  const go = useCallback(
    (dir: number) => setActive((i) => (i === null ? null : (i + dir + filtered.length) % filtered.length)),
    [filtered.length],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, go]);

  const current = active === null ? null : filtered[active];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {available.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setFilter(c.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              filter === c.key
                ? "bg-primary text-white"
                : "bg-white text-text-muted ring-1 ring-black/10 hover:bg-surface"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((photo, i) => (
          <button
            key={`${photo.src}-${i}`}
            type="button"
            onClick={() => setActive(i)}
            className="group relative aspect-square overflow-hidden rounded-xl bg-surface-dark text-left ring-1 ring-black/5"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition group-hover:opacity-100" />
            {photo.caption && (
              <span className="absolute inset-x-0 bottom-0 p-3 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100 line-clamp-2">
                {photo.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      {current && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            className="absolute left-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
            aria-label="Previous"
          >
            <ArrowRightIcon className="h-5 w-5 rotate-180" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); go(1); }}
            className="absolute right-4 bottom-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:bottom-auto sm:right-16"
            aria-label="Next"
          >
            <ArrowRightIcon className="h-5 w-5" />
          </button>
          <figure className="max-h-[85vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <Image
                src={current.src}
                alt={current.alt}
                width={1400}
                height={1000}
                className="max-h-[78vh] w-auto rounded-lg object-contain"
              />
            </div>
            {current.caption && (
              <figcaption className="mt-3 text-center text-sm text-white/80">{current.caption}</figcaption>
            )}
          </figure>
        </div>
      )}
    </div>
  );
}
