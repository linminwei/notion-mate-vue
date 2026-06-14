<template>
  <div class="neo-dict-container">

    <!-- ================= 左侧：字典目录 ================= -->
    <aside class="neo-sidebar">
      <div class="sidebar-header">
        <h2 class="sidebar-title">
          字典类型
        </h2>
        <div class="sidebar-actions">
          <button class="icon-btn" v-permission="'system:dict:add'" @click="handleAddType">
            <font-awesome-icon :icon="['fas', 'plus']" />
          </button>
          <button v-if="selectedTypeKeys.length > 0" class="icon-btn" v-permission="'system:dict:edit'" @click="handleToggleStatusType">
            <font-awesome-icon :icon="['fas', 'power-off']" />
          </button>
          <button v-if="selectedTypeKeys.length > 0" class="icon-btn danger" v-permission="'system:dict:delete'" @click="confirmDelete('type')">
            <font-awesome-icon :icon="['fas', 'trash']" />
          </button>
        </div>
      </div>

      <!-- 胶囊搜索栏 -->
      <div class="sidebar-search-wrapper">
        <div class="capsule-search">
          <div class="search-inputs">
            <input type="text" v-model="typeSearchForm.dictName" placeholder="名称" @keyup.enter="handleTypeSearch" />
            <div class="divider"></div>
            <input type="text" v-model="typeSearchForm.dictCode" placeholder="编码" @keyup.enter="handleTypeSearch" />
          </div>
          <div class="search-actions">
            <button class="search-trigger" @click="handleTypeSearch" title="搜索">
              <font-awesome-icon :icon="['fas', 'search']" />
            </button>
            <button class="search-trigger reset-btn" @click="handleTypeReset" title="重置">
              <font-awesome-icon :icon="['fas', 'redo']" />
            </button>
          </div>
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
                :class="{
                'is-active': selectedTypeKeys.includes(item.id),
                'is-disabled': item.status === 0
              }"
                @click="handleTypeRowClick(item, index, $event)"
            >
              <div class="item-prefix">
                <div class="status-indicator" :class="item.status === 1 ? 'online' : 'offline'"></div>
              </div>

              <div class="item-content">
                <div class="item-title">{{ item.dictName }}</div>
                <div class="item-subtitle">{{ item.dictCode }}</div>
              </div>

              <div class="item-tail">
                <button class="edit-hover-btn" v-permission="'system:dict:edit'" @click.stop="handleEditType(item)">
                  <font-awesome-icon :icon="['fas', 'pen']" />
                </button>
              </div>
            </div>

            <!-- 左侧列表：全新现代插画空状态 -->
            <div v-if="typeList.length === 0 && !typeLoading" class="sidebar-empty-wrap">
              <div class="modern-empty-card mini">
                <div class="modern-empty-illus">
                  <div class="mockup-window">
                    <div class="mockup-header"><div class="mockup-dot"></div><div class="mockup-line short"></div></div>
                    <div class="mockup-row"><div class="mockup-avatar"></div><div class="mockup-line"></div></div>
                  </div>
                </div>
                <div class="modern-empty-content">
                  <h4 class="modern-empty-title">暂无字典类型</h4>
                  <p class="modern-empty-desc">未找到匹配数据</p>
                  <button class="modern-empty-btn mini-btn" v-permission="'system:dict:add'" @click="handleAddType">
                    <font-awesome-icon :icon="['fas', 'plus']" /> 快捷新增
                  </button>
                </div>
              </div>
            </div>
          </div>
        </a-spin>
      </div>

      <!-- 底部精简自定义分页：仅统计当前页总数 -->
      <div class="sidebar-footer">
        <div class="custom-pagination">
          <button
              class="page-btn"
              :disabled="typePagination.current <= 1"
              @click="handleTypePageChange(typePagination.current - 1)"
          >
            <font-awesome-icon :icon="['fas', 'chevron-left']" />
          </button>

          <div class="page-stats">
            本页 {{ typeList.length }} 条
          </div>

          <button
              class="page-btn"
              :disabled="typePagination.current >= Math.ceil(typePagination.total / typePagination.pageSize) || typeList.length === 0"
              @click="handleTypePageChange(typePagination.current + 1)"
          >
            <font-awesome-icon :icon="['fas', 'chevron-right']" />
          </button>
        </div>
      </div>
    </aside>

    <!-- ================= 右侧：数据工作区 ================= -->
    <main class="neo-main">

      <!-- 未选择 / 多选时的占位界面 (全新现代插画空状态) -->
      <div v-if="!currentType" class="neo-empty-state">
        <div class="modern-empty-card">
          <div class="modern-empty-illus">
            <div class="mockup-window">
              <div class="mockup-header"><div class="mockup-dot"></div><div class="mockup-line short"></div></div>
              <div class="mockup-row"><font-awesome-icon :icon="['fas', 'star']" class="mockup-star"/><div class="mockup-avatar"></div><div class="mockup-line"></div></div>
              <div class="mockup-row"><font-awesome-icon :icon="['fas', 'star']" class="mockup-star"/><div class="mockup-avatar"></div><div class="mockup-line shorter"></div></div>
            </div>
          </div>
          <div class="modern-empty-content">
            <template v-if="selectedTypeKeys.length > 1">
              <h3 class="modern-empty-title">已选择 {{ selectedTypeKeys.length }} 个字典类型</h3>
              <p class="modern-empty-desc">您可以对选中的字典类型进行批量操作<br/>如删除、切换状态等。</p>
            </template>
            <template v-else>
              <h3 class="modern-empty-title">字典数据中心</h3>
              <p class="modern-empty-desc">请在左侧选择一个字典类型，<br/>以查看和管理其详细数据配置。</p>
            </template>
          </div>
        </div>
      </div>

      <!-- 已选择且唯一：字典项 -->
      <div v-else class="neo-data-view fade-in">
        <!-- 全新设计的头部信息 -->
        <header class="data-header">
          <div class="header-info">
            <div class="title-row">
              <h1>{{ currentType.dictName }}</h1>
              <div class="dict-meta-badges">
                <span class="meta-badge code-badge">
                  <font-awesome-icon :icon="['fas', 'code']" />
                  {{ currentType.dictCode }}
                </span>
              </div>
            </div>
            <p class="dict-remark" v-if="currentType.remark">{{ currentType.remark }}</p>
            <p class="dict-remark empty" v-else>暂无字典类型描述</p>
          </div>
        </header>

        <!-- 过滤工具栏 (胶囊风格 + 快捷操作按钮集成) -->
        <div class="data-toolbar">
          <div class="capsule-search data-capsule">
            <div class="search-inputs">
              <input type="text" v-model="dataSearchForm.dictLabel" placeholder="搜索字典项名" @keyup.enter="handleDataSearch" />
              <div class="divider"></div>
              <input type="text" v-model="dataSearchForm.dictValue" placeholder="搜索字典项值" @keyup.enter="handleDataSearch" />
              <div class="divider"></div>
              <a-select v-model:value="dataSearchForm.status" placeholder="状态" :bordered="false" class="status-select" allowClear @change="handleDataSearch">
                <a-select-option v-for="dict in commonStatusDict" :key="dict.dictValue" :value="Number(dict.dictValue)">
                  {{ dict.dictLabel }}
                </a-select-option>
              </a-select>
            </div>
            <div class="search-actions">
              <button class="search-trigger" @click="handleDataSearch" title="搜索">
                <font-awesome-icon :icon="['fas', 'search']" />
              </button>
              <button class="search-trigger reset-btn" @click="handleDataReset" title="重置">
                <font-awesome-icon :icon="['fas', 'redo']" />
              </button>
            </div>
          </div>

          <!-- 新增的操作按钮区域，仅图标，与胶囊并排对齐 -->
          <div class="data-actions">
            <button class="toolbar-action-btn primary" v-permission="'system:dict:add'" @click="handleAddData" title="新增数据项">
              <font-awesome-icon :icon="['fas', 'plus']" />
            </button>
            <button v-if="selectedDataKeys.length > 0" class="toolbar-action-btn warning" v-permission="'system:dict:edit'" @click="handleToggleStatusData" title="启/禁用">
              <font-awesome-icon :icon="['fas', 'power-off']" />
            </button>
            <button v-if="selectedDataKeys.length > 0" class="toolbar-action-btn danger" v-permission="'system:dict:delete'" @click="confirmDelete('data')" title="批量删除">
              <font-awesome-icon :icon="['fas', 'trash']" />
            </button>
          </div>
        </div>

        <!-- 表格主体包裹层：负责撑满剩余空间，骨架级重构 -->
        <div class="data-table-wrapper neo-table-flex-container">
          <a-spin :spinning="dataLoading" wrapperClassName="data-spin-wrap">
            <!-- 数据为空时，隐藏整个表格，显示全新现代插画空状态 -->
            <div v-if="dataList.length === 0" class="data-empty-container fade-in">
              <div class="modern-empty-card">
                <div class="modern-empty-illus">
                  <div class="mockup-window">
                    <div class="mockup-header"><div class="mockup-dot"></div><div class="mockup-line short"></div></div>
                    <div class="mockup-row"><font-awesome-icon :icon="['fas', 'star']" class="mockup-star"/><div class="mockup-avatar"></div><div class="mockup-line"></div></div>
                    <div class="mockup-row"><font-awesome-icon :icon="['fas', 'star']" class="mockup-star"/><div class="mockup-avatar"></div><div class="mockup-line shorter"></div></div>
                  </div>
                </div>
                <div class="modern-empty-content">
                  <h3 class="modern-empty-title">该字典尚无数据</h3>
                  <p class="modern-empty-desc">现在开始构建您的字典项数据，<br/>点击下方按钮立即添加。</p>
                  <button class="modern-empty-btn" v-permission="'system:dict:add'" @click="handleAddData">
                    <font-awesome-icon :icon="['fas', 'plus']" /> 新增字典项
                  </button>
                </div>
              </div>
            </div>

            <!-- 有数据时正常显示表格 -->
            <a-table
                v-else
                class="neo-table"
                :columns="dataColumns"
                :data-source="dataList"
                :pagination="dataPagination"
                :row-selection="{ selectedRowKeys: selectedDataKeys, onChange: onDataSelectChange }"
                :custom-row="customRow"
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
                <template v-if="column.key === 'remark'">
                  <span class="cell-remark">{{ record.remark || '-' }}</span>
                </template>
                <template v-if="column.key === 'sort'">
                  <span :class="['sort-badge', { 'drag-handle': canSort }]" :title="canSort ? '拖拽排序' : ''">
                    <font-awesome-icon v-if="canSort" :icon="['fas', 'grip-vertical']" class="drag-icon" />
                    {{ record.sort }}
                  </span>
                </template>
                <template v-if="column.key === 'status'">
                  <div v-if="!canEditDataStatus" class="status-indicator-wrap" :class="record.status === 1 ? 'is-active' : 'is-inactive'">
                    <div class="status-dot"></div>
                    <span>{{ getStatusLabel(record.status) }}</span>
                  </div>
                  <div
                    v-else
                    class="status-segmented-toggle"
                    :class="record.status === 1 ? 'is-active' : 'is-inactive'"
                    @click="handleToggleDataStatus(record)"
                  >
                    <div class="seg-thumb"></div>
                    <span class="seg-label seg-on" :class="{ current: record.status === 1 }">启用</span>
                    <span class="seg-label seg-off" :class="{ current: record.status === 0 }">禁用</span>
                  </div>
                </template>
                <template v-if="column.key === 'action'">
                  <div class="action-btn-group">
                    <button class="text-action-btn primary" v-permission="'system:dict:edit'" @click="handleEditData(record)">编辑</button>
                    <button class="text-action-btn danger" v-permission="'system:dict:delete'" @click="handleDeleteData(record)">删除</button>
                  </div>
                </template>
              </template>
            </a-table>
          </a-spin>
        </div>
      </div>
    </main>

    <!-- ================= 弹窗区域 ================= -->

    <!-- 1. 字典类型弹窗 (使用全新重构的表单弹窗组件) -->
    <NeoFormModal
        v-model:open="typeModalVisible"
        ref="typeFormRef"
        :model="typeFormState"
        :rules="typeRules"
        :title="typeModalTitle"
        subtitle="配置字典类型的基础标识与描述"
        :width="480"
        :icon="['fas', 'book']"
        theme="primary"
        confirmText="保存配置"
        :confirmLoading="typeSubmitLoading"
        @ok="handleTypeSubmit"
    >
      <div class="form-grid">
        <a-form-item label="字典编码" name="dictCode">
          <a-input v-model:value="typeFormState.dictCode" placeholder="例如：sys_user_sex" :disabled="!!typeFormState.id" />
        </a-form-item>
        <a-form-item label="字典名称" name="dictName">
          <a-input v-model:value="typeFormState.dictName" placeholder="例如：用户性别" />
        </a-form-item>
      </div>
      <a-form-item label="描述" name="remark">
        <a-textarea v-model:value="typeFormState.remark" placeholder="填写描述" :auto-size="{ minRows: 1 }" />
      </a-form-item>
    </NeoFormModal>

    <!-- 2. 字典数据弹窗 -->
    <NeoFormModal
        v-model:open="dataModalVisible"
        ref="dataFormRef"
        :model="dataFormState"
        :rules="dataRules"
        :title="dataModalTitle"
        :width="560"
        :icon="['fas', 'tag']"
        theme="primary"
        confirmText="保存数据"
        :confirmLoading="dataSubmitLoading"
        @ok="handleDataSubmit"
    >
      <template #subtitle>
        隶属于：<strong class="highlight-text">{{ currentType?.dictName || '未知' }}</strong>
      </template>

      <div class="form-grid">
        <a-form-item label="字典项名" name="dictLabel">
          <a-input v-model:value="dataFormState.dictLabel" placeholder="例如：男" />
        </a-form-item>
        <a-form-item label="字典项值" name="dictValue">
          <a-input v-model:value="dataFormState.dictValue" placeholder="例如：MALE" />
        </a-form-item>
      </div>

      <a-form-item label="描述" name="remark">
        <a-textarea v-model:value="dataFormState.remark" placeholder="填写描述" :auto-size="{ minRows: 1 }" />
      </a-form-item>
    </NeoFormModal>

    <!-- 确认操作弹窗 -->
    <AppleConfirmModal
        v-model:visible="deleteConfirmVisible"
        type="danger"
        title="确认删除"
        :desc="`您确定要删除选中的 ${deleteConfirmTarget === 'type' ? selectedTypeKeys.length : selectedDataKeys.length} 项${deleteConfirmTarget === 'type' ? '字典类型' : '字典项'}吗？此操作无法撤销。`"
        confirmText="删除"
        :loading="deleteConfirmLoading"
        @confirm="executeDelete"
    />

    <!-- 数据状态切换确认弹窗 -->
    <AppleConfirmModal
        v-model:visible="dataStatusConfirmVisible"
        :type="dataStatusTargetValue === 1 ? 'warning' : 'danger'"
        :title="dataStatusTargetValue === 1 ? '启用字典数据' : '禁用字典数据'"
        :desc="dataStatusConfirmDesc"
        :confirmText="dataStatusTargetValue === 1 ? '确认启用' : '确认禁用'"
        :loading="dataStatusConfirmLoading"
        @confirm="executeDataStatusToggle"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, onBeforeUnmount, watch } from 'vue'
