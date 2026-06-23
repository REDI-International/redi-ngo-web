import { notFound } from "next/navigation";
import { getOpportunityById } from "@/db/queries";
import { OpportunityForm } from "@/components/admin/OpportunityForm";
import { PageHeader } from "@/components/admin/ui";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getOpportunityById(id);
  if (!item) notFound();
  return (
    <>
      <PageHeader title="Edit job" />
      <OpportunityForm kind="job" item={item} cancelHref="/admin/jobs" />
    </>
  );
}
