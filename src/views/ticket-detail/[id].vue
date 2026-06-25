<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue';
import { getAssignTypeLabel } from '@/constants/ticket-assignment';
import {
  fetchAutoAssignTicket,
  fetchDeleteTicket,
  fetchGetAssetCategoryList,
  fetchGetTicketDetail,
  fetchGetTicketRecords,
  fetchStartTicket
} from '@/service/api';
import { useAuthStore } from '@/store/modules/auth';
import { useRouterPush } from '@/hooks/common/router';
import { useAuth } from '@/hooks/business/auth';
import { $t } from '@/locales';
import TicketAssignDialog from './modules/ticket-assign-dialog.vue';
import TicketCancelDialog from './modules/ticket-cancel-dialog.vue';
import TicketCompleteDialog from './modules/ticket-complete-dialog.vue';
import TicketEditDialog from './modules/ticket-edit-dialog.vue';

interface Props {
  id: string;
}

const props = defineProps<Props>();

defineOptions({ name: 'TicketDetail' });

const authStore = useAuthStore();
const { hasAuth } = useAuth();
const { routerBack } = useRouterPush();

const ticketId = computed(() => Number(props.id));

const detail = shallowRef<Api.Ticket.TicketDetail | null>(null);
const records = shallowRef<Api.Ticket.TicketRecord[]>([]);
const loading = ref(false);
const categoryLabel = ref<Record<number, string>>({});

async function loadDetail() {
  loading.value = true;
  const [detailRes, recordsRes] = await Promise.all([
    fetchGetTicketDetail(ticketId.value),
    fetchGetTicketRecords(ticketId.value)
  ]);
  loading.value = false;

  if (!detailRes.error) {
    detail.value = detailRes.data;
  }

  if (!recordsRes.error) {
    records.value = recordsRes.data;
  }
}

async function loadCategoryOptions() {
  const { data, error } = await fetchGetAssetCategoryList();

  if (!error) {
    categoryLabel.value = Object.fromEntries(data.map(item => [item.id, item.categoryName]));
  }
}

onMounted(() => {
  loadDetail();
  loadCategoryOptions();
});

const statusLabel: Record<Api.Ticket.TicketStatus, string> = {
  pending_accept: $t('page.ticket.statusType.pendingAccept'),
  pending: $t('page.ticket.statusType.pending'),
  assigned: $t('page.ticket.statusType.assigned'),
  processing: $t('page.ticket.statusType.processing'),
  pending_confirm: $t('page.ticket.statusType.pendingConfirm'),
  completed: $t('page.ticket.statusType.completed'),
  closed: $t('page.ticket.statusType.closed'),
  cancelled: $t('page.ticket.statusType.cancelled')
};

const statusTagType: Record<Api.Ticket.TicketStatus, UI.ThemeColor> = {
  pending_accept: 'info',
  pending: 'info',
  assigned: 'primary',
  processing: 'warning',
  pending_confirm: 'warning',
  completed: 'success',
  closed: 'success',
  cancelled: 'danger'
};

const assignTypeLabel = getAssignTypeLabel();

const categoryName = computed(() => {
  if (!detail.value || detail.value.categoryId === null) return '-';
  return categoryLabel.value[detail.value.categoryId] ?? '-';
});

const priorityLabel: Record<Api.Ticket.TicketPriority, string> = {
  low: $t('page.ticket.priorityType.low'),
  normal: $t('page.ticket.priorityType.normal'),
  high: $t('page.ticket.priorityType.high'),
  urgent: $t('page.ticket.priorityType.urgent')
};

const faultTypeLabel: Record<Api.Ticket.FaultType, string> = {
  hardware: $t('page.ticket.faultTypeType.hardware'),
  software: $t('page.ticket.faultTypeType.software'),
  network: $t('page.ticket.faultTypeType.network'),
  printer: $t('page.ticket.faultTypeType.printer'),
  account: $t('page.ticket.faultTypeType.account'),
  other: $t('page.ticket.faultTypeType.other')
};

const recordActionLabel: Record<string, string> = {
  create: $t('page.ticket.record.create'),
  assign: $t('page.ticket.record.assign'),
  start: $t('page.ticket.record.start'),
  finish: $t('page.ticket.record.finish'),
  cancel: $t('page.ticket.record.cancel')
};

/** response_overdue takes precedence (it's only ever 1 while first_response_at is still null) */
const responseStatus = computed(() => {
  if (detail.value?.responseOverdue === 1) {
    return { label: $t('page.ticket.responseStatusType.overdue'), type: 'danger' as UI.ThemeColor };
  }

  if (detail.value?.firstResponseAt) {
    return { label: $t('page.ticket.responseStatusType.responded'), type: 'success' as UI.ThemeColor };
  }

  return { label: $t('page.ticket.responseStatusType.unresponded'), type: 'warning' as UI.ThemeColor };
});

