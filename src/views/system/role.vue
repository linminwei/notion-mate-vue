<template>
  <div class="neo-page-container">

    <!-- ================= 页面头部与工具栏 ================= -->
    <header class="neo-page-header">
      <div class="capsule-search">
        <div class="search-inputs">
          <input type="text" v-model="searchForm.roleName" placeholder="角色名称" @keyup.enter="handleSearch" />
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
        <button class="neo-btn-solid primary" v-permission="'system:role:add'" @click="handleAdd">
          <font-awesome-icon :icon="['fas', 'plus']" />
          新增角色
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
          row-key="id"
          @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">

          <!-- 状态列 (分段开关，无权限仅展示，SUPER_ADMIN禁用态) -->
          <template v-if="column.key === 'status'">
            <div v-if="!canEditStatus" class="status-indicator-wrap" :class="record.status === 1 ? 'is-active' : 'is-inactive'">
              <div class="status-dot"></div>
              <span>{{ record.status === 1 ? '启用' : '禁用' }}</span>
            </div>
            <div
              v-else
              class="status-segmented-toggle"
              :class="[record.status === 1 ? 'is-active' : 'is-inactive', { disabled: record.roleCode === 'SUPER_ADMIN' }]"
              @click="record.roleCode !== 'SUPER_ADMIN' && handleToggleStatus(record)"
            >
              <div class="seg-thumb"></div>
              <span class="seg-label seg-on" :class="{ current: record.status === 1 }">启用</span>
              <span class="seg-label seg-off" :class="{ current: record.status === 0 }">禁用</span>
            </div>
          </template>

          <!-- 操作列 -->
          <template v-if="column.key === 'action'">
            <div class="action-btn-group">
              <button
                  class="text-action-btn primary"
                  v-permission="'system:menu:list'"
                  @click="handleAssignMenu(record)"
              >
                分配菜单
              </button>
              <span class="action-divider"></span>

              <button
                  class="text-action-btn primary"
                  v-permission="'system:role:edit'"
                  @click="handleEdit(record)"
              >
                编辑
              </button>
              <span class="action-divider"></span>
              <button
                  class="text-action-btn danger"
                  v-permission="'system:role:delete'"
                  @click="confirmDelete(record.id)"
              >
                删除
              </button>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <!-- ================= 高级表单弹窗 (NeoFormModal) ================= -->
    <NeoFormModal
        v-model:open="modalVisible"
        ref="formRef"
        :model="formState"
        :rules="rules"
        :title="modalTitle"
        subtitle="配置角色的权限与基础属性"
        :width="600"
        :icon="['fas', 'user-shield']"
        theme="primary"
        confirmText="保存配置"
        :confirmLoading="submitLoading"
        @ok="handleSubmit"
    >
      <div class="form-grid">
        <a-form-item label="角色编码" name="roleCode">
          <a-input v-model:value="formState.roleCode" placeholder="请输入角色编码" :disabled="!!formState.id" />
        </a-form-item>
        <a-form-item label="角色名称" name="roleName">
          <a-input v-model:value="formState.roleName" placeholder="请输入角色名称" />
        </a-form-item>
      </div>
      <a-form-item label="备注" name="remark">
        <a-textarea v-model:value="formState.remark" placeholder="请输入备注" :auto-size="{ minRows: 1 }" />
      </a-form-item>
    </NeoFormModal>

    <!-- ================= 菜单分配弹窗 ================= -->
    <NeoFormModal
        v-model:open="menuAssignVisible"
        :title="'分配菜单 — ' + (currentRole?.roleName || '')"
        subtitle="勾选需要分配给该角色的菜单项"
        :width="520"
        :icon="['fas', 'check-square']"
        theme="primary"
        confirmText="保存分配"
        :confirmLoading="menuAssignLoading"
        destroyOnClose
        @ok="handleMenuAssignSubmit"
    >
      <div class="menu-tree-wrap">
        <a-tree
            v-model:checkedKeys="checkedMenuIds"
            :tree-data="menuTreeData"
            checkable
            default-expand-all
            :field-names="{ title: 'menuName', key: 'id', children: 'children' }"
            @check="onMenuTreeCheck"
        >
          <template #title="node">
            <span class="tree-node-row">
              <span class="tree-node-icon" v-if="node.icon">
                <span v-if="node.icon.trim().startsWith('<svg')" v-html="node.icon" class="svg-icon-inline"></span>
                <font-awesome-icon v-else :icon="formatFaIcon(node.icon) || ['fas', 'folder']" />
              </span>
              <span class="tree-node-name">{{ node.menuName }}</span>
            </span>
          </template>
        </a-tree>
      </div>
    </NeoFormModal>

    <!-- ================= 苹果风确认弹窗 ================= -->
    <AppleConfirmModal
        v-model:visible="deleteConfirmVisible"
        type="danger"
        title="删除角色"
        desc="您确定要删除该角色吗？此操作不可恢复。"
        confirmText="确认删除"
        :loading="deleteConfirmLoading"
        @confirm="executeDelete"
    />

    <!-- ================= 状态切换确认弹窗 ================= -->
    <AppleConfirmModal
        v-model:visible="statusConfirmVisible"
        :type="statusTargetValue === 1 ? 'warning' : 'danger'"
        :title="statusTargetValue === 1 ? '启用角色' : '禁用角色'"
        :desc="statusConfirmDesc"
        :confirmText="statusTargetValue === 1 ? '确认启用' : '确认禁用'"
        :loading="statusConfirmLoading"
        @confirm="executeStatusToggle"
    />

    <!-- ================= 删除结果展示弹窗 ================= -->
    <Teleport to="body">
      <Transition name="result-modal">
        <div v-if="deleteResultVisible" class="delete-result-overlay" @click.self="deleteResultVisible = false">
          <div class="delete-result-modal">
            <!-- 头部 -->
            <div class="result-header" :class="deleteResultType">
              <div class="result-icon-wrap">
                <font-awesome-icon v-if="deleteResultType === 'success'" :icon="['fas', 'check-circle']" />
                <font-awesome-icon v-else :icon="['fas', 'times-circle']" />
              </div>
              <div class="result-header-text">
                <h3 class="result-title">{{ deleteResultTitle }}</h3>
                <p class="result-subtitle">{{ deleteResultSubtitle }}</p>
              </div>
            </div>

            <!-- 错误详情（仅错误时显示） -->
            <div class="result-list" v-if="deleteResultType === 'error' && deleteErrorMessage">
              <div class="result-item item-fail">
                <div class="item-status-icon">
                  <font-awesome-icon :icon="['fas', 'xmark']" />
                </div>
                <div class="item-info">
                  <span class="item-reason">{{ deleteErrorMessage }}</span>
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
import { getRolePage, addRole, updateRole, deleteRole } from '@/api/role.ts'
import { getMenuList, assignMenu, getRoleMenuTree } from '@/api/menu.ts'
import { getDictDataByDictCodeEnable } from '@/api/dict'
import type { SysRole, DictData } from '@/types'
import type { Rule } from 'ant-design-vue/es/form'
import NeoFormModal from '@/components/common/NeoFormModal.vue'
import AppleConfirmModal from '@/components/common/AppleConfirmModal.vue'
import { AppleAlert } from '@/components/common/AppleAlert.ts'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const canEditStatus = computed(() => userStore.hasPermission('system:role:edit'))

