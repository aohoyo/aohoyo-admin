<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="error-page flex-center">
    <div class="error-content text-center">
      <h1 class="error-code">404</h1>
      <p class="error-message">抱歉，您访问的页面不存在</p>
      <el-space>
        <el-button type="primary" @click="goHome">返回首页</el-button>
        <el-button @click="goBack">返回上一页</el-button>
      </el-space>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
}

.error-content {
  padding: 40px;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  color: var(--el-color-primary);
  line-height: 1;
  margin-bottom: 20px;
}

.error-message {
  font-size: 18px;
  color: var(--el-text-color-secondary);
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .error-content {
    padding: 20px;
  }

  .error-code {
    font-size: 80px;
  }

  .error-message {
    font-size: 15px;
  }
}
</style>
