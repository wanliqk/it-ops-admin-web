declare namespace Api {
  /**
   * namespace Ticket
   *
   * repair tickets, admin-api-v1.md 9, 10
   */
  namespace Ticket {
    type TicketStatus = 'pending' | 'assigned' | 'processing' | 'completed' | 'cancelled';

    type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';

    type FaultType = 'hardware' | 'software' | 'network' | 'printer' | 'account' | 'other';

    interface Ticket {
      id: number;
      ticketNo: string;
      title: string;
      faultType: FaultType;
      priority: TicketPriority;
      status: TicketStatus;
      reporterId: number;
      reporterName: string;
      handlerId: number | null;
      handlerName: string | null;
      assetId: number | null;
      assetNo: string | null;
      assetName: string | null;
      createTime: string;
      completedAt: string | null;
    }

    type TicketSearchParams = CommonType.RecordNullable<
      {
        keyword?: string;
        status?: TicketStatus;
        priority?: TicketPriority;
        faultType?: FaultType;
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
      assignedAt: string | null;
      startedAt: string | null;
    }
  }
}
