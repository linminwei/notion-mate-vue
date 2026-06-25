import { request } from '@/utils/request'
import type { BookVo, PageResult } from '@/types'

export const getBookPage = (params: any) => {
  return request.get<PageResult<BookVo>>('/book/page', { params })
}
