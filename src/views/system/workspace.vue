<template>
  <div class="neo-page-container" :class="{ 'is-setup': guidedSetupVisible }">

    <!-- ================= 列表视图 ================= -->
    <template v-if="!guidedSetupVisible">
      <header class="neo-page-header">
        <div class="capsule-search">
          <div class="search-inputs">
            <input type="text" v-model="searchForm.name" placeholder="工作区名称" @keyup.enter="handleSearch" />
            <div class="divider"></div>
            <input type="text" v-model="searchForm.code" placeholder="工作区编码" @keyup.enter="handleSearch" />
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
          <button class="neo-btn-solid primary" v-permission="'workspace:add'" @click="handleAdd">
            <font-awesome-icon :icon="['fas', 'plus']" />
            新增配置
          </button>
          <button class="neo-btn-flat danger" v-permission="'workspace:delete'" v-if="selectedRowKeys.length > 0" @click="confirmBatchDelete">
            <font-awesome-icon :icon="['fas', 'trash']" />
            批量删除
          </button>
        </div>
      </header>

      <div class="neo-card table-card fade-in">
        <a-table
          class="neo-table"
          :columns="columns"
          :data-source="tableData"
          :loading="loading"
          :pagination="pagination"
          :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
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
                  <h3 class="modern-empty-title">暂无工作区数据</h3>
                  <p class="modern-empty-desc">点击下方按钮创建第一个工作区</p>
                  <button class="modern-empty-btn" v-permission="'workspace:add'" @click="handleAdd">
                    <font-awesome-icon :icon="['fas', 'plus']" /> 新增工作区
                  </button>
                </div>
              </div>
            </div>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'workspace'">
              <div class="workspace-cell" :title="`${record.name} · ${record.code}`">
                <div class="workspace-avatar">
                  <img v-if="isBase64Image(record.icon)" :src="record.icon" class="table-icon-img" @error="handleImgError" />
                  <span v-else-if="record.icon" class="table-icon-emoji">{{ record.icon }}</span>
                  <font-awesome-icon v-else :icon="['fas', 'cube']" />
                </div>
                <div class="workspace-meta">
                  <div class="workspace-name-row">
                    <span class="workspace-name">{{ record.name || '未命名工作区' }}</span>
                  </div>
                  <div class="workspace-code-row">
                    <span class="workspace-code-label">编码</span>
                    <span class="workspace-code">{{ record.code || '-' }}</span>
                  </div>
                </div>
              </div>
            </template>
            <template v-if="column.key === 'token'">
              <div class="token-cell" :title="`访问令牌：${maskToken(record.token)}`">
                <span class="token-icon">
                  <font-awesome-icon :icon="['fas', 'lock']" />
                </span>
                <span class="token-value">{{ maskToken(record.token) }}</span>
              </div>
            </template>
            <template v-if="column.key === 'createTime'">
              <span>{{ formatDateTime(record.createTime) }}</span>
            </template>
            <template v-if="column.key === 'updateTime'">
              <span>{{ formatDateTime(record.updateTime) }}</span>
            </template>
            <template v-if="column.key === 'createBy'">
              <span>{{ record.createBy || '-' }}</span>
            </template>
            <template v-if="column.key === 'action'">
              <div class="action-btn-group">
                <button class="text-action-btn primary" v-permission="'workspace:edit'" @click="handleEdit(record)">编辑</button>
                <span class="action-divider"></span>
                <button class="text-action-btn danger" v-permission="'workspace:delete'" @click="confirmDelete(record.id)">删除</button>
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </template>

    <!-- ================= 全页设置画布 ================= -->
    <div class="setup-canvas" :class="[`setup-step-${currentStep}`, connectionProgressClass]" v-else>
      <div class="setup-body">
        <!-- 顶部步骤导航 -->
        <aside class="setup-sidebar">
          <div class="sidebar-inner">
            <template v-if="!isEditMode">
              <div class="prog-item" :class="{ active: currentStep === 0, done: currentStep > 0 }">
                <div class="prog-dot">
                  <font-awesome-icon v-if="currentStep > 0" :icon="['fas', 'check']" />
                  <span v-else>1</span>
                </div>
                <div class="prog-text">
                  <span class="prog-label">获取访问令牌</span>
                  <span class="prog-desc">创建 Notion Integration</span>
                </div>
              </div>
              <div class="prog-line" :class="{ on: currentStep > 0 }">
                <div class="prog-line-fill"></div>
              </div>
              <div class="prog-item" :class="{ active: currentStep === 1, done: currentStep > 1 }">
                <div class="prog-dot">
                  <font-awesome-icon v-if="currentStep > 1" :icon="['fas', 'check']" />
                  <span v-else>2</span>
                </div>
                <div class="prog-text">
                  <span class="prog-label">填写工作区信息</span>
                  <span class="prog-desc">设置编码、名称与令牌</span>
                </div>
              </div>
              <div class="prog-line result-line" :class="{ on: currentStep > 1 }">
                <div class="prog-line-fill"></div>
              </div>
              <div class="prog-item result-step" :class="{ active: currentStep === 2 }">
                <div class="prog-dot"><span>3</span></div>
                <div class="prog-text">
                  <span class="prog-label">测试连接</span>
                  <span class="prog-desc">验证令牌可用性</span>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="prog-item" :class="{ active: currentStep === 1, done: currentStep > 1 }">
                <div class="prog-dot">
                  <font-awesome-icon v-if="currentStep > 1" :icon="['fas', 'check']" />
                  <span v-else>1</span>
                </div>
                <div class="prog-text">
                  <span class="prog-label">编辑工作区信息</span>
                  <span class="prog-desc">更新名称、编码与令牌</span>
                </div>
              </div>
              <div class="prog-line result-line" :class="{ on: currentStep > 1 }">
                <div class="prog-line-fill"></div>
              </div>
              <div class="prog-item result-step" :class="{ active: currentStep === 2 }">
                <div class="prog-dot"><span>2</span></div>
                <div class="prog-text">
                  <span class="prog-label">测试连接</span>
                  <span class="prog-desc">保存前验证令牌</span>
                </div>
              </div>
            </template>
          </div>
        </aside>

        <!-- 右侧内容 -->
        <main class="setup-main" :class="{ 'setup-main-wide': isEditMode }">
          <div class="setup-content">

            <!-- ===== 步骤 1：获取令牌 ===== -->
            <div class="step-view step-token" v-if="!isEditMode && currentStep === 0">
              <div class="setup-panel token-guide-panel">
                <div class="token-guide-layout">
                  <a
                    href="https://www.notion.so/developers/connections"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="notion-dev-card"
                  >
                    <div class="notion-card-top">
                      <span class="notion-mark">
                        <font-awesome-icon :icon="['fab', 'notion']" />
                      </span>
                      <span class="notion-status">Developer portal</span>
                    </div>
                    <div class="notion-card-body">
                      <strong>Notion Connections</strong>
                      <span>创建 Integration 并复制访问令牌</span>
                    </div>
                    <div class="notion-card-action">
                      <span>打开开发者页面</span>
                      <font-awesome-icon :icon="['fas', 'arrow-up-right-from-square']" />
                    </div>
                  </a>

                  <div class="token-guide-side">
                    <div class="panel-copy">
                      <span class="panel-kicker">Notion Integration</span>
                      <p>完成开发者页面中的集成创建后，将访问令牌带回下一步。</p>
                    </div>

                    <div class="info-cards">
                      <div class="info-card">
                        <div class="info-card-icon"><font-awesome-icon :icon="['fas', 'check-circle']" /></div>
                        <div class="info-card-body">
                          <strong>关联工作区</strong>
                          <span>确认 Integration 已绑定目标工作区</span>
                        </div>
                      </div>
                      <div class="info-card">
                        <div class="info-card-icon"><font-awesome-icon :icon="['fas', 'fingerprint']" /></div>
                        <div class="info-card-body">
                          <strong>令牌格式</strong>
                          <span class="token-format-line">
                            <code>ntn_</code>
                            <em>或</em>
                            <code>secret_</code>
                            <em>开头</em>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="step-actions-row">
                <button v-if="hasExistingData" class="neo-btn-solid back" @click="cancelGuidedSetup">
                  <font-awesome-icon :icon="['fas', 'arrow-left']" />
                  返回列表
                </button>
                <span v-else></span>
                <button class="neo-btn-solid primary" @click="goToStep2">
                  下一步
                  <font-awesome-icon :icon="['fas', 'arrow-right']" />
                </button>
              </div>
            </div>

            <!-- ===== 步骤 2：填写信息（新增） / 编辑 ===== -->
            <div class="step-view step-workspace" v-if="(!isEditMode && currentStep === 1) || (isEditMode && currentStep === 1)">
              <div class="workspace-config-panel">
                <!-- 头像上传区（仅新增和编辑都显示） -->
                <section class="workspace-icon-panel">
                  <div class="workspace-panel-top">
                    <span class="workspace-panel-kicker">Workspace Identity</span>
                    <span class="workspace-state-pill">{{ isEditMode ? '编辑配置' : '新建配置' }}</span>
                  </div>

                  <div class="workspace-profile-card">
                    <div class="workspace-avatar-stage">
                      <div class="avatar-upload-box" @click="triggerIconUpload" title="点击上传图标">
                        <img v-if="iconPreviewUrl" :src="iconPreviewUrl" class="avatar-preview-img" @error="onIconPreviewError" />
                        <div v-else class="avatar-placeholder">
                          <font-awesome-icon :icon="['fas', 'image']" />
                        </div>
                        <div class="avatar-upload-overlay">
                          <font-awesome-icon :icon="['fas', 'camera']" />
                          <span>上传</span>
                        </div>
                      </div>
                      <input
                        ref="iconFileInput"
                        type="file"
                        accept="image/png, image/jpeg, image/webp, image/svg+xml"
                        class="hidden-input"
                        @change="handleIconFileChange"
                      />
                    </div>

                    <div class="workspace-live-preview">
                      <strong>{{ formState.name || '未命名工作区' }}</strong>
                      <span class="preview-code">{{ formState.code || 'workspace_code' }}</span>
                    </div>
                  </div>
                </section>

                <section class="workspace-form-panel">
                  <div class="workspace-form-top">
                    <span class="workspace-panel-kicker">Workspace Settings</span>
                    <span class="workspace-form-status">
                      <font-awesome-icon :icon="canSubmit ? ['fas', 'circle-check'] : ['fas', 'circle-dot']" />
                      {{ canSubmit ? '信息完整' : '等待填写' }}
                    </span>
                  </div>

                  <div class="form-area">
                    <div class="form-card">
                      <div class="field-pair">
                        <div class="field-item">
                          <label>工作区编码 <i class="req">*</i></label>
                          <div class="input-box input-box-icon">
                            <font-awesome-icon :icon="['fas', 'hashtag']" class="input-leading-icon" />
                            <input type="text" v-model="formState.code" placeholder="例如：my_workspace" />
                          </div>
                        </div>
                        <div class="field-item">
                          <label>工作区名称 <i class="req">*</i></label>
                          <div class="input-box input-box-icon">
                            <font-awesome-icon :icon="['fas', 'briefcase']" class="input-leading-icon" />
                            <input type="text" v-model="formState.name" placeholder="例如：我的工作区" />
                          </div>
                        </div>
                      </div>
                      <div class="field-item field-token">
                        <label>
                          访问令牌
                          <i class="req">*</i>
                        </label>
                        <div class="input-box input-box-pass input-box-icon">
                          <font-awesome-icon :icon="['fas', 'lock']" class="input-leading-icon" />
                          <input
                            :type="tokenVisible ? 'text' : 'password'"
                            v-model="formState.token"
                            :placeholder="isEditMode ? '请输入用于测试和保存的访问令牌' : '粘贴上一步获取的令牌'"
                          />
                          <button class="pass-toggle" @click="tokenVisible = !tokenVisible" type="button">
                            <font-awesome-icon :icon="tokenVisible ? ['fas', 'eye-slash'] : ['fas', 'eye']" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <div class="step-actions-row">
                <button v-if="isEditMode" class="neo-btn-solid back" @click="cancelGuidedSetup()">
                  <font-awesome-icon :icon="['fas', 'arrow-left']" />
                  返回列表
                </button>
                <button v-else class="neo-btn-solid back" @click="goToStep1()">
                  <font-awesome-icon :icon="['fas', 'arrow-left']" />
                  上一步
                </button>
                <button
                  v-if="isEditMode"
                  class="neo-btn-solid primary"
                  :disabled="!canSubmit"
                  @click="goToEditStep3"
                >
                  下一步
                  <font-awesome-icon :icon="['fas', 'arrow-right']" />
                </button>
                <!-- 新增模式 -->
                <button
                  v-else
                  class="neo-btn-solid primary"
                  :disabled="!canSubmit"
                  @click="goToStep3"
                >
                  下一步
                  <font-awesome-icon :icon="['fas', 'arrow-right']" />
                </button>
              </div>
            </div>

            <!-- ===== 步骤 3：测试连接（新增 / 编辑） ===== -->
            <div class="step-view step-test" v-if="currentStep === 2">
              <div class="test-connect-area">
                <div class="test-connect-hero" :class="{ tested: connectionTested, passed: connectionPassed, testing: connectionTesting }">
                  <div class="test-orb">
                    <font-awesome-icon
                      :icon="connectionTesting ? ['fas', 'spinner'] : connectionTested ? (connectionPassed ? ['fas', 'circle-check'] : ['fas', 'triangle-exclamation']) : ['fas', 'plug']"
                      :spin="connectionTesting"
                    />
                  </div>
                  <div class="test-hero-copy">
                    <span class="panel-kicker">Connection check</span>
                    <strong>{{ connectionTesting ? '正在验证连接' : connectionTested ? (connectionPassed ? 'Notion 连接可用' : '连接验证未通过') : '准备测试 Notion 连接' }}</strong>
                    <p>{{ connectionTested ? connectionMessage : '验证访问令牌是否可用，并确认当前配置可以正常连接到目标工作区。' }}</p>
                  </div>
                </div>

                <div class="test-config-strip">
                  <div class="test-config-item">
                    <font-awesome-icon :icon="['fas', 'briefcase']" />
                    <span>工作区</span>
                    <strong>{{ formState.name || '未命名工作区' }}</strong>
                  </div>
                  <div class="test-config-item">
                    <font-awesome-icon :icon="['fas', 'key']" />
                    <span>访问令牌</span>
                    <strong>{{ formState.token ? maskToken(formState.token) : '等待填写' }}</strong>
                  </div>
                </div>

                <button
                  class="neo-btn-solid test-btn"
                  :class="connectionTested ? (connectionPassed ? 'primary' : 'danger-outline') : 'primary'"
                  :disabled="connectionTesting"
                  @click="handleTestConnection"
                >
                  <font-awesome-icon :icon="connectionTesting ? ['fas', 'spinner'] : ['fas', 'plug']" :spin="connectionTesting" />
                  {{ connectionTesting ? '测试中...' : connectionTested ? '重新测试' : '开始测试连接' }}
                </button>
              </div>

              <div class="step-actions-row">
                <button class="neo-btn-solid back" @click="goToStep2">
                  <font-awesome-icon :icon="['fas', 'arrow-left']" />
                  上一步
                </button>
                <button
                  class="neo-btn-solid primary"
                  :disabled="!connectionPassed || guidedSubmitLoading"
                  @click="handleGuidedSubmit"
                >
                  <font-awesome-icon :icon="guidedSubmitLoading ? ['fas', 'spinner'] : ['fas', 'check']" :spin="guidedSubmitLoading" />
                  {{ isEditMode ? '确认保存' : '确认创建' }}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- ================= 删除确认弹窗 ================= -->
    <AppleConfirmModal
      v-model:visible="deleteConfirmVisible"
      type="danger"
      title="删除工作区"
      :desc="deleteConfirmDesc"
      confirmText="确认删除"
      :loading="deleteConfirmLoading"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import {
  getWorkspacePage, addWorkspace, updateWorkspace,
  deleteWorkspaceBatch, testWorkspaceConnection
} from '@/api/notion.ts'
import type { Workspace } from '@/types'
import type { TablePaginationConfig } from 'ant-design-vue'
import AppleConfirmModal from '@/components/common/AppleConfirmModal.vue'
import { AppleAlert } from '@/components/common/AppleAlert.ts'

