import { notFound } from "next/navigation";
import { getGalleryById } from "@/db/queries";
import { GalleryForm } from "@/components/admin/GalleryForm";
import { PageHeader } from "@/components/admin/ui";

export default async function EditMediaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getGalleryById(id);
  if (!item) notFound();
  return (
    <>
      <PageHeader title="Edit image" />
      <GalleryForm item={item} cancelHref="/admin/media" />
    </>
  );
}
