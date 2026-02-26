<template>
  <div class="apple-layout-root" :class="{ 'theme-light': !isDark }">

    <!-- 侧边栏 (纯手写 Native Sidebar，极致对齐) -->
    <aside class="apple-sidebar" :class="{ 'is-collapsed': collapsed }">
      <!-- 品牌 Logo 区域 -->
      <div class="sidebar-logo">
        <div class="logo-wrapper">
          <img src="/notion-mate-dark.png" class="logo-img" alt="Notion Mate Logo">
        </div>
        <div class="logo-title" v-show="!collapsed">
          Notion Mate
        </div>
      </div>

      <!-- 纯手写原生菜单系统 -->
      <div class="sidebar-menu-scroll">
        <ul class="apple-menu">

          <template v-for="menu in menus" :key="menu.id || menu.path">
            <!-- 1. 包含子菜单的父级项 -->
            <li v-if="menu.children && menu.children.length > 0" class="apple-menu-item-group">

              <!-- 父级标题行 -->
              <div
                  class="apple-menu-title"
                  :class="{
                  'is-active': isSubMenuOpen(menu.id || menu.path) || (!collapsed && isParentSelected(menu)),
                  'parent-is-selected': collapsed && (isParentSelected(menu) || activeCollapsedPopup === (menu.id || menu.path))
                }"
                  @click.stop="handleParentMenuClick(menu)"
              >
                <div class="title-left">
                  <div class="menu-icon-wrap">
                    <font-awesome-icon :icon="getFaIcon(menu.icon)" />
                  </div>
                  <span class="menu-text" v-show="!collapsed">{{ menu.menuName }}</span>
                </div>
                <!-- 展开/折叠指示箭头 -->
                <div class="menu-icon-wrap arrow-wrap" v-show="!collapsed">
                  <font-awesome-icon
                      :icon="['fas', 'chevron-down']"
                      class="chevron-icon"
                      :class="{ 'is-open': isSubMenuOpen(menu.id || menu.path) }"
                  />
                </div>
              </div>

              <!-- PC 展开状态：子菜单列表 (左对齐) -->
              <div class="apple-submenu-wrapper" :class="{ 'is-open': isSubMenuOpen(menu.id || menu.path) && !collapsed }">
                <ul class="apple-submenu-list">
                  <li
                      v-for="child in menu.children"
                      :key="child.path"
                      class="apple-sub-item"
                      :class="{ 'is-selected': selectedKeys.includes(child.path) }"
                      @click.stop="navigateToMenu(child)"
                  >
                    <div class="menu-icon-wrap sub">
                      <font-awesome-icon :icon="getFaIcon(child.icon)" />
                    </div>
                    <span class="menu-text">{{ child.menuName }}</span>
                  </li>
                </ul>
              </div>

              <!-- 折叠状态下的 Click Popup：仅此处的子项保留绝对居中对齐 -->
              <div v-if="collapsed" class="apple-collapsed-popup" :class="{ 'is-visible': activeCollapsedPopup === (menu.id || menu.path) }" @click.stop>
                <ul class="popup-list">
                  <li
                      v-for="child in menu.children"
                      :key="`popup-${child.path}`"
                      class="popup-item"
                      :class="{ 'is-selected': selectedKeys.includes(child.path) }"
                      @click.stop="navigateToMenu(child)"
                  >
                    <div class="menu-icon-wrap sub">
                      <font-awesome-icon :icon="getFaIcon(child.icon)" />
                    </div>
                    <span class="menu-text">{{ child.menuName }}</span>
                  </li>
                </ul>
              </div>

            </li>

            <!-- 2. 无子菜单的独立项 -->
            <li v-else class="apple-menu-item-group">
              <div
                  class="apple-menu-title single-item"
                  :class="{ 'is-selected': selectedKeys.includes(menu.path) }"
                  @click.stop="navigateToMenu(menu)"
              >
                <div class="title-left">
                  <div class="menu-icon-wrap">
                    <font-awesome-icon :icon="getFaIcon(menu.icon)" />
                  </div>
                  <span class="menu-text" v-show="!collapsed">{{ menu.menuName }}</span>
                </div>
              </div>
            </li>
          </template>

        </ul>
      </div>
    </aside>

    <!-- 右侧主内容区 -->
    <main class="apple-main-container">

      <!-- 顶部导航头 (恢复标准两端对齐，消除右侧空白) -->
      <header class="apple-header">

        <div class="header-left">
          <!-- 侧边栏开关 -->
          <div class="action-btn trigger-btn" role="button" @click="collapsed = !collapsed">
            <font-awesome-icon :icon="['fas', 'bars']" v-if="collapsed" />
            <font-awesome-icon :icon="['fas', 'indent']" v-else />
          </div>

          <!-- 面包屑导航 (靠左对齐) -->
          <div class="breadcrumb-area">
            <div class="apple-breadcrumb-container">
              <template v-for="(crumb, index) in breadcrumbs" :key="index">

                <div class="crumb-node" :class="{ 'interactive-node': crumb.siblings && crumb.siblings.length > 1 }">
                  <div
                      class="crumb-trigger"
                      :class="{ 'is-open': openBreadcrumb === index, 'is-last': crumb.isLast }"
                      @click.stop="toggleBreadcrumb(index, crumb)"
                  >
                    <div class="crumb-icon-raw">
                      <font-awesome-icon v-if="crumb.icon" :icon="getFaIcon(crumb.icon)" />
                    </div>
                    <span class="crumb-text">{{ crumb.name }}</span>
                  </div>

                  <transition name="dropdown-fade">
                    <div v-show="openBreadcrumb === index && crumb.siblings && crumb.siblings.length > 1" class="crumb-dropdown-panel" @click.stop>
                      <div
                          v-for="sibling in crumb.siblings"
                          :key="sibling.path || sibling.menuName"
                          class="crumb-dropdown-item"
                          :class="{ 'is-active': sibling.menuName === crumb.name }"
                          @click="navigateToMenu(sibling)"
                      >
                        <div class="crumb-dropdown-icon">
                          <font-awesome-icon :icon="getFaIcon(sibling.icon)" />
                        </div>
                        <span class="dropdown-item-text">{{ sibling.menuName }}</span>
                      </div>
                    </div>
                  </transition>
                </div>

                <span class="crumb-separator" v-if="index < breadcrumbs.length - 1">/</span>

              </template>
            </div>
          </div>
        </div>

        <!-- 右侧功能区 -->
        <div class="header-right" ref="headerRightRef">
          <div class="action-btn theme-btn" role="button" @click="toggleTheme" :title="isDark ? '切换至亮色' : '切换至暗色'">
            <font-awesome-icon :icon="['fas', 'sun']" v-if="isDark" />
            <font-awesome-icon :icon="['fas', 'moon']" v-else />
          </div>

          <div class="custom-dropdown-container">
            <!-- 用户胶囊按钮 -->
            <div class="user-pill-btn" :class="{ 'is-active': isUserMenuOpen }" @click.stop="isUserMenuOpen = !isUserMenuOpen">
              <div class="user-avatar-small">
                {{ userInfo?.nickname?.charAt(0) || userInfo?.username?.charAt(0) || 'U' }}
              </div>
              <span class="user-pill-name">{{ userInfo?.nickname || userInfo?.username }}</span>
              <font-awesome-icon :icon="['fas', 'chevron-down']" class="dropdown-arrow" :class="{ 'rotated': isUserMenuOpen }" />
            </div>

            <!-- 账户身份卡片 (修正绝对定位) -->
            <transition name="dropdown-fade">
              <div v-if="isUserMenuOpen" class="user-profile-popover" @click.stop>
                <div class="popover-profile-header">
                  <div class="profile-avatar-giant">
                    {{ userInfo?.nickname?.charAt(0) || userInfo?.username?.charAt(0) || 'U' }}
                  </div>
                  <div class="profile-meta">
                    <div class="profile-nickname">{{ userInfo?.nickname || userInfo?.username }}</div>
                    <div class="profile-role-tag">系统管理员</div>
                  </div>
                </div>

                <div class="popover-divider"></div>

                <div class="popover-menu-list">
                  <div class="popover-menu-item">
                    <div class="popover-icon">
                      <font-awesome-icon :icon="['fas', 'user-circle']" />
                    </div>
                    <span>个人中心</span>
                  </div>
                  <div class="popover-menu-item">
                    <div class="popover-icon">
                      <font-awesome-icon :icon="['fas', 'gear']" />
                    </div>
                    <span>偏好设置</span>
                  </div>

                  <div class="popover-divider inset"></div>

                  <div class="popover-menu-item danger" @click="handleLogout">
                    <div class="popover-icon">
                      <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" />
                    </div>
                    <span>退出登录</span>
                  </div>
                </div>

                <div class="popover-footer">
                  {{ userInfo?.email || 'admin@notionmate.com' }}
                </div>
              </div>
            </transition>
          </div>
        </div>
      </header>

      <!-- 路由内容展示区 -->
      <div class="apple-content-scroll">
        <div class="apple-content-inner">
          <router-view v-slot="{ Component }">
            <transition name="page-fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { library } from '@fortawesome/fontawesome-svg-core'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const collapsed = ref(false)
