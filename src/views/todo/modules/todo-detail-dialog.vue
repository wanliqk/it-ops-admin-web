<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue';
import { getTodoBusinessTypeLabel, getTodoPriorityLabel, getTodoStatusLabel, getTodoTypeLabel } from '@/constants/todo';
import { fetchGetTodoDetail } from '@/service/api';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';
import { goProcessTodo } from './todo-jump';

defineOptions({ name: 'TodoDetailDialog' });

interface Props {
  todoId: number | null;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', { default: false });

const { routerPushByKey } = useRouterPush();

const loading = shallowRef(false);
const detail = shallowRef<Api.Todo.TodoItem | null>(null);

async function loadDetail() {
  if (props.todoId === null) return;

  loading.value = true;
  const { data, error } = await fetchGetTodoDetail(props.todoId);
  loading.value = false;

  if (!error) {
    detail.value = data;
  }
}

watch(visible, () => {
  if (visible.value) {
    loadDetail();
  } else {
    detail.value = null;
  }
});

const statusLabel = computed(() => getTodoStatusLabel());
const priorityLabel = computed(() => getTodoPriorityLabel());
const bizTypeLabel = computed(() => getTodoBusinessTypeLabel());
const todoTypeLabel = computed(() => getTodoTypeLabel());

function closeDialog() {
  visible.value = false;
}

function handleGoProcess() {
  if (!detail.value) return;
  goProcessTodo(detail.value, routerPushByKey);
}
</script>

<template>
  <ElDialog v-model="visible" :title="$t('page.todo.detail')" width="600px">
    <div v-loading="loading">
      <ElDescriptions v-if="detail" label-width="100" :column="2" border>
        <ElDescriptionsItem :label="$t('page.todo.todoNo')">{{ detail.todoNo }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.todo.status')">
          <ElTag>{{ statusLabel[detail.status] }}</ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.todo.todoTitle')" :span="2">{{ detail.title }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.todo.content')" :span="2">{{ detail.content }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.todo.todoType')">{{ todoTypeLabel[detail.todoType] }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.todo.priority')">
          <ElTag>{{ priorityLabel[detail.priority] }}</ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.todo.bizType')">
          {{ bizTypeLabel[detail.businessType] }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.todo.bizId')">{{ detail.businessId ?? '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.todo.bizTitle')">{{ detail.businessTitle ?? '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.todo.bizStatus')">{{ detail.businessStatus ?? '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.todo.assignee')">{{ detail.assigneeName }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.todo.deadlineAt')">{{ detail.deadlineAt ?? '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.todo.completedAt')">{{ detail.completedAt ?? '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.todo.cancelledAt')">{{ detail.cancelledAt ?? '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('common.createTime')">{{ detail.createTime }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.todo.updateTime')">{{ detail.updateTime }}</ElDescriptionsItem>
        <ElDescriptionsItem :label="$t('page.todo.remark')" :span="2">{{ detail.remark ?? '-' }}</ElDescriptionsItem>
      </ElDescriptions>
    </div>
    <template #footer>
      <ElSpace :size="16">
        <ElButton @click="closeDialog">{{ $t('common.close') }}</ElButton>
        <ElButton v-if="detail?.businessId !== null" type="primary" @click="handleGoProcess">
          {{ $t('page.todo.goProcess') }}
        </ElButton>
      </ElSpace>
    </template>
  </ElDialog>
</template>

<style scoped></style>
