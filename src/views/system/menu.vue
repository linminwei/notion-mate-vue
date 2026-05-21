<template>
  <div class="neo-page-container">

    <!-- ================= 页面头部与工具栏 ================= -->
    <header class="neo-page-header">
      <div class="header-actions">
        <button class="neo-icon-btn" @click="fetchData" title="刷新数据">
          <font-awesome-icon :icon="['fas', 'sync-alt']" :class="{ 'fa-spin': loading }" />
        </button>

        <button class="neo-btn-flat" @click="toggleExpandAll">
          <font-awesome-icon :icon="['fas', 'sort']" />
          {{ isExpandedAll ? '折叠全部' : '展开全部' }}
        </button>

        <button class="neo-btn-solid primary" v-permission="'system:menu:add'" @click="handleAdd('0')">
          <font-awesome-icon :icon="['fas', 'plus']" />
          新增菜单
        </button>
      </div>
    </header>

    <!-- ================= 核心数据表格区域 ================= -->
    <div class="neo-card table-card fade-in">
      <a-table
          class="neo-table menu-table"
          :columns="columns"
          :data-source="tableData"
          :loading="loading"
          :pagination="false"
          row-key="id"
          :expanded-row-keys="expandedRowKeys"
          @expandedRowsChange="handleExpandedRowsChange"
          :custom-row="customRow"
      >
        <template #bodyCell="{ column, record }">

          <!-- 菜单名称列 (带展开图标缩进) -->
          <template v-if="column.key === 'menuName'">
            <span class="cell-primary-text">{{ record.menuName }}</span>
          </template>

          <!-- 图标列 -->
          <template v-if="column.key === 'icon'">
            <div class="icon-cell-box">
              <!-- SVG 图标 -->
              <span v-if="isSvgIcon(record.icon)" class="icon-cell-svg" v-html="record.icon"></span>
              <!-- FontAwesome 图标 -->
              <font-awesome-icon
                  v-else-if="record.icon && formatFaIcon(record.icon)"
                  :icon="formatFaIcon(record.icon)"
                  class="menu-fa-icon"
              />
              <span v-else class="text-placeholder">-</span>
            </div>
          </template>

          <!-- 菜单类型列 (高定 Apple Pill) -->
          <template v-if="column.key === 'menuType'">
            <span class="neo-pill type-pill" :class="getMenuTypeClass(record.menuType)">
              {{ menuTypeLabels[record.menuType] }}
            </span>
          </template>

          <!-- 路由与权限 (高定徽标样式) -->
          <template v-if="column.key === 'path' || column.key === 'permission'">
            <span v-if="record[column.key]" class="mono-badge" :title="record[column.key]">{{ record[column.key] }}</span>
            <span v-else class="text-placeholder">-</span>
          </template>

          <!-- 排序权重 -->
          <template v-if="column.key === 'sort'">
            <span :class="['sort-badge', { 'drag-handle': canSort }]" :title="canSort ? '拖拽排序' : ''">
              <font-awesome-icon v-if="canSort" :icon="['fas', 'grip-vertical']" class="drag-icon" />
              {{ record.sort }}
            </span>
          </template>

          <!-- 状态列 (分段开关，点击切换) -->
          <template v-if="column.key === 'status'">
            <div v-if="!canEditStatus" class="status-indicator-wrap" :class="record.status === 1 ? 'is-active' : 'is-inactive'">
              <div class="status-dot"></div>
              <span>{{ record.status === 1 ? '启用' : '禁用' }}</span>
            </div>
            <div
              v-else
              class="status-segmented-toggle"
              :class="record.status === 1 ? 'is-active' : 'is-inactive'"
              @click="handleToggleStatus(record)"
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
                  v-permission="'system:menu:add'"
                  v-if="record.menuType !== 3"
                  @click="handleAdd(record.id, record.menuType)"
              >
                新增下级
              </button>
              <span class="action-divider" v-if="record.menuType !== 3"></span>

              <button
                  class="text-action-btn primary"
                  v-permission="'system:menu:edit'"
                  @click="handleEdit(record)"
              >
                编辑
              </button>
              <span class="action-divider"></span>

              <button
                  class="text-action-btn danger"
                  v-permission="'system:menu:delete'"
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
        subtitle="配置菜单的路由与显示权限属性"
        :width="700"
        :icon="['fas', 'layer-group']"
        theme="primary"
        confirmText="保存配置"
        :confirmLoading="submitLoading"
        @ok="handleSubmit"
    >
      <a-form-item label="上级菜单" name="parentId">
        <a-tree-select
            v-model:value="formState.parentId"
            :tree-data="menuTreeOptions"
            :field-names="{ label: 'menuName', value: 'id' }"
            placeholder="请选择上级菜单 (默认顶级)"
            allow-clear
            tree-default-expand-all
            class="neo-tree-select"
            popupClassName="neo-tree-select-dropdown"
        >
          <template #title="node">
            <span class="tree-node-content">
              <span class="tree-node-icon" v-if="node.icon">
                <span v-if="isSvgIcon(node.icon)" v-html="node.icon" class="svg-icon-inline"></span>
                <font-awesome-icon v-else-if="formatFaIcon(node.icon)" :icon="formatFaIcon(node.icon)" />
                <font-awesome-icon v-else :icon="['fas', 'folder']" class="default-icon" />
              </span>
              <span v-else class="tree-node-icon">
                <font-awesome-icon :icon="['fas', 'folder']" class="default-icon" />
              </span>
              <span class="tree-node-label">{{ node.menuName }}</span>
            </span>
          </template>
        </a-tree-select>
      </a-form-item>

      <a-form-item label="菜单类型" name="menuType">
        <div class="neo-radio-group">
          <label class="neo-radio-card type-dir" :class="{ 'is-active': formState.menuType === 1 }">
            <input type="radio" v-model="formState.menuType" :value="1" class="hidden-radio" />
            <div class="radio-icon text-gold"><font-awesome-icon :icon="['fas', 'folder']" /></div>
            <span>目录</span>
          </label>
          <label class="neo-radio-card type-menu" :class="{ 'is-active': formState.menuType === 2 }">
            <input type="radio" v-model="formState.menuType" :value="2" class="hidden-radio" />
            <div class="radio-icon text-green"><font-awesome-icon :icon="['fas', 'file-alt']" /></div>
            <span>菜单</span>
          </label>
          <label class="neo-radio-card type-btn" :class="{ 'is-active': formState.menuType === 3 }">
            <input type="radio" v-model="formState.menuType" :value="3" class="hidden-radio" />
            <div class="radio-icon text-red"><font-awesome-icon :icon="['fas', 'hand-pointer']" /></div>
            <span>按钮</span>
          </label>
        </div>
      </a-form-item>

      <div class="form-grid">
        <a-form-item label="菜单名称" name="menuName">
          <a-input v-model:value="formState.menuName" placeholder="如：用户管理" :maxlength="50" />
        </a-form-item>

        <a-form-item v-if="formState.menuType !== 3" name="path">
          <template #label>
            路由路径
            <a-tooltip title="访问的路由地址，如：`user`">
              <font-awesome-icon :icon="['fas', 'info-circle']" class="help-icon" />
            </a-tooltip>
          </template>
          <a-input v-model:value="formState.path" placeholder="如：user" />
        </a-form-item>

        <a-form-item v-if="formState.menuType === 3" name="permission" :rules="[{ required: true, message: '请输入权限标识', trigger: 'blur' }]">
          <template #label>
            权限标识
            <a-tooltip title="权限控制字符，如：`system:user:add`">
              <font-awesome-icon :icon="['fas', 'info-circle']" class="help-icon" />
            </a-tooltip>
          </template>
          <a-input v-model:value="formState.permission" placeholder="如：system:user:add" />
        </a-form-item>
      </div>

      <div class="form-grid" v-if="formState.menuType === 2">
        <a-form-item name="component" :rules="[{ required: true, message: '请输入组件路径', trigger: 'blur' }]">
          <template #label>
            组件路径
            <a-tooltip title="访问的视图组件路径，如：`system/user/index`">
              <font-awesome-icon :icon="['fas', 'info-circle']" class="help-icon" />
            </a-tooltip>
          </template>
          <a-input v-model:value="formState.component" placeholder="如：system/user/index" />
        </a-form-item>

        <a-form-item name="permission" :rules="[{ required: true, message: '请输入权限标识', trigger: 'blur' }]">
          <template #label>
            权限标识
            <a-tooltip title="权限控制字符，如：`system:user:add`">
              <font-awesome-icon :icon="['fas', 'info-circle']" class="help-icon" />
            </a-tooltip>
          </template>
          <a-input v-model:value="formState.permission" placeholder="如：system:user:add" />
        </a-form-item>
      </div>

      <a-form-item v-if="formState.menuType !== 3" label="菜单图标" name="icon" class="icon-picker-form-item">
        <IconPicker v-model:value="formState.icon" placeholder="搜索图标..." />
      </a-form-item>
    </NeoFormModal>

    <!-- ================= 苹果风确认弹窗 ================= -->
    <AppleConfirmModal
        v-model:visible="deleteConfirmVisible"
        type="danger"
        title="删除菜单"
        desc="您确定要删除该菜单及其所有下级子项吗？此操作不可恢复。"
        confirmText="确认删除"
        :loading="deleteConfirmLoading"
        @confirm="executeDelete"
    />

    <!-- ================= 状态切换确认弹窗 ================= -->
    <AppleConfirmModal
        v-model:visible="statusConfirmVisible"
        :type="statusTargetValue === 1 ? 'warning' : 'danger'"
        :title="statusTargetValue === 1 ? '启用菜单' : '禁用菜单'"
        :desc="statusConfirmDesc"
        :confirmText="statusTargetValue === 1 ? '确认启用' : '确认禁用'"
        :loading="statusConfirmLoading"
        @confirm="executeStatusToggle"
    />

    <!-- ================= 菜单删除 - 结果弹窗 ================= -->
    <Teleport to="body">
      <Transition name="result-modal">
        <div v-if="menuDeleteResultVisible" class="delete-result-overlay" @click.self="menuDeleteResultVisible = false">
          <div class="delete-result-modal">
            <!-- 头部 -->
            <div class="result-header" :class="menuDeleteResultType">
              <div class="result-icon-wrap">
                <font-awesome-icon v-if="menuDeleteResultType === 'success'" :icon="['fas', 'check-circle']" />
                <font-awesome-icon v-else :icon="['fas', 'times-circle']" />
              </div>
              <div class="result-header-text">
                <h3 class="result-title">{{ menuDeleteResultTitle }}</h3>
                <p class="result-subtitle">{{ menuDeleteResultSubtitle }}</p>
              </div>
            </div>

            <!-- 已分配角色列表 / 错误详情 -->
            <div class="result-list" v-if="menuDeleteAssignedRoles.length || menuDeleteErrorMessage">
              <template v-if="menuDeleteAssignedRoles.length">
                <div
                  v-for="role in menuDeleteAssignedRoles"
                  :key="role.id"
                  class="result-item item-fail"
                >
                  <div class="item-status-icon">
                    <font-awesome-icon :icon="['fas', 'user-shield']" />
                  </div>
                  <div class="item-info">
                    <span class="item-username">{{ role.roleName }}</span>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="result-item item-fail">
                  <div class="item-status-icon">
                    <font-awesome-icon :icon="['fas', 'xmark']" />
                  </div>
                  <div class="item-info">
                    <span class="item-reason">{{ menuDeleteErrorMessage }}</span>
                  </div>
                </div>
              </template>
            </div>

            <!-- 底部按钮 -->
            <div class="result-footer">
              <button class="result-confirm-btn" @click="menuDeleteResultVisible = false">我知道了</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, computed, nextTick, watch } from 'vue'
