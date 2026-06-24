import { request } from '../request';

/** backend shape of a user record, see admin-api-v1.md 6.1 */
interface AdminUserRecord {
  id: number;
  username: string;
  real_name: string;
  role: Api.Admin.UserRole;
  department: string;
  phone: string;
  email: string;
  status: number;
  created_at: string;
}

function toUser(record: AdminUserRecord): Api.Admin.User {
  return {
    id: record.id,
    userName: record.username,
    realName: record.real_name,
    role: record.role,
    department: record.department,
    phone: record.phone,
    email: record.email,
    status: record.status,
    createTime: record.created_at
  };
}

/** lightweight user options for selects (asset assignee, ticket handler, etc.) */
export async function fetchGetUserOptions(role?: Api.Admin.UserRole) {
  const result = await request<{ items: AdminUserRecord[] }>({
    url: '/users',
    method: 'get',
    params: { role, status: 1, page: 1, page_size: 100 }
  });

  if (result.error || !result.data) {
    return { ...result, data: null };
  }

  return {
    ...result,
    data: result.data.items.map((item): CommonType.Option<number> => ({ label: item.real_name, value: item.id }))
  };
}

/** get user list */
export async function fetchGetAdminUserList(params?: Api.Admin.UserSearchParams) {
  const result = await request<{
    items: AdminUserRecord[];
    total: number;
    page: number;
    page_size: number;
  }>({
    url: '/users',
    method: 'get',
    params: {
      keyword: params?.keyword,
      role: params?.role,
      status: params?.status,
      department: params?.department,
      page: params?.current,
      page_size: params?.size
    }
  });

  if (result.error || !result.data) {
    return result;
  }

  return {
    ...result,
    data: {
      records: result.data.items.map(toUser),
      current: result.data.page,
      size: result.data.page_size,
      total: result.data.total
    } satisfies Api.Admin.UserList
  };
}

interface CreateUserParams {
  username: string;
  password: string;
  realName: string;
  role: Api.Admin.UserRole;
  department: string;
  phone: string;
  email: string;
  status: number;
}

/** create user */
export function fetchCreateUser(params: CreateUserParams) {
  return request<{ id: number }>({
    url: '/users',
    method: 'post',
    data: {
      username: params.username,
      password: params.password,
      real_name: params.realName,
      role: params.role,
      department: params.department,
      phone: params.phone,
      email: params.email,
      status: params.status
    }
  });
}

interface UpdateUserParams {
  realName: string;
  role: Api.Admin.UserRole;
  department: string;
  phone: string;
  email: string;
  status: number;
}

/** update user */
export function fetchUpdateUser(userId: number, params: UpdateUserParams) {
  return request<null>({
    url: `/users/${userId}`,
    method: 'put',
    data: {
      real_name: params.realName,
      role: params.role,
      department: params.department,
      phone: params.phone,
      email: params.email,
      status: params.status
    }
  });
}

/** enable/disable user */
export function fetchUpdateUserStatus(userId: number, status: number) {
  return request<null>({
    url: `/users/${userId}/status`,
    method: 'patch',
    data: { status }
  });
}

/** reset user password */
export function fetchResetUserPassword(userId: number, newPassword: string) {
  return request<null>({
    url: `/users/${userId}/password`,
    method: 'patch',
    data: { new_password: newPassword }
  });
}

/** delete user */
export function fetchDeleteUser(userId: number) {
  return request<null>({
    url: `/users/${userId}`,
    method: 'delete'
  });
}

/** batch delete users */
export async function fetchBatchDeleteUsers(ids: number[]) {
  const result = await request<{ deleted_count: number; failed_items: { id: number; reason: string }[] }>({
    url: '/users/batch-delete',
    method: 'post',
    data: { ids }
  });

  if (result.error || !result.data) {
    return { ...result, data: null };
  }

  return {
    ...result,
    data: {
      deletedCount: result.data.deleted_count,
      failedItems: result.data.failed_items
    } satisfies Api.Admin.BatchDeleteResult
  };
}

/** backend shape of a role record, see admin-api-v1.md 16.1 */
interface AdminRoleRecord {
  id: number;
  role_name: string;
  role_code: string;
  description: string;
  status: number;
  created_at: string;
}

function toRole(record: AdminRoleRecord): Api.Admin.Role {
  return {
    id: record.id,
    roleName: record.role_name,
    roleCode: record.role_code,
    description: record.description,
    status: record.status,
    createTime: record.created_at
  };
}

/** get role list */
export async function fetchGetAdminRoleList(params?: Api.Admin.RoleSearchParams) {
  const result = await request<{
    items: AdminRoleRecord[];
    total: number;
    page: number;
    page_size: number;
  }>({
    url: '/roles',
    method: 'get',
    params: {
      keyword: params?.keyword,
      status: params?.status,
      page: params?.current,
      page_size: params?.size
    }
  });

  if (result.error || !result.data) {
    return result;
  }

  return {
    ...result,
    data: {
      records: result.data.items.map(toRole),
      current: result.data.page,
      size: result.data.page_size,
      total: result.data.total
    } satisfies Api.Admin.RoleList
  };
}

interface RoleParams {
  roleName: string;
  roleCode: string;
  description: string;
  status: number;
}

/** create role */
export function fetchCreateRole(params: RoleParams) {
  return request<{ id: number }>({
    url: '/roles',
    method: 'post',
    data: {
      role_name: params.roleName,
      role_code: params.roleCode,
      description: params.description,
      status: params.status
    }
  });
}

/** update role */
export function fetchUpdateRole(roleId: number, params: Omit<RoleParams, 'roleCode'>) {
  return request<null>({
    url: `/roles/${roleId}`,
    method: 'put',
    data: {
      role_name: params.roleName,
      description: params.description,
      status: params.status
    }
  });
}

/** delete role */
export function fetchDeleteRole(roleId: number) {
  return request<null>({
    url: `/roles/${roleId}`,
    method: 'delete'
  });
}
