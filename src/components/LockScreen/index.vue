<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'

const { t } = useI18n()
const themeStore = useThemeStore()
const userStore = useUserStore()

const password = ref('')
const error = ref(false)
const showSetPassword = ref(false)
const newPassword = ref('')
const confirmPassword = ref('')
const setPasswordError = ref('')
const isDev = import.meta.env.DEV

// 解锁标记：先禁用昂贵 CSS，再移除 DOM
const unlocking = ref(false)

const isLocked = computed(() => themeStore.isLocked)

// 时间
const timeStr = ref('')
const dateStr = ref('')
let timer: ReturnType<typeof setInterval> | null = null

const updateTime = () => {
  const now = new Date()
  timeStr.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  dateStr.value = `${now.getMonth() + 1}月${now.getDate()}日 ${weekdays[now.getDay()]}`
}

const startTimer = () => {
  stopTimer()
  updateTime()
  timer = setInterval(updateTime, 1000)
}

const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// 按 isLocked 管理 timer
watch(isLocked, val => {
  if (val) {
    startTimer()
    unlocking.value = false
  } else {
    stopTimer()
  }
})

onMounted(() => {
  if (isLocked.value) startTimer()
})

onUnmounted(() => {
  stopTimer()
})

const username = computed(
  () => userStore.userInfo?.nickname || userStore.userInfo?.username || '用户'
)
const hasPassword = computed(() => !!themeStore.lockPassword)

// 解锁：本地验证 → 禁用 CSS → nextTick 更新 store
const handleUnlock = () => {
  const pwd = password.value

  // 使用 store 验证密码
  if (!themeStore.unlock(pwd)) {
    error.value = true
    setTimeout(() => (error.value = false), 2000)
    return
  }

  // 验证通过 → 立即隐藏
  unlocking.value = true
  stopTimer()
  error.value = false
  password.value = ''
}

// 设置密码
const handleSetPassword = () => {
  if (newPassword.value.length < 4) {
    setPasswordError.value = t('lockScreen.passwordMinLength')
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    setPasswordError.value = t('lockScreen.passwordMismatch')
    return
  }

  themeStore.setLockPassword(newPassword.value)
  newPassword.value = ''
  confirmPassword.value = ''
  setPasswordError.value = ''
  showSetPassword.value = false
}

const handleClearPassword = () => {
  themeStore.clearLockPassword()
  showSetPassword.value = false
}
</script>

<template>
  <div v-if="isLocked" class="lock-screen" :class="{ unlocking }">
    <div class="lock-card">
      <!-- 时间 -->
      <div class="time">{{ timeStr }}</div>
      <div class="date">{{ dateStr }}</div>

      <!-- 用户 -->
      <el-avatar :size="64" class="avatar">{{ username.charAt(0).toUpperCase() }}</el-avatar>
      <div class="username">{{ username }}</div>

      <!-- 设置密码 -->
      <template v-if="showSetPassword">
        <el-input
          v-model="newPassword"
          type="password"
          :placeholder="t('lockScreen.setPassword')"
          size="large"
          show-password
        />
        <el-input
          v-model="confirmPassword"
          type="password"
          :placeholder="t('lockScreen.confirmPassword')"
          size="large"
          show-password
          style="margin-top: 12px"
        />
        <el-alert
          v-if="setPasswordError"
          :title="setPasswordError"
          type="error"
          :closable="false"
          style="margin-top: 12px"
        />
        <div style="margin-top: 16px; display: flex; gap: 12px">
          <el-button @click="showSetPassword = false">{{ t('common.cancel') }}</el-button>
          <el-button type="primary" @click="handleSetPassword">
            {{ t('lockScreen.confirmSet') }}
          </el-button>
        </div>
      </template>

      <!-- 解锁 -->
      <template v-else>
        <el-alert v-if="!hasPassword" type="warning" :closable="false" style="margin-bottom: 12px">
          {{ t('lockScreen.noPassword') }}
          <el-button type="primary" link size="small" @click="showSetPassword = true">
            {{ t('lockScreen.setPasswordNow') }}
          </el-button>
        </el-alert>

        <el-input
          v-model="password"
          type="password"
          :placeholder="hasPassword ? t('lockScreen.enterPassword') : t('lockScreen.clickToUnlock')"
          size="large"
          show-password
          @keyup.enter="handleUnlock"
        />

        <el-alert
          v-if="error"
          :title="t('lockScreen.passwordError')"
          type="error"
          :closable="false"
          style="margin-top: 12px"
        />

        <el-button
          type="primary"
          size="large"
          style="width: 100%; margin-top: 16px"
          @click="handleUnlock"
        >
          {{ t('lockScreen.unlock') }}
        </el-button>

        <el-button
          v-if="hasPassword && isDev"
          type="warning"
          link
          style="margin-top: 12px"
          @click="handleClearPassword"
        >
          {{ t('lockScreen.clearPasswordDev') }}
        </el-button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.lock-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
}

/* 解锁时立即隐藏，避免 backdrop-filter 等昂贵 CSS 阻塞 */
.lock-screen.unlocking {
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
  transition: none !important;
}

.lock-screen.unlocking .lock-card {
  backdrop-filter: none !important;
}

.lock-card {
  width: 380px;
  padding: 32px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  color: #fff;
}

.time {
  font-size: 48px;
  font-weight: 200;
}

.date {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
}

.avatar {
  background: rgba(255, 255, 255, 0.9);
  color: #1a1a2e;
  font-size: 24px;
  font-weight: 600;
}

.username {
  font-size: 16px;
  margin: 12px 0 20px;
}

.lock-card :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: none;
}

.lock-card :deep(.el-input__inner) {
  color: #fff;
}

.lock-card :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.5);
}

.lock-card :deep(.el-button--primary) {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.lock-card :deep(.el-button--primary:hover) {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .lock-card {
    width: calc(100% - 32px);
    max-width: 380px;
    padding: 24px 16px;
  }

  .time {
    font-size: 36px;
  }

  .date {
    font-size: 13px;
  }

  .avatar {
    width: 52px !important;
    height: 52px !important;
  }
}
</style>
