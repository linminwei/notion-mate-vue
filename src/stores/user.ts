import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo, MenuItem } from '@/types'
import { login as loginApi, getUserInfo, getUserMenus, logout as logoutApi } from '@/api/auth'
import type { LoginForm } from '@/types'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(null)
  const menus = ref<MenuItem[]>([])
  const permissions = ref<string[]>([])

  const isLoggedIn = computed(() => !!token.value)

  // 登录
  async function login(form: LoginForm) {
    const res = await loginApi(form)
    token.value = res.data.accessToken
    localStorage.setItem('token', token.value)
    await fetchUserInfo()
    await fetchMenus()
  }

  // 获取用户信息
  async function fetchUserInfo() {
    const res = await getUserInfo()
    userInfo.value = res.data
    permissions.value = res.data.permissions || []
  }

  // 获取菜单
  async function fetchMenus() {
    const res = await getUserMenus()
    menus.value = res.data
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
    login,
    logout,
    fetchUserInfo,
    fetchMenus,
    hasPermission,
  }
})
