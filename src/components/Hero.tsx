import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { heroImages } from "@/content/media";
import { EUBadge } from "@/components/EUEmblem";

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
    <section className="relative min-h-[540px] overflow-hidden lg:min-h-[640px]">
      <Image src={bg} alt="" fill priority className="object-cover object-center" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-[#003399] via-accent to-primary" />
      <div className="relative mx-auto flex min-h-[540px] max-w-7xl flex-col justify-center px-4 py-20 lg:min-h-[640px] lg:px-8">
        <EUBadge label="EU-Funded Programmes" className="mb-5" />
        <h1 className="max-w-3xl font-heading text-4xl font-bold leading-[1.05] text-white drop-shadow-sm lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/90">{subtitle}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href={primaryCta.href}
            className="rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-text shadow-lg transition hover:bg-accent-light"
          >
            {primaryCta.label}
          </Link>
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className="rounded-full border-2 border-white/70 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
