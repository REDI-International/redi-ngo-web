"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { entrepreneurStories } from "@/content/entrepreneur-stories";
import type { Locale } from "@/i18n/routing";

interface EntrepreneurCarouselProps {
  locale: Locale;
  priority?: boolean;
  className?: string;
}

const AUTO_ADVANCE_MS = 5000;

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

export function EntrepreneurCarousel({ locale, priority = false, className = "" }: EntrepreneurCarouselProps) {
  const t = useTranslations("home.entrepreneurCarousel");
  const reducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const count = entrepreneurStories.length;

  const goTo = useCallback(
    (index: number) => {
      const next = ((index % count) + count) % count;
      setActiveIndex(next);
      const container = scrollRef.current;
      if (!container) return;
      const card = container.children[next] as HTMLElement | undefined;
      card?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", inline: "center", block: "nearest" });
    },
    [count, reducedMotion],
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  useEffect(() => {
    if (reducedMotion || isPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % count;
        const container = scrollRef.current;
        const card = container?.children[next] as HTMLElement | undefined;
        card?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        return next;
      });
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [count, isPaused, reducedMotion]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cards = Array.from(container.children) as HTMLElement[];
      if (cards.length === 0) return;
      const center = container.scrollLeft + container.clientWidth / 2;
      let closest = 0;
      let minDist = Infinity;
      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(center - cardCenter);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });
      setActiveIndex(closest);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsPaused(false);
      }}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-text-muted">{t("heading")}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            aria-label={t("previous")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-dark/60 bg-white text-text shadow-sm transition hover:border-primary/30 hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label={t("next")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-dark/60 bg-white text-text shadow-sm transition hover:border-primary/30 hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label={t("selectPrompt")}
      >
        {entrepreneurStories.map((story, index) => {
          const isActive = activeIndex === index;
          return (
            <article
              key={story.slug}
              role="listitem"
              className={`group w-[min(100%,280px)] shrink-0 snap-center sm:w-[300px] ${
                reducedMotion ? "" : "transition-transform duration-300"
              } ${isActive ? "scale-[1.02]" : "scale-[0.98] opacity-90"}`}
            >
              <Link
                href={`/stories/${story.slug}`}
                className={`flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isActive
                    ? "border-primary/20 shadow-lg ring-1 ring-primary/10"
                    : "border-surface-dark/50 hover:border-primary/15 hover:shadow-lg"
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                  <Image
                    src={story.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 85vw, 300px"
                    className={`object-cover ${reducedMotion ? "" : "transition duration-500 group-hover:scale-[1.03]"}`}
                    priority={priority && index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" aria-hidden />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">{story.program[locale]}</p>
                  <h3 className="mt-1 font-heading text-lg font-bold leading-snug text-text">
                    {story.name[locale]}
                  </h3>
                  <p className="mt-1 text-sm text-text-muted">{story.role[locale]}</p>
                  <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-text-muted">
                    {story.title[locale]}
                  </p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
                    {t("readStory")}
                    <span className="ml-1 transition group-hover:translate-x-0.5" aria-hidden>
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      <div className="mt-5 flex justify-center gap-2" role="tablist" aria-label={t("selectPrompt")}>
        {entrepreneurStories.map((story, index) => (
          <button
            key={story.slug}
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            aria-label={`${story.name[locale]} — ${story.title[locale]}`}
            onClick={() => goTo(index)}
            className={`h-2 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
              activeIndex === index ? "w-6 bg-primary" : "w-2 bg-surface-dark hover:bg-primary/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
