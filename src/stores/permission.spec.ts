import { describe, it, expect } from 'vitest'
import { permission, role } from '@/directives/permission'

describe('Permission Directive', () => {
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
