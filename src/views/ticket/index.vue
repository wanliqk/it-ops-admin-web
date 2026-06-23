<script setup lang="tsx">
import { ref, shallowRef } from 'vue';
import { fetchDeleteTicket, fetchGetTicketList } from '@/service/api';
import { defaultTransform, useUIPaginatedTable } from '@/hooks/common/table';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';
import TicketCreateDrawer from './modules/ticket-create-drawer.vue';
import TicketSearch from './modules/ticket-search.vue';

defineOptions({ name: 'TicketManage' });

const { routerPushByKey } = useRouterPush();

const statusLabel: Record<Api.Ticket.TicketStatus, string> = {
  pending: $t('page.ticket.statusType.pending'),
  assigned: $t('page.ticket.statusType.assigned'),
  processing: $t('page.ticket.statusType.processing'),
  completed: $t('page.ticket.statusType.completed'),
  cancelled: $t('page.ticket.statusType.cancelled')
};

const statusTagType: Record<Api.Ticket.TicketStatus, UI.ThemeColor> = {
  pending: 'info',
  assigned: 'primary',
  processing: 'warning',
  completed: 'success',
  cancelled: 'danger'
};

const priorityLabel: Record<Api.Ticket.TicketPriority, string> = {
  low: $t('page.ticket.priorityType.low'),
  normal: $t('page.ticket.priorityType.normal'),
  high: $t('page.ticket.priorityType.high'),
  urgent: $t('page.ticket.priorityType.urgent')
};

const priorityTagType: Record<Api.Ticket.TicketPriority, UI.ThemeColor> = {
  low: 'info',
  normal: 'primary',
  high: 'warning',
  urgent: 'danger'
};

const searchParams = ref(getInitSearchParams());

function getInitSearchParams(): Api.Ticket.TicketSearchParams {
  return {
    current: 1,
    size: 10,
    keyword: undefined,
    status: undefined,
    priority: undefined,
    faultType: undefined
  };
}

const { columns, data, getData, getDataByPage, loading, mobilePagination } = useUIPaginatedTable({
  paginationProps: {
    currentPage: searchParams.value.current,
    pageSize: searchParams.value.size
  },
  api: () => fetchGetTicketList(searchParams.value),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.value.current = params.currentPage;
    searchParams.value.size = params.pageSize;
  },
  columns: () => [
    { prop: 'ticketNo', label: $t('page.ticket.ticketNo'), minWidth: 160 },
    { prop: 'title', label: $t('page.ticket.ticketTitle'), minWidth: 160 },
    {
      prop: 'priority',
      label: $t('page.ticket.priority'),
      width: 90,
      formatter: row => <ElTag type={priorityTagType[row.priority]}>{priorityLabel[row.priority]}</ElTag>
    },
    {
      prop: 'status',
      label: $t('page.ticket.status'),
      width: 100,
      formatter: row => <ElTag type={statusTagType[row.status]}>{statusLabel[row.status]}</ElTag>
    },
    { prop: 'reporterName', label: $t('page.ticket.reporter'), width: 100 },
    { prop: 'handlerName', label: $t('page.ticket.handler'), width: 100 },
    { prop: 'createTime', label: $t('common.createTime'), width: 160 },
    {
      prop: 'operate',
      label: $t('common.operate'),
      align: 'center',
      width: 160,
      formatter: row => (
        <div class="flex-center gap-8px">
          <ElButton type="primary" plain size="small" onClick={() => viewDetail(row.id)}>
            {$t('common.detail')}
          </ElButton>
          {(row.status === 'pending' || row.status === 'cancelled') && (
            <ElPopconfirm title={$t('common.confirmDelete')} onConfirm={() => handleDelete(row.id)}>
              {{
                reference: () => (
                  <ElButton v-permission="ticket:delete" type="danger" plain size="small">
                    {$t('common.delete')}
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

const createVisible = shallowRef(false);

function openCreate() {
  createVisible.value = true;
}

function viewDetail(id: number) {
  routerPushByKey('ticket-detail', { params: { id: String(id) } });
}

async function handleDelete(id: number) {
  const { error } = await fetchDeleteTicket(id);

  if (!error) {
    window.$message?.success($t('common.deleteSuccess'));
    await getData();
  }
}

function resetSearchParams() {
  searchParams.value = getInitSearchParams();
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <TicketSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <ElCard class="card-wrapper sm:flex-1-hidden">
      <template #header>
        <div class="flex items-center justify-between">
          <p>{{ $t('page.ticket.title') }}</p>
          <ElSpace>
            <ElButton v-permission="'ticket:create'" type="primary" plain @click="openCreate">
              <template #icon>
                <icon-ic-round-plus class="text-icon" />
              </template>
              {{ $t('page.ticket.addTicket') }}
            </ElButton>
            <ElButton @click="getData">
              <template #icon>
                <icon-mdi-refresh class="text-icon" />
              </template>
              {{ $t('common.refresh') }}
            </ElButton>
          </ElSpace>
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
      <TicketCreateDrawer v-model:visible="createVisible" @submitted="getDataByPage" />
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
