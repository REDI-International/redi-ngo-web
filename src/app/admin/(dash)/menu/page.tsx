import { listNav } from "@/db/queries";
import { PageHeader } from "@/components/admin/ui";
import { NavListClient } from "@/components/admin/NavListClient";

export default async function MenuAdminPage() {
  const items = await listNav();
  return (
    <>
      <PageHeader
        title="Navigation"
        description="Header and footer links. Use arrows to reorder within each location."
        action={{ href: "/admin/menu/new", label: "New link" }}
      />
      <NavListClient items={items} />
    </>
  );
}
