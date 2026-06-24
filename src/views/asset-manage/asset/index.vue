<script setup lang="tsx">
import { ref, shallowRef } from 'vue';
import { fetchDeleteAsset, fetchGetAssetList, fetchUpdateAssetStatus } from '@/service/api';
import { defaultTransform, useTableOperate, useUIPaginatedTable } from '@/hooks/common/table';
import { $t } from '@/locales';
import AssetDetailDialog from './modules/asset-detail-dialog.vue';
import AssetOperateDrawer from './modules/asset-operate-drawer.vue';
import AssetSearch from './modules/asset-search.vue';

defineOptions({ name: 'AssetManage' });

const statusLabel: Record<Api.Asset.AssetStatus, string> = {
  in_use: $t('page.assetManage.asset.statusType.inUse'),
  idle: $t('page.assetManage.asset.statusType.idle'),
  repairing: $t('page.assetManage.asset.statusType.repairing'),
  scrapped: $t('page.assetManage.asset.statusType.scrapped')
};

const statusTagType: Record<Api.Asset.AssetStatus, UI.ThemeColor> = {
  in_use: 'success',
  idle: 'info',
  repairing: 'warning',
  scrapped: 'danger'
};

const searchParams = ref(getInitSearchParams());

function getInitSearchParams(): Api.Asset.AssetSearchParams {
  return {
    current: 1,
    size: 10,
    keyword: undefined,
    categoryId: undefined,
    status: undefined,
    department: undefined
  };
}

const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination } = useUIPaginatedTable({
  paginationProps: {
    currentPage: searchParams.value.current,
    pageSize: searchParams.value.size
  },
  api: () => fetchGetAssetList(searchParams.value),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.value.current = params.currentPage;
    searchParams.value.size = params.pageSize;
  },
  columns: () => [
    { prop: 'index', type: 'index', label: $t('common.index'), width: 64 },
    { prop: 'assetNo', label: $t('page.assetManage.asset.assetNo'), minWidth: 140 },
    { prop: 'assetName', label: $t('page.assetManage.asset.assetName'), minWidth: 140 },
    { prop: 'categoryName', label: $t('page.assetManage.asset.category'), minWidth: 100 },
    { prop: 'userName', label: $t('page.assetManage.asset.assignee'), minWidth: 100 },
    { prop: 'department', label: $t('page.assetManage.asset.department'), minWidth: 100 },
    {
      prop: 'status',
      label: $t('page.assetManage.asset.status'),
      width: 100,
      formatter: row => <ElTag type={statusTagType[row.status]}>{statusLabel[row.status]}</ElTag>
    },
    {
      prop: 'operate',
      label: $t('common.operate'),
      align: 'center',
      width: 330,
      formatter: row => (
        <div class="flex-center gap-8px">
          <ElButton plain size="small" onClick={() => viewDetail(row)}>
            {$t('page.assetManage.asset.detail')}
          </ElButton>
          <ElButton v-permission="asset:update" type="primary" plain size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </ElButton>
          <ElPopconfirm
            title={`${$t('common.confirm')}${$t('page.assetManage.asset.statusType.scrapped')}?`}
            onConfirm={() => handleScrap(row)}
          >
            {{
              reference: () =>
                row.status !== 'scrapped' && (
                  <ElButton v-permission="asset:status" plain size="small">
                    {$t('page.assetManage.asset.statusType.scrapped')}
                  </ElButton>
                )
            }}
          </ElPopconfirm>
          <ElPopconfirm title={$t('common.confirmDelete')} onConfirm={() => handleDelete(row.id)}>
            {{
              reference: () => (
                <ElButton v-permission="asset:delete" type="danger" plain size="small">
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

const detailVisible = shallowRef(false);
const detailData = shallowRef<Api.Asset.Asset | null>(null);

function viewDetail(row: Api.Asset.Asset) {
  detailData.value = row;
  detailVisible.value = true;
}

async function handleDelete(id: number) {
  const { error } = await fetchDeleteAsset(id);

  if (!error) {
    window.$message?.success($t('common.deleteSuccess'));
    await getData();
  }
}

async function handleScrap(row: Api.Asset.Asset) {
  const { error } = await fetchUpdateAssetStatus(row.id, 'scrapped');

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
    <AssetSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <ElCard class="card-wrapper sm:flex-1-hidden">
      <template #header>
        <div class="flex items-center justify-between">
          <p>{{ $t('page.assetManage.asset.title') }}</p>
          <TableHeaderOperation v-model:columns="columnChecks" :loading="loading" @add="handleAdd" @refresh="getData">
            <template #default>
              <ElButton v-permission="'asset:create'" type="primary" plain @click="handleAdd">
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
      <AssetOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
      <AssetDetailDialog v-model:visible="detailVisible" :row-data="detailData" />
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
