<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import { useAppStore } from '@/stores/app'
import { setLocale, getLocaleValue } from '@/locales'
import ThemeSetting from '@/components/ThemeSetting/index.vue'
import Notification from '@/components/Notification/index.vue'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()
const appStore = useAppStore()

const themeSettingRef = ref()
const currentLocale = ref(getLocaleValue())

const isMobile = computed(() => appStore.device === 'mobile')

const refreshPage = async () => {
  const route = router.currentRoute.value
  router.replace('/redirect' + route.fullPath)
  await nextTick()
  router.replace(route.fullPath)
}

const languages = [
  { label: '简体中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' }
]

const username = computed(
  () => userStore.userInfo?.nickname || userStore.userInfo?.username || '管理员'
)

// 面包屑
const breadcrumbs = computed(() => {
  return router.currentRoute.value.matched
    .filter(item => item.meta?.title)
    .map(item => ({ titleKey: item.meta?.title as string, path: item.path }))
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

// 语言切换
const handleLocaleChange = (locale: string) => {
  setLocale(locale)
  currentLocale.value = locale
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
  <div :class="['header', { 'is-mobile': isMobile }]">
    <!-- 移动端汉堡按钮 -->
    <el-icon v-if="isMobile" class="hamburger-btn" @click="appStore.toggleSidebar">
      <Expand />
    </el-icon>

    <!-- 面包屑（桌面端显示） -->
    <el-breadcrumb v-if="!isMobile" separator="/">
      <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
        <router-link v-if="item.path" :to="item.path">{{ t(item.titleKey) }}</router-link>
        <span v-else>{{ t(item.titleKey) }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 移动端标题 -->
    <span v-if="isMobile" class="mobile-title">{{ t(breadcrumbs[breadcrumbs.length - 1]?.titleKey || 'dashboard.welcome') }}</span>

    <!-- 工具栏 -->
    <div :class="['toolbar', { 'is-mobile': isMobile }]">
      <!-- 锁屏 -->
      <el-tooltip v-if="themeStore.lockScreenEnabled && !isMobile" :content="t('header.lockScreen')">
        <el-icon class="icon" @click="lockScreen"><Lock /></el-icon>
      </el-tooltip>

      <!-- 通知 -->
      <div v-if="themeStore.notificationEnabled" class="icon-wrapper">
        <Notification ref="notificationRef" />
      </div>

      <!-- 全屏（仅桌面端） -->
      <el-tooltip v-if="themeStore.fullscreenEnabled && !isMobile" :content="t('header.fullscreen')">
        <el-icon class="icon" @click="toggleFullscreen"><FullScreen /></el-icon>
      </el-tooltip>

      <!-- 主题设置 -->
      <el-tooltip v-if="!isMobile" :content="t('header.themeSetting')">
        <el-icon class="icon" @click="themeSettingRef?.open()"><Brush /></el-icon>
      </el-tooltip>

      <!-- 语言切换（仅桌面端） -->
      <el-dropdown v-if="themeStore.languageEnabled && !isMobile" trigger="click" @command="handleLocaleChange">
        <span class="icon lang-text">{{ currentLocale === 'zh-CN' ? '中' : 'EN' }}</span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="lang in languages" :key="lang.value" :command="lang.value">
              {{ lang.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 刷新 -->
      <el-tooltip v-if="themeStore.refreshEnabled && !isMobile" :content="t('common.refresh')">
        <el-icon class="icon" @click="refreshPage"><Refresh /></el-icon>
      </el-tooltip>

      <!-- 用户 -->
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="user">
          <el-avatar :size="28">{{ username.charAt(0).toUpperCase() }}</el-avatar>
          <span v-if="!isMobile">{{ username }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              {{ t('header.profile') }}
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>
              {{ t('header.themeSetting') }}
            </el-dropdown-item>
            <el-dropdown-item command="logout" divided>
              <el-icon><SwitchButton /></el-icon>
              {{ t('header.logout') }}
            </el-dropdown-item>
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

.header.is-mobile {
  padding: 0 12px;
}

.hamburger-btn {
  font-size: 22px;
  color: var(--el-text-color-primary);
  cursor: pointer;
  margin-right: 12px;
  flex-shrink: 0;
  transition: color 0.2s;
}

.hamburger-btn:hover {
  color: var(--el-color-primary);
}

.mobile-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.toolbar.is-mobile {
  gap: 8px;
}

.icon {
  font-size: 18px;
  color: var(--el-text-color-regular);
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 18px;
  transition: color 0.2s;
}

.icon:hover {
  color: var(--el-color-primary);
}

.icon-wrapper {
  display: flex;
  align-items: center;
  height: 18px;
}

.icon-wrapper :deep(.el-badge) {
  display: flex;
  align-items: center;
}

.icon-wrapper :deep(.header-icon) {
  font-size: 18px;
  color: var(--el-text-color-regular);
  cursor: pointer;
  transition: color 0.2s;
}

.icon-wrapper :deep(.header-icon:hover) {
  color: var(--el-color-primary);
}

.user {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-primary);
  cursor: pointer;
}

.lang-text {
  font-style: normal;
  font-size: 14px;
  font-weight: 500;
}
</style>
