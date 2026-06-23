import { notFound } from "next/navigation";
import { getNavById } from "@/db/queries";
import { NavForm } from "@/components/admin/NavForm";
import { PageHeader } from "@/components/admin/ui";

export default async function EditMenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getNavById(id);
  if (!item) notFound();
  return (
    <>
      <PageHeader title="Edit menu link" />
      <NavForm item={item} cancelHref="/admin/menu" />
    </>
  );
}
