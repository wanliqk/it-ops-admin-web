<script setup lang="tsx">
import { ref } from 'vue';
import { fetchGetOperationLogList } from '@/service/api';
import { defaultTransform, useUIPaginatedTable } from '@/hooks/common/table';
import { $t } from '@/locales';
import OperationLogSearch from './modules/operation-log-search.vue';

defineOptions({ name: 'OperationLogManage' });

const searchParams = ref(getInitSearchParams());

function getInitSearchParams(): Api.OperationLog.OperationLogSearchParams {
  return {
    current: 1,
    size: 10,
    moduleName: undefined,
    operationResult: undefined,
    startDate: undefined,
    endDate: undefined
  };
}

const { columns, data, getData, getDataByPage, loading, mobilePagination } = useUIPaginatedTable({
  paginationProps: {
    currentPage: searchParams.value.current,
    pageSize: searchParams.value.size
  },
  api: () => fetchGetOperationLogList(searchParams.value),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.value.current = params.currentPage;
    searchParams.value.size = params.pageSize;
  },
  columns: () => [
    { prop: 'realName', label: $t('page.manage.operationLog.userName'), width: 100 },
    { prop: 'moduleName', label: $t('page.manage.operationLog.moduleName'), width: 120 },
    { prop: 'requestMethod', label: $t('page.manage.operationLog.requestMethod'), width: 90 },
    { prop: 'requestUrl', label: $t('page.manage.operationLog.requestUrl'), minWidth: 200 },
    { prop: 'requestIp', label: $t('page.manage.operationLog.requestIp'), width: 130 },
    {
      prop: 'operationResult',
      label: $t('page.manage.operationLog.operationResult'),
      width: 100,
      formatter: row => (
        <ElTag type={row.operationResult === 'success' ? 'success' : 'danger'}>
          {row.operationResult === 'success'
            ? $t('page.manage.operationLog.result.success')
            : $t('page.manage.operationLog.result.fail')}
        </ElTag>
      )
    },
    { prop: 'createTime', label: $t('page.manage.operationLog.createTime'), width: 160 }
  ]
});

function resetSearchParams() {
  searchParams.value = getInitSearchParams();
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <OperationLogSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <ElCard class="card-wrapper sm:flex-1-hidden">
      <template #header>
        <div class="flex items-center justify-between">
          <p>{{ $t('page.manage.operationLog.title') }}</p>
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
