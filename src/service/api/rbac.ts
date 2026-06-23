import { request } from '../request';

/** get permission list grouped by module */
export function fetchGetPermissionsGrouped() {
  return request<Api.Rbac.PermissionGroup[]>({ url: '/permissions/grouped' });
}

/** get the permissions already assigned to a role */
export function fetchGetRolePermissions(roleId: number) {
  return request<Api.Rbac.Permission[]>({ url: `/roles/${roleId}/permissions` });
}

/** replace a role's assigned permissions */
export function fetchAssignRolePermissions(roleId: number, permissionIds: number[]) {
  return request<null>({
    url: `/roles/${roleId}/permissions`,
    method: 'put',
    data: { permission_ids: permissionIds }
  });
}
