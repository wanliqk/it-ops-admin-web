<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { fetchUpdateRepairRecord } from '@/service/api';
import { useForm, useFormRules } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({ name: 'RepairRecordOperateDrawer' });

interface Props {
  rowData?: Api.Asset.RepairRecord | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useForm();
const { defaultRequiredRule } = useFormRules();

type Model = Pick<
  Api.Asset.RepairRecord,
  'faultReason' | 'repairMethod' | 'repairResult' | 'repairCost' | 'repairedAt'
>;

const model = ref<Model>(createDefaultModel());

function createDefaultModel(): Model {
  return { faultReason: '', repairMethod: '', repairResult: 'fixed', repairCost: 0, repairedAt: '' };
}

const rules: Record<'faultReason' | 'repairResult', App.Global.FormRule> = {
  faultReason: defaultRequiredRule,
  repairResult: defaultRequiredRule
};

const resultOptions = computed<CommonType.Option<Api.Asset.RepairRecord['repairResult']>[]>(() => [
  { label: $t('page.assetManage.repairRecord.resultType.fixed'), value: 'fixed' },
  { label: $t('page.assetManage.repairRecord.resultType.replaceRepair'), value: 'replace_repair' },
  { label: $t('page.assetManage.repairRecord.resultType.scrapped'), value: 'scrapped' },
  { label: $t('page.assetManage.repairRecord.resultType.unresolved'), value: 'unresolved' }
]);

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  if (!props.rowData) return;

  const { error } = await fetchUpdateRepairRecord(props.rowData.id, model.value);

  if (error) return;

  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    model.value = props.rowData ? { ...props.rowData } : createDefaultModel();
    restoreValidation();
  }
});
</script>

<template>
  <ElDrawer v-model="visible" :title="$t('page.assetManage.repairRecord.editRecord')" :size="380">
    <ElForm ref="formRef" :model="model" :rules="rules" label-position="top">
      <ElFormItem :label="$t('page.assetManage.repairRecord.faultReason')" prop="faultReason">
        <ElInput v-model="model.faultReason" type="textarea" />
      </ElFormItem>
      <ElFormItem :label="$t('page.assetManage.repairRecord.repairMethod')" prop="repairMethod">
        <ElInput v-model="model.repairMethod" type="textarea" />
      </ElFormItem>
      <ElFormItem :label="$t('page.assetManage.repairRecord.repairResult')" prop="repairResult">
        <ElSelect v-model="model.repairResult" class="w-full">
          <ElOption v-for="{ label, value } in resultOptions" :key="value" :label="label" :value="value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('page.assetManage.repairRecord.repairCost')" prop="repairCost">
        <ElInputNumber v-model="model.repairCost" :min="0" class="w-full" />
      </ElFormItem>
      <ElFormItem :label="$t('page.assetManage.repairRecord.repairedAt')" prop="repairedAt">
        <ElDatePicker v-model="model.repairedAt" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" class="w-full" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElSpace :size="16">
        <ElButton @click="closeDrawer">{{ $t('common.cancel') }}</ElButton>
        <ElButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</ElButton>
      </ElSpace>
    </template>
  </ElDrawer>
</template>

<style scoped></style>
