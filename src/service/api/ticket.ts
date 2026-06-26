import { request } from '../request';

/** backend shape of a ticket list row, see admin-api-v1.md 9.1 (now also returned by 9.2/9.3 in full) */
interface TicketRecordItem {
  id: number;
  ticket_no: string;
  title: string;
  category_id: number;
  category_name: string | null;
  priority: Api.Ticket.TicketPriority;
  status: Api.Ticket.TicketStatus;
  reporter_id: number;
  reporter_name: string;
  handler_id: number | null;
  handler_name: string | null;
  assignee_id: number | null;
  assignee_name: string | null;
  assign_type: Api.Ticket.AssignType | null;
  assigner_id: number | null;
  assigner_name: string | null;
  assigned_at: string | null;
  asset_id: number | null;
  asset_no: string | null;
  asset_name: string | null;
  created_at: string;
  completed_at: string | null;
  sla_response_deadline: string | null;
  sla_resolve_deadline: string | null;
  first_response_at: string | null;
  resolved_at: string | null;
  response_overdue: number;
  resolve_overdue: number;
}

function toTicket(record: TicketRecordItem): Api.Ticket.Ticket {
  return {
    id: record.id,
    ticketNo: record.ticket_no,
    title: record.title,
    categoryId: record.category_id,
    categoryName: record.category_name,
    priority: record.priority,
    status: record.status,
    reporterId: record.reporter_id,
    reporterName: record.reporter_name,
    handlerId: record.handler_id,
    handlerName: record.handler_name,
    assigneeId: record.assignee_id,
    assigneeName: record.assignee_name,
    assignType: record.assign_type,
    assignerId: record.assigner_id,
    assignerName: record.assigner_name,
    assignedAt: record.assigned_at,
    assetId: record.asset_id,
    assetNo: record.asset_no,
    assetName: record.asset_name,
    createTime: record.created_at,
    completedAt: record.completed_at,
    slaResponseDeadline: record.sla_response_deadline,
    slaResolveDeadline: record.sla_resolve_deadline,
    firstResponseAt: record.first_response_at,
    resolvedAt: record.resolved_at,
    responseOverdue: record.response_overdue,
    resolveOverdue: record.resolve_overdue
  };
}

