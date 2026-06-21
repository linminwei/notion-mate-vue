<template>
  <div class="neo-page-container">

    <!-- ================= 页面头部与工具栏 ================= -->
    <header class="neo-page-header">
      <div class="capsule-search">
        <div class="search-inputs">
          <input type="text" v-model="searchForm.name" placeholder="软件名称" @keyup.enter="handleSearch" />
          <div class="divider"></div>
          <a-select v-model:value="searchForm.category" placeholder="分类" :bordered="false" class="status-select" allowClear @change="handleSearch">
            <a-select-option v-for="dict in categoryDict" :key="dict.dictValue" :value="dict.dictValue">
              {{ dict.dictLabel }}
            </a-select-option>
          </a-select>
          <div class="divider"></div>
          <a-select v-model:value="searchForm.device" placeholder="设备" :bordered="false" class="status-select" allowClear @change="handleSearch">
            <a-select-option v-for="dict in deviceDict" :key="dict.dictValue" :value="dict.dictValue">
              {{ dict.dictLabel }}
            </a-select-option>
          </a-select>
        </div>
        <div class="search-actions">
          <button class="search-trigger" @click="handleSearch" title="搜索">
            <font-awesome-icon :icon="['fas', 'search']" />
          </button>
          <button class="search-trigger reset-btn" @click="handleReset" title="重置">
            <font-awesome-icon :icon="['fas', 'redo']" />
          </button>
        </div>
      </div>

      <div class="header-actions">
        <button
          class="neo-btn-solid primary"
          v-permission="'app:sync'"
          :disabled="syncing"
          @click="handleSync"
        >
          <font-awesome-icon :icon="['fas', 'sync-alt']" :spin="syncing" />
          {{ syncing ? '同步中...' : '同步数据' }}
        </button>
      </div>
    </header>

    <!-- ================= 核心数据表格区域 ================= -->
    <div class="neo-card table-card fade-in">
      <a-table
          class="neo-table"
          :columns="columns"
          :data-source="tableData"
          :loading="loading"
          :pagination="pagination"
          row-key="id"
          @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">

          <!-- 软件名称列（含图标） -->
          <template v-if="column.key === 'name'">
            <span class="app-name-cell">
              <img v-if="record.icon && isImageUrl(record.icon)" :src="record.icon" class="app-icon-inline" loading="lazy" decoding="async" />
              <span v-else class="app-icon-emoji">{{ record.icon || '💻' }}</span>
              <span class="app-name-text">{{ record.name }}</span>
            </span>
          </template>

          <!-- 描述列 -->
          <template v-if="column.key === 'description'">
            <span class="cell-description">{{ record.description }}</span>
          </template>

          <!-- 分类列 -->
          <template v-if="column.key === 'category'">
            <span class="category-tag">{{ record.category }}</span>
          </template>

          <!-- 设备列 -->
          <template v-if="column.key === 'devices'">
            <span v-if="record.devices && record.devices.length" class="device-tags">
              <span v-for="d in record.devices" :key="d" class="device-tag">{{ d }}</span>
            </span>
            <span v-else class="cell-placeholder">—</span>
          </template>
        </template>
      </a-table>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getAppPage, syncApp } from '@/api/app.ts'
import { getDictDataByDictCodeEnable } from '@/api/dict.ts'
import type { AppVo, DictData } from '@/types'
import { AppleAlert } from '@/components/common/AppleAlert.ts'

const columns = [
  { title: '软件名称', dataIndex: 'name', key: 'name', width: 200 },
  { title: '描述', dataIndex: 'description', key: 'description' },
  { title: '分类', dataIndex: 'category', key: 'category', width: 120 },
  { title: '设备', dataIndex: 'devices', key: 'devices', width: 140 }
]

const loading = ref(false)
const syncing = ref(false)
const tableData = ref<AppVo[]>([])
const categoryDict = ref<DictData[]>([])
const deviceDict = ref<DictData[]>([])

const searchForm = reactive({ name: '', category: undefined as string | undefined, device: undefined as string | undefined, pageNum: 1, pageSize: 10 })
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ['5', '10', '20', '50'],
  showTotal: (total: number) => `共 ${total} 条`
})

const isImageUrl = (str: string) => /^https?:\/\/.+\.(png|jpg|jpeg|gif|svg|webp|ico)(\?.*)?$/i.test(str)

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getAppPage(searchForm)
    tableData.value = res.data.list
    pagination.total = res.data.total
    pagination.current = searchForm.pageNum
  } catch (error: any) {
    AppleAlert.error('数据加载失败', error.message || '无法获取软件列表')
  } finally {
    loading.value = false
  }
}

const fetchCategoryDict = async () => {
  try {
    const res = await getDictDataByDictCodeEnable('app_category')
    categoryDict.value = res.data || []
  } catch (error) {
    console.warn('获取 app_category 字典失败', error)
  }
}

const fetchDeviceDict = async () => {
  try {
    const res = await getDictDataByDictCodeEnable('app_device')
    deviceDict.value = res.data || []
  } catch (error) {
    console.warn('获取 app_device 字典失败', error)
  }
}

