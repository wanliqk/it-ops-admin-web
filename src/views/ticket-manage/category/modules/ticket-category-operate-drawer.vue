<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { loadEnabledTicketCategoryOptions } from '@/constants/ticket-category';
import { getAssignStrategyOptions } from '@/constants/ticket-assignment';
import {
  fetchCreateTicketCategory,
  fetchGetUserOptions,
  fetchGetWorkGroupList,
  fetchGetWorkGroupMemberList,
  fetchUpdateTicketCategory
} from '@/service/api';
import { useForm, useFormRules } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({ name: 'TicketCategoryOperateDrawer' });

interface Props {
  operateType: UI.TableOperateType;
  rowData?: Api.TicketCategory.TicketCategory | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', { default: false });

const { formRef, validate, restoreValidation } = useForm();
const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<UI.TableOperateType, string> = {
    add: $t('page.manage.ticketCategory.addCategory'),
    edit: $t('page.manage.ticketCategory.editCategory')
  };
  return titles[props.operateType];
});

interface Model {
  parentId: number | null;
  name: string;
  code: string;
  description: string | null;
  defaultPriority: Api.Ticket.TicketPriority | null;
  defaultGroupId: number | null;
  assignmentStrategy: Api.TicketAssignment.AssignStrategy | null;
  fixedAssigneeId: number | null;
  requireAsset: number;
  sortOrder: number;
  status: number;
}

function createDefaultModel(): Model {
  return {
    parentId: null,
    name: '',
    code: '',
    description: null,
    defaultPriority: null,
    defaultGroupId: null,
    assignmentStrategy: null,
    fixedAssigneeId: null,
    requireAsset: 0,
    sortOrder: 100,
    status: 1
  };
}

const model = ref<Model>(createDefaultModel());

const isEdit = computed(() => props.operateType === 'edit');

const parentOptions = ref<CommonType.Option<number>[]>([]);
const opsGroupOptions = ref<CommonType.Option<number>[]>([]);
const fixedAssigneeOptions = ref<CommonType.Option<number>[]>([]);

async function loadStaticOptions() {
  const [categoryOptions, groupRes] = await Promise.all([
    loadEnabledTicketCategoryOptions(),
    fetchGetWorkGroupList({ current: 1, size: 100, status: 1 })
  ]);

  // a category can't be its own parent
  parentOptions.value = categoryOptions
    .filter(option => !isEdit.value || option.value !== props.rowData?.id)
    .map(({ label, value }) => ({ label, value }));

  if (!groupRes.error) {
    opsGroupOptions.value = groupRes.data.records.map(item => ({ label: item.groupName, value: item.id }));
  }
}

/** fixed_user candidates: members of the default group, or all IT staff/admin when no group is picked */
async function loadFixedAssigneeOptions() {
  if (model.value.defaultGroupId !== null) {
    const { data, error } = await fetchGetWorkGroupMemberList(model.value.defaultGroupId, {
      current: 1,
      size: 100,
      status: 1
    });

    fixedAssigneeOptions.value = error
      ? []
      : data.records.map(item => ({ label: `${item.realName} / ${item.username}`, value: item.userId }));
    return;
  }

  const [itStaffRes, adminRes] = await Promise.all([fetchGetUserOptions('it_staff'), fetchGetUserOptions('admin')]);
  fixedAssigneeOptions.value = [...(itStaffRes.data ?? []), ...(adminRes.data ?? [])];
}

const priorityOptions = computed<CommonType.Option<Api.Ticket.TicketPriority>[]>(() => [
  { label: $t('page.ticket.priorityType.low'), value: 'low' },
  { label: $t('page.ticket.priorityType.normal'), value: 'normal' },
  { label: $t('page.ticket.priorityType.high'), value: 'high' },
  { label: $t('page.ticket.priorityType.urgent'), value: 'urgent' }
]);

const assignStrategyOptions = computed(() => getAssignStrategyOptions());

const requireAssetOptions: CommonType.Option<number>[] = [
  { label: $t('common.yesOrNo.yes'), value: 1 },
  { label: $t('common.yesOrNo.no'), value: 0 }
];

const statusOptions: CommonType.Option<number>[] = [
  { label: $t('page.manage.common.status.enable'), value: 1 },
  { label: $t('page.manage.common.status.disable'), value: 0 }
];

const isLeastWorkload = computed(() => model.value.assignmentStrategy === 'least_workload');
const isFixedUser = computed(() => model.value.assignmentStrategy === 'fixed_user');

function handleStrategyChange() {
  if (!isFixedUser.value) {
    model.value.fixedAssigneeId = null;
  }
}

watch(
  () => model.value.defaultGroupId,
  () => {
    if (isFixedUser.value) {
      model.value.fixedAssigneeId = null;
      loadFixedAssigneeOptions();
    }
  }
);

