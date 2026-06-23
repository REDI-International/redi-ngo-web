import { PageHeader } from "@/components/admin/ui";
import { PageSectionForm } from "@/components/admin/PageSectionForm";

export default function NewPageSectionPage() {
  return (
    <>
      <PageHeader title="New page section" description="Add an editable block to a page." />
      <PageSectionForm cancelHref="/admin/pages" />
    </>
  );
}
