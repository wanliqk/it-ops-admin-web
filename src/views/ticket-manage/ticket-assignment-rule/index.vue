<script setup lang="tsx">
import { onMounted, ref } from 'vue';
import { getAssignStrategyLabel } from '@/constants/ticket-assignment';
import {
  fetchDeleteAssignmentRule,
  fetchGetAssignmentRuleList,
  fetchGetTicketCategoryList,
  fetchUpdateAssignmentRuleStatus
} from '@/service/api';
import { defaultTransform, useTableOperate, useUIPaginatedTable } from '@/hooks/common/table';
import { $t } from '@/locales';
import TicketAssignmentRuleOperateDrawer from './modules/ticket-assignment-rule-operate-drawer.vue';
import TicketAssignmentRuleSearch from './modules/ticket-assignment-rule-search.vue';

defineOptions({ name: 'TicketAssignmentRuleManage' });

const priorityLabel: Record<Api.Ticket.TicketPriority, string> = {
  low: $t('page.ticket.priorityType.low'),
  normal: $t('page.ticket.priorityType.normal'),
  high: $t('page.ticket.priorityType.high'),
  urgent: $t('page.ticket.priorityType.urgent')
};

const assignStrategyLabel = getAssignStrategyLabel();

/** ticket categories aren't denormalized on the rule list response, so resolve names client-side */
const categoryLabel = ref<Record<number, string>>({});

async function loadCategoryOptions() {
  const { data, error } = await fetchGetTicketCategoryList();

  if (!error) {
    categoryLabel.value = Object.fromEntries(data.map(item => [item.id, item.name]));
  }
}

onMounted(loadCategoryOptions);

const searchParams = ref(getInitSearchParams());

function getInitSearchParams(): Api.TicketAssignment.RuleSearchParams {
  return {
    current: 1,
    size: 10,
    name: undefined,
    categoryId: undefined,
    priority: undefined,
    opsGroupId: undefined,
    targetUserId: undefined,
    assignStrategy: undefined,
    enabled: undefined
  };
}

const { columns, data, getData, getDataByPage, loading, mobilePagination } = useUIPaginatedTable({
  paginationProps: {
    currentPage: searchParams.value.current,
    pageSize: searchParams.value.size
  },
  api: () => fetchGetAssignmentRuleList(searchParams.value),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.value.current = params.currentPage;
    searchParams.value.size = params.pageSize;
  },
  columns: () => [
    { prop: 'name', label: $t('page.manage.assignmentRule.name'), minWidth: 160 },
    {
      prop: 'categoryId',
      label: $t('page.ticket.category'),
      width: 110,
      formatter: row =>
        row.categoryId === null
          ? $t('page.manage.assignmentRule.anyCategory')
          : (categoryLabel.value[row.categoryId] ?? '-')
    },
    {
      prop: 'priority',
      label: $t('page.ticket.priority'),
      width: 90,
      formatter: row => (row.priority ? priorityLabel[row.priority] : $t('page.manage.assignmentRule.anyPriority'))
    },
    {
      prop: 'assignStrategy',
      label: $t('page.manage.assignmentRule.assignStrategy'),
      width: 130,
      formatter: row => <ElTag>{assignStrategyLabel[row.assignStrategy]}</ElTag>
    },
    {
      prop: 'opsGroupName',
      label: $t('page.manage.assignmentRule.opsGroup'),
      width: 130,
      formatter: row => row.opsGroupName ?? '-'
    },
    {
      prop: 'targetUserName',
      label: $t('page.manage.assignmentRule.targetUser'),
      width: 110,
      formatter: row => row.targetUserName ?? '-'
    },
    {
      prop: 'enabled',
      label: $t('page.manage.common.status.title'),
      width: 90,
      formatter: row => (
        <ElTag type={row.enabled ? 'success' : 'warning'}>
          {row.enabled ? $t('page.manage.common.status.enable') : $t('page.manage.common.status.disable')}
        </ElTag>
      )
    },
    { prop: 'sortOrder', label: $t('page.manage.assignmentRule.sortOrder'), width: 90 },
    {
      prop: 'remark',
      label: $t('page.manage.assignmentRule.remark'),
      minWidth: 160,
      showOverflowTooltip: true,
      formatter: row => row.remark ?? '-'
    },
    { prop: 'createTime', label: $t('common.createTime'), width: 160 },
    { prop: 'updateTime', label: $t('page.manage.assignmentRule.updateTime'), width: 160 },
    {
      prop: 'operate',
      label: $t('common.operate'),
      align: 'center',
      width: 220,
      formatter: row => (
        <div class="flex-center gap-8px">
          <ElButton
            v-permission="ticket:assignment-rule:update"
            type="primary"
            plain
            size="small"
            onClick={() => edit(row.id)}
          >
            {$t('common.edit')}
          </ElButton>
          {row.enabled ? (
            <ElPopconfirm
              title={$t('page.manage.assignmentRule.confirmDisable')}
              onConfirm={() => handleToggleEnabled(row)}
            >
              {{
                reference: () => (
                  <ElButton v-permission="ticket:assignment-rule:status" plain size="small">
                    {$t('page.manage.common.status.disable')}
                  </ElButton>
                )
              }}
            </ElPopconfirm>
          ) : (
            <ElButton
              v-permission="ticket:assignment-rule:status"
              plain
              size="small"
              onClick={() => handleToggleEnabled(row)}
            >
              {$t('page.manage.common.status.enable')}
            </ElButton>
          )}
          <ElPopconfirm title={$t('common.confirmDelete')} onConfirm={() => handleDelete(row.id)}>
            {{
              reference: () => (
                <ElButton v-permission="ticket:assignment-rule:delete" type="danger" plain size="small">
                  {$t('common.delete')}
                </ElButton>
              )
            }}
          </ElPopconfirm>
        </div>
      )
    }
  ]
});

const { drawerVisible, operateType, editingData, handleAdd, handleEdit } = useTableOperate(data, 'id', getData);

function edit(id: number) {
  handleEdit(id);
}

async function handleDelete(id: number) {
  const { error } = await fetchDeleteAssignmentRule(id);

  if (!error) {
    window.$message?.success($t('common.deleteSuccess'));
    await getData();
  }
}

async function handleToggleEnabled(row: Api.TicketAssignment.Rule) {
  const { error } = await fetchUpdateAssignmentRuleStatus(row.id, !row.enabled);

  if (!error) {
    window.$message?.success($t('common.modifySuccess'));
    await getData();
  }
}

function resetSearchParams() {
  searchParams.value = getInitSearchParams();
  getData();
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <TicketAssignmentRuleSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <ElCard class="card-wrapper sm:flex-1-hidden">
      <template #header>
        <div class="flex items-center justify-between">
          <p>{{ $t('page.manage.assignmentRule.title') }}</p>
          <ElSpace>
            <ElButton v-permission="'ticket:assignment-rule:create'" type="primary" plain @click="handleAdd">
              <template #icon>
                <icon-ic-round-plus class="text-icon" />
              </template>
              {{ $t('page.manage.assignmentRule.addRule') }}
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
      <TicketAssignmentRuleOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
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
