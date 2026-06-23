import Link from "next/link";
import { deleteOpportunity } from "@/lib/admin/opportunity-actions";
import { toDateInput } from "@/lib/admin/helpers";
import { EmptyState } from "./ui";
import type { Opportunity } from "@/db/schema";

export function OpportunityTable({ items, basePath }: { items: Opportunity[]; basePath: string }) {
  if (items.length === 0) {
    return <EmptyState message="Nothing here yet. Use “New” to add the first one." />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-surface-dark bg-white">
      <table className="w-full text-sm">
        <thead className="bg-surface text-left text-xs uppercase tracking-wide text-text-muted">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Country</th>
            <th className="px-4 py-3">Deadline</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-dark">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-surface/50">
              <td className="px-4 py-3 font-medium text-text">
                <Link href={`${basePath}/${item.id}`} className="hover:text-primary">
                  {item.title}
                </Link>
              </td>
              <td className="px-4 py-3 capitalize text-text-muted">{item.type}</td>
              <td className="px-4 py-3 text-text-muted">{item.country ?? "—"}</td>
              <td className="px-4 py-3 text-text-muted">{toDateInput(item.deadline) ?? "—"}</td>
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
                  <Link href={`${basePath}/${item.id}`} className="text-xs font-semibold text-primary hover:underline">
                    Edit
                  </Link>
                  <form action={deleteOpportunity}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="type" value={item.type} />
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
  );
}
