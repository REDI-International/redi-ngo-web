import Image from "next/image";
import { listPageSections } from "@/db/queries";
import type { SectionContent, SectionWidth } from "@/lib/admin/page-section-actions";

function widthClass(width: SectionWidth | undefined): string {
  switch (width) {
    case "half":
      return "md:col-span-1";
    case "third":
      return "md:col-span-1 lg:col-span-1";
    default:
      return "md:col-span-2 lg:col-span-3";
  }
}

export async function HomePageBlocks() {
  const sections = await listPageSections("homepage");
  const published = sections.filter((s) => s.published);
  if (!published.length) return null;

  const hasMixedWidths = published.some(
    (s) => (s.content as SectionContent | null)?.width && (s.content as SectionContent).width !== "full",
  );
  const containerGrid = hasMixedWidths ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1";

  return (
    <section className="bg-[#f7f5f0] py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className={`grid gap-6 ${containerGrid}`}>
          {published.map((section) => {
            const content = (section.content as SectionContent | null) ?? {};
            const width = content.width ?? "full";
            const body = content.body ?? content.text ?? "";
            return (
              <article
                key={section.id}
                className={`overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm ${widthClass(width)}`}
              >
                {content.image && (
                  <div className="relative aspect-[16/9] w-full bg-[#fafafa]">
                    <Image
                      src={content.image}
                      alt={section.title ?? ""}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-6 lg:p-8">
                  {section.title && (
                    <h2 className="font-heading text-2xl font-bold tracking-tight text-text">{section.title}</h2>
                  )}
                  {body && (
                    <p className="mt-3 text-base leading-relaxed text-text-muted whitespace-pre-wrap">{body}</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export async function getHomeHeroOverride(): Promise<{ title?: string; subtitle?: string; image?: string } | null> {
  const sections = await listPageSections("homepage");
  const hero = sections.find((s) => s.sectionKey === "hero" && s.published);
  if (!hero) return null;
  const content = (hero.content as SectionContent | null) ?? {};
  return {
    title: hero.title ?? content.headline,
    subtitle: content.body ?? content.text,
    image: content.image,
  };
}
