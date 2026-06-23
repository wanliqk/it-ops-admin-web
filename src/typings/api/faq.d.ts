declare namespace Api {
  /**
   * namespace Faq
   *
   * admin-api-v1.md 14
   */
  namespace Faq {
    type FaqCategory = 'computer' | 'network' | 'printer' | 'account' | 'other';

    interface Faq {
      id: number;
      title: string;
      category: FaqCategory;
      categoryName: string;
      summary: string;
      viewCount: number;
      sortOrder: number;
      /** 1: enabled, 0: disabled */
      status: number;
      createTime: string;
    }

    interface FaqDetail extends Faq {
      content: string;
    }

    type FaqSearchParams = CommonType.RecordNullable<
      { keyword?: string; category?: FaqCategory; status?: number } & Common.CommonSearchParams
    >;

    type FaqList = Common.PaginatingQueryRecord<Faq>;
  }
}
