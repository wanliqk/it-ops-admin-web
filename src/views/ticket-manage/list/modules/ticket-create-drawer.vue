<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { loadEnabledTicketCategoryOptions } from '@/constants/ticket-category';
import type { TicketCategoryOption } from '@/constants/ticket-category';
import { fetchCreateTicket, fetchGetAssetList } from '@/service/api';
import { useForm, useFormRules } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({ name: 'TicketCreateDrawer' });

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
  return {
    title: '',
    description: '',
    categoryId: undefined,
    priority: 'normal',
    assetId: null
  };
}

const categoryOptions = ref<TicketCategoryOption[]>([]);

const selectedCategory = computed(
  () => categoryOptions.value.find(option => option.value === model.value.categoryId)?.category
);

const requireAsset = computed(() => selectedCategory.value?.requireAsset === 1);

async function loadCategoryOptions() {
  categoryOptions.value = await loadEnabledTicketCategoryOptions();
}

function handleCategoryChange() {
  if (selectedCategory.value?.defaultPriority) {
    model.value.priority = selectedCategory.value.defaultPriority;
  }
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

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  if (!model.value.categoryId) return;

  const { data, error } = await fetchCreateTicket({
    title: model.value.title,
    description: model.value.description,
    categoryId: model.value.categoryId,
    priority: model.value.priority,
    assetId: model.value.assetId
  });

  if (error) return;

  if (data?.assigneeName) {
    window.$message?.success(`${$t('page.ticket.addSuccessAssigned')}${data.assigneeName}`);
  } else {
    window.$message?.success($t('page.ticket.addSuccessPendingAccept'));
  }

  closeDrawer();
  emit('submitted');
}

watch(visible, val => {
  if (val) {
    model.value = createDefaultModel();
    restoreValidation();
    loadCategoryOptions();
    loadAssetOptions();
  }
});
</script>

<template>
  <ElDrawer v-model="visible" :title="$t('page.ticket.addTicket')" :size="380">
    <ElForm ref="formRef" :model="model" :rules="rules" label-position="top">
      <ElFormItem :label="$t('page.ticket.ticketTitle')" prop="title">
        <ElInput v-model="model.title" :placeholder="$t('page.ticket.form.title')" />
      </ElFormItem>
      <ElFormItem :label="$t('page.ticket.description')" prop="description">
        <ElInput
          v-model="model.description"
          type="textarea"
          :rows="4"
          :placeholder="$t('page.ticket.form.description')"
        />
      </ElFormItem>
      <ElFormItem :label="$t('page.ticket.category')" prop="categoryId">
        <ElSelect
          v-model="model.categoryId"
          :placeholder="$t('page.ticket.form.category')"
          @change="handleCategoryChange"
        >
          <ElOption v-for="{ label, value } in categoryOptions" :key="value" :label="label" :value="value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('page.ticket.priority')" prop="priority">
        <ElSelect v-model="model.priority">
          <ElOption v-for="{ label, value } in priorityOptions" :key="value" :label="label" :value="value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('page.ticket.relatedAsset')" prop="assetId">
        <ElSelect v-model="model.assetId" :clearable="!requireAsset" :placeholder="$t('page.ticket.form.relatedAsset')">
          <ElOption v-for="{ label, value } in assetOptions" :key="value" :label="label" :value="value" />
        </ElSelect>
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
