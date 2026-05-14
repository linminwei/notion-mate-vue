import { request } from '@/utils/request'
import type { SysMenu } from '@/types'

// 获取所有菜单列表
export const getMenuList = () => {
  return request.get<SysMenu[]>('/system/menu/list')
}

export const getMenuById = (id: string) => {
  return request.get<SysMenu>(`/system/menu/${id}`)
}

export const addMenu = (data: any) => {
  return request.post('/system/menu', data)
}

export const updateMenu = (data: any) => {
  return request.put('/system/menu', data)
}

export const deleteMenu = (id: string) => {
  return request.delete(`/system/menu/${id}`)
}

export const batchSortMenu = (items: { id: string; sort: number }[]) =>
  request.put('/system/menu/batch-sort', { items })

export const assignMenu = (data: { roleId: string; menuIds: string[] }) =>
  request.post('/system/menu/assign', data)

export const getRoleMenuTree = (roleId: string) => {
  return request.get<any[]>('/system/menu/role/' + roleId)
}

export const getMenuAssignedRoles = (menuId: string) => {
  return request.get<any[]>('/system/menu/' + menuId + '/assigned-roles')
}
