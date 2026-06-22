import { getTranslations, setRequestLocale } from "next-intl/server";
import { ImageHero } from "@/components/ImageHero";
import { OpportunityCard } from "@/components/OpportunityCard";
import { getJobs, toOpportunity } from "@/lib/content";
import { heroImages } from "@/content/media";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "workWithUs" });
  return { title: t("jobs") };
}

export default async function JobsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("workWithUs");
  const jobs = getJobs().map((item) => toOpportunity(item, "job"));

  return (
    <>
      <ImageHero
        title={t("jobs")}
        subtitle={t("jobsDesc")}
        image={heroImages.jobs}
        badge="Careers & Internships"
        backLink={{ label: t("title"), href: "/work-with-us" }}
        secondaryCta={{ label: "View tenders", href: "/work-with-us/tenders" }}
      />
      <section className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
        <p className="mb-8 text-sm text-text-muted">
          {jobs.length} open positions across REDI offices in the Western Balkans and Türkiye.
        </p>
        <div className="grid gap-4">
          {jobs.map((item) => (
            <OpportunityCard key={item.slug} item={item} />
          ))}
        </div>
      </section>
    </>
  );
}
