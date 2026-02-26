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

              <!-- PC 展开状态：子菜单列表 -->
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

      <!-- 顶部导航头 -->
      <header class="apple-header">

        <!-- 恢复左侧对齐的头部区域 -->
        <div class="header-left">
          <!-- 侧边栏开关 -->
          <div class="action-btn trigger-btn" role="button" @click="collapsed = !collapsed">
            <font-awesome-icon :icon="['fas', 'bars']" v-if="collapsed" />
            <font-awesome-icon :icon="['fas', 'indent']" v-else />
          </div>

          <!-- 面包屑导航 -->
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

                  <!-- 面包屑悬浮面板 -->
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

                <!-- 分隔符 -->
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
            <div class="user-pill-btn" @click.stop="isUserMenuOpen = !isUserMenuOpen">
              <div class="user-avatar">
                {{ userInfo?.nickname?.charAt(0) || userInfo?.username?.charAt(0) || 'U' }}
              </div>
              <span class="user-name">{{ userInfo?.nickname || userInfo?.username }}</span>
              <font-awesome-icon :icon="['fas', 'chevron-down']" class="dropdown-icon" :class="{ 'rotated': isUserMenuOpen }" />
            </div>

            <transition name="dropdown-fade">
              <div v-if="isUserMenuOpen" class="user-dropdown-panel" @click.stop>
                <div class="dropdown-header">
                  <div class="dh-name">{{ userInfo?.nickname || userInfo?.username }}</div>
                  <div class="dh-email">{{ userInfo?.email || 'admin@notionmate.com' }}</div>
                </div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-list">
                  <div class="dropdown-item">
                    <div class="menu-icon-wrap sub di-icon">
                      <font-awesome-icon :icon="['fas', 'user']" />
                    </div>
                    个人设置
                  </div>
                  <div class="dropdown-item">
                    <div class="menu-icon-wrap sub di-icon">
                      <font-awesome-icon :icon="['fas', 'cog']" />
                    </div>
                    系统偏好
                  </div>
                  <div class="dropdown-divider"></div>
                  <div class="dropdown-item danger-item" @click="handleLogout">
                    <div class="menu-icon-wrap sub di-icon">
                      <font-awesome-icon :icon="['fas', 'sign-out-alt']" />
                    </div>
                    退出登录
                  </div>
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
/* ================= 全局重置与响应式 CSS 变量 ================= */
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
  --border-color: rgba(255, 255, 255, 0.06);
  --hover-bg: rgba(255, 255, 255, 0.08);
  --active-bg: rgba(255, 255, 255, 0.12);
  --popup-bg: #1f1f1f;
  --shadow-color: rgba(0, 0, 0, 0.5);
  --pill-bg: rgba(255, 255, 255, 0.04);
  --pill-border: rgba(255, 255, 255, 0.08);
  --logo-text: #ffffff;
  --apple-blue: #0A84FF;
  --scrollbar-thumb: rgba(255, 255, 255, 0.15);
  --scrollbar-hover: rgba(255, 255, 255, 0.3);

  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: var(--bg-base);
  color: var(--text-main);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
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
  --hover-bg: rgba(0, 0, 0, 0.04);
  --active-bg: rgba(0, 0, 0, 0.08);
  --popup-bg: #ffffff;
  --shadow-color: rgba(0, 0, 0, 0.08);
  --pill-bg: rgba(255, 255, 255, 1);
  --pill-border: rgba(0, 0, 0, 0.1);
  --logo-text: #1d1d1f;
  --apple-blue: #0066cc;
  --scrollbar-thumb: rgba(0, 0, 0, 0.2);
  --scrollbar-hover: rgba(0, 0, 0, 0.35);
}

/* ================= 侧边栏 ================= */
.apple-sidebar {
  width: 250px;
  height: 100%;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.4s ease, border-color 0.4s ease;
  z-index: 100;
  flex-shrink: 0;
}

.apple-sidebar.is-collapsed {
  width: 72px;
}

.sidebar-logo {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
  width: 100%;
  flex-shrink: 0;
  border-bottom: 1px solid var(--border-color);
  transition: padding 0.3s ease;
}
.apple-sidebar.is-collapsed .sidebar-logo {
  padding: 0;
  justify-content: center;
}

