<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'

const themeStore = useThemeStore()
const userStore = useUserStore()

const password = ref('')
const error = ref(false)
const currentTime = ref(new Date().toLocaleString())

// 更新时间
setInterval(() => {
  currentTime.value = new Date().toLocaleString()
}, 1000)

// 用户信息
const username = computed(() => userStore.userInfo?.nickname || userStore.userInfo?.username || '用户')

// 解锁
const handleUnlock = () => {
  if (themeStore.unlock(password.value)) {
    password.value = ''
    error.value = false
  } else {
    error.value = true
  }
}
</script>

<template>
  <div class="lock-screen" v-if="themeStore.isLocked">
    <div class="lock-content">
      <!-- 时间 -->
      <div class="time">{{ currentTime }}</div>
      
      <!-- 用户头像 -->
      <el-avatar :size="80" class="avatar">
        {{ username.charAt(0).toUpperCase() }}
      </el-avatar>
      
      <!-- 用户名 -->
      <div class="username">{{ username }}</div>
      
      <!-- 解锁表单 -->
      <div class="unlock-form">
        <el-input
          v-model="password"
          type="password"
          placeholder="输入密码解锁"
          size="large"
          show-password
          @keyup.enter="handleUnlock"
        />
        <el-button type="primary" size="large" @click="handleUnlock">
          解锁
        </el-button>
      </div>
      
      <!-- 错误提示 -->
      <div v-if="error" class="error">密码错误</div>
    </div>
  </div>
</template>

<style scoped>
.lock-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--el-color-primary) 0%, #ff9a56 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.lock-content {
  text-align: center;
  color: #fff;
}

.time {
  font-size: 48px;
  font-weight: 300;
  margin-bottom: 40px;
}

.avatar {
  margin-bottom: 16px;
}

.username {
  font-size: 20px;
  margin-bottom: 32px;
}

.unlock-form {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.unlock-form .el-input {
  width: 200px;
}

.error {
  margin-top: 16px;
  color: #ff6b6b;
}
</style>