import { getMenuList, addMenu, updateMenu, deleteMenu, batchSortMenu, getMenuAssignedRoles } from '@/api/menu.ts'
import type { SysMenu } from '@/types'
import type { FormInstance, Rule } from 'ant-design-vue/es/form'
import NeoFormModal from '@/components/common/NeoFormModal.vue'
import AppleConfirmModal from '@/components/common/AppleConfirmModal.vue'
import IconPicker from '@/components/common/IconPicker.vue'
import { AppleAlert } from '@/components/common/AppleAlert.ts'
import Sortable from 'sortablejs'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// --- 表格列定义 ---
const columns = [
  { title: '菜单名称', dataIndex: 'menuName', key: 'menuName', align: 'left', width: 220 },
  { title: '图标', dataIndex: 'icon', key: 'icon', align: 'center', width: 80 },
  { title: '类型', dataIndex: 'menuType', key: 'menuType', align: 'center', width: 100 },
  { title: '路由/组件路径', dataIndex: 'path', key: 'path', ellipsis: true },
  { title: '权限标识', dataIndex: 'permission', key: 'permission', ellipsis: true },
  { title: '排序', dataIndex: 'sort', key: 'sort', align: 'center', width: 80 },
  { title: '状态', dataIndex: 'status', key: 'status', align: 'center', width: 120 },
  { title: '操作', key: 'action', align: 'center', width: 240 } // 设置操作列表头居中
]

