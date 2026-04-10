<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 表单引用
const formRef = ref<FormInstance>()
const loading = ref(false)

// 表单数据
const formData = reactive({
  username: 'admin',
  password: 'admin123'
})

// 表单规则
const rules: FormRules = {
  username: [{ required: true, message: t('login.username') + '...', trigger: 'blur' }],
  password: [{ required: true, message: t('login.password') + '...', trigger: 'blur' }]
}

// 登录
const handleLogin = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async valid => {
    if (!valid) return

    loading.value = true
    try {
      await userStore.login(formData.username, formData.password)
      ElMessage.success(t('login.loginSuccess'))

      // 跳转到目标页面或首页
      const redirect = (route.query.redirect as string) || '/'
      router.push(redirect)
    } catch (error) {
      ElMessage.error(t('login.loginFailed'))
    } finally {
      loading.value = false
    }
  })
}

// 回车登录
const handleKeyup = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleLogin()
  }
}
</script>

<template>
  <div class="login-container" @keyup="handleKeyup">
    <div class="login-box">
      <!-- Logo -->
      <div class="login-header">
        <img src="/logo.png" alt="Logo" class="login-logo" />
        <h1 class="login-title">Aohoyo Admin</h1>
        <p class="login-subtitle">通用后台管理系统</p>
      </div>

      <!-- 登录表单 -->
      <el-form ref="formRef" :model="formData" :rules="rules" class="login-form">
        <el-form-item prop="username">
          <el-input
            v-model="formData.username"
            :placeholder="t('login.username')"
            prefix-icon="User"
            size="large"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            :placeholder="t('login.password')"
            prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-btn"
            @click="handleLogin"
          >
            {{ loading ? t('common.loading') : t('login.loginBtn') }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 提示 -->
      <div class="login-footer">
        <p>默认账号：admin / admin123</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  padding: 16px;
}

.login-box {
  width: 400px;
  max-width: 100%;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-logo {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.login-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--el-color-primary);
}

.login-subtitle {
  margin: 8px 0 0;
  color: var(--el-text-color-secondary);
}

.login-form {
  margin-top: 24px;
}

.login-btn {
  width: 100%;
}

.login-footer {
  margin-top: 24px;
  text-align: center;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .login-box {
    padding: 24px 20px;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }

  .login-header {
    margin-bottom: 24px;
  }

  .login-logo {
    width: 48px;
    height: 48px;
    margin-bottom: 12px;
  }

  .login-title {
    font-size: 20px;
  }

  .login-subtitle {
    font-size: 13px;
    margin-top: 6px;
  }

  .login-form {
    margin-top: 16px;
  }
}
</style>
