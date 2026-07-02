import { request } from '@/utils/request'
import type { BookVo, PageResult, AddBookDTO, UpdateBookDTO, SearchDoubanBookVo, SearchDoubanBookDTO } from '@/types'

export const getBookPage = (params: any) => {
  return request.get<PageResult<BookVo>>('/book/page', { params })
}

/** 获取书籍详情 */
export const getBookById = (id: string) => {
  return request.post<BookVo>(`/book/${id}`)
}

/** 新增书籍 */
export const addBook = (data: AddBookDTO) => {
  return request.post('/book/add', data)
}

/** 删除书籍 */
export const deleteBook = (ids: string[]) => {
  return request.delete('/book/delete', { data: ids })
}

/** 更新书籍 */
export const updateBook = (data: UpdateBookDTO) => {
  return request.put('/book/update', data)
}

/** 搜索豆瓣图书 */
export const searchBook = (dto: SearchDoubanBookDTO) => {
  return request.post<SearchDoubanBookVo>('/book/douban/search', dto)
}
