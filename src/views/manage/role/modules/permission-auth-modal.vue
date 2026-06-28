<script setup lang="ts">
import { computed, shallowRef, useTemplateRef, watch } from 'vue';
import { fetchAssignRolePermissions, fetchGetPermissionsGrouped, fetchGetRolePermissions } from '@/service/api';
import { $t } from '@/locales';

defineOptions({ name: 'PermissionAuthModal' });

interface Props {
  /** the roleId */
  roleId: number;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

function closeModal() {
  visible.value = false;
}

const title = computed(() => $t('common.edit') + $t('page.manage.role.permissionAuth'));

interface PermissionTreeNode {
  id: number | string;
  label: string;
  children?: PermissionTreeNode[];
}

const tree = shallowRef<PermissionTreeNode[]>([]);

async function getTree() {
  const { error, data } = await fetchGetPermissionsGrouped();

  if (!error) {
    tree.value = data.map(group => ({
      id: `group-${group.module_name}`,
      label: group.module_name,
      children: group.permissions.map(permission => ({
        id: permission.id,
        label: permission.permission_name
      }))
    }));
  }
}

const treeRef = useTemplateRef<InstanceType<typeof ElTree>>('treeRef');

const checks = shallowRef<(number | string)[]>([]);

async function getChecks() {
  const { error, data } = await fetchGetRolePermissions(props.roleId);

  if (!error) {
    checks.value = data.map(permission => permission.id);
  }
}

async function handleSubmit() {
  const checkedKeys = treeRef.value?.getCheckedKeys() ?? [];
  const permissionIds = checkedKeys.filter((id): id is number => typeof id === 'number');

  const { error } = await fetchAssignRolePermissions(props.roleId, permissionIds);

  if (error) return;

  window.$message?.success?.($t('common.modifySuccess'));

  closeModal();
}

function init() {
  getTree();
  getChecks();
}

watch(visible, val => {
  if (val) {
    init();
  }
});
</script>

<template>
  <ElDialog v-model="visible" :title="title" preset="card" class="w-480px">
    <ElTree
      ref="treeRef"
      :data="tree"
      node-key="id"
      show-checkbox
      class="h-280px overflow-y-auto"
      :default-checked-keys="checks"
    />
    <template #footer>
      <ElSpace class="w-full justify-end">
        <ElButton size="small" class="mt-16px" @click="closeModal">
          {{ $t('common.cancel') }}
        </ElButton>
        <ElButton type="primary" size="small" class="mt-16px" @click="handleSubmit">
          {{ $t('common.confirm') }}
        </ElButton>
      </ElSpace>
    </template>
  </ElDialog>
</template>

<style scoped></style>