const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>([])

const activeCollapsedPopup = ref<string | null>(null)
const isUserMenuOpen = ref(false)
const headerRightRef = ref<HTMLElement | null>(null)
const openBreadcrumb = ref<number | null>(null)
const isDark = ref(true)

watch(collapsed, (newVal) => {
  if (!newVal) activeCollapsedPopup.value = null
})

onMounted(() => {
  const storedTheme = localStorage.getItem('apple-theme')
  if (storedTheme === 'light') isDark.value = false
  document.addEventListener('click', closeDropdowns)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
})

const closeDropdowns = (e: MouseEvent) => {
  if (headerRightRef.value && !headerRightRef.value.contains(e.target as Node)) {
    isUserMenuOpen.value = false
  }
  openBreadcrumb.value = null
  activeCollapsedPopup.value = null
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('apple-theme', isDark.value ? 'dark' : 'light')
}

const toggleBreadcrumb = (index: number, crumb: any) => {
  if (crumb.siblings && crumb.siblings.length > 1) {
    openBreadcrumb.value = openBreadcrumb.value === index ? null : index
  }
}

const handleParentMenuClick = (menu: any) => {
  openBreadcrumb.value = null
  isUserMenuOpen.value = false
  const menuKey = menu.id || menu.path;

  if (collapsed.value) {
    activeCollapsedPopup.value = activeCollapsedPopup.value === menuKey ? null : menuKey
  } else {
    const index = openKeys.value.indexOf(menuKey)
    if (index === -1) openKeys.value.push(menuKey)
    else openKeys.value.splice(index, 1)
  }
}