// --- 字典数据 ---
const menuTypeLabels: Record<number, string> = { 1: '目录', 2: '菜单', 3: '按钮' }
const getMenuTypeClass = (type: number) => {
  if (type === 1) return 'type-dir';
  if (type === 2) return 'type-menu';
  if (type === 3) return 'type-btn';
  return '';
}

// --- 工具方法 ---
const formatFaIcon = (iconStr: string) => {
  if (!iconStr) return '';
  const parts = iconStr.split(' ');
  let prefix = 'fas';
  let iconName = '';

  parts.forEach(p => {
    if (p.startsWith('fa-')) {
      if (p === 'fa-solid' || p === 'fas') prefix = 'fas';
      else if (p === 'fa-regular' || p === 'far') prefix = 'far';
      else if (p === 'fa-brands' || p === 'fab') prefix = 'fab';
      else {
        iconName = p.replace('fa-', '');
      }
    }
  });

  return iconName ? [prefix, iconName] : '';
}

const isSvgIcon = (icon: string) => icon && icon.trim().startsWith('<svg')

// --- 状态与数据 ---
const loading = ref(false)
const tableData = ref<SysMenu[]>([])
// 递归过滤掉按钮类型节点（menuType === 3），按钮不能作为上级菜单
const filterButtonMenus = (menus: SysMenu[]): SysMenu[] => {
  return menus
    .filter(menu => menu.menuType !== 3)
    .map(menu => ({
      ...menu,
      children: menu.children ? filterButtonMenus(menu.children) : undefined
    }))
}
const menuTreeOptions = computed(() => [{ id: '0', menuName: '顶级菜单', children: filterButtonMenus(tableData.value) }])

// --- 树形展开逻辑 ---
const isExpandedAll = ref(false)
const expandedRowKeys = ref<string[]>([])

const handleExpandedRowsChange = (keys: string[]) => {
  expandedRowKeys.value = keys
}

const getAllParentRowKeys = (nodes: any[]): string[] => {
  const keys: string[] = []
  for (const node of nodes) {
    if (node.children && node.children.length > 0) {
      keys.push(node.id)
      keys.push(...getAllParentRowKeys(node.children))
    }
  }
  return keys
}

const toggleExpandAll = () => {
  isExpandedAll.value = !isExpandedAll.value
  if (isExpandedAll.value) {
    expandedRowKeys.value = getAllParentRowKeys(tableData.value)
  } else {
    expandedRowKeys.value = []
  }
}

