<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';

defineOptions({ name: 'NotificationSearch' });

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel<Api.Notification.NotificationSearchParams>('model', { required: true });

const readStatusOptions = computed<CommonType.Option<Api.Notification.ReadStatus>[]>(() => [
  { label: $t('page.notification.readStatusType.unread'), value: 0 },
  { label: $t('page.notification.readStatusType.read'), value: 1 }
]);

const bizTypeOptions = computed<CommonType.Option<Api.Notification.BizType>[]>(() => [
  { label: $t('page.notification.bizTypeType.ticket'), value: 'ticket' },
  { label: $t('page.notification.bizTypeType.asset'), value: 'asset' },
  { label: $t('page.notification.bizTypeType.sla'), value: 'sla' },
  { label: $t('page.notification.bizTypeType.system'), value: 'system' }
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
      <ElCollapseItem :title="$t('common.search')" name="notification-search">
        <ElForm :model="model" label-position="right" :label-width="80">
          <ElRow :gutter="24">
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.notification.keyword')" prop="keyword">
                <ElInput v-model="model.keyword" :placeholder="$t('page.notification.form.keyword')" />
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.notification.readStatus')" prop="readStatus">
                <ElSelect v-model="model.readStatus" clearable :placeholder="$t('page.notification.form.readStatus')">
                  <ElOption v-for="{ label, value } in readStatusOptions" :key="value" :label="label" :value="value" />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.notification.bizType')" prop="bizType">
                <ElSelect v-model="model.bizType" clearable :placeholder="$t('page.notification.form.bizType')">
                  <ElOption v-for="{ label, value } in bizTypeOptions" :key="value" :label="label" :value="value" />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="24" :sm="24">
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
