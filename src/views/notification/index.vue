<script setup lang="tsx">
import { ref, shallowRef } from 'vue';
import {
  fetchDeleteNotification,
  fetchDeleteNotificationBatch,
  fetchNotificationList,
  fetchReadAllNotifications,
  fetchReadNotification,
  fetchReadNotificationBatch
} from '@/service/api';
import { useNotificationStore } from '@/store/modules/notification';
import { defaultTransform, useUIPaginatedTable } from '@/hooks/common/table';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';
import NotificationDetailDrawer from './modules/notification-detail-drawer.vue';
import NotificationSearch from './modules/notification-search.vue';

defineOptions({ name: 'NotificationManage' });

const notificationStore = useNotificationStore();
const { routerPushByKey } = useRouterPush();

const bizTypeLabel: Record<Api.Notification.BizType, string> = {
  ticket: $t('page.notification.bizTypeType.ticket'),
  asset: $t('page.notification.bizTypeType.asset'),
  sla: $t('page.notification.bizTypeType.sla'),
  system: $t('page.notification.bizTypeType.system')
};

const searchParams = ref(getInitSearchParams());

function getInitSearchParams(): Api.Notification.NotificationSearchParams {
  return {
    current: 1,
    size: 10,
    keyword: undefined,
    readStatus: undefined,
    bizType: undefined
  };
}

const { columns, data, getData, getDataByPage, loading, mobilePagination } = useUIPaginatedTable({
  paginationProps: {
    currentPage: searchParams.value.current,
    pageSize: searchParams.value.size
  },
  api: () => fetchNotificationList(searchParams.value),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.value.current = params.currentPage;
    searchParams.value.size = params.pageSize;
  },
  columns: () => [
    { prop: 'selection', type: 'selection', width: 48 },
    {
      prop: 'title',
      label: $t('page.notification.notificationTitle'),
      minWidth: 160,
      showOverflowTooltip: true,
      formatter: row => <span class={row.readStatus === 0 ? 'font-bold' : ''}>{row.title}</span>
    },
    { prop: 'content', label: $t('page.notification.content'), minWidth: 220, showOverflowTooltip: true },
    {
      prop: 'bizType',
      label: $t('page.notification.bizType'),
      width: 110,
      formatter: row => <ElTag>{bizTypeLabel[row.bizType]}</ElTag>
    },
    {
      prop: 'readStatus',
      label: $t('page.notification.readStatus'),
      width: 90,
      formatter: row => (
        <ElTag type={row.readStatus === 1 ? 'success' : 'warning'}>
          {row.readStatus === 1
            ? $t('page.notification.readStatusType.read')
            : $t('page.notification.readStatusType.unread')}
        </ElTag>
      )
    },
    { prop: 'createTime', label: $t('common.createTime'), width: 160 },
    { prop: 'readAt', label: $t('page.notification.readAt'), width: 160, formatter: row => row.readAt ?? '-' },
    {
      prop: 'operate',
      label: $t('common.operate'),
      align: 'center',
      width: 220,
      formatter: row => (
        <div class="flex-center gap-8px">
          <ElButton plain size="small" onClick={() => viewDetail(row)}>
            {$t('common.detail')}
          </ElButton>
          {row.readStatus === 0 && (
            <ElButton type="primary" plain size="small" onClick={() => handleMarkRead(row.id)}>
              {$t('page.notification.markRead')}
            </ElButton>
          )}
          <ElPopconfirm title={$t('common.confirmDelete')} onConfirm={() => handleDelete(row.id)}>
            {{
              reference: () => (
                <ElButton type="danger" plain size="small">
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

const checkedRowKeys = shallowRef<number[]>([]);

function handleSelectionChange(rows: Api.Notification.NotificationItem[]) {
  checkedRowKeys.value = rows.map(row => row.id);
}

/**
 * if the current page becomes empty after a delete and it's not the first page, back up one page; otherwise
 * just reload the current page
 */
async function reloadAfterDelete() {
  const isLastRowOnPage = data.value.length <= 1;
  const currentPage = searchParams.value.current ?? 1;

  if (isLastRowOnPage && currentPage > 1) {
    searchParams.value.current = currentPage - 1;
    await getDataByPage(searchParams.value.current);
  } else {
    await getData();
  }
}

const detailVisible = shallowRef(false);
const detailData = shallowRef<Api.Notification.NotificationItem | null>(null);

function viewDetail(row: Api.Notification.NotificationItem) {
  detailData.value = row;
  detailVisible.value = true;
}

async function handleMarkRead(id: number) {
  const { error } = await fetchReadNotification(id);

  if (!error) {
    window.$message?.success($t('common.modifySuccess'));
    await getData();
    await notificationStore.fetchUnreadCount();
  }
}

async function handleDelete(id: number) {
  const { error } = await fetchDeleteNotification(id);

  if (!error) {
    window.$message?.success($t('common.deleteSuccess'));
    await reloadAfterDelete();
    await notificationStore.fetchUnreadCount();
  }
}

async function handleBatchMarkRead() {
  if (checkedRowKeys.value.length === 0) {
    window.$message?.warning($t('page.notification.pleaseSelect'));
    return;
  }

  const { error } = await fetchReadNotificationBatch(checkedRowKeys.value);

  if (!error) {
    window.$message?.success($t('common.modifySuccess'));
    checkedRowKeys.value = [];
    await getData();
    await notificationStore.fetchUnreadCount();
  }
}

async function handleBatchDelete() {
  if (checkedRowKeys.value.length === 0) {
    window.$message?.warning($t('page.notification.pleaseSelect'));
    return;
  }

  const { error } = await fetchDeleteNotificationBatch(checkedRowKeys.value);

  if (!error) {
    window.$message?.success($t('common.deleteSuccess'));
    checkedRowKeys.value = [];
    await getData();
    await notificationStore.fetchUnreadCount();
  }
}

async function handleReadAll() {
  const { error } = await fetchReadAllNotifications();

  if (!error) {
    window.$message?.success($t('common.modifySuccess'));
    await getData();
    await notificationStore.fetchUnreadCount();
  }
}

function handleJump(row: Api.Notification.NotificationItem) {
  if (row.bizId === null) return;

  if (row.bizType === 'ticket' || row.bizType === 'sla') {
    routerPushByKey('ticket-detail', { params: { id: String(row.bizId) } });
    return;
  }

  if (row.bizType === 'asset') {
    routerPushByKey('asset-manage_asset');
  }
}

async function resetSearchParams() {
  searchParams.value = getInitSearchParams();
  await getData();
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NotificationSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <ElCard class="card-wrapper sm:flex-1-hidden">
      <template #header>
        <div class="flex items-center justify-between">
          <p>{{ $t('page.notification.title') }}</p>
          <ElSpace>
            <ElButton @click="handleBatchMarkRead">{{ $t('page.notification.batchMarkRead') }}</ElButton>
            <ElPopconfirm :title="$t('common.confirmDelete')" @confirm="handleBatchDelete">
              <template #reference>
                <ElButton type="danger" plain>{{ $t('common.batchDelete') }}</ElButton>
              </template>
            </ElPopconfirm>
            <ElButton type="primary" plain @click="handleReadAll">{{ $t('page.notification.readAll') }}</ElButton>
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
      <NotificationDetailDrawer
        v-model:visible="detailVisible"
        :row-data="detailData"
        @mark-read="handleMarkRead"
        @jump="handleJump"
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