// --- 表格列定义 ---
const columns = [
  { title: '角色编码', dataIndex: 'roleCode', key: 'roleCode' },
  { title: '角色名称', dataIndex: 'roleName', key: 'roleName' },
  { title: '描述', dataIndex: 'remark', key: 'remark', ellipsis: true },
  { title: '状态', dataIndex: 'status', key: 'status', align: 'center', width: 120 },
  { title: '操作', key: 'action', align: 'center', width: 240 }
]

// --- 工具方法 ---
const formatFaIcon = (iconStr: string) => {
  if (!iconStr) return ''
  const parts = iconStr.split(' ')
  let prefix = 'fas'
  let iconName = ''
  parts.forEach(p => {
    if (p === 'fa-solid' || p === 'fas') prefix = 'fas'
    else if (p === 'fa-regular' || p === 'far') prefix = 'far'
    else if (p === 'fa-brands' || p === 'fab') prefix = 'fab'
    else if (p.startsWith('fa-')) iconName = p.replace('fa-', '')
  })
  return iconName ? [prefix, iconName] : ''
}

/** 获取节点下所有子孙叶子节点的 ID */
const getAllLeafIds = (node: any): string[] => {
  if (!node.children?.length) return [node.id]
  return node.children.flatMap((c: any) => getAllLeafIds(c))
}

