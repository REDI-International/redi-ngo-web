import { notFound } from "next/navigation";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getNewsArticle, getNewsArticles } from "@/lib/content";

export async function generateStaticParams() {
  const articles = await getNewsArticles();
  return routing.locales.flatMap((locale) =>
    articles.map((a) => ({ locale, slug: a.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const article = await getNewsArticle(slug);
  return { title: article?.title ?? "News" };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = await getNewsArticle(slug);
  if (!article) notFound();

  return (
    <>
      <section className="bg-primary py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <Link href="/news" className="text-sm text-white/70 hover:text-accent">
            ← Back to News
          </Link>
          {article.publishedAt && (
            <time className="mt-4 block text-sm text-white/70">{article.publishedAt}</time>
          )}
          <h1 className="mt-2 font-heading text-3xl font-bold lg:text-4xl">{article.title}</h1>
        </div>
      </section>
      {article.image && (
        <div className="relative mx-auto -mt-8 max-w-3xl px-4 lg:px-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-surface-dark shadow-lg">
            <Image src={article.image} alt="" fill className="object-cover" sizes="768px" priority />
          </div>
        </div>
      )}
      <article className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        <p className="text-lg leading-relaxed text-text-muted whitespace-pre-line">{article.body || article.excerpt}</p>
      </article>
    </>
  );
}
