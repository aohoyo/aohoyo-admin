import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
import { setupDirectives } from '@/directives/permission'
import i18n from './locales'

import 'element-plus/theme-chalk/base.css'
import './styles/index.css'

const app = createApp(App)

// Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// Router
app.use(router)

// i18n 国际化
app.use(i18n)

// 注册 Element Plus 图标（组件由 unplugin-vue-components 按需自动导入）
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册全局指令
setupDirectives(app)

app.mount('#app')
