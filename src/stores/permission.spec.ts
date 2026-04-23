import { describe, it, expect } from 'vitest'
import { permission, role } from '@/directives/permission'

describe('Permission Directive', () => {
  // 指令本身需要 Vue 挂载才能测试，这里只验证导出正确
  it('should export permission directive', () => {
    expect(permission).toBeDefined()
    expect(typeof permission.mounted).toBe('function')
  })

  it('should export role directive', () => {
    expect(role).toBeDefined()
    expect(typeof role.mounted).toBe('function')
  })
})
