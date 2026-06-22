import { getTranslations, setRequestLocale } from "next-intl/server";
import { ImageHero } from "@/components/ImageHero";
import { PhotoGrid } from "@/components/PhotoGrid";
import { galleryPhotos, heroImages } from "@/content/media";

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

  return (
    <>
      <ImageHero
        title={t("title")}
        subtitle={t("subtitle")}
        image={heroImages.media}
      />
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <PhotoGrid photos={galleryPhotos} />
      </section>
    </>
  );
}
