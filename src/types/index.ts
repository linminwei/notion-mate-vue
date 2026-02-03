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
  visible: number
  status: number
  keepAlive: number
  children?: SysMenu[]
}
