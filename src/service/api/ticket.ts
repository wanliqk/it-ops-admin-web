import { request } from '../request';

/** backend shape of a ticket list row, see admin-api-v1.md 9.1 */
interface TicketRecordItem {
  id: number;
  ticket_no: string;
  title: string;
  fault_type: Api.Ticket.FaultType;
  priority: Api.Ticket.TicketPriority;
  status: Api.Ticket.TicketStatus;
  reporter_id: number;
  reporter_name: string;
  handler_id: number | null;
  handler_name: string | null;
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
    faultType: record.fault_type,
    priority: record.priority,
    status: record.status,
    reporterId: record.reporter_id,
    reporterName: record.reporter_name,
    handlerId: record.handler_id,
    handlerName: record.handler_name,
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
      fault_type: params?.faultType,
      reporter_id: params?.reporterId,
      handler_id: params?.handlerId,
      asset_id: params?.assetId,
      start_date: params?.startDate,
      end_date: params?.endDate,
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
  faultType: Api.Ticket.FaultType;
  priority?: Api.Ticket.TicketPriority;
  assetId?: number | null;
}

/** create ticket */
export function fetchCreateTicket(params: CreateTicketParams) {
  return request<{ id: number; ticket_no: string; status: Api.Ticket.TicketStatus }>({
    url: '/tickets',
    method: 'post',
    data: {
      title: params.title,
      description: params.description,
      fault_type: params.faultType,
      priority: params.priority,
      asset_id: params.assetId
    }
  });
}

/**
 * backend shape of ticket detail.
 *
 * Note: the running backend returns the same flat shape as a list row (`TicketRecordItem`) plus
 * `description`/`result`/`assigned_at`/`started_at` — verified directly against `GET /tickets/{id}`, which
 * does NOT match admin-api-v1.md 9.3's documented nested `reporter`/`handler`/`asset`/`records` example.
 */
interface TicketDetailRecord extends TicketRecordItem {
  description: string;
  result: string | null;
  assigned_at: string | null;
  started_at: string | null;
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

  const record = result.data;

  const detail: Api.Ticket.TicketDetail = {
    ...toTicket(record),
    description: record.description,
    result: record.result,
    assignedAt: record.assigned_at,
    startedAt: record.started_at
  };

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
  faultType: Api.Ticket.FaultType;
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
      fault_type: params.faultType,
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

/** delete ticket */
export function fetchDeleteTicket(ticketId: number) {
  return request<null>({
    url: `/tickets/${ticketId}`,
    method: 'delete'
  });
}
