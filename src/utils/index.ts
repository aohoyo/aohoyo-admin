/**
 * 工具函数库
 * 
 * 包含：深拷贝、防抖节流、URL处理、文件下载、剪贴板等
 */

// ===== 对象操作 =====

/** 深拷贝 */
export function deepClone<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as T
  if (Array.isArray(obj)) return obj.map(deepClone) as T
  
  const copy = {} as T
  Object.keys(obj).forEach(key => {
    (copy as any)[key] = deepClone((obj as any)[key])
  })
  return copy
}

/** 判断是否为空 */
export function isEmpty(val: any): boolean {
  if (val == null) return true
  if (typeof val === 'string') return !val.trim()
  if (Array.isArray(val)) return !val.length
  if (typeof val === 'object') return !Object.keys(val).length
  return false
}

// ===== 函数工具 =====

/** 防抖 */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay = 300) {
  let timer: ReturnType<typeof setTimeout>
  return function(this: any, ...args: Parameters<T>) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

/** 节流 */
export function throttle<T extends (...args: any[]) => any>(fn: T, delay = 300) {
  let last = 0
  return function(this: any, ...args: Parameters<T>) {
    const now = Date.now()
    if (now - last >= delay) {
      last = now
      fn.apply(this, args)
    }
  }
}

// ===== URL 处理 =====

/** 对象转查询字符串 */
export function objectToQuery(obj: Record<string, any>): string {
  return Object.entries(obj)
    .filter(([, v]) => v != null && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')
}

/** 查询字符串转对象 */
export function queryToObject(query: string): Record<string, string> {
  return Object.fromEntries(
    query.replace(/^\?/, '').split('&').filter(Boolean).map(p => {
      const [k, v = ''] = p.split('=')
      return [decodeURIComponent(k), decodeURIComponent(v)]
    })
  )
}

// ===== 文件操作 =====

/** 下载文件 */
export function downloadFile(url: string, name?: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = name || ''
  a.click()
}

/** 复制到剪贴板 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/** 格式化文件大小 */
export function formatFileSize(bytes: number): string {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + units[i]
}

// ===== 其他 =====

/** 生成 UUID */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : r & 3 | 8).toString(16)
  })
}

/** 随机字符串 */
export function randomStr(len = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length: len }, () => chars[Math.random() * chars.length | 0]).join('')
}