declare namespace Api {
  /**
   * namespace OperationLog
   *
   * admin-api-v1.md 12
   */
  namespace OperationLog {
    interface OperationLog {
      id: number;
      userId: number;
      userName: string;
      realName: string;
      moduleName: string;
      operationType: string;
      businessId: number | null;
      requestMethod: string;
      requestUrl: string;
      requestIp: string;
      operationResult: 'success' | 'fail';
      errorMessage: string | null;
      createTime: string;
    }

    type OperationLogSearchParams = CommonType.RecordNullable<
      {
        userId?: number;
        moduleName?: string;
        operationType?: string;
        operationResult?: 'success' | 'fail';
        startDate?: string;
        endDate?: string;
      } & Common.CommonSearchParams
    >;

    type OperationLogList = Common.PaginatingQueryRecord<OperationLog>;
  }
}