.logo-wrapper {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.apple-sidebar.is-collapsed .logo-wrapper {
  width: 40px;
  height: 40px;
}

.logo-img { width: 100%; height: 100%; object-fit: contain; display: block; }
.apple-layout-root.theme-light .logo-img { filter: invert(1) brightness(0.2); }
.logo-title { font-size: 16px; font-weight: 700; color: var(--text-main); white-space: nowrap; margin-top: 1px; }

/* ================= 侧边栏菜单结构 ================= */
.sidebar-menu-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px 0;
  scrollbar-width: none;
}
.sidebar-menu-scroll::-webkit-scrollbar { display: none; }

.apple-sidebar.is-collapsed .sidebar-menu-scroll {
  overflow: visible;
}

.apple-menu {
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.apple-menu-item-group {
  width: 100%;
  position: relative;
  padding: 0;
  margin: 0;
  display: block;
}

/* 菜单主标题行 - 展开状态 */
.apple-menu-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 12px;
  margin: 0 14px;
  border-radius: 10px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.apple-menu-title:hover { background: var(--hover-bg); color: var(--text-main); }
.apple-menu-title.is-active { color: var(--text-main); }

/* 【核心修复】展开状态下，独立单页面菜单（如仪表盘）的选中高亮样式 */
.apple-menu-title.single-item.is-selected {
  background: var(--apple-blue);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(10, 132, 255, 0.25);
}

/* 完美居中的折叠图标 */
.apple-sidebar.is-collapsed .apple-menu-title {
  width: 44px;
  height: 44px;
  margin: 8px auto;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.apple-sidebar.is-collapsed .title-left {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.apple-sidebar.is-collapsed .menu-icon-wrap {
  width: auto;
  height: auto;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.apple-sidebar.is-collapsed .apple-menu-title.parent-is-selected,
.apple-sidebar.is-collapsed .apple-menu-title.single-item.is-selected {
  background: var(--apple-blue);
  color: #fff;
  box-shadow: 0 4px 14px rgba(10, 132, 255, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.3);
}

.title-left { display: flex; align-items: center; gap: 10px; min-width: 0; }
.menu-icon-wrap { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; color: currentColor; }
.menu-text { font-size: 14px; font-weight: 500; white-space: nowrap; line-height: normal; }
.arrow-wrap { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 11px; opacity: 0.5; }
.chevron-icon { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.chevron-icon.is-open { transform: rotate(180deg); }

/* --------- 展开子菜单 (恢复靠左缩进对齐) --------- */
.apple-submenu-wrapper { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.apple-submenu-wrapper.is-open { grid-template-rows: 1fr; }
.apple-submenu-list { overflow: hidden; list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 2px; }

.apple-sub-item {
  height: 38px;
  margin: 0 14px;
  padding: 0 12px 0 44px; /* 恢复优雅的子菜单缩进层级 */
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

/* 【视觉优化】：为首尾子项增加 margin，拉开与父级标题及下方其他菜单的呼吸感距离 */
.apple-sub-item:first-child { margin-top: 6px; }
.apple-sub-item:last-child { margin-bottom: 6px; }

.apple-sub-item:hover { background: var(--hover-bg); color: var(--text-main); }
.apple-sub-item.is-selected { background: var(--apple-blue); color: #fff; font-weight: 600; }

.menu-icon-wrap.sub {
  width: 16px !important; height: 16px !important; font-size: 14px !important; opacity: 0.6;
  display: flex !important; align-items: center !important; justify-content: center !important;
  padding: 0 !important; margin: 0 !important;
}
.menu-icon-wrap.sub :deep(svg) { display: block !important; margin: 0 !important; padding: 0 !important; }

/* ================= 折叠状态极简无缝悬浮菜单 ================= */
.apple-collapsed-popup {
  position: absolute;
  top: 4px; /* 精准下移，与左侧的触发按钮视觉上齐平 */
  /* 【终极核心修复】：彻底推出侧边栏本体 (100%边缘 + 12px安全呼吸距)，告别重叠 */
  left: calc(90% + 12px);

  background: rgba(30, 30, 30, 0.65);
  backdrop-filter: blur(50px) saturate(220%);
  -webkit-backdrop-filter: blur(50px) saturate(220%);
  border-radius: 14px;
  padding: 6px;
  min-width: 130px;
  box-shadow:
      0 0 0 0.5px rgba(255, 255, 255, 0.15),
      0 24px 48px -12px rgba(0, 0, 0, 0.4),
      0 4px 16px rgba(0, 0, 0, 0.1),
      inset 0 1px 1px rgba(255, 255, 255, 0.15);
  opacity: 0;
  visibility: hidden;
  transform: translateX(-8px) scale(0.96);
  transform-origin: left center;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
  z-index: 1000;
}

.apple-layout-root.theme-light .apple-collapsed-popup {
  background: rgba(255, 255, 255, 0.85);
  box-shadow:
      0 0 0 0.5px rgba(0, 0, 0, 0.08),
      0 24px 48px -12px rgba(0, 0, 0, 0.15),
      0 4px 16px rgba(0, 0, 0, 0.05),
      inset 0 1px 1px rgba(255, 255, 255, 0.8);
}

.apple-collapsed-popup.is-visible {
  opacity: 1;
  visibility: visible;
  transform: translateX(0) scale(1);
  pointer-events: auto;
}

.popup-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.popup-item {
  display: flex;
  align-items: center;
  justify-content: center; /* 仅让悬浮弹窗内部绝对居中 */
  gap: 10px;
  height: 34px;
  padding: 0 16px;
  border-radius: 8px;
  color: var(--text-main);
  cursor: pointer;
}

.popup-item .menu-text {
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}

.popup-item.is-selected { background: rgba(10, 132, 255, 0.15); color: var(--apple-blue); }
.apple-layout-root.theme-light .popup-item.is-selected { background: rgba(10, 132, 255, 0.08); }
.popup-item.is-selected .menu-icon-wrap.sub { opacity: 1; color: var(--apple-blue); }

.popup-item:hover, .popup-item.is-selected:hover { background: var(--apple-blue); color: #fff; }
.popup-item:hover .menu-icon-wrap.sub, .popup-item.is-selected:hover .menu-icon-wrap.sub { opacity: 1; color: #fff; }

/* ================= 主内容区域 (Main) ================= */
.apple-main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  position: relative;
}

/* ================= 顶部导航 (恢复左侧对齐版 Header) ================= */
.apple-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: var(--header-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  z-index: 10;
  transition: background 0.4s ease, border-color 0.4s ease;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 按钮无杂边距 */
.action-btn {
  background: var(--pill-bg);
  border: 1px solid var(--pill-border);
  color: var(--text-main);
  font-size: 15px;
  width: 36px;
  height: 36px;
  padding: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.2s ease;
}
.action-btn:hover { background: var(--hover-bg); }
.action-btn:active { transform: scale(0.95); }
.theme-btn { border-radius: 50%; margin-right: 16px; }

.breadcrumb-area { display: flex; align-items: center; height: 36px; }

/* 面包屑外壳 */
.apple-breadcrumb-container {
  display: flex;
  align-items: center;
  background: var(--pill-bg);
  border: 1px solid var(--pill-border);
  height: 36px;
  border-radius: 10px;
  padding: 0 10px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.crumb-node {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
}

.crumb-trigger {
  display: flex;
  align-items: center;
  /* 恢复靠左紧凑对齐，去除刻意的居中 */
  gap: 6px;
  padding: 0 8px;
  border-radius: 6px;
  height: 28px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-muted);
}

.crumb-trigger.is-last { color: var(--text-main); }
.crumb-trigger:hover, .crumb-trigger.is-open { background: var(--hover-bg); color: var(--text-main); }

.crumb-icon-raw, .crumb-dropdown-icon {
  display: flex; align-items: center; justify-content: center;
  width: 14px; height: 14px; font-size: 14px; color: inherit;
}

.crumb-text, .dropdown-item-text { font-size: 14px; font-weight: 500; white-space: nowrap; line-height: normal; }

.crumb-dropdown-panel {
  position: absolute;
  top: calc(100% + 10px); left: 0;
  background: var(--popup-bg); border: 1px solid var(--border-color); border-radius: 10px; padding: 6px; min-width: 140px;
  box-shadow: 0 10px 40px var(--shadow-color); z-index: 1000;
}

.dropdown-fade-enter-active, .dropdown-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.dropdown-fade-enter-from, .dropdown-fade-leave-to { opacity: 0; transform: scale(0.95) translateY(-5px); }

.crumb-dropdown-item {
  display: flex; align-items: center; /* 恢复靠左紧凑对齐 */ gap: 10px; padding: 8px 12px; border-radius: 6px; color: var(--text-muted); cursor: pointer; transition: all 0.2s ease; margin-bottom: 2px;
}
.crumb-dropdown-item:last-child { margin-bottom: 0; }
.crumb-dropdown-item:hover { background: var(--hover-bg); color: var(--text-main); }
.crumb-dropdown-item.is-active { background: var(--apple-blue); color: #fff; }

.crumb-separator {
  display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 400; color: var(--text-muted); opacity: 0.4; margin: 0 6px; width: 12px; user-select: none;
}

/* ---------------------------------------------------- */

.header-right { display: flex; align-items: center; }
.custom-dropdown-container { position: relative; }

.user-pill-btn {
  display: flex; align-items: center; gap: 10px; background: var(--pill-bg); border: 1px solid var(--pill-border); padding: 4px 12px 4px 4px; border-radius: 30px; cursor: pointer; transition: all 0.2s ease;
}
.user-pill-btn:hover { background: var(--hover-bg); border-color: var(--border-color); }

.user-avatar {
  width: 28px; height: 28px; border-radius: 50%; background: var(--apple-blue); color: #fff; font-weight: 600; font-size: 13px; display: flex; align-items: center; justify-content: center;
}
.user-name { font-size: 13px; font-weight: 500; color: var(--text-main); }
.dropdown-icon { font-size: 11px; color: var(--text-muted); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.dropdown-icon.rotated { transform: rotate(180deg); }

.user-dropdown-panel {
  position: absolute; top: calc(100% + 12px); right: 0;
  background: var(--popup-bg); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--border-color); border-radius: 14px; min-width: 200px; padding: 8px;
  box-shadow: 0 16px 40px var(--shadow-color); z-index: 1000; transform-origin: top right;
}

.dropdown-header { padding: 8px 12px 12px; }
.dh-name { font-size: 14px; font-weight: 600; color: var(--text-main); margin-bottom: 2px; }
.dh-email { font-size: 12px; color: var(--text-muted); }
.dropdown-divider { height: 1px; background: var(--border-color); margin: 4px 0; }
.dropdown-list { display: flex; flex-direction: column; gap: 2px; }
.dropdown-item {
  width: 100%; text-align: left; background: transparent; border: none; border-radius: 8px; padding: 10px 12px; color: var(--text-muted); cursor: pointer; display: flex; align-items: center; transition: all 0.2s ease;
}
.dropdown-item:hover { background: var(--hover-bg); color: var(--text-main); }
.di-icon { opacity: 0.8; margin-right: 2px; }
.danger-item { color: #FF453A; }
.danger-item:hover { background: rgba(255, 69, 58, 0.1); color: #FF453A; }
.danger-item .di-icon { color: #FF453A; }

.apple-content-scroll {
  flex: 1; overflow-y: auto; overflow-x: hidden; padding: 24px; scrollbar-width: thin; scrollbar-color: var(--border-color) transparent;
}
.apple-content-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
.apple-content-scroll::-webkit-scrollbar-track { background: transparent; }
.apple-content-scroll::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 10px; }
.apple-content-scroll::-webkit-scrollbar-thumb:hover { background: var(--scrollbar-hover); }

.apple-content-inner {
  background: var(--content-bg); border: 1px solid var(--border-color); border-radius: 16px; min-height: 100%; padding: 24px; box-shadow: 0 4px 20px var(--shadow-color); transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
}

.page-fade-enter-active, .page-fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.page-fade-enter-from { opacity: 0; transform: translateY(10px); }
.page-fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>