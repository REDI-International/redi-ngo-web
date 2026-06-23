import Link from "next/link";
import { listGallery } from "@/db/queries";
import { deleteGalleryImage } from "@/lib/admin/gallery-actions";
import { PageHeader, EmptyState } from "@/components/admin/ui";

export default async function MediaAdminPage() {
  const items = await listGallery();
  return (
    <>
      <PageHeader
        title="Media gallery"
        description="Photos shown in the public gallery."
        action={{ href: "/admin/media/new", label: "Add image" }}
      />
      {items.length === 0 ? (
        <EmptyState message="No images yet. Use “Add image” to upload one." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-xl border border-surface-dark bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.alt ?? ""} className="aspect-[4/3] w-full object-cover" />
              <div className="p-3">
                <p className="truncate text-xs font-medium text-text">{item.caption ?? item.alt ?? "Untitled"}</p>
                <p className="mt-0.5 text-[11px] capitalize text-text-muted">{item.category}</p>
                <div className="mt-2 flex items-center justify-between">
                  <Link href={`/admin/media/${item.id}`} className="text-xs font-semibold text-primary hover:underline">
                    Edit
                  </Link>
                  <form action={deleteGalleryImage}>
                    <input type="hidden" name="id" value={item.id} />
                    <button type="submit" className="text-xs font-semibold text-red-600 hover:underline">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
