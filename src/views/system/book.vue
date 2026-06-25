<template>
  <div class="neo-page-container">

    <!-- ================= 列表视图：头部 ================= -->
    <header v-if="currentView === 'list'" class="neo-page-header">
      <div class="capsule-search">
        <div class="search-inputs">
          <input type="text" v-model="searchForm.title" placeholder="书名" @keyup.enter="handleSearch" />
          <div class="divider"></div>
          <input type="text" v-model="searchForm.author" placeholder="作者" @keyup.enter="handleSearch" />
          <div class="divider"></div>
          <input type="text" v-model="searchForm.isbn" placeholder="ISBN" @keyup.enter="handleSearch" />
          <div class="divider"></div>
          <input type="text" v-model="searchForm.category" placeholder="类别" @keyup.enter="handleSearch" />
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
        <button class="neo-btn-solid primary" @click="openAddView">
          <font-awesome-icon :icon="['fas', 'plus']" />
          添加书籍
        </button>
      </div>
    </header>

    <!-- ================= 搜索视图：头部 ================= -->
    <header v-if="currentView === 'search'" class="add-view-header">
      <button class="back-btn-outlined" @click="backToList">
        <font-awesome-icon :icon="['fas', 'chevron-left']" class="back-icon" />
        返回列表
      </button>
    </header>

    <!-- ================= 搜索视图：搜索栏 ================= -->
    <section v-if="currentView === 'search'" class="search-hero fade-in-up" :class="{ 'is-initial': !doubanSearched }">

      <div class="search-hero-inner">
        <h1 class="hero-title">发现好书</h1>
        <p class="hero-subtitle">
          {{ doubanSearched ? `找到 ${doubanResults.length} 本相关图书` : '输入书名或 ISBN 检索豆瓣图书库' }}
        </p>
        <div class="search-hero-bar">
          <font-awesome-icon :icon="['fas', 'search']" class="hero-search-icon" />
          <input
              v-model="doubanKeyword"
              type="text"
              placeholder="输入书名、作者或 ISBN..."
              @keyup.enter="handleDoubanSearch"
          />
          <button class="hero-search-btn" :disabled="doubanSearching || !doubanKeyword.trim()" @click="handleDoubanSearch">
            <span v-if="doubanSearching" class="btn-spinner"></span>
            <span>{{ doubanSearching ? '搜索中' : '搜索' }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- ================= 详情视图：头部 ================= -->
    <header v-if="currentView === 'detail'" class="detail-sub-header">
      <button class="back-btn-outlined" @click="backToSearch">
        <font-awesome-icon :icon="['fas', 'chevron-left']" class="back-icon" />
        返回搜索结果
      </button>
    </header>

    <!-- ================= 列表视图：表格 ================= -->
    <div v-if="currentView === 'list'" class="neo-card table-card fade-in">
      <a-table
          class="neo-table"
          :columns="columns"
          :data-source="tableData"
          :loading="loading"
          :pagination="pagination"
          row-key="pageId"
          @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'cover'">
            <div v-if="record.cover" class="cover-thumb" @click="previewImg = record.cover">
              <div v-if="!imgLoadedCache[record.pageId]" class="cover-skeleton"></div>
              <img :src="record.cover" alt="封面" loading="lazy" decoding="async"
                   @load="onImgLoad(record.pageId)" @error="onImgError(record.pageId)"
                   :class="{ 'img-loaded': imgLoadedCache[record.pageId] }" />
            </div>
            <span v-else class="cell-placeholder">—</span>
          </template>
          <template v-if="column.key === 'title'"><span class="book-title">{{ record.title }}</span></template>
          <template v-if="column.key === 'author'">
            <div v-if="record.authorName" class="author-cell">
              <img v-if="record.authorAvatar" :src="record.authorAvatar" class="author-avatar" loading="lazy" />
              <span>{{ record.authorName }}</span>
            </div>
            <span v-else class="cell-placeholder">—</span>
          </template>
          <template v-if="column.key === 'category'">
            <span v-if="record.category" class="category-tag">{{ record.category }}</span>
            <span v-else class="cell-placeholder">—</span>
          </template>
          <template v-if="column.key === 'rating'">
            <span v-if="record.rating" class="rating-text"><font-awesome-icon :icon="['fas', 'star']" class="rating-star" />{{ record.rating }}</span>
            <span v-else class="cell-placeholder">—</span>
          </template>
          <template v-if="column.key === 'summary'">
            <span v-if="record.summary" class="cell-summary">{{ truncate(record.summary, 80) }}</span>
            <span v-else class="cell-placeholder">—</span>
          </template>
        </template>
      </a-table>
    </div>

    <!-- ================= 搜索视图：豆瓣搜索结果 ================= -->
    <div v-if="currentView === 'search'" class="douban-results-area">
      <!-- 加载中 -->
      <div v-if="doubanSearching" class="loading-state fade-in">
        <div class="loading-card">
          <div class="loading-spinner">
            <div class="spinner-ring"></div>
          </div>
          <p class="loading-text">正在搜索豆瓣图书库</p>
          <div class="loading-ellipsis"><span></span><span></span><span></span></div>
        </div>
      </div>
      <!-- 无结果 -->
      <div v-if="doubanSearched && !doubanSearching && doubanResults.length === 0" class="empty-state fade-in">
        <div class="empty-state-icon muted">
          <div class="empty-ring-ring"></div>
          <div class="empty-ring-ring ring-outer"></div>
          <div class="empty-ring-ring ring-far"></div>
          <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
        </div>
        <h3 class="empty-state-title">没有找到匹配的图书</h3>
        <div class="empty-state-sep"></div>
        <p class="empty-state-desc">请尝试不同的书名、作者或 ISBN 重新搜索</p>
      </div>
      <!-- 结果网格 -->
      <div v-if="doubanResults.length > 0" class="douban-result-grid">
        <div v-for="(book, index) in doubanResults" :key="book.doubanId"
             class="douban-book-card"
             :style="{ animationDelay: `${index * 0.06}s` }"
             @click="openDetail(book.doubanId)">
          <div class="card-cover">
            <img v-if="book.cover" :src="proxyImageUrl(book.cover)" :alt="book.title" loading="lazy" />
            <div v-else class="no-cover-sm">
              <font-awesome-icon :icon="['fas', 'image']" />
            </div>
            <div class="cover-overlay"></div>
            <!-- 评分角标：左上 -->
            <div class="cover-rating-badge" :class="{ 'no-rating': !book.rating }">
              {{ book.rating ? book.rating.toFixed(1) : '暂无评分' }}
            </div>
            <!-- 豆瓣跳转：右上 -->
            <a v-if="book.doubanId"
               :href="`https://book.douban.com/subject/${book.doubanId}`"
               target="_blank"
               class="cover-douban-badge"
               @click.stop
               title="在豆瓣查看">
              <img src="/豆瓣网.png" alt="豆瓣" />
            </a>
          </div>
          <div class="card-body">
            <h3 class="card-title-text">{{ book.title }}</h3>
            <p class="card-author" v-if="book.author">{{ book.author }}</p>
            <p class="card-publisher" v-if="book.publisher">{{ book.publisher }}<span v-if="book.pubDate"> / {{ book.pubDate }}</span></p>
            <!-- 星级可视化 -->
            <div class="card-stars">
              <font-awesome-icon v-for="i in 5" :key="i"
                :icon="[i <= starCount(book.rating || 0) ? 'fas' : 'far', 'star']"
                :class="{ 'filled': i <= starCount(book.rating || 0) }" />
              <span class="stars-num" v-if="book.rating">{{ formatRating(book.rating) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= 详情视图 ================= -->
    <div v-if="currentView === 'detail'" class="detail-view fade-in-up">
      <div v-if="detailLoading" class="loading-state fade-in">
        <div class="loading-card">
          <div class="loading-spinner">
            <div class="spinner-ring"></div>
          </div>
          <p class="loading-text">正在拉取图书详情</p>
          <div class="loading-ellipsis"><span></span><span></span><span></span></div>
        </div>
      </div>
      <div v-else-if="bookDetail" class="detail-card-wrapper">
        <div class="detail-card">
          <!-- 左侧：3D 实体书封 -->
          <div class="detail-cover-section">
            <div class="book-3d">
              <!-- 书脊 -->
              <div class="book-spine"></div>
              <!-- 封面主体 -->
              <div class="book-cover-face">
                <img v-if="bookDetail.cover" :src="proxyImageUrl(bookDetail.cover)" alt="封面" />
                <div v-else class="no-cover"><font-awesome-icon :icon="['fas', 'book']" /></div>
                <!-- 封面高光 -->
                <div class="cover-shine"></div>
              </div>
              <!-- 书页厚度 -->
              <div class="book-pages"></div>
              <!-- 底边阴影 -->
              <div class="book-shadow"></div>
            </div>
          </div>
          <!-- 右侧：详细信息 -->
          <div class="detail-info-section">
            <h1 class="detail-title">{{ bookDetail.title }}</h1>

            <div class="detail-meta-grid">
              <div class="meta-item" v-if="bookDetail.author || editState.field === 'author'">
                <span class="meta-label">作者</span>
                <input
                  v-if="editState.field === 'author'"
                  v-model="editState.value"
                  class="meta-input"
                  @blur="saveEdit('author')"
                  @keyup.enter="saveEdit('author')"
                  @vue:mounted="($el as HTMLInputElement).focus()"
                />
                <span v-else class="meta-value author-link editable" @click="startEdit('author', bookDetail.author)">{{ bookDetail.author || '点击添加' }}</span>
              </div>
              <div class="meta-item" v-if="bookDetail.publisher || editState.field === 'publisher'">
                <span class="meta-label">出版社</span>
                <input
                  v-if="editState.field === 'publisher'"
                  v-model="editState.value"
                  class="meta-input"
                  @blur="saveEdit('publisher')"
                  @keyup.enter="saveEdit('publisher')"
                  @vue:mounted="($el as HTMLInputElement).focus()"
                />
                <span v-else class="meta-value editable" @click="startEdit('publisher', bookDetail.publisher)">{{ bookDetail.publisher || '点击添加' }}</span>
              </div>
              <div class="meta-item" v-if="bookDetail.pubDate">
                <span class="meta-label">出版日期</span>
                <span class="meta-value">{{ formatDate(bookDetail.pubDate) }}</span>
              </div>
              <div class="meta-item" v-if="bookDetail.isbn">
                <span class="meta-label">ISBN</span>
                <span class="meta-value">{{ bookDetail.isbn }}</span>
              </div>
            </div>

            <div class="detail-rating-banner" v-if="bookDetail.rating">
              <div class="rating-score">
                {{ formatRating(bookDetail.rating) }}
                <font-awesome-icon :icon="['fas', 'star']" class="rating-star-big" />
              </div>
              <div class="rating-label">豆瓣评分</div>
            </div>

            <div class="detail-summary" v-if="bookDetail.summary || editState.field === 'summary'">
              <h3>内容简介</h3>
              <textarea
                v-if="editState.field === 'summary'"
                v-model="editState.value"
                class="summary-textarea"
                rows="5"
                @blur="saveEdit('summary')"
                @vue:mounted="($el as HTMLTextAreaElement).focus()"
              />
              <p v-else class="editable-summary" @click="startEdit('summary', bookDetail.summary)">{{ bookDetail.summary || '点击添加简介' }}</p>
            </div>

            <!-- 操作按钮区 -->
            <div class="detail-actions">
              <button class="neo-btn-solid primary large-btn"
                :class="{ 'is-collected': collectedBookIds.has(currentDoubanId) }"
                @click="toggleCollect(currentDoubanId)">
                <font-awesome-icon :icon="[collectedBookIds.has(currentDoubanId) ? 'fas' : 'far', collectedBookIds.has(currentDoubanId) ? 'check-circle' : 'bookmark']" />
                {{ collectedBookIds.has(currentDoubanId) ? '已收藏' : '入库收藏' }}
              </button>
              <a v-if="currentDoubanId"
                 :href="`https://book.douban.com/subject/${currentDoubanId}`"
                 target="_blank"
                 class="douban-link-btn"
                 title="在豆瓣查看">
                <img src="/豆瓣网.png" alt="豆瓣" />
                <span>在豆瓣查看</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="error-state fade-in">
        <div class="error-card">
          <div class="error-icon-wrap">
            <font-awesome-icon :icon="['fas', 'triangle-exclamation']" />
          </div>
          <h3 class="error-title">加载失败</h3>
          <div class="empty-state-sep" style="background:color-mix(in srgb, var(--apple-red, #ff3b30) 30%, transparent)"></div>
          <p class="error-desc">请检查网络连接后重试</p>
          <button class="error-retry-btn" @click="retryLastDetail">
            <font-awesome-icon :icon="['fas', 'rotate-right']" />
            重新加载
          </button>
        </div>
      </div>
    </div>

    <!-- ================= 封面大图预览 ================= -->
    <Teleport to="body">
      <Transition name="preview-fade">
        <div v-if="previewImg" class="img-preview-overlay" @click.self="previewImg = null">
          <div class="img-preview-container">
            <img :src="previewImg" alt="封面预览" />
            <button class="img-preview-close" @click="previewImg = null"><font-awesome-icon :icon="['fas', 'times']" /></button>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { getBookPage } from '@/api/book.ts'
import { searchBook, getBookDetail } from '@/api/douban.ts'
import type { BookVo, DoubanSearchBookVo, DoubanBookDetailVo } from '@/types'
import { AppleAlert } from '@/components/common/AppleAlert.ts'

// ==================== 视图状态 ====================
type ViewMode = 'list' | 'search' | 'detail'
const currentView = ref<ViewMode>('list')
const _imgCache: Record<string, boolean> = {}

// ==================== 列表视图 ====================
const columns = [
  { title: '封面', dataIndex: 'cover', key: 'cover', align: 'center', width: 80 },
  { title: '书名', dataIndex: 'title', key: 'title', width: 180 },
  { title: '作者', dataIndex: 'author', key: 'author', width: 140 },
  { title: '类别', dataIndex: 'category', key: 'category', width: 100 },
  { title: '出版社', dataIndex: 'publisher', key: 'publisher', width: 150 },
  { title: 'ISBN', dataIndex: 'isbn', key: 'isbn', width: 140 },
  { title: '评分', dataIndex: 'rating', key: 'rating', align: 'center', width: 80 },
  { title: '简介', dataIndex: 'summary', key: 'summary' },
]
const loading = ref(false)
const tableData = ref<BookVo[]>([])
const previewImg = ref<string | null>(null)
const imgLoadedCache = reactive(_imgCache)
const searchForm = reactive({ title: '', author: '', isbn: '', category: '', pageNum: 1, pageSize: 10 })
const pagination = reactive({ current: 1, pageSize: 10, total: 0, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '50'], showTotal: (total: number) => `共 ${total} 条` })

const truncate = (str: string, len: number) => (str.length > len ? str.slice(0, len) + '…' : str)
const onImgLoad = (id: string) => { imgLoadedCache[id] = true }
const onImgError = (id: string) => { imgLoadedCache[id] = true }

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getBookPage(searchForm)
    tableData.value = res.data.list
    pagination.total = res.data.total
    pagination.current = searchForm.pageNum
  } catch (error: any) { AppleAlert.error('数据加载失败', error.message || '无法获取书籍列表') }
  finally { loading.value = false }
}
const handleSearch = () => { searchForm.pageNum = 1; pagination.current = 1; fetchData() }
const handleReset = () => { searchForm.title = ''; searchForm.author = ''; searchForm.isbn = ''; searchForm.category = ''; searchForm.pageNum = 1; pagination.current = 1; fetchData() }
const handleTableChange = (pag: any) => { searchForm.pageNum = pag.current; searchForm.pageSize = pag.pageSize; pagination.current = pag.current; pagination.pageSize = pag.pageSize; fetchData() }

