declare namespace Api {
  /**
   * namespace Todo
   *
   * todo center, admin-api-v1.md 19. The backend auto-creates/closes/cancels todos when ticket status
   * changes — the frontend only displays and jumps to the related business page, it never mutates ticket
   * state from here (per the task's explicit constraint).
   */
  namespace Todo {
    type TodoStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'expired';

    type TodoPriority = 'low' | 'normal' | 'high' | 'urgent';

    type BusinessType = 'ticket' | 'asset' | 'approval';

    type TodoType =
      | 'ticket_assign'
      | 'ticket_accept'
      | 'ticket_process'
      | 'ticket_confirm'
      | 'asset_approval'
      | 'asset_inventory';

    interface TodoItem {
      id: number;
      todoNo: string;
      title: string;
      content: string;
      todoType: TodoType;
      businessType: BusinessType;
      businessId: number | null;
      businessTitle: string | null;
      businessStatus: string | null;
      assigneeId: number;
      assigneeName: string;
      status: TodoStatus;
      priority: TodoPriority;
      deadlineAt: string | null;
      completedAt: string | null;
      cancelledAt: string | null;
      remark: string | null;
      createTime: string;
      updateTime: string;
    }

    type TodoSearchParams = CommonType.RecordNullable<
      {
        status?: TodoStatus;
        todoType?: TodoType;
        businessType?: BusinessType;
        priority?: TodoPriority;
        keyword?: string;
        startDate?: string;
        endDate?: string;
      } & Common.CommonSearchParams
    >;

    /** admin-only `GET /todos` adds an `assigneeId` filter on top of the self-scoped search params */
    type TodoAdminSearchParams = TodoSearchParams & CommonType.RecordNullable<{ assigneeId?: number }>;

    type TodoList = Common.PaginatingQueryRecord<TodoItem>;

    interface TodoStatistics {
      pendingCount: number;
      processingCount: number;
      expiredCount: number;
      todayDeadlineCount: number;
      urgentCount: number;
    }
  }
}
