<template>
  <div class="file-upload-test-container">
    <div class="upload-card">
      <div class="card-header">
        <font-awesome-icon :icon="['fas', 'cloud-upload-alt']" class="header-icon" />
        <h2>Notion 文件上传测试</h2>
        <p class="card-desc">选择工作区并上传多个文件到 Notion</p>
      </div>

      <div class="card-body">
        <!-- 工作区选择 -->
        <div class="form-group">
          <label class="form-label">
            <font-awesome-icon :icon="['fas', 'building']" />
            工作区
          </label>
          <a-select
            v-model:value="workspaceId"
            placeholder="请选择工作区"
            :loading="workspaceLoading"
            class="full-width-select"
          >
            <a-select-option
              v-for="ws in workspaces"
              :key="ws.id"
              :value="ws.id"
            >
              <span class="ws-option">
                <span class="ws-icon">{{ ws.icon || '🏢' }}</span>
                <span class="ws-name">{{ ws.name }}</span>
                <span class="ws-code">{{ ws.code }}</span>
              </span>
            </a-select-option>
          </a-select>
        </div>

        <!-- 文件选择 -->
        <div class="form-group">
          <label class="form-label">
            <font-awesome-icon :icon="['fas', 'file']" />
            选择文件
            <span v-if="selectedFiles.length" class="file-count-badge">{{ selectedFiles.length }}</span>
          </label>
          <div
            class="file-drop-zone"
            :class="{ 'is-dragover': isDragover, 'has-file': selectedFiles.length }"
            @dragover.prevent="isDragover = true"
            @dragleave.prevent="isDragover = false"
            @drop.prevent="handleFileDrop"
          >
            <input
              ref="fileInputRef"
              type="file"
              multiple
              class="file-input-hidden"
              @change="handleFileSelect"
            />
            <template v-if="!selectedFiles.length">
              <font-awesome-icon :icon="['fas', 'cloud-arrow-up']" class="drop-icon" />
              <p class="drop-text">拖拽文件到此处</p>
              <p class="drop-sub">或</p>
              <button class="browse-btn" @click="fileInputRef?.click()">
                <font-awesome-icon :icon="['fas', 'folder-open']" />
                浏览文件
              </button>
            </template>
            <template v-else>
              <div class="file-list">
                <div v-for="(f, idx) in selectedFiles" :key="f.name + f.size" class="file-item">
                  <font-awesome-icon :icon="['fas', 'file-lines']" class="file-icon" />
                  <div class="file-details">
                    <span class="file-name">{{ f.name }}</span>
                    <span class="file-size">{{ formatFileSize(f.size) }}</span>
                  </div>
                  <button class="clear-file-btn" title="移除" @click.stop="removeFile(idx)">
                    <font-awesome-icon :icon="['fas', 'xmark']" />
                  </button>
                </div>
              </div>
              <button class="clear-all-btn" @click="clearAllFiles">
                <font-awesome-icon :icon="['fas', 'trash']" />
                清除全部
              </button>
            </template>
          </div>
        </div>

        <!-- 文件信息预览 -->
        <div v-if="selectedFiles.length" class="file-preview">
          <div class="preview-row">
            <span class="preview-label">文件数量</span>
            <span class="preview-value">{{ selectedFiles.length }} 个</span>
          </div>
          <div class="preview-row">
            <span class="preview-label">总大小</span>
            <span class="preview-value">{{ totalSize }}</span>
          </div>
        </div>

        <!-- 上传按钮 -->
        <button
          class="upload-btn"
          :disabled="!canUpload || uploading"
          @click="handleUpload"
        >
          <font-awesome-icon
            :icon="['fas', uploading ? 'spinner' : 'upload']"
            :class="{ spin: uploading }"
          />
          <span>{{ uploading ? '上传中...' : `上传 ${selectedFiles.length} 个文件到 Notion` }}</span>
        </button>

        <!-- 上传进度 -->
        <div v-if="uploading" class="upload-progress">
          <!-- 总进度条 -->
          <div class="progress-bar-wrapper">
            <div class="progress-bar-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <div class="progress-text">
            <span>{{ formatFileSize(uploadedBytes) }} / {{ totalBytesStr }}</span>
            <span class="progress-percent">{{ progressPercent }}%</span>
          </div>

          <!-- 逐文件进度 -->
          <div class="file-progress-list">
            <div v-for="fp in fileProgressList" :key="fp.name" class="file-progress-item">
              <div class="fp-header">
                <div class="fp-name-wrapper">
                  <font-awesome-icon
                    :icon="['fas', fp.status === 'done' ? 'circle-check' : fp.status === 'uploading' ? 'spinner' : 'circle']"
                    :class="{ 'fp-done': fp.status === 'done', 'fp-spin': fp.status === 'uploading', 'fp-pending': fp.status === 'pending' }"
                  />
                  <span class="fp-name">{{ fp.name }}</span>
                </div>
                <span class="fp-status-badge" :class="fp.status">
                  {{ statusLabel(fp) }}
                </span>
              </div>
              <div class="fp-bar-wrapper">
                <div
                  class="fp-bar-fill"
                  :class="{ 'is-done': fp.status === 'done', 'is-single': fp.mode === 'single_part' }"
                  :style="{ width: fpPercent(fp) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 上传结果 -->
        <div v-if="uploadResults.length" class="upload-result" :class="uploadSuccess ? 'success' : 'error'">
          <div class="result-header">
            <font-awesome-icon
              :icon="['fas', uploadSuccess ? 'circle-check' : 'circle-exclamation']"
            />
            <strong>{{ uploadSuccess ? '全部上传成功' : '上传失败' }}</strong>
          </div>
          <div class="result-body">
            <div v-for="(result, idx) in uploadResults" :key="idx" class="result-row">
              <span class="result-label">文件 {{ idx + 1 }}</span>
              <span class="result-id">系统ID: {{ result.sysId }}</span>
              <a
                :href="result.url"
                target="_blank"
                class="result-link"
              >{{ result.url }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getCurrentUserWorkspaces, uploadFilesToNotion } from '@/api/notion'
