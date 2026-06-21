import { request } from '@/utils/request'
import type { WebsiteVo, WebsitePornVo, PageResult } from '@/types'

export const getWebsitePage = (params: any) => {
  return request.get<PageResult<WebsiteVo>>('/website/page', { params })
}

export const syncWebsite = () => {
  return request.post<number>('/website/sync')
}

export const getWebsitePornPage = (params: any) => {
  return request.get<PageResult<WebsitePornVo>>('/website/porn/page', { params })
}

export const syncWebsitePorn = () => {
  return request.post<number>('/website/porn/sync')
}
