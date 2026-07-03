import { PermissionType } from "../enums/role.enum";
import { ForbiddenException } from "./appError";
import { RolePermissions } from "./role-permission";

/**
 * Guards a route action by asserting the user's role has ALL required permissions.
 * Throws ForbiddenException (403) — not UnauthorizedException (401) — because the
 * user IS authenticated, they simply lack the permission for this specific action.
 */
export const roleGuard = (
  role: keyof typeof RolePermissions,
  requiredPermissions: PermissionType[]
) => {
  const permissions = RolePermissions[role];

  const hasPermission = requiredPermissions.every((permission) =>
    permissions.includes(permission)
  );

  if (!hasPermission) {
    throw new ForbiddenException(
      "You do not have the necessary permissions to perform this action"
    );
  }
};