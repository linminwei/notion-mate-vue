<template>
  <div class="icon-picker">
    <!-- 模式切换 -->
    <div class="picker-mode-tabs">
      <button
        :class="['mode-tab', { active: mode === 'library' }]"
        @click="mode = 'library'"
      >
        <font-awesome-icon :icon="['fas', 'icons']" class="tab-icon" />
        图标库
      </button>
      <button
        :class="['mode-tab', { active: mode === 'svg' }]"
        @click="mode = 'svg'"
      >
        <font-awesome-icon :icon="['fas', 'code']" class="tab-icon" />
        SVG 代码
      </button>
    </div>

    <!-- 图标库模式 -->
    <div v-if="mode === 'library'" class="library-panel">
      <!-- 搜索框 -->
      <div class="search-box">
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          :placeholder="placeholder || '搜索图标名称...'"
        />
        <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">
          <font-awesome-icon :icon="['fas', 'xmark']" />
        </button>
      </div>

      <!-- 分类 Tab -->
      <div class="category-tabs">
        <button
          v-for="cat in categories"
          :key="cat.key"
          :class="['category-tab', { active: activeCategory === cat.key }]"
          @click="activeCategory = cat.key"
        >
          {{ cat.label }}
          <span class="category-count">{{ getCategoryCount(cat.key) }}</span>
        </button>
      </div>

      <!-- 图标网格 -->
      <div class="icon-grid-wrap">
        <div v-if="pagedIcons.length" class="icon-grid">
          <div
            v-for="icon in pagedIcons"
            :key="`${icon.prefix}-${icon.name}`"
            :class="['icon-cell', { selected: icon.label === value }]"
            :title="icon.label"
            @click="selectIcon(icon)"
          >
            <font-awesome-icon :icon="[icon.prefix, icon.name]" />
          </div>
        </div>
        <div v-else class="empty-state">
          <font-awesome-icon :icon="['fas', 'face-meh']" class="empty-icon" />
          <span>未找到匹配的图标</span>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="pagination">
        <button
          class="page-btn"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <font-awesome-icon :icon="['fas', 'chevron-left']" />
        </button>
        <div class="page-numbers">
          <button
            v-for="p in displayPages"
            :key="p"
            :class="['page-num', { active: p === currentPage }]"
            @click="currentPage = p"
          >
            {{ p }}
          </button>
        </div>
        <button
          class="page-btn"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          <font-awesome-icon :icon="['fas', 'chevron-right']" />
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      </div>
    </div>

    <!-- SVG 模式 -->
    <div v-if="mode === 'svg'" class="svg-panel">
      <textarea
        v-model="svgCode"
        class="svg-textarea"
        placeholder="在此粘贴 SVG 代码..."
        @input="onSvgInput"
      ></textarea>
    </div>

    <!-- 底部预览区 -->
    <div class="picker-footer">
      <div class="footer-preview">
        <div v-if="currentPreview" class="preview-icon-box">
          <font-awesome-icon
            v-if="currentPreview.type === 'fa'"
            :icon="currentPreview.icon"
            class="preview-fa"
          />
          <div
            v-else-if="currentPreview.type === 'svg'"
            class="preview-svg"
            v-html="sanitizedSvg"
          ></div>
        </div>
        <div v-else class="preview-icon-box preview-empty">
          <font-awesome-icon :icon="['fas', 'image']" />
        </div>
      </div>
      <div class="footer-info">
        <span v-if="value && isSvgValue" class="footer-label">自定义图标</span>
        <span v-else-if="value" class="footer-label">{{ value }}</span>
        <span v-else class="footer-placeholder">未选择图标</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'

interface Props {
  value?: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  placeholder: '搜索图标名称...'
})

const emit = defineEmits<{
  'update:value': [iconString: string]
}>()

// --- 状态 ---
const mode = ref<'library' | 'svg'>('library')
const searchQuery = ref('')
const activeCategory = ref('all')
const currentPage = ref(1)
const svgCode = ref('')
const PAGE_SIZE = 80

// --- 分类定义 ---
const categories = [
  { key: 'all', label: '全部' },
  { key: 'fas', label: 'Solid' },
  { key: 'far', label: 'Regular' },
  { key: 'fab', label: 'Brands' }
]

