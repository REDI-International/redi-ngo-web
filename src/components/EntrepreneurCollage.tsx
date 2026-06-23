"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  SLICE_IDS,
  type SliceId,
  getStorySlugForSlice,
} from "@/content/entrepreneur-stories";

const COLLAGE_IMAGE = "/home/entrepreneur-collage.png";

/** Diagonal clip regions matching the original collage design */
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

interface EntrepreneurCollageProps {
  variant?: "banner" | "card";
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
  priority = false,
  className = "",
}: EntrepreneurCollageProps) {
  const t = useTranslations("home.entrepreneurCollage");
  const router = useRouter();
  const reducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const openSlice = useCallback(
    (index: number) => {
      const id = SLICE_IDS[index];
      setActiveIndex(index);
      router.push(`/stories/${getStorySlugForSlice(id)}`);
    },
    [router],
  );

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setActiveIndex(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const containerClass =
    variant === "banner"
      ? "relative overflow-hidden rounded-2xl shadow-xl aspect-[35/8] min-h-[140px] sm:min-h-[180px] lg:min-h-[220px]"
      : "relative overflow-hidden rounded-2xl shadow-lg aspect-[3/1] min-h-[160px] sm:min-h-[200px]";

  const sliceMotion = reducedMotion
    ? ""
    : "transition-[transform,filter] duration-300 ease-out";

  const getSliceState = (index: number) => {
    if (activeIndex === index) {
      return reducedMotion
        ? "z-10 ring-2 ring-primary ring-offset-2"
        : "z-20 -translate-y-3 drop-shadow-2xl";
    }
    if (hoverIndex === index && activeIndex === null) {
      return reducedMotion ? "" : "z-10 -translate-y-1 drop-shadow-lg";
    }
    return "z-0";
  };

  return (
    <div ref={containerRef} className={className}>
      <div className={`${containerClass} hidden sm:block`}>
        <Image
          src={COLLAGE_IMAGE}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 1200px"
          className="pointer-events-none object-cover object-center select-none"
          priority={priority}
          aria-hidden
        />

        {variant === "banner" && (
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/25 via-transparent to-transparent"
            aria-hidden
          />
        )}

        {SLICE_IDS.map((id, index) => (
          <button
            key={id}
            type="button"
            onClick={() => openSlice(index)}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
            onFocus={() => setHoverIndex(index)}
            onBlur={() => setHoverIndex(null)}
            aria-label={t(`${id}Label`)}
            aria-pressed={activeIndex === index}
            className={`group absolute inset-0 cursor-pointer border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent ${sliceMotion} ${getSliceState(index)}`}
            style={{ clipPath: CLIP_PATHS[id] }}
          >
            <span className="sr-only">{t(`${id}Label`)}</span>
            <span
              className="pointer-events-none absolute inset-0 bg-white/0 transition-colors duration-300 group-hover:bg-white/10 group-focus-visible:bg-white/15"
              aria-hidden
            />
            <span
              className={`pointer-events-none absolute inset-x-[8%] bottom-3 text-left text-[10px] font-semibold leading-tight text-white opacity-0 drop-shadow-md transition-opacity duration-300 group-hover:opacity-100 sm:text-xs ${
                index === 0 ? "left-[2%]" : ""
              } ${index === SLICE_IDS.length - 1 ? "right-[2%]" : ""}`}
              aria-hidden
            >
              {t(`${id}Title`)}
            </span>
          </button>
        ))}
      </div>

      {/* Mobile: horizontal scroll with diagonal-skewed cards */}
      <div
        className="flex gap-3 overflow-x-auto pb-2 sm:hidden"
        role="list"
        aria-label={t("selectPrompt")}
      >
        {SLICE_IDS.map((id, index) => {
          const isActive = activeIndex === index;

          return (
            <button
              key={id}
              type="button"
              role="listitem"
              onClick={() => openSlice(index)}
              aria-label={t(`${id}Label`)}
              aria-pressed={isActive}
              className={`group relative h-28 w-20 shrink-0 -skew-x-3 overflow-hidden rounded-xl border-2 border-white/90 shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                reducedMotion ? "" : "transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
              } ${isActive ? (reducedMotion ? "ring-2 ring-primary" : "-translate-y-2 skew-x-0 shadow-xl") : ""}`}
            >
              <div className="absolute inset-0 skew-x-3 scale-110">
                <Image
                  src={COLLAGE_IMAGE}
                  alt=""
                  fill
                  sizes="80px"
                  className={`object-cover ${MOBILE_CROP[id]}`}
                  priority={priority && index < 2}
                  aria-hidden
                />
              </div>
              <span className="pointer-events-none absolute inset-x-0 bottom-0 skew-x-3 bg-gradient-to-t from-black/60 to-transparent px-1.5 pb-1.5 pt-6 text-left text-[9px] font-semibold leading-tight text-white">
                {t(`${id}Title`)}
              </span>
            </button>
          );
        })}
      </div>

      {reducedMotion && (
        <ul className="mt-4 space-y-2 sm:hidden">
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
    </div>
  );
}
