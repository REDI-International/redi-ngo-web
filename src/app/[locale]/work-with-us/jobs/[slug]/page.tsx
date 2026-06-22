import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getJob, getJobs } from "@/lib/content";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getJobs().map((j) => ({ locale, slug: j.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return { title: getJob(slug)?.title ?? "Job" };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const job = getJob(slug);
  if (!job) notFound();

  return (
    <>
      <section className="bg-primary py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <Link href="/work-with-us/jobs" className="text-sm text-white/70 hover:text-accent">
            ← Back to Jobs
          </Link>
          <span className="mt-4 block text-xs font-bold uppercase tracking-wide text-accent">
            Job Opportunity
          </span>
          <h1 className="mt-2 font-heading text-2xl font-bold lg:text-3xl">{job.title}</h1>
          {job.country && <p className="mt-2 text-white/80">{job.country}</p>}
          {job.deadline && (
            <p className="mt-4 text-sm font-semibold text-red-300">Deadline: {job.deadline}</p>
          )}
        </div>
      </section>
      <article className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        <p className="text-lg leading-relaxed text-text-muted whitespace-pre-line">{job.body || job.excerpt}</p>
      </article>
    </>
  );
}
