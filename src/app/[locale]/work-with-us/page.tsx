import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ImageHero } from "@/components/ImageHero";
import { EUBadge } from "@/components/EUEmblem";
import { OpportunityCard } from "@/components/OpportunityCard";
import { getTenders, getJobs, toOpportunity, heroImages } from "@/lib/content";
import { getFeaturedSocialStories } from "@/lib/social";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "workWithUs" });
  return { title: t("title") };
}

export default async function WorkWithUsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("workWithUs");

  const [allTenders, allJobs] = await Promise.all([getTenders(), getJobs()]);
  const openTenders = allTenders.filter((item) => item.parsedStatus === "open");
  const openJobs = allJobs.filter((item) => item.parsedStatus === "open");

  const recentTenders = openTenders
    .slice(0, 4)
    .map((item) => toOpportunity(item, item.type === "grant" ? "grant" : "tender"));
  const recentJobs = openJobs.slice(0, 4).map((item) => toOpportunity(item, "job"));

  const heroImage = heroImages.home;
  const socialImages = getFeaturedSocialStories(2);
  const tenderCardImage = socialImages[0]?.image ?? heroImages.tenders;
  const jobCardImage = socialImages[1]?.image ?? heroImages.jobs;

  const openTenderCount = openTenders.length;
  const openJobCount = openJobs.length;

  return (
    <>
      <ImageHero
        title={t("title")}
        subtitle={t("subtitle")}
        image={heroImage}
        badge="EU Funded Opportunities"
        euBadge
      />

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <Link href="/work-with-us/tenders" className="group relative overflow-hidden rounded-2xl lg:col-span-2 lg:row-span-2">
            <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[400px]">
              <Image src={tenderCardImage} alt="" fill className="object-cover transition group-hover:scale-105" sizes="66vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 p-8">
                <EUBadge label="Tenders" />
                {openTenderCount > 0 && (
                  <span className="ml-2 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
                    {openTenderCount} open
                  </span>
                )}
                <h2 className="mt-3 font-heading text-3xl font-bold text-white">{t("tenders")}</h2>
                <p className="mt-2 text-white/80">{t("tendersDesc")}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-accent">View all →</span>
              </div>
            </div>
          </Link>

          <Link href="/work-with-us/jobs" className="group relative overflow-hidden rounded-2xl">
            <div className="relative aspect-[16/10]">
              <Image src={jobCardImage} alt="" fill className="object-cover transition group-hover:scale-105" sizes="33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 p-6">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">JOBS</span>
                {openJobCount > 0 && (
                  <span className="ml-2 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
                    {openJobCount} open
                  </span>
                )}
                <h2 className="mt-2 font-heading text-xl font-bold text-white">{t("jobs")}</h2>
                <span className="mt-2 inline-block text-sm font-semibold text-accent">View all →</span>
              </div>
            </div>
          </Link>

          <Link href="/contact" className="group relative overflow-hidden rounded-2xl bg-primary p-8 text-white">
            <h2 className="font-heading text-xl font-bold">{t("volunteer")}</h2>
            <p className="mt-2 text-sm text-white/80">{t("volunteerDesc")}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-accent">Get in touch →</span>
          </Link>
        </div>
      </section>

      {recentTenders.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-5xl px-4 lg:px-8">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-heading text-2xl font-bold text-primary">{t("tenders")}</h2>
              <Link href="/work-with-us/tenders" className="text-sm font-semibold text-accent">View all →</Link>
            </div>
            <div className="grid gap-4">
              {recentTenders.map((item) => (
                <OpportunityCard key={item.slug} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {recentJobs.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-heading text-2xl font-bold text-primary">{t("jobs")}</h2>
            <Link href="/work-with-us/jobs" className="text-sm font-semibold text-accent">View all →</Link>
          </div>
          <div className="grid gap-4">
            {recentJobs.map((item) => (
              <OpportunityCard key={item.slug} item={item} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
