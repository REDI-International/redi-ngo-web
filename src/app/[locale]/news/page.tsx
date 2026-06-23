import { getTranslations, setRequestLocale } from "next-intl/server";
import { ImageHero } from "@/components/ImageHero";
import { StoryCard } from "@/components/StoryCard";
import { getNewsArticles } from "@/lib/content";
import { heroImages } from "@/content/media";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  return { title: t("title") };
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("news");
  const articles = await getNewsArticles(25);
  const [featured, ...rest] = articles;

  return (
    <>
      <ImageHero
        title={t("title")}
        subtitle={t("subtitle")}
        image={heroImages.media}
      />
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        {featured && (
          <div className="mb-10">
            <StoryCard article={featured} readMore={t("readMore")} featured />
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((article) => (
            <StoryCard key={article.slug} article={article} readMore={t("readMore")} />
          ))}
        </div>
      </section>
    </>
  );
}
