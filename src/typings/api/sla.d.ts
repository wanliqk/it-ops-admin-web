declare namespace Api {
  /**
   * namespace Sla
   *
   * SLA rule management, admin-api-v1.md 18. NOT yet verified against the running backend — at the time
   * this was written, the admin account had no `sla:rule:*` permission codes assigned at all (the backend's
   * `sys_permission` table doesn't have them registered yet), so every `/sla-rules` call returns
   * `403 无权限操作` regardless of caller. Shapes here follow the doc exactly; re-check once the backend
   * grants these permissions.
   */
  namespace Sla {
    type Priority = 'urgent' | 'high' | 'medium' | 'low';

    /**
     * SLA rules categorize by the same fault_type taxonomy tickets use (admin-api-v1.md 18.1's
     * `ticket_category` param: hardware/software/network/printer/account/other) — reuses `Ticket.FaultType`
     * rather than redefining it.
     */
    type TicketCategory = Ticket.FaultType;

    interface SlaRule {
      id: number;
      name: string;
      ticketCategory: TicketCategory | null;
      priority: Priority;
      responseMinutes: number;
      resolveMinutes: number;
      /** 1: enabled, 0: disabled */
      enabled: number;
      sortOrder: number;
      createTime: string;
    }

    type SlaRuleSearchParams = CommonType.RecordNullable<
      { priority?: Priority; ticketCategory?: TicketCategory; enabled?: number } & Common.CommonSearchParams
    >;

    type SlaRuleList = Common.PaginatingQueryRecord<SlaRule>;
  }
}