import type { UploadProgressEvent } from '@/api/notion'
import { AppleAlert } from '@/components/common/AppleAlert.ts'
import type { Workspace } from '@/types'

// 单文件进度跟踪
interface FileProgress {
  name: string
  size: number
  status: 'pending' | 'uploading' | 'done'
  mode: string           // 'single_part' | 'multi_part'
  numberOfParts: number  // 多分片模式下的分片总数
  completedParts: number // 已完成的分片数
  uploadedBytes: number
}

const workspaces = ref<Workspace[]>([])
const workspaceLoading = ref(false)
const workspaceId = ref('')
const selectedFiles = ref<File[]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragover = ref(false)
const uploading = ref(false)
const uploadResults = ref<{ id: string; url: string }[]>([])
const uploadSuccess = ref(false)
const uploadedBytes = ref(0)
const totalBytes = ref(0)
const currentFileName = ref('')

// 逐文件进度列表（由 start 事件初始化，progress/file_complete 事件更新）
const fileProgressList = ref<FileProgress[]>([])

const totalSize = computed(() => {
  const total = selectedFiles.value.reduce((sum, f) => sum + f.size, 0)
  return formatFileSize(total)
})

const progressPercent = computed(() => {
  if (!totalBytes.value) return 0
  return Math.min(Math.round((uploadedBytes.value / totalBytes.value) * 100), 100)
})

const totalBytesStr = computed(() => {
  return formatFileSize(totalBytes.value)
})

const canUpload = computed(() => {
  return workspaceId.value && selectedFiles.value.length > 0 && !uploading.value
})

/** 计算单文件进度百分比 */
const fpPercent = (fp: FileProgress) => {
  if (fp.size === 0) return 0
  return Math.min(Math.round((fp.uploadedBytes / fp.size) * 100), 100)
}

/** 文件状态标签文本 */
const statusLabel = (fp: FileProgress) => {
  if (fp.status === 'done') return '✓ 完成'
  if (fp.status === 'uploading') {
    if (fp.mode === 'multi_part' && fp.numberOfParts > 0) {
      return `分片 ${fp.completedParts}/${fp.numberOfParts}`
    }
    return '上传中'
  }
  return '等待'
}

