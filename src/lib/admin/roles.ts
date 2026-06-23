export const ADMIN_ROLES = ["superadmin", "admin", "editor"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export function isAdminRole(value: string): value is AdminRole {
  return ADMIN_ROLES.includes(value as AdminRole);
}

export function canManageUsers(role: AdminRole): boolean {
  return role === "superadmin" || role === "admin";
}

export function roleLabel(role: AdminRole): string {
  switch (role) {
    case "superadmin":
      return "Superadmin";
    case "admin":
      return "Admin";
    case "editor":
      return "Editor";
  }
}

export function roleBadgeClass(role: AdminRole): string {
  switch (role) {
    case "superadmin":
      return "bg-purple-100 text-purple-800";
    case "admin":
      return "bg-blue-100 text-blue-800";
    case "editor":
      return "bg-gray-100 text-gray-700";
  }
}
