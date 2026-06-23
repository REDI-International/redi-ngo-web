"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { EmptyState } from "./ui";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  searchable?: (item: T) => string;
}

export function DataTable<T extends { id: string }>({
  items,
  columns,
  searchPlaceholder = "Search…",
  emptyMessage = "Nothing here yet.",
  actions,
}: {
  items: T[];
  columns: DataTableColumn<T>[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  actions?: (item: T) => React.ReactNode;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      columns.some((col) => {
        if (!col.searchable) return false;
        return col.searchable(item).toLowerCase().includes(q);
      }),
    );
  }, [items, columns, query]);

  if (items.length === 0) return <EmptyState message={emptyMessage} />;

  return (
    <div className="admin-card overflow-hidden">
      <div className="border-b border-black/[0.06] px-4 py-3">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#86868b]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="admin-input pl-9"
          />
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="px-4 py-10 text-center text-sm text-[#86868b]">No results for &ldquo;{query}&rdquo;</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/[0.06] bg-[#fafafa] text-left text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3">
                    {col.header}
                  </th>
                ))}
                {actions && <th className="px-4 py-3" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {filtered.map((item) => (
                <tr key={item.id} className="transition hover:bg-[#fafafa]">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3.5">
                      {col.render(item)}
                    </td>
                  ))}
                  {actions && <td className="px-4 py-3.5 text-right">{actions(item)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function StatusBadge({ published, labels }: { published: boolean; labels?: [string, string] }) {
  const [on, off] = labels ?? ["Published", "Draft"];
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
        published ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-600"
      }`}
    >
      {published ? on : off}
    </span>
  );
}

export function TableLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-medium text-[#1d1d1f] transition hover:text-[#1b4332]">
      {children}
    </Link>
  );
}
