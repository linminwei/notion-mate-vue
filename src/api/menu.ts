import { request } from '@/utils/request'
import type { SysMenu, MenuItem } from '@/types'

export const getMenuTree = () => {
  return request.get<MenuItem[]>('/system/menu/tree')
}

export const getMenuList = () => {
  return request.get<SysMenu[]>('/system/menu/list')
}

export const getMenuById = (id: number) => {
  return request.get<SysMenu>(`/system/menu/${id}`)
}

export const addMenu = (data: any) => {
  return request.post('/system/menu', data)
}

export const updateMenu = (data: any) => {
  return request.put('/system/menu', data)
}

export const deleteMenu = (id: number) => {
  return request.delete(`/system/menu/${id}`)
}
