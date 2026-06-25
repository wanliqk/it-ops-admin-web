<script setup lang="ts">
import { computed, ref } from 'vue';
import { loadEnabledTicketCategoryOptions } from '@/constants/ticket-category';
import { $t } from '@/locales';

defineOptions({ name: 'SlaRuleSearch' });

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel<Api.Sla.SlaRuleSearchParams>('model', { required: true });

const priorityOptions = computed<CommonType.Option<Api.Sla.Priority>[]>(() => [
  { label: $t('page.ticket.priorityType.urgent'), value: 'urgent' },
  { label: $t('page.ticket.priorityType.high'), value: 'high' },
  { label: $t('page.manage.slaRule.priorityType.medium'), value: 'medium' },
  { label: $t('page.ticket.priorityType.low'), value: 'low' }
]);

const categoryOptions = ref<CommonType.Option<number>[]>([]);

async function loadCategoryOptions() {
  const options = await loadEnabledTicketCategoryOptions();
  categoryOptions.value = options.map(({ label, value }) => ({ label, value }));
}

loadCategoryOptions();

const enabledOptions = computed<CommonType.Option<number>[]>(() => [
  { label: $t('page.manage.common.status.enable'), value: 1 },
  { label: $t('page.manage.common.status.disable'), value: 0 }
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
      <ElCollapseItem :title="$t('common.search')" name="sla-rule-search">
        <ElForm :model="model" label-position="right" :label-width="100">
          <ElRow :gutter="24">
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.manage.slaRule.priority')" prop="priority">
                <ElSelect v-model="model.priority" clearable>
                  <ElOption v-for="{ label, value } in priorityOptions" :key="value" :label="label" :value="value" />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.ticket.category')" prop="categoryId">
                <ElSelect v-model="model.categoryId" clearable>
                  <ElOption v-for="{ label, value } in categoryOptions" :key="value" :label="label" :value="value" />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.manage.common.status.title')" prop="enabled">
                <ElSelect v-model="model.enabled" clearable>
                  <ElOption v-for="{ label, value } in enabledOptions" :key="value" :label="label" :value="value" />
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