// --- 获取图标列表 ---
const allIcons = computed(() => {
  const definitions = (library as any).definitions
  const icons: { prefix: string; name: string; label: string }[] = []

  if (!definitions) return icons

  for (const [prefix, iconMap] of Object.entries(definitions)) {
    for (const name of Object.keys(iconMap as object)) {
      const styleName = prefix === 'fas' ? 'solid' : prefix === 'far' ? 'regular' : 'brands'
      icons.push({
        prefix,
        name,
        label: `fa-${styleName} fa-${name}`
      })
    }
  }
  return icons
})

// --- 按分类过滤 ---
const categoryFilteredIcons = computed(() => {
  if (activeCategory.value === 'all') return allIcons.value
  return allIcons.value.filter(i => i.prefix === activeCategory.value)
})

// --- 搜索过滤（防抖由 watch 处理） ---
const debouncedSearch = ref('')
let searchTimer: ReturnType<typeof setTimeout> | null = null

watch(searchQuery, (val) => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    debouncedSearch.value = val.toLowerCase().trim()
    currentPage.value = 1
  }, 300)
})

const filteredIcons = computed(() => {
  if (!debouncedSearch.value) return categoryFilteredIcons.value
  return categoryFilteredIcons.value.filter(i =>
    i.name.includes(debouncedSearch.value) ||
    i.label.includes(debouncedSearch.value)
  )
})

// --- 分页 ---
const totalPages = computed(() => Math.max(1, Math.ceil(filteredIcons.value.length / PAGE_SIZE)))

const pagedIcons = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredIcons.value.slice(start, start + PAGE_SIZE)
})

const displayPages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages: number[] = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    const start = Math.max(1, current - 2)
    const end = Math.min(total, current + 2)
    for (let i = start; i <= end; i++) pages.push(i)
  }
  return pages
})

// --- 分类计数 ---
const getCategoryCount = (key: string) => {
  if (key === 'all') return allIcons.value.length
  return allIcons.value.filter(i => i.prefix === key).length
}

// --- 切换分类时重置页码 ---
watch(activeCategory, () => {
  currentPage.value = 1
})

// --- 选择图标 ---
const selectIcon = (icon: { prefix: string; name: string; label: string }) => {
  emit('update:value', icon.label)
}

// --- SVG 输入 ---
const onSvgInput = () => {
  emit('update:value', svgCode.value)
}

// --- SVG 安全渲染（简单过滤 script） ---
const sanitizedSvg = computed(() => {
  if (!svgCode.value) return ''
  return svgCode.value
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
})

// --- 是否为 SVG 值 ---
const isSvgValue = computed(() => {
  return props.value.startsWith('<svg') || props.value.startsWith('<SVG')
})

// --- 底部预览 ---
const currentPreview = computed(() => {
  if (!props.value) return null

  if (props.value.startsWith('<svg') || props.value.startsWith('<SVG')) {
    return { type: 'svg' as const, icon: null }
  }

  // 解析 fa-solid fa-user 格式
  const match = props.value.match(/^fa-(solid|regular|brands)\s+fa-(.+)$/)
  if (match) {
    const prefixMap: Record<string, string> = { solid: 'fas', regular: 'far', brands: 'fab' }
    return {
      type: 'fa' as const,
      icon: [prefixMap[match[1]], match[2]]
    }
  }
  return null
})

// --- 初始化 SVG 模式 ---
watch(() => props.value, (val) => {
  if (val && (val.startsWith('<svg') || val.startsWith('<SVG'))) {
    mode.value = 'svg'
    svgCode.value = val
  }
}, { immediate: true })
</script>

