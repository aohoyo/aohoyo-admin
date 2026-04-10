import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

export function useResponsive() {
  const appStore = useAppStore()
  const isMobile = computed(() => appStore.device === 'mobile')

  const paginationLayout = computed(() =>
    isMobile.value
      ? 'total, prev, pager, next'
      : 'total, sizes, prev, pager, next, jumper'
  )

  const paginationSmall = computed(() => isMobile.value)

  return { isMobile, paginationLayout, paginationSmall }
}
