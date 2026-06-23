import { saveOpportunity } from "@/lib/admin/opportunity-actions";
import { toDateInput } from "@/lib/admin/helpers";
import { UploadField } from "./UploadField";
import { TextField, TextArea, SelectField, CheckboxField, FormActions, FormCard } from "./ui";
import type { Opportunity } from "@/db/schema";

export function OpportunityForm({
  item,
  kind,
  cancelHref,
}: {
  item?: Opportunity;
  kind: "tender" | "job";
  cancelHref: string;
}) {
  const typeOptions =
    kind === "job"
      ? [{ value: "job", label: "Job" }]
      : [
          { value: "tender", label: "Tender" },
          { value: "grant", label: "Grant" },
        ];

  return (
    <FormCard>
      <form action={saveOpportunity} className="max-w-3xl space-y-5">
        {item && <input type="hidden" name="id" value={item.id} />}
        <TextField label="Title" name="title" defaultValue={item?.title} required />
        <TextField label="Slug" name="slug" defaultValue={item?.slug} placeholder="auto-generated from title" />
        <SelectField
          label="Type"
          name="type"
          defaultValue={item?.type ?? (kind === "job" ? "job" : "tender")}
          options={typeOptions}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Country" name="country" defaultValue={item?.country} />
          <TextField label="Reference" name="reference" defaultValue={item?.reference} />
          <TextField label="Deadline" name="deadline" type="date" defaultValue={toDateInput(item?.deadline)} />
          <TextField label="Publish date" name="publishedAt" type="date" defaultValue={toDateInput(item?.publishedAt) ?? toDateInput(new Date())} />
        </div>
        <TextArea label="Summary (excerpt)" name="excerpt" defaultValue={item?.excerpt} rows={3} />
        <TextArea label="Full description (body)" name="body" defaultValue={item?.body} rows={10} />
        <UploadField name="image" label="Image (optional)" defaultValue={item?.image} />
        <div className="flex flex-wrap items-end gap-6">
          <CheckboxField label="Published" name="published" defaultChecked={item?.published ?? true} />
          <TextField label="Sort order" name="sortOrder" type="number" defaultValue={item?.sortOrder ?? 0} />
        </div>
        <FormActions cancelHref={cancelHref} />
      </form>
    </FormCard>
  );
}
