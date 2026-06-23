import { getAdminSession } from "@/lib/admin/auth";
import { canEditContent } from "@/lib/admin/can-edit-content";
import { getDb } from "@/db/client";
import { EditModeProvider } from "@/components/live-editor/EditModeProvider";
import { EditModeAutoStart } from "@/components/live-editor/EditModeAutoStart";

export async function LiveEditLayoutShell({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  const canEdit = session ? canEditContent(session.role) : false;
  const dbConfigured = getDb() !== null;

  return (
    <EditModeProvider canEdit={canEdit} dbConfigured={dbConfigured} defaultLocale={locale}>
      <EditModeAutoStart />
      {children}
    </EditModeProvider>
  );
}
