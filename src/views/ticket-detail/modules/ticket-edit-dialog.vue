<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { loadEnabledTicketCategoryOptions } from '@/constants/ticket-category';
import type { TicketCategoryOption } from '@/constants/ticket-category';
import { fetchGetAssetList, fetchUpdateTicket } from '@/service/api';
import { useForm, useFormRules } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({ name: 'TicketEditDialog' });

interface Props {
  ticketData?: Api.Ticket.TicketDetail | null;
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
  title: string;
  description: string;
  categoryId: number | undefined;
  priority: Api.Ticket.TicketPriority;
  assetId: number | null;
}

const model = ref<Model>(createDefaultModel());

function createDefaultModel(): Model {
  return { title: '', description: '', categoryId: undefined, priority: 'normal', assetId: null };
}

const categoryOptions = ref<TicketCategoryOption[]>([]);

const requireAsset = computed(
  () => categoryOptions.value.find(option => option.value === model.value.categoryId)?.category.requireAsset === 1
);

async function loadCategoryOptions() {
  categoryOptions.value = await loadEnabledTicketCategoryOptions();
}

const rules = computed<Record<'title' | 'description' | 'categoryId' | 'assetId', App.Global.FormRule>>(() => ({
  title: defaultRequiredRule,
  description: defaultRequiredRule,
  categoryId: defaultRequiredRule,
  assetId: {
    required: requireAsset.value,
    message: $t('page.ticket.form.relatedAssetRequired'),
    trigger: 'change'
  }
}));

const priorityOptions = computed<CommonType.Option<Api.Ticket.TicketPriority>[]>(() => [
  { label: $t('page.ticket.priorityType.low'), value: 'low' },
  { label: $t('page.ticket.priorityType.normal'), value: 'normal' },
  { label: $t('page.ticket.priorityType.high'), value: 'high' },
  { label: $t('page.ticket.priorityType.urgent'), value: 'urgent' }
]);

const assetOptions = ref<CommonType.Option<number>[]>([]);

async function loadAssetOptions() {
  const { data, error } = await fetchGetAssetList({ current: 1, size: 100 });

  if (!error) {
    assetOptions.value = data.records.map(item => ({ label: `${item.assetNo} ${item.assetName}`, value: item.id }));
  }
}

function closeDialog() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  if (!props.ticketData || !model.value.categoryId) return;

  const { error } = await fetchUpdateTicket(props.ticketData.id, {
    title: model.value.title,
    description: model.value.description,
    categoryId: model.value.categoryId,
    priority: model.value.priority,
    assetId: model.value.assetId
  });

  if (error) return;

  window.$message?.success($t('common.updateSuccess'));
  closeDialog();
  emit('submitted');
}

watch(visible, val => {
  if (val) {
    model.value = props.ticketData
      ? {
          title: props.ticketData.title,
          description: props.ticketData.description,
          categoryId: props.ticketData.categoryId,
          priority: props.ticketData.priority,
          assetId: props.ticketData.assetId ?? null
        }
      : createDefaultModel();
    restoreValidation();
    loadCategoryOptions();
    loadAssetOptions();
  }
});
</script>

<template>
  <ElDialog v-model="visible" :title="$t('page.ticket.editTicket')" width="480px">
    <ElForm ref="formRef" :model="model" :rules="rules" label-position="top">
      <ElFormItem :label="$t('page.ticket.ticketTitle')" prop="title">
        <ElInput v-model="model.title" />
      </ElFormItem>
      <ElFormItem :label="$t('page.ticket.description')" prop="description">
        <ElInput v-model="model.description" type="textarea" :rows="4" />
      </ElFormItem>
      <ElFormItem :label="$t('page.ticket.category')" prop="categoryId">
        <ElSelect v-model="model.categoryId" class="w-full">
          <ElOption v-for="{ label, value } in categoryOptions" :key="value" :label="label" :value="value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('page.ticket.priority')" prop="priority">
        <ElSelect v-model="model.priority" class="w-full">
          <ElOption v-for="{ label, value } in priorityOptions" :key="value" :label="label" :value="value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('page.ticket.relatedAsset')" prop="assetId">
        <ElSelect v-model="model.assetId" :clearable="!requireAsset" class="w-full">
          <ElOption v-for="{ label, value } in assetOptions" :key="value" :label="label" :value="value" />
        </ElSelect>
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
