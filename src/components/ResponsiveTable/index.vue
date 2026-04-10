<script setup lang="ts">
import { useResponsive } from '@/composables/useResponsive'

defineProps<{
  minWidth?: string
}>()

const { isMobile } = useResponsive()
</script>

<template>
  <div class="table-wrapper">
    <div
      v-if="isMobile && minWidth"
      style="overflow-x: auto; -webkit-overflow-scrolling: touch"
    >
      <div :style="{ minWidth }">
        <slot />
      </div>
    </div>
    <slot v-else />
  </div>
</template>
