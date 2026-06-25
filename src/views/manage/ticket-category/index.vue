<script setup lang="tsx">
import { ref } from 'vue';
import { getAssignStrategyLabel } from '@/constants/ticket-assignment';
import { fetchDeleteTicketCategory, fetchGetTicketCategoryTree, fetchUpdateTicketCategoryStatus } from '@/service/api';
import { useTableOperate, useUITable } from '@/hooks/common/table';
import { $t } from '@/locales';
import TicketCategoryOperateDrawer from './modules/ticket-category-operate-drawer.vue';
import TicketCategorySearch from './modules/ticket-category-search.vue';

defineOptions({ name: 'TicketCategoryManage' });

const priorityLabel: Record<Api.Ticket.TicketPriority, string> = {
  low: $t('page.ticket.priorityType.low'),
  normal: $t('page.ticket.priorityType.normal'),
  high: $t('page.ticket.priorityType.high'),
  urgent: $t('page.ticket.priorityType.urgent')
};

const assignStrategyLabel = getAssignStrategyLabel();

const searchParams = ref(getInitSearchParams());

function getInitSearchParams(): Api.TicketCategory.TicketCategorySearchParams {
  return {
    keyword: undefined,
    status: undefined,
    parentId: undefined
  };
}

/**
 * the tree endpoint doesn't support keyword/parent filtering server-side (admin-api-v1.md 8.8.2 only
 * takes `status`); keyword/parent filters are applied client-side over the fetched tree.
 */
function matchesFilters(node: Api.TicketCategory.TicketCategoryTreeNode): boolean {
  const keyword = searchParams.value.keyword?.trim().toLowerCase();
  const matchesKeyword =
    !keyword || node.name.toLowerCase().includes(keyword) || node.code.toLowerCase().includes(keyword);
  const matchesParent = searchParams.value.parentId === undefined || node.parentId === searchParams.value.parentId;
  return matchesKeyword && matchesParent;
}

function filterTree(nodes: Api.TicketCategory.TicketCategoryTreeNode[]): Api.TicketCategory.TicketCategoryTreeNode[] {
  return nodes.reduce<Api.TicketCategory.TicketCategoryTreeNode[]>((acc, node) => {
    const children = filterTree(node.children);

    if (matchesFilters(node) || children.length > 0) {
      acc.push({ ...node, children });
    }

    return acc;
  }, []);
}

const { columns, columnChecks, data, getData, loading } = useUITable({
  api: () => fetchGetTicketCategoryTree({ status: searchParams.value.status }),
  transform: response => {
    const { data: tree, error } = response;
    return error ? [] : filterTree(tree);
  },
  columns: () => [
    { prop: 'name', label: $t('page.manage.ticketCategory.name'), minWidth: 160 },
    { prop: 'code', label: $t('page.manage.ticketCategory.code'), width: 120 },
    {
      prop: 'defaultPriority',
      label: $t('page.manage.ticketCategory.defaultPriority'),
      width: 100,
      formatter: row => (row.defaultPriority ? priorityLabel[row.defaultPriority] : '-')
    },
    {
      prop: 'defaultGroupName',
      label: $t('page.manage.ticketCategory.defaultGroup'),
      width: 120,
      formatter: row => row.defaultGroupName ?? '-'
    },
    {
      prop: 'assignmentStrategy',
      label: $t('page.manage.assignmentRule.assignStrategy'),
      width: 130,
      formatter: row => (row.assignmentStrategy ? assignStrategyLabel[row.assignmentStrategy] : '-')
    },
    {
      prop: 'fixedAssigneeName',
      label: $t('page.manage.assignmentRule.targetUser'),
      width: 110,
      formatter: row => row.fixedAssigneeName ?? '-'
    },
    {
      prop: 'requireAsset',
      label: $t('page.manage.ticketCategory.requireAsset'),
      width: 90,
      formatter: row => (row.requireAsset === 1 ? $t('common.yesOrNo.yes') : $t('common.yesOrNo.no'))
    },
    { prop: 'sortOrder', label: $t('page.manage.ticketCategory.sortOrder'), width: 90 },
    {
      prop: 'status',
      label: $t('page.manage.common.status.title'),
      width: 90,
      formatter: row => (
        <ElTag type={row.status === 1 ? 'success' : 'warning'}>
          {row.status === 1 ? $t('page.manage.common.status.enable') : $t('page.manage.common.status.disable')}
        </ElTag>
      )
    },
    { prop: 'createTime', label: $t('common.createTime'), width: 160 },
    {
      prop: 'operate',
      label: $t('common.operate'),
      align: 'center',
      width: 220,
      formatter: row => (
        <div class="flex-center gap-8px">
          <ElButton
            v-permission="ticket_category:update"
            type="primary"
            plain
            size="small"
            onClick={() => edit(row.id)}
          >
            {$t('common.edit')}
          </ElButton>
          {row.status === 1 ? (
            <ElPopconfirm
              title={$t('page.manage.ticketCategory.confirmDisable')}
              onConfirm={() => handleToggleStatus(row)}
            >
              {{
                reference: () => (
                  <ElButton v-permission="ticket_category:status" plain size="small">
                    {$t('page.manage.common.status.disable')}
                  </ElButton>
                )
              }}
            </ElPopconfirm>
          ) : (
            <ElPopconfirm
              title={$t('page.manage.ticketCategory.confirmEnable')}
              onConfirm={() => handleToggleStatus(row)}
            >
              {{
                reference: () => (
                  <ElButton v-permission="ticket_category:status" plain size="small">
                    {$t('page.manage.common.status.enable')}
                  </ElButton>
                )
              }}
            </ElPopconfirm>
          )}
          <ElPopconfirm title={$t('page.manage.ticketCategory.confirmDelete')} onConfirm={() => handleDelete(row.id)}>
            {{
              reference: () => (
                <ElButton v-permission="ticket_category:delete" type="danger" plain size="small">
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
  const { error } = await fetchDeleteTicketCategory(id);

  if (!error) {
    window.$message?.success($t('common.deleteSuccess'));
    await getData();
  }
}

async function handleToggleStatus(row: Api.TicketCategory.TicketCategoryTreeNode) {
  const { error } = await fetchUpdateTicketCategoryStatus(row.id, row.status === 1 ? 0 : 1);

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
    <TicketCategorySearch v-model:model="searchParams" @reset="resetSearchParams" @search="getData" />
    <ElCard class="card-wrapper sm:flex-1-hidden">
      <template #header>
        <div class="flex items-center justify-between">
          <p>{{ $t('page.manage.ticketCategory.title') }}</p>
          <TableHeaderOperation v-model:columns="columnChecks" :loading="loading" @add="handleAdd" @refresh="getData">
            <template #default>
              <ElButton v-permission="'ticket_category:create'" type="primary" plain @click="handleAdd">
                <template #icon>
                  <icon-ic-round-plus class="text-icon" />
                </template>
                {{ $t('page.manage.ticketCategory.addCategory') }}
              </ElButton>
            </template>
          </TableHeaderOperation>
        </div>
      </template>
      <div class="h-[calc(100%-52px)]">
        <ElTable
          v-loading="loading"
          height="100%"
          border
          class="sm:h-full"
          :data="data"
          row-key="id"
          default-expand-all
        >
          <ElTableColumn v-for="col in columns" :key="col.prop" v-bind="col" />
        </ElTable>
      </div>
      <TicketCategoryOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
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
