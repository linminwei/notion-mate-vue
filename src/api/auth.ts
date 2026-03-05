import { request } from '@/utils/request'
import type { LoginForm, LoginResult, UserInfo, RegisterForm, ChangePhoneForm, UserCurrentUpdateForm } from '@/types'

// 登录
export const login = (data: LoginForm) => {
  return request.post<LoginResult>('/auth/login', data)
}

// 手机号登录
export const loginByPhone = (phone: string, captcha: string) => {
  return request.post<LoginResult>('/auth/login-by-phone', { phone, captcha })
}

// 获取当前用户信息（包含菜单树）
export const getUserInfo = () => {
  return request.get<UserInfo>('/auth/current')
}

// 发送验证码
export const sendCaptcha = (phone: string) => {
  return request.post('/auth/send-captcha', null, { params: { phone } })
}

// 校验验证码
export const verifyCaptcha = (phone: string, captcha: string) => {
  return request.post('/auth/verify-captcha', { phone, captcha })
}

// 重置密码
export const resetPassword = (phone: string, captcha: string, password: string, confirmPassword: string) => {
  return request.post('/auth/reset-password', { phone, captcha, password, confirmPassword })
}

// 用户注册
export const register = (data: RegisterForm) => {
  return request.post<void>('/auth/register', data)
}

// 手机号换绑
export const changePhone = (data: ChangePhoneForm) => {
  return request.post('/auth/change-phone', data)
}

// 退出登录
export const logout = () => {
  return request.post('/auth/logout')
}

// 修改当前用户资料
export const updateCurrentUser = (data: UserCurrentUpdateForm) => {
  return request.post('/system/user/current-update', data)
}
