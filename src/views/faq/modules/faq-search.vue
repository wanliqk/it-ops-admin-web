<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';

defineOptions({ name: 'FaqSearch' });

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel<Api.Faq.FaqSearchParams>('model', { required: true });

const categoryOptions = computed<CommonType.Option<Api.Faq.FaqCategory>[]>(() => [
  { label: $t('page.faq.categoryType.computer'), value: 'computer' },
  { label: $t('page.faq.categoryType.network'), value: 'network' },
  { label: $t('page.faq.categoryType.printer'), value: 'printer' },
  { label: $t('page.faq.categoryType.account'), value: 'account' },
  { label: $t('page.faq.categoryType.other'), value: 'other' }
]);

function reset() {
  emit('reset');
}

function search() {
  emit('search');
}
</script>

<template>
  <ElCard class="card-wrapper">
    <ElCollapse>
      <ElCollapseItem :title="$t('common.search')" name="faq-search">
        <ElForm :model="model" label-position="right" :label-width="80">
          <ElRow :gutter="24">
            <ElCol :lg="8" :md="12" :sm="12">
              <ElFormItem :label="$t('page.faq.keyword')" prop="keyword">
                <ElInput v-model="model.keyword" :placeholder="$t('page.faq.form.keyword')" />
              </ElFormItem>
            </ElCol>
            <ElCol :lg="8" :md="12" :sm="12">
              <ElFormItem :label="$t('page.faq.category')" prop="category">
                <ElSelect v-model="model.category" clearable>
                  <ElOption v-for="{ label, value } in categoryOptions" :key="value" :label="label" :value="value" />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="8" :md="24" :sm="24">
              <ElSpace class="w-full justify-end" alignment="end">
                <ElButton @click="reset">
                  <template #icon>
                    <icon-ic-round-refresh class="text-icon" />
                  </template>
                  {{ $t('common.reset') }}
                </ElButton>
                <ElButton type="primary" plain @click="search">
                  <template #icon>
                    <icon-ic-round-search class="text-icon" />
                  </template>
                  {{ $t('common.search') }}
                </ElButton>
              </ElSpace>
            </ElCol>
          </ElRow>
        </ElForm>
      </ElCollapseItem>
    </ElCollapse>
  </ElCard>
</template>

<style scoped></style>
