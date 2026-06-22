import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/content/projects";
import { projectImages } from "@/content/media";

export function ProjectCardVisual({
  project,
  learnMore,
  featured = false,
}: {
  project: Project;
  learnMore: string;
  featured?: boolean;
}) {
  const image = project.image ?? projectImages[project.slug];

  return (
    <article
      className={`group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-xl ${
        featured ? "lg:col-span-2 lg:row-span-2" : ""
      }`}
    >
      <div className={`relative overflow-hidden ${featured ? "aspect-[16/9] lg:aspect-[2/1]" : "aspect-[16/10]"}`}>
        {image ? (
          <Image
            src={image}
            alt={project.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes={featured ? "(max-width:1024px) 100vw, 66vw" : "(max-width:768px) 100vw, 33vw"}
          />
        ) : (
          <div className="absolute inset-0 bg-primary/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
              project.status === "active"
                ? "bg-accent text-text"
                : "bg-white/90 text-text-muted"
            }`}
          >
            {project.status}
          </span>
          {project.funder === "European Union" && (
            <span className="rounded-full bg-[#003399] px-3 py-1 text-xs font-bold text-white">
              🇪🇺 EU Funded
            </span>
          )}
        </div>
        <div className="absolute bottom-0 p-5 lg:p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            {project.programme}
          </p>
          <h3 className={`mt-1 font-heading font-bold text-white ${featured ? "text-2xl lg:text-3xl" : "text-lg"}`}>
            {project.title}
          </h3>
        </div>
      </div>
      <div className="p-5 lg:p-6">
        <p className="text-sm leading-relaxed text-text-muted line-clamp-3">{project.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.countries.map((c) => (
            <span key={c} className="rounded-full bg-surface px-3 py-1 text-xs text-text-muted">
              {c}
            </span>
          ))}
        </div>
        <Link
          href={`/projects/${project.slug}`}
          className="mt-5 inline-flex items-center text-sm font-semibold text-primary hover:text-accent"
        >
          {learnMore} →
        </Link>
      </div>
    </article>
  );
}
