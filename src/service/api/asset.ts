import { request } from '../request';

/** backend shape of an asset category record, see admin-api-v1.md 7.1 */
interface AssetCategoryRecord {
  id: number;
  category_name: string;
  category_code: string;
  description: string;
  status: number;
}

function toAssetCategory(record: AssetCategoryRecord): Api.Asset.AssetCategory {
  return {
    id: record.id,
    categoryName: record.category_name,
    categoryCode: record.category_code,
    description: record.description,
    status: record.status
  };
}

/** get asset category list (not paginated, see admin-api-v1.md 7.1) */
export async function fetchGetAssetCategoryList(params?: Api.Asset.AssetCategorySearchParams) {
  const result = await request<AssetCategoryRecord[]>({
    url: '/asset-categories',
    method: 'get',
    params
  });

  if (result.error || !result.data) {
    return result;
  }

  return { ...result, data: result.data.map(toAssetCategory) };
}

interface AssetCategoryParams {
  categoryName: string;
  categoryCode: string;
  description: string;
  status: number;
}

/** create asset category */
export function fetchCreateAssetCategory(params: AssetCategoryParams) {
  return request<{ id: number }>({
    url: '/asset-categories',
    method: 'post',
    data: {
      category_name: params.categoryName,
      category_code: params.categoryCode,
      description: params.description,
      status: params.status
    }
  });
}

/** update asset category */
export function fetchUpdateAssetCategory(categoryId: number, params: Omit<AssetCategoryParams, 'categoryCode'>) {
  return request<null>({
    url: `/asset-categories/${categoryId}`,
    method: 'put',
    data: {
      category_name: params.categoryName,
      description: params.description,
      status: params.status
    }
  });
}

/** delete asset category */
export function fetchDeleteAssetCategory(categoryId: number) {
  return request<null>({
    url: `/asset-categories/${categoryId}`,
    method: 'delete'
  });
}

/** backend shape of an asset record, see admin-api-v1.md 8.1 */
interface AssetRecord {
  id: number;
  asset_no: string;
  asset_name: string;
  category_id: number;
  category_name: string;
  brand: string;
  model: string;
  serial_no: string;
  user_id: number | null;
  user_name: string | null;
  department: string;
  location: string;
  status: Api.Asset.AssetStatus;
  purchase_date: string;
  warranty_expire_date: string;
  remark?: string;
}

function toAsset(record: AssetRecord): Api.Asset.Asset {
  return {
    id: record.id,
    assetNo: record.asset_no,
    assetName: record.asset_name,
    categoryId: record.category_id,
    categoryName: record.category_name,
    brand: record.brand,
    model: record.model,
    serialNo: record.serial_no,
    userId: record.user_id,
    userName: record.user_name ?? '',
    department: record.department,
    location: record.location,
    status: record.status,
    purchaseDate: record.purchase_date,
    warrantyExpireDate: record.warranty_expire_date,
    remark: record.remark ?? ''
  };
}

/** get asset list */
export async function fetchGetAssetList(params?: Api.Asset.AssetSearchParams) {
  const result = await request<{
    items: AssetRecord[];
    total: number;
    page: number;
    page_size: number;
  }>({
    url: '/assets',
    method: 'get',
    params: {
      keyword: params?.keyword,
      category_id: params?.categoryId,
      status: params?.status,
      department: params?.department,
      user_id: params?.userId,
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
      records: result.data.items.map(toAsset),
      current: result.data.page,
      size: result.data.page_size,
      total: result.data.total
    } satisfies Api.Asset.AssetList
  };
}

interface AssetParams {
  assetNo: string;
  assetName: string;
  categoryId: number;
  brand: string;
  model: string;
  serialNo: string;
  userId: number | null;
  department: string;
  location: string;
  status: Api.Asset.AssetStatus;
  purchaseDate: string;
  warrantyExpireDate: string;
  remark: string;
}

function toAssetPayload(params: AssetParams) {
  return {
    asset_no: params.assetNo,
    asset_name: params.assetName,
    category_id: params.categoryId,
    brand: params.brand,
    model: params.model,
    serial_no: params.serialNo,
    user_id: params.userId,
    department: params.department,
    location: params.location,
    status: params.status,
    purchase_date: params.purchaseDate,
    warranty_expire_date: params.warrantyExpireDate,
    remark: params.remark
  };
}

/** create asset */
export function fetchCreateAsset(params: AssetParams) {
  return request<{ id: number; asset_no: string }>({
    url: '/assets',
    method: 'post',
    data: toAssetPayload(params)
  });
}

/** update asset */
export function fetchUpdateAsset(assetId: number, params: Omit<AssetParams, 'assetNo'>) {
  return request<null>({
    url: `/assets/${assetId}`,
    method: 'put',
    data: toAssetPayload({ ...params, assetNo: '' })
  });
}

/** change asset status */
export function fetchUpdateAssetStatus(assetId: number, status: Api.Asset.AssetStatus, remark?: string) {
  return request<null>({
    url: `/assets/${assetId}/status`,
    method: 'patch',
    data: { status, remark }
  });
}

/** delete asset */
export function fetchDeleteAsset(assetId: number) {
  return request<null>({
    url: `/assets/${assetId}`,
    method: 'delete'
  });
}

/**
 * backend shape of an asset's repair history item.
 *
 * Note: the running backend wraps this in the same `{items, total, page, page_size, pages}` paginated
 * envelope used everywhere else, not the flat array admin-api-v1.md 8.7's example shows.
 */
interface AssetRepairRecordItem {
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

/** get an asset's repair history */
export async function fetchGetAssetRepairRecords(assetId: number) {
  const result = await request<{ items: AssetRepairRecordItem[] }>({
    url: `/assets/${assetId}/repair-records`,
    method: 'get'
  });

  if (result.error || !result.data) {
    return { ...result, data: null };
  }

  return {
    ...result,
    data: result.data.items.map(
      (item): Api.Asset.RepairRecord => ({
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
      })
    )
  };
}
