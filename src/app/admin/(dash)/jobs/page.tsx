import { listOpportunities } from "@/db/queries";
import { OpportunityTable } from "@/components/admin/OpportunityTable";
import { PageHeader } from "@/components/admin/ui";

export default async function JobsAdminPage() {
  const items = await listOpportunities(["job"]);
  return (
    <>
      <PageHeader
        title="Jobs"
        description="Open roles, internships and expert positions."
        action={{ href: "/admin/jobs/new", label: "New job" }}
      />
      <OpportunityTable items={items} basePath="/admin/jobs" />
    </>
  );
}
