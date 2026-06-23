import Link from "next/link";
import { listNav } from "@/db/queries";
import { deleteNavItem } from "@/lib/admin/nav-actions";
import { PageHeader, EmptyState } from "@/components/admin/ui";

export default async function MenuAdminPage() {
  const items = await listNav();
  return (
    <>
      <PageHeader
        title="Menu / Navigation"
        description="Header and footer links. When empty, the site uses its built-in menu."
        action={{ href: "/admin/menu/new", label: "New link" }}
      />
      {items.length === 0 ? (
        <EmptyState message="No custom menu items. The site is using its default navigation." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-surface-dark bg-white">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs uppercase tracking-wide text-text-muted">
              <tr>
                <th className="px-4 py-3">Label</th>
                <th className="px-4 py-3">Link</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-dark">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-surface/50">
                  <td className="px-4 py-3 font-medium text-text">{item.label}</td>
                  <td className="px-4 py-3 text-text-muted">{item.href}</td>
                  <td className="px-4 py-3 capitalize text-text-muted">{item.location}</td>
                  <td className="px-4 py-3 text-text-muted">{item.sortOrder}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        item.published ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.published ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/menu/${item.id}`} className="text-xs font-semibold text-primary hover:underline">
                        Edit
                      </Link>
                      <form action={deleteNavItem}>
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
