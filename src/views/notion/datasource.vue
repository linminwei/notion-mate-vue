<template>
  <div class="neo-datasource-container">
    <aside class="neo-sidebar">
      <div class="sidebar-header">
        <h2 class="sidebar-title">工作区</h2>
      </div>

      <div class="sidebar-search-wrapper">
        <div class="capsule-search">
          <div class="search-inputs">
            <input
              v-model="workspaceSearchForm.workspaceName"
              type="text"
              placeholder="名称"
              @keyup.enter="handleWorkspaceSearch"
            />
            <div class="divider"></div>
            <input
              v-model="workspaceSearchForm.workspaceCode"
              type="text"
              placeholder="编码"
              @keyup.enter="handleWorkspaceSearch"
            />
          </div>
          <div class="search-actions">
            <button class="search-trigger" title="搜索" @click="handleWorkspaceSearch">
              <font-awesome-icon :icon="['fas', 'search']" />
            </button>
            <button class="search-trigger reset-btn" title="重置" @click="handleWorkspaceReset">
              <font-awesome-icon :icon="['fas', 'redo']" />
            </button>
          </div>
        </div>
      </div>

      <div class="sidebar-list-container">
        <a-spin :spinning="workspaceLoading">
          <div v-if="filteredWorkspaces.length > 0" class="neo-list">
            <div
              v-for="workspace in filteredWorkspaces"
              :key="workspace.id"
              class="neo-list-item workspace-list-item"
              :class="{ 'is-active': searchForm.workspaceId === workspace.id }"
              @click="selectWorkspace(workspace.id)"
            >
              <div class="item-prefix">
                <span class="workspace-mini-icon">
                  <img
                    v-if="isImage(workspace.icon)"
                    :src="workspace.icon"
                    alt=""
                    @error="handleImgError"
                  />
                  <span v-else-if="workspace.icon">{{ workspace.icon }}</span>
                  <font-awesome-icon v-else :icon="['fab', 'notion']" />
                </span>
              </div>

              <div class="item-content">
                <div class="item-title">{{ workspace.name || '未命名工作区' }}</div>
                <div class="item-subtitle">{{ workspace.code || '-' }}</div>
              </div>

              <div class="item-tail">
                <font-awesome-icon :icon="['fas', 'chevron-right']" />
              </div>
            </div>
          </div>

          <div v-else class="sidebar-empty-wrap">
            <div class="modern-empty-card mini">
              <div class="modern-empty-illus">
                <div class="mockup-window">
                  <div class="mockup-header">
                    <div class="mockup-dot"></div>
                    <div class="mockup-line short"></div>
                  </div>
                  <div class="mockup-row">
                    <div class="mockup-avatar"></div>
                    <div class="mockup-line"></div>
                  </div>
                </div>
              </div>
              <div class="modern-empty-content">
                <h4 class="modern-empty-title">{{ workspaces.length ? '未找到工作区' : '暂无工作区' }}</h4>
                <p class="modern-empty-desc">
                  {{ workspaces.length ? '请调整筛选条件' : '请先完成基础配置' }}
                </p>
                <button v-if="!workspaces.length" class="modern-empty-btn mini-btn" @click="goToConfig">
                  <font-awesome-icon :icon="['fas', 'arrow-right']" />
                  前往基础配置
                </button>
              </div>
            </div>
          </div>
        </a-spin>
      </div>

      <div class="sidebar-footer">
        <div class="custom-pagination">
          <button class="page-btn" disabled>
            <font-awesome-icon :icon="['fas', 'chevron-left']" />
          </button>
          <div class="page-stats">本页 {{ filteredWorkspaces.length }} 条</div>
          <button class="page-btn" disabled>
            <font-awesome-icon :icon="['fas', 'chevron-right']" />
          </button>
        </div>
      </div>
    </aside>

    <main class="neo-main">
      <div v-if="!activeWorkspace" class="neo-empty-state">
        <div class="modern-empty-card">
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
            <h3 class="modern-empty-title">
              {{ workspaces.length > 0 ? '数据源管理中心' : '等待工作区配置' }}
            </h3>
            <p class="modern-empty-desc">
              {{
                workspaces.length > 0
                  ? '请在左侧选择一个工作区，\n以查看和管理其数据源与字段结构。'
                  : '完成基础配置后，\n这里会展示可同步的数据源。'
              }}
            </p>
            <button v-if="!workspaces.length" class="modern-empty-btn" @click="goToConfig">
              <font-awesome-icon :icon="['fas', 'arrow-right']" />
              前往基础配置
            </button>
          </div>
        </div>
      </div>

      <div v-else class="neo-data-view fade-in">
        <header class="data-header">
          <div class="header-info">
            <div class="title-row">
              <h1>{{ activeWorkspace.name || '未命名工作区' }}</h1>
            </div>
            <p class="dict-remark">
              同步并查看当前工作区下的 Notion 数据源，字段结构可从右侧抽屉查看。
            </p>
          </div>
        </header>

        <div class="data-toolbar">
          <div class="capsule-search data-capsule">
            <div class="search-inputs">
              <input
                v-model="searchForm.title"
                type="text"
                placeholder="搜索数据源标题"
                @keyup.enter="handleSearch"
              />
            </div>
            <div class="search-actions">
              <button class="search-trigger" title="搜索" @click="handleSearch">
                <font-awesome-icon :icon="['fas', 'search']" />
              </button>
              <button class="search-trigger reset-btn" title="重置" @click="handleReset">
                <font-awesome-icon :icon="['fas', 'redo']" />
              </button>
            </div>
          </div>

          <div class="data-actions">
            <button
              v-if="canSyncDatasource"
              class="sync-action-btn"
              :disabled="syncing"
              title="同步数据源"
              @click="handleSync"
            >
              <font-awesome-icon :icon="['fas', syncing ? 'spinner' : 'rotate']" :class="{ spin: syncing }" />
              <span>{{ syncing ? '同步中' : '同步数据源' }}</span>
            </button>
            <button
              v-if="canDeleteDatasource && selectedRowKeys.length > 0"
              class="delete-action-btn"
              :disabled="deleteConfirmLoading"
              title="删除数据源"
              @click="confirmBatchDelete"
            >
              <font-awesome-icon :icon="['fas', 'trash']" />
              <span>删除 {{ selectedRowKeys.length }} 项</span>
            </button>
          </div>
        </div>

        <div class="data-table-wrapper neo-table-flex-container">
          <a-spin :spinning="loading" wrapperClassName="data-spin-wrap">
            <div v-if="tableData.length === 0" class="data-empty-container fade-in">
              <div class="modern-empty-card">
                <div class="modern-empty-illus">
                  <div class="mockup-window">
                    <div class="mockup-header">
                      <div class="mockup-dot"></div>
                      <div class="mockup-line short"></div>
                    </div>
                    <div class="mockup-row">
                      <font-awesome-icon :icon="['fas', 'database']" class="mockup-star" />
                      <div class="mockup-avatar"></div>
                      <div class="mockup-line"></div>
                    </div>
                    <div class="mockup-row">
                      <font-awesome-icon :icon="['fas', 'table-columns']" class="mockup-star" />
                      <div class="mockup-avatar"></div>
                      <div class="mockup-line shorter"></div>
                    </div>
                  </div>
                </div>
                <div class="modern-empty-content">
                  <h3 class="modern-empty-title">{{ loading ? '正在读取数据源' : '该工作区暂无数据源' }}</h3>
                  <p class="modern-empty-desc">
                    {{ loading ? '请稍候，正在读取 Notion 数据源。' : '点击同步按钮后，系统会读取当前工作区下的数据源。' }}
                  </p>
                  <button
                    v-if="canSyncDatasource && !loading"
                    class="modern-empty-btn"
                    :disabled="syncing"
                    @click="handleSync"
                  >
                    <font-awesome-icon :icon="['fas', syncing ? 'spinner' : 'rotate']" :class="{ spin: syncing }" />
                    同步数据源
                  </button>
                </div>
              </div>
            </div>

            <a-table
              v-else
              class="neo-table datasource-table"
              row-key="id"
              :columns="datasourceColumns"
              :data-source="tableData"
              :pagination="false"
              :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
              :scroll="{ x: 920 }"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'datasource'">
                  <div class="datasource-name-cell">
                    <span
                      class="datasource-avatar"
                      :class="{ 'icon-uploading': iconUploadingId === record.id }"
                      @click="triggerIconUpload(record)"
                    >
                      <span v-if="iconUploadingId === record.id" class="icon-upload-spinner">
                        <font-awesome-icon :icon="['fas', 'spinner']" spin />
                      </span>
                      <template v-else>
                        <img
                          v-if="isImage(record.iconUrl)"
                          :src="record.iconUrl"
                          alt=""
                          @error="handleImgError"
                        />
                        <span v-else-if="record.iconUrl">{{ record.iconUrl }}</span>
                        <font-awesome-icon v-else :icon="['fas', 'image']" />
                      </template>
                    </span>
                    <span class="datasource-copy">
                      <input
                        v-if="canEditDatasource && editingTitleId === record.id"
                        v-model="editingTitleValue"
                        class="inline-title-input"
                        :data-title-edit-id="record.id"
                        type="text"
                        maxlength="80"
                        @click.stop
                        @blur="handleTitleInputBlur(record)"
                        @keydown.enter.prevent="handleTitleEnter"
                        @keydown.esc.prevent="cancelInlineTitleEdit"
                      />
                      <button
                        v-else-if="canEditDatasource"
                        class="cell-title-edit"
                        type="button"
                        title="点击编辑标题"
                        @click.stop="startInlineTitleEdit(record)"
                      >
                        <span>{{ record.title || '未命名数据源' }}</span>
                        <font-awesome-icon :icon="['fas', 'pen']" />
                      </button>
                      <span v-else class="cell-label">{{ record.title || '未命名数据源' }}</span>
                      <span class="cell-muted">{{ record.workspaceName || activeWorkspace?.name || '-' }}</span>
                    </span>
                  </div>
                </template>

                <template v-else-if="column.key === 'datasourceId'">
                  <span class="mono-badge datasource-id-badge">{{ record.datasourceId || '-' }}</span>
                </template>

                <template v-else-if="column.key === 'updateTime'">
                  <span class="time-cell">{{ formatDateTime(record.updateTime || record.createTime) }}</span>
                </template>

                <template v-else-if="column.key === 'action'">
                  <div class="action-btn-group">
                    <button class="text-action-btn primary" @click="openProperties(record)">字段配置</button>
                  </div>
                </template>
              </template>
            </a-table>
          </a-spin>

          <div v-if="pagination.total > 0" class="datasource-pagination-bar">
            <a-pagination
              :current="pagination.current"
              :page-size="pagination.pageSize"
              :total="pagination.total"
              :show-size-changer="pagination.showSizeChanger"
              :show-total="pagination.showTotal"
              @change="handlePageChange"
              @show-size-change="handlePageSizeChange"
            />
          </div>
        </div>
      </div>
    </main>

    <a-drawer
      v-if="currentDatasource"
      v-model:open="propertyDrawerVisible"
      class="datasource-property-drawer"
      placement="right"
      :width="560"
      :mask="false"
      :destroy-on-close="false"
    >
      <template #title>
        <div class="drawer-title">
          <span
            class="drawer-source-icon"
            :class="{ 'icon-uploading': iconUploadingId === currentDatasource?.id }"
            @click="triggerIconUpload(currentDatasource!)"
          >
            <span v-if="iconUploadingId === currentDatasource?.id" class="icon-upload-spinner">
              <font-awesome-icon :icon="['fas', 'spinner']" spin />
            </span>
            <template v-else>
              <img
                v-if="currentDatasource && isImage(drawerIcon)"
                :src="drawerIcon"
                alt=""
                @error="handleImgError"
              />
              <span v-else-if="drawerIcon">{{ drawerIcon }}</span>
              <font-awesome-icon v-else :icon="['fas', 'image']" />
            </template>
          </span>
          <span>
            <strong>{{ currentDatasource?.title || '未命名数据源' }}</strong>
            <small>{{ currentDatasource?.datasourceId || '-' }}</small>
          </span>
        </div>
      </template>

      <div class="drawer-content">
        <div v-if="currentDatasource" class="drawer-summary">
          <div class="summary-stat">
            <span class="summary-stat-value">{{ properties.length || 0 }}</span>
            <span class="summary-stat-label">字段数量</span>
          </div>
          <div class="summary-stat">
            <span class="summary-stat-value">{{ uniqueTypeCount }}</span>
            <span class="summary-stat-label">类型数量</span>
          </div>
        </div>

        <a-spin :spinning="propertyLoading" wrapperClassName="property-spin">
          <template v-if="properties.length > 0">
            <section class="property-config-card">
              <div class="property-config-separator"></div>

              <div class="property-list">
                <div
                  v-for="property in properties"
                  :key="property.propertyId"
                  class="property-item"
                >
                  <span class="property-type-icon" :style="getTypeColorStyle(property.propertyType)">
                    <font-awesome-icon :icon="getPropertyIcon(property.propertyType)" />
                  </span>
                  <span class="property-main">
                    <strong>{{ property.propertyName || '未命名字段' }}</strong>
                    <small>{{ property.propertyId || '-' }}</small>
                  </span>
                  <button
                    class="property-type property-type-clickable"
                    :style="getTypeColorStyle(property.propertyType)"
                    type="button"
                    @click.stop="openPropertyDetail(property)"
                  >
                    {{ normalizeType(property.propertyType) }}
                    <font-awesome-icon :icon="['fas', 'arrow-up-right-from-square']" class="type-link-icon" />
                  </button>
                  <button class="property-more-btn" type="button" title="更多">
                    <font-awesome-icon :icon="['fas', 'ellipsis']" />
                  </button>
                </div>
              </div>

              <button class="property-add-btn" type="button" disabled>
                <font-awesome-icon :icon="['fas', 'plus']" />
                <span>添加新字段</span>
              </button>
            </section>
          </template>

          <div v-else class="property-empty">
            <div class="property-empty-icon">
              <font-awesome-icon :icon="['fas', 'table-columns']" />
            </div>
            <strong>{{ propertyLoading ? '正在读取字段' : '暂无字段' }}</strong>
            <small>{{ propertyLoading ? '请稍候' : '该数据源暂未同步到字段结构' }}</small>
          </div>
        </a-spin>
      </div>
    </a-drawer>

    <!-- 属性详情抽屉 -->
    <a-drawer
      v-if="selectedProperty"
      v-model:open="propertyDetailVisible"
      class="property-detail-drawer"
      placement="right"
      :width="400"
      :mask="false"
      :destroy-on-close="false"
    >
      <template #title>
        <span class="detail-panel-title">属性详情</span>
      </template>

      <div
        class="detail-inspector"
        :style="{
          '--accent-bg': getTypeColorStyle(selectedProperty!.propertyType)['--type-bg'] || '#f0f0f0',
          '--accent-text': getTypeColorStyle(selectedProperty!.propertyType)['--type-text'] || '#555',
        }"
      >
        <section class="detail-name-panel">
          <span class="detail-label">属性名称</span>
          <h3>{{ selectedProperty!.propertyName || '未命名字段' }}</h3>
        </section>

        <section class="detail-type-panel">
          <span class="detail-label">属性类型</span>
          <div class="detail-type-card">
            <span class="detail-type-icon" :style="getTypeColorStyle(selectedProperty!.propertyType)">
              <font-awesome-icon :icon="getPropertyIcon(selectedProperty!.propertyType)" />
            </span>
            <span class="detail-type-name">{{ normalizeType(selectedProperty!.propertyType) }}</span>
          </div>
        </section>

        <!-- 选项 -->
        <template v-if="showDetailOptions">
          <section class="detail-options-panel">
            <div class="detail-options-head">
              <span class="detail-label">选项</span>
              <span class="detail-count">{{ selectedProperty!.options?.length }}</span>
            </div>
            <div class="detail-option-grid">
              <span
                v-for="(opt, index) in selectedProperty!.options"
                :key="opt.id"
                class="detail-option-pill"
                :style="{ ...optionChipStyle(opt.color), animationDelay: index * 0.03 + 's' }"
              >
                <span class="detail-option-color"></span>
                <span class="detail-option-name">{{ opt.name }}</span>
              </span>
            </div>
          </section>
        </template>

        <template v-else-if="hasOptionsType">
          <section class="detail-options-panel">
            <div class="detail-options-head">
              <span class="detail-label">选项</span>
              <span class="detail-count">0</span>
            </div>
            <div class="detail-empty-state">
              <span>暂无选项</span>
            </div>
          </section>
        </template>
      </div>
    </a-drawer>

    <AppleConfirmModal
      v-model:visible="deleteConfirmVisible"
      type="danger"
      title="删除数据源"
      :desc="deleteConfirmDesc"
      confirmText="确认删除"
      :loading="deleteConfirmLoading"
      @confirm="executeDelete"
    />

    <AppleConfirmModal
      v-model:visible="titleConfirmVisible"
      type="warning"
      title="保存标题变更"
      :desc="titleConfirmDesc"
      confirmText="保存"
      cancelText="放弃"
      :loading="titleSubmitLoading"
      @confirm="executeTitleUpdate"
      @cancel="cancelPendingTitleUpdate"
    />

    <!-- 隐藏的上传图标文件输入 -->
    <input
      ref="iconFileInput"
      type="file"
      accept="image/png, image/jpeg, image/webp, image/svg+xml"
      class="icon-hidden-input"
      @change="handleIconFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  getCurrentUserWorkspaces,
  getDatasourcePage,
  getDatasourceProperties,
  deleteDatasourceBatch,
  updateDatasourceTitle,
  updateDatasourceIcon,
  uploadNotionFile,
  syncDatasource
} from '@/api/notion.ts'
import type { Datasource, NotionDatasourceProperty, Workspace } from '@/types'
import { AppleAlert } from '@/components/common/AppleAlert.ts'
import AppleConfirmModal from '@/components/common/AppleConfirmModal.vue'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const syncing = ref(false)
const workspaceLoading = ref(false)
const propertyLoading = ref(false)
const propertyDrawerVisible = ref(false)
const propertyDetailVisible = ref(false)
const selectedProperty = ref<NotionDatasourceProperty | null>(null)

