import Image from "next/image";

interface SocialStoryCardProps {
  title: string;
  caption?: string;
  image?: string;
  url: string;
  platform: "facebook" | "instagram";
}

export function SocialStoryCard({ title, caption, image, url, platform }: SocialStoryCardProps) {
  const label = platform === "facebook" ? "Facebook" : "Instagram";
  const color = platform === "facebook" ? "bg-[#1877F2]" : "bg-gradient-to-br from-purple-600 to-pink-500";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] bg-surface-dark">
        {image ? (
          <Image src={image} alt={title} fill className="object-cover transition group-hover:scale-105" sizes="400px" />
        ) : (
          <div className="flex h-full items-center justify-center text-text-muted">Photo</div>
        )}
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold text-white ${color}`}>
          {label}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-heading font-bold text-primary line-clamp-2">{title}</h3>
        {caption && <p className="mt-1 text-sm text-text-muted line-clamp-2">{caption}</p>}
        <span className="mt-3 inline-block text-xs font-semibold text-accent">View on {label} →</span>
      </div>
    </a>
  );
}

export function SocialStoryStrip({
  stories,
}: {
  stories: Array<{ title: string; caption?: string; image?: string; url: string; platform: "facebook" | "instagram" }>;
}) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
      {stories.map((story) => (
        <a
          key={story.url}
          href={story.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative h-64 w-80 shrink-0 snap-start overflow-hidden rounded-2xl"
        >
          {story.image && (
            <Image src={story.image} alt={story.title} fill className="object-cover" sizes="320px" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 p-4">
            <span className="text-xs font-bold uppercase text-accent">
              {story.platform === "facebook" ? "Facebook" : "Instagram"}
            </span>
            <p className="mt-1 font-heading text-sm font-bold text-white line-clamp-2">{story.title}</p>
          </div>
        </a>
      ))}
    </div>
  );
}

const PLATFORM = {
  facebook: { label: "Facebook", bg: "bg-[#1877F2]", cta: "Follow on Facebook" },
  instagram: { label: "Instagram", bg: "bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5]", cta: "Follow on Instagram" },
  linkedin: { label: "LinkedIn", bg: "bg-[#0A66C2]", cta: "Follow on LinkedIn" },
} as const;

export function SocialFollowCard({
  platform,
  label,
  caption,
  url,
}: {
  platform: "facebook" | "instagram" | "linkedin";
  label: string;
  caption?: string;
  url: string;
}) {
  const p = PLATFORM[platform];
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex flex-col justify-between rounded-2xl p-6 text-white shadow-sm transition hover:shadow-lg ${p.bg}`}
    >
      <div>
        <span className="text-xs font-bold uppercase tracking-wide text-white/80">{p.label}</span>
        <p className="mt-2 font-heading text-xl font-bold">{label}</p>
        {caption && <p className="mt-1 text-sm text-white/85">{caption}</p>}
      </div>
      <span className="mt-6 inline-flex items-center text-sm font-semibold">
        {p.cta} <span className="ml-1 transition group-hover:translate-x-1">→</span>
      </span>
    </a>
  );
}
