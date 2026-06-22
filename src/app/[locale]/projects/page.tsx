import { getTranslations, setRequestLocale } from "next-intl/server";
import { ImageHero } from "@/components/ImageHero";
import { ProjectCardVisual } from "@/components/ProjectCardVisual";
import { projects } from "@/content/projects";
import { heroImages } from "@/content/media";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  return { title: t("title") };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");

  const active = projects.filter((p) => p.status === "active");
  const completed = projects.filter((p) => p.status === "completed");
  const featured = active[0];

  return (
    <>
      <ImageHero
        title={t("title")}
        subtitle={t("subtitle")}
        image={heroImages.projects}
        badge="🇪🇺 EU-Funded Programmes"
        primaryCta={{ label: t("active"), href: "#active" }}
        secondaryCta={{ label: "Open tenders", href: "/work-with-us/tenders" }}
      />

      <section id="active" className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <h2 className="font-heading text-2xl font-bold text-primary">{t("active")} projects</h2>
        <p className="mt-2 text-text-muted">Current EU and partner-funded initiatives across 7 countries.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured && (
            <ProjectCardVisual project={featured} learnMore={t("learnMore")} featured />
          )}
          {active.filter((p) => p.slug !== featured?.slug).map((project) => (
            <ProjectCardVisual key={project.slug} project={project} learnMore={t("learnMore")} />
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-primary">{t("completed")} projects</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completed.map((project) => (
              <ProjectCardVisual key={project.slug} project={project} learnMore={t("learnMore")} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
