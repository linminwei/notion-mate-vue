<template>
  <div class="neo-page-container">

    <!-- ================= 页面头部与工具栏 ================= -->
    <header class="neo-page-header">
      <div class="capsule-search">
        <div class="search-inputs">
          <input type="text" v-model="searchForm.username" placeholder="用户名" @keyup.enter="handleSearch" />
          <div class="divider"></div>
          <input type="text" v-model="searchForm.nickname" placeholder="昵称" @keyup.enter="handleSearch" />
          <div class="divider"></div>
          <a-select v-model:value="searchForm.status" placeholder="状态" :bordered="false" class="status-select" allowClear @change="handleSearch">
            <a-select-option v-for="dict in commonStatusDict" :key="dict.dictValue" :value="Number(dict.dictValue)">
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
            class="neo-btn-flat enable"
            v-permission="'system:user:edit'"
            v-if="selectedRowKeys.length > 0"
            @click="confirmBatchStatus(1)"
        >
          <font-awesome-icon :icon="['fas', 'check-circle']" />
          启用
        </button>

        <button
            class="neo-btn-flat disable"
            v-permission="'system:user:edit'"
            v-if="selectedRowKeys.length > 0"
            @click="confirmBatchStatus(0)"
        >
          <font-awesome-icon :icon="['fas', 'ban']" />
          禁用
        </button>

        <button
            class="neo-btn-flat danger"
            v-permission="'system:user:delete'"
            v-if="selectedRowKeys.length > 0"
            @click="confirmBatchDelete"
        >
          <font-awesome-icon :icon="['fas', 'trash']" />
          删除
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
          :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
          row-key="id"
          @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">

          <!-- 用户信息列 -->
          <template v-if="column.key === 'userInfo'">
            <div class="user-info-cell">
              <div class="user-avatar" :class="{ 'has-img': record.avatar }">
                <img v-if="record.avatar" :src="getAvatarUrl(record.avatar)" class="avatar-img" alt="" />
                <span v-else class="avatar-text">{{ record.nickname?.charAt(0) || record.username?.charAt(0) || '?' }}</span>
              </div>
              <div class="user-meta">
                <span class="user-name">{{ record.username }}</span>
                <span class="user-nickname">{{ record.nickname || '-' }}</span>
              </div>
            </div>
          </template>

          <!-- 联系方式列 -->
          <template v-if="column.key === 'contact'">
            <div class="contact-cell">
              <div class="contact-item" v-if="record.email">
                <font-awesome-icon :icon="['fas', 'envelope']" class="contact-icon" />
                <span>{{ record.email }}</span>
              </div>
              <div class="contact-item" v-if="record.phone">
                <font-awesome-icon :icon="['fas', 'phone']" class="contact-icon" />
                <span>{{ record.phone }}</span>
              </div>
              <span v-if="!record.email && !record.phone" class="text-placeholder">-</span>
            </div>
          </template>

          <!-- 角色列 -->
          <template v-if="column.key === 'roles'">
            <div class="role-tags">
              <template v-if="record.roles && record.roles.length > 0">
                <span
                  v-for="role in record.roles"
                  :key="role.id"
                  class="role-tag"
                  :class="{ 'role-super-admin': role.roleCode === 'SUPER_ADMIN' }"
                >
                  <font-awesome-icon v-if="role.roleCode === 'SUPER_ADMIN'" :icon="['fas', 'crown']" class="role-icon" />
                  {{ role.roleName }}
                </span>
              </template>
              <span v-else class="text-placeholder">-</span>
            </div>
          </template>

          <!-- 状态列 -->
          <template v-if="column.key === 'status'">
            <div class="status-indicator-wrap" :class="record.status === 1 ? 'is-active' : 'is-inactive'">
              <div class="status-dot"></div>
              <span>{{ record.status === 1 ? '启用' : '禁用' }}</span>
            </div>
          </template>

          <!-- 创建时间列 -->
          <template v-if="column.key === 'createTime'">
            <span>{{ formatDateTime(record.createTime) }}</span>
          </template>

          <!-- 操作列 -->
          <template v-if="column.key === 'action'">
            <div class="action-btn-group">
              <button
                  v-if="record.status === 1"
                  class="text-action-btn warning"
                  v-permission="'system:user:edit'"
                  :disabled="isSuperAdmin(record)"
                  @click="handleToggleStatus(record)"
              >禁用</button>
              <button
                  v-if="record.status === 0"
                  class="text-action-btn safe"
                  v-permission="'system:user:edit'"
                  @click="handleToggleStatus(record)"
              >启用</button>
              <span class="action-divider"></span>
              <button class="text-action-btn danger" v-permission="'system:user:delete'" @click="confirmDelete(record.id)">删除</button>
              <span class="action-divider"></span>
              <button class="text-action-btn primary" v-permission="'system:user:edit'" @click="handleAssignRole(record)">分配角色</button>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <!-- ================= 删除确认弹窗 ================= -->
    <AppleConfirmModal
        v-model:visible="deleteConfirmVisible"
        type="danger"
        title="删除用户"
        :desc="deleteConfirmDesc"
        confirmText="确认删除"
        :loading="deleteConfirmLoading"
        @confirm="executeDelete"
    />

    <!-- ================= 启禁用确认弹窗 ================= -->
    <AppleConfirmModal
        v-model:visible="statusConfirmVisible"
        :type="statusTargetValue === 1 ? 'warning' : 'danger'"
        :title="statusTargetValue === 1 ? '启用用户' : '禁用用户'"
        :desc="statusConfirmDesc"
        :confirmText="statusTargetValue === 1 ? '确认启用' : '确认禁用'"
        :loading="statusConfirmLoading"
        @confirm="executeBatchStatus"
    />

    <!-- ================= 角色分配弹窗 ================= -->
    <NeoFormModal
        v-model:open="assignModalVisible"
        :title="`分配角色 - ${assignTargetUser?.username || ''}`"
        subtitle="为用户选择需要的角色权限"
        :width="480"
        :icon="['fas', 'user-shield']"
        theme="primary"
        confirmText="确认分配"
        :confirmLoading="assignLoading"
        @ok="submitAssignRole"
    >
      <div class="assign-role-list">
        <a-checkbox-group v-model:value="assignRoleIds" class="role-checkbox-group">
          <div v-for="role in roleList" :key="role.id" class="role-checkbox-item">
            <a-checkbox :value="role.id">
              <div class="role-checkbox-content">
                <span class="role-checkbox-name" :class="{ 'is-super': role.roleCode === 'SUPER_ADMIN' }">
                  <font-awesome-icon v-if="role.roleCode === 'SUPER_ADMIN'" :icon="['fas', 'crown']" class="role-crown-icon" />
                  {{ role.roleName }}
                </span>
                <span class="role-checkbox-desc">{{ role.remark || role.roleCode }}</span>
              </div>
            </a-checkbox>
          </div>
        </a-checkbox-group>
      </div>
    </NeoFormModal>

    <!-- ================= 删除结果展示弹窗 ================= -->
    <Teleport to="body">
      <Transition name="result-modal">
        <div v-if="deleteResultVisible" class="delete-result-overlay" @click.self="deleteResultVisible = false">
          <div class="delete-result-modal">
            <!-- 头部 -->
            <div class="result-header" :class="deleteResultType">
              <div class="result-icon-wrap">
                <font-awesome-icon v-if="deleteResultType === 'success'" :icon="['fas', 'check-circle']" />
                <font-awesome-icon v-else-if="deleteResultType === 'partial'" :icon="['fas', 'exclamation-circle']" />
                <font-awesome-icon v-else :icon="['fas', 'times-circle']" />
              </div>
              <div class="result-header-text">
                <h3 class="result-title">
                  {{ deleteResultType === 'success' ? deleteResultTitle.success : deleteResultType === 'partial' ? deleteResultTitle.partial : deleteResultTitle.error }}
                </h3>
                <p class="result-subtitle">
                  <template v-if="deleteResultData">
                    成功 {{ deleteResultData.successCount }} 个<template v-if="deleteResultData.failedCount > 0">，失败 {{ deleteResultData.failedCount }} 个</template>
                  </template>
                </p>
              </div>
            </div>

            <!-- 结果列表 -->
            <div class="result-list" v-if="deleteResultData">
              <div
                v-for="item in deleteResultData.details"
                :key="item.userId"
                class="result-item"
                :class="item.success ? 'item-success' : 'item-fail'"
              >
                <div class="item-status-icon">
                  <font-awesome-icon v-if="item.success" :icon="['fas', 'check']" />
                  <font-awesome-icon v-else :icon="['fas', 'xmark']" />
                </div>
                <div class="item-info">
                  <span class="item-username">{{ item.username }}</span>
                  <span class="item-reason">{{ item.success ? deleteResultSuccessText : item.reason }}</span>
                </div>
              </div>
            </div>

            <!-- 底部按钮 -->
            <div class="result-footer">
              <button class="result-confirm-btn" @click="deleteResultVisible = false">我知道了</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { getUserPage, deleteUserBatch, batchUpdateStatus, assignUserRoles } from '@/api/user.ts'
