"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export function DeleteButton({
  action,
  hiddenFields,
  label = "Delete",
  confirmMessage = "Are you sure you want to delete this? This cannot be undone.",
}: {
  action: (formData: FormData) => Promise<void>;
  hiddenFields: Record<string, string>;
  label?: string;
  confirmMessage?: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <form action={action}>
          {Object.entries(hiddenFields).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))}
          <button
            type="submit"
            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
          >
            Confirm
          </button>
        </form>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-xs font-medium text-[#86868b] hover:text-[#1d1d1f]"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 transition hover:text-red-700"
    >
      <Trash2 className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
