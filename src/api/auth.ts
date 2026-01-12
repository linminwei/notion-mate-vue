import { request } from '@/utils/request'
import type { LoginForm, LoginResult, UserInfo, MenuItem } from '@/types'

// 登录
export const login = (data: LoginForm) => {
  return request.post<LoginResult>('/auth/login', data)
}

// 获取用户信息
export const getUserInfo = () => {
  return request.get<UserInfo>('/auth/info')
}

// 获取用户菜单
export const getUserMenus = () => {
  return request.get<MenuItem[]>('/auth/menus')
}

// 退出登录
export const logout = () => {
  return request.post('/auth/logout')
}
