/**
 * 权限指令模块
 *
 * 提供两个全局指令：
 * - v-permission：基于权限标识控制元素显示
 * - v-role：基于角色控制元素显示
 *
 * 原理：通过从 userStore 读取当前用户的权限/角色列表，
 * 判断是否包含指令值，如不匹配则从 DOM 中移除对应元素。
 *
 * 使用方式：
 *   v-permission="'user:create'"                    单个权限
 *   v-permission="['user:create','user:edit']"     任意满足（OR）
 *   v-role="'admin'"                               单个角色
 *   v-role="['admin', 'editor']"                   任意满足（OR）
 */

import type { Directive, DirectiveBinding, App } from 'vue'
import { useUserStore } from '@/stores/user'

/**
 * v-permission 指令
 *
 * 权限检查逻辑：
 * 1. '*'（超级管理员）直接通过
 * 2. 支持单权限字符串或权限数组
 * 3. 数组内任意一个满足即可（OR 关系）
 *
 * 注意：从 DOM 移除元素而非隐藏，因此元素不会被屏幕阅读器读出，
 * 具有一定安全性，但 DOM 仍存在（适合后台管理场景）。
 */
export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const userStore = useUserStore()
    const { value } = binding
    const permissions = userStore.permissions

    if (!value) return

    // 超级管理员拥有所有权限
    if (permissions.includes('*')) return

    // 权限检查：单权限字符串 或 权限数组
    const requiredPermissions = Array.isArray(value) ? value : [value]
    const hasPermission = requiredPermissions.some(perm => permissions.includes(perm))

    if (!hasPermission) {
      // 无权限，从 DOM 中移除元素
      el.parentNode?.removeChild(el)
    }
  }
}

/**
 * v-role 指令
 *
 * 角色检查逻辑：
 * 支持单角色字符串或角色数组，数组内任意一个满足即可（OR 关系）。
 */
export const role: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const userStore = useUserStore()
    const { value } = binding
    const roles = userStore.roles

    if (!value) return

    const requiredRoles = Array.isArray(value) ? value : [value]
    const hasRole = requiredRoles.some(r => roles.includes(r))

    if (!hasRole) {
      el.parentNode?.removeChild(el)
    }
  }
}

/**
 * 注册全局指令
 * 在 main.ts 中调用：setupDirectives(app)
 */
export function setupDirectives(app: App) {
  app.directive('permission', permission)
  app.directive('role', role)
}
