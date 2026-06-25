<script setup lang="ts">
import { computed } from 'vue';
import {
  getTodoBusinessTypeOptions,
  getTodoPriorityOptions,
  getTodoStatusOptions,
  getTodoTypeOptions
} from '@/constants/todo';
import { $t } from '@/locales';

defineOptions({ name: 'MyTodoSearch' });

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel<Api.Todo.TodoSearchParams>('model', { required: true });

const statusOptions = computed(() => getTodoStatusOptions());
const priorityOptions = computed(() => getTodoPriorityOptions());
const businessTypeOptions = computed(() => getTodoBusinessTypeOptions());
const todoTypeOptions = computed(() => getTodoTypeOptions());

const dateRange = computed<[string, string] | null>({
  get() {
    return model.value.startDate && model.value.endDate ? [model.value.startDate, model.value.endDate] : null;
  },
  set(val) {
    model.value.startDate = val?.[0];
    model.value.endDate = val?.[1];
  }
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
      <ElCollapseItem :title="$t('common.search')" name="my-todo-search">
        <ElForm :model="model" label-position="right" :label-width="90">
          <ElRow :gutter="24">
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.todo.myTodo.keyword')" prop="keyword">
                <ElInput v-model="model.keyword" :placeholder="$t('page.todo.myTodo.form.keyword')" />
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.todo.status')" prop="status">
                <ElSelect v-model="model.status" clearable>
                  <ElOption v-for="{ label, value } in statusOptions" :key="value" :label="label" :value="value" />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.todo.todoType')" prop="todoType">
                <ElSelect v-model="model.todoType" clearable>
                  <ElOption v-for="{ label, value } in todoTypeOptions" :key="value" :label="label" :value="value" />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.todo.bizType')" prop="businessType">
                <ElSelect v-model="model.businessType" clearable>
                  <ElOption
                    v-for="{ label, value } in businessTypeOptions"
                    :key="value"
                    :label="label"
                    :value="value"
                  />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.todo.priority')" prop="priority">
                <ElSelect v-model="model.priority" clearable>
                  <ElOption v-for="{ label, value } in priorityOptions" :key="value" :label="label" :value="value" />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="12" :md="16" :sm="24">
              <ElFormItem :label="$t('common.createTime')" prop="startDate">
                <ElDatePicker v-model="dateRange" type="daterange" value-format="YYYY-MM-DD" class="w-full" />
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