const fetchWorkspaces = async () => {
  workspaceLoading.value = true
  try {
    const res = await getCurrentUserWorkspaces()
    workspaces.value = res.data || []
  } catch (error: any) {
    AppleAlert.error('获取工作区失败', error.message || '请稍后重试')
  } finally {
    workspaceLoading.value = false
  }
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const newFiles = Array.from(input.files)
    selectedFiles.value = [...selectedFiles.value, ...newFiles]
    uploadResults.value = []
  }
}

const handleFileDrop = (event: DragEvent) => {
  isDragover.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const newFiles = Array.from(files)
    selectedFiles.value = [...selectedFiles.value, ...newFiles]
    uploadResults.value = []
  }
}

const removeFile = (idx: number) => {
  selectedFiles.value.splice(idx, 1)
  uploadResults.value = []
}

const clearAllFiles = () => {
  selectedFiles.value = []
  uploadResults.value = []
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const handleUpload = async () => {
  if (!canUpload.value) return

  uploading.value = true
  uploadResults.value = []
  uploadedBytes.value = 0
  totalBytes.value = selectedFiles.value.reduce((sum, f) => sum + f.size, 0)
  currentFileName.value = ''
  // 初始化所有文件为 pending 状态
  fileProgressList.value = selectedFiles.value.map(f => ({
    name: f.name,
    size: f.size,
    status: 'pending' as const,
    mode: '',
    numberOfParts: 0,
    completedParts: 0,
    uploadedBytes: 0
  }))

  try {
    const results = await uploadFilesToNotion(
      workspaceId.value,
      selectedFiles.value,
      (event: UploadProgressEvent) => {
        switch (event.type) {
          case 'start':
            // 后端确认开始，同步总大小
            totalBytes.value = event.totalBytes || totalBytes.value
            break
          case 'file_start':
            // 文件开始传输，更新状态和模式信息
            if (event.fileIndex !== undefined && fileProgressList.value[event.fileIndex]) {
              const fp = fileProgressList.value[event.fileIndex]
              fp.status = 'uploading'
              fp.mode = event.mode || ''
              fp.numberOfParts = event.numberOfParts || 0
              fileProgressList.value = [...fileProgressList.value] // 触发响应式更新
            }
            break
          case 'progress':
            uploadedBytes.value = event.uploadedBytes || 0
            totalBytes.value = event.totalBytes || totalBytes.value
            currentFileName.value = event.fileName || ''
            // 更新对应文件的进度（通过累计 bytes 推算，progress 传的是全局 uploadedBytes）
            // 这里用简单策略：currentFileName 定位文件
            if (event.fileName) {
              const fp = fileProgressList.value.find(f => f.name === event.fileName)
              if (fp) {
                // 多分片模式：completedParts 递增
                if (fp.mode === 'multi_part') {
                  fp.completedParts = Math.min(fp.completedParts + 1, fp.numberOfParts)
                  fp.uploadedBytes = Math.min(fp.completedParts * Math.ceil(fp.size / fp.numberOfParts), fp.size)
                } else {
                  // 单分片模式：直接完成
                  fp.uploadedBytes = fp.size
                }
                fileProgressList.value = [...fileProgressList.value]
              }
            }
            break
          case 'file_complete':
            // 标记文件完成
            if (event.fileIndex !== undefined && fileProgressList.value[event.fileIndex]) {
              const fp = fileProgressList.value[event.fileIndex]
              fp.status = 'done'
              fp.uploadedBytes = fp.size
              fp.completedParts = fp.numberOfParts
              fileProgressList.value = [...fileProgressList.value]
            }
            currentFileName.value = ''
            break
          case 'complete':
            uploadSuccess.value = true
            uploadResults.value = (event.files as { id: string; url: string }[]) || []
            break
          case 'error':
            throw new Error(event.message || '上传失败')
        }
      }
    )
    AppleAlert.success('上传成功', `${results.length} 个文件已成功上传到 Notion`)
  } catch (error: any) {
    uploadSuccess.value = false
    uploadResults.value = []
    if (!uploadResults.value.length) {
      AppleAlert.error('上传失败', error.message || '请检查工作区配置和文件')
    }
  } finally {
    uploading.value = false
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + units[i]
}

onMounted(() => {
  fetchWorkspaces()
})
</script>

<style scoped>
.file-upload-test-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 120px);
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.upload-card {
  width: 100%;
  max-width: 640px;
  background: var(--card-bg, #ffffff);
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.05));
  overflow: hidden;
}

