import Image from "next/image";
import { entrepreneurStories } from "@/content/entrepreneur-stories";
import type { Locale } from "@/i18n/routing";

interface HeroShowcaseProps {
  locale: Locale;
  statValue: string;
  statLabel: string;
  captionLabel: string;
}

/**
 * Editorial photo composition for the homepage hero.
 *
 * Replaces the abstract "ecosystem" diagram with authentic photography of the
 * Roma entrepreneurs REDI supports — the way social-impact organisations
 * (Acumen, Ashoka, the European Commission) present their work. Restrained
 * brand palette (forest green + gold), real names as caption chips, and a
 * single quiet stat card. Motion is a gentle staggered reveal only.
 */
export function HeroShowcase({
  locale,
  statValue,
  statLabel,
  captionLabel,
}: HeroShowcaseProps) {
  const main = entrepreneurStories[0]; // Ion — master craftsman
  const topRight = entrepreneurStories[2]; // Marko — plumbing supplies
  const bottomRight = entrepreneurStories[4]; // Denis — digital entrepreneur

  return (
    <div className="relative mx-auto w-full max-w-[540px] lg:max-w-none lg:pl-6">
      {/* Soft brand accents (no rainbow) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-8 h-32 w-32 rounded-[2rem] bg-accent/20 blur-[2px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-primary/10"
      />
      {/* Fine dot texture behind the frames */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 top-10 -z-10 h-40 w-40 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "14px 14px",
          color: "#1b433233",
        }}
      />

      <div className="relative grid grid-cols-5 gap-3 sm:gap-4">
        {/* Main portrait */}
        <figure className="hs-reveal hs-reveal-1 relative col-span-3 aspect-[3/4] overflow-hidden rounded-[1.75rem] shadow-[0_24px_60px_-24px_rgba(27,67,50,0.55)] ring-1 ring-black/5">
          <Image
            src={main.image}
            alt={`${main.name[locale]} — ${main.role[locale]}`}
            fill
            priority
            sizes="(max-width: 1024px) 60vw, 30vw"
            className="object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-primary/55 via-transparent to-transparent"
          />
          <figcaption className="absolute inset-x-3 bottom-3">
            <div className="inline-flex flex-col rounded-xl bg-white/95 px-3.5 py-2 shadow-lg backdrop-blur-sm">
              <span className="font-heading text-sm font-bold leading-tight text-text">
                {main.name[locale]}
              </span>
              <span className="text-[11px] font-medium leading-tight text-text-muted">
                {main.role[locale]} · {main.location[locale]}
              </span>
            </div>
          </figcaption>
        </figure>

        {/* Right stacked column */}
        <div className="col-span-2 flex flex-col gap-3 sm:gap-4">
          <figure className="hs-reveal hs-reveal-2 relative flex-1 overflow-hidden rounded-[1.5rem] shadow-[0_18px_44px_-22px_rgba(27,67,50,0.5)] ring-1 ring-black/5">
            <Image
              src={topRight.image}
              alt={`${topRight.name[locale]} — ${topRight.role[locale]}`}
              fill
              sizes="(max-width: 1024px) 40vw, 20vw"
              className="object-cover object-center"
            />
          </figure>
          <figure className="hs-reveal hs-reveal-3 relative flex-1 overflow-hidden rounded-[1.5rem] shadow-[0_18px_44px_-22px_rgba(27,67,50,0.5)] ring-1 ring-black/5">
            <Image
              src={bottomRight.image}
              alt={`${bottomRight.name[locale]} — ${bottomRight.role[locale]}`}
              fill
              sizes="(max-width: 1024px) 40vw, 20vw"
              className="object-cover object-center"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent"
            />
          </figure>
        </div>
      </div>

      {/* Floating stat card */}
      <div className="hs-reveal hs-reveal-4 absolute -bottom-6 left-2 z-10 flex items-center gap-3 rounded-2xl border border-black/5 bg-white px-4 py-3 shadow-[0_20px_50px_-18px_rgba(27,67,50,0.45)] sm:left-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
        </div>
        <div className="leading-tight">
          <p className="font-heading text-xl font-extrabold tracking-tight text-primary">
            {statValue}
          </p>
          <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
            {statLabel}
          </p>
        </div>
      </div>

      {/* Small "real stories" tag */}
      <div className="hs-reveal hs-reveal-2 absolute -right-1 top-4 z-10 rounded-full bg-accent px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-primary shadow-md sm:-right-3">
        {captionLabel}
      </div>
    </div>
  );
}
