"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { PageBlock } from "@/lib/blocks/types";
import { BLOCK_TYPE_LABELS } from "@/lib/blocks/types";

export function BlockPreview({ block }: { block: PageBlock }) {
  if (!block.published) return null;

  switch (block.blockType) {
    case "hero":
      return (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <h1 className="font-heading text-4xl font-bold text-text lg:text-5xl">{block.title ?? "Hero title"}</h1>
                {block.subtitle && <p className="mt-4 text-lg text-text-muted">{block.subtitle}</p>}
                {block.body && <p className="mt-3 text-sm text-text-muted">{block.body}</p>}
                {block.link && (
                  <Link href={block.link} className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">
                    {(block.metadata.linkLabel as string) ?? "Learn more"}
                  </Link>
                )}
              </div>
              {block.imageUrl && (
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image src={block.imageUrl} alt={block.title ?? ""} fill className="object-cover" sizes="50vw" />
                </div>
              )}
            </div>
          </div>
        </section>
      );

    case "empowerment":
      return (
        <section className="border-y border-surface-dark bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <h2 className="font-heading text-3xl font-bold text-text">{block.title}</h2>
            {block.body && <p className="mt-4 max-w-2xl text-lg text-text-muted">{block.body}</p>}
            {block.subtitle && (
              <p className="mt-4 rounded-xl border border-primary/10 bg-primary/5 px-5 py-4 font-medium text-primary">
                {block.subtitle}
              </p>
            )}
          </div>
        </section>
      );

    case "cta":
      return (
        <section className="bg-primary py-12 text-white">
          <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
            <h2 className="font-heading text-2xl font-bold">{block.title ?? "Call to action"}</h2>
            {block.body && <p className="mx-auto mt-3 max-w-xl text-white/80">{block.body}</p>}
            {block.link && (
              <Link href={block.link} className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-text">
                {(block.metadata.linkLabel as string) ?? "Get started"}
              </Link>
            )}
          </div>
        </section>
      );

    case "spacer":
      return <div style={{ height: Number(block.metadata.height ?? 48) }} aria-hidden="true" />;

    case "image":
      return (
        <section className="py-8">
          <div className={`mx-auto px-4 lg:px-8 ${block.width === "full" ? "max-w-7xl" : block.width === "half" ? "max-w-3xl" : "max-w-xl"}`}>
            {block.imageUrl ? (
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                <Image src={block.imageUrl} alt={block.title ?? ""} fill className="object-cover" sizes="80vw" />
              </div>
            ) : (
              <div className="flex aspect-[16/9] items-center justify-center rounded-2xl border-2 border-dashed border-black/10 bg-[#fafafa] text-sm text-text-muted">
                Add an image
              </div>
            )}
            {block.title && <p className="mt-3 text-center text-sm text-text-muted">{block.title}</p>}
          </div>
        </section>
      );

    case "stats":
    case "pillars":
    case "projects":
    case "collage":
    case "news":
      return (
        <section className="bg-[#f7f5f0] py-12">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{BLOCK_TYPE_LABELS[block.blockType]}</p>
            <h2 className="mt-1 font-heading text-2xl font-bold text-text">{block.title ?? BLOCK_TYPE_LABELS[block.blockType]}</h2>
            {block.subtitle && <p className="mt-2 text-text-muted">{block.subtitle}</p>}
            <p className="mt-4 rounded-lg border border-black/10 bg-white p-4 text-sm text-text-muted">
              Dynamic content ({BLOCK_TYPE_LABELS[block.blockType]}) loads from site data on the live site.
            </p>
          </div>
        </section>
      );

    case "text":
    default:
      return (
        <section className="py-12">
          <div
            className={`mx-auto px-4 lg:px-8 ${
              block.width === "full" ? "max-w-7xl" : block.width === "half" ? "max-w-3xl" : "max-w-xl"
            }`}
          >
            {block.title && <h2 className="font-heading text-2xl font-bold text-text">{block.title}</h2>}
            {block.subtitle && <p className="mt-2 text-lg text-text-muted">{block.subtitle}</p>}
            {block.body && <p className="mt-4 whitespace-pre-wrap leading-relaxed text-text-muted">{block.body}</p>}
          </div>
        </section>
      );
  }
}
