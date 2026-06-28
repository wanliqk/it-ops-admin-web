<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useNotificationPanel } from '@/hooks/business/notification';
import { $t } from '@/locales';

defineOptions({ name: 'NotificationButton' });

const bizTypeLabel: Record<Api.Notification.BizType, string> = {
  ticket: $t('page.notification.bizTypeType.ticket'),
  asset: $t('page.notification.bizTypeType.asset'),
  sla: $t('page.notification.bizTypeType.sla'),
  system: $t('page.notification.bizTypeType.system')
};

const {
  activeTab,
  list,
  unreadTotal,
  detail,
  dialogVisible,
  loadList,
  loadUnreadTotal,
  handleTabChange,
  read,
  readAll,
  goMore
} = useNotificationPanel();

const dropdownRef = ref<InstanceType<typeof ElDropdown>>();

onMounted(() => {
  loadList();
  loadUnreadTotal();
});

async function handleRead(id: number) {
  dropdownRef.value?.handleClose();
  await read(id);
}

function handleGoMore() {
  dropdownRef.value?.handleClose();
  goMore();
}
</script>

<template>
  <ElDropdown ref="dropdownRef" trigger="click">
    <ElBadge :value="unreadTotal" :hidden="unreadTotal === 0" :max="99">
      <ButtonIcon icon="mdi:bell-outline" :tooltip-content="$t('icon.notification')" />
    </ElBadge>
    <template #dropdown>
      <div class="w-380px p-12px">
        <ElTabs v-model="activeTab" stretch @tab-change="handleTabChange">
          <ElTabPane :label="$t('page.notification.readStatusType.unread')" name="unread" />
          <ElTabPane :label="$t('page.notification.readStatusType.read')" name="read" />
        </ElTabs>

        <template v-if="list.length > 0">
          <div v-for="item in list" :key="item.id" class="flex-y-center gap-8px py-6px">
            <ElTag size="small">{{ bizTypeLabel[item.bizType] }}</ElTag>
            <ElText
              size="small"
              truncated
              class="flex-1 cursor-pointer !mx-2px"
              :class="{ 'font-bold': item.readStatus === 0 }"
              @click="handleRead(item.id)"
            >
              {{ item.title }}
            </ElText>
            <span class="text-placeholder flex-shrink-0 text-12px">{{ item.createTime }}</span>
          </div>
        </template>
        <template v-else>
          <div class="h-150px flex-center">
            <ElEmpty
              :image-size="50"
              :description="
                activeTab === 'unread' ? $t('page.notification.emptyUnread') : $t('page.notification.emptyRead')
              "
            />
          </div>
        </template>

        <ElDivider class="my-8px" />
        <div class="flex items-center justify-between">
          <ElLink type="primary" :underline="false" @click="handleGoMore">
            <span class="text-12px">{{ $t('page.notification.viewMore') }}</span>
            <SvgIcon icon="mdi:chevron-right" class="text-12px" />
          </ElLink>
          <ElLink v-if="activeTab === 'unread' && list.length > 0" type="primary" :underline="false" @click="readAll">
            <span class="text-12px">{{ $t('page.notification.readAll') }}</span>
          </ElLink>
        </div>
      </div>
    </template>
  </ElDropdown>

  <ElDialog
    v-model="dialogVisible"
    :title="detail?.title ?? $t('page.notification.detail')"
    width="800px"
    append-to-body
  >
    <div v-if="detail" class="px-20px">
      <div class="text-placeholder mb-16px flex items-center gap-16px text-13px">
        <span class="flex-y-center gap-4px">
          <SvgIcon icon="mdi:tag-outline" />
          {{ bizTypeLabel[detail.bizType] }}
        </span>
        <span class="flex-y-center gap-4px">
          <SvgIcon icon="mdi:clock-outline" />
          {{ detail.createTime }}
        </span>
      </div>
      <ElDivider class="my-0" />
      <div class="mt-16px max-h-60vh overflow-y-auto whitespace-pre-wrap">{{ detail.content }}</div>
    </div>
  </ElDialog>
</template>

<style scoped></style>