<style scoped>
.icon-picker {
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.08));
  border-radius: 14px;
  background: var(--content-bg, #ffffff);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* ---- 模式切换 ---- */
.picker-mode-tabs {
  display: flex;
  padding: 10px 12px 0;
  gap: 4px;
}

.mode-tab {
  flex: 1;
  height: 34px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-muted, #86868b);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.mode-tab:hover {
  background: var(--hover-bg, rgba(0, 0, 0, 0.03));
}

.mode-tab.active {
  background: color-mix(in srgb, var(--apple-blue) 10%, transparent);
  color: var(--apple-blue);
  font-weight: 600;
}

.tab-icon {
  font-size: 12px;
}

/* ---- 搜索框 ---- */
.search-box {
  position: relative;
  margin: 10px 12px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted, #86868b);
  font-size: 13px;
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.08));
  background: var(--hover-bg, rgba(0, 0, 0, 0.02));
  padding: 0 36px 0 34px;
  font-size: 13px;
  color: var(--text-main, #1d1d1f);
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.search-input::placeholder {
  color: var(--text-muted, #86868b);
}

.search-input:focus {
  border-color: var(--apple-blue);
  background: var(--content-bg, #ffffff);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--apple-blue) 10%, transparent);
}

.search-clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background: var(--border-color, rgba(0, 0, 0, 0.08));
  color: var(--text-muted, #86868b);
  font-size: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.search-clear:hover {
  background: rgba(0, 0, 0, 0.12);
  color: var(--text-main, #1d1d1f);
}

/* ---- 分类 Tab ---- */
.category-tabs {
  display: flex;
  padding: 0 12px;
  gap: 2px;
  border-bottom: 1px solid var(--border-color, rgba(0, 0, 0, 0.06));
}

.category-tab {
  height: 32px;
  padding: 0 10px;
  border: none;
  border-radius: 6px 6px 0 0;
  background: transparent;
  color: var(--text-muted, #86868b);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
  position: relative;
}

.category-tab:hover {
  color: var(--text-main, #1d1d1f);
}

.category-tab.active {
  color: var(--apple-blue);
  font-weight: 600;
}

.category-tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 4px;
  right: 4px;
  height: 2px;
  border-radius: 2px 2px 0 0;
  background: var(--apple-blue);
}

.category-count {
  font-size: 10px;
  opacity: 0.6;
  font-weight: 400;
}

/* ---- 图标网格 ---- */
.icon-grid-wrap {
  height: 200px;
  overflow-y: auto;
  padding: 10px 12px;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.15) transparent;
}

.icon-grid-wrap::-webkit-scrollbar {
  width: 6px;
}

.icon-grid-wrap::-webkit-scrollbar-track {
  background: transparent;
}

.icon-grid-wrap::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 3px;
}

.icon-grid-wrap::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.25);
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(36px, 1fr));
  gap: 4px;
}

.icon-cell {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: var(--text-main, #1d1d1f);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  border: 1.5px solid transparent;
}

.icon-cell:hover {
  background: var(--hover-bg, rgba(0, 0, 0, 0.04));
  transform: scale(1.15);
}

.icon-cell.selected {
  border-color: var(--apple-blue);
  background: color-mix(in srgb, var(--apple-blue) 8%, transparent);
  color: var(--apple-blue);
}

/* ---- 空状态 ---- */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 8px;
  color: var(--text-muted, #86868b);
  font-size: 13px;
}

.empty-icon {
  font-size: 28px;
  opacity: 0.4;
}

/* ---- 分页 ---- */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  gap: 4px;
  border-top: 1px solid var(--border-color, rgba(0, 0, 0, 0.06));
}

.page-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text-muted, #86868b);
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.page-btn:hover:not(:disabled) {
  background: var(--hover-bg, rgba(0, 0, 0, 0.04));
  color: var(--text-main, #1d1d1f);
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 2px;
}

.page-num {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text-muted, #86868b);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.page-num:hover {
  background: var(--hover-bg, rgba(0, 0, 0, 0.04));
}

.page-num.active {
  background: var(--apple-blue);
  color: #ffffff;
  font-weight: 600;
}

.page-info {
  font-size: 11px;
  color: var(--text-muted, #86868b);
  margin-left: 8px;
}

/* ---- SVG 模式 ---- */
.svg-panel {
  padding: 12px;
}

.svg-textarea {
  width: 100%;
  height: 120px;
  border-radius: 10px;
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.08));
  background: var(--hover-bg, rgba(0, 0, 0, 0.02));
  padding: 12px;
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color: var(--text-main, #1d1d1f);
  resize: none;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
  line-height: 1.5;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.15) transparent;
}

.svg-textarea::-webkit-scrollbar {
  width: 6px;
}

.svg-textarea::-webkit-scrollbar-track {
  background: transparent;
}

.svg-textarea::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 3px;
}

.svg-textarea::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.25);
}

.svg-textarea::placeholder {
  color: var(--text-muted, #86868b);
}

.svg-textarea:focus {
  border-color: var(--apple-blue);
  background: var(--content-bg, #ffffff);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--apple-blue) 10%, transparent);
}



/* ---- 底部预览区 ---- */
.picker-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-top: 1px solid var(--border-color, rgba(0, 0, 0, 0.06));
  background: var(--hover-bg, rgba(0, 0, 0, 0.015));
}

.footer-preview {
  flex-shrink: 0;
}

.preview-icon-box {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--apple-blue) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--apple-blue) 15%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--apple-blue);
}

