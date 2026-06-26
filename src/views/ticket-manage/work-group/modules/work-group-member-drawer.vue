<script setup lang="tsx">
import { computed, ref, watch } from 'vue';
import { fetchGetWorkGroupMemberList, fetchRemoveWorkGroupMember } from '@/service/api';
import { defaultTransform, useTableOperate, useUIPaginatedTable } from '@/hooks/common/table';
import { $t } from '@/locales';
import WorkGroupMemberOperateDialog from './work-group-member-operate-dialog.vue';

defineOptions({ name: 'WorkGroupMemberDrawer' });

interface Props {
  groupId: number | null;
  groupName: string;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'memberChanged'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', { default: false });

const memberRoleLabel: Record<Api.WorkGroup.MemberRole, string> = {
  leader: $t('page.manage.workGroup.member.roleType.leader'),
  member: $t('page.manage.workGroup.member.roleType.member')
};

const searchParams = ref(getInitSearchParams());

function getInitSearchParams(): Api.WorkGroup.WorkGroupMemberSearchParams {
  return {
    current: 1,
    size: 10,
    keyword: undefined,
    status: undefined
  };
}

const { columns, data, getData, getDataByPage, loading, mobilePagination } = useUIPaginatedTable({
  paginationProps: {
    currentPage: searchParams.value.current,
    pageSize: searchParams.value.size
  },
  api: () => fetchGetWorkGroupMemberList(props.groupId!, searchParams.value),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.value.current = params.currentPage;
    searchParams.value.size = params.pageSize;
  },
  columns: () => [
    { prop: 'username', label: $t('page.manage.workGroup.member.username'), width: 130 },
    { prop: 'realName', label: $t('page.manage.workGroup.member.realName'), width: 110 },
    { prop: 'phone', label: $t('page.manage.workGroup.member.phone'), width: 130 },
    {
      prop: 'memberRole',
      label: $t('page.manage.workGroup.member.memberRole'),
      width: 100,
      formatter: row => (
        <ElTag type={row.memberRole === 'leader' ? 'primary' : 'info'}>{memberRoleLabel[row.memberRole]}</ElTag>
      )
    },
    {
      prop: 'status',
      label: $t('page.manage.common.status.title'),
      width: 100,
      formatter: row => (
        <ElTag type={row.status === 1 ? 'success' : 'warning'}>
          {row.status === 1 ? $t('page.manage.common.status.enable') : $t('page.manage.common.status.disable')}
        </ElTag>
      )
    },
    { prop: 'joinedAt', label: $t('page.manage.workGroup.member.joinedAt'), width: 160 },
    {
      prop: 'operate',
      label: $t('common.operate'),
      align: 'center',
      width: 160,
      formatter: row => (
        <div class="flex-center gap-8px">
          <ElButton type="primary" plain size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </ElButton>
          <ElPopconfirm
            title={$t('page.manage.workGroup.member.confirmRemove')}
            onConfirm={() => handleRemove(row.userId)}
          >
            {{
              reference: () => (
                <ElButton type="danger" plain size="small">
                  {$t('page.manage.workGroup.member.remove')}
                </ElButton>
              )
            }}
          </ElPopconfirm>
        </div>
      )
    }
  ]
});

const {
  drawerVisible: dialogVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit
} = useTableOperate(data, 'id', getData);

function edit(id: number) {
  handleEdit(id);
}

async function handleRemove(userId: number) {
  if (props.groupId === null) return;

  const { error } = await fetchRemoveWorkGroupMember(props.groupId, userId);

  if (!error) {
    window.$message?.success($t('common.deleteSuccess'));
    await getData();
    emit('memberChanged');
  }
}

function handleMemberSubmitted() {
  getData();
  emit('memberChanged');
}

function resetSearchParams() {
  searchParams.value = getInitSearchParams();
  getData();
}

const drawerTitle = computed(() => $t('page.manage.workGroup.member.title', { groupName: props.groupName }));

watch(visible, () => {
  if (visible.value && props.groupId !== null) {
    searchParams.value = getInitSearchParams();
    getData();
  }
});
</script>

<template>
  <ElDrawer v-model="visible" :title="drawerTitle" :size="800">
    <div class="flex-col-stretch gap-16px">
      <ElCard class="card-wrapper">
        <ElForm :model="searchParams" label-position="right" :label-width="80" inline>
          <ElFormItem :label="$t('page.manage.workGroup.member.keyword')" prop="keyword">
            <ElInput v-model="searchParams.keyword" :placeholder="$t('page.manage.workGroup.member.form.keyword')" />
          </ElFormItem>
          <ElFormItem :label="$t('page.manage.common.status.title')" prop="status">
            <ElSelect v-model="searchParams.status" clearable class="w-140px">
              <ElOption :label="$t('page.manage.common.status.enable')" :value="1" />
              <ElOption :label="$t('page.manage.common.status.disable')" :value="0" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem>
            <ElSpace>
              <ElButton @click="resetSearchParams">{{ $t('common.reset') }}</ElButton>
              <ElButton type="primary" plain @click="() => getDataByPage()">{{ $t('common.search') }}</ElButton>
            </ElSpace>
          </ElFormItem>
        </ElForm>
      </ElCard>
      <ElCard class="card-wrapper">
        <template #header>
          <div class="flex items-center justify-between">
            <p>{{ $t('page.manage.workGroup.member.listTitle') }}</p>
            <ElButton type="primary" plain @click="handleAdd">
              <template #icon>
                <icon-ic-round-plus class="text-icon" />
              </template>
              {{ $t('page.manage.workGroup.member.addMember') }}
            </ElButton>
          </div>
        </template>
        <ElTable v-loading="loading" border :data="data" row-key="id">
          <ElTableColumn v-for="col in columns" :key="col.prop" v-bind="col" />
        </ElTable>
        <div class="mt-20px flex justify-end">
          <ElPagination
            v-if="mobilePagination.total"
            layout="total,prev,pager,next,sizes"
            v-bind="mobilePagination"
            @current-change="mobilePagination['current-change']"
            @size-change="mobilePagination['size-change']"
          />
        </div>
      </ElCard>
    </div>
    <WorkGroupMemberOperateDialog
      v-if="groupId !== null"
      v-model:visible="dialogVisible"
      :operate-type="operateType"
      :group-id="groupId"
      :row-data="editingData"
      @submitted="handleMemberSubmitted"
    />
  </ElDrawer>
</template>

<style scoped></style>
