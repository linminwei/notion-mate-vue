import { request } from '@/utils/request'
import type { DictType, DictData, PageResult } from '@/types'

// 字典类型接口
export const getDictTypePage = (params: any) =>
  request.get<PageResult<DictType>>('/system/dict/type/page', { params })

export const addDictType = (data: any) =>
  request.post('/system/dict/type', data)

export const updateDictType = (data: any) =>
  request.put('/system/dict/type', data)

export const deleteDictTypeBatch = (ids: string[]) =>
  request.delete('/system/dict/type/batch', { data: ids })

// 字典数据接口
export const getDictDataPage = (params: any) =>
  request.get<PageResult<DictData>>('/system/dict/data/page', { params })

export const addDictData = (data: any) =>
  request.post('/system/dict/data', data)

export const updateDictData = (data: any) =>
  request.put('/system/dict/data', data)

export const deleteDictDataBatch = (ids: string[]) =>
  request.delete('/system/dict/data/batch', { data: ids })
