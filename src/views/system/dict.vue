<template>
  <div class="neo-dict-container">

    <!-- ================= 左侧：字典目录 ================= -->
    <aside class="neo-sidebar">
      <div class="sidebar-header">
        <h2 class="sidebar-title">
          字典目录
          <a-tooltip title="支持按住 Shift 连选，或按住 Cmd/Ctrl 自由多选" placement="right" :overlayClassName="tooltipClass">
            <info-circle-outlined class="title-hint-icon" />
          </a-tooltip>
        </h2>
        <div class="sidebar-actions">
          <a-tooltip title="新增字典类型" placement="bottom" :overlayClassName="tooltipClass">
            <button class="icon-btn" v-permission="'system:dict:add'" @click="handleAddType">
              <plus-outlined />
            </button>
          </a-tooltip>
          <a-tooltip title="删除选中类型" placement="bottom" :overlayClassName="tooltipClass">
            <a-popconfirm title="确定删除选中的字典类型吗？" @confirm="handleDeleteType">
              <button class="icon-btn danger" v-permission="'system:dict:delete'" :disabled="selectedTypeKeys.length === 0">
                <delete-outlined />
              </button>
            </a-popconfirm>
          </a-tooltip>
        </div>
      </div>

      <!-- 胶囊搜索栏 -->
      <div class="sidebar-search-wrapper">
        <div class="capsule-search">
          <div class="search-inputs">
            <input type="text" v-model="typeSearchForm.dictName" placeholder="搜索名称" @keyup.enter="handleTypeSearch" />
            <div class="divider"></div>
            <input type="text" v-model="typeSearchForm.dictCode" placeholder="搜索编码" @keyup.enter="handleTypeSearch" />
          </div>
          <button class="search-trigger" @click="handleTypeSearch">
            <search-outlined />
          </button>
        </div>
      </div>

      <!-- 列表区 -->
      <div class="sidebar-list-container">
        <a-spin :spinning="typeLoading">
          <div class="neo-list">
            <div
                v-for="(item, index) in typeList"
                :key="item.id"
                class="neo-list-item"
                :class="{ 'is-active': selectedTypeKeys.includes(item.id) }"
                @click="handleTypeRowClick(item, index, $event)"
            >
              <div class="item-content">
                <div class="item-title">{{ item.dictName }}</div>
                <div class="item-subtitle">{{ item.dictCode }}</div>
              </div>

              <div class="item-tail">
                <div class="status-indicator" :class="item.status === 1 ? 'online' : 'offline'"></div>
                <button class="edit-hover-btn" v-permission="'system:dict:edit'" @click.stop="handleEditType(item)">
                  <edit-outlined />
                </button>
              </div>
            </div>

            <div v-if="typeList.length === 0 && !typeLoading" class="empty-list">
              <inbox-outlined class="empty-icon" />
              <span>暂无字典类型</span>
            </div>
          </div>
        </a-spin>
      </div>

      <!-- 底部精简分页 -->
      <div class="sidebar-footer">
        <a-pagination
            v-model:current="typePagination.current"
            :total="typePagination.total"
            :pageSize="typePagination.pageSize"
            size="small"
            :showSizeChanger="false"
            :showTotal="(total) => `共 ${total} 项`"
            @change="handleTypePageChange"
        />
      </div>
    </aside>

    <!-- ================= 右侧：数据工作区 ================= -->
    <main class="neo-main">

      <!-- 未选择 / 多选时的占位界面 -->
      <div v-if="!currentType" class="neo-empty-state">
        <div class="empty-glass-card">
          <book-outlined class="huge-icon" />
          <template v-if="selectedTypeKeys.length > 1">
            <h3>已选择 {{ selectedTypeKeys.length }} 个字典类型</h3>
            <p>您可以对选中的字典类型进行批量操作（如删除）。</p>
          </template>
          <template v-else>
            <h3>字典数据中心</h3>
            <p>请在左侧选择一个字典目录，以查看和管理其详细数据配置。</p>
            <div class="keyboard-hint">
              <info-circle-outlined />
              支持按住 <kbd class="neo-keycap">Shift</kbd> 或 <kbd class="neo-keycap">Cmd / Ctrl</kbd> 多选左侧目录
            </div>
          </template>
        </div>
      </div>

      <!-- 已选择且唯一：数据明细 -->
      <div v-else class="neo-data-view fade-in">
        <header class="data-header">
          <div class="header-info">
            <h1>{{ currentType.dictName }}</h1>
            <span class="code-badge">{{ currentType.dictCode }}</span>
          </div>
          <div class="header-actions">
            <a-button class="neo-btn primary" v-permission="'system:dict:add'" @click="handleAddData">
              <plus-outlined /> 新增数据项
            </a-button>
            <a-popconfirm title="确定批量删除选中的数据吗？" @confirm="handleBatchDeleteData">
              <a-button class="neo-btn danger-ghost" v-permission="'system:dict:delete'" :disabled="selectedDataKeys.length === 0">
                <delete-outlined /> 批量删除
              </a-button>
            </a-popconfirm>
          </div>
        </header>

        <!-- 过滤工具栏 -->
        <div class="data-toolbar">
          <div class="filter-group">
            <div class="neo-input-wrap">
              <tag-outlined class="prefix-icon" />
              <input type="text" v-model="dataSearchForm.dictLabel" placeholder="字典标签" @keyup.enter="handleDataSearch" />
            </div>
            <div class="neo-input-wrap">
              <barcode-outlined class="prefix-icon" />
              <input type="text" v-model="dataSearchForm.dictValue" placeholder="字典键值" @keyup.enter="handleDataSearch" />
            </div>
            <div class="neo-select-wrap">
              <a-select v-model:value="dataSearchForm.status" placeholder="状态" :bordered="false" class="transparent-select">
                <a-select-option :value="1">启用</a-select-option>
                <a-select-option :value="0">禁用</a-select-option>
              </a-select>
            </div>
            <button class="neo-icon-btn" @click="handleDataSearch" title="搜索"><search-outlined /></button>
            <button class="neo-icon-btn secondary" @click="handleDataReset" title="重置"><redo-outlined /></button>
          </div>
        </div>

        <!-- 表格主体 -->
        <div class="data-table-wrapper">
          <a-table
              class="neo-table"
              :columns="dataColumns"
              :data-source="dataList"
              :loading="dataLoading"
              :pagination="dataPagination"
              :row-selection="{ selectedRowKeys: selectedDataKeys, onChange: onDataSelectChange }"
              row-key="id"
              @change="handleDataTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'dictLabel'">
                <span class="cell-label">{{ record.dictLabel }}</span>
              </template>
              <template v-if="column.key === 'dictValue'">
                <span class="cell-value">{{ record.dictValue }}</span>
              </template>
              <template v-if="column.key === 'sort'">
                <span class="cell-sort">{{ record.sort }}</span>
              </template>
              <template v-if="column.key === 'status'">
                <div class="cell-status" :class="record.status === 1 ? 'active' : 'inactive'">
                  {{ record.status === 1 ? '启用' : '禁用' }}
                </div>
              </template>
              <template v-if="column.key === 'action'">
                <button class="text-action-btn" v-permission="'system:dict:edit'" @click="handleEditData(record)">编辑</button>
              </template>
            </template>
          </a-table>
        </div>
      </div>
    </main>

    <!-- ================= 弹窗区域 ================= -->
    <!-- 字典类型弹窗 -->
    <a-modal wrap-class-name="neo-modal" v-model:open="typeModalVisible" :title="typeModalTitle" :confirm-loading="typeSubmitLoading" @ok="handleTypeSubmit">
      <a-form ref="typeFormRef" :model="typeFormState" :rules="typeRules" layout="vertical" class="neo-form">
        <a-form-item label="字典编码" name="dictCode">
          <a-input v-model:value="typeFormState.dictCode" placeholder="如：sys_user_sex" :disabled="!!typeFormState.id" />
        </a-form-item>
        <a-form-item label="字典名称" name="dictName">
          <a-input v-model:value="typeFormState.dictName" placeholder="如：用户性别" />
        </a-form-item>
        <a-form-item v-if="typeFormState.id" label="状态" name="status">
          <a-radio-group v-model:value="typeFormState.status" class="neo-radio-group">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="typeFormState.remark" placeholder="补充说明信息..." :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 字典数据弹窗 -->
    <a-modal wrap-class-name="neo-modal" v-model:open="dataModalVisible" :title="dataModalTitle" :confirm-loading="dataSubmitLoading" @ok="handleDataSubmit" width="560px">
      <a-form ref="dataFormRef" :model="dataFormState" :rules="dataRules" layout="vertical" class="neo-form">
        <div class="form-grid">
          <a-form-item label="字典类型" name="dictTypeId">
            <a-select v-model:value="dataFormState.dictTypeId" disabled>
              <a-select-option v-if="currentType" :value="currentType.id">{{ currentType.dictName }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="排序权重" name="sort">
            <a-input-number v-model:value="dataFormState.sort" :min="0" style="width: 100%" />
          </a-form-item>
        </div>

        <div class="form-grid">
          <a-form-item label="字典标签 (显示用)" name="dictLabel">
            <a-input v-model:value="dataFormState.dictLabel" placeholder="如：男" />
          </a-form-item>
          <a-form-item label="字典键值 (存储用)" name="dictValue">
            <a-input v-model:value="dataFormState.dictValue" placeholder="如：1" />
          </a-form-item>
        </div>

        <a-form-item v-if="dataFormState.id" label="状态" name="status">
          <a-radio-group v-model:value="dataFormState.status" class="neo-radio-group">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="备注说明" name="remark">
          <a-textarea v-model:value="dataFormState.remark" placeholder="补充说明..." :rows="2" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  SearchOutlined, RedoOutlined, PlusOutlined, DeleteOutlined,
  EditOutlined, BookOutlined, TagOutlined, BarcodeOutlined, InboxOutlined,
  InfoCircleOutlined
} from '@ant-design/icons-vue'
import {
  getDictTypePage, addDictType, updateDictType, deleteDictTypeBatch,
  getDictDataPage, addDictData, updateDictData, deleteDictDataBatch
} from '@/api/dict.ts'
import type { DictType, DictData } from '@/types'
import type { FormInstance, Rule } from 'ant-design-vue/es/form'
import { AppleAlert } from '@/components/common/AppleAlert.ts'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

