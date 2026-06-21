import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo, MenuItem, RegisterForm } from '@/types'
import { login as loginApi, getUserInfo, logout as logoutApi, loginByPhone as loginPhone, register as registerApi } from '@/api/auth'
import type { LoginForm } from '@/types'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(null)
  const menus = ref<MenuItem[]>([])
  const permissions = ref<string[]>([])

  const isLoggedIn = computed(() => !!token.value)

  // 是否为普通用户（所有角色均为 USER）
  const isRegularUser = computed(() => {
    const roles = userInfo.value?.roles || []
    if (roles.length === 0) return false
    return roles.every(r => r.roleCode === 'USER')
  })

  // 登录
  async function login(form: LoginForm) {
    const res = await loginApi(form)
    token.value = res.data.accessToken
    localStorage.setItem('token', token.value)
    await fetchUserInfo()
  }

  // 手机号登录
  async function loginByPhone(phone: string, captcha: string) {
    const res = await loginPhone(phone, captcha)
    token.value = res.data.accessToken
    localStorage.setItem('token', token.value)
    await fetchUserInfo()
  }

  // 用户注册
  async function register(form: RegisterForm) {
    await registerApi(form)
  }

  // 获取用户信息（包含菜单和权限）
  async function fetchUserInfo() {
    const res = await getUserInfo()
    userInfo.value = res.data
    permissions.value = res.data.permissions || []
    menus.value = res.data.menuTree || []
  }

  // 退出登录
  async function logout() {
    try {
      await logoutApi()
    } finally {
      token.value = ''
      userInfo.value = null
      menus.value = []
      permissions.value = []
      localStorage.removeItem('token')
      router.push('/login')
    }
  }

  // 检查权限
  function hasPermission(permission: string): boolean {
    return permissions.value.includes(permission)
  }

  return {
    token,
    userInfo,
    menus,
    permissions,
    isLoggedIn,
    isRegularUser,
    login,
    loginByPhone,
    register,
    logout,
    fetchUserInfo,
    hasPermission,
  }
})