// --- 弹窗与表单 (NeoFormModal) ---
const modalVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref<InstanceType<typeof NeoFormModal>>()
const formState = reactive<Partial<SysMenu>>({
  id: undefined, parentId: '0', menuName: '', menuType: 1,
  path: '', component: '', permission: '', icon: '', sort: 0, status: 1
})
const canSort = computed(() => userStore.hasPermission('system:menu:edit'))
const canEditStatus = computed(() => userStore.hasPermission('system:menu:edit'))
const modalTitle = computed(() => formState.id ? '编辑菜单配置' : '新增菜单/按钮')

const rules: Record<string, Rule[]> = {
  menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  menuType: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
  path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }]
}

// --- 删除确认逻辑 (AppleConfirmModal) ---
const deleteConfirmVisible = ref(false)
const deleteConfirmLoading = ref(false)
const deleteTargetId = ref<string | null>(null)

// --- 菜单删除结果弹窗
const menuDeleteResultVisible = ref(false)
const menuDeleteResultType = ref<'success' | 'error'>('success')
const menuDeleteResultTitle = ref('')
const menuDeleteResultSubtitle = ref('')
const menuDeleteErrorMessage = ref('')
const menuDeleteAssignedRoles = ref<any[]>([])

const confirmDelete = (id: string) => {
  deleteTargetId.value = id
  deleteConfirmVisible.value = true
}

const executeDelete = async () => {
  if (!deleteTargetId.value) return
  deleteConfirmLoading.value = true
  try {
    // 先检查是否已分配角色
    const targetId = deleteTargetId.value
    const checkRes = await getMenuAssignedRoles(targetId)
    const roles = checkRes.data || []
    if (roles.length > 0) {
      // 有关联角色：关闭确认框，展示冲突结果弹窗
      deleteConfirmVisible.value = false
      menuDeleteAssignedRoles.value = roles
      menuDeleteResultType.value = 'error'
      menuDeleteResultTitle.value = '无法删除'
      menuDeleteResultSubtitle.value = '该菜单已分配给以下角色，无法删除'
      menuDeleteResultVisible.value = true
      return
    }
    // 无关联角色：执行删除
    await deleteMenu(targetId)
    deleteConfirmVisible.value = false
    menuDeleteResultType.value = 'success'
    menuDeleteResultTitle.value = '删除成功'
    menuDeleteResultSubtitle.value = '菜单项及其子项已移除'
    menuDeleteErrorMessage.value = ''
    menuDeleteResultVisible.value = true
    await fetchData()
    await userStore.fetchUserInfo()
  } catch (error: any) {
    const msg = error.message || ''
    deleteConfirmVisible.value = false
    menuDeleteResultType.value = 'error'
    menuDeleteResultTitle.value = '删除失败'
    menuDeleteResultSubtitle.value = msg || '操作未完成'
    menuDeleteErrorMessage.value = msg
    menuDeleteResultVisible.value = true
  } finally {
    deleteConfirmLoading.value = false
  }
}

// --- 状态切换逻辑 ---
const statusConfirmVisible = ref(false)
const statusConfirmLoading = ref(false)
const statusTargetValue = ref<number>(1)
const statusTargetMenu = ref<SysMenu | null>(null)

const statusConfirmDesc = computed(() => {
  const actionText = statusTargetValue.value === 1 ? '启用' : '禁用'
  if (statusTargetMenu.value) {
    return `确定要${actionText}菜单「${statusTargetMenu.value.menuName}」吗？`
  }
  return ''
})

const handleToggleStatus = (record: SysMenu) => {
  statusTargetMenu.value = record
  statusTargetValue.value = record.status === 1 ? 0 : 1
  statusConfirmVisible.value = true
}

const executeStatusToggle = async () => {
  if (!statusTargetMenu.value) return
  statusConfirmLoading.value = true
  try {
    await updateMenu({ ...statusTargetMenu.value, status: statusTargetValue.value })
    AppleAlert.success(
      statusTargetValue.value === 1 ? '已启用' : '已禁用',
      `菜单「${statusTargetMenu.value.menuName}」状态已更新`
    )
    await fetchData()
    await userStore.fetchUserInfo()
  } catch (error: any) {
    AppleAlert.error('操作失败', error.message || '状态切换未完成')
  } finally {
    statusConfirmLoading.value = false
    statusConfirmVisible.value = false
  }
}

// --- API 方法 ---
const fetchData = async () => {
  loading.value = true
  try {
    const res = await getMenuList()
    tableData.value = res.data
    // 保持展开状态
    if (isExpandedAll.value) {
      expandedRowKeys.value = getAllParentRowKeys(tableData.value)
    }
  } catch (error: any) {
    AppleAlert.error('数据加载失败', error.message || '无法获取菜单列表')
  } finally {
    loading.value = false
  }
}

const handleAdd = (parentId = '0', parentMenuType = 0) => {
  Object.assign(formState, {
    id: undefined, parentId, menuName: '', menuType: parentMenuType + 1,
    path: '', component: '', permission: '', icon: '', sort: 0, status: 1
  })
  modalVisible.value = true
}

