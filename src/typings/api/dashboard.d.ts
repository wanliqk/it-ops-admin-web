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

    interface FaultTypeStat {
      fault_type: string;
      fault_type_name: string;
      count: number;
    }
  }
}
