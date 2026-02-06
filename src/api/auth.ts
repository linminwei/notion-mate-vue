import { request } from '@/utils/request'
import type { LoginForm, LoginResult, UserInfo, RegisterForm } from '@/types'

// 登录
export const login = (data: LoginForm) => {
  return request.post<LoginResult>('/auth/login', data)
}

// 手机号
export const loginByPhone = (phone: string, captcha: string) => {
  return request.post<LoginResult>('/auth/login-by-phone', {phone,captcha})
}

// 获取用户信息（包含菜单树）
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
export const resetPassword = (phone: string, captcha: string,password: string,confirmPassword: string) => {
  return request.post('/auth/reset-password', { phone, captcha,password,confirmPassword })
}

// 用户注册
export const register = (data: RegisterForm) => {
  const formData = new FormData();
  
  // 构造用户数据对象（包含所有字段）
  const userData = {
    username: data.username,
    nickname: data.nickname,
    email: data.email,
    phone: data.phone,
    password: data.password,
    confirmPassword: data.confirmPassword,
    captcha: data.captcha
  };
  
  // 添加用户数据（ JSON 字符串）
  formData.append('userData', new Blob([JSON.stringify(userData)], { type: 'application/json' }));
    
  // 添加头像文件
  formData.append('avatar', data.avatar);
  
  return request.post<void>('/auth/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

// 退出登录
export const logout = () => {
  return request.post('/auth/logout')
}