/** resolve_overdue takes precedence (it's only ever 1 while resolved_at is still null) */
const resolveStatus = computed(() => {
  if (detail.value?.resolveOverdue === 1) {
    return { label: $t('page.ticket.resolveStatusType.overdue'), type: 'danger' as UI.ThemeColor };
  }

  if (detail.value?.resolvedAt) {
    return { label: $t('page.ticket.resolveStatusType.resolved'), type: 'success' as UI.ThemeColor };
  }

  return { label: $t('page.ticket.resolveStatusType.unresolved'), type: 'warning' as UI.ThemeColor };
});

const isAdmin = computed(() => authStore.userInfo.roles.includes('admin'));

const isPendingStatus = (status?: Api.Ticket.TicketStatus) => status === 'pending_accept' || status === 'pending';

const canEdit = computed(
  () => Boolean(detail.value) && hasAuth('ticket:update') && (isPendingStatus(detail.value!.status) || isAdmin.value)
);

const canAssign = computed(() => isPendingStatus(detail.value?.status) && hasAuth('ticket:assign'));
const canStart = computed(() => detail.value?.status === 'assigned' && hasAuth('ticket:start'));
const canComplete = computed(() => detail.value?.status === 'processing' && hasAuth('ticket:complete'));
const canCancel = computed(
  () => (isPendingStatus(detail.value?.status) || detail.value?.status === 'assigned') && hasAuth('ticket:cancel')
);
const canDelete = computed(
  () => (isPendingStatus(detail.value?.status) || detail.value?.status === 'cancelled') && hasAuth('ticket:delete')
);
const canAutoAssign = computed(
  () =>
    Boolean(detail.value) &&
    hasAuth('ticket:auto-assign') &&
    detail.value!.status !== 'completed' &&
    detail.value!.status !== 'closed' &&
    detail.value!.status !== 'cancelled'
);

const assignVisible = shallowRef(false);
const completeVisible = shallowRef(false);
const cancelVisible = shallowRef(false);
const editVisible = shallowRef(false);

async function handleStart() {
  if (!detail.value) return;

  const { error } = await fetchStartTicket(detail.value.id);

  if (!error) {
    window.$message?.success($t('common.modifySuccess'));
    await loadDetail();
  }
}

async function handleAutoAssign(force: boolean) {
  if (!detail.value) return;

  const { data, error } = await fetchAutoAssignTicket(detail.value.id, force);

  if (error || !data) return;

  if (data.success) {
    window.$message?.success(`${$t('page.ticket.autoAssignSuccess')}${data.assigneeName ?? ''}`);
  } else {
    window.$message?.warning(`${$t('page.ticket.autoAssignFail')}${data.failReason ?? ''}`);
  }

  await loadDetail();
}

async function handleDelete() {
  if (!detail.value) return;

  const { error } = await fetchDeleteTicket(detail.value.id);

  if (!error) {
    window.$message?.success($t('common.deleteSuccess'));
    routerBack();
  }
}
</script>

