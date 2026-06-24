declare namespace Api {
  /**
   * namespace Notification
   *
   * in-app notification center, admin-api-v1.md 15. Self-scoped — every endpoint only ever touches the
   * current logged-in user's own notifications, so (unlike most other modules) there is no
   * `notification:*` permission_code in the backend's RBAC table; access is gated purely by login.
   */
  namespace Notification {
    type BizType = 'ticket' | 'asset' | 'sla' | 'system';

    /** 0: unread, 1: read */
    type ReadStatus = 0 | 1;

    interface NotificationItem {
      id: number;
      title: string;
      content: string;
      bizType: BizType;
      bizId: number | null;
      readStatus: ReadStatus;
      createTime: string;
      readAt: string | null;
    }

    type NotificationSearchParams = CommonType.RecordNullable<
      {
        keyword?: string;
        readStatus?: ReadStatus;
        bizType?: BizType;
      } & Common.CommonSearchParams
    >;

    type NotificationList = Common.PaginatingQueryRecord<NotificationItem>;

    interface BatchResult {
      processedCount: number;
    }
  }
}
