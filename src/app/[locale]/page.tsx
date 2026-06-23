import { getTranslations, setRequestLocale } from "next-intl/server";
import { listPageBlocks } from "@/lib/blocks/queries";
import { EditablePageShell } from "@/components/live-editor/EditablePageShell";
import { BlockDrivenPage } from "@/components/live-editor/BlockRenderer";
import { StaticHomeContent } from "@/components/live-editor/StaticHomeContent";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const blocks = await listPageBlocks("home", locale);

  return (
    <EditablePageShell
      pageSlug="home"
      locale={locale}
      initialBlocks={blocks}
      fallbackContent={<StaticHomeContent locale={locale} />}
      serverRenderedBlocks={blocks.length > 0 ? <BlockDrivenPage blocks={blocks} locale={locale} /> : undefined}
    />
  );
}
