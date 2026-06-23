<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { fetchCreateAsset, fetchGetAssetCategoryList, fetchGetUserOptions, fetchUpdateAsset } from '@/service/api';
import { useForm, useFormRules } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({ name: 'AssetOperateDrawer' });

interface Props {
  operateType: UI.TableOperateType;
  rowData?: Api.Asset.Asset | null;
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
    add: $t('page.assetManage.asset.addAsset'),
    edit: $t('page.assetManage.asset.editAsset')
  };
  return titles[props.operateType];
});

type Model = Pick<
  Api.Asset.Asset,
  | 'assetNo'
  | 'assetName'
  | 'categoryId'
  | 'brand'
  | 'model'
  | 'serialNo'
  | 'userId'
  | 'department'
  | 'location'
  | 'status'
  | 'purchaseDate'
  | 'warrantyExpireDate'
  | 'remark'
>;

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    assetNo: '',
    assetName: '',
    categoryId: undefined as unknown as number,
    brand: '',
    model: '',
    serialNo: '',
    userId: null,
    department: '',
    location: '',
    status: 'in_use',
    purchaseDate: '',
    warrantyExpireDate: '',
    remark: ''
  };
}

const isEdit = computed(() => props.operateType === 'edit');

const categoryOptions = ref<CommonType.Option<number>[]>([]);
const userOptions = ref<CommonType.Option<number>[]>([]);

async function loadOptions() {
  const [categoryRes, userRes] = await Promise.all([fetchGetAssetCategoryList(), fetchGetUserOptions()]);

  if (!categoryRes.error) {
    categoryOptions.value = categoryRes.data.map(item => ({ label: item.categoryName, value: item.id }));
  }

  if (!userRes.error && userRes.data) {
    userOptions.value = userRes.data;
  }
}

onMounted(loadOptions);

const statusOptions = computed<CommonType.Option<Api.Asset.AssetStatus>[]>(() => [
  { label: $t('page.assetManage.asset.statusType.inUse'), value: 'in_use' },
  { label: $t('page.assetManage.asset.statusType.idle'), value: 'idle' },
  { label: $t('page.assetManage.asset.statusType.repairing'), value: 'repairing' },
  { label: $t('page.assetManage.asset.statusType.scrapped'), value: 'scrapped' }
]);

type RuleKey = Extract<keyof Model, 'assetNo' | 'assetName' | 'categoryId' | 'status'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  assetNo: defaultRequiredRule,
  assetName: defaultRequiredRule,
  categoryId: defaultRequiredRule,
  status: defaultRequiredRule
};

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
      ? await fetchUpdateAsset(props.rowData.id, model.value)
      : await fetchCreateAsset(model.value);

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
  <ElDrawer v-model="visible" :title="title" :size="420">
    <ElForm ref="formRef" :model="model" :rules="rules" label-position="top">
      <ElFormItem :label="$t('page.assetManage.asset.assetNo')" prop="assetNo">
        <ElInput v-model="model.assetNo" :disabled="isEdit" :placeholder="$t('page.assetManage.asset.form.assetNo')" />
      </ElFormItem>
      <ElFormItem :label="$t('page.assetManage.asset.assetName')" prop="assetName">
        <ElInput v-model="model.assetName" :placeholder="$t('page.assetManage.asset.form.assetName')" />
      </ElFormItem>
      <ElFormItem :label="$t('page.assetManage.asset.category')" prop="categoryId">
        <ElSelect v-model="model.categoryId" :placeholder="$t('page.assetManage.asset.form.category')">
          <ElOption v-for="{ label, value } in categoryOptions" :key="value" :label="label" :value="value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('page.assetManage.asset.brand')" prop="brand">
        <ElInput v-model="model.brand" :placeholder="$t('page.assetManage.asset.form.brand')" />
      </ElFormItem>
      <ElFormItem :label="$t('page.assetManage.asset.model')" prop="model">
        <ElInput v-model="model.model" :placeholder="$t('page.assetManage.asset.form.model')" />
      </ElFormItem>
      <ElFormItem :label="$t('page.assetManage.asset.serialNo')" prop="serialNo">
        <ElInput v-model="model.serialNo" :placeholder="$t('page.assetManage.asset.form.serialNo')" />
      </ElFormItem>
      <ElFormItem :label="$t('page.assetManage.asset.assignee')" prop="userId">
        <ElSelect v-model="model.userId" clearable :placeholder="$t('page.assetManage.asset.form.assignee')">
          <ElOption v-for="{ label, value } in userOptions" :key="value" :label="label" :value="value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('page.assetManage.asset.department')" prop="department">
        <ElInput v-model="model.department" :placeholder="$t('page.assetManage.asset.form.department')" />
      </ElFormItem>
      <ElFormItem :label="$t('page.assetManage.asset.location')" prop="location">
        <ElInput v-model="model.location" :placeholder="$t('page.assetManage.asset.form.location')" />
      </ElFormItem>
      <ElFormItem :label="$t('page.assetManage.asset.status')" prop="status">
        <ElRadioGroup v-model="model.status">
          <ElRadio v-for="{ label, value } in statusOptions" :key="value" :value="value" :label="label" />
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem :label="$t('page.assetManage.asset.purchaseDate')" prop="purchaseDate">
        <ElDatePicker
          v-model="model.purchaseDate"
          type="date"
          value-format="YYYY-MM-DD"
          class="w-full"
          :placeholder="$t('page.assetManage.asset.form.purchaseDate')"
        />
      </ElFormItem>
      <ElFormItem :label="$t('page.assetManage.asset.warrantyExpireDate')" prop="warrantyExpireDate">
        <ElDatePicker
          v-model="model.warrantyExpireDate"
          type="date"
          value-format="YYYY-MM-DD"
          class="w-full"
          :placeholder="$t('page.assetManage.asset.form.warrantyExpireDate')"
        />
      </ElFormItem>
      <ElFormItem :label="$t('page.assetManage.asset.remark')" prop="remark">
        <ElInput v-model="model.remark" type="textarea" :placeholder="$t('page.assetManage.asset.form.remark')" />
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
