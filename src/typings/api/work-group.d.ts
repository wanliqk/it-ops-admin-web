declare namespace Api {
  /**
   * namespace WorkGroup
   *
   * maintenance work groups, admin-api-v1.md 20 — used for ticket business assignment, NOT an RBAC role.
   * Backend wasn't reachable while this was written; shapes follow the doc exactly, re-verify once it's up.
   */
  namespace WorkGroup {
    interface WorkGroup {
      id: number;
      groupName: string;
      groupCode: string;
      description: string | null;
      leaderId: number | null;
      leaderName: string | null;
      status: number;
      sortOrder: number;
      memberCount: number;
      createTime: string;
      updateTime: string;
    }

    type WorkGroupSearchParams = CommonType.RecordNullable<
      { keyword?: string; status?: number } & Common.CommonSearchParams
    >;

    type WorkGroupList = Common.PaginatingQueryRecord<WorkGroup>;

    type MemberRole = 'leader' | 'member';

    interface WorkGroupMember {
      id: number;
      groupId: number;
      userId: number;
      username: string;
      realName: string;
      phone: string;
      memberRole: MemberRole;
      status: number;
      joinedAt: string;
      createTime: string;
      updateTime: string;
    }

    type WorkGroupMemberSearchParams = CommonType.RecordNullable<
      { keyword?: string; status?: number } & Common.CommonSearchParams
    >;

    type WorkGroupMemberList = Common.PaginatingQueryRecord<WorkGroupMember>;
  }
}