.card-header {
  padding: 32px 32px 20px;
  text-align: center;
  border-bottom: 1px solid var(--border-color, rgba(0, 0, 0, 0.05));
}

.header-icon {
  font-size: 36px;
  color: var(--apple-blue, #0A84FF);
  margin-bottom: 12px;
}

.card-header h2 {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-main, #1d1d1f);
  margin: 0 0 8px;
  letter-spacing: -0.3px;
}

.card-desc {
  font-size: 14px;
  color: var(--text-muted, #86868b);
  margin: 0;
}

.card-body {
  padding: 24px 32px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-muted, #86868b);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.full-width-select {
  width: 100%;
}

:deep(.full-width-select .ant-select-selector) {
  border-radius: 12px !important;
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.08)) !important;
  min-height: 48px !important;
  padding: 8px 16px !important;
  display: flex;
  align-items: center;
}

:deep(.full-width-select .ant-select-selection-item) {
  display: flex;
  align-items: center;
}

.ws-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ws-icon {
  font-size: 18px;
}

.ws-name {
  font-weight: 600;
  color: var(--text-main);
}

.ws-code {
  font-size: 12px;
  color: var(--text-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.file-drop-zone {
  border: 2px dashed var(--border-color, rgba(0, 0, 0, 0.12));
  border-radius: 16px;
  padding: 40px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s ease;
  background: var(--hover-bg, rgba(0, 0, 0, 0.01));
  position: relative;
}

.file-drop-zone:hover {
  border-color: var(--apple-blue, #0A84FF);
  background: color-mix(in srgb, var(--apple-blue, #0A84FF) 4%, transparent);
}

.file-drop-zone.is-dragover {
  border-color: var(--apple-blue, #0A84FF);
  background: color-mix(in srgb, var(--apple-blue, #0A84FF) 8%, transparent);
  transform: scale(1.01);
}

.file-drop-zone.has-file {
  padding: 20px 24px;
  border-style: solid;
  border-color: color-mix(in srgb, var(--apple-blue, #0A84FF) 30%, transparent);
}

.file-input-hidden {
  display: none;
}

.drop-icon {
  font-size: 40px;
  color: var(--apple-blue, #0A84FF);
  margin-bottom: 12px;
}

.drop-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main);
  margin: 0 0 4px;
}

.drop-sub {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0 0 16px;
}

.browse-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 20px;
  border-radius: 12px;
  border: 1px solid var(--apple-blue, #0A84FF);
  background: transparent;
  color: var(--apple-blue, #0A84FF);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.browse-btn:hover {
  background: var(--apple-blue, #0A84FF);
  color: #ffffff;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-height: 240px;
  overflow-y: auto;
  padding-right: 4px;
  margin-bottom: 12px;
}

.file-list::-webkit-scrollbar {
  width: 4px;
}

.file-list::-webkit-scrollbar-thumb {
  background: var(--border-color, rgba(0, 0, 0, 0.15));
  border-radius: 2px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 14px;
  background: var(--card-bg, #ffffff);
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.06));
  border-radius: 10px;
  transition: all 0.2s;
}

.file-item:hover {
  border-color: var(--apple-blue, #0A84FF);
}

.clear-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1px solid rgba(255, 69, 58, 0.3);
  background: transparent;
  color: #FF453A;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-all-btn:hover {
  background: rgba(255, 69, 58, 0.08);
}

.file-count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 11px;
  background: var(--apple-blue, #0A84FF);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
}

.file-icon {
  font-size: 32px;
  color: var(--apple-blue, #0A84FF);
  flex-shrink: 0;
}

.file-details {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.file-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  font-size: 12px;
  color: var(--text-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.clear-file-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: var(--hover-bg, rgba(0, 0, 0, 0.05));
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.clear-file-btn:hover {
  background: rgba(255, 69, 58, 0.12);
  color: #FF453A;
}

.file-preview {
  background: var(--hover-bg, rgba(0, 0, 0, 0.02));
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.06));
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preview-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.preview-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  flex-shrink: 0;
}

.preview-value {
  font-size: 13px;
  color: var(--text-main);
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.upload-btn {
  width: 100%;
  height: 52px;
  border-radius: 14px;
  border: none;
  background: #1d1d1f;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.25s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.upload-btn:hover:not(:disabled) {
  background: #000000;
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}

.upload-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.upload-progress {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-bar-wrapper {
  width: 100%;
  height: 6px;
  background: var(--hover-bg, rgba(0, 0, 0, 0.06));
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #0A84FF, #30D158);
  border-radius: 3px;
  transition: width 0.15s ease;
}

.progress-text {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color: var(--text-muted, #86868b);
  gap: 8px;
}

.progress-percent {
  font-weight: 700;
  color: var(--apple-blue, #0A84FF);
}

/* ===== 逐文件进度 ===== */
.file-progress-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 4px;
}

.file-progress-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px 14px;
  background: var(--hover-bg, rgba(0, 0, 0, 0.02));
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.05));
  border-radius: 10px;
  transition: border-color 0.25s;
}

.file-progress-item:hover {
  border-color: var(--border-color, rgba(0, 0, 0, 0.1));
}

.fp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.fp-name-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.fp-done {
  color: #30D158;
  font-size: 13px;
}

.fp-spin {
  color: var(--apple-blue, #0A84FF);
  font-size: 13px;
  animation: fpSpin 0.85s linear infinite;
}

.fp-pending {
  color: var(--text-muted, #86868b);
  font-size: 13px;
}

@keyframes fpSpin {
  to { transform: rotate(360deg); }
}

.fp-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main, #1d1d1f);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fp-status-badge {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
  letter-spacing: 0.3px;
}

.fp-status-badge.pending {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-muted, #86868b);
}

.fp-status-badge.uploading {
  background: color-mix(in srgb, var(--apple-blue, #0A84FF) 12%, transparent);
  color: var(--apple-blue, #0A84FF);
}

.fp-status-badge.done {
  background: color-mix(in srgb, #30D158 12%, transparent);
  color: #30D158;
}

.fp-bar-wrapper {
  width: 100%;
  height: 4px;
  background: var(--hover-bg, rgba(0, 0, 0, 0.06));
  border-radius: 2px;
  overflow: hidden;
}

.fp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #0A84FF, #5E5CE6);
  border-radius: 2px;
  transition: width 0.2s ease;
}

.fp-bar-fill.is-done {
  background: #30D158;
  transition: width 0.3s ease;
}

.fp-bar-fill.is-single {
  background: linear-gradient(90deg, #FF9F0A, #FF375F);
}

.fp-bar-fill.is-single.is-done {
  background: #30D158;
}

.spin {
  animation: spin 0.85s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.upload-result {
  border-radius: 14px;
  padding: 20px;
  animation: fadeInUp 0.3s ease;
}

.upload-result.success {
  background: color-mix(in srgb, #30D158 8%, transparent);
  border: 1px solid color-mix(in srgb, #30D158 20%, transparent);
}

.upload-result.error {
  background: color-mix(in srgb, #FF453A 8%, transparent);
  border: 1px solid color-mix(in srgb, #FF453A 20%, transparent);
}

.result-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  margin-bottom: 12px;
}

.upload-result.success .result-header {
  color: #30D158;
}

.upload-result.error .result-header {
  color: #FF453A;
}

.result-body {
  font-size: 14px;
  color: var(--text-main);
}

.result-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.result-row:last-child {
  margin-bottom: 0;
}

.result-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
}

.result-id {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  color: var(--text-muted, #86868b);
  word-break: break-all;
}

.result-link {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
  color: var(--apple-blue, #0A84FF);
  word-break: break-all;
  text-decoration: none;
}

.result-link:hover {
  text-decoration: underline;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:global(.dark) .upload-card {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.22);
  border-color: rgba(255, 255, 255, 0.06);
}

:global(.dark) .upload-btn {
  background: #ffffff;
  color: #1d1d1f;
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.08);
}

:global(.dark) .upload-btn:hover:not(:disabled) {
  background: #f5f5f7;
  color: #000000;
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.12);
}

@media (max-width: 640px) {
  .card-header,
  .card-body {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
