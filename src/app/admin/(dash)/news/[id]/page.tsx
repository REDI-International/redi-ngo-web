import { notFound } from "next/navigation";
import { getNewsById } from "@/db/queries";
import { NewsForm } from "@/components/admin/NewsForm";
import { PageHeader } from "@/components/admin/ui";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getNewsById(id);
  if (!item) notFound();
  return (
    <>
      <PageHeader title="Edit article" />
      <NewsForm item={item} cancelHref="/admin/news" />
    </>
  );
}
