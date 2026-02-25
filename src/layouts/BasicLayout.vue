<template>
  <div class="apple-layout-root" :class="{ 'theme-light': !isDark }">

    <!-- 侧边栏 (纯手写 Native Sidebar，极致对齐) -->
    <aside class="apple-sidebar" :class="{ 'is-collapsed': collapsed }">
      <!-- 【优化】品牌 Logo 区域：移除矩形容器 -->
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

          <template v-for="menu in menus" :key="menu.id">
            <!-- 1. 包含子菜单的父级项 -->
            <li v-if="menu.children && menu.children.length > 0" class="apple-menu-item-group">

              <!-- 父级标题行 -->
              <div
                  class="apple-menu-title"
                  :class="{
                  'is-active': isSubMenuOpen(menu.id) || (!collapsed && isParentSelected(menu)),
                  'parent-is-selected': collapsed && isParentSelected(menu)
                }"
                  @click="toggleSubMenu(menu.id)"
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
                      :class="{ 'is-open': isSubMenuOpen(menu.id) }"
                  />
                </div>
              </div>

              <!-- PC展开状态：子菜单列表 -->
              <div class="apple-submenu-wrapper" :class="{ 'is-open': isSubMenuOpen(menu.id) && !collapsed }">
                <ul class="apple-submenu-list">
                  <li
                      v-for="child in menu.children"
                      :key="child.path"
                      class="apple-sub-item"
                      :class="{ 'is-selected': selectedKeys.includes(child.path) }"
                      @click="navigateTo(child.path)"
                  >
                    <div class="menu-icon-wrap sub">
                      <font-awesome-icon :icon="getFaIcon(child.icon)" />
                    </div>
                    <span class="menu-text">{{ child.menuName }}</span>
                  </li>
                </ul>
              </div>

              <!-- 折叠状态下的完美 Hover Popup (悬浮气泡) -->
              <div v-if="collapsed" class="apple-collapsed-popup">
                <div class="popup-title">{{ menu.menuName }}</div>
                <ul class="popup-list">
                  <li
                      v-for="child in menu.children"
                      :key="`popup-${child.path}`"
                      class="popup-item"
                      :class="{ 'is-selected': selectedKeys.includes(child.path) }"
                      @click="navigateTo(child.path)"
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
                  @click="navigateTo(menu.path)"
              >
                <div class="title-left">
                  <div class="menu-icon-wrap">
                    <font-awesome-icon :icon="getFaIcon(menu.icon)" />
                  </div>
                  <span class="menu-text" v-show="!collapsed">{{ menu.menuName }}</span>
                </div>
              </div>

              <!-- 独立项在折叠状态的 Tooltip 气泡 -->
              <div v-if="collapsed" class="apple-collapsed-popup tooltip-only">
                <span class="menu-text reset-translate">{{ menu.menuName }}</span>
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
        <div class="header-left">
          <!-- 侧边栏开关 -->
          <button class="action-btn trigger-btn" @click="collapsed = !collapsed">
            <font-awesome-icon :icon="['fas', 'bars']" v-if="collapsed" />
            <font-awesome-icon :icon="['fas', 'indent']" v-else />
          </button>

          <!-- 【终极版】大胶囊整体容器、无下拉箭头、所有层级结构绝对统一的面包屑 -->
          <div class="breadcrumb-area">
            <div class="apple-breadcrumb-container">
              <template v-for="(crumb, index) in breadcrumbs" :key="index">

                <!-- 统一所有层级：不论是否是最后一级，只要有同级元素，均可点击展开 -->
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
                    <!-- 彻底移除了右侧的下拉指示箭头 -->
                  </div>

                  <!-- 悬浮弹出的子菜单面板：显示"同级菜单" -->
                  <transition name="dropdown-fade">
                    <div v-show="openBreadcrumb === index && crumb.siblings && crumb.siblings.length > 1" class="crumb-dropdown-panel" @click.stop>
                      <div
                          v-for="sibling in crumb.siblings"
                          :key="sibling.path || sibling.menuName"
                          class="crumb-dropdown-item"
                          :class="{ 'is-active': sibling.menuName === crumb.name }"
                          @click="navigateTo(sibling.path || (sibling.children && sibling.children.length > 0 ? sibling.children[0].path : '')); openBreadcrumb = null"
                      >
                        <div class="crumb-dropdown-icon">
                          <font-awesome-icon :icon="getFaIcon(sibling.icon)" />
                        </div>
                        <span class="dropdown-item-text">{{ sibling.menuName }}</span>
                      </div>
                    </div>
                  </transition>
                </div>

                <!-- 分隔符 (优雅的斜杠分割线) -->
                <span class="crumb-separator" v-if="index < breadcrumbs.length - 1">/</span>

              </template>
            </div>
          </div>
        </div>

        <div class="header-right" ref="headerRightRef">
          <!-- 主题明暗切换按钮 -->
          <button class="action-btn theme-btn" @click="toggleTheme" :title="isDark ? '切换至亮色' : '切换至暗色'">
            <font-awesome-icon :icon="['fas', 'sun']" v-if="isDark" />
            <font-awesome-icon :icon="['fas', 'moon']" v-else />
          </button>

          <!-- 用户下拉胶囊菜单 -->
          <div class="custom-dropdown-container">
            <div class="user-pill-btn" @click.stop="isUserMenuOpen = !isUserMenuOpen">
              <div class="user-avatar">
                {{ userInfo?.nickname?.charAt(0) || userInfo?.username?.charAt(0) || 'U' }}
              </div>
              <span class="user-name">{{ userInfo?.nickname || userInfo?.username }}</span>
              <font-awesome-icon :icon="['fas', 'chevron-down']" class="dropdown-icon" :class="{ 'rotated': isUserMenuOpen }" />
            </div>

            <!-- 下拉浮层面板 -->
            <transition name="dropdown-fade">
              <div v-if="isUserMenuOpen" class="user-dropdown-panel" @click.stop>
                <div class="dropdown-header">
                  <div class="dh-name">{{ userInfo?.nickname || userInfo?.username }}</div>
                  <div class="dh-email">{{ userInfo?.email || 'admin@notionmate.com' }}</div>
                </div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-list">
                  <button class="dropdown-item">
                    <div class="menu-icon-wrap sub di-icon">
                      <font-awesome-icon :icon="['fas', 'user']" />
                    </div>
                    个人设置
                  </button>
                  <button class="dropdown-item">
                    <div class="menu-icon-wrap sub di-icon">
                      <font-awesome-icon :icon="['fas', 'cog']" />
                    </div>
                    系统偏好
                  </button>
                  <div class="dropdown-divider"></div>
                  <button class="dropdown-item danger-item" @click="handleLogout">
                    <div class="menu-icon-wrap sub di-icon">
                      <font-awesome-icon :icon="['fas', 'sign-out-alt']" />
                    </div>
                    退出登录
                  </button>
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
// 引入 FontAwesome 核心库，用于获取全局图标注册表
import { library } from '@fortawesome/fontawesome-svg-core'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 状态控制
const collapsed = ref(false)
const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>([])

