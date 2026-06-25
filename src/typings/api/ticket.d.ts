declare namespace Api {
  /**
   * namespace Ticket
   *
   * repair tickets, admin-api-v1.md 9, 10
   */
  namespace Ticket {
    /**
     * admin-api-v1.md 3.3 — `pending`/old single-stage flow kept only for backward compatibility with
     * pre-existing data; new tickets are created as `pending_accept`.
     */
    type TicketStatus =
      | 'pending_accept'
      | 'pending'
      | 'assigned'
      | 'processing'
      | 'pending_confirm'
      | 'completed'
      | 'closed'
      | 'cancelled';

    type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';

    /** admin-api-v1.md 3.11 — how a ticket ended up with its current handler */
    type AssignType = 'manual' | 'auto' | 'claim';

    interface Ticket {
      id: number;
      ticketNo: string;
      title: string;
      /**
       * admin-api-v1.md 3.5/8.8 — replaces the old `fault_type` string enum. Points at the dedicated
       * `it_ticket_category` table (`/ticket-categories`), NOT the asset category table.
       */
      categoryId: number;
      categoryName: string | null;
      priority: TicketPriority;
      status: TicketStatus;
      reporterId: number;
      reporterName: string;
      handlerId: number | null;
      handlerName: string | null;
      /** kept in sync with handlerId/handlerName by the backend; used for the assignment-info display */
      assigneeId: number | null;
      assigneeName: string | null;
      assignType: AssignType | null;
      assignerId: number | null;
      assignerName: string | null;
      assignedAt: string | null;
      assetId: number | null;
      assetNo: string | null;
      assetName: string | null;
      createTime: string;
      completedAt: string | null;
      /** SLA fields, admin-api-v1.md 9.1/18.6 */
      slaResponseDeadline: string | null;
      slaResolveDeadline: string | null;
      firstResponseAt: string | null;
      resolvedAt: string | null;
      /** 1: response is overdue, 0: not (yet) overdue */
      responseOverdue: number;
      /** 1: resolution is overdue, 0: not (yet) overdue */
      resolveOverdue: number;
    }

    type TicketSearchParams = CommonType.RecordNullable<
      {
        keyword?: string;
        status?: TicketStatus;
        priority?: TicketPriority;
        categoryId?: number;
        reporterId?: number;
        handlerId?: number;
        assetId?: number;
        startDate?: string;
        endDate?: string;
      } & Common.CommonSearchParams
    >;

    type TicketList = Common.PaginatingQueryRecord<Ticket>;

    interface TicketRecord {
      id: number;
      operatorId: number;
      operatorName: string;
      fromStatus: TicketStatus | null;
      toStatus: TicketStatus;
      action: string;
      remark: string;
      createTime: string;
    }

    /**
     * `GET /tickets/{id}` returns the same flat shape as a list row (verified against the running backend —
     * it does NOT match admin-api-v1.md's nested `reporter`/`handler`/`asset`/`records` example), plus these
     * extra fields. The status-change timeline is a separate call, see `fetchGetTicketRecords`.
     */
    interface TicketDetail extends Ticket {
      description: string;
      result: string | null;
      acceptedAt: string | null;
      startedAt: string | null;
    }
  }
}
