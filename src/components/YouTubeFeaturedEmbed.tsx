"use client";

import Image from "next/image";
import { useEditModeOptional } from "@/components/live-editor/EditModeProvider";
import { youtubeEmbedUrl, youtubeThumbnailUrl } from "@/content/youtube";

export function YouTubeFeaturedEmbed({ videoId, title }: { videoId: string; title: string }) {
  const editMode = useEditModeOptional();

  if (editMode?.isEditing) {
    return (
      <div className="relative aspect-video overflow-hidden bg-black">
        <Image
          src={youtubeThumbnailUrl(videoId)}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 px-4 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600/90 text-white shadow-lg">
            <svg className="ml-0.5 h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <p className="text-sm font-medium text-white">Video preview disabled in edit mode</p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      src={youtubeEmbedUrl(videoId)}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      loading="lazy"
      className="absolute inset-0 h-full w-full border-0"
    />
  );
}
