<script setup lang="tsx">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { fetchGetTicketList } from '@/service/api';
import { useAuthStore } from '@/store/modules/auth';
import { defaultTransform, useUIPaginatedTable } from '@/hooks/common/table';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';
import TicketSearch from '../list/modules/ticket-search.vue';

defineOptions({ name: 'TicketMyList' });

const route = useRoute();
const { routerPushByKey } = useRouterPush();
const authStore = useAuthStore();

const statusLabel: Record<Api.Ticket.TicketStatus, string> = {
  pending_accept: $t('page.ticket.statusType.pendingAccept'),
  pending: $t('page.ticket.statusType.pending'),
  assigned: $t('page.ticket.statusType.assigned'),
  processing: $t('page.ticket.statusType.processing'),
  pending_confirm: $t('page.ticket.statusType.pendingConfirm'),
  completed: $t('page.ticket.statusType.completed'),
  closed: $t('page.ticket.statusType.closed'),
  cancelled: $t('page.ticket.statusType.cancelled')
};

const statusTagType: Record<Api.Ticket.TicketStatus, UI.ThemeColor> = {
  pending_accept: 'info',
  pending: 'info',
  assigned: 'primary',
  processing: 'warning',
  pending_confirm: 'warning',
  completed: 'success',
  closed: 'success',
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

/** combined SLA status for the list column, see admin-api-v1.md 18.6/18.7 */
function getSlaStatusLabels(row: Api.Ticket.Ticket): string[] {
  const labels: string[] = [];

  if (row.responseOverdue === 1) {
    labels.push($t('page.ticket.slaStatusType.responseOverdue'));
  }

  if (row.resolveOverdue === 1) {
    labels.push($t('page.ticket.slaStatusType.resolveOverdue'));
  }

  return labels;
}

const searchParams = ref(getInitSearchParams());

/** "我的工单" = tickets currently assigned to me for handling, not tickets I submitted */
function getInitSearchParams(): Api.Ticket.TicketSearchParams {
  const query = route.query;

  return {
    current: 1,
    size: 10,
    keyword: undefined,
    status: (query.status as Api.Ticket.TicketStatus) || undefined,
    priority: undefined,
    categoryId: undefined,
    handlerId: Number(authStore.userInfo.userId)
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
    {
      prop: 'categoryName',
      label: $t('page.ticket.category'),
      width: 110,
      formatter: row => row.categoryName ?? '-'
    },
    { prop: 'reporterName', label: $t('page.ticket.reporter'), width: 100 },
    { prop: 'createTime', label: $t('common.createTime'), width: 160 },
    {
      prop: 'slaResponseDeadline',
      label: $t('page.ticket.slaResponseDeadline'),
      width: 160,
      formatter: row => row.slaResponseDeadline ?? '-'
    },
    {
      prop: 'slaResolveDeadline',
      label: $t('page.ticket.slaResolveDeadline'),
      width: 160,
      formatter: row => row.slaResolveDeadline ?? '-'
    },
    {
      prop: 'slaStatus',
      label: $t('page.ticket.slaStatus'),
      width: 160,
      formatter: row => {
        const labels = getSlaStatusLabels(row);

        if (labels.length === 0) {
          return <ElTag type="success">{$t('page.ticket.slaStatusType.normal')}</ElTag>;
        }

        return (
          <div class="flex-center gap-4px">
            {labels.map(label => (
              <ElTag key={label} type="danger">
                {label}
              </ElTag>
            ))}
          </div>
        );
      }
    },
    {
      prop: 'operate',
      label: $t('common.operate'),
      align: 'center',
      width: 100,
      formatter: row => (
        <ElButton type="primary" plain size="small" onClick={() => viewDetail(row.id)}>
          {$t('common.detail')}
        </ElButton>
      )
    }
  ]
});

function viewDetail(id: number) {
  routerPushByKey('ticket-detail', { params: { id: String(id) } });
}

function resetSearchParams() {
  searchParams.value = getInitSearchParams();
}
</script>

<template>
  <div class="flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <TicketSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <ElCard class="card-wrapper sm:flex-1-hidden">
      <template #header>
        <div class="flex items-center justify-between">
          <p>{{ $t('route.ticket-manage_my') }}</p>
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
