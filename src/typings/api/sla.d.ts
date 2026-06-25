declare namespace Api {
  /**
   * namespace Sla
   *
   * SLA rule management, admin-api-v1.md 18 — verified live, including the full create/update/enable/
   * delete round trip.
   */
  namespace Sla {
    type Priority = 'urgent' | 'high' | 'medium' | 'low';

    interface SlaRule {
      id: number;
      name: string;
      /** admin-api-v1.md 18.1 — points at `it_ticket_category` (`/ticket-categories`), null = generic rule */
      categoryId: number | null;
      priority: Priority;
      responseMinutes: number;
      resolveMinutes: number;
      /** 1: enabled, 0: disabled */
      enabled: number;
      sortOrder: number;
      createTime: string;
    }

    type SlaRuleSearchParams = CommonType.RecordNullable<
      { priority?: Priority; categoryId?: number; enabled?: number } & Common.CommonSearchParams
    >;

    type SlaRuleList = Common.PaginatingQueryRecord<SlaRule>;
  }
}
