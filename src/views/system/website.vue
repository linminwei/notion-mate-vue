<template>
  <div class="neo-page-container">

    <!-- ================= 页面头部与工具栏 ================= -->
    <header class="neo-page-header">
      <div class="capsule-search">
        <div class="search-inputs">
          <input type="text" v-model="searchForm.name" placeholder="网站名称" @keyup.enter="handleSearch" />
          <div class="divider"></div>
          <a-select v-model:value="searchForm.category" placeholder="分类" :bordered="false" class="status-select" allowClear @change="handleSearch">
            <a-select-option v-for="dict in categoryDict" :key="dict.dictValue" :value="dict.dictValue">
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
          v-permission="'website:sync'"
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
        <template #emptyText>
          <div class="data-empty-container">
            <div class="modern-empty-card">
              <div class="modern-empty-illus">
                <div class="mockup-window">
                  <div class="mockup-header"><div class="mockup-dot"></div><div class="mockup-line short"></div></div>
                  <div class="mockup-row"><div class="mockup-avatar"></div><div class="mockup-line"></div><div class="mockup-line shorter"></div></div>
                  <div class="mockup-row"><div class="mockup-avatar"></div><div class="mockup-line"></div><div class="mockup-line shorter"></div></div>
                </div>
              </div>
              <div class="modern-empty-content">
                <h3 class="modern-empty-title">暂无网站数据</h3>
                <p class="modern-empty-desc">点击上方按钮添加第一个网站</p>
              </div>
            </div>
          </div>
        </template>
        <template #bodyCell="{ column, record }">

          <!-- 网站名称列（含图标，点击跳转） -->
          <template v-if="column.key === 'name'">
            <a :href="record.url" target="_blank" rel="noopener noreferrer" class="website-name-link">
              <img v-if="record.icon && isImageUrl(record.icon)" :src="record.icon" class="website-icon-inline" loading="lazy" decoding="async" />
              <span v-else class="website-icon-emoji">{{ record.icon || '🌐' }}</span>
              <span class="website-name-text">{{ record.name }}</span>
              <font-awesome-icon :icon="['fas', 'external-link-alt']" class="name-external-icon" />
            </a>
          </template>

          <!-- 描述列 -->
          <template v-if="column.key === 'description'">
            <span class="cell-description">{{ record.description }}</span>
          </template>

          <!-- 分类列 -->
          <template v-if="column.key === 'category'">
            <span class="category-tag">{{ record.category }}</span>
          </template>

          <!-- 网站预览列 -->
          <template v-if="column.key === 'webImg'">
            <div v-if="record.webImg" class="webimg-thumb" @click="previewImg = record.webImg">
              <div v-if="!webImgLoadedCache[record.id]" class="webimg-skeleton"></div>
              <img
                :src="record.webImg"
                alt="网站预览"
                loading="lazy"
                decoding="async"
                @load="onWebImgLoad(record.id)"
                @error="onWebImgError(record.id)"
                :class="{ 'img-loaded': webImgLoadedCache[record.id] }"
              />
            </div>
            <span v-else class="cell-placeholder">—</span>
          </template>
        </template>
      </a-table>
    </div>

    <!-- ================= 图片预览 ================= -->
    <Teleport to="body">
      <Transition name="preview-fade">
        <div v-if="previewImg" class="img-preview-overlay" @click.self="previewImg = null">
          <div class="img-preview-container">
            <img :src="previewImg" alt="预览" />
            <button class="img-preview-close" @click="previewImg = null">
              <font-awesome-icon :icon="['fas', 'times']" />
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { getWebsitePage, syncWebsite } from '@/api/website.ts'
import { getDictDataByDictCodeEnable } from '@/api/dict.ts'
import type { WebsiteVo, DictData } from '@/types'
import { AppleAlert } from '@/components/common/AppleAlert.ts'

// 模块级缓存：跨路由切换保持已加载状态
const _webImgCache: Record<string, boolean> = {}

// --- 表格列定义 ---
const columns = [
  { title: '网站名称', dataIndex: 'name', key: 'name', width: 200 },
  { title: '描述', dataIndex: 'description', key: 'description' },
  { title: '分类', dataIndex: 'category', key: 'category', width: 120 },
  { title: '网站预览', dataIndex: 'webImg', key: 'webImg', align: 'center', width: 100 }
]

