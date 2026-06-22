import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { NewsArticle } from "@/lib/content";
import { ArrowRightIcon, CalendarIcon } from "@/components/icons";

function formatDate(value?: string): string | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function StoryCard({
  article,
  readMore,
  featured = false,
}: {
  article: NewsArticle;
  readMore: string;
  featured?: boolean;
}) {
  const date = formatDate(article.publishedAt);

  return (
    <Link
      href={`/news/${article.slug}`}
      className={`group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-xl ${
        featured ? "lg:flex-row" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden bg-surface-dark ${
          featured ? "aspect-[16/10] lg:aspect-auto lg:w-1/2" : "aspect-[16/9]"
        }`}
      >
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes={featured ? "(max-width:1024px) 100vw, 50vw" : "(max-width:768px) 100vw, 33vw"}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-light" />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary shadow-sm">
          News
        </span>
      </div>

      <div className={`flex flex-1 flex-col p-5 ${featured ? "lg:justify-center lg:p-8" : ""}`}>
        {date && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted">
            <CalendarIcon className="h-3.5 w-3.5" />
            {date}
          </span>
        )}
        <h3
          className={`mt-2 font-heading font-bold leading-snug text-text group-hover:text-primary ${
            featured ? "text-2xl line-clamp-3 lg:text-3xl" : "text-lg line-clamp-2"
          }`}
        >
          {article.title}
        </h3>
        <p className={`mt-2 flex-1 text-sm leading-relaxed text-text-muted ${featured ? "line-clamp-4" : "line-clamp-3"}`}>
          {article.excerpt}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
          {readMore}
          <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
