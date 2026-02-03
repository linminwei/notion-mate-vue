<template>
  <div class="menu-manage">
    <a-card :bordered="false">
      <div style="margin-bottom: 16px">
        <a-button v-permission="'system:menu:add'" type="primary" @click="handleAdd()">
          <plus-outlined /> 新增
        </a-button>
      </div>

      <a-table :columns="columns" :data-source="tableData" :loading="loading" :pagination="false" row-key="id" :default-expand-all-rows="true">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'icon'">
            <component v-if="record.icon" :is="getIcon(record.icon)" />
          </template>
          <template v-if="column.key === 'menuType'">
            <a-tag :color="menuTypeColors[record.menuType]">{{ menuTypeLabels[record.menuType] }}</a-tag>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 1 ? 'green' : 'red'">{{ record.status === 1 ? ' 启用 ' : ' 禁用 ' }}</a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a v-permission="'system:menu:add'" v-if="record.menuType !== 3" @click="handleAdd(record.id)"> 添加 </a>
              <a-divider v-if="record.menuType !== 3" type="vertical" />
              <a v-permission="'system:menu:edit'" @click="handleEdit(record)"> 编辑 </a>
              <a-divider type="vertical" />
              <a-popconfirm title=" 确定要删除吗？" @confirm="handleDelete(record.id)">
                <a v-permission="'system:menu:delete'" style="color: #ff4d4f"> 删除 </a>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model:open="modalVisible" :title="modalTitle" :confirm-loading="submitLoading" width="600px" @ok="handleSubmit">
      <a-form ref="formRef" :model="formState" :rules="rules" :label-col="{ span: 5 }">
        <a-form-item label=" 上级菜单 " name="parentId">
          <a-tree-select v-model:value="formState.parentId" :tree-data="menuTreeOptions" :field-names="{ label: 'menuName', value: 'id' }" placeholder=" 请选择上级菜单 " allow-clear tree-default-expand-all />
        </a-form-item>
        <a-form-item label=" 菜单类型 " name="menuType">
          <a-radio-group v-model:value="formState.menuType">
            <a-radio :value="1"> 目录 </a-radio>
            <a-radio :value="2"> 菜单 </a-radio>
            <a-radio :value="3"> 按钮 </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label=" 菜单名称 " name="menuName">
          <a-input v-model:value="formState.menuName" placeholder=" 请输入菜单名称 " />
        </a-form-item>
        <a-form-item v-if="formState.menuType !== 3" label=" 路由路径 " name="path">
          <a-input v-model:value="formState.path" placeholder=" 请输入路由路径 " />
        </a-form-item>
        <a-form-item v-if="formState.menuType === 2" label=" 组件路径 " name="component">
          <a-input v-model:value="formState.component" placeholder=" 请输入组件路径 " />
        </a-form-item>
        <a-form-item v-if="formState.menuType === 3" label=" 权限标识 " name="permission">
          <a-input v-model:value="formState.permission" placeholder=" 请输入权限标识，如： system:user:add" />
        </a-form-item>
        <a-form-item v-if="formState.menuType !== 3" label=" 图标 " name="icon">
          <a-input v-model:value="formState.icon" placeholder=" 请输入图标名称 " />
        </a-form-item>
        <a-form-item label=" 排序 " name="sort">
          <a-input-number v-model:value="formState.sort" :min="0" style="width: 100%" />
        </a-form-item>
        <a-form-item v-if="formState.menuType !== 3" label=" 是否显示 " name="visible">
          <a-radio-group v-model:value="formState.visible">
            <a-radio :value="1"> 显示 </a-radio>
            <a-radio :value="0"> 隐藏 </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label=" 状态 " name="status">
          <a-radio-group v-model:value="formState.status">
            <a-radio :value="1"> 启用 </a-radio>
            <a-radio :value="0"> 禁用 </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, HomeOutlined, UserOutlined, TeamOutlined, MenuOutlined, SettingOutlined, BookOutlined } from '@ant-design/icons-vue'
import { getMenuList, addMenu, updateMenu, deleteMenu } from '@/api/menu'
import type { SysMenu } from '@/types'
import type { FormInstance, Rule } from 'ant-design-vue/es/form'
import type { Component } from 'vue'

const columns = [
  { title: ' 菜单名称 ', dataIndex: 'menuName', key: 'menuName' },
  { title: ' 图标 ', dataIndex: 'icon', key: 'icon', width: 60 },
  { title: ' 类型 ', dataIndex: 'menuType', key: 'menuType', width: 80 },
  { title: ' 路由路径 ', dataIndex: 'path', key: 'path' },
  { title: ' 权限标识 ', dataIndex: 'permission', key: 'permission' },
  { title: ' 排序 ', dataIndex: 'sort', key: 'sort', width: 60 },
  { title: ' 状态 ', dataIndex: 'status', key: 'status', width: 80 },
  { title: ' 操作 ', key: 'action', width: 180 }
]

const menuTypeLabels: Record<number, string> = { 1: ' 目录 ', 2: ' 菜单 ', 3: ' 按钮 ' }
const menuTypeColors: Record<number, string> = { 1: 'blue', 2: 'green', 3: 'orange' }

const iconMap: Record<string, Component> = { HomeOutlined, UserOutlined, TeamOutlined, MenuOutlined, SettingOutlined, BookOutlined }
const getIcon = (name: string) => iconMap[name] || SettingOutlined

const loading = ref(false)
const tableData = ref<SysMenu[]>([])
const menuTreeOptions = computed(() => [{ id: '0', menuName: ' 顶级菜单 ', children: tableData.value }])

const modalVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const formState = reactive<Partial<SysMenu>>({ id: undefined, parentId: '0', menuName: '', menuType: 1, path: '', component: '', permission: '', icon: '', sort: 0, visible: 1, status: 1 })
const modalTitle = computed(() => formState.id ? ' 编辑菜单 ' : ' 新增菜单 ')
const rules: Record<string, Rule[]> = { menuName: [{ required: true, message: ' 请输入菜单名称 ', trigger: 'blur' }], menuType: [{ required: true, message: ' 请选择菜单类型 ', trigger: 'change' }] }

const buildMenuTree = (menus: SysMenu[], parentId = '0'): SysMenu[] => menus.filter(m => m.parentId === parentId).map(m => ({ ...m, children: buildMenuTree(menus, m.id) }))

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getMenuList()
    tableData.value = buildMenuTree(res.data)
  } finally {
    loading.value = false
  }
}

const handleAdd = (parentId = '0') => {
  Object.assign(formState, { id: undefined, parentId, menuName: '', menuType: 1, path: '', component: '', permission: '', icon: '', sort: 0, visible: 1, status: 1 })
  modalVisible.value = true
}

const handleEdit = (record: SysMenu) => { Object.assign(formState, record); modalVisible.value = true }

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    submitLoading.value = true
    if (formState.id) { await updateMenu(formState); message.success(' 修改成功 ') }
    else { await addMenu(formState); message.success(' 新增成功 ') }
    modalVisible.value = false
    fetchData()
  } finally { submitLoading.value = false }
}

const handleDelete = async (id: string) => { await deleteMenu(id); message.success(' 删除成功 '); fetchData() }

onMounted(() => fetchData())
</script>
