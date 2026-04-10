<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { useThemeStore } from '@/stores/theme'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import Tabs from './Tabs.vue'
import defaultSettings from '@/config/settings'

const appStore = useAppStore()
const themeStore = useThemeStore()

const isMobile = computed(() => appStore.device === 'mobile')

const sidebarWidth = computed(() =>
  appStore.sidebarCollapsed
    ? defaultSettings.layout.sidebarCollapsedWidth
    : defaultSettings.layout.sidebarWidth
)

const fixedSidebar = computed(() => defaultSettings.layout.fixedSidebar)
const showFooter = computed(() => defaultSettings.layout.showFooter)

// 移动端侧边栏抽屉显隐
const mobileDrawerVisible = computed({
  get: () => isMobile.value && appStore.sidebarCollapsed,
  set: (val: boolean) => {
    if (!val) {
      appStore.closeMobileSidebar()
    }
  }
})

// 响应式监听
const MOBILE_BREAKPOINT = 768

const handleResize = () => {
  const width = window.innerWidth
  if (width < MOBILE_BREAKPOINT) {
    appStore.setDevice('mobile')
  } else {
    appStore.setDevice('desktop')
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <el-container class="layout-container">
    <!-- 桌面端侧边栏 -->
    <template v-if="!isMobile">
      <el-aside
        :width="`${sidebarWidth}px`"
        :class="['layout-sidebar', { 'is-fixed': fixedSidebar }]"
      >
        <Sidebar />
      </el-aside>
    </template>

    <!-- 移动端抽屉侧边栏 -->
    <el-drawer
      v-if="isMobile"
      v-model="mobileDrawerVisible"
      direction="ltr"
      :size="defaultSettings.layout.sidebarWidth"
      :show-close="false"
      :with-header="false"
      class="mobile-sidebar-drawer"
    >
      <Sidebar />
    </el-drawer>

    <el-container
      class="layout-main"
      :style="!isMobile && fixedSidebar ? { marginLeft: `${sidebarWidth}px` } : {}"
    >
      <el-header
        :class="['layout-header', { 'is-mobile': isMobile }]"
        :height="themeStore.tabsEnabled ? (isMobile ? '92px' : '80px') : (isMobile ? '50px' : '50px')"
      >
        <Header />
        <Tabs v-if="themeStore.tabsEnabled" />
      </el-header>

      <el-main :class="['layout-content', { 'is-mobile': isMobile }]">
        <router-view v-slot="{ Component, route }">
          <transition :name="themeStore.animation ? 'fade-slide' : ''" mode="out-in">
            <keep-alive :include="[]">
              <component :is="Component" :key="route.path" />
            </keep-alive>
          </transition>
        </router-view>
      </el-main>

      <el-footer v-if="showFooter" class="layout-footer" height="40px">
        <span>&copy; 2026 Aohoyo Admin</span>
      </el-footer>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.layout-sidebar {
  background-color: var(--sidebar-bg);
  border-right: 1px solid var(--el-border-color);
  transition:
    width 0.3s ease,
    background-color 0.3s ease;
  overflow: hidden;
  flex-shrink: 0;
}

.layout-sidebar.is-fixed {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
}

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

.layout-content {
  flex: 1;
  padding: 16px;
  overflow: auto;
}

.layout-content.is-mobile {
  padding: 12px 8px;
}

.layout-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

/* 移动端侧边栏抽屉样式 */
.layout-container :deep(.mobile-sidebar-drawer) {
  background: var(--sidebar-bg);
}

.layout-container :deep(.mobile-sidebar-drawer .el-drawer__body) {
  padding: 0;
  overflow: hidden;
}

/* 移动端遮罩层优化 */
.layout-container :deep(.el-overlay) {
  background-color: rgba(0, 0, 0, 0.5);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
