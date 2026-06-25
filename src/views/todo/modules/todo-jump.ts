import type { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';

type RouterPushByKey = ReturnType<typeof useRouterPush>['routerPushByKey'];

/**
 * "去处理" jump logic, shared by the my-todo list, the todo-management list, and the detail dialog. The
 * todo page itself never mutates ticket/asset state — it only navigates to the real business page, per the
 * task's explicit constraint.
 */
export function goProcessTodo(row: Api.Todo.TodoItem, routerPushByKey: RouterPushByKey) {
  if (row.businessType === 'ticket') {
    if (row.businessId === null) return;
    routerPushByKey('ticket-detail', { params: { id: String(row.businessId) } });
    return;
  }

  if (row.businessType === 'asset') {
    routerPushByKey('asset-manage_asset');
    return;
  }

  window.$message?.warning($t('page.todo.approvalNotImplemented'));
}
