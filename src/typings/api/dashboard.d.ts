declare namespace Api {
  /**
   * namespace Dashboard
   *
   * backend api module: "dashboard"
   */
  namespace Dashboard {
    interface Summary {
      ticket_total: number;
      ticket_pending: number;
      ticket_processing: number;
      ticket_completed: number;
      asset_total: number;
      asset_in_use: number;
      asset_repairing: number;
      asset_scrapped: number;
    }

    interface TicketTrendItem {
      date: string;
      count: number;
    }

    /** admin-api-v1.md 13.3 — replaces the old fault-type breakdown now that tickets use `category_id` */
    interface TicketCategoryStat {
      category_id: number;
      category_name: string;
      category_code: string;
      count: number;
    }
  }
}