const isSubMenuOpen = (menuKey: string) => openKeys.value.includes(menuKey)

const isParentSelected = (menu: any) => {
  if (!menu.children) return false
  return menu.children.some((child: any) => selectedKeys.value.includes(child.path))
}

const getFirstLeafPath = (menu: any): string => {
  if (menu.children && menu.children.length > 0) return getFirstLeafPath(menu.children[0])
  return menu.path
}

const navigateToMenu = (menu: any) => {
  openBreadcrumb.value = null
  isUserMenuOpen.value = false
  activeCollapsedPopup.value = null

  const targetPath = getFirstLeafPath(menu)
  if (targetPath) router.push(targetPath.startsWith('/') ? targetPath : `/${targetPath}`)
}

const handleLogout = async () => {
  isUserMenuOpen.value = false
  await userStore.logout()
}

const userInfo = computed(() => userStore.userInfo)
const menus = computed(() => userStore.menus)

const breadcrumbs = computed(() => {
  const currentPath = route.path
  const crumbs: any[] = []
  const topLevelMenus = menus.value || []

  for (const menu of topLevelMenus) {
    if (menu.path === currentPath) {
      crumbs.push({ name: menu.menuName, icon: menu.icon, isLast: true, siblings: topLevelMenus })
      break
    }
    if (menu.children && menu.children.length > 0) {
      const child = menu.children.find((c: any) => c.path === currentPath)
      if (child) {
        crumbs.push({ name: menu.menuName, icon: menu.icon, isLast: false, siblings: topLevelMenus })
        crumbs.push({ name: child.menuName, icon: child.icon, isLast: true, siblings: menu.children })
        break
      }
    }
  }

  if (crumbs.length === 0) crumbs.push({ name: '首页', icon: 'home', isLast: true, siblings: topLevelMenus })
  return crumbs
})

