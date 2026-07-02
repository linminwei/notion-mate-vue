<template>
  <div class="neo-page-container">

    <!-- 列表视图 -->
    <template v-if="currentView === 'list'">
      <header class="neo-page-header">
        <div class="capsule-search">
          <div class="search-inputs">
            <input type="text" v-model="searchForm.name" placeholder="作家名" @keyup.enter="handleSearch" />
          </div>
          <div class="search-actions">
            <button class="search-trigger" @click="handleSearch"><font-awesome-icon :icon="['fas', 'search']" /></button>
            <button class="search-trigger reset-btn" @click="handleReset"><font-awesome-icon :icon="['fas', 'redo']" /></button>
          </div>
        </div>
        <div class="header-actions">
          <div class="view-toggle">
            <button :class="['toggle-btn', { active: listViewMode === 'table' }]" @click="listViewMode = 'table'" title="列表视图">
              <font-awesome-icon :icon="['fas', 'list']" />
            </button>
            <button :class="['toggle-btn', { active: listViewMode === 'gallery' }]" @click="listViewMode = 'gallery'" title="画廊视图">
              <font-awesome-icon :icon="['fas', 'th']" />
            </button>
          </div>
          <button class="neo-btn-flat danger" v-if="selectedRowKeys.length > 0" @click="handleBatchDelete">
            <font-awesome-icon :icon="['fas', 'trash']" /> 删除
          </button>
        </div>
      </header>

      <div class="neo-card table-card fade-in">
        <!-- 表格视图 -->
        <div v-if="listViewMode === 'table'" class="neo-table-wrapper">
          <!-- 加载遮罩 -->
          <div v-if="loading" class="neo-table-overlay">
            <TableLoading text="正在加载作家" />
          </div>
          <!-- 空状态 -->
          <div v-else-if="tableData.length === 0" class="data-empty-container fade-in">
            <div class="modern-empty-card">
              <div class="modern-empty-illus">
                <div class="mockup-window">
                  <div class="mockup-header"><div class="mockup-dot"></div><div class="mockup-line short"></div></div>
                  <div class="mockup-row"><div class="mockup-avatar"></div><div class="mockup-line"></div><div class="mockup-line shorter"></div></div>
                  <div class="mockup-row"><div class="mockup-avatar"></div><div class="mockup-line"></div><div class="mockup-line shorter"></div></div>
                </div>
              </div>
              <div class="modern-empty-content">
                <h3 class="modern-empty-title">暂无作家数据</h3>
                <p class="modern-empty-desc">目前还没有任何作家信息<br/>作家会随着书籍入库自动创建</p>
                <button class="modern-empty-btn" @click="goAddBookFromList">
                  <font-awesome-icon :icon="['fas', 'search']" /> 发现好书
                </button>
              </div>
            </div>
          </div>
          <!-- 表格 -->
          <a-table v-else class="neo-table" :columns="columns" :data-source="tableData"
            :pagination="pagination"
            :row-selection="{ selectedRowKeys, onChange: onSelectChange }" row-key="id" @change="handleTableChange">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'authorInfo'">
                <div class="author-info-cell">
                  <div class="author-avatar-wrap">
                    <img v-if="record.avatar" :src="record.avatar" class="author-avatar-img"  alt=""/>
                    <font-awesome-icon v-else :icon="['fas', 'user']" class="author-avatar-placeholder" />
                  </div>
                  <div class="author-text">
                    <span class="author-name" @click.stop="handleViewDetail(record)">{{ record.name || '—' }}</span>
                  </div>
                </div>
              </template>
              <template v-if="column.key === 'summary'">
                <span v-if="record.summary" class="cell-summary">{{ record.summary }}</span>
                <span v-else class="cell-placeholder">—</span>
              </template>
              <template v-if="column.key === 'createTime'">
                <span class="cell-time">{{ record.createTime ? formatDateTime(record.createTime) : '—' }}</span>
              </template>
            </template>
          </a-table>
        </div>

        <!-- 画廊视图 -->
        <div v-if="listViewMode === 'gallery' && tableData.length === 0 && !loading" class="gallery-empty-state">
          <div class="modern-empty-card">
            <div class="modern-empty-illus">
              <div class="mockup-window">
                <div class="mockup-header"><div class="mockup-dot"></div><div class="mockup-line short"></div></div>
                <div class="mockup-row"><div class="mockup-avatar"></div><div class="mockup-line"></div><div class="mockup-line shorter"></div></div>
                <div class="mockup-row"><div class="mockup-avatar"></div><div class="mockup-line"></div><div class="mockup-line shorter"></div></div>
              </div>
            </div>
            <div class="modern-empty-content">
              <h3 class="modern-empty-title">暂无作家数据</h3>
              <p class="modern-empty-desc">目前还没有任何作家信息<br/>作家会随着书籍入库自动创建。</p>
              <button class="modern-empty-btn" @click="goAddBookFromList">
                <font-awesome-icon :icon="['fas', 'search']" /> 发现好书
              </button>
            </div>
          </div>
        </div>
        <div v-else-if="listViewMode === 'gallery'" class="author-gallery">
          <div v-for="author in tableData" :key="author.id" class="gallery-author-card" @click="handleViewDetail(author)">
            <div class="gallery-author-avatar">
              <img v-if="author.avatar" :src="author.avatar" alt="头像" />
              <font-awesome-icon v-else :icon="['fas', 'user']" class="gallery-author-placeholder" />
            </div>
            <h3 class="gallery-author-name">{{ author.name }}</h3>
            <p class="gallery-author-summary" v-if="author.summary">{{ author.summary }}</p>
            <p v-else class="gallery-author-summary empty">暂无简介</p>
          </div>
        </div>
      </div>
    </template>

    <!-- 详情视图 -->
    <template v-if="currentView === 'detail'">
      <div class="detail-header">
        <button class="back-btn-outlined" @click="backToList">
          <font-awesome-icon :icon="['fas', 'chevron-left']" class="back-icon" /> 返回列表
        </button>
        <button class="neo-btn-solid primary save-btn" @click="handleSaveDetail" :disabled="saving">
          <font-awesome-icon :icon="['fas', 'save']" /> {{ saving ? '保存中' : '保存修改' }}
        </button>
      </div>
      <div v-if="detailLoading" class="loading-state fade-in">
        <div class="loading-card">
          <div class="loading-spinner"><div class="spinner-ring"></div></div>
          <p class="loading-text">正在拉取作家详情</p>
          <div class="loading-ellipsis"><span></span><span></span><span></span></div>
        </div>
      </div>
      <div v-else-if="authorDetail" class="author-detail-card fade-in-up">
        <div class="detail-author-header">
          <div class="detail-author-avatar" @click="triggerAvatarUpload" title="点击更换头像">
            <img v-if="authorDetail.avatar" :src="authorDetail.avatar" alt="头像" />
            <font-awesome-icon v-else :icon="['fas', 'user']" class="detail-avatar-placeholder" />
            <div class="avatar-upload-overlay"><font-awesome-icon :icon="['fas', 'camera']" /></div>
            <input type="file" ref="avatarInput" accept="image/*" style="display:none" @change="onAvatarChange" />
          </div>
          <div class="detail-author-right">
            <div class="detail-author-name-row">
              <input v-if="editing === 'name'" v-model="editName" class="detail-name-input" @blur="saveEdit('name')" @keyup.enter="saveEdit('name')" ref="nameInput" />
              <h1 v-else class="detail-author-name editable" @click="startEdit('name')">{{ authorDetail.name || '点击添加姓名' }}</h1>
            </div>
            <div class="detail-author-desc">
              <textarea v-if="editing === 'summary'" v-model="editSummary" class="detail-summary-textarea" @blur="saveEdit('summary')" @input="autoResize" ref="summaryInput" rows="3" />
              <p v-else-if="authorDetail.summary" class="detail-author-summary editable" @click="startEdit('summary')">{{ authorDetail.summary }}</p>
              <p v-else class="detail-author-summary editable empty" @click="startEdit('summary')">添加简介</p>
            </div>
          </div>
        </div>

        <div class="detail-books-section" v-if="authorDetail.books && authorDetail.books.length">
          <div class="detail-books-header">
            <h3 class="detail-section-title">
              作品列表
              <span class="section-count">{{ authorDetail.books.length }}</span>
            </h3>
            <button class="neo-btn-flat danger" v-if="selectedBookIds.length > 0" @click="handleBatchRemoveBooks">
              <font-awesome-icon :icon="['fas', 'trash']" /> 批量移除（{{ selectedBookIds.length }}）
            </button>
          </div>
          <div class="detail-books-grid">
            <div v-for="book in authorDetail.books" :key="book.id" class="detail-book-card" :class="{ selected: selectedBookIds.includes(book.id) }" @click="toggleBookSelect(book.id)">
              <div class="detail-book-check" v-if="selectedBookIds.length > 0">
                <font-awesome-icon :icon="[selectedBookIds.includes(book.id) ? 'fas' : 'far', 'check-circle']" />
              </div>
              <div class="detail-book-cover">
                <img v-if="book.cover" :src="book.cover" alt="封面" />
                <div v-else class="detail-book-no-cover"><font-awesome-icon :icon="['fas', 'book']" /></div>
                <div class="detail-cover-gradient"></div>
                <span class="detail-cover-rating" v-if="book.rating"><font-awesome-icon :icon="['fas', 'star']" /> {{ (book.rating || 0).toFixed(1) }}</span>
                <span class="detail-cover-category" v-if="book.category">{{ categoryLabel(book.category) }}</span>
                <span class="detail-cover-isbn" v-if="book.isbn">{{ book.isbn }}</span>
              </div>
              <div class="detail-book-body">
                <span class="detail-book-title">{{ book.title }}</span>
                <span class="detail-book-meta" v-if="book.publisher">{{ book.publisher }}<span v-if="book.pubDate"> / {{ (book.pubDate || '').substring(0, 10) }}</span></span>
                <div class="detail-book-divider" v-if="book.summary"></div>
                <p class="detail-book-summary" v-if="book.summary">{{ book.summary }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="detail-no-books">
          <div class="no-books-glass-card">
            <div class="no-books-illus">
              <div class="nb-layer nb-l1"></div>
              <div class="nb-layer nb-l2"></div>
              <div class="nb-layer nb-l3"></div>
              <div class="nb-icon-wrap">
                <div class="nb-icon-shape"></div>
                <font-awesome-icon :icon="['fas', 'book-open']" class="nb-icon" />
              </div>
            </div>
            <h3 class="no-books-title">暂无作品</h3>
            <p class="no-books-desc">该作家还没有关联任何作品，去发现好书搜索并添加吧。</p>
            <button class="no-books-btn" @click="goAddBook">
              <font-awesome-icon :icon="['fas', 'search']" /> 去发现好书
            </button>
          </div>
        </div>
      </div>
      <div v-else class="error-state fade-in"><p>加载失败，请返回重试</p></div>
    </template>

  </div>
</template>

<script setup lang="ts">
import {nextTick, onMounted, reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {detailBookAuthor, pageBookAuthor, updateBookAuthor, deleteBookAuthor} from '@/api/bookAuthor.ts'
import {deleteBook} from '@/api/book.ts'
import {uploadNotionFile} from '@/api/notion.ts'
import {getDictDataByDictCodeEnable} from '@/api/dict.ts'
import type {BookAuthorDetailVo, BookAuthorPageVo, DictData} from '@/types'
import {AppleAlert} from '@/components/common/AppleAlert.ts'
import TableLoading from '@/components/common/TableLoading.vue'

const columns = [
  { title: '作家信息', key: 'authorInfo', width: 200 },
  { title: '简介', dataIndex: 'summary', key: 'summary' },
  { title: '入库时间', key: 'createTime', width: 180 },
]

const currentView = ref<'list' | 'detail'>('list')
const listViewMode = ref<'table' | 'gallery'>('table')
const loading = ref(false)
const tableData = ref<BookAuthorPageVo[]>([])
const selectedRowKeys = ref<string[]>([])
const searchForm = reactive({ name: '', pageNum: 1, pageSize: 10 })
const pagination = reactive({ current: 1, pageSize: 10, total: 0, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '50'], showTotal: (total: number) => `共 ${total} 条` })

const fetchData = async () => {
  loading.value = true
  try { const res = await pageBookAuthor(searchForm); tableData.value = res.data.list; pagination.total = res.data.total; pagination.current = res.data.pageNum }
  catch (error: any) { AppleAlert.error('数据加载失败', error.message || '无法获取作家列表') }
  finally { loading.value = false }
}
const handleSearch = () => { searchForm.pageNum = 1; pagination.current = 1; fetchData() }
const handleReset = () => { searchForm.name = ''; searchForm.pageNum = 1; pagination.current = 1; selectedRowKeys.value = []; fetchData() }
const handleTableChange = (pag: any) => { searchForm.pageNum = pag.current; searchForm.pageSize = pag.pageSize; pagination.current = pag.current; pagination.pageSize = pag.pageSize; fetchData() }
const onSelectChange = (keys: string[]) => { selectedRowKeys.value = keys }

const handleBatchDelete = async () => {
  if (selectedRowKeys.value.length === 0) return
  try {
    await deleteBookAuthor(selectedRowKeys.value)
    AppleAlert.success('删除成功', `已删除 ${selectedRowKeys.value.length} 位作家`)
    selectedRowKeys.value = []
    fetchData()
  } catch (error: any) { AppleAlert.error('删除失败', error.message || '请稍后重试') }
}

const formatDateTime = (d: string) => {
  if (!d) return ''
  const date = new Date(d)
  if (isNaN(date.getTime())) return d
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const detailLoading = ref(false)
const authorDetail = ref<BookAuthorDetailVo | null>(null)
const selectedBookIds = ref<string[]>([])
const handleViewDetail = async (record: BookAuthorPageVo) => {
  detailLoading.value = true; authorDetail.value = null; currentView.value = 'detail'
  try { const res = await detailBookAuthor(record.id); authorDetail.value = res.data }
  catch (error: any) { AppleAlert.error('获取详情失败', error.message || '请稍后重试') }
  finally { detailLoading.value = false }
}
const backToList = () => { currentView.value = 'list'; fetchData() }

const router = useRouter()
const goAddBook = () => {
  const name = authorDetail.value?.name || ''
  router.push({ path: '/book/library', query: { q: name } })
}
const goAddBookFromList = () => {
  const keyword = searchForm.name?.trim() || ''
  router.push({ path: '/book/library', query: { view: 'search', ...(keyword ? { q: keyword } : {}) } })
}

// 详情编辑
const saving = ref(false)
const editing = ref('')
const editName = ref('')
const editSummary = ref('')
const avatarInput = ref<HTMLInputElement | null>(null)
const avatarFileName = ref('avatar.png')
const nameInput = ref<HTMLInputElement | null>(null)
const summaryInput = ref<HTMLTextAreaElement | null>(null)

const startEdit = (field: string) => {
  editing.value = field
  if (field === 'name') { editName.value = authorDetail.value?.name || ''; nextTick(() => nameInput.value?.focus()) }
  if (field === 'summary') { editSummary.value = authorDetail.value?.summary || ''; nextTick(() => { summaryInput.value?.focus(); if (summaryInput.value) autoResize({ target: summaryInput.value }) }) }
}

const saveEdit = (field: string) => {
  if (!authorDetail.value) return
  if (field === 'name') authorDetail.value.name = editName.value || authorDetail.value.name
  if (field === 'summary') authorDetail.value.summary = editSummary.value
  editing.value = ''
}

const autoResize = (e: Event | { target: HTMLTextAreaElement }) => {
  const el = (e as any).target as HTMLTextAreaElement
  el.style.height = 'auto'
  el.style.height = Math.max(60, el.scrollHeight) + 'px'
}
const triggerAvatarUpload = () => avatarInput.value?.click()
const onAvatarChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file || !authorDetail.value) return
  avatarFileName.value = file.name
  const reader = new FileReader()
  reader.onload = () => { if (authorDetail.value) authorDetail.value.avatar = reader.result as string }
  reader.readAsDataURL(file)
}

