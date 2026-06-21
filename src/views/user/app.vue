<template>
  <!-- ================= 页面头部 ================= -->
  <header class="page-header">
    <h1 class="page-title">软件推荐</h1>
    <p class="page-sub">发现好用的桌面与移动端软件</p>
  </header>

  <!-- ================= 检索框 ================= -->
  <div class="search-bar">
    <font-awesome-icon :icon="['fas', 'search']" class="search-icon" />
    <input
      v-model="searchKeyword"
      type="text"
      placeholder="搜索软件名称..."
      class="search-input"
    />
    <button v-if="searchKeyword" class="search-clear" @click="searchKeyword = ''">
      <font-awesome-icon :icon="['fas', 'times']" />
    </button>
  </div>

  <!-- ================= 内容区域（统一居中） ================= -->
  <div class="content-well">
  <!-- ================= 筛选栏 ================= -->
  <div class="filter-bar" v-if="categoryDict.length || deviceDict.length">
    <div class="filter-row">
      <span class="filter-label">分类</span>
      <div class="filter-pills">
        <button class="filter-pill" :class="{ active: selectedCategory === '' }" @click="selectedCategory = ''">全部</button>
        <button
          v-for="cat in categoryDict" :key="cat.dictValue"
          class="filter-pill"
          :class="{ active: selectedCategory === cat.dictValue }"
          @click="selectedCategory = cat.dictValue"
        >{{ cat.dictLabel }}</button>
      </div>
    </div>
    <div class="filter-row" v-if="deviceDict.length">
      <span class="filter-label">设备</span>
      <div class="filter-pills">
        <button class="filter-pill" :class="{ active: selectedDevice === '' }" @click="selectedDevice = ''">全部</button>
        <button
          v-for="d in deviceDict" :key="d.dictValue"
          class="filter-pill"
          :class="{ active: selectedDevice === d.dictValue }"
          @click="selectedDevice = d.dictValue"
        >{{ d.dictLabel }}</button>
      </div>
    </div>
  </div>

  <!-- ================= 软件卡片网格 ================= -->
  <section class="app-grid-section">
    <div v-if="loading" class="loading-state">
      <font-awesome-icon :icon="['fas', 'spinner']" spin />
      <span>加载中...</span>
    </div>

    <div v-else-if="filteredApps.length" class="app-grid">
      <div
        v-for="app in filteredApps"
        :key="app.id"
        class="app-card"
      >
        <!-- 软件图标 -->
        <div class="card-icon-wrap">
          <img
            v-if="app.icon && isImageUrl(app.icon)"
            :src="app.icon"
            :alt="app.name"
            class="card-icon-img"
            loading="lazy"
          />
          <span v-else class="card-icon-emoji">{{ app.icon || '💻' }}</span>
        </div>

        <!-- 软件名称 -->
        <h3 class="card-name">{{ app.name }}</h3>

        <!-- 分类 & 设备标签 -->
        <div class="card-tags" v-if="app.category || (app.devices && app.devices.length)">
          <span class="card-category" v-if="app.category">{{ app.category }}</span>
          <span class="card-device" v-for="d in app.devices" :key="d">{{ d }}</span>
        </div>

        <!-- 描述 -->
        <p class="card-desc" v-if="app.description">{{ app.description }}</p>
      </div>
    </div>

    <div v-else class="modern-empty-card">
      <div class="modern-empty-illus">
        <div class="mockup-window">
          <div class="mockup-header">
            <div class="mockup-dot"></div>
            <div class="mockup-line short"></div>
          </div>
          <div class="mockup-row">
            <font-awesome-icon :icon="['fas', 'star']" class="mockup-star" />
            <div class="mockup-avatar"></div>
            <div class="mockup-line"></div>
          </div>
          <div class="mockup-row">
            <font-awesome-icon :icon="['fas', 'star']" class="mockup-star" />
            <div class="mockup-avatar"></div>
            <div class="mockup-line shorter"></div>
          </div>
        </div>
      </div>
      <div class="modern-empty-content">
        <h3 class="modern-empty-title">暂无推荐软件</h3>
        <p class="modern-empty-desc">暂时没有可显示的软件数据。</p>
      </div>
    </div>
  </section>

  <!-- ================= 分页 ================= -->
  <div class="pagination" v-if="totalPages > 1">
    <button class="page-btn" :disabled="pageNum === 1" @click="goPage(pageNum - 1)">
      <font-awesome-icon :icon="['fas', 'chevron-left']" />
    </button>
    <span class="page-info">{{ pageNum }} / {{ totalPages }}</span>
    <button class="page-btn" :disabled="pageNum === totalPages" @click="goPage(pageNum + 1)">
      <font-awesome-icon :icon="['fas', 'chevron-right']" />
    </button>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getAppPage } from '@/api/app.ts'
