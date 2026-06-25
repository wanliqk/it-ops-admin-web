<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { createReusableTemplate } from '@vueuse/core';
import { fetchGetMyTodoStatistics } from '@/service/api';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';

defineOptions({ name: 'TodoStatCard' });

const { routerPushByKey } = useRouterPush();

const statistics = ref<Api.Todo.TodoStatistics>();

async function loadStatistics() {
  const { data, error } = await fetchGetMyTodoStatistics();

  if (!error) {
    statistics.value = data ?? undefined;
  }
}

onMounted(loadStatistics);

interface StatCard {
  key: string;
  title: string;
  value: number;
  color: {
    start: string;
    end: string;
  };
  icon: string;
  query: Record<string, string>;
}

const cardData = computed<StatCard[]>(() => [
  {
    key: 'pending',
    title: $t('page.home.todoPendingCount'),
    value: statistics.value?.pendingCount ?? 0,
    color: { start: '#ec4786', end: '#b955a4' },
    icon: 'ant-design:clock-circle-outlined',
    query: { status: 'pending' } as Record<string, string>
  },
  {
    key: 'processing',
    title: $t('page.home.todoProcessingCount'),
    value: statistics.value?.processingCount ?? 0,
    color: { start: '#865ec0', end: '#5144b4' },
    icon: 'ant-design:sync-outlined',
    query: { status: 'processing' } as Record<string, string>
  },
  {
    key: 'expired',
    title: $t('page.home.todoExpiredCount'),
    value: statistics.value?.expiredCount ?? 0,
    color: { start: '#f56c6c', end: '#c45656' },
    icon: 'ant-design:exclamation-circle-outlined',
    query: { status: 'expired' } as Record<string, string>
  },
  {
    key: 'todayDeadline',
    title: $t('page.home.todoTodayDeadlineCount'),
    value: statistics.value?.todayDeadlineCount ?? 0,
    color: { start: '#56cdf3', end: '#719de3' },
    icon: 'ant-design:calendar-outlined',
    query: {} as Record<string, string>
  },
  {
    key: 'urgent',
    title: $t('page.home.todoUrgentCount'),
    value: statistics.value?.urgentCount ?? 0,
    color: { start: '#fcbc25', end: '#f68057' },
    icon: 'ant-design:fire-outlined',
    query: { priority: 'urgent' } as Record<string, string>
  }
]);

function handleCardClick(card: StatCard) {
  routerPushByKey('todo_my-todo', { query: card.query });
}

interface GradientBgProps {
  gradientColor: string;
}

const [DefineGradientBg, GradientBg] = createReusableTemplate<GradientBgProps>();

function getGradientColor(color: StatCard['color']) {
  return `linear-gradient(to bottom right, ${color.start}, ${color.end})`;
}
</script>

<template>
  <ElCard class="card-wrapper">
    <template #header>{{ $t('page.home.todoStatistics') }}</template>
    <DefineGradientBg v-slot="{ $slots, gradientColor }">
      <div class="rd-8px px-16px pb-4px pt-8px text-white" :style="{ backgroundImage: gradientColor }">
        <component :is="$slots.default" />
      </div>
    </DefineGradientBg>
    <ElRow :gutter="16">
      <ElCol v-for="item in cardData" :key="item.key" :lg="5" :md="8" :sm="24" class="my-8px">
        <GradientBg
          :gradient-color="getGradientColor(item.color)"
          class="flex-1 cursor-pointer"
          @click="handleCardClick(item)"
        >
          <h3 class="text-16px">{{ item.title }}</h3>
          <div class="flex justify-between pt-12px">
            <SvgIcon :icon="item.icon" class="text-32px" />
            <CountTo :start-value="0" :end-value="item.value" class="text-30px text-white dark:text-dark" />
          </div>
        </GradientBg>
      </ElCol>
    </ElRow>
  </ElCard>
</template>

<style scoped></style>
