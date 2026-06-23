"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { deleteOpportunity } from "@/lib/admin/opportunity-actions";
import { toDateInput } from "@/lib/admin/helpers";
import { DeleteButton } from "./DeleteButton";
import { DataTable, StatusBadge, TableLink } from "./DataTable";
import { EmptyState } from "./ui";
import type { Opportunity } from "@/db/schema";

const TYPE_FILTERS = ["all", "tender", "grant", "job"] as const;

export function OpportunityListClient({
  items,
  defaultType = "all",
}: {
  items: Opportunity[];
  defaultType?: (typeof TYPE_FILTERS)[number];
}) {
  const [typeFilter, setTypeFilter] = useState<(typeof TYPE_FILTERS)[number]>(defaultType);

  const filtered = useMemo(() => {
    if (typeFilter === "all") return items;
    return items.filter((i) => i.type === typeFilter);
  }, [items, typeFilter]);

  const basePath = (type: string) => (type === "job" ? "/admin/jobs" : "/admin/tenders");

  if (items.length === 0) {
    return (
      <EmptyState
        message="No opportunities yet. Add tenders, grants, or job postings."
        action={{ href: "/admin/opportunities/new", label: "Create opportunity" }}
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {TYPE_FILTERS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTypeFilter(t)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition ${
              typeFilter === t ? "bg-[#1b4332] text-white" : "bg-black/5 text-[#86868b] hover:bg-black/10"
            }`}
          >
            {t === "all" ? "All types" : t}
          </button>
        ))}
      </div>

      <DataTable
        items={filtered}
        searchPlaceholder="Search opportunities…"
        emptyMessage="No opportunities match your filters."
        columns={[
          {
            key: "title",
            header: "Title",
            searchable: (i) => `${i.title} ${i.reference ?? ""}`,
            render: (item) => (
              <TableLink href={`${basePath(item.type)}/${item.id}`}>{item.title}</TableLink>
            ),
          },
          {
            key: "type",
            header: "Type",
            render: (item) => <span className="capitalize text-[#86868b]">{item.type}</span>,
          },
          {
            key: "country",
            header: "Country",
            searchable: (i) => i.country ?? "",
            render: (item) => <span className="text-[#86868b]">{item.country ?? "—"}</span>,
          },
          {
            key: "deadline",
            header: "Deadline",
            render: (item) => <span className="text-[#86868b]">{toDateInput(item.deadline) ?? "—"}</span>,
          },
          {
            key: "status",
            header: "Status",
            render: (item) => <StatusBadge published={item.published} />,
          },
        ]}
        actions={(item) => (
          <div className="flex items-center justify-end gap-3">
            <Link href={`${basePath(item.type)}/${item.id}`} className="text-xs font-semibold text-[#1b4332] hover:underline">
              Edit
            </Link>
            <DeleteButton
              action={deleteOpportunity}
              hiddenFields={{ id: item.id, type: item.type }}
            />
          </div>
        )}
      />
    </div>
  );
}
