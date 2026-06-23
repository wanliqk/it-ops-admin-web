<script setup lang="tsx">
import { ref } from 'vue';
import { fetchDeleteFaq, fetchGetFaqList, fetchUpdateFaqStatus } from '@/service/api';
import { defaultTransform, useTableOperate, useUIPaginatedTable } from '@/hooks/common/table';
import { $t } from '@/locales';
import FaqOperateDrawer from './modules/faq-operate-drawer.vue';
import FaqSearch from './modules/faq-search.vue';

defineOptions({ name: 'FaqManage' });

const searchParams = ref(getInitSearchParams());

function getInitSearchParams(): Api.Faq.FaqSearchParams {
  return {
    current: 1,
    size: 10,
    keyword: undefined,
    category: undefined
  };
}

const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination } = useUIPaginatedTable({
  paginationProps: {
    currentPage: searchParams.value.current,
    pageSize: searchParams.value.size
  },
  api: () => fetchGetFaqList(searchParams.value),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.value.current = params.currentPage;
    searchParams.value.size = params.pageSize;
  },
  columns: () => [
    { prop: 'title', label: $t('page.faq.faqTitle'), minWidth: 200 },
    { prop: 'categoryName', label: $t('page.faq.category'), width: 110 },
    { prop: 'summary', label: $t('page.faq.summary'), minWidth: 200 },
    { prop: 'viewCount', label: $t('page.faq.viewCount'), width: 90 },
    {
      prop: 'status',
      label: $t('page.manage.common.status.title'),
      width: 100,
      formatter: row => (
        <ElTag type={row.status === 1 ? 'success' : 'warning'}>
          {row.status === 1 ? $t('page.manage.common.status.enable') : $t('page.manage.common.status.disable')}
        </ElTag>
      )
    },
    {
      prop: 'operate',
      label: $t('common.operate'),
      align: 'center',
      width: 220,
      formatter: row => (
        <div class="flex-center gap-8px">
          <ElButton v-permission="faq:update" type="primary" plain size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </ElButton>
          <ElPopconfirm
            title={`${$t('common.confirm')}${row.status === 1 ? $t('page.manage.common.status.disable') : $t('page.manage.common.status.enable')}?`}
            onConfirm={() => handleToggleStatus(row)}
          >
            {{
              reference: () => (
                <ElButton v-permission="faq:status" plain size="small">
                  {row.status === 1 ? $t('page.manage.common.status.disable') : $t('page.manage.common.status.enable')}
                </ElButton>
              )
            }}
          </ElPopconfirm>
          <ElPopconfirm title={$t('common.confirmDelete')} onConfirm={() => handleDelete(row.id)}>
            {{
              reference: () => (
                <ElButton v-permission="faq:delete" type="danger" plain size="small">
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
  const { error } = await fetchDeleteFaq(id);

  if (!error) {
    window.$message?.success($t('common.deleteSuccess'));
    await getData();
  }
}

async function handleToggleStatus(row: Api.Faq.Faq) {
  const { error } = await fetchUpdateFaqStatus(row.id, row.status === 1 ? 0 : 1);

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
    <FaqSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <ElCard class="card-wrapper sm:flex-1-hidden">
      <template #header>
        <div class="flex items-center justify-between">
          <p>{{ $t('page.faq.title') }}</p>
          <TableHeaderOperation v-model:columns="columnChecks" :loading="loading" @add="handleAdd" @refresh="getData">
            <template #default>
              <ElButton v-permission="'faq:create'" type="primary" plain @click="handleAdd">
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
      <FaqOperateDrawer
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
