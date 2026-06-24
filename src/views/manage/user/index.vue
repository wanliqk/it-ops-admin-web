<script setup lang="tsx">
import { ref } from 'vue';
import {
  fetchBatchDeleteUsers,
  fetchDeleteUser,
  fetchGetAdminUserList,
  fetchResetUserPassword,
  fetchUpdateUserStatus
} from '@/service/api';
import { defaultTransform, useTableOperate, useUIPaginatedTable } from '@/hooks/common/table';
import { $t } from '@/locales';
import UserOperateDrawer from './modules/user-operate-drawer.vue';
import UserSearch from './modules/user-search.vue';

defineOptions({ name: 'UserManage' });

const roleTypeLabel: Record<Api.Admin.UserRole, string> = {
  admin: $t('page.manage.user.roleType.admin'),
  it_staff: $t('page.manage.user.roleType.itStaff'),
  employee: $t('page.manage.user.roleType.employee')
};

const searchParams = ref(getInitSearchParams());

function getInitSearchParams(): Api.Admin.UserSearchParams {
  return {
    current: 1,
    size: 30,
    status: undefined,
    role: undefined,
    department: undefined,
    keyword: undefined
  };
}

const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination } = useUIPaginatedTable({
  paginationProps: {
    currentPage: searchParams.value.current,
    pageSize: searchParams.value.size
  },
  api: () => fetchGetAdminUserList(searchParams.value),
  transform: response => {
    return defaultTransform(response);
  },
  onPaginationParamsChange: params => {
    searchParams.value.current = params.currentPage;
    searchParams.value.size = params.pageSize;
  },
  columns: () => [
    { prop: 'selection', type: 'selection', width: 48 },
    { prop: 'index', type: 'index', label: $t('common.index'), width: 64 },
    { prop: 'userName', label: $t('page.manage.user.userName'), minWidth: 100 },
    { prop: 'realName', label: $t('page.manage.user.realName'), minWidth: 100 },
    {
      prop: 'role',
      label: $t('page.manage.user.userRole'),
      width: 100,
      formatter: row => <ElTag>{roleTypeLabel[row.role]}</ElTag>
    },
    { prop: 'department', label: $t('page.manage.user.department'), minWidth: 100 },
    { prop: 'phone', label: $t('page.manage.user.userPhone'), width: 120 },
    { prop: 'email', label: $t('page.manage.user.userEmail'), minWidth: 180 },
    {
      prop: 'status',
      label: $t('page.manage.user.userStatus'),
      align: 'center',
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
      width: 320,
      formatter: row => (
        <div class="flex-center gap-8px">
          <ElButton v-permission="user:update" type="primary" plain size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </ElButton>
          <ElPopconfirm
            title={`${$t('common.confirm')}${row.status === 1 ? $t('page.manage.common.status.disable') : $t('page.manage.common.status.enable')}?`}
            onConfirm={() => handleToggleStatus(row)}
          >
            {{
              reference: () => (
                <ElButton v-permission="user:status" plain size="small">
                  {row.status === 1 ? $t('page.manage.common.status.disable') : $t('page.manage.common.status.enable')}
                </ElButton>
              )
            }}
          </ElPopconfirm>
          <ElPopconfirm
            title={`${$t('common.confirm')}${$t('page.manage.user.resetPassword')}?`}
            onConfirm={() => handleResetPassword(row.id)}
          >
            {{
              reference: () => (
                <ElButton v-permission="user:reset_password" plain size="small">
                  {$t('page.manage.user.resetPassword')}
                </ElButton>
              )
            }}
          </ElPopconfirm>
          <ElPopconfirm title={$t('common.confirmDelete')} onConfirm={() => handleDelete(row.id)}>
            {{
              reference: () => (
                <ElButton v-permission="user:delete" type="danger" plain size="small">
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

const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  onDeleted
  // closeDrawer
} = useTableOperate(data, 'id', getData);

async function handleBatchDelete() {
  const ids = checkedRowKeys.value.map(Number);
  const { data: result, error } = await fetchBatchDeleteUsers(ids);

  if (error || !result) return;

  checkedRowKeys.value = [];
  await getData();

  if (result.failedItems.length === 0) {
    window.$message?.success($t('common.deleteSuccess'));
    return;
  }

  const reasons = result.failedItems.map(item => `#${item.id} ${item.reason}`).join('；');
  window.$message?.warning(
    `${$t('page.manage.user.batchDeleteResult', { success: result.deletedCount, fail: result.failedItems.length })}：${reasons}`
  );
}

async function handleDelete(id: number) {
  const { error } = await fetchDeleteUser(id);

  if (!error) {
    onDeleted();
  }
}

function handleSelectionChange(rows: Api.Admin.User[]) {
  checkedRowKeys.value = rows.map(row => String(row.id));
}

async function handleToggleStatus(row: Api.Admin.User) {
  const nextStatus = row.status === 1 ? 0 : 1;
  const { error } = await fetchUpdateUserStatus(row.id, nextStatus);

  if (!error) {
    window.$message?.success($t('common.modifySuccess'));
    await getData();
  }
}

async function handleResetPassword(id: number) {
  const { error } = await fetchResetUserPassword(id, '123456');

  if (!error) {
    window.$message?.success($t('common.modifySuccess'));
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
    <UserSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <ElCard class="card-wrapper sm:flex-1-hidden">
      <template #header>
        <div class="flex items-center justify-between">
          <p>{{ $t('page.manage.user.title') }}</p>
          <TableHeaderOperation
            v-model:columns="columnChecks"
            :disabled-delete="checkedRowKeys.length === 0"
            :loading="loading"
            @add="handleAdd"
            @delete="handleBatchDelete"
            @refresh="getData"
          />
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
          @selection-change="handleSelectionChange"
        >
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
      <UserOperateDrawer
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
