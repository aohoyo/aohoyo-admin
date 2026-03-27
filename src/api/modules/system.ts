import request from '../request'

// 用户相关
export interface SystemUser {
  id: number
  username: string
  nickname: string
  email: string
  phone: string
  status: number
  createTime: string
  roles: string[]
}

export function getUserList(params: { page: number; pageSize: number; keyword?: string }) {
  return request.get<{ list: SystemUser[]; total: number }>('/system/user/list', params)
}

export function createUser(data: Partial<SystemUser>) {
  return request.post('/system/user', data)
}

export function updateUser(id: number, data: Partial<SystemUser>) {
  return request.put(`/system/user/${id}`, data)
}

export function deleteUser(id: number) {
  return request.del(`/system/user/${id}`)
}

// 角色相关
export interface Role {
  id: number
  name: string
  code: string
  description: string
  status: number
  permissions: string[]
  createTime: string
}

export function getRoleList(params: { page: number; pageSize: number }) {
  return request.get<{ list: Role[]; total: number }>('/system/role/list', params)
}

export function createRole(data: Partial<Role>) {
  return request.post('/system/role', data)
}

export function updateRole(id: number, data: Partial<Role>) {
  return request.put(`/system/role/${id}`, data)
}

export function deleteRole(id: number) {
  return request.del(`/system/role/${id}`)
}

// 菜单相关
export interface Menu {
  id: number
  parentId: number
  name: string
  path: string
  icon: string
  sort: number
  status: number
  children?: Menu[]
}

export function getMenuList() {
  return request.get<Menu[]>('/system/menu/list')
}

export function createMenu(data: Partial<Menu>) {
  return request.post('/system/menu', data)
}

export function updateMenu(id: number, data: Partial<Menu>) {
  return request.put(`/system/menu/${id}`, data)
}

export function deleteMenu(id: number) {
  return request.del(`/system/menu/${id}`)
}