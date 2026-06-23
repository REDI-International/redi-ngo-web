import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getJob, getJobs } from "@/lib/content";

export async function generateStaticParams() {
  const jobs = await getJobs();
  return routing.locales.flatMap((locale) =>
    jobs.map((j) => ({ locale, slug: j.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return { title: (await getJob(slug))?.title ?? "Job" };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const job = await getJob(slug);
  if (!job) notFound();

  return (
    <>
      <section className="bg-primary py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <Link href="/work-with-us/jobs" className="text-sm text-white/70 hover:text-accent">
            ← Back to Jobs
          </Link>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${
              job.parsedStatus === "open" ? "bg-emerald-400 text-emerald-950" : "bg-white/20 text-white"
            }`}>
              {job.parsedStatus === "open" ? "Open" : "Closed"}
            </span>
            {job.country && (
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs">{job.country}</span>
            )}
          </div>
          <h1 className="mt-4 font-heading text-2xl font-bold lg:text-3xl">{job.title}</h1>
          {job.reference && (
            <p className="mt-2 text-sm text-white/70">Reference: {job.reference}</p>
          )}
          <p className={`mt-3 text-sm font-semibold ${job.parsedStatus === "open" ? "text-emerald-300" : "text-white/60"}`}>
            {job.deadlineLabel}
          </p>
        </div>
      </section>
      <article className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        <p className="text-lg leading-relaxed text-text-muted whitespace-pre-line">{job.body || job.excerpt}</p>
      </article>
    </>
  );
}
