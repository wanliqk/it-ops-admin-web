<script setup lang="ts">
import { ref } from 'vue';
import { loadEnabledTicketCategoryOptions } from '@/constants/ticket-category';
import { $t } from '@/locales';

defineOptions({ name: 'TicketCategorySearch' });

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel<Api.TicketCategory.TicketCategorySearchParams>('model', { required: true });

const statusOptions: CommonType.Option<number>[] = [
  { label: $t('page.manage.common.status.enable'), value: 1 },
  { label: $t('page.manage.common.status.disable'), value: 0 }
];

const parentOptions = ref<CommonType.Option<number>[]>([]);

async function loadParentOptions() {
  const options = await loadEnabledTicketCategoryOptions();
  parentOptions.value = options.map(({ label, value }) => ({ label, value }));
}

loadParentOptions();

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
      <ElCollapseItem :title="$t('common.search')" name="ticket-category-search">
        <ElForm :model="model" label-position="right" :label-width="90">
          <ElRow :gutter="24">
            <ElCol :lg="8" :md="12" :sm="12">
              <ElFormItem :label="$t('page.manage.ticketCategory.keyword')" prop="keyword">
                <ElInput v-model="model.keyword" :placeholder="$t('page.manage.ticketCategory.form.keyword')" />
              </ElFormItem>
            </ElCol>
            <ElCol :lg="8" :md="12" :sm="12">
              <ElFormItem :label="$t('page.manage.ticketCategory.parentCategory')" prop="parentId">
                <ElSelect v-model="model.parentId" clearable>
                  <ElOption v-for="{ label, value } in parentOptions" :key="value" :label="label" :value="value" />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="8" :md="12" :sm="12">
              <ElFormItem :label="$t('page.manage.common.status.title')" prop="status">
                <ElSelect v-model="model.status" clearable>
                  <ElOption v-for="{ label, value } in statusOptions" :key="value" :label="label" :value="value" />
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
