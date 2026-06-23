import { request } from '../request';

/** backend shape of a faq list row, see admin-api-v1.md 14.1 */
interface FaqRecord {
  id: number;
  title: string;
  category: Api.Faq.FaqCategory;
  category_name: string;
  summary: string;
  view_count: number;
  sort_order: number;
  status: number;
  created_at: string;
}

function toFaq(record: FaqRecord): Api.Faq.Faq {
  return {
    id: record.id,
    title: record.title,
    category: record.category,
    categoryName: record.category_name,
    summary: record.summary,
    viewCount: record.view_count,
    sortOrder: record.sort_order,
    status: record.status,
    createTime: record.created_at
  };
}

/** get faq list */
export async function fetchGetFaqList(params?: Api.Faq.FaqSearchParams) {
  const result = await request<{
    items: FaqRecord[];
    total: number;
    page: number;
    page_size: number;
  }>({
    url: '/faqs',
    method: 'get',
    params: {
      keyword: params?.keyword,
      category: params?.category,
      status: params?.status,
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
      records: result.data.items.map(toFaq),
      current: result.data.page,
      size: result.data.page_size,
      total: result.data.total
    } satisfies Api.Faq.FaqList
  };
}

/** backend shape of faq detail */
interface FaqDetailRecord extends FaqRecord {
  content: string;
}

/** get faq detail */
export async function fetchGetFaqDetail(faqId: number) {
  const result = await request<FaqDetailRecord>({
    url: `/faqs/${faqId}`,
    method: 'get'
  });

  if (result.error || !result.data) {
    return result;
  }

  return { ...result, data: { ...toFaq(result.data), content: result.data.content } satisfies Api.Faq.FaqDetail };
}

interface FaqParams {
  title: string;
  category: Api.Faq.FaqCategory;
  summary: string;
  content: string;
  sortOrder: number;
  status: number;
}

/** create faq */
export function fetchCreateFaq(params: FaqParams) {
  return request<{ id: number }>({
    url: '/faqs',
    method: 'post',
    data: {
      title: params.title,
      category: params.category,
      summary: params.summary,
      content: params.content,
      sort_order: params.sortOrder,
      status: params.status
    }
  });
}

/** update faq */
export function fetchUpdateFaq(faqId: number, params: FaqParams) {
  return request<null>({
    url: `/faqs/${faqId}`,
    method: 'put',
    data: {
      title: params.title,
      category: params.category,
      summary: params.summary,
      content: params.content,
      sort_order: params.sortOrder,
      status: params.status
    }
  });
}

/** change faq status */
export function fetchUpdateFaqStatus(faqId: number, status: number) {
  return request<null>({
    url: `/faqs/${faqId}/status`,
    method: 'patch',
    data: { status }
  });
}

/** delete faq */
export function fetchDeleteFaq(faqId: number) {
  return request<null>({
    url: `/faqs/${faqId}`,
    method: 'delete'
  });
}