// ==================== 豆瓣搜索 ====================
const doubanKeyword = ref('')
const doubanSearching = ref(false)
const doubanSearched = ref(false)
const doubanResults = ref<DoubanSearchBookVo[]>([])
const proxyImageUrl = (url: string) => `/api/douban/image?imgUrl=${encodeURIComponent(url)}`

const starCount = (rating: number) => Math.round(rating / 2)
const formatRating = (r: number) => r != null ? r.toFixed(1) : ''
const formatDate = (d: string) => { if (!d) return ''; const m = d.match(/^\d{4}-\d{2}-\d{2}/); return m ? m[0] : d }

const handleDoubanSearch = async () => {
  if (!doubanKeyword.value.trim()) return
  doubanSearching.value = true; doubanSearched.value = true
  try { const res = await searchBook(doubanKeyword.value.trim()); doubanResults.value = res.data || [] }
  catch (error: any) { AppleAlert.error('搜索失败', error.message || '请稍后重试'); doubanResults.value = [] }
  finally { doubanSearching.value = false }
}

// ==================== 详情 ====================
const detailLoading = ref(false)
const bookDetail = ref<DoubanBookDetailVo | null>(null)
const currentDoubanId = ref('')
const collectedBookIds = ref(new Set<string>())

const toggleCollect = (id: string) => {
  if (!id) return
  const s = new Set(collectedBookIds.value)
  if (s.has(id)) { s.delete(id); AppleAlert.info('提示', '已取消收藏') }
  else { s.add(id); AppleAlert.success('收藏成功', '图书已加入你的书架') }
  collectedBookIds.value = s
}