const getFaIcon = (iconStr: string) => {
  if (!iconStr) return ['fas', 'circle']
  let name = iconStr.trim()
  let prefix = 'fas'
  if (name.includes(' ')) {
    const parts = name.split(' ')
    prefix = parts[0].replace(/^fa-/, '')
    name = parts[1]
  }
  name = name.replace(/^fa-/, '')
  if (prefix === 'fas') {
    const registry = library.definitions || {}
    if (registry['fab'] && registry['fab'][name]) prefix = 'fab'
    else if (registry['far'] && registry['far'][name]) prefix = 'far'
  }
  return [prefix, name]
}

watch(() => route.path, (path) => { selectedKeys.value = [path] }, { immediate: true })
</script>

<style scoped>
/* ================= 全局重置 ================= */
.apple-layout-root *, .apple-layout-root *::before, .apple-layout-root *::after {
  box-sizing: border-box;
}

.apple-layout-root {
  --bg-base: #0b0c0e;
  --text-main: #ffffff;
  --text-muted: rgba(255, 255, 255, 0.55);
  --sidebar-bg: #151516;
  --header-bg: rgba(11, 12, 14, 0.6);
  --content-bg: #131316;
  --border-color: rgba(255, 255, 255, 0.08);
  --hover-bg: rgba(255, 255, 255, 0.08);
  --active-bg: rgba(255, 255, 255, 0.12);
  --popup-bg: #1f1f1f;
  --shadow-color: rgba(0, 0, 0, 0.5);
  --pill-bg: rgba(255, 255, 255, 0.04);
  --pill-border: rgba(255, 255, 255, 0.1);
  --apple-blue: #0A84FF;
  --apple-red: #FF3B30;
  --scrollbar-thumb: rgba(255, 255, 255, 0.15);

  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: var(--bg-base);
  color: var(--text-main);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
  overflow: hidden;
  transition: background-color 0.4s ease, color 0.4s ease;
}

.apple-layout-root.theme-light {
  --bg-base: #f5f5f7;
  --text-main: #1d1d1f;
  --text-muted: rgba(0, 0, 0, 0.55);
  --sidebar-bg: #ffffff;
  --header-bg: rgba(255, 255, 255, 0.75);
  --content-bg: #ffffff;
  --border-color: rgba(0, 0, 0, 0.08);
  --hover-bg: rgba(0, 0, 0, 0.05);
  --active-bg: rgba(0, 0, 0, 0.08);
  --popup-bg: #ffffff;
  --pill-bg: #ffffff;
  --apple-blue: #007AFF;
}

/* ================= 侧边栏 ================= */
.apple-sidebar {
  width: 250px;
  height: 100%;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  flex-shrink: 0;
}
.apple-sidebar.is-collapsed { width: 72px; }

.sidebar-logo {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
  border-bottom: 1px solid var(--border-color);
}
.apple-sidebar.is-collapsed .sidebar-logo { justify-content: center; padding: 0; }

.logo-wrapper { width: 36px; height: 36px; flex-shrink: 0; }
.logo-img { width: 100%; height: 100%; object-fit: contain; }
.apple-layout-root.theme-light .logo-img { filter: invert(1) brightness(0.2); }
.logo-title { font-size: 16px; font-weight: 700; white-space: nowrap; }

