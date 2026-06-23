import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ImageHero } from "@/components/ImageHero";
import { OpportunityExplorer } from "@/components/OpportunityExplorer";
import { getTenders, toOpportunity, heroImages } from "@/lib/content";

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

  const tenders = await getTenders();
  const items = tenders.map((item) =>
    toOpportunity(item, item.type === "grant" ? "grant" : "tender"),
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
      <section className="mx-auto max-w-5xl px-4 pt-12 lg:px-8">
        <div className="rounded-2xl border border-surface-dark bg-white p-6 shadow-sm lg:p-8">
          <p className="text-base leading-relaxed text-text-muted">{t("tendersIntro")}</p>
          <div className="mt-4 flex items-start gap-3 rounded-xl bg-surface p-4">
            <span className="mt-0.5 text-lg">📋</span>
            <div>
              <p className="text-sm font-bold text-primary">{t("howToApply")}</p>
              <p className="mt-1 text-sm text-text-muted">{t("howToApplyDesc")}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
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
