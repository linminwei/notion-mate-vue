<template>
  <div class="user-manage">
    <!-- 搜索表单 -->
    <a-card :bordered="false" style="margin-bottom: 16px">
      <a-form layout="inline" :model="searchForm">
        <a-form-item label=" 用户名 ">
          <a-input v-model:value="searchForm.username" placeholder=" 请输入用户名 " allow-clear />
        </a-form-item>
        <a-form-item label=" 昵称 ">
          <a-input v-model:value="searchForm.nickname" placeholder=" 请输入昵称 " allow-clear />
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

    <!-- 操作按钮 -->
    <a-card :bordered="false">
      <div style="margin-bottom: 16px">
        <a-space>
          <a-button v-permission="'system:user:add'" type="primary" @click="handleAdd">
            <plus-outlined /> 新增
          </a-button>
          <a-button v-permission="'system:user:delete'" danger :disabled="selectedRowKeys.length === 0" @click="handleBatchDelete">
            <delete-outlined /> 批量删除
          </a-button>
        </a-space>
      </div>

      <!-- 数据表格 -->
      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="pagination"
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 1 ? 'green' : 'red'">
              {{ record.status === 1 ? ' 启用 ' : ' 禁用 ' }}
            </a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a v-permission="'system:user:edit'" @click="handleEdit(record)"> 编辑 </a>
              <a-divider type="vertical" />
              <a-popconfirm title=" 确定要删除吗？" @confirm="handleDelete(record.id)">
                <a v-permission="'system:user:delete'" style="color: #ff4d4f"> 删除 </a>
              </a-popconfirm>
              <a-divider type="vertical" />
              <a-popconfirm title=" 确定要重置密码吗？" @confirm="handleResetPwd(record.id)">
                <a v-permission="'system:user:edit'"> 重置密码 </a>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 新增 / 编辑弹窗 -->
    <a-modal v-model:open="modalVisible" :title="modalTitle" :confirm-loading="submitLoading" @ok="handleSubmit">
      <a-form ref="formRef" :model="formState" :rules="rules" :label-col="{ span: 5 }">
        <a-form-item label=" 用户名 " name="username">
          <a-input v-model:value="formState.username" placeholder=" 请输入用户名 " :disabled="!!formState.id" />
        </a-form-item>
        <a-form-item v-if="!formState.id" label=" 密码 " name="password">
          <a-input-password v-model:value="formState.password" placeholder=" 请输入密码 " />
        </a-form-item>
        <a-form-item label=" 昵称 " name="nickname">
          <a-input v-model:value="formState.nickname" placeholder=" 请输入昵称 " />
        </a-form-item>
        <a-form-item label=" 邮箱 " name="email">
          <a-input v-model:value="formState.email" placeholder=" 请输入邮箱 " />
        </a-form-item>
        <a-form-item label=" 手机号 " name="phone">
          <a-input v-model:value="formState.phone" placeholder=" 请输入手机号 " />
        </a-form-item>
        <a-form-item label=" 状态 " name="status">
          <a-radio-group v-model:value="formState.status">
            <a-radio :value="1"> 启用 </a-radio>
            <a-radio :value="0"> 禁用 </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label=" 角色 " name="roleIds">
          <a-select v-model:value="formState.roleIds" mode="multiple" placeholder=" 请选择角色 ">
            <a-select-option v-for="role in roleList" :key="role.id" :value="role.id">
              {{ role.roleName }}
            </a-select-option>
          </a-select>
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
import { SearchOutlined, RedoOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { getUserPage, addUser, updateUser, deleteUser, deleteUserBatch, resetPassword } from '@/api/user.ts'
import { getRoleList } from '@/api/role.ts'
import type { SysUser, SysRole } from '@/types'
import type { FormInstance, Rule } from 'ant-design-vue/es/form'
import type { TablePaginationConfig } from 'ant-design-vue'

// 表单数据类型
interface UserFormState extends Partial<SysUser> {
  password?: string
}

const columns = [
  { title: ' 用户名 ', dataIndex: 'username', key: 'username' },
  { title: ' 昵称 ', dataIndex: 'nickname', key: 'nickname' },
  { title: ' 邮箱 ', dataIndex: 'email', key: 'email' },
  { title: ' 手机号 ', dataIndex: 'phone', key: 'phone' },
  { title: ' 状态 ', dataIndex: 'status', key: 'status' },
  { title: ' 创建时间 ', dataIndex: 'createTime', key: 'createTime' },
  { title: ' 操作 ', key: 'action', width: 220 }
]

const loading = ref(false)
const tableData = ref<SysUser[]>([])
const selectedRowKeys = ref<string[]>([])
const roleList = ref<SysRole[]>([])

const searchForm = reactive({
  username: '',
  nickname: '',
  status: undefined as number | undefined,
  pageNum: 1,
  pageSize: 10
})

const pagination = reactive<TablePaginationConfig>({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => ` 共 ${total} 条 `
})

const modalVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const formState = reactive<UserFormState>({
  id: undefined,
  username: '',
  password: '',
  nickname: '',
  email: '',
  phone: '',
  status: 1,
  roleIds: [],
  remark: ''
})

const modalTitle = computed(() => formState.id ? ' 编辑用户 ' : ' 新增用户 ')

const rules: Record<string, Rule[]> = {
  username: [{ required: true, message: ' 请输入用户名 ', trigger: 'blur' }],
  password: [{ required: true, message: ' 请输入密码 ', trigger: 'blur' }]
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getUserPage(searchForm)
    tableData.value = res.data.list
    pagination.total = res.data.total
    pagination.current = res.data.pageNum
  } finally {
    loading.value = false
  }
}

const fetchRoles = async () => {
  const res = await getRoleList()
  roleList.value = res.data
}

const handleSearch = () => {
  searchForm.pageNum = 1
  fetchData()
}

const handleReset = () => {
  searchForm.username = ''
  searchForm.nickname = ''
  searchForm.status = undefined
  searchForm.pageNum = 1
  fetchData()
}

const handleTableChange = (pag: TablePaginationConfig) => {
  searchForm.pageNum = pag.current || 1
  searchForm.pageSize = pag.pageSize || 10
  pagination.current = pag.current || 1
  pagination.pageSize = pag.pageSize || 10
  fetchData()
}

const onSelectChange = (keys: string[]) => {
  selectedRowKeys.value = keys
}

const handleAdd = () => {
  Object.assign(formState, {
    id: undefined,
    username: '',
    password: '',
    nickname: '',
    email: '',
    phone: '',
    status: 1,
    roleIds: [],
    remark: ''
  })
  modalVisible.value = true
}

const handleEdit = (record: SysUser) => {
  Object.assign(formState, { ...record, password: '' })
  modalVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    submitLoading.value = true
    if (formState.id) {
      await updateUser(formState)
      message.success(' 修改成功 ')
    } else {
      await addUser(formState)
      message.success(' 新增成功 ')
    }
    modalVisible.value = false
    fetchData()
  } catch (error) {
    // validation failed
  } finally {
    submitLoading.value = false
  }
}

const handleDelete = async (id: string) => {
  await deleteUser(id)
  message.success(' 删除成功 ')
  fetchData()
}

const handleBatchDelete = async () => {
  await deleteUserBatch(selectedRowKeys.value)
  message.success(' 删除成功 ')
  selectedRowKeys.value = []
  fetchData()
}

const handleResetPwd = async (id: string) => {
  await resetPassword(id, '123456')
  message.success(' 密码已重置为 123456')
}

onMounted(() => {
  fetchData()
  fetchRoles()
})
</script>

<style scoped>
.user-manage {
  padding: 0;
}
</style>