const handleEdit = (record: SysMenu) => {
  Object.assign(formState, JSON.parse(JSON.stringify(record)))
  if (!formState.parentId) formState.parentId = '0'
  modalVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    submitLoading.value = true
    if (formState.id) {
      await updateMenu(formState)
      AppleAlert.success('保存成功', '菜单配置已更新')
    } else {
      await addMenu(formState)
      AppleAlert.success('创建成功', '新菜单已添加到系统')
    }
    modalVisible.value = false
    await fetchData()
    await userStore.fetchUserInfo()
  } catch (error: any) {
    // 验证失败不处理，子组件已有提示
  } finally {
    submitLoading.value = false
  }
}

// --- 拖拽排序 ---
const customRow = (record: SysMenu) => ({
  'data-parent-id': record.parentId || '0',
  'data-row-id': record.id
})

let sortableInstance: Sortable | null = null

const initSortable = () => {
  if (!userStore.hasPermission('system:menu:edit')) return
  nextTick(() => {
    const tableEl = document.querySelector('.menu-table .ant-table-tbody') as HTMLElement
    if (!tableEl) return

    if (sortableInstance) {
      sortableInstance.destroy()
    }

    sortableInstance = Sortable.create(tableEl, {
      animation: 200,
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      handle: '.drag-handle',
      onEnd: async (evt) => {
        if (!canSort.value) return
        const { oldIndex, newIndex, item } = evt
        if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) return

        // 1. 先收集信息（此时 DOM 已被 Sortable 移动到新位置）
        const sourceParentId = item.getAttribute('data-parent-id') || '0'
        const sourceId = item.getAttribute('data-row-id')
        const tbody = item.parentElement
        if (!tbody) return

        // 跨级检测：检查新位置的相邻行
        let isCrossLevel = false
        const allParentRows = Array.from(tbody.querySelectorAll('tr[data-parent-id]'))
        const currentIndex = allParentRows.indexOf(item)
        if (currentIndex !== -1) {
          let neighborParentId: string | null = null
          if (currentIndex > 0) {
            const prevRow = allParentRows[currentIndex - 1] as HTMLElement
            if (prevRow.getAttribute('data-row-id') !== sourceId) {
              neighborParentId = prevRow.getAttribute('data-parent-id')
            }
          }
          if (!neighborParentId && currentIndex < allParentRows.length - 1) {
            const nextRow = allParentRows[currentIndex + 1] as HTMLElement
            if (nextRow.getAttribute('data-row-id') !== sourceId) {
              neighborParentId = nextRow.getAttribute('data-parent-id')
            }
          }
          if (neighborParentId && neighborParentId !== sourceParentId) {
            isCrossLevel = true
          }
        }

        // 收集同 parentId 的行的 ID 顺序（当前 DOM 中的新顺序）
        const siblingRows = Array.from(tbody.querySelectorAll(`tr[data-parent-id="${sourceParentId}"]`))
        const siblingIds = siblingRows
            .map(row => (row as HTMLElement).getAttribute('data-row-id') || '')
            .filter(id => id !== '')

        // 2. 立即回滚 DOM（把行放回原位），让 Vue 维持对 DOM 的控制
        tbody.removeChild(item)
        const remainingRows = tbody.querySelectorAll('tr')
        if (oldIndex >= remainingRows.length) {
          tbody.appendChild(item)
        } else {
          tbody.insertBefore(item, remainingRows[oldIndex])
        }

        // 跨级拖拽：提示并返回（DOM 已回滚）
        if (isCrossLevel) {
          AppleAlert.warning('不允许跨级拖拽', '只能在同级菜单之间拖拽排序')
          return
        }

        // 3. 构建排序数据并调用 API
        const sortItems = siblingIds.map((id, index) => ({
          id,
          sort: index + 1
        }))

        if (sortItems.length === 0) return

        try {
          await batchSortMenu(sortItems)
          AppleAlert.success('排序成功', '菜单排序已更新')
          // 4. 通过数据驱动刷新（Vue 正确渲染）
          await fetchData()
          // 5. 同步更新侧边栏菜单顺序
          await userStore.fetchUserInfo()
        } catch (error: any) {
          AppleAlert.error('排序失败', error.message || '操作未完成')
          await fetchData()
        }
      }
    })
  })
}

onMounted(() => {
  fetchData().then(() => {
    if (canSort.value) initSortable()
  })
})

watch(canSort, (val) => {
  if (val) {
    initSortable()
  } else if (sortableInstance) {
    sortableInstance.destroy()
    sortableInstance = null
  }
})

onBeforeUnmount(() => {
  if (sortableInstance) {
    sortableInstance.destroy()
    sortableInstance = null
  }
})
</script>

<style scoped>
/* 修复树形表格第一列表头与底层节点内容缩位错位的问题 */
:deep(.neo-table.menu-table .ant-table-thead > tr > th:first-child) {
  padding-left: 42px !important;
}

/* ================= 模态框表单细节 ================= */
.help-icon { color: var(--text-muted); margin-left: 6px; font-size: 12px; cursor: help; opacity: 0.7; }
.help-icon:hover { opacity: 1; color: var(--text-main); }