/* ================= 侧边栏菜单 ================= */
.sidebar-menu-scroll { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 16px 0; scrollbar-width: none; }
.sidebar-menu-scroll::-webkit-scrollbar { display: none; }
.apple-sidebar.is-collapsed .sidebar-menu-scroll { overflow: visible; }

.apple-menu { width: 100%; list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px; }
.apple-menu-item-group { position: relative; }

.apple-menu-title {
  display: flex; align-items: center; justify-content: space-between;
  height: 40px; padding: 0 12px; margin: 0 14px;
  border-radius: 10px; color: var(--text-muted); cursor: pointer;
  transition: all 0.2s ease;
}
.apple-menu-title:hover { background: var(--hover-bg); color: var(--text-main); }
.apple-menu-title.is-active { color: var(--text-main); }
.apple-menu-title.single-item.is-selected { background: var(--apple-blue); color: #fff; font-weight: 600; box-shadow: 0 2px 10px rgba(10, 132, 255, 0.25); }

/* 折叠状态居中 */
.apple-sidebar.is-collapsed .apple-menu-title { width: 44px; height: 44px; margin: 8px auto; padding: 0; justify-content: center; border-radius: 12px; }
.apple-sidebar.is-collapsed .title-left { width: 100%; justify-content: center; gap: 0; }
.apple-sidebar.is-collapsed .menu-icon-wrap { font-size: 18px; }
.apple-sidebar.is-collapsed .apple-menu-title.parent-is-selected { background: var(--apple-blue); color: #fff; box-shadow: 0 4px 14px rgba(10, 132, 255, 0.35); }

.title-left { display: flex; align-items: center; gap: 10px; }
.menu-icon-wrap { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 15px; }
.menu-text { font-size: 14px; font-weight: 500; white-space: nowrap; }
.arrow-wrap { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 11px; opacity: 0.5; }
.chevron-icon { transition: transform 0.3s ease; }
.chevron-icon.is-open { transform: rotate(180deg); }

/* 子菜单缩进排列 */
.apple-submenu-wrapper { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.3s ease; }
.apple-submenu-wrapper.is-open { grid-template-rows: 1fr; }
.apple-submenu-list { overflow: hidden; list-style: none; padding: 0; margin: 0; }

.apple-sub-item {
  height: 38px; margin: 0 14px; padding: 0 12px 0 44px;
  border-radius: 8px; display: flex; align-items: center; gap: 10px;
  color: var(--text-muted); cursor: pointer; transition: all 0.2s ease;
}
.apple-sub-item:first-child { margin-top: 6px; }
.apple-sub-item:last-child { margin-bottom: 6px; }
.apple-sub-item:hover { background: var(--hover-bg); color: var(--text-main); }
.apple-sub-item.is-selected { background: var(--apple-blue); color: #fff; font-weight: 600; }

/* 折叠悬浮子菜单 (内容居中) */
.apple-collapsed-popup {
  position: absolute; top: 4px; left: calc(100% + 12px);
  background: rgba(30, 30, 30, 0.65); backdrop-filter: blur(50px) saturate(220%);
  border-radius: 14px; padding: 6px; min-width: 130px;
  box-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.15), 0 24px 48px -12px rgba(0, 0, 0, 0.4);
  opacity: 0; visibility: hidden; transform: translateX(-8px) scale(0.96);
  transform-origin: left center; transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 1000;
}
.apple-collapsed-popup.is-visible { opacity: 1; visibility: visible; transform: translateX(0) scale(1); pointer-events: auto; }
.popup-item { display: flex; align-items: center; justify-content: center; gap: 10px; height: 34px; padding: 0 16px; border-radius: 8px; color: var(--text-main); cursor: pointer; }
.popup-item.is-selected { background: rgba(10, 132, 255, 0.15); color: var(--apple-blue); }
.popup-item:hover, .popup-item.is-selected:hover { background: var(--apple-blue); color: #fff; }

/* ================= 主体容器与 Header ================= */
.apple-main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* 防止子元素撑大容器 */
}

.apple-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: var(--header-bg);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  z-index: 50;
}

.header-left { display: flex; align-items: center; gap: 16px; }
.header-right { display: flex; align-items: center; }

.action-btn {
  background: var(--pill-bg); border: 1px solid var(--pill-border);
  color: var(--text-main); font-size: 15px; width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; border-radius: 10px; transition: all 0.2s ease;
}
.theme-btn { border-radius: 50%; margin-right: 16px; }

.apple-breadcrumb-container {
  display: flex; align-items: center;
  background: var(--pill-bg); border: 1px solid var(--border-color);
  height: 36px; border-radius: 10px; padding: 0 10px; backdrop-filter: blur(12px);
}
.crumb-trigger { display: flex; align-items: center; gap: 6px; padding: 0 8px; border-radius: 6px; cursor: pointer; color: var(--text-muted); }
.crumb-trigger.is-last { color: var(--text-main); }
.crumb-trigger:hover { background: var(--hover-bg); color: var(--text-main); }

/* ================= 用户身份卡片 (重写) ================= */
.custom-dropdown-container { position: relative; }

.user-pill-btn {
  display: flex; align-items: center; gap: 10px;
  background: var(--pill-bg); border: 1px solid var(--pill-border);
  padding: 4px 12px 4px 4px; border-radius: 30px; cursor: pointer;
  transition: all 0.2s ease;
}
.user-pill-btn:hover, .user-pill-btn.is-active { background: var(--hover-bg); }

.user-avatar-small {
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--apple-blue); color: #fff; font-weight: 600; font-size: 12px;
  display: flex; align-items: center; justify-content: center;
}
.user-pill-name { font-size: 13px; font-weight: 500; }
.dropdown-arrow { font-size: 10px; transition: transform 0.3s ease; }
.dropdown-arrow.rotated { transform: rotate(180deg); }

