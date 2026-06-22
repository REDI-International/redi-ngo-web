import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { heroImages } from "@/content/media";

interface HeroProps {
  title: string;
  subtitle: string;
  image?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export function Hero({ title, subtitle, image, primaryCta, secondaryCta }: HeroProps) {
  const bg = image ?? heroImages.home;

  return (
    <section className="relative min-h-[520px] overflow-hidden lg:min-h-[600px]">
      <Image src={bg} alt="" fill priority className="object-cover" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/75 to-primary/30" />
      <div className="relative mx-auto flex min-h-[520px] max-w-7xl flex-col justify-center px-4 py-20 lg:min-h-[600px] lg:px-8">
        <span className="mb-4 inline-flex w-fit rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-text">
          🇪🇺 EU-Funded Programmes
        </span>
        <h1 className="max-w-3xl font-heading text-4xl font-bold leading-tight text-white lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/90">{subtitle}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href={primaryCta.href}
            className="rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-text hover:bg-accent-light"
          >
            {primaryCta.label}
          </Link>
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className="rounded-full border-2 border-white/60 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
