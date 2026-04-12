import type { Directive, DirectiveBinding, App } from 'vue'
import { useUserStore } from '@/stores/user'

/**
 * 权限指令
 * 使用方式：v-permission="'user:create'" 或 v-permission="['user:create', 'user:edit']"
 */
export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const userStore = useUserStore()
    const { value } = binding
    const permissions = userStore.permissions

    if (!value) return

    // 超级管理员拥有所有权限
    if (permissions.includes('*')) return

    // 权限检查
    const requiredPermissions = Array.isArray(value) ? value : [value]
    const hasPermission = requiredPermissions.some(perm => permissions.includes(perm))

    if (!hasPermission) {
      el.parentNode?.removeChild(el)
    }
  }
}

/**
 * 角色指令
 * 使用方式：v-role="'admin'" 或 v-role="['admin', 'editor']"
 */
export const role: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const userStore = useUserStore()
    const { value } = binding
    const roles = userStore.roles

    if (!value) return

    // 角色检查
    const requiredRoles = Array.isArray(value) ? value : [value]
    const hasRole = requiredRoles.some(role => roles.includes(role))

    if (!hasRole) {
      el.parentNode?.removeChild(el)
    }
  }
}

/**
 * 注册全局指令
 */
export function setupDirectives(app: App) {
  app.directive('permission', permission)
  app.directive('role', role)
}