const handleSaveDetail = async () => {
  if (!authorDetail.value) return
  saving.value = true
  try {
    // 更新姓名和简介（本地编辑已自动同步到 authorDetail）
    if (editName.value) authorDetail.value.name = editName.value
    if (editSummary.value) authorDetail.value.summary = editSummary.value
    editing.value = ''

    // 头像有改动则上传
    let avatarFileId: string | undefined
    const avatar = authorDetail.value.avatar
    if (avatar && avatar.startsWith('data:')) {
      try {
        avatarFileId = await new Promise<string>((resolve, reject) => {
          const file = dataURLtoFile(avatar, avatarFileName.value)
          uploadNotionFile(authorDetail.value!.workspaceId, file, {
            onComplete(e) { resolve(e.fileId) },
            onError(e) { reject(new Error(e.message || '上传失败')) },
          })
        })
        authorDetail.value.avatar = avatar // keep display, backend will update
      } catch (e: any) {
        AppleAlert.error('头像上传失败', e.message)
        saving.value = false
        return
      }
    }

    await updateBookAuthor({
      id: authorDetail.value.id,
      name: authorDetail.value.name,
      summary: authorDetail.value.summary || undefined,
      avatar: avatarFileId || undefined,
    })
    AppleAlert.success('保存成功', '作家信息已更新')
    backToList()
  } catch (error: any) {
    AppleAlert.error('保存失败', error.message || '请稍后重试')
  } finally {
    saving.value = false
  }
}

const dataURLtoFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(',')
  if (arr.length < 2) throw new Error('Invalid data URL')
  const mimeMatch = arr[0].match(/:(.*?);/)
  if (!mimeMatch) throw new Error('Invalid MIME type')
  const mime = mimeMatch[1]
  const bstr = atob(arr[1]); let n = bstr.length; const u8arr = new Uint8Array(n)
  while (n--) u8arr[n] = bstr.charCodeAt(n)
  return new File([u8arr], filename, { type: mime })
}

const handleRemoveBook = async (bookId: string) => {
  if (!authorDetail.value) return
  try {
    await deleteBook([bookId])
    authorDetail.value.books = authorDetail.value.books?.filter(b => b.id !== bookId) || []
    selectedBookIds.value = selectedBookIds.value.filter(id => id !== bookId)
    AppleAlert.success('已移除', '作品已从该作家移除')
  } catch (error: any) {
    AppleAlert.error('移除失败', error.message || '请稍后重试')
  }
}

const toggleBookSelect = (id: string) => {
  const idx = selectedBookIds.value.indexOf(id)
  if (idx >= 0) selectedBookIds.value.splice(idx, 1)
  else selectedBookIds.value.push(id)
}

const handleBatchRemoveBooks = async () => {
  if (!authorDetail.value || selectedBookIds.value.length === 0) return
  try {
    await deleteBook(selectedBookIds.value)
    AppleAlert.success('已移除', `成功移除 ${selectedBookIds.value.length} 部作品`)
    authorDetail.value.books = authorDetail.value.books?.filter(b => !selectedBookIds.value.includes(b.id)) || []
    selectedBookIds.value = []
  } catch (error: any) {
    AppleAlert.error('移除失败', error.message || '请稍后重试')
  }
}

