declare namespace Api {
  /**
   * namespace Asset
   *
   * asset categories + assets, admin-api-v1.md 7, 8
   */
  namespace Asset {
    interface AssetCategory {
      id: number;
      categoryName: string;
      categoryCode: string;
      description: string;
      /** 1: enabled, 0: disabled */
      status: number;
    }

    type AssetCategorySearchParams = CommonType.RecordNullable<{ keyword?: string; status?: number }>;

    type AssetStatus = 'in_use' | 'idle' | 'repairing' | 'scrapped';

    interface Asset {
      id: number;
      assetNo: string;
      assetName: string;
      categoryId: number;
      categoryName: string;
      brand: string;
      model: string;
      serialNo: string;
      userId: number | null;
      userName: string;
      department: string;
      location: string;
      status: AssetStatus;
      purchaseDate: string;
      warrantyExpireDate: string;
      remark: string;
    }

    type AssetSearchParams = CommonType.RecordNullable<
      {
        keyword?: string;
        categoryId?: number;
        status?: AssetStatus;
        department?: string;
        userId?: number;
      } & Common.CommonSearchParams
    >;

    type AssetList = Common.PaginatingQueryRecord<Asset>;

    interface RepairRecord {
      id: number;
      ticketId: number;
      ticketNo: string;
      ticketTitle: string;
      assetId?: number;
      assetNo?: string;
      assetName?: string;
      repairUserId: number;
      repairUserName: string;
      faultReason: string;
      repairMethod: string;
      repairResult: 'fixed' | 'replace_repair' | 'scrapped' | 'unresolved';
      repairCost: number;
      repairedAt: string;
    }

    type RepairRecordSearchParams = CommonType.RecordNullable<
      {
        assetId?: number;
        ticketId?: number;
        repairUserId?: number;
        repairResult?: RepairRecord['repairResult'];
        startDate?: string;
        endDate?: string;
      } & Common.CommonSearchParams
    >;

    type RepairRecordList = Common.PaginatingQueryRecord<RepairRecord>;
  }
}
