<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { fetchAddWorkGroupMember, fetchUpdateWorkGroupMember } from '@/service/api';
import { useForm, useFormRules } from '@/hooks/common/form';
import { $t } from '@/locales';
import { searchActiveUserOptions } from './user-options';

defineOptions({ name: 'WorkGroupMemberOperateDialog' });

interface Props {
  operateType: UI.TableOperateType;
  groupId: number;
  rowData?: Api.WorkGroup.WorkGroupMember | null;
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
    add: $t('page.manage.workGroup.member.addMember'),
    edit: $t('page.manage.workGroup.member.editMember')
  };
  return titles[props.operateType];
});

interface Model {
  userId: number | null;
  memberRole: Api.WorkGroup.MemberRole;
  status: number;
}

function createDefaultModel(): Model {
  return { userId: null, memberRole: 'member', status: 1 };
}

const model = ref<Model>(createDefaultModel());

const userOptions = ref<CommonType.Option<number>[]>([]);
const userSearchLoading = ref(false);

async function handleUserSearch(keyword: string) {
  userSearchLoading.value = true;
  userOptions.value = await searchActiveUserOptions(keyword);
  userSearchLoading.value = false;
}

const memberRoleOptions = computed<CommonType.Option<Api.WorkGroup.MemberRole>[]>(() => [
  { label: $t('page.manage.workGroup.member.roleType.member'), value: 'member' },
  { label: $t('page.manage.workGroup.member.roleType.leader'), value: 'leader' }
]);

const statusOptions: CommonType.Option<number>[] = [
  { label: $t('page.manage.common.status.enable'), value: 1 },
  { label: $t('page.manage.common.status.disable'), value: 0 }
];

const rules = computed<Record<'userId' | 'memberRole', App.Global.FormRule>>(() => ({
  userId: defaultRequiredRule,
  memberRole: defaultRequiredRule
}));

function closeDialog() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  const { error } =
    props.operateType === 'edit' && props.rowData
      ? await fetchUpdateWorkGroupMember(props.groupId, props.rowData.userId, {
          memberRole: model.value.memberRole,
          status: model.value.status
        })
      : await fetchAddWorkGroupMember(props.groupId, model.value.userId!, model.value.memberRole);

  if (error) return;

  window.$message?.success($t('common.updateSuccess'));
  closeDialog();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    if (props.operateType === 'edit' && props.rowData) {
      model.value = {
        userId: props.rowData.userId,
        memberRole: props.rowData.memberRole,
        status: props.rowData.status
      };
      userOptions.value = [
        {
          label: `${props.rowData.realName} / ${props.rowData.username} / ${props.rowData.phone}`,
          value: props.rowData.userId
        }
      ];
    } else {
      model.value = createDefaultModel();
      userOptions.value = [];
    }
    restoreValidation();
  }
});
</script>

<template>
  <ElDialog v-model="visible" :title="title" width="480px">
    <ElForm ref="formRef" :model="model" :rules="rules" label-position="top">
      <ElFormItem :label="$t('page.manage.workGroup.member.user')" prop="userId">
        <ElSelect
          v-model="model.userId"
          remote
          filterable
          :disabled="operateType === 'edit'"
          :remote-method="handleUserSearch"
          :loading="userSearchLoading"
          :placeholder="$t('page.manage.workGroup.member.form.user')"
        >
          <ElOption v-for="{ label, value } in userOptions" :key="value" :label="label" :value="value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.workGroup.member.memberRole')" prop="memberRole">
        <ElRadioGroup v-model="model.memberRole">
          <ElRadio v-for="{ label, value } in memberRoleOptions" :key="value" :value="value" :label="label" />
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem v-if="operateType === 'edit'" :label="$t('page.manage.common.status.title')" prop="status">
        <ElRadioGroup v-model="model.status">
          <ElRadio v-for="{ label, value } in statusOptions" :key="value" :value="value" :label="label" />
        </ElRadioGroup>
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