import { getDictDataByDictCodeEnable } from '@/api/dict.ts'
import { useAppStore } from '@/stores/app'
import type { AppVo, DictData } from '@/types'

const router = useRouter()
const appStore = useAppStore()

const apps = ref<AppVo[]>([])
const loading = ref(false)
const pageNum = ref(1)
const total = ref(0)
const pageSize = 12

const selectedCategory = ref('')
const categoryDict = ref<DictData[]>([])
const selectedDevice = ref('')
const deviceDict = ref<DictData[]>([])
const searchKeyword = ref('')

const filteredApps = computed(() => {
  let list = apps.value
  if (selectedCategory.value) {
    list = list.filter(app => app.category === selectedCategory.value)
  }
  if (selectedDevice.value) {
    list = list.filter(app => app.devices?.includes(selectedDevice.value))
  }
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(app =>
      app.name.toLowerCase().includes(kw) ||
      (app.description && app.description.toLowerCase().includes(kw))
    )
  }
  return list
})

const isImageUrl = (str: string) => /^https?:\/\/.+\.(png|jpg|jpeg|gif|svg|webp|ico)(\?.*)?$/i.test(str)

const totalPages = computed(() => Math.ceil(total.value / pageSize))

const fetchApps = async () => {
  loading.value = true
  try {
    const res = await getAppPage({
      pageNum: pageNum.value,
      pageSize,
      name: searchKeyword.value || undefined,
      category: selectedCategory.value || undefined,
      device: selectedDevice.value || undefined
    })
    apps.value = res.data.list || []
    total.value = res.data.total || 0
  } catch {
    apps.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

const goPage = (p: number) => {
  if (p < 1 || p > totalPages.value || p === pageNum.value) return
  pageNum.value = p
  fetchApps()
}

const fetchCategoryDict = async () => {
  try {
    const res = await getDictDataByDictCodeEnable('app_category')
    categoryDict.value = res.data || []
  } catch {
    categoryDict.value = []
  }
}

const fetchDeviceDict = async () => {
  try {
    const res = await getDictDataByDictCodeEnable('app_device')
    deviceDict.value = res.data || []
  } catch {
    deviceDict.value = []
  }
}

watch(selectedCategory, () => {
  pageNum.value = 1
  fetchApps()
})

watch(selectedDevice, () => {
  pageNum.value = 1
  fetchApps()
})

watch(searchKeyword, () => {
  pageNum.value = 1
  fetchApps()
})

watch(() => appStore.showRestricted, (val) => {
  if (val) {
    pageNum.value = 1
    selectedCategory.value = ''
    selectedDevice.value = ''
    fetchApps()
  } else {
    router.push('/portal')
  }
})

onMounted(() => {
  fetchApps()
  fetchCategoryDict()
  fetchDeviceDict()
})
</script>

<style scoped>
/* ================= 页面头部 ================= */
.page-header {
  position: relative; z-index: 10; text-align: center;
  padding: 110px 20px 40px;
}
.page-title {
  font-size: clamp(28px, 4vw, 48px); font-weight: 800;
  letter-spacing: -0.03em; margin: 0 0 10px; color: var(--text-primary);
}
.page-sub {
  font-size: 15px; color: var(--text-muted); margin: 0;
  letter-spacing: 0.01em;
}

/* ================= 检索框 ================= */
.search-bar {
  position: relative; z-index: 10;
  max-width: 520px; margin: 0 auto 28px; padding: 0 24px; box-sizing: border-box;
  display: flex; align-items: center;
}
.search-icon {
  position: absolute; left: 40px;
  font-size: 14px; color: var(--text-muted);
  pointer-events: none; transition: color 0.25s ease;
}
.search-bar:focus-within .search-icon { color: var(--apple-blue, #0A84FF); }
.search-input {
  width: 100%; height: 48px;
  padding: 0 48px 0 44px;
  border-radius: 24px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface);
  color: var(--text-primary);
  font-size: 15px;
  outline: none;
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;
}
.search-input::placeholder { color: var(--text-muted); }
.search-input:focus {
  border-color: var(--apple-blue, #0A84FF);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--apple-blue, #0A84FF) 12%, transparent),
              inset 0 1px 0 color-mix(in srgb, var(--apple-blue, #0A84FF) 8%, transparent);
  transform: scale(1.01);
}
.search-clear {
  position: absolute; right: 40px;
  width: 26px; height: 26px; border-radius: 50%;
  border: none; background: var(--hover-bg);
  color: var(--text-muted); font-size: 12px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.2s ease;
}
.search-clear:hover { color: var(--text-primary); background: var(--border-medium); transform: scale(1.08); }

/* ================= 筛选栏 ================= */
.filter-bar {
  position: relative; z-index: 10;
  max-width: 1100px; margin: 0 auto; padding: 0 24px 28px; box-sizing: border-box;
}
.filter-row {
  display: flex; align-items: center; gap: 14px;
}
.filter-row + .filter-row { margin-top: 10px; }
.filter-label {
  flex-shrink: 0; width: 48px; text-align: right;
  font-size: 13px; font-weight: 600; color: var(--text-muted);
  letter-spacing: 0.02em;
}
.filter-pills {
  flex: 1; display: flex; flex-wrap: wrap; gap: 8px;
}
.filter-pill {
  padding: 6px 18px; border-radius: 18px;
  font-size: 13px; font-weight: 500;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  white-space: nowrap; user-select: none;
}
.filter-pill:hover {
  border-color: var(--border-medium);
  color: var(--text-primary);
  transform: translateY(-1px);
}
.filter-pill:active { transform: scale(0.96); }
.filter-pill.active {
  background: var(--apple-blue, #0A84FF);
  border-color: var(--apple-blue, #0A84FF);
  color: #fff;
  box-shadow: 0 2px 8px color-mix(in srgb, var(--apple-blue, #0A84FF) 30%, transparent);
}

/* ================= 加载 ================= */
.loading-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 16px; padding: 100px 20px; color: var(--text-muted);
  font-size: 15px;
}
.loading-state :deep(svg) { font-size: 28px; opacity: 0.6; }

/* ================= 空状态 ================= */
.modern-empty-card {
  width: 100%; max-width: 380px; margin: 0 auto;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 20px; overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  animation: float-up-fade 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
@keyframes float-up-fade {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.modern-empty-illus {
  width: 100%; height: 140px;
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--apple-blue, #0A84FF) 40%, transparent),
    color-mix(in srgb, var(--apple-blue, #0A84FF) 5%, transparent));
  display: flex; justify-content: center; align-items: flex-end;
  padding: 0 40px; box-sizing: border-box;
}
.mockup-window {
  width: 100%; height: 100px;
  background: var(--bg-surface);
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.08);
  padding: 16px; display: flex; flex-direction: column; gap: 14px;
}
.mockup-header, .mockup-row {
  display: flex; align-items: center; gap: 10px;
}
.mockup-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--border-subtle);
}
.mockup-line {
  height: 6px; border-radius: 3px;
  background: var(--hover-bg); flex: 1;
}
.mockup-line.short { width: 60%; flex: none; }
.mockup-line.shorter { width: 40%; flex: none; }
.mockup-star {
  color: var(--border-medium);
  font-size: 10px;
}
.mockup-avatar {
  width: 18px; height: 18px; border-radius: 50%;
  background: var(--hover-bg);
}
.modern-empty-content {
  padding: 32px 24px;
  display: flex; flex-direction: column; align-items: center; text-align: center;
}
.modern-empty-title {
  font-size: 18px; font-weight: 700;
  color: var(--text-primary); margin: 0 0 10px;
  letter-spacing: -0.3px;
}
.modern-empty-desc {
  font-size: 13px; color: var(--text-muted);
  margin: 0; line-height: 1.6;
}

/* ================= 卡片网格 ================= */
.app-grid-section {
  position: relative; z-index: 10; max-width: 1100px;
  margin: 0 auto; padding: 0 24px 48px; box-sizing: border-box;
}
.app-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

/* ================= 单张卡片 ================= */
.app-card {
  display: flex; flex-direction: column; align-items: flex-start; gap: 10px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 18px; padding: 24px 20px 18px;
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
              border-color 0.3s ease,
              box-shadow 0.35s ease;
  animation: card-in 0.45s ease-out both;
}
.app-card:nth-child(1) { animation-delay: 0s; }
.app-card:nth-child(2) { animation-delay: 0.05s; }
.app-card:nth-child(3) { animation-delay: 0.1s; }
.app-card:nth-child(4) { animation-delay: 0.15s; }
.app-card:nth-child(5) { animation-delay: 0.2s; }
.app-card:nth-child(6) { animation-delay: 0.25s; }
.app-card:nth-child(n+7) { animation-delay: 0.3s; }
@keyframes card-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.app-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--apple-blue, #0A84FF) 35%, transparent);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15),
              0 0 0 1px color-mix(in srgb, var(--apple-blue, #0A84FF) 15%, transparent);
}

/* 图标 */
.card-icon-wrap {
  width: 60px; height: 60px; border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  background: var(--hover-bg);
  border: 1px solid var(--border-subtle);
  overflow: hidden; flex-shrink: 0;
}
.card-icon-img { width: 100%; height: 100%; object-fit: contain; }
.card-icon-emoji { font-size: 30px; line-height: 1; }

/* 名称 */
.card-name {
  font-size: 16px; font-weight: 700; letter-spacing: -0.01em;
  color: var(--text-primary); margin: 0;
  text-align: left; width: 100%; line-height: 1.35;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden; word-break: break-word;
}

/* 标签行 */
.card-tags {
  display: flex; flex-wrap: wrap; justify-content: flex-start; gap: 6px;
}
.card-category {
  padding: 3px 10px; border-radius: 5px;
  font-size: 11px; font-weight: 600; letter-spacing: 0.02em;
  background: color-mix(in srgb, var(--apple-blue, #0A84FF) 12%, transparent);
  color: var(--apple-blue, #0A84FF);
}
.card-device {
  padding: 3px 10px; border-radius: 5px;
  font-size: 11px; font-weight: 600; letter-spacing: 0.02em;
  background: color-mix(in srgb, var(--apple-green, #34C759) 12%, transparent);
  color: var(--apple-green, #34C759);
}

/* 描述 */
.card-desc {
  font-size: 13px; color: var(--text-secondary);
  margin: 0; line-height: 1.6; word-break: break-word;
  text-align: left; width: 100%;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ================= 分页 ================= */
.pagination {
  position: relative; z-index: 10;
  display: flex; align-items: center; justify-content: center; gap: 18px;
  padding: 8px 0 80px;
}
.page-btn {
  width: 42px; height: 42px; border-radius: 50%;
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface);
  color: var(--text-secondary);
  font-size: 14px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.page-btn:hover:not(:disabled) {
  border-color: var(--apple-blue, #0A84FF);
  color: var(--apple-blue, #0A84FF);
  background: color-mix(in srgb, var(--apple-blue, #0A84FF) 8%, transparent);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--apple-blue, #0A84FF) 12%, transparent);
}
.page-btn:active:not(:disabled) { transform: scale(0.94); }
.page-btn:disabled { opacity: 0.25; cursor: not-allowed; }
.page-info {
  font-size: 14px; font-weight: 600;
  color: var(--text-secondary); font-variant-numeric: tabular-nums;
  min-width: 60px; text-align: center;
}

/* ================= 响应式 ================= */
@media (max-width: 768px) {
  .page-header { padding: 90px 20px 32px; }
  .app-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .app-card { padding: 20px 16px 16px; border-radius: 16px; }
  .card-icon-wrap { width: 50px; height: 50px; border-radius: 14px; }
}
@media (max-width: 480px) {
  .app-grid { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; }
  .search-bar { max-width: 100%; }
}
</style>
