import { $t } from '@/locales';

/** a single status filter card shown on the ticket list page and the ticket statistics page */
export interface TicketStatCardItem {
  key: string;
  label: string;
  value: number;
  /** patch applied to `Api.Ticket.TicketSearchParams` when the card is clicked */
  filter: { status?: Api.Ticket.TicketStatus; isOverdue?: boolean };
}

/**
 * admin-api-v1.md 9.2 — builds the 9 status cards from `GET /tickets/statistics/summary`. Reused by both
 * the ticket list page's filter bar and the ticket statistics page so the status labels/colors/filter
 * mapping only need to be defined once.
 *
 * Note: the summary's `pending_assign` field counts tickets where `status = pending` (the legacy/back-compat
 * status value, displayed as "待分派" per `page.ticket.statusType.pending`) — it is NOT a `pending_assign`
 * ticket status, which doesn't exist.
 */
export function buildTicketStatCards(summary?: Api.Ticket.TicketStatisticsSummary | null): TicketStatCardItem[] {
  return [
    { key: 'all', label: $t('page.ticket.statisticsType.all'), value: summary?.total ?? 0, filter: {} },
    {
      key: 'pendingAssign',
      label: $t('page.ticket.statusType.pending'),
      value: summary?.pendingAssign ?? 0,
      filter: { status: 'pending' }
    },
    {
      key: 'pendingAccept',
      label: $t('page.ticket.statusType.pendingAccept'),
      value: summary?.pendingAccept ?? 0,
      filter: { status: 'pending_accept' }
    },
    {
      key: 'processing',
      label: $t('page.ticket.statusType.processing'),
      value: summary?.processing ?? 0,
      filter: { status: 'processing' }
    },
    {
      key: 'pendingConfirm',
      label: $t('page.ticket.statusType.pendingConfirm'),
      value: summary?.pendingConfirm ?? 0,
      filter: { status: 'pending_confirm' }
    },
    {
      key: 'completed',
      label: $t('page.ticket.statusType.completed'),
      value: summary?.completed ?? 0,
      filter: { status: 'completed' }
    },
    {
      key: 'closed',
      label: $t('page.ticket.statusType.closed'),
      value: summary?.closed ?? 0,
      filter: { status: 'closed' }
    },
    {
      key: 'cancelled',
      label: $t('page.ticket.statusType.cancelled'),
      value: summary?.cancelled ?? 0,
      filter: { status: 'cancelled' }
    },
    {
      key: 'overdue',
      label: $t('page.ticket.statisticsType.overdue'),
      value: summary?.overdue ?? 0,
      filter: { isOverdue: true }
    }
  ];
}

const STATUS_TO_CARD_KEY: Record<Api.Ticket.TicketStatus, string | undefined> = {
  pending: 'pendingAssign',
  pending_accept: 'pendingAccept',
  assigned: undefined,
  processing: 'processing',
  pending_confirm: 'pendingConfirm',
  completed: 'completed',
  closed: 'closed',
  cancelled: 'cancelled'
};

/**
 * resolves which card (if any) matches the current search params, so the list page can highlight the
 * active card. Returns `undefined` when the current filter doesn't correspond to any card (e.g.
 * `status = assigned`, which has no dedicated card since the summary endpoint doesn't track it).
 */
export function getActiveTicketStatKey(params: {
  status?: Api.Ticket.TicketStatus | null;
  isOverdue?: boolean | null;
}): string | undefined {
  if (params.isOverdue) return 'overdue';
  if (!params.status) return 'all';

  return STATUS_TO_CARD_KEY[params.status];
}
