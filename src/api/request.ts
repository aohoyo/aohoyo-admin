import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'

// ============ 类型定义 ============

/** API 响应结构 */
export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

/** 请求配置 */
interface RequestConfig {
  baseURL?: string
  timeout?: number
  enableLog?: boolean
}

/** 扩展 Axios 配置，添加自定义 meta */
declare module 'axios' {
  interface AxiosRequestConfig {
    meta?: { requestTime: number }
  }
}

// ============ 配置 ============

/** 默认配置 */
const defaultConfig: RequestConfig = {
  baseURL: import.meta.env.VITE_APP_BASE_API || '/api',
  timeout: 30000,
  enableLog: import.meta.env.DEV // 开发环境启用日志
}

/** HTTP 状态码映射 */
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

  request(config: InternalAxiosRequestConfig) {
    if (!this.enabled) return
    const method = config.method?.toUpperCase() || 'GET'
    const url = config.url || ''
    const params = config.params || config.data || {}

    console.group(
      `%c📤 API Request: ${method} ${url}`,
      'color: #42b983; font-weight: bold; font-size: 13px;'
    )
    console.log('📥 参数:', params)
    console.log('🔗 完整URL:', `${config.baseURL}${url}`)
    console.log('📋 Headers:', config.headers)
    console.groupEnd()
  },

  response(response: AxiosResponse) {
    if (!this.enabled) return
    const url = response.config.url || ''
    const startTime = response.config.meta?.requestTime || 0
    const duration = startTime ? Date.now() - startTime : 0

    console.group(
      `%c📥 API Response: ${url}`,
      'color: #67c23a; font-weight: bold; font-size: 13px;'
    )
    console.log('📊 状态码:', response.status)
    console.log('📦 返回数据:', response.data)
    console.log('⏱️ 耗时:', `${duration}ms`)
    console.groupEnd()
  },

  error(error: any) {
    if (!this.enabled) return
    const url = error.config?.url || 'unknown'

    console.group(`%c❌ API Error: ${url}`, 'color: #f56c6c; font-weight: bold; font-size: 13px;')
    console.log('❗ 错误信息:', error.message)
    console.log('📊 状态码:', error.response?.status)
    console.log('📦 响应数据:', error.response?.data)
    console.groupEnd()
  }
}

// ============ 创建实例 ============

const service: AxiosInstance = axios.create({
  baseURL: defaultConfig.baseURL,
  timeout: defaultConfig.timeout,
  headers: { 'Content-Type': 'application/json;charset=UTF-8' }
})

// ============ 拦截器 ============

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 记录请求开始时间
    config.meta = { requestTime: Date.now() }

    // 添加 Token
    const { token } = useUserStore()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 记录日志
    logger.request(config)

    return config
  },
  error => {
    logger.error(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    logger.response(response)

    const { data } = response

    // 业务成功
    if (data.code === 200) {
      return data.data as any
    }

    // 业务失败
    ElMessage.error(data.message || '请求失败')
    return Promise.reject(new Error(data.message))
  },
  error => {
    logger.error(error)

    const { response } = error

    // HTTP 错误处理
    if (response) {
      const message = HTTP_STATUS[response.status] || `服务器错误: ${response.status}`

      // 401 未授权
      if (response.status === 401) {
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
    }
    // 网络错误
    else if (error.message.includes('timeout')) {
      ElMessage.error('请求超时')
    } else if (error.message.includes('Network')) {
      ElMessage.error('网络错误，请检查网络')
    } else {
      ElMessage.error('请求失败')
    }

    return Promise.reject(error)
  }
)

// ============ 请求方法 ============

const request = {
  get: <T = any>(url: string, params?: object, config?: AxiosRequestConfig): Promise<T> =>
    service.get(url, { params, ...config }),

  post: <T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> =>
    service.post(url, data, config),

  put: <T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> =>
    service.put(url, data, config),

  del: <T = any>(url: string, params?: object, config?: AxiosRequestConfig): Promise<T> =>
    service.delete(url, { params, ...config }),

  patch: <T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> =>
    service.patch(url, data, config)
}

export default request
