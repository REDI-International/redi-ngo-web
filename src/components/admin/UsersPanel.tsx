"use client";

import { useState } from "react";
import { DeleteButton } from "./DeleteButton";
import { roleBadgeClass, roleLabel, type AdminRole } from "@/lib/admin/roles";
import type { AdminUser } from "@/db/schema";

export function UsersPanel({
  users,
  currentUserId,
  currentRole,
  roles,
  createAction,
  updateRoleAction,
  removeAction,
}: {
  users: AdminUser[];
  currentUserId: string;
  currentRole: AdminRole;
  roles: readonly AdminRole[];
  createAction: (formData: FormData) => Promise<void>;
  updateRoleAction: (formData: FormData) => Promise<void>;
  removeAction: (formData: FormData) => Promise<void>;
}) {
  const [showForm, setShowForm] = useState(false);
  const assignableRoles =
    currentRole === "superadmin" ? roles : roles.filter((r) => r !== "superadmin");

  return (
    <div className="space-y-8">
      <div className="admin-card p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[#1d1d1f]">Invite user</h2>
            <p className="mt-1 text-sm text-[#86868b]">
              New accounts use the shared initial password and must set a personal password on first login.
            </p>
          </div>
          <button type="button" onClick={() => setShowForm((v) => !v)} className="admin-btn-secondary shrink-0">
            {showForm ? "Cancel" : "Add user"}
          </button>
        </div>
        {showForm && (
          <form action={createAction} className="mt-6 grid gap-4 sm:grid-cols-3">
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-[#1d1d1f]">Email</span>
              <input type="email" name="email" required className="admin-input mt-1.5" placeholder="name@redi-ngo.eu" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-[#1d1d1f]">Role</span>
              <select name="role" defaultValue="editor" className="admin-input mt-1.5">
                {assignableRoles.map((role) => (
                  <option key={role} value={role}>{roleLabel(role)}</option>
                ))}
              </select>
            </label>
            <div className="sm:col-span-3">
              <button type="submit" className="admin-btn-primary">Create user</button>
            </div>
          </form>
        )}
      </div>

      <div className="admin-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/[0.06] bg-[#fafafa] text-left text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Password</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.04]">
            {users.map((user) => {
              const isSelf = user.id === currentUserId;
              const canEditRole =
                !isSelf &&
                (currentRole === "superadmin" || user.role !== "superadmin");
              const canRemove = canEditRole;

              return (
                <tr key={user.id} className="transition hover:bg-[#fafafa]">
                  <td className="px-4 py-3 font-medium text-[#1d1d1f]">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${roleBadgeClass(user.role as AdminRole)}`}>
                      {roleLabel(user.role as AdminRole)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#86868b]">
                    {user.mustChangePassword ? "Must change on login" : "Set"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {canEditRole && (
                        <form action={updateRoleAction} className="flex items-center gap-2">
                          <input type="hidden" name="id" value={user.id} />
                          <select
                            name="role"
                            defaultValue={user.role}
                            className="rounded-lg border border-black/10 px-2 py-1 text-xs"
                            onChange={(e) => e.currentTarget.form?.requestSubmit()}
                          >
                            {assignableRoles.map((role) => (
                              <option key={role} value={role}>{roleLabel(role)}</option>
                            ))}
                          </select>
                        </form>
                      )}
                      {canRemove && (
                        <DeleteButton action={removeAction} hiddenFields={{ id: user.id }} label="Remove" />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
