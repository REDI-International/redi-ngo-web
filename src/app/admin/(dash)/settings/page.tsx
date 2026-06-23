import { listSettings } from "@/db/queries";
import { saveSetting, deleteSetting } from "@/lib/admin/settings-actions";
import { PageHeader, TextField, TextArea, FormActions } from "@/components/admin/ui";

export default async function SettingsAdminPage() {
  const settings = await listSettings();
  return (
    <>
      <PageHeader
        title="Site settings"
        description="Key / value entries for editable sections, banners and configuration."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-surface-dark bg-white p-6">
          <h2 className="font-heading text-lg font-bold text-text">Add / update a setting</h2>
          <p className="mt-1 text-sm text-text-muted">
            Value can be plain text or JSON (objects/arrays are parsed automatically).
          </p>
          <form action={saveSetting} className="mt-4 space-y-5">
            <TextField label="Key" name="key" required placeholder="e.g. homepage_banner" />
            <TextArea label="Value" name="value" rows={6} />
            <FormActions cancelHref="/admin/settings" saveLabel="Save setting" />
          </form>
        </div>

        <div>
          <h2 className="mb-3 font-heading text-lg font-bold text-text">Existing settings</h2>
          {settings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-surface-dark bg-white p-6 text-sm text-text-muted">
              No settings stored yet.
            </div>
          ) : (
            <ul className="space-y-3">
              {settings.map((s) => (
                <li key={s.id} className="rounded-xl border border-surface-dark bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <code className="text-sm font-semibold text-primary">{s.key}</code>
                    <form action={deleteSetting}>
                      <input type="hidden" name="key" value={s.key} />
                      <button type="submit" className="text-xs font-semibold text-red-600 hover:underline">
                        Delete
                      </button>
                    </form>
                  </div>
                  <pre className="mt-2 overflow-x-auto rounded bg-surface p-2 text-xs text-text-muted">
                    {JSON.stringify(s.value, null, 2)}
                  </pre>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
