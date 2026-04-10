<script setup lang="ts">
import { ref } from 'vue'
import ResponsiveTable from '@/components/ResponsiveTable/index.vue'

// 表格数据
const tableData = ref([
  { id: 1, name: '张三', age: 28, email: 'zhangsan@example.com', status: 1 },
  { id: 2, name: '李四', age: 32, email: 'lisi@example.com', status: 1 },
  { id: 3, name: '王五', age: 25, email: 'wangwu@example.com', status: 0 },
  { id: 4, name: '赵六', age: 29, email: 'zhaoliu@example.com', status: 1 }
])

// 状态标签
const getStatusType = (status: number) => (status === 1 ? 'success' : 'danger')
const getStatusText = (status: number) => (status === 1 ? '启用' : '禁用')
</script>

<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>表格示例</span>
          <el-button type="primary" size="small">新增</el-button>
        </div>
      </template>

      <ResponsiveTable min-width="560px">
        <el-table :data="tableData" stripe border>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="姓名" width="120" />
          <el-table-column prop="age" label="年龄" width="80" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small" effect="dark">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template #default>
              <el-button size="small" link>编辑</el-button>
              <el-button type="danger" size="small" link>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </ResponsiveTable>
    </el-card>
  </div>
</template>

<style scoped>
</style>
