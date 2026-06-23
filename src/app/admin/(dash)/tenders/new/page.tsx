import { OpportunityForm } from "@/components/admin/OpportunityForm";
import { PageHeader } from "@/components/admin/ui";

export default function NewTenderPage() {
  return (
    <>
      <PageHeader title="New tender" />
      <OpportunityForm kind="tender" cancelHref="/admin/tenders" />
    </>
  );
}