/* 菜单类型 Radio Card */
.neo-radio-group { display: flex; gap: 12px; }
.neo-radio-card {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  border-radius: 12px;
  border: 1.5px solid rgba(0, 0, 0, 0.12);
  background: var(--content-bg, #fff);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  color: var(--text-muted);
  font-weight: 500;
  font-size: 14px;
  position: relative;
  user-select: none;
}
:root[data-theme='dark'] .neo-radio-card,
.dark .neo-radio-card {
  border-color: rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.04);
}
.neo-radio-card:hover {
  border-color: var(--apple-blue);
  background: var(--hover-bg);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}
.neo-radio-card:active {
  transform: scale(0.97);
  transition-duration: 0.1s;
}
.neo-radio-card.is-active {
  border-width: 2px;
  color: var(--text-main);
  font-weight: 600;
  transform: translateY(-1px);
}

.neo-radio-card.type-dir.is-active {
  border-color: #FFD60A;
  background: linear-gradient(135deg, rgba(255, 214, 10, 0.06), rgba(255, 214, 10, 0.14));
  box-shadow:
    0 0 0 3px rgba(255, 214, 10, 0.12),
    0 4px 16px rgba(255, 214, 10, 0.15);
}

.neo-radio-card.type-menu.is-active {
  border-color: #34C759;
  background: linear-gradient(135deg, rgba(52, 199, 89, 0.06), rgba(52, 199, 89, 0.14));
  box-shadow:
    0 0 0 3px rgba(52, 199, 89, 0.12),
    0 4px 16px rgba(52, 199, 89, 0.15);
}

.neo-radio-card.type-btn.is-active {
  border-color: #FF453A;
  background: linear-gradient(135deg, rgba(255, 69, 58, 0.06), rgba(255, 69, 58, 0.14));
  box-shadow:
    0 0 0 3px rgba(255, 69, 58, 0.12),
    0 4px 16px rgba(255, 69, 58, 0.15);
}

:root[data-theme='dark'] .neo-radio-card.type-dir.is-active,
.dark .neo-radio-card.type-dir.is-active {
  border-color: #FFD60A;
  background: linear-gradient(135deg, rgba(255, 214, 10, 0.10), rgba(255, 214, 10, 0.18));
  box-shadow:
    0 0 0 3px rgba(255, 214, 10, 0.18),
    0 4px 16px rgba(255, 214, 10, 0.20);
}

:root[data-theme='dark'] .neo-radio-card.type-menu.is-active,
.dark .neo-radio-card.type-menu.is-active {
  border-color: #34C759;
  background: linear-gradient(135deg, rgba(52, 199, 89, 0.10), rgba(52, 199, 89, 0.18));
  box-shadow:
    0 0 0 3px rgba(52, 199, 89, 0.18),
    0 4px 16px rgba(52, 199, 89, 0.20);
}

:root[data-theme='dark'] .neo-radio-card.type-btn.is-active,
.dark .neo-radio-card.type-btn.is-active {
  border-color: #FF453A;
  background: linear-gradient(135deg, rgba(255, 69, 58, 0.10), rgba(255, 69, 58, 0.18));
  box-shadow:
    0 0 0 3px rgba(255, 69, 58, 0.18),
    0 4px 16px rgba(255, 69, 58, 0.20);
}

.neo-radio-card.is-active:hover {
  transform: translateY(-2px);
}

.neo-radio-card.type-dir.is-active:hover {
  box-shadow:
    0 0 0 3px rgba(255, 214, 10, 0.15),
    0 6px 20px rgba(255, 214, 10, 0.20);
}

.neo-radio-card.type-menu.is-active:hover {
  box-shadow:
    0 0 0 3px rgba(52, 199, 89, 0.15),
    0 6px 20px rgba(52, 199, 89, 0.20);
}

