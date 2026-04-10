/**
 * 简易密码工具（用于锁屏密码）
 * 使用简单的 Base64 编码，避免异步操作延迟
 */

/** 简单编码（非安全加密，仅用于锁屏） */
export function encode(text: string): string {
  return btoa(encodeURIComponent(text))
}

/** 简单解码 */
export function decode(encoded: string): string {
  try {
    return decodeURIComponent(atob(encoded))
  } catch {
    return ''
  }
}
