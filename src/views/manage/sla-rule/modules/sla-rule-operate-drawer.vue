<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { fetchCreateSlaRule, fetchUpdateSlaRule } from '@/service/api';
import { useForm, useFormRules } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({ name: 'SlaRuleOperateDrawer' });

interface Props {
  operateType: UI.TableOperateType;
  rowData?: Api.Sla.SlaRule | null;
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

const title = computed(() => {
  const titles: Record<UI.TableOperateType, string> = {
    add: $t('page.manage.slaRule.addRule'),
    edit: $t('page.manage.slaRule.editRule')
  };
  return titles[props.operateType];
});

type Model = Pick<
  Api.Sla.SlaRule,
  'name' | 'ticketCategory' | 'priority' | 'responseMinutes' | 'resolveMinutes' | 'enabled' | 'sortOrder'
>;

const model = ref<Model>(createDefaultModel());

function createDefaultModel(): Model {
  return {
    name: '',
    ticketCategory: null,
    priority: 'medium',
    responseMinutes: 30,
    resolveMinutes: 240,
    enabled: 1,
    sortOrder: 0
  };
}

const priorityOptions = computed<CommonType.Option<Api.Sla.Priority>[]>(() => [
  { label: $t('page.ticket.priorityType.urgent'), value: 'urgent' },
  { label: $t('page.ticket.priorityType.high'), value: 'high' },
  { label: $t('page.manage.slaRule.priorityType.medium'), value: 'medium' },
  { label: $t('page.ticket.priorityType.low'), value: 'low' }
]);

const ticketCategoryOptions = computed<CommonType.Option<Api.Sla.TicketCategory>[]>(() => [
  { label: $t('page.ticket.faultTypeType.hardware'), value: 'hardware' },
  { label: $t('page.ticket.faultTypeType.software'), value: 'software' },
  { label: $t('page.ticket.faultTypeType.network'), value: 'network' },
  { label: $t('page.ticket.faultTypeType.printer'), value: 'printer' },
  { label: $t('page.ticket.faultTypeType.account'), value: 'account' },
  { label: $t('page.ticket.faultTypeType.other'), value: 'other' }
]);

const enabledOptions: CommonType.Option<number>[] = [
  { label: $t('page.manage.common.status.enable'), value: 1 },
  { label: $t('page.manage.common.status.disable'), value: 0 }
];

const rules = computed<
  Record<'name' | 'priority' | 'responseMinutes' | 'resolveMinutes' | 'enabled', App.Global.FormRule>
>(() => ({
  name: defaultRequiredRule,
  priority: defaultRequiredRule,
  enabled: defaultRequiredRule,
  responseMinutes: {
    validator: (_rule, value: number, callback) => {
      if (!value || value <= 0) {
        callback(new Error($t('page.manage.slaRule.form.responseMinutesInvalid')));
        return;
      }
      callback();
    },
    trigger: 'blur'
  },
  resolveMinutes: {
    validator: (_rule, value: number, callback) => {
      if (!value || value <= 0) {
        callback(new Error($t('page.manage.slaRule.form.resolveMinutesInvalid')));
        return;
      }
      if (value < model.value.responseMinutes) {
        callback(new Error($t('page.manage.slaRule.form.resolveMinutesTooSmall')));
        return;
      }
      callback();
    },
    trigger: 'blur'
  }
}));

function revalidateResolveMinutes() {
  formRef.value?.validateField('resolveMinutes');
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  const { error } =
    props.operateType === 'edit' && props.rowData
      ? await fetchUpdateSlaRule(props.rowData.id, model.value)
      : await fetchCreateSlaRule(model.value);

  if (error) return;

  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    model.value = props.rowData
      ? {
          name: props.rowData.name,
          ticketCategory: props.rowData.ticketCategory,
          priority: props.rowData.priority,
          responseMinutes: props.rowData.responseMinutes,
          resolveMinutes: props.rowData.resolveMinutes,
          enabled: props.rowData.enabled,
          sortOrder: props.rowData.sortOrder
        }
      : createDefaultModel();
    restoreValidation();
  }
});
</script>

<template>
  <ElDrawer v-model="visible" :title="title" :size="400">
    <ElForm ref="formRef" :model="model" :rules="rules" label-position="top">
      <ElFormItem :label="$t('page.manage.slaRule.name')" prop="name">
        <ElInput v-model="model.name" :placeholder="$t('page.manage.slaRule.form.name')" />
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.slaRule.ticketCategory')" prop="ticketCategory">
        <ElSelect v-model="model.ticketCategory" clearable :placeholder="$t('page.manage.slaRule.form.ticketCategory')">
          <ElOption v-for="{ label, value } in ticketCategoryOptions" :key="value" :label="label" :value="value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.slaRule.priority')" prop="priority">
        <ElSelect v-model="model.priority" :placeholder="$t('page.manage.slaRule.form.priority')">
          <ElOption v-for="{ label, value } in priorityOptions" :key="value" :label="label" :value="value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.slaRule.responseMinutes')" prop="responseMinutes">
        <ElInputNumber v-model="model.responseMinutes" :min="1" class="w-full" @change="revalidateResolveMinutes" />
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.slaRule.resolveMinutes')" prop="resolveMinutes">
        <ElInputNumber v-model="model.resolveMinutes" :min="1" class="w-full" />
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.common.status.title')" prop="enabled">
        <ElRadioGroup v-model="model.enabled">
          <ElRadio v-for="{ label, value } in enabledOptions" :key="value" :value="value" :label="label" />
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.slaRule.sortOrder')" prop="sortOrder">
        <ElInputNumber v-model="model.sortOrder" :min="0" class="w-full" />
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
