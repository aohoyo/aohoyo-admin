<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { useResponsive } from '@/composables/useResponsive'

const { t } = useI18n()
const userStore = useUserStore()
const { isMobile } = useResponsive()
</script>

<template>
  <div class="dashboard">
    <h1 class="welcome-title">
      {{ t('dashboard.welcome') }}，{{
        userStore.userInfo?.nickname || userStore.username || '用户'
      }}！
    </h1>

    <el-row :gutter="isMobile ? 12 : 20" class="stat-row">
      <el-col :xs="12" :sm="12" :md="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value" style="color: var(--el-color-primary)">1,234</div>
            <div class="stat-label">{{ t('dashboard.todayVisit') }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value" style="color: var(--el-color-success)">56</div>
            <div class="stat-label">{{ t('dashboard.newUsers') }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value" style="color: var(--el-color-primary)">89%</div>
            <div class="stat-label">{{ t('dashboard.systemLoad') }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value" style="color: #9b59b6">99.9%</div>
            <div class="stat-label">{{ t('dashboard.availability') }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="quick-start-card">
      <template #header>
        <span>{{ t('dashboard.quickStart') }}</span>
      </template>
      <el-space wrap>
        <el-button type="primary">{{ t('dashboard.newProject') }}</el-button>
        <el-button>{{ t('dashboard.viewDocs') }}</el-button>
        <el-button>{{ t('dashboard.systemSettings') }}</el-button>
      </el-space>
    </el-card>

    <el-card>
      <template #header>
        <span>{{ t('dashboard.systemInfo') }}</span>
      </template>
      <el-descriptions :column="isMobile ? 1 : 2" border>
        <el-descriptions-item :label="t('dashboard.frameworkVersion')">
          Vue 3.x
        </el-descriptions-item>
        <el-descriptions-item :label="t('dashboard.uiComponent')">
          Element Plus
        </el-descriptions-item>
        <el-descriptions-item :label="t('dashboard.buildTool')">Vite</el-descriptions-item>
        <el-descriptions-item :label="t('dashboard.styleSolution')">SCSS</el-descriptions-item>
        <el-descriptions-item :label="t('dashboard.stateManagement')">Pinia</el-descriptions-item>
        <el-descriptions-item :label="t('dashboard.themeColor')">
          #F37021 (爱马仕橙)
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 24px;
}

.welcome-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}

.stat-row {
  margin-bottom: 24px;
}

.stat-card {
  cursor: pointer;
  transition: transform 0.2s;
  margin-bottom: 12px;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-content {
  text-align: center;
  padding: 10px 0;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-label {
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.quick-start-card {
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 16px 8px;
  }

  .welcome-title {
    font-size: 20px;
    margin-bottom: 12px;
  }

  .stat-row {
    margin-bottom: 16px;
  }

  .stat-content {
    padding: 8px 0;
  }

  .stat-value {
    font-size: 24px;
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 12px;
  }

  .quick-start-card {
    margin-bottom: 16px;
  }
}
</style>
