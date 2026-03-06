<template>
  <div class="menu-manage-container">
    <!-- 操作工具栏 -->
    <div class="table-toolbar">
      <div class="toolbar-left">
        <a-button v-permission="'system:menu:add'" type="primary" @click="handleAdd()">
          <template #icon><plus-outlined /></template>
          新增菜单
        </a-button>
        <a-button @click="toggleExpandAll">
          <template #icon>
            <swap-outlined :rotate="90" />
          </template>
          {{ isExpandedAll ? '折叠全部' : '展开全部' }}
        </a-button>
      </div>
      <div class="toolbar-right">
        <a-tooltip title="刷新数据">
          <a-button shape="circle" type="text" @click="fetchData">
            <template #icon><sync-outlined :spin="loading" /></template>
          </a-button>
        </a-tooltip>
      </div>
    </div>

    <!-- 数据表格 -->
    <a-table
        v-if="refreshTable"
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="false"
        row-key="id"
        :default-expand-all-rows="isExpandedAll"
        :scroll="{ x: 1200 }"
        size="middle"
        bordered
        class="custom-table"
    >
      <template #bodyCell="{ column, record }">
        <!-- 图标列 -->
        <template v-if="column.key === 'icon'">
          <div class="icon-cell">
            <font-awesome-icon
                v-if="record.icon"
                :icon="formatFaIcon(record.icon)"
                class="menu-fa-icon"
            />
            <span v-else class="text-placeholder">-</span>
          </div>
        </template>

        <!-- 菜单类型列 - 强化居中容器 -->
        <template v-if="column.key === 'menuType'">
          <div class="type-cell">
            <a-tag :color="menuTypeColors[record.menuType]" class="type-tag">
              {{ menuTypeLabels[record.menuType] }}
            </a-tag>
          </div>
        </template>

        <!-- 状态列 -->
        <template v-if="column.key === 'status'">
          <a-badge
              :status="record.status === 1 ? 'success' : 'error'"
              :text="record.status === 1 ? '启用' : '禁用'"
          />
        </template>

        <!-- 操作列 -->
        <template v-if="column.key === 'action'">
          <div class="action-btns">
            <a-button
                v-permission="'system:menu:add'"
                v-if="record.menuType !== 3"
                type="link"
                size="small"
                @click="handleAdd(record.id)"
            >
              新增下级
            </a-button>

            <a-divider v-if="record.menuType !== 3" type="vertical" />

            <a-button
                v-permission="'system:menu:edit'"
                type="link"
                size="small"
                @click="handleEdit(record)"
            >
              编辑
            </a-button>

            <a-divider type="vertical" />

            <a-popconfirm
                title="是否确认删除该菜单及其所有子项？"
                ok-text="确认"
                cancel-text="取消"
                @confirm="handleDelete(record.id)"
            >
              <a-button v-permission="'system:menu:delete'" type="link" danger size="small">
                删除
              </a-button>
            </a-popconfirm>
          </div>
        </template>
      </template>
    </a-table>

    <!-- 弹窗表单 -->
    <a-modal
        v-model:open="modalVisible"
        :title="modalTitle"
        :confirm-loading="submitLoading"
        width="680px"
        destroy-on-close
        centered
        @ok="handleSubmit"
    >
      <a-form
          ref="formRef"
          :model="formState"
          :rules="rules"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 18 }"
      >
        <a-form-item label="上级菜单" name="parentId">
          <a-tree-select
              v-model:value="formState.parentId"
              :tree-data="menuTreeOptions"
              :field-names="{ label: 'menuName', value: 'id' }"
              placeholder="请选择上级菜单"
              allow-clear
              show-search
              tree-default-expand-all
              tree-node-filter-prop="menuName"
          />
        </a-form-item>

        <a-form-item label="菜单类型" name="menuType">
          <a-radio-group v-model:value="formState.menuType" button-style="solid">
            <a-radio-button :value="1">目录</a-radio-button>
            <a-radio-button :value="2">菜单</a-radio-button>
            <a-radio-button :value="3">按钮</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="菜单名称" name="menuName">
          <a-input v-model:value="formState.menuName" placeholder="请输入菜单名称" :maxlength="50" show-count />
        </a-form-item>

        <a-form-item v-if="formState.menuType !== 3" name="path">
          <template #label>
            路由路径
            <a-tooltip title="访问的路由地址，如：`user`">
              <question-circle-outlined class="help-icon" />
            </a-tooltip>
          </template>
          <a-input v-model:value="formState.path" placeholder="请输入路由路径" />
        </a-form-item>

        <a-form-item v-if="formState.menuType === 2" name="component">
          <template #label>
            组件路径
            <a-tooltip title="访问的组件路径，如：`system/user/index`">
              <question-circle-outlined class="help-icon" />
            </a-tooltip>
          </template>
          <a-input v-model:value="formState.component" placeholder="请输入组件路径" />
        </a-form-item>

        <a-form-item v-if="formState.menuType === 3" name="permission">
          <template #label>
            权限标识
            <a-tooltip title="权限字符，如：`system:user:add`">
              <question-circle-outlined class="help-icon" />
            </a-tooltip>
          </template>
          <a-input v-model:value="formState.permission" placeholder="请输入权限标识" />
        </a-form-item>

        <!-- 图标输入预览 -->
        <a-form-item v-if="formState.menuType !== 3" label="图标" name="icon">
          <a-input v-model:value="formState.icon" placeholder="例如: fa-solid fa-bars">
            <template #prefix>
              <font-awesome-icon
                  v-if="formState.icon"
                  :icon="formatFaIcon(formState.icon)"
                  style="color: #1890ff; font-size: 16px;"
              />
              <setting-outlined v-else style="color: #d9d9d9" />
            </template>
          </a-input>
          <div class="icon-tip">请输入 FontAwesome 类名，系统将自动转换。示例：fa-solid fa-user</div>
        </a-form-item>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="排序" name="sort" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
              <a-input-number v-model:value="formState.sort" :min="0" :max="9999" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="状态" name="status" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
              <a-switch
                  v-model:checked="formState.status"
                  :checked-value="1"
                  :un-checked-value="0"
                  checked-children="启"
                  un-checked-children="停"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import {
  PlusOutlined, SyncOutlined, SwapOutlined, QuestionCircleOutlined, SettingOutlined
} from '@ant-design/icons-vue'
import { getMenuList, addMenu, updateMenu, deleteMenu } from '@/api/menu.ts'
import type { SysMenu } from '@/types'
import type { FormInstance, Rule } from 'ant-design-vue/es/form'

