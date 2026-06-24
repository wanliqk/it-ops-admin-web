import { request } from '../request';

/** backend shape of a notification record, see admin-api-v1.md 15.1 */
interface NotificationRecord {
  id: number;
  title: string;
  content: string;
  biz_type: Api.Notification.BizType;
  biz_id: number | null;
  read_status: Api.Notification.ReadStatus;
  created_at: string;
  read_at: string | null;
}

function toNotification(record: NotificationRecord): Api.Notification.NotificationItem {
  return {
    id: record.id,
    title: record.title,
    content: record.content,
    bizType: record.biz_type,
    bizId: record.biz_id,
    readStatus: record.read_status,
    createTime: record.created_at,
    readAt: record.read_at
  };
}

/** get the current user's notification list */
export async function fetchNotificationList(params?: Api.Notification.NotificationSearchParams) {
  const result = await request<{
    items: NotificationRecord[];
    total: number;
    page: number;
    page_size: number;
  }>({
    url: '/notifications',
    method: 'get',
    params: {
      keyword: params?.keyword,
      read_status: params?.readStatus,
      biz_type: params?.bizType,
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
      records: result.data.items.map(toNotification),
      current: result.data.page,
      size: result.data.page_size,
      total: result.data.total
    } satisfies Api.Notification.NotificationList
  };
}

/** get the current user's unread notification count */
export async function fetchNotificationUnreadCount() {
  const result = await request<{ unread_count: number }>({
    url: '/notifications/unread-count',
    method: 'get'
  });

  if (result.error || !result.data) {
    return { ...result, data: null };
  }

  return { ...result, data: result.data.unread_count };
}

/** mark one notification as read */
export async function fetchReadNotification(id: number) {
  const result = await request<NotificationRecord>({
    url: `/notifications/${id}/read`,
    method: 'put'
  });

  if (result.error || !result.data) {
    return result;
  }

  return { ...result, data: toNotification(result.data) };
}

/** batch mark notifications as read */
export async function fetchReadNotificationBatch(ids: number[]) {
  const result = await request<{ processed_count: number }>({
    url: '/notifications/read-batch',
    method: 'put',
    data: { ids }
  });

  if (result.error || !result.data) {
    return { ...result, data: null };
  }

  return { ...result, data: { processedCount: result.data.processed_count } satisfies Api.Notification.BatchResult };
}

/** mark all of the current user's notifications as read */
export async function fetchReadAllNotifications() {
  const result = await request<{ processed_count: number }>({
    url: '/notifications/read-all',
    method: 'put'
  });

  if (result.error || !result.data) {
    return { ...result, data: null };
  }

  return { ...result, data: { processedCount: result.data.processed_count } satisfies Api.Notification.BatchResult };
}

/** delete one notification (soft delete on the backend) */
export function fetchDeleteNotification(id: number) {
  return request<null>({
    url: `/notifications/${id}`,
    method: 'delete'
  });
}

/** batch delete notifications (soft delete on the backend) */
export async function fetchDeleteNotificationBatch(ids: number[]) {
  const result = await request<{ processed_count: number }>({
    url: '/notifications/batch',
    method: 'delete',
    data: { ids }
  });

  if (result.error || !result.data) {
    return { ...result, data: null };
  }

  return { ...result, data: { processedCount: result.data.processed_count } satisfies Api.Notification.BatchResult };
}
