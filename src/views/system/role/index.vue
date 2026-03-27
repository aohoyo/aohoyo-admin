<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

// 表格数据
const tableData = ref([
  { id: 1, name: '超级管理员', code: 'admin', description: '拥有所有权限', status: 1, permissions: ['*'], createTime: '2026-01-01 00:00:00' },
  { id: 2, name: '普通用户', code: 'user', description: '普通用户权限', status: 1, permissions: ['dashboard:view', 'profile:view'], createTime: '2026-01-01 00:00:00' },
  { id: 3, name: '编辑员', code: 'editor', description: '内容编辑权限', status: 1, permissions: ['dashboard:view', 'content:view', 'content:edit'], createTime: '2026-02-01 00:00:00' }
])

const loading = ref(false)
const total = ref(3)

// 查询参数
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  keyword: ''
})

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('新增角色')
const formRef = ref<FormInstance>()
const treeRef = ref()

// 权限树配置
const permissionTree = [
  {
    id: 'system',
    label: '系统管理',
    children: [
      { id: 'user', label: '用户管理', children: [
        { id: 'user:view', label: '查看' },
        { id: 'user:create', label: '新增' },
        { id: 'user:edit', label: '编辑' },
        { id: 'user:delete', label: '删除' }
      ]},
      { id: 'role', label: '角色管理', children: [
        { id: 'role:view', label: '查看' },
        { id: 'role:create', label: '新增' },
        { id: 'role:edit', label: '编辑' },
        { id: 'role:delete', label: '删除' }
      ]},
      { id: 'menu', label: '菜单管理', children: [
        { id: 'menu:view', label: '查看' },
        { id: 'menu:create', label: '新增' },
        { id: 'menu:edit', label: '编辑' },
        { id: 'menu:delete', label: '删除' }
      ]}
    ]
  },
  {
    id: 'content',
    label: '内容管理',
    children: [
      { id: 'article', label: '文章管理', children: [
        { id: 'content:view', label: '查看' },
        { id: 'content:create', label: '新增' },
        { id: 'content:edit', label: '编辑' },
        { id: 'content:delete', label: '删除' }
      ]}
    ]
  },
  {
    id: 'other',
    label: '其他',
    children: [
      { id: 'dashboard:view', label: '仪表盘' },
      { id: 'profile:view', label: '个人中心' }
    ]
  }
]

// 表单数据
const formData = reactive({
  id: 0,
  name: '',
  code: '',
  description: '',
  status: 1,
  permissions: [] as string[]
})

// 表单规则
const rules: FormRules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }]
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  loadData()
}

// 加载数据
const loadData = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增角色'
  resetForm()
  dialogVisible.value = true
}

// 编辑（包含权限设置）
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑角色'
  Object.assign(formData, {
    ...row,
    permissions: [...(row.permissions || [])]
  })
  dialogVisible.value = true
  // 设置树选中状态
  setTimeout(() => {
    if (treeRef.value) {
      treeRef.value.setCheckedKeys(formData.permissions)
    }
  }, 100)
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除角色「${row.name}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    loadData()
  })
}

// 提交
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      // 获取选中的权限
      if (treeRef.value) {
        formData.permissions = treeRef.value.getCheckedKeys()
      }
      ElMessage.success(formData.id ? '修改成功' : '新增成功')
      dialogVisible.value = false
      loadData()
    }
  })
}

// 重置表单
const resetForm = () => {
  formData.id = 0
  formData.name = ''
  formData.code = ''
  formData.description = ''
  formData.status = 1
  formData.permissions = []
  if (treeRef.value) {
    treeRef.value.setCheckedKeys([])
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="page-container">
    <el-card>
      <!-- 搜索栏 -->
      <template #header>
        <div class="card-header">
          <el-input
            v-model="queryParams.keyword"
            placeholder="搜索角色名称"
            style="width: 200px"
            clearable
            @keyup.enter="handleSearch"
          />
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </div>
      </template>

      <!-- 操作按钮 -->
      <div class="mb-4">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增角色
        </el-button>
      </div>

      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading" stripe border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" width="150" />
        <el-table-column prop="code" label="角色编码" width="120" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small" effect="dark">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="170" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button size="small" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入角色名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色编码" prop="code">
              <el-input v-model="formData.code" placeholder="请输入角色编码" :disabled="formData.id > 0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="描述">
          <el-input v-model="formData.description" type="textarea" :rows="2" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="权限配置">
          <div class="permission-tree-wrapper">
            <el-tree
              ref="treeRef"
              :data="permissionTree"
              show-checkbox
              node-key="id"
              :default-checked-keys="formData.permissions"
              :props="{ label: 'label', children: 'children' }"
              default-expand-all
              highlight-current
            />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.page-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mb-4 {
  margin-bottom: 16px;
}

.mt-4 {
  margin-top: 16px;
}

.flex {
  display: flex;
}

.justify-end {
  justify-content: flex-end;
}

.permission-tree-wrapper {
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 12px;
  background-color: var(--bg-color-page);
}

.permission-tree-wrapper :deep(.el-tree-node__content) {
  height: 32px;
}

.permission-tree-wrapper :deep(.el-tree-node__label) {
  font-size: 13px;
}
</style>