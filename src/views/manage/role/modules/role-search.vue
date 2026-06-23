<script setup lang="ts">
import { computed, ref } from 'vue';
import { $t } from '@/locales';

defineOptions({ name: 'RoleSearch' });

const activeName = ref(['role-search']);

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel<Api.Admin.RoleSearchParams>('model', { required: true });

const statusOptions = computed<CommonType.Option<number>[]>(() => [
  { label: $t('page.manage.common.status.enable'), value: 1 },
  { label: $t('page.manage.common.status.disable'), value: 0 }
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
    <ElCollapse v-model="activeName">
      <ElCollapseItem :title="$t('common.search')" name="role-search">
        <ElForm :model="model" label-position="right" :label-width="80">
          <ElRow :gutter="24">
            <ElCol :lg="8" :md="12" :sm="12">
              <ElFormItem :label="$t('page.manage.role.keyword')" prop="keyword">
                <ElInput v-model="model.keyword" :placeholder="$t('page.manage.role.form.keyword')" />
              </ElFormItem>
            </ElCol>
            <ElCol :lg="8" :md="12" :sm="12">
              <ElFormItem :label="$t('page.manage.role.roleStatus')" prop="status">
                <ElSelect v-model="model.status" :placeholder="$t('page.manage.role.form.roleStatus')" clearable>
                  <ElOption
                    v-for="{ label, value } in statusOptions"
                    :key="value"
                    :label="label"
                    :value="value"
                  ></ElOption>
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
