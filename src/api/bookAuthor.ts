import {request} from '@/utils/request'
import type {BookAuthorDetailVo, BookAuthorPageVo, PageResult, UpdateBookAuthorDTO} from '@/types'

/**
 * 分页查询作家数据
 * @param params 分页传输对象
 */
export const pageBookAuthor = (params: any) => {
  return request.get<PageResult<BookAuthorPageVo>>('/book/author/page', { params })
}

/**
 * 获取作家详情
 * @param id 作家系统唯一标识
 */
export const detailBookAuthor = (id: string) => {
  return request.post<BookAuthorDetailVo>(`/book/author/${id}`)
}

/**
 * 更新作家
 * @param data 更新作家数据传输对象
 */
export const updateBookAuthor = (data: UpdateBookAuthorDTO) => {
  return request.put('/book/author/update', data)
}

/**
 * 删除作家
 * @param ids 作家系统唯一标识集合
 */
export const deleteBookAuthor = (ids: string[]) => {
  return request.delete('/book/author/delete', { data: ids })
}
