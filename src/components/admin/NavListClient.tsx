"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp } from "lucide-react";
import { deleteNavItem, reorderNavItem } from "@/lib/admin/nav-actions";
import { DeleteButton } from "./DeleteButton";
import { DataTable, StatusBadge, TableLink } from "./DataTable";
import { EmptyState } from "./ui";
import type { NavItem } from "@/db/schema";

export function NavListClient({ items }: { items: NavItem[] }) {
  const [localItems, setLocalItems] = useState(items);

  const sorted = useMemo(
    () => [...localItems].sort((a, b) => a.location.localeCompare(b.location) || a.sortOrder - b.sortOrder),
    [localItems],
  );

  async function move(id: string, direction: "up" | "down") {
    const idx = sorted.findIndex((i) => i.id === id);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const current = sorted[idx];
    const swap = sorted[swapIdx];
    if (current.location !== swap.location) return;

    setLocalItems((prev) =>
      prev.map((item) => {
        if (item.id === current.id) return { ...item, sortOrder: swap.sortOrder };
        if (item.id === swap.id) return { ...item, sortOrder: current.sortOrder };
        return item;
      }),
    );

    const fd = new FormData();
    fd.set("id", id);
    fd.set("direction", direction);
    await reorderNavItem(fd);
  }

  if (items.length === 0) {
    return (
      <EmptyState
        message="No custom navigation items. The site uses its built-in menu."
        action={{ href: "/admin/menu/new", label: "Add link" }}
      />
    );
  }

  return (
    <DataTable
      items={sorted}
      searchPlaceholder="Search navigation…"
      emptyMessage="No navigation items."
      columns={[
        {
          key: "label",
          header: "Label",
          searchable: (i) => i.label,
          render: (item) => <TableLink href={`/admin/menu/${item.id}`}>{item.label}</TableLink>,
        },
        {
          key: "href",
          header: "Link",
          searchable: (i) => i.href,
          render: (item) => <span className="text-[#86868b]">{item.href}</span>,
        },
        {
          key: "location",
          header: "Location",
          render: (item) => <span className="capitalize text-[#86868b]">{item.location}</span>,
        },
        {
          key: "order",
          header: "Order",
          render: (item) => (
            <div className="flex items-center gap-1">
              <span className="text-[#86868b]">{item.sortOrder}</span>
              <button type="button" onClick={() => move(item.id, "up")} className="rounded p-0.5 hover:bg-black/5">
                <ArrowUp className="h-3.5 w-3.5 text-[#86868b]" />
              </button>
              <button type="button" onClick={() => move(item.id, "down")} className="rounded p-0.5 hover:bg-black/5">
                <ArrowDown className="h-3.5 w-3.5 text-[#86868b]" />
              </button>
            </div>
          ),
        },
        {
          key: "status",
          header: "Status",
          render: (item) => <StatusBadge published={item.published} labels={["Visible", "Hidden"]} />,
        },
      ]}
      actions={(item) => (
        <div className="flex items-center justify-end gap-3">
          <Link href={`/admin/menu/${item.id}`} className="text-xs font-semibold text-[#1b4332] hover:underline">
            Edit
          </Link>
          <DeleteButton action={deleteNavItem} hiddenFields={{ id: item.id }} />
        </div>
      )}
    />
  );
}
