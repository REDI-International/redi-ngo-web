import { Link } from "@/i18n/navigation";
import { EUBadge } from "@/components/EUEmblem";
import { HeroEcosystem } from "@/components/HeroEcosystem";

interface HeroProps {
  title: string;
  subtitle: string;
  ecosystemIntro: string;
  euBadgeLabel: string;
  ecosystemLabels: Record<string, string>;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  imageSrc?: string | null;
}

export function Hero({
  title,
  subtitle,
  ecosystemIntro,
  euBadgeLabel,
  ecosystemLabels,
  primaryCta,
  secondaryCta,
  imageSrc,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#f7f5f0_0%,_transparent_55%)]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_#e8f0ec_0%,_transparent_50%)]" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-16 lg:px-8 lg:pb-12 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <EUBadge
              label={euBadgeLabel}
              className="mb-6 border border-[#003399]/10 bg-white shadow-sm"
            />
            <h1 className="max-w-xl font-heading text-4xl font-bold leading-[1.08] tracking-tight text-text lg:text-5xl xl:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-text-muted">{subtitle}</p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-text-muted/90">{ecosystemIntro}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={primaryCta.href}
                className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary-light"
              >
                {primaryCta.label}
              </Link>
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="rounded-full border-2 border-primary/20 px-8 py-3.5 text-sm font-semibold text-primary transition hover:border-primary/40 hover:bg-primary/5"
                >
                  {secondaryCta.label}
                </Link>
              )}
              <a
                href="https://redi.business/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-accent/30 bg-accent/10 px-8 py-3.5 text-sm font-semibold text-text transition hover:bg-accent/20"
              >
                REDI.business →
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none lg:pl-4">
            <HeroEcosystem labels={ecosystemLabels} />
          </div>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-[#003399] via-accent to-primary" />
    </section>
  );
}
