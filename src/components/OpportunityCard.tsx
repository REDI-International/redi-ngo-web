import { Link } from "@/i18n/navigation";
import {
  FileCheckIcon,
  BriefcaseIcon,
  CoinsIcon,
  MapPinIcon,
  CalendarIcon,
  TagIcon,
  ArrowRightIcon,
} from "@/components/icons";

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

const TYPE = {
  tender: { label: "Tender", Icon: FileCheckIcon, accent: "text-[#003399]", chip: "bg-[#003399]/10 text-[#003399]", purpose: "Procurement / call for proposals" },
  job: { label: "Job", Icon: BriefcaseIcon, accent: "text-primary", chip: "bg-primary/10 text-primary", purpose: "Career / internship" },
  grant: { label: "Grant", Icon: CoinsIcon, accent: "text-accent", chip: "bg-accent/15 text-[#8a6a00]", purpose: "Funding for entrepreneurs" },
} as const;

export function OpportunityCard({ item }: { item: Opportunity }) {
  const t = TYPE[item.type];
  const isOpen = item.status === "open";

  return (
    <Link
      href={item.href}
      className={`group relative flex overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-lg ${
        isOpen ? "" : "opacity-90"
      }`}
    >
      <span
        aria-hidden
        className={`w-1.5 shrink-0 ${isOpen ? "bg-emerald-500" : "bg-slate-300"}`}
      />

      <div className="flex flex-1 gap-4 p-5">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${t.chip}`}>
          <t.Icon className="h-6 w-6" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                isOpen ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-emerald-500" : "bg-slate-400"}`} />
              {isOpen ? "Open" : "Closed"}
            </span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${t.chip}`}>{t.label}</span>
          </div>

          <h3 className="mt-2.5 font-heading text-lg font-bold leading-snug text-text group-hover:text-primary line-clamp-2">
            {item.title}
          </h3>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-text-muted/70">{t.purpose}</p>

          <p className="mt-2 text-sm leading-relaxed text-text-muted line-clamp-2">{item.excerpt}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-muted">
            {item.country && (
              <span className="inline-flex items-center gap-1.5">
                <MapPinIcon className="h-4 w-4 text-text-muted/60" />
                {item.country}
              </span>
            )}
            {item.deadlineLabel && (
              <span
                className={`inline-flex items-center gap-1.5 font-semibold ${
                  isOpen ? "text-emerald-700" : "text-text-muted"
                }`}
              >
                <CalendarIcon className="h-4 w-4" />
                {item.deadlineLabel}
              </span>
            )}
            {item.reference && (
              <span className="inline-flex items-center gap-1.5">
                <TagIcon className="h-4 w-4 text-text-muted/60" />
                {item.reference}
              </span>
            )}
          </div>
        </div>

        <ArrowRightIcon className="hidden h-5 w-5 shrink-0 self-center text-text-muted/40 transition group-hover:translate-x-1 group-hover:text-primary lg:block" />
      </div>
    </Link>
  );
}