const categoryDict = ref<DictData[]>([])
const fetchCategoryDict = async () => {
  try { const res = await getDictDataByDictCodeEnable('book_category'); categoryDict.value = res.data || [] }
  catch { categoryDict.value = [] }
}
const categoryLabel = (value: string) => categoryDict.value.find(d => d.dictValue === value)?.dictLabel || value

onMounted(() => { fetchData(); fetchCategoryDict() })
</script>

<style scoped>
/* 搜索栏 */
.neo-page-header { display: flex; align-items: center; justify-content: space-between; padding: 0 0 12px; gap: 16px; }
.capsule-search { display: flex; min-width: 300px; background: var(--card-bg, #f5f5f7); border-radius: 14px; padding: 4px; border: 1px solid var(--border-color); transition: all 0.3s; align-items: center; }
.capsule-search:focus-within { background: var(--card-bg, #ffffff); border-color: var(--apple-blue, #0A84FF); box-shadow: 0 0 0 4px color-mix(in srgb, var(--apple-blue, #0A84FF) 10%, transparent); }
.search-inputs { flex: 1; display: flex; align-items: center; padding: 0 4px; height: 26px; }
.search-inputs input { flex: 1; min-width: 0; width: 0; border: none; background: transparent; font-size: 13px; color: var(--text-main); outline: none; padding: 0 8px; height: 26px; line-height: 26px; }
.search-inputs input::placeholder { color: var(--text-muted, #a1a1aa); }
.search-actions { display: flex; gap: 4px; margin-left: 8px; }
.search-trigger { width: 32px; height: 32px; border: none; border-radius: 10px; background: var(--apple-blue, #0A84FF); color: #ffffff; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
.search-trigger:hover { filter: brightness(0.9); transform: scale(0.95); }
.search-trigger.reset-btn { background: var(--hover-bg, #e5e5ea); color: var(--text-main, #333); }
.search-trigger.reset-btn:hover { background: var(--active-bg, rgba(0,0,0,0.1)); transform: scale(0.95); }

/* 表格 */
:deep(.neo-table .ant-table-tbody > tr > td) { font-size: 13px; font-weight: 400; color: var(--text-main, #1d1d1f); font-family: inherit; }
.author-info-cell { display: flex; align-items: center; gap: 14px; }
.author-avatar-wrap { width: 44px; height: 44px; border-radius: 14px; overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--hover-bg, #e8e8ed), var(--border-color, #ddd)); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.author-avatar-img { width: 100%; height: 100%; object-fit: cover; }
.author-avatar-placeholder { font-size: 20px; color: var(--text-muted, #b0b0b8); }
.author-text { display: flex; flex-direction: column; gap: 2px; }
.author-name { font-size: 14px; font-weight: 600; color: var(--text-main); cursor: pointer; transition: color 0.15s; }
.author-name:hover { color: var(--apple-blue, #007AFF); }
.cell-summary { display: block; line-height: 1.5; color: var(--text-secondary, #666); font-size: 13px; white-space: normal; word-break: break-word; }
.cell-placeholder { color: var(--text-muted, #a1a1aa); font-size: 13px; }
.cell-time { font-size: 13px; color: var(--text-secondary, #666); white-space: nowrap; }

/* 表格空状态：与字典项完全一致的现代插画卡片 */
.data-empty-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 32px 0;
}
.modern-empty-card {
  width: 100%;
  max-width: 380px;
  background: var(--card-bg, #ffffff);
  border: 1px solid var(--border-color, rgba(0,0,0,0.05));
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}
.modern-empty-illus {
  width: 100%;
  height: 140px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--apple-blue) 40%, transparent), color-mix(in srgb, var(--apple-blue) 5%, transparent));
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 0 40px;
  box-sizing: border-box;
}
.mockup-window {
  width: 100%;
  height: 100px;
  background: var(--content-bg);
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -4px 24px rgba(0,0,0,0.08);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: relative;
  z-index: 2;
}
.mockup-header { display: flex; align-items: center; gap: 8px; }
.mockup-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--border-color); }
.mockup-line { height: 6px; border-radius: 3px; background: var(--hover-bg); flex: 1; }
.mockup-line.short { width: 60%; flex: none; }
.mockup-line.shorter { width: 40%; flex: none; }
.mockup-row { display: flex; align-items: center; gap: 10px; }
.mockup-avatar { width: 18px; height: 18px; border-radius: 50%; background: var(--hover-bg); }
.modern-empty-content {
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.modern-empty-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0 0 12px 0;
  letter-spacing: -0.3px;
}
.modern-empty-desc {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.6;
}

/* 视图切换 */
.view-toggle { display: flex; gap: 4px; margin-right: 8px; }
.toggle-btn { width: 34px; height: 34px; border: 1.5px solid var(--border-color, rgba(0,0,0,0.1)); border-radius: 10px; background: var(--card-bg, #fff); color: var(--text-muted, #999); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; transition: all 0.2s; }
.toggle-btn:hover { border-color: var(--apple-blue, #007AFF); color: var(--apple-blue, #007AFF); }
.toggle-btn.active { background: var(--apple-blue, #007AFF); border-color: var(--apple-blue, #007AFF); color: #fff; box-shadow: 0 2px 8px rgba(0,122,255,0.2); }

/* 画廊 */
.author-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; padding: 8px 0; }
.gallery-author-card {
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-radius: 22px; padding: 34px 24px 30px; text-align: center; cursor: pointer;
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: 0 2px 16px rgba(0,0,0,0.05), 0 0 0 0.5px rgba(0,0,0,0.03);
  transition: all 0.4s cubic-bezier(0.2, 0.9, 0.3, 1);
}
.gallery-author-card:hover {
  transform: translateY(-8px);
  background: rgba(255,255,255,0.95);
  border-color: rgba(0,0,0,0.1);
  box-shadow: 0 20px 50px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.03);
}
.gallery-author-avatar {
  width: 84px; height: 84px; border-radius: 24px; overflow: hidden; margin: 0 auto 20px;
  background: linear-gradient(145deg, #e8e8ed 0%, #dcdce0 50%, #d0d0d5 100%);
  box-shadow: 0 6px 20px rgba(0,0,0,0.12), 0 0 0 5px rgba(255,255,255,0.9), inset 0 1px 0 rgba(255,255,255,0.6);
  display: flex; align-items: center; justify-content: center;
  transition: all 0.4s ease;
}
.gallery-author-card:hover .gallery-author-avatar {
  transform: scale(1.05);
  box-shadow: 0 8px 28px rgba(0,0,0,0.18), 0 0 0 5px rgba(255,255,255,0.95);
}
.gallery-author-avatar img { width: 100%; height: 100%; object-fit: cover; }
.gallery-author-placeholder { font-size: 38px; color: var(--text-muted, #b0b0b8); }
.gallery-author-name { font-size: 17px; font-weight: 650; color: var(--text-main, #1d1d1f); margin: 0 0 8px; letter-spacing: -0.01em; }
.gallery-author-summary { font-size: 13px; color: var(--text-secondary, #86868b); line-height: 1.6; margin: 0; word-break: break-word; }
.gallery-author-summary.empty { color: var(--text-muted, #b0b0b8); font-style: italic; font-weight: 400; }

/* 画廊空状态 */
.gallery-empty-state { display: flex; align-items: center; justify-content: center; min-height: 300px; padding: 40px 0; }

/* 详情视图 */
.detail-header { display: flex; align-items: center; justify-content: space-between; padding: 0 0 20px; }
.back-btn-outlined { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px 8px 12px; border: 1px solid transparent; border-radius: 40px; background: #000000; color: #ffffff; font-size: 14px; font-weight: 500; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }
.back-btn-outlined:hover { background: #333333; box-shadow: 0 6px 16px rgba(0,0,0,0.2); transform: translateY(-1px); }
.back-icon { font-size: 13px; color: #ffffff; }
.save-btn { padding: 0 20px; height: 40px; border-radius: 12px; font-size: 14px; }
.author-detail-card { background: var(--card-bg, #fff); border-radius: 24px; padding: 40px; box-shadow: 0 8px 32px rgba(0,0,0,0.04); border: 1px solid var(--border-color, rgba(0,0,0,0.04)); }
.detail-author-header { display: flex; align-items: flex-start; gap: 24px; margin-bottom: 36px; padding-bottom: 28px; border-bottom: 1px solid var(--border-color, rgba(0,0,0,0.06)); }
.detail-author-right { flex: 1; min-width: 0; }
.detail-author-name-row { height: 44px; display: flex; align-items: center; margin-top: 22px; }
.detail-author-avatar { width: 88px; height: 88px; border-radius: 22px; overflow: hidden; flex-shrink: 0; cursor: pointer; position: relative; background: linear-gradient(135deg, var(--hover-bg, #e8e8ed), var(--border-color, #ddd)); box-shadow: 0 4px 16px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; }
.detail-author-avatar img { width: 100%; height: 100%; object-fit: cover; }
.avatar-upload-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 22px; opacity: 0; transition: opacity 0.2s; border-radius: 22px; }
.detail-author-avatar:hover .avatar-upload-overlay { opacity: 1; }
.detail-avatar-placeholder { font-size: 40px; color: var(--text-muted, #b0b0b8); }
.detail-author-info { flex: 1; min-width: 0; }
.detail-author-name { font-size: 28px; font-weight: 800; color: var(--text-main); margin: 0; letter-spacing: -0.02em; line-height: 1.2; }
.detail-author-name.editable { cursor: text; border-radius: 8px; padding: 4px 10px; margin: -4px -10px; transition: background 0.15s; }
.detail-author-name.editable:hover { background: color-mix(in srgb, var(--apple-blue, #007AFF) 4%, transparent); }
.detail-name-input { font-size: 28px; font-weight: 800; color: var(--text-main); letter-spacing: -0.02em; border: 2px solid var(--apple-blue, #007AFF); border-radius: 10px; padding: 2px 10px; background: var(--card-bg, #fff); outline: none; flex: 1; min-width: 0; font-family: inherit; box-shadow: 0 0 0 4px color-mix(in srgb, var(--apple-blue, #007AFF) 10%, transparent); }
.detail-author-desc { margin-top: 0; }
.detail-author-summary { font-size: 15px; line-height: 1.7; color: var(--text-secondary, #555); margin: 4px 0 0; }
.detail-author-summary.editable { cursor: text; border-radius: 8px; padding: 6px 10px; margin: -6px -10px; transition: background 0.15s; }
.detail-author-summary.editable:hover { background: color-mix(in srgb, var(--apple-blue, #007AFF) 4%, transparent); }
.detail-author-summary.empty { color: var(--text-muted, #b0b0b8); font-style: italic; font-size: 14px; }
.detail-summary-textarea { width: 100%; border: 1.5px solid var(--apple-blue, #007AFF); border-radius: 8px; padding: 8px 12px; font-size: 14px; line-height: 1.6; color: var(--text-main); background: var(--card-bg, #fff); outline: none; resize: none; overflow: hidden; font-family: inherit; margin-top: 4px; }
.detail-section-title { font-size: 18px; font-weight: 700; color: var(--text-main); margin: 0; display: flex; align-items: center; gap: 8px; }
.section-icon { color: var(--apple-blue, #007AFF); font-size: 16px; }
.section-count { display: inline-flex; align-items: center; justify-content: center; min-width: 24px; height: 22px; padding: 0 8px; border-radius: 11px; background: rgba(0,0,0,0.06); color: var(--text-secondary, #86868b); font-size: 12px; font-weight: 600; letter-spacing: 0.02em; }
:global(.dark) .section-count { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); }
.detail-books-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.detail-books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }
.detail-book-card { background: var(--hover-bg, #f5f5f7); border-radius: 14px; overflow: hidden; border: 1px solid var(--border-color, rgba(0,0,0,0.04)); transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; cursor: pointer; position: relative; }
.detail-book-card.selected { border-color: var(--apple-blue, #007AFF); box-shadow: 0 0 0 2px color-mix(in srgb, var(--apple-blue, #007AFF) 15%, transparent); }
.detail-book-card:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.06); }
.detail-book-check { position: absolute; top: 8px; right: 8px; z-index: 2; font-size: 20px; color: color-mix(in srgb, var(--apple-blue, #007AFF) 60%, transparent); }
.detail-book-card.selected .detail-book-check { color: var(--apple-blue, #007AFF); }
.detail-book-cover { width: 100%; aspect-ratio: 2/3; background: var(--card-bg, #e8e8ed); display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; }
.detail-book-cover img { width: 100%; height: 100%; object-fit: cover; }
.detail-cover-gradient { position: absolute; bottom: 0; left: 0; right: 0; height: 45%; background: linear-gradient(to top, rgba(0,0,0,0.5), transparent); pointer-events: none; z-index: 1; }
.detail-cover-rating { position: absolute; top: 6px; left: 6px; z-index: 2; display: inline-flex; align-items: center; gap: 3px; padding: 2px 7px; border-radius: 6px; background: rgba(0,0,0,0.55); backdrop-filter: blur(6px); color: #f5a623; font-size: 10px; font-weight: 700; }
.detail-cover-category { position: absolute; bottom: 6px; left: 6px; z-index: 2; font-size: 9px; font-weight: 600; color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.12); backdrop-filter: blur(4px); padding: 2px 7px; border-radius: 4px; letter-spacing: 0.02em; }
.detail-cover-isbn { position: absolute; bottom: 6px; right: 6px; z-index: 2; font-size: 9px; font-weight: 500; color: rgba(255,255,255,0.6); background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); padding: 2px 6px; border-radius: 4px; letter-spacing: 0.03em; max-width: calc(100% - 14px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.detail-book-cover img { width: 100%; height: 100%; object-fit: cover; }
.detail-book-no-cover { font-size: 32px; color: var(--text-placeholder, #c7c7cc); opacity: 0.4; }
.detail-book-body { padding: 14px; display: flex; flex-direction: column; gap: 4px; }
.detail-book-title { font-size: 13px; font-weight: 600; color: var(--text-main); line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.detail-book-meta { font-size: 11px; color: var(--text-tertiary, #aaa); }
.detail-book-divider { height: 1px; background: var(--border-color, rgba(0,0,0,0.06)); margin: 2px 0; }
.detail-book-summary { font-size: 11px; color: var(--text-tertiary, #999); line-height: 1.45; margin: 0; }
.book-remove-btn { margin-top: 2px; padding: 3px 10px; border: 1px solid rgba(255,59,48,0.2); border-radius: 6px; background: transparent; color: var(--apple-red, #ff3b30); font-size: 11px; cursor: pointer; transition: all 0.15s; align-self: flex-start; }
.book-remove-btn:hover { background: rgba(255,59,48,0.08); border-color: rgba(255,59,48,0.4); }
.detail-no-books { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; }

/* 液态玻璃卡片 */
.no-books-glass-card {
  display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: 48px 40px 36px;
  background: rgba(255,255,255,0.55);
  backdrop-filter: blur(32px) saturate(200%); -webkit-backdrop-filter: blur(32px) saturate(200%);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 28px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.03), inset 0 0.5px 0 rgba(255,255,255,0.5);
}
/* 层叠几何插图 */
.no-books-illus { position: relative; width: 160px; height: 160px; margin-bottom: 40px; }
.nb-layer { position: absolute; border-radius: 50%; border: 1px solid color-mix(in srgb, var(--apple-blue, #007AFF) 8%, transparent); }
.nb-l1 { width: 140px; height: 140px; top: 10px; left: 10px; background: radial-gradient(circle at 40% 50%, color-mix(in srgb, var(--apple-blue, #007AFF) 10%, transparent) 0%, transparent 70%); }
.nb-l2 { width: 100px; height: 100px; top: 0; left: 0; background: radial-gradient(circle at 60% 40%, color-mix(in srgb, var(--apple-blue, #007AFF) 8%, transparent) 0%, transparent 65%); border-color: color-mix(in srgb, var(--apple-blue, #007AFF) 6%, transparent); }
.nb-l3 { width: 72px; height: 72px; top: 60px; left: 68px; background: radial-gradient(circle at 30% 60%, color-mix(in srgb, var(--apple-blue, #007AFF) 12%, transparent) 0%, transparent 60%); border-color: color-mix(in srgb, var(--apple-blue, #007AFF) 10%, transparent); }
.nb-icon-wrap { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 2; }
.nb-icon-shape { width: 68px; height: 68px; border-radius: 20px; background: linear-gradient(145deg, color-mix(in srgb, var(--apple-blue, #007AFF) 18%, transparent), color-mix(in srgb, var(--apple-blue, #007AFF) 4%, transparent)); box-shadow: 0 8px 32px color-mix(in srgb, var(--apple-blue, #007AFF) 12%, transparent), 0 2px 8px rgba(0,0,0,0.04); position: absolute; }
.nb-icon { font-size: 32px; color: var(--apple-blue, #007AFF); z-index: 3; position: relative; }
.no-books-title { font-size: 20px; font-weight: 660; color: var(--text-main); margin: 0 0 6px; letter-spacing: -0.025em; }
.no-books-desc { font-size: 13px; font-weight: 420; color: var(--text-muted, #8e8e93); margin: 0 0 28px; line-height: 1.5; max-width: 320px; white-space: nowrap; }

/* 按钮 */
.no-books-btn {
  height: 40px; padding: 0 22px; border-radius: 20px;
  background: var(--apple-blue, #007AFF); color: #fff;
  font-size: 14px; font-weight: 590; border: none; cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
  box-shadow: 0 4px 16px color-mix(in srgb, var(--apple-blue, #007AFF) 30%, transparent);
  transition: all 0.2s ease;
}
.no-books-btn:hover { transform: scale(0.97); box-shadow: 0 6px 20px color-mix(in srgb, var(--apple-blue, #007AFF) 40%, transparent); }

.dark .detail-no-books { background: transparent; }
.dark .nb-layer { border-color: rgba(255,255,255,0.04); }
.dark .nb-l1 { background: radial-gradient(circle at 40% 50%, rgba(255,255,255,0.03) 0%, transparent 70%); }
.dark .nb-l2 { background: radial-gradient(circle at 60% 40%, rgba(255,255,255,0.02) 0%, transparent 65%); border-color: rgba(255,255,255,0.03); }
.dark .nb-l3 { background: radial-gradient(circle at 30% 60%, rgba(255,255,255,0.04) 0%, transparent 60%); border-color: rgba(255,255,255,0.05); }
.dark .nb-icon-shape { box-shadow: 0 8px 32px color-mix(in srgb, var(--apple-blue, #0A84FF) 20%, transparent), 0 2px 8px rgba(0,0,0,0.2); }
.dark .no-books-glass-card { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.06); box-shadow: 0 2px 16px rgba(0,0,0,0.3), inset 0 0.5px 0 rgba(255,255,255,0.03); }
.dark .no-books-glass-card .no-books-title { color: #f5f5f7; }

.loading-state { display: flex; flex-direction: column; align-items: center; padding: 60px 0; }
.loading-card { display: inline-flex; flex-direction: column; align-items: center; padding: 40px 48px; background: var(--card-bg, #fff); border-radius: 18px; border: 1px solid var(--border-color, rgba(0,0,0,0.06)); box-shadow: 0 2px 12px rgba(0,0,0,0.03); }
.loading-spinner { width: 40px; height: 40px; margin-bottom: 20px; position: relative; }
.spinner-ring { width: 100%; height: 100%; border-radius: 50%; border: 3px solid var(--border-color, rgba(0,0,0,0.08)); border-top-color: var(--apple-blue, #007AFF); border-right-color: color-mix(in srgb, var(--apple-blue, #007AFF) 40%, transparent); animation: spinnerSpin 0.9s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
@keyframes spinnerSpin { to { transform: rotate(360deg); } }
.loading-text { font-size: 15px; font-weight: 500; color: var(--text-secondary, #666); margin: 0 0 14px; letter-spacing: 0.01em; }
.loading-ellipsis { display: flex; gap: 5px; }
.loading-ellipsis span { width: 5px; height: 5px; border-radius: 50%; background: var(--text-muted, #b0b0b8); animation: ellipsisBreathe 1.4s ease-in-out infinite both; }
.loading-ellipsis span:nth-child(2) { animation-delay: 0.2s; }
.loading-ellipsis span:nth-child(3) { animation-delay: 0.4s; }
@keyframes ellipsisBreathe { 0%, 80%, 100% { opacity: 0.25; transform: scale(0.7); } 40% { opacity: 1; transform: scale(1); } }
.error-state { text-align: center; padding: 60px 0; color: var(--text-muted, #b0b0b8); }

.fade-in { animation: fadeIn 0.3s ease; }
.fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

:global(.dark) .author-detail-card { background: rgba(30,30,30,0.6); border-color: rgba(255,255,255,0.05); }
:global(.dark) .back-btn-outlined { background: #ffffff; color: #000000; }
:global(.dark) .back-icon { color: #000000; }
:global(.dark) .back-btn-outlined:hover { background: #e5e5ea; }
:global(.dark) .detail-author-name { color: #f5f5f7; }
:global(.dark) .detail-author-summary { color: rgba(255,255,255,0.9); }
:global(.dark) .detail-author-summary.empty { color: rgba(255,255,255,0.35); }
:global(.dark) .detail-summary-textarea { background: #222; color: #f5f5f7; border-color: rgba(255,255,255,0.15); }
:global(.dark) .detail-name-input { background: #222; color: #f5f5f7; }
</style>

<style>
.dark .gallery-author-card { background: rgba(40,40,42,0.8) !important; border-color: rgba(255,255,255,0.06); box-shadow: 0 4px 20px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(255,255,255,0.04); }
.dark .gallery-author-card:hover { background: rgba(50,50,54,0.9) !important; border-color: rgba(255,255,255,0.12); box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
.dark .gallery-author-avatar { background: linear-gradient(145deg, #3e3e42 0%, #343438 50%, #2a2a2e 100%); box-shadow: 0 6px 20px rgba(0,0,0,0.4), 0 0 0 5px rgba(40,40,42,0.9), inset 0 1px 0 rgba(255,255,255,0.08); }
.dark .gallery-author-name { color: #f5f5f7; }
.dark .gallery-author-summary { color: rgba(255,255,255,0.7); }
.dark .gallery-author-summary.empty { color: rgba(255,255,255,0.3); }

.dark .author-detail-card { background: rgba(30,30,30,0.6); border-color: rgba(255,255,255,0.05); }
.dark .detail-author-name { color: #f5f5f7; }
.dark .detail-author-summary { color: rgba(255,255,255,0.9); }
.dark .detail-author-summary.empty { color: rgba(255,255,255,0.35); }
.dark .detail-summary-textarea { background: #222; color: #f5f5f7; border-color: rgba(255,255,255,0.15); }
.dark .detail-name-input { background: #222; color: #f5f5f7; }
.dark .back-btn-outlined { background: #ffffff; color: #000000; }
.dark .back-icon { color: #000000; }
.dark .back-btn-outlined:hover { background: #e5e5ea; }
.dark .table-empty-state .empty-icon-circle { background: rgba(255,255,255,0.06); }
.dark .table-empty-state .empty-title { color: #f5f5f7; }
.dark .modern-empty-card { box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); }
.dark .mockup-window { box-shadow: 0 -4px 24px rgba(0,0,0,0.4); }
</style>
