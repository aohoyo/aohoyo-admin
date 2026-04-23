import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTabsStore } from '@/stores/tabs'

describe('Tabs Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should start with empty tabList', () => {
    const tabs = useTabsStore()
    expect(tabs.tabList).toEqual([])
  })

  it('should add tab', () => {
    const tabs = useTabsStore()
    tabs.addTab({ path: '/test', title: 'Test', name: 'TestPage' })
    expect(tabs.tabList.some(t => t.path === '/test')).toBe(true)
  })

  it('should add tab only once (no duplicate)', () => {
    const tabs = useTabsStore()
    tabs.addTab({ path: '/unique', title: 'Unique', name: 'Unique' })
    tabs.addTab({ path: '/unique', title: 'Unique2', name: 'Unique2' })
    expect(tabs.tabList.filter(t => t.path === '/unique').length).toBe(1)
  })

  it('should remove tab', () => {
    const tabs = useTabsStore()
    tabs.addTab({ path: '/removeme', title: 'RemoveMe', name: 'RemoveMe' })
    expect(tabs.tabList.some(t => t.path === '/removeme')).toBe(true)
    tabs.removeTab('/removeme')
    expect(tabs.tabList.some(t => t.path === '/removeme')).toBe(false)
  })

  it('should cache component name when adding tab with name', () => {
    const tabs = useTabsStore()
    tabs.addTab({ path: '/cache', title: 'Cache', name: 'CachePage' })
    expect(tabs.cachedViews).toContain('CachePage')
  })
})
