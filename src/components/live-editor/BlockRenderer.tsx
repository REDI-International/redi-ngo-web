import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Hero } from "@/components/Hero";
import { EmpowermentStatement } from "@/components/EmpowermentStatement";
import { PillarsSection } from "@/components/PillarsSection";
import { StatsBar } from "@/components/StatsBar";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectCardVisual } from "@/components/ProjectCardVisual";
import { StoryCard } from "@/components/StoryCard";
import { OpportunityCard } from "@/components/OpportunityCard";
import { SocialStoryCard, SocialFollowCard } from "@/components/SocialStoryCard";
import { Link } from "@/i18n/navigation";
import { stats } from "@/content/site";
import { projects } from "@/content/projects";
import { getNewsArticles, getFeaturedOpportunities } from "@/lib/content";
import { getFeaturedSocialStories, socialPages } from "@/lib/social";
import type { Locale } from "@/i18n/routing";
import type { PageBlock } from "@/lib/blocks/types";
import { BlockPreview } from "./BlockPreview";

export async function ServerBlockRenderer({
  block,
  locale,
  pageVariant = "home",
}: {
  block: PageBlock;
  locale: string;
  pageVariant?: "home" | "about";
}) {
  if (!block.published) return null;

  switch (block.blockType) {
    case "hero": {
      if (pageVariant === "about") {
        return (
          <section className="bg-primary py-16 text-white">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
              <h1 className="font-heading text-4xl font-bold">{block.title ?? "About"}</h1>
              {block.subtitle && <p className="mt-4 max-w-2xl text-lg text-white/80">{block.subtitle}</p>}
            </div>
          </section>
        );
      }
      const t = await getTranslations({ locale, namespace: "home" });
      return (
        <Hero
          locale={locale as Locale}
          title={block.title ?? t("heroTitle")}
          subtitle={block.subtitle ?? block.body ?? t("heroSubtitle")}
          euBadgeLabel={t("euBadgeLabel")}
          primaryCta={{
            label: (block.metadata.primaryCtaLabel as string) ?? t("viewProjects"),
            href: block.link ?? "/projects",
          }}
          secondaryCta={{ label: t("openOpportunities"), href: "/work-with-us/tenders" }}
          showcase={{
            statValue: t("heroStatValue"),
            statLabel: t("heroStatLabel"),
            tag: t("heroShowcaseTag"),
            coFunded: t("heroCoFunded"),
          }}
        />
      );
    }

    case "empowerment":
      return (
        <EmpowermentStatement
          title={block.title ?? ""}
          body={block.body ?? ""}
          highlight={block.subtitle ?? ""}
          cta={(block.metadata.linkLabel as string) ?? "Learn more"}
          ctaHref={block.link ?? "/impact"}
          locale={locale as Locale}
        />
      );

    case "pillars": {
      const t = await getTranslations({ locale, namespace: "home" });
      const pillars = [
        { key: "learn", title: t("pillarLearnTitle"), description: t("pillarLearnDesc"), icon: "learn" as const, color: "#2563EB", bg: "#EEF2FF" },
        { key: "create", title: t("pillarCreateTitle"), description: t("pillarCreateDesc"), icon: "create" as const, color: "#F59E0B", bg: "#FFFBEB" },
        { key: "connect", title: t("pillarConnectTitle"), description: t("pillarConnectDesc"), icon: "connect" as const, color: "#EC4899", bg: "#FDF2F8" },
        { key: "finance", title: t("pillarFinanceTitle"), description: t("pillarFinanceDesc"), icon: "finance" as const, color: "#0D9488", bg: "#F0FDFA" },
        { key: "sell", title: t("pillarSellTitle"), description: t("pillarSellDesc"), icon: "sell" as const, color: "#7C3AED", bg: "#F5F3FF" },
      ];
      return (
        <PillarsSection
          title={block.title ?? t("pillarsTitle")}
          subtitle={block.subtitle ?? t("pillarsSubtitle")}
          cta={t("pillarsCta")}
          pillars={pillars}
        />
      );
    }

    case "stats":
      return <StatsBar stats={stats} />;

    case "projects": {
      const t = await getTranslations({ locale, namespace: "home" });
      const tProjects = await getTranslations({ locale, namespace: "projects" });
      const activeProjects = projects.filter((p) => p.status === "active");
      return (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <SectionHeading
              title={block.title ?? t("euProjects")}
              subtitle={block.subtitle ?? t("euProjectsDesc")}
              href="/projects"
              linkLabel={t("viewAllProjects")}
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeProjects.slice(0, 3).map((project, i) => (
                <ProjectCardVisual key={project.slug} project={project} learnMore={tProjects("learnMore")} featured={i === 0} />
              ))}
            </div>
          </div>
        </section>
      );
    }

    case "collage": {
      const t = await getTranslations({ locale, namespace: "home" });
      const socialStories = getFeaturedSocialStories(6);
      return (
        <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <SectionHeading
            title={block.title ?? t("fromSocial")}
            subtitle={block.subtitle ?? t("fromSocialDesc")}
            href="/media"
            linkLabel={t("viewGallery")}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {socialStories.map((story) => (
              <SocialStoryCard key={story.id} title={story.title} caption={story.caption} image={story.image} url={story.url} platform={story.platform} />
            ))}
            {socialPages.slice(0, Math.max(0, 4 - socialStories.length)).map((page) => (
              <SocialFollowCard key={page.id} platform={page.platform} label={page.label} caption={page.caption} url={page.url} />
            ))}
          </div>
        </section>
      );
    }

    case "news": {
      const t = await getTranslations({ locale, namespace: "home" });
      const tNews = await getTranslations({ locale, namespace: "news" });
      const latestNews = await getNewsArticles(3);
      return (
        <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <SectionHeading title={block.title ?? t("latestStories")} href="/news" linkLabel={t("allNews")} />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestNews.map((article) => (
              <StoryCard key={article.slug} article={article} readMore={tNews("readMore")} />
            ))}
          </div>
        </section>
      );
    }

    case "cta": {
      const t = await getTranslations({ locale, namespace: "home" });
      const tWork = await getTranslations({ locale, namespace: "workWithUs" });
      const openOpportunities = await getFeaturedOpportunities(4);
      return (
        <section className="bg-primary py-16 text-white">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <SectionHeading
              title={block.title ?? t("openOpportunities")}
              subtitle={block.subtitle ?? t("openOpportunitiesDesc")}
              href="/work-with-us/tenders"
              linkLabel={tWork("tenders")}
            />
            <div className="grid gap-4 md:grid-cols-2">
              {openOpportunities.map((item) => (
                <OpportunityCard key={item.slug} item={item} />
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={block.link ?? "/work-with-us/tenders"} className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-text">
                {(block.metadata.linkLabel as string) ?? `${tWork("tenders")} →`}
              </Link>
            </div>
          </div>
        </section>
      );
    }

    case "spacer":
      return <div style={{ height: Number(block.metadata.height ?? 48) }} aria-hidden="true" />;

    case "image":
      return (
        <section className="py-8">
          <div className={`mx-auto px-4 lg:px-8 ${block.width === "full" ? "max-w-7xl" : block.width === "half" ? "max-w-3xl" : "max-w-xl"}`}>
            {block.imageUrl && (
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                <Image src={block.imageUrl} alt={block.title ?? ""} fill className="object-cover" sizes="80vw" />
              </div>
            )}
            {block.title && <p className="mt-3 text-center text-sm text-text-muted">{block.title}</p>}
          </div>
        </section>
      );

    case "text":
    default:
      return (
        <section className="py-12">
          <div className={`mx-auto px-4 lg:px-8 ${block.width === "full" ? "max-w-7xl" : block.width === "half" ? "max-w-3xl" : "max-w-xl"}`}>
            {block.title && <h2 className="font-heading text-2xl font-bold text-text">{block.title}</h2>}
            {block.subtitle && <p className="mt-2 text-lg text-text-muted">{block.subtitle}</p>}
            {block.body && <p className="mt-4 whitespace-pre-wrap leading-relaxed text-text-muted">{block.body}</p>}
          </div>
        </section>
      );
  }
}

export async function BlockDrivenPage({
  blocks,
  locale,
  pageVariant = "home",
}: {
  blocks: PageBlock[];
  locale: string;
  pageVariant?: "home" | "about";
}) {
  const published = blocks.filter((b) => b.published);
  return (
    <>
      {published.map((block) => (
        <div key={block.id}>
          <ServerBlockRenderer block={block} locale={locale} pageVariant={pageVariant} />
        </div>
      ))}
    </>
  );
}

/** Client-safe render function factory for LivePageEditor */
export function renderBlockPreview(block: PageBlock) {
  return <BlockPreview block={block} />;
}
