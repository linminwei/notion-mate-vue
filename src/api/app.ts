import { request } from '@/utils/request'
import type { AppVo, PageResult } from '@/types'

export const getAppPage = (params: any) => {
  return request.get<PageResult<AppVo>>('/app/page', { params })
}

export const syncApp = () => {
  return request.post<number>('/app/sync')
}
