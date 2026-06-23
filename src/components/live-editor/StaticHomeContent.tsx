import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/Hero";
import { EmpowermentStatement } from "@/components/EmpowermentStatement";
import { PillarsSection } from "@/components/PillarsSection";
import { StatsBar } from "@/components/StatsBar";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectCardVisual } from "@/components/ProjectCardVisual";
import { StoryCard } from "@/components/StoryCard";
import { OpportunityCard } from "@/components/OpportunityCard";
import { SocialStoryCard, SocialFollowCard } from "@/components/SocialStoryCard";
import { YouTubeSection } from "@/components/YouTubeSection";
import { Link } from "@/i18n/navigation";
import { stats } from "@/content/site";
import { projects } from "@/content/projects";
import { getNewsArticles, getFeaturedOpportunities } from "@/lib/content";
import { getFeaturedSocialStories, socialPages } from "@/lib/social";
import type { Locale } from "@/i18n/routing";

export async function StaticHomeContent({ locale }: { locale: string }) {
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tProjects = await getTranslations("projects");
  const tNews = await getTranslations("news");
  const tWork = await getTranslations("workWithUs");

  const activeProjects = projects.filter((p) => p.status === "active");
  const [latestNews, openOpportunities] = await Promise.all([
    getNewsArticles(3),
    getFeaturedOpportunities(4),
  ]);
  const socialStories = getFeaturedSocialStories(6);

  const ecosystemLabels = {
    businessClubs: t("ecoBusinessClubs"),
    rediFund: t("ecoRediFund"),
    rediRecycling: t("ecoRediRecycling"),
    grantSupport: t("ecoGrantSupport"),
    technicalSupport: t("ecoTechnicalSupport"),
    euProjects: t("ecoEuProjects"),
    incubator: t("ecoIncubator"),
    hubTitle: t("ecoHubTitle"),
    hubSubtitle: t("ecoHubSubtitle"),
    funding: t("ecoFunding"),
    learning: t("ecoLearning"),
    advocacy: t("ecoAdvocacy"),
    community: t("ecoCommunity"),
    tools: t("ecoTools"),
  };

  const pillars = [
    { key: "learn", title: t("pillarLearnTitle"), description: t("pillarLearnDesc"), icon: "learn" as const, color: "#2563EB", bg: "#EEF2FF" },
    { key: "create", title: t("pillarCreateTitle"), description: t("pillarCreateDesc"), icon: "create" as const, color: "#F59E0B", bg: "#FFFBEB" },
    { key: "connect", title: t("pillarConnectTitle"), description: t("pillarConnectDesc"), icon: "connect" as const, color: "#EC4899", bg: "#FDF2F8" },
    { key: "finance", title: t("pillarFinanceTitle"), description: t("pillarFinanceDesc"), icon: "finance" as const, color: "#0D9488", bg: "#F0FDFA" },
    { key: "sell", title: t("pillarSellTitle"), description: t("pillarSellDesc"), icon: "sell" as const, color: "#7C3AED", bg: "#F5F3FF" },
  ];

  return (
    <>
      <Hero
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
        ecosystemIntro={t("heroEcosystemIntro")}
        euBadgeLabel={t("euBadgeLabel")}
        ecosystemLabels={ecosystemLabels}
        primaryCta={{ label: t("viewProjects"), href: "/projects" }}
        secondaryCta={{ label: t("openOpportunities"), href: "/work-with-us/tenders" }}
      />

      <EmpowermentStatement
        title={t("empowermentTitle")}
        body={t("empowermentBody")}
        highlight={t("empowermentHighlight")}
        cta={t("empowermentCta")}
        ctaHref="/impact"
        locale={locale as Locale}
      />

      <PillarsSection
        title={t("pillarsTitle")}
        subtitle={t("pillarsSubtitle")}
        cta={t("pillarsCta")}
        pillars={pillars}
      />

      <StatsBar stats={stats} />

      <YouTubeSection locale={locale as Locale} />

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            title={t("euProjects")}
            subtitle={t("euProjectsDesc")}
            href="/projects"
            linkLabel={t("viewAllProjects")}
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeProjects.slice(0, 3).map((project, i) => (
              <ProjectCardVisual
                key={project.slug}
                project={project}
                learnMore={tProjects("learnMore")}
                featured={i === 0}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <SectionHeading
          title={t("fromSocial")}
          subtitle={t("fromSocialDesc")}
          href="/media"
          linkLabel={t("viewGallery")}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {socialStories.map((story) => (
            <SocialStoryCard
              key={story.id}
              title={story.title}
              caption={story.caption}
              image={story.image}
              url={story.url}
              platform={story.platform}
            />
          ))}
          {socialPages.slice(0, Math.max(0, 4 - socialStories.length)).map((page) => (
            <SocialFollowCard
              key={page.id}
              platform={page.platform}
              label={page.label}
              caption={page.caption}
              url={page.url}
            />
          ))}
        </div>
      </section>

      <section className="bg-primary py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            title={t("openOpportunities")}
            subtitle={t("openOpportunitiesDesc")}
            href="/work-with-us/tenders"
            linkLabel={tWork("tenders")}
          />
          <div className="grid gap-4 md:grid-cols-2">
            {openOpportunities.map((item) => (
              <OpportunityCard key={item.slug} item={item} />
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/work-with-us/tenders" className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-text">
              {tWork("tenders")} →
            </Link>
            <Link href="/work-with-us/jobs" className="rounded-full border border-white/50 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
              {tWork("jobs")} →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <SectionHeading title={t("latestStories")} href="/news" linkLabel={t("allNews")} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latestNews.map((article) => (
            <StoryCard key={article.slug} article={article} readMore={tNews("readMore")} />
          ))}
        </div>
      </section>
    </>
  );
}
