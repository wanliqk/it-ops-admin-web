<script setup lang="ts">
import { computed } from 'vue';
import { useForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({ name: 'UserSearch' });

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = useForm();

const model = defineModel<Api.Admin.UserSearchParams>('model', { required: true });

const roleOptions = computed<CommonType.Option<Api.Admin.UserRole>[]>(() => [
  { label: $t('page.manage.user.roleType.admin'), value: 'admin' },
  { label: $t('page.manage.user.roleType.itStaff'), value: 'it_staff' },
  { label: $t('page.manage.user.roleType.employee'), value: 'employee' }
]);

const statusOptions = computed<CommonType.Option<number>[]>(() => [
  { label: $t('page.manage.common.status.enable'), value: 1 },
  { label: $t('page.manage.common.status.disable'), value: 0 }
]);

async function reset() {
  await restoreValidation();
  emit('reset');
}

async function search() {
  await validate();
  emit('search');
}
</script>

<template>
  <ElCard class="card-wrapper">
    <ElCollapse>
      <ElCollapseItem :title="$t('common.search')" name="user-search">
        <ElForm ref="formRef" :model="model" label-position="right" :label-width="80">
          <ElRow :gutter="24">
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.manage.user.keyword')" prop="keyword">
                <ElInput v-model="model.keyword" :placeholder="$t('page.manage.user.form.keyword')" />
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.manage.user.userRole')" prop="role">
                <ElSelect v-model="model.role" clearable :placeholder="$t('page.manage.user.form.userRole')">
                  <ElOption v-for="{ label, value } in roleOptions" :key="value" :label="label" :value="value" />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.manage.user.department')" prop="department">
                <ElInput v-model="model.department" :placeholder="$t('page.manage.user.form.department')" />
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.manage.user.userStatus')" prop="status">
                <ElSelect v-model="model.status" clearable :placeholder="$t('page.manage.user.form.userStatus')">
                  <ElOption v-for="{ label, value } in statusOptions" :key="value" :label="label" :value="value" />
                </ElSelect>
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
