declare namespace Api {
  /**
   * namespace TicketCategory
   *
   * ticket categories, admin-api-v1.md 8.8 — `it_ticket_category`, a dedicated table separate from
   * `it_asset_category` (asset categories). Replaces the old `fault_type` string enum on tickets; tickets
   * now reference a category by `category_id`. `default_priority` reuses `Ticket.TicketPriority`
   * (low/normal/high/urgent) — verified live, NOT the SLA-style low/medium/high/urgent set.
   */
  namespace TicketCategory {
    interface TicketCategory {
      id: number;
      parentId: number | null;
      name: string;
      code: string;
      description: string | null;
      defaultPriority: Ticket.TicketPriority | null;
      defaultGroupId: number | null;
      defaultGroupName: string | null;
      assignmentStrategy: TicketAssignment.AssignStrategy | null;
      fixedAssigneeId: number | null;
      fixedAssigneeName: string | null;
      /** 1: a related asset is required when creating a ticket in this category, 0: not required */
      requireAsset: number;
      sortOrder: number;
      status: number;
      createTime: string;
      updateTime: string;
    }

    interface TicketCategoryTreeNode extends TicketCategory {
      children: TicketCategoryTreeNode[];
    }

    type TicketCategorySearchParams = CommonType.RecordNullable<{
      keyword?: string;
      status?: number;
      parentId?: number;
    }>;

    type TicketCategoryTreeSearchParams = CommonType.RecordNullable<{ status?: number }>;
  }
}
