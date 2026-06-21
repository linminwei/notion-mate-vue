<template>
  <div class="portal-root" :class="{ 'theme-dark dark': appStore.isDark, 'theme-light': !appStore.isDark }">

    <!-- ================= 全局背景引擎 ================= -->
    <div class="portal-bg-engine">
      <div class="void-bg"></div>
      <div class="grid-lines-wrapper">
        <div class="grid-vertical"></div>
        <div class="grid-flow"></div>
      </div>
      <div class="ray-beams">
        <div class="beam beam-1"></div>
        <div class="beam beam-2"></div>
        <div class="beam beam-3"></div>
        <div class="beam beam-4"></div>
      </div>
      <div class="grid-overlay"></div>
      <div class="vignette"></div>
      <div class="ambient-orb"></div>
    </div>

    <!-- ================= 全局导航栏 ================= -->
    <div class="nav-container">
      <nav class="portal-nav">
        <div class="nav-left">
          <div class="logo-dropdown-container">
            <div class="portal-logo" :class="{ 'is-active': isLogoMenuOpen }" @click.stop="isLogoMenuOpen = !isLogoMenuOpen">
              <img src="/notion-mate-dark.png" class="logo-svg">
              <font-awesome-icon :icon="['fas', 'chevron-down']" class="logo-chevron" :class="{ rotated: isLogoMenuOpen }" />
            </div>
            <Transition name="dropdown-fade">
              <div v-if="isLogoMenuOpen" class="logo-dropdown-panel" @click.stop>
                <a class="logo-dropdown-item" @click="router.push('/portal'); isLogoMenuOpen = false">
                  <font-awesome-icon :icon="['fas', 'home']" />
                  <span>主页</span>
                </a>
                <div class="dropdown-divider"></div>
                <a class="logo-dropdown-item" @click="router.push('/portal/websites'); isLogoMenuOpen = false">
                  <font-awesome-icon :icon="['fas', 'globe']" />
                  <span>网站推荐</span>
                </a>
                <div v-if="appStore.showRestricted" class="dropdown-divider"></div>
                <a v-if="appStore.showRestricted" class="logo-dropdown-item" @click="router.push('/portal/extensions'); isLogoMenuOpen = false">
                  <font-awesome-icon :icon="['fas', 'puzzle-piece']" />
                  <span>扩展推荐</span>
                </a>
                <div v-if="appStore.showRestricted" class="dropdown-divider"></div>
                <a v-if="appStore.showRestricted" class="logo-dropdown-item" @click="router.push('/portal/apps'); isLogoMenuOpen = false">
                  <font-awesome-icon :icon="['fas', 'laptop']" />
                  <span>软件推荐</span>
                </a>
              </div>
            </Transition>
          </div>
        </div>

        <div class="nav-right">
          <!-- 限制内容切换 -->
          <button
            class="nav-icon-btn restricted-toggle"
            :class="{ 'is-restricted': !appStore.showRestricted }"
            @click="appStore.toggleRestricted()"
            :title="appStore.showRestricted ? '隐藏限制内容' : '显示限制内容'"
          >
            <font-awesome-icon :icon="['fas', 'eye-slash']" v-if="!appStore.showRestricted" />
            <font-awesome-icon :icon="['fas', 'eye']" v-else />
          </button>

          <!-- 暗黑模式切换 -->
          <button class="nav-icon-btn" @click="appStore.toggleTheme" :title="appStore.isDark ? '切换至亮色' : '切换至暗色'">
            <font-awesome-icon :icon="['fas', 'moon']" v-if="appStore.isDark" />
            <font-awesome-icon :icon="['fas', 'sun']" v-else />
          </button>

          <!-- 用户下拉菜单 -->
          <div class="user-dropdown-container">
            <div class="user-pill-btn" :class="{ 'is-active': isUserMenuOpen }" @click.stop="isUserMenuOpen = !isUserMenuOpen">
              <div class="user-avatar-small">
                <img v-if="userInfo?.avatar" :src="userInfo.avatar" class="avatar-img" @error="onAvatarError" />
                <span v-else>{{ userInfo?.nickname?.charAt(0) || userInfo?.username?.charAt(0) || 'U' }}</span>
              </div>
              <span class="user-name">{{ userInfo?.nickname || userInfo?.username }}</span>
              <font-awesome-icon :icon="['fas', 'chevron-down']" class="chevron-icon" :class="{ 'rotated': isUserMenuOpen }" />
            </div>

            <transition name="dropdown-fade">
              <div v-if="isUserMenuOpen" class="user-dropdown-panel" @click.stop>
                <div class="dropdown-header">
                  <div class="user-avatar-large">
                    <img v-if="userInfo?.avatar" :src="userInfo.avatar" class="avatar-img" @error="onAvatarError" />
                    <span v-else>{{ userInfo?.nickname?.charAt(0) || userInfo?.username?.charAt(0) || 'U' }}</span>
                  </div>
                  <div class="profile-info">
                    <div class="profile-name">{{ userInfo?.nickname || userInfo?.username }}</div>
                    <div class="profile-email">{{ userInfo?.email || '未绑定邮箱' }}</div>
                  </div>
                </div>

                <div class="dropdown-divider"></div>

                <div class="dropdown-action-group">
                  <div class="dropdown-item" @click="openSettingsModal('profile')">
                    <div class="item-main">
                      <div class="item-icon-wrapper">
                        <font-awesome-icon :icon="['fas', 'user']" />
                      </div>
                      <span class="item-text">个人设置</span>
                    </div>
                  </div>
                  <div class="dropdown-item" @click="openSettingsModal('preferences')">
                    <div class="item-main">
                      <div class="item-icon-wrapper">
                        <font-awesome-icon :icon="['fas', 'cog']" />
                      </div>
                      <span class="item-text">系统偏好</span>
                    </div>
                  </div>
                </div>

                <div class="dropdown-divider"></div>

                <div class="dropdown-action-group">
                  <div class="dropdown-item danger-item" @click="handleLogout">
                    <div class="item-main">
                      <div class="item-icon-wrapper">
                        <font-awesome-icon :icon="['fas', 'sign-out-alt']" />
                      </div>
                      <span class="item-text">退出登录</span>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </nav>
    </div>

    <!-- ================= 子页面内容 ================= -->
    <router-view />

    <!-- 设置弹窗 -->
    <UserSettingsModal :visible="isSettingsModalOpen" :initial-tab="settingsTab" @close="closeSettingsModal" @logout="handleLogout" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import UserSettingsModal from '@/components/common/UserSettingsModal.vue'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)
