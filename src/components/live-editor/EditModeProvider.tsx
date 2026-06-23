"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { PageBlock } from "@/lib/blocks/types";

interface EditModeContextValue {
  canEdit: boolean;
  dbConfigured: boolean;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  pageSlug: string | null;
  setPageSlug: (slug: string | null) => void;
  locale: string;
  setLocale: (locale: string) => void;
  blocks: PageBlock[];
  setBlocks: (blocks: PageBlock[] | ((prev: PageBlock[]) => PageBlock[])) => void;
  dirty: boolean;
  setDirty: (dirty: boolean) => void;
  selectedBlockId: string | null;
  setSelectedBlockId: (id: string | null) => void;
  toast: (message: string, type?: "success" | "error") => void;
}

const EditModeContext = createContext<EditModeContextValue | null>(null);

export function useEditMode() {
  const ctx = useContext(EditModeContext);
  if (!ctx) throw new Error("useEditMode must be used within EditModeProvider");
  return ctx;
}

export function useEditModeOptional() {
  return useContext(EditModeContext);
}

export function EditModeProvider({
  children,
  canEdit,
  dbConfigured,
  defaultLocale,
}: {
  children: React.ReactNode;
  canEdit: boolean;
  dbConfigured: boolean;
  defaultLocale: string;
}) {
  const [isEditing, setIsEditingState] = useState(false);
  const [pageSlug, setPageSlug] = useState<string | null>(null);
  const [locale, setLocale] = useState(defaultLocale);
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [dirty, setDirty] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<{ id: number; message: string; type: "success" | "error" }[]>([]);

  const toast = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const setIsEditing = useCallback((value: boolean) => {
    setIsEditingState(value);
    if (!value) setSelectedBlockId(null);
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const value = useMemo(
    () => ({
      canEdit,
      dbConfigured,
      isEditing,
      setIsEditing,
      pageSlug,
      setPageSlug,
      locale,
      setLocale,
      blocks,
      setBlocks,
      dirty,
      setDirty,
      selectedBlockId,
      setSelectedBlockId,
      toast,
    }),
    [canEdit, dbConfigured, isEditing, setIsEditing, pageSlug, locale, blocks, dirty, selectedBlockId, toast],
  );

  return (
    <EditModeContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-24 right-4 z-[200] flex flex-col gap-2 sm:bottom-6 sm:right-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm font-medium shadow-lg ${
              t.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-red-200 bg-red-50 text-red-900"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </EditModeContext.Provider>
  );
}
