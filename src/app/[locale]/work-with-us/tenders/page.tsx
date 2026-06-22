import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ImageHero } from "@/components/ImageHero";
import { OpportunityExplorer } from "@/components/OpportunityExplorer";
import { getTenders, toOpportunity, heroImages } from "@/lib/content";
import { classifyOpportunity } from "@/lib/opportunities";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "workWithUs" });
  return { title: t("tenders") };
}

export default async function TendersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("workWithUs");
  const tExplorer = await getTranslations("explorer");

  const items = getTenders().map((item) =>
    toOpportunity(item, classifyOpportunity(item.slug, item.title) === "grant" ? "grant" : "tender"),
  );

  return (
    <>
      <ImageHero
        title={t("tenders")}
        subtitle={t("tendersDesc")}
        image={heroImages.tenders}
        badge="EU Funded — Procurement"
        euBadge
        backLink={{ label: t("title"), href: "/work-with-us" }}
        secondaryCta={{ label: t("jobs"), href: "/work-with-us/jobs" }}
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
