import { Link } from "@/i18n/navigation";
import { EUBadge } from "@/components/EUEmblem";
import { HeroShowcase } from "@/components/HeroShowcase";
import type { Locale } from "@/i18n/routing";

interface HeroProps {
  locale: Locale;
  title: string;
  subtitle: string;
  euBadgeLabel: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Localized microcopy for the showcase */
  showcase?: {
    statValue: string;
    statLabel: string;
    tag: string;
    coFunded: string;
  };
}

export function Hero({
  locale,
  title,
  subtitle,
  euBadgeLabel,
  primaryCta,
  secondaryCta,
  showcase,
}: HeroProps) {
  const sc = showcase ?? {
    statValue: "€2M+",
    statLabel: "facilitated for Roma entrepreneurs",
    tag: "Real stories",
    coFunded: "Co-funded by the European Union",
  };

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Restrained brand backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#f7f5f0_0%,_transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_#eef3ef_0%,_transparent_55%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 lg:px-8 lg:pb-20 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          {/* Left — message */}
          <div className="hs-reveal hs-reveal-1">
            <EUBadge
              label={euBadgeLabel}
              className="mb-7 border border-[#003399]/10 bg-white shadow-sm"
            />

            <h1 className="max-w-xl font-heading text-[2.5rem] font-extrabold leading-[1.05] tracking-tight text-text sm:text-5xl xl:text-[3.75rem]">
              {title}
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-text-muted">
              {subtitle}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href={primaryCta.href}
                className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary-light hover:shadow-lg"
              >
                {primaryCta.label}
              </Link>
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="rounded-full border border-primary/20 px-8 py-3.5 text-sm font-semibold text-primary transition hover:border-primary/40 hover:bg-primary/5"
                >
                  {secondaryCta.label}
                </Link>
              )}
              <a
                href="https://redi.business/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 px-2 py-3.5 text-sm font-semibold text-text-muted transition hover:text-primary"
              >
                REDI.business
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>
            </div>

            {/* Trust bar */}
            <div className="mt-10 flex items-center gap-4 border-t border-surface-dark pt-6">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#003399]">
                <span className="text-base leading-none text-accent">★</span>
              </div>
              <p className="text-xs font-medium leading-snug text-text-muted">
                {sc.coFunded}
              </p>
            </div>
          </div>

          {/* Right — editorial photography */}
          <div className="relative">
            <HeroShowcase
              locale={locale}
              statValue={sc.statValue}
              statLabel={sc.statLabel}
              captionLabel={sc.tag}
            />
          </div>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-[#003399] via-accent to-primary" />
    </section>
  );
}
