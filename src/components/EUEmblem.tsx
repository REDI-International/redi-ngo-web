interface EUEmblemProps {
  variant?: "co-funded" | "funded";
  theme?: "light" | "dark";
  className?: string;
}

export function EUFlag({ size = 36 }: { size?: number }) {
  const stars = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const r = 18;
    const cx = 50 + r * Math.cos(angle);
    const cy = 50 + r * Math.sin(angle);
    return { cx, cy };
  });

  return (
    <svg
      viewBox="0 0 150 100"
      width={size * 1.5}
      height={size}
      role="img"
      aria-label="European Union flag"
      className="shrink-0 rounded-sm"
    >
      <rect width="150" height="100" fill="#003399" />
      <g transform="translate(25,0)">
        {stars.map((s, i) => (
          <Star key={i} cx={s.cx} cy={s.cy} />
        ))}
      </g>
    </svg>
  );
}

function Star({ cx, cy }: { cx: number; cy: number }) {
  const points = Array.from({ length: 5 }, (_, i) => {
    const angle = (i * 72 - 90) * (Math.PI / 180);
    const x = cx + 4.5 * Math.cos(angle);
    const y = cy + 4.5 * Math.sin(angle);
    return `${x},${y}`;
  }).join(" ");
  return <polygon points={points} fill="#FFCC00" />;
}

export function EUBadge({ label = "EU FUNDED", className = "" }: { label?: string; className?: string }) {
  return (
    <span className={`inline-flex w-fit items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#003399] shadow-sm ${className}`}>
      <EUFlag size={14} />
      {label}
    </span>
  );
}

export function EUEmblem({
  variant = "co-funded",
  theme = "light",
  className = "",
}: EUEmblemProps) {
  const textColor = theme === "dark" ? "text-white" : "text-text";
  const label =
    variant === "co-funded"
      ? "Co-funded by the\nEuropean Union"
      : "Funded by the\nEuropean Union";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <EUFlag size={34} />
      <span className={`text-xs font-semibold leading-tight ${textColor}`} style={{ whiteSpace: "pre-line" }}>
        {label}
      </span>
    </div>
  );
}
