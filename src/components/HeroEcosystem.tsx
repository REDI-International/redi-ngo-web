import React from "react";

interface HeroEcosystemProps {
  labels: Record<string, string>;
}

export function HeroEcosystem({ labels }: HeroEcosystemProps) {
  // Map translations to our ecosystem nodes if they exist, or use defaults
  const getLabel = (key: string, fallback: string) => labels[key] ?? fallback;

  const nodes = [
    {
      id: "funding",
      title: "Funding",
      items: [getLabel("rediFund", "REDI Fund"), getLabel("grantSupport", "Grants")],
      x: 85,
      y: 15,
      color: "#D4A017",
      bg: "#FFFBEB",
      path: "M 250 250 C 350 250, 350 75, 425 75",
      delay: "0s",
    },
    {
      id: "learning",
      title: "Learning",
      items: [
        getLabel("incubator", "Incubator"),
        getLabel("technicalSupport", "Tech Support"),
        "REDI.business",
      ],
      x: 85,
      y: 85,
      color: "#003399",
      bg: "#EEF2FF",
      path: "M 250 250 C 320 250, 300 425, 425 425",
      delay: "1.5s",
    },
    {
      id: "advocacy",
      title: "Advocacy",
      items: [getLabel("euProjects", "EU Projects")],
      x: 15,
      y: 15,
      color: "#1B4332",
      bg: "#ECFDF5",
      path: "M 250 250 C 150 250, 150 75, 75 75",
      delay: "3s",
    },
    {
      id: "community",
      title: "Community",
      items: [getLabel("businessClubs", "Business Clubs")],
      x: 15,
      y: 85,
      color: "#E91E63",
      bg: "#FDF2F8",
      path: "M 250 250 C 180 250, 200 425, 75 425",
      delay: "4.5s",
    },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[500px] aspect-square">
      {/* Background SVG for connecting lines */}
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none"
        viewBox="0 0 500 500"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {nodes.map((node) => (
          <g key={`path-${node.id}`}>
            {/* The dashed path */}
            <path
              id={`curve-${node.id}`}
              d={node.path}
              fill="none"
              stroke={node.color}
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="opacity-40"
            />
            
            {/* The animated moving dot */}
            <circle r="3.5" fill={node.color} filter="url(#glow)" className="motion-reduce:hidden">
              <animateMotion
                dur="6s"
                repeatCount="indefinite"
                begin={node.delay}
                calcMode="linear"
              >
                <mpath href={`#curve-${node.id}`} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.1;0.9;1"
                dur="6s"
                repeatCount="indefinite"
                begin={node.delay}
              />
            </circle>
          </g>
        ))}
      </svg>

      {/* Central Node */}
      <div className="absolute left-1/2 top-1/2 z-10 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5">
          <span className="text-center font-heading text-sm font-bold leading-tight tracking-tight text-primary">
            Roma<br />Ecosystem
          </span>
        </div>
      </div>

      {/* Orbital Nodes */}
      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute z-20 w-32 sm:w-40 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-105 hover:z-30"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          <div
            className="overflow-hidden rounded-xl border border-black/[0.06] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
          >
            {/* Header */}
            <div
              className="flex items-center gap-2 border-b border-black/[0.04] px-3 py-2 sm:px-4"
              style={{ backgroundColor: node.bg }}
            >
              <span
                className="flex h-2 w-2 shrink-0 rounded-full"
                style={{
                  backgroundColor: node.color,
                  boxShadow: `0 0 0 2px ${node.color}33`,
                }}
                aria-hidden="true"
              />
              <span className="text-xs sm:text-sm font-bold tracking-tight text-text">
                {node.title}
              </span>
            </div>
            {/* Items */}
            <div className="px-3 py-2 sm:px-4 sm:py-3">
              <ul className="space-y-1.5 sm:space-y-2">
                {node.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-text-muted before:content-[''] before:block before:h-1 before:w-1 before:rounded-full before:bg-black/20"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
