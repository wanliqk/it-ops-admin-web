declare namespace Api {
  /**
   * namespace TicketAssignment
   *
   * ticket auto-assignment rules, admin-api-v1.md 21. This phase only wires up `least_workload` and
   * `fixed_user` — `round_robin` is not part of this rollout and must not be offered in the UI.
   */
  namespace TicketAssignment {
    type AssignStrategy = 'least_workload' | 'fixed_user';

    interface Rule {
      id: number;
      name: string;
      categoryId: number | null;
      priority: Ticket.TicketPriority | null;
      opsGroupId: number | null;
      opsGroupName: string | null;
      assignStrategy: AssignStrategy;
      targetUserId: number | null;
      targetUserName: string | null;
      enabled: boolean;
      sortOrder: number;
      remark: string | null;
      createTime: string;
      updateTime: string;
    }

    type RuleSearchParams = CommonType.RecordNullable<
      {
        name?: string;
        categoryId?: number;
        priority?: Ticket.TicketPriority;
        opsGroupId?: number;
        targetUserId?: number;
        assignStrategy?: AssignStrategy;
        enabled?: boolean;
      } & Common.CommonSearchParams
    >;

    type RuleList = Common.PaginatingQueryRecord<Rule>;

    /** result of `POST /tickets/{id}/auto-assign`, admin-api-v1.md 21.6 */
    interface AutoAssignResult {
      success: boolean;
      ticketId: number;
      assigneeId: number | null;
      assigneeName: string | null;
      ruleId: number | null;
      assignType: Ticket.AssignType | null;
      assignStrategy: AssignStrategy | null;
      failStage: string | null;
      failReason: string | null;
    }
  }
}