import { getRoleList } from '@/api/role.ts'
import { getDictDataByDictCode } from '@/api/dict'
import type { SysUser, SysRole, DictData, BatchDeleteResult } from '@/types'
import type { TablePaginationConfig } from 'ant-design-vue'
import AppleConfirmModal from '@/components/common/AppleConfirmModal.vue'
import NeoFormModal from '@/components/common/NeoFormModal.vue'
import { AppleAlert } from '@/components/common/AppleAlert.ts'

// --- 表格列定义 ---
// --- 头像处理 ---
const getAvatarUrl = (avatar: string) => {
  if (!avatar) return ''
  // 如果已经是 URL（http/https 或 data:image），直接返回
  if (avatar.startsWith('http') || avatar.startsWith('data:')) return avatar
  // 否则当作 base64 编码的 PNG
  return `data:image/png;base64,${avatar}`
}

const columns = [
  { title: '用户信息', key: 'userInfo', width: 240 },
  { title: '联系方式', key: 'contact', width: 280 },
  { title: '角色', key: 'roles', width: 180 },
  { title: '状态', dataIndex: 'status', key: 'status', align: 'center', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  { title: '操作', key: 'action', align: 'center', width: 300 }
]

// --- 时间格式化 ---
const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

// --- 状态与数据 ---
const loading = ref(false)
const tableData = ref<SysUser[]>([])
const selectedRowKeys = ref<string[]>([])
const commonStatusDict = ref<DictData[]>([])

const searchForm = reactive({
  username: '',
  nickname: '',
  status: undefined as number | undefined,
  pageNum: 1,
  pageSize: 10
})

const pagination = reactive<TablePaginationConfig>({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`
})

// --- 删除确认逻辑 (AppleConfirmModal) ---
const deleteConfirmVisible = ref(false)
const deleteConfirmLoading = ref(false)
const deleteTargetId = ref<string | null>(null)
const deleteIsBatch = ref(false)

// --- 删除结果展示 ---
const deleteResultVisible = ref(false)
const deleteResultData = ref<BatchDeleteResult | null>(null)
const deleteResultType = ref<'success' | 'partial' | 'error'>('success')
const deleteResultTitle = ref({ success: '删除成功', partial: '部分删除成功', error: '删除失败' })
const deleteResultSuccessText = ref('已删除')
const deleteConfirmDesc = computed(() =>
    deleteIsBatch.value
        ? `确定要删除选中的 ${selectedRowKeys.value.length} 个用户吗？此操作不可恢复。`
        : '确定要删除该用户吗？此操作不可恢复。'
)

const confirmDelete = (id: string) => {
  deleteTargetId.value = id
  deleteIsBatch.value = false
  deleteConfirmVisible.value = true
}

const confirmBatchDelete = () => {
  deleteIsBatch.value = true
  deleteConfirmVisible.value = true
}

const executeDelete = async () => {
  deleteConfirmLoading.value = true
  try {
    const ids = deleteIsBatch.value ? selectedRowKeys.value : [deleteTargetId.value!]
    const res = await deleteUserBatch(ids)
    const result = res.data

    // 设置结果数据并显示弹窗
    deleteResultData.value = result
    deleteResultTitle.value = { success: '删除成功', partial: '部分删除成功', error: '删除失败' }
    deleteResultSuccessText.value = '已删除'
    if (result.allSuccess) {
      deleteResultType.value = 'success'
    } else if (result.successCount > 0) {
      deleteResultType.value = 'partial'
    } else {
      deleteResultType.value = 'error'
    }
    deleteResultVisible.value = true

    if (deleteIsBatch.value) {
      selectedRowKeys.value = []
    }
    fetchData()
  } catch (error: any) {
    AppleAlert.error('删除失败', error.message || '操作未完成')
  } finally {
    deleteConfirmLoading.value = false
    deleteConfirmVisible.value = false
  }
}

// --- 批量状态修改确认逻辑 ---
const statusConfirmVisible = ref(false)
const statusConfirmLoading = ref(false)
const statusTargetValue = ref<number>(1)
const statusToggleUserId = ref<string | null>(null)
const statusToggleUsername = ref<string>('')

// 判断用户是否为超级管理员
const isSuperAdmin = (record: SysUser) => {
  return record.roles?.some(r => r.roleCode === 'SUPER_ADMIN') ?? false
}

const statusConfirmDesc = computed(() => {
  const actionText = statusTargetValue.value === 1 ? '启用' : '禁用'
  if (statusToggleUserId.value) {
    return `确定要${actionText}用户「${statusToggleUsername.value}」吗？`
  }
  return `确定要${actionText}选中的 ${selectedRowKeys.value.length} 个用户吗？`
})

const confirmBatchStatus = (status: number) => {
  statusToggleUserId.value = null
  statusToggleUsername.value = ''
  statusTargetValue.value = status
  statusConfirmVisible.value = true
}

const handleToggleStatus = (record: SysUser) => {
  statusToggleUserId.value = record.id
  statusToggleUsername.value = record.username || record.nickname || ''
  statusTargetValue.value = record.status === 1 ? 0 : 1
  statusConfirmVisible.value = true
}

const executeBatchStatus = async () => {
  statusConfirmLoading.value = true
  try {
    const ids = statusToggleUserId.value ? [statusToggleUserId.value] : selectedRowKeys.value
    const res = await batchUpdateStatus(ids, statusTargetValue.value)
    const result = res.data

    const actionText = statusTargetValue.value === 1 ? '启用' : '禁用'
    deleteResultTitle.value = { success: `${actionText}成功`, partial: `部分${actionText}成功`, error: `${actionText}失败` }
    deleteResultSuccessText.value = statusTargetValue.value === 1 ? '已启用' : '已禁用'

    // 复用删除结果弹窗展示
    deleteResultData.value = result
    if (result.allSuccess) {
      deleteResultType.value = 'success'
    } else if (result.successCount > 0) {
      deleteResultType.value = 'partial'
    } else {
      deleteResultType.value = 'error'
    }
    deleteResultVisible.value = true

    if (!statusToggleUserId.value) {
      selectedRowKeys.value = []
    }
    statusToggleUserId.value = null
    statusToggleUsername.value = ''
    fetchData()
  } catch (error: any) {
    AppleAlert.error('操作失败', error.message || '操作未完成')
  } finally {
    statusConfirmLoading.value = false
    statusConfirmVisible.value = false
  }
}

// --- 搜索与重置 ---
const handleSearch = () => {
  searchForm.pageNum = 1
  pagination.current = 1
  fetchData()
}

const handleReset = () => {
  searchForm.username = ''
  searchForm.nickname = ''
  searchForm.status = undefined
  searchForm.pageNum = 1
  pagination.current = 1
  selectedRowKeys.value = []
  fetchData()
}

// --- API 方法 ---
const fetchData = async () => {
  loading.value = true
  try {
    const res = await getUserPage(searchForm)
    tableData.value = res.data.list
    pagination.total = res.data.total
    pagination.current = res.data.pageNum
  } catch (error: any) {
    AppleAlert.error('数据加载失败', error.message || '无法获取用户列表')
  } finally {
    loading.value = false
  }
}

const fetchCommonStatus = async () => {
  try {
    const res = await getDictDataByDictCode('sys_common_status')
    commonStatusDict.value = res.data || []
  } catch (error) {
    console.warn('获取 sys_common_status 字典失败', error)
  }
}

const handleTableChange = (pag: TablePaginationConfig) => {
  searchForm.pageNum = pag.current || 1
  searchForm.pageSize = pag.pageSize || 10
  pagination.current = pag.current || 1
  pagination.pageSize = pag.pageSize || 10
  fetchData()
}

const onSelectChange = (keys: string[]) => {
  selectedRowKeys.value = keys
}

// --- 角色分配逻辑 ---
const roleList = ref<SysRole[]>([])
const assignModalVisible = ref(false)
const assignLoading = ref(false)
const assignTargetUser = ref<SysUser | null>(null)
const assignRoleIds = ref<string[]>([])

const fetchRoles = async () => {
  try {
    const res = await getRoleList()
    roleList.value = res.data
  } catch (error: any) {
    console.warn('获取角色列表失败', error)
  }
}

const handleAssignRole = (record: SysUser) => {
  assignTargetUser.value = record
  assignRoleIds.value = record.roles ? record.roles.map(r => r.id) : []
  assignModalVisible.value = true
}

const submitAssignRole = async () => {
  if (assignRoleIds.value.length === 0) {
    AppleAlert.warning('提示', '请至少选择一个角色')
    return
  }
  assignLoading.value = true
  try {
    await assignUserRoles(assignTargetUser.value!.id, assignRoleIds.value)
    AppleAlert.success('分配成功', `已更新 ${assignTargetUser.value!.username} 的角色`)
    assignModalVisible.value = false
    fetchData()
  } catch (error: any) {
    AppleAlert.error('分配失败', error.message || '操作未完成')
  } finally {
    assignLoading.value = false
  }
}

onMounted(() => {
  fetchData()
  fetchCommonStatus()
  fetchRoles()
})
</script>

<style scoped>
/* 覆盖全局的 .neo-page-header 以适应搜索栏并排 */
.neo-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 12px;
  gap: 16px;
}

.capsule-search {
  display: flex;
  min-width: 420px;
  background: var(--hover-bg, #f5f5f7);
  border-radius: 14px;
  padding: 4px;
  border: 1px solid transparent;
  transition: all 0.3s;
  align-items: center;
}
.capsule-search:focus-within {
  background: transparent;
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

/* 用户信息单元格 */
.user-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--apple-blue) 20%, transparent), color-mix(in srgb, var(--apple-blue) 40%, transparent));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px color-mix(in srgb, var(--apple-blue) 15%, transparent);
  overflow: hidden;
}

.user-avatar.has-img {
  background: transparent;
  box-shadow: 0 2px 8px var(--shadow-color, rgba(0,0,0,0.08));
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-text {
  color: var(--apple-blue);
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
}

.user-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-nickname {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 联系方式单元格 */
.contact-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-main);
  line-height: 1.4;
}

.contact-icon {
  font-size: 11px;
  color: var(--text-muted);
  width: 14px;
  text-align: center;
  flex-shrink: 0;
}

/* 角色标签 */
.role-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.role-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
  background: color-mix(in srgb, var(--apple-blue) 8%, transparent);
  color: var(--apple-blue, #0A84FF);
  border: 1px solid color-mix(in srgb, var(--apple-blue) 15%, transparent);
}

/* 超级管理员 - 黑金风格 */
.role-tag.role-super-admin {
  background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
  color: #F5D060;
  border: 1px solid rgba(245, 208, 96, 0.4);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(245, 208, 96, 0.1);
  font-weight: 600;
  letter-spacing: 0.3px;
}

.role-tag.role-super-admin .role-icon {
  font-size: 10px;
  color: #F5D060;
  filter: drop-shadow(0 0 2px rgba(245, 208, 96, 0.4));
}

/* 超级管理员 - 暗黑模式下稍微调亮背景 */
:global(.dark) .role-tag.role-super-admin {
  background: linear-gradient(135deg, #2a2a2a, #3a3a3a);
  border-color: rgba(245, 208, 96, 0.5);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(245, 208, 96, 0.15);
}

/* 批量操作按钮额外圆角和内距微调（核心背景色已在 neo-table.css 全局定义） */
.neo-btn-flat.danger,
.neo-btn-flat.enable,
.neo-btn-flat.disable {
  border-radius: 10px;
  padding: 6px 14px;
  font-weight: 500;
}
.neo-btn-flat.danger:hover,
.neo-btn-flat.enable:hover,
.neo-btn-flat.disable:hover {
  filter: brightness(0.95);
  transform: scale(0.97);
}

/* 角色分配弹窗 */
.assign-role-list {
  padding: 4px 0;
}

.role-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.role-checkbox-item {
  padding: 0;
  border-radius: 12px;
  border: 1px solid var(--border-color, #e5e5ea);
  transition: all 0.2s;
}

.role-checkbox-item :deep(.ant-checkbox-wrapper) {
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: 10px 14px;
  margin: 0;
}

.role-checkbox-item:hover {
  background: var(--hover-bg, rgba(0, 0, 0, 0.02));
  border-color: color-mix(in srgb, var(--apple-blue) 30%, transparent);
}

.role-checkbox-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-left: 4px;
}

.role-checkbox-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 6px;
}

.role-checkbox-name.is-super {
  color: #F5D060;
}

.role-crown-icon {
  font-size: 12px;
  color: #F5D060;
}

.role-checkbox-desc {
  font-size: 12px;
  color: var(--text-muted);
}

</style>

<style>
/* ===== 删除结果弹窗（Teleport 内容需要非 scoped 样式）===== */
.delete-result-overlay {
  position: fixed;
  inset: 0;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.delete-result-modal {
  width: 420px;
  max-height: 70vh;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border-radius: 20px;
  box-shadow: 0 24px 80px -12px rgba(0, 0, 0, 0.18),
    0 0 0 1px rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.4);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modal-spring 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
}

@keyframes modal-spring {
  0% { transform: scale(0.92) translateY(10px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

/* 头部 */
.result-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 24px 24px 16px;
}

.result-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.result-header.success .result-icon-wrap {
  background: linear-gradient(135deg, rgba(52, 199, 89, 0.12), rgba(52, 199, 89, 0.22));
  color: #34C759;
  box-shadow: 0 4px 12px rgba(52, 199, 89, 0.15);
}

.result-header.partial .result-icon-wrap {
  background: linear-gradient(135deg, rgba(255, 149, 0, 0.12), rgba(255, 149, 0, 0.22));
  color: #FF9500;
  box-shadow: 0 4px 12px rgba(255, 149, 0, 0.15);
}

.result-header.error .result-icon-wrap {
  background: linear-gradient(135deg, rgba(255, 59, 48, 0.12), rgba(255, 59, 48, 0.22));
  color: #FF3B30;
  box-shadow: 0 4px 12px rgba(255, 59, 48, 0.15);
}

.result-header-text {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-main, #1d1d1f);
  margin: 0;
  line-height: 1.3;
}

.result-subtitle {
  font-size: 13px;
  color: var(--text-muted, #86868b);
  margin: 3px 0 0;
  line-height: 1.3;
}

/* 结果列表 */
.result-list {
  padding: 4px 16px 16px;
  overflow-y: auto;
  max-height: 280px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 12px;
  transition: background 0.2s;
}

.result-item.item-success {
  background: rgba(52, 199, 89, 0.06);
}

.result-item.item-fail {
  background: rgba(255, 59, 48, 0.06);
}

.item-status-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  flex-shrink: 0;
}

.item-success .item-status-icon {
  background: rgba(52, 199, 89, 0.15);
  color: #34C759;
}

.item-fail .item-status-icon {
  background: rgba(255, 59, 48, 0.15);
  color: #FF3B30;
}

.item-info {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
}

.item-username {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main, #1d1d1f);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-reason {
  font-size: 12px;
  color: var(--text-muted, #86868b);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: right;
  max-width: 180px;
}

.item-fail .item-reason {
  color: #FF3B30;
}

/* 底部 */
.result-footer {
  padding: 12px 24px 20px;
  display: flex;
  justify-content: center;
}

.result-confirm-btn {
  padding: 10px 40px;
  border-radius: 12px;
  border: none;
  background: var(--apple-blue, #0A84FF);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.result-confirm-btn:hover {
  filter: brightness(0.92);
  transform: scale(0.98);
}

.result-confirm-btn:active {
  transform: scale(0.95);
}

/* 过渡动画 */
.result-modal-enter-active {
  transition: opacity 0.3s ease;
}
.result-modal-enter-active .delete-result-modal {
  animation: modal-spring 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
}
.result-modal-leave-active {
  transition: opacity 0.25s ease;
}
.result-modal-leave-active .delete-result-modal {
  transition: transform 0.25s ease, opacity 0.25s ease;
  transform: scale(0.95);
  opacity: 0;
}
.result-modal-enter-from,
.result-modal-leave-to {
  opacity: 0;
}

/* 删除结果弹窗 - 暗黑模式 */
.dark .delete-result-overlay {
  background: rgba(0, 0, 0, 0.5);
}

.dark .delete-result-modal {
  background: rgba(28, 28, 30, 0.92);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 80px -12px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

.dark .result-title {
  color: #f5f5f7;
}

.dark .result-subtitle {
  color: rgba(255, 255, 255, 0.5);
}

.dark .item-username {
  color: #f5f5f7;
}

.dark .item-reason {
  color: rgba(255, 255, 255, 0.45);
}

.dark .result-item.item-fail .item-reason {
  color: #FF6961;
}

.dark .result-item.item-success {
  background: rgba(52, 199, 89, 0.1);
}

.dark .result-item.item-fail {
  background: rgba(255, 59, 48, 0.1);
}

.dark .result-confirm-btn {
  background: var(--apple-blue, #0A84FF);
}

/* ===== 角色分配弹窗 - 暗黑模式 ===== */
.dark .role-checkbox-item {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .role-checkbox-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: color-mix(in srgb, var(--apple-blue) 40%, transparent);
}

.dark .role-checkbox-name {
  color: #f5f5f7;
}

.dark .role-checkbox-desc {
  color: rgba(255, 255, 255, 0.45);
}

.dark .role-checkbox-name.is-super {
  color: #F5D060;
}

.dark .role-checkbox-item .ant-checkbox-inner {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.2);
}

.dark .role-checkbox-item .ant-checkbox:hover .ant-checkbox-inner {
  border-color: var(--apple-blue, #0A84FF);
}

.dark .role-checkbox-item .ant-checkbox-checked .ant-checkbox-inner {
  background: var(--apple-blue, #0A84FF);
  border-color: var(--apple-blue, #0A84FF);
}
</style>
