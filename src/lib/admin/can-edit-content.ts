import type { AdminRole } from "@/lib/admin/roles";

export function canEditContent(role: AdminRole): boolean {
  return role === "superadmin" || role === "admin" || role === "editor";
}
