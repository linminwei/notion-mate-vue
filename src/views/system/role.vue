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
        <button class="neo-icon-btn" @click="fetchData" title="刷新数据">
          <font-awesome-icon :icon="['fas', 'sync-alt']" :class="{ 'fa-spin': loading }" />
        </button>

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

          <!-- 排序列 -->
          <template v-if="column.key === 'sort'">
            <span class="sort-badge">{{ record.sort }}</span>
          </template>

          <!-- 状态列 -->
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
          <a-input v-model:value="formState.roleCode" placeholder="请输入角色编码" />
        </a-form-item>
        <a-form-item label="角色名称" name="roleName">
          <a-input v-model:value="formState.roleName" placeholder="请输入角色名称" />
        </a-form-item>
      </div>
      <div class="form-grid">
        <a-form-item label="排序" name="sort">
          <a-input-number v-model:value="formState.sort" :min="0" style="width: 100%" placeholder="数值越小越靠前" />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-radio-group v-model:value="formState.status">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
      </div>
      <a-form-item label="菜单权限" name="menuIds">
        <a-tree v-model:checkedKeys="formState.menuIds" :tree-data="menuTreeData" checkable :field-names="{ title: 'menuName', key: 'id' }" />
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-textarea v-model:value="formState.remark" placeholder="请输入备注" :rows="3" />
      </a-form-item>
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

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { getRolePage, addRole, updateRole, deleteRole } from '@/api/role.ts'
import { getMenuList } from '@/api/menu.ts'
import { getDictDataByDictCode } from '@/api/dict'
import type { SysRole, SysMenu, DictData } from '@/types'
import type { Rule } from 'ant-design-vue/es/form'
import NeoFormModal from '@/components/common/NeoFormModal.vue'
import AppleConfirmModal from '@/components/common/AppleConfirmModal.vue'
import { AppleAlert } from '@/components/common/AppleAlert.ts'

// --- 表格列定义 ---
const columns = [
  { title: '角色编码', dataIndex: 'roleCode', key: 'roleCode' },
  { title: '角色名称', dataIndex: 'roleName', key: 'roleName' },
  { title: '排序', dataIndex: 'sort', key: 'sort', align: 'center', width: 80 },
  { title: '状态', dataIndex: 'status', key: 'status', align: 'center', width: 100 },
  { title: '操作', key: 'action', align: 'center', width: 180 }
]

// --- 状态与数据 ---
const loading = ref(false)
const tableData = ref<SysRole[]>([])
const menuTreeData = ref<SysMenu[]>([])
const commonStatusDict = ref<DictData[]>([])

const searchForm = reactive({ roleName: '', status: undefined as number | undefined, pageNum: 1, pageSize: 10 })
const pagination = reactive({ current: 1, pageSize: 10, total: 0, showTotal: (total: number) => `共 ${total} 条` })

// --- 弹窗与表单 (NeoFormModal) ---
const modalVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref<InstanceType<typeof NeoFormModal>>()
const formState = reactive<Partial<SysRole>>({ id: undefined, roleCode: '', roleName: '', sort: 0, status: 1, menuIds: [], remark: '' })
const modalTitle = computed(() => formState.id ? '编辑角色配置' : '新增角色')

const rules: Record<string, Rule[]> = {
  roleCode: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
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
    await deleteRole(deleteTargetId.value)
    AppleAlert.success('删除成功', '角色已从系统移除')
    fetchData()
  } catch (error: any) {
    AppleAlert.error('删除失败', error.message || '操作未完成')
  } finally {
    deleteConfirmLoading.value = false
    deleteConfirmVisible.value = false
  }
}

// --- 工具方法 ---
const buildMenuTree = (menus: SysMenu[], parentId = '0'): SysMenu[] => {
  return menus.filter(m => m.parentId === parentId).map(m => ({ ...m, children: buildMenuTree(menus, m.id) }))
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

const fetchMenus = async () => {
  try {
    const res = await getMenuList()
    menuTreeData.value = buildMenuTree(res.data)
  } catch (error: any) {
    AppleAlert.error('菜单加载失败', error.message || '无法获取菜单数据')
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
  Object.assign(formState, { id: undefined, roleCode: '', roleName: '', sort: 0, status: 1, menuIds: [], remark: '' })
  modalVisible.value = true
}

const handleEdit = (record: SysRole) => {
  Object.assign(formState, JSON.parse(JSON.stringify(record)))
  modalVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    submitLoading.value = true
    if (formState.id) {
      await updateRole(formState)
      AppleAlert.success('保存成功', '角色配置已更新')
    } else {
      await addRole(formState)
      AppleAlert.success('创建成功', '新角色已添加到系统')
    }
    modalVisible.value = false
    fetchData()
  } catch (error: any) {
    // 验证失败不处理，子组件已有提示
  } finally {
    submitLoading.value = false
  }
}

onMounted(() => { fetchData(); fetchMenus(); fetchCommonStatus() })
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
  min-width: 360px;
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
</style>
