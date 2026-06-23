<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';

defineOptions({ name: 'OperationLogSearch' });

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel<Api.OperationLog.OperationLogSearchParams>('model', { required: true });

const resultOptions = computed<CommonType.Option<'success' | 'fail'>[]>(() => [
  { label: $t('page.manage.operationLog.result.success'), value: 'success' },
  { label: $t('page.manage.operationLog.result.fail'), value: 'fail' }
]);

const dateRange = computed<[string, string] | null>({
  get() {
    return model.value.startDate && model.value.endDate ? [model.value.startDate, model.value.endDate] : null;
  },
  set(val) {
    model.value.startDate = val?.[0];
    model.value.endDate = val?.[1];
  }
});

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
      <ElCollapseItem :title="$t('common.search')" name="operation-log-search">
        <ElForm :model="model" label-position="right" :label-width="100">
          <ElRow :gutter="24">
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.manage.operationLog.moduleName')" prop="moduleName">
                <ElInput v-model="model.moduleName" />
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.manage.operationLog.operationResult')" prop="operationResult">
                <ElSelect v-model="model.operationResult" clearable>
                  <ElOption v-for="{ label, value } in resultOptions" :key="value" :label="label" :value="value" />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="8" :md="8" :sm="12">
              <ElFormItem :label="$t('page.manage.operationLog.createTime')" prop="startDate">
                <ElDatePicker v-model="dateRange" type="daterange" value-format="YYYY-MM-DD" class="w-full" />
              </ElFormItem>
            </ElCol>
            <ElCol :lg="4" :md="24" :sm="24">
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
