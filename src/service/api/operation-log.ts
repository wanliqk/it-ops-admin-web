import { request } from '../request';

/** backend shape of an operation log record, see admin-api-v1.md 12.1 */
interface OperationLogRecord {
  id: number;
  user_id: number;
  username: string;
  real_name: string;
  module_name: string;
  operation_type: string;
  business_id: number | null;
  request_method: string;
  request_url: string;
  request_ip: string;
  operation_result: 'success' | 'fail';
  error_message: string | null;
  created_at: string;
}

function toOperationLog(record: OperationLogRecord): Api.OperationLog.OperationLog {
  return {
    id: record.id,
    userId: record.user_id,
    userName: record.username,
    realName: record.real_name,
    moduleName: record.module_name,
    operationType: record.operation_type,
    businessId: record.business_id,
    requestMethod: record.request_method,
    requestUrl: record.request_url,
    requestIp: record.request_ip,
    operationResult: record.operation_result,
    errorMessage: record.error_message,
    createTime: record.created_at
  };
}

/** get operation log list */
export async function fetchGetOperationLogList(params?: Api.OperationLog.OperationLogSearchParams) {
  const result = await request<{
    items: OperationLogRecord[];
    total: number;
    page: number;
    page_size: number;
  }>({
    url: '/operation-logs',
    method: 'get',
    params: {
      user_id: params?.userId,
      module_name: params?.moduleName,
      operation_type: params?.operationType,
      operation_result: params?.operationResult,
      start_date: params?.startDate,
      end_date: params?.endDate,
      page: params?.current,
      page_size: params?.size
    }
  });

  if (result.error || !result.data) {
    return result;
  }

  return {
    ...result,
    data: {
      records: result.data.items.map(toOperationLog),
      current: result.data.page,
      size: result.data.page_size,
      total: result.data.total
    } satisfies Api.OperationLog.OperationLogList
  };
}
