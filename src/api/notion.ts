import { request } from '@/utils/request'
import { useUserStore } from '@/stores/user'
import type {
  DatasourceVo,
  NotionDatasourceProperty,
  WorkspaceVo,
  Workspace,
  PageResult,
  UploadSSEEvent,
} from '@/types'

// 分页查询工作区配置
export const getWorkspacePage = (params: any) =>
  request.get<PageResult<WorkspaceVo>>('/workspace/page', { params })

// 获取当前用户的所有工作区配置
export const getCurrentUserWorkspaces = () =>
  request.get<Workspace[]>('/workspace/currentUser')

// 新增工作区配置
export const addWorkspace = (data: any) =>
  request.post('/workspace/add', data)

// 编辑工作区配置
export const updateWorkspace = (data: any) =>
  request.put('/workspace/edit', data)

// 批量删除工作区配置
export const deleteWorkspaceBatch = (ids: string[]) =>
  request.delete('/workspace/delete', { data: ids })

// 测试 Notion 连接
export const testWorkspaceConnection = (token: string) =>
  request.get('/workspace/connect', { params: { token } })

// 分页查询数据源
export const getDatasourcePage = (params: any) =>
  request.get<PageResult<DatasourceVo>>('/datasource/page', { params })

// 同步数据源
export const syncDatasource = (workspaceId: string) =>
  request.post<number>('/datasource/sync', workspaceId, {
    headers: { 'Content-Type': 'text/plain' }
  })

// 修改数据源标题
export const updateDatasourceTitle = (data: { id: string; title: string }) =>
  request.put('/datasource/title/update', data)

// 修改数据源图标
export const updateDatasourceIcon = (data: { id: string; uploadId: string }) =>
  request.put('/datasource/icon/update', data)

// 批量删除数据源
export const deleteDatasourceBatch = (ids: string[]) =>
  request.delete('/datasource/delete', { data: ids })

// 查询数据源属性
export const getDatasourceProperties = (id: string) =>
  request.get<NotionDatasourceProperty[]>(`/datasource/${id}/properties`)

// 修改数据源属性
export const updateDatasourceProperty = (data: { id: string; property?: { name?: string; type?: string; options?: { name: string; color: string }[]; prefix?: string; relation?: { relationMode: string; datasourceId: string; dualPropertyName?: string } }; sort?: number }) =>
  request.put('/datasource/property/update', data)

// 新增数据源属性
export const addDatasourceProperty = (data: { datasourceId: string; property: { name: string; type: string; prefix?: string; options?: { name: string; color: string }[]; relation?: { relationMode: string; datasourceId: string; dualPropertyName?: string } } }) =>
  request.post('/datasource/add', data)

// 删除数据源属性
export const deleteDatasourceProperty = (propertyId: string) =>
  request.delete(`/datasource/property/delete/${propertyId}`)

// ==================== SSE 文件上传 ====================

export interface UploadCallbacks {
  onStart?: (event: UploadSSEEvent & { type: 'start' }) => void
  onProgress?: (event: UploadSSEEvent & { type: 'progress' }) => void
  onComplete?: (event: UploadSSEEvent & { type: 'complete' }) => void
  onError?: (event: UploadSSEEvent & { type: 'error' }) => void
}

/**
 * 通过 SSE 流式上传单个文件到 Notion，支持实时进度回调。
 * 返回 AbortController 用于取消上传。
 */
export const uploadNotionFile = (
  workspaceId: string,
  file: File,
  callbacks: UploadCallbacks
): AbortController => {
  const abortController = new AbortController()
  const formData = new FormData()
  formData.append('workspaceId', workspaceId)
  formData.append('file', file)

  const userStore = useUserStore()
  const headers: Record<string, string> = {}
  if (userStore.token) {
    headers['Authorization'] = `Bearer ${userStore.token}`
  }

  fetch('/api/file/upload', {
    method: 'POST',
    headers,
    body: formData,
    signal: abortController.signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`上传请求失败: HTTP ${response.status}`)
      }
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('浏览器不支持流式响应')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      const processSSELine = (line: string) => {
        if (line.startsWith('data:')) {
          const dataStr = line.slice(5).trim()
          if (!dataStr) return
          try {
            const event = JSON.parse(dataStr) as UploadSSEEvent
            switch (event.type) {
              case 'start':
                callbacks.onStart?.(event)
                break
              case 'progress':
                callbacks.onProgress?.(event)
                break
              case 'complete':
                callbacks.onComplete?.(event)
                break
              case 'error':
                callbacks.onError?.(event)
                break
            }
          } catch {
            // 忽略无法解析的行
          }
        }
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          processSSELine(line)
        }
      }

      // 流结束后处理 buffer 中残留的最后一条事件
      if (buffer) {
        processSSELine(buffer)
      }
    })
    .catch((error: Error) => {
      if (error.name === 'AbortError') return
      callbacks.onError?.({ type: 'error', message: error.message || '网络异常' })
    })

  return abortController
}
