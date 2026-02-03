import { request } from '@/utils/request'
import type { SysUser, PageResult } from '@/types'

// 分页查询用户
export const getUserPage = (params: any) => {
  return request.get<PageResult<SysUser>>('/system/user/page', { params })
}

// 查询所有用户
export const getUserList = () => {
  return request.get<SysUser[]>('/system/user/list')
}

// 根据 ID 查询用户
export const getUserById = (id: string) => {
  return request.get<SysUser>(`/system/user/${id}`)
}

// 新增用户
export const addUser = (data: any) => {
  return request.post('/system/user', data)
}

// 修改用户
export const updateUser = (data: any) => {
  return request.put('/system/user', data)
}

// 删除用户
export const deleteUser = (id: string) => {
  return request.delete(`/system/user/${id}`)
}

// 批量删除用户
export const deleteUserBatch = (ids: string[]) => {
  return request.delete('/system/user/batch', { data: ids })
}

// 重置密码
export const resetPassword = (id: string, newPassword: string) => {
  return request.put(`/system/user/${id}/password`, null, { params: { newPassword } })
}
