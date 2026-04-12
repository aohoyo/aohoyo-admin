import { ref, reactive } from 'vue'
import type { Ref } from 'vue'

interface TableOptions<T> {
  fetchFn: (params: Record<string, unknown>) => Promise<{ list: T[]; total: number }>
  defaultPageSize?: number
  defaultParams?: Record<string, unknown>
}

interface Pagination {
  page: number
  pageSize: number
  total: number
}

interface TableState<T> {
  loading: Ref<boolean>
  data: Ref<T[]>
  pagination: Pagination
  params: Record<string, unknown>
  loadData: () => Promise<void>
  handlePageChange: (page: number) => void
  handleSizeChange: (size: number) => void
  handleSearch: (searchParams: Record<string, unknown>) => void
  handleReset: () => void
  refresh: () => void
}

/**
 * 表格通用 Hook
 */
export function useTable<T = unknown>(options: TableOptions<T>): TableState<T> {
  const { fetchFn, defaultPageSize = 10, defaultParams = {} } = options

  // 加载状态
  const loading = ref(false)

  // 表格数据
  const data = ref<T[]>([]) as Ref<T[]>

  // 分页
  const pagination = reactive<Pagination>({
    page: 1,
    pageSize: defaultPageSize,
    total: 0
  })

  // 查询参数
  const params = reactive<Record<string, unknown>>({ ...defaultParams })

  // 加载数据
  const loadData = async () => {
    loading.value = true
    try {
      const result = await fetchFn({
        ...params,
        page: pagination.page,
        pageSize: pagination.pageSize
      })
      data.value = result.list
      pagination.total = result.total
    } catch (error) {
      console.error('加载表格数据失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 页码改变
  const handlePageChange = (page: number) => {
    pagination.page = page
    loadData()
  }

  // 每页条数改变
  const handleSizeChange = (size: number) => {
    pagination.pageSize = size
    pagination.page = 1
    loadData()
  }

  // 搜索
  const handleSearch = (searchParams: Record<string, unknown>) => {
    Object.assign(params, searchParams)
    pagination.page = 1
    loadData()
  }

  // 重置
  const handleReset = () => {
    Object.keys(params).forEach(key => {
      if (!(key in defaultParams)) {
        delete params[key]
      }
    })
    Object.assign(params, defaultParams)
    pagination.page = 1
    loadData()
  }

  // 刷新
  const refresh = () => {
    loadData()
  }

  // 初始化加载
  loadData()

  return {
    loading,
    data,
    pagination,
    params,
    loadData,
    handlePageChange,
    handleSizeChange,
    handleSearch,
    handleReset,
    refresh
  }
}
