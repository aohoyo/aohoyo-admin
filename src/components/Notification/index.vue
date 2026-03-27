<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)

// 模拟通知数据
const notifications = ref([
  { id: 1, title: '系统通知', content: '欢迎使用 Aohoyo Admin', time: '10分钟前', read: false },
  { id: 2, title: '任务提醒', content: '您有新的待办任务', time: '30分钟前', read: false },
  { id: 3, title: '系统更新', content: '系统已更新到最新版本', time: '1小时前', read: true }
])

const unreadCount = ref(2)

// 打开通知
const open = () => {
  visible.value = true
}

// 全部已读
const markAllRead = () => {
  notifications.value.forEach(n => n.read = true)
  unreadCount.value = 0
}

// 清空所有
const clearAll = () => {
  notifications.value = []
  unreadCount.value = 0
}

// 标记已读
const markRead = (id: number) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification && !notification.read) {
    notification.read = true
    unreadCount.value--
  }
}

// 删除通知
const remove = (id: number) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    const notification = notifications.value[index]
    if (!notification.read) unreadCount.value--
    notifications.value.splice(index, 1)
  }
}

defineExpose({ open })
</script>

<template>
  <el-popover
    :visible="visible"
    placement="bottom"
    :width="320"
    trigger="click"
    @update:visible="visible = $event"
  >
    <template #reference>
      <el-badge :value="unreadCount" :hidden="unreadCount === 0" :max="99">
        <el-tooltip content="通知" placement="bottom">
          <el-icon class="header-icon"><Bell /></el-icon>
        </el-tooltip>
      </el-badge>
    </template>

    <div class="notification-panel">
      <div class="header">
        <span>通知</span>
        <div class="actions">
          <el-button type="primary" link size="small" @click="markAllRead">全部已读</el-button>
          <el-button type="danger" link size="small" @click="clearAll">清空</el-button>
        </div>
      </div>

      <el-scrollbar max-height="300px">
        <div v-if="notifications.length === 0" class="empty">
          <el-empty description="暂无通知" :image-size="80" />
        </div>
        <div v-else class="notification-list">
          <div
            v-for="item in notifications"
            :key="item.id"
            :class="['notification-item', { unread: !item.read }]"
          >
            <div class="dot" v-if="!item.read"></div>
            <div class="content">
              <div class="title">{{ item.title }}</div>
              <div class="desc">{{ item.content }}</div>
              <div class="time">{{ item.time }}</div>
            </div>
            <div class="actions">
              <el-button v-if="!item.read" type="primary" link size="small" @click="markRead(item.id)">标记已读</el-button>
              <el-icon class="close" @click="remove(item.id)"><Close /></el-icon>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </el-popover>
</template>

<style scoped>
.notification-panel { margin: -12px; min-width: 280px; }

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid var(--el-border-color);
  font-weight: 500;
}

.header .actions { display: flex; gap: 8px; }

.empty { padding: 20px; }

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  cursor: pointer;
  transition: background 0.2s;
}

.notification-item:hover { background: var(--el-fill-color-light); }

.notification-item.unread .dot {
  width: 6px;
  height: 6px;
  margin: 6px 8px 0 0;
  background: var(--el-color-primary);
  border-radius: 50%;
}

.content { flex: 1; }

.title { font-weight: 500; margin-bottom: 4px; }
.desc { font-size: 13px; color: var(--el-text-color-secondary); margin-bottom: 4px; }
.time { font-size: 12px; color: var(--el-text-color-placeholder); }

.notification-item .actions { display: flex; align-items: center; gap: 4px; }

.close {
  color: var(--el-text-color-placeholder);
  cursor: pointer;
  transition: color 0.2s;
}

.close:hover { color: var(--el-color-danger); }
</style>