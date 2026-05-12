import { request } from '@/utils/request'
import type { SysUser, PageResult, BatchDeleteResult } from '@/types'

// 分页查询用户
export const getUserPage = (params: any) => {
  return request.get<PageResult<SysUser>>('/system/user/page', { params })
}

// 批量删除用户
export const deleteUserBatch = (ids: string[]) => {
  return request.delete<BatchDeleteResult>('/system/user/batch', { data: ids })
}

// 批量修改用户状态
export const batchUpdateStatus = (userIds: string[], status: number) => {
  return request.put<BatchDeleteResult>('/system/user/batch/status', { userIds, status })
}

// 分配用户角色
export const assignUserRoles = (userId: string, roleIds: string[]) => {
  return request.put(`/system/user/${userId}/roles`, { roleIds })
}
