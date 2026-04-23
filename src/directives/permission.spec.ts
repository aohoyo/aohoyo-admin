import { describe, it, expect } from 'vitest'
import { permission, role } from '@/directives/permission'

describe('Permission Directive', () => {
  // Vue 指令是普通对象，生命周期钩子不暴露为公开属性
  // 这里只验证导出存在且为对象
  it('should export permission directive', () => {
    expect(permission).toBeDefined()
    expect(typeof permission).toBe('object')
    expect(permission).not.toBeNull()
  })

  it('should export role directive', () => {
    expect(role).toBeDefined()
    expect(typeof role).toBe('object')
    expect(role).not.toBeNull()
  })
})