/** get ticket list */
export async function fetchGetTicketList(params?: Api.Ticket.TicketSearchParams) {
  const result = await request<{
    items: TicketRecordItem[];
    total: number;
    page: number;
    page_size: number;
  }>({
    url: '/tickets',
    method: 'get',
    params: {
      keyword: params?.keyword,
      status: params?.status,
      priority: params?.priority,
      category_id: params?.categoryId,
      reporter_id: params?.reporterId,
      handler_id: params?.handlerId,
      asset_id: params?.assetId,
      start_date: params?.startDate,
      end_date: params?.endDate,
      is_overdue: params?.isOverdue || undefined,
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
      records: result.data.items.map(toTicket),
      current: result.data.page,
      size: result.data.page_size,
      total: result.data.total
    } satisfies Api.Ticket.TicketList
  };
}

interface CreateTicketParams {
  title: string;
  description: string;
  categoryId: number;
  priority?: Api.Ticket.TicketPriority;
  assetId?: number | null;
}

/**
 * backend shape of ticket detail.
 *
 * Note: the running backend returns the same flat shape as a list row (`TicketRecordItem`) plus
 * `description`/`result`/`accepted_at`/`started_at` — verified directly against `GET /tickets/{id}`, which
 * does NOT match admin-api-v1.md 9.3's documented nested `reporter`/`handler`/`asset`/`records` example.
 * `POST /tickets` now returns this same full shape too (verified live), not the old minimal
 * `{id, ticket_no, status}` — needed so the create-drawer can show the real auto-assignment result.
 */
interface TicketDetailRecord extends TicketRecordItem {
  description: string;
  result: string | null;
  accepted_at: string | null;
  started_at: string | null;
}

function toTicketDetail(record: TicketDetailRecord): Api.Ticket.TicketDetail {
  return {
    ...toTicket(record),
    description: record.description,
    result: record.result,
    acceptedAt: record.accepted_at,
    startedAt: record.started_at
  };
}

/** create ticket */
export async function fetchCreateTicket(params: CreateTicketParams) {
  const result = await request<TicketDetailRecord>({
    url: '/tickets',
    method: 'post',
    data: {
      title: params.title,
      description: params.description,
      category_id: params.categoryId,
      priority: params.priority,
      asset_id: params.assetId
    }
  });

  if (result.error || !result.data) {
    return { ...result, data: null };
  }

  return { ...result, data: toTicketDetail(result.data) };
}

/** get ticket detail */
export async function fetchGetTicketDetail(ticketId: number) {
  const result = await request<TicketDetailRecord>({
    url: `/tickets/${ticketId}`,
    method: 'get'
  });

  if (result.error || !result.data) {
    return result;
  }

  const detail: Api.Ticket.TicketDetail = toTicketDetail(result.data);

  return { ...result, data: detail };
}

/** backend shape of a ticket status-change record, see admin-api-v1.md 10.1 */
interface TicketRecordItemRaw {
  id: number;
  ticket_id: number;
  operator_id: number;
  operator_name: string;
  from_status: Api.Ticket.TicketStatus | null;
  to_status: Api.Ticket.TicketStatus;
  action: string;
  remark: string;
  created_at: string;
}

/** get a ticket's status-change timeline */
export async function fetchGetTicketRecords(ticketId: number) {
  const result = await request<TicketRecordItemRaw[]>({
    url: `/tickets/${ticketId}/records`,
    method: 'get'
  });

  if (result.error || !result.data) {
    return result;
  }

  return {
    ...result,
    data: result.data.map(
      (item): Api.Ticket.TicketRecord => ({
        id: item.id,
        operatorId: item.operator_id,
        operatorName: item.operator_name,
        fromStatus: item.from_status,
        toStatus: item.to_status,
        action: item.action,
        remark: item.remark,
        createTime: item.created_at
      })
    )
  };
}

interface UpdateTicketParams {
  title: string;
  description: string;
  categoryId: number;
  priority: Api.Ticket.TicketPriority;
  assetId?: number | null;
}

/** update ticket basic info */
export function fetchUpdateTicket(ticketId: number, params: UpdateTicketParams) {
  return request<null>({
    url: `/tickets/${ticketId}`,
    method: 'put',
    data: {
      title: params.title,
      description: params.description,
      category_id: params.categoryId,
      priority: params.priority,
      asset_id: params.assetId
    }
  });
}

/** assign ticket to a handler */
export function fetchAssignTicket(ticketId: number, handlerId: number, remark?: string) {
  return request<null>({
    url: `/tickets/${ticketId}/assign`,
    method: 'patch',
    data: { handler_id: handlerId, remark }
  });
}

/** start processing ticket */
export function fetchStartTicket(ticketId: number, remark?: string) {
  return request<null>({
    url: `/tickets/${ticketId}/start`,
    method: 'patch',
    data: { remark }
  });
}

interface CompleteTicketParams {
  result: string;
  faultReason?: string;
  repairMethod?: string;
  repairResult: 'fixed' | 'replace_repair' | 'scrapped' | 'unresolved';
  repairCost?: number;
  assetStatusAfterRepair?: 'in_use' | 'repairing' | 'scrapped';
  remark?: string;
}

/** complete ticket */
export function fetchCompleteTicket(ticketId: number, params: CompleteTicketParams) {
  return request<null>({
    url: `/tickets/${ticketId}/complete`,
    method: 'patch',
    data: {
      result: params.result,
      fault_reason: params.faultReason,
      repair_method: params.repairMethod,
      repair_result: params.repairResult,
      repair_cost: params.repairCost,
      asset_status_after_repair: params.assetStatusAfterRepair,
      remark: params.remark
    }
  });
}

/** cancel ticket */
export function fetchCancelTicket(ticketId: number, reason: string) {
  return request<null>({
    url: `/tickets/${ticketId}/cancel`,
    method: 'patch',
    data: { reason }
  });
}

/** backend shape of an auto-assign attempt result, see admin-api-v1.md 21.6 */
interface AutoAssignResultRecord {
  success: boolean;
  ticket_id: number;
  assignee_id: number | null;
  assignee_name: string | null;
  rule_id: number | null;
  assign_type: Api.Ticket.AssignType | null;
  assign_strategy: Api.TicketAssignment.AssignStrategy | null;
  fail_stage: string | null;
  fail_reason: string | null;
}

/** manually (re-)trigger auto-assignment for a ticket; `force` allows reassigning a ticket that already has a handler */
export async function fetchAutoAssignTicket(ticketId: number, force = false) {
  const result = await request<AutoAssignResultRecord>({
    url: `/tickets/${ticketId}/auto-assign`,
    method: 'post',
    params: { force: force || undefined }
  });

  if (result.error || !result.data) {
    return { ...result, data: null };
  }

  const record = result.data;

  return {
    ...result,
    data: {
      success: record.success,
      ticketId: record.ticket_id,
      assigneeId: record.assignee_id,
      assigneeName: record.assignee_name,
      ruleId: record.rule_id,
      assignType: record.assign_type,
      assignStrategy: record.assign_strategy,
      failStage: record.fail_stage,
      failReason: record.fail_reason
    } satisfies Api.TicketAssignment.AutoAssignResult
  };
}

/** delete ticket */
export function fetchDeleteTicket(ticketId: number) {
  return request<null>({
    url: `/tickets/${ticketId}`,
    method: 'delete'
  });
}

/** backend shape of the ticket status summary, see admin-api-v1.md 9.2 */
interface TicketStatisticsSummaryRecord {
  total: number;
  pending_assign: number;
  pending_accept: number;
  processing: number;
  pending_confirm: number;
  completed: number;
  closed: number;
  cancelled: number;
  overdue: number;
}

/** get ticket status summary counts, used by the statistics cards on the ticket list/statistics pages */
export async function fetchGetTicketStatisticsSummary() {
  const result = await request<TicketStatisticsSummaryRecord>({
    url: '/tickets/statistics/summary',
    method: 'get'
  });

  if (result.error || !result.data) {
    return { ...result, data: null };
  }

  const record = result.data;

  return {
    ...result,
    data: {
      total: record.total,
      pendingAssign: record.pending_assign,
      pendingAccept: record.pending_accept,
      processing: record.processing,
      pendingConfirm: record.pending_confirm,
      completed: record.completed,
      closed: record.closed,
      cancelled: record.cancelled,
      overdue: record.overdue
    } satisfies Api.Ticket.TicketStatisticsSummary
  };
}