.neo-radio-card.type-btn.is-active:hover {
  box-shadow:
    0 0 0 3px rgba(255, 69, 58, 0.15),
    0 6px 20px rgba(255, 69, 58, 0.20);
}
.radio-icon {
  font-size: 16px;
  transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.neo-radio-card.is-active .radio-icon {
  transform: scale(1.15);
}
.hidden-radio { display: none; }
.text-gold { color: #FFD60A; }
.text-green { color: #34C759; }
.text-red { color: #FF453A; }

/* 状态 Switch 美化 */
.neo-switch-wrapper { display: flex; align-items: center; gap: 10px; height: 42px; }
.switch-label { font-size: 13px; font-weight: 500; color: var(--text-muted); transition: color 0.3s; }
.switch-label.active { color: #34C759; }
.switch-label.inactive { color: var(--text-muted); }
:deep(.apple-native-switch.ant-switch-checked) { background: #34C759 !important; }

/* ================= TreeSelect 树选择器样式 ================= */
:deep(.neo-tree-select .ant-select-selector) {
  border-radius: 10px !important;
  border: 1.5px solid rgba(0, 0, 0, 0.12) !important;
  background: var(--input-bg) !important;
  padding: 4px 12px !important;
  height: auto !important;
  min-height: 40px;
  font-size: 14px;
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
}
:root[data-theme='dark'] :deep(.neo-tree-select .ant-select-selector),
.dark :deep(.neo-tree-select .ant-select-selector) {
  border-color: rgba(255, 255, 255, 0.12) !important;
  background: rgba(255, 255, 255, 0.05) !important;
}
:deep(.neo-tree-select.ant-select-focused .ant-select-selector),
:deep(.neo-tree-select:hover .ant-select-selector) {
  border-color: var(--apple-blue) !important;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--apple-blue) 12%, transparent) !important;
}
:deep(.neo-tree-select .ant-select-selection-placeholder) {
  color: var(--text-muted, #8e8e93);
  font-size: 14px;
}
:deep(.neo-tree-select .ant-select-selection-item) {
  font-size: 14px;
  color: var(--text-main);
}

/* TreeSelect 节点内容布局 */
.tree-node-content {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  line-height: 1.5;
}
.tree-node-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  font-size: 14px;
  flex-shrink: 0;
  color: var(--apple-blue);
  opacity: 0.85;
}
.tree-node-icon .default-icon {
  color: var(--text-muted, #8e8e93);
  font-size: 13px;
  opacity: 0.6;
}
.tree-node-icon .svg-icon-inline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
}
.tree-node-icon .svg-icon-inline :deep(svg) {
  width: 14px;
  height: 14px;
  vertical-align: middle;
}
.tree-node-icon .svg-icon-inline :deep(svg),
.tree-node-icon .svg-icon-inline :deep(svg path) {
  fill: currentColor !important;
}

.tree-node-label {
  font-size: 14px;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 图标选择器表单项 - 独占整行 */
.icon-picker-form-item {
  margin-top: 4px;
}
.icon-picker-form-item :deep(.ant-form-item-label) {
  font-weight: 500;
}
.icon-picker-form-item :deep(.icon-picker) {
  margin-top: 2px;
}

/* ================= 表格图标列 SVG 渲染 ================= */
.icon-cell-svg {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
}
.icon-cell-svg :deep(svg) {
  width: 16px;
  height: 16px;
  fill: currentColor;
}
.icon-cell-svg :deep(svg path) {
  fill: currentColor;
}

/* ================= 拖拽排序样式 — Apple 设计语言 ================= */

/*
  设计理念：
  - 握柄是「空气」—— 无容器、无背景、无描边，仅凭颜色叙事
  - 静默 → 现身 → 蓝色 三段渐进，蓝色 = 交互进行中（Apple 系统蓝）
  - 数字使用 SF 字体特征：等宽数字、微紧缩字距
  - 唯一的形变留给最重要的时刻：拖拽中微压缩
*/

/* 排序数字 */
.sort-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 500;
  font-feature-settings: "tnum";
  letter-spacing: -0.01em;
  color: rgba(60, 60, 67, 0.50);
}

.dark .sort-badge {
  color: rgba(235, 235, 245, 0.42);
}

/* 握柄 — 无形容器，图标即本体 */
.drag-handle {
  cursor: grab;
  display: inline-flex;
  align-items: center;
  user-select: none;
}

.drag-handle:active {
  cursor: grabbing;
}

/* 握柄图标 — 纯颜色驱动三段叙事 */
.drag-icon {
  display: block;
  font-size: 12px;
  color: rgba(60, 60, 67, 0.22);
  transition: color 0.15s ease, transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
}

/* 第一段：行 hover — 图标轻现身 */
:deep(.ant-table-row):hover .drag-icon {
  color: rgba(60, 60, 67, 0.40);
}

/* 第二段：握柄 hover — 明确可交互 */
.drag-handle:hover .drag-icon {
  color: rgba(60, 60, 67, 0.65);
}

/* 第三段：拖拽中 — Apple 系统蓝 + 微压缩反馈 */
.drag-handle:active .drag-icon {
  color: #007AFF;
  transform: scale(0.88);
}

/* ── 暗黑模式 ── */
.dark .drag-icon {
  color: rgba(235, 235, 245, 0.18);
}

.dark :deep(.ant-table-row):hover .drag-icon {
  color: rgba(235, 235, 245, 0.36);
}

.dark .drag-handle:hover .drag-icon {
  color: rgba(235, 235, 245, 0.60);
}

.dark .drag-handle:active .drag-icon {
  color: #0A84FF;
}

/* 拖拽 ghost 行 — 褪色不染色 */
:deep(.sortable-ghost) {
  opacity: 0.28;
  background: transparent !important;
}
:deep(.sortable-ghost > td) {
  background: transparent !important;
}

/* 拖拽选中行 — 卡片浮起 */
:deep(.sortable-chosen) {
  opacity: 1;
  background: rgba(0, 0, 0, 0.015) !important;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
}
:deep(.sortable-chosen > td) {
  background: rgba(0, 0, 0, 0.015) !important;
}

.dark :deep(.sortable-chosen) {
  background: rgba(255, 255, 255, 0.03) !important;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.30);
}
.dark :deep(.sortable-chosen > td) {
  background: rgba(255, 255, 255, 0.03) !important;
}
</style>

<!-- TreeSelect 下拉弹出层样式（非 scoped，因为 popup 渲染在 body 下） -->
<style>
.neo-tree-select-dropdown {
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06) !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  overflow: hidden;
  padding: 6px !important;
}
:root[data-theme='dark'] .neo-tree-select-dropdown,
.dark .neo-tree-select-dropdown {
  background: var(--content-bg, #1c1c1e) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.35) !important;
}

/* 下拉滚动条 */
.neo-tree-select-dropdown .ant-select-tree-list-holder::-webkit-scrollbar {
  width: 5px;
}
.neo-tree-select-dropdown .ant-select-tree-list-holder::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4px;
}
.neo-tree-select-dropdown .ant-select-tree-list-holder::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 4px;
}
.neo-tree-select-dropdown .ant-select-tree-list-holder::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.25);
}
:root[data-theme='dark'] .neo-tree-select-dropdown .ant-select-tree-list-holder::-webkit-scrollbar-thumb,
.dark .neo-tree-select-dropdown .ant-select-tree-list-holder::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
}
:root[data-theme='dark'] .neo-tree-select-dropdown .ant-select-tree-list-holder::-webkit-scrollbar-thumb:hover,
.dark .neo-tree-select-dropdown .ant-select-tree-list-holder::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* 树节点基础样式 */
.neo-tree-select-dropdown .ant-select-tree-treenode {
  border-radius: 8px;
  padding: 3px 6px !important;
  margin: 1px 0;
  transition: all 0.15s ease;
}

