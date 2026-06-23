<script setup lang="ts">
import { ref, watch } from 'vue';
import { fetchGetAssetRepairRecords } from '@/service/api';
import { $t } from '@/locales';

defineOptions({ name: 'AssetDetailDialog' });

interface Props {
  rowData?: Api.Asset.Asset | null;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const repairRecords = ref<Api.Asset.RepairRecord[]>([]);
const loading = ref(false);

async function loadRepairRecords() {
  if (!props.rowData) return;

  loading.value = true;
  const { data, error } = await fetchGetAssetRepairRecords(props.rowData.id);
  loading.value = false;

  if (!error) {
    repairRecords.value = data;
  }
}

watch(visible, val => {
  if (val) {
    loadRepairRecords();
  }
});
</script>

<template>
  <ElDialog v-model="visible" :title="$t('page.assetManage.asset.detail')" width="640px">
    <ElDescriptions v-if="rowData" :column="2" border>
      <ElDescriptionsItem :label="$t('page.assetManage.asset.assetNo')">{{ rowData.assetNo }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('page.assetManage.asset.assetName')">{{ rowData.assetName }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('page.assetManage.asset.category')">{{ rowData.categoryName }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('page.assetManage.asset.brand')">{{ rowData.brand }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('page.assetManage.asset.model')">{{ rowData.model }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('page.assetManage.asset.serialNo')">{{ rowData.serialNo }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('page.assetManage.asset.assignee')">{{ rowData.userName }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('page.assetManage.asset.department')">{{ rowData.department }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('page.assetManage.asset.location')">{{ rowData.location }}</ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('page.assetManage.asset.purchaseDate')">
        {{ rowData.purchaseDate }}
      </ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('page.assetManage.asset.warrantyExpireDate')">
        {{ rowData.warrantyExpireDate }}
      </ElDescriptionsItem>
      <ElDescriptionsItem :label="$t('page.assetManage.asset.remark')" :span="2">
        {{ rowData.remark }}
      </ElDescriptionsItem>
    </ElDescriptions>
    <ElDivider />
    <p class="mb-12px font-medium">{{ $t('page.assetManage.asset.repairHistory') }}</p>
    <ElTable v-loading="loading" :data="repairRecords" border max-height="300">
      <ElTableColumn prop="ticketNo" :label="$t('page.assetManage.repairRecord.ticketNo')" min-width="140" />
      <ElTableColumn prop="repairUserName" :label="$t('page.assetManage.repairRecord.repairUser')" min-width="100" />
      <ElTableColumn prop="faultReason" :label="$t('page.assetManage.repairRecord.faultReason')" min-width="160" />
      <ElTableColumn prop="repairedAt" :label="$t('page.assetManage.repairRecord.repairedAt')" min-width="140" />
    </ElTable>
  </ElDialog>
</template>

<style scoped></style>
