import { saveNews } from "@/lib/admin/news-actions";
import { toDateInput } from "@/lib/admin/helpers";
import { UploadField } from "./UploadField";
import { TextField, TextArea, SelectField, CheckboxField, FormActions } from "./ui";
import type { NewsPost } from "@/db/schema";

export function NewsForm({ item, cancelHref }: { item?: NewsPost; cancelHref: string }) {
  return (
    <form action={saveNews} className="max-w-2xl space-y-5">
      {item && <input type="hidden" name="id" value={item.id} />}
      <TextField label="Title" name="title" defaultValue={item?.title} required />
      <TextField label="Slug" name="slug" defaultValue={item?.slug} placeholder="auto-generated from title" />
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Language"
          name="language"
          defaultValue={item?.language ?? "en"}
          options={[
            { value: "en", label: "English" },
            { value: "ro", label: "Română" },
          ]}
        />
        <TextField label="Publish date" name="publishedAt" type="date" defaultValue={toDateInput(item?.publishedAt) ?? toDateInput(new Date())} />
      </div>
      <TextField label="Country (optional)" name="country" defaultValue={item?.country} />
      <TextArea label="Summary (excerpt)" name="excerpt" defaultValue={item?.excerpt} rows={3} />
      <TextArea label="Body" name="body" defaultValue={item?.body} rows={12} />
      <UploadField name="image" label="Featured image" defaultValue={item?.image} />
      <div className="flex items-end gap-6">
        <CheckboxField label="Published" name="published" defaultChecked={item?.published ?? true} />
        <TextField label="Sort order" name="sortOrder" type="number" defaultValue={item?.sortOrder ?? 0} />
      </div>
      <FormActions cancelHref={cancelHref} />
    </form>
  );
}
