import { request } from '@/utils/request'
import { useUserStore } from '@/stores/user'
import type {NotionDatasourceProperty, Workspace, PageResult, WorkspaceVo, DatasourceVo} from '@/types'

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
  request.post('/datasource/sync', workspaceId, {
    headers: { 'Content-Type': 'text/plain' }
  })

// 修改数据源标题
export const updateDatasourceTitle = (data: { id: string; title: string }) =>
  request.put('/datasource/update-title', data)

// 批量删除数据源
export const deleteDatasourceBatch = (ids: string[]) =>
  request.delete('/datasource/delete', { data: ids })

// 查询数据源属性
export const getDatasourceProperties = (id: string) =>
  request.get<NotionDatasourceProperty[]>(`/datasource/${id}/properties`)

// SSE 进度事件类型
// 事件流: start → file_start (×N) → progress (×M) → file_complete (×N) → complete
export interface UploadProgressEvent {
  type: 'start' | 'file_start' | 'progress' | 'file_complete' | 'complete' | 'error'
  // start 事件: files 为文件清单
  fileCount?: number
  totalBytes?: number
  files?: { name: string; size: number }[] | { sysId: string; notionId: string; url: string }[]
  // file_start 事件
  fileIndex?: number
  fileName?: string
  mode?: string           // 'single_part' | 'multi_part'
  numberOfParts?: number  // 多分片模式下的分片总数
  // progress 事件
  uploadedBytes?: number
  // file_complete 事件
  id?: string             // Notion 文件 ID
  url?: string            // Notion 文件 URL
  // error 事件
  message?: string
}

// 上传多个文件到 Notion（SSE 进度推送）
export const uploadFilesToNotion = (
  workspaceId: string,
  files: File[],
  onEvent: (event: UploadProgressEvent) => void
): Promise<{ sysId: string; notionId: string; url: string }[]> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('workspaceId', workspaceId)
    files.forEach(file => formData.append('files', file))

    const userStore = useUserStore()
    const headers: Record<string, string> = { 'Accept': 'text/event-stream' }
    if (userStore.token) {
      headers['Authorization'] = `Bearer ${userStore.token}`
    }

    fetch('/api/file/upload', {
      method: 'POST',
      body: formData,
      headers
    }).then(async response => {
      if (!response.ok) {
        reject(new Error(`HTTP ${response.status}: ${response.statusText}`))
        return
      }

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let results: { sysId: string; notionId: string; url: string }[] = []

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          // SSE 数据格式: "data:{...}\n\n"
          const lines = buffer.split('\n')
          buffer = lines.pop() || '' // 保留不完整的行

          for (const line of lines) {
            if (line.startsWith('data:')) {
              const json = line.substring(5).trim()
              if (!json) continue
              try {
                const event: UploadProgressEvent = JSON.parse(json)
                onEvent(event)
                if (event.type === 'complete' && event.files) {
                  const completeFiles = event.files as { sysId: string; notionId: string; url: string }[]
                  results = completeFiles
                  resolve(results)
                } else if (event.type === 'error') {
                  reject(new Error(event.message || '上传失败'))
                }
              } catch {
                // 忽略解析失败的行
              }
            }
          }
        }
        // 如果流结束但没有 complete 事件
        if (results.length === 0) {
          reject(new Error('上传异常终止'))
        }
      } catch (e) {
        reject(e)
      }
    }).catch(reject)
  })
}
