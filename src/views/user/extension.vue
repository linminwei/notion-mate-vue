<template>
  <!-- ================= 页面头部 ================= -->
  <header class="page-header">
    <h1 class="page-title">扩展推荐</h1>
    <p class="page-sub">发现好用的浏览器扩展与插件</p>
  </header>

  <!-- ================= 检索框 ================= -->
  <div class="search-bar">
    <font-awesome-icon :icon="['fas', 'search']" class="search-icon" />
    <input
      v-model="searchKeyword"
      type="text"
      placeholder="搜索扩展名称..."
      class="search-input"
    />
    <button v-if="searchKeyword" class="search-clear" @click="searchKeyword = ''">
      <font-awesome-icon :icon="['fas', 'times']" />
    </button>
  </div>

  <!-- ================= 内容区域（统一居中） ================= -->
  <div class="content-well">
  <!-- ================= 筛选栏 ================= -->
  <div class="filter-bar" v-if="categoryDict.length || platformDict.length">
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
    <div class="filter-row" v-if="platformDict.length">
      <span class="filter-label">平台</span>
      <div class="filter-pills">
        <button class="filter-pill" :class="{ active: selectedPlatform === '' }" @click="selectedPlatform = ''">全部</button>
        <button
          v-for="p in platformDict" :key="p.dictValue"
          class="filter-pill"
          :class="{ active: selectedPlatform === p.dictValue }"
          @click="selectedPlatform = p.dictValue"
        >{{ p.dictLabel }}</button>
      </div>
    </div>
  </div>

  <!-- ================= 扩展卡片网格 ================= -->
  <section class="website-grid-section">
    <div v-if="loading" class="loading-state">
      <font-awesome-icon :icon="['fas', 'spinner']" spin />
      <span>加载中...</span>
    </div>

    <div v-else-if="filteredWebsites.length" class="website-grid">
      <a
        v-for="ext in filteredWebsites"
        :key="ext.id"
        :href="ext.url"
        target="_blank"
        rel="noopener noreferrer"
        class="website-card"
      >
        <!-- 扩展图标 -->
        <div class="card-icon-wrap">
          <img
            v-if="ext.icon && isImageUrl(ext.icon)"
            :src="ext.icon"
            :alt="ext.name"
            class="card-icon-img"
            loading="lazy"
          />
          <span v-else class="card-icon-emoji">{{ ext.icon || '🧩' }}</span>
        </div>

        <!-- 扩展名称 -->
        <h3 class="card-name">{{ ext.name }}</h3>

        <!-- 分类 & 平台标签 -->
        <div class="card-tags" v-if="ext.category || (ext.platforms && ext.platforms.length)">
          <span class="card-category" v-if="ext.category">{{ ext.category }}</span>
          <span class="card-platform" v-for="p in ext.platforms" :key="p">{{ p }}</span>
        </div>

        <!-- 预览截图 -->
        <div class="card-preview" v-if="ext.webImg" @click.prevent.stop="previewImg = ext.webImg">
          <img :src="ext.webImg" :alt="ext.name" loading="lazy" decoding="async" />
          <div class="preview-hint">
            <font-awesome-icon :icon="['fas', 'search-plus']" /><span>预览</span>
          </div>
        </div>

        <!-- 描述 -->
        <p class="card-desc" v-if="ext.description">{{ ext.description }}</p>
      </a>
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
        <h3 class="modern-empty-title">暂无扩展推荐</h3>
        <p class="modern-empty-desc">暂时没有可显示的扩展数据。</p>
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getExtensionPage } from '@/api/extension.ts'
import { getDictDataByDictCodeEnable } from '@/api/dict.ts'
import { useAppStore } from '@/stores/app'
import type { ExtensionVo, DictData } from '@/types'

const router = useRouter()
const appStore = useAppStore()

const extensions = ref<ExtensionVo[]>([])
const loading = ref(false)
const pageNum = ref(1)
const total = ref(0)
const pageSize = 12
const previewImg = ref<string | null>(null)

const selectedCategory = ref('')
const categoryDict = ref<DictData[]>([])
const selectedPlatform = ref('')
const platformDict = ref<DictData[]>([])
const searchKeyword = ref('')

const filteredWebsites = computed(() => {
  let list = extensions.value
  if (selectedCategory.value) {
    list = list.filter(ext => ext.category === selectedCategory.value)
  }
  if (selectedPlatform.value) {
    list = list.filter(ext => ext.platforms?.includes(selectedPlatform.value))
  }
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(ext =>
      ext.name.toLowerCase().includes(kw) ||
      (ext.description && ext.description.toLowerCase().includes(kw))
    )
  }
  return list
})

const isImageUrl = (str: string) => /^https?:\/\/.+\.(png|jpg|jpeg|gif|svg|webp|ico)(\?.*)?$/i.test(str)

const totalPages = computed(() => Math.ceil(total.value / pageSize))

