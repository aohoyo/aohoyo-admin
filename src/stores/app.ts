/**
 * 应用状态管理
 *
 * 管理全局应用状态，包括：
 * - 侧边栏折叠/展开
 * - 当前设备类型（桌面/移动端）
 * - 项目标题和 Logo（来自 settings.ts）
 *
 * 使用方式：
 *   const appStore = useAppStore()
 *   appStore.toggleSidebar()   // 切换侧边栏
 *   appStore.device             // 'desktop' | 'mobile'
 */

import { defineStore } from 'pinia'
import defaultSettings from '@/config/settings'

interface AppState {
  /** 项目标题（显示在浏览器标签和头部）*/
  title: string
  /** Logo 路径（来自 settings.ts）*/
  logo: string
  /** 侧边栏是否折叠 */
  sidebarCollapsed: boolean
  /** 当前设备类型 */
  device: 'desktop' | 'mobile'
}

/** 应用 Store */
export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    title: defaultSettings.title,
    logo: defaultSettings.logo,
    sidebarCollapsed: false,
    device: 'desktop'
  }),

  actions: {
    /**
     * 切换侧边栏折叠状态
     */
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },

    /**
     * 关闭移动端侧边栏（抽屉模式）
     * 仅在移动端生效，切换到桌面后自动关闭
     */
    closeMobileSidebar() {
      if (this.device === 'mobile') {
        this.sidebarCollapsed = false
      }
    },

    /**
     * 设置设备类型
     * 切换到移动端时自动展开侧边栏（抽屉模式）
     * @param device - 'desktop' 或 'mobile'
     */
    setDevice(device: 'desktop' | 'mobile') {
      this.device = device
      if (device === 'mobile') {
        // 移动端默认展开侧边栏（抽屉模式）
        this.sidebarCollapsed = false
      }
    }
  },

  persist: true
})
