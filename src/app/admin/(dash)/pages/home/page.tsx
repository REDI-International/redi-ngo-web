import { listPageSections } from "@/db/queries";
import { PageHeader } from "@/components/admin/ui";
import { HomepageBuilder } from "@/components/admin/HomepageBuilder";

export default async function HomepageBuilderPage() {
  const sections = await listPageSections("homepage");

  return (
    <>
      <PageHeader
        title="Homepage builder"
        description="Reorder panels, edit copy, replace images, and set panel widths for the public homepage."
      />
      <HomepageBuilder sections={sections} />
    </>
  );
}
