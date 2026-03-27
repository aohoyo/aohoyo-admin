<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { useThemeStore } from '@/stores/theme'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import Tabs from './Tabs.vue'
import defaultSettings from '@/config/settings'

const appStore = useAppStore()
const themeStore = useThemeStore()

const sidebarWidth = computed(() =>
  appStore.sidebarCollapsed
    ? defaultSettings.layout.sidebarCollapsedWidth
    : defaultSettings.layout.sidebarWidth
)

const fixedSidebar = computed(() => defaultSettings.layout.fixedSidebar)
const showFooter = computed(() => defaultSettings.layout.showFooter)
</script>

<template>
  <el-container class="layout-container">
    <el-aside
      :width="`${sidebarWidth}px`"
      :class="['layout-sidebar', { 'is-fixed': fixedSidebar }]"
    >
      <Sidebar />
    </el-aside>

    <el-container 
      class="layout-main"
      :style="fixedSidebar ? { marginLeft: `${sidebarWidth}px` } : {}"
    >
      <el-header
        class="layout-header"
        :height="themeStore.tabsEnabled ? '80px' : '50px'"
      >
        <Header />
        <Tabs v-if="themeStore.tabsEnabled" />
      </el-header>

      <el-main class="layout-content">
        <router-view v-slot="{ Component, route }">
          <transition :name="themeStore.animation ? 'fade-slide' : ''" mode="out-in">
            <keep-alive :include="[]">
              <component :is="Component" :key="route.path" />
            </keep-alive>
          </transition>
        </router-view>
      </el-main>

      <el-footer v-if="showFooter" class="layout-footer" height="40px">
        <span>© 2026 Aohoyo Admin</span>
      </el-footer>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout-container { width: 100%; height: 100vh; overflow: hidden; }

.layout-sidebar {
  background-color: var(--sidebar-bg);
  border-right: 1px solid var(--el-border-color);
  transition: width 0.3s ease, background-color 0.3s ease;
  overflow: hidden;
  flex-shrink: 0;
}

.layout-sidebar.is-fixed { position: fixed; left: 0; top: 0; bottom: 0; z-index: 100; }

.layout-main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  background-color: var(--el-bg-color-page);
  transition: margin-left 0.3s ease;
}

.layout-header {
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  padding: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  z-index: 99;
}

.layout-content { flex: 1; padding: 16px; overflow: auto; }

.layout-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.fade-slide-enter-active, .fade-slide-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(10px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-10px); }
</style>