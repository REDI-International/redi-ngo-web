import { OpportunityForm } from "@/components/admin/OpportunityForm";
import { PageHeader } from "@/components/admin/ui";

export default function NewJobPage() {
  return (
    <>
      <PageHeader title="New job" />
      <OpportunityForm kind="job" cancelHref="/admin/jobs" />
    </>
  );
}
