export const YOUTUBE_CHANNEL_URL =
  "https://www.youtube.com/@romaentrepreneurshipdevelo2217";

export interface YouTubeVideo {
  id: string;
  title: { en: string; ro: string };
}

/** Curated videos from the REDI YouTube channel */
export const youtubeVideos: YouTubeVideo[] = [
  {
    id: "riJShdAPz9c",
    title: {
      en: "The situation of Roma in Romania — REDI",
      ro: "Situația Romilor din România — REDI",
    },
  },
  {
    id: "acxOhtbpxDk",
    title: {
      en: "Economic inclusion of Roma in Romania",
      ro: "Incluziunea economică a romilor din România",
    },
  },
  {
    id: "EOfZ4UyXIYI",
    title: {
      en: "€250,000 non-reimbursable funding for young Roma — Start-Up Nation 2024",
      ro: "Finanțări de 250.000 lei nerambursabili pentru tinerii romi — Start-Up Nation 2024",
    },
  },
  {
    id: "hbuSGfUq-C8",
    title: {
      en: "Free entrepreneurship course for non-reimbursable funding — StartUp Nation 2024",
      ro: "Curs gratuit de antreprenoriat pentru finanțări nerambursabile — StartUp Nation 2024",
    },
  },
  {
    id: "GpZu1PTIJCQ",
    title: {
      en: "Petrica Dulgheru on the Y-Support Project",
      ro: "Petrica Dulgheru despre proiectul Y-Support",
    },
  },
  {
    id: "79f6yqaGmUo",
    title: {
      en: "Cornel Sandu — Roma Digital Boost Romania",
      ro: "Cornel Sandu — Roma Digital Boost România",
    },
  },
];

export const featuredVideoId = youtubeVideos[0].id;

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function youtubeEmbedUrl(videoId: string, nocookie = true): string {
  const host = nocookie ? "www.youtube-nocookie.com" : "www.youtube.com";
  return `https://${host}/embed/${videoId}?rel=0&modestbranding=1`;
}

export function youtubeThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}