/** 计算当前已选叶子集合对应的祖先节点 ID（模拟 Ant Design Tree 的 halfCheckedKeys） */
const computeAncestorIds = (treeNodes: any[], leafIdSet: Set<string>): string[] => {
  const result: string[] = []
  const walk = (nodes: any[]) => {
    for (const node of nodes) {
      if (node.children?.length) {
        const leaves = getAllLeafIds(node)
        if (leaves.length > 0 && leaves.every(id => leafIdSet.has(id))) {
          result.push(node.id)
        }
        walk(node.children)
      }
    }
  }
  walk(treeNodes)
  return result
}

// --- 状态与数据 ---
const loading = ref(false)
const tableData = ref<SysRole[]>([])
const commonStatusDict = ref<DictData[]>([])

const searchForm = reactive({ roleName: '', status: undefined as number | undefined, pageNum: 1, pageSize: 10 })
const pagination = reactive({ current: 1, pageSize: 10, total: 0, showTotal: (total: number) => `共 ${total} 条` })

// --- 弹窗与表单 (NeoFormModal) ---
const modalVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref<InstanceType<typeof NeoFormModal>>()
const formState = reactive<Partial<SysRole>>({ id: undefined, roleCode: '', roleName: '', remark: '' })
const originalRecord = ref<SysRole | null>(null)
const modalTitle = computed(() => formState.id ? '编辑角色配置' : '新增角色')

const rules: Record<string, Rule[]> = {
  roleCode: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
}

// --- 删除确认逻辑 (AppleConfirmModal) ---
const deleteConfirmVisible = ref(false)
const deleteConfirmLoading = ref(false)
const deleteTargetId = ref<string | null>(null)

// --- 删除结果展示 ---
const deleteResultVisible = ref(false)
const deleteResultType = ref<'success' | 'error'>('success')
const deleteResultTitle = ref('')
const deleteResultSubtitle = ref('')
const deleteErrorMessage = ref('')

const confirmDelete = (id: string) => {
  deleteTargetId.value = id
  deleteConfirmVisible.value = true
}

const executeDelete = async () => {
  if (!deleteTargetId.value) return
  const targetRole = tableData.value.find(r => r.id === deleteTargetId.value)
  const roleName = targetRole?.roleName || '未知角色'
  deleteConfirmLoading.value = true
  try {
    await deleteRole(deleteTargetId.value)
    deleteResultType.value = 'success'
    deleteResultTitle.value = '删除成功'
    deleteResultSubtitle.value = `角色「${roleName}」已从系统移除`
    deleteErrorMessage.value = ''
    fetchData()
  } catch (error: any) {
    deleteResultType.value = 'error'
    deleteResultTitle.value = '删除失败'
    deleteResultSubtitle.value = error.message
  } finally {
    deleteConfirmLoading.value = false
    deleteConfirmVisible.value = false
    deleteResultVisible.value = true
  }
}

