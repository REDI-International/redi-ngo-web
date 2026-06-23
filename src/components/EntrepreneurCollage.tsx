"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const SLICE_IDS = ["tailor", "retail", "hardware", "textiles", "professional"] as const;
type SliceId = (typeof SLICE_IDS)[number];

const CLIP_PATHS: Record<SliceId, string> = {
  tailor: "polygon(0 0, 20% 0, 12% 100%, 0 100%)",
  retail: "polygon(20% 0, 38% 0, 30% 100%, 12% 100%)",
  hardware: "polygon(38% 0, 55% 0, 47% 100%, 30% 100%)",
  textiles: "polygon(55% 0, 72% 0, 64% 100%, 47% 100%)",
  professional: "polygon(72% 0, 100% 0, 100% 100%, 64% 100%)",
};

const MOBILE_CROP: Record<SliceId, string> = {
  tailor: "object-[15%_center]",
  retail: "object-[35%_center]",
  hardware: "object-[50%_center]",
  textiles: "object-[68%_center]",
  professional: "object-[88%_center]",
};

const LINKS: Record<SliceId, { href: string; external?: boolean }> = {
  tailor: { href: "/projects" },
  retail: { href: "/news/building-and-strengthening-the-papposhop-platform-to-support-roma-entrepreneurs-women-and-youth-in-north-macedonia-albania-and-serbia-including-educational-and-community-awareness-campaign" },
  hardware: { href: "/impact/business-club" },
  textiles: { href: "/impact/fund" },
  professional: { href: "https://redi.business/", external: true },
};

const PROGRAM_KEYS: Record<SliceId, string> = {
  tailor: "programGrantSupport",
  retail: "programYouth",
  hardware: "programBusinessClub",
  textiles: "programRediFund",
  professional: "programLearn",
};

interface EntrepreneurCollageProps {
  variant?: "banner" | "card";
  imageSrc?: string;
  priority?: boolean;
  className?: string;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

export function EntrepreneurCollage({
  variant = "banner",
  imageSrc = "/home/entrepreneur-collage.png",
  priority = false,
  className = "",
}: EntrepreneurCollageProps) {
  const t = useTranslations("home.entrepreneurCollage");
  const reducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeId = activeIndex !== null ? SLICE_IDS[activeIndex] : null;
  const isOpen = activeIndex !== null;

  const openSlice = useCallback((index: number) => setActiveIndex(index), []);
  const closePanel = useCallback(() => setActiveIndex(null), []);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i - 1 + SLICE_IDS.length) % SLICE_IDS.length));
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % SLICE_IDS.length));
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closePanel, goPrev, goNext]);

  const containerClass =
    variant === "banner"
      ? "relative overflow-hidden rounded-2xl shadow-xl aspect-[35/8] min-h-[140px] sm:min-h-[180px] lg:min-h-[220px]"
      : "relative overflow-hidden rounded-2xl shadow-lg aspect-[3/1] min-h-[160px] sm:min-h-[200px]";

  return (
    <>
      <div className={`${containerClass} ${className}`}>
        <Image
          src={imageSrc}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 1200px"
          className="pointer-events-none object-cover object-center select-none"
          priority={priority}
          aria-hidden
        />

        {variant === "banner" && (
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
            aria-hidden
          />
        )}

        {/* Desktop / tablet: diagonal slice overlays */}
        <div className="absolute inset-0 hidden sm:block">
          {SLICE_IDS.map((id, index) => (
            <button
              key={id}
              type="button"
              onClick={() => openSlice(index)}
              aria-label={t(`${id}Label`)}
              aria-expanded={activeIndex === index}
              className="group absolute inset-0 cursor-pointer border-0 bg-transparent p-0 transition-[filter] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent hover:brightness-110"
              style={{ clipPath: CLIP_PATHS[id] }}
            >
              <span className="sr-only">{t(`${id}Label`)}</span>
              <span
                className="pointer-events-none absolute inset-0 bg-white/0 transition-colors duration-300 group-hover:bg-white/10 group-focus-visible:bg-white/15"
                aria-hidden
              />
            </button>
          ))}
        </div>

        {/* Mobile: horizontal scroll tiles */}
        <div className="absolute inset-x-0 bottom-0 flex gap-1 overflow-x-auto p-2 sm:hidden">
          {SLICE_IDS.map((id, index) => (
            <button
              key={id}
              type="button"
              onClick={() => openSlice(index)}
              aria-label={t(`${id}Label`)}
              className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg border-2 border-white/80 shadow-md transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              <Image
                src={imageSrc}
                alt=""
                fill
                sizes="56px"
                className={`object-cover ${MOBILE_CROP[id]}`}
                aria-hidden
              />
            </button>
          ))}
        </div>
      </div>

      {/* Reduced motion: always-visible story list */}
      {reducedMotion && (
        <ul className="mt-4 space-y-2 sm:mt-6">
          {SLICE_IDS.map((id, index) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => openSlice(index)}
                className="w-full rounded-xl border border-surface-dark bg-white px-4 py-3 text-left text-sm font-medium text-text transition hover:border-primary/30 hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                {t(`${id}Title`)}
                <span className="mt-0.5 block text-xs font-normal text-text-muted">{t(`${id}Program`)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Story panel */}
      {isOpen && activeId && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:justify-end sm:p-6">
          <button
            type="button"
            className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] ${reducedMotion ? "" : "collage-backdrop-enter"}`}
            aria-label={t("close")}
            onClick={closePanel}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="entrepreneur-story-title"
            className={`relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[85vh] sm:max-w-md sm:rounded-3xl ${
              reducedMotion ? "" : "collage-panel-enter"
            }`}
          >
            <div className="flex items-center justify-between border-b border-surface-dark px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                {t(PROGRAM_KEYS[activeId])}
              </p>
              <button
                type="button"
                onClick={closePanel}
                className="rounded-full p-2 text-text-muted transition hover:bg-surface hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                aria-label={t("close")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-6">
              <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-2xl">
                <Image
                  src={imageSrc}
                  alt=""
                  fill
                  sizes="400px"
                  className={`object-cover ${MOBILE_CROP[activeId]}`}
                  aria-hidden
                />
              </div>

              <h3 id="entrepreneur-story-title" className="font-heading text-2xl font-bold text-text">
                {t(`${activeId}Title`)}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-text-muted">{t(`${activeId}Story`)}</p>
              <p className="mt-4 rounded-xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm font-medium text-primary">
                {t(`${activeId}Highlight`)}
              </p>

              {LINKS[activeId].external ? (
                <a
                  href={LINKS[activeId].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-light"
                >
                  {t("learnMore")} →
                </a>
              ) : (
                <Link
                  href={LINKS[activeId].href}
                  className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-light"
                  onClick={closePanel}
                >
                  {t("learnMore")} →
                </Link>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-surface-dark px-5 py-4">
              <button
                type="button"
                onClick={goPrev}
                className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-text-muted transition hover:bg-surface hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                aria-label={t("previous")}
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="hidden sm:inline">{t("previous")}</span>
              </button>

              <div className="flex gap-1.5" role="tablist" aria-label={t("selectPrompt")}>
                {SLICE_IDS.map((id, index) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={index === activeIndex}
                    aria-label={t(`${id}Label`)}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === activeIndex ? "w-6 bg-primary" : "w-2 bg-surface-dark hover:bg-primary/40"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-text-muted transition hover:bg-surface hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                aria-label={t("next")}
              >
                <span className="hidden sm:inline">{t("next")}</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
