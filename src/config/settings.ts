/**
 * 全局配置文件
 */

export default {
  title: 'Aohoyo Admin',
  logo: '/logo.svg',
  baseUrl: import.meta.env.VITE_APP_BASE_API || '/api',

  // 标签页
  tabs: {
    enabled: true,
    showIcon: true
  },

  // 布局
  layout: {
    sidebarWidth: 220,
    sidebarCollapsedWidth: 64,
    showLogo: true,
    showBreadcrumb: true,
    showFooter: false,
    fixedHeader: true,
    fixedSidebar: true
  },

  // 功能开关
  features: {
    fullscreen: true,    // 全屏按钮
    lockScreen: true,     // 锁屏功能
    notification: true,   // 通知功能
    refresh: true         // 刷新按钮
  },

  // 主题
  theme: {
    mode: 'light' as 'light' | 'dark',
    primaryColor: '#F37021',
    borderRadius: 4,
    grayMode: false,
    colorWeak: false,
    animation: true,
    presets: [
      { name: '爱马仕橙', primary: '#F37021' },
      { name: '科技蓝', primary: '#1677ff' },
      { name: '翡翠绿', primary: '#00a870' },
      { name: '星空紫', primary: '#722ed1' }
    ]
  }
}