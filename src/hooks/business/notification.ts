import { computed, ref } from 'vue';
import { fetchNotificationList, fetchReadAllNotifications, fetchReadNotification } from '@/service/api';
import { useNotificationStore } from '@/store/modules/notification';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';

/** how many recent notifications to show in the header dropdown panel */
const PANEL_LIST_SIZE = 5;

export type NotificationPanelTab = 'unread' | 'read';

/** drives the header notification bell: unread/read tabs, unread badge, mark-as-read and the detail dialog */
export function useNotificationPanel() {
  const notificationStore = useNotificationStore();
  const { routerPushByKey } = useRouterPush();

  const activeTab = ref<NotificationPanelTab>('unread');
  const list = ref<Api.Notification.NotificationItem[]>([]);
  const detail = ref<Api.Notification.NotificationItem | null>(null);
  const dialogVisible = ref(false);

  const unreadTotal = computed(() => notificationStore.unreadCount);

  async function loadList() {
    const readStatus: Api.Notification.ReadStatus = activeTab.value === 'unread' ? 0 : 1;

    const { error, data } = await fetchNotificationList({ current: 1, size: PANEL_LIST_SIZE, readStatus });

    if (!error && data) {
      list.value = data.records;
    }
  }

  async function loadUnreadTotal() {
    await notificationStore.fetchUnreadCount();
  }

  function handleTabChange() {
    loadList();
  }

  /**
   * open the detail dialog for a notification. on the unread tab (or for an unread item), this marks it read
   * via the read endpoint, which also returns the full record — so a separate detail fetch isn't needed. on
   * the read tab the item already carries its full content from the list response, so no extra request is made
   */
  async function read(id: number | string) {
    const item = list.value.find(notification => notification.id === id);

    if (!item) return;

    if (activeTab.value === 'unread' || item.readStatus === 0) {
      const { error, data } = await fetchReadNotification(Number(id));
      detail.value = !error && data ? data : item;
      dialogVisible.value = true;

      await Promise.all([loadUnreadTotal(), loadList()]);
    } else {
      detail.value = item;
      dialogVisible.value = true;
    }
  }

  async function readAll() {
    const { error } = await fetchReadAllNotifications();

    if (!error) {
      window.$message?.success($t('common.modifySuccess'));
      await Promise.all([loadUnreadTotal(), loadList()]);
    }
  }

  function goMore() {
    routerPushByKey('notification');
  }

  return {
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
  };
}
