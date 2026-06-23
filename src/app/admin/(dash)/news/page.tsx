import { listNews } from "@/db/queries";
import { PageHeader } from "@/components/admin/ui";
import { NewsListClient } from "@/components/admin/NewsListClient";

export default async function NewsAdminPage() {
  const items = await listNews();
  return (
    <>
      <PageHeader
        title="News"
        description="Articles and announcements for the public site."
        action={{ href: "/admin/news/new", label: "New article" }}
      />
      <NewsListClient items={items} />
    </>
  );
}
