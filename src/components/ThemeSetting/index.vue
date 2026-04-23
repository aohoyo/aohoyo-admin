<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'

const { t } = useI18n()
const themeStore = useThemeStore()
const visible = ref(false)

const presets = computed(() => themeStore.presets)
const customColor = ref<string | null>(themeStore.primaryColor)

const handleSelectColor = (color: string | null) => {
  if (color) {
    themeStore.setPrimaryColor(color)
    customColor.value = color
  }
}

const handleSelectRadius = (val: number | number[]) => {
  const radius = Array.isArray(val) ? val[0] : val
  themeStore.setBorderRadius(radius)
}

const open = () => {
  visible.value = true
}
defineExpose({ open })
</script>

<template>
  <el-drawer v-model="visible" :title="t('theme.title')" size="300px">
    <div class="settings">
      <!-- 暗黑模式 -->
      <div class="item">
        <span>{{ t('theme.darkMode') }}</span>
        <el-switch :model-value="themeStore.mode === 'dark'" @change="themeStore.toggleDark" />
      </div>

      <!-- 主题色 -->
      <div class="item">
        <span>{{ t('theme.primaryColor') }}</span>
        <div class="colors">
          <div
            v-for="p in presets"
            :key="p.primary"
            class="color"
            :class="{ active: themeStore.primaryColor === p.primary }"
            :style="{ background: p.primary }"
            @click="handleSelectColor(p.primary)"
          >
            <el-icon v-if="themeStore.primaryColor === p.primary" color="#fff"><Check /></el-icon>
          </div>
          <!-- 自定义 - 彩虹背景 -->
          <div
            class="color rainbow"
            :class="{ active: !presets.some(p => p.primary === themeStore.primaryColor) }"
          >
            <el-color-picker v-model="customColor" size="small" @change="handleSelectColor" />
          </div>
        </div>
      </div>

      <!-- 圆角 -->
      <div class="item">
        <span>{{ t('theme.borderRadius') }}: {{ themeStore.borderRadius }}px</span>
        <el-slider
          :model-value="themeStore.borderRadius"
          :min="0"
          :max="16"
          @input="handleSelectRadius"
        />
      </div>

      <!-- 功能开关 -->
      <div class="divider">{{ t('theme.featureSettings') }}</div>

      <div class="item">
        <span>{{ t('theme.lockScreenBtn') }}</span>
        <el-switch
          :model-value="themeStore.lockScreenEnabled"
          @change="themeStore.toggleLockScreen"
        />
      </div>

      <div class="item">
        <span>{{ t('theme.notificationBtn') }}</span>
        <el-switch
          :model-value="themeStore.notificationEnabled"
          @change="themeStore.toggleNotification"
        />
      </div>

      <div class="item">
        <span>{{ t('theme.fullscreenBtn') }}</span>
        <el-switch
          :model-value="themeStore.fullscreenEnabled"
          @change="themeStore.toggleFullscreen"
        />
      </div>

      <div class="item">
        <span>{{ t('theme.refreshBtn') }}</span>
        <el-switch :model-value="themeStore.refreshEnabled" @change="themeStore.toggleRefresh" />
      </div>

      <div class="item">
        <span>{{ t('theme.languageBtn') }}</span>
        <el-switch :model-value="themeStore.languageEnabled" @change="themeStore.toggleLanguage" />
      </div>

      <div class="divider">{{ t('theme.tabSettings') }}</div>

      <div class="item">
        <span>{{ t('theme.tabs') }}</span>
        <el-switch :model-value="themeStore.tabsEnabled" @change="themeStore.toggleTabs" />
      </div>

      <div class="item">
        <span>{{ t('theme.tabIcon') }}</span>
        <el-switch
          :model-value="themeStore.tabsShowIcon"
          :disabled="!themeStore.tabsEnabled"
          @change="themeStore.toggleTabsIcon"
        />
      </div>

      <!-- 特殊模式 -->
      <div class="divider">{{ t('theme.specialMode') }}</div>

      <div class="item">
        <span>{{ t('theme.grayMode') }}</span>
        <el-switch :model-value="themeStore.grayMode" @change="themeStore.toggleGrayMode" />
      </div>

      <div class="item">
        <span>{{ t('theme.colorWeakMode') }}</span>
        <el-switch :model-value="themeStore.colorWeak" @change="themeStore.toggleColorWeak" />
      </div>

      <div class="item">
        <span>{{ t('theme.animation') }}</span>
        <el-switch :model-value="themeStore.animation" @change="themeStore.toggleAnimation" />
      </div>
    </div>
  </el-drawer>
</template>

<style scoped>
.settings {
  padding: 0 16px;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.item > span {
  font-size: 14px;
  color: var(--el-text-color-primary);
}

.divider {
  padding: 16px 0 8px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.colors {
  display: flex;
  gap: 8px;
}

.color {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border: 2px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.color:hover {
  transform: scale(1.1);
}
.color.active {
  border-color: var(--el-color-primary);
}

.color.rainbow {
  background: conic-gradient(
    from 0deg,
    #ff6b6b,
    #feca57,
    #48dbfb,
    #ff9ff3,
    #54a0ff,
    #5f27cd,
    #ff6b6b
  );
}

.color.rainbow :deep(.el-color-picker__trigger) {
  width: 24px !important;
  height: 24px !important;
  border: none !important;
  background: transparent !important;
}
</style>
