import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { siteConfig, offices } from "@/content/site";
import { EUEmblem } from "@/components/EUEmblem";
import type { ResolvedNavItem } from "@/lib/navigation";

export async function Footer({ items }: { items: ResolvedNavItem[] }) {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="inline-flex rounded-xl bg-white px-4 py-3">
              <Image
                src="/brand/redi-logo.png"
                alt={siteConfig.name}
                width={400}
                height={189}
                className="h-10 w-auto"
              />
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/80">
              {siteConfig.description}
            </p>
            <div className="mt-6 rounded-lg bg-white/10 p-4">
              <EUEmblem variant="co-funded" theme="dark" />
              <p className="mt-2 text-xs text-white/60">
                REDI programmes are co-funded by the European Union and international partners.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="font-heading text-sm font-semibold uppercase tracking-wide text-accent">
              Navigation
            </p>
            <ul className="mt-4 space-y-2.5">
              {items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/80 hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="font-heading text-sm font-semibold uppercase tracking-wide text-accent">
              Our offices
            </p>
            <ul className="mt-4 space-y-4">
              {offices.map((office) => (
                <li key={office.country}>
                  <p className="text-sm font-semibold text-white">{office.country}</p>
                  <p className="text-sm text-white/70">{office.address}</p>
                </li>
              ))}
            </ul>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
            >
              {siteConfig.email}
            </a>
            <div className="mt-4 flex flex-wrap gap-4">
              <a href={siteConfig.social.facebook} className="text-sm text-white/80 hover:text-accent" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
              <a href={siteConfig.social.instagram} className="text-sm text-white/80 hover:text-accent" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a href={siteConfig.social.linkedin} className="text-sm text-white/80 hover:text-accent" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/60">
        © {year} {siteConfig.name}. {t("footer.rights")}
      </div>
    </footer>
  );
}