// 动态计算 Tooltip 的主题类名
const tooltipClass = computed(() => `neo-tooltip ${appStore.isDark ? 'tooltip-dark' : 'tooltip-light'}`)

// ==================== 全局状态与类型管理 ====================
const typeLoading = ref(false)
const typeList = ref<DictType[]>([])
const currentType = ref<DictType | null>(null)

// 支持多选的列表记录集合
const selectedTypeKeys = ref<string[]>([])
const lastSelectedIndex = ref<number>(-1)

// 搜索与分页
const typeSearchForm = ref({ dictCode: '', dictName: '' })
const typePagination = ref({ current: 1, pageSize: 15, total: 0 })

// 表单弹窗控制
const typeModalVisible = ref(false)
const typeSubmitLoading = ref(false)
const typeFormRef = ref<FormInstance>()

// 对象解构防污染
const typeFormState = ref<Partial<DictType>>({})
const typeModalTitle = computed(() => typeFormState.value.id ? '编辑类型' : '新增类型')

const typeRules: Record<string, Rule[]> = {
  dictCode: [{ required: true, message: '必填', trigger: 'blur' }],
  dictName: [{ required: true, message: '必填', trigger: 'blur' }]
}

// ==================== 字典类型方法 ====================
const fetchTypeList = async () => {
  typeLoading.value = true
  try {
    const res = await getDictTypePage({
      pageNum: typePagination.value.current,
      pageSize: typePagination.value.pageSize,
      ...typeSearchForm.value
    })
    typeList.value = res.data.list
    typePagination.value.total = res.data.total
    lastSelectedIndex.value = -1 // 刷新列表时重置锚点索引
  } finally { typeLoading.value = false }
}

