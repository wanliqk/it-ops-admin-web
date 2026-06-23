<script setup lang="ts">
import { ref, watch } from 'vue';
import { fetchCancelTicket } from '@/service/api';
import { useForm, useFormRules } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({ name: 'TicketCancelDialog' });

interface Props {
  ticketId: number;
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

const model = ref({ reason: '' });
const rules = { reason: defaultRequiredRule };

function closeDialog() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  const { error } = await fetchCancelTicket(props.ticketId, model.value.reason);

  if (error) return;

  window.$message?.success($t('common.modifySuccess'));
  closeDialog();
  emit('submitted');
}

watch(visible, val => {
  if (val) {
    model.value = { reason: '' };
    restoreValidation();
  }
});
</script>

<template>
  <ElDialog v-model="visible" :title="$t('page.ticket.action.cancel')" width="380px">
    <ElForm ref="formRef" :model="model" :rules="rules" label-position="top">
      <ElFormItem :label="$t('page.ticket.cancelForm.reason')" prop="reason">
        <ElInput v-model="model.reason" type="textarea" />
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
