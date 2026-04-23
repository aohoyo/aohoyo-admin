/<script setup lang="ts">
import { computed, watch, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTabsStore } from '@/stores/tabs'
import { useThemeStore } from '@/stores/theme'

const { t } = useI18n()
const themeStore = useThemeStore()
const route = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()

// 标签列表
const tabList = computed(() => tabsStore.tabList)

// 当前激活标签
const activeTab = computed({
  get: () => route.path,
  set: () => {}
})

// 右键菜单
const contextMenuVisible = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })
const selectedTab = ref<string>('')

// 标志：store 持久化数据是否已恢复
// 首次路由变化（来自 watch immediate）不写入 store，由 persist 接管
let storeRestored = false

// 监听路由变化，添加标签
watch(
  () => route.path,
  () => {
    if (!storeRestored) {
      // 首次触发是 watch immediate，来自 persist 恢复的已有标签，不重复添加
      storeRestored = true
      return
    }
    if (route.meta?.title && !route.meta?.hidden) {
      tabsStore.addTab({
        path: route.path,
        title: t(route.meta.title as string),
        name: route.name as string,
        icon: route.meta.icon as string
      })
    }
  },
  { immediate: true }
)

// 点击标签
const handleClick = (path: string) => {
  router.push(path)
}

// 右键菜单
const handleContextMenu = (e: MouseEvent, path: string) => {
  e.preventDefault()
  contextMenuVisible.value = true
  contextMenuPosition.value = { x: e.clientX, y: e.clientY }
  selectedTab.value = path
}

// 关闭右键菜单
const closeContextMenu = () => {
  contextMenuVisible.value = false
}

// 关闭标签
const handleClose = (path: string) => {
  tabsStore.removeTab(path)
  // 如果关闭的是当前页面，跳转到最后一个标签
  if (route.path === path) {
    const lastTab = tabList.value[tabList.value.length - 1]
    if (lastTab) {
      router.push(lastTab.path)
    } else {
      router.push('/dashboard')
    }
  }
}

// 关闭其他
const closeOther = () => {
  if (!selectedTab.value) return
  tabsStore.closeOtherTabs(selectedTab.value)
  if (route.path !== selectedTab.value) {
    router.push(selectedTab.value)
  }
  closeContextMenu()
}

// 关闭左侧
const closeLeft = () => {
  if (!selectedTab.value) return
  tabsStore.closeLeftTabs(selectedTab.value)
  closeContextMenu()
}

// 关闭右侧
const closeRight = () => {
  if (!selectedTab.value) return
  tabsStore.closeRightTabs(selectedTab.value)
  closeContextMenu()
}

// 关闭所有
const closeAll = () => {
  tabsStore.closeAllTabs()
  router.push('/dashboard')
  closeContextMenu()
}

// 刷新当前页
const refreshPage = () => {
  router.go(0)
  closeContextMenu()
}

// 点击其他地方关闭菜单
onMounted(() => {
  document.addEventListener('click', closeContextMenu)
})
onUnmounted(() => {
  document.removeEventListener('click', closeContextMenu)
})
</script>
