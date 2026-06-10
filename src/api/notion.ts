import { request } from '@/utils/request'
import { useUserStore } from '@/stores/user'
import type {
  Datasource,
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
  request.post<Datasource[]>('/datasource/sync', workspaceId, {
    headers: { 'Content-Type': 'text/plain' }
  })

// 修改数据源标题
export const updateDatasourceTitle = (data: { id: string; title: string }) =>
  request.put('/datasource/update-title', data)

// 批量删除数据源
export const deleteDatasourceBatch = (ids: string[]) =>
  request.delete('/datasource', { data: ids })

// 查询数据源属性
export const getDatasourceProperties = (id: string) =>
  request.get<NotionDatasourceProperty[]>(`/datasource/${id}/properties`)

// ==================== SSE 文件上传 ====================

export interface UploadCallbacks {
  onStart?: (event: UploadSSEEvent & { type: 'start' }) => void
  onFileStart?: (event: UploadSSEEvent & { type: 'file_start' }) => void
  onProgress?: (event: UploadSSEEvent & { type: 'progress' }) => void
  onFileComplete?: (event: UploadSSEEvent & { type: 'file_complete' }) => void
  onComplete?: (event: UploadSSEEvent & { type: 'complete' }) => void
  onError?: (event: UploadSSEEvent & { type: 'error' }) => void
}

/**
 * 通过 SSE 流式上传文件到 Notion，支持实时进度回调。
 * 返回 AbortController 用于取消上传。
 */
export const uploadNotionFiles = (
  workspaceId: string,
  files: File[],
  callbacks: UploadCallbacks
): AbortController => {
  const abortController = new AbortController()
  const formData = new FormData()
  formData.append('workspaceId', workspaceId)
  for (const file of files) {
    formData.append('files', file)
  }

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

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const dataStr = line.slice(5).trim()
            if (!dataStr) continue
            try {
              const event = JSON.parse(dataStr) as UploadSSEEvent
              switch (event.type) {
                case 'start':
                  callbacks.onStart?.(event)
                  break
                case 'file_start':
                  callbacks.onFileStart?.(event)
                  break
                case 'progress':
                  callbacks.onProgress?.(event)
                  break
                case 'file_complete':
                  callbacks.onFileComplete?.(event)
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
      }
    })
    .catch((error: Error) => {
      if (error.name === 'AbortError') return
      callbacks.onError?.({ type: 'error', message: error.message || '网络异常' })
    })

  return abortController
}
