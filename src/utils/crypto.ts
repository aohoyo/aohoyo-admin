/**
 * AES-GCM 加密工具（用于锁屏密码）
 * 使用 Web Crypto API 进行对称加密
 *
 * 密钥派生：VITE_LOCK_SCREEN_SECRET → SHA-256 → AES-256-GCM
 * 未配置时使用默认值（二次开发时建议在 .env 中设置自己的密钥）
 */

const KEY_MATERIAL = import.meta.env.VITE_LOCK_SCREEN_SECRET || 'aohoyo-admin-lock-screen-v2'
const ALGO = 'AES-GCM'
const IV_LENGTH = 12

async function getKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(KEY_MATERIAL)
  const hash = await crypto.subtle.digest('SHA-256', keyData)
  return crypto.subtle.importKey('raw', hash, { name: ALGO }, false, ['encrypt', 'decrypt'])
}

/** AES-GCM 加密 */
export async function encode(text: string): Promise<string> {
  const key = await getKey()
  const encoder = new TextEncoder()
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))
  const encrypted = await crypto.subtle.encrypt({ name: ALGO, iv }, key, encoder.encode(text))
  const combined = new Uint8Array(iv.length + new Uint8Array(encrypted).length)
  combined.set(iv)
  combined.set(new Uint8Array(encrypted), iv.length)
  return btoa(String.fromCharCode(...combined))
}

/** AES-GCM 解密 */
export async function decode(encoded: string): Promise<string> {
  try {
    const key = await getKey()
    const combined = new Uint8Array([...atob(encoded)].map(c => c.charCodeAt(0)))
    const iv = combined.slice(0, IV_LENGTH)
    const data = combined.slice(IV_LENGTH)
    const decrypted = await crypto.subtle.decrypt({ name: ALGO, iv }, key, data)
    return new TextDecoder().decode(decrypted)
  } catch {
    return ''
  }
}
