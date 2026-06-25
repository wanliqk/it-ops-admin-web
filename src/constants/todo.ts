import { $t } from '@/locales';

/**
 * shared label/tag/option helpers for the todo module (admin-api-v1.md 19) — centralized here, per explicit
 * requirement, since the same enums are rendered in both the "my todo" and "todo management" pages plus the
 * shared detail dialog
 */

export function getTodoStatusLabel(): Record<Api.Todo.TodoStatus, string> {
  return {
    pending: $t('page.todo.statusType.pending'),
    processing: $t('page.todo.statusType.processing'),
    completed: $t('page.todo.statusType.completed'),
    cancelled: $t('page.todo.statusType.cancelled'),
    expired: $t('page.todo.statusType.expired')
  };
}

export const todoStatusTagType: Record<Api.Todo.TodoStatus, UI.ThemeColor> = {
  pending: 'info',
  processing: 'primary',
  completed: 'success',
  cancelled: 'warning',
  expired: 'danger'
};

export function getTodoStatusOptions(): CommonType.Option<Api.Todo.TodoStatus>[] {
  const label = getTodoStatusLabel();
  return (Object.keys(label) as Api.Todo.TodoStatus[]).map(value => ({ label: label[value], value }));
}

export function getTodoPriorityLabel(): Record<Api.Todo.TodoPriority, string> {
  return {
    low: $t('page.todo.priorityType.low'),
    normal: $t('page.todo.priorityType.normal'),
    high: $t('page.todo.priorityType.high'),
    urgent: $t('page.todo.priorityType.urgent')
  };
}

export const todoPriorityTagType: Record<Api.Todo.TodoPriority, UI.ThemeColor> = {
  low: 'info',
  normal: 'primary',
  high: 'warning',
  urgent: 'danger'
};

export function getTodoPriorityOptions(): CommonType.Option<Api.Todo.TodoPriority>[] {
  const label = getTodoPriorityLabel();
  return (Object.keys(label) as Api.Todo.TodoPriority[]).map(value => ({ label: label[value], value }));
}

export function getTodoBusinessTypeLabel(): Record<Api.Todo.BusinessType, string> {
  return {
    ticket: $t('page.todo.bizTypeType.ticket'),
    asset: $t('page.todo.bizTypeType.asset'),
    approval: $t('page.todo.bizTypeType.approval')
  };
}

export function getTodoBusinessTypeOptions(): CommonType.Option<Api.Todo.BusinessType>[] {
  const label = getTodoBusinessTypeLabel();
  return (Object.keys(label) as Api.Todo.BusinessType[]).map(value => ({ label: label[value], value }));
}

export function getTodoTypeLabel(): Record<Api.Todo.TodoType, string> {
  return {
    ticket_assign: $t('page.todo.todoTypeType.ticketAssign'),
    ticket_accept: $t('page.todo.todoTypeType.ticketAccept'),
    ticket_process: $t('page.todo.todoTypeType.ticketProcess'),
    ticket_confirm: $t('page.todo.todoTypeType.ticketConfirm'),
    asset_approval: $t('page.todo.todoTypeType.assetApproval'),
    asset_inventory: $t('page.todo.todoTypeType.assetInventory')
  };
}

export function getTodoTypeOptions(): CommonType.Option<Api.Todo.TodoType>[] {
  const label = getTodoTypeLabel();
  return (Object.keys(label) as Api.Todo.TodoType[]).map(value => ({ label: label[value], value }));
}

/**
 * a todo can show "开始处理"/"去处理" while still actionable (pending/processing/expired); completed/cancelled
 * todos are read-only — per the task's explicit button-visibility rules
 */
export function isTodoActionable(status: Api.Todo.TodoStatus): boolean {
  return status === 'pending' || status === 'processing' || status === 'expired';
}
