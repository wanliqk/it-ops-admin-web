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

/** ticket category distribution, admin-api-v1.md 13.3 — replaces the old `/dashboard/ticket-fault-types` */
export function fetchTicketCategoryStats() {
  return request<Api.Dashboard.TicketCategoryStat[]>({ url: '/dashboard/ticket-categories' });
}
