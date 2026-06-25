import { request } from '../request';

/** backend shape of an assignment rule record, see admin-api-v1.md 21.1 */
interface AssignmentRuleRecord {
  id: number;
  name: string;
  category_id: number | null;
  priority: Api.Ticket.TicketPriority | null;
  ops_group_id: number | null;
  ops_group_name: string | null;
  assign_strategy: Api.TicketAssignment.AssignStrategy;
  target_user_id: number | null;
  target_user_name: string | null;
  enabled: boolean;
  sort_order: number;
  remark: string | null;
  created_at: string;
  updated_at: string;
}

function toRule(record: AssignmentRuleRecord): Api.TicketAssignment.Rule {
  return {
    id: record.id,
    name: record.name,
    categoryId: record.category_id,
    priority: record.priority,
    opsGroupId: record.ops_group_id,
    opsGroupName: record.ops_group_name,
    assignStrategy: record.assign_strategy,
    targetUserId: record.target_user_id,
    targetUserName: record.target_user_name,
    enabled: record.enabled,
    sortOrder: record.sort_order,
    remark: record.remark,
    createTime: record.created_at,
    updateTime: record.updated_at
  };
}

/** get assignment rule list */
export async function fetchGetAssignmentRuleList(params?: Api.TicketAssignment.RuleSearchParams) {
  const result = await request<{
    items: AssignmentRuleRecord[];
    total: number;
    page: number;
    page_size: number;
  }>({
    url: '/ticket-assignment-rules',
    method: 'get',
    params: {
      name: params?.name,
      category_id: params?.categoryId,
      priority: params?.priority,
      ops_group_id: params?.opsGroupId,
      target_user_id: params?.targetUserId,
      assign_strategy: params?.assignStrategy,
      enabled: params?.enabled,
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
      records: result.data.items.map(toRule),
      current: result.data.page,
      size: result.data.page_size,
      total: result.data.total
    } satisfies Api.TicketAssignment.RuleList
  };
}

interface AssignmentRuleParams {
  name: string;
  categoryId: number | null;
  priority: Api.Ticket.TicketPriority | null;
  opsGroupId: number | null;
  assignStrategy: Api.TicketAssignment.AssignStrategy;
  targetUserId: number | null;
  enabled: boolean;
  sortOrder: number;
  remark: string | null;
}

function toRulePayload(params: AssignmentRuleParams) {
  return {
    name: params.name,
    category_id: params.categoryId,
    priority: params.priority,
    ops_group_id: params.opsGroupId,
    assign_strategy: params.assignStrategy,
    target_user_id: params.targetUserId,
    enabled: params.enabled,
    sort_order: params.sortOrder,
    remark: params.remark
  };
}

/** create assignment rule */
export function fetchCreateAssignmentRule(params: AssignmentRuleParams) {
  return request<AssignmentRuleRecord>({
    url: '/ticket-assignment-rules',
    method: 'post',
    data: toRulePayload(params)
  });
}

/** update assignment rule */
export function fetchUpdateAssignmentRule(ruleId: number, params: AssignmentRuleParams) {
  return request<AssignmentRuleRecord>({
    url: `/ticket-assignment-rules/${ruleId}`,
    method: 'put',
    data: toRulePayload(params)
  });
}

/** enable/disable assignment rule */
export function fetchUpdateAssignmentRuleStatus(ruleId: number, enabled: boolean) {
  return request<{ id: number; enabled: boolean }>({
    url: `/ticket-assignment-rules/${ruleId}/status`,
    method: 'patch',
    data: { enabled }
  });
}

/** delete assignment rule */
export function fetchDeleteAssignmentRule(ruleId: number) {
  return request<null>({
    url: `/ticket-assignment-rules/${ruleId}`,
    method: 'delete'
  });
}
