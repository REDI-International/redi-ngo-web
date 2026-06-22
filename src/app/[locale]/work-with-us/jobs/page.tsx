import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ImageHero } from "@/components/ImageHero";
import { OpportunityExplorer } from "@/components/OpportunityExplorer";
import { getJobs, toOpportunity, heroImages } from "@/lib/content";

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
  const tExplorer = await getTranslations("explorer");

  const items = getJobs().map((item) => toOpportunity(item, "job"));

  return (
    <>
      <ImageHero
        title={t("jobs")}
        subtitle={t("jobsDesc")}
        image={heroImages.jobs}
        badge="Careers & Internships"
        backLink={{ label: t("title"), href: "/work-with-us" }}
        secondaryCta={{ label: t("tenders"), href: "/work-with-us/tenders" }}
      />
      <section className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
        <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-surface-dark" />}>
          <OpportunityExplorer
            items={items}
            labels={{
              search: tExplorer("search"),
              country: tExplorer("country"),
              allCountries: tExplorer("allCountries"),
              open: tExplorer("open"),
              closed: tExplorer("closed"),
              all: tExplorer("all"),
              noResults: tExplorer("noResults"),
              showing: tExplorer("showing"),
            }}
          />
        </Suspense>
      </section>
    </>
  );
}
