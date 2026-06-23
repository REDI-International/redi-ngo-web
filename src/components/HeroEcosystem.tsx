"use client";

import React, { useState } from "react";
import {
  Banknote,
  GraduationCap,
  Megaphone,
  Users,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

interface HeroEcosystemProps {
  labels: Record<string, string>;
}

type EcoNode = {
  id: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  /** bold gradient (135deg) */
  from: string;
  to: string;
  /** glow / accent base color */
  glow: string;
  /** position in 0–100 viewBox space */
  x: number;
  y: number;
};

export function HeroEcosystem({ labels }: HeroEcosystemProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const get = (key: string, fallback: string) => labels[key] ?? fallback;

  // Five ecosystem branches arranged as a pentagon around the hub.
  // Centre is (50, 50); radius ≈ 33 in the 0–100 viewBox.
  const nodes: EcoNode[] = [
    {
      id: "funding",
      title: get("funding", "Funding"),
      desc: get("rediFund", "REDI Fund"),
      icon: Banknote,
      from: "#FCD34D",
      to: "#D4A017",
      glow: "#E6A817",
      x: 50,
      y: 17,
    },
    {
      id: "learning",
      title: get("learning", "Learning"),
      desc: get("incubator", "Incubator"),
      icon: GraduationCap,
      from: "#3B82F6",
      to: "#1E3A8A",
      glow: "#2563EB",
      x: 81.4,
      y: 39.8,
    },
    {
      id: "community",
      title: get("community", "Community"),
      desc: get("businessClubs", "Business Clubs"),
      icon: Users,
      from: "#FB7185",
      to: "#E11D48",
      glow: "#F43F5E",
      x: 69.4,
      y: 76.7,
    },
    {
      id: "tools",
      title: get("tools", "Digital Tools"),
      desc: "redi.business",
      icon: Sparkles,
      from: "#A78BFA",
      to: "#7C3AED",
      glow: "#8B5CF6",
      x: 30.6,
      y: 76.7,
    },
    {
      id: "advocacy",
      title: get("advocacy", "Advocacy"),
      desc: get("euProjects", "EU Projects"),
      icon: Megaphone,
      from: "#34D399",
      to: "#047857",
      glow: "#10B981",
      x: 18.6,
      y: 39.8,
    },
  ];

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[560px]"
      onMouseLeave={() => setHovered(null)}
    >
      {/* Vibrant aurora / colour-mesh backdrop (single layer, no backdrop-blur) */}
      <div
        className="heco-aurora pointer-events-none absolute inset-[-12%] rounded-full"
        style={{
          background: `
            radial-gradient(circle at 50% 14%, rgba(212,160,23,0.30), transparent 42%),
            radial-gradient(circle at 84% 38%, rgba(37,99,235,0.26), transparent 42%),
            radial-gradient(circle at 72% 82%, rgba(244,63,94,0.24), transparent 42%),
            radial-gradient(circle at 28% 82%, rgba(139,92,246,0.24), transparent 42%),
            radial-gradient(circle at 16% 38%, rgba(16,185,129,0.26), transparent 42%),
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.55), transparent 55%)
          `,
          filter: "blur(14px)",
        }}
        aria-hidden="true"
      />

      {/* Connectors + travelling energy particles */}
      <svg
        className="absolute inset-0 z-0 h-full w-full"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        {nodes.map((node) => {
          const isHovered = hovered === node.id;
          const isDimmed = hovered !== null && !isHovered;
          const dx = node.x - 50;
          const dy = node.y - 50;
          return (
            <g key={`link-${node.id}`}>
              {/* faint base rail */}
              <line
                x1="50"
                y1="50"
                x2={node.x}
                y2={node.y}
                stroke={node.glow}
                strokeWidth={0.6}
                strokeLinecap="round"
                style={{
                  opacity: isDimmed ? 0.08 : 0.2,
                  transition: "opacity 0.4s ease",
                }}
              />
              {/* flowing energy line */}
              <line
                className="heco-flow"
                x1="50"
                y1="50"
                x2={node.x}
                y2={node.y}
                stroke={node.glow}
                strokeWidth={isHovered ? 1.4 : 0.9}
                strokeLinecap="round"
                style={{
                  opacity: isHovered ? 1 : isDimmed ? 0.12 : 0.55,
                  transition: "opacity 0.4s ease, stroke-width 0.4s ease",
                }}
              />
              {/* travelling glow particle */}
              <circle
                className="heco-particle"
                cx="50"
                cy="50"
                r={isHovered ? 1.5 : 1.1}
                fill={node.glow}
                style={
                  {
                    "--dx": `${dx}`,
                    "--dy": `${dy}`,
                    animationDelay: `${nodes.indexOf(node) * 0.7}s`,
                    opacity: isDimmed ? 0 : 1,
                    filter: `drop-shadow(0 0 2px ${node.glow})`,
                    transition: "opacity 0.4s ease",
                  } as React.CSSProperties
                }
              />
            </g>
          );
        })}
      </svg>

      {/* Central hub */}
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
          {/* spinning multi-colour ring tying every branch together */}
          <div
            className="heco-spin absolute rounded-full"
            style={{
              inset: "-16%",
              background:
                "conic-gradient(from 0deg, #D4A017, #3B82F6, #F43F5E, #8B5CF6, #10B981, #D4A017)",
              WebkitMask:
                "radial-gradient(closest-side, transparent 68%, #000 70%)",
              mask: "radial-gradient(closest-side, transparent 68%, #000 70%)",
              opacity: 0.95,
            }}
            aria-hidden="true"
          />
          {/* expanding pulse rings */}
          <div className="heco-pulse-ring absolute inset-0 rounded-full bg-[#1B4332]/15" />
          <div
            className="heco-pulse-ring absolute inset-0 rounded-full bg-[#1B4332]/15"
            style={{ animationDelay: "1.5s" }}
          />
          {/* core orb */}
          <div
            className="relative flex h-full w-full flex-col items-center justify-center rounded-full text-center shadow-[0_10px_40px_-8px_rgba(27,67,50,0.6)]"
            style={{
              background:
                "radial-gradient(circle at 30% 25%, #2D6A4F 0%, #1B4332 70%)",
            }}
          >
            <span className="px-2 font-heading text-[13px] font-bold leading-tight tracking-tight text-white sm:text-sm">
              {get("hubTitle", "Roma Ecosystem")}
            </span>
            <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.15em] text-[#D4A017]">
              {get("hubSubtitle", "One network")}
            </span>
          </div>
        </div>
      </div>

      {/* Branch nodes */}
      {nodes.map((node, i) => {
        const isHovered = hovered === node.id;
        const isDimmed = hovered !== null && !isHovered;
        const Icon = node.icon;
        return (
          <div
            key={node.id}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            onMouseEnter={() => setHovered(node.id)}
          >
            <div
              className="heco-node"
              style={{ animationDelay: `${i * 0.9}s` }}
            >
              <div
                className="group flex w-28 items-center gap-2.5 rounded-2xl p-2.5 text-left transition-all duration-300 sm:w-36 sm:gap-3 sm:p-3"
                style={{
                  background: `linear-gradient(135deg, ${node.from}, ${node.to})`,
                  boxShadow: isHovered
                    ? `0 16px 36px -10px ${node.glow}, 0 0 0 1px rgba(255,255,255,0.25) inset`
                    : `0 8px 22px -12px ${node.glow}, 0 0 0 1px rgba(255,255,255,0.18) inset`,
                  transform: isHovered ? "scale(1.06)" : "scale(1)",
                  opacity: isDimmed ? 0.55 : 1,
                  filter: isDimmed ? "saturate(0.7)" : "none",
                }}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/25 text-white shadow-sm backdrop-blur-[2px] transition-transform duration-300 group-hover:scale-110 sm:h-9 sm:w-9">
                  <Icon size={17} strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold leading-tight text-white sm:text-sm">
                    {node.title}
                  </p>
                  <p className="truncate text-[10px] font-medium leading-tight text-white/85 sm:text-[11px]">
                    {node.desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