import {
  getDictTypePage, addDictType, updateDictType, deleteDictTypeBatch,
  getDictDataPage, addDictData, updateDictData, deleteDictDataBatch, getDictDataByDictCodeEnable
} from '@/api/dict.ts'
import type { DictType, DictData } from '@/types'
import type { Rule } from 'ant-design-vue/es/form'
import { AppleAlert } from '@/components/common/AppleAlert.ts'
import { useUserStore } from '@/stores/user'
import Sortable from 'sortablejs'

const userStore = useUserStore()
const canEditDataStatus = computed(() => userStore.hasPermission('system:dict:edit'))
const canSort = computed(() => userStore.hasPermission('system:dict:edit'))
import AppleConfirmModal from '@/components/common/AppleConfirmModal.vue'
import NeoFormModal from '@/components/common/NeoFormModal.vue'

// ==================== 全局状态与类型管理 ====================
const typeLoading = ref(false)
const typeList = ref<DictType[]>([])
const currentType = ref<DictType | null>(null)

const selectedTypeKeys = ref<string[]>([])
const lastSelectedIndex = ref<number>(-1)

const typeSearchForm = ref({ dictCode: '', dictName: '', status: undefined as number | undefined })
const typePagination = ref({ current: 1, pageSize: 15, total: 0 })