// --- 状态切换逻辑 ---
const statusConfirmVisible = ref(false)
const statusConfirmLoading = ref(false)
const statusTargetValue = ref<number>(1)
const statusTargetRole = ref<SysRole | null>(null)

const statusConfirmDesc = computed(() => {
  const actionText = statusTargetValue.value === 1 ? '启用' : '禁用'
  if (statusTargetRole.value) {
    return `确定要${actionText}角色「${statusTargetRole.value.roleName}」吗？`
  }
  return ''
})

const handleToggleStatus = (record: SysRole) => {
  statusTargetRole.value = record
  statusTargetValue.value = record.status === 1 ? 0 : 1
  statusConfirmVisible.value = true
}

const executeStatusToggle = async () => {
  if (!statusTargetRole.value) return
  statusConfirmLoading.value = true
  try {
    await updateRole({ ...statusTargetRole.value, status: statusTargetValue.value })
    AppleAlert.success(
      statusTargetValue.value === 1 ? '已启用' : '已禁用',
      `角色「${statusTargetRole.value.roleName}」状态已更新`
    )
    fetchData()
  } catch (error: any) {
    AppleAlert.error('操作失败', error.message || '状态切换未完成')
  } finally {
    statusConfirmLoading.value = false
    statusConfirmVisible.value = false
  }
}

// --- 菜单分配逻辑 ---
const menuAssignVisible = ref(false)
const menuAssignLoading = ref(false)
const currentRole = ref<SysRole | null>(null)
const checkedMenuIds = ref<string[]>([])
const halfCheckedMenuIds = ref<string[]>([])
const menuTreeData = ref<any[]>([])

// 仅提取叶子节点 ID（role_menu 树中无子节点的），避免父级 ID 进入 checkedKeys 导致子级被连带勾选
const flattenLeafIds = (nodes: any[]): string[] => {
  return nodes.reduce<string[]>((ids, node) => {
    if (node.children?.length) {
      ids.push(...flattenLeafIds(node.children))
    } else {
      ids.push(node.id)
    }
    return ids
  }, [])
}

const handleAssignMenu = async (record: SysRole) => {
  currentRole.value = record
  try {
    const [menuRes, roleTreeRes] = await Promise.all([
      getMenuList(),
      getRoleMenuTree(record.id)
    ])
    menuTreeData.value = menuRes.data || []
    const leafIds = flattenLeafIds(roleTreeRes.data || [])
    checkedMenuIds.value = leafIds
    // 计算初始 halfCheckedKeys：在完整菜单树中，所有「子孙叶节点全部在已选集合中」的祖先节点
    halfCheckedMenuIds.value = computeAncestorIds(menuTreeData.value, new Set(leafIds))
  } catch {
    AppleAlert.error('加载失败', '无法获取菜单列表')
    return
  }
  menuAssignVisible.value = true
}

const onMenuTreeCheck = (_keys: string[], info: { halfCheckedKeys?: string[] }) => {
  halfCheckedMenuIds.value = info.halfCheckedKeys || []
}

const handleMenuAssignSubmit = async () => {
  if (!currentRole.value) return
  menuAssignLoading.value = true
  try {
    await assignMenu({
      roleId: currentRole.value.id,
      menuIds: [...checkedMenuIds.value, ...halfCheckedMenuIds.value]
    })
    AppleAlert.success('分配成功', '菜单权限已更新')
    menuAssignVisible.value = false
    await userStore.fetchUserInfo()
    fetchData()
  } catch (error: any) {
    AppleAlert.error('分配失败', error.message || '操作未完成')
  } finally {
    menuAssignLoading.value = false
  }
}

// --- API 方法 ---
const fetchData = async () => {
  loading.value = true
  try {
    const res = await getRolePage(searchForm)
    tableData.value = res.data.list
    pagination.total = res.data.total
    pagination.current = searchForm.pageNum
  } catch (error: any) {
    AppleAlert.error('数据加载失败', error.message || '无法获取角色列表')
  } finally {
    loading.value = false
  }
}