const fetchExtensions = async () => {
  loading.value = true
  try {
    const res = await getExtensionPage({
      pageNum: pageNum.value,
      pageSize,
      name: searchKeyword.value || undefined,
      category: selectedCategory.value || undefined,
      platform: selectedPlatform.value || undefined
    })
    extensions.value = res.data.list || []
    total.value = res.data.total || 0
  } catch {
    extensions.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

const goPage = (p: number) => {
  if (p < 1 || p > totalPages.value || p === pageNum.value) return
  pageNum.value = p
  fetchExtensions()
}

const fetchCategoryDict = async () => {
  try {
    const res = await getDictDataByDictCodeEnable('extension_category')
    categoryDict.value = res.data || []
  } catch {
    categoryDict.value = []
  }
}

const fetchPlatformDict = async () => {
  try {
    const res = await getDictDataByDictCodeEnable('extension_platform')
    platformDict.value = res.data || []
  } catch {
    platformDict.value = []
  }
}

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

watch(selectedCategory, () => {
  pageNum.value = 1
  fetchExtensions()
})

watch(selectedPlatform, () => {
  pageNum.value = 1
  fetchExtensions()
})

watch(searchKeyword, () => {
  pageNum.value = 1
  fetchExtensions()
})

watch(() => appStore.showRestricted, (val) => {
  if (val) {
    pageNum.value = 1
    selectedCategory.value = ''
    selectedPlatform.value = ''
    fetchExtensions()
  } else {
    router.push('/portal')
  }
})

onMounted(() => {
  fetchExtensions()
  fetchCategoryDict()
  fetchPlatformDict()
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
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

/* ================= 加载 / 空状态 ================= */
.loading-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 16px; padding: 100px 20px; color: var(--text-muted);
  font-size: 15px;
}
.loading-state :deep(svg) { font-size: 28px; opacity: 0.6; }
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
.website-grid-section {
  position: relative; z-index: 10; max-width: 1100px;
  margin: 0 auto; padding: 0 24px 48px; box-sizing: border-box;
}
.website-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

/* ================= 单张卡片 ================= */
.website-card {
  display: flex; flex-direction: column; align-items: flex-start; gap: 10px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 18px; padding: 24px 20px 18px;
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  text-decoration: none; color: inherit;
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
              border-color 0.3s ease,
              box-shadow 0.35s ease;
  animation: card-in 0.45s ease-out both;
}
.website-card:nth-child(1) { animation-delay: 0s; }
.website-card:nth-child(2) { animation-delay: 0.05s; }
.website-card:nth-child(3) { animation-delay: 0.1s; }
.website-card:nth-child(4) { animation-delay: 0.15s; }
.website-card:nth-child(5) { animation-delay: 0.2s; }
.website-card:nth-child(6) { animation-delay: 0.25s; }
.website-card:nth-child(n+7) { animation-delay: 0.3s; }
@keyframes card-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.website-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--apple-blue, #0A84FF) 35%, transparent);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15),
              0 0 0 1px color-mix(in srgb, var(--apple-blue, #0A84FF) 15%, transparent);
}

.card-icon-wrap {
  width: 60px; height: 60px; border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  background: var(--hover-bg);
  border: 1px solid var(--border-subtle);
  overflow: hidden; flex-shrink: 0;
}
.card-icon-img { width: 100%; height: 100%; object-fit: contain; }
.card-icon-emoji { font-size: 30px; line-height: 1; }

.card-name {
  font-size: 16px; font-weight: 700; letter-spacing: -0.01em;
  color: var(--text-primary); margin: 0;
  text-align: left; width: 100%; line-height: 1.35;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden; word-break: break-word;
}

.card-tags {
  display: flex; flex-wrap: wrap; justify-content: flex-start; gap: 6px;
}
.card-category {
  padding: 3px 10px; border-radius: 5px;
  font-size: 11px; font-weight: 600; letter-spacing: 0.02em;
  background: color-mix(in srgb, var(--apple-blue, #0A84FF) 12%, transparent);
  color: var(--apple-blue, #0A84FF);
}

.card-platform {
  padding: 3px 10px; border-radius: 5px;
  font-size: 11px; font-weight: 600; letter-spacing: 0.02em;
  background: color-mix(in srgb, var(--apple-green, #34C759) 12%, transparent);
  color: var(--apple-green, #34C759);
}

.card-desc {
  font-size: 13px; color: var(--text-secondary);
  margin: 0; line-height: 1.6; word-break: break-word;
  text-align: left; width: 100%;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-preview {
  position: relative; width: 100%; border-radius: 10px;
  overflow: hidden; cursor: pointer;
  background: var(--hover-bg);
  border: 1px solid var(--border-subtle);
  aspect-ratio: 16 / 9;
}
.card-preview img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.card-preview:hover img { transform: scale(1.05); }
.preview-hint {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  background: rgba(0, 0, 0, 0.5); color: #fff;
  font-size: 13px; font-weight: 500;
  opacity: 0; transition: opacity 0.25s ease;
  backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px);
}
.card-preview:hover .preview-hint { opacity: 1; }

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

/* ================= 图片预览弹窗 ================= */
.img-preview-overlay {
  position: fixed; inset: 0; z-index: 2000;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
}
.img-preview-container {
  position: relative; max-width: 90vw; max-height: 85vh;
  border-radius: 14px; overflow: hidden;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
  animation: preview-enter 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
@keyframes preview-enter {
  from { opacity: 0; transform: scale(0.94); }
  to { opacity: 1; transform: scale(1); }
}
.img-preview-container img {
  max-width: 90vw; max-height: 85vh; display: block;
}
.img-preview-close {
  position: absolute; top: 14px; right: 14px;
  width: 34px; height: 34px; border-radius: 50%; border: none;
  background: rgba(0, 0, 0, 0.55); color: #fff; font-size: 14px;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  transition: all 0.2s ease;
}
.img-preview-close:hover {
  background: rgba(0, 0, 0, 0.75); transform: scale(1.08);
}
.preview-fade-enter-active,
.preview-fade-leave-active { transition: opacity 0.25s ease; }
.preview-fade-enter-from,
.preview-fade-leave-to { opacity: 0; }

/* ================= 响应式 ================= */
@media (max-width: 768px) {
  .page-header { padding: 90px 20px 32px; }
  .website-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .website-card { padding: 20px 16px 16px; border-radius: 16px; }
  .card-icon-wrap { width: 50px; height: 50px; border-radius: 14px; }
}
@media (max-width: 480px) {
  .website-grid { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; }
  .search-bar { max-width: 100%; }
}
</style>
