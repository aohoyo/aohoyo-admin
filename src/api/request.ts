/**
 * Axios 请求封装
 * 
 * 配置说明：
 * - baseURL: API 基础地址，在 .env 文件中配置 VITE_APP_BASE_API
 * - timeout: 请求超时时间，默认 30 秒
 * - enableLog: 是否启用日志，开发环境默认启用
 * 
 * 使用示例：
 * ```ts
 * import request from '@/api/request'
 * 
 * // GET 请求
 * const data = await request.get('/api/user/list', { page: 1 })
 * 
 * // POST 请求
 * const result = await request.post('/api/user', { name: 'test' })
 * ```
 */

import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
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
    console.log(
      `%c🚀 REQUEST ${config.method?.toUpperCase()} ${config.url}`,
      'color: #42b983; font-weight: bold',
      '\n参数:', config.params || config.data || {}
    )
  },
  
  response(response: AxiosResponse) {
    if (!this.enabled) return
    console.log(
      `%c✅ RESPONSE ${response.config.url}`,
      'color: #67c23a; font-weight: bold',
      '\n数据:', response.data
    )
  },
  
  error(error: any) {
    if (!this.enabled) return
    console.error(
      `%c❌ ERROR ${error.config?.url || 'unknown'}`,
      'color: #f56c6c; font-weight: bold',
      '\n错误:', error.message
    )
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
  (config) => {
    // 添加 Token
    const { token } = useUserStore()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 记录日志
    logger.request(config)
    
    return config
  },
  (error) => {
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
  (error) => {
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
export { service as axiosInstance, logger }