const typeModalVisible = ref(false)
const typeSubmitLoading = ref(false)
const typeFormRef = ref<InstanceType<typeof NeoFormModal>>()
const typeFormState = ref<Partial<DictType>>({})
const typeModalTitle = computed(() => typeFormState.value.id ? '编辑字典类型' : '新增字典类型')

const typeRules: Record<string, Rule[]> = {
  dictCode: [{ required: true, message: '请填写字典编码', trigger: 'blur' }],
  dictName: [{ required: true, message: '请填写字典名称', trigger: 'blur' }]
}

// ==================== 字典状态数据 ====================
const commonStatusDict = ref<DictData[]>([])

const fetchCommonStatus = async () => {
  try {
    const res = await getDictDataByDictCodeEnable('sys_common_status')
    commonStatusDict.value = res.data || []
  } catch (error) {
    console.warn('获取 sys_common_status 字典失败', error)
  }
}

const getStatusLabel = (statusValue: number) => {
  if (!commonStatusDict.value.length) return statusValue === 1 ? '启用' : '禁用'
  const dict = commonStatusDict.value.find(d => Number(d.dictValue) === statusValue)
  return dict ? dict.dictLabel : (statusValue === 1 ? '启用' : '禁用')
}

// ==================== 数据状态切换逻辑 ====================
const dataStatusConfirmVisible = ref(false)
const dataStatusConfirmLoading = ref(false)
const dataStatusTargetValue = ref<number>(1)
const dataStatusTargetItem = ref<DictData | null>(null)

