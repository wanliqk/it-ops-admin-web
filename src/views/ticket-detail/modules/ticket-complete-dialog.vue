<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { fetchCompleteTicket } from '@/service/api';
import { useForm, useFormRules } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({ name: 'TicketCompleteDialog' });

interface Props {
  ticketId: number;
  /** whether the ticket has a related asset (asset status update only makes sense then) */
  hasAsset: boolean;
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

interface Model {
  result: string;
  faultReason: string;
  repairMethod: string;
  repairResult: 'fixed' | 'replace_repair' | 'scrapped' | 'unresolved' | undefined;
  repairCost: number;
  assetStatusAfterRepair: 'in_use' | 'repairing' | 'scrapped' | undefined;
  remark: string;
}

function createDefaultModel(): Model {
  return {
    result: '',
    faultReason: '',
    repairMethod: '',
    repairResult: undefined,
    repairCost: 0,
    assetStatusAfterRepair: undefined,
    remark: ''
  };
}

const model = ref<Model>(createDefaultModel());

const rules: Record<'result' | 'repairResult', App.Global.FormRule> = {
  result: defaultRequiredRule,
  repairResult: defaultRequiredRule
};

const repairResultOptions = computed<CommonType.Option<Exclude<Model['repairResult'], undefined>>[]>(() => [
  { label: $t('page.assetManage.repairRecord.resultType.fixed'), value: 'fixed' },
  { label: $t('page.assetManage.repairRecord.resultType.replaceRepair'), value: 'replace_repair' },
  { label: $t('page.assetManage.repairRecord.resultType.scrapped'), value: 'scrapped' },
  { label: $t('page.assetManage.repairRecord.resultType.unresolved'), value: 'unresolved' }
]);

const assetStatusOptions = computed<CommonType.Option<Exclude<Model['assetStatusAfterRepair'], undefined>>[]>(() => [
  { label: $t('page.assetManage.asset.statusType.inUse'), value: 'in_use' },
  { label: $t('page.assetManage.asset.statusType.repairing'), value: 'repairing' },
  { label: $t('page.assetManage.asset.statusType.scrapped'), value: 'scrapped' }
]);

function closeDialog() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  if (!model.value.repairResult) return;

  const { error } = await fetchCompleteTicket(props.ticketId, {
    result: model.value.result,
    faultReason: model.value.faultReason,
    repairMethod: model.value.repairMethod,
    repairResult: model.value.repairResult,
    repairCost: model.value.repairCost,
    assetStatusAfterRepair: props.hasAsset ? model.value.assetStatusAfterRepair : undefined,
    remark: model.value.remark
  });

  if (error) return;

  window.$message?.success($t('common.modifySuccess'));
  closeDialog();
  emit('submitted');
}

watch(visible, val => {
  if (val) {
    model.value = createDefaultModel();
    restoreValidation();
  }
});
</script>

<template>
  <ElDialog v-model="visible" :title="$t('page.ticket.action.complete')" width="480px">
    <ElForm ref="formRef" :model="model" :rules="rules" label-position="top">
      <ElFormItem :label="$t('page.ticket.completeForm.result')" prop="result">
        <ElInput v-model="model.result" type="textarea" />
      </ElFormItem>
      <ElFormItem :label="$t('page.ticket.completeForm.faultReason')" prop="faultReason">
        <ElInput v-model="model.faultReason" type="textarea" />
      </ElFormItem>
      <ElFormItem :label="$t('page.ticket.completeForm.repairMethod')" prop="repairMethod">
        <ElInput v-model="model.repairMethod" type="textarea" />
      </ElFormItem>
      <ElFormItem :label="$t('page.ticket.completeForm.repairResult')" prop="repairResult">
        <ElSelect v-model="model.repairResult" class="w-full">
          <ElOption v-for="{ label, value } in repairResultOptions" :key="value" :label="label" :value="value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('page.ticket.completeForm.repairCost')" prop="repairCost">
        <ElInputNumber v-model="model.repairCost" :min="0" class="w-full" />
      </ElFormItem>
      <ElFormItem
        v-if="hasAsset"
        :label="$t('page.ticket.completeForm.assetStatusAfterRepair')"
        prop="assetStatusAfterRepair"
      >
        <ElSelect v-model="model.assetStatusAfterRepair" class="w-full" clearable>
          <ElOption v-for="{ label, value } in assetStatusOptions" :key="value" :label="label" :value="value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('page.ticket.completeForm.remark')" prop="remark">
        <ElInput v-model="model.remark" type="textarea" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElSpace :size="16">
        <ElButton @click="closeDialog">{{ $t('common.cancel') }}</ElButton>
        <ElButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</ElButton>
      </ElSpace>
    </template>
  </ElDialog>
</template>

<style scoped></style>