const rules = computed<Record<'name' | 'code' | 'status' | 'defaultGroupId' | 'fixedAssigneeId', App.Global.FormRule>>(
  () => ({
    name: defaultRequiredRule,
    code: defaultRequiredRule,
    status: defaultRequiredRule,
    defaultGroupId: {
      required: isLeastWorkload.value,
      message: $t('page.manage.assignmentRule.form.opsGroupRequired'),
      trigger: 'change'
    },
    fixedAssigneeId: {
      required: isFixedUser.value,
      message: $t('page.manage.assignmentRule.form.targetUserRequired'),
      trigger: 'change'
    }
  })
);

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  const params = {
    parentId: model.value.parentId,
    name: model.value.name,
    code: model.value.code,
    description: model.value.description,
    defaultPriority: model.value.defaultPriority,
    defaultGroupId: model.value.defaultGroupId,
    assignmentStrategy: model.value.assignmentStrategy,
    fixedAssigneeId: isFixedUser.value ? model.value.fixedAssigneeId : null,
    requireAsset: model.value.requireAsset,
    sortOrder: model.value.sortOrder,
    status: model.value.status
  };

  const { error } =
    props.operateType === 'edit' && props.rowData
      ? await fetchUpdateTicketCategory(props.rowData.id, params)
      : await fetchCreateTicketCategory(params);

  if (error) return;

  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
  emit('submitted');
}

watch(visible, async () => {
  if (!visible.value) return;

  // set the model synchronously first so the drawer never flashes stale data while the
  // options below are still being fetched
  if (props.operateType === 'edit' && props.rowData) {
    model.value = {
      parentId: props.rowData.parentId,
      name: props.rowData.name,
      code: props.rowData.code,
      description: props.rowData.description,
      defaultPriority: props.rowData.defaultPriority,
      defaultGroupId: props.rowData.defaultGroupId,
      assignmentStrategy: props.rowData.assignmentStrategy,
      fixedAssigneeId: props.rowData.fixedAssigneeId,
      requireAsset: props.rowData.requireAsset,
      sortOrder: props.rowData.sortOrder,
      status: props.rowData.status
    };
  } else {
    model.value = createDefaultModel();
  }

  restoreValidation();

  await loadStaticOptions();

  if (props.operateType === 'edit' && props.rowData) {
    if (props.rowData.fixedAssigneeId !== null && props.rowData.fixedAssigneeName !== null) {
      fixedAssigneeOptions.value = [{ label: props.rowData.fixedAssigneeName, value: props.rowData.fixedAssigneeId }];
    } else {
      await loadFixedAssigneeOptions();
    }
  } else {
    await loadFixedAssigneeOptions();
  }
});
</script>

<template>
  <ElDrawer v-model="visible" :title="title" :size="480">
    <ElForm ref="formRef" :model="model" :rules="rules" label-position="top">
      <ElFormItem :label="$t('page.manage.ticketCategory.parentCategory')" prop="parentId">
        <ElSelect
          v-model="model.parentId"
          clearable
          :placeholder="$t('page.manage.ticketCategory.form.parentCategory')"
        >
          <ElOption v-for="{ label, value } in parentOptions" :key="value" :label="label" :value="value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.ticketCategory.name')" prop="name">
        <ElInput v-model="model.name" :placeholder="$t('page.manage.ticketCategory.form.name')" />
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.ticketCategory.code')" prop="code">
        <ElInput v-model="model.code" :disabled="isEdit" :placeholder="$t('page.manage.ticketCategory.form.code')" />
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.ticketCategory.description')" prop="description">
        <ElInput v-model="model.description" type="textarea" :rows="2" />
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.ticketCategory.defaultPriority')" prop="defaultPriority">
        <ElSelect v-model="model.defaultPriority" clearable>
          <ElOption v-for="{ label, value } in priorityOptions" :key="value" :label="label" :value="value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.assignmentRule.assignStrategy')" prop="assignmentStrategy">
        <ElSelect v-model="model.assignmentStrategy" clearable @change="handleStrategyChange">
          <ElOption v-for="{ label, value } in assignStrategyOptions" :key="value" :label="label" :value="value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem
        :label="$t('page.manage.ticketCategory.defaultGroup')"
        prop="defaultGroupId"
        :required="isLeastWorkload"
      >
        <ElSelect v-model="model.defaultGroupId" clearable>
          <ElOption v-for="{ label, value } in opsGroupOptions" :key="value" :label="label" :value="value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem v-if="isFixedUser" :label="$t('page.manage.assignmentRule.targetUser')" prop="fixedAssigneeId">
        <ElSelect v-model="model.fixedAssigneeId" filterable>
          <ElOption v-for="{ label, value } in fixedAssigneeOptions" :key="value" :label="label" :value="value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.ticketCategory.requireAsset')" prop="requireAsset">
        <ElRadioGroup v-model="model.requireAsset">
          <ElRadio v-for="{ label, value } in requireAssetOptions" :key="value" :value="value" :label="label" />
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.ticketCategory.sortOrder')" prop="sortOrder">
        <ElInputNumber v-model="model.sortOrder" :min="0" class="w-full" />
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.common.status.title')" prop="status">
        <ElRadioGroup v-model="model.status">
          <ElRadio v-for="{ label, value } in statusOptions" :key="value" :value="value" :label="label" />
        </ElRadioGroup>
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
