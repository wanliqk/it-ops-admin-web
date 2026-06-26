<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { buildTicketStatCards } from '@/constants/ticket-statistics';
import type { TicketStatCardItem } from '@/constants/ticket-statistics';
import { fetchGetTicketStatisticsSummary } from '@/service/api';
import { useRouterPush } from '@/hooks/common/router';
import { useEcharts } from '@/hooks/common/echarts';
import { $t } from '@/locales';

defineOptions({ name: 'TicketStatistics' });

const { routerPushByKey } = useRouterPush();

const loading = ref(false);
const summary = ref<Api.Ticket.TicketStatisticsSummary | null>(null);
const cards = ref<TicketStatCardItem[]>(buildTicketStatCards(null));

const { domRef, updateOptions } = useEcharts(() => ({
  tooltip: { trigger: 'item' },
  legend: { bottom: '1%', left: 'center' },
  series: [
    {
      name: $t('page.ticket.statistics.title'),
      type: 'pie',
      radius: ['45%', '75%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 1 },
      label: { show: false, position: 'center' },
      emphasis: { label: { show: true, fontSize: '12' } },
      labelLine: { show: false },
      data: [] as { name: string; value: number }[]
    }
  ]
}));

function updateChart() {
  updateOptions(opts => {
    opts.series[0].data = cards.value
      .filter(card => card.key !== 'all')
      .map(card => ({ name: card.label, value: card.value }));

    return opts;
  });
}

async function loadSummary() {
  loading.value = true;

  const { data, error } = await fetchGetTicketStatisticsSummary();

  loading.value = false;

  // statistics failing to load shouldn't break the page — cards just keep showing 0
  if (error) return;

  summary.value = data;
  cards.value = buildTicketStatCards(data);
  updateChart();
}

/** turns a card's `{status?, isOverdue?}` filter into a router query (query values must be strings) */
function cardFilterToQuery(filter: TicketStatCardItem['filter']): Record<string, string> {
  const query: Record<string, string> = {};

  if (filter.status) query.status = filter.status;
  if (filter.isOverdue) query.isOverdue = 'true';

  return query;
}

function handleCardClick(card: TicketStatCardItem) {
  routerPushByKey('ticket-manage_list', { query: cardFilterToQuery(card.filter) });
}

onMounted(loadSummary);
</script>

<template>
  <div class="flex-col-stretch gap-16px">
    <ElCard v-loading="loading" class="card-wrapper">
      <template #header>{{ $t('page.ticket.statistics.title') }}</template>
      <p class="text-placeholder mb-16px">{{ $t('page.ticket.statistics.description') }}</p>
      <div class="flex flex-wrap gap-12px">
        <div
          v-for="card in cards"
          :key="card.key"
          class="min-w-140px flex-1 cursor-pointer border border-#d9d9d9 rd-8px px-16px py-12px transition-colors hover:border-primary"
          @click="handleCardClick(card)"
        >
          <div class="text-placeholder text-14px">{{ card.label }}</div>
          <div class="mt-4px text-26px font-medium">{{ card.value }}</div>
        </div>
      </div>
    </ElCard>
    <ElCard class="card-wrapper">
      <template #header>{{ $t('page.ticket.statistics.chartTitle') }}</template>
      <div ref="domRef" class="h-360px overflow-hidden"></div>
    </ElCard>
  </div>
</template>

<style scoped></style>