const dataStatusConfirmDesc = computed(() => {
  const actionText = dataStatusTargetValue.value === 1 ? '启用' : '禁用'
  if (dataStatusTargetItem.value) {
    return `确定要${actionText}字典数据「${dataStatusTargetItem.value.dictLabel}」吗？`
  }
  return ''
})

const handleToggleDataStatus = (record: DictData) => {
  dataStatusTargetItem.value = record
  dataStatusTargetValue.value = record.status === 1 ? 0 : 1
  dataStatusConfirmVisible.value = true
}

const executeDataStatusToggle = async () => {
  if (!dataStatusTargetItem.value) return
  dataStatusConfirmLoading.value = true
  try {
    await updateDictData({ ...dataStatusTargetItem.value, status: dataStatusTargetValue.value })
    AppleAlert.success(
      dataStatusTargetValue.value === 1 ? '已启用' : '已禁用',
      `字典数据「${dataStatusTargetItem.value.dictLabel}」状态已更新`
    )
    await fetchDataList()
  } catch (error: any) {
    AppleAlert.error('操作失败', error.message || '状态切换未完成')
  } finally {
    dataStatusConfirmLoading.value = false
    dataStatusConfirmVisible.value = false
  }
}

// ==================== 自定义确认删除逻辑 ====================
const deleteConfirmVisible = ref(false)
const deleteConfirmTarget = ref<'type' | 'data'>('type')
const deleteConfirmLoading = ref(false)

const confirmDelete = (target: 'type' | 'data') => {
  deleteConfirmTarget.value = target
  deleteConfirmVisible.value = true
}

const executeDelete = async () => {
  deleteConfirmLoading.value = true
  try {
    if (deleteConfirmTarget.value === 'type') {
      await deleteDictTypeBatch(selectedTypeKeys.value)
      AppleAlert.success('已删除')
      selectedTypeKeys.value = []
      currentType.value = null
      dataList.value = []
      await fetchTypeList()
    } else {
      await deleteDictDataBatch(selectedDataKeys.value)
      AppleAlert.success('已删除')
      selectedDataKeys.value = []
      await fetchDataList()
    }
    deleteConfirmVisible.value = false
  } catch (error) {} finally {
    deleteConfirmLoading.value = false
  }
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
    lastSelectedIndex.value = -1
  } finally { typeLoading.value = false }
}

const handleTypeSearch = () => { typePagination.value.current = 1; fetchTypeList() }

const handleTypeReset = () => {
  // 1. 清空搜索表单
  typeSearchForm.value = { dictCode: '', dictName: '' }
  // 2. 清空所有的选中状态及当前展开的数据列表
  selectedTypeKeys.value = []
  currentType.value = null
  dataList.value = []
  lastSelectedIndex.value = -1
  // 3. 重新发起查询
  handleTypeSearch()
}

const handleTypePageChange = (page: number) => { typePagination.value.current = page; fetchTypeList() }

const handleToggleStatusType = async () => {
  if (selectedTypeKeys.value.length === 0) return
  try {
    for (const id of selectedTypeKeys.value) {
      const target = typeList.value.find(t => t.id === id)
      if (target) {
        await updateDictType({ ...target, status: target.status === 1 ? 0 : 1 })
      }
    }
    AppleAlert.success('操作成功', '已切换选中目录的状态')
    await fetchTypeList()
  } catch (error: any) {}
}

