import { request } from '../request';

/** dashboard summary cards (ticket/asset counts) */
export function fetchDashboardSummary() {
  return request<Api.Dashboard.Summary>({ url: '/dashboard/summary' });
}

/**
 * recent N days ticket trend
 *
 * @param days default 7, max 30
 */
export function fetchTicketTrend(days?: number) {
  return request<Api.Dashboard.TicketTrendItem[]>({
    url: '/dashboard/ticket-trend',
    params: { days }
  });
}

/** ticket fault type distribution */
export function fetchTicketFaultTypes() {
  return request<Api.Dashboard.FaultTypeStat[]>({ url: '/dashboard/ticket-fault-types' });
}
