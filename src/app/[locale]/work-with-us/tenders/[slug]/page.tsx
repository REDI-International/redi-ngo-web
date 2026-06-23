import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getTender, getTenders } from "@/lib/content";

export async function generateStaticParams() {
  const tenders = await getTenders();
  return routing.locales.flatMap((locale) =>
    tenders.map((t) => ({ locale, slug: t.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const tender = await getTender(slug);
  return { title: tender?.title ?? "Tender" };
}

export default async function TenderDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const tender = await getTender(slug);
  if (!tender) notFound();

  return (
    <>
      <section className="bg-primary py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <Link href="/work-with-us/tenders" className="text-sm text-white/70 hover:text-accent">
            ← Back to Tenders
          </Link>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${
              tender.parsedStatus === "open" ? "bg-emerald-400 text-emerald-950" : "bg-white/20 text-white"
            }`}>
              {tender.parsedStatus === "open" ? "Open" : "Closed"}
            </span>
            {tender.country && (
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs">{tender.country}</span>
            )}
          </div>
          <h1 className="mt-4 font-heading text-2xl font-bold lg:text-3xl">{tender.title}</h1>
          {tender.reference && (
            <p className="mt-2 text-sm text-white/70">Reference: {tender.reference}</p>
          )}
          <p className={`mt-3 text-sm font-semibold ${tender.parsedStatus === "open" ? "text-emerald-300" : "text-white/60"}`}>
            {tender.deadlineLabel}
          </p>
        </div>
      </section>
      <article className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        <p className="text-lg leading-relaxed text-text-muted whitespace-pre-line">{tender.body || tender.excerpt}</p>
      </article>
    </>
  );
}
