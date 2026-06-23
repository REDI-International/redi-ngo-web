import { saveNavItem } from "@/lib/admin/nav-actions";
import { TextField, SelectField, CheckboxField, FormActions, FormCard } from "./ui";
import type { NavItem } from "@/db/schema";

export function NavForm({ item, cancelHref }: { item?: NavItem; cancelHref: string }) {
  return (
    <FormCard>
      <form action={saveNavItem} className="max-w-xl space-y-5">
        {item && <input type="hidden" name="id" value={item.id} />}
        <TextField label="Label" name="label" defaultValue={item?.label} required placeholder="e.g. Projects" />
        <TextField label="Link (href)" name="href" defaultValue={item?.href} required placeholder="/projects" />
        <SelectField
          label="Location"
          name="location"
          defaultValue={item?.location ?? "header"}
          options={[
            { value: "header", label: "Header" },
            { value: "footer", label: "Footer" },
          ]}
        />
        <div className="flex flex-wrap items-end gap-6">
          <CheckboxField label="Published" name="published" defaultChecked={item?.published ?? true} />
          <TextField label="Sort order" name="sortOrder" type="number" defaultValue={item?.sortOrder ?? 0} />
        </div>
        <FormActions cancelHref={cancelHref} />
      </form>
    </FormCard>
  );
}
