import { request } from '@/utils/request'
import type { NotionDatasource, NotionDatasourceProperty, NotionWorkspace, PageResult } from '@/types'

// 分页查询工作区配置
export const getNotionWorkspacePage = (params: any) =>
  request.get<PageResult<NotionWorkspace>>('/notion/workspace/page', { params })

// 获取当前用户的所有工作区配置
export const getCurrentUserNotionWorkspaces = () =>
  request.get<NotionWorkspace[]>('/notion/workspace/currentUser')

// 新增工作区配置
export const addNotionWorkspace = (data: any) =>
  request.post('/notion/workspace/add', data)

// 编辑工作区配置
export const updateNotionWorkspace = (data: any) =>
  request.put('/notion/workspace/edit', data)

// 批量删除工作区配置
export const deleteNotionWorkspaceBatch = (ids: string[]) =>
  request.delete('/notion/workspace/delete', { data: ids })

// 测试 Notion 连接
export const testNotionConnection = (token: string) =>
  request.get('/notion/connect', { params: { token } })

// 分页查询数据源
export const getNotionDatasourcePage = (params: any) =>
  request.get<PageResult<NotionDatasource>>('/notion/datasource/page', { params })

// 同步数据源
export const syncNotionDatasource = (workspaceId: string) =>
  request.post<NotionDatasource[]>('/notion/datasource/sync', workspaceId, {
    headers: { 'Content-Type': 'text/plain' }
  })

// 修改数据源标题
export const updateNotionDatasourceTitle = (data: { id: string; datasourceTitle: string }) =>
  request.put('/notion/datasource/update-title', data)

// 批量删除数据源
export const deleteNotionDatasourceBatch = (ids: string[]) =>
  request.delete('/notion/datasource', { data: ids })

// 查询数据源属性
export const getNotionDatasourceProperties = (id: string) =>
  request.get<NotionDatasourceProperty[]>(`/notion/datasource/${id}/properties`)