const fetchCommonStatus = async () => {
  try {
    const res = await getDictDataByDictCodeEnable('sys_common_status')
    commonStatusDict.value = res.data || []
  } catch (error) {
    console.warn('获取 sys_common_status 字典失败', error)
  }
}

const handleSearch = () => {
  searchForm.pageNum = 1
  pagination.current = 1
  fetchData()
}

const handleReset = () => {
  searchForm.roleName = ''
  searchForm.status = undefined
  searchForm.pageNum = 1
  pagination.current = 1
  fetchData()
}

const handleTableChange = (pag: any) => {
  searchForm.pageNum = pag.current
  searchForm.pageSize = pag.pageSize
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchData()
}

const handleAdd = () => {
  Object.assign(formState, { id: undefined, roleCode: '', roleName: '', remark: '' })
  modalVisible.value = true
}

const handleEdit = (record: SysRole) => {
  const { id, roleCode, roleName, remark } = record
  Object.assign(formState, { id, roleCode, roleName, remark })
  originalRecord.value = { ...record }
  modalVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
  } catch {
    return // 验证失败，表单已有错误提示
  }

  submitLoading.value = true
  try {
    if (formState.id) {
      // 编辑模式：仅发送变更字段
      const patch: Partial<SysRole> = { id: formState.id }
      let hasChange = false
      if (originalRecord.value) {
        if (formState.roleName !== originalRecord.value.roleName) {
          patch.roleName = formState.roleName
          hasChange = true
        }
        if ((formState.remark || '') !== (originalRecord.value.remark || '')) {
          patch.remark = formState.remark ?? ''
          hasChange = true
        }
      }
      if (!hasChange) {
        modalVisible.value = false
        return
      }
      await updateRole(patch)
      AppleAlert.success('保存成功', '角色配置已更新')
    } else {
      await addRole(formState)
      AppleAlert.success('创建成功', '新角色已添加到系统')
    }
    modalVisible.value = false
    fetchData()
  } catch (error: any) {
    AppleAlert.error('操作失败', error.message || '操作未完成')
  } finally {
    submitLoading.value = false
  }
}

onMounted(() => { fetchData(); fetchCommonStatus() })
</script>

<style scoped>
/* ================= 菜单分配树样式 ================= */
.menu-tree-wrap {
  padding: 4px 0;
}

.menu-tree-wrap :deep(.ant-tree-node-content-wrapper) {
  background: transparent !important;
  display: inline-flex !important;
  align-items: center !important;
}
.menu-tree-wrap :deep(.ant-tree-node-content-wrapper:hover) {
  background: transparent !important;
}
.menu-tree-wrap :deep(.ant-tree-treenode-selected .ant-tree-node-content-wrapper) {
  background: transparent !important;
}
.menu-tree-wrap :deep(.ant-tree) {
  background: transparent !important;
}
.menu-tree-wrap :deep(.ant-tree-checkbox) {
  margin-right: 8px;
  margin-top: 0 !important;
  align-self: center;
}

