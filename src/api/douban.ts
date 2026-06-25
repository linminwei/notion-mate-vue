import { request } from '@/utils/request'
import type { DoubanSearchBookVo, DoubanBookDetailVo } from '@/types'

export const searchBook = (keyword: string) => {
  return request.get<DoubanSearchBookVo[]>('/douban/book/search', { params: { keyword } })
}

export const getBookDetail = (doubanId: string) => {
  return request.get<DoubanBookDetailVo>(`/douban/book/detail/${doubanId}`)
}
