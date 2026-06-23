declare namespace Api {
  /**
   * namespace Admin
   *
   * the real backend's user & role/permission management (admin-api-v1.md 6, 16).
   *
   * kept separate from `Api.SystemManage`, which is the template's own demo namespace still used by the
   * untouched `views/alova` and `views/plugin/excel` demo pages.
   */
  namespace Admin {
    type UserRole = 'admin' | 'it_staff' | 'employee';

    interface User {
      id: number;
      userName: string;
      realName: string;
      role: UserRole;
      department: string;
      phone: string;
      email: string;
      /** 1: enabled, 0: disabled */
      status: number;
      createTime: string;
    }

    type UserSearchParams = CommonType.RecordNullable<
      Pick<User, 'role' | 'status' | 'department'> & { keyword?: string } & Common.CommonSearchParams
    >;

    type UserList = Common.PaginatingQueryRecord<User>;

    interface Role {
      id: number;
      roleName: string;
      roleCode: string;
      description: string;
      /** 1: enabled, 0: disabled */
      status: number;
      createTime: string;
    }

    type RoleSearchParams = CommonType.RecordNullable<
      { keyword?: string; status?: number } & Common.CommonSearchParams
    >;

    type RoleList = Common.PaginatingQueryRecord<Role>;
  }
}
