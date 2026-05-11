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
      >
        <template #bodyCell="{ column, record }">

          <!-- 菜单名称列 (带展开图标缩进) -->
          <template v-if="column.key === 'menuName'">
            <span class="cell-primary-text">{{ record.menuName }}</span>
          </template>

          <!-- 图标列 -->
          <template v-if="column.key === 'icon'">
            <div class="icon-cell-box">
              <font-awesome-icon
                  v-if="record.icon"
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
            <span class="sort-badge">{{ record.sort }}</span>
          </template>

          <!-- 状态列 (带光晕的指示器) -->
          <template v-if="column.key === 'status'">
            <div class="status-indicator-wrap" :class="record.status === 1 ? 'is-active' : 'is-inactive'">
              <div class="status-dot"></div>
              <span>{{ record.status === 1 ? '启用' : '禁用' }}</span>
            </div>
          </template>

          <!-- 操作列 -->
          <template v-if="column.key === 'action'">
            <div class="action-btn-group">
              <button
                  class="text-action-btn safe"
                  v-permission="'system:menu:add'"
                  v-if="record.menuType !== 3"
                  @click="handleAdd(record.id)"
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
        :width="640"
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
            show-search
            tree-default-expand-all
            tree-node-filter-prop="menuName"
            class="neo-tree-select"
        />
      </a-form-item>

      <a-form-item label="菜单类型" name="menuType">
        <div class="neo-radio-group">
          <label class="neo-radio-card" :class="{ 'is-active': formState.menuType === 1 }">
            <input type="radio" v-model="formState.menuType" :value="1" class="hidden-radio" />
            <div class="radio-icon text-blue"><font-awesome-icon :icon="['fas', 'folder']" /></div>
            <span>目录</span>
          </label>
          <label class="neo-radio-card" :class="{ 'is-active': formState.menuType === 2 }">
            <input type="radio" v-model="formState.menuType" :value="2" class="hidden-radio" />
            <div class="radio-icon text-green"><font-awesome-icon :icon="['fas', 'file-alt']" /></div>
            <span>菜单</span>
          </label>
          <label class="neo-radio-card" :class="{ 'is-active': formState.menuType === 3 }">
            <input type="radio" v-model="formState.menuType" :value="3" class="hidden-radio" />
            <div class="radio-icon text-orange"><font-awesome-icon :icon="['fas', 'hand-pointer']" /></div>
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
      </div>

      <div class="form-grid">
        <a-form-item v-if="formState.menuType === 2" name="component">
          <template #label>
            组件路径
            <a-tooltip title="访问的视图组件路径，如：`system/user/index`">
              <font-awesome-icon :icon="['fas', 'info-circle']" class="help-icon" />
            </a-tooltip>
          </template>
          <a-input v-model:value="formState.component" placeholder="如：system/user/index" />
        </a-form-item>

        <a-form-item v-if="formState.menuType === 3" name="permission">
          <template #label>
            权限标识
            <a-tooltip title="权限控制字符，如：`system:user:add`">
              <font-awesome-icon :icon="['fas', 'info-circle']" class="help-icon" />
            </a-tooltip>
          </template>
          <a-input v-model:value="formState.permission" placeholder="如：system:user:add" />
        </a-form-item>

        <a-form-item v-if="formState.menuType !== 3" label="菜单图标" name="icon">
          <a-input v-model:value="formState.icon" placeholder="如：fa-solid fa-user">
            <template #prefix>
              <font-awesome-icon
                  v-if="formState.icon"
                  :icon="formatFaIcon(formState.icon)"
                  style="color: var(--apple-blue); font-size: 14px; margin-right: 4px;"
              />
              <font-awesome-icon v-else :icon="['fas', 'icons']" class="text-placeholder" style="margin-right: 4px;" />
            </template>
          </a-input>
        </a-form-item>
      </div>

      <div class="form-grid">
        <a-form-item label="显示排序" name="sort">
          <a-input-number v-model:value="formState.sort" :min="0" :max="9999" style="width: 100%" placeholder="数值越小越靠前" />
        </a-form-item>

        <a-form-item label="菜单状态" name="status">
          <div class="neo-switch-wrapper">
            <span class="switch-label" :class="{ 'active': formState.status === 1 }">启用</span>
            <a-switch
                v-model:checked="formState.status"
                :checked-value="1"
                :un-checked-value="0"
                class="apple-native-switch"
            />
            <span class="switch-label" :class="{ 'inactive': formState.status === 0 }">停用</span>
          </div>
        </a-form-item>
      </div>
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

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { getMenuList, addMenu, updateMenu, deleteMenu } from '@/api/menu.ts'
import type { SysMenu } from '@/types'
import type { FormInstance, Rule } from 'ant-design-vue/es/form'
import NeoFormModal from '@/components/common/NeoFormModal.vue'
import AppleConfirmModal from '@/components/common/AppleConfirmModal.vue'
import { AppleAlert } from '@/components/common/AppleAlert.ts'

