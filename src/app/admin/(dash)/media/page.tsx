import { listGallery } from "@/db/queries";
import { PageHeader } from "@/components/admin/ui";
import { MediaGrid } from "@/components/admin/MediaGrid";

export default async function MediaAdminPage() {
  const items = await listGallery();
  return (
    <>
      <PageHeader
        title="Media library"
        description="Photos and assets for the public gallery."
        action={{ href: "/admin/media/new", label: "Upload image" }}
      />
      <MediaGrid items={items} />
    </>
  );
}
