<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { fetchCreateUser, fetchUpdateUser } from '@/service/api';
import { useForm, useFormRules } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({ name: 'UserOperateDrawer' });

interface Props {
  /** the type of operation */
  operateType: UI.TableOperateType;
  /** the edit row data */
  rowData?: Api.Admin.User | null;
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
const { defaultRequiredRule, patternRules } = useFormRules();

const title = computed(() => {
  const titles: Record<UI.TableOperateType, string> = {
    add: $t('page.manage.user.addUser'),
    edit: $t('page.manage.user.editUser')
  };
  return titles[props.operateType];
});

const roleOptions: CommonType.Option<Api.Admin.UserRole>[] = [
  { label: $t('page.manage.user.roleType.admin'), value: 'admin' },
  { label: $t('page.manage.user.roleType.itStaff'), value: 'it_staff' },
  { label: $t('page.manage.user.roleType.employee'), value: 'employee' }
];

const statusOptions: CommonType.Option<number>[] = [
  { label: $t('page.manage.common.status.enable'), value: 1 },
  { label: $t('page.manage.common.status.disable'), value: 0 }
];

type Model = Pick<Api.Admin.User, 'userName' | 'realName' | 'role' | 'department' | 'phone' | 'email' | 'status'> & {
  password: string;
};

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    userName: '',
    password: '',
    realName: '',
    role: 'employee',
    department: '',
    phone: '',
    email: '',
    status: 1
  };
}

const isEdit = computed(() => props.operateType === 'edit');

type RuleKey = Extract<keyof Model, 'userName' | 'password' | 'realName' | 'role' | 'status'>;

const rules = computed<Record<RuleKey, App.Global.FormRule | App.Global.FormRule[]>>(() => ({
  userName: defaultRequiredRule,
  password: isEdit.value ? [] : [defaultRequiredRule],
  realName: defaultRequiredRule,
  role: defaultRequiredRule,
  status: defaultRequiredRule
}));

const emailRule = patternRules.email;
const phoneRule = patternRules.phone;

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
      ? await fetchUpdateUser(props.rowData.id, model.value)
      : await fetchCreateUser({
          username: model.value.userName,
          password: model.value.password || '123456',
          realName: model.value.realName,
          role: model.value.role,
          department: model.value.department,
          phone: model.value.phone,
          email: model.value.email,
          status: model.value.status
        });

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
      <ElFormItem :label="$t('page.manage.user.userName')" prop="userName">
        <ElInput v-model="model.userName" :disabled="isEdit" :placeholder="$t('page.manage.user.form.userName')" />
      </ElFormItem>
      <ElFormItem v-if="!isEdit" :label="$t('common.password')" prop="password">
        <ElInput v-model="model.password" type="password" show-password-on="click" />
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.user.realName')" prop="realName">
        <ElInput v-model="model.realName" :placeholder="$t('page.manage.user.form.realName')" />
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.user.userRole')" prop="role">
        <ElSelect v-model="model.role" :placeholder="$t('page.manage.user.form.userRole')">
          <ElOption v-for="{ label, value } in roleOptions" :key="value" :label="label" :value="value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.user.department')" prop="department">
        <ElInput v-model="model.department" :placeholder="$t('page.manage.user.form.department')" />
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.user.userPhone')" prop="phone" :rules="phoneRule">
        <ElInput v-model="model.phone" :placeholder="$t('page.manage.user.form.userPhone')" />
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.user.userEmail')" prop="email" :rules="emailRule">
        <ElInput v-model="model.email" :placeholder="$t('page.manage.user.form.userEmail')" />
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.user.userStatus')" prop="status">
        <ElRadioGroup v-model="model.status">
          <ElRadio v-for="item in statusOptions" :key="item.value" :value="item.value" :label="item.label" />
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
