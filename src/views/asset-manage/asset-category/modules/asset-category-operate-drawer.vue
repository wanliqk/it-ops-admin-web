<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { fetchCreateAssetCategory, fetchUpdateAssetCategory } from '@/service/api';
import { useForm, useFormRules } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({ name: 'AssetCategoryOperateDrawer' });

interface Props {
  operateType: UI.TableOperateType;
  rowData?: Api.Asset.AssetCategory | null;
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
    add: $t('page.assetManage.assetCategory.addCategory'),
    edit: $t('page.assetManage.assetCategory.editCategory')
  };
  return titles[props.operateType];
});

type Model = Pick<Api.Asset.AssetCategory, 'categoryName' | 'categoryCode' | 'description' | 'status'>;

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    categoryName: '',
    categoryCode: '',
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
  categoryName: defaultRequiredRule,
  categoryCode: defaultRequiredRule,
  status: defaultRequiredRule
};

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
      ? await fetchUpdateAssetCategory(props.rowData.id, model.value)
      : await fetchCreateAssetCategory(model.value);

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
      <ElFormItem :label="$t('page.assetManage.assetCategory.categoryName')" prop="categoryName">
        <ElInput v-model="model.categoryName" :placeholder="$t('page.assetManage.assetCategory.form.categoryName')" />
      </ElFormItem>
      <ElFormItem :label="$t('page.assetManage.assetCategory.categoryCode')" prop="categoryCode">
        <ElInput
          v-model="model.categoryCode"
          :disabled="isEdit"
          :placeholder="$t('page.assetManage.assetCategory.form.categoryCode')"
        />
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.common.status.title')" prop="status">
        <ElRadioGroup v-model="model.status">
          <ElRadio v-for="{ label, value } in statusOptions" :key="value" :value="value" :label="label" />
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem :label="$t('page.assetManage.assetCategory.description')" prop="description">
        <ElInput
          v-model="model.description"
          type="textarea"
          :placeholder="$t('page.assetManage.assetCategory.form.description')"
        />
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
