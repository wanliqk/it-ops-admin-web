<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { getAssignStrategyOptions } from '@/constants/ticket-assignment';
import {
  fetchCreateAssignmentRule,
  fetchGetAssetCategoryList,
  fetchGetUserOptions,
  fetchGetWorkGroupList,
  fetchGetWorkGroupMemberList,
  fetchUpdateAssignmentRule
} from '@/service/api';
import { useForm, useFormRules } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({ name: 'TicketAssignmentRuleOperateDrawer' });

interface Props {
  operateType: UI.TableOperateType;
  rowData?: Api.TicketAssignment.Rule | null;
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
    add: $t('page.manage.assignmentRule.addRule'),
    edit: $t('page.manage.assignmentRule.editRule')
  };
  return titles[props.operateType];
});

interface Model {
  name: string;
  categoryId: number | null;
  priority: Api.Ticket.TicketPriority | null;
  opsGroupId: number | null;
  assignStrategy: Api.TicketAssignment.AssignStrategy;
  targetUserId: number | null;
  enabled: boolean;
  sortOrder: number;
  remark: string | null;
}

function createDefaultModel(): Model {
  return {
    name: '',
    categoryId: null,
    priority: null,
    opsGroupId: null,
    assignStrategy: 'least_workload',
    targetUserId: null,
    enabled: true,
    sortOrder: 100,
    remark: null
  };
}

const model = ref<Model>(createDefaultModel());

const categoryOptions = ref<CommonType.Option<number>[]>([]);
const opsGroupOptions = ref<CommonType.Option<number>[]>([]);
const targetUserOptions = ref<CommonType.Option<number>[]>([]);

async function loadStaticOptions() {
  const [categoryRes, groupRes] = await Promise.all([
    fetchGetAssetCategoryList(),
    fetchGetWorkGroupList({ current: 1, size: 100, status: 1 })
  ]);

  if (!categoryRes.error) {
    categoryOptions.value = categoryRes.data.map(item => ({ label: item.categoryName, value: item.id }));
  }

  if (!groupRes.error) {
    opsGroupOptions.value = groupRes.data.records.map(item => ({ label: item.groupName, value: item.id }));
  }
}

/** fixed_user candidates: members of the selected ops group, or all IT staff/admin when no group is picked */
async function loadTargetUserOptions() {
  if (model.value.opsGroupId !== null) {
    const { data, error } = await fetchGetWorkGroupMemberList(model.value.opsGroupId, {
      current: 1,
      size: 100,
      status: 1
    });

    targetUserOptions.value = error
      ? []
      : data.records.map(item => ({ label: `${item.realName} / ${item.username}`, value: item.userId }));
    return;
  }

  const [itStaffRes, adminRes] = await Promise.all([fetchGetUserOptions('it_staff'), fetchGetUserOptions('admin')]);
  targetUserOptions.value = [...(itStaffRes.data ?? []), ...(adminRes.data ?? [])];
}

const priorityOptions = computed<CommonType.Option<Api.Ticket.TicketPriority>[]>(() => [
  { label: $t('page.ticket.priorityType.low'), value: 'low' },
  { label: $t('page.ticket.priorityType.normal'), value: 'normal' },
  { label: $t('page.ticket.priorityType.high'), value: 'high' },
  { label: $t('page.ticket.priorityType.urgent'), value: 'urgent' }
]);

const assignStrategyOptions = computed(() => getAssignStrategyOptions());

const enabledOptions: CommonType.Option<boolean>[] = [
  { label: $t('page.manage.common.status.enable'), value: true },
  { label: $t('page.manage.common.status.disable'), value: false }
];

const isLeastWorkload = computed(() => model.value.assignStrategy === 'least_workload');
const isFixedUser = computed(() => model.value.assignStrategy === 'fixed_user');

function handleStrategyChange() {
  if (isLeastWorkload.value) {
    model.value.targetUserId = null;
  }
}

watch(
  () => model.value.opsGroupId,
  () => {
    if (isFixedUser.value) {
      model.value.targetUserId = null;
      loadTargetUserOptions();
    }
  }
);

const rules = computed<Record<'name' | 'assignStrategy' | 'opsGroupId' | 'targetUserId', App.Global.FormRule>>(() => ({
  name: defaultRequiredRule,
  assignStrategy: defaultRequiredRule,
  opsGroupId: {
    required: isLeastWorkload.value,
    message: $t('page.manage.assignmentRule.form.opsGroupRequired'),
    trigger: 'change'
  },
  targetUserId: {
    required: isFixedUser.value,
    message: $t('page.manage.assignmentRule.form.targetUserRequired'),
    trigger: 'change'
  }
}));

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  const params = {
    name: model.value.name,
    categoryId: model.value.categoryId,
    priority: model.value.priority,
    opsGroupId: model.value.opsGroupId,
    assignStrategy: model.value.assignStrategy,
    targetUserId: isLeastWorkload.value ? null : model.value.targetUserId,
    enabled: model.value.enabled,
    sortOrder: model.value.sortOrder,
    remark: model.value.remark
  };

  const { error } =
    props.operateType === 'edit' && props.rowData
      ? await fetchUpdateAssignmentRule(props.rowData.id, params)
      : await fetchCreateAssignmentRule(params);

  if (error) return;

  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
  emit('submitted');
}

