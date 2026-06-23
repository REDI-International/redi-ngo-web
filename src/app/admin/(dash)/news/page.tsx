import Link from "next/link";
import { listNews } from "@/db/queries";
import { deleteNews } from "@/lib/admin/news-actions";
import { toDateInput } from "@/lib/admin/helpers";
import { PageHeader, EmptyState } from "@/components/admin/ui";

export default async function NewsAdminPage() {
  const items = await listNews();
  return (
    <>
      <PageHeader
        title="News"
        description="Articles and announcements."
        action={{ href: "/admin/news/new", label: "New article" }}
      />
      {items.length === 0 ? (
        <EmptyState message="No articles yet." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-surface-dark bg-white">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs uppercase tracking-wide text-text-muted">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-dark">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-surface/50">
                  <td className="px-4 py-3 font-medium text-text">
                    <Link href={`/admin/news/${item.id}`} className="hover:text-primary">
                      {item.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-text-muted">{toDateInput(item.publishedAt) ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        item.published ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/news/${item.id}`} className="text-xs font-semibold text-primary hover:underline">
                        Edit
                      </Link>
                      <form action={deleteNews}>
                        <input type="hidden" name="id" value={item.id} />
                        <button type="submit" className="text-xs font-semibold text-red-600 hover:underline">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
