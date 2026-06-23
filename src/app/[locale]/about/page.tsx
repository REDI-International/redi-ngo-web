import { getTranslations, setRequestLocale } from "next-intl/server";
import { listPageBlocks } from "@/lib/blocks/queries";
import { EditablePageShell } from "@/components/live-editor/EditablePageShell";
import { BlockDrivenPage } from "@/components/live-editor/BlockRenderer";
import { StaticAboutContent } from "@/components/live-editor/StaticAboutContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const blocks = await listPageBlocks("about", locale);

  return (
    <EditablePageShell
      pageSlug="about"
      locale={locale}
      initialBlocks={blocks}
      fallbackContent={<StaticAboutContent locale={locale} />}
      serverRenderedBlocks={blocks.length > 0 ? <BlockDrivenPage blocks={blocks} locale={locale} pageVariant="about" /> : undefined}
    />
  );
}
