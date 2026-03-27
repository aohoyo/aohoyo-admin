/**
 * 全局配置文件
 * 
 * 使用说明：
 * 1. 修改主题色：找到 theme.primaryColor 改为你需要的颜色
 * 2. 修改布局：找到 layout 配置项调整侧边栏宽度等
 * 3. 开启/关闭功能：如 tabs.enabled 控制标签栏显示
 */

export default {
  // ===== 基础配置 =====
  title: 'Aohoyo Admin',
  logo: '/logo.svg',
  
  // ===== API 配置 =====
  // 可通过环境变量覆盖：VITE_APP_BASE_API
  baseUrl: import.meta.env.VITE_APP_BASE_API || '/api',

  // ===== 标签页配置 =====
  tabs: {
    enabled: true,          // 是否启用标签页
    cache: true,            // 是否缓存页面
    maxCount: 10,           // 最大标签数
    style: 'card' as const  // 样式：card | chrome | plain
  },

  // ===== 布局配置 =====
  layout: {
    mode: 'sidebar' as const,     // 布局模式：sidebar | top | mix
    sidebarWidth: 220,            // 侧边栏宽度
    sidebarCollapsedWidth: 64,    // 侧边栏折叠宽度
    showLogo: true,               // 显示 Logo
    showBreadcrumb: true,         // 显示面包屑
    showFooter: true,             // 显示页脚
    fixedHeader: true,            // 固定头部
    fixedSidebar: true            // 固定侧边栏
  },

  // ===== 主题配置 =====
  theme: {
    mode: 'light' as 'light' | 'dark' | 'auto',
    
    // 主色调（默认：爱马仕橙）
    primaryColor: '#F37021',
    
    // 功能色（一般不需要修改）
    successColor: '#67c23a',
    warningColor: '#e6a23c',
    dangerColor: '#f56c6c',
    infoColor: '#909399',
    
    // 预设主题色（在主题设置面板显示）
    presets: [
      { name: '爱马仕橙', primary: '#F37021' },
      { name: '科技蓝', primary: '#1677ff' },
      { name: '翡翠绿', primary: '#00a870' },
      { name: '玫瑰金', primary: '#c41d7f' },
      { name: '星空紫', primary: '#722ed1' }
    ],
    
    // 组件主题
    sidebarTheme: 'light' as 'light' | 'dark',
    headerTheme: 'light' as 'light' | 'dark',
    
    // 样式配置
    borderRadius: 4,
    fontSize: 14 as 12 | 14 | 16,
    
    // 特殊模式
    grayMode: false,      // 灰色模式
    colorWeak: false,     // 色弱模式
    animation: true       // 动画效果
  }
}

// 导出类型
export type TabsConfig = typeof defaultSettings.tabs
export type LayoutConfig = typeof defaultSettings.layout
export type ThemeConfig = typeof defaultSettings.theme

// 内部使用
const defaultSettings = {
  tabs: {
    enabled: true,
    cache: true,
    maxCount: 10,
    style: 'card' as const
  },
  layout: {
    mode: 'sidebar' as const,
    sidebarWidth: 220,
    sidebarCollapsedWidth: 64,
    showLogo: true,
    showBreadcrumb: true,
    showFooter: true,
    fixedHeader: true,
    fixedSidebar: true
  },
  theme: {
    mode: 'light' as 'light' | 'dark' | 'auto',
    primaryColor: '#F37021',
    successColor: '#67c23a',
    warningColor: '#e6a23c',
    dangerColor: '#f56c6c',
    infoColor: '#909399',
    presets: [
      { name: '爱马仕橙', primary: '#F37021' },
      { name: '科技蓝', primary: '#1677ff' },
      { name: '翡翠绿', primary: '#00a870' },
      { name: '玫瑰金', primary: '#c41d7f' },
      { name: '星空紫', primary: '#722ed1' }
    ],
    sidebarTheme: 'light' as 'light' | 'dark',
    headerTheme: 'light' as 'light' | 'dark',
    borderRadius: 4,
    fontSize: 14 as 12 | 14 | 16,
    grayMode: false,
    colorWeak: false,
    animation: true
  }
}