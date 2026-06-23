import { getTranslations, setRequestLocale } from "next-intl/server";
import { ImageHero } from "@/components/ImageHero";
import { SocialStoryCard, SocialFollowCard } from "@/components/SocialStoryCard";
import { PhotoGallery } from "@/components/PhotoGallery";
import { heroImages } from "@/content/media";
import { getGalleryPhotos } from "@/lib/content";
import { getSocialStories, socialPages, socialLinks } from "@/lib/social";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "media" });
  return { title: t("title") };
}

export default async function MediaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("media");
  const stories = getSocialStories();
  const galleryPhotos = await getGalleryPhotos();

  return (
    <>
      <ImageHero
        title={t("title")}
        subtitle={t("subtitle")}
        image={heroImages.media}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <h2 className="font-heading text-2xl font-bold text-primary">{t("socialStories")}</h2>
        <p className="mt-2 text-text-muted">{t("socialStoriesDesc")}</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stories.map((story) => (
            <SocialStoryCard
              key={story.id}
              title={story.title}
              caption={story.caption}
              image={story.image}
              url={story.url}
              platform={story.platform}
            />
          ))}
          {socialPages.map((page) => (
            <SocialFollowCard
              key={page.id}
              platform={page.platform}
              label={page.label}
              caption={page.caption}
              url={page.url}
            />
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-6">
          <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#1877F2] hover:underline">
            {t("followFacebook")} →
          </a>
          <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-pink-600 hover:underline">
            {t("followInstagram")} →
          </a>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-primary">{t("photoGallery")}</h2>
          <p className="mt-2 text-text-muted">{t("photoGalleryDesc")}</p>
          <div className="mt-8">
            <PhotoGallery photos={galleryPhotos} />
          </div>
        </div>
      </section>
    </>
  );
}