/* ---- 复选框主题色覆盖 ---- */
.menu-tree-wrap :deep(.ant-tree-checkbox-inner) {
  width: 16px;
  height: 16px;
  border-radius: 5px;
  border: 1.5px solid rgba(60, 60, 67, 0.25);
  background: transparent;
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.menu-tree-wrap :deep(.ant-tree-checkbox:hover .ant-tree-checkbox-inner) {
  border-color: var(--apple-blue, #007AFF);
  background: color-mix(in srgb, var(--apple-blue, #007AFF) 6%, transparent);
}

/* 选中 & 半选 — 主题蓝填充 + 白勾 */
.menu-tree-wrap :deep(.ant-tree-checkbox-checked .ant-tree-checkbox-inner),
.menu-tree-wrap :deep(.ant-tree-checkbox-indeterminate .ant-tree-checkbox-inner) {
  background: var(--apple-blue, #007AFF) !important;
  border-color: var(--apple-blue, #007AFF) !important;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.15);
}
.menu-tree-wrap :deep(.ant-tree-checkbox-checked .ant-tree-checkbox-inner::after) {
  border-color: #ffffff;
  border-width: 0 2px 2px 0;
  width: 5px;
  height: 9px;
  top: 44%;
  left: 20%;
  transform: rotate(45deg) translate(-50%, -50%);
}
.menu-tree-wrap :deep(.ant-tree-checkbox-indeterminate .ant-tree-checkbox-inner::after) {
  background: #ffffff;
  width: 8px;
  height: 2px;
  border-radius: 1px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 禁用态 */
.menu-tree-wrap :deep(.ant-tree-checkbox-disabled .ant-tree-checkbox-inner) {
  opacity: 0.4;
  border-color: rgba(60, 60, 67, 0.15);
  background: rgba(60, 60, 67, 0.04);
}
.menu-tree-wrap :deep(.ant-tree-checkbox-disabled.ant-tree-checkbox-checked .ant-tree-checkbox-inner) {
  background: color-mix(in srgb, var(--apple-blue, #007AFF) 40%, transparent) !important;
  border-color: transparent !important;
}

/* 暗黑模式 */
:global(.dark) .menu-tree-wrap :deep(.ant-tree-checkbox-inner) {
  border-color: rgba(255, 255, 255, 0.18);
}
:global(.dark) .menu-tree-wrap :deep(.ant-tree-checkbox:hover .ant-tree-checkbox-inner) {
  border-color: var(--apple-blue, #0A84FF);
  background: color-mix(in srgb, var(--apple-blue, #0A84FF) 12%, transparent);
}
:global(.dark) .menu-tree-wrap :deep(.ant-tree-checkbox-disabled .ant-tree-checkbox-inner) {
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
}

.tree-node-row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.tree-node-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  font-size: 14px;
  color: var(--apple-blue, #0A84FF);
  flex-shrink: 0;
  opacity: 0.85;
}
.tree-node-icon .svg-icon-inline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
}
.tree-node-icon .svg-icon-inline :deep(svg) {
  width: 16px;
  height: 16px;
  fill: currentColor;
}
.tree-node-icon .svg-icon-inline :deep(svg path) {
  fill: currentColor;
}
.tree-node-name {
  font-size: 14px;
  color: var(--text-main);
}

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
  min-width: 360px;
  background: var(--card-bg, #f5f5f7);
  border-radius: 14px;
  padding: 4px;
  border: 1px solid var(--border-color);
  transition: all 0.3s;
  align-items: center;
}
.capsule-search:focus-within {
  background: var(--card-bg, #ffffff);
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
  color: var(--text-muted, #8e8e93);
  margin: 4px 0 0;
  line-height: 1.4;
}

/* 结果列表 */
.result-list {
  padding: 0 24px;
  max-height: 200px;
  overflow-y: auto;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(60, 60, 67, 0.04);
}

.item-status-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  flex-shrink: 0;
}

.item-fail .item-status-icon {
  background: rgba(255, 59, 48, 0.1);
  color: #FF3B30;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-reason {
  font-size: 13px;
  color: var(--text-main, #1d1d1f);
  word-break: break-word;
}

/* 底部按钮 */
.result-footer {
  padding: 12px 24px 20px;
  display: flex;
  justify-content: center;
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

/* 暗黑模式 */
.dark .delete-result-overlay {
  background: rgba(0, 0, 0, 0.5);
}

.dark .delete-result-modal {
  background: rgba(28, 28, 30, 0.92);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 80px -12px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

.dark .result-item {
  background: rgba(255, 255, 255, 0.04);
}
</style>
