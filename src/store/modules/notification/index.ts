import { ref } from 'vue';
import { defineStore } from 'pinia';
import { fetchNotificationUnreadCount } from '@/service/api';
import { SetupStoreId } from '@/enum';

export const useNotificationStore = defineStore(SetupStoreId.Notification, () => {
  const unreadCount = ref(0);

  async function fetchUnreadCount() {
    const { data, error } = await fetchNotificationUnreadCount();

    if (!error && data !== null) {
      unreadCount.value = data;
    }
  }

  return {
    unreadCount,
    fetchUnreadCount
  };
});
