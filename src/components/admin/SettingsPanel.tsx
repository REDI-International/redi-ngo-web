"use client";

import { deleteSetting, saveSetting } from "@/lib/admin/settings-actions";
import { DeleteButton } from "./DeleteButton";
import { FormActions, TextField, TextArea, FormCard } from "./ui";
import type { SiteSetting } from "@/db/schema";

const PRESETS = [
  { key: "hero_title", label: "Hero title", placeholder: "Empowering Roma communities" },
  { key: "hero_tagline", label: "Hero tagline", placeholder: "Building inclusive futures across Europe" },
  { key: "contact_email", label: "Contact email", placeholder: "info@redi-ngo.eu" },
  { key: "social_facebook", label: "Facebook URL", placeholder: "https://facebook.com/..." },
  { key: "social_linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/..." },
  { key: "social_twitter", label: "X / Twitter URL", placeholder: "https://x.com/..." },
];

export function SettingsPanel({ settings }: { settings: SiteSetting[] }) {
  const existing = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <FormCard title="Quick settings">
          <p className="mb-6 text-sm text-[#86868b]">
            Common site configuration keys. Values can be plain text or JSON.
          </p>
          <div className="space-y-4">
            {PRESETS.map((preset) => (
              <form key={preset.key} action={saveSetting} className="rounded-xl border border-black/[0.06] p-4">
                <input type="hidden" name="key" value={preset.key} />
                <p className="text-sm font-medium text-[#1d1d1f]">{preset.label}</p>
                <p className="mb-2 text-xs text-[#86868b]">{preset.key}</p>
                <TextArea
                  label="Value"
                  name="value"
                  rows={2}
                  defaultValue={
                    existing[preset.key] != null
                      ? typeof existing[preset.key] === "string"
                        ? (existing[preset.key] as string)
                        : JSON.stringify(existing[preset.key], null, 2)
                      : ""
                  }
                />
                <div className="mt-3">
                  <button type="submit" className="admin-btn-primary text-xs">
                    Save
                  </button>
                </div>
              </form>
            ))}
          </div>
        </FormCard>
      </div>

      <div className="lg:col-span-3 space-y-6">
        <FormCard title="Custom setting">
          <form action={saveSetting} className="space-y-5">
            <TextField label="Key" name="key" required placeholder="e.g. homepage_banner" />
            <TextArea label="Value" name="value" rows={6} hint="Plain text or valid JSON." />
            <FormActions cancelHref="/admin/settings" saveLabel="Save setting" />
          </form>
        </FormCard>

        <div>
          <h2 className="mb-4 text-lg font-semibold text-[#1d1d1f]">All settings ({settings.length})</h2>
          {settings.length === 0 ? (
            <div className="admin-card px-6 py-10 text-center text-sm text-[#86868b]">No settings stored yet.</div>
          ) : (
            <ul className="space-y-3">
              {settings.map((s) => (
                <li key={s.id} className="admin-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <code className="text-sm font-semibold text-[#1b4332]">{s.key}</code>
                    <DeleteButton action={deleteSetting} hiddenFields={{ key: s.key }} />
                  </div>
                  <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-[#fafafa] p-3 text-xs text-[#86868b]">
                    {JSON.stringify(s.value, null, 2)}
                  </pre>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
