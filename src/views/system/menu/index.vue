<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 所有 Element Plus 图标
const iconList = Object.keys(ElementPlusIconsVue)

// 表格数据 - 树形结构
const tableData = ref([
  { 
    id: 1, 
    parentId: 0, 
    name: '首页', 
    path: '/dashboard', 
    icon: 'HomeFilled', 
    sort: 1, 
    status: 1, 
    type: 'menu',
    children: []
  },
  { 
    id: 2, 
    parentId: 0, 
    name: '系统管理', 
    path: '/system', 
    icon: 'Setting', 
    sort: 2, 
    status: 1, 
    type: 'dir',
    children: [
      { id: 3, parentId: 2, name: '用户管理', path: '/system/user', icon: 'User', sort: 1, status: 1, type: 'menu', children: [] },
      { id: 4, parentId: 2, name: '角色管理', path: '/system/role', icon: 'UserFilled', sort: 2, status: 1, type: 'menu', children: [] },
      { id: 5, parentId: 2, name: '菜单管理', path: '/system/menu', icon: 'Menu', sort: 3, status: 1, type: 'menu', children: [] }
    ]
  },
  { 
    id: 6, 
    parentId: 0, 
    name: '示例页面', 
    path: '/example', 
    icon: 'Document', 
    sort: 3, 
    status: 1, 
    type: 'dir',
    children: [
      { id: 7, parentId: 6, name: '表格示例', path: '/example/table', icon: 'Grid', sort: 1, status: 1, type: 'menu', children: [] },
      { id: 8, parentId: 6, name: '表单示例', path: '/example/form', icon: 'EditPen', sort: 2, status: 1, type: 'menu', children: [] }
    ]
  }
])

const loading = ref(false)

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('新增菜单')
const formRef = ref<FormInstance>()

// 菜单类型
const menuTypes = [
  { label: '目录', value: 'dir' },
  { label: '菜单', value: 'menu' },
  { label: '按钮', value: 'button' }
]

// 扁平化菜单列表（用于选择父级）
const flatMenuList = computed(() => {
  const result: any[] = [{ id: 0, name: '顶级菜单' }]
  const flatten = (list: any[], level = 0) => {
    list.forEach(item => {
      result.push({ ...item, level })
      if (item.children?.length) {
        flatten(item.children, level + 1)
      }
    })
  }
  flatten(tableData.value)
  return result
})

// 表单数据
const formData = reactive({
  id: 0,
  parentId: 0,
  name: '',
  path: '',
  icon: '',
  sort: 1,
  status: 1,
  type: 'menu'
})

// 表单规则
const rules: FormRules = {
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
  type: [{ required: true, message: '请选择菜单类型', trigger: 'change' }]
}

// 图标选择器显示
const iconPickerVisible = ref(false)

// 选择图标
const handleSelectIcon = (icon: string) => {
  formData.icon = icon
  iconPickerVisible.value = false
}

// 新增
const handleAdd = (parentId: number = 0) => {
  dialogTitle.value = '新增菜单'
  resetForm()
  formData.parentId = parentId
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑菜单'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除菜单「${row.name}」吗？`, '提示', {
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
      ElMessage.success(formData.id ? '修改成功' : '新增成功')
      dialogVisible.value = false
      loadData()
    }
  })
}

// 重置表单
const resetForm = () => {
  formData.id = 0
  formData.parentId = 0
  formData.name = ''
  formData.path = ''
  formData.icon = ''
  formData.sort = 1
  formData.status = 1
  formData.type = 'menu'
}

// 加载数据
const loadData = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="page-container">
    <el-card>
      <!-- 操作按钮 -->
      <template #header>
        <div class="card-header">
          <span>菜单管理</span>
          <el-button type="primary" @click="handleAdd()">
            <el-icon><Plus /></el-icon>
            新增菜单
          </el-button>
        </div>
      </template>

      <!-- 表格 - 树形结构 -->
      <el-table
        :data="tableData"
        v-loading="loading"
        row-key="id"
        border
        default-expand-all
        style="width: 100%"
      >
        <el-table-column prop="name" label="菜单名称" min-width="180" />
        <el-table-column label="图标" width="80" align="center">
          <template #default="{ row }">
            <el-icon v-if="row.icon" :size="18">
              <component :is="row.icon" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由路径" min-width="180" />
        <el-table-column label="类型" width="90" align="center">
          <template #default="{ row }">
            <el-tag 
              :type="row.type === 'dir' ? 'primary' : row.type === 'menu' ? 'success' : 'warning'" 
              size="small"
            >
              {{ row.type === 'dir' ? '目录' : row.type === 'menu' ? '菜单' : '按钮' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="70" align="center" />
        <el-table-column label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.type !== 'button'" type="primary" size="small" link @click="handleAdd(row.id)">
              新增
            </el-button>
            <el-button type="primary" size="small" link @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" link @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="550px">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="上级菜单">
          <el-tree-select
            v-model="formData.parentId"
            :data="flatMenuList"
            :props="{ label: 'name', value: 'id', children: 'children' }"
            check-strictly
            placeholder="请选择上级菜单"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio v-for="item in menuTypes" :key="item.value" :value="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item v-if="formData.type !== 'button'" label="路由路径" prop="path">
          <el-input v-model="formData.path" placeholder="请输入路由路径" />
        </el-form-item>
        <el-form-item v-if="formData.type !== 'button'" label="图标">
          <div class="icon-picker-trigger" @click="iconPickerVisible = !iconPickerVisible">
            <el-icon v-if="formData.icon" :size="20">
              <component :is="formData.icon" />
            </el-icon>
            <span v-else class="placeholder">点击选择图标</span>
            <el-icon class="arrow"><ArrowDown /></el-icon>
          </div>
          <!-- 图标选择面板 -->
          <div v-if="iconPickerVisible" class="icon-picker-panel">
            <div class="icon-grid">
              <div 
                v-for="icon in iconList" 
                :key="icon"
                class="icon-item"
                :class="{ active: formData.icon === icon }"
                @click="handleSelectIcon(icon)"
              >
                <el-icon :size="20"><component :is="icon" /></el-icon>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="formData.sort" :min="1" :max="999" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
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

/* 图标选择器 */
.icon-picker-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 32px;
  padding: 0 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: border-color 0.2s;
}

.icon-picker-trigger:hover {
  border-color: var(--el-color-primary);
}

.placeholder {
  color: var(--text-color-placeholder);
  font-size: 14px;
}

.arrow {
  color: var(--text-color-placeholder);
}

.icon-picker-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  padding: 12px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-height: 300px;
  overflow-y: auto;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
}

.icon-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-item:hover {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}

.icon-item.active {
  border-color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>