import Image from "next/image";
import { Link } from "@/i18n/navigation";

interface ImageHeroProps {
  title: string;
  subtitle?: string;
  image: string;
  imageAlt?: string;
  badge?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  backLink?: { label: string; href: string };
  overlay?: "dark" | "green";
}

export function ImageHero({
  title,
  subtitle,
  image,
  imageAlt = "",
  badge,
  primaryCta,
  secondaryCta,
  backLink,
  overlay = "dark",
}: ImageHeroProps) {
  const overlayClass =
    overlay === "green"
      ? "bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40"
      : "bg-gradient-to-r from-black/80 via-black/60 to-black/30";

  return (
    <section className="relative min-h-[420px] overflow-hidden lg:min-h-[520px]">
      <Image
        src={image}
        alt={imageAlt || title}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className={`absolute inset-0 ${overlayClass}`} />
      <div className="relative mx-auto flex min-h-[420px] max-w-7xl flex-col justify-end px-4 py-16 lg:min-h-[520px] lg:px-8 lg:py-20">
        {backLink && (
          <Link href={backLink.href} className="mb-6 text-sm text-white/70 hover:text-accent">
            ← {backLink.label}
          </Link>
        )}
        {badge && (
          <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-text">
            {badge}
          </span>
        )}
        <h1 className="max-w-4xl font-heading text-4xl font-bold leading-tight text-white lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg text-white/90">{subtitle}</p>
        )}
        {(primaryCta || secondaryCta) && (
          <div className="mt-8 flex flex-wrap gap-4">
            {primaryCta && (
              <Link
                href={primaryCta.href}
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-text hover:bg-accent-light"
              >
                {primaryCta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="rounded-full border border-white/50 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
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
