<script setup lang="tsx">
import { ref, shallowRef } from 'vue';
import { getAssignTypeLabel } from '@/constants/ticket-assignment';
import { fetchAutoAssignTicket, fetchDeleteTicket, fetchGetTicketList } from '@/service/api';
import { defaultTransform, useUIPaginatedTable } from '@/hooks/common/table';
import { useRouterPush } from '@/hooks/common/router';
import { useAuth } from '@/hooks/business/auth';
import { $t } from '@/locales';
import TicketCreateDrawer from './modules/ticket-create-drawer.vue';
import TicketSearch from './modules/ticket-search.vue';

defineOptions({ name: 'TicketManage' });

const { routerPushByKey } = useRouterPush();
const { hasAuth } = useAuth();

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

const assignTypeLabel = getAssignTypeLabel();

/** completed/closed/cancelled tickets are terminal — no auto-assign action makes sense there */
function isAutoAssignable(status: Api.Ticket.TicketStatus): boolean {
  return status !== 'completed' && status !== 'closed' && status !== 'cancelled';
}

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

/**
 * combined SLA status for the list column: response_overdue / resolve_overdue can both be set at once, per
 * admin-api-v1.md 18.6/18.7 — show whichever apply, or "normal" if neither does
 */
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

function getInitSearchParams(): Api.Ticket.TicketSearchParams {
  return {
    current: 1,
    size: 10,
    keyword: undefined,
    status: undefined,
    priority: undefined,
    categoryId: undefined
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
    {
      prop: 'assigneeName',
      label: $t('page.ticket.assignee'),
      width: 100,
      formatter: row => row.assigneeName ?? $t('page.ticket.noAssignee')
    },
    {
      prop: 'assignType',
      label: $t('page.ticket.assignType'),
      width: 130,
      formatter: row => (row.assignType ? assignTypeLabel[row.assignType] : $t('page.ticket.assignTypeType.unassigned'))
    },
    { prop: 'assignedAt', label: $t('page.ticket.assignedAt'), width: 160, formatter: row => row.assignedAt ?? '-' },
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
      width: 240,
      formatter: row => (
        <div class="flex-center gap-8px">
          <ElButton type="primary" plain size="small" onClick={() => viewDetail(row.id)}>
            {$t('common.detail')}
          </ElButton>
          {hasAuth('ticket:auto-assign') && isAutoAssignable(row.status) && (
            <>
              {row.assigneeId === null ? (
                <ElButton type="success" plain size="small" onClick={() => handleAutoAssign(row.id, false)}>
                  {$t('page.ticket.autoAssign')}
                </ElButton>
              ) : (
                <ElPopconfirm
                  title={$t('page.ticket.confirmReAutoAssign')}
                  onConfirm={() => handleAutoAssign(row.id, true)}
                >
                  {{
                    reference: () => (
                      <ElButton type="warning" plain size="small">
                        {$t('page.ticket.reAutoAssign')}
                      </ElButton>
                    )
                  }}
                </ElPopconfirm>
              )}
            </>
          )}
          {(row.status === 'pending_accept' || row.status === 'pending' || row.status === 'cancelled') && (
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

async function handleAutoAssign(id: number, force: boolean) {
  const { data: result, error } = await fetchAutoAssignTicket(id, force);

  if (error || !result) return;

  if (result.success) {
    window.$message?.success(`${$t('page.ticket.autoAssignSuccess')}${result.assigneeName ?? ''}`);
  } else {
    window.$message?.warning(`${$t('page.ticket.autoAssignFail')}${result.failReason ?? ''}`);
  }

  await getData();
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
