import { listOpportunities } from "@/db/queries";
import { PageHeader } from "@/components/admin/ui";
import { OpportunityListClient } from "@/components/admin/OpportunityListClient";

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const items = await listOpportunities();
  const defaultType = type === "job" || type === "tender" || type === "grant" ? type : "all";

  return (
    <>
      <PageHeader
        title="Opportunities"
        description="Tenders, grants, and job postings in one place."
        action={{ href: "/admin/opportunities/new", label: "New opportunity" }}
      />
      <OpportunityListClient items={items} defaultType={defaultType as "all" | "tender" | "grant" | "job"} />
    </>
  );
}
