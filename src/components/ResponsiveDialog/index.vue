<script setup lang="ts">
import { computed } from 'vue'
import { useResponsive } from '@/composables/useResponsive'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  desktopWidth?: string
}>(), {
  desktopWidth: '50%'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { isMobile } = useResponsive()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :width="isMobile ? '92%' : desktopWidth"
    :fullscreen="isMobile"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </el-dialog>
</template>
