declare namespace Api {
  /**
   * namespace Rbac
   *
   * backend api module: "rbac" (roles, permissions)
   */
  namespace Rbac {
    interface Permission {
      id: number;
      permission_code: string;
      permission_name: string;
      module_name: string;
      status: number;
    }

    interface PermissionGroup {
      module_name: string;
      permissions: Permission[];
    }
  }
}