const workspaces = ref<Workspace[]>([])
const tableData = ref<Datasource[]>([])
const properties = ref<NotionDatasourceProperty[]>([])
const currentDatasource = ref<Datasource | null>(null)
const selectedRowKeys = ref<string[]>([])
const editingTitleId = ref('')
const editingTitleValue = ref('')
const pendingTitleTarget = ref<Datasource | null>(null)
const pendingTitleValue = ref('')
const titleConfirmVisible = ref(false)
const titleSubmitLoading = ref(false)

const deleteConfirmVisible = ref(false)
const deleteConfirmLoading = ref(false)

const iconFileInput = ref<HTMLInputElement | null>(null)
const iconUploadTarget = ref<Datasource | null>(null)
const iconUploadingId = ref('')
const deleteConfirmDesc = computed(() =>
  `确定要删除选中的 ${selectedRowKeys.value.length} 个数据源吗？此操作不可恢复。`
)
const titleConfirmDesc = computed(() =>
  `确定将数据源标题修改为「${pendingTitleValue.value}」吗？该变更会同步更新到 Notion。`
)
const canDeleteDatasource = computed(() => userStore.hasPermission('datasource:delete'))
const canSyncDatasource = computed(() => userStore.hasPermission('datasource:sync'))
const canEditDatasource = computed(() => userStore.hasPermission('datasource:edit'))

