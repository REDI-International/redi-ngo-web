import Image from "next/image";
import { Link } from "@/i18n/navigation";

export interface Opportunity {
  slug: string;
  title: string;
  excerpt: string;
  type: "tender" | "job" | "grant";
  country?: string;
  deadline?: string;
  image?: string;
  href: string;
}

export function OpportunityCard({ item }: { item: Opportunity }) {
  const typeLabels = { tender: "Tender", job: "Job", grant: "Grant" };
  const typeColors = {
    tender: "bg-[#003399] text-white",
    job: "bg-primary text-white",
    grant: "bg-accent text-text",
  };

  return (
    <Link
      href={item.href}
      className="group flex overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-lg"
    >
      {item.image && (
        <div className="relative hidden w-36 shrink-0 sm:block lg:w-44">
          <Image
            src={item.image}
            alt=""
            fill
            className="object-cover"
            sizes="176px"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${typeColors[item.type]}`}>
            {typeLabels[item.type]}
          </span>
          {item.country && (
            <span className="text-xs text-text-muted">{item.country}</span>
          )}
        </div>
        <h3 className="mt-2 font-heading text-base font-bold text-primary group-hover:text-primary-light line-clamp-2">
          {item.title}
        </h3>
        <p className="mt-2 flex-1 text-sm text-text-muted line-clamp-2">{item.excerpt}</p>
        {item.deadline && (
          <p className="mt-3 text-xs font-semibold text-red-700">
            Deadline: {item.deadline}
          </p>
        )}
      </div>
    </Link>
  );
}