watch(visible, async () => {
  if (!visible.value) return;

  await loadStaticOptions();

  if (props.rowData) {
    model.value = {
      name: props.rowData.name,
      categoryId: props.rowData.categoryId,
      priority: props.rowData.priority,
      opsGroupId: props.rowData.opsGroupId,
      assignStrategy: props.rowData.assignStrategy,
      targetUserId: props.rowData.targetUserId,
      enabled: props.rowData.enabled,
      sortOrder: props.rowData.sortOrder,
      remark: props.rowData.remark
    };

    if (props.rowData.targetUserId !== null && props.rowData.targetUserName !== null) {
      targetUserOptions.value = [{ label: props.rowData.targetUserName, value: props.rowData.targetUserId }];
    } else {
      await loadTargetUserOptions();
    }
  } else {
    model.value = createDefaultModel();
    await loadTargetUserOptions();
  }

  restoreValidation();
});
</script>

<template>
  <ElDrawer v-model="visible" :title="title" :size="480">
    <ElForm ref="formRef" :model="model" :rules="rules" label-position="top">
      <ElFormItem :label="$t('page.manage.assignmentRule.name')" prop="name">
        <ElInput v-model="model.name" :placeholder="$t('page.manage.assignmentRule.form.name')" />
      </ElFormItem>
      <ElFormItem :label="$t('page.ticket.category')" prop="categoryId">
        <ElSelect v-model="model.categoryId" clearable :placeholder="$t('page.manage.assignmentRule.form.category')">
          <ElOption v-for="{ label, value } in categoryOptions" :key="value" :label="label" :value="value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('page.ticket.priority')" prop="priority">
        <ElSelect v-model="model.priority" clearable :placeholder="$t('page.manage.assignmentRule.form.priority')">
          <ElOption v-for="{ label, value } in priorityOptions" :key="value" :label="label" :value="value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.assignmentRule.assignStrategy')" prop="assignStrategy">
        <ElRadioGroup v-model="model.assignStrategy" @change="handleStrategyChange">
          <ElRadio v-for="{ label, value } in assignStrategyOptions" :key="value" :value="value" :label="label" />
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem v-if="isLeastWorkload" :label="$t('page.manage.assignmentRule.opsGroup')" prop="opsGroupId">
        <ElSelect v-model="model.opsGroupId" :placeholder="$t('page.manage.assignmentRule.form.opsGroup')">
          <ElOption v-for="{ label, value } in opsGroupOptions" :key="value" :label="label" :value="value" />
        </ElSelect>
        <div class="text-placeholder mt-4px text-12px">{{ $t('page.manage.assignmentRule.leastWorkloadHint') }}</div>
      </ElFormItem>
      <template v-if="isFixedUser">
        <ElFormItem :label="$t('page.manage.assignmentRule.opsGroup')" prop="opsGroupId">
          <ElSelect
            v-model="model.opsGroupId"
            clearable
            :placeholder="$t('page.manage.assignmentRule.form.opsGroupOptional')"
          >
            <ElOption v-for="{ label, value } in opsGroupOptions" :key="value" :label="label" :value="value" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem :label="$t('page.manage.assignmentRule.targetUser')" prop="targetUserId">
          <ElSelect
            v-model="model.targetUserId"
            filterable
            :placeholder="$t('page.manage.assignmentRule.form.targetUser')"
          >
            <ElOption v-for="{ label, value } in targetUserOptions" :key="value" :label="label" :value="value" />
          </ElSelect>
          <div class="text-placeholder mt-4px text-12px">{{ $t('page.manage.assignmentRule.fixedUserHint') }}</div>
        </ElFormItem>
      </template>
      <ElFormItem :label="$t('page.manage.common.status.title')" prop="enabled">
        <ElRadioGroup v-model="model.enabled">
          <ElRadio v-for="{ label, value } in enabledOptions" :key="String(value)" :value="value" :label="label" />
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.assignmentRule.sortOrder')" prop="sortOrder">
        <ElInputNumber v-model="model.sortOrder" :min="0" class="w-full" />
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.assignmentRule.remark')" prop="remark">
        <ElInput v-model="model.remark" type="textarea" :rows="3" />
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
