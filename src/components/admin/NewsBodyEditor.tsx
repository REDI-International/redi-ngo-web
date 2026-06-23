"use client";

import { useState } from "react";
import { Eye, Pencil } from "lucide-react";

export function NewsBodyEditor({
  name,
  defaultValue = "",
  label = "Body",
}: {
  name: string;
  defaultValue?: string | null;
  label?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-[#1d1d1f]">{label}</span>
        <div className="flex rounded-lg border border-black/[0.08] bg-[#fafafa] p-0.5">
          <button
            type="button"
            onClick={() => setTab("edit")}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
              tab === "edit" ? "bg-white text-[#1d1d1f] shadow-sm" : "text-[#86868b]"
            }`}
          >
            <Pencil className="h-3 w-3" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
              tab === "preview" ? "bg-white text-[#1d1d1f] shadow-sm" : "text-[#86868b]"
            }`}
          >
            <Eye className="h-3 w-3" />
            Preview
          </button>
        </div>
      </div>
      <input type="hidden" name={name} value={value} />
      {tab === "edit" ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={14}
          className="admin-input font-mono text-[13px] leading-relaxed"
          placeholder="Write content here. HTML is supported."
        />
      ) : (
        <div
          className="admin-input min-h-[320px] overflow-auto prose prose-sm max-w-none text-[#1d1d1f]"
          dangerouslySetInnerHTML={{ __html: value || "<p class='text-[#86868b]'>Nothing to preview yet.</p>" }}
        />
      )}
      <p className="mt-1.5 text-xs text-[#86868b]">Supports HTML. Use Preview to check formatting.</p>
    </div>
  );
}
