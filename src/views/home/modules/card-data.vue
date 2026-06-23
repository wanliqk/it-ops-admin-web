<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { createReusableTemplate } from '@vueuse/core';
import { fetchDashboardSummary } from '@/service/api';
import { $t } from '@/locales';

defineOptions({ name: 'CardData' });

interface CardData {
  key: string;
  title: string;
  value: number;
  unit: string;
  color: {
    start: string;
    end: string;
  };
  icon: string;
}

const summary = ref<Api.Dashboard.Summary>();

async function loadSummary() {
  const { data, error } = await fetchDashboardSummary();

  if (!error) {
    summary.value = data;
  }
}

onMounted(loadSummary);

const cardData = computed<CardData[]>(() => [
  {
    key: 'ticketTotal',
    title: $t('page.home.ticketTotal'),
    value: summary.value?.ticket_total ?? 0,
    unit: '',
    color: {
      start: '#ec4786',
      end: '#b955a4'
    },
    icon: 'ant-design:bar-chart-outlined'
  },
  {
    key: 'ticketPending',
    title: $t('page.home.ticketPending'),
    value: summary.value?.ticket_pending ?? 0,
    unit: '',
    color: {
      start: '#865ec0',
      end: '#5144b4'
    },
    icon: 'ant-design:clock-circle-outlined'
  },
  {
    key: 'assetTotal',
    title: $t('page.home.assetTotal'),
    value: summary.value?.asset_total ?? 0,
    unit: '',
    color: {
      start: '#56cdf3',
      end: '#719de3'
    },
    icon: 'carbon:document-download'
  },
  {
    key: 'assetRepairing',
    title: $t('page.home.assetRepairing'),
    value: summary.value?.asset_repairing ?? 0,
    unit: '',
    color: {
      start: '#fcbc25',
      end: '#f68057'
    },
    icon: 'ant-design:trademark-circle-outlined'
  }
]);

interface GradientBgProps {
  gradientColor: string;
}

const [DefineGradientBg, GradientBg] = createReusableTemplate<GradientBgProps>();

function getGradientColor(color: CardData['color']) {
  return `linear-gradient(to bottom right, ${color.start}, ${color.end})`;
}
</script>

<template>
  <ElCard class="card-wrapper">
    <!-- define component start: GradientBg -->
    <DefineGradientBg v-slot="{ $slots, gradientColor }">
      <div class="rd-8px px-16px pb-4px pt-8px text-white" :style="{ backgroundImage: gradientColor }">
        <component :is="$slots.default" />
      </div>
    </DefineGradientBg>
    <!-- define component end: GradientBg -->
    <ElRow :gutter="16">
      <ElCol v-for="item in cardData" :key="item.key" :lg="6" :md="12" :sm="24" class="my-8px">
        <GradientBg :gradient-color="getGradientColor(item.color)" class="flex-1">
          <h3 class="text-16px">{{ item.title }}</h3>
          <div class="flex justify-between pt-12px">
            <SvgIcon :icon="item.icon" class="text-32px" />
            <CountTo
              :prefix="item.unit"
              :start-value="1"
              :end-value="item.value"
              class="text-30px text-white dark:text-dark"
            />
          </div>
        </GradientBg>
      </ElCol>
    </ElRow>
  </ElCard>
</template>

<style scoped></style>
