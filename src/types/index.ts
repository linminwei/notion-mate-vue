// 类型定义
export interface Result<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
}

export interface PageResult<T = any> {
  pageNum: number
  pageSize: number
  total: number
  pages: number
  list: T[]
}

export interface LoginForm {
  username: string
  password: string
}

export interface RegisterForm {
  username: string
  nickname: string
  email: string
  phone: string
  avatar?: string
  password: string
  confirmPassword: string
  captcha: string
}

// 手机号换绑表单
export interface ChangePhoneForm {
  oldPhone: string
  oldCaptcha: string
  newPhone: string
  newCaptcha: string
}

// 当前用户资料修改表单
export interface UserCurrentUpdateForm {
  avatar?: string
  nickname?: string
}

export interface LoginResult {
  accessToken: string
  tokenType: string
  expiresIn: number
}

export interface UserInfo {
  id: string
  username: string
  nickname: string
  email: string
  phone: string
  avatar: string
  status: number
  roles: SysRole[]
  permissions: string[]
  menuTree: MenuItem[]
}

export interface MenuItem {
  id: string
  parentId: string
  menuName: string
  menuType: number
  path: string
  component: string
  permission: string
  icon: string
  sort: number
  status: number
  children?: MenuItem[]
}

export interface SysUser {
  id: string
  username: string
  nickname: string
  email: string
  phone: string
  avatar: string
  status: number
  remark: string
  roles: SysRole[]
  roleIds: string[]
  createTime: string
}

export interface SysRole {
  id: string
  roleCode: string
  roleName: string
  sort: number
  status: number
  remark: string
  menuIds: string[]
}

export interface SysMenu {
  id: string
  parentId: string
  menuName: string
  menuType: number
  path: string
  component: string
  permission: string
  icon: string
  sort: number
  status: number
  children?: SysMenu[]
}

// 字典类型
export interface DictType {
  id: string
  dictCode: string
  dictName: string
  status: number
  remark: string
  createTime: string
}

// 字典数据
export interface DictData {
  id: string
  dictTypeId: string
  dictLabel: string
  dictValue: string
  sort: number
  status: number
  remark: string
  createTime: string
}

// 工作区配置
export interface WorkspaceVo {
  id: string
  name: string
  code: string
  icon: string
  token: string
  createTime: string
  updateTime: string
  createBy: string
}


export interface Workspace {
  id: string
  name: string
  code: string
  icon: string
  token: string
  createTime: string
  createBy: string
}

// Notion 数据源
export interface Datasource {
  id: string
  workspaceId: string
  datasourceId: string
  icon: string
  title: string
  createTime: string
  updateTime: string
  createBy: string
  updateBy: string
}

export interface DatasourceVo {
  id: string
  datasourceId: string
  icon: string
  title: string
  url: string
}

// Notion 数据源属性
export interface NotionDatasourceProperty {
  /** 数据库主键 */
  id: string
  propertyId: string
  propertyName: string
  propertyType: string
  datasourceId: string
  sysDatasourceId: string
  workspaceId: string
  /** 通用配置数据（后端统一返回，替代 options/prefix/relation） */
  str?: any
  /** 选项列表（仅 select / multi_select / status 有效） */
  options?: NotionOption[]
  /** 唯一标识符前缀（仅 unique_id 有效） */
  prefix?: string
  /** 关联配置（仅 relation 有效） */
  relation?: {
    relationMode: string
    datasourceId: string
    dualPropertyName?: string
  }
}

/** Notion 选项对象 */
export interface NotionOption {
  color: string
  id: string
  name: string
  description?: string
}

// ==================== 文件上传 SSE 事件类型 ====================

/** 单文件上传开始事件 */
export interface UploadStartEvent {
  type: 'start'
  fileName: string
  fileSize: number
  contentType: string
}

/** 上传进度事件 */
export interface UploadProgressEvent {
  type: 'progress'
  fileName: string
  uploadedBytes: number
  totalBytes: number
}

/** 上传完成事件 */
export interface UploadCompleteEvent {
  type: 'complete'
  fileId: string
}

/** 上传错误事件 */
export interface UploadErrorEvent {
  type: 'error'
  message: string
}

/** SSE 事件联合类型 */
export type UploadSSEEvent =
  | UploadStartEvent
  | UploadProgressEvent
  | UploadCompleteEvent
  | UploadErrorEvent

// 批量删除结果
export interface BatchDeleteResult {
  allSuccess: boolean
  successCount: number
  failedCount: number
  details: DeleteDetail[]
}

export interface DeleteDetail {
  userId: string
  username: string
  success: boolean
  reason: string | null
}