/**
 * 抽屉中当前数据源的图标。
 * 兼容 Datasource.icon 与 DatasourceVo.iconUrl 两种字段名。
 */
const drawerIcon = computed(() => {
  const ds = currentDatasource.value as any
  return ds?.iconUrl || ds?.icon || ''
})

const workspaceSearchForm = reactive({
  workspaceName: '',
  workspaceCode: ''
})

const searchForm = reactive({
  workspaceId: '',
  title: '',
  pageNum: 1,
  pageSize: 8
})

const pagination = reactive({
  current: 1,
  pageSize: 8,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`
})

const datasourceColumns = [
  { title: '数据源', key: 'datasource', width: 300 },
  { title: '数据源 ID', key: 'datasourceId', width: 320 },
  { title: '操作', key: 'action', width: 110, align: 'center' }
]

const activeWorkspace = computed(() => workspaces.value.find(item => item.id === searchForm.workspaceId) || null)
const filteredWorkspaces = computed(() => {
  const name = workspaceSearchForm.workspaceName.trim().toLowerCase()
  const code = workspaceSearchForm.workspaceCode.trim().toLowerCase()

  return workspaces.value.filter(item => {
    const workspaceName = (item.name || '').toLowerCase()
    const workspaceCode = (item.code || '').toLowerCase()
    return (!name || workspaceName.includes(name)) && (!code || workspaceCode.includes(code))
  })
})

const isImage = (value?: string | null) => {
  if (!value) return false
  return value.startsWith('data:image') || value.startsWith('http://') || value.startsWith('https://')
}

const handleImgError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return dateStr
  const pad = (value: number) => String(value).padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const normalizeType = (type?: string) => type || 'unknown'

/** 属性字段的去重类型数量 */
const uniqueTypeCount = computed(() => {
  const types = new Set(properties.value.map(p => normalizeType(p.propertyType)))
  return types.size
})

/** 属性类型 → 色彩映射（与图标配色保持一致） */
const PROPERTY_TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  title:            { bg: '#E8F5E9', text: '#2E7D32' },
  rich_text:        { bg: '#E3F2FD', text: '#1565C0' },
  number:           { bg: '#FFF3E0', text: '#E65100' },
  select:           { bg: '#F3E5F5', text: '#7B1FA2' },
  multi_select:     { bg: '#EDE7F6', text: '#4A148C' },
  date:             { bg: '#E0F7FA', text: '#00695C' },
  checkbox:         { bg: '#FFF8E1', text: '#F57F17' },
  url:              { bg: '#E8EAF6', text: '#1A237E' },
  email:            { bg: '#FCE4EC', text: '#880E4F' },
  phone_number:     { bg: '#F1F8E9', text: '#33691E' },
  people:           { bg: '#E1F5FE', text: '#01579B' },
  files:            { bg: '#EFEBE9', text: '#3E2723' },
  relation:         { bg: '#F9FBE7', text: '#827717' },
  rollup:           { bg: '#E0F2F1', text: '#004D40' },
  formula:          { bg: '#FBE9E7', text: '#BF360C' },
  status:           { bg: '#E8F5E9', text: '#1B5E20' },
  created_time:     { bg: '#ECEFF1', text: '#37474F' },
  created_by:       { bg: '#E1F5FE', text: '#01579B' },
  last_edited_time: { bg: '#ECEFF1', text: '#37474F' },
  last_edited_by:   { bg: '#E1F5FE', text: '#01579B' }
}

const getTypeColorStyle = (type?: string) => {
  const colors = PROPERTY_TYPE_COLORS[type || ''] || { bg: '#F5F5F5', text: '#616161' }
  return {
    '--type-bg': colors.bg,
    '--type-text': colors.text
  } as Record<string, string>
}

const getPropertyIcon = (type?: string): [string, string] => {
  const map: Record<string, [string, string]> = {
    title: ['fas', 'heading'],
    rich_text: ['fas', 'font'],
    number: ['fas', 'hashtag'],
    select: ['fas', 'list'],
    multi_select: ['fas', 'tags'],
    date: ['fas', 'calendar-days'],
    checkbox: ['fas', 'square-check'],
    url: ['fas', 'link'],
    email: ['fas', 'envelope'],
    phone_number: ['fas', 'phone'],
    people: ['fas', 'users'],
    files: ['fas', 'paperclip'],
    relation: ['fas', 'diagram-project'],
    rollup: ['fas', 'chart-simple'],
    formula: ['fas', 'calculator'],
    status: ['fas', 'circle-half-stroke'],
    created_time: ['fas', 'clock'],
    created_by: ['fas', 'user-plus'],
    last_edited_time: ['fas', 'clock-rotate-left'],
    last_edited_by: ['fas', 'user-pen']
  }
  return map[type || ''] || ['fas', 'columns']
}

/** 有选项的选择类属性类型 */
const SELECT_TYPES = new Set(['select', 'multi_select', 'status'])

/** 详情抽屉中是否展示选项 */
const showDetailOptions = computed(() => {
  const p = selectedProperty.value
  return p && SELECT_TYPES.has(p.propertyType) && p.options && p.options.length > 0
})

/** 是否为选项类属性（但可能无选项） */
const hasOptionsType = computed(() => {
  const p = selectedProperty.value
  return p && SELECT_TYPES.has(p.propertyType)
})

/** 打开属性详情抽屉 */
const openPropertyDetail = (property: NotionDatasourceProperty) => {
  selectedProperty.value = property
  propertyDetailVisible.value = true
}

/** Notion 选项颜色 → CSS 色值映射 */
const NOTION_COLOR_MAP: Record<string, { bg: string; text: string }> = {
  default:        { bg: '#E8E8E8', text: '#4A4A4A' },
  gray:           { bg: '#E8E8E8', text: '#4A4A4A' },
  brown:          { bg: '#F0E1D8', text: '#603B2C' },
  orange:         { bg: '#FDEAD8', text: '#9B4400' },
  yellow:         { bg: '#FDF3D0', text: '#89632A' },
  green:          { bg: '#DFF0D8', text: '#2B5934' },
  blue:           { bg: '#D9EBFC', text: '#1A5180' },
  purple:         { bg: '#EAE0F6', text: '#4A2E7A' },
  pink:           { bg: '#FBE0EC', text: '#8A2A5E' },
  red:            { bg: '#FBE3E3', text: '#8B1A1A' },
}

const optionChipStyle = (color?: string): Record<string, string> => {
  const key = (color && NOTION_COLOR_MAP[color]) ? color : 'default'
  const c = NOTION_COLOR_MAP[key]!
  return { '--opt-bg': c.bg, '--opt-text': c.text }
}

const goToConfig = () => {
  router.push({ name: 'NotionConfig' })
}

const clearCurrentDatasource = () => {
  currentDatasource.value = null
  properties.value = []
}

const resetInlineTitleEdit = () => {
  editingTitleId.value = ''
  editingTitleValue.value = ''
}

const resetPendingTitleUpdate = () => {
  pendingTitleTarget.value = null
  pendingTitleValue.value = ''
}

const clearSelection = () => {
  selectedRowKeys.value = []
}

const resetDatasourceState = () => {
  tableData.value = []
  pagination.current = 1
  pagination.total = 0
  pagination.pageSize = searchForm.pageSize
  clearCurrentDatasource()
  clearSelection()
  resetInlineTitleEdit()
  resetPendingTitleUpdate()
  propertyDrawerVisible.value = false
}

const fetchWorkspaces = async () => {
  workspaceLoading.value = true
  try {
    const res = await getCurrentUserWorkspaces()
    const workspaceList = res.data || []
    workspaces.value = workspaceList
    if (searchForm.workspaceId && !workspaceList.some(item => item.id === searchForm.workspaceId)) {
      searchForm.workspaceId = ''
      resetDatasourceState()
    }
  } catch (error: any) {
    AppleAlert.error('工作区读取失败', error.message || '请稍后重试')
  } finally {
    workspaceLoading.value = false
  }
}

const fetchData = async () => {
  if (!searchForm.workspaceId) {
    resetDatasourceState()
    return
  }

  loading.value = true
  try {
    const res = await getDatasourcePage(searchForm)
    tableData.value = res.data.list || []
    pagination.total = res.data.total || 0
    pagination.current = res.data.pageNum || searchForm.pageNum
    pagination.pageSize = res.data.pageSize || searchForm.pageSize
    selectedRowKeys.value = selectedRowKeys.value.filter(id => tableData.value.some(item => item.id === id))

    if (currentDatasource.value && !tableData.value.some(item => item.id === currentDatasource.value?.id)) {
      clearCurrentDatasource()
      propertyDrawerVisible.value = false
    }
  } catch (error: any) {
    AppleAlert.error('数据源读取失败', error.message || '请稍后重试')
  } finally {
    loading.value = false
  }
}

const handleWorkspaceSearch = () => {
  if (searchForm.workspaceId && !filteredWorkspaces.value.some(item => item.id === searchForm.workspaceId)) {
    searchForm.workspaceId = ''
    resetDatasourceState()
  }
}

const handleWorkspaceReset = () => {
  workspaceSearchForm.workspaceName = ''
  workspaceSearchForm.workspaceCode = ''
}

const selectWorkspace = (workspaceId: string) => {
  searchForm.workspaceId = workspaceId
  searchForm.title = ''
  searchForm.pageNum = 1
  pagination.current = 1
  clearCurrentDatasource()
  clearSelection()
  propertyDrawerVisible.value = false
  fetchData()
}

const handleSearch = () => {
  searchForm.pageNum = 1
  pagination.current = 1
  clearCurrentDatasource()
  clearSelection()
  propertyDrawerVisible.value = false
  fetchData()
}

const handleReset = () => {
  searchForm.title = ''
  searchForm.pageNum = 1
  pagination.current = 1
  clearCurrentDatasource()
  clearSelection()
  propertyDrawerVisible.value = false
  fetchData()
}

const handlePageChange = (page: number, pageSize: number) => {
  searchForm.pageNum = page
  searchForm.pageSize = pageSize
  pagination.current = searchForm.pageNum
  pagination.pageSize = searchForm.pageSize
  clearCurrentDatasource()
  clearSelection()
  propertyDrawerVisible.value = false
  fetchData()
}

const handlePageSizeChange = (_current: number, size: number) => {
  handlePageChange(1, size)
}

const handleSync = async () => {
  if (!activeWorkspace.value) {
    AppleAlert.warning('请选择工作区', '同步数据源需要指定工作区')
    return
  }

  syncing.value = true
  try {
    const res = await syncDatasource(activeWorkspace.value.id)
    AppleAlert.success('同步完成', `已同步 ${res.data || 0} 个数据源`)
    clearCurrentDatasource()
    clearSelection()
    propertyDrawerVisible.value = false
    await fetchData()
  } catch (error: any) {
    AppleAlert.error('同步失败', error.message || '请检查工作区访问令牌')
  } finally {
    syncing.value = false
  }
}

const onSelectChange = (keys: Array<string | number>) => {
  selectedRowKeys.value = keys.map(String)
}

// ==================== 图标上传 ====================

const triggerIconUpload = (record: Datasource) => {
  if (!canEditDatasource.value) return
  iconUploadTarget.value = record
  iconFileInput.value?.click()
}

const handleIconFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file || !iconUploadTarget.value || !activeWorkspace.value) return

  // 校验文件类型
  if (!file.type.startsWith('image/')) {
    AppleAlert.warning('格式不支持', '请选择图片文件')
    iconUploadTarget.value = null
    return
  }
  // 校验文件大小（2MB）
  if (file.size > 2 * 1024 * 1024) {
    AppleAlert.warning('文件过大', '图标文件不能超过 2MB')
    iconUploadTarget.value = null
    return
  }

  const targetId = iconUploadTarget.value.id
  iconUploadingId.value = targetId

  uploadNotionFile(activeWorkspace.value.id, file, {
    onComplete(event) {
      const fileId = event.fileId
      if (!fileId) {
        AppleAlert.error('上传失败', '未获取到文件信息')
        iconUploadingId.value = ''
        iconUploadTarget.value = null
        return
      }

      // 调用后端接口更新数据源图标
      updateDatasourceIcon({ id: targetId, uploadId: fileId })
        .then(() => {
          // 刷新数据源列表以获取更新后的图标
          fetchData()
        })
        .catch((error: any) => {
          AppleAlert.error('图标更新失败', error.message || '请稍后重试')
        })
        .finally(() => {
          iconUploadingId.value = ''
          iconUploadTarget.value = null
        })
    },
    onError(event) {
      AppleAlert.error('上传失败', event.message)
      iconUploadingId.value = ''
      iconUploadTarget.value = null
    }
  })
}

const confirmBatchDelete = () => {
  if (selectedRowKeys.value.length === 0) {
    AppleAlert.warning('请选择数据源', '请先选择需要删除的数据源')
    return
  }
  deleteConfirmVisible.value = true
}

const executeDelete = async () => {
  if (selectedRowKeys.value.length === 0) {
    deleteConfirmVisible.value = false
    return
  }

  deleteConfirmLoading.value = true
  try {
    const ids = [...selectedRowKeys.value]
    await deleteDatasourceBatch(ids)
    AppleAlert.success('删除成功', `已删除 ${ids.length} 个数据源`)
    clearSelection()
    clearCurrentDatasource()
    propertyDrawerVisible.value = false

    if (tableData.value.length === ids.length && searchForm.pageNum > 1) {
      searchForm.pageNum -= 1
      pagination.current = searchForm.pageNum
    }

    deleteConfirmVisible.value = false
    await fetchData()
  } catch (error: any) {
    AppleAlert.error('删除失败', error.message || '无法删除数据源')
  } finally {
    deleteConfirmLoading.value = false
  }
}

const startInlineTitleEdit = (record: Datasource) => {
  if (titleSubmitLoading.value) return
  editingTitleId.value = record.id
  editingTitleValue.value = record.title || ''
  nextTick(() => {
    const input = document.querySelector<HTMLInputElement>(`[data-title-edit-id="${record.id}"]`)
    input?.focus()
    input?.select()
  })
}

const cancelInlineTitleEdit = () => {
  resetInlineTitleEdit()
}

const handleTitleEnter = (event: KeyboardEvent) => {
  ;(event.target as HTMLInputElement).blur()
}

const handleTitleInputBlur = (record: Datasource) => {
  if (editingTitleId.value !== record.id) return

  const nextTitle = editingTitleValue.value.trim()
  const prevTitle = record.title || ''
  resetInlineTitleEdit()

  if (!nextTitle) {
    AppleAlert.warning('标题不能为空', '请输入数据源标题')
    return
  }

  if (nextTitle === prevTitle) {
    return
  }

  pendingTitleTarget.value = record
  pendingTitleValue.value = nextTitle
  titleConfirmVisible.value = true
}

const cancelPendingTitleUpdate = () => {
  resetPendingTitleUpdate()
}

const executeTitleUpdate = async () => {
  if (!pendingTitleTarget.value || !pendingTitleValue.value) {
    titleConfirmVisible.value = false
    resetPendingTitleUpdate()
    return
  }

  const targetId = pendingTitleTarget.value.id
  const nextTitle = pendingTitleValue.value
  titleSubmitLoading.value = true
  try {
    await updateDatasourceTitle({
      id: targetId,
      title: nextTitle
    })
    AppleAlert.success('保存成功', '数据源标题已更新')

    const updated = tableData.value.find(item => item.id === targetId)
    if (updated) {
      updated.title = nextTitle
    }
    if (currentDatasource.value?.id === targetId) {
      currentDatasource.value = { ...currentDatasource.value, title: nextTitle }
    }

    titleConfirmVisible.value = false
    resetPendingTitleUpdate()
  } catch (error: any) {
    AppleAlert.error('保存失败', error.message || '无法修改数据源标题')
  } finally {
    titleSubmitLoading.value = false
  }
}

const openProperties = async (record: Datasource) => {
  currentDatasource.value = record
  propertyDrawerVisible.value = true
  propertyLoading.value = true
  properties.value = []
  try {
    const res = await getDatasourceProperties(record.id)
    properties.value = res.data || []
  } catch (error: any) {
    AppleAlert.error('字段读取失败', error.message || '请稍后重试')
  } finally {
    propertyLoading.value = false
  }
}

onMounted(async () => {
  await fetchWorkspaces()
  resetDatasourceState()
})
</script>

<style scoped>
.neo-datasource-container {
  display: flex;
  height: calc(100vh - 120px);
  min-height: 600px;
  gap: 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.neo-sidebar {
  width: 360px;
  flex-shrink: 0;
  background: var(--card-bg, #ffffff);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.05));
  overflow: hidden;
}

.sidebar-header {
  height: 64px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: var(--text-main, #1d1d1f);
}

.sidebar-search-wrapper {
  padding: 0 20px 16px;
  box-sizing: border-box;
}

.capsule-search {
  display: flex;
  width: 100%;
  background: var(--card-bg, #f5f5f7);
  border-radius: 14px;
  padding: 4px;
  border: 1px solid var(--border-color);
  transition: all 0.3s;
  box-sizing: border-box;
  align-items: center;
}

.capsule-search:focus-within {
  background: var(--card-bg, #ffffff);
  border-color: var(--apple-blue, #0A84FF);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--apple-blue, #0A84FF) 10%, transparent);
}

.search-inputs {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 4px;
  height: 26px;
  min-width: 0;
}

.search-inputs input {
  flex: 1;
  min-width: 0;
  width: 0;
  border: none;
  background: transparent;
  font-size: 13px;
  color: var(--text-main);
  outline: none;
  padding: 0 8px;
  height: 26px;
  line-height: 26px;
}

.search-inputs input::placeholder {
  color: var(--text-muted, #a1a1aa);
}

.divider {
  width: 1px;
  height: 14px;
  background: var(--border-color, #e5e5ea);
  margin: 0 4px;
  flex-shrink: 0;
}

.search-actions {
  display: flex;
  gap: 4px;
}

.search-trigger {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 10px;
  background: var(--apple-blue, #0A84FF);
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-trigger:hover {
  filter: brightness(0.9);
  transform: scale(0.95);
}

.search-trigger.reset-btn {
  background: var(--hover-bg, #e5e5ea);
  color: var(--text-main, #333333);
}

.search-trigger.reset-btn:hover {
  background: var(--active-bg, rgba(0, 0, 0, 0.1));
  color: var(--text-main, #1d1d1f);
}

.sidebar-list-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 20px;
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
}

.sidebar-list-container::-webkit-scrollbar {
  width: 4px;
}

.sidebar-list-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.neo-list-item {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 14px 12px;
  margin-bottom: 4px;
  border-radius: 14px;
  cursor: pointer;
  border: 1px solid var(--border-color);
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
  user-select: none;
}

.neo-list-item:hover {
  background: var(--hover-bg, #f5f5f7);
}

.neo-list-item.is-active {
  background: color-mix(in srgb, var(--apple-blue) 8%, transparent);
  border-color: color-mix(in srgb, var(--apple-blue) 15%, transparent);
}

.item-prefix {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 12px;
}

.workspace-mini-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: var(--apple-blue, #0A84FF);
  background: color-mix(in srgb, var(--apple-blue, #0A84FF) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--apple-blue, #0A84FF) 16%, transparent);
  font-size: 14px;
  font-weight: 800;
}

.workspace-mini-icon img,
.datasource-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
}

.item-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  line-height: normal;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 50%;
}

.item-subtitle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  line-height: normal;
  font-size: 12px;
  color: var(--text-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: var(--hover-bg, rgba(0, 0, 0, 0.05));
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0 8px;
  box-sizing: border-box;
  flex-shrink: 1;
}

.neo-list-item.is-active .item-title {
  color: var(--apple-blue);
  font-weight: 700;
}

.item-tail {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 24px;
  color: var(--text-muted);
  font-size: 12px;
}

.neo-list-item.is-active .item-tail {
  color: var(--apple-blue);
}

.sidebar-empty-wrap {
  min-height: 360px;
  padding: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-footer {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid var(--border-color, rgba(0, 0, 0, 0.08));
  background: transparent;
  width: 100%;
  box-sizing: border-box;
}

.custom-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 220px;
}

.page-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--content-bg, #ffffff);
  border: 1px solid var(--border-color, #e5e5ea);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-main, #333333);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px var(--shadow-color, rgba(0, 0, 0, 0.05));
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: var(--hover-bg, #f5f5f7);
  box-shadow: none;
}

.page-stats {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
  user-select: none;
}

.neo-main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  background: var(--card-bg, #ffffff);
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.05));
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.neo-empty-state {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--apple-blue, #0A84FF) 3%, transparent) 0%, transparent 50%),
    radial-gradient(circle at bottom left, color-mix(in srgb, var(--apple-blue, #0A84FF) 2%, transparent) 0%, transparent 50%);
  z-index: 10;
}

.data-empty-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.modern-empty-card {
  width: 100%;
  max-width: 380px;
  background: var(--card-bg, #ffffff);
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.05));
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  animation: float-up-fade 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.modern-empty-illus {
  width: 100%;
  height: 140px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--apple-blue) 40%, transparent),
    color-mix(in srgb, var(--apple-blue) 5%, transparent)
  );
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
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.08);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: relative;
  z-index: 2;
}

.mockup-header,
.mockup-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mockup-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--border-color);
}

.mockup-line {
  height: 6px;
  border-radius: 3px;
  background: var(--hover-bg);
  flex: 1;
}

.mockup-line.short {
  width: 60%;
  flex: none;
}

.mockup-line.shorter {
  width: 40%;
  flex: none;
}

.mockup-star {
  color: var(--border-color);
  font-size: 10px;
}

.mockup-avatar {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--hover-bg);
}

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
  margin: 0 0 12px;
  letter-spacing: -0.3px;
}

.modern-empty-desc {
  white-space: pre-line;
  font-size: 13px;
  color: var(--text-muted);
  margin: 0 0 24px;
  line-height: 1.6;
}

.modern-empty-desc:last-child {
  margin-bottom: 0;
}

.modern-empty-btn {
  height: 40px;
  padding: 0 24px;
  border-radius: 20px;
  background: var(--text-main);
  color: var(--bg-base);
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.modern-empty-btn:hover:not(:disabled) {
  transform: scale(0.96);
  opacity: 0.9;
}

.modern-empty-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.modern-empty-card.mini {
  max-width: 260px;
}

.modern-empty-card.mini .modern-empty-illus {
  height: 100px;
  padding: 0 20px;
}

.modern-empty-card.mini .mockup-window {
  height: 70px;
  gap: 12px;
}

.modern-empty-card.mini .modern-empty-content {
  padding: 20px 16px;
}

.modern-empty-card.mini .modern-empty-title {
  font-size: 16px;
  margin-bottom: 8px;
}

.modern-empty-card.mini .modern-empty-desc {
  font-size: 12px;
  margin-bottom: 0;
}

.modern-empty-card.mini .mini-btn {
  height: 30px;
  margin-top: 12px;
  padding: 0 13px;
  border-radius: 999px;
  background: var(--hover-bg, rgba(0, 0, 0, 0.05));
  color: var(--text-main);
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.08));
  box-shadow: none;
  font-size: 12px;
  font-weight: 650;
  gap: 6px;
}

.modern-empty-card.mini .mini-btn svg {
  font-size: 11px;
}

.modern-empty-card.mini .mini-btn:hover:not(:disabled) {
  color: var(--apple-blue, #0A84FF);
  background: color-mix(in srgb, var(--apple-blue, #0A84FF) 8%, transparent);
  border-color: color-mix(in srgb, var(--apple-blue, #0A84FF) 20%, transparent);
  transform: translateY(-1px);
  opacity: 1;
}

@keyframes float-up-fade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.neo-data-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.data-header {
  padding: 24px 32px 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.header-info h1 {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
  letter-spacing: -0.3px;
  line-height: 1.2;
}

.dict-meta-badges {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.meta-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
  color: var(--apple-blue);
  background: color-mix(in srgb, var(--apple-blue) 12%, transparent);
  padding: 0 10px;
  height: 24px;
  border-radius: 8px;
  font-weight: 600;
  border: 1px solid color-mix(in srgb, var(--apple-blue) 20%, transparent);
  line-height: normal;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dict-remark {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.5;
  max-width: 720px;
}

.data-toolbar {
  padding: 0 32px 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
}

.data-capsule {
  width: auto;
  min-width: 450px;
  max-width: 760px;
}

.data-actions {
  display: flex;
  gap: 8px;
}

.delete-action-btn,
.sync-action-btn {
  height: 36px;
  padding: 0 14px;
  border-radius: 12px;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 650;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.delete-action-btn {
  background: rgba(255, 69, 58, 0.12);
  color: #FF453A;
  border: 1px solid rgba(255, 69, 58, 0.16);
}

.delete-action-btn:hover:not(:disabled) {
  background: #FF453A;
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(255, 69, 58, 0.18);
}

.delete-action-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.sync-action-btn {
  background: #1d1d1f;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.sync-action-btn:hover:not(:disabled) {
  background: #000000;
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.16);
}

.sync-action-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.data-table-wrapper {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0 32px;
}

:deep(.data-spin-wrap),
:deep(.data-spin-wrap > .ant-spin-container) {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

:deep(.data-spin-wrap > .ant-spin-container) {
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 8px;
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
}

:deep(.data-spin-wrap > .ant-spin-container::-webkit-scrollbar) {
  width: 4px;
}

:deep(.data-spin-wrap > .ant-spin-container::-webkit-scrollbar-thumb) {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

:deep(.datasource-table) {
  flex: none;
  display: block;
  min-height: auto;
  overflow: visible;
}

:deep(.datasource-table .ant-spin-nested-loading),
:deep(.datasource-table .ant-spin-container),
:deep(.datasource-table .ant-table) {
  display: block;
  min-height: auto;
  overflow: visible;
}

:deep(.datasource-table .ant-table-container) {
  min-height: auto;
  overflow-x: auto;
  overflow-y: visible;
}

:deep(.datasource-table .ant-table-content) {
  min-height: 0;
  overflow-y: visible !important;
}

.datasource-pagination-bar {
  flex: none;
  min-height: 60px;
  padding: 12px 0 16px;
  border-top: 1px solid var(--border-color, rgba(0, 0, 0, 0.08));
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: var(--card-bg, #ffffff);
}

.datasource-pagination-bar :deep(.ant-pagination) {
  margin: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  row-gap: 8px;
}

.datasource-pagination-bar :deep(.ant-pagination-total-text) {
  margin-right: auto;
  color: var(--text-muted);
  font-size: 13px;
}

.datasource-pagination-bar :deep(.ant-pagination-item),
.datasource-pagination-bar :deep(.ant-pagination-prev .ant-pagination-item-link),
.datasource-pagination-bar :deep(.ant-pagination-next .ant-pagination-item-link) {
  border-radius: 8px;
  border-color: transparent;
  background: transparent;
}

.datasource-pagination-bar :deep(.ant-pagination-item:hover),
.datasource-pagination-bar :deep(.ant-pagination-prev:hover .ant-pagination-item-link),
.datasource-pagination-bar :deep(.ant-pagination-next:hover .ant-pagination-item-link) {
  background: var(--hover-bg, rgba(0, 0, 0, 0.04));
}

.datasource-pagination-bar :deep(.ant-pagination-item-active) {
  background: var(--apple-blue, #0A84FF) !important;
  border-color: var(--apple-blue, #0A84FF) !important;
}

.datasource-pagination-bar :deep(.ant-pagination-item-active a) {
  color: #ffffff !important;
}

.datasource-name-cell {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.datasource-avatar {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: var(--apple-blue, #0A84FF);
  background: color-mix(in srgb, var(--apple-blue, #0A84FF) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--apple-blue, #0A84FF) 16%, transparent);
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  position: relative;
  transition: opacity 0.2s, border-color 0.2s;
}

.datasource-avatar:hover {
  border-color: var(--apple-blue, #0A84FF);
}

.datasource-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.icon-uploading {
  pointer-events: none;
  opacity: 0.6;
}

.icon-upload-spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--apple-blue, #0A84FF);
}

.icon-hidden-input {
  display: none;
}

.datasource-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.cell-title-edit {
  max-width: 100%;
  min-width: 0;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-main);
  cursor: text;
  text-align: left;
  font: inherit;
}

.cell-title-edit span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 600;
}

.cell-title-edit svg {
  flex: none;
  color: var(--text-muted);
  font-size: 11px;
  opacity: 0;
  transform: translateX(-3px);
  transition: all 0.18s ease;
}

.cell-title-edit:hover span {
  color: var(--apple-blue, #0A84FF);
}

.cell-title-edit:hover svg {
  opacity: 1;
  transform: translateX(0);
  color: var(--apple-blue, #0A84FF);
}

.inline-title-input {
  width: 100%;
  max-width: 210px;
  height: 30px;
  padding: 0 10px;
  border: 1px solid color-mix(in srgb, var(--apple-blue, #0A84FF) 36%, transparent);
  border-radius: 9px;
  outline: none;
  background: var(--content-bg, #ffffff);
  color: var(--text-main);
  font-size: 14px;
  font-weight: 650;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--apple-blue, #0A84FF) 12%, transparent);
}

.cell-label {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-main);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cell-muted {
  font-size: 12px;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.datasource-id-badge {
  max-width: 100%;
}

.time-cell {
  color: var(--text-muted);
  font-size: 13px;
  white-space: nowrap;
}

.spin {
  animation: spin 0.85s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.drawer-title {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.drawer-title > span:last-child {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.drawer-title strong,
.drawer-title small {
  max-width: 390px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.drawer-title strong {
  color: var(--text-main);
  font-size: 18px;
  font-weight: 750;
  letter-spacing: -0.01em;
}

.drawer-title small {
  color: var(--text-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
}

.drawer-content {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.drawer-source-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: var(--apple-blue, #0A84FF);
  background: linear-gradient(135deg, color-mix(in srgb, var(--apple-blue, #0A84FF) 18%, transparent), color-mix(in srgb, var(--apple-blue, #0A84FF) 8%, transparent));
  border: 1px solid color-mix(in srgb, var(--apple-blue, #0A84FF) 20%, transparent);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--apple-blue, #0A84FF) 12%, transparent);
  font-size: 20px;
  font-weight: 800;
  cursor: pointer;
  position: relative;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.drawer-source-icon:hover {
  border-color: var(--apple-blue, #0A84FF);
  box-shadow: 0 10px 24px color-mix(in srgb, var(--apple-blue, #0A84FF) 18%, transparent);
  transform: translateY(-1px);
}

.drawer-source-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ==================== 字段配置统计卡片（苹果毛玻璃风格） ==================== */

.drawer-summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.summary-stat {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 28px 16px 26px;
  border-radius: 18px;
  isolation: isolate;
  overflow: hidden;

  /* 毛玻璃基底层：局部亮点 + 整体半透明 */
  background:
    radial-gradient(ellipse 90% 50% at 50% 0%, rgba(255,255,255,0.28) 0%, transparent 100%),
    color-mix(in srgb, var(--card-bg, #ffffff) 68%, transparent);

  /* 毛玻璃模糊 + 饱和度 */
  backdrop-filter: blur(28px) saturate(160%);
  -webkit-backdrop-filter: blur(28px) saturate(160%);

  /* 玻璃边缘：极细半透明边框 */
  border: 0.5px solid rgba(0, 0, 0, 0.09);

  /* 多层深度阴影系统 */
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.03),
    0 2px 6px rgba(0, 0, 0, 0.03),
    0 8px 22px rgba(0, 0, 0, 0.05),
    inset 0 0.5px 0 rgba(255, 255, 255, 0.55),
    inset 0 -0.5px 0 rgba(0, 0, 0, 0.03);

  transition: all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* 玻璃表面左上角斜向光斑 */
.summary-stat::before {
  content: '';
  position: absolute;
  top: -35%;
  left: -25%;
  width: 70%;
  height: 70%;
  background: radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.18) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}

/* 玻璃边缘光折射渐变 */
.summary-stat::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 18px;
  background: linear-gradient(
    140deg,
    rgba(255,255,255,0.08) 0%,
    transparent 35%,
    transparent 65%,
    rgba(0,0,0,0.02) 100%
  );
  pointer-events: none;
  z-index: 0;
}

/* hover：玻璃接更多光，轻微抬起 */
.summary-stat:hover {
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.04),
    0 4px 12px rgba(0, 0, 0, 0.05),
    0 12px 30px rgba(0, 0, 0, 0.08),
    inset 0 0.5px 0 rgba(255, 255, 255, 0.6),
    inset 0 -0.5px 0 rgba(0, 0, 0, 0.02);
  transform: translateY(-2px);
}

.summary-stat:hover::before {
  opacity: 0.7;
}

.summary-stat-value {
  position: relative;
  z-index: 1;
  font-size: 34px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  transition: color 0.3s ease;
}

/* 字段数量 — 苹果蓝点缀 */
.summary-stat:first-child .summary-stat-value {
  color: color-mix(in srgb, var(--apple-blue, #0A84FF) 85%, var(--text-main));
}

/* 类型数量 — 紫色点缀 */
.summary-stat:last-child .summary-stat-value {
  color: color-mix(in srgb, #7C4DFF 85%, var(--text-main));
}

/* 数值下方淡色光晕 */
.summary-stat-value::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 75%;
  height: 16px;
  background: radial-gradient(ellipse, color-mix(in srgb, currentColor 10%, transparent), transparent);
  border-radius: 50%;
  z-index: -1;
  pointer-events: none;
}

.summary-stat-label {
  position: relative;
  z-index: 1;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  letter-spacing: 0.02em;
}

/* ==================== 属性列表 ==================== */

:deep(.property-spin),
:deep(.property-spin > .ant-spin-container) {
  min-height: 280px;
}

.property-config-card {
  overflow: hidden;
  border-radius: 14px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  box-shadow: 0 16px 38px rgba(0, 0, 0, 0.06);
}

.property-config-head {
  min-height: 104px;
  padding: 28px 20px 20px;
  display: flex;
  align-items: flex-end;
  border-bottom: 1px solid var(--border-color);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--layout-bg, #f5f5f7) 36%, transparent), transparent);
}

.property-config-head div {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.property-config-head strong {
  color: var(--text-main);
  font-size: 21px;
  font-weight: 800;
  line-height: 1.2;
}

.property-config-head span {
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
}

.property-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0 18px;
}

.property-item {
  position: relative;
  min-height: 86px;
  padding: 18px 0;
  display: flex;
  align-items: center;
  gap: 14px;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--border-color);
  box-sizing: border-box;
  transition: background 0.2s ease, padding-left 0.2s ease;
}

.property-item::before {
  content: '';
  position: absolute;
  left: -18px;
  top: 14px;
  bottom: 14px;
  width: 3px;
  border-radius: 999px;
  background: var(--apple-blue, #0A84FF);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.property-item:hover {
  background: color-mix(in srgb, var(--apple-blue, #0A84FF) 2%, transparent);
  padding-left: 6px;
}

.property-item:hover::before {
  opacity: 1;
}

.property-type-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--type-text);
  background: var(--type-bg);
  border: 1px solid color-mix(in srgb, currentColor 14%, transparent);
  font-size: 20px;
}

.property-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.property-main strong,
.property-main small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.property-main strong {
  color: var(--text-main);
  font-size: 16px;
  font-weight: 760;
  line-height: 1.25;
}

.property-main small {
  color: var(--text-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
}

/* ==================== 属性类型标签 ==================== */

.property-type-clickable {
  border: none;
  cursor: pointer;
  user-select: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
}

.property-type-clickable:hover {
  transform: translateY(-1px);
  filter: saturate(1.05);
  box-shadow: 0 2px 8px color-mix(in srgb, currentColor 16%, transparent);
}

.type-link-icon {
  margin-left: 4px;
  font-size: 9px;
  opacity: 0.7;
}

.property-more-btn {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 8px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  background: transparent;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease;
}

.property-more-btn:hover {
  color: var(--text-main);
  background: color-mix(in srgb, var(--text-main) 6%, transparent);
}

.property-add-btn {
  width: calc(100% - 36px);
  height: 44px;
  margin: 18px;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: color-mix(in srgb, var(--apple-blue, #0A84FF) 84%, var(--text-main));
  background: transparent;
  border: 1px solid color-mix(in srgb, var(--apple-blue, #0A84FF) 56%, var(--border-color));
  font-size: 14px;
  font-weight: 650;
  cursor: not-allowed;
  opacity: 0.86;
  transition: border-color 0.18s ease, background 0.18s ease;
}

.property-add-btn:hover {
  background: color-mix(in srgb, var(--apple-blue, #0A84FF) 4%, transparent);
}

/* ==================== 选项标签 ==================== */

.option-chip {
  height: 28px;
  padding: 0 12px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--opt-text);
  background: var(--opt-bg);
  border: 1px solid color-mix(in srgb, currentColor 18%, transparent);
  font-size: 12px;
  font-weight: 650;
  line-height: 1;
  white-space: nowrap;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.option-chip::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: none;
  background: currentColor;
}

.option-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px color-mix(in srgb, currentColor 22%, transparent);
}

/* ==================== 属性详情抽屉 ==================== */

.detail-panel-title {
  color: var(--text-main);
  font-size: 14px;
  font-weight: 700;
}

.detail-inspector {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-name-panel,
.detail-type-panel,
.detail-options-panel {
  padding: 16px;
  border-radius: 12px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
}

.detail-label {
  display: block;
  margin-bottom: 10px;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
}

.detail-name-panel h3 {
  margin: 0;
  color: var(--text-main);
  font-size: 22px;
  font-weight: 760;
  line-height: 1.28;
  word-break: break-word;
}

.detail-type-card {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
}

.detail-type-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  color: var(--type-text);
  background: var(--type-bg);
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  font-size: 17px;
}

.detail-type-name {
  min-width: 0;
  color: var(--text-main);
  font-size: 15px;
  font-weight: 750;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-options-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.detail-options-head .detail-label {
  margin-bottom: 0;
}

.detail-count {
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-text, var(--text-muted));
  background: color-mix(in srgb, var(--accent-bg, #f0f0f0) 48%, var(--card-bg));
  border: 1px solid color-mix(in srgb, var(--accent-text, #555555) 10%, var(--border-color));
  font-size: 11px;
  font-weight: 750;
  flex: none;
}

.detail-option-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 2px;
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
}

.detail-option-grid::-webkit-scrollbar {
  width: 4px;
}

.detail-option-grid::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.detail-option-pill {
  max-width: 100%;
  min-height: 30px;
  padding: 0 11px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--opt-text);
  background: var(--opt-bg);
  border: 1px solid color-mix(in srgb, currentColor 14%, transparent);
  animation: detailOptionIn 0.2s ease both;
}

.detail-option-pill:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px color-mix(in srgb, currentColor 16%, transparent);
}

.detail-option-color {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  flex: none;
}

.detail-option-name {
  min-width: 0;
  color: currentColor;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-empty-state {
  min-height: 72px;
  border-radius: 10px;
  border: 1px dashed var(--border-color);
  background: color-mix(in srgb, var(--card-bg) 70%, var(--layout-bg, #f5f5f7));
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

@keyframes detailOptionIn {
  from { opacity: 0; transform: translateY(2px); }
  to   { opacity: 1; transform: translateY(0); }
}

.property-type {
  flex: none;
  max-width: 150px;
  height: 32px;
  padding: 0 13px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--type-text);
  background: var(--type-bg);
  font-size: 13px;
  font-weight: 750;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1;
}

/* ==================== 空状态 ==================== */

.property-empty {
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
}

.property-empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  background: var(--card-bg);
  border: 1px dashed var(--border-color);
  font-size: 24px;
  margin-bottom: 2px;
}

.property-empty strong {
  color: var(--text-main);
  font-size: 16px;
  font-weight: 700;
}

.property-empty small {
  color: var(--text-muted);
  font-size: 13px;
  max-width: 260px;
  line-height: 1.5;
}

/* ==================== Drawer 全局覆盖 ==================== */

:deep(.ant-drawer-content),
:deep(.ant-drawer-header),
:deep(.ant-drawer-body) {
  background: var(--layout-bg, #f5f5f7);
}

:deep(.ant-drawer-header) {
  padding: 18px 22px 16px;
  border-bottom-color: var(--border-color);
}

:deep(.ant-drawer-body) {
  padding: 20px 22px;
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
}

:deep(.datasource-property-drawer .ant-drawer-content) {
  border-left: 1px solid var(--border-color, rgba(0, 0, 0, 0.08));
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.04);
}

:global(.dark) .neo-sidebar,
:global(.dark) .neo-main {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.22);
  border-color: rgba(255, 255, 255, 0.06);
}

:global(.dark) .capsule-search {
  background: var(--card-bg, #1e1e1c);
  border-color: rgba(255, 255, 255, 0.06);
}

:global(.dark) .capsule-search:focus-within {
  background: var(--card-bg, #1e1e1c);
  border-color: var(--apple-blue, #0A84FF);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--apple-blue, #0A84FF) 14%, transparent);
}

:global(.dark) .modern-empty-card {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

:global(.dark) .summary-stat,
:global(.theme-dark) .summary-stat {
  /* 更高级的暗色玻璃：高不透明度避免透底泛白，深色基调 */
  background:
    radial-gradient(ellipse 90% 50% at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 100%),
    color-mix(in srgb, var(--card-bg, #1c1c1e) 90%, transparent);

  /* 暗色玻璃边缘：极细淡白边框 */
  border-color: rgba(255, 255, 255, 0.05);

  /* 深色高级阴影体系 */
  box-shadow:
    0 0 0 0.5px rgba(255,255,255,0.03),
    0 2px 8px rgba(0,0,0,0.3),
    0 8px 28px rgba(0,0,0,0.35),
    inset 0 0.5px 0 rgba(255,255,255,0.04),
    inset 0 -0.5px 0 rgba(0,0,0,0.25);
}
:global(.dark) .summary-stat::before,
:global(.theme-dark) .summary-stat::before {
  /* 暗色下减弱光斑，避免泛白感 */
  background: radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.03) 0%, transparent 70%);
}
:global(.dark) .summary-stat::after,
:global(.theme-dark) .summary-stat::after {
  background: linear-gradient(
    140deg,
    rgba(255,255,255,0.02) 0%,
    transparent 35%,
    transparent 65%,
    rgba(0,0,0,0.08) 100%
  );
}
:global(.dark) .summary-stat:hover,
:global(.theme-dark) .summary-stat:hover {
  box-shadow:
    0 0 0 0.5px rgba(255,255,255,0.04),
    0 4px 14px rgba(0,0,0,0.35),
    0 14px 36px rgba(0,0,0,0.4),
    inset 0 0.5px 0 rgba(255,255,255,0.06),
    inset 0 -0.5px 0 rgba(0,0,0,0.2);
}
:global(.dark) .summary-stat:first-child .summary-stat-value,
:global(.theme-dark) .summary-stat:first-child .summary-stat-value {
  color: rgba(255, 255, 255, 0.92);
}
:global(.dark) .summary-stat:last-child .summary-stat-value,
:global(.theme-dark) .summary-stat:last-child .summary-stat-value {
  color: rgba(255, 255, 255, 0.92);
}

:global(.dark) .property-config-card,
:global(.theme-dark) .property-config-card {
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.28);
}

:global(.dark) .property-config-head,
:global(.theme-dark) .property-config-head {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--apple-blue, #0A84FF) 4%, transparent), transparent);
}

:global(.dark) .mockup-window {
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.4);
}

:global(.dark) .search-trigger.reset-btn,
:global(.dark) .page-btn {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.72);
}

:global(html.dark .neo-datasource-container .sync-action-btn),
:global(.theme-dark .neo-datasource-container .sync-action-btn),
:global(.dark .neo-datasource-container .sync-action-btn) {
  background: #ffffff !important;
  color: #1d1d1f !important;
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.08);
}

:global(html.dark .neo-datasource-container .sync-action-btn:hover:not(:disabled)),
:global(.theme-dark .neo-datasource-container .sync-action-btn:hover:not(:disabled)),
:global(.dark .neo-datasource-container .sync-action-btn:hover:not(:disabled)) {
  background: #f5f5f7 !important;
  color: #000000 !important;
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.12);
}

:global(.dark) .page-btn:disabled {
  background: rgba(255, 255, 255, 0.02);
}

@media (max-width: 1180px) {
  .neo-datasource-container {
    gap: 18px;
  }

  .neo-sidebar {
    width: 320px;
  }

  .data-capsule {
    min-width: 360px;
  }
}

@media (max-width: 900px) {
  .neo-datasource-container {
    height: auto;
    min-height: calc(100vh - 120px);
    flex-direction: column;
  }

  .neo-sidebar {
    width: 100%;
    max-height: 420px;
  }

  .neo-main {
    min-height: 620px;
  }

  .data-toolbar {
    flex-wrap: wrap;
  }

  .data-capsule {
    min-width: 0;
    width: 100%;
    max-width: none;
  }
}

@media (max-width: 640px) {
  .data-header,
  .data-toolbar,
  .data-table-wrapper {
    padding-left: 20px;
    padding-right: 20px;
  }

  .drawer-summary {
    grid-template-columns: 1fr;
  }
}
</style>

<!-- 非 scoped：Drawer 滚动条伪元素在 Vue 3 scoped :deep() 中可能编译异常 -->
<style>
.datasource-property-drawer .ant-drawer-body,
.property-detail-drawer .ant-drawer-body {
  scrollbar-width: thin;
  scrollbar-color: var(--border-color, rgba(0,0,0,0.08)) transparent;
}
.datasource-property-drawer .ant-drawer-body::-webkit-scrollbar,
.property-detail-drawer .ant-drawer-body::-webkit-scrollbar {
  width: 4px;
}
.datasource-property-drawer .ant-drawer-body::-webkit-scrollbar-thumb,
.property-detail-drawer .ant-drawer-body::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

/* ========== 暗黑模式统计卡（非 scoped，显式色值，确保 Drawer 内生效） ========== */
html.dark .summary-stat {
  background:
    radial-gradient(ellipse 90% 50% at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 100%),
    #1c1c1e !important;
  border-color: rgba(255, 255, 255, 0.05) !important;
  box-shadow:
    0 0 0 0.5px rgba(255,255,255,0.03),
    0 2px 8px rgba(0,0,0,0.3),
    0 8px 28px rgba(0,0,0,0.35),
    inset 0 0.5px 0 rgba(255,255,255,0.04),
    inset 0 -0.5px 0 rgba(0,0,0,0.25) !important;
}
html.dark .summary-stat::before {
  background: radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.03) 0%, transparent 70%);
}
html.dark .summary-stat::after {
  background: linear-gradient(
    140deg,
    rgba(255,255,255,0.02) 0%,
    transparent 35%,
    transparent 65%,
    rgba(0,0,0,0.08) 100%
  );
}
html.dark .summary-stat:hover {
  box-shadow:
    0 0 0 0.5px rgba(255,255,255,0.04),
    0 4px 14px rgba(0,0,0,0.35),
    0 14px 36px rgba(0,0,0,0.4),
    inset 0 0.5px 0 rgba(255,255,255,0.06),
    inset 0 -0.5px 0 rgba(0,0,0,0.2) !important;
}
html.dark .summary-stat:first-child .summary-stat-value {
  color: rgba(255, 255, 255, 0.92);
}
html.dark .summary-stat:last-child .summary-stat-value {
  color: rgba(255, 255, 255, 0.92);
}
</style>
