import type { App, Directive } from 'vue';
import { useAuthStore } from '@/store/modules/auth';

const permissionDirective: Directive<HTMLElement, string | string[]> = {
  mounted: applyPermission,
  updated: applyPermission
};

function applyPermission(el: HTMLElement, binding: { value: string | string[] }) {
  const authStore = useAuthStore();
  const codes = Array.isArray(binding.value) ? binding.value : [binding.value];

  const allowed = authStore.isLogin && codes.some(code => authStore.userInfo.permissions.includes(code));

  if (!allowed) {
    el.remove();
  }
}

/** `v-permission="'user:create'"` or `v-permission="['user:create', 'user:update']"` (OR match) */
export function setupPermissionDirective(app: App) {
  app.directive('permission', permissionDirective);
}