// --- 表格列定义 ---
const columns = [
  { title: '菜单名称', dataIndex: 'menuName', key: 'menuName', align: 'left', width: 220 },
  { title: '图标', dataIndex: 'icon', key: 'icon', align: 'center', width: 80 },
  { title: '类型', dataIndex: 'menuType', key: 'menuType', align: 'center', width: 100 },
  { title: '路由/组件路径', dataIndex: 'path', key: 'path', ellipsis: true },
  { title: '权限标识', dataIndex: 'permission', key: 'permission', ellipsis: true },
  { title: '排序', dataIndex: 'sort', key: 'sort', align: 'center', width: 80 },
  { title: '状态', dataIndex: 'status', key: 'status', align: 'center', width: 100 },
  { title: '操作', key: 'action', align: 'center', width: 220 } // 设置操作列表头居中
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

// --- 状态与数据 ---
const loading = ref(false)
const tableData = ref<SysMenu[]>([])
const menuTreeOptions = computed(() => [{ id: '0', menuName: '顶级菜单', children: tableData.value }])

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

const confirmDelete = (id: string) => {
  deleteTargetId.value = id
  deleteConfirmVisible.value = true
}

const executeDelete = async () => {
  if (!deleteTargetId.value) return
  deleteConfirmLoading.value = true
  try {
    await deleteMenu(deleteTargetId.value)
    AppleAlert.success('删除成功', '菜单项及其子项已移除')
    fetchData()
  } catch (error: any) {
    AppleAlert.error('删除失败', error.message || '操作未完成')
  } finally {
    deleteConfirmLoading.value = false
    deleteConfirmVisible.value = false
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

const handleAdd = (parentId = '0') => {
  Object.assign(formState, {
    id: undefined, parentId, menuName: '', menuType: 1,
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
    fetchData()
  } catch (error: any) {
    // 验证失败不处理，子组件已有提示
  } finally {
    submitLoading.value = false
  }
}

onMounted(() => fetchData())
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
  border: 1px solid var(--border-color);
  background: var(--content-bg);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  color: var(--text-muted);
  font-weight: 500;
  font-size: 14px;
  position: relative;
  user-select: none;
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
  border-color: var(--apple-blue);
  background: linear-gradient(135deg, color-mix(in srgb, var(--apple-blue) 6%, transparent), color-mix(in srgb, var(--apple-blue) 14%, transparent));
  color: var(--text-main);
  font-weight: 600;
  transform: translateY(-1px);
  box-shadow:
    0 0 0 1.5px var(--apple-blue),
    0 0 0 4px color-mix(in srgb, var(--apple-blue) 12%, transparent),
    0 4px 16px color-mix(in srgb, var(--apple-blue) 15%, transparent);
}
.neo-radio-card.is-active:hover {
  transform: translateY(-2px);
  box-shadow:
    0 0 0 1.5px var(--apple-blue),
    0 0 0 4px color-mix(in srgb, var(--apple-blue) 15%, transparent),
    0 6px 20px color-mix(in srgb, var(--apple-blue) 20%, transparent);
}
.radio-icon {
  font-size: 16px;
  transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.neo-radio-card.is-active .radio-icon {
  transform: scale(1.15);
}
.hidden-radio { display: none; }
.text-blue { color: var(--apple-blue); }
.text-green { color: #34C759; }
.text-orange { color: #FF9F0A; }

/* 状态 Switch 美化 */
.neo-switch-wrapper { display: flex; align-items: center; gap: 10px; height: 42px; }
.switch-label { font-size: 13px; font-weight: 500; color: var(--text-muted); transition: color 0.3s; }
.switch-label.active { color: #34C759; }
.switch-label.inactive { color: var(--text-muted); }
:deep(.apple-native-switch.ant-switch-checked) { background: #34C759 !important; }

/* 树选择器兼容 */
:deep(.neo-tree-select .ant-select-selector) { border-radius: 10px !important; }
</style>