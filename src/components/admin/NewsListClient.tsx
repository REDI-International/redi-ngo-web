"use client";

import Link from "next/link";
import { deleteNews } from "@/lib/admin/news-actions";
import { toDateInput } from "@/lib/admin/helpers";
import { DeleteButton } from "./DeleteButton";
import { DataTable, StatusBadge, TableLink } from "./DataTable";
import { EmptyState } from "./ui";
import type { NewsPost } from "@/db/schema";

export function NewsListClient({ items }: { items: NewsPost[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        message="No news articles yet."
        action={{ href: "/admin/news/new", label: "Write first article" }}
      />
    );
  }

  return (
    <DataTable
      items={items}
      searchPlaceholder="Search news…"
      emptyMessage="No articles found."
      columns={[
        {
          key: "title",
          header: "Title",
          searchable: (i) => i.title,
          render: (item) => <TableLink href={`/admin/news/${item.id}`}>{item.title}</TableLink>,
        },
        {
          key: "language",
          header: "Lang",
          render: (item) => <span className="uppercase text-[#86868b]">{item.language}</span>,
        },
        {
          key: "date",
          header: "Published",
          render: (item) => <span className="text-[#86868b]">{toDateInput(item.publishedAt) ?? "—"}</span>,
        },
        {
          key: "status",
          header: "Status",
          render: (item) => <StatusBadge published={item.published} />,
        },
      ]}
      actions={(item) => (
        <div className="flex items-center justify-end gap-3">
          <Link href={`/admin/news/${item.id}`} className="text-xs font-semibold text-[#1b4332] hover:underline">
            Edit
          </Link>
          <DeleteButton action={deleteNews} hiddenFields={{ id: item.id }} />
        </div>
      )}
    />
  );
}
