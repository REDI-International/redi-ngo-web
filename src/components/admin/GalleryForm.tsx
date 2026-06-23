import { saveGalleryImage } from "@/lib/admin/gallery-actions";
import { UploadField } from "./UploadField";
import { TextField, SelectField, CheckboxField, FormActions, FormCard } from "./ui";
import type { GalleryImage } from "@/db/schema";

const CATEGORIES = [
  { value: "community", label: "Community" },
  { value: "events", label: "Events" },
  { value: "entrepreneurs", label: "Entrepreneurs" },
  { value: "projects", label: "Projects" },
  { value: "team", label: "Team" },
];

export function GalleryForm({ item, cancelHref }: { item?: GalleryImage; cancelHref: string }) {
  return (
    <FormCard>
      <form action={saveGalleryImage} className="max-w-2xl space-y-5">
        {item && <input type="hidden" name="id" value={item.id} />}
        <UploadField name="url" label="Image" defaultValue={item?.url} />
        <TextField label="Alt text" name="alt" defaultValue={item?.alt} />
        <TextField label="Caption" name="caption" defaultValue={item?.caption} />
        <SelectField label="Category" name="category" defaultValue={item?.category ?? "community"} options={CATEGORIES} />
        <div className="flex flex-wrap items-end gap-6">
          <CheckboxField label="Published" name="published" defaultChecked={item?.published ?? true} />
          <TextField label="Sort order" name="sortOrder" type="number" defaultValue={item?.sortOrder ?? 0} />
        </div>
        <FormActions cancelHref={cancelHref} />
      </form>
    </FormCard>
  );
}
