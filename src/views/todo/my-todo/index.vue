<script setup lang="tsx">
import { ref, shallowRef } from 'vue';
import { useRoute } from 'vue-router';
import {
  getTodoBusinessTypeLabel,
  getTodoPriorityLabel,
  getTodoStatusLabel,
  getTodoTypeLabel,
  isTodoActionable,
  todoPriorityTagType,
  todoStatusTagType
} from '@/constants/todo';
import { fetchCancelTodo, fetchGetMyTodoList, fetchStartTodo } from '@/service/api';
import { defaultTransform, useUIPaginatedTable } from '@/hooks/common/table';
import { useRouterPush } from '@/hooks/common/router';
import { useAuth } from '@/hooks/business/auth';
import { $t } from '@/locales';
import TodoDetailDialog from '../modules/todo-detail-dialog.vue';
import { goProcessTodo } from '../modules/todo-jump';
import MyTodoSearch from './modules/my-todo-search.vue';

defineOptions({ name: 'MyTodoManage' });

const route = useRoute();
const { routerPushByKey } = useRouterPush();
const { hasAuth } = useAuth();

const statusLabel = getTodoStatusLabel();
const priorityLabel = getTodoPriorityLabel();
const bizTypeLabel = getTodoBusinessTypeLabel();
const todoTypeLabel = getTodoTypeLabel();

const searchParams = ref(getInitSearchParams());

function getInitSearchParams(): Api.Todo.TodoSearchParams {
  const query = route.query;
  return {
    current: 1,
    size: 10,
    keyword: undefined,
    status: (query.status as Api.Todo.TodoStatus) || undefined,
    todoType: undefined,
    businessType: undefined,
    priority: (query.priority as Api.Todo.TodoPriority) || undefined,
    startDate: undefined,
    endDate: undefined
  };
}

const { columns, data, getData, getDataByPage, loading, mobilePagination } = useUIPaginatedTable({
  paginationProps: {
    currentPage: searchParams.value.current,
    pageSize: searchParams.value.size
  },
  api: () => fetchGetMyTodoList(searchParams.value),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.value.current = params.currentPage;
    searchParams.value.size = params.pageSize;
  },
  columns: () => [
    { prop: 'title', label: $t('page.todo.todoTitle'), minWidth: 200, showOverflowTooltip: true },
    {
      prop: 'businessType',
      label: $t('page.todo.bizType'),
      width: 90,
      formatter: row => bizTypeLabel[row.businessType]
    },
    {
      prop: 'todoType',
      label: $t('page.todo.todoType'),
      width: 120,
      formatter: row => todoTypeLabel[row.todoType]
    },
    {
      prop: 'businessTitle',
      label: $t('page.todo.bizTitle'),
      minWidth: 160,
      showOverflowTooltip: true,
      formatter: row => row.businessTitle ?? '-'
    },
    {
      prop: 'priority',
      label: $t('page.todo.priority'),
      width: 90,
      formatter: row => <ElTag type={todoPriorityTagType[row.priority]}>{priorityLabel[row.priority]}</ElTag>
    },
    {
      prop: 'status',
      label: $t('page.todo.status'),
      width: 100,
      formatter: row => <ElTag type={todoStatusTagType[row.status]}>{statusLabel[row.status]}</ElTag>
    },
    { prop: 'assigneeName', label: $t('page.todo.assignee'), width: 100 },
    {
      prop: 'deadlineAt',
      label: $t('page.todo.deadlineAt'),
      width: 160,
      formatter: row => (
        <span class={row.status === 'expired' ? 'text-red-500 font-bold' : ''}>{row.deadlineAt ?? '-'}</span>
      )
    },
    { prop: 'createTime', label: $t('common.createTime'), width: 160 },
    {
      prop: 'operate',
      label: $t('common.operate'),
      align: 'center',
      width: 260,
      formatter: row => (
        <div class="flex-center gap-8px">
          <ElButton plain size="small" onClick={() => viewDetail(row.id)}>
            {$t('common.detail')}
          </ElButton>
          {isTodoActionable(row.status) && (
            <ElButton type="primary" plain size="small" onClick={() => handleGoProcess(row)}>
              {$t('page.todo.goProcess')}
            </ElButton>
          )}
          {row.status === 'pending' && hasAuth('todo:update') && (
            <ElPopconfirm title={$t('common.confirm')} onConfirm={() => handleStart(row.id)}>
              {{
                reference: () => (
                  <ElButton type="success" plain size="small">
                    {$t('page.todo.startProcessing')}
                  </ElButton>
                )
              }}
            </ElPopconfirm>
          )}
          {isTodoActionable(row.status) && hasAuth('todo:cancel') && (
            <ElPopconfirm title={$t('page.todo.confirmCancel')} onConfirm={() => handleCancel(row.id)}>
              {{
                reference: () => (
                  <ElButton type="danger" plain size="small">
                    {$t('page.todo.cancel')}
                  </ElButton>
                )
              }}
            </ElPopconfirm>
          )}
        </div>
      )
    }
  ]
});

const detailVisible = shallowRef(false);
const detailTodoId = shallowRef<number | null>(null);

function viewDetail(id: number) {
  detailTodoId.value = id;
  detailVisible.value = true;
}

function handleGoProcess(row: Api.Todo.TodoItem) {
  goProcessTodo(row, routerPushByKey);
}

async function handleStart(id: number) {
  const { error } = await fetchStartTodo(id);

  if (!error) {
    window.$message?.success($t('common.modifySuccess'));
    await getData();
  }
}

async function handleCancel(id: number) {
  const { error } = await fetchCancelTodo(id);

  if (!error) {
    window.$message?.success($t('common.modifySuccess'));
    await getData();
  }
}

async function resetSearchParams() {
  searchParams.value = getInitSearchParams();
  await getData();
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <MyTodoSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <ElCard class="card-wrapper sm:flex-1-hidden">
      <template #header>
        <div class="flex items-center justify-between">
          <p>{{ $t('page.todo.myTodo.title') }}</p>
          <ElButton @click="getData">
            <template #icon>
              <icon-mdi-refresh class="text-icon" />
            </template>
            {{ $t('common.refresh') }}
          </ElButton>
        </div>
      </template>
      <div class="h-[calc(100%-52px)]">
        <ElTable v-loading="loading" height="100%" border class="sm:h-full" :data="data" row-key="id">
          <ElTableColumn v-for="col in columns" :key="col.prop" v-bind="col" />
        </ElTable>
      </div>
      <div class="mt-20px flex justify-end">
        <ElPagination
          v-if="mobilePagination.total"
          layout="total,prev,pager,next,sizes"
          v-bind="mobilePagination"
          @current-change="mobilePagination['current-change']"
          @size-change="mobilePagination['size-change']"
        />
      </div>
      <TodoDetailDialog v-model:visible="detailVisible" :todo-id="detailTodoId" />
    </ElCard>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-card) {
  .ht50 {
    height: calc(100% - 50px);
  }
}
</style>
