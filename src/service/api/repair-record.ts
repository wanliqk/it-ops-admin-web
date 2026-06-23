import { request } from '../request';

/** backend shape of a repair record, see admin-api-v1.md 11.1 */
interface RepairRecordItem {
  id: number;
  ticket_id: number;
  ticket_no: string;
  ticket_title: string;
  asset_id?: number;
  asset_no?: string;
  asset_name?: string;
  repair_user_id: number;
  repair_user_name: string;
  fault_reason: string;
  repair_method: string;
  repair_result: Api.Asset.RepairRecord['repairResult'];
  repair_cost: number;
  repaired_at: string;
}

function toRepairRecord(item: RepairRecordItem): Api.Asset.RepairRecord {
  return {
    id: item.id,
    ticketId: item.ticket_id,
    ticketNo: item.ticket_no,
    ticketTitle: item.ticket_title,
    assetId: item.asset_id,
    assetNo: item.asset_no,
    assetName: item.asset_name,
    repairUserId: item.repair_user_id,
    repairUserName: item.repair_user_name,
    faultReason: item.fault_reason,
    repairMethod: item.repair_method,
    repairResult: item.repair_result,
    repairCost: item.repair_cost,
    repairedAt: item.repaired_at
  };
}

/** get repair record list */
export async function fetchGetRepairRecordList(params?: Api.Asset.RepairRecordSearchParams) {
  const result = await request<{
    items: RepairRecordItem[];
    total: number;
    page: number;
    page_size: number;
  }>({
    url: '/repair-records',
    method: 'get',
    params: {
      asset_id: params?.assetId,
      ticket_id: params?.ticketId,
      repair_user_id: params?.repairUserId,
      repair_result: params?.repairResult,
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
      records: result.data.items.map(toRepairRecord),
      current: result.data.page,
      size: result.data.page_size,
      total: result.data.total
    } satisfies Api.Asset.RepairRecordList
  };
}

interface UpdateRepairRecordParams {
  faultReason: string;
  repairMethod: string;
  repairResult: Api.Asset.RepairRecord['repairResult'];
  repairCost: number;
  repairedAt: string;
}

/** update repair record (admin only) */
export function fetchUpdateRepairRecord(recordId: number, params: UpdateRepairRecordParams) {
  return request<null>({
    url: `/repair-records/${recordId}`,
    method: 'put',
    data: {
      fault_reason: params.faultReason,
      repair_method: params.repairMethod,
      repair_result: params.repairResult,
      repair_cost: params.repairCost,
      repaired_at: params.repairedAt
    }
  });
}
