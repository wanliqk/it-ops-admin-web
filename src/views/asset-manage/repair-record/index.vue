<script setup lang="tsx">
import { ref, shallowRef } from 'vue';
import { fetchGetRepairRecordList } from '@/service/api';
import { defaultTransform, useUIPaginatedTable } from '@/hooks/common/table';
import { $t } from '@/locales';
import RepairRecordOperateDrawer from './modules/repair-record-operate-drawer.vue';
import RepairRecordSearch from './modules/repair-record-search.vue';

defineOptions({ name: 'RepairRecordManage' });

const resultLabel: Record<Api.Asset.RepairRecord['repairResult'], string> = {
  fixed: $t('page.assetManage.repairRecord.resultType.fixed'),
  replace_repair: $t('page.assetManage.repairRecord.resultType.replaceRepair'),
  scrapped: $t('page.assetManage.repairRecord.resultType.scrapped'),
  unresolved: $t('page.assetManage.repairRecord.resultType.unresolved')
};

const resultTagType: Record<Api.Asset.RepairRecord['repairResult'], UI.ThemeColor> = {
  fixed: 'success',
  replace_repair: 'primary',
  scrapped: 'danger',
  unresolved: 'warning'
};

const searchParams = ref(getInitSearchParams());

function getInitSearchParams(): Api.Asset.RepairRecordSearchParams {
  return {
    current: 1,
    size: 10,
    repairResult: undefined,
    startDate: undefined,
    endDate: undefined
  };
}

const { columns, data, getData, getDataByPage, loading, mobilePagination } = useUIPaginatedTable({
  paginationProps: {
    currentPage: searchParams.value.current,
    pageSize: searchParams.value.size
  },
  api: () => fetchGetRepairRecordList(searchParams.value),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.value.current = params.currentPage;
    searchParams.value.size = params.pageSize;
  },
  columns: () => [
    { prop: 'ticketNo', label: $t('page.assetManage.repairRecord.ticketNo'), minWidth: 160 },
    { prop: 'assetNo', label: $t('page.assetManage.repairRecord.assetNo'), minWidth: 140 },
    { prop: 'assetName', label: $t('page.assetManage.repairRecord.assetName'), minWidth: 140 },
    { prop: 'repairUserName', label: $t('page.assetManage.repairRecord.repairUser'), width: 100 },
    { prop: 'faultReason', label: $t('page.assetManage.repairRecord.faultReason'), minWidth: 160 },
    {
      prop: 'repairResult',
      label: $t('page.assetManage.repairRecord.repairResult'),
      width: 130,
      formatter: row => <ElTag type={resultTagType[row.repairResult]}>{resultLabel[row.repairResult]}</ElTag>
    },
    { prop: 'repairCost', label: $t('page.assetManage.repairRecord.repairCost'), width: 100 },
    { prop: 'repairedAt', label: $t('page.assetManage.repairRecord.repairedAt'), width: 160 },
    {
      prop: 'operate',
      label: $t('common.operate'),
      align: 'center',
      width: 100,
      formatter: row => (
        <ElButton v-permission="repair_record:update" type="primary" plain size="small" onClick={() => edit(row)}>
          {$t('common.edit')}
        </ElButton>
      )
    }
  ]
});

const drawerVisible = shallowRef(false);
const editingData = shallowRef<Api.Asset.RepairRecord | null>(null);

function edit(row: Api.Asset.RepairRecord) {
  editingData.value = row;
  drawerVisible.value = true;
}

function resetSearchParams() {
  searchParams.value = getInitSearchParams();
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <RepairRecordSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <ElCard class="card-wrapper sm:flex-1-hidden">
      <template #header>
        <div class="flex items-center justify-between">
          <p>{{ $t('page.assetManage.repairRecord.title') }}</p>
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
      <RepairRecordOperateDrawer v-model:visible="drawerVisible" :row-data="editingData" @submitted="getDataByPage" />
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
