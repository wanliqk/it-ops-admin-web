<script setup lang="ts">
import { computed, onMounted, shallowRef } from 'vue';
import { getAssignStrategyOptions } from '@/constants/ticket-assignment';
import { loadEnabledTicketCategoryOptions } from '@/constants/ticket-category';
import { fetchGetUserOptions, fetchGetWorkGroupList } from '@/service/api';
import { $t } from '@/locales';

defineOptions({ name: 'TicketAssignmentRuleSearch' });

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel<Api.TicketAssignment.RuleSearchParams>('model', { required: true });

const assignStrategyOptions = computed(() => getAssignStrategyOptions());

const priorityOptions = computed<CommonType.Option<Api.Ticket.TicketPriority>[]>(() => [
  { label: $t('page.ticket.priorityType.low'), value: 'low' },
  { label: $t('page.ticket.priorityType.normal'), value: 'normal' },
  { label: $t('page.ticket.priorityType.high'), value: 'high' },
  { label: $t('page.ticket.priorityType.urgent'), value: 'urgent' }
]);

const enabledOptions = computed<CommonType.Option<boolean>[]>(() => [
  { label: $t('page.manage.common.status.enable'), value: true },
  { label: $t('page.manage.common.status.disable'), value: false }
]);

const categoryOptions = shallowRef<CommonType.Option<number>[]>([]);
const opsGroupOptions = shallowRef<CommonType.Option<number>[]>([]);
const targetUserOptions = shallowRef<CommonType.Option<number>[]>([]);

onMounted(async () => {
  const [categoryOptionsResult, groupRes, itStaffRes, adminRes] = await Promise.all([
    loadEnabledTicketCategoryOptions(),
    fetchGetWorkGroupList({ current: 1, size: 100, status: 1 }),
    fetchGetUserOptions('it_staff'),
    fetchGetUserOptions('admin')
  ]);

  categoryOptions.value = categoryOptionsResult.map(({ label, value }) => ({ label, value }));

  if (!groupRes.error) {
    opsGroupOptions.value = groupRes.data.records.map(item => ({ label: item.groupName, value: item.id }));
  }

  targetUserOptions.value = [...(itStaffRes.data ?? []), ...(adminRes.data ?? [])];
});

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
      <ElCollapseItem :title="$t('common.search')" name="ticket-assignment-rule-search">
        <ElForm :model="model" label-position="right" :label-width="100">
          <ElRow :gutter="24">
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.manage.assignmentRule.name')" prop="name">
                <ElInput v-model="model.name" :placeholder="$t('page.manage.assignmentRule.form.name')" />
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.ticket.category')" prop="categoryId">
                <ElSelect v-model="model.categoryId" clearable>
                  <ElOption v-for="{ label, value } in categoryOptions" :key="value" :label="label" :value="value" />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.ticket.priority')" prop="priority">
                <ElSelect v-model="model.priority" clearable>
                  <ElOption v-for="{ label, value } in priorityOptions" :key="value" :label="label" :value="value" />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.manage.assignmentRule.opsGroup')" prop="opsGroupId">
                <ElSelect v-model="model.opsGroupId" clearable>
                  <ElOption v-for="{ label, value } in opsGroupOptions" :key="value" :label="label" :value="value" />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.manage.assignmentRule.targetUser')" prop="targetUserId">
                <ElSelect v-model="model.targetUserId" clearable filterable>
                  <ElOption v-for="{ label, value } in targetUserOptions" :key="value" :label="label" :value="value" />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.manage.assignmentRule.assignStrategy')" prop="assignStrategy">
                <ElSelect v-model="model.assignStrategy" clearable>
                  <ElOption
                    v-for="{ label, value } in assignStrategyOptions"
                    :key="value"
                    :label="label"
                    :value="value"
                  />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.manage.common.status.title')" prop="enabled">
                <ElSelect v-model="model.enabled" clearable>
                  <ElOption
                    v-for="{ label, value } in enabledOptions"
                    :key="String(value)"
                    :label="label"
                    :value="value"
                  />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="24" :sm="24">
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
