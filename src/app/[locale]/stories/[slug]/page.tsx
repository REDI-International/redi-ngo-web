import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { entrepreneurStories, getEntrepreneurStory } from "@/content/entrepreneur-stories";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    entrepreneurStories.map((story) => ({ locale, slug: story.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const story = getEntrepreneurStory(slug);
  if (!story) return { title: "Story" };
  const loc = locale as Locale;
  return {
    title: `${story.name[loc]} — ${story.title[loc]}`,
    description: story.excerpt[loc],
  };
}

export default async function EntrepreneurStoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const story = getEntrepreneurStory(slug);
  if (!story) notFound();

  const t = await getTranslations({ locale, namespace: "stories" });
  const otherStories = entrepreneurStories.filter((s) => s.slug !== slug);

  return (
    <>
      <section className="relative min-h-[420px] overflow-hidden lg:min-h-[480px]">
        <Image
          src={story.image}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30" />
        <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-[#003399] via-accent to-primary" />
        <div className="relative mx-auto flex min-h-[420px] max-w-7xl flex-col justify-end px-4 py-14 lg:min-h-[480px] lg:px-8 lg:py-20">
          <Link href="/" className="mb-6 text-sm font-medium text-white/80 hover:text-accent">
            ← {t("backHome")}
          </Link>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">{story.program[loc]}</p>
          <p className="mt-2 text-sm text-white/80">
            {story.name[loc]} · {story.role[loc]} · {story.location[loc]}
          </p>
          <h1 className="mt-3 max-w-3xl font-heading text-4xl font-bold leading-[1.08] text-white drop-shadow-sm lg:text-5xl">
            {story.title[loc]}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90">{story.excerpt[loc]}</p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        <p className="text-lg leading-relaxed text-text-muted whitespace-pre-line">{story.body[loc]}</p>
        <blockquote className="mt-8 rounded-2xl border border-primary/10 bg-primary/5 px-6 py-5">
          <p className="text-sm font-medium leading-relaxed text-primary">{story.highlight[loc]}</p>
        </blockquote>
      </article>

      <section className="border-t border-surface-dark bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-primary">{t("moreStories")}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {otherStories.slice(0, 4).map((other) => (
              <Link
                key={other.slug}
                href={`/stories/${other.slug}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={other.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 50vw, 280px"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-xs font-medium text-white/80">{other.name[loc]}</p>
                    <p className="mt-1 font-heading text-sm font-bold text-white">{other.title[loc]}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