// 用户下拉菜单状态
const isUserMenuOpen = ref(false)
const headerRightRef = ref<HTMLElement | null>(null)

// 面包屑点击下拉状态
const openBreadcrumb = ref<number | null>(null)

// 主题状态与切换逻辑
const isDark = ref(true)

onMounted(() => {
  // 读取主题缓存
  const storedTheme = localStorage.getItem('apple-theme')
  if (storedTheme === 'light') {
    isDark.value = false
  }
  document.addEventListener('click', closeDropdowns)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
})

// 点击外部时统一关闭所有的下拉菜单
const closeDropdowns = (e: MouseEvent) => {
  if (headerRightRef.value && !headerRightRef.value.contains(e.target as Node)) {
    isUserMenuOpen.value = false
  }
  openBreadcrumb.value = null
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('apple-theme', isDark.value ? 'dark' : 'light')
}

// 控制面包屑下拉弹窗 (只有当拥有同级菜单时才触发弹出)
const toggleBreadcrumb = (index: number, crumb: any) => {
  if (crumb.siblings && crumb.siblings.length > 1) {
    if (openBreadcrumb.value === index) {
      openBreadcrumb.value = null
    } else {
      openBreadcrumb.value = index
    }
  }
}

// 侧边栏菜单逻辑
const toggleSubMenu = (id: string) => {
  if (collapsed.value) return
  const index = openKeys.value.indexOf(id)
  if (index === -1) {
    openKeys.value.push(id)
  } else {
    openKeys.value.splice(index, 1)
  }
}

