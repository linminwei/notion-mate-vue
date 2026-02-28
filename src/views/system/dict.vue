<template>
  <div class="dict-manage">
    <a-row :gutter="16">
      <!-- 左侧字典类型 -->
      <a-col :span="8">
        <a-card :bordered="false" title="字典类型">
          <!-- 搜索 -->
          <a-form layout="inline" :model="typeSearchForm" style="margin-bottom: 16px">
            <a-form-item>
              <a-input v-model:value="typeSearchForm.dictCode" placeholder="字典编码" allow-clear />
            </a-form-item>
            <a-form-item>
              <a-input v-model:value="typeSearchForm.dictName" placeholder="字典名称" allow-clear />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="handleTypeSearch"><search-outlined /></a-button>
            </a-form-item>
          </a-form>
          <!-- 操作按钮 -->
          <div style="margin-bottom: 16px">
            <a-space>
              <a-button v-permission="'system:dict:add'" type="primary" @click="handleAddType">
                <plus-outlined /> 新增类型
              </a-button>
              <a-button v-permission="'system:dict:delete'" danger :disabled="selectedTypeKeys.length === 0" @click="handleBatchDeleteType">
                <delete-outlined /> 批量删除
              </a-button>
            </a-space>
          </div>
          <!-- 字典类型表格 -->
          <a-table
            :columns="typeColumns"
            :data-source="typeList"
            :loading="typeLoading"
            :pagination="typePagination"
            :row-selection="{ selectedRowKeys: selectedTypeKeys, onChange: onTypeSelectChange }"
            :custom-row="(record: DictType) => ({ onClick: () => handleTypeRowClick(record) })"
            :row-class-name="(record: DictType) => record.id === currentTypeId ? 'type-row-active' : ''"
            row-key="id"
            size="small"
            @change="handleTypeTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'status'">
                <a-tag :color="record.status === 1 ? 'green' : 'red'">
                  {{ record.status === 1 ? '启用' : '禁用' }}
                </a-tag>
              </template>
              <template v-if="column.key === 'action'">
                <a-space>
                  <a v-permission="'system:dict:edit'" @click.stop="handleEditType(record)">编辑</a>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>

      <!-- 右侧字典数据 -->
      <a-col :span="16">
        <a-card :bordered="false" :title="currentTypeName ? `${currentTypeName} - 字典数据` : '字典数据'">
          <!-- 搜索 -->
          <a-form layout="inline" :model="dataSearchForm" style="margin-bottom: 16px">
            <a-form-item label="字典标签">
              <a-input v-model:value="dataSearchForm.dictLabel" placeholder="请输入字典标签" allow-clear />
            </a-form-item>
            <a-form-item label="字典值">
              <a-input v-model:value="dataSearchForm.dictValue" placeholder="请输入字典值" allow-clear />
            </a-form-item>
            <a-form-item label="状态">
              <a-select v-model:value="dataSearchForm.status" placeholder="请选择状态" allow-clear style="width: 120px">
                <a-select-option :value="1">启用</a-select-option>
                <a-select-option :value="0">禁用</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-space>
                <a-button type="primary" @click="handleDataSearch"><search-outlined /> 查询</a-button>
                <a-button @click="handleDataReset"><redo-outlined /> 重置</a-button>
              </a-space>
            </a-form-item>
          </a-form>
          <!-- 操作按钮 -->
          <div style="margin-bottom: 16px">
            <a-space>
              <a-button v-permission="'system:dict:add'" type="primary" :disabled="!currentTypeId" @click="handleAddData">
                <plus-outlined /> 新增数据
              </a-button>
              <a-button v-permission="'system:dict:delete'" danger :disabled="selectedDataKeys.length === 0" @click="handleBatchDeleteData">
                <delete-outlined /> 批量删除
              </a-button>
            </a-space>
          </div>
          <!-- 字典数据表格 -->
          <a-table
            :columns="dataColumns"
            :data-source="dataList"
            :loading="dataLoading"
            :pagination="dataPagination"
            :row-selection="{ selectedRowKeys: selectedDataKeys, onChange: onDataSelectChange }"
            row-key="id"
            @change="handleDataTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'status'">
                <a-tag :color="record.status === 1 ? 'green' : 'red'">
                  {{ record.status === 1 ? '启用' : '禁用' }}
                </a-tag>
              </template>
              <template v-if="column.key === 'action'">
                <a-space>
                  <a v-permission="'system:dict:edit'" @click="handleEditData(record)">编辑</a>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>

    <!-- 字典类型弹窗 -->
    <a-modal v-model:open="typeModalVisible" :title="typeModalTitle" :confirm-loading="typeSubmitLoading" @ok="handleTypeSubmit">
      <a-form ref="typeFormRef" :model="typeFormState" :rules="typeRules" :label-col="{ span: 5 }">
        <a-form-item label="字典编码" name="dictCode">
          <a-input v-model:value="typeFormState.dictCode" placeholder="请输入字典编码" :disabled="!!typeFormState.id" />
        </a-form-item>
        <a-form-item label="字典名称" name="dictName">
          <a-input v-model:value="typeFormState.dictName" placeholder="请输入字典名称" />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-radio-group v-model:value="typeFormState.status">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="typeFormState.remark" placeholder="请输入备注" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 字典数据弹窗 -->
    <a-modal v-model:open="dataModalVisible" :title="dataModalTitle" :confirm-loading="dataSubmitLoading" @ok="handleDataSubmit">
      <a-form ref="dataFormRef" :model="dataFormState" :rules="dataRules" :label-col="{ span: 5 }">
        <a-form-item label="字典类型" name="dictTypeId">
          <a-select v-model:value="dataFormState.dictTypeId" placeholder="请选择字典类型" disabled>
            <a-select-option v-for="type in typeList" :key="type.id" :value="type.id">
              {{ type.dictName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="字典标签" name="dictLabel">
          <a-input v-model:value="dataFormState.dictLabel" placeholder="请输入字典标签" />
        </a-form-item>
        <a-form-item label="字典值" name="dictValue">
          <a-input v-model:value="dataFormState.dictValue" placeholder="请输入字典值" />
        </a-form-item>
        <a-form-item label="排序" name="sort">
          <a-input-number v-model:value="dataFormState.sort" :min="0" style="width: 100%" />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-radio-group v-model:value="dataFormState.status">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="dataFormState.remark" placeholder="请输入备注" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import { SearchOutlined, RedoOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import {
  getDictTypePage, addDictType, updateDictType, deleteDictTypeBatch,
  getDictDataPage, addDictData, updateDictData, deleteDictDataBatch
} from '@/api/dict.ts'
import type { DictType, DictData } from '@/types'
import type { FormInstance, Rule } from 'ant-design-vue/es/form'
import type { TablePaginationConfig } from 'ant-design-vue'

// ==================== 字典类型相关 ====================

const typeColumns = [
  { title: '字典编码', dataIndex: 'dictCode', key: 'dictCode', ellipsis: true },
  { title: '字典名称', dataIndex: 'dictName', key: 'dictName', ellipsis: true },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
  { title: '操作', key: 'action', width: 120 }
]

const typeLoading = ref(false)
const typeList = ref<DictType[]>([])
const selectedTypeKeys = ref<string[]>([])
const currentTypeId = ref<string>('')
const currentTypeName = ref<string>('')

const typeSearchForm = reactive({
  dictCode: '',
  dictName: ''
})

const typePagination = reactive<TablePaginationConfig>({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`
})

const typeModalVisible = ref(false)
const typeSubmitLoading = ref(false)
const typeFormRef = ref<FormInstance>()
const typeFormState = reactive({
  id: '',
  dictCode: '',
  dictName: '',
  status: 1,
  remark: ''
})

const typeModalTitle = computed(() => typeFormState.id ? '编辑字典类型' : '新增字典类型')

const typeRules: Record<string, Rule[]> = {
  dictCode: [{ required: true, message: '请输入字典编码', trigger: 'blur' }],
  dictName: [{ required: true, message: '请输入字典名称', trigger: 'blur' }]
}

const fetchTypeList = async () => {
  typeLoading.value = true
  try {
    const res = await getDictTypePage({
      pageNum: typePagination.current,
      pageSize: typePagination.pageSize,
      dictCode: typeSearchForm.dictCode,
      dictName: typeSearchForm.dictName
    })
    typeList.value = res.data.list
    typePagination.total = res.data.total
  } finally {
    typeLoading.value = false
  }
}

const handleTypeSearch = () => {
  typePagination.current = 1
  fetchTypeList()
}

const handleTypeTableChange = (pag: TablePaginationConfig) => {
  typePagination.current = pag.current || 1
  typePagination.pageSize = pag.pageSize || 10
  fetchTypeList()
}

const onTypeSelectChange = (keys: (string | number)[]) => {
  selectedTypeKeys.value = keys as string[]
}

const handleTypeRowClick = (record: DictType) => {
  currentTypeId.value = record.id
  currentTypeName.value = record.dictName
  fetchDataList()
}

const handleAddType = () => {
  Object.assign(typeFormState, {
    id: '',
    dictCode: '',
    dictName: '',
    status: 1,
    remark: ''
  })
  typeModalVisible.value = true
}

const handleEditType = (record: DictType) => {
  Object.assign(typeFormState, { ...record })
  typeModalVisible.value = true
}

const handleTypeSubmit = async () => {
  try {
    await typeFormRef.value?.validate()
    typeSubmitLoading.value = true
    if (typeFormState.id) {
      await updateDictType(typeFormState)
      message.success('修改成功')
    } else {
      await addDictType(typeFormState)
      message.success('新增成功')
    }
    typeModalVisible.value = false
    fetchTypeList()
  } catch (error) {
    // validation failed
  } finally {
    typeSubmitLoading.value = false
  }
}

const handleBatchDeleteType = async () => {
  await deleteDictTypeBatch(selectedTypeKeys.value)
  message.success('删除成功')
  currentTypeId.value = ''
  currentTypeName.value = ''
  selectedTypeKeys.value = []
  dataList.value = []
  fetchTypeList()
}

// ==================== 字典数据相关 ====================

const dataColumns = [
  { title: '字典标签', dataIndex: 'dictLabel', key: 'dictLabel' },
  { title: '字典值', dataIndex: 'dictValue', key: 'dictValue' },
  { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
  { title: '操作', key: 'action', width: 150 }
]

const dataLoading = ref(false)
const dataList = ref<DictData[]>([])
const selectedDataKeys = ref<string[]>([])

const dataSearchForm = reactive({
  dictLabel: '',
  dictValue: '',
  status: undefined as number | undefined,
  pageNum: 1,
  pageSize: 10
})

const dataPagination = reactive<TablePaginationConfig>({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`
})

const dataModalVisible = ref(false)
const dataSubmitLoading = ref(false)
const dataFormRef = ref<FormInstance>()
const dataFormState = reactive({
  id: '',
  dictTypeId: '',
  dictLabel: '',
  dictValue: '',
  sort: 0,
  status: 1,
  remark: ''
})

const dataModalTitle = computed(() => dataFormState.id ? '编辑字典数据' : '新增字典数据')

const dataRules: Record<string, Rule[]> = {
  dictTypeId: [{ required: true, message: '请选择字典类型', trigger: 'change' }],
  dictLabel: [{ required: true, message: '请输入字典标签', trigger: 'blur' }],
  dictValue: [{ required: true, message: '请输入字典值', trigger: 'blur' }]
}

const fetchDataList = async () => {
  if (!currentTypeId.value) {
    dataList.value = []
    return
  }
  dataLoading.value = true
  try {
    const res = await getDictDataPage({
      ...dataSearchForm,
      dictTypeId: currentTypeId.value
    })
    dataList.value = res.data.list
    dataPagination.total = res.data.total
    dataPagination.current = res.data.pageNum
  } finally {
    dataLoading.value = false
  }
}

const handleDataSearch = () => {
  dataSearchForm.pageNum = 1
  fetchDataList()
}

const handleDataReset = () => {
  dataSearchForm.dictLabel = ''
  dataSearchForm.dictValue = ''
  dataSearchForm.status = undefined
  dataSearchForm.pageNum = 1
  fetchDataList()
}

const handleDataTableChange = (pag: TablePaginationConfig) => {
  dataSearchForm.pageNum = pag.current || 1
  dataSearchForm.pageSize = pag.pageSize || 10
  dataPagination.current = pag.current || 1
  dataPagination.pageSize = pag.pageSize || 10
  fetchDataList()
}

const onDataSelectChange = (keys: string[]) => {
  selectedDataKeys.value = keys
}

const handleAddData = () => {
  Object.assign(dataFormState, {
    id: '',
    dictTypeId: currentTypeId.value,
    dictLabel: '',
    dictValue: '',
    sort: 0,
    status: 1,
    remark: ''
  })
  dataModalVisible.value = true
}

const handleEditData = (record: DictData) => {
  Object.assign(dataFormState, { ...record })
  dataModalVisible.value = true
}

const handleDataSubmit = async () => {
  try {
    await dataFormRef.value?.validate()
    dataSubmitLoading.value = true
    if (dataFormState.id) {
      await updateDictData(dataFormState)
      message.success('修改成功')
    } else {
      await addDictData(dataFormState)
      message.success('新增成功')
    }
    dataModalVisible.value = false
    fetchDataList()
  } catch (error) {
    // validation failed
  } finally {
    dataSubmitLoading.value = false
  }
}

const handleBatchDeleteData = async () => {
  await deleteDictDataBatch(selectedDataKeys.value)
  message.success('删除成功')
  selectedDataKeys.value = []
  fetchDataList()
}

onMounted(() => {
  fetchTypeList()
})
</script>

<style scoped>
.dict-manage {
  padding: 0;
}
:deep(.type-row-active) {
  background-color: #e6f7ff !important;
}
:deep(.ant-table-row) {
  cursor: pointer;
}
</style>
