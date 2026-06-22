import storiesData from "@/content/social-stories.json";
import { socialPosts, socialPages, socialLinks, type SocialPost } from "@/content/social-posts";
import { heroImages } from "@/content/media";

export interface SocialStory extends SocialPost {
  image?: string;
}

const fetched = storiesData as SocialStory[];

/** Merge fetched images back onto curated posts, keeping only real photos. */
const stories: SocialStory[] = socialPosts.map((post) => {
  const match = fetched.find((s) => s.id === post.id);
  return { ...post, image: match?.image ?? post.image };
});

function isRealPhoto(s: SocialStory): boolean {
  return Boolean(s.image) && !s.image!.includes("s100x100");
}

export function getSocialStories(): SocialStory[] {
  return stories.filter(isRealPhoto);
}

export function getFeaturedSocialStories(limit = 4): SocialStory[] {
  return stories.filter(isRealPhoto).slice(0, limit);
}

export function getSocialHeroImage(): string {
  const best = stories.find((s) => s.featured && isRealPhoto(s)) ?? stories.find(isRealPhoto);
  return best?.image ?? heroImages.home;
}

export { socialLinks, socialPages };