const isSubMenuOpen = (id: string) => {
  return openKeys.value.includes(id)
}

// 检查某个父菜单下是否有子菜单被选中 (用于折叠时的图标高亮)
const isParentSelected = (menu: any) => {
  if (!menu.children) return false
  return menu.children.some((child: any) => selectedKeys.value.includes(child.path))
}

const navigateTo = (path: string) => {
  if (!path) return // 防御性点击
  isUserMenuOpen.value = false
  router.push(path.startsWith('/') ? path : `/${path}`)
}

const handleLogout = async () => {
  isUserMenuOpen.value = false
  await userStore.logout()
}

// 数据源
const userInfo = computed(() => userStore.userInfo)
const menus = computed(() => userStore.menus)

// 动态计算面包屑数据：绑定“同级菜单 (siblings)” 而非子菜单
const breadcrumbs = computed(() => {
  const currentPath = route.path
  const crumbs: any[] = []
  const topLevelMenus = menus.value || [] // 顶层菜单的同级兄弟节点

  for (const menu of topLevelMenus) {
    // 1. 匹配：如果是独立一级菜单
    if (menu.path === currentPath) {
      crumbs.push({
        name: menu.menuName,
        icon: menu.icon,
        isLast: true,
        siblings: topLevelMenus // 它同级的菜单就是所有的顶层菜单
      })
      break
    }
    // 2. 匹配：如果在子菜单中
    if (menu.children && menu.children.length > 0) {
      const child = menu.children.find((c: any) => c.path === currentPath)
      if (child) {
        // 父级面包屑 (点击下拉应显示它的同级：即其他主菜单)
        crumbs.push({
          name: menu.menuName,
          icon: menu.icon,
          isLast: false,
          siblings: topLevelMenus
        })
        // 当前活跃的子级面包屑 (点击下拉应显示它的同级：即当前父级下的其他子菜单)
        crumbs.push({
          name: child.menuName,
          icon: child.icon,
          isLast: true,
          siblings: menu.children
        })
        break
      }
    }
  }

  // 兜底逻辑：如果没有选中任何有效菜单 (如页面404或其他特殊路由)，始终保留一个根路径
  if (crumbs.length === 0) {
    crumbs.push({
      name: '首页',
      icon: 'home',
      isLast: true,
      siblings: topLevelMenus
    })
  }

  return crumbs
})

/** * 【终极智能图标解析器】（零维护成本版） */
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

    if (registry['fab'] && registry['fab'][name]) {
      prefix = 'fab'
    } else if (registry['far'] && registry['far'][name]) {
      prefix = 'far'
    }
  }

  return [prefix, name]
}

watch(() => route.path, (path) => {
  selectedKeys.value = [path]
}, { immediate: true })
</script>

<style scoped>
/* ================= 全局重置与响应式 CSS 变量 ================= */
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

/* 亮色模式变量覆盖 */
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

/* ================= 侧边栏 (Sidebar) ================= */
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

/* ================= 【优化后】品牌 Logo UI 专属样式 ================= */
.sidebar-logo {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
  border-bottom: 1px solid var(--border-color);
  transition: padding 0.3s ease;
}
.apple-sidebar.is-collapsed .sidebar-logo {
  padding: 0;
  justify-content: center;
}

.logo-wrapper {
  width: 36px; /* 稍微放大 */
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  /* 彻底移除了背景、边框和阴影 */
  background: transparent;
  border: none;
  overflow: visible;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.apple-sidebar.is-collapsed .logo-wrapper {
  width: 40px;
  height: 40px;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 改为 contain 确保 Logo 比例正确 */
  display: block;
  transition: filter 0.3s ease;
}

.apple-layout-root.theme-light .logo-img {
  filter: invert(1) brightness(0.2);
}

.logo-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
  letter-spacing: 0px;
  white-space: nowrap;
  margin-top: 1px;
}