// ==================== 内联编辑 ====================
const editState = reactive({ field: '' as string, value: '' })
const startEdit = (field: string, val: string) => {
  editState.field = field
  editState.value = val || ''
}
const saveEdit = (field: string) => {
  if (!bookDetail.value) return
  if (field === 'author') bookDetail.value.author = editState.value
  if (field === 'publisher') bookDetail.value.publisher = editState.value
  if (field === 'summary') bookDetail.value.summary = editState.value
  if (editState.field === field) editState.field = ''
}

const openDetail = async (doubanId: string) => {
  currentView.value = 'detail'; detailLoading.value = true; bookDetail.value = null; currentDoubanId.value = doubanId
  try { const res = await getBookDetail(doubanId); bookDetail.value = res.data }
  catch (error: any) { AppleAlert.error('获取详情失败', error.message || '请稍后重试') }
  finally { detailLoading.value = false }
}
const retryLastDetail = () => { if (currentDoubanId.value) openDetail(currentDoubanId.value) }

// ==================== 视图切换 ====================
const openAddView = () => { currentView.value = 'search'; doubanSearched.value = false; doubanResults.value = []; doubanKeyword.value = '' }
const backToList = () => { currentView.value = 'list' }
const backToSearch = () => { currentView.value = 'search'; bookDetail.value = null }