const handleTypeSearch = () => { typePagination.value.current = 1; fetchTypeList() }
const handleTypePageChange = (page: number) => { typePagination.value.current = page; fetchTypeList() }

// 原生系统级别的组合键多选逻辑
const handleTypeRowClick = (record: DictType, index: number, event: MouseEvent) => {
  if (event.shiftKey && lastSelectedIndex.value !== -1) {
    // 按住 Shift：连选模式
    const start = Math.min(lastSelectedIndex.value, index)
    const end = Math.max(lastSelectedIndex.value, index)
    const rangeKeys = typeList.value.slice(start, end + 1).map(t => t.id)

    if (event.metaKey || event.ctrlKey) {
      // 兼容 Command/Ctrl + Shift 追加连选
      const combined = new Set([...selectedTypeKeys.value, ...rangeKeys])
      selectedTypeKeys.value = Array.from(combined)
    } else {
      // 纯 Shift 直接覆盖为当前范围
      selectedTypeKeys.value = rangeKeys
    }
  } else if (event.metaKey || event.ctrlKey) {
    // 按住 Command/Ctrl：自由多选/反选
    const existingIndex = selectedTypeKeys.value.indexOf(record.id)
    if (existingIndex > -1) {
      selectedTypeKeys.value.splice(existingIndex, 1)
    } else {
      selectedTypeKeys.value.push(record.id)
    }
    lastSelectedIndex.value = index
  } else {
    // 普通点击：单选
    selectedTypeKeys.value = [record.id]
    lastSelectedIndex.value = index
  }

  // 右侧明细展示逻辑：仅且只仅当只选中 1 项时，才加载并展示右侧的数据
  if (selectedTypeKeys.value.length === 1) {
    const activeItem = typeList.value.find(t => t.id === selectedTypeKeys.value[0])
    if (currentType.value?.id !== activeItem?.id) {
      currentType.value = activeItem || null
      handleDataReset()
    }
  } else {
    currentType.value = null
    dataList.value = []
  }
}