/* ================= 手写原生层级菜单系统 ================= */
.sidebar-menu-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: visible;
  padding: 16px 0;
  scrollbar-width: none;
}
.sidebar-menu-scroll::-webkit-scrollbar { display: none; }

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
  height: 44px;
  padding: 0 12px;
  margin: 0 14px;
  border-radius: 12px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.apple-sidebar.is-collapsed .apple-menu-title {
  width: 44px;
  height: 44px;
  margin: 8px auto;
  padding: 0;
  justify-content: center;
}

.apple-menu-title:hover {
  background: var(--hover-bg);
  color: var(--text-main);
}
.apple-menu-title.is-active {
  color: var(--text-main);
}

.apple-sidebar.is-collapsed .apple-menu-title.parent-is-selected {
  background: var(--apple-blue);
  color: #fff;
  box-shadow: 0 4px 12px rgba(10, 132, 255, 0.3);
}

.apple-menu-title.single-item.is-selected {
  background: var(--apple-blue);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(10, 132, 255, 0.3);
}

/* ----------------------------------------------------
   图标与文字对齐
------------------------------------------------------- */
.title-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.apple-sidebar.is-collapsed .title-left {
  justify-content: center;
  gap: 0;
}

.menu-icon-wrap {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  flex-shrink: 0;
  color: currentColor;
}
.menu-icon-wrap :deep(svg) {
  display: block;
  transform: translateY(-1px);
}

.menu-text {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  line-height: 1;
  transform: translateY(1px);
}

.arrow-wrap {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  opacity: 0.5;
}
.arrow-wrap :deep(svg) {
  display: block;
  transform: translateY(1px);
}
.chevron-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.chevron-icon.is-open {
  transform: rotate(180deg);
}

.apple-sidebar.is-collapsed .menu-icon-wrap {
  width: 44px;
  height: 44px;
  font-size: 18px;
}
.apple-sidebar.is-collapsed .menu-icon-wrap :deep(svg) {
  transform: translateY(0);
}

/* --------- 展开子菜单 (Grid 高度动画) --------- */
.apple-submenu-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.apple-submenu-wrapper.is-open {
  grid-template-rows: 1fr;
}
.apple-submenu-list {
  overflow: hidden;
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.apple-sub-item {
  height: 40px;
  margin: 2px 14px 2px 34px;
  padding: 0 12px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}
.apple-sub-item:hover {
  background: var(--hover-bg);
  color: var(--text-main);
}
.apple-sub-item.is-selected {
  background: var(--apple-blue);
  color: #fff;
  font-weight: 600;
}
.menu-icon-wrap.sub {
  width: 20px;
  height: 20px;
  font-size: 13px;
  opacity: 0.8;
}

/* --------- 折叠状态悬浮气泡 (Hover Popup) --------- */
.apple-collapsed-popup {
  position: absolute;
  top: 0;
  left: calc(100% + 12px);
  background: var(--popup-bg);
  backdrop-filter: blur(30px) saturate(150%);
  -webkit-backdrop-filter: blur(30px) saturate(150%);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 6px;
  min-width: 160px;
  box-shadow: 0 10px 40px var(--shadow-color);
  opacity: 0;
  visibility: hidden;
  transform: translateX(-10px);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
  z-index: 1000;
}

.apple-menu-item-group:hover .apple-collapsed-popup {
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
  pointer-events: auto;
}

.apple-collapsed-popup.tooltip-only {
  min-width: auto;
  padding: 8px 16px;
}

.popup-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  padding: 6px 12px 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}
.popup-item:hover {
  background: var(--hover-bg);
  color: var(--text-main);
}
.popup-item.is-selected {
  background: var(--apple-blue);
  color: #fff;
  font-weight: 600;
}


/* ================= 主内容区域 (Main) ================= */
.apple-main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  position: relative;
}

/* ================= 顶部导航 (Header) ================= */
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
  box-sizing: border-box;
  transition: background 0.4s ease, border-color 0.4s ease;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-btn {
  background: var(--pill-bg);
  border: 1px solid var(--pill-border);
  color: var(--text-main);
  font-size: 15px;
  width: 36px;
  height: 36px;
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

/* ================= 面包屑样式 ================= */
.apple-breadcrumb-container {
  display: flex;
  align-items: center;
  margin-left: 8px;
  background: var(--pill-bg);
  border: 1px solid var(--pill-border);
  border-radius: 999px;
  padding: 0 8px;
  height: 32px;
  box-sizing: border-box;
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
  gap: 6px;
  padding: 0 10px;
  border-radius: 16px;
  height: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-muted);
  box-sizing: border-box;
}

