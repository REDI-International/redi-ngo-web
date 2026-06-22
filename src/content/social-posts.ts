/** Curated REDI social content — post images fetched at build via npm run fetch-social */

export interface SocialPost {
  id: string;
  platform: "facebook" | "instagram";
  /** "post" = a specific post with a real photo; "page" = profile/follow link */
  kind: "post" | "page";
  url: string;
  title: string;
  caption?: string;
  /** Populated by fetch-social script */
  image?: string;
  featured?: boolean;
}

export const socialPosts: SocialPost[] = [
  {
    id: "fb-shuto-orizari-2025",
    platform: "facebook",
    kind: "post",
    url: "https://www.facebook.com/REDI2018/posts/an-informative-meeting-took-place-in-shuto-orizari-where-the-operational-plan-fo/1114557870701646/",
    title: "Operational Plan 2025 — Shuto Orizari",
    caption: "Presenting REDI's Business Incubator, Accelerator, and Development programmes for Roma entrepreneurs.",
    featured: true,
  },
];

/** Official profile pages — rendered as branded follow cards, never as fake photos */
export const socialPages = [
  {
    id: "fb-main",
    platform: "facebook" as const,
    url: "https://www.facebook.com/REDI2018",
    label: "REDI",
    caption: "EU-funded programmes, events & stories",
  },
  {
    id: "ig-main",
    platform: "instagram" as const,
    url: "https://www.instagram.com/redi.ngo/",
    label: "@redi.ngo",
    caption: "328 posts — entrepreneurs & community",
  },
  {
    id: "li-main",
    platform: "linkedin" as const,
    url: "https://www.linkedin.com/company/redi-roma-economic-development-initiative",
    label: "REDI",
    caption: "Network, partnerships & impact",
  },
];

export const socialLinks = {
  facebook: "https://www.facebook.com/REDI2018",
  instagram: "https://www.instagram.com/redi.ngo/",
  linkedin: "https://www.linkedin.com/company/redi-roma-economic-development-initiative",
} as const;
