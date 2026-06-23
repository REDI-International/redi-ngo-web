import { listOpportunities } from "@/db/queries";
import { OpportunityTable } from "@/components/admin/OpportunityTable";
import { PageHeader } from "@/components/admin/ui";

export default async function TendersAdminPage() {
  const items = await listOpportunities(["tender", "grant"]);
  return (
    <>
      <PageHeader
        title="Tenders & Grants"
        description="Procurement, grants and calls for proposals."
        action={{ href: "/admin/tenders/new", label: "New tender" }}
      />
      <OpportunityTable items={items} basePath="/admin/tenders" />
    </>
  );
}