const maskToken = (token: string) => {
  if (!token) return '-'
  if (token.length <= 8) return '****'
  return token.substring(0, 4) + '****' + token.substring(token.length - 4)
}

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const isBase64Image = (val: string | null | undefined): boolean => {
  if (!val) return false
  return val.startsWith('data:image/')
}

const columns = [
  { title: '工作区', key: 'workspace', width: 340 },
  { title: '访问令牌', key: 'token', width: 220 },
  { title: '创建时间', key: 'createTime', width: 180 },
  { title: '更新时间', key: 'updateTime', width: 180 },
  { title: '创建人', key: 'createBy', width: 120 },
  { title: '操作', key: 'action', align: 'center' as const, width: 140 }
]

const loading = ref(false)
const tableData = ref<Workspace[]>([])
const selectedRowKeys = ref<string[]>([])

const searchForm = reactive({ name: '', code: '', pageNum: 1, pageSize: 10 })
const pagination = reactive<TablePaginationConfig>({
  current: 1, pageSize: 10, total: 0,
  showSizeChanger: true, showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`
})

const deleteConfirmVisible = ref(false)
const deleteConfirmLoading = ref(false)
const deleteTargetId = ref<string | null>(null)
const deleteIsBatch = ref(false)
const deleteConfirmDesc = computed(() =>
  deleteIsBatch.value
    ? `确定要删除选中的 ${selectedRowKeys.value.length} 个工作区吗？此操作不可恢复。`
    : '确定要删除该工作区吗？此操作不可恢复。'
)
const confirmDelete = (id: string) => { deleteTargetId.value = id; deleteIsBatch.value = false; deleteConfirmVisible.value = true }
const confirmBatchDelete = () => { deleteIsBatch.value = true; deleteConfirmVisible.value = true }
const executeDelete = async () => {
  deleteConfirmLoading.value = true
  try {
    const ids = deleteIsBatch.value ? selectedRowKeys.value : [deleteTargetId.value!]
    await deleteWorkspaceBatch(ids)
    AppleAlert.success('删除成功', `已删除 ${ids.length} 个工作区`)
    if (deleteIsBatch.value) selectedRowKeys.value = []
    deleteConfirmVisible.value = false
    await fetchData(true)
  } catch (error: any) { AppleAlert.error('删除失败', error.message || '无法删除工作区') }
  finally { deleteConfirmLoading.value = false }
}

const guidedSetupVisible = ref(false)
const currentStep = ref(0)
const guidedSubmitLoading = ref(false)
const isEditMode = ref(false)
const editingId = ref<string | null>(null)
const hasExistingData = ref(false)
const tokenVisible = ref(false)
const formState = reactive({ name: '', code: '', icon: '', token: '' })
const originalEditState = ref({ name: '', code: '', icon: '', token: '' })

// ---------- 图标上传 ----------
const iconFileInput = ref<HTMLInputElement | null>(null)
const svgCodeVisible = ref(false)
const svgCodeInput = ref('')
const svgCodeError = ref('')
const iconPreviewUrl = ref('')
const iconPreviewFailed = ref(false)

// ---------- 连接测试 ----------
const connectionTested = ref(false)
const connectionPassed = ref(false)
const connectionTesting = ref(false)
const connectionMessage = ref('')
const connectionProgressClass = computed(() => {
  if (currentStep.value !== 2 || connectionTesting.value || !connectionTested.value) return ''
  return connectionPassed.value ? 'connection-progress-pass' : 'connection-progress-fail'
})
const pendingPayload = ref<any>(null)

const canSubmit = computed(() => {
  const base = formState.name.trim() && formState.code.trim()
  return base && formState.token.trim()
})

const triggerIconUpload = () => {
  iconFileInput.value?.click()
}

const handleIconFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
  if (!allowed.includes(file.type)) {
    AppleAlert.warning('格式不支持', '仅支持 PNG、JPG、WebP、SVG 格式')
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    AppleAlert.warning('文件过大', '图标文件不能超过 2MB')
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    const base64 = reader.result as string
    formState.icon = base64
    iconPreviewUrl.value = base64
    svgCodeVisible.value = false
    svgCodeInput.value = ''
    svgCodeError.value = ''
    iconPreviewFailed.value = false
  }
  reader.readAsDataURL(file)
  input.value = ''
}

const onSvgCodeInput = () => {
  svgCodeError.value = ''
  const code = svgCodeInput.value.trim()
  if (!code) {
    formState.icon = iconPreviewFailed.value ? '' : formState.icon
    return
  }
  if (!code.startsWith('<svg') && !code.startsWith('<?xml')) {
    svgCodeError.value = '请输入有效的 SVG 代码（以 <svg> 开头）'
    return
  }
  const base64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(code)))
  formState.icon = base64
  iconPreviewUrl.value = base64
  iconPreviewFailed.value = false
}

const onIconPreviewError = () => {
  iconPreviewFailed.value = true
  iconPreviewUrl.value = ''
  formState.icon = ''
}

const handleImgError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
}

// ---------- 滚动锁定 ----------
let scrollContainer: HTMLElement | null = null
const lockScroll = (locked: boolean) => {
  document.body.style.overflow = locked ? 'hidden' : ''
  if (!scrollContainer) {
    scrollContainer = document.querySelector('.apple-content-scroll')
  }
  if (scrollContainer) {
    scrollContainer.style.overflow = locked ? 'hidden' : ''
    scrollContainer.style.padding = locked ? '0' : ''
  }
}
watch(guidedSetupVisible, (val) => lockScroll(val))
onBeforeUnmount(() => lockScroll(false))

// ---------- 表单操作 ----------
const resetForm = () => {
  formState.name = ''; formState.code = ''
  formState.icon = ''; formState.token = ''
  originalEditState.value = { name: '', code: '', icon: '', token: '' }
  editingId.value = null; tokenVisible.value = false
  iconPreviewUrl.value = ''; svgCodeVisible.value = false
  svgCodeInput.value = ''; svgCodeError.value = ''
  iconPreviewFailed.value = false
  connectionTested.value = false; connectionPassed.value = false
  connectionTesting.value = false; connectionMessage.value = ''
  pendingPayload.value = null
}

const handleAdd = () => { isEditMode.value = false; resetForm(); guidedSetupVisible.value = true; currentStep.value = 0 }
const handleEdit = (record: Workspace) => {
  isEditMode.value = true; editingId.value = record.id
  formState.name = record.name; formState.code = record.code
  formState.icon = record.icon || ''
  formState.token = record.token || ''
  originalEditState.value = {
    name: record.name || '',
    code: record.code || '',
    icon: record.icon || '',
    token: record.token || ''
  }
  tokenVisible.value = false; svgCodeVisible.value = false
  svgCodeInput.value = ''; svgCodeError.value = ''
  connectionTested.value = false; connectionPassed.value = false
  connectionTesting.value = false; connectionMessage.value = ''
  pendingPayload.value = null
  if (record.icon && isBase64Image(record.icon)) {
    iconPreviewUrl.value = record.icon
    iconPreviewFailed.value = false
  } else {
    iconPreviewUrl.value = ''
    iconPreviewFailed.value = false
  }
  guidedSetupVisible.value = true; currentStep.value = 1
}
const goToStep1 = () => { currentStep.value = 0 }
const goToStep2 = () => { currentStep.value = 1 }
const goToStep3 = () => {
  if (!formState.name.trim()) { AppleAlert.warning('表单校验', '请输入工作区名称'); return }
  if (!formState.code.trim()) { AppleAlert.warning('表单校验', '请输入工作区编码'); return }
  if (!formState.token.trim()) { AppleAlert.warning('表单校验', '请输入访问令牌'); return }
  pendingPayload.value = {
    name: formState.name.trim(),
    code: formState.code.trim(),
    icon: formState.icon,
    token: formState.token.trim()
  }
  currentStep.value = 2
}
const goToEditStep3 = () => {
  if (!formState.name.trim()) { AppleAlert.warning('表单校验', '请输入工作区名称'); return }
  if (!formState.code.trim()) { AppleAlert.warning('表单校验', '请输入工作区编码'); return }
  if (!formState.token.trim()) { AppleAlert.warning('表单校验', '请输入访问令牌'); return }
  const nextState = {
    name: formState.name.trim(),
    code: formState.code.trim(),
    icon: formState.icon,
    token: formState.token.trim()
  }
  const payload: any = { id: editingId.value }
  if (nextState.name !== originalEditState.value.name) payload.name = nextState.name
  if (nextState.code !== originalEditState.value.code) payload.code = nextState.code
  if (nextState.icon !== originalEditState.value.icon) payload.icon = nextState.icon
  if (nextState.token !== originalEditState.value.token) payload.token = nextState.token
  pendingPayload.value = payload
  connectionTested.value = false
  connectionPassed.value = false
  connectionTesting.value = false
  connectionMessage.value = ''
  currentStep.value = 2
}
const cancelGuidedSetup = () => { guidedSetupVisible.value = false; currentStep.value = 0; isEditMode.value = false; resetForm() }

const handleTestConnection = async () => {
  connectionTesting.value = true
  connectionTested.value = false
  connectionPassed.value = false
  connectionMessage.value = ''
  try {
    await testWorkspaceConnection(formState.token.trim())
    connectionPassed.value = true
    connectionMessage.value = '令牌有效，已成功连接至你的 Notion 工作区'
  } catch (error: any) {
    connectionPassed.value = false
    connectionMessage.value = error.message || '连接失败，请检查令牌是否正确'
  } finally {
    connectionTested.value = true
    connectionTesting.value = false
  }
}

const handleGuidedSubmit = async () => {
  guidedSubmitLoading.value = true
  try {
    if (!connectionPassed.value) {
      AppleAlert.warning('连接校验', '请先通过连接测试')
      return
    }
    if (isEditMode.value) {
      if (!pendingPayload.value || Object.keys(pendingPayload.value).length <= 1) {
        AppleAlert.warning('无需保存', '未检测到配置变更')
        return
      }
      await updateWorkspace(pendingPayload.value)
      AppleAlert.success('编辑成功', '工作区配置已更新')
    } else {
      await addWorkspace(pendingPayload.value)
      AppleAlert.success('新增成功', '工作区配置已创建')
    }
    guidedSetupVisible.value = false; currentStep.value = 0; isEditMode.value = false
    resetForm(); fetchData()
  } catch (error: any) { AppleAlert.error(isEditMode.value ? '编辑失败' : '新增失败', error.message || '请稍后重试') }
  finally { guidedSubmitLoading.value = false }
}

const handleSearch = () => { searchForm.pageNum = 1; pagination.current = 1; fetchData() }
const handleReset = () => { searchForm.name = ''; searchForm.code = ''; searchForm.pageNum = 1; pagination.current = 1; selectedRowKeys.value = []; fetchData() }

const fetchData = async (checkEmpty = false) => {
  loading.value = true
  try {
    const res = await getWorkspacePage(searchForm)
    tableData.value = res.data.list
    pagination.total = res.data.total
    pagination.current = res.data.pageNum
    hasExistingData.value = res.data.total > 0
    if (checkEmpty && res.data.total === 0) {
      resetForm()
      isEditMode.value = false
      guidedSetupVisible.value = true
      currentStep.value = 0
    }
  }
  catch (error: any) { AppleAlert.error('数据加载失败', error.message || '无法获取工作区列表') }
  finally { loading.value = false }
}

const handleTableChange = (pag: TablePaginationConfig) => { searchForm.pageNum = pag.current || 1; searchForm.pageSize = pag.pageSize || 10; pagination.current = pag.current || 1; pagination.pageSize = pag.pageSize || 10; fetchData() }
const onSelectChange = (keys: string[]) => { selectedRowKeys.value = keys }

onMounted(() => { fetchData(true) })
</script>

<style scoped>
.neo-page-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 0 16px; gap: 20px;
}
.capsule-search {
  display: flex; min-width: 440px; background: var(--card-bg, #f5f5f7);
  border-radius: 14px; padding: 4px; border: 1px solid var(--border-color, rgba(0,0,0,0.08));
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); align-items: center;
}
.capsule-search:focus-within {
  background: var(--content-bg, #ffffff); border-color: var(--apple-blue, #0A84FF);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--apple-blue, #0A84FF) 10%, transparent);
}
.search-inputs { flex: 1; display: flex; align-items: center; padding: 0 4px; height: 30px; }
.search-inputs input {
  flex: 1; min-width: 0; width: 0; border: none; background: transparent;
  font-size: 13.5px; color: var(--text-main); outline: none; padding: 0 10px; height: 30px; line-height: 30px;
  font-family: inherit; letter-spacing: 0.1px;
}
.search-inputs input::placeholder { color: var(--text-muted, #a1a1aa); opacity: 0.55; }
.divider { width: 1px; height: 16px; background: var(--border-color, #e5e5ea); margin: 0 6px; flex-shrink: 0; opacity: 0.7; }
.search-actions { display: flex; gap: 4px; margin-left: 6px; }
.search-trigger {
  width: 32px; height: 32px; border: none; border-radius: 10px;
  background: var(--apple-blue, #0A84FF); color: #fff; cursor: pointer;
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1); display: flex; align-items: center; justify-content: center;
  font-size: 13px;
}
.search-trigger:hover { opacity: 0.88; transform: translateY(-1px); box-shadow: 0 2px 8px color-mix(in srgb, var(--apple-blue, #0A84FF) 35%, transparent); }
.search-trigger:active { transform: translateY(0); opacity: 0.8; }
.search-trigger.reset-btn {
  background: var(--hover-bg, rgba(0,0,0,0.06)); color: var(--text-main, #333);
  box-shadow: none;
}
.search-trigger.reset-btn:hover {
  background: var(--active-bg, rgba(0,0,0,0.1)); color: var(--text-main, #1d1d1f);
  transform: translateY(-1px); box-shadow: 0 2px 6px var(--shadow-color, rgba(0,0,0,0.06));
}
.header-actions { display: flex; gap: 10px; align-items: center; flex-shrink: 0; }
.workspace-cell {
  display: inline-grid; grid-template-columns: 42px minmax(0, 1fr); align-items: center; column-gap: 14px;
  min-width: 0; max-width: 100%; padding: 4px 12px 4px 2px; border-radius: 14px;
  transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}
.workspace-avatar {
  width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  box-sizing: border-box; padding: 5px;
  background: color-mix(in srgb, var(--text-muted, #86868b) 7%, var(--content-bg, #ffffff));
  color: color-mix(in srgb, var(--text-muted, #86868b) 78%, var(--text-main, #1d1d1f));
  border: 1px solid color-mix(in srgb, var(--text-muted, #86868b) 13%, transparent);
  box-shadow: none;
  overflow: hidden;
  font-size: 16px;
}
.workspace-avatar .table-icon-img {
  width: 100%; height: 100%; border-radius: 9px; object-fit: contain;
}
.workspace-avatar .table-icon-emoji { font-size: 20px; }
.workspace-meta {
  display: flex; flex-direction: column; justify-content: center; gap: 8px; min-width: 0;
}
.workspace-name-row {
  display: flex; align-items: center; min-width: 0;
}
.workspace-name {
  max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  font-size: 15px; line-height: 1.15; font-weight: 700; color: var(--text-main); letter-spacing: 0;
}
.workspace-code-row {
  display: flex; align-items: center; gap: 7px; min-width: 0;
}
.workspace-code-label {
  flex-shrink: 0; padding: 2px 5px; border-radius: 5px;
  font-size: 11px; line-height: 1.2; font-weight: 600;
  color: color-mix(in srgb, var(--text-muted, #86868b) 86%, #ffffff);
  background: color-mix(in srgb, var(--text-muted, #86868b) 10%, transparent);
}
.workspace-code {
  display: block;
  min-width: 0; max-width: 210px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 12.5px; line-height: 1.2; color: var(--text-muted, #86868b);
}
.token-cell {
  display: inline-flex; align-items: center; gap: 8px; max-width: 100%;
  height: 30px; padding: 0 10px 0 8px; border-radius: 9px;
  background: color-mix(in srgb, var(--text-muted, #86868b) 6%, transparent);
  border: 1px solid color-mix(in srgb, var(--text-muted, #86868b) 12%, transparent);
  color: var(--text-main);
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}
.token-cell:hover {
  background: color-mix(in srgb, var(--apple-blue, #0A84FF) 8%, transparent);
  border-color: color-mix(in srgb, var(--apple-blue, #0A84FF) 18%, transparent);
  color: var(--apple-blue, #0A84FF);
}
.token-icon {
  width: 18px; height: 18px; border-radius: 6px; flex-shrink: 0;
  display: inline-flex; align-items: center; justify-content: center;
  background: color-mix(in srgb, var(--apple-blue, #0A84FF) 10%, transparent);
  color: color-mix(in srgb, var(--apple-blue, #0A84FF) 82%, var(--text-muted, #86868b));
  font-size: 10px;
}
.token-value {
  min-width: 0; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 12.5px; line-height: 1; letter-spacing: 0.2px;
}
.action-btn-group { display: flex; align-items: center; justify-content: center; gap: 0; }
.text-action-btn {
  background: none; border: none; font-size: 13px; padding: 5px 10px; border-radius: 8px;
  cursor: pointer; transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  font-weight: 500; font-family: inherit;
}
.text-action-btn.primary { color: var(--apple-blue, #0A84FF); }
.text-action-btn.primary:hover { background: color-mix(in srgb, var(--apple-blue, #0A84FF) 10%, transparent); color: var(--apple-blue, #0066CC); }
.text-action-btn.danger { color: #FF3B30; }
.text-action-btn.danger:hover { background: rgba(255, 59, 48, 0.08); color: #D32F2F; }
.action-divider {
  width: 1px; height: 18px; background: var(--border-color, #e5e5ea);
  margin: 0 2px; opacity: 0.6;
}
.text-placeholder { color: var(--text-muted, #a1a1aa); }

.table-icon-cell { display: flex; align-items: center; justify-content: center; }
.table-icon-img { width: 100%; height: 100%; border-radius: 8px; object-fit: cover; }
.table-icon-emoji { font-size: 16px; line-height: 1; }

.hidden-input { display: none; }

/* ---------- 视图切换行 ---------- */
.view-toggle-row { display: flex; justify-content: flex-start; margin-bottom: 14px; }
</style>

<style>
/* =================================================================
   全页设置画布 — Setup Canvas v7
   ================================================================= */

.neo-page-container.is-setup {
  display: flex; flex-direction: column;
  height: 100%; overflow: hidden; padding: 0;
}

.setup-canvas {
  display: flex; flex-direction: column; flex: 1; min-height: 0;
  background: var(--content-bg, #ffffff);
  --step-accent: var(--apple-blue, #0A84FF);
  --step-accent-soft: color-mix(in srgb, var(--step-accent) 12%, transparent);
  --step-accent-border: color-mix(in srgb, var(--step-accent) 28%, transparent);
  animation: canvasReveal 0.45s cubic-bezier(0.22, 0.61, 0.36, 1);
}

@keyframes canvasReveal {
  from { opacity: 0; filter: blur(4px); }
  to   { opacity: 1; filter: blur(0); }
}

.setup-body { display: flex; flex-direction: column; flex: 1; min-height: 0; }

/* ---------- 左侧步骤导航 ---------- */
.setup-sidebar {
  width: 100%; flex-shrink: 0;
  background: var(--card-bg, #ffffff);
  border-right: none; border-bottom: 1px solid var(--border-color);
  display: block;
}

.sidebar-inner {
  width: 100%; max-width: 960px; margin: 0 auto; box-sizing: border-box;
  padding: 16px 32px; display: flex; flex-direction: row; align-items: center; gap: 12px;
}

.prog-item {
  display: flex; align-items: center; gap: 12px; min-width: 0; flex: 0 0 auto;
  padding: 0; opacity: 0.46; transition: opacity 0.4s;
}
.prog-item.active, .prog-item.done { opacity: 1; }

.prog-dot {
  width: 32px; height: 32px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; flex-shrink: 0;
  background: color-mix(in srgb, var(--text-muted, #86868b) 9%, transparent);
  color: var(--text-muted);
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.prog-item.active .prog-dot {
  background: var(--step-accent);
  color: #fff;
  box-shadow: 0 6px 18px color-mix(in srgb, var(--step-accent) 28%, transparent);
}

.prog-item.done .prog-dot {
  background: var(--step-accent); color: #fff;
  box-shadow: none;
}

.prog-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.prog-label { font-size: 13px; font-weight: 650; color: var(--text-main); letter-spacing: 0; white-space: nowrap; }
.prog-desc { font-size: 11px; color: var(--text-muted); line-height: 1.35; white-space: nowrap; }

.prog-line {
  flex: 1; min-width: 28px; height: 2px;
  background: color-mix(in srgb, var(--border-color) 50%, transparent);
  margin: 0; border-radius: 1px; overflow: hidden; position: relative;
}

.prog-line-fill {
  position: absolute; top: 0; bottom: 0; left: 0; width: 0;
  background: var(--step-accent);
  border-radius: 1px;
  transition: width 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.prog-line.on .prog-line-fill { width: 100%; }

.setup-canvas.connection-progress-pass {
  --progress-result-color: #34C759;
}
.setup-canvas.connection-progress-fail {
  --progress-result-color: #FF453A;
}
.setup-canvas.connection-progress-pass .prog-line.on .prog-line-fill,
.setup-canvas.connection-progress-fail .prog-line.on .prog-line-fill {
  background: var(--progress-result-color);
}
.setup-canvas.connection-progress-pass .prog-item.active .prog-dot,
.setup-canvas.connection-progress-pass .prog-item.done .prog-dot,
.setup-canvas.connection-progress-fail .prog-item.active .prog-dot,
.setup-canvas.connection-progress-fail .prog-item.done .prog-dot {
  background: var(--progress-result-color);
  color: #ffffff;
  box-shadow: 0 6px 18px color-mix(in srgb, var(--progress-result-color) 30%, transparent);
}

/* ---------- 右侧内容 ---------- */
.setup-main {
  flex: 1; display: flex; align-items: center; justify-content: center;
  overflow-y: auto; padding: 42px 40px;
  background: var(--content-bg, #ffffff);
}
.setup-main::-webkit-scrollbar { width: 4px; }
.setup-main::-webkit-scrollbar-track { background: transparent; }
.setup-main::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }

.setup-content { width: 100%; max-width: 840px; }
.setup-main-wide .setup-content { max-width: 840px; }

/* ---------- 步骤视图 ---------- */
.step-view {
  text-align: left;
  animation: stepEnter 0.35s cubic-bezier(0.22, 0.61, 0.36, 1);
}

@keyframes stepEnter {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ---------- 内容面板 ---------- */
.setup-panel {
  padding: 24px;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background: var(--card-bg, #ffffff);
  box-shadow: 0 8px 24px color-mix(in srgb, var(--shadow-color, rgba(0,0,0,0.08)) 55%, transparent);
  position: relative; overflow: hidden;
}
.setup-panel::before,
.workspace-icon-panel::before,
.workspace-form-panel::before,
.test-connect-area::before {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 4px;
  background: var(--step-accent);
}
.workspace-icon-panel,
.workspace-form-panel,
.test-connect-area {
  position: relative; overflow: hidden;
}

.panel-copy {
  max-width: 640px; margin-bottom: 18px;
}
.panel-kicker {
  display: block; margin-bottom: 7px;
  font-size: 12px; line-height: 1; font-weight: 700;
  color: var(--step-accent); letter-spacing: 0;
}
.panel-copy p {
  margin: 0; color: var(--text-muted); line-height: 1.7; font-size: 14px;
}

.token-guide-panel { padding: 0; }
.token-guide-panel::before { display: none; }
.token-guide-layout {
  display: grid; grid-template-columns: 1.05fr 1fr; gap: 0; min-height: 260px;
}
.notion-dev-card {
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; justify-content: space-between;
  padding: 26px; min-height: 260px;
  color: #111827; text-decoration: none;
  background:
    linear-gradient(135deg,
      color-mix(in srgb, var(--step-accent) 38%, #ffffff) 0%,
      color-mix(in srgb, var(--step-accent) 20%, #ffffff) 46%,
      color-mix(in srgb, var(--step-accent) 10%, #ffffff) 100%);
  border-right: 1px solid color-mix(in srgb, var(--step-accent) 32%, transparent);
  transition: background 0.24s ease, border-color 0.24s ease;
}
.notion-dev-card:hover {
  background:
    linear-gradient(135deg,
      color-mix(in srgb, var(--step-accent) 46%, #ffffff) 0%,
      color-mix(in srgb, var(--step-accent) 26%, #ffffff) 48%,
      color-mix(in srgb, var(--step-accent) 13%, #ffffff) 100%);
  border-color: color-mix(in srgb, var(--step-accent) 42%, transparent);
}
.notion-card-top {
  position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; gap: 14px;
}
.notion-mark {
  width: 48px; height: 48px; border-radius: 13px;
  display: inline-flex; align-items: center; justify-content: center;
  background: #ffffff; color: #111827; font-size: 28px; font-weight: 800;
  box-shadow: 0 10px 24px rgba(17, 24, 39, 0.18);
}
.notion-mark svg { display: block; }
.notion-status {
  padding: 6px 10px; border-radius: 999px;
  background: color-mix(in srgb, var(--step-accent) 15%, #ffffff);
  color: color-mix(in srgb, var(--step-accent) 82%, #111827);
  border: 1px solid color-mix(in srgb, var(--step-accent) 35%, transparent);
  font-size: 12px; font-weight: 650;
}
.notion-card-body {
  position: relative; z-index: 1; display: flex; flex-direction: column; gap: 8px;
}
.notion-card-body strong {
  font-size: 26px; line-height: 1.15; color: #111827; letter-spacing: 0;
}
.notion-card-body span { color: rgba(17,24,39,0.62); font-size: 14px; }
.notion-card-action {
  position: relative; z-index: 1;
  display: inline-flex; align-items: center; justify-content: space-between; gap: 12px;
  width: fit-content; min-width: 190px; height: 44px; padding: 0 14px 0 16px;
  border-radius: 12px; background: var(--step-accent); color: #ffffff;
  font-weight: 700; box-shadow: 0 10px 24px color-mix(in srgb, var(--step-accent) 24%, transparent);
}
.notion-dev-card:hover .notion-card-action svg { transform: translate(2px, -2px); }
.notion-card-action svg { transition: transform 0.2s ease; }
.token-guide-side {
  padding: 26px; display: flex; flex-direction: column; justify-content: center;
}

/* ---------- 信息卡片 ---------- */
.info-cards {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px;
  text-align: left; margin-bottom: 18px;
  border: none; border-radius: 0;
  overflow: visible; background: transparent;
  box-shadow: none;
}
.token-guide-side .info-cards {
  grid-template-columns: 1fr; margin-bottom: 0;
}

.info-card {
  display: flex; align-items: flex-start; gap: 14px; padding: 18px;
  background: color-mix(in srgb, var(--text-muted, #86868b) 4%, transparent);
  border: 1px solid color-mix(in srgb, var(--border-color) 72%, transparent); border-radius: 14px;
  box-shadow: none;
}
.info-card:hover {
  border-color: var(--step-accent-border);
  background: var(--step-accent-soft);
}
.info-card + .info-card { border-top: 1px solid var(--border-color); }

.info-card-icon {
  width: 34px; height: 34px; border-radius: 10px;
  background: var(--step-accent-soft);
  color: var(--step-accent);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; flex-shrink: 0;
}

.info-card-body {
  display: flex; flex-direction: column; gap: 4px;
  font-size: 13px; color: var(--text-muted); line-height: 1.55;
}
.info-card-body strong { color: var(--text-main); font-weight: 600; font-size: 14px; }
.token-format-line {
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
  min-height: 22px; line-height: 1;
}
.token-format-line em {
  font-style: normal; color: var(--text-muted); line-height: 20px;
}
.info-card-body code {
  display: inline-flex; align-items: center; height: 20px;
  padding: 0 7px; border-radius: 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 12px; line-height: 1; font-weight: 700; letter-spacing: 0;
  background: color-mix(in srgb, var(--step-accent) 9%, transparent);
  color: color-mix(in srgb, var(--step-accent) 72%, var(--text-main));
  border: 1px solid color-mix(in srgb, var(--step-accent) 16%, transparent);
}

/* ---------- 外链按钮 ---------- */
.accent-link {
  display: inline-flex; align-items: center; justify-content: center; gap: 12px;
  min-width: 280px; height: 46px; border-radius: 12px;
  border: 1.5px solid var(--step-accent);
  background: color-mix(in srgb, var(--step-accent) 6%, transparent);
  color: var(--step-accent);
  font-size: 15px; font-weight: 600; text-decoration: none; cursor: pointer;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  margin-bottom: 0; box-sizing: border-box;
}
.accent-link:hover {
  background: color-mix(in srgb, var(--step-accent) 13%, transparent);
  border-color: var(--step-accent);
  transform: translateY(-2px);
  box-shadow: 0 10px 28px color-mix(in srgb, var(--step-accent) 18%, transparent);
}
.accent-link-label { display: flex; align-items: center; gap: 9px; }
.accent-link-arrow { font-size: 13px; opacity: 0.45; transition: all 0.3s; }
.accent-link:hover .accent-link-arrow { opacity: 1; transform: translateX(4px); }

/* ---------- 底部操作行 ---------- */
.step-actions-row {
  display: flex; justify-content: space-between; align-items: center;
  padding-top: 18px; margin-top: 18px;
  border-top: 1px solid color-mix(in srgb, var(--border-color) 60%, transparent);
}
.step-actions-row .neo-btn-solid.primary:disabled {
  opacity: 0.35; cursor: not-allowed;
  transform: none !important; box-shadow: none !important; filter: none !important;
}
.step-actions-row .neo-btn-solid.primary,
.test-connect-area .neo-btn-solid.primary {
  background: var(--step-accent);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--step-accent) 24%, transparent);
}
.step-actions-row .neo-btn-solid.primary:hover,
.test-connect-area .neo-btn-solid.primary:hover {
  filter: brightness(1.04);
}

/* =================================================================
   工作区配置面板
   ================================================================= */
.workspace-config-panel {
  display: grid; grid-template-columns: minmax(260px, 0.85fr) minmax(0, 1.35fr); gap: 18px;
  align-items: stretch; text-align: left; margin-bottom: 26px;
}

.workspace-icon-panel,
.workspace-form-panel {
  background: var(--card-bg, #ffffff);
  border: 1px solid color-mix(in srgb, var(--border-color) 78%, transparent);
  border-radius: 18px;
  box-shadow: 0 16px 38px color-mix(in srgb, var(--shadow-color, rgba(0,0,0,0.08)) 62%, transparent);
  isolation: isolate;
}

.workspace-icon-panel::before,
.workspace-form-panel::before {
  inset: 0; width: auto;
  background:
    radial-gradient(circle at 14% 4%, color-mix(in srgb, var(--step-accent) 20%, transparent) 0, transparent 30%),
    radial-gradient(circle at 86% -10%, color-mix(in srgb, var(--step-accent) 13%, transparent) 0, transparent 34%),
    linear-gradient(145deg,
      color-mix(in srgb, var(--step-accent) 10%, transparent) 0%,
      color-mix(in srgb, var(--step-accent) 4%, transparent) 46%,
      transparent 100%);
  pointer-events: none; z-index: 0;
}
.workspace-icon-panel > *,
.workspace-form-panel > * {
  position: relative; z-index: 1;
}

.workspace-icon-panel {
  padding: 22px;
  display: flex; flex-direction: column; justify-content: flex-start;
  gap: 16px; height: 100%;
}

.workspace-form-panel {
  padding: 22px; min-width: 0;
  display: flex; flex-direction: column; gap: 20px;
}

.workspace-panel-top,
.workspace-form-top {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
}

.workspace-panel-kicker {
  color: var(--step-accent);
  font-size: 12px; line-height: 1; font-weight: 800; letter-spacing: 0;
}

.workspace-state-pill,
.workspace-form-status {
  display: inline-flex; align-items: center; gap: 6px;
  height: 26px; padding: 0 10px; border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--step-accent) 24%, transparent);
  background: color-mix(in srgb, var(--step-accent) 9%, transparent);
  color: color-mix(in srgb, var(--step-accent) 78%, var(--text-main));
  font-size: 12px; font-weight: 650; white-space: nowrap;
}
.workspace-form-status svg {
  color: var(--step-accent); font-size: 12px;
}

.workspace-profile-card {
  position: relative; overflow: hidden;
  flex: 1; min-height: 118px; padding: 20px;
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--step-accent) 24%, transparent);
  background:
    radial-gradient(circle at 24% 18%,
      color-mix(in srgb, var(--step-accent) 18%, #ffffff) 0%,
      transparent 42%),
    radial-gradient(circle at 94% 88%,
      color-mix(in srgb, var(--step-accent) 18%, transparent) 0%,
      transparent 36%),
    linear-gradient(145deg,
      color-mix(in srgb, var(--step-accent) 16%, #ffffff) 0%,
      color-mix(in srgb, var(--step-accent) 8%, #ffffff) 48%,
      var(--card-bg, #ffffff) 100%);
  display: flex; align-items: center; justify-content: flex-start; gap: 16px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.5);
}
.workspace-profile-card::after {
  content: ""; position: absolute; right: -48px; bottom: -58px;
  width: 146px; height: 146px; border-radius: 999px;
  background:
    radial-gradient(circle,
      color-mix(in srgb, var(--step-accent) 22%, transparent) 0%,
      color-mix(in srgb, var(--step-accent) 8%, transparent) 52%,
      transparent 70%);
  pointer-events: none;
}

.workspace-avatar-stage {
  position: relative; z-index: 1;
  flex: 0 0 auto;
  display: flex; align-items: center; justify-content: flex-start;
}

.avatar-upload-box {
  width: 82px; height: 82px; border-radius: 18px;
  border: 1.5px dashed color-mix(in srgb, var(--step-accent) 34%, var(--border-color));
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; position: relative; overflow: hidden;
  transition: all 0.25s;
  background: color-mix(in srgb, var(--card-bg, #ffffff) 76%, var(--step-accent) 10%);
  box-shadow: 0 14px 28px color-mix(in srgb, var(--step-accent) 14%, transparent);
}
.avatar-upload-box:hover {
  border-color: var(--step-accent);
  background: color-mix(in srgb, var(--step-accent) 12%, var(--card-bg, #ffffff));
  transform: translateY(-2px);
}

.avatar-preview-img {
  width: calc(100% - 10px); height: calc(100% - 10px);
  object-fit: contain; border-radius: 15px;
}

.avatar-placeholder { font-size: 30px; color: var(--step-accent); opacity: 0.76; transition: opacity 0.2s; }
.avatar-upload-box:hover .avatar-placeholder { opacity: 1; }

.avatar-upload-overlay {
  position: absolute; inset: 0;
  background: color-mix(in srgb, var(--step-accent) 72%, rgba(0,0,0,0.28));
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 4px; color: #fff; font-size: 12px; font-weight: 700;
  opacity: 0; transition: opacity 0.25s; border-radius: 16px;
}
.avatar-upload-overlay svg { font-size: 16px; }
.avatar-upload-box:hover .avatar-upload-overlay { opacity: 1; }

.workspace-live-preview {
  position: relative; z-index: 1;
  flex: 1; width: auto; box-sizing: border-box;
  display: flex; flex-direction: column; gap: 8px; min-width: 0;
}
.workspace-live-preview strong {
  font-size: 22px; line-height: 1.18; color: var(--text-main);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.workspace-live-preview .preview-code {
  width: fit-content; max-width: 100%;
  padding: 5px 9px; border-radius: 8px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 12px; font-weight: 700; color: color-mix(in srgb, var(--step-accent) 72%, var(--text-main));
  background: color-mix(in srgb, var(--step-accent) 9%, transparent);
  border: 1px solid color-mix(in srgb, var(--step-accent) 14%, transparent);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

/* =================================================================
   测试连接区
   ================================================================= */
.test-connect-area {
  --test-status-color: var(--step-accent);
  text-align: left; margin-bottom: 28px;
  padding: 24px; border: 1px solid color-mix(in srgb, var(--test-status-color) 18%, var(--border-color)); border-radius: 18px;
  background:
    radial-gradient(circle at 12% 0%, color-mix(in srgb, var(--test-status-color) 16%, transparent) 0, transparent 34%),
    radial-gradient(circle at 92% 90%, color-mix(in srgb, var(--test-status-color) 8%, transparent) 0, transparent 38%),
    linear-gradient(145deg, color-mix(in srgb, var(--test-status-color) 6%, transparent) 0%, var(--card-bg, #ffffff) 68%);
  box-shadow: 0 16px 38px color-mix(in srgb, var(--test-status-color) 8%, var(--shadow-color, rgba(0,0,0,0.08)));
}

.test-connect-area::before { display: none; }

.setup-canvas.connection-progress-pass .test-connect-area {
  --test-status-color: #34C759;
}

.setup-canvas.connection-progress-fail .test-connect-area {
  --test-status-color: #FF453A;
}

.test-connect-hero {
  display: grid; grid-template-columns: 58px minmax(0, 1fr); gap: 16px;
  align-items: center; padding: 20px;
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--test-status-color) 18%, var(--border-color));
  background:
    radial-gradient(circle at 8% 10%, color-mix(in srgb, var(--test-status-color) 11%, transparent) 0, transparent 42%),
    color-mix(in srgb, var(--text-muted, #86868b) 3%, transparent);
}
.test-connect-hero.testing {
  border-color: color-mix(in srgb, var(--test-status-color) 32%, transparent);
}

.test-orb {
  width: 50px; height: 50px; border-radius: 15px;
  display: flex; align-items: center; justify-content: center;
  color: var(--test-status-color); font-size: 20px;
  background: color-mix(in srgb, var(--test-status-color) 12%, transparent);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.36);
}

.test-hero-copy {
  min-width: 0; display: flex; flex-direction: column; gap: 7px;
}
.test-connect-area .panel-kicker {
  color: var(--test-status-color);
}
.test-hero-copy strong {
  color: var(--text-main); font-size: 20px; line-height: 1.2; letter-spacing: 0;
}
.test-hero-copy p {
  margin: 0; color: var(--text-muted); font-size: 14px; line-height: 1.65;
}

.test-config-strip {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px;
  margin-top: 14px;
}
.test-config-item {
  min-width: 0; display: grid; grid-template-columns: 18px auto minmax(0, 1fr); gap: 8px;
  align-items: center; min-height: 42px; padding: 0 13px;
  border-radius: 13px;
  border: 1px solid color-mix(in srgb, var(--test-status-color) 12%, var(--border-color));
  background: color-mix(in srgb, var(--test-status-color) 4%, transparent);
}
.test-config-item svg {
  color: var(--test-status-color); font-size: 13px;
}
.test-config-item span {
  color: var(--text-muted); font-size: 12px; font-weight: 650;
}
.test-config-item strong {
  min-width: 0; color: var(--text-main); font-size: 13px; font-weight: 700;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

.test-btn {
  width: auto; min-width: 180px; height: 44px; border-radius: 12px; font-size: 14px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  margin-top: 18px;
}
.test-connect-area .test-btn.primary {
  background: var(--test-status-color);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--test-status-color) 22%, transparent);
}
.test-connect-area .test-btn.danger-outline {
  color: var(--test-status-color);
  border-color: color-mix(in srgb, var(--test-status-color) 44%, transparent);
}
.test-connect-area .test-btn.danger-outline:hover {
  background: color-mix(in srgb, var(--test-status-color) 8%, transparent);
  border-color: var(--test-status-color);
}
.neo-btn-solid.danger-outline {
  background: transparent; color: #FF453A;
  border: 1.5px solid color-mix(in srgb, #FF453A 40%, transparent);
}
.neo-btn-solid.danger-outline:hover {
  background: color-mix(in srgb, #FF453A 8%, transparent);
  border-color: #FF453A;
}
.neo-btn-solid.back {
  background: var(--hover-bg, #f5f5f7);
  color: var(--text-main, #1d1d1f);
  box-shadow: 0 2px 8px var(--shadow-color, rgba(0,0,0,0.04)),
              0 0 0 1px var(--border-color, rgba(0,0,0,0.06));
}
.neo-btn-solid.back:hover {
  background: var(--active-bg, #e8e8ed);
  transform: translateY(-1px);
}

/* ---------- 表单 ---------- */
.form-area { text-align: left; margin-bottom: 0; }
.form-card {
  background: color-mix(in srgb, var(--text-muted, #86868b) 3%, transparent);
  border: 1px solid color-mix(in srgb, var(--border-color) 72%, transparent);
  border-radius: 16px; padding: 18px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.32);
}
.field-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.field-token { margin-top: 20px; }
.field-item { display: flex; flex-direction: column; gap: 8px; }
.field-item label {
  display: flex; align-items: center; gap: 7px;
  font-size: 13px; font-weight: 700; color: var(--text-main); letter-spacing: 0;
}
.req { color: #FF453A; font-style: normal; font-size: 11px; }

.input-box { position: relative; }
.input-leading-icon {
  position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
  z-index: 1; width: 14px; height: 14px; border-radius: 0;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 13px; color: var(--step-accent); opacity: 0.82;
  background: transparent;
  pointer-events: none;
}
.input-box input {
  width: 100%; height: 48px; padding: 0 14px; border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--border-color) 78%, transparent);
  background: var(--card-bg, #ffffff);
  font-size: 14px; color: var(--text-main); outline: none;
  transition: all 0.25s; box-sizing: border-box; font-family: inherit;
}
.input-box-icon input { padding-left: 42px; }
.input-box input::placeholder { color: var(--text-muted); opacity: 0.6; }
.input-box input:focus {
  background: var(--card-bg, #ffffff); border-color: var(--step-accent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--step-accent) 10%, transparent);
}

.input-box-pass input { padding-right: 48px; }
.input-box-pass.input-box-icon input { padding-left: 42px; padding-right: 48px; }
.pass-toggle {
  position: absolute; right: 7px; top: 50%; transform: translateY(-50%);
  border: none; background: transparent;
  color: var(--text-muted); cursor: pointer; font-size: 15px;
  width: 34px; height: 34px; padding: 0; border-radius: 9px;
  display: inline-flex; align-items: center; justify-content: center;
  transition: all 0.15s; line-height: 1; opacity: 0.72;
}
.pass-toggle:hover { color: var(--step-accent); background: var(--step-accent-soft); opacity: 1; }

@media (max-width: 960px) {
  .setup-main { padding: 36px 28px; }
  .token-guide-layout { grid-template-columns: 1fr; }
  .notion-dev-card { border-right: none; border-bottom: 1px solid color-mix(in srgb, var(--step-accent) 20%, transparent); }
  .workspace-config-panel { grid-template-columns: 1fr; }
  .workspace-icon-panel { min-height: 0; }
  .workspace-profile-card { min-height: 112px; }
}

@media (max-width: 720px) {
  .sidebar-inner { padding: 14px 18px; gap: 8px; overflow-x: auto; }
  .prog-item { gap: 8px; }
  .prog-line { min-width: 22px; }
  .prog-desc { display: none; }
  .setup-main { padding: 28px 18px; align-items: flex-start; }
  .field-pair { grid-template-columns: 1fr; }
  .view-desc { white-space: normal; }
  .info-cards { grid-template-columns: 1fr; }
  .workspace-icon-panel,
  .workspace-form-panel { padding: 18px; border-radius: 16px; }
  .workspace-profile-card { padding: 18px; gap: 14px; }
  .workspace-form-top,
  .workspace-panel-top { align-items: flex-start; flex-direction: column; }
  .workspace-live-preview strong { font-size: 20px; }
  .notion-dev-card,
  .token-guide-side { padding: 22px; }
  .notion-card-body strong { font-size: 23px; }
  .notion-card-action { width: 100%; box-sizing: border-box; }
  .accent-link { width: 100%; min-width: 0; }
  .test-connect-area { padding: 18px; }
  .test-connect-hero { grid-template-columns: 1fr; gap: 14px; padding: 18px; }
  .test-orb { width: 44px; height: 44px; border-radius: 13px; }
  .test-config-strip { grid-template-columns: 1fr; }
  .test-btn { width: 100%; }
}

@media (max-width: 420px) {
  .workspace-profile-card {
    align-items: flex-start; flex-direction: column;
  }
  .workspace-live-preview { width: 100%; }
}

/* ---------- 暗黑模式 ---------- */
html.dark .setup-canvas { background: var(--modal-bg, #1c1c1e); }

html.dark .setup-canvas {
  --step-accent-soft: color-mix(in srgb, var(--step-accent) 14%, transparent);
  --step-accent-border: color-mix(in srgb, var(--step-accent) 28%, transparent);
}

html.dark .setup-sidebar {
  background: var(--card-bg, #1e1e1c);
  border-color: rgba(255,255,255,0.05);
}

html.dark .prog-item:not(.active):not(.done) .prog-dot {
  background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.2);
}

html.dark .prog-item.active .prog-dot {
  box-shadow: 0 0 0 6px color-mix(in srgb, var(--step-accent) 16%, transparent),
              0 6px 24px color-mix(in srgb, var(--step-accent) 35%, transparent);
}

html.dark .setup-main {
  background: var(--modal-bg, #1c1c1e);
}

html.dark .setup-main::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); }

html.dark .setup-panel {
  background: var(--card-bg, #1e1e1c);
  border-color: rgba(255,255,255,0.06);
  box-shadow: 0 12px 30px rgba(0,0,0,0.18);
}

html.dark .notion-dev-card {
  background:
    linear-gradient(135deg,
      color-mix(in srgb, var(--step-accent) 42%, #111827) 0%,
      color-mix(in srgb, var(--step-accent) 24%, #111827) 48%,
      color-mix(in srgb, var(--step-accent) 11%, #111827) 100%);
  color: #ffffff;
  border-color: color-mix(in srgb, var(--step-accent) 34%, transparent);
}
html.dark .notion-dev-card:hover {
  background:
    linear-gradient(135deg,
      color-mix(in srgb, var(--step-accent) 50%, #111827) 0%,
      color-mix(in srgb, var(--step-accent) 30%, #111827) 48%,
      color-mix(in srgb, var(--step-accent) 15%, #111827) 100%);
}
html.dark .notion-mark {
  background: #ffffff; color: #111827; box-shadow: 0 10px 24px rgba(0,0,0,0.22);
}
html.dark .notion-status {
  background: color-mix(in srgb, var(--step-accent) 18%, rgba(255,255,255,0.08));
  color: color-mix(in srgb, var(--step-accent) 82%, #ffffff);
  border-color: color-mix(in srgb, var(--step-accent) 38%, transparent);
}
html.dark .notion-card-body strong { color: #ffffff; }
html.dark .notion-card-body span { color: rgba(255,255,255,0.58); }

html.dark .info-cards { background: transparent; box-shadow: none; }
html.dark .info-card {
  background: rgba(255,255,255,0.035);
  border-color: rgba(255,255,255,0.06);
  box-shadow: none;
}
html.dark .info-card + .info-card { border-top-color: rgba(255,255,255,0.06); }
html.dark .info-card-icon { background: color-mix(in srgb, var(--step-accent) 14%, transparent); }
html.dark .info-card-body code {
  background: color-mix(in srgb, var(--step-accent) 16%, transparent);
  color: color-mix(in srgb, var(--step-accent) 76%, #ffffff);
  border-color: color-mix(in srgb, var(--step-accent) 24%, transparent);
}

html.dark .accent-link {
  background: color-mix(in srgb, var(--step-accent) 9%, transparent);
  border-color: color-mix(in srgb, var(--step-accent) 60%, transparent);
}
html.dark .accent-link:hover {
  background: color-mix(in srgb, var(--step-accent) 16%, transparent);
  border-color: var(--step-accent);
}

html.dark .test-connect-area {
  border-color: color-mix(in srgb, var(--test-status-color) 20%, rgba(255,255,255,0.08));
  background:
    radial-gradient(circle at 12% 0%, color-mix(in srgb, var(--test-status-color) 17%, transparent) 0, transparent 34%),
    radial-gradient(circle at 92% 90%, color-mix(in srgb, var(--test-status-color) 10%, transparent) 0, transparent 38%),
    linear-gradient(145deg, color-mix(in srgb, var(--test-status-color) 7%, transparent) 0%, var(--card-bg, #1e1e1c) 68%);
  box-shadow: 0 16px 38px color-mix(in srgb, var(--test-status-color) 7%, rgba(0,0,0,0.2));
}
html.dark .test-connect-hero {
  background:
    radial-gradient(circle at 8% 10%, color-mix(in srgb, var(--test-status-color) 13%, transparent) 0, transparent 42%),
    rgba(255,255,255,0.035);
  border-color: color-mix(in srgb, var(--test-status-color) 16%, rgba(255,255,255,0.07));
}
html.dark .test-orb {
  box-shadow: none;
  background: color-mix(in srgb, var(--test-status-color) 16%, transparent);
}
html.dark .test-config-item {
  background: color-mix(in srgb, var(--test-status-color) 7%, rgba(255,255,255,0.02));
  border-color: color-mix(in srgb, var(--test-status-color) 16%, rgba(255,255,255,0.06));
}

html.dark .workspace-icon-panel,
html.dark .workspace-form-panel {
  background: var(--card-bg, #1e1e1c);
  border-color: rgba(255,255,255,0.06);
  box-shadow: 0 12px 30px rgba(0,0,0,0.18);
}

html.dark .workspace-icon-panel::before,
html.dark .workspace-form-panel::before {
  background:
    radial-gradient(circle at 14% 4%, color-mix(in srgb, var(--step-accent) 42%, #111827) 0, transparent 32%),
    radial-gradient(circle at 86% -10%, color-mix(in srgb, var(--step-accent) 24%, #111827) 0, transparent 36%),
    linear-gradient(135deg,
      color-mix(in srgb, var(--step-accent) 42%, #111827) 0%,
      color-mix(in srgb, var(--step-accent) 24%, #111827) 48%,
      color-mix(in srgb, var(--step-accent) 11%, #111827) 100%);
}

html.dark .workspace-state-pill,
html.dark .workspace-form-status {
  background: color-mix(in srgb, var(--step-accent) 14%, transparent);
  border-color: color-mix(in srgb, var(--step-accent) 30%, transparent);
  color: color-mix(in srgb, var(--step-accent) 74%, #ffffff);
}

html.dark .workspace-profile-card {
  border-color: color-mix(in srgb, var(--step-accent) 26%, transparent);
  background:
    radial-gradient(circle at 24% 18%,
      color-mix(in srgb, var(--step-accent) 23%, #111827) 0%,
      transparent 42%),
    radial-gradient(circle at 94% 88%,
      color-mix(in srgb, var(--step-accent) 22%, transparent) 0%,
      transparent 38%),
    linear-gradient(145deg,
      color-mix(in srgb, var(--step-accent) 24%, #111827) 0%,
      color-mix(in srgb, var(--step-accent) 12%, #111827) 48%,
      var(--card-bg, #1e1e1c) 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
}
html.dark .workspace-profile-card::after {
  background:
    radial-gradient(circle,
      color-mix(in srgb, var(--step-accent) 24%, transparent) 0%,
      color-mix(in srgb, var(--step-accent) 9%, transparent) 52%,
      transparent 70%);
}

html.dark .input-box input {
  background: rgba(255,255,255,0.045); border-color: rgba(255,255,255,0.07); color: #ffffff;
}
html.dark .input-box input:focus {
  background: rgba(255,255,255,0.065); border-color: var(--step-accent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--step-accent) 18%, transparent);
}

html.dark .form-card {
  background: rgba(255,255,255,0.03);
  border-color: rgba(255,255,255,0.06);
  box-shadow: none;
}

html.dark .avatar-upload-box {
  border-color: color-mix(in srgb, var(--step-accent) 28%, rgba(255,255,255,0.12));
  background: color-mix(in srgb, var(--step-accent) 9%, rgba(255,255,255,0.04));
  box-shadow: 0 12px 24px color-mix(in srgb, var(--step-accent) 10%, rgba(0,0,0,0.1));
}
html.dark .avatar-upload-box:hover {
  border-color: var(--step-accent);
  background: color-mix(in srgb, var(--step-accent) 16%, transparent);
}
html.dark .workspace-live-preview .preview-code {
  background: color-mix(in srgb, var(--step-accent) 15%, transparent);
  border-color: color-mix(in srgb, var(--step-accent) 22%, transparent);
  color: color-mix(in srgb, var(--step-accent) 76%, #ffffff);
}
html.dark .input-leading-icon {
  color: var(--step-accent); opacity: 0.84;
  background: transparent;
}

/* ---------- 列表视图暗黑模式 ---------- */
html.dark .neo-page-header .capsule-search {
  background: var(--card-bg, #1e1e1c); border-color: rgba(255,255,255,0.06);
}
html.dark .neo-page-header .capsule-search:focus-within {
  background: var(--card-bg, #1e1e1c); border-color: var(--apple-blue, #0A84FF);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--apple-blue, #0A84FF) 14%, transparent);
}
html.dark .search-inputs input { color: rgba(255,255,255,0.9); }
html.dark .search-inputs input::placeholder { color: rgba(255,255,255,0.25); }
html.dark .search-inputs .divider { background: rgba(255,255,255,0.07); }
html.dark .search-trigger.reset-btn { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.55); }
html.dark .search-trigger.reset-btn:hover { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.85); box-shadow: 0 2px 6px rgba(0,0,0,0.3); }

html.dark .neo-btn-flat {
  color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
}
html.dark .neo-btn-flat:hover { background: rgba(255,255,255,0.08); color: #ffffff; }
html.dark .neo-btn-flat.danger { color: #FF453A; background: rgba(255,69,58,0.08); border-color: rgba(255,69,58,0.15); }
html.dark .neo-btn-flat.danger:hover { background: rgba(255,69,58,0.16); }

html.dark .neo-card.table-card {
  background: var(--modal-bg, #1c1c1e); border-color: rgba(255,255,255,0.05);
}

/* ---------- 表格暗黑模式 ---------- */
html.dark .neo-table .ant-table { background: transparent; }
html.dark .neo-table .ant-table-thead > tr > th {
  background: rgba(255,255,255,0.02); color: rgba(255,255,255,0.45);
  border-bottom-color: rgba(255,255,255,0.05); font-weight: 500;
}
html.dark .neo-table .ant-table-tbody > tr > td {
  border-bottom-color: rgba(255,255,255,0.04); color: rgba(255,255,255,0.7);
}
html.dark .neo-table .ant-table-tbody > tr:hover > td {
  background: rgba(255,255,255,0.025);
}
html.dark .neo-table .ant-table-tbody > tr.ant-table-row-selected > td {
  background: color-mix(in srgb, var(--apple-blue, #0A84FF) 10%, transparent);
}
html.dark .neo-table .ant-pagination-item { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.06); }
html.dark .neo-table .ant-pagination-item a { color: rgba(255,255,255,0.55); }
html.dark .neo-table .ant-pagination-item-active { background: var(--apple-blue, #0A84FF); border-color: transparent; }
html.dark .neo-table .ant-pagination-item-active a { color: #ffffff; }
html.dark .workspace-name { color: rgba(255,255,255,0.85); }
html.dark .workspace-avatar {
  background: rgba(255,255,255,0.045);
  color: rgba(255,255,255,0.52);
  border-color: rgba(255,255,255,0.08);
  box-shadow: none;
}
html.dark .workspace-code {
  color: rgba(255,255,255,0.42);
}
html.dark .workspace-code-label {
  color: rgba(255,255,255,0.38);
  background: rgba(255,255,255,0.055);
}
html.dark .token-cell {
  background: rgba(255,255,255,0.045);
  border-color: rgba(255,255,255,0.075);
  color: rgba(255,255,255,0.72);
}
html.dark .token-cell:hover {
  background: color-mix(in srgb, var(--apple-blue, #3B82F6) 12%, transparent);
  border-color: color-mix(in srgb, var(--apple-blue, #3B82F6) 20%, transparent);
  color: var(--apple-blue, #60A5FA);
}
html.dark .token-icon {
  background: rgba(255,255,255,0.06);
  color: color-mix(in srgb, var(--apple-blue, #60A5FA) 68%, rgba(255,255,255,0.5));
}

html.dark .action-divider { background: rgba(255,255,255,0.07); }
html.dark .text-placeholder { color: rgba(255,255,255,0.2); }
html.dark .text-action-btn.primary { color: var(--apple-blue, #3B82F6); }
html.dark .text-action-btn.primary:hover { background: color-mix(in srgb, var(--apple-blue, #3B82F6) 12%, transparent); color: var(--apple-blue, #60A5FA); }
html.dark .text-action-btn.danger { color: #FF453A; }
html.dark .text-action-btn.danger:hover { background: rgba(255,69,58,0.12); }

/* ---------- 类型 Pill: 编码列 ---------- */
.type-code {
  background: color-mix(in srgb, var(--apple-blue, #0A84FF) 12%, transparent);
  color: var(--apple-blue, #0A84FF);
  border: 1px solid color-mix(in srgb, var(--apple-blue, #0A84FF) 12%, transparent);
}
html.dark .type-code {
  color: var(--apple-blue, #3B82F6);
  background: color-mix(in srgb, var(--apple-blue, #0A84FF) 16%, transparent);
  border-color: color-mix(in srgb, var(--apple-blue, #0A84FF) 16%, transparent);
}
</style>
