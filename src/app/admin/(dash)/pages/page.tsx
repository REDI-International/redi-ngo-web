import Link from "next/link";
import { listPageSections } from "@/db/queries";
import { deletePageSection } from "@/lib/admin/page-section-actions";
import { PageHeader, EmptyState } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { StatusBadge } from "@/components/admin/DataTable";

export default async function PagesAdminPage() {
  const sections = await listPageSections();

  return (
    <>
      <PageHeader
        title="Page sections"
        description="Manage homepage blocks, hero content, and editable page sections."
        action={{ href: "/admin/pages/new", label: "New section" }}
      />
      {sections.length === 0 ? (
        <EmptyState
          message="No page sections yet. Add hero, stats, or CTA blocks for the homepage."
          action={{ href: "/admin/pages/new", label: "Create section" }}
        />
      ) : (
        <div className="admin-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/[0.06] bg-[#fafafa] text-left text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">
                <th className="px-4 py-3">Page</th>
                <th className="px-4 py-3">Section</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {sections.map((s) => (
                <tr key={s.id} className="transition hover:bg-[#fafafa]">
                  <td className="px-4 py-3 capitalize text-[#86868b]">{s.pageKey}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[#1d1d1f]">{s.sectionKey}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/pages/${s.id}`} className="font-medium hover:text-[#1b4332]">
                      {s.title ?? "—"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[#86868b]">{s.sortOrder}</td>
                  <td className="px-4 py-3">
                    <StatusBadge published={s.published} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/pages/${s.id}`} className="text-xs font-semibold text-[#1b4332] hover:underline">
                        Edit
                      </Link>
                      <DeleteButton action={deletePageSection} hiddenFields={{ id: s.id }} />
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
