import Link from "next/link";
import { Plus } from "lucide-react";

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
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">{title}</h1>
        {description && <p className="mt-1.5 text-[15px] text-[#86868b]">{description}</p>}
      </div>
      {action && (
        <Link href={action.href} className="admin-btn-primary shrink-0">
          <Plus className="h-4 w-4" />
          {action.label}
        </Link>
      )}
    </div>
  );
}

const inputCls = "admin-input mt-1.5";

export function TextField({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[#1d1d1f]">{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? undefined}
        required={required}
        placeholder={placeholder}
        className={inputCls}
      />
      {hint && <p className="mt-1 text-xs text-[#86868b]">{hint}</p>}
    </label>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  rows = 6,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[#1d1d1f]">{label}</span>
      <textarea name={name} defaultValue={defaultValue ?? undefined} rows={rows} className={inputCls} />
      {hint && <p className="mt-1 text-xs text-[#86868b]">{hint}</p>}
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
      <span className="text-sm font-medium text-[#1d1d1f]">{label}</span>
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
    <label className="flex cursor-pointer items-center gap-2.5">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-black/20 text-[#1b4332] focus:ring-[#1b4332]/30"
      />
      <span className="text-sm font-medium text-[#1d1d1f]">{label}</span>
    </label>
  );
}

export function FormActions({ cancelHref, saveLabel = "Save changes" }: { cancelHref: string; saveLabel?: string }) {
  return (
    <div className="flex items-center gap-3 border-t border-black/[0.06] pt-6">
      <button type="submit" className="admin-btn-primary">
        {saveLabel}
      </button>
      <Link href={cancelHref} className="admin-btn-secondary">
        Cancel
      </Link>
    </div>
  );
}

export function EmptyState({ message, action }: { message: string; action?: { href: string; label: string } }) {
  return (
    <div className="admin-card flex flex-col items-center px-6 py-16 text-center">
      <p className="max-w-sm text-[15px] text-[#86868b]">{message}</p>
      {action && (
        <Link href={action.href} className="admin-btn-primary mt-6">
          <Plus className="h-4 w-4" />
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function FormCard({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="admin-card p-6 lg:p-8">
      {title && <h2 className="mb-6 text-lg font-semibold text-[#1d1d1f]">{title}</h2>}
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  href,
  accent,
}: {
  label: string;
  value: number;
  href: string;
  accent?: string;
}) {
  return (
    <Link href={href} className="admin-card group block p-6 transition hover:-translate-y-0.5">
      <p className="text-sm font-medium text-[#86868b]">{label}</p>
      <p className={`mt-2 text-4xl font-semibold tracking-tight ${accent ?? "text-[#1b4332]"}`}>{value}</p>
      <p className="mt-3 text-xs font-medium text-[#86868b] opacity-0 transition group-hover:opacity-100">
        Manage →
      </p>
    </Link>
  );
}

export function LoadingSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="admin-skeleton h-12 w-full" />
      ))}
    </div>
  );
}
