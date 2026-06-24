<script setup lang="ts">
import { onMounted } from 'vue';
import { useNotificationStore } from '@/store/modules/notification';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';

defineOptions({ name: 'NotificationButton' });

const notificationStore = useNotificationStore();
const { routerPushByKey } = useRouterPush();

onMounted(() => {
  notificationStore.fetchUnreadCount();
});

function goToNotificationCenter() {
  routerPushByKey('notification');
}
</script>

<template>
  <ElBadge :value="notificationStore.unreadCount" :hidden="notificationStore.unreadCount === 0" :max="99">
    <ButtonIcon icon="mdi:bell-outline" :tooltip-content="$t('icon.notification')" @click="goToNotificationCenter" />
  </ElBadge>
</template>

<style scoped></style>
