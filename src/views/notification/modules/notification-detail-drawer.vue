<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';

defineOptions({ name: 'NotificationDetailDrawer' });

interface Props {
  rowData?: Api.Notification.NotificationItem | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'markRead', id: number): void;
  (e: 'jump', row: Api.Notification.NotificationItem): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const bizTypeLabel: Record<Api.Notification.BizType, string> = {
  ticket: $t('page.notification.bizTypeType.ticket'),
  asset: $t('page.notification.bizTypeType.asset'),
  sla: $t('page.notification.bizTypeType.sla'),
  system: $t('page.notification.bizTypeType.system')
};

const isUnread = computed(() => props.rowData?.readStatus === 0);

/** ticket/sla jump to the ticket detail route; asset jumps to the asset list (no dedicated asset detail route exists yet); system never jumps */
const canJump = computed(() => Boolean(props.rowData?.bizId) && props.rowData?.bizType !== 'system');

function closeDrawer() {
  visible.value = false;
}

function handleMarkRead() {
  if (props.rowData) {
    emit('markRead', props.rowData.id);
  }
}

function handleJump() {
  if (props.rowData) {
    emit('jump', props.rowData);
  }
}
</script>

<template>
  <ElDrawer v-model="visible" :title="$t('page.notification.detail')" :size="420">
    <ElDescriptions v-if="rowData" :column="1" :label-width="80" border>
      <ElDescriptionsItem :label="$t('page.notification.notificationTitle')">{{ rowData.title }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('page.notification.content')">{{ rowData.content }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('page.notification.bizType')">
        {{ bizTypeLabel[rowData.bizType] }}
      </ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('page.notification.bizId')">{{ rowData.bizId ?? '-' }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('page.notification.readStatus')">
        <ElTag :type="rowData.readStatus === 1 ? 'success' : 'warning'">
          {{
            rowData.readStatus === 1
              ? $t('page.notification.readStatusType.read')
              : $t('page.notification.readStatusType.unread')
          }}
        </ElTag>
      </ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('common.createTime')">{{ rowData.createTime }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('page.notification.readAt')">{{ rowData.readAt ?? '-' }}</ElDescriptionsItem>
    </ElDescriptions>
    <template #footer>
      <ElSpace :size="16">
        <ElButton @click="closeDrawer">{{ $t('common.close') }}</ElButton>
        <ElButton v-if="canJump" @click="handleJump">{{ $t('page.notification.goToBusiness') }}</ElButton>
        <ElButton v-if="isUnread" type="primary" @click="handleMarkRead">
          {{ $t('page.notification.markRead') }}
        </ElButton>
      </ElSpace>
    </template>
  </ElDrawer>
</template>

<style scoped></style>
