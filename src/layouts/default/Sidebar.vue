<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import defaultSettings from '@/config/settings'
import type { RouteRecordRaw } from 'vue-router'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

// 递归过滤路由，只显示需要显示的菜单
const filterMenus = (routes: RouteRecordRaw[]): RouteRecordRaw[] => {
  return routes
    .filter(r => !r.meta?.hidden)
    .map(r => {
      if (r.children && r.children.length > 0) {
        return {
          ...r,
          children: filterMenus(r.children)
        }
      }
      return r
    })
    .filter(r => {
      // 如果是目录但没有子菜单，则隐藏
      if (r.children && r.children.length === 0) return false
      return true
    })
}

// 菜单配置
const menuItems = computed(() => {
  const routes = router.options.routes
  // 过滤 asyncRoutes，获取菜单
  const menus = routes.filter(r => !r.meta?.hidden && r.component)
  return filterMenus(menus)
})

// 当前激活菜单
const activeMenu = computed(() => route.path)

// 是否折叠
const isCollapsed = computed(() => appStore.sidebarCollapsed)

// 是否移动端
const isMobile = computed(() => appStore.device === 'mobile')

// Logo 配置
const showLogo = computed(() => defaultSettings.layout.showLogo)
const title = computed(() => defaultSettings.title)
const logo = computed(() => defaultSettings.logo)

// 点击菜单
const handleSelect = (path: string) => {
  router.push(path)
  // 移动端点击菜单后关闭抽屉
  if (isMobile.value) {
    appStore.closeMobileSidebar()
  }
}

// 切换折叠（仅桌面端）
const toggleCollapse = () => {
  appStore.toggleSidebar()
}
</script>

<template>
  <div class="sidebar-container">
    <!-- Logo 区域 -->
    <div v-if="showLogo" class="sidebar-logo" @click="router.push('/dashboard')">
      <img :src="logo" alt="Logo" class="logo-img" />
      <span v-show="!isCollapsed || isMobile" class="logo-text">{{ title }}</span>
    </div>

    <!-- 菜单区域 -->
    <el-scrollbar class="sidebar-menu-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="!isMobile && isCollapsed"
        :collapse-transition="false"
        :unique-opened="true"
        :router="false"
        background-color="transparent"
        text-color="var(--sidebar-text-color)"
        active-text-color="var(--el-color-primary)"
        @select="handleSelect"
      >
        <!-- 递归渲染菜单 -->
        <template v-for="item in menuItems" :key="item.path">
          <!-- 有子菜单 -->
          <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.path">
            <template #title>
              <el-icon v-if="item.meta?.icon"><component :is="item.meta.icon" /></el-icon>
              <span>{{ t(item.meta?.title as string) }}</span>
            </template>

            <!-- 二级菜单 -->
            <template v-for="child in item.children" :key="child.path">
              <!-- 三级菜单 -->
              <el-sub-menu
                v-if="child.children && child.children.length > 0"
                :index="`${item.path}/${child.path}`"
              >
                <template #title>
                  <el-icon v-if="child.meta?.icon"><component :is="child.meta.icon" /></el-icon>
                  <span>{{ t(child.meta?.title as string) }}</span>
                </template>
                <el-menu-item
                  v-for="subChild in child.children"
                  :key="subChild.path"
                  :index="`${item.path}/${child.path}/${subChild.path}`"
                >
                  <el-icon v-if="subChild.meta?.icon">
                    <component :is="subChild.meta.icon" />
                  </el-icon>
                  <span>{{ t(subChild.meta?.title as string) }}</span>
                </el-menu-item>
              </el-sub-menu>

              <!-- 普通二级菜单 -->
              <el-menu-item
                v-else
                :index="item.path === '/' ? `/${child.path}` : `${item.path}/${child.path}`"
              >
                <el-icon v-if="child.meta?.icon"><component :is="child.meta.icon" /></el-icon>
                <template #title>{{ t(child.meta?.title as string) }}</template>
              </el-menu-item>
            </template>
          </el-sub-menu>

          <!-- 无子菜单 -->
          <el-menu-item v-else :index="(item.redirect || item.path) as string">
            <el-icon v-if="item.meta?.icon"><component :is="item.meta.icon" /></el-icon>
            <template #title>{{ t(item.meta?.title as string) }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>

    <!-- 折叠按钮（仅桌面端显示） -->
    <div v-if="!isMobile" class="sidebar-collapse-btn" @click="toggleCollapse">
      <el-icon :size="18">
        <component :is="isCollapsed ? 'Expand' : 'Fold'" />
      </el-icon>
    </div>
  </div>
</template>

<style scoped>
.sidebar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--sidebar-bg);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 16px;
  border-bottom: 1px solid var(--el-border-color);
  cursor: pointer;
  transition: background 0.3s;
}

.sidebar-logo:hover {
  background: var(--sidebar-hover-bg);
}

.logo-img {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.logo-text {
  margin-left: 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--sidebar-text-color);
}

.sidebar-menu-wrapper {
  flex: 1;
  overflow: hidden;
}

.sidebar-menu-wrapper :deep(.el-menu) {
  border-right: none;
  background: transparent;
}

.sidebar-menu-wrapper :deep(.el-menu-item),
.sidebar-menu-wrapper :deep(.el-sub-menu__title) {
  height: 48px;
  line-height: 48px;
  color: var(--sidebar-text-color);
  transition: all 0.2s;
}

.sidebar-menu-wrapper :deep(.el-menu-item:hover),
.sidebar-menu-wrapper :deep(.el-sub-menu__title:hover),
.sidebar-menu-wrapper :deep(.el-menu-item.is-active) {
  background: var(--el-color-primary-light-9);
  transform: translateX(4px);
}

.sidebar-menu-wrapper :deep(.el-menu-item.is-active) {
  border-right: 3px solid var(--el-color-primary);
}

.sidebar-menu-wrapper :deep(.el-sub-menu .el-menu-item) {
  padding-left: 50px !important;
}

.sidebar-collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-top: 1px solid var(--el-border-color);
  color: var(--sidebar-text-color);
  cursor: pointer;
  transition: all 0.3s;
}

.sidebar-collapse-btn:hover {
  background: var(--sidebar-hover-bg);
  color: var(--el-color-primary);
}
</style>