// ==================== 网址管理 ====================

/** 网站分页查询参数 */
export interface PageWebsiteParams {
  name?: string
  category?: string
  pageNum?: number
  pageSize?: number
}

/** 网站 VO */
export interface WebsiteVo {
  id: string
  pageId: string
  icon: string
  name: string
  description: string
  category: string
  url: string
  webImg: string
}

/** 成人网站分页查询参数 */
export interface PageWebsitePornParams {
  name?: string
  category?: string
  country?: string
  pageNum?: number
  pageSize?: number
}

/** 成人网站 VO */
export interface WebsitePornVo {
  id: string
  pageId: string
  icon: string
  name: string
  description: string
  category: string
  country: string
  url: string
  webImg: string
}

// ==================== 扩展管理 ====================

// ==================== 软件管理 ====================

/** 软件分页查询参数 */
export interface PageAppParams {
  name?: string
  category?: string
  device?: string
  pageNum?: number
  pageSize?: number
}

/** 软件 VO */
export interface AppVo {
  id: string
  pageId: string
  icon: string
  name: string
  description: string
  category: string
  devices: string[]
}

// ==================== 扩展管理 ====================

/** 扩展分页查询参数 */
export interface PageExtensionParams {
  name?: string
  category?: string
  pageNum?: number
  pageSize?: number
}

/** 扩展 VO */
export interface ExtensionVo {
  id: string
  pageId: string
  icon: string
  name: string
  description: string
  category: string
  platforms: string[]
  url: string
  webImg: string
}

// ==================== 书籍管理 ====================

/** 新增书籍 DTO — 对应后端 AddBookDTO */
export interface AddBookDTO {
  book: NotionBookPayload
  author: NotionBookAuthorPayload
}

/** NotionBook 对应字段（仅传 Notion 属性值） */
export interface NotionBookPayload {
  cover?: string[]  // Notion 文件上传后的 fileId 列表
  title: string
  isbn?: string
  category?: string
  publisher?: string
  pubDate?: string
  rating?: number
  summary?: string
}

/** NotionBookAuthor 对应字段 */
export interface NotionBookAuthorPayload {
  name: string
  avatar?: string[] // Notion 文件上传后的 fileId 列表
  summary?: string
}

/** 书籍分页查询参数 */
export interface PageBookParams {
  title?: string
  isbn?: string
  category?: string
  author?: string
  pageNum?: number
  pageSize?: number
}

/** 更新书籍 DTO — 对应后端 UpdateBookDTO */
export interface UpdateBookDTO {
  id: string
  title: string
  category?: string
  publisher?: string
  summary?: string
  authorAvatar?: string
  authorName: string
  authorSummary?: string
}

/** 更新作家 DTO — 对应后端 UpdateBookAuthorDTO */
export interface UpdateBookAuthorDTO {
  id: string
  name: string
  avatar?: string
  summary?: string
}

/**
 * 作家分页展示对象
 */
export interface BookAuthorPageVo {
  id: string
  name: string
  avatar: string
  summary: string
  createTime: string
}

/**
 * 作家详情展示对象
 */
export interface BookAuthorDetailVo {
  workspaceId: string
  id: string
  avatar: string
  name: string
  summary: string
  books: BookPageVo[]
}

/**
 * 书籍分页展示对象
 */
export interface BookPageVo {
  id: string
  cover: string
  title: string
  category: string
  isbn: string
  rating: number
  publisher: string
  pubDate: string
  createTime: string
  summary: string
  author: BookAuthorPageVo | null
}

/** 书籍 VO */
export interface BookVo {
  workspaceId: string
  id: string
  pageId: string
  title: string
  cover: string
  category: string
  author: BookAuthorVo | null
  publisher: string
  pubDate: string
  isbn: string
  rating: number
  summary: string
  createTime: string
  inLibrary: boolean
}

// ==================== 豆瓣图书 ====================

/** 图书作者 VO */
export interface BookAuthorVo {
  workspaceId: string
  id: string
  pageId: string
  name: string
  avatar: string
  summary: string
  books: BookVo[]
}

/** 豆瓣图书 VO */
export interface DoubanBookVo {
  doubanId: string
  cover: string
  title: string
  rating: number
  author: string
  publisher: string
  pubDate: string
}

/** 搜索豆瓣图书结果 VO（游标分页） */
export interface SearchDoubanBookVo {
  startCursor: number
  total: number
  books: DoubanBookVo[]
}

/** 搜索豆瓣图书 DTO */
export interface SearchDoubanBookDTO {
  keyword: string
  startCursor?: number
}
