import Link from "next/link";

const inputCls =
  "mt-1 w-full rounded-lg border border-surface-dark bg-white px-3 py-2 text-sm outline-none focus:border-primary";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">{title}</h1>
        {description && <p className="mt-1 text-sm text-text-muted">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-light"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function TextField({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-text">{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? undefined}
        required={required}
        placeholder={placeholder}
        className={inputCls}
      />
    </label>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  rows = 6,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-text">{label}</span>
      <textarea name={name} defaultValue={defaultValue ?? undefined} rows={rows} className={inputCls} />
    </label>
  );
}

export function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-text">{label}</span>
      <select name={name} defaultValue={defaultValue ?? options[0]?.value} className={inputCls}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CheckboxField({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 rounded border-surface-dark" />
      <span className="text-sm font-medium text-text">{label}</span>
    </label>
  );
}

export function FormActions({ cancelHref, saveLabel = "Save" }: { cancelHref: string; saveLabel?: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <button
        type="submit"
        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-light"
      >
        {saveLabel}
      </button>
      <Link href={cancelHref} className="text-sm font-medium text-text-muted hover:text-text">
        Cancel
      </Link>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-surface-dark bg-white p-10 text-center text-sm text-text-muted">
      {message}
    </div>
  );
}
