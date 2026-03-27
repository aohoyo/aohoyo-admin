<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTabsStore } from '@/stores/tabs'

import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const route = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()

// 标签列表
const tabList = computed(() => tabsStore.tabList)

// 当前激活标签
const activeTab = computed({
  get: () => route.path,
  set: () => {}
})

// 右键菜单
const contextMenuVisible = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })
const selectedTab = ref<string>('')

// 监听路由变化，添加标签
watch(
  () => route.path,
  () => {
    if (route.meta?.title && !route.meta?.hidden) {
      tabsStore.addTab({
        path: route.path,
        title: route.meta.title as string,
        name: route.name as string,
        icon: route.meta.icon as string
      })
    }
  },
  { immediate: true }
)

// 点击标签
const handleClick = (path: string) => {
  router.push(path)
}

// 右键菜单
const handleContextMenu = (e: MouseEvent, path: string) => {
  e.preventDefault()
  contextMenuVisible.value = true
  contextMenuPosition.value = { x: e.clientX, y: e.clientY }
  selectedTab.value = path
}

// 关闭右键菜单
const closeContextMenu = () => {
  contextMenuVisible.value = false
}

// 关闭标签
const handleClose = (path: string) => {
  tabsStore.removeTab(path)
  // 如果关闭的是当前页面，跳转到最后一个标签
  if (route.path === path) {
    const lastTab = tabList.value[tabList.value.length - 1]
    if (lastTab) {
      router.push(lastTab.path)
    } else {
      router.push('/dashboard')
    }
  }
}

// 关闭其他
const closeOther = () => {
  if (!selectedTab.value) return
  tabsStore.closeOtherTabs(selectedTab.value)
  if (route.path !== selectedTab.value) {
    router.push(selectedTab.value)
  }
  closeContextMenu()
}

// 关闭左侧
const closeLeft = () => {
  if (!selectedTab.value) return
  tabsStore.closeLeftTabs(selectedTab.value)
  closeContextMenu()
}

// 关闭右侧
const closeRight = () => {
  if (!selectedTab.value) return
  tabsStore.closeRightTabs(selectedTab.value)
  closeContextMenu()
}

// 关闭所有
const closeAll = () => {
  tabsStore.closeAllTabs()
  router.push('/dashboard')
  closeContextMenu()
}

// 刷新当前页
const refreshPage = () => {
  router.go(0)
  closeContextMenu()
}

// 点击其他地方关闭菜单
document.addEventListener('click', () => {
  closeContextMenu()
})
</script>

<template>
  <div class="tabs-container">
    <el-scrollbar class="tabs-scroll">
      <div class="tabs-wrapper">
        <div
          v-for="tab in tabList"
          :key="tab.path"
          :class="['tab-item', { 'is-active': activeTab === tab.path }]"
          @click="handleClick(tab.path)"
          @contextmenu="(e) => handleContextMenu(e, tab.path)"
        >
          <el-icon v-if="tab.icon && themeStore.tabsShowIcon" class="tab-icon">
            <component :is="tab.icon" />
          </el-icon>
          <span class="tab-title">{{ tab.title }}</span>
          <el-icon
            v-if="tabList.length > 1"
            class="tab-close"
            @click.stop="handleClose(tab.path)"
          >
            <Close />
          </el-icon>
        </div>
      </div>
    </el-scrollbar>

    <!-- 右键菜单 -->
    <Transition name="fade">
      <div
        v-if="contextMenuVisible"
        class="context-menu"
        :style="{ left: `${contextMenuPosition.x}px`, top: `${contextMenuPosition.y}px` }"
      >
        <div class="menu-item" @click="refreshPage">
          <el-icon><Refresh /></el-icon>
          <span>刷新</span>
        </div>
        <div class="menu-item" @click="closeOther">
          <el-icon><FolderRemove /></el-icon>
          <span>关闭其他</span>
        </div>
        <div class="menu-item" @click="closeLeft">
          <el-icon><Back /></el-icon>
          <span>关闭左侧</span>
        </div>
        <div class="menu-item" @click="closeRight">
          <el-icon><Right /></el-icon>
          <span>关闭右侧</span>
        </div>
        <div class="menu-divider"></div>
        <div class="menu-item danger" @click="closeAll">
          <el-icon><CircleClose /></el-icon>
          <span>关闭所有</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tabs-container {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 12px;
  background: var(--tabs-bg);
  border-top: 1px solid var(--border-color);
}

.tabs-scroll { flex: 1; overflow: hidden; }

.tabs-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  padding-top: 4px;
}

.tab-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  height: 32px;
  border-radius: 4px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  color: var(--tabs-text-color);
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
}

.tab-item:hover,
.tab-item.is-active {
  transform: translateY(-2px);
}

.tab-item:hover {
  background: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary-light-5);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.tab-item.is-active {
  background: var(--el-color-primary);
  border-color: var(--el-color-primary);
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.tab-icon, .tab-title {
  font-size: 14px;
  color: inherit;
}

.tab-close {
  font-size: 12px;
  color: inherit;
  margin-left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.tab-close:hover { background: rgba(0, 0, 0, 0.1); }
.tab-item.is-active .tab-close:hover { background: rgba(255, 255, 255, 0.2); }

/* 右键菜单 */
.context-menu {
  position: fixed;
  z-index: 9999;
  min-width: 120px;
  padding: 4px 0;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  color: var(--text-color-primary);
  cursor: pointer;
  transition: background 0.2s;
}

.menu-item:hover {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.menu-item.danger:hover {
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}

.menu-item .el-icon { font-size: 14px; color: inherit; }
.menu-divider { height: 1px; margin: 4px 0; background: var(--border-color); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>