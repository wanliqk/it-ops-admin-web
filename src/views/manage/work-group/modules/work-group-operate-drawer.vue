<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { fetchCreateWorkGroup, fetchUpdateWorkGroup } from '@/service/api';
import { useForm, useFormRules } from '@/hooks/common/form';
import { $t } from '@/locales';
import { searchActiveUserOptions } from './user-options';

defineOptions({ name: 'WorkGroupOperateDrawer' });

interface Props {
  operateType: UI.TableOperateType;
  rowData?: Api.WorkGroup.WorkGroup | null;
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
    add: $t('page.manage.workGroup.addGroup'),
    edit: $t('page.manage.workGroup.editGroup')
  };
  return titles[props.operateType];
});

type Model = Pick<
  Api.WorkGroup.WorkGroup,
  'groupName' | 'groupCode' | 'description' | 'leaderId' | 'status' | 'sortOrder'
>;

function createDefaultModel(): Model {
  return {
    groupName: '',
    groupCode: '',
    description: null,
    leaderId: null,
    status: 1,
    sortOrder: 0
  };
}

const model = ref<Model>(createDefaultModel());

const leaderOptions = ref<CommonType.Option<number>[]>([]);
const leaderSearchLoading = ref(false);

async function handleLeaderSearch(keyword: string) {
  leaderSearchLoading.value = true;
  leaderOptions.value = await searchActiveUserOptions(keyword);
  leaderSearchLoading.value = false;
}

const statusOptions: CommonType.Option<number>[] = [
  { label: $t('page.manage.common.status.enable'), value: 1 },
  { label: $t('page.manage.common.status.disable'), value: 0 }
];

const rules = computed<Record<'groupName' | 'groupCode' | 'status', App.Global.FormRule | App.Global.FormRule[]>>(
  () => ({
    groupName: defaultRequiredRule,
    status: defaultRequiredRule,
    groupCode: [
      defaultRequiredRule,
      {
        pattern: /^[A-Za-z0-9_-]+$/,
        message: $t('page.manage.workGroup.form.groupCodeInvalid'),
        trigger: 'blur'
      }
    ]
  })
);

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  const params = {
    groupName: model.value.groupName,
    groupCode: model.value.groupCode,
    description: model.value.description,
    leaderId: model.value.leaderId,
    status: model.value.status,
    sortOrder: model.value.sortOrder
  };

  const { error } =
    props.operateType === 'edit' && props.rowData
      ? await fetchUpdateWorkGroup(props.rowData.id, params)
      : await fetchCreateWorkGroup(params);

  if (error) return;

  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    if (props.rowData) {
      model.value = {
        groupName: props.rowData.groupName,
        groupCode: props.rowData.groupCode,
        description: props.rowData.description,
        leaderId: props.rowData.leaderId,
        status: props.rowData.status,
        sortOrder: props.rowData.sortOrder
      };
      leaderOptions.value =
        props.rowData.leaderId !== null
          ? [{ label: props.rowData.leaderName ?? '', value: props.rowData.leaderId }]
          : [];
    } else {
      model.value = createDefaultModel();
      leaderOptions.value = [];
    }
    restoreValidation();
  }
});
</script>

<template>
  <ElDrawer v-model="visible" :title="title" :size="480">
    <ElForm ref="formRef" :model="model" :rules="rules" label-position="top">
      <ElFormItem :label="$t('page.manage.workGroup.groupName')" prop="groupName">
        <ElInput v-model="model.groupName" :placeholder="$t('page.manage.workGroup.form.groupName')" />
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.workGroup.groupCode')" prop="groupCode">
        <ElInput v-model="model.groupCode" :placeholder="$t('page.manage.workGroup.form.groupCode')" />
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.workGroup.leader')" prop="leaderId">
        <ElSelect
          v-model="model.leaderId"
          remote
          filterable
          clearable
          :remote-method="handleLeaderSearch"
          :loading="leaderSearchLoading"
          :placeholder="$t('page.manage.workGroup.form.leader')"
        >
          <ElOption v-for="{ label, value } in leaderOptions" :key="value" :label="label" :value="value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.workGroup.description')" prop="description">
        <ElInput v-model="model.description" type="textarea" :rows="3" />
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.common.status.title')" prop="status">
        <ElRadioGroup v-model="model.status">
          <ElRadio v-for="{ label, value } in statusOptions" :key="value" :value="value" :label="label" />
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.workGroup.sortOrder')" prop="sortOrder">
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
