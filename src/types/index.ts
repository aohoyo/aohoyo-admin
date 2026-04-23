/**
 * 全局类型声明
 *
 * 本目录集中存放跨模块共享的 TypeScript 类型定义，
 * 避免类型定义散落在各个文件中导致重复和不一致。
 */

// ============ API 相关 ============

/** 统一 API 响应结构（后端返回格式） */
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

/** 分页查询参数 */
export interface PageQuery {
  page?: number
  pageSize?: number
  keyword?: string
}

/** 分页响应结构 */
export interface PageResult<T = unknown> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// ============ 用户/权限相关 ============

/** 用户基本信息 */
export interface UserInfo {
  id?: number
  username?: string
  nickname?: string
  avatar?: string
  email?: string
  phone?: string
  roles?: string[]
  permissions?: string[]
}

/** 登录参数 */
export interface LoginParams {
  username: string
  password: string
}

/** 登录响应 */
export interface LoginResult {
  token: string
  userInfo: UserInfo
}

// ============ 路由相关 ============

/** 路由元信息 */
export interface RouteMeta {
  title?: string
  icon?: string
  hidden?: boolean
  permission?: string | string[]
  keepAlive?: boolean
}

// ============ 通用 ============

/** 操作结果（通用返回值） */
export interface OpResult<T = unknown> {
  success: boolean
  message?: string
  data?: T
}

/** 键值对象 */
export interface KeyValue<T = string> {
  key: T
  value: T
}

/** 选择项（用于下拉选择器） */
export interface Option {
  label: string
  value: string | number
  disabled?: boolean
}
