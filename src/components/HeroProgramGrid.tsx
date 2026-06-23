interface ProgramItem {
  id: string;
  label: string;
  color: string;
  bg: string;
}

const PROGRAMS: Omit<ProgramItem, "label">[] = [
  { id: "businessClubs", color: "#E91E63", bg: "#FDF2F8" },
  { id: "rediFund", color: "#2D6A4F", bg: "#F0FDF4" },
  { id: "rediRecycling", color: "#009688", bg: "#F0FDFA" },
  { id: "grantSupport", color: "#D4A017", bg: "#FFFBEB" },
  { id: "technicalSupport", color: "#003399", bg: "#EEF2FF" },
  { id: "euProjects", color: "#003399", bg: "#EFF6FF" },
  { id: "incubator", color: "#1B4332", bg: "#ECFDF5" },
];

interface HeroProgramGridProps {
  labels: Record<string, string>;
}

export function HeroProgramGrid({ labels }: HeroProgramGridProps) {
  const items = PROGRAMS.map((p) => ({
    ...p,
    label: labels[p.id] ?? p.id,
  }));

  return (
    <div
      className="grid grid-cols-2 gap-3 sm:gap-3.5"
      role="list"
      aria-label="REDI programmes"
    >
      {items.map((item) => (
        <div
          key={item.id}
          role="listitem"
          className="group flex items-center gap-3 rounded-2xl border border-black/[0.06] bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition duration-200 hover:border-black/[0.1] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] sm:px-5 sm:py-4"
        >
          <span
            className="flex h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-white transition group-hover:scale-110"
            style={{ backgroundColor: item.color, boxShadow: `0 0 0 1px ${item.color}33` }}
            aria-hidden
          />
          <span className="text-sm font-semibold leading-snug tracking-tight text-text sm:text-[15px]">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
