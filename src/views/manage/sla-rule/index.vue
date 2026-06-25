<script setup lang="tsx">
import { onMounted, ref } from 'vue';
import {
  fetchDeleteSlaRule,
  fetchGetTicketCategoryList,
  fetchSlaRuleList,
  fetchUpdateSlaRuleEnabled
} from '@/service/api';
import { defaultTransform, useTableOperate, useUIPaginatedTable } from '@/hooks/common/table';
import { $t } from '@/locales';
import SlaRuleOperateDrawer from './modules/sla-rule-operate-drawer.vue';
import SlaRuleSearch from './modules/sla-rule-search.vue';

defineOptions({ name: 'SlaRuleManage' });

const priorityLabel: Record<Api.Sla.Priority, string> = {
  urgent: $t('page.ticket.priorityType.urgent'),
  high: $t('page.ticket.priorityType.high'),
  medium: $t('page.manage.slaRule.priorityType.medium'),
  low: $t('page.ticket.priorityType.low')
};

const priorityTagType: Record<Api.Sla.Priority, UI.ThemeColor> = {
  urgent: 'danger',
  high: 'warning',
  medium: 'primary',
  low: 'info'
};

/** ticket categories aren't denormalized on the SLA rule list response, so resolve names client-side */
const categoryLabel = ref<Record<number, string>>({});

async function loadCategoryOptions() {
  const { data, error } = await fetchGetTicketCategoryList();

  if (!error) {
    categoryLabel.value = Object.fromEntries(data.map(item => [item.id, item.name]));
  }
}

onMounted(loadCategoryOptions);

const searchParams = ref(getInitSearchParams());

function getInitSearchParams(): Api.Sla.SlaRuleSearchParams {
  return {
    current: 1,
    size: 10,
    priority: undefined,
    categoryId: undefined,
    enabled: undefined
  };
}

const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination } = useUIPaginatedTable({
  paginationProps: {
    currentPage: searchParams.value.current,
    pageSize: searchParams.value.size
  },
  api: () => fetchSlaRuleList(searchParams.value),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.value.current = params.currentPage;
    searchParams.value.size = params.pageSize;
  },
  columns: () => [
    { prop: 'name', label: $t('page.manage.slaRule.name'), minWidth: 160 },
    {
      prop: 'categoryId',
      label: $t('page.ticket.category'),
      width: 110,
      formatter: row =>
        row.categoryId === null ? $t('page.manage.slaRule.allCategories') : (categoryLabel.value[row.categoryId] ?? '-')
    },
    {
      prop: 'priority',
      label: $t('page.manage.slaRule.priority'),
      width: 90,
      formatter: row => <ElTag type={priorityTagType[row.priority]}>{priorityLabel[row.priority]}</ElTag>
    },
    {
      prop: 'responseMinutes',
      label: $t('page.manage.slaRule.responseMinutes'),
      width: 110,
      formatter: row => `${row.responseMinutes} ${$t('page.manage.slaRule.minutes')}`
    },
    {
      prop: 'resolveMinutes',
      label: $t('page.manage.slaRule.resolveMinutes'),
      width: 110,
      formatter: row => `${row.resolveMinutes} ${$t('page.manage.slaRule.minutes')}`
    },
    {
      prop: 'enabled',
      label: $t('page.manage.common.status.title'),
      width: 100,
      formatter: row => (
        <ElTag type={row.enabled === 1 ? 'success' : 'warning'}>
          {row.enabled === 1 ? $t('page.manage.common.status.enable') : $t('page.manage.common.status.disable')}
        </ElTag>
      )
    },
    { prop: 'sortOrder', label: $t('page.manage.slaRule.sortOrder'), width: 90 },
    { prop: 'createTime', label: $t('common.createTime'), width: 160 },
    {
      prop: 'operate',
      label: $t('common.operate'),
      align: 'center',
      width: 280,
      formatter: row => (
        <div class="flex-center gap-8px">
          <ElButton v-permission="sla:rule:update" type="primary" plain size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </ElButton>
          <ElPopconfirm
            title={`${$t('common.confirm')}${row.enabled === 1 ? $t('page.manage.common.status.disable') : $t('page.manage.common.status.enable')}?`}
            onConfirm={() => handleToggleEnabled(row)}
          >
            {{
              reference: () => (
                <ElButton v-permission="sla:rule:enable" plain size="small">
                  {row.enabled === 1 ? $t('page.manage.common.status.disable') : $t('page.manage.common.status.enable')}
                </ElButton>
              )
            }}
          </ElPopconfirm>
          <ElPopconfirm title={$t('common.confirmDelete')} onConfirm={() => handleDelete(row.id)}>
            {{
              reference: () => (
                <ElButton v-permission="sla:rule:delete" type="danger" plain size="small">
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

async function handleDelete(id: number) {
  const { error } = await fetchDeleteSlaRule(id);

  if (!error) {
    window.$message?.success($t('common.deleteSuccess'));
    await getData();
  }
}

async function handleToggleEnabled(row: Api.Sla.SlaRule) {
  const { error } = await fetchUpdateSlaRuleEnabled(row.id, row.enabled === 1 ? 0 : 1);

  if (!error) {
    window.$message?.success($t('common.modifySuccess'));
    await getData();
  }
}

function resetSearchParams() {
  searchParams.value = getInitSearchParams();
}

function edit(id: number) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <SlaRuleSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <ElCard class="card-wrapper sm:flex-1-hidden">
      <template #header>
        <div class="flex items-center justify-between">
          <p>{{ $t('page.manage.slaRule.title') }}</p>
          <TableHeaderOperation v-model:columns="columnChecks" :loading="loading" @add="handleAdd" @refresh="getData">
            <template #default>
              <ElButton v-permission="'sla:rule:create'" type="primary" plain @click="handleAdd">
                <template #icon>
                  <icon-ic-round-plus class="text-icon" />
                </template>
                {{ $t('common.add') }}
              </ElButton>
            </template>
          </TableHeaderOperation>
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
      <SlaRuleOperateDrawer
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
