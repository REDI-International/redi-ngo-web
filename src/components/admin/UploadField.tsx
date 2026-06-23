"use client";

import { useState } from "react";

export function UploadField({
  name,
  label = "Image",
  defaultValue = "",
}: {
  name: string;
  label?: string;
  defaultValue?: string | null;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Upload failed");
      } else {
        setUrl(json.url);
      }
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <span className="block text-sm font-medium text-text">{label}</span>
      <input type="hidden" name={name} value={url} />
      <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1 space-y-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://… or upload a file"
            className="w-full rounded-lg border border-surface-dark bg-white px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <div className="flex items-center gap-3">
            <input type="file" accept="image/*" onChange={onFileChange} className="text-xs text-text-muted" />
            {uploading && <span className="text-xs text-text-muted">Uploading…</span>}
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt="Preview"
            className="h-20 w-28 rounded-lg border border-surface-dark object-cover"
          />
        )}
      </div>
    </div>
  );
}
