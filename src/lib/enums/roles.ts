// User roles enum
export enum UserRole {
  SUPER_ADMIN = "super_admin",
  // Future roles can be added here:
  // ADMIN = "admin",
  // MODERATOR = "moderator",
  // USER = "user",
}

// Role permissions enum
export enum Permission {
  READ = "read",
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
}

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    Permission.READ,
    Permission.CREATE,
    Permission.UPDATE,
    Permission.DELETE,
  ],
  // Example of how to add permissions for future roles:
  // [UserRole.ADMIN]: [
  //   Permission.READ,
  //   Permission.CREATE,
  //   Permission.UPDATE,
  // ],
  // [UserRole.MODERATOR]: [
  //   Permission.READ,
  //   Permission.UPDATE,
  // ],
  // [UserRole.USER]: [
  //   Permission.READ,
  // ],
};

// Helper function to check if user has specific permission
export function hasPermission(
  userRole: UserRole,
  permission: Permission,
): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
}

// Helper function to check if user has any of the specified permissions
export function hasAnyPermission(
  userRole: UserRole,
  permissions: Permission[],
): boolean {
  return permissions.some((permission) => hasPermission(userRole, permission));
}

// Helper function to check if user has all specified permissions
export function hasAllPermissions(
  userRole: UserRole,
  permissions: Permission[],
): boolean {
  return permissions.every((permission) => hasPermission(userRole, permission));
}
