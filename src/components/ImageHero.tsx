import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { EUBadge } from "@/components/EUEmblem";

interface ImageHeroProps {
  title: string;
  subtitle?: string;
  image: string;
  imageAlt?: string;
  badge?: string;
  euBadge?: boolean;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  backLink?: { label: string; href: string };
}

export function ImageHero({
  title,
  subtitle,
  image,
  imageAlt = "",
  badge,
  euBadge = false,
  primaryCta,
  secondaryCta,
  backLink,
}: ImageHeroProps) {
  return (
    <section className="relative min-h-[420px] overflow-hidden lg:min-h-[500px]">
      <Image
        src={image}
        alt={imageAlt || title}
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-[#003399] via-accent to-primary" />
      <div className="relative mx-auto flex min-h-[420px] max-w-7xl flex-col justify-end px-4 py-14 lg:min-h-[500px] lg:px-8 lg:py-20">
        {backLink && (
          <Link href={backLink.href} className="mb-6 text-sm font-medium text-white/80 hover:text-accent">
            ← {backLink.label}
          </Link>
        )}
        {euBadge ? (
          <EUBadge label={badge ?? "EU Funded"} className="mb-4" />
        ) : badge ? (
          <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-text">
            {badge}
          </span>
        ) : null}
        <h1 className="max-w-4xl font-heading text-4xl font-bold leading-[1.08] text-white drop-shadow-sm lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90">{subtitle}</p>
        )}
        {(primaryCta || secondaryCta) && (
          <div className="mt-8 flex flex-wrap gap-4">
            {primaryCta && (
              <Link
                href={primaryCta.href}
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-text shadow-lg hover:bg-accent-light"
              >
                {primaryCta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/10"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