// ==================== ESC 关闭预览 ====================
const onKeydown = (e: KeyboardEvent) => { if (e.key === 'Escape' && previewImg.value) previewImg.value = null }
watch(previewImg, (val) => { if (val) document.addEventListener('keydown', onKeydown); else document.removeEventListener('keydown', onKeydown) })
onUnmounted(() => document.removeEventListener('keydown', onKeydown))

onMounted(() => fetchData())
</script>

<style scoped>
/* ================= 通用 & 动画 ================= */
.cell-placeholder { color: var(--text-muted, #a1a1aa); }
.cell-summary { display: block; line-height: 1.5; color: var(--text-secondary, #666); font-size: 13px; }
.book-title { font-weight: 500; }
.author-cell { display: inline-flex; align-items: center; gap: 6px; }
.author-avatar { width: 22px; height: 22px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.category-tag { display: inline-block; padding: 2px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; background: color-mix(in srgb, var(--apple-blue, #007AFF) 10%, transparent); color: var(--apple-blue, #007AFF); }
:global(.dark) .category-tag { background: color-mix(in srgb, var(--apple-blue, #0A84FF) 15%, transparent); }
.rating-text { font-weight: 500; font-size: 13px; }
.rating-star { color: #f5a623; font-size: 11px; margin-right: 3px; }

.cover-thumb { width: 48px; height: 64px; border-radius: 6px; overflow: hidden; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; background: var(--hover-bg, #f5f5f7); transition: transform 0.2s; border: 1px solid var(--border-color, rgba(0,0,0,0.06)); position: relative; }
.cover-thumb:hover { transform: scale(1.08); }
.cover-thumb img { width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.3s ease; }
.cover-thumb img.img-loaded { opacity: 1; }
.cover-skeleton { position: absolute; inset: 0; background: linear-gradient(90deg, var(--hover-bg, #e5e5ea) 0%, var(--card-bg, #f0f0f3) 50%, var(--hover-bg, #e5e5ea) 100%); background-size: 200% 100%; animation: skeleton-shimmer 1.4s ease-in-out infinite; z-index: 1; pointer-events: none; }
@keyframes skeleton-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

.fade-in { animation: fadeIn 0.3s ease; }
.fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

/* ================= 大图预览 ================= */
.img-preview-overlay { position: fixed; inset: 0; z-index: 2000; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
.img-preview-container { position: relative; max-width: 90vw; max-height: 85vh; border-radius: 12px; overflow: hidden; box-shadow: 0 24px 80px rgba(0,0,0,0.3); }
.img-preview-container img { max-width: 90vw; max-height: 85vh; display: block; }
.img-preview-close { position: absolute; top: 12px; right: 12px; width: 32px; height: 32px; border-radius: 50%; border: none; background: rgba(0,0,0,0.5); color: #fff; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
.img-preview-close:hover { background: rgba(0,0,0,0.7); }
.preview-fade-enter-active, .preview-fade-leave-active { transition: opacity 0.25s ease; }
.preview-fade-enter-from, .preview-fade-leave-to { opacity: 0; }

/* ================= 列表头部搜索 ================= */
.neo-page-header { display: flex; align-items: center; justify-content: space-between; padding: 0 0 12px; gap: 16px; }
.capsule-search { display: flex; min-width: 400px; background: var(--card-bg, #f5f5f7); border-radius: 14px; padding: 4px; border: 1px solid var(--border-color); transition: all 0.3s; align-items: center; }
.capsule-search:focus-within { background: var(--card-bg, #ffffff); border-color: var(--apple-blue, #0A84FF); box-shadow: 0 0 0 4px color-mix(in srgb, var(--apple-blue, #0A84FF) 10%, transparent); }
.search-inputs { flex: 1; display: flex; align-items: center; padding: 0 4px; height: 26px; }
.search-inputs input { flex: 1; min-width: 0; width: 0; border: none; background: transparent; font-size: 13px; color: var(--text-main); outline: none; padding: 0 8px; height: 26px; line-height: 26px; }
.search-inputs input::placeholder { color: var(--text-muted, #a1a1aa); }
.divider { width: 1px; height: 14px; background: var(--border-color, #e5e5ea); margin: 0 4px; flex-shrink: 0; }
.search-actions { display: flex; gap: 4px; margin-left: 8px; }

/* 列表搜索按钮恢复原有主题蓝 */
.search-trigger { width: 32px; height: 32px; border: none; border-radius: 10px; background: var(--apple-blue, #0A84FF); color: #ffffff; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
.search-trigger:hover { filter: brightness(0.9); transform: scale(0.95); }
.search-trigger.reset-btn { background: var(--hover-bg, #e5e5ea); color: var(--text-main, #333); }
.search-trigger.reset-btn:hover { background: var(--active-bg, rgba(0,0,0,0.1)); transform: scale(0.95); }

/* ================= 发现页：返回按钮 (黑白反转风格) ================= */
.add-view-header, .detail-sub-header { display: flex; align-items: center; padding: 0 0 16px; position: relative; z-index: 10; }
.back-btn-outlined {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px 8px 12px;
  border: 1px solid transparent;
  border-radius: 40px;
  /* 亮色：黑底白字 */
  background: #000000;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.back-icon {
  font-size: 13px;
  color: #ffffff;
  transition: color 0.3s;
}
.back-btn-outlined:hover {
  background: #333333;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
}
.back-btn-outlined:hover .back-icon { color: #ffffff; }
.back-btn-outlined:active { transform: scale(0.96); box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }



/* ================= Search Hero 区 ================= */
.search-hero {
  display: flex;
  justify-content: center;
  padding: 32px 0 48px;
  transition: padding 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
}

/* 当尚未搜索时，Hero区块向下延展，类似独立首页居中效果 */
.search-hero.is-initial {
  padding: 6vh 0 4vh;
}
.search-hero-inner {
  width: 100%;
  max-width: 640px;
  text-align: center;
  position: relative;
  z-index: 10;
}
/* 渐变标题设计 */
.hero-title {
  font-size: 36px;
  font-weight: 800;
  margin: 0 0 8px;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, var(--text-main, #1d1d1f) 0%, var(--text-secondary, #666666) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-subtitle {
  font-size: 15px;
  color: var(--text-secondary, #86868b);
  margin: 0 0 32px;
  font-weight: 400;
}
.search-hero-bar {
  display: flex;
  align-items: center;
  height: 68px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 24px;
  border: 1px solid rgba(0,0,0,0.08);
  padding: 0 8px 0 24px;
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: 0 12px 32px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02);
}
.search-hero-bar:focus-within {
  background: rgba(255, 255, 255, 0.98);
  border-color: color-mix(in srgb, var(--apple-blue, #007AFF) 40%, transparent);
  box-shadow:
      0 20px 48px color-mix(in srgb, var(--apple-blue, #007AFF) 12%, transparent),
      0 4px 16px rgba(0,0,0,0.04),
      0 0 0 4px color-mix(in srgb, var(--apple-blue, #007AFF) 15%, transparent);
  transform: translateY(-2px);
}
.hero-search-icon {
  color: var(--text-muted, #8e8e93);
  font-size: 18px;
  flex-shrink: 0;
  transition: color 0.3s;
}
.search-hero-bar:focus-within .hero-search-icon { color: var(--apple-blue, #007AFF); }
.search-hero-bar input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  font-size: 17px;
  color: var(--text-main, #1d1d1f);
  outline: none;
  padding: 0 16px;
}
.search-hero-bar input::placeholder { color: var(--text-placeholder, #a1a1aa); }

/* 发现页搜索大按钮 (亮黑 / 暗白风格) */
.hero-search-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  min-width: 104px;
  padding: 0 28px;
  border: none;
  border-radius: 18px;
  /* 亮色：黑底白字 */
  background: #000000;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.hero-search-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  background: #333333;
}
.hero-search-btn:active:not(:disabled) { transform: scale(0.96); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); }
.hero-search-btn:disabled {
  background: var(--hover-bg, #e5e5ea);
  color: var(--text-muted, #a1a1aa);
  box-shadow: none;
  cursor: not-allowed;
}



/* 搜索小Loading Spinner */
.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ring-spin 0.8s linear infinite;
  opacity: 0.8;
}

/* ================= 结果状态 / 空状态 ================= */
.empty-state, .loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  text-align: center;
}
.error-state { color: var(--apple-red, #ff3b30); }

/* ================= 错误卡片 ================= */
.error-card {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 48px;
  background: var(--card-bg, #fff);
  border-radius: 18px;
  border: 1px solid var(--border-color, rgba(0,0,0,0.06));
  box-shadow: 0 2px 12px rgba(0,0,0,0.03);
}
.error-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: color-mix(in srgb, var(--apple-red, #ff3b30) 8%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: var(--apple-red, #ff3b30);
  margin-bottom: 20px;
}
.error-title { font-size: 18px; font-weight: 700; color: var(--text-main); margin: 0 0 14px; }
.error-desc { font-size: 14px; color: var(--text-secondary, #888); margin: 0 0 20px; }
.error-retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 36px;
  padding: 0 20px;
  border: none;
  border-radius: 10px;
  background: var(--apple-red, #ff3b30);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}
.error-retry-btn:hover { opacity: 0.85; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(255,59,48,0.3); }
.error-retry-btn:active { transform: scale(0.96); }
.empty-state-icon {
  width: 120px;
  height: 120px;
  border-radius: 32px;
  background: linear-gradient(135deg, rgba(0,122,255,0.08) 0%, rgba(0,122,255,0.02) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44px;
  color: var(--apple-blue, #007AFF);
  margin-bottom: 28px;
  box-shadow: 0 12px 32px rgba(0,122,255,0.06), inset 0 1px 0 rgba(255,255,255,0.6);
  position: relative;
  animation: iconFloat 4s ease-in-out infinite;
}
/* 玻璃反光 — 裁剪在容器内 */
.empty-state-icon::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 50%);
  pointer-events: none;
}
.empty-state-icon.muted { background: linear-gradient(135deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.01) 100%); color: var(--text-tertiary, #b0b0b8); box-shadow: 0 8px 24px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.4); }
.empty-state-icon.muted::after { background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%); }
@keyframes iconFloat {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-5px); }
}
/* 装饰环 — 三层雷达扩散隐喻 */
.empty-ring-ring {
  position: absolute;
  inset: -6px;
  border-radius: 36px;
  border: 2px solid color-mix(in srgb, var(--apple-blue, #007AFF) 38%, transparent);
  pointer-events: none;
  z-index: 0;
  animation: ringSweep 2.8s ease-in-out infinite;
}
.empty-ring-ring.ring-outer {
  inset: -16px;
  border-radius: 46px;
  animation-delay: 0.4s;
  border-width: 1.5px;
  border-color: color-mix(in srgb, var(--apple-blue, #007AFF) 26%, transparent);
}
.empty-ring-ring.ring-far {
  inset: -28px;
  border-radius: 58px;
  animation-delay: 0.8s;
  border-width: 1px;
  border-color: color-mix(in srgb, var(--apple-blue, #007AFF) 16%, transparent);
}
@keyframes ringSweep {
  0%, 100% { opacity: 0.35; transform: scale(0.94) rotate(0deg); }
  50%      { opacity: 0.85; transform: scale(1.04) rotate(3deg); }
}
.empty-state-title { font-size: 22px; font-weight: 700; color: var(--text-main, #1d1d1f); margin: 0 0 10px; letter-spacing: -0.01em; }
/* 标题-描述分隔线 */
.empty-state-sep {
  width: 32px;
  height: 2px;
  border-radius: 2px;
  background: color-mix(in srgb, var(--apple-blue, #007AFF) 20%, transparent);
  margin: 0 auto 14px;
}
.empty-state-desc { font-size: 15px; color: var(--text-tertiary, #999); margin: 0; line-height: 1.7; max-width: 360px; }

:global(.dark) .empty-state-icon.muted::after { background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 60%); }

:global(.dark) .empty-state-icon { background: rgba(10, 132, 255, 0.12); box-shadow: 0 12px 32px rgba(10,132,255,0.08), inset 0 1px 0 rgba(255,255,255,0.06); }
:global(.dark) .empty-state-icon.muted { background: rgba(255,255,255,0.04); box-shadow: 0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03); }
:global(.dark) .empty-ring-ring { border-color: color-mix(in srgb, var(--apple-blue, #0A84FF) 42%, transparent); }
:global(.dark) .empty-ring-ring.ring-outer { border-color: color-mix(in srgb, var(--apple-blue, #0A84FF) 30%, transparent); }
:global(.dark) .empty-ring-ring.ring-far { border-color: color-mix(in srgb, var(--apple-blue, #0A84FF) 20%, transparent); }
:global(.dark) .empty-state-sep { background: color-mix(in srgb, var(--apple-blue, #0A84FF) 25%, transparent); }

/* ================= Loading ================= */
.loading-dots { display: none; }

/* ================= 加载卡片 ================= */
.loading-card {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  padding: 40px 48px;
  background: var(--card-bg, #fff);
  border-radius: 18px;
  border: 1px solid var(--border-color, rgba(0,0,0,0.06));
  box-shadow: 0 2px 12px rgba(0,0,0,0.03);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin-bottom: 20px;
  position: relative;
}
.spinner-ring {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid var(--border-color, rgba(0,0,0,0.08));
  border-top-color: var(--apple-blue, #007AFF);
  border-right-color: color-mix(in srgb, var(--apple-blue, #007AFF) 40%, transparent);
  animation: spinnerSpin 0.9s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
@keyframes spinnerSpin { to { transform: rotate(360deg); } }

.loading-text {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-secondary, #666);
  margin: 0 0 14px;
  letter-spacing: 0.01em;
}

.loading-ellipsis {
  display: flex;
  gap: 5px;
}
.loading-ellipsis span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--text-muted, #b0b0b8);
  animation: ellipsisBreathe 1.4s ease-in-out infinite both;
}
.loading-ellipsis span:nth-child(2) { animation-delay: 0.2s; }
.loading-ellipsis span:nth-child(3) { animation-delay: 0.4s; }
@keyframes ellipsisBreathe {
  0%, 80%, 100% { opacity: 0.25; transform: scale(0.7); }
  40% { opacity: 1; transform: scale(1); }
}
@keyframes cardEnter {
  from { opacity: 0; transform: translateY(20px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes ring-spin { to { transform: rotate(360deg); } }

/* ================= 豆瓣搜索结果网格 ================= */
.douban-results-area { flex: 1; padding-bottom: 40px; position: relative; z-index: 10; }
.douban-result-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}
.douban-book-card {
  background: var(--card-bg, #fff);
  border-radius: 16px;
  border: 1px solid var(--border-color, rgba(0,0,0,0.06));
  overflow: hidden;
  cursor: pointer;
  padding: 10px;
  transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
              border-color 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  animation: cardEnter 0.45s cubic-bezier(0.22, 0.61, 0.36, 1) both;
}
.douban-book-card:hover {
  transform: translateY(-4px) scale(1.015);
  border-color: color-mix(in srgb, var(--apple-blue, #007AFF) 30%, transparent);
  box-shadow: 0 12px 28px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04);
}
.card-cover {
  width: 100%;
  aspect-ratio: 2/3;
  background: var(--hover-bg, #f0f0f3);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: box-shadow 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-cover img { width: 100%; height: 100%; object-fit: cover; }
.cover-overlay {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.04);
  pointer-events: none;
}
.no-cover-sm { font-size: 28px; color: var(--text-placeholder, #c7c7cc); opacity: 0.5; }

.card-body { padding: 12px 4px 0; }
.card-title-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main, #1d1d1f);
  margin: 0 0 6px;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-author { font-size: 12px; color: var(--text-muted, #888); margin: 0 0 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-publisher { font-size: 12px; color: var(--text-tertiary, #aaa); margin: 0 0 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
/* 星级可视化 */
.card-stars {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: #d4d4d8;
  font-size: 12px;
}
.card-stars .filled { color: #f5a623; }
.stars-num {
  font-size: 12px;
  font-weight: 700;
  color: #f5a623;
  margin-left: 6px;
}

/* 封面评分角标 — 左上 */
.cover-rating-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #f5a623;
  font-size: 12px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  line-height: 1;
  z-index: 2;
  letter-spacing: 0.02em;
}

/* 豆瓣跳转角标 — 右上 */
.cover-douban-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  display: flex;
  z-index: 2;
  transition: all 0.2s ease;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
}
.cover-douban-badge img { width: 100%; height: 100%; object-fit: contain; }
.cover-douban-badge:hover {
  transform: scale(1.15);
  filter: drop-shadow(0 2px 4px rgba(0,181,26,0.4));
}

/* 无评分状态 */
.cover-rating-badge.no-rating {
  color: rgba(255,255,255,0.7);
  font-weight: 400;
  font-size: 11px;
}

:global(.dark) .douban-book-card { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.06); box-shadow: 0 1px 3px rgba(0,0,0,0.15); }
:global(.dark) .douban-book-card:hover { border-color: color-mix(in srgb, var(--apple-blue, #0A84FF) 35%, transparent); box-shadow: 0 12px 28px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.15); }
:global(.dark) .card-cover { box-shadow: 0 2px 8px rgba(0,0,0,0.25); }
:global(.dark) .cover-overlay { box-shadow: inset 0 0 0 1px rgba(255,255,255,0.05); }

/* ================= 详情视图 — 3D 实体书封 ================= */
.detail-view { flex: 1; padding-bottom: 64px; position: relative; z-index: 10; }
.detail-card-wrapper {
  background: var(--card-bg, #fff);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.04), 0 1px 4px rgba(0,0,0,0.02);
  border: 1px solid var(--border-color, rgba(0,0,0,0.04));
}
.detail-card { display: flex; gap: 56px; align-items: flex-start; }

/* ── 左侧封面区 ── */
.detail-cover-section {
  width: 280px;
  flex-shrink: 0;
  perspective: 800px;
}

/* 3D 书体 */
.book-3d {
  position: relative;
  width: 100%;
  aspect-ratio: 2/3;
  transform-style: preserve-3d;
  transform: rotateY(-12deg) rotateX(3deg);
  transition: transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
  animation: bookFloat 5s ease-in-out infinite;
}
.book-3d:hover {
  transform: rotateY(-6deg) rotateX(1deg) scale(1.03);
}
@keyframes bookFloat {
  0%, 100% { transform: rotateY(-12deg) rotateX(3deg) translateY(0); }
  50%      { transform: rotateY(-12deg) rotateX(3deg) translateY(-8px); }
}

/* 书脊 */
.book-spine {
  position: absolute;
  top: 0; bottom: 0; left: 0;
  width: 10px;
  background: linear-gradient(to right,
    #c7c7cc 0%, #e5e5ea 30%, #d1d1d6 60%, #a1a1a6 100%);
  border-radius: 3px 0 0 3px;
  transform: translateX(-8px);
  box-shadow: -2px 0 4px rgba(0,0,0,0.08);
}

/* 封面主体 */
.book-cover-face {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 2px 10px 10px 2px;
  overflow: hidden;
  background: var(--hover-bg, #e8e8ed);
  box-shadow:
    4px 8px 24px rgba(0,0,0,0.18),
    1px 2px 6px rgba(0,0,0,0.08);
}
.book-cover-face img { width: 100%; height: 100%; object-fit: cover; display: block; }
.no-cover { font-size: 56px; color: var(--text-placeholder, #c7c7cc); opacity: 0.25; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }

/* 封面高光扫过 */
.cover-shine {
  position: absolute;
  top: 0; left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.18) 40%,
    rgba(255,255,255,0) 100%);
  pointer-events: none;
  animation: shineSweep 3.5s ease-in-out infinite 1s;
}
@keyframes shineSweep {
  0%, 100% { left: -100%; }
  50%      { left: 120%; }
}

/* 书页厚度 */
.book-pages {
  position: absolute;
  top: 4px; bottom: 4px; right: -4px;
  width: 8px;
  background: repeating-linear-gradient(
    90deg,
    #f0f0f3 0px,
    #e0e0e5 1px,
    #f5f5f7 2px,
    #e8e8ed 3px
  );
  border-radius: 0 8px 8px 0;
  box-shadow: 2px 0 3px rgba(0,0,0,0.04);
}

/* 底部投影 */
.book-shadow {
  position: absolute;
  bottom: -12px;
  left: 10%;
  width: 80%;
  height: 16px;
  background: radial-gradient(ellipse, rgba(0,0,0,0.15) 0%, transparent 70%);
  pointer-events: none;
  animation: shadowPulse 5s ease-in-out infinite;
}
@keyframes shadowPulse {
  0%, 100% { transform: scaleX(0.9); opacity: 0.6; }
  50%      { transform: scaleX(1.05); opacity: 0.85; }
}

/* ── 右侧信息区 ── */
.detail-info-section { flex: 1; min-width: 0; }
.detail-title {
  font-size: 30px;
  font-weight: 800;
  color: var(--text-main, #1d1d1f);
  margin: 0 0 24px;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.detail-meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}
.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 14px;
  background: var(--hover-bg, #f5f5f7);
  border-radius: 10px;
}
.meta-label { font-size: 12px; color: var(--text-secondary, #86868b); font-weight: 500; }
.meta-value { font-size: 14px; color: var(--text-main, #1d1d1f); font-weight: 600; letter-spacing: 0.03em; }
.author-link { color: var(--apple-blue, #007AFF); }

.detail-rating-banner {
  display: inline-flex;
  flex-direction: column;
  padding: 14px 22px;
  background: linear-gradient(135deg, #fffaf0 0%, #fff0d4 100%);
  border: 1px solid #ffe6b3;
  border-radius: 14px;
  margin-bottom: 24px;
}
.rating-score { font-size: 26px; font-weight: 800; color: #f5a623; display: flex; align-items: baseline; gap: 8px; line-height: 1; }
.rating-star-big { font-size: 18px; }
.rating-label { font-size: 12px; color: #d48806; margin-top: 4px; font-weight: 500; }

.detail-summary { margin-bottom: 32px; }
.detail-summary h3 { font-size: 18px; font-weight: 700; color: var(--text-main); margin: 0 0 12px; }
.detail-summary p { font-size: 15px; line-height: 1.75; color: var(--text-secondary, #48484a); }

/* ── 可编辑字段 ── */
.editable {
  cursor: text;
  border-radius: 6px;
  padding: 2px 6px;
  margin: -2px -6px;
  transition: background 0.2s ease;
}
.editable:hover { background: color-mix(in srgb, var(--apple-blue, #007AFF) 6%, transparent); }
.editable-summary {
  cursor: text;
  padding: 8px 12px;
  margin: -8px -12px;
  border-radius: 8px;
  transition: background 0.2s ease;
}
.editable-summary:hover { background: color-mix(in srgb, var(--apple-blue, #007AFF) 4%, transparent); }
.meta-input {
  width: 100%;
  padding: 4px 8px;
  border: 1.5px solid var(--apple-blue, #007AFF);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  background: var(--card-bg, #fff);
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--apple-blue, #007AFF) 12%, transparent);
}
.summary-textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid var(--apple-blue, #007AFF);
  border-radius: 10px;
  font-size: 15px;
  line-height: 1.7;
  color: var(--text-main);
  background: var(--card-bg, #fff);
  outline: none;
  resize: vertical;
  font-family: inherit;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--apple-blue, #007AFF) 12%, transparent);
}

/* ── 操作按钮区 ── */
.detail-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color, rgba(0,0,0,0.06));
}
.large-btn {
  padding: 0 28px;
  height: 46px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0,122,255,0.2);
  transition: all 0.35s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.large-btn:hover { box-shadow: 0 6px 16px rgba(0,122,255,0.3); transform: translateY(-1px); }
.large-btn:active { transform: scale(0.97); }
.large-btn.is-collected { background: #34c759; border-color: #34c759; box-shadow: 0 4px 12px rgba(52,199,89,0.25); }
.large-btn.is-collected:hover { background: #2db84e; box-shadow: 0 6px 16px rgba(52,199,89,0.35); }

/* 豆瓣跳转按钮 */
.douban-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 46px;
  padding: 0 20px;
  border-radius: 12px;
  border: 1px solid var(--border-color, rgba(0,0,0,0.1));
  background: var(--card-bg, #fff);
  color: var(--text-secondary, #555);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.25s ease;
}
.douban-link-btn img { width: 20px; height: 20px; object-fit: contain; flex-shrink: 0; }
.douban-link-btn:hover {
  border-color: #00b51a;
  color: #00b51a;
  background: color-mix(in srgb, #00b51a 4%, var(--card-bg, #fff));
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,181,26,0.12);
}
.douban-link-btn:active { transform: scale(0.97); }

:global(.dark) .detail-card-wrapper { background: rgba(30,30,30,0.6); border-color: rgba(255,255,255,0.05); }
:global(.dark) .book-cover-face { box-shadow: 4px 8px 24px rgba(0,0,0,0.4), 1px 2px 6px rgba(0,0,0,0.2); background: rgba(255,255,255,0.02); }
:global(.dark) .book-spine { background: linear-gradient(to right, #4a4a50 0%, #5a5a62 30%, #4a4a50 60%, #3a3a42 100%); box-shadow: -2px 0 4px rgba(0,0,0,0.2); }
:global(.dark) .book-pages { background: repeating-linear-gradient(90deg, #3a3a42 0px, #2e2e35 1px, #3d3d45 2px, #33333a 3px); }
:global(.dark) .meta-item { background: rgba(255,255,255,0.04); }
:global(.dark) .detail-rating-banner { background: linear-gradient(135deg, rgba(245, 166, 35, 0.1) 0%, rgba(245, 166, 35, 0.05) 100%); border-color: rgba(245, 166, 35, 0.2); }
:global(.dark) .detail-summary p { color: #a1a1aa; }

/* 响应式调整 */
@media (max-width: 768px) {
  .douban-result-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .detail-card { flex-direction: column; gap: 32px; }
  .detail-cover-section { width: 200px; margin: 0 auto; }
  .detail-card-wrapper { padding: 24px; }
  .hero-title { font-size: 32px; }
  .search-hero.is-initial { padding: 4vh 0 2vh; }
  .search-hero-bar { height: 56px; padding: 0 8px 0 16px; }
  .hero-search-btn { padding: 0 20px; font-size: 15px; }
}
</style>

<style>
/* ================================================================
   暗黑模式覆盖（非 scoped，稳定可靠）
   ================================================================ */

/* ── 返回按钮：白底黑字 ── */
.dark .back-btn-outlined {
  background: #ffffff;
  color: #000000;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}
.dark .back-icon { color: #000000; }
.dark .back-btn-outlined:hover {
  background: #e5e5ea;
  box-shadow: 0 6px 16px rgba(255, 255, 255, 0.15);
}
.dark .back-btn-outlined:hover .back-icon { color: #000000; }

/* ── 搜索按钮：白底黑字 ── */
.dark .hero-search-btn {
  background: #ffffff;
  color: #000000;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}
.dark .hero-search-btn:hover:not(:disabled) {
  background: #e5e5ea;
  box-shadow: 0 6px 16px rgba(255, 255, 255, 0.15);
}
.dark .hero-search-btn:disabled {
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.4);
}

/* ── 副标题：灰色文字 ── */
.dark .hero-subtitle {
  color: #98989d;
}

/* ── Hero 标题渐变 ── */
.dark .hero-title {
  background: linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── 搜索栏 ── */
.dark .search-hero-bar {
  background: rgba(30, 30, 30, 0.6);
  border-color: rgba(255,255,255,0.1);
  box-shadow: 0 12px 32px rgba(0,0,0,0.5);
}
.dark .search-hero-bar:focus-within {
  background: rgba(40, 40, 40, 0.85);
  border-color: color-mix(in srgb, var(--apple-blue, #0A84FF) 50%, transparent);
  box-shadow:
      0 20px 48px color-mix(in srgb, var(--apple-blue, #0A84FF) 16%, transparent),
      0 0 0 5px color-mix(in srgb, var(--apple-blue, #0A84FF) 20%, transparent);
}
.dark .search-hero-bar input { color: #f5f5f7; }

/* ── 空状态 ── */
.dark .empty-state-icon.muted::after { background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 60%); }

.dark .empty-state-icon { background: rgba(10, 132, 255, 0.12); box-shadow: 0 12px 32px rgba(10,132,255,0.08), inset 0 1px 0 rgba(255,255,255,0.06); }
.dark .empty-state-icon.muted { background: rgba(255,255,255,0.04); box-shadow: 0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03); }
.dark .empty-ring-ring { border-color: color-mix(in srgb, var(--apple-blue, #0A84FF) 42%, transparent); }
.dark .empty-ring-ring.ring-outer { border-color: color-mix(in srgb, var(--apple-blue, #0A84FF) 30%, transparent); }
.dark .empty-ring-ring.ring-far { border-color: color-mix(in srgb, var(--apple-blue, #0A84FF) 20%, transparent); }
.dark .empty-state-sep { background: color-mix(in srgb, var(--apple-blue, #0A84FF) 25%, transparent); }

/* ── 搜索结果卡片 ── */
.dark .douban-book-card { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.06); box-shadow: 0 1px 3px rgba(0,0,0,0.15); }
.dark .douban-book-card:hover { border-color: color-mix(in srgb, var(--apple-blue, #0A84FF) 35%, transparent); box-shadow: 0 12px 28px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.15); }
.dark .card-cover { box-shadow: 0 2px 8px rgba(0,0,0,0.25); }
.dark .cover-overlay { box-shadow: inset 0 0 0 1px rgba(255,255,255,0.05); }

/* ── 详情卡片 ── */
.dark .detail-card-wrapper { background: rgba(30,30,30,0.6); border-color: rgba(255,255,255,0.05); }
.dark .book-cover-face { box-shadow: 4px 8px 24px rgba(0,0,0,0.4), 1px 2px 6px rgba(0,0,0,0.2); background: rgba(255,255,255,0.02); }
.dark .book-spine { background: linear-gradient(to right, #4a4a50 0%, #5a5a62 30%, #4a4a50 60%, #3a3a42 100%); box-shadow: -2px 0 4px rgba(0,0,0,0.2); }
.dark .book-pages { background: repeating-linear-gradient(90deg, #3a3a42 0px, #2e2e35 1px, #3d3d45 2px, #33333a 3px); }
.dark .meta-item { background: rgba(255,255,255,0.04); }
.dark .detail-rating-banner { background: linear-gradient(135deg, rgba(245, 166, 35, 0.1) 0%, rgba(245, 166, 35, 0.05) 100%); border-color: rgba(245, 166, 35, 0.2); }
.dark .detail-summary p { color: #a1a1aa; }

/* ── 新增元素暗黑适配 ── */
.dark .loading-card { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.06); }
.dark .error-card { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.06); }
.dark .douban-link-btn { border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); color: #a1a1aa; }
.dark .douban-link-btn:hover { border-color: #00b51a; color: #00b51a; background: color-mix(in srgb, #00b51a 10%, rgba(30,30,30,0.8)); }
.dark .cover-rating-badge {
  background: rgba(30,30,30,0.85);
}
</style>