const handleAddType = () => {
  typeFormState.value = { dictCode: '', dictName: '', remark: '' }
  typeModalVisible.value = true
}

const handleEditType = ({ id, dictCode, dictName, status, remark }: DictType) => {
  typeFormState.value = { id, dictCode, dictName, status, remark }
  typeModalVisible.value = true
}

const handleTypeSubmit = async () => {
  try {
    await typeFormRef.value?.validate()
    typeSubmitLoading.value = true
    if (typeFormState.value.id) {
      await updateDictType(typeFormState.value)
      AppleAlert.success('已保存')
    } else {
      await addDictType(typeFormState.value)
      AppleAlert.success('已创建')
    }
    typeModalVisible.value = false
    fetchTypeList()
  } catch (error) {} finally { typeSubmitLoading.value = false }
}

const handleDeleteType = async () => {
  if (selectedTypeKeys.value.length === 0) return
  await deleteDictTypeBatch(selectedTypeKeys.value)
  AppleAlert.success('已删除')
  // 清空视图与数据
  selectedTypeKeys.value = []
  currentType.value = null
  dataList.value = []
  fetchTypeList()
}

// ==================== 字典数据相关 ====================
const dataColumns = [
  { title: '标签名称', dataIndex: 'dictLabel', key: 'dictLabel' },
  { title: '存储键值', dataIndex: 'dictValue', key: 'dictValue' },
  { title: '排序', dataIndex: 'sort', key: 'sort', width: 80, align: 'center' as const },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100, align: 'center' as const },
  { title: '操作', key: 'action', width: 100, align: 'right' as const }
]

const dataLoading = ref(false)
const dataList = ref<DictData[]>([])
const selectedDataKeys = ref<string[]>([])

const dataSearchForm = ref({ dictLabel: '', dictValue: '', status: undefined as number | undefined })
const dataPagination = ref({ current: 1, pageSize: 10, total: 0 })

const dataModalVisible = ref(false)
const dataSubmitLoading = ref(false)
const dataFormRef = ref<FormInstance>()
const dataFormState = ref<Partial<DictData>>({})
const dataModalTitle = computed(() => dataFormState.value.id ? '编辑明细' : '新增明细')

const dataRules: Record<string, Rule[]> = {
  dictLabel: [{ required: true, message: '必填', trigger: 'blur' }],
  dictValue: [{ required: true, message: '必填', trigger: 'blur' }]
}

const fetchDataList = async () => {
  if (!currentType.value?.id) return
  dataLoading.value = true
  try {
    const res = await getDictDataPage({
      pageNum: dataPagination.value.current,
      pageSize: dataPagination.value.pageSize,
      ...dataSearchForm.value,
      dictTypeId: currentType.value.id
    })
    dataList.value = res.data.list
    dataPagination.value.total = res.data.total
  } finally { dataLoading.value = false }
}

const handleDataSearch = () => { dataPagination.value.current = 1; fetchDataList() }

const handleDataReset = () => {
  dataSearchForm.value = { dictLabel: '', dictValue: '', status: undefined }
  handleDataSearch()
}

const handleDataTableChange = (pag: any) => {
  dataPagination.value.current = pag.current || 1
  dataPagination.value.pageSize = pag.pageSize || 10
  fetchDataList()
}
const onDataSelectChange = (keys: any[]) => { selectedDataKeys.value = keys }

const handleAddData = () => {
  dataFormState.value = { dictTypeId: currentType.value?.id, dictLabel: '', dictValue: '', sort: 0, remark: '' }
  dataModalVisible.value = true
}

const handleEditData = ({ id, dictTypeId, dictLabel, dictValue, sort, status, remark }: DictData) => {
  dataFormState.value = { id, dictTypeId, dictLabel, dictValue, sort, status, remark }
  dataModalVisible.value = true
}

const handleDataSubmit = async () => {
  try {
    await dataFormRef.value?.validate()
    dataSubmitLoading.value = true
    if (dataFormState.value.id) {
      await updateDictData(dataFormState.value); AppleAlert.success('已保存')
    } else {
      await addDictData(dataFormState.value); AppleAlert.success('已创建')
    }
    dataModalVisible.value = false
    fetchDataList()
  } catch (error) {} finally { dataSubmitLoading.value = false }
}

