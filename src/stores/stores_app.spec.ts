import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAppStore } from '@/stores/app'

describe('App Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should toggle sidebar collapsed state', () => {
    const app = useAppStore()
    expect(app.sidebarCollapsed).toBe(false)
    app.toggleSidebar()
    expect(app.sidebarCollapsed).toBe(true)
    app.toggleSidebar()
    expect(app.sidebarCollapsed).toBe(false)
  })

  it('should set device', () => {
    const app = useAppStore()
    expect(app.device).toBe('desktop')
    app.setDevice('mobile')
    expect(app.device).toBe('mobile')
    // Mobile sets sidebarCollapsed to false
    expect(app.sidebarCollapsed).toBe(false)
  })

  it('should have title and logo from settings', () => {
    const app = useAppStore()
    expect(app.title).toBeTruthy()
    expect(app.logo).toBeTruthy()
  })

  it('should close mobile sidebar', () => {
    const app = useAppStore()
    app.setDevice('mobile')
    app.toggleSidebar()
    expect(app.sidebarCollapsed).toBe(true)
    app.closeMobileSidebar()
    // closeMobileSidebar only works on mobile and sets to false
    expect(app.sidebarCollapsed).toBe(false)
  })
})
