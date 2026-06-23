"use client";

interface EcosystemNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  shape: "circle" | "hex" | "diamond" | "rounded";
  delay: number;
}

const NODES: Omit<EcosystemNode, "label">[] = [
  { id: "businessClubs", x: 72, y: 18, color: "#E91E63", shape: "circle", delay: 0 },
  { id: "rediFund", x: 88, y: 38, color: "#2D6A4F", shape: "hex", delay: 0.15 },
  { id: "rediRecycling", x: 58, y: 42, color: "#009688", shape: "rounded", delay: 0.3 },
  { id: "grantSupport", x: 78, y: 62, color: "#D4A017", shape: "diamond", delay: 0.45 },
  { id: "technicalSupport", x: 42, y: 58, color: "#003399", shape: "circle", delay: 0.6 },
  { id: "euProjects", x: 28, y: 28, color: "#003399", shape: "hex", delay: 0.75 },
  { id: "incubator", x: 50, y: 78, color: "#1B4332", shape: "rounded", delay: 0.9 },
];

const CONNECTIONS: [string, string][] = [
  ["businessClubs", "rediFund"],
  ["businessClubs", "grantSupport"],
  ["rediFund", "grantSupport"],
  ["rediRecycling", "technicalSupport"],
  ["rediRecycling", "euProjects"],
  ["technicalSupport", "incubator"],
  ["grantSupport", "incubator"],
  ["euProjects", "businessClubs"],
  ["rediFund", "technicalSupport"],
];

interface EcosystemVisualProps {
  labels: Record<string, string>;
}

function nodeById(id: string) {
  return NODES.find((n) => n.id === id)!;
}

function NodeShape({ node }: { node: EcosystemNode }) {
  const base = "eco-node transition-transform duration-300 hover:scale-105";
  const size = 44;

  if (node.shape === "circle") {
    return (
      <circle
        className={base}
        cx={node.x}
        cy={node.y}
        r={size / 2}
        fill={node.color}
        fillOpacity={0.12}
        stroke={node.color}
        strokeWidth={1.5}
      />
    );
  }
  if (node.shape === "hex") {
    const r = size / 2;
    const points = Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      return `${node.x + r * Math.cos(angle)},${node.y + r * Math.sin(angle)}`;
    }).join(" ");
    return (
      <polygon
        className={base}
        points={points}
        fill={node.color}
        fillOpacity={0.1}
        stroke={node.color}
        strokeWidth={1.5}
      />
    );
  }
  if (node.shape === "diamond") {
    const r = size / 2.2;
    return (
      <polygon
        className={base}
        points={`${node.x},${node.y - r} ${node.x + r},${node.y} ${node.x},${node.y + r} ${node.x - r},${node.y}`}
        fill={node.color}
        fillOpacity={0.1}
        stroke={node.color}
        strokeWidth={1.5}
      />
    );
  }
  return (
    <rect
      className={base}
      x={node.x - size / 2}
      y={node.y - size / 2.5}
      width={size}
      height={size * 0.8}
      rx={10}
      fill={node.color}
      fillOpacity={0.1}
      stroke={node.color}
      strokeWidth={1.5}
    />
  );
}

export function EcosystemVisual({ labels }: EcosystemVisualProps) {
  const nodes: EcosystemNode[] = NODES.map((n) => ({
    ...n,
    label: labels[n.id] ?? n.id,
  }));

  return (
    <div className="relative aspect-square w-full max-w-md lg:max-w-none" aria-hidden="true">
      <svg
        viewBox="0 0 100 100"
        className="eco-visual h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="eco-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2D6A4F" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#2D6A4F" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="50" cy="50" rx="46" ry="46" fill="url(#eco-glow)" />

        {CONNECTIONS.map(([a, b], i) => {
          const na = nodeById(a);
          const nb = nodeById(b);
          return (
            <line
              key={`${a}-${b}`}
              className="eco-line"
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              stroke="#1B4332"
              strokeOpacity={0.15}
              strokeWidth={0.6}
              style={{ animationDelay: `${0.2 + i * 0.08}s` }}
            />
          );
        })}

        {nodes.map((node) => (
          <g key={node.id} className="eco-node-group" style={{ animationDelay: `${node.delay}s` }}>
            <NodeShape node={node} />
            <circle cx={node.x} cy={node.y} r={3} fill={node.color} className="eco-dot" />
          </g>
        ))}
      </svg>

      {nodes.map((node) => (
        <span
          key={`label-${node.id}`}
          className="eco-label pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-surface-dark/60 bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-text shadow-sm backdrop-blur-sm sm:text-[11px]"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            animationDelay: `${node.delay + 0.4}s`,
          }}
        >
          {node.label}
        </span>
      ))}
    </div>
  );
}