.preview-icon-box.preview-empty {
  background: var(--hover-bg, rgba(0, 0, 0, 0.03));
  border-color: var(--border-color, rgba(0, 0, 0, 0.08));
  color: var(--text-muted, #86868b);
  font-size: 14px;
}

.preview-fa {
  font-size: 18px;
}

.preview-svg {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-svg :deep(svg) {
  width: 100%;
  height: 100%;
}

.preview-svg :deep(svg),
.preview-svg :deep(svg path) {
  fill: var(--apple-blue) !important;
}

.footer-info {
  flex: 1;
  min-width: 0;
}

.footer-label {
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color: var(--text-main, #1d1d1f);
  word-break: break-all;
  line-height: 1.4;
}

.footer-placeholder {
  font-size: 13px;
  color: var(--text-muted, #86868b);
}
</style>

<!-- 暗黑模式适配 -->
<style>
html.dark .icon-picker,
.dark .icon-picker {
  background: #1c1c1e;
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

html.dark .search-input,
.dark .search-input {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

html.dark .search-input:focus,
.dark .search-input:focus {
  background: rgba(255, 255, 255, 0.06);
  border-color: var(--apple-blue);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--apple-blue) 15%, transparent);
}

html.dark .search-input::placeholder,
.dark .search-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

html.dark .search-clear,
.dark .search-clear {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
}

html.dark .search-clear:hover,
.dark .search-clear:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

html.dark .category-tabs,
.dark .category-tabs {
  border-color: rgba(255, 255, 255, 0.06);
}

html.dark .category-tab:hover,
.dark .category-tab:hover {
  color: #ffffff;
}

html.dark .icon-cell,
.dark .icon-cell {
  color: rgba(255, 255, 255, 0.8);
}

html.dark .icon-cell:hover,
.dark .icon-cell:hover {
  background: rgba(255, 255, 255, 0.08);
}

html.dark .icon-cell.selected,
.dark .icon-cell.selected {
  border-color: var(--apple-blue);
  background: color-mix(in srgb, var(--apple-blue) 15%, transparent);
  color: var(--apple-blue);
}

html.dark .pagination,
.dark .pagination {
  border-color: rgba(255, 255, 255, 0.06);
}

html.dark .page-btn:hover:not(:disabled),
.dark .page-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

html.dark .page-num:hover,
.dark .page-num:hover {
  background: rgba(255, 255, 255, 0.08);
}

html.dark .svg-textarea,
.dark .svg-textarea {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

html.dark .svg-textarea:focus,
.dark .svg-textarea:focus {
  background: rgba(255, 255, 255, 0.06);
  border-color: var(--apple-blue);
}



html.dark .picker-footer,
.dark .picker-footer {
  border-color: rgba(255, 255, 255, 0.06);
  background: rgba(0, 0, 0, 0.15);
}

html.dark .preview-icon-box.preview-empty,
.dark .preview-icon-box.preview-empty {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.3);
}

html.dark .footer-label,
.dark .footer-label {
  color: rgba(255, 255, 255, 0.85);
}

html.dark .footer-placeholder,
.dark .footer-placeholder {
  color: rgba(255, 255, 255, 0.35);
}

html.dark .icon-grid-wrap,
.dark .icon-grid-wrap {
  scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
}

html.dark .icon-grid-wrap::-webkit-scrollbar-thumb,
.dark .icon-grid-wrap::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
}

html.dark .icon-grid-wrap::-webkit-scrollbar-thumb:hover,
.dark .icon-grid-wrap::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}

html.dark .svg-textarea,
.dark .svg-textarea {
  scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
}

html.dark .svg-textarea::-webkit-scrollbar-thumb,
.dark .svg-textarea::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
}

html.dark .svg-textarea::-webkit-scrollbar-thumb:hover,
.dark .svg-textarea::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}

html.dark .empty-state,
.dark .empty-state {
  color: rgba(255, 255, 255, 0.35);
}

html.dark .mode-tab,
.dark .mode-tab {
  color: rgba(255, 255, 255, 0.45);
}

html.dark .mode-tab:hover,
.dark .mode-tab:hover {
  background: rgba(255, 255, 255, 0.06);
}

html.dark .mode-tab.active,
.dark .mode-tab.active {
  background: color-mix(in srgb, var(--apple-blue) 15%, transparent);
  color: var(--apple-blue);
}
</style>
