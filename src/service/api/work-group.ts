import { request } from '../request';

/** backend shape of a work group record, see admin-api-v1.md 20.1 */
interface WorkGroupRecord {
  id: number;
  group_name: string;
  group_code: string;
  description: string | null;
  leader_id: number | null;
  leader_name: string | null;
  status: number;
  sort_order: number;
  member_count: number;
  created_at: string;
  updated_at: string;
}

function toWorkGroup(record: WorkGroupRecord): Api.WorkGroup.WorkGroup {
  return {
    id: record.id,
    groupName: record.group_name,
    groupCode: record.group_code,
    description: record.description,
    leaderId: record.leader_id,
    leaderName: record.leader_name,
    status: record.status,
    sortOrder: record.sort_order,
    memberCount: record.member_count,
    createTime: record.created_at,
    updateTime: record.updated_at
  };
}

/** get work group list */
export async function fetchGetWorkGroupList(params?: Api.WorkGroup.WorkGroupSearchParams) {
  const result = await request<{
    items: WorkGroupRecord[];
    total: number;
    page: number;
    page_size: number;
  }>({
    url: '/work-groups',
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
      records: result.data.items.map(toWorkGroup),
      current: result.data.page,
      size: result.data.page_size,
      total: result.data.total
    } satisfies Api.WorkGroup.WorkGroupList
  };
}

/** get work group detail */
export async function fetchGetWorkGroupDetail(groupId: number) {
  const result = await request<WorkGroupRecord>({
    url: `/work-groups/${groupId}`,
    method: 'get'
  });

  if (result.error || !result.data) {
    return { ...result, data: null };
  }

  return { ...result, data: toWorkGroup(result.data) };
}

interface WorkGroupParams {
  groupName: string;
  groupCode: string;
  description: string | null;
  leaderId: number | null;
  status: number;
  sortOrder: number;
}

function toWorkGroupPayload(params: WorkGroupParams) {
  return {
    group_name: params.groupName,
    group_code: params.groupCode,
    description: params.description,
    leader_id: params.leaderId,
    status: params.status,
    sort_order: params.sortOrder
  };
}

/** create work group */
export function fetchCreateWorkGroup(params: WorkGroupParams) {
  return request<WorkGroupRecord>({
    url: '/work-groups',
    method: 'post',
    data: toWorkGroupPayload(params)
  });
}

/** update work group */
export function fetchUpdateWorkGroup(groupId: number, params: WorkGroupParams) {
  return request<WorkGroupRecord>({
    url: `/work-groups/${groupId}`,
    method: 'put',
    data: toWorkGroupPayload(params)
  });
}

/** delete work group (also disables all of its members server-side) */
export function fetchDeleteWorkGroup(groupId: number) {
  return request<null>({
    url: `/work-groups/${groupId}`,
    method: 'delete'
  });
}

/** backend shape of a work group member record, see admin-api-v1.md 20.6 */
interface WorkGroupMemberRecord {
  id: number;
  group_id: number;
  user_id: number;
  username: string;
  real_name: string;
  phone: string;
  member_role: Api.WorkGroup.MemberRole;
  status: number;
  joined_at: string;
  created_at: string;
  updated_at: string;
}

function toWorkGroupMember(record: WorkGroupMemberRecord): Api.WorkGroup.WorkGroupMember {
  return {
    id: record.id,
    groupId: record.group_id,
    userId: record.user_id,
    username: record.username,
    realName: record.real_name,
    phone: record.phone,
    memberRole: record.member_role,
    status: record.status,
    joinedAt: record.joined_at,
    createTime: record.created_at,
    updateTime: record.updated_at
  };
}

/** get work group member list */
export async function fetchGetWorkGroupMemberList(groupId: number, params?: Api.WorkGroup.WorkGroupMemberSearchParams) {
  const result = await request<{
    items: WorkGroupMemberRecord[];
    total: number;
    page: number;
    page_size: number;
  }>({
    url: `/work-groups/${groupId}/members`,
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
      records: result.data.items.map(toWorkGroupMember),
      current: result.data.page,
      size: result.data.page_size,
      total: result.data.total
    } satisfies Api.WorkGroup.WorkGroupMemberList
  };
}

/** add a member to a work group */
export function fetchAddWorkGroupMember(groupId: number, userId: number, memberRole: Api.WorkGroup.MemberRole) {
  return request<WorkGroupMemberRecord>({
    url: `/work-groups/${groupId}/members`,
    method: 'post',
    data: { user_id: userId, member_role: memberRole }
  });
}

/** update a work group member's role/status */
export function fetchUpdateWorkGroupMember(
  groupId: number,
  userId: number,
  params: { memberRole: Api.WorkGroup.MemberRole; status: number }
) {
  return request<WorkGroupMemberRecord>({
    url: `/work-groups/${groupId}/members/${userId}`,
    method: 'put',
    data: { member_role: params.memberRole, status: params.status }
  });
}

/** remove a member from a work group */
export function fetchRemoveWorkGroupMember(groupId: number, userId: number) {
  return request<null>({
    url: `/work-groups/${groupId}/members/${userId}`,
    method: 'delete'
  });
}
