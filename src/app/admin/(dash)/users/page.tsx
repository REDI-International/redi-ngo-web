import Link from "next/link";
import { listAdminUsers } from "@/db/queries";
import { requireUserManagers } from "@/lib/admin/auth";
import { createAdminUser, updateAdminUserRole, removeAdminUser } from "@/lib/admin/user-actions";
import { PageHeader } from "@/components/admin/ui";
import { UsersPanel } from "@/components/admin/UsersPanel";
import { ADMIN_ROLES } from "@/lib/admin/roles";

export default async function UsersAdminPage() {
  const session = await requireUserManagers();
  const users = await listAdminUsers();

  return (
    <>
      <PageHeader
        title="Admin users"
        description="Invite editors and admins. New users receive a temporary password and must change it on first login."
      />
      <UsersPanel
        users={users}
        currentUserId={session.profile.id}
        currentRole={session.role}
        roles={ADMIN_ROLES}
        createAction={createAdminUser}
        updateRoleAction={updateAdminUserRole}
        removeAction={removeAdminUser}
      />
    </>
  );
}