.user-profile-popover {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 240px;
  background: var(--popup-bg);
  backdrop-filter: blur(50px) saturate(210%);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 4px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  transform-origin: top right;
  overflow: hidden;
}

.popover-profile-header { padding: 16px 14px 12px; display: flex; align-items: center; gap: 14px; }
.profile-avatar-giant {
  width: 48px; height: 48px; border-radius: 12px;
  background: var(--apple-blue); color: #fff; font-size: 20px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.profile-meta { display: flex; flex-direction: column; gap: 2px; }
.profile-nickname { font-size: 15px; font-weight: 700; color: var(--text-main); }
.profile-role-tag { font-size: 10px; font-weight: 600; color: var(--apple-blue); background: rgba(10, 132, 255, 0.1); padding: 2px 8px; border-radius: 999px; width: fit-content; }

.popover-menu-list { display: flex; flex-direction: column; gap: 1px; padding: 4px; }
.popover-menu-item {
  width: 100%; height: 36px; display: flex; align-items: center; gap: 12px;
  padding: 0 12px; border-radius: 10px; color: var(--text-main);
  font-size: 13px; font-weight: 500; cursor: pointer;
}
.popover-menu-item:hover { background: var(--hover-bg); }
.popover-icon { width: 16px; opacity: 0.7; text-align: center; }
.popover-menu-item.danger { color: var(--apple-red); }
.popover-menu-item.danger:hover { background: rgba(255, 59, 48, 0.1); }

.popover-divider { height: 1px; background: var(--border-color); margin: 4px 0; }
.popover-divider.inset { margin: 4px 10px; }
.popover-footer { padding: 10px 14px 14px; font-size: 11px; color: var(--text-muted); text-align: center; opacity: 0.6; }

/* ================= 内容区 ================= */
.apple-content-scroll { flex: 1; overflow-y: auto; padding: 24px; }
.apple-content-inner {
  background: var(--content-bg); border: 1px solid var(--border-color);
  border-radius: 16px; min-height: 100%; padding: 24px;
}

.page-fade-enter-active, .page-fade-leave-active { transition: opacity 0.3s ease; }
.page-fade-enter-from, .page-fade-leave-to { opacity: 0; }
</style>