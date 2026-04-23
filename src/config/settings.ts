/**
 * 全局配置文件
 *
 * 所有可通过环境变量覆盖的配置均从 VITE_APP_* 读取，
 * 确保二次开发时无需修改代码，只需修改 .env 文件即可。
 */

export default {
  // 项目名称（来自环境变量，默认 "Aohoyo Admin"）
  title: import.meta.env.VITE_APP_TITLE || 'Aohoyo Admin',

  // Logo 路径（来自环境变量，默认 "/logo.png"）
  logo: import.meta.env.VITE_APP_LOGO || '/logo.webp',

  // API 基础地址
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
    fullscreen: true, // 全屏按钮
    lockScreen: true, // 锁屏功能
    notification: true, // 通知功能
    refresh: true, // 刷新按钮
    language: true // 语言切换按钮
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