const handleSearch = () => {
  searchForm.pageNum = 1
  pagination.current = 1
  fetchData()
}

const handleReset = () => {
  searchForm.name = ''
  searchForm.category = undefined
  searchForm.device = undefined
  searchForm.pageNum = 1
  pagination.current = 1
  fetchData()
}

const handleTableChange = (pag: any) => {
  searchForm.pageNum = pag.current
  searchForm.pageSize = pag.pageSize
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchData()
}

const handleSync = async () => {
  syncing.value = true
  try {
    const res = await syncApp()
    const count = res.data
    AppleAlert.success('同步完成', `成功同步 ${count} 个软件`)
    fetchData()
  } catch (error: any) {
    AppleAlert.error('同步失败', error.message || '操作未完成')
  } finally {
    syncing.value = false
  }
}

onMounted(() => { fetchData(); fetchCategoryDict(); fetchDeviceDict() })
</script>

<style scoped>
/* ================= 通用 ================= */
.cell-description {
  display: block;
  line-height: 1.5;
  word-break: break-word;
}

.cell-placeholder {
  color: var(--text-muted, #a1a1aa);
}

/* ================= 软件名称（含图标） ================= */
.app-name-cell {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.app-icon-inline {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  object-fit: contain;
  flex-shrink: 0;
}

.app-icon-emoji {
  font-size: 16px;
  line-height: 1;
  flex-shrink: 0;
}

.app-name-text {
  font-weight: 500;
}

/* ================= 分类标签 ================= */
.category-tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background: color-mix(in srgb, var(--apple-blue, #007AFF) 10%, transparent);
  color: var(--apple-blue, #007AFF);
}

:global(.dark) .category-tag {
  background: color-mix(in srgb, var(--apple-blue, #0A84FF) 15%, transparent);
}

/* ================= 设备标签 ================= */
.device-tags {
  display: flex; gap: 4px;
}
.device-tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background: color-mix(in srgb, var(--apple-green, #34C759) 10%, transparent);
  color: var(--apple-green, #34C759);
}

:global(.dark) .device-tag {
  background: color-mix(in srgb, var(--apple-green, #34C759) 15%, transparent);
}

/* ================= page-header 覆盖 ================= */
.neo-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 12px;
  gap: 16px;
}

.capsule-search {
  display: flex;
  min-width: 480px;
  background: var(--card-bg, #f5f5f7);
  border-radius: 14px;
  padding: 4px;
  border: 1px solid var(--border-color);
  transition: all 0.3s;
  align-items: center;
}
.capsule-search:focus-within {
  background: var(--card-bg, #ffffff);
  border-color: var(--apple-blue, #0A84FF);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--apple-blue, #0A84FF) 10%, transparent);
}

.search-inputs {
  flex: 1; display: flex; align-items: center;
  padding: 0 4px; height: 26px;
}

.search-inputs input {
  flex: 1; min-width: 0; width: 0;
  border: none; background: transparent;
  font-size: 13px; color: var(--text-main);
  outline: none; padding: 0 8px;
  height: 26px; line-height: 26px;
}
.search-inputs input::placeholder { color: var(--text-muted, #a1a1aa); }
.divider { width: 1px; height: 14px; background: var(--border-color, #e5e5ea); margin: 0 4px; flex-shrink: 0; }

.search-actions { display: flex; gap: 4px; margin-left: 8px; }
.search-trigger {
  width: 32px; height: 32px;
  border: none; border-radius: 10px;
  background: var(--apple-blue, #0A84FF); color: #fff;
  cursor: pointer; transition: all 0.2s;
  display: flex; align-items: center; justify-content: center;
}
.search-trigger:hover { filter: brightness(0.9); transform: scale(0.95); }

.search-trigger.reset-btn {
  background: var(--hover-bg, #e5e5ea);
  color: var(--text-main, #333);
}
.search-trigger.reset-btn:hover {
  background: var(--active-bg, rgba(0,0,0,0.1));
  color: var(--text-main, #1d1d1f);
  transform: scale(0.95);
}

/* Status Select 高度对齐 */
:deep(.status-select) {
  flex: 1; min-width: 0; width: 0;
  height: 26px; display: flex; align-items: center;
}
:deep(.status-select .ant-select-selector) {
  padding: 0 2px !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  height: 26px !important;
  min-height: 26px !important;
  display: flex !important;
  align-items: center !important;
}
:deep(.status-select .ant-select-selection-item),
:deep(.status-select .ant-select-selection-placeholder) {
  font-size: 13px !important;
  color: var(--text-main) !important;
  line-height: 26px !important;
  padding-right: 12px !important;
  display: flex !important;
  align-items: center !important;
  margin: 0 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}
:deep(.status-select .ant-select-selection-placeholder) {
  color: var(--text-muted, #a1a1aa) !important;
}
:deep(.status-select .ant-select-arrow) {
  right: 0px !important;
  font-size: 10px !important;
  color: var(--text-muted) !important;
}
:deep(.status-select .ant-select-clear) {
  right: 0px !important;
  background: transparent !important;
}
</style>
