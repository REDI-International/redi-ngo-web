import { GalleryForm } from "@/components/admin/GalleryForm";
import { PageHeader } from "@/components/admin/ui";

export default function NewMediaPage() {
  return (
    <>
      <PageHeader title="Add image" />
      <GalleryForm cancelHref="/admin/media" />
    </>
  );
}
