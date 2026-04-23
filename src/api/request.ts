/**
 * Axios 请求封装
 *
 * 功能：
 * - 统一拦截请求/响应，自动处理错误
 * - 自动注入 Bearer Token
 * - 业务状态码判断（code === 200）
 * - HTTP 状态码中文提示
 * - 401 自动跳转登录页
 * - 开发环境打印请求/响应日志
 *
 * 使用方式：
 *   import request from '@/api/request'
 *   const data = await request.get<UserInfo>('/user/info')
 *   await request.post('/user/update', { nickname: '新昵称' })
 */

import axios from 'axios'
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'

// ============ 类型定义 ============

/**
 * 统一 API 响应结构
 * 后端返回格式须为：{ code: number, data: T, message: string }
 */
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

/** 自定义请求配置 */
interface RequestConfig {
  baseURL?: string
  timeout?: number
  enableLog?: boolean
}

/** 扩展 Axios 配置，添加内部元数据 */
declare module 'axios' {
  interface AxiosRequestConfig {
    /** 请求开始时间（毫秒），用于计算接口耗时 */
    meta?: { requestTime: number }
  }
}

// ============ 默认配置 ============

const defaultConfig: RequestConfig = {
  baseURL: import.meta.env.VITE_APP_BASE_API || '/api',
  timeout: 30000,
  // 开发环境开启日志
  enableLog: import.meta.env.DEV
}

/** HTTP 状态码 → 中文提示 */
const HTTP_STATUS: Record<number, string> = {
  400: '请求错误',
  401: '未授权，请重新登录',
  403: '拒绝访问',
  404: '请求地址不存在',
  408: '请求超时',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时'
}

// ============ 日志工具 ============

const logger = {
  enabled: defaultConfig.enableLog,

  /** 打印请求参数（开发环境）*/
  request(config: InternalAxiosRequestConfig) {
    if (!this.enabled) return
    const method = config.method?.toUpperCase() || 'GET'
    console.group(
      `%c📤 API Request: ${method} ${config.url}`,
      'color: #42b983; font-weight: bold;'
    )
    console.log('📥 参数:', config.params || config.data || {})
    console.log('🔗 URL:', `${config.baseURL}${config.url}`)
    console.log('🔑 Headers:', config.headers)
    console.groupEnd()
  },

  /** 打印响应结果（开发环境）*/
  response(response: AxiosResponse) {
    if (!this.enabled) return
    const startTime = response.config.meta?.requestTime || 0
    const duration = startTime ? Date.now() - startTime : 0
    console.group(
      `%c📥 API Response: ${response.config.url}`,
      'color: #67c23a; font-weight: bold;'
    )
    console.log('📊 状态:', response.status)
    console.log('📦 数据:', response.data)
    console.log('⏱️ 耗时:', `${duration}ms`)
    console.groupEnd()
  },

  /** 打印错误信息（开发环境）*/
  error(err: unknown) {
    if (!this.enabled) return
    const error = err as AxiosError
    console.group(
      `%c❌ API Error: ${error.config?.url}`,
      'color: #f56c6c; font-weight: bold;'
    )
    console.log('❗ 信息:', error.message)
    console.log('📊 状态码:', error.response?.status)
    console.log('📦 响应:', error.response?.data)
    console.groupEnd()
  }
}

// ============ 创建实例 ============

const service: AxiosInstance = axios.create({
  baseURL: defaultConfig.baseURL,
  timeout: defaultConfig.timeout,
  headers: { 'Content-Type': 'application/json;charset=UTF-8' }
})

// ============ 请求拦截器 ============

service.interceptors.request.use(
  config => {
    // 记录请求开始时间，用于计算耗时
    config.meta = { requestTime: Date.now() }

    // 从 userStore 获取 Token，注入到 Authorization 头
    const { token } = useUserStore()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    logger.request(config)
    return config
  },
  error => {
    logger.error(error)
    return Promise.reject(error)
  }
)

// ============ 响应拦截器 ============

service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    logger.response(response)

    const { data } = response

    // 业务成功（code === 200）
    if (data.code === 200) {
      // 直接返回 data（不含外层包装），便于业务代码使用
      return data.data as typeof response
    }

    // 业务失败，显示错误信息并拒绝
    ElMessage.error(data.message || '请求失败')
    return Promise.reject(new Error(data.message))
  },
  error => {
    logger.error(error)

    const { response } = error

    if (response) {
      // 有 HTTP 响应码
      const message = HTTP_STATUS[response.status] || `服务器错误: ${response.status}`

      // 401：Token 过期或无效
      if (response.status === 401 && !(error.config as any)._retrying) {
        ;(error.config as any)._retrying = true
        ElMessageBox.confirm('登录已过期，请重新登录', '提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          useUserStore().logout()
          location.href = '/login'
        })
      } else {
        ElMessage.error(message)
      }
    } else {
      // 网络层面错误（无响应）
      if (error.message.includes('timeout')) {
        ElMessage.error('请求超时')
      } else if (error.message.includes('Network')) {
        ElMessage.error('网络错误，请检查网络连接')
      } else {
        ElMessage.error('请求失败')
      }
    }

    return Promise.reject(error)
  }
)

// ============ 统一请求方法 ============

const request = {
  /** GET 请求 */
  get: <T = unknown>(url: string, params?: object, config?: AxiosRequestConfig): Promise<T> =>
    service.get(url, { params, ...config }),

  /** POST 请求 */
  post: <T = unknown>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> =>
    service.post(url, data, config),

  /** PUT 请求 */
  put: <T = unknown>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> =>
    service.put(url, data, config),

  /** DELETE 请求 */
  del: <T = unknown>(url: string, params?: object, config?: AxiosRequestConfig): Promise<T> =>
    service.delete(url, { params, ...config }),

  /** PATCH 请求 */
  patch: <T = unknown>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> =>
    service.patch(url, data, config)
}

export default request
