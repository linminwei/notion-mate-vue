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
  id: number
  username: string
  nickname: string
  email: string
  phone: string
  avatar: string
  gender: number
  roles: string[]
  permissions: string[]
}

export interface MenuItem {
  id: number
  parentId: number
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
  children?: MenuItem[]
}

export interface SysUser {
  id: number
  username: string
  nickname: string
  email: string
  phone: string
  avatar: string
  gender: number
  status: number
  remark: string
  roleIds: number[]
  createTime: string
}

export interface SysRole {
  id: number
  roleCode: string
  roleName: string
  sort: number
  status: number
  remark: string
  menuIds: number[]
}

export interface SysMenu {
  id: number
  parentId: number
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
