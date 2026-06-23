<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';

defineOptions({ name: 'RepairRecordSearch' });

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel<Api.Asset.RepairRecordSearchParams>('model', { required: true });

const resultOptions = computed<CommonType.Option<Api.Asset.RepairRecord['repairResult']>[]>(() => [
  { label: $t('page.assetManage.repairRecord.resultType.fixed'), value: 'fixed' },
  { label: $t('page.assetManage.repairRecord.resultType.replaceRepair'), value: 'replace_repair' },
  { label: $t('page.assetManage.repairRecord.resultType.scrapped'), value: 'scrapped' },
  { label: $t('page.assetManage.repairRecord.resultType.unresolved'), value: 'unresolved' }
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
      <ElCollapseItem :title="$t('common.search')" name="repair-record-search">
        <ElForm :model="model" label-position="right" :label-width="80">
          <ElRow :gutter="24">
            <ElCol :lg="8" :md="12" :sm="12">
              <ElFormItem :label="$t('page.assetManage.repairRecord.repairResult')" prop="repairResult">
                <ElSelect v-model="model.repairResult" clearable>
                  <ElOption v-for="{ label, value } in resultOptions" :key="value" :label="label" :value="value" />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="8" :md="12" :sm="12">
              <ElFormItem :label="$t('page.assetManage.repairRecord.repairedAt')" prop="startDate">
                <ElDatePicker v-model="dateRange" type="daterange" value-format="YYYY-MM-DD" class="w-full" />
              </ElFormItem>
            </ElCol>
            <ElCol :lg="8" :md="24" :sm="24">
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
