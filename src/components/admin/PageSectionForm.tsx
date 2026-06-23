import { savePageSection } from "@/lib/admin/page-section-actions";
import { TextField, TextArea, SelectField, CheckboxField, FormActions, FormCard } from "./ui";
import type { PageSection } from "@/db/schema";

export function PageSectionForm({ item, cancelHref }: { item?: PageSection; cancelHref: string }) {
  const contentDefault =
    item?.content != null
      ? typeof item.content === "string"
        ? item.content
        : JSON.stringify(item.content, null, 2)
      : "";

  return (
    <FormCard>
      <form action={savePageSection} className="max-w-2xl space-y-5">
        {item && <input type="hidden" name="id" value={item.id} />}
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            label="Page"
            name="pageKey"
            defaultValue={item?.pageKey ?? "homepage"}
            options={[
              { value: "homepage", label: "Homepage" },
              { value: "about", label: "About" },
              { value: "contact", label: "Contact" },
              { value: "global", label: "Global / site-wide" },
            ]}
          />
          <TextField
            label="Section key"
            name="sectionKey"
            defaultValue={item?.sectionKey}
            required
            placeholder="hero, stats, cta"
            hint="Unique identifier within the page"
          />
        </div>
        <TextField label="Title (optional)" name="title" defaultValue={item?.title} />
        <TextArea
          label="Content (JSON or text)"
          name="content"
          defaultValue={contentDefault}
          rows={12}
          hint='Example: {"headline":"Welcome","body":"..."} or plain text'
        />
        <div className="flex items-end gap-6">
          <CheckboxField label="Published" name="published" defaultChecked={item?.published ?? true} />
          <TextField label="Sort order" name="sortOrder" type="number" defaultValue={item?.sortOrder ?? 0} />
        </div>
        <FormActions cancelHref={cancelHref} />
      </form>
    </FormCard>
  );
}
