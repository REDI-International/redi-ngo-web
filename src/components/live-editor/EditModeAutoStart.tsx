"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useEditMode } from "./EditModeProvider";

function EditModeAutoStartInner() {
  const params = useSearchParams();
  const { setIsEditing, canEdit, dbConfigured } = useEditMode();

  useEffect(() => {
    if (params.get("edit") === "1" && canEdit && dbConfigured) {
      setIsEditing(true);
    }
  }, [params, canEdit, dbConfigured, setIsEditing]);

  return null;
}

export function EditModeAutoStart() {
  return (
    <Suspense fallback={null}>
      <EditModeAutoStartInner />
    </Suspense>
  );
}