const isUserMenuOpen = ref(false)
const isLogoMenuOpen = ref(false)
const isSettingsModalOpen = ref(false)
const settingsTab = ref<'profile' | 'preferences'>('profile')

const openSettingsModal = (tab: 'profile' | 'preferences' = 'profile') => {
  isUserMenuOpen.value = false
  settingsTab.value = tab
  isSettingsModalOpen.value = true
}

const closeSettingsModal = () => {
  isSettingsModalOpen.value = false
}

const onAvatarError = () => {}

const handleLogout = async () => {
  isUserMenuOpen.value = false
  await userStore.logout()
}

const closeDropdown = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.user-dropdown-container')) {
    isUserMenuOpen.value = false
  }
  if (!target.closest('.logo-dropdown-container')) {
    isLogoMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
/* ================= CSS 变量（暗黑模式默认） ================= */
.portal-root {
  --bg-deep: #060b14;
  --bg-surface: #0d1321;
  --text-primary: #ffffff;
  --text-secondary: #999;
  --text-muted: #888;
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-medium: rgba(255, 255, 255, 0.12);
  --hover-bg: rgba(255, 255, 255, 0.06);
  --dropdown-bg: rgba(13, 19, 33, 0.96);
  --shadow-nav: 0 8px 24px rgba(0, 0, 0, 0.5);
  --shadow-dropdown: 0 0 0 1px rgba(0, 0, 0, 0.02), 0 10px 40px -10px rgba(0, 0, 0, 0.6), 0 4px 12px rgba(0, 0, 0, 0.2);
  --avatar-gradient-from: #0A84FF;
  --avatar-gradient-to: #5AC8FA;
}

/* ================= 亮色模式变量覆盖 ================= */
.portal-root.theme-light {
  --bg-deep: #f5f5f7;
  --bg-surface: rgba(255, 255, 255, 0.85);
  --text-primary: #1d1d1f;
  --text-secondary: #6e6e73;
  --text-muted: #86868b;
  --border-subtle: rgba(0, 0, 0, 0.08);
  --border-medium: rgba(0, 0, 0, 0.12);
  --hover-bg: rgba(0, 0, 0, 0.04);
  --dropdown-bg: rgba(255, 255, 255, 0.95);
  --shadow-nav: 0 8px 24px rgba(0, 0, 0, 0.08);
  --shadow-dropdown: 0 0 0 1px rgba(0, 0, 0, 0.04), 0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* ================= 根容器 ================= */
.portal-root {
  width: 100%;
  min-height: 100vh;
  background-color: var(--bg-deep);
  font-family: -apple-system, BlinkMacSystemFont, "Inter", "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
  color: var(--text-primary);
  overflow-x: hidden;
  position: relative;
  transition: background-color 0.4s ease;
}

/* ================= 背景引擎 ================= */
.portal-bg-engine {
  position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
  z-index: 0; pointer-events: none;
}

.void-bg {
  position: absolute; width: 100%; height: 100%;
  background: radial-gradient(ellipse at 50% -20%, #0f1b35 0%, #060b14 55%, #040810 100%);
  transition: background 0.4s ease;
}
.portal-root.theme-light .void-bg {
  background: radial-gradient(circle at 50% 0%, #e8e8ed 0%, #f5f5f7 60%);
}

.grid-lines-wrapper {
  position: absolute; top: -150%; left: -150%; width: 400%; height: 400%;
  z-index: 1; transform: rotate(-60deg); pointer-events: none;
}
.grid-vertical {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: repeating-linear-gradient(90deg, transparent 0, transparent 39px, rgba(80, 130, 255, 0.05) 40px, transparent 41px);
  mask-image: radial-gradient(circle at center, black 0%, transparent 80%);
  animation: grid-scan 30s linear infinite;
}
.portal-root.theme-light .grid-vertical {
  background: repeating-linear-gradient(90deg, transparent 0, transparent 39px, rgba(0, 0, 0, 0.05) 40px, transparent 41px);
}
@keyframes grid-scan {
  0% { transform: translateX(0); }
  100% { transform: translateX(41px); }
}

.grid-flow {
  position: absolute; top: 0; left: 0; width: 100%; height: 200%;
  background: linear-gradient(180deg, transparent 0%, rgba(50, 120, 255, 0.08) 30%, transparent 60%);
  background-size: 100% 200px;
  animation: flow-drop 16s linear infinite;
  mix-blend-mode: screen;
}
.portal-root.theme-light .grid-flow {
  background: linear-gradient(180deg, transparent 0%, rgba(0, 132, 255, 0.08) 30%, transparent 60%);
  mix-blend-mode: normal;
}
@keyframes flow-drop {
  0% { transform: translateY(-50%); }
  100% { transform: translateY(0); }
}

.grid-overlay {
  position: absolute; width: 100%; height: 100%;
  background-image:
    linear-gradient(rgba(80, 130, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(80, 130, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(circle at center, black 50%, transparent 90%);
}
.portal-root.theme-light .grid-overlay {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px);
}

.vignette {
  position: absolute; width: 100%; height: 100%;
  background: radial-gradient(circle at center, transparent 40%, #060b14 100%);
  transition: background 0.4s ease;
}
.portal-root.theme-light .vignette {
  background: radial-gradient(circle at center, transparent 40%, #f5f5f7 100%);
}

.ambient-orb {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 600px; height: 600px;
  background: radial-gradient(circle at center, rgba(40, 100, 220, 0.08), rgba(20, 60, 160, 0.03) 40%, transparent 70%);
  pointer-events: none; opacity: 0.7;
  animation: orb-breathe 8s ease-in-out infinite;
}
@keyframes orb-breathe {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.05); }
}
.portal-root.theme-light .ambient-orb { display: none; }

.ray-beams {
  position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
  transform: rotate(-60deg); opacity: 0.4;
}
.beam {
  position: absolute;
  background: linear-gradient(180deg, rgba(50, 120, 255, 0) 0%, rgba(50, 120, 255, 0.35) 50%, rgba(50, 120, 255, 0) 100%);
  width: 300px; height: 100%; filter: blur(60px);
  mix-blend-mode: screen;
  animation: beam-flow 22s infinite ease-in-out alternate;
}
.portal-root.theme-light .beam {
  background: linear-gradient(180deg, rgba(0, 132, 255, 0) 0%, rgba(0, 132, 255, 0.25) 50%, rgba(0, 132, 255, 0) 100%);
  filter: blur(50px); mix-blend-mode: normal; opacity: 0.5;
}
.beam-1 { left: 45%; animation-delay: 0s; width: 360px; opacity: 0.8; }
.beam-2 { left: 55%; width: 240px; opacity: 0.6; animation-delay: -2s; }
.beam-3 { left: 40%; width: 440px; opacity: 0.4; animation-delay: -4s; }
.beam-4 { left: 50%; width: 200px; opacity: 0.5; animation-delay: -1s; transform: translateY(100px); }
@keyframes beam-flow {
  from { transform: translateY(-40px) scale(1); opacity: 0.5; }
  to { transform: translateY(40px) scale(1.1); opacity: 0.9; }
}

/* ================= 导航栏 ================= */
.nav-container {
  position: fixed; top: 20px; left: 0; width: 100%;
  display: flex; justify-content: center; z-index: 100;
  padding: 0 24px; box-sizing: border-box;
}
.portal-nav {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; max-width: 960px; height: 48px;
  background: var(--bg-surface); border: 1px solid var(--border-subtle);
  border-radius: 99px; padding: 0 6px 0 20px;
  box-shadow: var(--shadow-nav);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  transition: all 0.3s ease;
}
.nav-left { display: flex; align-items: center; height: 100%; flex: 1; }
.logo-dropdown-container { position: relative; }
.portal-logo {
  display: flex; align-items: center; gap: 6px; height: 100%;
  padding: 4px 8px; border-radius: 8px;
  cursor: pointer; transition: all 0.2s ease;
}
.portal-logo:hover { background: var(--hover-bg); }
.portal-logo.is-active { background: var(--hover-bg); }
.logo-svg { width: 20px; height: 20px; display: block; object-fit: contain; }
.portal-root.theme-light .logo-svg { filter: invert(1) brightness(0.2); }
.logo-chevron {
  font-size: 9px; color: var(--text-muted);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.logo-chevron.rotated { transform: rotate(180deg); }

/* logo 下拉面板 */
.logo-dropdown-panel {
  position: absolute; top: calc(100% + 10px); left: 0;
  background: var(--dropdown-bg);
  backdrop-filter: blur(32px) saturate(200%); -webkit-backdrop-filter: blur(32px) saturate(200%);
  border: 1px solid var(--border-medium); border-radius: 14px;
  min-width: 160px; padding: 4px; box-shadow: var(--shadow-dropdown);
  z-index: 1000; transform-origin: top left;
}
.logo-dropdown-item {
  display: flex; align-items: center; gap: 10px;
  background: transparent; border: none; border-radius: 8px;
  padding: 9px 12px;
  color: var(--text-primary); font-size: 13px; font-weight: 500;
  cursor: pointer; text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease;
}
.logo-dropdown-item:hover { background: var(--hover-bg); }
.logo-dropdown-item :deep(svg) { font-size: 14px; color: var(--text-muted); }
.logo-dropdown-item:hover :deep(svg) { color: var(--text-primary); }
.nav-right { display: flex; align-items: center; justify-content: flex-end; gap: 8px; height: 100%; flex: 1; }

.nav-icon-btn {
  width: 36px; height: 36px; border-radius: 50%;
  border: 1px solid var(--border-subtle); background: var(--hover-bg);
  color: var(--text-primary); font-size: 14px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.2s ease;
}
.nav-icon-btn:hover { background: rgba(255, 255, 255, 0.12); }
.portal-root.theme-light .nav-icon-btn:hover { background: rgba(0, 0, 0, 0.08); }
.restricted-toggle { color: #30D158; }
.restricted-toggle.is-restricted { color: #FF453A; }

/* ================= 用户下拉区 ================= */
.user-dropdown-container { position: relative; }
.user-pill-btn {
  display: flex; align-items: center; gap: 8px;
  background: var(--hover-bg); border: 1px solid var(--border-subtle);
  padding: 4px 12px 4px 4px; border-radius: 30px; cursor: pointer;
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.user-pill-btn:hover { background: rgba(255, 255, 255, 0.1); }
.portal-root.theme-light .user-pill-btn:hover { background: rgba(0, 0, 0, 0.06); }
.user-pill-btn.is-active { background: rgba(255, 255, 255, 0.12); }
.portal-root.theme-light .user-pill-btn.is-active { background: rgba(0, 0, 0, 0.08); }
.user-avatar-small {
  width: 28px; height: 28px; border-radius: 50%;
  background: linear-gradient(135deg, var(--avatar-gradient-from), var(--avatar-gradient-to));
  color: #ffffff; font-weight: 600; font-size: 13px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 6px rgba(10, 132, 255, 0.3); overflow: hidden;
}
.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.user-name { font-size: 13px; font-weight: 500; color: var(--text-primary); transition: color 0.3s ease; }
.chevron-icon { font-size: 10px; color: var(--text-muted); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.chevron-icon.rotated { transform: rotate(180deg); }

/* ================= 下拉面板 ================= */
.user-dropdown-panel {
  position: absolute; top: calc(100% + 12px); right: 0;
  background: var(--dropdown-bg);
  backdrop-filter: blur(32px) saturate(200%); -webkit-backdrop-filter: blur(32px) saturate(200%);
  border: 1px solid var(--border-medium); border-radius: 16px;
  min-width: 240px; padding: 6px; box-shadow: var(--shadow-dropdown);
  z-index: 1000; transform-origin: top right;
}
.dropdown-header { display: flex; align-items: center; gap: 14px; padding: 12px; margin-bottom: 2px; }
.user-avatar-large {
  width: 44px; height: 44px; border-radius: 50%;
  background: linear-gradient(135deg, var(--avatar-gradient-from), var(--avatar-gradient-to));
  color: #ffffff; font-weight: 600; font-size: 18px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(10, 132, 255, 0.3); overflow: hidden;
}
.profile-info { display: flex; flex-direction: column; justify-content: center; overflow: hidden; }
.profile-name { font-size: 15px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.3; }
.profile-email { font-size: 12px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
.dropdown-divider { height: 1px; background: var(--border-subtle); margin: 6px 6px; }
.dropdown-action-group { display: flex; flex-direction: column; gap: 2px; }
.dropdown-item {
  width: 100%; display: flex; align-items: center; justify-content: space-between;
  background: transparent; border: none; border-radius: 8px; padding: 10px 12px;
  color: var(--text-primary); cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, transform 0.1s ease;
}
.dropdown-item:hover { background: var(--hover-bg); }
.dropdown-item:active { transform: scale(0.98); }
.item-main { display: flex; align-items: center; gap: 12px; }
.item-icon-wrapper { width: 18px; display: flex; align-items: center; justify-content: center; font-size: 15px; color: var(--text-muted); transition: color 0.2s ease; }
.item-text { font-size: 14px; font-weight: 500; }
.dropdown-item:hover .item-icon-wrapper { color: var(--text-primary); }
.danger-item { color: #FF453A; }
.danger-item .item-icon-wrapper { color: #FF453A; }
.danger-item:hover { background: rgba(255, 69, 58, 0.1); color: #FF453A; }
.danger-item:hover .item-icon-wrapper { color: #FF453A; }

.dropdown-fade-enter-active, .dropdown-fade-leave-active {
  transition: opacity 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.dropdown-fade-enter-from, .dropdown-fade-leave-to { opacity: 0; transform: scale(0.96) translateY(-8px); }

@media (max-width: 768px) {
  .portal-nav { padding: 0 6px 0 16px; }
}
</style>
