// 类型定义
export interface Result<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
}

export interface PageResult<T = any> {
  pageNum: number
  pageSize: number
  total: number
  pages: number
  list: T[]
}

export interface LoginForm {
  username: string
  password: string
}

export interface RegisterForm {
  username: string
  nickname: string
  email: string
  phone: string
  avatar?: string
  password: string
  confirmPassword: string
  captcha: string
}

// 手机号换绑表单
export interface ChangePhoneForm {
  oldPhone: string
  oldCaptcha: string
  newPhone: string
  newCaptcha: string
}

// 当前用户资料修改表单
export interface UserCurrentUpdateForm {
  avatar?: string
  nickname?: string
}

export interface LoginResult {
  accessToken: string
  tokenType: string
  expiresIn: number
}

export interface UserInfo {
  id: string
  username: string
  nickname: string
  email: string
  phone: string
  avatar: string
  status: number
  roles: SysRole[]
  permissions: string[]
  menuTree: MenuItem[]
}

export interface MenuItem {
  id: string
  parentId: string
  menuName: string
  menuType: number
  path: string
  component: string
  permission: string
  icon: string
  sort: number
  status: number
  children?: MenuItem[]
}

export interface SysUser {
  id: string
  username: string
  nickname: string
  email: string
  phone: string
  avatar: string
  status: number
  remark: string
  roles: SysRole[]
  roleIds: string[]
  createTime: string
}

export interface SysRole {
  id: string
  roleCode: string
  roleName: string
  sort: number
  status: number
  remark: string
  menuIds: string[]
}

export interface SysMenu {
  id: string
  parentId: string
  menuName: string
  menuType: number
  path: string
  component: string
  permission: string
  icon: string
  sort: number
  status: number
  children?: SysMenu[]
}

// 字典类型
export interface DictType {
  id: string
  dictCode: string
  dictName: string
  status: number
  remark: string
  createTime: string
}

// 字典数据
export interface DictData {
  id: string
  dictTypeId: string
  dictLabel: string
  dictValue: string
  sort: number
  status: number
  remark: string
  createTime: string
}

// 工作区配置
export interface WorkspaceVo {
  id: string
  name: string
  code: string
  icon: string
  token: string
  createTime: string
  updateTime: string
  createBy: string
}


export interface Workspace {
  id: string
  name: string
  code: string
  icon: string
  token: string
  createTime: string
  createBy: string
}

// Notion 数据源
export interface Datasource {
  id: string
  workspaceId: string
  datasourceId: string
  icon: string
  title: string
  createTime: string
  updateTime: string
  createBy: string
  updateBy: string
}

export interface DatasourceVo {
  id: string
  datasourceId: string
  iconUrl: string
  title: string
}

// Notion 数据源属性
export interface NotionDatasourceProperty {
  id: string
  propertyId: string
  propertyName: string
  propertyType: string
  datasourceId: string
  createTime: string
  updateTime: string
}

// 批量删除结果
export interface BatchDeleteResult {
  allSuccess: boolean
  successCount: number
  failedCount: number
  details: DeleteDetail[]
}

export interface DeleteDetail {
  userId: string
  username: string
  success: boolean
  reason: string | null
}
