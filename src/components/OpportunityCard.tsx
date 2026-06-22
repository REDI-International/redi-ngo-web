import Image from "next/image";
import { Link } from "@/i18n/navigation";

export interface Opportunity {
  slug: string;
  title: string;
  excerpt: string;
  type: "tender" | "job" | "grant";
  status: "open" | "closed" | "ongoing";
  country?: string;
  deadline?: string;
  deadlineDate?: string;
  deadlineLabel?: string;
  reference?: string;
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
  const statusColors = {
    open: "bg-emerald-100 text-emerald-800",
    closed: "bg-gray-100 text-gray-600",
    ongoing: "bg-blue-100 text-blue-800",
  };
  const statusLabels = { open: "Open", closed: "Closed", ongoing: "Ongoing" };

  return (
    <Link
      href={item.href}
      className={`group flex overflow-hidden rounded-2xl bg-white shadow-sm ring-1 transition hover:shadow-lg ${
        item.status === "closed" ? "opacity-75 ring-black/5" : "ring-black/5"
      }`}
    >
      {item.image && (
        <div className="relative hidden w-32 shrink-0 sm:block lg:w-40">
          <Image src={item.image} alt="" fill className="object-cover" sizes="160px" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusColors[item.status]}`}>
            {statusLabels[item.status]}
          </span>
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
        {item.reference && (
          <p className="mt-1 text-xs text-text-muted">Ref: {item.reference}</p>
        )}
        <p className="mt-2 flex-1 text-sm text-text-muted line-clamp-2">{item.excerpt}</p>
        {item.deadlineLabel && (
          <p className={`mt-3 text-xs font-semibold ${item.status === "open" ? "text-emerald-700" : "text-text-muted"}`}>
            {item.deadlineLabel}
          </p>
        )}
      </div>
    </Link>
  );
}
