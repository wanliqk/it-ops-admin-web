<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { fetchGetAssetCategoryList } from '@/service/api';
import { $t } from '@/locales';

defineOptions({ name: 'AssetSearch' });

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel<Api.Asset.AssetSearchParams>('model', { required: true });

const categoryOptions = ref<CommonType.Option<number>[]>([]);

async function loadCategoryOptions() {
  const { data, error } = await fetchGetAssetCategoryList();

  if (!error) {
    categoryOptions.value = data.map(item => ({ label: item.categoryName, value: item.id }));
  }
}

onMounted(loadCategoryOptions);

const statusOptions = computed<CommonType.Option<Api.Asset.AssetStatus>[]>(() => [
  { label: $t('page.assetManage.asset.statusType.inUse'), value: 'in_use' },
  { label: $t('page.assetManage.asset.statusType.idle'), value: 'idle' },
  { label: $t('page.assetManage.asset.statusType.repairing'), value: 'repairing' },
  { label: $t('page.assetManage.asset.statusType.scrapped'), value: 'scrapped' }
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
      <ElCollapseItem :title="$t('common.search')" name="asset-search">
        <ElForm :model="model" label-position="right" :label-width="80">
          <ElRow :gutter="24">
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.assetManage.asset.keyword')" prop="keyword">
                <ElInput v-model="model.keyword" :placeholder="$t('page.assetManage.asset.form.keyword')" />
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.assetManage.asset.category')" prop="categoryId">
                <ElSelect
                  v-model="model.categoryId"
                  clearable
                  :placeholder="$t('page.assetManage.asset.form.category')"
                >
                  <ElOption v-for="{ label, value } in categoryOptions" :key="value" :label="label" :value="value" />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.assetManage.asset.status')" prop="status">
                <ElSelect v-model="model.status" clearable :placeholder="$t('page.assetManage.asset.form.status')">
                  <ElOption v-for="{ label, value } in statusOptions" :key="value" :label="label" :value="value" />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.assetManage.asset.department')" prop="department">
                <ElInput v-model="model.department" :placeholder="$t('page.assetManage.asset.form.department')" />
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="16" :sm="24">
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