const handleBatchDeleteData = async () => {
  await deleteDictDataBatch(selectedDataKeys.value)
  AppleAlert.success('已删除')
  selectedDataKeys.value = []
  fetchDataList()
}

onMounted(() => fetchTypeList())
</script>

<style scoped>
/* ================== 全局重构布局 ================== */
.neo-dict-container {
  display: flex;
  height: calc(100vh - 120px);
  min-height: 600px;
  gap: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* ================== 左侧导航 ================== */
.neo-sidebar {
  width: 340px;
  flex-shrink: 0;
  background: var(--content-bg, #ffffff);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--border-color, rgba(0,0,0,0.05));
  overflow: hidden;
  transition: all 0.3s ease;
}

.sidebar-header {
  height: 70px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sidebar-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: var(--text-main, #1d1d1f);
  display: flex;
  align-items: center;
}
.title-hint-icon {
  font-size: 14px;
  color: var(--text-muted, #a1a1aa);
  margin-left: 6px;
  font-weight: normal;
  cursor: help;
  transition: color 0.2s;
}
.title-hint-icon:hover {
  color: var(--apple-blue, #0A84FF);
}

.sidebar-actions { display: flex; gap: 8px; }
.icon-btn {
  width: 32px; height: 32px;
  border-radius: 10px; border: none;
  background: var(--hover-bg, #f5f5f7);
  color: var(--text-muted, #86868b);
  cursor: pointer; transition: all 0.2s;
  display: flex; align-items: center; justify-content: center;
}
.icon-btn:hover { background: rgba(10, 132, 255, 0.1); color: #0A84FF; }
.icon-btn.danger:hover { background: rgba(255, 69, 58, 0.1); color: #FF453A; }
.icon-btn:disabled { opacity: 0.4; cursor: not-allowed; background: transparent; }

/* 创新的胶囊搜索 */
.sidebar-search-wrapper { padding: 0 20px 16px; }
.capsule-search {
  display: flex;
  background: var(--hover-bg, #f5f5f7);
  border-radius: 14px;
  padding: 4px;
  border: 1px solid transparent;
  transition: all 0.3s;
}
.capsule-search:focus-within {
  background: transparent;
  border-color: #0A84FF;
  box-shadow: 0 0 0 4px rgba(10, 132, 255, 0.1);
}
.search-inputs {
  flex: 1; display: flex; align-items: center;
  padding: 0 8px;
}
.search-inputs input {
  flex: 1; width: 50%;
  border: none; background: transparent;
  font-size: 13px; color: var(--text-main);
  outline: none; padding: 6px 4px;
}
.search-inputs input::placeholder { color: var(--text-muted, #a1a1aa); }
.divider { width: 1px; height: 14px; background: var(--border-color, #e5e5ea); margin: 0 8px; }
.search-trigger {
  width: 32px; height: 32px;
  border: none; border-radius: 10px;
  background: #0A84FF; color: #fff;
  cursor: pointer; transition: all 0.2s;
  display: flex; align-items: center; justify-content: center;
}
.search-trigger:hover { background: #0071e3; transform: scale(0.95); }

/* 精美卡片列表 */
.sidebar-list-container {
  flex: 1; overflow-y: auto; padding: 0 16px;
}
.sidebar-list-container::-webkit-scrollbar { width: 4px; }
.sidebar-list-container::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }

.neo-list-item {
  display: flex; align-items: center;
  padding: 14px 16px;
  margin-bottom: 6px;
  border-radius: 14px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
  user-select: none; /* 防止按住 shift 时选中文本内容 */
}
.neo-list-item:hover {
  background: var(--hover-bg, #f5f5f7);
}
.neo-list-item.is-active {
  background: #0A84FF;
  box-shadow: 0 8px 20px rgba(10, 132, 255, 0.3);
}

.item-content { flex: 1; min-width: 0; padding-left: 0; }
.item-title { font-size: 14px; font-weight: 600; color: var(--text-main); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.item-subtitle { font-size: 12px; color: var(--text-muted); font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.neo-list-item.is-active .item-title { color: #fff; }
.neo-list-item.is-active .item-subtitle { color: rgba(255,255,255,0.7); }

.item-tail { display: flex; align-items: center; justify-content: flex-end; width: 30px; }
.status-indicator { width: 8px; height: 8px; border-radius: 50%; transition: all 0.3s; }
.status-indicator.online { background: #34C759; box-shadow: 0 0 8px rgba(52, 199, 89, 0.6); }
.status-indicator.offline { background: #FF453A; box-shadow: 0 0 8px rgba(255, 69, 58, 0.6); }
.neo-list-item.is-active .status-indicator { box-shadow: 0 0 0 2px rgba(255,255,255,0.3); }

.edit-hover-btn {
  position: absolute; right: 12px;
  background: var(--hover-bg, #e5e5ea);
  border: none; border-radius: 8px;
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-main); cursor: pointer;
  opacity: 0; transform: translateX(10px);
  transition: all 0.2s;
}
.neo-list-item:hover .edit-hover-btn { opacity: 1; transform: translateX(0); }
.neo-list-item.is-active .edit-hover-btn { background: rgba(255,255,255,0.2); color: #fff; }
.neo-list-item:hover .status-indicator { opacity: 0; }

.empty-list { display: flex; flex-direction: column; align-items: center; color: var(--text-muted); margin-top: 60px; font-size: 13px; }
.empty-icon { font-size: 32px; margin-bottom: 12px; opacity: 0.5; }

/* 字典目录侧边栏分页器优化：方块物理按键形态 */
.sidebar-footer {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--border-color, rgba(0,0,0,0.05));
  background: var(--hover-bg, rgba(0,0,0,0.01));
}
:deep(.sidebar-footer .ant-pagination) {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 !important;
}
:deep(.sidebar-footer .ant-pagination-total-text) {
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
  margin-right: auto;
}
:deep(.sidebar-footer .ant-pagination-item),
:deep(.sidebar-footer .ant-pagination-prev),
:deep(.sidebar-footer .ant-pagination-next),
:deep(.sidebar-footer .ant-pagination-jump-prev),
:deep(.sidebar-footer .ant-pagination-jump-next) {
  min-width: 30px !important;
  height: 30px !important;
  line-height: 28px !important;
  border-radius: 8px !important;
  background: var(--content-bg, #ffffff) !important;
  border: 1px solid var(--border-color, #e5e5ea) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin: 0 !important;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px var(--shadow-color, rgba(0,0,0,0.05));
}
:deep(.sidebar-footer .ant-pagination-item a),
:deep(.sidebar-footer .ant-pagination-prev .ant-pagination-item-link),
:deep(.sidebar-footer .ant-pagination-next .ant-pagination-item-link) {
  color: var(--text-main, #333) !important;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent !important;
  border: none !important;
}
:deep(.sidebar-footer .ant-pagination-item:hover),
:deep(.sidebar-footer .ant-pagination-prev:hover:not(.ant-pagination-disabled)),
:deep(.sidebar-footer .ant-pagination-next:hover:not(.ant-pagination-disabled)) {
  border-color: var(--apple-blue, #0A84FF) !important;
  color: var(--apple-blue, #0A84FF) !important;
}
:deep(.sidebar-footer .ant-pagination-item:hover a) { color: var(--apple-blue, #0A84FF) !important; }
:deep(.sidebar-footer .ant-pagination-item-active) {
  background: var(--apple-blue, #0A84FF) !important;
  border-color: var(--apple-blue, #0A84FF) !important;
}
:deep(.sidebar-footer .ant-pagination-item-active a) { color: #fff !important; }
:deep(.sidebar-footer .ant-pagination-disabled) {
  opacity: 0.4;
  cursor: not-allowed;
  background: var(--hover-bg, #f5f5f7) !important;
  box-shadow: none;
}

/* ================= 右侧主工作区 ================== */
.neo-main {
  flex: 1; min-width: 0;
  background: var(--content-bg, #ffffff);
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--border-color, rgba(0,0,0,0.05));
  display: flex; flex-direction: column;
  position: relative; overflow: hidden;
}

.neo-empty-state {
  position: absolute; width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  background: radial-gradient(circle at center, var(--hover-bg, #fcfcfc) 0%, transparent 100%);
}
.empty-glass-card {
  text-align: center; max-width: 380px;
  padding: 40px; border-radius: 24px;
}
.empty-glass-card .huge-icon { font-size: 64px; color: var(--apple-blue, #0A84FF); margin-bottom: 24px; filter: drop-shadow(0 10px 20px rgba(10, 132, 255, 0.2)); }
.empty-glass-card h3 { font-size: 20px; font-weight: 700; color: var(--text-main); margin-bottom: 12px; }
.empty-glass-card p { color: var(--text-muted); font-size: 14px; line-height: 1.6; }

/* 优雅的多选提示框 - 引入拟真键帽设计 */
.keyboard-hint {
  margin-top: 24px;
  padding: 12px 20px;
  background: var(--hover-bg, rgba(10, 132, 255, 0.05));
  border: 1px solid var(--border-color, rgba(10, 132, 255, 0.15));
  border-radius: 14px;
  color: var(--text-muted, #666);
  font-size: 13px;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  gap: 4px;
  animation: fadeIn 0.8s ease;
}

/* 拟物感物理键帽 UI */
kbd.neo-keycap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  margin: 0 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-main, #333);
  background: var(--content-bg, #ffffff);
  border: 1px solid var(--border-color, #d1d1d6);
  border-bottom-width: 3px; /* 增加底部厚度，看起来更像机械键盘的键帽 */
  border-radius: 6px;
  box-shadow: 0 1px 2px var(--shadow-color, rgba(0,0,0,0.05)), inset 0 -1px 1px rgba(0,0,0,0.05);
  letter-spacing: 0.5px;
  transform: translateY(-1px);
}

.neo-data-view { display: flex; flex-direction: column; height: 100%; }
.fade-in { animation: fadeIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* Header */
.data-header {
  padding: 32px 32px 24px;
  display: flex; justify-content: space-between; align-items: flex-end;
}
.header-info h1 { font-size: 28px; font-weight: 800; color: var(--text-main); margin: 0 0 8px 0; letter-spacing: -0.5px; }
.code-badge { font-family: monospace; font-size: 13px; color: var(--text-muted); background: var(--hover-bg, #f5f5f7); padding: 4px 10px; border-radius: 6px; }

.header-actions { display: flex; gap: 12px; }
.neo-btn { height: 38px; border-radius: 12px; padding: 0 16px; font-weight: 600; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s; }
.neo-btn.primary { background: #0A84FF; color: #fff; box-shadow: 0 4px 12px rgba(10, 132, 255, 0.2); }
.neo-btn.primary:hover { background: #0071e3; transform: translateY(-1px); }
.neo-btn.danger-ghost { background: rgba(255, 69, 58, 0.1); color: #FF453A; }
.neo-btn.danger-ghost:hover { background: rgba(255, 69, 58, 0.2); }
.neo-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

/* 过滤工具栏 */
.data-toolbar { padding: 0 32px 20px; }
.filter-group { display: flex; gap: 12px; align-items: center; }
.neo-input-wrap {
  display: flex; align-items: center;
  background: var(--hover-bg, #f5f5f7);
  border-radius: 10px; height: 36px; padding: 0 12px;
  border: 1px solid transparent; transition: all 0.2s;
}
.neo-input-wrap:focus-within { background: transparent; border-color: #0A84FF; }
.prefix-icon { color: var(--text-muted); margin-right: 8px; font-size: 13px; }
.neo-input-wrap input { border: none; background: transparent; outline: none; font-size: 13px; color: var(--text-main); width: 140px; }
.neo-select-wrap { background: var(--hover-bg, #f5f5f7); border-radius: 10px; height: 36px; display: flex; align-items: center; padding: 0 8px; }
.transparent-select { width: 100px; }
:deep(.transparent-select .ant-select-selector) { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; }

.neo-icon-btn { width: 36px; height: 36px; border-radius: 10px; border: none; background: #0A84FF; color: #fff; cursor: pointer; transition: all 0.2s; }
.neo-icon-btn:hover { transform: scale(0.95); }
.neo-icon-btn.secondary { background: var(--hover-bg, #e5e5ea); color: var(--text-main); }
.neo-icon-btn.secondary:hover { background: #d1d1d6; }

/* 表格主体美化 */
.data-table-wrapper { flex: 1; padding: 0 32px 20px; overflow: hidden; }
:deep(.neo-table) { height: 100%; display: flex; flex-direction: column; }
:deep(.neo-table .ant-spin-nested-loading) { height: 100%; }
:deep(.neo-table .ant-spin-container) { display: flex; flex-direction: column; height: 100%; }
:deep(.neo-table .ant-table) { flex: 1; overflow: hidden; background: transparent; }
:deep(.neo-table .ant-table-container) { height: 100%; display: flex; flex-direction: column; }
:deep(.neo-table .ant-table-body) { flex: 1; overflow-y: auto; }

/* 彻底重构 Antd 表格样式 */
:deep(.neo-table .ant-table-thead > tr > th) {
  background: transparent !important;
  border-bottom: 1px solid var(--border-color, #e5e5ea) !important;
  color: var(--text-muted) !important;
  font-weight: 500; font-size: 13px; padding: 12px 16px;
}
:deep(.neo-table .ant-table-thead > tr > th::before) { display: none; } /* 隐藏列分割线 */
:deep(.neo-table .ant-table-tbody > tr > td) {
  border-bottom: 1px solid var(--border-color, #f4f4f5) !important;
  padding: 16px; transition: background 0.2s;
}
:deep(.neo-table .ant-table-tbody > tr:hover > td) { background: var(--hover-bg, #fbfbfc) !important; }
:deep(.neo-table .ant-checkbox-inner) { border-radius: 4px; }

/* 单元格定制 */
.cell-label { font-weight: 600; font-size: 14px; color: var(--text-main); }
.cell-value { font-family: monospace; color: var(--text-muted); font-size: 13px; background: var(--hover-bg, #f5f5f7); padding: 2px 8px; border-radius: 6px; }
.cell-sort { background: rgba(0,0,0,0.04); color: var(--text-muted); font-weight: 600; font-size: 12px; padding: 2px 8px; border-radius: 10px; }
.cell-status { display: inline-flex; align-items: center; justify-content: center; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.cell-status.active { background: rgba(52, 199, 89, 0.1); color: #34C759; }
.cell-status.inactive { background: rgba(255, 69, 58, 0.1); color: #FF453A; }
.text-action-btn { background: transparent; border: none; color: #0A84FF; font-weight: 600; cursor: pointer; transition: opacity 0.2s; }
.text-action-btn:hover { opacity: 0.7; }

:deep(.neo-table .ant-pagination) { margin-top: 16px !important; margin-bottom: 0 !important; }

/* ================== 模态框极简风格注入 ================== */
:global(.neo-modal .ant-modal-content) {
  border-radius: 24px !important; padding: 0 !important;
  box-shadow: 0 24px 60px rgba(0,0,0,0.15) !important;
  border: 1px solid var(--border-color, rgba(0,0,0,0.05)) !important;
}
:global(.neo-modal .ant-modal-header) { padding: 24px 24px 16px !important; border-bottom: none !important; }
:global(.neo-modal .ant-modal-title) { font-size: 20px !important; font-weight: 800 !important; }
:global(.neo-modal .ant-modal-close) { top: 20px !important; right: 20px !important; }
:global(.neo-modal .ant-modal-body) { padding: 0 24px 24px !important; }
:global(.neo-modal .ant-modal-footer) { border-top: 1px solid var(--border-color, rgba(0,0,0,0.05)) !important; padding: 16px 24px !important; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

:global(.neo-form .ant-form-item-label > label) { font-weight: 600; color: var(--text-muted, #666); font-size: 13px; }
:global(.neo-form .ant-input), :global(.neo-form .ant-input-number-input) {
  border-radius: 12px !important; background: var(--hover-bg, #f5f5f7) !important;
  border: 1px solid transparent !important; padding: 8px 14px !important; box-shadow: none !important;
}
:global(.neo-form .ant-input:focus) { background: transparent !important; border-color: #0A84FF !important; }
:global(.neo-form .ant-select-selector) { border-radius: 12px !important; background: var(--hover-bg, #f5f5f7) !important; border-color: transparent !important; }

/* ================== 全局悬浮提示框 (Tooltip) 皮肤注入 ================== */
/* 强制解开外层容器的宽度限制，解决右侧留白断层 */
:global(.neo-tooltip) {
  max-width: none !important;
}
:global(.neo-tooltip .ant-tooltip-inner) {
  backdrop-filter: blur(16px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(16px) saturate(180%) !important;
  border-radius: 10px !important;
  padding: 8px 14px !important;
  font-weight: 500 !important;
  font-size: 13px !important;

  /* 强制不换行，且宽度为内容最大宽度，消除右侧大片空白框 */
  white-space: nowrap !important;
  width: max-content !important;
  max-width: none !important;
  min-height: auto !important;
}

/* 亮色主题：黑底白字高反差 */
:global(.tooltip-light .ant-tooltip-inner) {
  background-color: rgba(28, 28, 30, 0.85) !important; /* 苹果级深色毛玻璃 */
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
}
:global(.tooltip-light .ant-tooltip-arrow::before) {
  background-color: rgba(28, 28, 30, 0.85) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

/* 暗黑主题：白底黑字高反差 */
:global(.tooltip-dark .ant-tooltip-inner) {
  background-color: rgba(255, 255, 255, 0.95) !important; /* 亮色毛玻璃 */
  color: #1d1d1f !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3) !important;
}
:global(.tooltip-dark .ant-tooltip-arrow::before) {
  background-color: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
}
</style>