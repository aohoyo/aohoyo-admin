<script setup lang="ts">
defineOptions({ name: 'Dashboard' })
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { useResponsive } from '@/composables/useResponsive'

// ECharts tree-shaking 按需引入
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { ECharts } from 'echarts/core'
import type { LineSeriesOption } from 'echarts/charts'

// 解构模板中使用的全局对象
const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()
const { isMobile } = useResponsive()

// 注册必要的组件（tree-shaking 需要显式注册）
echarts.use([LineChart, TooltipComponent, GridComponent, LegendComponent, CanvasRenderer])

// 统计数据
const stats = ref([
  { label: 'todayVisit', value: 1234, color: '#F37021' },
  { label: 'newUsers', value: 56, color: '#67c23a' },
  { label: 'systemLoad', value: 89, suffix: '%', color: '#e6a23c' },
  { label: 'availability', value: 99.9, suffix: '%', color: '#9b59b6' }
])

// ECharts
const chartRef = ref<HTMLDivElement>()
let chart: ECharts | null = null

function initChart() {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)
  chart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '访问量',
        type: 'line',
        smooth: true,
        areaStyle: { opacity: 0.15 },
        data: [820, 932, 901, 1034, 1290, 1330, 1020],
        itemStyle: { color: '#F37021' }
      },
      {
        name: '新增用户',
        type: 'line',
        smooth: true,
        areaStyle: { opacity: 0.15 },
        data: [12, 18, 15, 22, 28, 20, 25],
        itemStyle: { color: '#67c23a' }
      }
    ]
  })
}

// 数字动画
function animateNumber(el: HTMLElement, target: number, suffix = '') {
  const duration = 1000
  const start = Date.now()
  const tick = () => {
    const progress = Math.min((Date.now() - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    const current = target % 1 === 0 ? Math.round(target * eased) : +(target * eased).toFixed(1)
    el.textContent = current.toLocaleString() + suffix
    if (progress < 1) requestAnimationFrame(tick)
  }
  tick()
}

// 快捷操作
const quickActions = [
  { label: 'newProject', icon: 'Plus', route: '/system/user' },
  { label: 'viewDocs', icon: 'Document', route: '/example/table' },
  { label: 'systemSettings', icon: 'Setting', route: '/profile' }
]

function handleQuickAction(route: string) {
  router.push(route)
}

// 响应式
function handleResize() {
  chart?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
  // 数字动画
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat((el as HTMLElement).dataset.count || '0')
    const suffix = (el as HTMLElement).dataset.suffix || ''
    animateNumber(el as HTMLElement, target, suffix)
  })
})

onUnmounted(() => {
  chart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="dashboard">
    <h1 class="welcome-title">
      {{ t('dashboard.welcome') }}，{{
        userStore.userInfo?.nickname || userStore.username || '用户'
      }}！
    </h1>

    <!-- 统计卡片 -->
    <el-row :gutter="isMobile ? 12 : 20" class="stat-row">
      <el-col v-for="item in stats" :key="item.label" :xs="12" :sm="12" :md="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div
              class="stat-value"
              :style="{ color: item.color }"
              :data-count="item.value"
              :data-suffix="item.suffix"
            >
              {{ item.suffix ? '0%' : '0' }}
            </div>
            <div class="stat-label">{{ t(`dashboard.${item.label}`) }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 趋势图 -->
    <el-card class="chart-card">
      <template #header>
        <span>{{ t('dashboard.quickStart') }} - 周趋势</span>
      </template>
      <div ref="chartRef" class="chart-container" />
    </el-card>

    <el-row :gutter="isMobile ? 12 : 20" class="bottom-row">
      <!-- 快捷操作 -->
      <el-col :xs="24" :md="12">
        <el-card class="quick-start-card">
          <template #header>
            <span>{{ t('dashboard.quickStart') }}</span>
          </template>
          <div class="quick-actions">
            <div
              v-for="action in quickActions"
              :key="action.label"
              class="action-item"
              @click="handleQuickAction(action.route)"
            >
              <el-icon :size="24"><component :is="action.icon" /></el-icon>
              <span>{{ t(`dashboard.${action.label}`) }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 系统信息 -->
      <el-col :xs="24" :md="12">
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
            <el-descriptions-item :label="t('dashboard.stateManagement')">
              Pinia
            </el-descriptions-item>
            <el-descriptions-item :label="t('dashboard.themeColor')">
              #F37021 (爱马仕橙)
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
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
  margin-bottom: 20px;
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
  font-family: 'SF Mono', 'Monaco', 'Menlo', monospace;
}

.stat-label {
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-container {
  height: 320px;
  width: 100%;
}

.bottom-row {
  margin-bottom: 24px;
}

.quick-start-card {
  height: 100%;
}

.quick-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--el-fill-color-light);
  font-size: 14px;
}

.action-item:hover {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .dashboard {
    padding: 16px 8px;
  }

  .welcome-title {
    font-size: 20px;
    margin-bottom: 12px;
  }

  .stat-value {
    font-size: 24px;
    margin-bottom: 4px;
  }

  .chart-container {
    height: 240px;
  }
}
</style>
