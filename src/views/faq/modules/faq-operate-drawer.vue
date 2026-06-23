<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { fetchCreateFaq, fetchGetFaqDetail, fetchUpdateFaq } from '@/service/api';
import { useForm, useFormRules } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({ name: 'FaqOperateDrawer' });

interface Props {
  operateType: UI.TableOperateType;
  rowData?: Api.Faq.Faq | null;
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
    add: $t('page.faq.addFaq'),
    edit: $t('page.faq.editFaq')
  };
  return titles[props.operateType];
});

interface Model {
  title: string;
  category: Api.Faq.FaqCategory | undefined;
  summary: string;
  content: string;
  sortOrder: number;
  status: number;
}

const model = ref<Model>(createDefaultModel());

function createDefaultModel(): Model {
  return { title: '', category: undefined, summary: '', content: '', sortOrder: 0, status: 1 };
}

const rules: Record<'title' | 'category' | 'content' | 'status', App.Global.FormRule> = {
  title: defaultRequiredRule,
  category: defaultRequiredRule,
  content: defaultRequiredRule,
  status: defaultRequiredRule
};

const categoryOptions = computed<CommonType.Option<Api.Faq.FaqCategory>[]>(() => [
  { label: $t('page.faq.categoryType.computer'), value: 'computer' },
  { label: $t('page.faq.categoryType.network'), value: 'network' },
  { label: $t('page.faq.categoryType.printer'), value: 'printer' },
  { label: $t('page.faq.categoryType.account'), value: 'account' },
  { label: $t('page.faq.categoryType.other'), value: 'other' }
]);

const statusOptions: CommonType.Option<number>[] = [
  { label: $t('page.manage.common.status.enable'), value: 1 },
  { label: $t('page.manage.common.status.disable'), value: 0 }
];

async function handleInitModel() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    const { data, error } = await fetchGetFaqDetail(props.rowData.id);

    if (!error) {
      model.value = {
        title: data.title,
        category: data.category,
        summary: data.summary,
        content: data.content,
        sortOrder: data.sortOrder,
        status: data.status
      };
    }
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  if (!model.value.category) return;

  const params = {
    title: model.value.title,
    category: model.value.category,
    summary: model.value.summary,
    content: model.value.content,
    sortOrder: model.value.sortOrder,
    status: model.value.status
  };

  const { error } =
    props.operateType === 'edit' && props.rowData
      ? await fetchUpdateFaq(props.rowData.id, params)
      : await fetchCreateFaq(params);

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
      <ElFormItem :label="$t('page.faq.faqTitle')" prop="title">
        <ElInput v-model="model.title" :placeholder="$t('page.faq.form.title')" />
      </ElFormItem>
      <ElFormItem :label="$t('page.faq.category')" prop="category">
        <ElSelect v-model="model.category" :placeholder="$t('page.faq.form.category')">
          <ElOption v-for="{ label, value } in categoryOptions" :key="value" :label="label" :value="value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('page.faq.summary')" prop="summary">
        <ElInput v-model="model.summary" :placeholder="$t('page.faq.form.summary')" />
      </ElFormItem>
      <ElFormItem :label="$t('page.faq.content')" prop="content">
        <ElInput v-model="model.content" type="textarea" :rows="6" :placeholder="$t('page.faq.form.content')" />
      </ElFormItem>
      <ElFormItem :label="$t('page.faq.sortOrder')" prop="sortOrder">
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
