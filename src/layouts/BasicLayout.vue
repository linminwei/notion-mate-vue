<template>
  <div class="apple-layout-root" :class="{ 'theme-light': !isDark }">

    <!-- 侧边栏 (纯手写 Native Sidebar，极致对齐) -->
    <aside class="apple-sidebar" :class="{ 'is-collapsed': collapsed }">
      <!-- Logo 区域 -->
      <div class="sidebar-logo">
        <div class="logo-icon">
          <span class="icon-text">N</span>
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
                  <!-- 使用 Wrapper 彻底解决图标与文字的基线对齐问题 -->
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

              <!-- PC展开状态：子菜单列表 (Grid 1fr 实现丝滑高度动画) -->
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

          <div class="breadcrumb-area" v-show="!collapsed">
            <span class="greeting-text">欢迎回来，{{ userInfo?.nickname || '管理员' }}</span>
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

// 主题状态与切换逻辑
const isDark = ref(true)

onMounted(() => {
  // 读取主题缓存
  const storedTheme = localStorage.getItem('apple-theme')
  if (storedTheme === 'light') {
    isDark.value = false
  }
  document.addEventListener('click', closeUserMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeUserMenu)
})

const closeUserMenu = (e: MouseEvent) => {
  if (headerRightRef.value && !headerRightRef.value.contains(e.target as Node)) {
    isUserMenuOpen.value = false
  }
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('apple-theme', isDark.value ? 'dark' : 'light')
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
  --popup-bg: rgba(30, 30, 32, 0.85);
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
  --popup-bg: rgba(255, 255, 255, 0.95);
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

/* Sidebar Logo */
.sidebar-logo {
  height: 72px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
  border-bottom: 1px solid transparent;
  transition: padding 0.3s ease;
}
.apple-sidebar.is-collapsed .sidebar-logo {
  padding: 0;
  justify-content: center;
}

.logo-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--apple-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(10, 132, 255, 0.4), inset 0 1px 1px rgba(255,255,255,0.2);
}

.icon-text {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}

.logo-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--logo-text);
  letter-spacing: -0.01em;
  white-space: nowrap;
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

/* 标题左侧组 */
.title-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  height: 100%;
}
.apple-sidebar.is-collapsed .title-left {
  width: 100%;
  height: 100%;
  justify-content: center;
  gap: 0;
}

/* ----------------------------------------------------
   【核心修复区域】：图标与文字的完美基线对齐
------------------------------------------------------- */
/* 1. 图标包裹层：强制尺寸，保证内部绝对居中 */
.menu-icon-wrap {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  color: currentColor;
}
.menu-icon-wrap :deep(svg) {
  display: block; /* 消除 SVG 底部幽灵空白 */
}

/* 2. 文字层：加入视觉补偿 (Visual Compensation) */
.menu-text {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  line-height: 1; /* 统一行高以缩小包围盒 */
  transform: translateY(-1px); /* 【核心】针对中文字体的向下偏移进行 1px 的视觉微调 */
}
/* Tooltip 悬浮气泡里的文字通常自带 padding，取消补偿 */
.menu-text.reset-translate {
  transform: translateY(0);
}

/* 3. 展开收起箭头：同样应用对齐修正 */
.arrow-wrap {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  opacity: 0.5;
  transform: translateY(-0.5px); /* 箭头微调 */
}
.chevron-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.chevron-icon.is-open {
  transform: rotate(180deg);
}
/* ---------------------------------------------------- */

.apple-sidebar.is-collapsed .menu-icon-wrap {
  width: 100%;
  height: 100%;
  font-size: 22px;
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
  gap: 10px;
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
  width: 16px;
  height: 16px;
  font-size: 14px;
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
.apple-collapsed-popup.tooltip-only .menu-text {
  color: var(--text-main);
  margin: 0;
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
  gap: 10px;
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
  transition: all 0.2s ease;
}
.action-btn:hover { background: var(--hover-bg); }
.action-btn:active { transform: scale(0.95); }
.trigger-btn { border-radius: 10px; }
.theme-btn { border-radius: 50%; margin-right: 16px; }

.breadcrumb-area { display: flex; align-items: center; }
.greeting-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-main);
  letter-spacing: 0.5px;
}

.header-right {
  display: flex;
  align-items: center;
}

/* 自定义下拉胶囊 */
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

/* 下拉面板 */
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
.dropdown-item:hover { background: var(--hover-bg); color: var(--text-main); }
.di-icon { opacity: 0.8; margin-right: 2px; }

.danger-item { color: #FF453A; }
.danger-item:hover { background: rgba(255, 69, 58, 0.1); color: #FF453A; }
.danger-item .di-icon { color: #FF453A; }

.dropdown-fade-enter-active, .dropdown-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.dropdown-fade-enter-from, .dropdown-fade-leave-to { opacity: 0; transform: scale(0.95) translateY(-10px); }

/* ================= 内容区滚动 ================= */
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

/* 漂浮岛卡片 */
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

/* 页面切换动画 */
.page-fade-enter-active, .page-fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.page-fade-enter-from { opacity: 0; transform: translateY(10px); }
.page-fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>