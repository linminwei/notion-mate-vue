import { request } from '@/utils/request'
import type { SysRole, PageResult } from '@/types'

export const getRolePage = (params: any) => {
  return request.get<PageResult<SysRole>>('/system/role/page', { params })
}

export const getRoleList = () => {
  return request.get<SysRole[]>('/system/role/list')
}

export const getRoleById = (id: number) => {
  return request.get<SysRole>(`/system/role/${id}`)
}

export const addRole = (data: any) => {
  return request.post('/system/role', data)
}

export const updateRole = (data: any) => {
  return request.put('/system/role', data)
}

export const deleteRole = (id: number) => {
  return request.delete(`/system/role/${id}`)
}

export const deleteRoleBatch = (ids: number[]) => {
  return request.delete('/system/role/batch', { data: ids })
}
