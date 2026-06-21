import { request } from '@/utils/request'
import type { ExtensionVo, PageResult } from '@/types'

export const getExtensionPage = (params: any) => {
  return request.get<PageResult<ExtensionVo>>('/extension/page', { params })
}

export const syncExtension = () => {
  return request.post<number>('/extension/sync')
}
