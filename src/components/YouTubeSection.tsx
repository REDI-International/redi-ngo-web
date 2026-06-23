import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/SectionHeading";
import { YouTubeFeaturedEmbed } from "@/components/YouTubeFeaturedEmbed";
import {
  YOUTUBE_CHANNEL_URL,
  featuredVideoId,
  youtubeThumbnailUrl,
  youtubeVideos,
  youtubeWatchUrl,
} from "@/content/youtube";
import type { Locale } from "@/i18n/routing";

interface YouTubeSectionProps {
  locale: Locale;
  /** Show only featured embed + channel link (compact layout for media page) */
  compact?: boolean;
}

export async function YouTubeSection({ locale, compact = false }: YouTubeSectionProps) {
  const t = await getTranslations({ locale, namespace: "youtube" });
  const gridVideos = compact ? youtubeVideos.slice(0, 3) : youtubeVideos.slice(1);

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          title={t("title")}
          subtitle={t("subtitle")}
          href={YOUTUBE_CHANNEL_URL}
          linkLabel={t("viewChannel")}
        />

        <div className={`grid gap-8 ${compact ? "" : "lg:grid-cols-5 lg:gap-10"}`}>
          <div className={compact ? "" : "lg:col-span-3"}>
            <div className="youtube-featured-embed isolate overflow-hidden rounded-2xl bg-black shadow-lg ring-1 ring-black/5">
              <div className="relative aspect-video">
                <YouTubeFeaturedEmbed videoId={featuredVideoId} title={youtubeVideos[0].title[locale]} />
              </div>
            </div>
            <p className="mt-3 text-sm font-medium text-text">{youtubeVideos[0].title[locale]}</p>
          </div>

          <div className={compact ? "mt-8 grid gap-4 sm:grid-cols-3" : "lg:col-span-2"}>
            {!compact && (
              <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
                {t("moreVideos")}
              </p>
            )}
            <ul className={`grid gap-4 ${compact ? "contents" : ""}`}>
              {gridVideos.map((video) => (
                <li key={video.id}>
                  <a
                    href={youtubeWatchUrl(video.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-3 rounded-xl p-2 transition hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-lg bg-surface-dark shadow-sm sm:w-36">
                      <Image
                        src={youtubeThumbnailUrl(video.id)}
                        alt=""
                        fill
                        sizes="144px"
                        className="object-cover transition group-hover:scale-105"
                      />
                      <span
                        className="absolute inset-0 flex items-center justify-center bg-black/20 transition group-hover:bg-black/30"
                        aria-hidden
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-md">
                          <svg className="ml-0.5 h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                      </span>
                    </div>
                    <span className="flex flex-col justify-center">
                      <span className="text-sm font-medium leading-snug text-text group-hover:text-primary">
                        {video.title[locale]}
                      </span>
                      <span className="mt-1 text-xs text-text-muted">{t("watchOnYouTube")}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm font-semibold text-primary transition hover:border-primary/40 hover:bg-primary/10 ${compact ? "mt-4 sm:col-span-3" : "mt-6"}`}
            >
              <svg className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              {t("subscribe")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