/* Hover 态 */
.neo-tree-select-dropdown .ant-select-tree-node-content-wrapper {
  border-radius: 6px !important;
  padding: 2px 6px !important;
  transition: all 0.15s ease;
}
.neo-tree-select-dropdown .ant-select-tree-node-content-wrapper:hover {
  background: rgba(0, 0, 0, 0.04) !important;
}
:root[data-theme='dark'] .neo-tree-select-dropdown .ant-select-tree-node-content-wrapper:hover,
.dark .neo-tree-select-dropdown .ant-select-tree-node-content-wrapper:hover {
  background: rgba(255, 255, 255, 0.06) !important;
}

/* 选中态 */
.neo-tree-select-dropdown .ant-select-tree-treenode-selected {
  position: relative;
  background: transparent !important;
}
.neo-tree-select-dropdown .ant-select-tree-treenode-selected .ant-select-tree-node-content-wrapper {
  background: color-mix(in srgb, var(--apple-blue) 8%, transparent) !important;
  font-weight: 600;
  color: var(--apple-blue) !important;
  border-radius: 6px;
}
/* 左侧强调色条 */
.neo-tree-select-dropdown .ant-select-tree-treenode-selected::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 55%;
  background: var(--apple-blue);
  border-radius: 2px;
  opacity: 0;
  animation: accentSlideIn 0.2s ease forwards;
}
@keyframes accentSlideIn {
  from { opacity: 0; height: 0; }
  to { opacity: 1; height: 55%; }
}

/* 暗黑模式选中态 */
:root[data-theme='dark'] .neo-tree-select-dropdown .ant-select-tree-treenode-selected .ant-select-tree-node-content-wrapper,
.dark .neo-tree-select-dropdown .ant-select-tree-treenode-selected .ant-select-tree-node-content-wrapper {
  background: color-mix(in srgb, var(--apple-blue) 14%, transparent) !important;
  color: var(--apple-blue) !important;
}

/* 展开图标美化 */
.neo-tree-select-dropdown .ant-select-tree-switcher {
  color: var(--text-muted, #8e8e93);
  transition: color 0.2s;
}
.neo-tree-select-dropdown .ant-select-tree-switcher:hover {
  color: var(--apple-blue);
}

/* 节点图标在 popup 中的样式 */
.neo-tree-select-dropdown .tree-node-content {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.neo-tree-select-dropdown .tree-node-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  font-size: 14px;
  flex-shrink: 0;
  color: var(--apple-blue);
  opacity: 0.85;
}
.neo-tree-select-dropdown .tree-node-icon .default-icon {
  color: var(--text-muted, #8e8e93);
  font-size: 13px;
  opacity: 0.6;
}
.neo-tree-select-dropdown .tree-node-icon .svg-icon-inline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
}
.neo-tree-select-dropdown .tree-node-icon .svg-icon-inline svg {
  width: 14px;
  height: 14px;
  vertical-align: middle;
}
.neo-tree-select-dropdown .tree-node-icon .svg-icon-inline svg,
.neo-tree-select-dropdown .tree-node-icon .svg-icon-inline svg path {
  fill: currentColor !important;
}
.neo-tree-select-dropdown .tree-node-label {
  font-size: 14px;
  color: var(--text-main);
}
:root[data-theme='dark'] .neo-tree-select-dropdown .tree-node-label,
.dark .neo-tree-select-dropdown .tree-node-label {
  color: var(--text-main, #f5f5f7);
}

/* 选中节点中的图标颜色增强 */
.neo-tree-select-dropdown .ant-select-tree-treenode-selected .tree-node-icon {
  opacity: 1;
  color: var(--apple-blue);
}
.neo-tree-select-dropdown .ant-select-tree-treenode-selected .tree-node-label {
  color: var(--apple-blue) !important;
}
</style>

<!-- Teleport 弹窗样式 (非 scoped) -->
<style>
/* 删除结果弹窗 */
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

.result-list {
  padding: 4px 24px 16px;
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
  padding: 10px 12px;
  border-radius: 10px;
  transition: background 0.2s;
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

.result-footer {
  padding: 12px 24px 20px;
  display: flex;
  justify-content: center;
  gap: 12px;
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

.dark .result-item.item-fail {
  background: rgba(255, 59, 48, 0.1);
}
</style>