// --- 表格列定义 ---
const columns = [
  { title: '菜单名称', dataIndex: 'menuName', key: 'menuName', width: 220, ellipsis: true },
  { title: '图标', dataIndex: 'icon', key: 'icon', width: 80, align: 'center' },
  { title: '类型', dataIndex: 'menuType', key: 'menuType', width: 100, align: 'center' },
  { title: '路由路径', dataIndex: 'path', key: 'path', width: 200, ellipsis: true, align: 'center' },
  { title: '权限标识', dataIndex: 'permission', key: 'permission', width: 200, ellipsis: true, align: 'center' },
  { title: '排序', dataIndex: 'sort', key: 'sort', width: 80, align: 'center' },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100, align: 'center' },
  { title: '操作', key: 'action', width: 220, fixed: 'right', align: 'center' }
]

// --- 字典数据 ---
const menuTypeLabels: Record<number, string> = { 1: '目录', 2: '菜单', 3: '按钮' }
const menuTypeColors: Record<number, string> = { 1: 'processing', 2: 'success', 3: 'warning' }

// --- 工具方法：转换 FA 类名为组件识别的格式 ---
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

const isExpandedAll = ref(false)
const refreshTable = ref(true)
const toggleExpandAll = () => {
  isExpandedAll.value = !isExpandedAll.value
  refreshTable.value = false
  nextTick(() => {
    refreshTable.value = true
  })
}

// --- 弹窗与表单 ---
const modalVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const formState = reactive<Partial<SysMenu>>({
  id: undefined, parentId: '0', menuName: '', menuType: 1,
  path: '', component: '', permission: '', icon: '', sort: 0, status: 1
})
const modalTitle = computed(() => formState.id ? '编辑菜单信息' : '新增菜单项')

const rules: Record<string, Rule[]> = {
  menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  menuType: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
  path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }]
}

// --- 方法 ---
const fetchData = async () => {
  loading.value = true
  try {
    const res = await getMenuList()
    tableData.value = res.data
  } catch (error) {
    message.error('获取列表失败')
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
      message.success('更新成功')
    } else {
      await addMenu(formState)
      message.success('创建成功')
    }
    modalVisible.value = false
    fetchData()
  } finally {
    submitLoading.value = false
  }
}

const handleDelete = async (id: string) => {
  try {
    await deleteMenu(id)
    message.success('已成功删除')
    fetchData()
  } catch (error) {
    message.error('删除失败')
  }
}

onMounted(() => fetchData())
</script>

<style scoped>
.menu-manage-container {
  padding: 16px;
  background-color: transparent;
  min-height: 100%;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 4px;
}

.toolbar-left {
  display: flex;
  gap: 12px;
}

.custom-table {
  background: #fff;
  border-radius: 8px !important;
  overflow: hidden !important;
}

:deep(.ant-table) { border-radius: 8px !important; }
:deep(.ant-table-container) { border-radius: 8px !important; }

:deep(.ant-table-thead > tr > th:first-child) { border-top-left-radius: 8px !important; }
:deep(.ant-table-thead > tr > th:last-child) { border-top-right-radius: 8px !important; }

:deep(.ant-table-tbody > tr:nth-child(odd)) {
  background-color: rgba(0, 0, 0, 0.015);
}

:deep(.ant-table-tbody > tr:hover > td) {
  background-color: rgba(24, 144, 255, 0.05) !important;
}

.icon-cell {
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 完美居中关键样式 */
.type-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%; /* 填满单元格 */
}

.type-tag {
  margin: 0 !important; /* 强制去除 Ant Design Tag 默认的 margin-right */
  min-width: 60px;
  text-align: center;
  font-weight: 500;
}

.menu-fa-icon {
  color: #555;
}

.action-btns {
  display: flex;
  align-items: center;
  justify-content: center;
}

.help-icon {
  margin-left: 4px;
  color: #999;
  font-size: 14px;
  cursor: help;
}

.icon-tip {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.text-placeholder {
  color: rgba(0, 0, 0, 0.25);
}
</style>