// --- 状态与数据 ---
const loading = ref(false)
const syncing = ref(false)
const tableData = ref<WebsiteVo[]>([])
const previewImg = ref<string | null>(null)
const webImgLoadedCache = reactive(_webImgCache)
const categoryDict = ref<DictData[]>([])

const searchForm = reactive({ name: '', category: undefined as string | undefined, pageNum: 1, pageSize: 10 })
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ['5', '10', '20', '50'],
  showTotal: (total: number) => `共 ${total} 条`
})

// --- 工具方法 ---
const isImageUrl = (str: string) => /^https?:\/\/.+\.(png|jpg|jpeg|gif|svg|webp|ico)(\?.*)?$/i.test(str)

// --- 事件处理 ---
const onWebImgLoad = (id: string) => {
  webImgLoadedCache[id] = true
}

const onWebImgError = (id: string) => {
  webImgLoadedCache[id] = true
}

// --- API 方法 ---
const fetchData = async () => {
  loading.value = true
  try {
    const res = await getWebsitePage(searchForm)
    tableData.value = res.data.list
    pagination.total = res.data.total
    pagination.current = searchForm.pageNum
  } catch (error: any) {
    AppleAlert.error('数据加载失败', error.message || '无法获取网站列表')
  } finally {
    loading.value = false
  }
}

const fetchCategoryDict = async () => {
  try {
    const res = await getDictDataByDictCodeEnable('website_category')
    categoryDict.value = res.data || []
  } catch (error) {
    console.warn('获取 website_category 字典失败', error)
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
    const res = await syncWebsite()
    const count = res.data
    AppleAlert.success('同步完成', `成功同步 ${count} 个网站`)
    fetchData()
  } catch (error: any) {
    AppleAlert.error('同步失败', error.message || '操作未完成')
  } finally {
    syncing.value = false
  }
}

// --- ESC 关闭预览 ---
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && previewImg.value) {
    previewImg.value = null
  }
}

watch(previewImg, (val) => {
  if (val) {
    document.addEventListener('keydown', onKeydown)
  } else {
    document.removeEventListener('keydown', onKeydown)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})

onMounted(() => { fetchData(); fetchCategoryDict() })
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

/* ================= 网站名称（含图标，点击跳转） ================= */
.website-name-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: inherit;
  text-decoration: none;
  transition: color 0.2s;
}
.website-name-link:hover {
  color: var(--apple-blue, #007AFF);
}
.website-name-link:hover .name-external-icon {
  opacity: 1;
}

.website-icon-inline {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  object-fit: contain;
  flex-shrink: 0;
}

.website-icon-emoji {
  font-size: 16px;
  line-height: 1;
  flex-shrink: 0;
}

.website-name-text {
  font-weight: 500;
}

.name-external-icon {
  font-size: 10px;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.2s;
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

/* ================= 网站预览缩略图 ================= */
.webimg-thumb {
  width: 48px;
  height: 32px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--hover-bg, #f5f5f7);
  transition: transform 0.2s;
  border: 1px solid var(--border-color, rgba(0,0,0,0.06));
  position: relative;
}

.webimg-thumb:hover {
  transform: scale(1.08);
}

.webimg-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.webimg-thumb img.img-loaded {
  opacity: 1;
}

.webimg-skeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    var(--hover-bg, #e5e5ea) 0%,
    var(--card-bg, #f0f0f3) 50%,
    var(--hover-bg, #e5e5ea) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.4s ease-in-out infinite;
  z-index: 1;
  pointer-events: none;
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ================= 图片预览 ================= */
.img-preview-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.img-preview-container {
  position: relative;
  max-width: 90vw;
  max-height: 85vh;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.3);
}

.img-preview-container img {
  max-width: 90vw;
  max-height: 85vh;
  display: block;
}

.img-preview-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.img-preview-close:hover {
  background: rgba(0, 0, 0, 0.7);
}

.preview-fade-enter-active,
.preview-fade-leave-active {
  transition: opacity 0.25s ease;
}
.preview-fade-enter-from,
.preview-fade-leave-to {
  opacity: 0;
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
  min-width: 360px;
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
