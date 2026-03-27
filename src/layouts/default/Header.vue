<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import ThemeSetting from '@/components/ThemeSetting/index.vue'
import Notification from '@/components/Notification/index.vue'

const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()

const themeSettingRef = ref()

const username = computed(() => userStore.userInfo?.nickname || userStore.userInfo?.username || '管理员')

// 面包屑
const breadcrumbs = computed(() => {
  return router.currentRoute.value.matched
    .filter(item => item.meta?.title)
    .map(item => ({ title: item.meta?.title as string, path: item.path }))
})

// 下拉菜单
const handleCommand = (command: string) => {
  if (command === 'profile') router.push('/profile')
  else if (command === 'settings') themeSettingRef.value?.open()
  else if (command === 'logout') {
    userStore.logout()
    router.push('/login')
  }
}

// 全屏
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

// 锁屏
const lockScreen = () => {
  themeStore.lock()
}
</script>

<template>
  <div class="header">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
        <router-link v-if="item.path" :to="item.path">{{ item.title }}</router-link>
        <span v-else>{{ item.title }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 工具栏 -->
    <div class="toolbar">
      <!-- 锁屏 -->
      <el-tooltip content="锁屏" v-if="themeStore.lockScreenEnabled">
        <el-icon class="icon" @click="lockScreen"><Lock /></el-icon>
      </el-tooltip>

      <!-- 通知 -->
      <div class="icon-wrapper" v-if="themeStore.notificationEnabled">
        <Notification ref="notificationRef" />
      </div>

      <!-- 全屏 -->
      <el-tooltip content="全屏" v-if="themeStore.fullscreenEnabled">
        <el-icon class="icon" @click="toggleFullscreen"><FullScreen /></el-icon>
      </el-tooltip>

      <!-- 主题设置 -->
      <el-tooltip content="主题设置">
        <el-icon class="icon" @click="themeSettingRef?.open()"><Brush /></el-icon>
      </el-tooltip>

      <!-- 刷新 -->
      <el-tooltip content="刷新" v-if="themeStore.refreshEnabled">
        <el-icon class="icon" @click="router.go(0)"><Refresh /></el-icon>
      </el-tooltip>

      <!-- 用户 -->
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="user">
          <el-avatar :size="28">{{ username.charAt(0).toUpperCase() }}</el-avatar>
          <span>{{ username }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile"><el-icon><User /></el-icon> 个人中心</el-dropdown-item>
            <el-dropdown-item command="settings"><el-icon><Setting /></el-icon> 主题设置</el-dropdown-item>
            <el-dropdown-item command="logout" divided><el-icon><SwitchButton /></el-icon> 退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <ThemeSetting ref="themeSettingRef" />
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 0 16px;
}

.toolbar { display: flex; align-items: center; gap: 16px; }

.icon {
  font-size: 18px;
  color: var(--el-text-color-regular);
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 18px;
  transition: color 0.2s;
}

.icon:hover { color: var(--el-color-primary); }

.icon-wrapper { display: flex; align-items: center; height: 18px; }

.icon-wrapper :deep(.el-badge) { display: flex; align-items: center; }

.icon-wrapper :deep(.header-icon) {
  font-size: 18px;
  color: var(--el-text-color-regular);
  cursor: pointer;
  transition: color 0.2s;
}

.icon-wrapper :deep(.header-icon:hover) { color: var(--el-color-primary); }

.user {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-primary);
  cursor: pointer;
}
</style>