<template>
  <div class="role-manage">
    <a-card :bordered="false" style="margin-bottom: 16px">
      <a-form layout="inline" :model="searchForm">
        <a-form-item label=" 角色名称 ">
          <a-input v-model:value="searchForm.roleName" placeholder=" 请输入角色名称 " allow-clear />
        </a-form-item>
        <a-form-item label=" 状态 ">
          <a-select v-model:value="searchForm.status" placeholder=" 请选择状态 " allow-clear style="width: 120px">
            <a-select-option :value="1"> 启用 </a-select-option>
            <a-select-option :value="0"> 禁用 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSearch"><search-outlined /> 查询 </a-button>
            <a-button @click="handleReset"><redo-outlined /> 重置 </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card :bordered="false">
      <div style="margin-bottom: 16px">
        <a-button v-permission="'system:role:add'" type="primary" @click="handleAdd">
          <plus-outlined /> 新增
        </a-button>
      </div>

      <a-table :columns="columns" :data-source="tableData" :loading="loading" :pagination="pagination" row-key="id" @change="handleTableChange">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 1 ? 'green' : 'red'">{{ record.status === 1 ? ' 启用 ' : ' 禁用 ' }}</a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a v-permission="'system:role:edit'" @click="handleEdit(record)"> 编辑 </a>
              <a-divider type="vertical" />
              <a-popconfirm title=" 确定要删除吗？" @confirm="handleDelete(record.id)">
                <a v-permission="'system:role:delete'" style="color: #ff4d4f"> 删除 </a>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model:open="modalVisible" :title="modalTitle" :confirm-loading="submitLoading" width="600px" @ok="handleSubmit">
      <a-form ref="formRef" :model="formState" :rules="rules" :label-col="{ span: 5 }">
        <a-form-item label=" 角色编码 " name="roleCode">
          <a-input v-model:value="formState.roleCode" placeholder=" 请输入角色编码 " />
        </a-form-item>
        <a-form-item label=" 角色名称 " name="roleName">
          <a-input v-model:value="formState.roleName" placeholder=" 请输入角色名称 " />
        </a-form-item>
        <a-form-item label=" 排序 " name="sort">
          <a-input-number v-model:value="formState.sort" :min="0" style="width: 100%" />
        </a-form-item>
        <a-form-item label=" 状态 " name="status">
          <a-radio-group v-model:value="formState.status">
            <a-radio :value="1"> 启用 </a-radio>
            <a-radio :value="0"> 禁用 </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label=" 菜单权限 " name="menuIds">
          <a-tree v-model:checkedKeys="formState.menuIds" :tree-data="menuTreeData" checkable :field-names="{ title: 'menuName', key: 'id' }" />
        </a-form-item>
        <a-form-item label=" 备注 " name="remark">
          <a-textarea v-model:value="formState.remark" placeholder=" 请输入备注 " :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import { SearchOutlined, RedoOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { getRolePage, addRole, updateRole, deleteRole } from '@/api/role.ts'
import { getMenuList } from '@/api/menu.ts'
import type { SysRole, SysMenu } from '@/types'
import type { FormInstance, Rule } from 'ant-design-vue/es/form'

const columns = [
  { title: ' 角色编码 ', dataIndex: 'roleCode', key: 'roleCode' },
  { title: ' 角色名称 ', dataIndex: 'roleName', key: 'roleName' },
  { title: ' 排序 ', dataIndex: 'sort', key: 'sort' },
  { title: ' 状态 ', dataIndex: 'status', key: 'status' },
  { title: ' 操作 ', key: 'action', width: 150 }
]

const loading = ref(false)
const tableData = ref<SysRole[]>([])
const menuTreeData = ref<SysMenu[]>([])

const searchForm = reactive({ roleName: '', status: undefined as number | undefined, pageNum: 1, pageSize: 10 })
const pagination = reactive({ current: 1, pageSize: 10, total: 0, showTotal: (total: number) => ` 共 ${total} 条 ` })

const modalVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const formState = reactive<Partial<SysRole>>({ id: undefined, roleCode: '', roleName: '', sort: 0, status: 1, menuIds: [], remark: '' })
const modalTitle = computed(() => formState.id ? ' 编辑角色 ' : ' 新增角色 ')

const rules: Record<string, Rule[]> = {
  roleCode: [{ required: true, message: ' 请输入角色编码 ', trigger: 'blur' }],
  roleName: [{ required: true, message: ' 请输入角色名称 ', trigger: 'blur' }]
}

const buildMenuTree = (menus: SysMenu[], parentId = '0'): SysMenu[] => {
  return menus.filter(m => m.parentId === parentId).map(m => ({ ...m, children: buildMenuTree(menus, m.id) }))
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getRolePage(searchForm)
    tableData.value = res.data.list
    pagination.total = res.data.total
  } finally {
    loading.value = false
  }
}

const fetchMenus = async () => {
  const res = await getMenuList()
  menuTreeData.value = buildMenuTree(res.data)
}

const handleSearch = () => { searchForm.pageNum = 1; fetchData() }
const handleReset = () => { searchForm.roleName = ''; searchForm.status = undefined; searchForm.pageNum = 1; fetchData() }
const handleTableChange = (pag: any) => { searchForm.pageNum = pag.current; searchForm.pageSize = pag.pageSize; fetchData() }

const handleAdd = () => {
  Object.assign(formState, { id: undefined, roleCode: '', roleName: '', sort: 0, status: 1, menuIds: [], remark: '' })
  modalVisible.value = true
}

const handleEdit = (record: SysRole) => {
  Object.assign(formState, record)
  modalVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    submitLoading.value = true
    if (formState.id) {
      await updateRole(formState)
      message.success(' 修改成功 ')
    } else {
      await addRole(formState)
      message.success(' 新增成功 ')
    }
    modalVisible.value = false
    fetchData()
  } finally {
    submitLoading.value = false
  }
}

const handleDelete = async (id: string) => {
  await deleteRole(id)
  message.success(' 删除成功 ')
  fetchData()
}

onMounted(() => { fetchData(); fetchMenus() })
</script>
