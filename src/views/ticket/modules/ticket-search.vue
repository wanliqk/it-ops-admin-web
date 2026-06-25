<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';

defineOptions({ name: 'TicketSearch' });

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel<Api.Ticket.TicketSearchParams>('model', { required: true });

const statusOptions = computed<CommonType.Option<Api.Ticket.TicketStatus>[]>(() => [
  { label: $t('page.ticket.statusType.pendingAccept'), value: 'pending_accept' },
  { label: $t('page.ticket.statusType.pending'), value: 'pending' },
  { label: $t('page.ticket.statusType.assigned'), value: 'assigned' },
  { label: $t('page.ticket.statusType.processing'), value: 'processing' },
  { label: $t('page.ticket.statusType.pendingConfirm'), value: 'pending_confirm' },
  { label: $t('page.ticket.statusType.completed'), value: 'completed' },
  { label: $t('page.ticket.statusType.closed'), value: 'closed' },
  { label: $t('page.ticket.statusType.cancelled'), value: 'cancelled' }
]);

const priorityOptions = computed<CommonType.Option<Api.Ticket.TicketPriority>[]>(() => [
  { label: $t('page.ticket.priorityType.low'), value: 'low' },
  { label: $t('page.ticket.priorityType.normal'), value: 'normal' },
  { label: $t('page.ticket.priorityType.high'), value: 'high' },
  { label: $t('page.ticket.priorityType.urgent'), value: 'urgent' }
]);

const faultTypeOptions = computed<CommonType.Option<Api.Ticket.FaultType>[]>(() => [
  { label: $t('page.ticket.faultTypeType.hardware'), value: 'hardware' },
  { label: $t('page.ticket.faultTypeType.software'), value: 'software' },
  { label: $t('page.ticket.faultTypeType.network'), value: 'network' },
  { label: $t('page.ticket.faultTypeType.printer'), value: 'printer' },
  { label: $t('page.ticket.faultTypeType.account'), value: 'account' },
  { label: $t('page.ticket.faultTypeType.other'), value: 'other' }
]);

function reset() {
  emit('reset');
}

function search() {
  emit('search');
}
</script>

<template>
  <ElCard class="card-wrapper">
    <ElCollapse>
      <ElCollapseItem :title="$t('common.search')" name="ticket-search">
        <ElForm :model="model" label-position="right" :label-width="80">
          <ElRow :gutter="24">
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.ticket.keyword')" prop="keyword">
                <ElInput v-model="model.keyword" :placeholder="$t('page.ticket.form.keyword')" />
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.ticket.status')" prop="status">
                <ElSelect v-model="model.status" clearable>
                  <ElOption v-for="{ label, value } in statusOptions" :key="value" :label="label" :value="value" />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.ticket.priority')" prop="priority">
                <ElSelect v-model="model.priority" clearable>
                  <ElOption v-for="{ label, value } in priorityOptions" :key="value" :label="label" :value="value" />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.ticket.faultType')" prop="faultType">
                <ElSelect v-model="model.faultType" clearable>
                  <ElOption v-for="{ label, value } in faultTypeOptions" :key="value" :label="label" :value="value" />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="12" :md="16" :sm="24">
              <ElSpace class="w-full justify-end" alignment="end">
                <ElButton @click="reset">
                  <template #icon>
                    <icon-ic-round-refresh class="text-icon" />
                  </template>
                  {{ $t('common.reset') }}
                </ElButton>
                <ElButton type="primary" plain @click="search">
                  <template #icon>
                    <icon-ic-round-search class="text-icon" />
                  </template>
                  {{ $t('common.search') }}
                </ElButton>
              </ElSpace>
            </ElCol>
          </ElRow>
        </ElForm>
      </ElCollapseItem>
    </ElCollapse>
  </ElCard>
</template>

<style scoped></style>
