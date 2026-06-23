"use client";

import { Eye, Pencil, Save, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEditMode } from "./EditModeProvider";

export function LiveEditorToolbar({ onSave, saving }: { onSave: () => void; saving: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { canEdit, dbConfigured, isEditing, setIsEditing, dirty, pageSlug } = useEditMode();

  const exitEditMode = () => {
    setIsEditing(false);
    const params = new URLSearchParams(searchParams.toString());
    if (params.has("edit")) {
      params.delete("edit");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }
  };

  if (!canEdit) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[190] -translate-x-1/2 px-4 sm:bottom-6">
      <div className="flex items-center gap-1 rounded-full border border-black/10 bg-white/90 px-2 py-2 shadow-xl backdrop-blur-xl sm:gap-2 sm:px-3">
        {!dbConfigured ? (
          <span className="px-3 text-xs text-amber-800 sm:text-sm">
            Connect database to enable live editing
          </span>
        ) : (
          <>
            <button
              type="button"
              onClick={() => (isEditing ? exitEditMode() : setIsEditing(true))}
              disabled={!pageSlug}
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                isEditing
                  ? "bg-amber-400 text-amber-950"
                  : "bg-primary text-white hover:bg-primary-light"
              }`}
            >
              {isEditing ? <Eye className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              {isEditing ? "Preview" : "Edit page"}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={onSave}
                disabled={saving || !dirty}
                className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-40 sm:px-4 sm:text-sm"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save
              </button>
            )}

            {dirty && isEditing && (
              <span className="hidden text-xs text-amber-700 sm:inline">Unsaved changes</span>
            )}
          </>
        )}

        <Link
          href="/admin"
          className="flex items-center gap-1 rounded-full px-2 py-2 text-xs text-text-muted transition hover:bg-black/5 sm:px-3 sm:text-sm"
        >
          <ExternalLink className="h-4 w-4" />
          <span className="hidden sm:inline">Admin</span>
        </Link>
      </div>
    </div>
  );
}

export function EditingBanner() {
  const { isEditing, dirty } = useEditMode();
  if (!isEditing) return null;

  return (
    <div className="sticky top-0 z-[140] border-b border-amber-300 bg-amber-100 px-4 py-2 text-center text-sm font-medium text-amber-950">
      Editing mode — click a section to edit, drag to reorder
      {dirty && " · You have unsaved changes"}
    </div>
  );
}