const handleTypeRowClick = (record: DictType, index: number, event: MouseEvent) => {
  if (event.shiftKey && lastSelectedIndex.value !== -1) {
    const start = Math.min(lastSelectedIndex.value, index)
    const end = Math.max(lastSelectedIndex.value, index)
    const rangeKeys = typeList.value.slice(start, end + 1).map(t => t.id)
    if (event.metaKey || event.ctrlKey) {
      selectedTypeKeys.value = Array.from(new Set([...selectedTypeKeys.value, ...rangeKeys]))
    } else {
      selectedTypeKeys.value = rangeKeys
    }
  } else if (event.metaKey || event.ctrlKey) {
    const existingIndex = selectedTypeKeys.value.indexOf(record.id)
    if (existingIndex > -1) selectedTypeKeys.value.splice(existingIndex, 1)
    else selectedTypeKeys.value.push(record.id)
    lastSelectedIndex.value = index
  } else {
    selectedTypeKeys.value = [record.id]
    lastSelectedIndex.value = index
  }

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

const handleEditType = ({ id, dictCode, dictName, remark }: DictType) => {
  typeFormState.value = { id, dictCode, dictName, remark }
  typeModalVisible.value = true
}

const handleTypeSubmit = async () => {
  try {
    await typeFormRef.value?.validate()
    typeSubmitLoading.value = true
    if (typeFormState.value.id) {
      await updateDictType(typeFormState.value); AppleAlert.success('已保存')
    } else {
      await addDictType({ ...typeFormState.value, status: 1 }); AppleAlert.success('已创建')
    }
    typeModalVisible.value = false
    fetchTypeList()
  } catch (error) {} finally { typeSubmitLoading.value = false }
}

// ==================== 字典数据相关 ====================
const dataColumns = [
  { title: '标签名称', dataIndex: 'dictLabel', key: 'dictLabel', width: 120 },
  { title: '存储键值', dataIndex: 'dictValue', key: 'dictValue', width: 110 },
  { title: '描述', dataIndex: 'remark', key: 'remark' },
  { title: '排序', dataIndex: 'sort', key: 'sort', width: 70, align: 'center' as const },
  { title: '状态', dataIndex: 'status', key: 'status', width: 130, align: 'center' as const },
  { title: '操作', key: 'action', width: 160, align: 'center' as const }
]

const dataLoading = ref(false)
const dataList = ref<DictData[]>([])
const selectedDataKeys = ref<string[]>([])

const dataSearchForm = ref({ dictLabel: '', dictValue: '', status: undefined as number | undefined })
// 开启更完善的分页配置
const dataPagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50', '100'],
  showTotal: (total: number) => `共 ${total} 项`
})

const dataModalVisible = ref(false)
const dataSubmitLoading = ref(false)
const dataFormRef = ref<InstanceType<typeof NeoFormModal>>()
const dataFormState = ref<Partial<DictData>>({})
const dataModalTitle = computed(() => dataFormState.value.id ? '编辑字典项' : '新增字典项')

