import { request } from '../request';

/** backend shape of a todo record, see admin-api-v1.md 19.1/19.3 (verified directly against the running backend) */
interface TodoRecord {
  id: number;
  todo_no: string;
  title: string;
  content: string;
  todo_type: Api.Todo.TodoType;
  business_type: Api.Todo.BusinessType;
  business_id: number | null;
  business_title: string | null;
  business_status: string | null;
  assignee_id: number;
  assignee_name: string;
  status: Api.Todo.TodoStatus;
  priority: Api.Todo.TodoPriority;
  deadline_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  remark: string | null;
  created_at: string;
  updated_at: string;
}

function toTodo(record: TodoRecord): Api.Todo.TodoItem {
  return {
    id: record.id,
    todoNo: record.todo_no,
    title: record.title,
    content: record.content,
    todoType: record.todo_type,
    businessType: record.business_type,
    businessId: record.business_id,
    businessTitle: record.business_title,
    businessStatus: record.business_status,
    assigneeId: record.assignee_id,
    assigneeName: record.assignee_name,
    status: record.status,
    priority: record.priority,
    deadlineAt: record.deadline_at,
    completedAt: record.completed_at,
    cancelledAt: record.cancelled_at,
    remark: record.remark,
    createTime: record.created_at,
    updateTime: record.updated_at
  };
}

function toListParams(params?: Api.Todo.TodoSearchParams) {
  return {
    status: params?.status,
    todo_type: params?.todoType,
    business_type: params?.businessType,
    priority: params?.priority,
    keyword: params?.keyword,
    start_date: params?.startDate,
    end_date: params?.endDate,
    page: params?.current,
    page_size: params?.size
  };
}

function requestTodoPage(url: string, params: Record<string, unknown>) {
  return request<{
    items: TodoRecord[];
    total: number;
    page: number;
    page_size: number;
  }>({ url, method: 'get', params });
}

async function toTodoList(result: Awaited<ReturnType<typeof requestTodoPage>>) {
  if (result.error || !result.data) {
    return result;
  }

  return {
    ...result,
    data: {
      records: result.data.items.map(toTodo),
      current: result.data.page,
      size: result.data.page_size,
      total: result.data.total
    } satisfies Api.Todo.TodoList
  };
}

/** get the current user's todo list */
export async function fetchGetMyTodoList(params?: Api.Todo.TodoSearchParams) {
  const result = await requestTodoPage('/todos/my', toListParams(params));
  return toTodoList(result);
}

/** get the current user's todo statistics */
export async function fetchGetMyTodoStatistics() {
  const result = await request<{
    pending_count: number;
    processing_count: number;
    expired_count: number;
    today_deadline_count: number;
    urgent_count: number;
  }>({ url: '/todos/my/statistics', method: 'get' });

  if (result.error || !result.data) {
    return { ...result, data: null };
  }

  return {
    ...result,
    data: {
      pendingCount: result.data.pending_count,
      processingCount: result.data.processing_count,
      expiredCount: result.data.expired_count,
      todayDeadlineCount: result.data.today_deadline_count,
      urgentCount: result.data.urgent_count
    } satisfies Api.Todo.TodoStatistics
  };
}

/** admin: get all todos across all assignees */
export async function fetchGetTodoList(params?: Api.Todo.TodoAdminSearchParams) {
  const result = await requestTodoPage('/todos', { ...toListParams(params), assignee_id: params?.assigneeId });
  return toTodoList(result);
}

/** get todo detail */
export async function fetchGetTodoDetail(todoId: number) {
  const result = await request<TodoRecord>({
    url: `/todos/${todoId}`,
    method: 'get'
  });

  if (result.error || !result.data) {
    return { ...result, data: null };
  }

  return { ...result, data: toTodo(result.data) };
}

/** mark a todo as processing */
export function fetchStartTodo(todoId: number, remark?: string) {
  return request<null>({
    url: `/todos/${todoId}/start`,
    method: 'put',
    data: { remark }
  });
}

/** mark a todo as completed */
export function fetchCompleteTodo(todoId: number, remark?: string) {
  return request<null>({
    url: `/todos/${todoId}/complete`,
    method: 'put',
    data: { remark }
  });
}

/** cancel a todo */
export function fetchCancelTodo(todoId: number, remark?: string) {
  return request<null>({
    url: `/todos/${todoId}/cancel`,
    method: 'put',
    data: { remark }
  });
}
