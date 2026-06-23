<script setup lang="tsx">
import { ref } from 'vue';
import { fetchDeleteAssetCategory, fetchGetAssetCategoryList } from '@/service/api';
import { useTableOperate, useUITable } from '@/hooks/common/table';
import { $t } from '@/locales';
import AssetCategoryOperateDrawer from './modules/asset-category-operate-drawer.vue';
import AssetCategorySearch from './modules/asset-category-search.vue';

defineOptions({ name: 'AssetCategoryManage' });

const searchParams = ref<Api.Asset.AssetCategorySearchParams>(getInitSearchParams());

function getInitSearchParams(): Api.Asset.AssetCategorySearchParams {
  return {
    keyword: undefined,
    status: undefined
  };
}

const { columns, columnChecks, data, getData, loading } = useUITable({
  api: () => fetchGetAssetCategoryList(searchParams.value),
  transform: response => {
    const { data: list, error } = response;
    return error ? [] : list;
  },
  columns: () => [
    { prop: 'index', type: 'index', label: $t('common.index'), width: 64 },
    { prop: 'categoryName', label: $t('page.assetManage.assetCategory.categoryName'), minWidth: 120 },
    { prop: 'categoryCode', label: $t('page.assetManage.assetCategory.categoryCode'), minWidth: 120 },
    { prop: 'description', label: $t('page.assetManage.assetCategory.description'), minWidth: 160 },
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
      width: 130,
      formatter: row => (
        <div class="flex-center">
          <ElButton v-permission="asset_category:update" type="primary" plain size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </ElButton>
          <ElPopconfirm title={$t('common.confirmDelete')} onConfirm={() => handleDelete(row.id)}>
            {{
              reference: () => (
                <ElButton v-permission="asset_category:delete" type="danger" plain size="small">
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
  const { error } = await fetchDeleteAssetCategory(id);

  if (!error) {
    window.$message?.success($t('common.deleteSuccess'));
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
    <AssetCategorySearch v-model:model="searchParams" @reset="resetSearchParams" @search="getData" />
    <ElCard class="card-wrapper sm:flex-1-hidden">
      <template #header>
        <div class="flex items-center justify-between">
          <p>{{ $t('page.assetManage.assetCategory.title') }}</p>
          <TableHeaderOperation v-model:columns="columnChecks" :loading="loading" @add="handleAdd" @refresh="getData">
            <template #default>
              <ElButton v-permission="'asset_category:create'" type="primary" plain @click="handleAdd">
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
      <AssetCategoryOperateDrawer
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