const dataRules: Record<string, Rule[]> = {
  dictLabel: [{ required: true, message: '请填写字典标签', trigger: 'blur' }],
  dictValue: [{ required: true, message: '请填写字典键值', trigger: 'blur' }]
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
    if (canSort.value) initSortable()
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

const handleToggleStatusData = async () => {
  if (selectedDataKeys.value.length === 0) return
  try {
    for (const id of selectedDataKeys.value) {
      const target = dataList.value.find(d => d.id === id)
      if (target) {
        await updateDictData({ ...target, status: target.status === 1 ? 0 : 1 })
      }
    }
    AppleAlert.success('操作成功', '已切换选中数据项的状态')
    await fetchDataList()
  } catch (error: any) {}
}

const handleDeleteData = (record: DictData) => {
  selectedDataKeys.value = [record.id]
  confirmDelete('data')
}

const handleAddData = () => {
  dataFormState.value = { dictTypeId: currentType.value?.id, dictLabel: '', dictValue: '', sort: 0, remark: '' }
  dataModalVisible.value = true
}

const handleEditData = ({ id, dictTypeId, dictLabel, dictValue, sort, remark }: DictData) => {
  dataFormState.value = { id, dictTypeId, dictLabel, dictValue, sort, remark }
  dataModalVisible.value = true
}

const handleDataSubmit = async () => {
  try {
    await dataFormRef.value?.validate()
    dataSubmitLoading.value = true
    if (dataFormState.value.id) {
      await updateDictData(dataFormState.value); AppleAlert.success('已保存')
    } else {
      await addDictData({ ...dataFormState.value, status: 1 }); AppleAlert.success('已创建')
    }
    dataModalVisible.value = false
    fetchDataList()
  } catch (error) {} finally { dataSubmitLoading.value = false }
}

onMounted(() => {
  fetchCommonStatus()
  fetchTypeList()
})

// ==================== 拖拽排序 ====================
const customRow = (record: DictData) => ({
  'data-row-id': record.id
})

let sortableInstance: Sortable | null = null

const initSortable = () => {
  if (!canSort.value) return
  nextTick(() => {
    const tbody = document.querySelector('.neo-table .ant-table-tbody') as HTMLElement
    if (!tbody) return

    if (sortableInstance) {
      sortableInstance.destroy()
    }

    sortableInstance = Sortable.create(tbody, {
      animation: 200,
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      handle: '.drag-handle',
      onEnd: async (evt) => {
        if (!canSort.value) return
        const { oldIndex, newIndex } = evt
        if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) return

        const allRows = Array.from(tbody.querySelectorAll('tr[data-row-id]'))
        const sortedIds = allRows
          .map(row => (row as HTMLElement).getAttribute('data-row-id') || '')
          .filter(id => id !== '')

        const sortItems = sortedIds.map((id, index) => ({
          id,
          sort: index + 1
        }))

        if (sortItems.length === 0) return

        try {
          for (const item of sortItems) {
            const target = dataList.value.find(d => d.id === item.id)
            if (target) {
              await updateDictData({ ...target, sort: item.sort })
            }
          }
          AppleAlert.success('排序成功', '字典项排序已更新')
          await fetchDataList()
        } catch (error: any) {
          AppleAlert.error('排序失败', error.message || '操作未完成')
          await fetchDataList()
        }
      }
    })
  })
}

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
/* ================== 全局重构布局 ================== */
.neo-dict-container {
  display: flex;
  height: calc(100vh - 120px);
  min-height: 600px;
  gap: 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* ================== 左侧导航 ================== */
.neo-sidebar {
  width: 360px;
  flex-shrink: 0;
  background: var(--card-bg, #ffffff);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--border-color, rgba(0,0,0,0.05));
  overflow: hidden;
  transition: all 0.3s ease;
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
  display: flex;
  align-items: center;
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
/* 应用全局强调色 */
.icon-btn:hover { background: color-mix(in srgb, var(--apple-blue, #0A84FF) 10%, transparent); color: var(--apple-blue, #0A84FF); }
.icon-btn.danger:not(:disabled) { color: #FF453A; background: rgba(255, 69, 58, 0.1); }
.icon-btn.danger:not(:disabled):hover { background: rgba(255, 69, 58, 0.2); }
.icon-btn:disabled { opacity: 0.4; cursor: not-allowed; background: transparent; }

/* 创新的胶囊搜索 */
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
  /* 应用全局强调色 */
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--apple-blue, #0A84FF) 10%, transparent);
}

/* ================= 核心修复：绝对像素级居中与等高对齐 ================= */
.search-inputs {
  flex: 1; display: flex; align-items: center;
  padding: 0 4px; height: 26px;
}

.search-inputs input {
  flex: 1; min-width: 0; width: 0;
  border: none; background: transparent;
  font-size: 13px; color: var(--text-main);
  outline: none; padding: 0 8px; /* 调整内间距以呼吸感 */
  height: 26px; line-height: 26px;
}
.search-inputs input::placeholder { color: var(--text-muted, #a1a1aa); }
.divider { width: 1px; height: 14px; background: var(--border-color, #e5e5ea); margin: 0 4px; flex-shrink: 0; }

/* Status Select 绝对高度锁定 */
.status-select {
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
  top: 0 !important;
  bottom: 0 !important;
}
:deep(.status-select .ant-select-selection-placeholder) {
  color: var(--text-muted, #a1a1aa) !important;
  left: 4px !important;
}
:deep(.status-select .ant-select-arrow) {
  right: 0px !important;
  font-size: 10px !important;
  color: var(--text-muted) !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  margin-top: 0 !important;
}
:deep(.status-select .ant-select-clear) {
  right: 0px !important;
  background: transparent !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  margin-top: 0 !important;
}

.search-actions { display: flex; gap: 4px; }
.search-trigger {
  width: 32px; height: 32px;
  border: none; border-radius: 10px;
  background: var(--apple-blue, #0A84FF); color: #fff;
  cursor: pointer; transition: all 0.2s;
  display: flex; align-items: center; justify-content: center;
}
.search-trigger:hover { filter: brightness(0.9); transform: scale(0.95); }

/* 恢复的重置按钮明显背景 */
.search-trigger.reset-btn {
  background: var(--hover-bg, #e5e5ea);
  color: var(--text-main, #333);
}
.search-trigger.reset-btn:hover {
  background: var(--active-bg, rgba(0,0,0,0.1));
  color: var(--text-main, #1d1d1f);
  transform: scale(0.95);
}

/* 精美卡片列表 */
.sidebar-list-container {
  flex: 1; overflow-y: auto; overflow-x: hidden;
  padding: 0 20px;
}
.sidebar-list-container::-webkit-scrollbar { width: 4px; }
.sidebar-list-container::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }

.neo-list-item {
  width: 100%;
  box-sizing: border-box;
  display: flex; align-items: center;
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

.neo-list-item.is-disabled .item-content { opacity: 0.45; }
.neo-list-item.is-disabled.is-active .item-content { opacity: 0.7; }

.item-prefix {
  display: flex; align-items: center; justify-content: center;
  padding-right: 12px;
}

/* ================= 左侧列表：极高辨识度的绝对语义状态点 ================= */
.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-sizing: border-box;
}

/* 启用态：永远是经典的苹果绿 */
.status-indicator.online {
  background: #34C759;
  box-shadow: 0 0 6px rgba(52, 199, 89, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.3);
}

/* 禁用态：永远是警示的苹果红 */
.status-indicator.offline {
  background: #FF453A;
  box-shadow: 0 0 6px rgba(255, 69, 58, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.3);
}

/* 选中态下状态指示器保持清晰可见 */
.neo-list-item.is-active .status-indicator.online {
  box-shadow: 0 0 6px rgba(52, 199, 89, 0.4);
}
.neo-list-item.is-active .status-indicator.offline {
  box-shadow: 0 0 6px rgba(255, 69, 58, 0.4);
}

.item-content {
  flex: 1;
  min-width: 0;
  padding-left: 0;
  transition: opacity 0.25s;
  display: flex;
  flex-direction: row;
  align-items: center; /* 确保标题和编码在横向排列时绝对垂直对齐 */
  justify-content: flex-start;
  gap: 10px; /* 增加一点间距，让视觉更加舒展 */
}

.item-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 0;
  line-height: normal; /* 消除原生行高带来的上下偏移杂距 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s ease;
  letter-spacing: 0.3px;
  flex-shrink: 0; /* 优先保证标题显示空间 */
  max-width: 50%;
}

.item-subtitle {
  /* 使用 inline-flex 结合固定高度，保证内部文字绝对垂直居中 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  line-height: normal; /* 回归 normal，由 flex 接管垂直居中，避免文字下沉 */

  font-size: 12px; /* 与 14px 的标题达到更优的层级对比 */
  color: var(--text-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s ease;

  background: var(--hover-bg, rgba(0,0,0,0.05));
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0 8px; /* 仅左右 padding，靠 height 撑起上下空间 */
  box-sizing: border-box;
  flex-shrink: 1;
}

.neo-list-item.is-active .item-title {
  color: var(--apple-blue);
  font-weight: 700;
}

.item-tail { display: flex; align-items: center; justify-content: flex-end; width: 30px; }

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
.neo-list-item.is-active .edit-hover-btn { background: color-mix(in srgb, var(--apple-blue) 15%, transparent); color: var(--apple-blue); }
.neo-list-item:hover .status-indicator { opacity: 0; }

/* ================= 左侧列表：空状态高级重构与快捷按钮 ================= */
.sidebar-empty-wrap {
  padding: 20px;
  display: flex;
  justify-content: center;
}

/* ================= 极简分页器 (恢复统计功能与逻辑) ================= */
.sidebar-footer {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid var(--border-color, rgba(0,0,0,0.08));
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
  color: var(--text-main, #333);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px var(--shadow-color, rgba(0,0,0,0.05));
}

.page-btn:not(:disabled):hover {
  border-color: var(--apple-blue, #0A84FF);
  color: var(--apple-blue, #0A84FF);
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
  display: flex;
  align-items: center;
  gap: 6px;
  font-variant-numeric: tabular-nums;
  user-select: none;
}

/* ================= 右侧主工作区 ================== */
.neo-main {
  flex: 1; min-width: 0;
  background: var(--card-bg, #ffffff);
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--border-color, rgba(0,0,0,0.05));
  display: flex; flex-direction: column;
  position: relative; overflow: hidden;
}

/* ================= 全新现代插画卡片风格空状态 ================= */
.neo-empty-state {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: radial-gradient(circle at top right, color-mix(in srgb, var(--apple-blue, #0A84FF) 3%, transparent) 0%, transparent 50%),
  radial-gradient(circle at bottom left, color-mix(in srgb, var(--apple-blue, #0A84FF) 2%, transparent) 0%, transparent 50%);
  z-index: 10;
}

/* 右侧局部数据为空时的完美居中占位层（绝对定位，不依赖 flex 链条） */
.data-empty-container {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

/* 通用空状态卡片基座 */
.modern-empty-card {
  width: 100%;
  max-width: 380px;
  background: var(--card-bg, #ffffff);
  border: 1px solid var(--border-color, rgba(0,0,0,0.05));
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  animation: float-up-fade 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
:global(.dark .modern-empty-card) {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

/* 顶部渐变插画区域 */
.modern-empty-illus {
  width: 100%;
  height: 140px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--apple-blue) 40%, transparent), color-mix(in srgb, var(--apple-blue) 5%, transparent));
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 0 40px;
  box-sizing: border-box;
}

/* 虚拟拟物化 UI 窗口 */
.mockup-window {
  width: 100%;
  height: 100px;
  background: var(--content-bg);
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -4px 24px rgba(0,0,0,0.08);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: relative;
  z-index: 2;
}
:global(.dark .mockup-window) {
  box-shadow: 0 -4px 24px rgba(0,0,0,0.4);
}
.mockup-header { display: flex; align-items: center; gap: 8px; }
.mockup-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--border-color); }
.mockup-line { height: 6px; border-radius: 3px; background: var(--hover-bg); flex: 1; }
.mockup-line.short { width: 60%; flex: none; }
.mockup-line.shorter { width: 40%; flex: none; }
.mockup-row { display: flex; align-items: center; gap: 10px; }
.mockup-star { color: var(--border-color); font-size: 10px; }
.mockup-avatar { width: 18px; height: 18px; border-radius: 50%; background: var(--hover-bg); }

/* 文字内容和按钮区域 */
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
  margin: 0 0 12px 0;
  letter-spacing: -0.3px;
}

.modern-empty-desc {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0 0 24px 0;
  line-height: 1.6;
}
.modern-empty-desc:last-child {
  margin-bottom: 0;
}

/* 反色胶囊按钮 */
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
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.modern-empty-btn:hover {
  transform: scale(0.96);
  opacity: 0.9;
}

/* 侧边栏迷你版卡片修饰 */
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
  margin-bottom: 16px;
}
.modern-empty-card.mini .modern-empty-btn {
  height: 32px;
  padding: 0 16px;
  font-size: 13px;
}

@keyframes float-up-fade {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.neo-data-view { display: flex; flex-direction: column; height: 100%; }

/* ================= 右侧：全新头部信息排版 ================= */
.data-header {
  padding: 24px 32px 16px;
  display: flex; justify-content: space-between; align-items: flex-start;
}

.header-info { display: flex; flex-direction: column; gap: 8px; }
.title-row { display: flex; align-items: center; gap: 12px; }
.header-info h1 {
  font-size: 22px; font-weight: 700; color: var(--text-main);
  margin: 0; letter-spacing: -0.3px;
  line-height: 1.2;
}

/* 右侧字典编码高级徽标 - 绝对垂直居中修复 */
.meta-badge {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px; color: var(--apple-blue);
  background: color-mix(in srgb, var(--apple-blue) 12%, transparent);
  padding: 0 10px; height: 24px; border-radius: 8px; font-weight: 600;
  border: 1px solid color-mix(in srgb, var(--apple-blue) 20%, transparent);
  line-height: normal; /* 由 flex 接管垂直居中 */
}

/* 字典描述文本 */
.dict-remark { font-size: 14px; color: var(--text-muted); margin: 0; line-height: 1.5; max-width: 600px; }
.dict-remark.empty { opacity: 0.5; }

/* ================= 过滤工具栏 ================= */
.data-toolbar { padding: 0 32px 16px; display: flex; align-items: center; justify-content: flex-start; gap: 12px; }

.data-capsule {
  width: auto;
  min-width: 450px;
  max-width: 100%;
}

.data-capsule .search-inputs {
  padding: 0 8px;
}

.data-capsule input {
  min-width: 80px;
}

/* 右侧顶部工具栏新操作按钮组 */
.data-actions {
  display: flex;
  gap: 8px;
}

.toolbar-action-btn {
  width: 36px; height: 36px;
  border-radius: 12px; border: none;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; cursor: pointer; transition: all 0.2s;
}
.toolbar-action-btn.primary {
  background: color-mix(in srgb, var(--apple-blue, #0A84FF) 15%, transparent);
  color: var(--apple-blue, #0A84FF);
}
.toolbar-action-btn.primary:hover {
  background: var(--apple-blue, #0A84FF);
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px color-mix(in srgb, var(--apple-blue, #0A84FF) 20%, transparent);
}
.toolbar-action-btn.danger {
  background: rgba(255, 69, 58, 0.1);
  color: #FF453A;
}
.toolbar-action-btn.danger:hover:not(:disabled) {
  background: #FF453A;
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(255, 69, 58, 0.2);
}
.toolbar-action-btn.warning {
  background: rgba(255, 149, 0, 0.1);
  color: #FF9500;
}
.toolbar-action-btn.warning:hover:not(:disabled) {
  background: #FF9500;
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(255, 149, 0, 0.2);
}

/* 渐显渐隐动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
  width: 0;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

/* ================= 核心修复：表格滚动容器 ================= */
/* 不再使用 flex column 嵌套，用纯块级布局让表格自然撑高，wrapper 负责滚动 */
.data-table-wrapper {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 32px;
  position: relative;
}

/* 清除 Ant Design Spin/Table 内部可能阻止滚动的 overflow:hidden */
:deep(.data-spin-wrap) {
  overflow: visible !important;
  height: 100%;
}
:deep(.data-spin-wrap > .ant-spin-container) {
  overflow: visible !important;
  height: 100%;
}
:deep(.neo-table.ant-table-wrapper) {
  overflow: visible !important;
}
:deep(.neo-table .ant-table) {
  overflow: visible !important;
}

/* 单元格定制 */
.cell-label { font-weight: 600; font-size: 14px; color: var(--text-main); }
.cell-value { font-family: monospace; color: var(--text-muted); font-size: 13px; background: var(--hover-bg, #f5f5f7); padding: 2px 8px; border-radius: 6px; }
.cell-sort { background: var(--hover-bg, #f5f5f7); color: var(--text-muted); font-weight: 600; font-size: 12px; padding: 2px 8px; border-radius: 10px; }

/* ================= 拖拽排序样式 — Apple 设计语言 ================= */
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

:global(.dark .sort-badge) {
  color: rgba(255, 255, 255, 0.60);
}

.drag-handle {
  cursor: grab;
  display: inline-flex;
  align-items: center;
  user-select: none;
}

.drag-handle:active {
  cursor: grabbing;
}

.drag-icon {
  display: block;
  font-size: 12px;
  color: rgba(60, 60, 67, 0.22);
  transition: color 0.15s ease, transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
}

:deep(.ant-table-row):hover .drag-icon {
  color: rgba(60, 60, 67, 0.40);
}

.drag-handle:hover .drag-icon {
  color: rgba(60, 60, 67, 0.65);
}

.drag-handle:active .drag-icon {
  color: #007AFF;
  transform: scale(0.88);
}

:global(.dark .drag-icon) {
  color: rgba(235, 235, 245, 0.30);
}

:global(.dark) :deep(.ant-table-row):hover .drag-icon {
  color: rgba(235, 235, 245, 0.45);
}

:global(.dark .drag-handle:hover .drag-icon) {
  color: rgba(235, 235, 245, 0.60);
}

:global(.dark .drag-handle:active .drag-icon) {
  color: #0A84FF;
}

:deep(.sortable-ghost) {
  opacity: 0.28;
  background: transparent !important;
}
:deep(.sortable-ghost > td) {
  background: transparent !important;
}

:deep(.sortable-chosen) {
  opacity: 1;
  background: rgba(0, 0, 0, 0.015) !important;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
}
:deep(.sortable-chosen > td) {
  background: rgba(0, 0, 0, 0.015) !important;
}

:global(.dark) :deep(.sortable-chosen) {
  background: rgba(255, 255, 255, 0.03) !important;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.30);
}
:global(.dark) :deep(.sortable-chosen > td) {
  background: rgba(255, 255, 255, 0.03) !important;
}
.cell-remark { font-size: 13px; color: var(--text-muted); white-space: normal; word-break: break-word; line-height: 1.5; }

/* 复选框列固定宽度，防止被文本挤压 */
:deep(.neo-table .ant-table) {
  table-layout: fixed;
}

:deep(.neo-table .ant-table-selection-column) {
  width: 54px !important;
  min-width: 54px !important;
  max-width: 54px !important;
  overflow: visible !important;
}

:deep(.neo-table .ant-table-thead .ant-table-selection-column) {
  padding-left: 16px !important;
  padding-top: 18px !important;
  padding-bottom: 15px !important;
}

:deep(.neo-table .ant-table-tbody .ant-table-selection-column) {
  padding-left: 16px !important;
}

/* ================= 右侧表格：状态列（使用全局 .status-indicator-wrap） ================= */

/* ================= 暗黑模式补全 ================= */
:global(.dark .sidebar-footer) {
  border-top-color: rgba(255, 255, 255, 0.06);
}

:global(.dark .page-btn) {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.06);
}

:global(.dark .page-btn:disabled) {
  background: rgba(255, 255, 255, 0.02);
}

:global(.dark .search-trigger.reset-btn) {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.7);
}

:global(.dark .search-trigger.reset-btn:hover) {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.85);
}

:global(.dark .toolbar-action-btn.danger) {
  background: rgba(255, 69, 58, 0.15);
}

:global(.dark .toolbar-action-btn.danger:hover:not(:disabled)) {
  background: #FF453A;
}

:global(.dark .toolbar-action-btn.warning) {
  background: rgba(255, 149, 0, 0.15);
}

:global(.dark .toolbar-action-btn.warning:hover:not(:disabled)) {
  background: #FF9500;
}

:global(.dark .icon-btn.danger:not(:disabled)) {
  background: rgba(255, 69, 58, 0.15);
}

:global(.dark .icon-btn.danger:not(:disabled):hover) {
  background: rgba(255, 69, 58, 0.25);
}

</style>
