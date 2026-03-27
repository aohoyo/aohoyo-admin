<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useTabsStore } from '@/stores/tabs'
import GlobalLoading from '@/components/GlobalLoading/index.vue'
import LockScreen from '@/components/LockScreen/index.vue'

const themeStore = useThemeStore()
const tabsStore = useTabsStore()

onMounted(() => {
  themeStore.initTheme()
  tabsStore.migrateAllIcons()
})
</script>

<template>
  <RouterView />
  <GlobalLoading />
  <LockScreen />
</template>

<style>
#app { width: 100%; height: 100%; }
</style>