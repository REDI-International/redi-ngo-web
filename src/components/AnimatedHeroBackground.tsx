"use client";

/**
 * Abstract geometric shapes that assemble on load — inspired by FES.de hero,
 * adapted to REDI brand colors (green / gold / EU blue).
 */
export function AnimatedHeroBackground() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#163828] to-[#0a1f14]" />

      <svg
        className="hero-shapes absolute inset-0 h-full w-full"
        viewBox="0 0 1440 640"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hero-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4A017" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#E8B84A" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="hero-blue" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#003399" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0044bb" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="hero-green-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2D6A4F" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1B4332" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Soft ambient blobs */}
        <ellipse
          className="hero-blob hero-blob-1"
          cx="1180"
          cy="120"
          rx="280"
          ry="220"
          fill="url(#hero-green-glow)"
        />
        <ellipse
          className="hero-blob hero-blob-2"
          cx="200"
          cy="520"
          rx="200"
          ry="160"
          fill="url(#hero-blue)"
        />

        {/* Large arc — draws in from top-right */}
        <path
          className="hero-arc"
          d="M 1050 40 A 320 320 0 0 1 1380 420"
          fill="none"
          stroke="url(#hero-gold)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Secondary arc */}
        <path
          className="hero-arc hero-arc-2"
          d="M 980 80 A 240 240 0 0 1 1260 380"
          fill="none"
          stroke="#D4A017"
          strokeWidth="1"
          strokeOpacity="0.35"
          strokeLinecap="round"
        />

        {/* Hexagon cluster — EU network motif */}
        <g className="hero-hex-group" transform="translate(920, 180)">
          <polygon
            className="hero-hex hero-hex-1"
            points="60,0 110,30 110,90 60,120 10,90 10,30"
            fill="none"
            stroke="#003399"
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />
          <polygon
            className="hero-hex hero-hex-2"
            points="60,0 110,30 110,90 60,120 10,90 10,30"
            fill="#003399"
            fillOpacity="0.08"
            stroke="#003399"
            strokeWidth="1"
            strokeOpacity="0.4"
            transform="translate(95, 52)"
          />
          <polygon
            className="hero-hex hero-hex-3"
            points="60,0 110,30 110,90 60,120 10,90 10,30"
            fill="none"
            stroke="#D4A017"
            strokeWidth="1"
            strokeOpacity="0.5"
            transform="translate(-85, 52)"
          />
        </g>

        {/* Diamond / rhombus — scales in center-right */}
        <polygon
          className="hero-diamond"
          points="720,280 780,220 840,280 780,340"
          fill="none"
          stroke="#D4A017"
          strokeWidth="1.5"
          strokeOpacity="0.6"
        />
        <polygon
          className="hero-diamond hero-diamond-inner"
          points="720,280 780,250 840,280 780,310"
          fill="#D4A017"
          fillOpacity="0.06"
          stroke="none"
        />

        {/* Horizontal connector lines */}
        <line
          className="hero-line hero-line-1"
          x1="80"
          y1="320"
          x2="420"
          y2="320"
          stroke="#2D6A4F"
          strokeWidth="1.5"
          strokeOpacity="0.5"
          strokeLinecap="round"
        />
        <line
          className="hero-line hero-line-2"
          x1="120"
          y1="380"
          x2="360"
          y2="380"
          stroke="#D4A017"
          strokeWidth="1"
          strokeOpacity="0.4"
          strokeLinecap="round"
        />
        <line
          className="hero-line hero-line-3"
          x1="60"
          y1="440"
          x2="280"
          y2="440"
          stroke="#003399"
          strokeWidth="1"
          strokeOpacity="0.35"
          strokeLinecap="round"
        />

        {/* Vertical accent */}
        <line
          className="hero-line hero-line-4"
          x1="1320"
          y1="200"
          x2="1320"
          y2="480"
          stroke="#003399"
          strokeWidth="1"
          strokeOpacity="0.3"
          strokeLinecap="round"
        />

        {/* Circle rings */}
        <circle
          className="hero-ring hero-ring-1"
          cx="560"
          cy="160"
          r="48"
          fill="none"
          stroke="#D4A017"
          strokeWidth="1.5"
          strokeOpacity="0.45"
        />
        <circle
          className="hero-ring hero-ring-2"
          cx="560"
          cy="160"
          r="72"
          fill="none"
          stroke="#2D6A4F"
          strokeWidth="1"
          strokeOpacity="0.3"
        />
        <circle
          className="hero-ring hero-ring-3"
          cx="1100"
          cy="480"
          r="36"
          fill="none"
          stroke="#003399"
          strokeWidth="1.5"
          strokeOpacity="0.5"
        />

        {/* Node dots */}
        <circle className="hero-dot hero-dot-1" cx="420" cy="320" r="4" fill="#D4A017" />
        <circle className="hero-dot hero-dot-2" cx="720" cy="280" r="3" fill="#003399" />
        <circle className="hero-dot hero-dot-3" cx="840" cy="280" r="3" fill="#D4A017" />
        <circle className="hero-dot hero-dot-4" cx="1320" cy="200" r="3" fill="#D4A017" />
        <circle className="hero-dot hero-dot-5" cx="1100" cy="480" r="4" fill="#2D6A4F" />

        {/* Angular wedge — bottom right */}
        <path
          className="hero-wedge"
          d="M 1440 640 L 1440 420 L 1100 640 Z"
          fill="url(#hero-blue)"
          fillOpacity="0.15"
        />
      </svg>

      {/* Text readability overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
    </div>
  );
}