<template>
  <div v-loading="loading" class="min-h-500px flex-col-stretch gap-16px">
    <ElCard v-if="detail" class="card-wrapper">
      <template #header>
        <div class="flex items-center justify-between">
          <ElSpace>
            <span class="text-18px font-medium">{{ detail.title }}</span>
            <ElTag :type="statusTagType[detail.status]">{{ statusLabel[detail.status] }}</ElTag>
          </ElSpace>
          <ElButton @click="routerBack">{{ $t('common.backToHome') }}</ElButton>
        </div>
      </template>
      <ElDescriptions :column="2" border>
        <ElDescriptionsItem :label="$t('page.ticket.ticketNo')">{{ detail.ticketNo }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.ticket.faultType')">
          {{ faultTypeLabel[detail.faultType] }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.ticket.category')">{{ categoryName }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.ticket.priority')">
          {{ priorityLabel[detail.priority] }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('common.createTime')">{{ detail.createTime }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.ticket.reporter')">{{ detail.reporterName }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.ticket.handler')">{{ detail.handlerName }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.ticket.relatedAsset')" :span="2">
          <template v-if="detail.assetId">{{ detail.assetNo }} {{ detail.assetName }}</template>
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.ticket.description')" :span="2">
          {{ detail.description }}
        </ElDescriptionsItem>
        <ElDescriptionsItem v-if="detail.result" :label="$t('page.ticket.result')" :span="2">
          {{ detail.result }}
        </ElDescriptionsItem>
      </ElDescriptions>

      <ElSpace class="mt-16px">
        <ElButton v-if="canEdit" @click="editVisible = true">{{ $t('common.edit') }}</ElButton>
        <ElButton v-if="canAssign" type="primary" @click="assignVisible = true">
          {{ $t('page.ticket.action.assign') }}
        </ElButton>
        <ElPopconfirm v-if="canStart" :title="$t('common.confirm')" @confirm="handleStart">
          <template #reference>
            <ElButton type="primary">{{ $t('page.ticket.action.start') }}</ElButton>
          </template>
        </ElPopconfirm>
        <ElButton v-if="canComplete" type="success" @click="completeVisible = true">
          {{ $t('page.ticket.action.complete') }}
        </ElButton>
        <ElButton v-if="canCancel" type="warning" @click="cancelVisible = true">
          {{ $t('page.ticket.action.cancel') }}
        </ElButton>
        <ElButton v-if="canAutoAssign && !detail.assigneeId" type="success" @click="handleAutoAssign(false)">
          {{ $t('page.ticket.autoAssign') }}
        </ElButton>
        <ElPopconfirm
          v-if="canAutoAssign && detail.assigneeId"
          :title="$t('page.ticket.confirmReAutoAssign')"
          @confirm="handleAutoAssign(true)"
        >
          <template #reference>
            <ElButton type="warning">{{ $t('page.ticket.reAutoAssign') }}</ElButton>
          </template>
        </ElPopconfirm>
        <ElPopconfirm v-if="canDelete" :title="$t('common.confirmDelete')" @confirm="handleDelete">
          <template #reference>
            <ElButton type="danger">{{ $t('common.delete') }}</ElButton>
          </template>
        </ElPopconfirm>
      </ElSpace>
    </ElCard>

    <ElCard v-if="detail" class="card-wrapper">
      <template #header>{{ $t('page.ticket.assignmentInfo') }}</template>
      <ElDescriptions :column="2" border>
        <ElDescriptionsItem :label="$t('page.ticket.assignee')">
          {{ detail.assigneeName ?? $t('page.ticket.noAssignee') }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.ticket.assignType')">
          {{ detail.assignType ? assignTypeLabel[detail.assignType] : $t('page.ticket.assignTypeType.unassigned') }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.ticket.assignedAt')">{{ detail.assignedAt ?? '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.ticket.acceptedAt')">{{ detail.acceptedAt ?? '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.ticket.status')">
          <ElTag :type="statusTagType[detail.status]">{{ statusLabel[detail.status] }}</ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.ticket.slaResponseDeadline')">
          {{ detail.slaResponseDeadline ?? '-' }}
        </ElDescriptionsItem>
      </ElDescriptions>
      <ElAlert
        v-if="detail.status === 'assigned' && !detail.acceptedAt"
        class="mt-12px"
        type="info"
        :closable="false"
        :title="$t('page.ticket.assignedNotStarted')"
      />
      <ElAlert
        v-if="detail.status === 'pending_accept'"
        class="mt-12px"
        type="warning"
        :closable="false"
        :title="$t('page.ticket.pendingAcceptHint')"
      />
    </ElCard>

    <ElCard v-if="detail" class="card-wrapper">
      <template #header>{{ $t('page.ticket.slaInfo') }}</template>
      <ElDescriptions :column="2" border>
        <ElDescriptionsItem :label="$t('page.ticket.priority')">
          {{ priorityLabel[detail.priority] }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.ticket.faultType')">
          {{ faultTypeLabel[detail.faultType] }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.ticket.slaResponseDeadline')">
          {{ detail.slaResponseDeadline ?? '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.ticket.slaResolveDeadline')">
          {{ detail.slaResolveDeadline ?? '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.ticket.firstResponseAt')">
          {{ detail.firstResponseAt ?? '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.ticket.resolvedAt')">{{ detail.resolvedAt ?? '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.ticket.responseStatus')">
          <ElTag :type="responseStatus.type">{{ responseStatus.label }}</ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.ticket.resolveStatus')">
          <ElTag :type="resolveStatus.type">{{ resolveStatus.label }}</ElTag>
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElCard>

    <ElCard v-if="detail" class="card-wrapper">
      <template #header>{{ $t('page.ticket.record.title') }}</template>
      <ElTimeline>
        <ElTimelineItem v-for="record in records" :key="record.id" :timestamp="record.createTime" placement="top">
          <p>
            <strong>{{ record.operatorName }}</strong>
            {{ recordActionLabel[record.action] ?? record.action }}
          </p>
          <p v-if="record.remark" class="text-#888">{{ record.remark }}</p>
        </ElTimelineItem>
      </ElTimeline>
    </ElCard>

    <TicketAssignDialog v-model:visible="assignVisible" :ticket-id="ticketId" @submitted="loadDetail" />
    <TicketCompleteDialog
      v-model:visible="completeVisible"
      :ticket-id="ticketId"
      :has-asset="Boolean(detail?.assetId)"
      @submitted="loadDetail"
    />
    <TicketCancelDialog v-model:visible="cancelVisible" :ticket-id="ticketId" @submitted="loadDetail" />
    <TicketEditDialog v-model:visible="editVisible" :ticket-data="detail" @submitted="loadDetail" />
  </div>
</template>

<style scoped></style>
