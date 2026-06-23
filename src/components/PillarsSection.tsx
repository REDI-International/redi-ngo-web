interface Pillar {
  key: string;
  title: string;
  description: string;
  icon: "learn" | "create" | "connect" | "finance" | "sell";
  color: string;
  bg: string;
}

interface PillarsSectionProps {
  title: string;
  subtitle: string;
  cta: string;
  pillars: Pillar[];
}

function PillarIcon({ icon, color }: { icon: Pillar["icon"]; color: string }) {
  const paths: Record<Pillar["icon"], string> = {
    learn: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    create: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    connect: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    finance: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    sell: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
  };

  return (
    <div
      className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full shadow-md"
      style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
    >
      <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d={paths[icon]} />
      </svg>
    </div>
  );
}

export function PillarsSection({ title, subtitle, cta, pillars }: PillarsSectionProps) {
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold text-text lg:text-4xl">{title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-text-muted">{subtitle}</p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {pillars.map((pillar) => (
            <article
              key={pillar.key}
              className="rounded-2xl border border-white/80 p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              style={{ backgroundColor: pillar.bg }}
            >
              <PillarIcon icon={pillar.icon} color={pillar.color} />
              <h3 className="font-heading text-lg font-bold text-text">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{pillar.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://redi.business/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary-light"
          >
            {cta}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
