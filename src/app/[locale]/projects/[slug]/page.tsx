import { notFound } from "next/navigation";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ImageHero } from "@/components/ImageHero";
import { projects, getProject } from "@/content/projects";
import { Link } from "@/i18n/navigation";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return { title: getProject(slug)?.title ?? "Project" };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <ImageHero
        title={project.title}
        subtitle={project.summary}
        image={project.image!}
        badge={project.funder === "European Union" ? "🇪🇺 EU Funded" : project.programme}
        backLink={{ label: "Projects", href: "/projects" }}
      />
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-lg leading-relaxed text-text-muted">{project.description}</p>
            {project.externalUrl && (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-light"
              >
                Visit project page →
              </a>
            )}
          </div>
          <aside className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <h2 className="font-heading font-bold text-primary">Project details</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-text-muted">Programme</dt>
                  <dd className="font-medium">{project.programme}</dd>
                </div>
                <div>
                  <dt className="text-text-muted">Funder</dt>
                  <dd className="font-medium">{project.funder}</dd>
                </div>
                <div>
                  <dt className="text-text-muted">Status</dt>
                  <dd className="font-medium capitalize">{project.status}</dd>
                </div>
                <div>
                  <dt className="text-text-muted">Countries</dt>
                  <dd className="mt-1 flex flex-wrap gap-2">
                    {project.countries.map((c) => (
                      <span key={c} className="rounded-full bg-surface px-2 py-0.5 text-xs">
                        {c}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="rounded-2xl bg-primary p-6 text-white">
              <p className="font-heading font-bold">Work with us</p>
              <p className="mt-2 text-sm text-white/80">
                Explore open tenders and job opportunities on our EU-funded projects.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Link href="/work-with-us/tenders" className="text-sm font-semibold text-accent hover:underline">
                  Open tenders →
                </Link>
                <Link href="/work-with-us/jobs" className="text-sm font-semibold text-accent hover:underline">
                  Careers & internships →
                </Link>
              </div>
            </div>
          </aside>
        </div>
        {project.image && (
          <div className="relative mt-12 aspect-[21/9] overflow-hidden rounded-2xl">
            <Image src={project.image} alt={project.title} fill className="object-cover" sizes="100vw" />
          </div>
        )}
      </section>
    </>
  );
}
