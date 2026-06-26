<script setup lang="tsx">
import { ref, shallowRef } from 'vue';
import { fetchDeleteWorkGroup, fetchGetWorkGroupList } from '@/service/api';
import { defaultTransform, useTableOperate, useUIPaginatedTable } from '@/hooks/common/table';
import { $t } from '@/locales';
import WorkGroupMemberDrawer from './modules/work-group-member-drawer.vue';
import WorkGroupOperateDrawer from './modules/work-group-operate-drawer.vue';
import WorkGroupSearch from './modules/work-group-search.vue';

defineOptions({ name: 'WorkGroupManage' });

const searchParams = ref(getInitSearchParams());

function getInitSearchParams(): Api.WorkGroup.WorkGroupSearchParams {
  return {
    current: 1,
    size: 10,
    keyword: undefined,
    status: undefined
  };
}

const { columns, data, getData, getDataByPage, loading, mobilePagination } = useUIPaginatedTable({
  paginationProps: {
    currentPage: searchParams.value.current,
    pageSize: searchParams.value.size
  },
  api: () => fetchGetWorkGroupList(searchParams.value),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.value.current = params.currentPage;
    searchParams.value.size = params.pageSize;
  },
  columns: () => [
    { prop: 'groupName', label: $t('page.manage.workGroup.groupName'), minWidth: 140 },
    { prop: 'groupCode', label: $t('page.manage.workGroup.groupCode'), width: 130 },
    {
      prop: 'leaderName',
      label: $t('page.manage.workGroup.leader'),
      width: 100,
      formatter: row => row.leaderName ?? '-'
    },
    { prop: 'memberCount', label: $t('page.manage.workGroup.memberCount'), width: 100 },
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
    { prop: 'sortOrder', label: $t('page.manage.workGroup.sortOrder'), width: 90 },
    { prop: 'createTime', label: $t('common.createTime'), width: 160 },
    { prop: 'updateTime', label: $t('page.manage.workGroup.updateTime'), width: 160 },
    {
      prop: 'operate',
      label: $t('common.operate'),
      align: 'center',
      width: 240,
      formatter: row => (
        <div class="flex-center gap-8px">
          <ElButton v-permission="work_group:update" type="primary" plain size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </ElButton>
          <ElButton v-permission="work_group:member:list" plain size="small" onClick={() => openMembers(row)}>
            {$t('page.manage.workGroup.memberManage')}
          </ElButton>
          <ElPopconfirm title={$t('page.manage.workGroup.confirmDelete')} onConfirm={() => handleDelete(row.id)}>
            {{
              reference: () => (
                <ElButton v-permission="work_group:delete" type="danger" plain size="small">
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
  const { error } = await fetchDeleteWorkGroup(id);

  if (!error) {
    window.$message?.success($t('common.deleteSuccess'));
    await getData();
  }
}

const memberDrawerVisible = shallowRef(false);
const memberGroupId = shallowRef<number | null>(null);
const memberGroupName = shallowRef('');

function openMembers(row: Api.WorkGroup.WorkGroup) {
  memberGroupId.value = row.id;
  memberGroupName.value = row.groupName;
  memberDrawerVisible.value = true;
}

function resetSearchParams() {
  searchParams.value = getInitSearchParams();
  getData();
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <WorkGroupSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <ElCard class="card-wrapper sm:flex-1-hidden">
      <template #header>
        <div class="flex items-center justify-between">
          <p>{{ $t('page.manage.workGroup.title') }}</p>
          <ElSpace>
            <ElButton v-permission="'work_group:create'" type="primary" plain @click="handleAdd">
              <template #icon>
                <icon-ic-round-plus class="text-icon" />
              </template>
              {{ $t('page.manage.workGroup.addGroup') }}
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
      <WorkGroupOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
      <WorkGroupMemberDrawer
        v-if="memberGroupId !== null"
        v-model:visible="memberDrawerVisible"
        :group-id="memberGroupId"
        :group-name="memberGroupName"
        @member-changed="getData"
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
