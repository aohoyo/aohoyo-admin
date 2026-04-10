import { defineStore } from 'pinia'
import defaultSettings from '@/config/settings'

interface AppState {
  title: string
  logo: string
  sidebarCollapsed: boolean
  device: 'desktop' | 'mobile'
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    title: defaultSettings.title,
    logo: defaultSettings.logo,
    sidebarCollapsed: false,
    device: 'desktop'
  }),

  actions: {
    // 切换侧边栏
    toggleSidebar() {
      if (this.device === 'mobile') {
        // 移动端：控制抽屉显隐
        this.sidebarCollapsed = !this.sidebarCollapsed
      } else {
        this.sidebarCollapsed = !this.sidebarCollapsed
      }
    },

    // 关闭移动端侧边栏（抽屉）
    closeMobileSidebar() {
      if (this.device === 'mobile') {
        this.sidebarCollapsed = false
      }
    },

    // 设置设备类型
    setDevice(device: 'desktop' | 'mobile') {
      this.device = device
      if (device === 'mobile') {
        this.sidebarCollapsed = false
      }
    }
  },

  persist: true
})
