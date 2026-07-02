import {request} from '@/utils/request'
import type {BookVo} from '@/types'

export const getBookDetail = (doubanId: string) => {
  return request.get<BookVo>(`/douban/book/detail/${doubanId}`)
}
