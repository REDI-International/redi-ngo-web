import { NavForm } from "@/components/admin/NavForm";
import { PageHeader } from "@/components/admin/ui";

export default function NewMenuItemPage() {
  return (
    <>
      <PageHeader title="New menu link" />
      <NavForm cancelHref="/admin/menu" />
    </>
  );
}
