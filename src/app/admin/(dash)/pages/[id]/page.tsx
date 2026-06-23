import { notFound } from "next/navigation";
import { getPageSectionById } from "@/db/queries";
import { PageHeader } from "@/components/admin/ui";
import { PageSectionForm } from "@/components/admin/PageSectionForm";

export default async function EditPageSectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getPageSectionById(id);
  if (!item) notFound();

  return (
    <>
      <PageHeader title="Edit page section" description={`${item.pageKey} / ${item.sectionKey}`} />
      <PageSectionForm item={item} cancelHref="/admin/pages" />
    </>
  );
}
