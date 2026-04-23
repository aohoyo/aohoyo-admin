import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should have default username as 游客', () => {
    const user = useUserStore()
    expect(user.username).toBe('游客')
  })

  it('should set token', () => {
    const user = useUserStore()
    user.setToken('test-token-123')
    expect(user.token).toBe('test-token-123')
  })

  it('should check isLogin correctly', () => {
    const user = useUserStore()
    expect(user.isLogin).toBe(false)
    user.setToken('valid-token')
    expect(user.isLogin).toBe(true)
  })

  it('should set user info', () => {
    const user = useUserStore()
    user.setUserInfo({ id: 1, username: 'admin', roles: ['admin'] })
    expect(user.username).toBe('admin')
    expect(user.roles).toContain('admin')
  })
})
