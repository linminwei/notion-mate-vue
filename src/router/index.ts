import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

// 静态路由
const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login.vue'),
    meta: { title: ' 登录 ', hidden: true }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layouts/BasicLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/system/dashboard.vue'),
        meta: { title: ' 首页 ', icon: 'HomeOutlined' }
      },
      {
        path: 'system/user',
        name: 'SystemUser',
        component: () => import('@/views/system/user.vue'),
        meta: { title: ' 用户管理 ', icon: 'UserOutlined', permission: 'system:user:list' }
      },
      {
        path: 'system/role',
        name: 'SystemRole',
        component: () => import('@/views/system/role.vue'),
        meta: { title: ' 角色管理 ', icon: 'TeamOutlined', permission: 'system:role:list' }
      },
      {
        path: 'system/menu',
        name: 'SystemMenu',
        component: () => import('@/views/system/menu.vue'),
        meta: { title: ' 菜单管理 ', icon: 'MenuOutlined', permission: 'system:menu:list' }
      },
      {
        path: 'system/dict',
        name: 'SystemDict',
        component: () => import('@/views/system/dict.vue'),
        meta: { title: ' 字典管理 ', icon: 'BookOutlined', permission: 'system:dict:list' }
      },
      {
        path: 'notion/workspace',
        name: 'NotionWorkspace',
        component: () => import('@/views/system/workspace.vue'),
        meta: { title: ' 工作区配置 ', icon: 'ThunderboltOutlined', permission: 'workspace:list' }
      },
      {
        path: 'notion/datasource',
        name: 'NotionDatasource',
        component: () => import('@/views/system/datasource.vue'),
        meta: { title: ' 数据源管理 ', icon: 'database', permission: 'datasource:list' }
      },
      {
        path: 'resource/website',
        name: 'WebsiteList',
        component: () => import('@/views/system/website.vue'),
        meta: { title: ' 网址管理 ', icon: 'GlobalOutlined', permission: 'website:list' }
      },
      {
        path: 'resource/website-porn',
        name: 'WebsitePornList',
        component: () => import('@/views/system/website-porn.vue'),
        meta: { title: '成人网站管理', icon: 'StopOutlined', permission: 'websitePorn:list' }
      },
      {
        path: 'resource/extension',
        name: 'ExtensionList',
        component: () => import('@/views/system/extension.vue'),
        meta: { title: '扩展管理', icon: 'BlockOutlined', permission: 'extension:list' }
      },
      {
        path: 'resource/app',
        name: 'AppList',
        component: () => import('@/views/system/app.vue'),
        meta: { title: ' 软件管理 ', icon: 'AppleOutlined', permission: 'app:list' }
      },
    ]
  },
  {
    path: '/portal',
    name: 'Portal',
    component: () => import('@/layouts/PortalLayout.vue'),
    meta: { title: '个人工作台', hidden: true },
    children: [
      {
        path: '',
        name: 'PortalHome',
        component: () => import('@/views/user/portal.vue'),
        meta: { title: '个人工作台', hidden: true }
      },
      {
        path: 'websites',
        name: 'WebsiteRecommend',
        component: () => import('@/views/user/website.vue'),
        meta: { title: '网站推荐', hidden: true }
      },
      {
        path: 'extensions',
        name: 'ExtensionRecommend',
        component: () => import('@/views/user/extension.vue'),
        meta: { title: '扩展推荐', hidden: true }
      },
      {
        path: 'apps',
        name: 'AppRecommend',
        component: () => import('@/views/user/app.vue'),
        meta: { title: '软件推荐', hidden: true }
      }
    ]
  },
  {
    path: '/error/403',
    name: 'Forbidden',
    component: () => import('@/views/error/403.vue'),
    meta: { title: '403', hidden: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404', hidden: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  if (to.path === '/login') {
    if (userStore.isLoggedIn) {
      next('/')
    } else {
      next()
    }
    return
  }

  if (!userStore.isLoggedIn) {
    next(`/login?redirect=${to.path}`)
    return
  }

  if (!userStore.userInfo) {
    try {
      await userStore.fetchUserInfo()
      next({ ...to, replace: true })
    } catch (error) {
      userStore.logout()
      next('/login')
    }
    return
  }

  // 权限检查：如果路由需要特定权限，检查用户是否有该权限
  const requiredPermission = to.meta.permission as string
  if (requiredPermission) {
    const hasPermission = userStore.permissions?.includes(requiredPermission)
    if (!hasPermission) {
      next('/error/403')
      return
    }
  }

  // 角色路由：普通用户和管理员跳转到不同首页
  if (to.path === '/') {
    next(userStore.isRegularUser ? '/portal' : '/dashboard')
    return
  }

  // 普通用户门户页面仅限普通用户访问
  if (to.path.startsWith('/portal') && !userStore.isRegularUser) {
    next('/dashboard')
    return
  }

  next()
})

export default router
