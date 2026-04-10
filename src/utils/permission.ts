import { useUserStore } from '@/stores/user'

/**
 * 检查是否有权限
 */
export function hasPermission(permission: string | string[]): boolean {
  const userStore = useUserStore()
  const permissions = userStore.permissions

  // 超级管理员拥有所有权限
  if (permissions.includes('*')) return true

  // 权限检查
  const requiredPermissions = Array.isArray(permission) ? permission : [permission]
  return requiredPermissions.some(perm => permissions.includes(perm))
}

/**
 * 检查是否有角色
 */
export function hasRole(role: string | string[]): boolean {
  const userStore = useUserStore()
  const roles = userStore.roles

  // 角色检查
  const requiredRoles = Array.isArray(role) ? role : [role]
  return requiredRoles.some(r => roles.includes(r))
}
