/**
 * 标签页状态管理
 *
 * 管理多标签页的行为：
 * - 记录当前打开的标签页列表
 * - 维护 keep-alive 缓存的组件名列表
 * - 支持右键菜单操作（关闭、关闭其他、关闭左侧、关闭右侧）
 *
 * 使用方式：
 *   const tabsStore = useTabsStore()
 *   tabsStore.addTab({ path: '/dashboard', title: '首页', name: 'Dashboard' })
 *   tabsStore.removeTab('/user')
 */

import { defineStore } from 'pinia'

/** 标签页条目 */
export interface TabItem {
  /** 路由路径（唯一标识）*/
  path: string
  /** 显示标题 */
  title: string
  /** 对应组件名（用于 keep-alive 缓存）*/
  name?: string
  /** 图标标识 */
  icon?: string
}

interface TabsState {
  /** 当前打开的标签页列表 */
  tabList: TabItem[]
  /** keep-alive 缓存的组件名列表 */
  cachedViews: string[]
}

/**
 * 图标格式迁移：旧格式 ep:xxx → Element Plus 新格式 Xxx
 * 例如：'ep:user-filled' → 'UserFilled'
 */
const migrateIcon = (icon?: string): string | undefined => {
  if (!icon) return undefined
  if (icon.startsWith('ep:')) {
    const parts = icon.split(':')
    const name = parts[1] || ''
    // kebab-case 转 PascalCase: user-filled → UserFilled
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  }
  return icon
}

/** 标签页 Store */
export const useTabsStore = defineStore('tabs', {
  state: (): TabsState => ({
    tabList: [],
    cachedViews: []
  }),

  actions: {
    /**
     * 添加标签页
     * 如果已存在则不重复添加，同时同步缓存对应组件
     * @param tab - 标签页信息（path 唯一）
     */
    addTab(tab: TabItem) {
      const exists = this.tabList.find(item => item.path === tab.path)
      if (!exists) {
        this.tabList.push({
          ...tab,
          icon: migrateIcon(tab.icon)
        })
      }
      // 同步缓存组件名（用于 keep-alive）
      if (tab.name && !this.cachedViews.includes(tab.name)) {
        this.cachedViews.push(tab.name)
      }
    },

    /**
     * 移除标签页
     * @param path - 要移除的标签页路径
     */
    removeTab(path: string) {
      const index = this.tabList.findIndex(item => item.path === path)
      if (index > -1) {
        const removed = this.tabList[index]
        this.tabList.splice(index, 1)
        // 同步移除缓存
        if (removed.name) {
          const cachedIndex = this.cachedViews.indexOf(removed.name)
          if (cachedIndex > -1) {
            this.cachedViews.splice(cachedIndex, 1)
          }
        }
      }
    },

    /**
     * 关闭除指定标签页以外的所有标签
     * @param path - 要保留的标签页路径
     */
    closeOtherTabs(path: string) {
      this.tabList = this.tabList.filter(item => item.path === path)
      this.cachedViews = this.tabList
        .map(tab => tab.name)
        .filter((name): name is string => !!name)
    },

    /**
     * 关闭指定标签页左侧的所有标签
     * @param path - 锚点标签页，其左侧全部关闭
     */
    closeLeftTabs(path: string) {
      const index = this.tabList.findIndex(item => item.path === path)
      if (index > -1) {
        this.tabList = this.tabList.slice(index)
        this.cachedViews = this.tabList
          .map(tab => tab.name)
          .filter((name): name is string => !!name)
      }
    },

    /**
     * 关闭指定标签页右侧的所有标签
     * @param path - 锚点标签页，其右侧全部关闭
     */
    closeRightTabs(path: string) {
      const index = this.tabList.findIndex(item => item.path === path)
      if (index > -1) {
        this.tabList = this.tabList.slice(0, index + 1)
        this.cachedViews = this.tabList
          .map(tab => tab.name)
          .filter((name): name is string => !!name)
      }
    },

    /**
     * 关闭所有标签页
     */
    closeAllTabs() {
      this.tabList = []
      this.cachedViews = []
    },

    /**
     * 批量迁移所有标签的图标格式（旧格式兼容）
     */
    migrateAllIcons() {
      this.tabList = this.tabList.map(tab => ({
        ...tab,
        icon: migrateIcon(tab.icon)
      }))
    }
  },

  persist: true
})
