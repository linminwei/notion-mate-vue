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
          <a-select
            v-model:value="searchForm.category"
            placeholder="类目"
            :bordered="false"
            class="search-category-select"
            allowClear
            @change="handleSearch"
          >
            <a-select-option v-for="c in categoryDict" :key="c.dictValue" :value="c.dictValue">
              {{ c.dictLabel }}
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
        <div class="view-toggle">
          <button :class="['toggle-btn', { active: listViewMode === 'table' }]" @click="listViewMode = 'table'" title="列表视图">
            <font-awesome-icon :icon="['fas', 'list']" />
          </button>
          <button :class="['toggle-btn', { active: listViewMode === 'gallery' }]" @click="listViewMode = 'gallery'" title="画廊视图">
            <font-awesome-icon :icon="['fas', 'th']" />
          </button>
        </div>
        <button
          class="neo-btn-flat danger"
          v-if="selectedRowKeys.length > 0"
          @click="handleBatchDelete"
        >
          <font-awesome-icon :icon="['fas', 'trash']" />
          删除
        </button>
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
          {{ doubanSearched ? `找到 ${doubanTotal || doubanResults.length} 本相关图书` : '输入书名或 ISBN 检索豆瓣图书库' }}
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
      <button class="back-btn-outlined" @click="currentDoubanId ? backToSearch() : backToList()">
        <font-awesome-icon :icon="['fas', 'chevron-left']" class="back-icon" />
        {{ currentDoubanId ? '返回搜索结果' : '返回列表' }}
      </button>
    </header>

    <!-- ================= 列表视图：表格 ================= -->
    <div v-if="currentView === 'list'" class="neo-card table-card fade-in">
      <!-- 表格视图 -->
      <div v-if="listViewMode === 'table'" class="neo-table-wrapper">
        <!-- 加载遮罩 -->
        <div v-if="loading" class="neo-table-overlay">
          <TableLoading text="正在加载书籍" />
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
              <h3 class="modern-empty-title">暂无书籍数据</h3>
              <p class="modern-empty-desc">点击下方按钮前往发现好书搜索并添加书籍</p>
              <button class="modern-empty-btn" @click="openAddView">
                <font-awesome-icon :icon="['fas', 'search']" /> 发现好书
              </button>
            </div>
          </div>
        </div>
        <!-- 表格 -->
        <a-table v-else
          class="neo-table"
          :columns="columns"
          :data-source="tableData"
          :pagination="pagination"
          :scroll="{ x: 'max-content' }"
          :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
          row-key="id"
          @change="handleTableChange"
          @row-click="handleRowClick"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'bookInfo'">
            <div class="book-info-cell">
              <div v-if="record.cover" class="book-info-cover" @click="previewImg = record.cover">
                <div v-if="!imgLoadedCache[record.pageId]" class="cover-skeleton"></div>
                <img :src="record.cover" alt="封面" loading="lazy" decoding="async"
                     @load="onImgLoad(record.pageId)" @error="onImgError(record.pageId)"
                     :class="{ 'img-loaded': imgLoadedCache[record.pageId] }" />
              </div>
              <div v-else class="book-info-cover no-cover-xs">
                <font-awesome-icon :icon="['fas', 'book']" />
              </div>
              <div class="book-info-text">
                <span class="book-info-title" @click.stop="handleRowClick(record)">{{ record.title || '—' }}</span>
                <div class="book-info-author" v-if="record.author?.name">
                  <div class="book-info-author-avatar-wrap">
                    <img v-if="record.author.avatar" :src="record.author.avatar" class="bia-avatar" />
                    <font-awesome-icon v-else :icon="['fas', 'user']" class="bia-icon" />
                  </div>
                  <span class="book-info-author-name">{{ record.author.name }}</span>
                </div>
                <div v-else class="book-info-author empty">
                  <div class="book-info-author-avatar-wrap empty-avatar">
                    <font-awesome-icon :icon="['fas', 'user']" />
                  </div>
                  <span>未知作者</span>
                </div>
              </div>
            </div>
          </template>
          <template v-if="column.key === 'title'"></template>
          <template v-if="column.key === 'author'"></template>
          <template v-if="column.key === 'category'">
            <span v-if="record.category" class="category-tag">{{ categoryLabel(record.category) }}</span>
            <span v-else class="category-tag empty">未分类</span>
          </template>
          <template v-if="column.key === 'pubDate'">
            <span v-if="record.pubDate" class="cell-date">{{ formatDate(record.pubDate) }}</span>
            <span v-else class="cell-placeholder">—</span>
          </template>
          <template v-if="column.key === 'isbn'">
            <span v-if="record.isbn">{{ record.isbn }}</span>
            <span v-else class="cell-placeholder">—</span>
          </template>
          <template v-if="column.key === 'rating'">
            <div v-if="record.rating" class="rating-stars">
              <font-awesome-icon v-for="i in 5" :key="i"
                :icon="[i <= starCount(record.rating) ? 'fas' : 'far', 'star']"
                :class="{ 'filled': i <= starCount(record.rating) }" />
              <span class="rating-num">{{ formatRating(record.rating) }}</span>
            </div>
            <span v-else class="cell-placeholder">—</span>
          </template>
          <template v-if="column.key === 'createTime'">
            <span v-if="record.createTime" class="cell-date">{{ formatDateTime(record.createTime) }}</span>
            <span v-else class="cell-placeholder">—</span>
          </template>
          <template v-if="column.key === 'summary'">
            <span v-if="record.summary" class="cell-summary">{{ record.summary }}</span>
            <span v-else class="cell-placeholder">—</span>
          </template>
        </template>
      </a-table>
      </div>
      
      <!-- 画廊视图 -->
      <div v-if="listViewMode === 'gallery'" class="book-gallery">
        <div v-for="book in tableData" :key="book.id" class="gallery-card" @click="handleRowClick(book)">
          <div class="gallery-cover">
            <img v-if="book.cover" :src="book.cover" alt="封面" loading="lazy" />
            <div v-else class="gallery-no-cover"><font-awesome-icon :icon="['fas', 'book']" /></div>
            <div class="gallery-cover-gradient"></div>
            <span v-if="book.category" class="gallery-cover-category">{{ categoryLabel(book.category) }}</span>
            <div class="gallery-rating" v-if="book.rating">
              <font-awesome-icon :icon="['fas', 'star']" />
              <span>{{ formatRating(book.rating) }}</span>
            </div>
            <div class="gallery-isbn" v-if="book.isbn">{{ book.isbn }}</div>
          </div>
          <div class="gallery-body">
            <h3 class="gallery-title">{{ book.title }}</h3>
            <div class="gallery-author" v-if="book.author?.name">
              <img v-if="book.author.avatar" :src="book.author.avatar" class="gallery-author-avatar" />
              <font-awesome-icon v-else :icon="['fas', 'user']" class="gallery-author-icon" />
              <span>{{ book.author.name }}</span>
            </div>
            <div class="gallery-meta" v-if="book.publisher">
              <span>{{ book.publisher }}</span>
              <span v-if="book.pubDate" class="gallery-meta-sep">·</span>
              <span v-if="book.pubDate">{{ formatDate(book.pubDate) }}</span>
            </div>
            <div class="gallery-divider" v-if="book.summary"></div>
            <p class="gallery-summary" v-if="book.summary">{{ book.summary }}</p>
          </div>
        </div>
      </div>
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
      <!-- 加载更多 -->
      <div v-if="doubanCursor != null && doubanResults.length < doubanTotal" class="load-more-area">
        <button class="load-more-btn" :disabled="doubanLoadingMore" @click="handleLoadMore">
          <span v-if="doubanLoadingMore" class="btn-spinner"></span>
          <span>{{ doubanLoadingMore ? '加载中' : `加载更多 (${doubanResults.length}/${doubanTotal})` }}</span>
        </button>
      </div>
    </div>

    <!-- ================= 详情视图 (优化版 UI) ================= -->
    <div v-if="currentView === 'detail'" class="detail-view fade-in-up">

      <div v-if="detailLoading" class="loading-state fade-in">
        <div class="loading-card">
          <div class="loading-spinner"><div class="spinner-ring"></div></div>
          <p class="loading-text">正在拉取图书详情</p>
          <div class="loading-ellipsis"><span></span><span></span><span></span></div>
        </div>
      </div>

      <div v-else-if="bookDetail" class="detail-card-wrapper">
        <div class="detail-card">

          <!-- 左侧：3D 实体书封 -->
          <div class="detail-cover-section">
            <div class="book-3d">
              <div class="book-spine"></div>
              <div class="book-cover-face">
                <img v-if="bookDetail.cover" :src="proxyImageUrl(bookDetail.cover)" alt="封面" />
                <div v-else class="no-cover"><font-awesome-icon :icon="['fas', 'book']" /></div>
                <div class="cover-shine"></div>

                <!-- 优化：左上角入库收藏标识，同时渲染未入库状态 -->
                <div class="cover-library-badge" :class="bookDetail.inLibrary ? 'collected' : 'not-collected'">
                  <font-awesome-icon :icon="[bookDetail.inLibrary ? 'fas' : 'far', bookDetail.inLibrary ? 'check-circle' : 'circle']" />
                  <span>{{ bookDetail.inLibrary ? '已入库收藏' : '未入库' }}</span>
                </div>

                <!-- 封面内角标 (评分) -->
                <div class="cover-rating-capsule" v-if="bookDetail.rating">
                  <font-awesome-icon :icon="['fas', 'star']" />
                  <span>{{ formatRating(bookDetail.rating) }}</span>
                </div>
              </div>
              <div class="book-pages"></div>
              <div class="book-shadow"></div>
            </div>
          </div>

          <!-- 右侧：详细信息区 -->
          <div class="detail-info-section">

            <!-- 头部：标题与书籍类目 -->
            <div class="detail-header-wrap">
              <div class="detail-title-row">
                <input v-if="editState.field === 'title'" v-model="editState.value" class="detail-title-input" placeholder="书名" @blur="saveEdit('title')" @keyup.enter="saveEdit('title')" :ref="autoFocusInput" />
                <h1 v-else class="detail-title editable" @click="startEdit('title', bookDetail.title)">{{ bookDetail.title || '添加书名' }}</h1>
                <!-- 书籍类目移动到标题右侧 (全新胶囊设计) -->
                <div class="title-category-wrap">
                  <a-select
                      v-if="categoryDict.length"
                      :value="bookDetail.category"
                      placeholder="分类类目"
                      :bordered="false"
                      class="title-category-select"
                      @change="onCategoryChange"
                      allowClear
                  >
                    <a-select-option v-for="c in categoryDict" :key="c.dictValue" :value="c.dictValue">
                      {{ c.dictLabel }}
                    </a-select-option>
                  </a-select>
                </div>
              </div>
            </div>

            <!-- 现代化作者名片 -->
            <div class="author-card-modern" v-if="bookDetail.author">
              <div class="author-avatar-wrap" @click="triggerAvatarUpload" title="点击更换头像">
                <img v-if="bookDetail.author?.avatar" :src="bookDetail.author.avatar" class="author-avatar-lg" />
                <font-awesome-icon v-else :icon="['fas', 'user']" class="author-avatar-placeholder" />
                <div class="avatar-upload-overlay"><font-awesome-icon :icon="['fas', 'camera']" /></div>
                <input type="file" ref="avatarInput" accept="image/*" style="display:none" @change="onAvatarChange" />
              </div>
              <div class="author-info-main">
                <div class="author-name-row">
                  <input v-if="editState.field === 'authorName'" v-model="editState.value" class="author-inline-input" placeholder="作者名" @blur="saveAuthorField('name')" @keyup.enter="saveAuthorField('name')" :ref="autoFocusInput" />
                  <span v-else class="author-name-text" @click="startEditField('authorName', bookDetail.author?.name)">{{ bookDetail.author?.name || '添加作者名' }}</span>
                </div>
                <div class="author-summary-row">
                  <textarea v-if="editState.field === 'authorSummary'" v-model="editState.value" class="author-inline-textarea" placeholder="作者简介" rows="2" @blur="saveAuthorField('summary')" @input="autoResize" :ref="autoFocusInput" />
                  <p v-else-if="bookDetail.author?.summary" class="author-summary-text" @click="startEditField('authorSummary', bookDetail.author?.summary)">{{ bookDetail.author.summary }}</p>
                  <p v-else class="author-summary-text empty" @click="startEditField('authorSummary', '')">+ 点击添加一段简短的作者简介</p>
                </div>
              </div>
            </div>

            <!-- Bento Box 元数据便当盒网格 (字体与粗细统一) -->
            <div class="detail-meta-bento">
              <!-- 出版社 -->
              <div class="bento-item">
                <div class="bento-icon"><font-awesome-icon :icon="['fas', 'building']" /></div>
                <div class="bento-content">
                  <span class="bento-label">出版社</span>
                  <input v-if="editState.field === 'publisher'" v-model="editState.value" class="meta-bento-input" placeholder="出版社" @blur="saveEdit('publisher')" @keyup.enter="saveEdit('publisher')" :ref="autoFocusInput" />
                  <span v-else-if="bookDetail.publisher" class="bento-value editable" @click="startEdit('publisher', bookDetail.publisher)">{{ bookDetail.publisher }}</span>
                  <span v-else class="bento-value empty" @click="startEdit('publisher', '')">添加出版社</span>
                </div>
              </div>
              <!-- 出版日期 -->
              <div class="bento-item">
                <div class="bento-icon"><font-awesome-icon :icon="['fas', 'calendar-alt']" /></div>
                <div class="bento-content">
                  <span class="bento-label">出版日期</span>
                  <span class="bento-value">{{ bookDetail.pubDate ? formatDate(bookDetail.pubDate) : '—' }}</span>
                </div>
              </div>
              <!-- ISBN -->
              <div class="bento-item">
                <div class="bento-icon"><font-awesome-icon :icon="['fas', 'barcode']" /></div>
                <div class="bento-content">
                  <span class="bento-label">ISBN</span>
                  <span class="bento-value mono">{{ bookDetail.isbn || '—' }}</span>
                </div>
              </div>
            </div>

            <!-- 内容简介引用区 -->
            <div class="detail-summary-modern" v-if="bookDetail.summary || editState.field === 'summary'">
              <font-awesome-icon :icon="['fas', 'quote-right']" class="summary-watermark" />
              <div class="summary-header">
                <div class="quote-icon-wrap"><font-awesome-icon :icon="['fas', 'quote-left']" class="quote-icon" /></div>
                <h3>内容简介</h3>
              </div>
              <div class="summary-body">
                <textarea v-if="editState.field === 'summary'" v-model="editState.value" class="summary-textarea" @blur="saveEdit('summary')" @input="autoResize" :ref="autoFocusTextarea" />
                <p v-else class="editable-summary" @click="startEdit('summary', bookDetail.summary)">{{ bookDetail.summary || '点击此处添加简介，丰富书籍的信息详情...' }}</p>
              </div>
            </div>

          </div>
        </div>

        <!-- 底部玻璃质感操作按钮区 (最下方居中) -->
        <div class="detail-actions-footer">
          <button class="btn-glass-primary"
            v-if="currentDoubanId"
            :class="{ 'is-collected': bookDetail?.inLibrary }"
            :disabled="addLoading || bookDetail?.inLibrary"
            @click="handleAddBook">
            <span v-if="addLoading" class="btn-spinner"></span>
            <font-awesome-icon v-else :icon="[bookDetail?.inLibrary ? 'fas' : 'far', bookDetail?.inLibrary ? 'check-circle' : 'bookmark']" />
            {{ addLoading ? '入库中' : bookDetail?.inLibrary ? '已收藏' : '入库收藏' }}
          </button>
          <button class="btn-glass-primary"
            v-else
            :disabled="addLoading"
            @click="handleUpdateBook">
            <span v-if="addLoading" class="btn-spinner"></span>
            <font-awesome-icon v-else :icon="['fas', 'save']" />
            {{ addLoading ? '保存中' : '保存修改' }}
          </button>
          <a v-if="currentDoubanId" :href="`https://book.douban.com/subject/${currentDoubanId}`" target="_blank" class="btn-glass-secondary" title="在豆瓣查看完整信息">
            <img src="/豆瓣网.png" alt="豆瓣" />
            <span>在豆瓣查看</span>
          </a>
        </div>

      </div>

      <div v-else class="error-state fade-in">
        <div class="error-card">
          <div class="error-icon-wrap"><font-awesome-icon :icon="['fas', 'triangle-exclamation']" /></div>
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
import { ref, reactive, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { getBookPage, addBook, deleteBook, getBookById, updateBook, searchBook } from '@/api/book.ts'
import { getBookDetail } from '@/api/douban.ts'
import { getDictDataByDictCodeEnable } from '@/api/dict.ts'
import { uploadNotionFile } from '@/api/notion.ts'
import type { BookVo, DoubanBookVo, SearchDoubanBookVo, BookAuthorVo, DictData, AddBookDTO, UpdateBookDTO } from '@/types'
import { AppleAlert } from '@/components/common/AppleAlert.ts'
import TableLoading from '@/components/common/TableLoading.vue'

// ==================== 视图状态 ====================
type ViewMode = 'list' | 'search' | 'detail'
const currentView = ref<ViewMode>('list')
const listViewMode = ref<'table' | 'gallery'>('table')
const _imgCache: Record<string, boolean> = {}

// ==================== 列表视图 ====================
const columns = [
  { title: '书籍信息', key: 'bookInfo', minWidth: 240 },
  { title: '类目', dataIndex: 'category', key: 'category', minWidth: 80 },
  { title: '出版社', dataIndex: 'publisher', key: 'publisher' },
  { title: '出版日期', dataIndex: 'pubDate', key: 'pubDate' },
  { title: 'ISBN', dataIndex: 'isbn', key: 'isbn' },
  { title: '评分', dataIndex: 'rating', key: 'rating', align: 'center' },
  { title: '入库时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '内容简介', dataIndex: 'summary', key: 'summary', width: 320 },
]
const loading = ref(false)
const tableData = ref<BookVo[]>([])
const selectedRowKeys = ref<string[]>([])
const previewImg = ref<string | null>(null)
const imgLoadedCache = reactive(_imgCache)
const searchForm = reactive({ title: '', author: '', isbn: '', category: undefined as string | undefined, pageNum: 1, pageSize: 10 })
const pagination = reactive({ current: 1, pageSize: 10, total: 0, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '50'], showTotal: (total: number) => `共 ${total} 条` })

const truncate = (str: string, len: number) => (str.length > len ? str.slice(0, len) + '…' : str)
const onImgLoad = (id: string) => { imgLoadedCache[id] = true }
const onImgError = (id: string) => { imgLoadedCache[id] = true }

const onSelectChange = (keys: string[]) => { selectedRowKeys.value = keys }

const handleBatchDelete = async () => {
  if (selectedRowKeys.value.length === 0) return
  try {
    await deleteBook(selectedRowKeys.value)
    AppleAlert.success('删除成功', `已删除 ${selectedRowKeys.value.length} 本书籍`)
    selectedRowKeys.value = []
    fetchData()
  } catch (error: any) {
    AppleAlert.error('删除失败', error.message || '请稍后重试')
  }
}

const handleRowClick = async (record: BookVo) => {
  detailLoading.value = true; currentView.value = 'detail'; currentDoubanId.value = ''
  try {
    const res = await getBookById(record.id)
    bookDetail.value = res.data
  } catch (error: any) {
    AppleAlert.error('获取详情失败', error.message || '请稍后重试')
  } finally {
    detailLoading.value = false
  }
}

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
const handleReset = () => { searchForm.title = ''; searchForm.author = ''; searchForm.isbn = ''; searchForm.category = undefined; searchForm.pageNum = 1; pagination.current = 1; selectedRowKeys.value = []; fetchData() }
const handleTableChange = (pag: any) => { searchForm.pageNum = pag.current; searchForm.pageSize = pag.pageSize; pagination.current = pag.current; pagination.pageSize = pag.pageSize; fetchData() }

// ==================== 豆瓣搜索 ====================
const doubanKeyword = ref('')
const doubanSearching = ref(false)
const doubanSearched = ref(false)
const doubanResults = ref<DoubanBookVo[]>([])
const doubanCursor = ref<number | null>(null)
const doubanTotal = ref(0)
const doubanLoadingMore = ref(false)
const proxyImageUrl = (url: string) => `/api/douban/image?imgUrl=${encodeURIComponent(url)}`

const starCount = (rating: number) => Math.round(rating / 2)
const formatRating = (r: number) => r != null ? r.toFixed(1) : ''
const formatDate = (d: string) => { if (!d) return ''; const m = d.match(/^\d{4}-\d{2}-\d{2}/); return m ? m[0] : d }
const formatDateTime = (d: string) => { if (!d) return ''; const date = new Date(d); if (isNaN(date.getTime())) return d; const pad = (n: number) => n.toString().padStart(2, '0'); return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}` }

const handleDoubanSearch = async () => {
  if (!doubanKeyword.value.trim()) return
  doubanSearching.value = true; doubanSearched.value = true
  try {
    const res = await searchBook({ keyword: doubanKeyword.value.trim(), startCursor: 0 })
    const data = res.data as SearchDoubanBookVo
    doubanResults.value = data.books || []
    doubanCursor.value = data.startCursor ?? null
    doubanTotal.value = data.total ?? 0
  } catch (error: any) { AppleAlert.error('搜索失败', error.message || '请稍后重试'); doubanResults.value = [] }
  finally { doubanSearching.value = false }
}

const handleLoadMore = async () => {
  if (doubanCursor.value == null || doubanLoadingMore.value) return
  doubanLoadingMore.value = true
  try {
    const res = await searchBook({ keyword: doubanKeyword.value.trim(), startCursor: doubanCursor.value })
    const data = res.data as SearchDoubanBookVo
    doubanResults.value = [...doubanResults.value, ...(data.books || [])]
    doubanCursor.value = data.startCursor ?? null
  } catch (error: any) { AppleAlert.error('加载更多失败', error.message || '请稍后重试') }
  finally { doubanLoadingMore.value = false }
}

// ==================== 详情 ====================
const detailLoading = ref(false)
const bookDetail = ref<BookVo | null>(null)
const currentDoubanId = ref('')

// ==================== 入库 ====================
const addLoading = ref(false)

/** 将图片 URL 转为 File 对象 */
const urlToFile = async (url: string, filename: string): Promise<File> => {
  const res = await fetch(url)
  const blob = await res.blob()
  return new File([blob], filename, { type: blob.type || 'image/png' })
}

/** 上传单张图片到 Notion，返回 fileId */
const uploadImageToNotion = (imageUrl: string, filename: string): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    urlToFile(imageUrl, filename).then((file) => {
      uploadNotionFile(bookDetail.value!.workspaceId, file, {
        onComplete(event) { resolve(event.fileId) },
        onError(event) { reject(new Error(event.message || '上传失败')) },
      })
    }).catch(reject)
  })
}

const handleAddBook = async () => {
  if (!bookDetail.value || !currentDoubanId.value) return
  if (bookDetail.value.inLibrary) return
  if (!bookDetail.value?.workspaceId) {
    AppleAlert.warning('缺少工作区', '详情数据异常，请返回重新搜索')
    return
  }

  addLoading.value = true
  try {
    // 1. 上传封面
    let coverFileId: string | undefined
    if (bookDetail.value.cover) {
      try {
        coverFileId = await uploadImageToNotion(
          proxyImageUrl(bookDetail.value.cover),
          'cover.png'
        )
      } catch (e: any) {
        AppleAlert.error('封面上传失败', e.message || '请稍后重试')
        addLoading.value = false
        return
      }
    }

    // 2. 上传作者头像（仅当作者不在本地库中时才上传）
    let avatarFileId: string | undefined
    if (bookDetail.value.author?.avatar && !bookDetail.value.author?.pageId) {
      try {
        avatarFileId = await uploadImageToNotion(
          bookDetail.value.author.avatar,
          'avatar.png'
        )
      } catch (e: any) {
        AppleAlert.error('头像上传失败', e.message || '请稍后重试')
        addLoading.value = false
        return
      }
    }

    // 3. 构造请求体
    const dto: AddBookDTO = {
      book: {
        cover: coverFileId ? [coverFileId] : undefined,
        title: bookDetail.value.title,
        isbn: bookDetail.value.isbn || undefined,
        category: bookDetail.value.category || undefined,
        publisher: bookDetail.value.publisher || undefined,
        pubDate: bookDetail.value.pubDate || undefined,
        rating: bookDetail.value.rating || undefined,
        summary: bookDetail.value.summary || undefined,
      },
      author: {
        name: bookDetail.value.author?.name || '未知作者',
        avatar: avatarFileId ? [avatarFileId] : undefined,
        summary: bookDetail.value.author?.summary || undefined,
      },
    }

    // 4. 提交
    await addBook(dto)
    bookDetail.value.inLibrary = true
    AppleAlert.success('入库成功', `《${bookDetail.value.title}》已加入你的书架`)
    backToList()
  } catch (error: any) {
    AppleAlert.error('入库失败', error.message || '请稍后重试')
  } finally {
    addLoading.value = false
  }
}

const handleUpdateBook = async () => {
  if (!bookDetail.value) return
  addLoading.value = true
  try {
    // 头像有改动则上传
    let avatarFileId: string | undefined
    const avatar = bookDetail.value.author?.avatar
    if (avatar && avatar.startsWith('data:')) {
      try {
        avatarFileId = await uploadImageToNotion(avatar, 'avatar.png')
      } catch (e: any) {
        AppleAlert.error('头像上传失败', e.message || '请稍后重试')
        addLoading.value = false
        return
      }
    }

    const dto: UpdateBookDTO = {
      id: bookDetail.value.id,
      title: bookDetail.value.title,
      category: bookDetail.value.category || undefined,
      publisher: bookDetail.value.publisher || undefined,
      summary: bookDetail.value.summary || undefined,
      authorName: bookDetail.value.author?.name || '',
      authorAvatar: avatarFileId || undefined,
      authorSummary: bookDetail.value.author?.summary || undefined,
    }
    await updateBook(dto)
    AppleAlert.success('保存成功', `《${bookDetail.value.title}》已更新`)
    backToList()
  } catch (error: any) {
    AppleAlert.error('保存失败', error.message || '请稍后重试')
  } finally {
    addLoading.value = false
  }
}

const toggleCollect = (id: string) => {
  if (!bookDetail.value || !id) return
  bookDetail.value.inLibrary = !bookDetail.value.inLibrary
}

// ==================== 内联编辑 ====================
const editState = reactive({ field: '' as string, value: '' })
const avatarInput = ref<HTMLInputElement | null>(null)

const startEdit = (field: string, val: string) => { editState.field = field; editState.value = val || '' }
const startEditField = (field: string, val?: string) => { editState.field = field; editState.value = val || '' }

const saveAuthorField = (prop: string) => {
  if (!bookDetail.value?.author) return
  if (prop === 'name') bookDetail.value.author.name = editState.value
  if (prop === 'summary') bookDetail.value.author.summary = editState.value
  editState.field = ''
}

const triggerAvatarUpload = () => avatarInput.value?.click()
const onAvatarChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file || !bookDetail.value?.author) return
  const reader = new FileReader()
  reader.onload = () => { if (bookDetail.value?.author) bookDetail.value.author.avatar = reader.result as string }
  reader.readAsDataURL(file)
}

const saveEdit = (field: string) => {
  if (!bookDetail.value) return
  if (field === 'publisher') bookDetail.value.publisher = editState.value
  if (field === 'title') bookDetail.value.title = editState.value
  if (field === 'summary') bookDetail.value.summary = editState.value
  if (editState.field === field) editState.field = ''
}
const autoFocusInput = (el: any) => { if (el) nextTick(() => el.focus()) }
const autoFocusTextarea = (el: any) => { if (el) nextTick(() => { el.focus(); autoResize({ target: el }) }) }
const autoResize = (e: Event) => {
  const el = e.target as HTMLTextAreaElement
  el.style.height = 'auto'
  el.style.height = Math.max(80, el.scrollHeight) + 'px'
}

const openDetail = async (doubanId: string) => {
  currentView.value = 'detail'; detailLoading.value = true; bookDetail.value = null; currentDoubanId.value = doubanId
  try { const res = await getBookDetail(doubanId); bookDetail.value = res.data }
  catch (error: any) { AppleAlert.error('获取详情失败', error.message || '请稍后重试') }
  finally { detailLoading.value = false }
}
const retryLastDetail = () => { if (currentDoubanId.value) openDetail(currentDoubanId.value) }

// ==================== 视图切换 ====================
const openAddView = () => { currentView.value = 'search'; doubanSearched.value = false; doubanResults.value = []; doubanKeyword.value = ''; doubanCursor.value = null; doubanTotal.value = 0 }

// 从作家页跳转：自动填充搜索关键词
const route = useRoute()

const backToList = () => { currentView.value = 'list'; fetchData() }
const backToSearch = () => { currentView.value = 'search'; bookDetail.value = null }

// ==================== ESC 关闭预览 ====================
const onKeydown = (e: KeyboardEvent) => { if (e.key === 'Escape' && previewImg.value) previewImg.value = null }
watch(previewImg, (val) => { if (val) document.addEventListener('keydown', onKeydown); else document.removeEventListener('keydown', onKeydown) })
onUnmounted(() => document.removeEventListener('keydown', onKeydown))

// ==================== 类目字典 ====================
const categoryDict = ref<DictData[]>([])
const fetchCategoryDict = async () => {
  try { const res = await getDictDataByDictCodeEnable('book_category'); categoryDict.value = res.data || [] }
  catch { categoryDict.value = [] }
}
const onCategoryChange = (value: string) => {
  if (bookDetail.value) { bookDetail.value.category = value || undefined }
}
const categoryLabel = (value: string) => categoryDict.value.find(d => d.dictValue === value)?.dictLabel || value

onMounted(() => { fetchData(); fetchCategoryDict() })

// 监听路由 query 变化，跨页面跳转自动搜索
watch(() => route.query, ({ q, view }) => {
  if (view === 'search' || q) {
    openAddView()
    if (q) {
      nextTick(() => {
        doubanKeyword.value = q as string
        handleDoubanSearch()
      })
    }
  }
}, { immediate: true })
</script>

<style scoped>
/* ================= 通用 & 动画 ================= */
.cell-placeholder { color: var(--text-muted, #a1a1aa); font-size: 13px; }
/* 统一列表单元格文字 */
:deep(.neo-table) { table-layout: auto !important; }
:deep(.neo-table .ant-table-tbody > tr) { cursor: pointer; }
:deep(.neo-table .ant-table) { overflow-x: auto; }
:deep(.neo-table .ant-table-tbody > tr > td) {
  font-size: 13px; font-weight: 400; color: var(--text-main, #1d1d1f);
  font-family: inherit;
}
.cell-summary { display: block; line-height: 1.5; color: var(--text-secondary, #666); font-size: 13px; white-space: normal; word-break: break-word; }
.cell-date { font-size: 13px; color: var(--text-secondary, #666); white-space: nowrap; }
.book-title { font-weight: 500; font-size: 13px; }
.author-cell { display: inline-flex; align-items: center; gap: 6px; }
.author-avatar { width: 20px; height: 20px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.category-tag { display: inline-block; padding: 2px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; background: color-mix(in srgb, var(--apple-blue, #007AFF) 10%, transparent); color: var(--apple-blue, #007AFF); }
.category-tag.empty { background: var(--hover-bg, #f0f0f3); color: var(--text-muted, #b0b0b8); font-weight: 400; }
:global(.dark) .category-tag { background: color-mix(in srgb, var(--apple-blue, #0A84FF) 15%, transparent); }
:global(.dark) .category-tag.empty { background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.3); }

/* 书籍信息合并列 */
.book-info-cell { display: flex; align-items: center; gap: 18px; padding: 6px 2px; }
.book-info-cover {
  width: 52px; height: 70px; border-radius: 8px; overflow: hidden;
  flex-shrink: 0; cursor: pointer;
  background: var(--hover-bg, #f5f5f7);
  box-shadow:
    0 3px 10px rgba(0,0,0,0.1),
    0 0 0 1px rgba(0,0,0,0.06),
    inset 0 0 0 1px rgba(255,255,255,0.5);
  display: flex; align-items: center; justify-content: center;
  position: relative; transition: box-shadow 0.25s, transform 0.25s;
}
.book-info-cover::after {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 40%;
  background: linear-gradient(to bottom, rgba(255,255,255,0.15), transparent);
  border-radius: 8px 8px 0 0; pointer-events: none; z-index: 2;
}
.book-info-cover:hover { box-shadow: 0 6px 18px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.08); transform: scale(1.05) translateY(-2px); }
.book-info-cover img { width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.3s; position: relative; z-index: 1; }
.book-info-cover img.img-loaded { opacity: 1; }
.book-info-cover .cover-skeleton { position: absolute; inset: 0; background: linear-gradient(90deg, var(--hover-bg, #e5e5ea) 0%, var(--card-bg, #f0f0f3) 50%, var(--hover-bg, #e5e5ea) 100%); background-size: 200% 100%; animation: skeleton-shimmer 1.4s ease-in-out infinite; z-index: 1; pointer-events: none; }
.book-info-cover.no-cover-xs { font-size: 22px; color: var(--text-muted, #c7c7cc); box-shadow: 0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04); }
.book-info-cover.no-cover-xs::after { display: none; }
:global(.dark) .book-info-cover { box-shadow: 0 3px 12px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06); }
:global(.dark) .book-info-cover:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.4); }
:global(.dark) .book-info-cover::after { background: linear-gradient(to bottom, rgba(255,255,255,0.06), transparent); }
.book-info-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 10px; }
.book-info-title { font-size: 15px; font-weight: 650; color: var(--text-main, #1d1d1f); line-height: 1.25; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer; transition: color 0.15s; letter-spacing: -0.01em; }
.book-info-title:hover { color: var(--apple-blue, #007AFF); }
.book-info-author {
  display: inline-flex; align-items: center; gap: 10px;
  max-width: fit-content;
}
.book-info-author.empty {
  color: var(--text-muted, #b0b0b8);
}
.book-info-author-avatar-wrap {
  width: 24px; height: 24px; border-radius: 50%; overflow: hidden; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--hover-bg, #e8e8ed), var(--border-color, #ddd));
  box-shadow: 0 2px 6px rgba(0,0,0,0.08), 0 0 0 2px rgba(255,255,255,0.9);
}
.book-info-author-avatar-wrap.empty-avatar {
  background: var(--hover-bg, #f0f0f3);
  box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 0 0 2px rgba(255,255,255,0.7);
  color: var(--text-muted, #b0b0b8); font-size: 12px;
}
.book-info-author-avatar {
  width: 100%; height: 100%; object-fit: cover;
}
.book-info-author-icon { font-size: 14px; color: var(--text-muted, #b0b0b8); }
.bia-avatar { width: 100%; height: 100%; object-fit: cover; }
.bia-icon { font-size: 14px; color: var(--text-muted, #b0b0b8); }
.book-info-author-name { font-size: 13px; font-weight: 500; color: var(--text-secondary, #555); }
.book-info-author.empty .book-info-author-name { color: var(--text-muted, #b0b0b8); }

/* 视图切换按钮 */
.view-toggle { display: flex; gap: 4px; margin-right: 8px; }
.toggle-btn {
  width: 34px; height: 34px; border: 1.5px solid var(--border-color, rgba(0,0,0,0.1));
  border-radius: 10px; background: var(--card-bg, #fff); color: var(--text-muted, #999);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  font-size: 14px; transition: all 0.2s;
}
.toggle-btn:hover { border-color: var(--apple-blue, #007AFF); color: var(--apple-blue, #007AFF); }
.toggle-btn.active { background: var(--apple-blue, #007AFF); border-color: var(--apple-blue, #007AFF); color: #fff; box-shadow: 0 2px 8px rgba(0,122,255,0.2); }

/* 画廊视图 */
.book-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; padding: 4px 0; }
.gallery-card {
  background: var(--card-bg, #fff); border-radius: 14px; overflow: hidden;
  cursor: pointer; border: 1px solid var(--border-color, rgba(0,0,0,0.06));
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  display: flex; flex-direction: column;
}
.gallery-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--apple-blue, #007AFF) 25%, transparent);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}
.gallery-cover {
  width: 100%; aspect-ratio: 2/3; background: var(--hover-bg, #f0f0f3);
  position: relative; overflow: hidden;
}
.gallery-cover img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.gallery-card:hover .gallery-cover img { transform: scale(1.06); }
.gallery-cover-gradient {
  position: absolute; bottom: 0; left: 0; right: 0; height: 45%;
  background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%);
  pointer-events: none; z-index: 1;
}
.gallery-cover-category {
  position: absolute; bottom: 8px; left: 8px; z-index: 2;
  font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.9);
  background: rgba(255,255,255,0.15); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  padding: 3px 9px; border-radius: 6px; letter-spacing: 0.02em;
}
.gallery-no-cover { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 36px; color: var(--text-placeholder, #c7c7cc); opacity: 0.35; }
.gallery-no-cover ~ .gallery-cover-gradient { display: none; }
.gallery-rating {
  position: absolute; top: 8px; left: 8px; z-index: 2;
  display: inline-flex; align-items: center; gap: 3px;
  padding: 3px 8px; border-radius: 7px;
  background: rgba(0,0,0,0.55); 
  color: #f5a623; font-size: 11px; font-weight: 700;
}
.gallery-isbn {
  position: absolute; bottom: 8px; right: 8px; z-index: 2;
  font-size: 10px; font-weight: 500; color: rgba(255,255,255,0.7);
  background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
  padding: 2px 7px; border-radius: 5px; letter-spacing: 0.03em; max-width: calc(100% - 16px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.gallery-body { padding: 14px 14px 16px; display: flex; flex-direction: column; gap: 8px; }
.gallery-title {
  font-size: 14px; font-weight: 600; color: var(--text-main, #1d1d1f);
  margin: 0; line-height: 1.35;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.gallery-author {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 500; color: var(--text-secondary, #6e6e73);
  margin: 0;
}
.gallery-author-avatar { width: 18px; height: 18px; border-radius: 50%; object-fit: cover; flex-shrink: 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.gallery-author-icon { font-size: 10px; color: var(--text-muted, #b0b0b8); }
.gallery-meta { font-size: 11px; color: var(--text-tertiary, #aaa); margin: 0; display: flex; align-items: center; gap: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.gallery-meta-sep { margin: 0 6px; color: var(--text-placeholder, #d1d1d6); }
.gallery-extra { display: flex; align-items: baseline; gap: 6px; font-size: 11px; }
.gallery-extra-label { color: var(--text-muted, #b0b0b8); font-weight: 500; flex-shrink: 0; min-width: 28px; }
.gallery-extra-value { color: var(--text-secondary, #6e6e73); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.gallery-divider { height: 1px; background: var(--border-color, rgba(0,0,0,0.06)); margin: 4px 0 2px; }
.gallery-summary {
  font-size: 11px; color: var(--text-tertiary, #999); line-height: 1.5;
  margin: 0;
}
:global(.dark) .gallery-card { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.05); }
:global(.dark) .gallery-card:hover { border-color: color-mix(in srgb, var(--apple-blue, #0A84FF) 30%, transparent); box-shadow: 0 12px 28px rgba(0,0,0,0.35); }

/* 类目下拉 - 与用户管理状态下拉 UI 一致 */
:deep(.search-category-select) {
  flex: 1; min-width: 90px; width: 0;
  height: 26px; display: flex; align-items: center;
}
:deep(.search-category-select .ant-select-selector) {
  padding: 0 2px !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  height: 26px !important;
  min-height: 26px !important;
  display: flex !important;
  align-items: center !important;
}
:deep(.search-category-select .ant-select-selection-item),
:deep(.search-category-select .ant-select-selection-placeholder) {
  font-size: 13px !important;
  color: var(--text-main) !important;
  line-height: 26px !important;
  padding-right: 12px !important;
  display: flex !important;
  align-items: center !important;
  margin: 0 !important;
}
:deep(.search-category-select .ant-select-selection-placeholder) {
  color: var(--text-muted, #a1a1aa) !important;
}
:deep(.search-category-select .ant-select-arrow) {
  right: 0px !important;
  font-size: 10px !important;
  color: var(--text-muted) !important;
}
:deep(.search-category-select .ant-select-clear) {
  right: 0px !important;
  background: transparent !important;
}
.rating-text { font-weight: 500; font-size: 13px; }
.rating-star { color: #f5a623; font-size: 11px; margin-right: 3px; }

/* 评分列：五星 + 数值 */
.rating-stars { display: inline-flex; align-items: center; gap: 2px; color: #d4d4d8; font-size: 12px; }
.rating-stars .filled { color: #f5a623; }
.rating-num { font-size: 13px; font-weight: 600; color: #f5a623; margin-left: 6px; }

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

.search-trigger { width: 32px; height: 32px; border: none; border-radius: 10px; background: var(--apple-blue, #0A84FF); color: #ffffff; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
.search-trigger:hover { filter: brightness(0.9); transform: scale(0.95); }
.search-trigger.reset-btn { background: var(--hover-bg, #e5e5ea); color: var(--text-main, #333); }
.search-trigger.reset-btn:hover { background: var(--active-bg, rgba(0,0,0,0.1)); transform: scale(0.95); }

/* ================= 发现页：返回按钮 ================= */
.add-view-header, .detail-sub-header { display: flex; align-items: center; padding: 0 0 16px; position: relative; z-index: 10; }
.back-btn-outlined {
  display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px 8px 12px;
  border: 1px solid transparent; border-radius: 40px;
  background: #000000; color: #ffffff; font-size: 14px; font-weight: 500;
  cursor: pointer; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.back-icon { font-size: 13px; color: #ffffff; transition: color 0.3s; }
.back-btn-outlined:hover { background: #333333; box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2); transform: translateY(-1px); }
.back-btn-outlined:active { transform: scale(0.96); box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }

/* ================= Search Hero 区 ================= */
.search-hero { display: flex; justify-content: center; padding: 32px 0 48px; transition: padding 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); position: relative; }
.search-hero.is-initial { padding: 6vh 0 4vh; }
.search-hero-inner { width: 100%; max-width: 640px; text-align: center; position: relative; z-index: 10; }
.hero-title { font-size: 36px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.03em; background: linear-gradient(135deg, var(--text-main, #1d1d1f) 0%, var(--text-secondary, #666666) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hero-subtitle { font-size: 15px; color: var(--text-secondary, #86868b); margin: 0 0 32px; font-weight: 400; }
.search-hero-bar { display: flex; align-items: center; height: 68px; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-radius: 24px; border: 1px solid rgba(0,0,0,0.08); padding: 0 8px 0 24px; transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); box-shadow: 0 12px 32px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02); }
.search-hero-bar:focus-within { background: rgba(255, 255, 255, 0.98); border-color: color-mix(in srgb, var(--apple-blue, #007AFF) 40%, transparent); box-shadow: 0 20px 48px color-mix(in srgb, var(--apple-blue, #007AFF) 12%, transparent), 0 4px 16px rgba(0,0,0,0.04), 0 0 0 4px color-mix(in srgb, var(--apple-blue, #007AFF) 15%, transparent); transform: translateY(-2px); }
.hero-search-icon { color: var(--text-muted, #8e8e93); font-size: 18px; flex-shrink: 0; transition: color 0.3s; }
.search-hero-bar:focus-within .hero-search-icon { color: var(--apple-blue, #007AFF); }
.search-hero-bar input { flex: 1; min-width: 0; border: none; background: transparent; font-size: 17px; color: var(--text-main, #1d1d1f); outline: none; padding: 0 16px; }
.search-hero-bar input::placeholder { color: var(--text-placeholder, #a1a1aa); }
.hero-search-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 48px; min-width: 104px; padding: 0 28px; border: none; border-radius: 18px; background: #000000; color: #ffffff; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
.hero-search-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2); background: #333333; }
.hero-search-btn:active:not(:disabled) { transform: scale(0.96); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); }
.hero-search-btn:disabled { background: var(--hover-bg, #e5e5ea); color: var(--text-muted, #a1a1aa); box-shadow: none; cursor: not-allowed; }
.btn-spinner { width: 16px; height: 16px; border: 2px solid currentColor; border-top-color: transparent; border-radius: 50%; animation: ring-spin 0.8s linear infinite; opacity: 0.8; }
@keyframes ring-spin { to { transform: rotate(360deg); } }

/* ================= 结果状态 / 空状态 ================= */
.empty-state, .loading-state, .error-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 0; text-align: center; }
.error-state { color: var(--apple-red, #ff3b30); }
.error-card { display: inline-flex; flex-direction: column; align-items: center; padding: 40px 48px; background: var(--card-bg, #fff); border-radius: 18px; border: 1px solid var(--border-color, rgba(0,0,0,0.06)); box-shadow: 0 2px 12px rgba(0,0,0,0.03); }
.error-icon-wrap { width: 56px; height: 56px; border-radius: 16px; background: color-mix(in srgb, var(--apple-red, #ff3b30) 8%, transparent); display: flex; align-items: center; justify-content: center; font-size: 28px; color: var(--apple-red, #ff3b30); margin-bottom: 20px; }
.error-title { font-size: 18px; font-weight: 700; color: var(--text-main); margin: 0 0 14px; }
.error-desc { font-size: 14px; color: var(--text-secondary, #888); margin: 0 0 20px; }
.error-retry-btn { display: inline-flex; align-items: center; gap: 7px; height: 36px; padding: 0 20px; border: none; border-radius: 10px; background: var(--apple-red, #ff3b30); color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.25s ease; }
.error-retry-btn:hover { opacity: 0.85; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(255,59,48,0.3); }
.error-retry-btn:active { transform: scale(0.96); }

.empty-state-icon { width: 120px; height: 120px; border-radius: 32px; background: linear-gradient(135deg, rgba(0,122,255,0.08) 0%, rgba(0,122,255,0.02) 100%); display: flex; align-items: center; justify-content: center; font-size: 44px; color: var(--apple-blue, #007AFF); margin-bottom: 28px; box-shadow: 0 12px 32px rgba(0,122,255,0.06), inset 0 1px 0 rgba(255,255,255,0.6); position: relative; animation: iconFloat 4s ease-in-out infinite; }
.empty-state-icon::after { content: ''; position: absolute; inset: 0; border-radius: inherit; background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 50%); pointer-events: none; }
.empty-state-icon.muted { background: linear-gradient(135deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.01) 100%); color: var(--text-tertiary, #b0b0b8); box-shadow: 0 8px 24px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.4); }
.empty-state-icon.muted::after { background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%); }
@keyframes iconFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }

.empty-ring-ring { position: absolute; inset: -6px; border-radius: 36px; border: 2px solid color-mix(in srgb, var(--apple-blue, #007AFF) 38%, transparent); pointer-events: none; z-index: 0; animation: ringSweep 2.8s ease-in-out infinite; }
.empty-ring-ring.ring-outer { inset: -16px; border-radius: 46px; animation-delay: 0.4s; border-width: 1.5px; border-color: color-mix(in srgb, var(--apple-blue, #007AFF) 26%, transparent); }
.empty-ring-ring.ring-far { inset: -28px; border-radius: 58px; animation-delay: 0.8s; border-width: 1px; border-color: color-mix(in srgb, var(--apple-blue, #007AFF) 16%, transparent); }
@keyframes ringSweep { 0%, 100% { opacity: 0.35; transform: scale(0.94) rotate(0deg); } 50% { opacity: 0.85; transform: scale(1.04) rotate(3deg); } }
.empty-state-title { font-size: 22px; font-weight: 700; color: var(--text-main, #1d1d1f); margin: 0 0 10px; letter-spacing: -0.01em; }
.empty-state-sep { width: 32px; height: 2px; border-radius: 2px; background: color-mix(in srgb, var(--apple-blue, #007AFF) 20%, transparent); margin: 0 auto 14px; }
.empty-state-desc { font-size: 15px; color: var(--text-tertiary, #999); margin: 0; line-height: 1.7; max-width: 360px; }

/* ================= 加载卡片 ================= */
.loading-card { display: inline-flex; flex-direction: column; align-items: center; gap: 0; padding: 40px 48px; background: var(--card-bg, #fff); border-radius: 18px; border: 1px solid var(--border-color, rgba(0,0,0,0.06)); box-shadow: 0 2px 12px rgba(0,0,0,0.03); }
.loading-spinner { width: 40px; height: 40px; margin-bottom: 20px; position: relative; }
.spinner-ring { width: 100%; height: 100%; border-radius: 50%; border: 3px solid var(--border-color, rgba(0,0,0,0.08)); border-top-color: var(--apple-blue, #007AFF); border-right-color: color-mix(in srgb, var(--apple-blue, #007AFF) 40%, transparent); animation: spinnerSpin 0.9s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
@keyframes spinnerSpin { to { transform: rotate(360deg); } }
.loading-text { font-size: 15px; font-weight: 500; color: var(--text-secondary, #666); margin: 0 0 14px; letter-spacing: 0.01em; }
.loading-ellipsis { display: flex; gap: 5px; }
.loading-ellipsis span { width: 5px; height: 5px; border-radius: 50%; background: var(--text-muted, #b0b0b8); animation: ellipsisBreathe 1.4s ease-in-out infinite both; }
.loading-ellipsis span:nth-child(2) { animation-delay: 0.2s; }
.loading-ellipsis span:nth-child(3) { animation-delay: 0.4s; }
@keyframes ellipsisBreathe { 0%, 80%, 100% { opacity: 0.25; transform: scale(0.7); } 40% { opacity: 1; transform: scale(1); } }

/* ================= 豆瓣搜索结果网格 ================= */
.douban-results-area { flex: 1; padding-bottom: 40px; position: relative; z-index: 10; }
/* 加载更多 */
.load-more-area { display: flex; justify-content: center; padding: 24px 0; }
.load-more-btn { display: inline-flex; align-items: center; gap: 8px; height: 42px; padding: 0 28px; border-radius: 21px; border: 1.5px solid var(--border-color, rgba(0,0,0,0.1)); background: var(--card-bg, #fff); color: var(--text-secondary, #666); font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; }
.load-more-btn:hover:not(:disabled) { border-color: var(--apple-blue, #007AFF); color: var(--apple-blue, #007AFF); background: color-mix(in srgb, var(--apple-blue, #007AFF) 4%, transparent); }
.load-more-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.douban-result-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; }
.douban-book-card { background: var(--card-bg, #fff); border-radius: 16px; border: 1px solid var(--border-color, rgba(0,0,0,0.06)); overflow: hidden; cursor: pointer; padding: 10px; transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.35s cubic-bezier(0.2, 0.8, 0.2, 1); box-shadow: 0 1px 3px rgba(0,0,0,0.04); animation: cardEnter 0.45s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
@keyframes cardEnter { from { opacity: 0; transform: translateY(20px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
.douban-book-card:hover { transform: translateY(-4px) scale(1.015); border-color: color-mix(in srgb, var(--apple-blue, #007AFF) 30%, transparent); box-shadow: 0 12px 28px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04); }
.card-cover { width: 100%; aspect-ratio: 2/3; background: var(--hover-bg, #f0f0f3); border-radius: 10px; overflow: hidden; position: relative; box-shadow: 0 2px 8px rgba(0,0,0,0.06); transition: box-shadow 0.35s cubic-bezier(0.2, 0.8, 0.2, 1); display: flex; align-items: center; justify-content: center; }
.card-cover img { width: 100%; height: 100%; object-fit: cover; }
.cover-overlay { position: absolute; inset: 0; border-radius: inherit; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.04); pointer-events: none; }
.no-cover-sm { font-size: 28px; color: var(--text-placeholder, #c7c7cc); opacity: 0.5; }
.card-body { padding: 12px 4px 0; }
.card-title-text { font-size: 14px; font-weight: 600; color: var(--text-main, #1d1d1f); margin: 0 0 6px; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.card-author { font-size: 12px; color: var(--text-muted, #888); margin: 0 0 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-publisher { font-size: 12px; color: var(--text-tertiary, #aaa); margin: 0 0 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-stars { display: inline-flex; align-items: center; gap: 3px; color: #d4d4d8; font-size: 12px; }
.card-stars .filled { color: #f5a623; }
.stars-num { font-size: 12px; font-weight: 700; color: #f5a623; margin-left: 6px; }
.cover-rating-badge { position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); color: #f5a623; font-size: 12px; font-weight: 700; padding: 3px 8px; border-radius: 6px; line-height: 1; z-index: 2; letter-spacing: 0.02em; }
.cover-douban-badge { position: absolute; top: 8px; right: 8px; width: 28px; height: 28px; display: flex; z-index: 2; transition: all 0.2s ease; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3)); }
.cover-douban-badge img { width: 100%; height: 100%; object-fit: contain; }
.cover-douban-badge:hover { transform: scale(1.15); filter: drop-shadow(0 2px 4px rgba(0,181,26,0.4)); }
.cover-rating-badge.no-rating { color: rgba(255,255,255,0.7); font-weight: 400; font-size: 11px; }

/* ================= 详情视图 — 优化版设计 ================= */
.detail-view { flex: 1; padding-bottom: 64px; position: relative; z-index: 10; }

/* ── 拟态玻璃卡片容器 (纯净底板，去除背景渐变影响) ── */
.detail-card-wrapper {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(30px) saturate(150%);
  -webkit-backdrop-filter: blur(30px) saturate(150%);
  border-radius: 32px;
  padding: 48px;
  box-shadow:
      0 32px 64px rgba(0, 0, 0, 0.1),
      inset 0 1px 2px rgba(255, 255, 255, 0.9),
      0 4px 12px rgba(0,0,0,0.04);
  border: 1px solid rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
}
.detail-card { display: flex; gap: 64px; align-items: flex-start; }

/* ── 左侧：3D 实体书封 ── */
.detail-cover-section {
  width: 280px; flex-shrink: 0; perspective: 1200px; margin-top: 10px;
  /* 浮动动画挂载在这里 */
  animation: bookFloat 6s ease-in-out infinite;
}
/* 鼠标悬停时暂停上下浮动 */
.detail-cover-section:hover {
  animation-play-state: paused;
}
.book-3d {
  position: relative; width: 100%; aspect-ratio: 2/3;
  transform-style: preserve-3d;
  transform: rotateY(-18deg) rotateX(4deg);
  transition: transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
}
/* 鼠标悬停书体时，顺滑转向正脸并拉近 */
.detail-cover-section:hover .book-3d {
  transform: rotateY(0deg) rotateX(0deg) scale(1.08) translateY(-4px);
}
.detail-cover-section:hover .book-cover-face {
  box-shadow: 0 20px 40px rgba(0,0,0,0.25), 0 8px 16px rgba(0,0,0,0.1);
}

@keyframes bookFloat {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-12px); }
}
.book-spine {
  position: absolute; top: 0; bottom: 0; left: 0; width: 14px;
  background: linear-gradient(to right, #c7c7cc 0%, #e5e5ea 30%, #d1d1d6 60%, #a1a1a6 100%);
  border-radius: 4px 0 0 4px; transform: translateX(-11px);
  box-shadow: -2px 0 6px rgba(0,0,0,0.1);
}
.book-cover-face {
  position: relative; width: 100%; height: 100%;
  border-radius: 2px 10px 10px 2px; overflow: hidden; background: var(--hover-bg, #e8e8ed);
  box-shadow: 4px 10px 28px rgba(0,0,0,0.18), 1px 2px 8px rgba(0,0,0,0.08);
  transition: box-shadow 0.6s ease;
}
.book-cover-face img { width: 100%; height: 100%; object-fit: cover; display: block; }
.no-cover { font-size: 56px; color: var(--text-placeholder, #c7c7cc); opacity: 0.25; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
.cover-shine {
  position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0) 100%);
  pointer-events: none; animation: shineSweep 4s ease-in-out infinite 1s;
}
@keyframes shineSweep { 0%, 100% { left: -100%; } 50% { left: 120%; } }

/* 封面左上角入库/未入库徽章 */
.cover-library-badge {
  position: absolute; top: 12px; left: 12px;
  font-size: 12px; font-weight: 700;
  padding: 6px 12px; border-radius: 20px;
  z-index: 10; display: flex; align-items: center; gap: 5px;
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  transition: all 0.3s ease;
}
.cover-library-badge.collected {
  background: rgba(52, 199, 89, 0.85); color: #fff;
  box-shadow: 0 4px 12px rgba(52,199,89,0.3);
}
.cover-library-badge.not-collected {
  background: rgba(0, 0, 0, 0.5); color: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.cover-library-badge .fa-check-circle, .cover-library-badge .fa-circle { font-size: 13px; }

/* 封面右下角评分徽章 */
.cover-rating-capsule {
  position: absolute; bottom: 12px; right: 12px;
  display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px;
  border-radius: 12px; background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  color: #f5a623; font-size: 14px; font-weight: 700; line-height: 1; z-index: 3; pointer-events: none;
}
.cover-rating-capsule .fa-star { font-size: 12px; }
.book-pages {
  position: absolute; top: 4px; bottom: 4px; right: -5px; width: 10px;
  background: repeating-linear-gradient(90deg, #f0f0f3 0px, #e0e0e5 1px, #f5f5f7 2px, #e8e8ed 3px);
  border-radius: 0 8px 8px 0; box-shadow: 2px 0 4px rgba(0,0,0,0.05);
}
.book-shadow {
  position: absolute; bottom: -16px; left: 8%; width: 84%; height: 20px;
  background: radial-gradient(ellipse, rgba(0,0,0,0.18) 0%, transparent 75%);
  pointer-events: none; animation: shadowPulse 6s ease-in-out infinite;
}
@keyframes shadowPulse { 0%, 100% { transform: scaleX(0.9); opacity: 0.6; } 50% { transform: scaleX(1.05); opacity: 0.85; } }

/* ── 右侧：详细信息区 ── */
.detail-info-section { flex: 1; min-width: 0; }

.detail-header-wrap { margin-bottom: 24px; }
.detail-title-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.detail-title { font-size: 34px; font-weight: 800; color: var(--text-main, #1d1d1f); margin: 0; line-height: 1.25; letter-spacing: -0.02em; }
.detail-title.editable { cursor: text; border-radius: 8px; padding: 4px 10px; margin: -4px -10px; transition: background 0.15s; }
.detail-title.editable:hover { background: color-mix(in srgb, var(--apple-blue, #007AFF) 4%, transparent); }
.detail-title-input {
  font-size: 34px; font-weight: 800; color: var(--text-main); line-height: 1.25; letter-spacing: -0.02em;
  border: 2px solid var(--apple-blue, #007AFF); border-radius: 10px; padding: 2px 10px;
  background: var(--card-bg, #fff); outline: none; width: 100%; max-width: 500px; font-family: inherit;
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--apple-blue, #007AFF) 10%, transparent);
}

/* 书籍标题右侧的类目选择框（全新拟态胶囊样式） */
.title-category-wrap { display: inline-flex; align-items: center; margin-top: 4px; }
.title-category-select { min-width: 100px; }
.title-category-select :deep(.ant-select-selector) {
  background: var(--hover-bg, #f4f4f5) !important;
  color: var(--text-secondary, #666) !important;
  border: 1px solid var(--border-color, rgba(0,0,0,0.06)) !important;
  border-radius: 24px !important;
  padding: 0 16px !important;
  font-size: 14px;
  font-weight: 600;
  height: 32px !important;
  display: flex; align-items: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.02) !important;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.title-category-select :deep(.ant-select-selector:hover) {
  border-color: color-mix(in srgb, var(--apple-blue, #007AFF) 40%, transparent) !important;
  color: var(--apple-blue, #007AFF) !important;
  background: #ffffff !important;
  box-shadow: 0 4px 12px color-mix(in srgb, var(--apple-blue, #007AFF) 12%, transparent) !important;
}
.title-category-select :deep(.ant-select-selection-item) { line-height: 30px !important; }
.title-category-select :deep(.ant-select-arrow) { color: inherit; right: 12px; transition: color 0.3s; }

/* ── 现代化作者名片 (纯色背景设计) ── */
.author-card-modern {
  display: flex; align-items: flex-start; gap: 20px; padding: 22px 24px;
  background: #ffffff; /* 使用纯色背景，去除渐变 */
  border-radius: 24px; margin-bottom: 32px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: 0 8px 24px rgba(0,0,0,0.04);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.author-card-modern:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
.author-avatar-wrap { position: relative; width: 72px; height: 72px; border-radius: 20px; overflow: hidden; flex-shrink: 0; cursor: pointer; background: linear-gradient(135deg, var(--hover-bg, #e8e8ed) 0%, var(--border-color, #ddd) 100%); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.author-avatar-wrap .author-avatar-lg { width: 100%; height: 100%; object-fit: cover; }
.author-avatar-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 32px; color: var(--text-muted, #b0b0b8); }
.avatar-upload-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 20px; opacity: 0; transition: opacity 0.2s; }
.author-avatar-wrap:hover .avatar-upload-overlay { opacity: 1; }
.author-info-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8px; padding-top: 2px; }
.author-name-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.author-name-text { font-size: 18px; font-weight: 700; color: var(--text-main, #1d1d1f); cursor: text; padding: 2px 6px; margin: -2px -6px; border-radius: 6px; transition: background 0.15s; }
.author-name-text:hover { background: color-mix(in srgb, var(--apple-blue, #007AFF) 6%, transparent); }
.author-inline-input { border: 1.5px solid var(--apple-blue, #007AFF); border-radius: 6px; padding: 3px 8px; font-size: 16px; font-weight: 700; color: var(--text-main); background: var(--card-bg, #fff); outline: none; width: 180px; }
.author-summary-row { width: 100%; }
.author-summary-text { font-size: 14px; color: var(--text-secondary, #555); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; cursor: text; padding: 4px 6px; margin: -4px -6px; border-radius: 6px; transition: background 0.15s; }
.author-summary-text:hover { background: color-mix(in srgb, var(--apple-blue, #007AFF) 4%, transparent); }
.author-summary-text.empty { color: var(--text-muted, #b0b0b8); font-style: italic; }
.author-inline-textarea { width: 100%; border: 1.5px solid var(--apple-blue, #007AFF); border-radius: 8px; padding: 8px 12px; font-size: 14px; color: var(--text-main); background: var(--card-bg, #fff); outline: none; resize: none; overflow: hidden; font-family: inherit; line-height: 1.6; }

/* ── Bento Box 元数据便当盒 (三宫格版设计，字体统一) ── */
.detail-meta-bento { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 36px; }
.bento-item {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 20px; padding: 20px 24px;
  box-shadow: 0 10px 24px rgba(0,0,0, 0.06), 0 2px 8px rgba(0,0,0, 0.02);
  display: flex; align-items: flex-start; gap: 16px; transition: all 0.3s ease;
}
.bento-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(0,0,0, 0.1), 0 4px 12px rgba(0,0,0, 0.04);
  border-color: rgba(0,0,0,0.18);
}
.bento-icon { width: 48px; height: 48px; border-radius: 14px; background: color-mix(in srgb, var(--apple-blue, #007AFF) 12%, transparent); display: flex; align-items: center; justify-content: center; color: var(--apple-blue, #007AFF); font-size: 20px; flex-shrink: 0; }
.bento-content { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.bento-label { font-size: 13px; font-weight: 500; color: var(--text-secondary, #86868b); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 2px; }

/* 统一字体大小、粗细与家族 */
.bento-value, .bento-value.mono {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main, #1d1d1f);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  letter-spacing: 0.01em;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
.bento-value.mono { letter-spacing: 0.03em; } /* ISBN稍微拉开点字距 */

.bento-value.empty { color: var(--text-muted, #b0b0b8); cursor: pointer; font-weight: 500; }
.bento-value.editable { cursor: text; transition: color 0.2s; }
.bento-value.editable:hover { color: var(--apple-blue, #007AFF); }
.meta-bento-input { width: 100%; border: 1.5px solid var(--apple-blue, #007AFF); border-radius: 6px; padding: 2px 6px; font-size: 16px; font-weight: 600; color: var(--text-main); background: var(--card-bg, #fff); outline: none; }

/* ── 内容简介引用区 (优化引号与水印排版) ── */
.detail-summary-modern {
  margin-bottom: 24px; padding: 36px 40px;
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid rgba(0,0,0,0.08);
  box-shadow: 0 16px 40px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02);
  position: relative; overflow: hidden;
}
.summary-watermark {
  position: absolute; right: 24px; bottom: -20px;
  font-size: 160px; color: var(--text-main);
  opacity: 0.02; pointer-events: none; z-index: 1;
  transform: rotate(0deg); line-height: 1;
}
.summary-header { position: relative; z-index: 2; display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
.summary-header .quote-icon-wrap { width: 36px; height: 36px; border-radius: 12px; background: color-mix(in srgb, var(--apple-blue, #007AFF) 10%, transparent); display: flex; align-items: center; justify-content: center; }
.summary-header .quote-icon { font-size: 16px; color: var(--apple-blue, #007AFF); }
.summary-header h3 { font-size: 20px; font-weight: 800; color: var(--text-main); margin: 0; letter-spacing: -0.01em; }
.summary-body { position: relative; z-index: 2; }
.summary-body .editable-summary { font-size: 15px; line-height: 1.85; color: var(--text-secondary, #48484a); cursor: text; padding: 6px 10px; margin: -6px -10px; border-radius: 8px; transition: background 0.2s; text-align: justify; }
.summary-body .editable-summary:hover { background: rgba(0,0,0, 0.03); }
.summary-textarea { width: 100%; min-height: 120px; padding: 16px 20px; border: 1.5px solid var(--apple-blue, #007AFF); border-radius: 12px; font-size: 15px; line-height: 1.85; color: var(--text-main); background: var(--hover-bg, #f5f5f7); outline: none; resize: none; overflow: hidden; font-family: inherit; }

/* ── 底部操作按钮 ── */
.detail-actions-footer { display: flex; align-items: center; justify-content: center; gap: 24px; margin-top: 48px; padding-top: 36px; border-top: 1px solid rgba(0,0,0,0.08); }
.btn-glass-primary { min-width: 240px; display: flex; align-items: center; justify-content: center; gap: 8px; height: 56px; border-radius: 18px; background: var(--apple-blue, #007AFF); color: #fff; font-size: 16px; font-weight: 600; border: none; box-shadow: 0 8px 20px color-mix(in srgb, var(--apple-blue, #007AFF) 30%, transparent); cursor: pointer; transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }
.btn-glass-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 28px color-mix(in srgb, var(--apple-blue, #007AFF) 40%, transparent); filter: brightness(1.05); }
.btn-glass-primary:active:not(:disabled) { transform: scale(0.97); }
.btn-glass-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
.btn-glass-primary.is-collected { background: #34c759; box-shadow: 0 8px 20px rgba(52,199,89,0.3); }
.btn-glass-primary.is-collected:hover { filter: brightness(0.95); box-shadow: 0 12px 28px rgba(52,199,89,0.4); }
.btn-glass-secondary { min-width: 200px; display: flex; align-items: center; justify-content: center; gap: 8px; height: 56px; border-radius: 18px; background: rgba(255,255,255, 0.7); backdrop-filter: blur(10px); color: var(--text-main); font-size: 16px; font-weight: 600; border: 1px solid rgba(0,0,0,0.1); box-shadow: 0 4px 12px rgba(0,0,0,0.03); text-decoration: none; cursor: pointer; transition: all 0.3s ease; }
.btn-glass-secondary:hover { background: #fff; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.06); color: #00b51a; border-color: rgba(0,181,26, 0.3); }
.btn-glass-secondary:active { transform: scale(0.97); }
.btn-glass-secondary img { width: 22px; height: 22px; }

/* 响应式调整 */
@media (max-width: 768px) {
  .douban-result-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .detail-card { flex-direction: column; gap: 40px; }
  .detail-cover-section { width: 220px; margin: 0 auto; }
  .detail-card-wrapper { padding: 32px 24px; }
  .detail-meta-bento { grid-template-columns: 1fr; gap: 12px; }
  .detail-actions-footer { flex-direction: column; gap: 16px; }
  .btn-glass-primary, .btn-glass-secondary { width: 100%; min-width: auto; }
  .hero-title { font-size: 32px; }
  .search-hero.is-initial { padding: 4vh 0 2vh; }
  .search-hero-bar { height: 56px; padding: 0 8px 0 16px; }
  .hero-search-btn { padding: 0 20px; font-size: 15px; }
}
</style>

<style>
/* ================================================================
   全局 & 暗黑模式完美适配
   ================================================================ */

/* ── 返回按钮与搜索按钮 ── */
.dark .back-btn-outlined, .dark .hero-search-btn {
  background: #ffffff; color: #000000; box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}
.dark .back-icon { color: #000000; }
.dark .back-btn-outlined:hover, .dark .hero-search-btn:hover:not(:disabled) {
  background: #e5e5ea; box-shadow: 0 6px 16px rgba(255, 255, 255, 0.15);
}
.dark .back-btn-outlined:hover .back-icon { color: #000000; }
.dark .hero-search-btn:disabled { background: rgba(255, 255, 255, 0.15); color: rgba(255, 255, 255, 0.4); }

.dark .hero-subtitle { color: #98989d; }
.dark .hero-title { background: linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.dark .search-hero-bar { background: rgba(30, 30, 30, 0.6); border-color: rgba(255,255,255,0.1); box-shadow: 0 12px 32px rgba(0,0,0,0.5); }
.dark .search-hero-bar:focus-within { background: rgba(40, 40, 40, 0.85); border-color: color-mix(in srgb, var(--apple-blue, #0A84FF) 50%, transparent); box-shadow: 0 20px 48px color-mix(in srgb, var(--apple-blue, #0A84FF) 16%, transparent), 0 0 0 5px color-mix(in srgb, var(--apple-blue, #0A84FF) 20%, transparent); }
.dark .search-hero-bar input { color: #f5f5f7; }

/* ── 空状态与旧卡片 ── */
.dark .empty-state-icon.muted::after { background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 60%); }
.dark .empty-state-icon { background: rgba(10, 132, 255, 0.12); box-shadow: 0 12px 32px rgba(10,132,255,0.08), inset 0 1px 0 rgba(255,255,255,0.06); }
.dark .empty-state-icon.muted { background: rgba(255,255,255,0.04); box-shadow: 0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03); }
.dark .empty-ring-ring { border-color: color-mix(in srgb, var(--apple-blue, #0A84FF) 42%, transparent); }
.dark .empty-ring-ring.ring-outer { border-color: color-mix(in srgb, var(--apple-blue, #0A84FF) 30%, transparent); }
.dark .empty-ring-ring.ring-far { border-color: color-mix(in srgb, var(--apple-blue, #0A84FF) 20%, transparent); }
.dark .empty-state-sep { background: color-mix(in srgb, var(--apple-blue, #0A84FF) 25%, transparent); }
.dark .douban-book-card { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.06); box-shadow: 0 1px 3px rgba(0,0,0,0.15); }
.dark .douban-book-card:hover { border-color: color-mix(in srgb, var(--apple-blue, #0A84FF) 35%, transparent); box-shadow: 0 12px 28px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.15); }
.dark .card-cover { box-shadow: 0 2px 8px rgba(0,0,0,0.25); }
.dark .cover-overlay { box-shadow: inset 0 0 0 1px rgba(255,255,255,0.05); }

/* ================= 详情页全新暗黑适配 ================= */
.dark .detail-card-wrapper {
  background: rgba(30, 30, 30, 0.55);
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.12); /* 增强暗黑底色边框 */
}

/* 3D 封面暗色优化 */
.dark .book-cover-face { box-shadow: 4px 8px 24px rgba(0,0,0,0.4), 1px 2px 6px rgba(0,0,0,0.2); background: rgba(255,255,255,0.02); }
.dark .book-spine { background: linear-gradient(to right, #4a4a50 0%, #5a5a62 30%, #4a4a50 60%, #3a3a42 100%); box-shadow: -2px 0 4px rgba(0,0,0,0.2); }
.dark .book-pages { background: repeating-linear-gradient(90deg, #3a3a42 0px, #2e2e35 1px, #3d3d45 2px, #33333a 3px); }
.dark .cover-rating-capsule { background: rgba(30, 30, 30, 0.7); }

/* 书籍标题侧边类目 (胶囊模式暗黑版) */
.dark .title-category-select :deep(.ant-select-selector) {
  background: rgba(255, 255, 255, 0.06) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  color: rgba(255, 255, 255, 0.8) !important;
}
.dark .title-category-select :deep(.ant-select-selector:hover) {
  background: rgba(255, 255, 255, 0.12) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
  color: #fff !important;
}

/* 作者卡片与 Bento 便当盒 (去除渐变后使用纯色深色) */
.dark .author-card-modern {
  background: rgba(40, 40, 40, 0.8);
  border-color: rgba(255,255,255,0.08);
}
.dark .bento-item { background: rgba(45, 45, 45, 0.8); border-color: rgba(255,255,255,0.1); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
.dark .bento-item:hover { background: rgba(60, 60, 60, 1); border-color: rgba(255,255,255,0.15); }
.dark .bento-icon { background: rgba(255,255,255,0.08); }
.dark .meta-bento-input { background: #222; }

/* 提升暗黑模式下作者简介文本亮度和清晰度 */
.dark .author-summary-text { color: rgba(255, 255, 255, 0.85); font-weight: 400; }
.dark .author-summary-text.empty { color: rgba(255, 255, 255, 0.4); }

/* 简介区 */
.dark .detail-summary-modern { background: rgba(45, 45, 45, 0.7); border-color: rgba(255,255,255,0.08); box-shadow: 0 16px 40px rgba(0,0,0,0.3); }
.dark .summary-watermark { color: #ffffff; opacity: 0.02; }
.dark .summary-header .quote-icon-wrap { background: rgba(255,255,255,0.1); }
.dark .summary-header .quote-icon { color: #fff; }
/* 提升暗黑模式下内容简介文本亮度和清晰度 */
.dark .summary-body .editable-summary { color: rgba(255, 255, 255, 0.85); font-weight: 400; }
.dark .summary-body .editable-summary:hover { background: rgba(255,255,255,0.06); }

.dark .summary-textarea, .dark .author-inline-textarea, .dark .author-inline-input { background: #222; color: #fff; border-color: rgba(255,255,255,0.15); }

/* 底部辅助按钮区域 */
.dark .detail-actions-footer { border-top-color: rgba(255,255,255,0.08); }
.dark .btn-glass-secondary { background: rgba(50,50,50, 0.6); border-color: rgba(255,255,255,0.1); color: #fff; }
.dark .btn-glass-secondary:hover { background: rgba(70,70,70, 0.9); }
.dark .loading-card, .dark .error-card { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.06); }
</style>
