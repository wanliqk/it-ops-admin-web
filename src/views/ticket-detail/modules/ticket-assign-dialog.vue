<script setup lang="ts">
import { ref, watch } from 'vue';
import { fetchAssignTicket, fetchGetUserOptions } from '@/service/api';
import { useForm, useFormRules } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({ name: 'TicketAssignDialog' });

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

const model = ref({ handlerId: undefined as number | undefined, remark: '' });

const rules = { handlerId: defaultRequiredRule };

const handlerOptions = ref<CommonType.Option<number>[]>([]);

async function loadHandlerOptions() {
  const [itStaffRes, adminRes] = await Promise.all([fetchGetUserOptions('it_staff'), fetchGetUserOptions('admin')]);

  handlerOptions.value = [...(itStaffRes.data ?? []), ...(adminRes.data ?? [])];
}

function closeDialog() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  if (!model.value.handlerId) return;

  const { error } = await fetchAssignTicket(props.ticketId, model.value.handlerId, model.value.remark);

  if (error) return;

  window.$message?.success($t('common.modifySuccess'));
  closeDialog();
  emit('submitted');
}

watch(visible, val => {
  if (val) {
    model.value = { handlerId: undefined, remark: '' };
    restoreValidation();
    loadHandlerOptions();
  }
});
</script>

<template>
  <ElDialog v-model="visible" :title="$t('page.ticket.action.assign')" width="420px">
    <ElForm ref="formRef" :model="model" :rules="rules" label-position="top">
      <ElFormItem :label="$t('page.ticket.assignForm.handler')" prop="handlerId">
        <ElSelect v-model="model.handlerId" class="w-full">
          <ElOption v-for="{ label, value } in handlerOptions" :key="value" :label="label" :value="value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('page.ticket.assignForm.remark')" prop="remark">
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
