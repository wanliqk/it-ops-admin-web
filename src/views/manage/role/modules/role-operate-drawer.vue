<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useBoolean } from '@sa/hooks';
import { fetchCreateRole, fetchUpdateRole } from '@/service/api';
import { useForm, useFormRules } from '@/hooks/common/form';
import { $t } from '@/locales';
import PermissionAuthModal from './permission-auth-modal.vue';

defineOptions({ name: 'RoleOperateDrawer' });

interface Props {
  /** the type of operation */
  operateType: UI.TableOperateType;
  /** the edit row data */
  rowData?: Api.Admin.Role | null;
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
const { bool: permissionAuthVisible, setTrue: openPermissionAuthModal } = useBoolean();

const title = computed(() => {
  const titles: Record<UI.TableOperateType, string> = {
    add: $t('page.manage.role.addRole'),
    edit: $t('page.manage.role.editRole')
  };
  return titles[props.operateType];
});

type Model = Pick<Api.Admin.Role, 'roleName' | 'roleCode' | 'description' | 'status'>;

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    roleName: '',
    roleCode: '',
    description: '',
    status: 1
  };
}

const statusOptions: CommonType.Option<number>[] = [
  { label: $t('page.manage.common.status.enable'), value: 1 },
  { label: $t('page.manage.common.status.disable'), value: 0 }
];

type RuleKey = Exclude<keyof Model, 'description'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  roleName: defaultRequiredRule,
  roleCode: defaultRequiredRule,
  status: defaultRequiredRule
};

const roleId = computed(() => props.rowData?.id || -1);

const isEdit = computed(() => props.operateType === 'edit');

function handleInitModel() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  const { error } =
    props.operateType === 'edit' && props.rowData
      ? await fetchUpdateRole(props.rowData.id, model.value)
      : await fetchCreateRole(model.value);

  if (error) return;

  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
  }
});
</script>

<template>
  <ElDrawer v-model="visible" :title="title" :size="360">
    <ElForm ref="formRef" :model="model" :rules="rules" label-position="top">
      <ElFormItem :label="$t('page.manage.role.roleName')" prop="roleName">
        <ElInput v-model="model.roleName" :placeholder="$t('page.manage.role.form.roleName')" />
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.role.roleCode')" prop="roleCode">
        <ElInput v-model="model.roleCode" :disabled="isEdit" :placeholder="$t('page.manage.role.form.roleCode')" />
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.role.roleStatus')" prop="status">
        <ElRadioGroup v-model="model.status">
          <ElRadio v-for="{ label, value } in statusOptions" :key="value" :value="value" :label="label" />
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.role.roleDesc')" prop="description">
        <ElInput v-model="model.description" :placeholder="$t('page.manage.role.form.roleDesc')" />
      </ElFormItem>
    </ElForm>
    <ElSpace v-if="isEdit">
      <ElButton @click="openPermissionAuthModal">{{ $t('page.manage.role.permissionAuth') }}</ElButton>
      <PermissionAuthModal v-model:visible="permissionAuthVisible" :role-id="roleId" />
    </ElSpace>
    <template #footer>
      <ElSpace :size="16">
        <ElButton @click="closeDrawer">{{ $t('common.cancel') }}</ElButton>
        <ElButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</ElButton>
      </ElSpace>
    </template>
  </ElDrawer>
</template>

<style scoped></style>
