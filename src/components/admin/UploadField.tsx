"use client";

import { useCallback, useState } from "react";
import { Upload, Loader2, ImageIcon } from "lucide-react";

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
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File) => {
    setUploading(true);
    setError(null);
    setProgress(10);
    try {
      const fd = new FormData();
      fd.append("file", file);
      setProgress(40);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      setProgress(90);
      if (!res.ok) {
        setError(json.error ?? "Upload failed");
      } else {
        setUrl(json.url);
        setProgress(100);
      }
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 600);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith("image/")) uploadFile(file);
      else setError("Please drop an image file");
    },
    [uploadFile],
  );

  return (
    <div>
      <span className="block text-sm font-medium text-[#1d1d1f]">{label}</span>
      <input type="hidden" name={name} value={url} />

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`mt-2 rounded-xl border-2 border-dashed p-5 transition ${
          dragOver ? "border-[#1b4332] bg-[#1b4332]/5" : "border-black/10 bg-[#fafafa]"
        }`}
      >
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Preview" className="h-24 w-32 rounded-lg border border-black/10 object-cover shadow-sm" />
          ) : (
            <div className="flex h-24 w-32 items-center justify-center rounded-lg border border-black/10 bg-white">
              <ImageIcon className="h-8 w-8 text-[#86868b]" />
            </div>
          )}
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <p className="text-sm text-[#86868b]">Drag & drop an image, or browse</p>
            <label className="admin-btn-secondary inline-flex cursor-pointer">
              <Upload className="h-4 w-4" />
              Choose file
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadFile(file);
                }}
              />
            </label>
            {uploading && (
              <div className="flex items-center gap-2 text-xs text-[#86868b]">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Uploading…
              </div>
            )}
            {progress > 0 && progress < 100 && (
              <div className="h-1 overflow-hidden rounded-full bg-black/5">
                <div className="h-full rounded-full bg-[#1b4332] transition-all" style={{ width: `${progress}%` }} />
              </div>
            )}
          </div>
        </div>
      </div>

      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Or paste an image URL"
        className="admin-input mt-2"
      />
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
