import { request } from '../request';

/** backend shape of a ticket category record, see admin-api-v1.md 8.8.1 */
interface TicketCategoryRecord {
  id: number;
  parent_id: number | null;
  name: string;
  code: string;
  description: string | null;
  default_priority: Api.Ticket.TicketPriority | null;
  default_group_id: number | null;
  default_group_name: string | null;
  assignment_strategy: Api.TicketAssignment.AssignStrategy | null;
  fixed_assignee_id: number | null;
  fixed_assignee_name: string | null;
  require_asset: number;
  sort_order: number;
  status: number;
  created_at: string;
  updated_at: string;
}

interface TicketCategoryTreeRecord extends TicketCategoryRecord {
  children: TicketCategoryTreeRecord[];
}

function toTicketCategory(record: TicketCategoryRecord): Api.TicketCategory.TicketCategory {
  return {
    id: record.id,
    parentId: record.parent_id,
    name: record.name,
    code: record.code,
    description: record.description,
    defaultPriority: record.default_priority,
    defaultGroupId: record.default_group_id,
    defaultGroupName: record.default_group_name,
    assignmentStrategy: record.assignment_strategy,
    fixedAssigneeId: record.fixed_assignee_id,
    fixedAssigneeName: record.fixed_assignee_name,
    requireAsset: record.require_asset,
    sortOrder: record.sort_order,
    status: record.status,
    createTime: record.created_at,
    updateTime: record.updated_at
  };
}

function toTicketCategoryTreeNode(record: TicketCategoryTreeRecord): Api.TicketCategory.TicketCategoryTreeNode {
  return {
    ...toTicketCategory(record),
    children: record.children.map(toTicketCategoryTreeNode)
  };
}

/** get ticket category list (flat, no pagination — matches the backend's contract) */
export async function fetchGetTicketCategoryList(params?: Api.TicketCategory.TicketCategorySearchParams) {
  const result = await request<TicketCategoryRecord[]>({
    url: '/ticket-categories',
    method: 'get',
    params: {
      keyword: params?.keyword,
      status: params?.status,
      parent_id: params?.parentId
    }
  });

  if (result.error || !result.data) {
    return result;
  }

  return { ...result, data: result.data.map(toTicketCategory) };
}

/** get ticket category tree */
export async function fetchGetTicketCategoryTree(params?: Api.TicketCategory.TicketCategoryTreeSearchParams) {
  const result = await request<TicketCategoryTreeRecord[]>({
    url: '/ticket-categories/tree',
    method: 'get',
    params: { status: params?.status }
  });

  if (result.error || !result.data) {
    return result;
  }

  return { ...result, data: result.data.map(toTicketCategoryTreeNode) };
}

/** get ticket category detail */
export async function fetchGetTicketCategoryDetail(categoryId: number) {
  const result = await request<TicketCategoryRecord>({
    url: `/ticket-categories/${categoryId}`,
    method: 'get'
  });

  if (result.error || !result.data) {
    return { ...result, data: null };
  }

  return { ...result, data: toTicketCategory(result.data) };
}

interface TicketCategoryParams {
  parentId: number | null;
  name: string;
  code: string;
  description: string | null;
  defaultPriority: Api.Ticket.TicketPriority | null;
  defaultGroupId: number | null;
  assignmentStrategy: Api.TicketAssignment.AssignStrategy | null;
  fixedAssigneeId: number | null;
  requireAsset: number;
  sortOrder: number;
  status: number;
}

function toTicketCategoryPayload(params: TicketCategoryParams) {
  return {
    parent_id: params.parentId,
    name: params.name,
    code: params.code,
    description: params.description,
    default_priority: params.defaultPriority,
    default_group_id: params.defaultGroupId,
    assignment_strategy: params.assignmentStrategy,
    fixed_assignee_id: params.fixedAssigneeId,
    require_asset: params.requireAsset,
    sort_order: params.sortOrder,
    status: params.status
  };
}

/** create ticket category */
export function fetchCreateTicketCategory(params: TicketCategoryParams) {
  return request<TicketCategoryRecord>({
    url: '/ticket-categories',
    method: 'post',
    data: toTicketCategoryPayload(params)
  });
}

/** update ticket category */
export function fetchUpdateTicketCategory(categoryId: number, params: TicketCategoryParams) {
  return request<TicketCategoryRecord>({
    url: `/ticket-categories/${categoryId}`,
    method: 'put',
    data: toTicketCategoryPayload(params)
  });
}

/** enable/disable ticket category */
export function fetchUpdateTicketCategoryStatus(categoryId: number, status: number) {
  return request<{ id: number; status: number }>({
    url: `/ticket-categories/${categoryId}/status`,
    method: 'patch',
    data: { status }
  });
}

/** delete (soft-disable) ticket category */
export function fetchDeleteTicketCategory(categoryId: number) {
  return request<null>({
    url: `/ticket-categories/${categoryId}`,
    method: 'delete'
  });
}