.crumb-trigger.is-last {
  color: var(--text-main);
}
.crumb-trigger:hover, .crumb-trigger.is-open {
  background: var(--hover-bg);
  color: var(--text-main);
}

.crumb-icon-raw, .crumb-dropdown-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  font-size: 14px;
  color: inherit;
}

.crumb-icon-raw :deep(svg),
.crumb-dropdown-icon :deep(svg) {
  display: block;
  width: 14px !important;
  height: 14px !important;
  transform: translateY(-1px);
}

.crumb-text, .dropdown-item-text {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  line-height: 1;
  transform: translateY(1px);
}

.crumb-dropdown-panel {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: var(--popup-bg);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 6px;
  min-width: 150px;
  box-shadow: 0 10px 40px var(--shadow-color);
  z-index: 1000;
}

.dropdown-fade-enter-active, .dropdown-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.dropdown-fade-enter-from, .dropdown-fade-leave-to { opacity: 0; transform: scale(0.95) translateY(-5px); }

.crumb-dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 2px;
}
.crumb-dropdown-item:last-child {
  margin-bottom: 0;
}
.crumb-dropdown-item:hover {
  background: var(--hover-bg);
  color: var(--text-main);
}
.crumb-dropdown-item.is-active {
  background: var(--apple-blue);
  color: #fff;
}

.crumb-separator {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 400;
  color: var(--text-muted);
  opacity: 0.4;
  margin: 0;
  width: 12px;
  user-select: none;
  transform: translateY(1px);
}

/* ---------------------------------------------------- */

.header-right {
  display: flex;
  align-items: center;
}

.custom-dropdown-container {
  position: relative;
}

.user-pill-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--pill-bg);
  border: 1px solid var(--pill-border);
  padding: 4px 12px 4px 4px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.user-pill-btn:hover {
  background: var(--hover-bg);
  border-color: var(--border-color);
}

.user-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--apple-blue); color: #fff;
  font-weight: 600; font-size: 13px;
  display: flex; align-items: center; justify-content: center;
}
.user-name { font-size: 13px; font-weight: 500; color: var(--text-main); }
.dropdown-icon { font-size: 11px; color: var(--text-muted); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.dropdown-icon.rotated { transform: rotate(180deg); }

.user-dropdown-panel {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: var(--popup-bg);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  min-width: 200px;
  padding: 8px;
  box-shadow: 0 16px 40px var(--shadow-color);
  z-index: 1000;
  transform-origin: top right;
}

.dropdown-header { padding: 8px 12px 12px; }
.dh-name { font-size: 14px; font-weight: 600; color: var(--text-main); margin-bottom: 2px; }
.dh-email { font-size: 12px; color: var(--text-muted); }

.dropdown-divider { height: 1px; background: var(--border-color); margin: 4px 0; }

.dropdown-list { display: flex; flex-direction: column; gap: 2px; }
.dropdown-item {
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 10px 12px;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}
.dropdown-item:hover {
  background: var(--hover-bg);
  color: var(--text-main);
}
.di-icon { opacity: 0.8; margin-right: 2px; }

.danger-item { color: #FF453A; }
.danger-item:hover { background: rgba(255, 69, 58, 0.1); color: #FF453A; }
.danger-item .di-icon { color: #FF453A; }

.apple-content-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px;
  box-sizing: border-box;
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
}
.apple-content-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
.apple-content-scroll::-webkit-scrollbar-track { background: transparent; }
.apple-content-scroll::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 10px; }
.apple-content-scroll::-webkit-scrollbar-thumb:hover { background: var(--scrollbar-hover); }

.apple-content-inner {
  background: var(--content-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  min-height: 100%;
  padding: 24px;
  box-sizing: border-box;
  box-shadow: 0 4px 20px var(--shadow-color);
  transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
}

.page-fade-enter-active, .page-fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.page-fade-enter-from { opacity: 0; transform: translateY(10px); }
.page-fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>