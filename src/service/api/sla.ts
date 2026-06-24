import { request } from '../request';

/** backend shape of an SLA rule record, see admin-api-v1.md 18.1 */
interface SlaRuleRecord {
  id: number;
  name: string;
  ticket_category: Api.Sla.TicketCategory | null;
  priority: Api.Sla.Priority;
  response_minutes: number;
  resolve_minutes: number;
  enabled: number;
  sort_order: number;
  created_at: string;
}

function toSlaRule(record: SlaRuleRecord): Api.Sla.SlaRule {
  return {
    id: record.id,
    name: record.name,
    ticketCategory: record.ticket_category,
    priority: record.priority,
    responseMinutes: record.response_minutes,
    resolveMinutes: record.resolve_minutes,
    enabled: record.enabled,
    sortOrder: record.sort_order,
    createTime: record.created_at
  };
}

/** get SLA rule list */
export async function fetchSlaRuleList(params?: Api.Sla.SlaRuleSearchParams) {
  const result = await request<{
    items: SlaRuleRecord[];
    total: number;
    page: number;
    page_size: number;
  }>({
    url: '/sla-rules',
    method: 'get',
    params: {
      priority: params?.priority,
      ticket_category: params?.ticketCategory,
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
      records: result.data.items.map(toSlaRule),
      current: result.data.page,
      size: result.data.page_size,
      total: result.data.total
    } satisfies Api.Sla.SlaRuleList
  };
}

interface SlaRuleParams {
  name: string;
  ticketCategory: Api.Sla.TicketCategory | null;
  priority: Api.Sla.Priority;
  responseMinutes: number;
  resolveMinutes: number;
  enabled: number;
  sortOrder: number;
}

function toSlaRulePayload(params: SlaRuleParams) {
  return {
    name: params.name,
    ticket_category: params.ticketCategory,
    priority: params.priority,
    response_minutes: params.responseMinutes,
    resolve_minutes: params.resolveMinutes,
    enabled: params.enabled,
    sort_order: params.sortOrder
  };
}

/** create SLA rule */
export function fetchCreateSlaRule(params: SlaRuleParams) {
  return request<{ id: number }>({
    url: '/sla-rules',
    method: 'post',
    data: toSlaRulePayload(params)
  });
}

/** update SLA rule */
export function fetchUpdateSlaRule(ruleId: number, params: SlaRuleParams) {
  return request<null>({
    url: `/sla-rules/${ruleId}`,
    method: 'put',
    data: toSlaRulePayload(params)
  });
}

/** enable/disable SLA rule */
export function fetchUpdateSlaRuleEnabled(ruleId: number, enabled: number) {
  return request<null>({
    url: `/sla-rules/${ruleId}/enabled`,
    method: 'patch',
    data: { enabled }
  });
}

/** delete SLA rule */
export function fetchDeleteSlaRule(ruleId: number) {
  return request<null>({
    url: `/sla-rules/${ruleId}`,
    method: 'delete'
  });
}

/*
 * NOTE: no `fetchManualCheckSlaTimeout` here. admin-api-v1.md 18.7 explicitly states SLA timeout scanning
 * is a server-side background job (APScheduler) and deliberately does NOT expose an HTTP endpoint to the
 * frontend ("不对前端暴露 HTTP 接口") — confirmed live: POST /api/admin/sla/check-timeout returns 404. Per
 * the task's own instruction, no manual-trigger button is built since the endpoint doesn't exist.
 */
