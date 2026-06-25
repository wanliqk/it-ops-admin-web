import { $t } from '@/locales';

/**
 * shared label/option helpers for ticket auto-assignment — centralized since assign-type is rendered in
 * the ticket list, ticket detail, and the assignment-rule page, and assign-strategy in the rule page and
 * ticket detail's assignment-info section
 */

export function getAssignStrategyLabel(): Record<Api.TicketAssignment.AssignStrategy, string> {
  return {
    least_workload: $t('page.ticket.assignStrategyType.leastWorkload'),
    fixed_user: $t('page.ticket.assignStrategyType.fixedUser')
  };
}

export function getAssignStrategyOptions(): CommonType.Option<Api.TicketAssignment.AssignStrategy>[] {
  const label = getAssignStrategyLabel();
  return (Object.keys(label) as Api.TicketAssignment.AssignStrategy[]).map(value => ({ label: label[value], value }));
}

export function getAssignTypeLabel(): Record<Api.Ticket.AssignType, string> {
  return {
    manual: $t('page.ticket.assignTypeType.manual'),
    auto: $t('page.ticket.assignTypeType.auto'),
    claim: $t('page.ticket.assignTypeType.claim')
  };
}
