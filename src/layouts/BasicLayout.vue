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

              <!-- 折叠状态下的 Click Popup：悬浮菜单靠左对齐 -->
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

          <!-- 用户下拉菜单区 -->
          <div class="custom-dropdown-container">
            <div class="user-pill-btn" :class="{ 'is-active': isUserMenuOpen }" @click.stop="isUserMenuOpen = !isUserMenuOpen">
              <div class="user-avatar-small">
                <img v-if="previewAvatar" :src="previewAvatar" class="avatar-img" referrerpolicy="no-referrer" @error="onAvatarError" />
                <span v-else>{{ userInfo?.nickname?.charAt(0) || userInfo?.username?.charAt(0) || 'U' }}</span>
              </div>
              <span class="user-name">{{ userInfo?.nickname || userInfo?.username }}</span>
              <font-awesome-icon :icon="['fas', 'chevron-down']" class="dropdown-icon" :class="{ 'rotated': isUserMenuOpen }" />
            </div>

            <transition name="apple-dropdown">
              <div v-if="isUserMenuOpen" class="user-dropdown-panel" @click.stop>

                <div class="dropdown-profile-header">
                  <div class="user-avatar-large">
                    <img v-if="previewAvatar" :src="previewAvatar" class="avatar-img" referrerpolicy="no-referrer" @error="onAvatarError" />
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
                    <span class="item-shortcut">⌘,</span>
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
      </header>

      <!-- 路由内容展示区 -->
      <div class="apple-content-scroll">
        <router-view v-slot="{ Component }">
          <transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <!-- 设置与偏好弹窗 (全局挂载于 Layout 根级) -->
    <transition name="modal-fade">
      <div v-if="isSettingsModalOpen" class="apple-modal-overlay" @click="closeSettingsModal">
        <div class="apple-modal-container" @click.stop>

          <!-- 左侧导航侧边栏 -->
          <div class="modal-sidebar">
            <h3 class="modal-title">账号与设置</h3>
            <nav class="modal-nav">
              <div
                  class="modal-nav-item"
                  :class="{ 'is-active': activeSettingsTab === 'profile' }"
                  @click="activeSettingsTab = 'profile'"
              >
                <div class="nav-icon"><font-awesome-icon :icon="['fas', 'user']" /></div>
                <span>个人设置</span>
              </div>
              <div
                  class="modal-nav-item"
                  :class="{ 'is-active': activeSettingsTab === 'preferences' }"
                  @click="activeSettingsTab = 'preferences'"
              >
                <div class="nav-icon"><font-awesome-icon :icon="['fas', 'cog']" /></div>
                <span>系统偏好</span>
              </div>
            </nav>
          </div>

          <!-- 右侧内容渲染区 -->
          <div class="modal-content-area">
            <button class="modal-close-btn" @click="closeSettingsModal">
              <font-awesome-icon :icon="['fas', 'times']" />
            </button>

            <!-- 面板 1：个人资料 (全新原生设置风格重构) -->
            <transition name="panel-fade" mode="out-in">
              <div v-if="activeSettingsTab === 'profile'" class="settings-panel profile-view">

                <div class="profile-hero-section">
                  <!-- 顶部头像 -->
                  <div class="avatar-editable-wrapper" @click="triggerAvatarUpload">
                    <div class="avatar-huge">
                      <img v-if="previewAvatar" :src="previewAvatar" class="avatar-img" referrerpolicy="no-referrer" @error="onAvatarError" />
                      <span v-else>{{ userInfo?.nickname?.charAt(0) || userInfo?.username?.charAt(0) || '我' }}</span>
                    </div>
                    <div class="avatar-overlay">
                      <font-awesome-icon :icon="['fas', 'camera']" class="camera-icon" />
                    </div>
                    <!-- 隐藏的 input -->
                    <input type="file" ref="avatarInput" accept="image/png, image/jpeg, image/webp" class="hidden-input" @change="handleAvatarChange" />
                  </div>

                  <div class="hero-text-content">
                    <h2 class="hero-name">{{ userInfo?.nickname || userInfo?.username || 'User' }}</h2>
                    <p class="hero-email">{{ userInfo?.email || '未绑定邮箱' }}</p>
                  </div>
                </div>

                <div class="settings-groups-container">
                  <!-- 分组 1: 基础信息 -->
                  <div class="settings-group">
                    <h3 class="group-title">基本信息</h3>
                    <div class="settings-card">
                      <!-- 用户名 -->
                      <div class="settings-row">
                        <div class="row-label">
                          <div class="setting-icon-box bg-grey">
                            <font-awesome-icon :icon="['fas', 'id-badge']" />
                          </div>
                          <span>用户名</span>
                        </div>
                        <div class="row-content">
                          <span class="row-value readonly-text">{{ userInfo?.username || 'admin' }}</span>
                        </div>
                      </div>
                      <div class="row-divider"></div>

                      <!-- 显示昵称 -->
                      <div class="settings-row">
                        <div class="row-label">
                          <div class="setting-icon-box bg-blue">
                            <font-awesome-icon :icon="['fas', 'user-tag']" />
                          </div>
                          <span>显示昵称</span>
                        </div>
                        <div class="row-content">
                          <input
                            v-if="isEditingNickname"
                            v-model="editNicknameValue"
                            class="inline-edit-input"
                            placeholder="请输入昵称"
                            @keyup.enter="saveNickname"
                            @blur="saveNickname"
                            ref="nicknameInputRef"
                          />
                          <span v-else class="row-value editable-text" @click="startEditNickname">{{ userInfo?.nickname || '未设置' }}</span>
                        </div>
                      </div>
                      <div class="row-divider"></div>

                      <!-- 角色信息 -->
                      <div class="settings-row">
                        <div class="row-label">
                          <div class="setting-icon-box bg-orange">
                            <font-awesome-icon :icon="['fas', 'user-shield']" />
                          </div>
                          <span>角色信息</span>
                        </div>
                        <div class="row-content">
                          <span class="row-value readonly-text">{{ userInfo?.roles?.map(r => r.roleName).join(', ') || '暂无角色' }}</span>
                        </div>
                      </div>
                      <div class="row-divider"></div>

                      <!-- 注册时间 -->
                      <div class="settings-row">
                        <div class="row-label">
                          <div class="setting-icon-box bg-green">
                            <font-awesome-icon :icon="['fas', 'clock']" />
                          </div>
                          <span>注册时间</span>
                        </div>
                        <div class="row-content">
                          <span class="row-value readonly-text">{{ formatTime(userInfo?.createTime) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 分组 2: 账户安全 (整合密码、邮箱、手机) -->
                  <div class="settings-group">
                    <h3 class="group-title">账户安全</h3>
                    <div class="settings-card">
                      <!-- 密码重置 -->
                      <div class="settings-row">
                        <div class="row-label">
                          <div class="setting-icon-box bg-red">
                            <font-awesome-icon :icon="['fas', 'lock']" />
                          </div>
                          <span>密码重置</span>
                        </div>
                        <div class="row-content">
                          <span class="row-value readonly-text">已设置</span>
                        </div>
                        <button class="action-text-btn ml-3" @click="handlePasswordReset">重置</button>
                      </div>
                      <div class="row-divider"></div>

                      <!-- 手机号码 -->
                      <div class="settings-row">
                        <div class="row-label">
                          <div class="setting-icon-box bg-green">
                            <font-awesome-icon :icon="['fas', 'mobile-alt']" />
                          </div>
                          <span>手机号码</span>
                        </div>
                        <div class="row-content">
                          <span class="row-value" :class="{'placeholder-text': !userInfo?.phone}">{{ userInfo?.phone || '未绑定' }}</span>
                        </div>
                        <button class="action-text-btn ml-3" @click="openRebindModal">{{ userInfo?.phone ? '换绑' : '绑定' }}</button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <!-- 面板 2：系统偏好 (已深度增强功能，移除菜单折叠) -->
              <div v-else-if="activeSettingsTab === 'preferences'" class="settings-panel">
                <h2 class="panel-header">系统偏好</h2>

                <div class="settings-groups-container mt-2">

                  <!-- 分组 1：外观与显示 -->
                  <div class="settings-group">
                    <h3 class="group-title">外观与显示</h3>
                    <div class="settings-card">
                      <!-- 外观主题 -->
                      <div class="settings-row">
                        <div class="row-content-left">
                          <div class="row-label">
                            <div class="setting-icon-box bg-indigo">
                              <font-awesome-icon :icon="['fas', 'palette']" />
                            </div>
                            <span>外观主题</span>
                          </div>
                          <span class="row-desc ml-icon-offset">切换深色或浅色系统模式</span>
                        </div>
                        <div class="row-content-right">
                          <div class="apple-switch" :class="{ 'is-on': isDark }" @click="toggleTheme">
                            <div class="switch-knob">
                              <font-awesome-icon :icon="['fas', 'moon']" v-if="isDark" class="knob-icon" />
                              <font-awesome-icon :icon="['fas', 'sun']" v-else class="knob-icon light" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="row-divider"></div>

                      <!-- 主题强调色 -->
                      <div class="settings-row">
                        <div class="row-content-left">
                          <div class="row-label">
                            <div class="setting-icon-box bg-orange">
                              <font-awesome-icon :icon="['fas', 'paint-brush']" />
                            </div>
                            <span>系统强调色</span>
                          </div>
                          <span class="row-desc ml-icon-offset">个性化您的系统主要操作与激活色彩</span>
                        </div>
                        <div class="row-content-right">
                          <div class="color-picker-group">
                            <div v-for="c in accentColors" :key="c.name"
                                 class="color-dot"
                                 :style="{ backgroundColor: isDark ? c.value : c.lightValue }"
                                 :class="{ active: currentAccentName === c.name }"
                                 @click="setAccentColor(c)">
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 分组 2：通用设置 -->
                  <div class="settings-group mt-4">
                    <h3 class="group-title">通用</h3>
                    <div class="settings-card">
                      <!-- 界面动画 -->
                      <div class="settings-row">
                        <div class="row-content-left">
                          <div class="row-label">
                            <div class="setting-icon-box bg-blue">
                              <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" />
                            </div>
                            <span>界面动画</span>
                          </div>
                          <span class="row-desc ml-icon-offset">开启系统级过渡与微动效（关闭可提升性能）</span>
                        </div>
                        <div class="row-content-right">
                          <div class="apple-switch" :class="{ 'is-on': animationsEnabled }" @click="toggleAnimations">
                            <div class="switch-knob"></div>
                          </div>
                        </div>
                      </div>

                      <div class="row-divider"></div>

                      <!-- 语言 -->
                      <div class="settings-row">
                        <div class="row-content-left">
                          <div class="row-label">
                            <div class="setting-icon-box bg-green">
                              <font-awesome-icon :icon="['fas', 'globe']" />
                            </div>
                            <span>系统语言</span>
                          </div>
                          <span class="row-desc ml-icon-offset">更改系统显示的区域与界面语言</span>
                        </div>
                        <div class="row-content-right">
                          <select v-model="currentLanguage" class="apple-native-select">
                            <option value="zh-CN">简体中文</option>
                            <option value="en-US">English</option>
                            <option value="ja-JP">日本語</option>
                          </select>
                        </div>
                      </div>

                      <div class="row-divider"></div>

                      <!-- 桌面通知 -->
                      <div class="settings-row">
                        <div class="row-content-left">
                          <div class="row-label">
                            <div class="setting-icon-box bg-red">
                              <font-awesome-icon :icon="['fas', 'bell']" />
                            </div>
                            <span>桌面通知</span>
                          </div>
                          <span class="row-desc ml-icon-offset">允许系统在后台发送重要的应用消息通知</span>
                        </div>
                        <div class="row-content-right">
                          <div class="apple-switch" :class="{ 'is-on': notificationsEnabled }" @click="notificationsEnabled = !notificationsEnabled">
                            <div class="switch-knob"></div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            </transition>
          </div>

        </div>
      </div>
    </transition>

    <!-- 换绑/绑定操作弹窗 (移出主容器，避免 CSS Transform 造成的绝对定位偏移) -->
    <transition name="modal-fade">
      <div v-if="isRebindModalOpen" class="apple-modal-overlay nested-overlay" @click="closeRebindModal">
        <div class="apple-dialog" @click.stop>
          <h3 class="dialog-title">{{ rebindStep === 1 ? '安全验证' : '绑定新手机号' }}</h3>
          <p class="dialog-subtitle">
            {{ rebindStep === 1 ? '为了您的账号安全，请先验证当前绑定的手机号。' : '请输入您的新手机号码并完成验证。' }}
          </p>

          <div class="dialog-form">
            <template v-if="rebindStep === 1">
              <div class="apple-input-group">
                <div class="input-icon-wrapper">
                  <font-awesome-icon :icon="['fas', 'mobile-alt']" />
                </div>
                <input
                    type="tel"
                    :value="userInfo?.phone"
                    class="apple-dialog-input has-icon"
                    placeholder="当前绑定的手机号码"
                    disabled
                />
              </div>
              <div class="apple-input-group flex-group">
                <div class="input-icon-wrapper verify-icon">
                  <font-awesome-icon :icon="['fas', 'shield-alt']" />
                </div>
                <input
                    type="text"
                    v-model="rebindForm.oldVerifyCode"
                    class="apple-dialog-input has-icon flex-1"
                    placeholder="短信验证码"
                />
                <button class="dialog-btn outline send-code-btn" :disabled="countdown > 0" @click="sendOldPhoneCode">
                  {{ countdown > 0 ? `${countdown}s 后重试` : '获取验证码' }}
                </button>
              </div>
            </template>
            <template v-else>
              <div class="apple-input-group">
                <div class="input-icon-wrapper">
                  <font-awesome-icon :icon="['fas', 'mobile-alt']" />
                </div>
                <input
                    type="tel"
                    v-model="rebindForm.newPhone"
                    class="apple-dialog-input has-icon"
                    placeholder="请输入新手机号码"
                />
              </div>
              <div class="apple-input-group flex-group">
                <div class="input-icon-wrapper verify-icon">
                  <font-awesome-icon :icon="['fas', 'shield-alt']" />
                </div>
                <input
                    type="text"
                    v-model="rebindForm.newVerifyCode"
                    class="apple-dialog-input has-icon flex-1"
                    placeholder="短信验证码"
                />
                <button class="dialog-btn outline send-code-btn" :disabled="countdown > 0" @click="sendNewPhoneCode">
                  {{ countdown > 0 ? `${countdown}s 后重试` : '获取验证码' }}
                </button>
              </div>
            </template>
          </div>

          <div class="dialog-actions">
            <button class="dialog-btn outline" @click="closeRebindModal">取消</button>
            <button v-if="rebindStep === 1" class="dialog-btn primary" @click="nextRebindStep">下一步</button>
            <button v-else class="dialog-btn primary" @click="submitRebind">确认换绑</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 密码重置操作弹窗 (嵌套在当前 Modal 顶层) -->
    <transition name="modal-fade">
      <div v-if="isResetPwdModalOpen" class="apple-modal-overlay nested-overlay" @click="closeResetPwdModal">
        <div class="apple-dialog" @click.stop>
          <h3 class="dialog-title">{{ resetPwdStep === 1 ? '安全验证' : '设置新密码' }}</h3>
          <p class="dialog-subtitle">
            {{ resetPwdStep === 1 ? '为了您的账号安全，请验证绑定的手机号。' : '请输入您的新密码并确认。' }}
          </p>

          <div class="dialog-form">
            <template v-if="resetPwdStep === 1">
              <div class="apple-input-group">
                <div class="input-icon-wrapper">
                  <font-awesome-icon :icon="['fas', 'mobile-alt']" />
                </div>
                <input
                    type="tel"
                    v-model="resetPwdForm.phone"
                    class="apple-dialog-input has-icon"
                    placeholder="绑定的手机号码"
                    disabled
                />
              </div>
              <div class="apple-input-group flex-group">
                <div class="input-icon-wrapper verify-icon">
                  <font-awesome-icon :icon="['fas', 'shield-alt']" />
                </div>
                <input
                    type="text"
                    v-model="resetPwdForm.verifyCode"
                    class="apple-dialog-input has-icon flex-1"
                    placeholder="短信验证码"
                />
                <button class="dialog-btn outline send-code-btn" :disabled="resetPwdCountdown > 0" @click="sendResetPwdCode">
                  {{ resetPwdCountdown > 0 ? `${resetPwdCountdown}s 后重试` : '获取验证码' }}
                </button>
              </div>
            </template>
            <template v-else>
              <div class="apple-input-group">
                <div class="input-icon-wrapper">
                  <font-awesome-icon :icon="['fas', 'lock']" />
                </div>
                <input
                    :type="showNewPassword ? 'text' : 'password'"
                    v-model="resetPwdForm.newPassword"
                    class="apple-dialog-input has-icon"
                    placeholder="请输入新密码"
                />
                <div class="input-suffix-icon" @click="showNewPassword = !showNewPassword">
                  <font-awesome-icon :icon="showNewPassword ? ['fas', 'eye'] : ['fas', 'eye-slash']" />
                </div>
              </div>

              <!-- 密码强度指示器 -->
              <div class="password-strength-container" v-if="resetPwdForm.newPassword">
                <div class="strength-bars">
                  <div class="strength-bar" :style="{ backgroundColor: passwordStrength.score >= 1 ? passwordStrength.color : 'var(--border-color)' }"></div>
                  <div class="strength-bar" :style="{ backgroundColor: passwordStrength.score >= 2 ? passwordStrength.color : 'var(--border-color)' }"></div>
                  <div class="strength-bar" :style="{ backgroundColor: passwordStrength.score >= 3 ? passwordStrength.color : 'var(--border-color)' }"></div>
                </div>
                <span class="strength-text" :style="{ color: passwordStrength.color }">{{ passwordStrength.text }}</span>
              </div>

              <div class="apple-input-group">
                <div class="input-icon-wrapper" :class="{ 'success-icon': isPasswordMatching === true }">
                  <font-awesome-icon :icon="['fas', 'check-circle']" />
                </div>
                <input
                    :type="showConfirmPassword ? 'text' : 'password'"
                    v-model="resetPwdForm.confirmPassword"
                    class="apple-dialog-input has-icon"
                    :class="{ 'is-error': isPasswordMatching === false, 'is-success': isPasswordMatching === true }"
                    placeholder="请确认新密码"
                />
                <div class="input-suffix-icon" @click="showConfirmPassword = !showConfirmPassword">
                  <font-awesome-icon :icon="showConfirmPassword ? ['fas', 'eye'] : ['fas', 'eye-slash']" />
                </div>
              </div>

              <!-- 密码不一致提示 -->
              <div class="validation-message" v-if="isPasswordMatching === false">
                <font-awesome-icon :icon="['fas', 'exclamation-circle']" /> 两次输入的密码不一致
              </div>
            </template>
          </div>

          <div class="dialog-actions">
            <button class="dialog-btn outline" @click="closeResetPwdModal">取消</button>
            <button v-if="resetPwdStep === 1" class="dialog-btn primary" @click="nextResetPwdStep">下一步</button>
            <button v-else class="dialog-btn primary" @click="submitResetPwd">确认重置</button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, reactive, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { library } from '@fortawesome/fontawesome-svg-core'
import { sendCaptcha, verifyCaptcha, resetPassword, changePhone, updateCurrentUser } from '@/api/auth'
import { AppleAlert } from '@/components/common/AppleAlert'

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

// ================== 系统偏好增强状态逻辑 ==================
const isSettingsModalOpen = ref(false)
const activeSettingsTab = ref<'profile' | 'preferences'>('profile')

// 主题强调色 (Apple 标准色谱)
const accentColors = [
  { value: '#0A84FF', lightValue: '#0066cc', name: 'blue' },
  { value: '#BF5AF2', lightValue: '#AF52DE', name: 'purple' },
  { value: '#FF453A', lightValue: '#FF3B30', name: 'red' },
  { value: '#FF9F0A', lightValue: '#FF9500', name: 'orange' },
  { value: '#32D74B', lightValue: '#28CD41', name: 'green' },
  { value: '#8E8E93', lightValue: '#8E8E93', name: 'gray' },
]
const currentAccentName = ref(localStorage.getItem('apple-accent-name') || 'blue')

const setAccentColor = (colorObj: any) => {
  currentAccentName.value = colorObj.name
  localStorage.setItem('apple-accent-name', colorObj.name)
  applyAccentColor()
}

const applyAccentColor = () => {
  const root = document.documentElement
  const colorObj = accentColors.find(c => c.name === currentAccentName.value) || accentColors[0]
  if (isDark.value) {
    root.style.setProperty('--apple-blue', colorObj.value)
  } else {
    root.style.setProperty('--apple-blue', colorObj.lightValue)
  }
}

// 动画设置
const animationsEnabled = ref(localStorage.getItem('apple-animations') !== 'false')
const toggleAnimations = () => {
  animationsEnabled.value = !animationsEnabled.value
  localStorage.setItem('apple-animations', animationsEnabled.value ? 'true' : 'false')
  if (!animationsEnabled.value) {
    document.body.classList.add('disable-animations')
  } else {
    document.body.classList.remove('disable-animations')
  }
}

// 语言与通知
const currentLanguage = ref(localStorage.getItem('apple-language') || 'zh-CN')
watch(currentLanguage, (val) => localStorage.setItem('apple-language', val))

const notificationsEnabled = ref(localStorage.getItem('apple-notifications') === 'true')
watch(notificationsEnabled, (val) => localStorage.setItem('apple-notifications', val ? 'true' : 'false'))

// 主题切换需要重新触发强调色映射
const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('apple-theme', isDark.value ? 'dark' : 'light')
  applyAccentColor()
}


// ==== 个人资料展示及头像上传 ====
const avatarInput = ref<HTMLInputElement | null>(null)
const previewAvatar = ref<string | null>(null)
const userInfo = computed(() => userStore.userInfo)

watch(userInfo, (val) => {
  if (val) {
    previewAvatar.value = val.avatar || null
  }
}, { immediate: true, deep: true })

// 格式化注册时间
const formatTime = (timeStr?: string) => {
  if (!timeStr) return '未知'
  const date = new Date(timeStr)
  if (isNaN(date.getTime())) return timeStr
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

// 头像加载失败时回退显示首字母
const onAvatarError = () => {
  previewAvatar.value = null
}

// ==== 昵称编辑相关 ====
const isEditingNickname = ref(false)
const editNicknameValue = ref('')
const nicknameInputRef = ref<HTMLInputElement | null>(null)

const startEditNickname = () => {
  editNicknameValue.value = userInfo.value?.nickname || ''
  isEditingNickname.value = true
  nextTick(() => {
    nicknameInputRef.value?.focus()
  })
}

const saveNickname = async () => {
  if (!isEditingNickname.value) return
  const newNickname = editNicknameValue.value.trim()
  if (!newNickname) {
    AppleAlert.error('提示', '昵称不能为空')
    return
  }
  if (newNickname === userInfo.value?.nickname) {
    isEditingNickname.value = false
    return
  }
  try {
    await updateCurrentUser({ nickname: newNickname })
    await userStore.fetchUserInfo()
    AppleAlert.success('成功', '昵称修改成功')
    isEditingNickname.value = false
  } catch (error: any) {
    AppleAlert.error('修改失败', error.message || '昵称修改失败')
  }
}

// 唤起文件选择器
const triggerAvatarUpload = () => {
  if (avatarInput.value) {
    avatarInput.value.click()
  }
}

// 处理头像变更
const handleAvatarChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  
  // 转换为 base64 用于预览
  const reader = new FileReader()
  reader.onload = async (ev) => {
    const base64 = ev.target?.result as string
    previewAvatar.value = base64
    // TODO: 实际上传应上传到对象存储获取 URL，此处更新使用 base64 作为示例
    try {
      await updateCurrentUser({ avatar: base64 })
      await userStore.fetchUserInfo()
      AppleAlert.success('成功', '头像修改成功')
    } catch (error: any) {
      AppleAlert.error('修改失败', error.message || '头像修改失败')
      // 回滚预览
      previewAvatar.value = userInfo.value?.avatar || null
    }
  }
  reader.readAsDataURL(file)
  if (avatarInput.value) avatarInput.value.value = ''
}

// ==== 密码重置处理 ====
const isResetPwdModalOpen = ref(false)
const resetPwdStep = ref(1)
const resetPwdCountdown = ref(0)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
let resetPwdTimer: number | null = null

const resetPwdForm = reactive({
  phone: '',
  verifyCode: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码强度计算逻辑
const passwordStrength = computed(() => {
  const pwd = resetPwdForm.newPassword
  if (!pwd) return { score: 0, text: '', color: '' }

  let score = 0
  if (pwd.length >= 8) score += 1
  if (/[A-Za-z]/.test(pwd) && /[0-9]/.test(pwd)) score += 1
  if (/[^A-Za-z0-9]/.test(pwd)) score += 1

  // 长度小于8强制为弱
  if (pwd.length > 0 && pwd.length < 8) score = 1

  if (score === 1) return { score: 1, text: '弱', color: '#ff4d4f' }
  if (score === 2) return { score: 2, text: '中', color: '#faad14' }
  if (score >= 3) return { score: 3, text: '强', color: '#52c41a' }

  return { score: 0, text: '', color: '' }
})

// 密码一致性校验逻辑
const isPasswordMatching = computed(() => {
  if (!resetPwdForm.confirmPassword) return null
  return resetPwdForm.newPassword === resetPwdForm.confirmPassword
})

const handlePasswordReset = () => {
  if (!userInfo.value?.phone) {
    AppleAlert.error('未绑定手机', '请先绑定手机号码后再进行密码重置操作。')
    return
  }
  resetPwdForm.phone = userInfo.value.phone
  resetPwdForm.verifyCode = ''
  resetPwdForm.newPassword = ''
  resetPwdForm.confirmPassword = ''
  showNewPassword.value = false
  showConfirmPassword.value = false
  resetPwdStep.value = 1
  resetPwdCountdown.value = 0
  if (resetPwdTimer) clearInterval(resetPwdTimer)
  isResetPwdModalOpen.value = true
}

const closeResetPwdModal = () => {
  isResetPwdModalOpen.value = false
  if (resetPwdTimer) clearInterval(resetPwdTimer)
}

const sendResetPwdCode = async () => {
  if (resetPwdCountdown.value > 0) return
  if (!resetPwdForm.phone) {
    AppleAlert.error('错误', '手机号码不能为空')
    return
  }
  try {
    await sendCaptcha(resetPwdForm.phone)
    AppleAlert.success('验证码已发送', '请注意查收短信')
    resetPwdCountdown.value = 60
    resetPwdTimer = window.setInterval(() => {
      resetPwdCountdown.value--
      if (resetPwdCountdown.value <= 0 && resetPwdTimer) {
        clearInterval(resetPwdTimer)
      }
    }, 1000)
  } catch (error: any) {
    AppleAlert.error('发送失败', error.message || '验证码发送失败')
  }
}

const nextResetPwdStep = async () => {
  if (!resetPwdForm.verifyCode) {
    AppleAlert.error('提示', '请输入验证码')
    return
  }
  try {
    await verifyCaptcha(resetPwdForm.phone, resetPwdForm.verifyCode)
    resetPwdStep.value = 2
  } catch (error: any) {
    AppleAlert.error('验证失败', error.message || '验证码错误')
  }
}

const submitResetPwd = async () => {
  if (!resetPwdForm.newPassword || !resetPwdForm.confirmPassword) {
    AppleAlert.error('提示', '请填写完整密码信息')
    return
  }
  if (resetPwdForm.newPassword !== resetPwdForm.confirmPassword) {
    AppleAlert.error('错误', '两次输入的密码不一致')
    return
  }
  if (resetPwdForm.newPassword.length < 8) {
    AppleAlert.error('提示', '密码长度不能少于8位')
    return
  }

  try {
    await resetPassword(resetPwdForm.phone, resetPwdForm.verifyCode, resetPwdForm.newPassword, resetPwdForm.confirmPassword)
    AppleAlert.success('重置成功', '密码已成功重置，请重新登录')
    closeResetPwdModal()
    closeSettingsModal()
    handleLogout()
  } catch (error: any) {
    AppleAlert.error('重置失败', error.message || '密码重置失败')
  }
}


// ==== 换绑/绑定手机号相关逻辑 ====
const isRebindModalOpen = ref(false)
const rebindStep = ref(1)
const countdown = ref(0)
let timer: number | null = null

const rebindForm = reactive({
  oldVerifyCode: '',
  newPhone: '',
  newVerifyCode: ''
})

const openRebindModal = () => {
  rebindForm.oldVerifyCode = ''
  rebindForm.newPhone = ''
  rebindForm.newVerifyCode = ''
  countdown.value = 0
  if (timer) clearInterval(timer)

  // 判断是否已有绑定手机，如果有则进入换绑流程(验证旧号)，否则进入绑定流程(直接绑新号)
  if (userInfo.value?.phone) {
    rebindStep.value = 1
  } else {
    rebindStep.value = 2
  }
  isRebindModalOpen.value = true
}

const closeRebindModal = () => {
  isRebindModalOpen.value = false
  if (timer) clearInterval(timer)
}

const startCountdown = () => {
  countdown.value = 60
  if (timer) clearInterval(timer)
  timer = window.setInterval(() => {
    countdown.value--
    if (countdown.value <= 0 && timer) {
      clearInterval(timer)
    }
  }, 1000)
}

const sendOldPhoneCode = async () => {
  if (countdown.value > 0) return
  if (!userInfo.value?.phone) return
  try {
    await sendCaptcha(userInfo.value.phone)
    AppleAlert.success('验证码已发送', '请注意查收短信')
    startCountdown()
  } catch (error: any) {
    AppleAlert.error('发送失败', error.message || '验证码发送失败')
  }
}

const nextRebindStep = async () => {
  if (!rebindForm.oldVerifyCode) {
    AppleAlert.error('提示', '请输入验证码')
    return
  }
  try {
    await verifyCaptcha(userInfo.value!.phone, rebindForm.oldVerifyCode)
    // 验证成功，进入第二步，并重置倒计时
    rebindStep.value = 2
    countdown.value = 0
    if (timer) clearInterval(timer)
  } catch (error: any) {
    AppleAlert.error('验证失败', error.message || '验证码错误')
  }
}

const sendNewPhoneCode = async () => {
  if (countdown.value > 0) return
  if (!rebindForm.newPhone) {
    AppleAlert.error('错误', '请输入新手机号码')
    return
  }
  // 简单的手机号正则验证
  if (!/^1[3-9]\d{9}$/.test(rebindForm.newPhone)) {
    AppleAlert.error('错误', '手机号码格式不正确')
    return
  }

  try {
    await sendCaptcha(rebindForm.newPhone)
    AppleAlert.success('验证码已发送', '请注意查收短信')
    startCountdown()
  } catch (error: any) {
    AppleAlert.error('发送失败', error.message || '验证码发送失败')
  }
}

const submitRebind = async () => {
  if (!rebindForm.newPhone || !rebindForm.newVerifyCode) {
    AppleAlert.error('提示', '请填写完整信息及验证码')
    return
  }

  // 手机号格式验证
  if (!/^1[3-9]\d{9}$/.test(rebindForm.newPhone)) {
    AppleAlert.error('错误', '手机号码格式不正确')
    return
  }

  try {
    // 判断是绑定还是换绑
    if (userInfo.value?.phone) {
      // 换绑：调用换绑接口
      await changePhone({
        oldPhone: userInfo.value.phone,
        oldCaptcha: rebindForm.oldVerifyCode,
        newPhone: rebindForm.newPhone,
        newCaptcha: rebindForm.newVerifyCode
      })
    } else {
      // 绑定：先验证新手机号的验证码，然后调用换绑接口（oldPhone/oldCaptcha传空）
      await verifyCaptcha(rebindForm.newPhone, rebindForm.newVerifyCode)
      await changePhone({
        oldPhone: '',
        oldCaptcha: '',
        newPhone: rebindForm.newPhone,
        newCaptcha: rebindForm.newVerifyCode
      })
    }

    // 刷新用户信息
    await userStore.fetchUserInfo()

    AppleAlert.success('成功', userInfo.value?.phone ? '手机号换绑成功' : '手机号绑定成功')
    closeRebindModal()
  } catch (error: any) {
    AppleAlert.error('操作失败', error.message || '换绑失败，请稍后重试')
  }
}


watch(collapsed, (newVal) => {
  if (!newVal) activeCollapsedPopup.value = null
})

// 添加全局快捷键监听
const handleGlobalKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === ',') {
    e.preventDefault()
    openSettingsModal('preferences')
  }
  if (e.key === 'Escape') {
    if (isRebindModalOpen.value) {
      closeRebindModal()
    } else if (isResetPwdModalOpen.value) {
      closeResetPwdModal()
    } else if (isSettingsModalOpen.value) {
      closeSettingsModal()
    }
  }
}

onMounted(() => {
  const storedTheme = localStorage.getItem('apple-theme')
  if (storedTheme === 'light') isDark.value = false

  // 初始化渲染强调色与动画状态
  applyAccentColor()
  if (!animationsEnabled.value) {
    document.body.classList.add('disable-animations')
  }

  document.addEventListener('click', closeDropdowns)
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
  window.removeEventListener('keydown', handleGlobalKeydown)
  if (timer) clearInterval(timer)
  if (resetPwdTimer) clearInterval(resetPwdTimer)
})

const closeDropdowns = (e: MouseEvent) => {
  if (headerRightRef.value && !headerRightRef.value.contains(e.target as Node)) {
    isUserMenuOpen.value = false
  }
  openBreadcrumb.value = null
  activeCollapsedPopup.value = null
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

const openSettingsModal = (tab: 'profile' | 'preferences') => {
  isUserMenuOpen.value = false
  activeSettingsTab.value = tab
  isSettingsModalOpen.value = true
}

const closeSettingsModal = () => {
  isSettingsModalOpen.value = false
}

const handleLogout = async () => {
  isUserMenuOpen.value = false
  await userStore.logout()
}

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

watch(() => route.path, (path) => selectedKeys.value = [path], { immediate: true })
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
  --border-color: rgba(255, 255, 255, 0.08);
  --hover-bg: rgba(255, 255, 255, 0.08);
  --active-bg: rgba(255, 255, 255, 0.12);
  --popup-bg: rgba(30, 30, 30, 0.85);
  --modal-bg: #1c1c1e;
  --modal-card-bg: #28282b;
  --shadow-color: rgba(0, 0, 0, 0.6);
  --pill-bg: rgba(255, 255, 255, 0.04);
  --pill-border: rgba(255, 255, 255, 0.08);
  --logo-text: #ffffff;
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
  --hover-bg: rgba(0, 0, 0, 0.05);
  --active-bg: rgba(0, 0, 0, 0.08);
  --popup-bg: rgba(255, 255, 255, 0.85);
  --modal-bg: #ffffff;
  --modal-card-bg: #ffffff; /* 亮色模式下卡片颜色 */
  --shadow-color: rgba(0, 0, 0, 0.12);
  --pill-bg: rgba(255, 255, 255, 1);
  --pill-border: rgba(0, 0, 0, 0.1);
  --logo-text: #1d1d1f;
  --scrollbar-thumb: rgba(0, 0, 0, 0.2);
  --scrollbar-hover: rgba(0, 0, 0, 0.35);
}

/* 全局动画禁用支持 */
:global(body.disable-animations *) {
  transition: none !important;
  animation: none !important;
}

.text-muted { color: var(--text-muted); }
.placeholder-text { opacity: 0.5; }
.flex-1 { flex: 1; }
.flex-group { display: flex; gap: 8px; align-items: center; }
.mt-2 { margin-top: 8px; }
.mt-4 { margin-top: 16px; }
.ml-3 { margin-left: 12px; }

/* 针对带有底块Icon的布局，让下方描述文字与上方Title左对齐 */
.ml-icon-offset { margin-left: 38px; }

/* ================= 侧边栏 ================= */
.apple-sidebar { width: 250px; height: 100%; background: var(--sidebar-bg); border-right: 1px solid var(--border-color); display: flex; flex-direction: column; transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.4s ease, border-color 0.4s ease; z-index: 100; flex-shrink: 0; }
.apple-sidebar.is-collapsed { width: 72px; }
.sidebar-logo { height: 64px; display: flex; align-items: center; padding: 0 16px; gap: 12px; width: 100%; flex-shrink: 0; border-bottom: 1px solid var(--border-color); transition: padding 0.3s ease; }
.apple-sidebar.is-collapsed .sidebar-logo { padding: 0; justify-content: center; }
.logo-wrapper { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.apple-sidebar.is-collapsed .logo-wrapper { width: 40px; height: 40px; }
.logo-img { width: 100%; height: 100%; object-fit: contain; display: block; }
.apple-layout-root.theme-light .logo-img { filter: invert(1) brightness(0.2); }
.logo-title { font-size: 16px; font-weight: 700; color: var(--text-main); white-space: nowrap; margin-top: 1px; }

/* ================= 侧边栏菜单 ================= */
.sidebar-menu-scroll { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 16px 0; scrollbar-width: none; }
.sidebar-menu-scroll::-webkit-scrollbar { display: none; }
.apple-sidebar.is-collapsed .sidebar-menu-scroll { overflow: visible; }
.apple-menu { width: 100%; list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px; }
.apple-menu-item-group { width: 100%; position: relative; padding: 0; margin: 0; display: block; }

.apple-menu-title { display: flex; align-items: center; justify-content: space-between; height: 40px; padding: 0 12px; margin: 0 14px; border-radius: 10px; color: var(--text-muted); cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); user-select: none; outline: none; -webkit-tap-highlight-color: transparent; }
.apple-menu-title:hover { background: var(--hover-bg); color: var(--text-main); }
.apple-menu-title.is-active { color: var(--text-main); }
/* ✅ 优化：侧边栏菜单激活项的阴影和背景，全面使用 color-mix 混合全局强调色 */
.apple-menu-title.single-item.is-selected { background: var(--apple-blue); color: #fff; font-weight: 600; box-shadow: 0 2px 10px color-mix(in srgb, var(--apple-blue) 30%, transparent); }

.apple-sidebar.is-collapsed .apple-menu-title { width: 44px; height: 44px; margin: 8px 14px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 12px; outline: none; }
.apple-sidebar.is-collapsed .title-left { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 0; margin: 0; }
.apple-sidebar.is-collapsed .menu-icon-wrap { width: auto; height: auto; font-size: 18px; display: flex; align-items: center; justify-content: center; }
/* ✅ 优化：折叠侧边栏时激活项的阴影全面使用 color-mix 跟随全局强调色，并移除导致白边的 inset shadow */
.apple-sidebar.is-collapsed .apple-menu-title.parent-is-selected,
.apple-sidebar.is-collapsed .apple-menu-title.single-item.is-selected { background: var(--apple-blue); color: #fff; box-shadow: 0 4px 14px color-mix(in srgb, var(--apple-blue) 40%, transparent); }

.title-left { display: flex; align-items: center; gap: 10px; min-width: 0; }
.menu-icon-wrap { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; color: currentColor; }
.menu-text { font-size: 14px; font-weight: 500; white-space: nowrap; line-height: normal; }
.arrow-wrap { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 11px; opacity: 0.5; }
.chevron-icon { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.chevron-icon.is-open { transform: rotate(180deg); }

.apple-submenu-wrapper { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.apple-submenu-wrapper.is-open { grid-template-rows: 1fr; }
.apple-submenu-list { overflow: hidden; list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 2px; }

.apple-sub-item { height: 38px; margin: 0 14px; padding: 0 12px 0 44px; border-radius: 8px; display: flex; align-items: center; gap: 10px; color: var(--text-muted); cursor: pointer; transition: all 0.2s ease; }
.apple-sub-item:first-child { margin-top: 6px; }
.apple-sub-item:last-child { margin-bottom: 6px; }
.apple-sub-item:hover { background: var(--hover-bg); color: var(--text-main); }
.apple-sub-item.is-selected { background: var(--apple-blue); color: #fff; font-weight: 600; }
.menu-icon-wrap.sub { width: 16px !important; height: 16px !important; font-size: 14px !important; opacity: 0.6; display: flex !important; align-items: center !important; justify-content: center !important; padding: 0 !important; margin: 0 !important; }
.menu-icon-wrap.sub :deep(svg) { display: block !important; margin: 0 !important; padding: 0 !important; }

.apple-collapsed-popup { position: absolute; top: 4px; left: calc(90% + 12px); background: rgba(30, 30, 30, 0.65); backdrop-filter: blur(50px) saturate(220%); -webkit-backdrop-filter: blur(50px) saturate(220%); border-radius: 14px; padding: 6px; min-width: 130px; box-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.15), 0 24px 48px -12px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.15); opacity: 0; visibility: hidden; transform: translateX(-8px) scale(0.96); transform-origin: left center; transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); pointer-events: none; z-index: 1000; }
.apple-layout-root.theme-light .apple-collapsed-popup { background: rgba(255, 255, 255, 0.85); box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 24px 48px -12px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.8); }
.apple-collapsed-popup.is-visible { opacity: 1; visibility: visible; transform: translateX(0) scale(1); pointer-events: auto; }

.popup-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 2px; }
.popup-item { display: flex; align-items: center; justify-content: flex-start; gap: 12px; height: 34px; padding: 0 16px; border-radius: 8px; color: var(--text-main); cursor: pointer; }
.popup-item .menu-text { font-size: 13px; font-weight: 500; line-height: 1; white-space: nowrap; }
/* ✅ 优化：弹出子菜单选中状态颜色跟随全局强调色 */
.popup-item.is-selected { background: color-mix(in srgb, var(--apple-blue) 15%, transparent); color: var(--apple-blue); }
.apple-layout-root.theme-light .popup-item.is-selected { background: color-mix(in srgb, var(--apple-blue) 8%, transparent); }
.popup-item.is-selected .menu-icon-wrap.sub { opacity: 1; color: var(--apple-blue); }
.popup-item:hover, .popup-item.is-selected:hover { background: var(--apple-blue); color: #fff; }
.popup-item:hover .menu-icon-wrap.sub, .popup-item.is-selected:hover .menu-icon-wrap.sub { opacity: 1; color: #fff; }

/* ================= 主内容区域 ================= */
.apple-main-container { flex: 1; display: flex; flex-direction: column; min-width: 0; position: relative; }

/* 提升 Header 的 z-index 至 100，确保绝对处于内部页面的上方 */
.apple-header { height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; background: var(--header-bg); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid var(--border-color); z-index: 100; transition: background 0.4s ease, border-color 0.4s ease; }
.header-left { display: flex; align-items: center; gap: 16px; }

.action-btn { background: var(--pill-bg); border: 1px solid var(--pill-border); color: var(--text-main); font-size: 15px; width: 36px; height: 36px; padding: 0 !important; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 10px; transition: all 0.2s ease; }
.action-btn:hover { background: var(--hover-bg); }
.action-btn:active { transform: scale(0.95); }
.theme-btn { border-radius: 50%; margin-right: 16px; }

.breadcrumb-area { display: flex; align-items: center; height: 36px; }
.apple-breadcrumb-container { display: flex; align-items: center; background: var(--pill-bg); border: 1px solid var(--pill-border); height: 36px; border-radius: 10px; padding: 0 10px; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
.crumb-node { position: relative; display: flex; align-items: center; height: 100%; }
.crumb-trigger { display: flex; align-items: center; gap: 6px; padding: 0 8px; border-radius: 6px; height: 28px; cursor: pointer; transition: all 0.2s ease; color: var(--text-muted); }
.crumb-trigger.is-last { color: var(--text-main); }
.crumb-trigger:hover, .crumb-trigger.is-open { background: var(--hover-bg); color: var(--text-main); }
.crumb-icon-raw, .crumb-dropdown-icon { display: flex; align-items: center; justify-content: center; width: 14px; height: 14px; font-size: 14px; color: inherit; }
.crumb-text, .dropdown-item-text { font-size: 14px; font-weight: 500; white-space: nowrap; line-height: normal; }
.crumb-dropdown-panel { position: absolute; top: calc(100% + 10px); left: 0; background: var(--popup-bg); border: 1px solid var(--border-color); border-radius: 10px; padding: 6px; min-width: 140px; box-shadow: 0 10px 40px var(--shadow-color); z-index: 1000; backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
.dropdown-fade-enter-active, .dropdown-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.dropdown-fade-enter-from, .dropdown-fade-leave-to { opacity: 0; transform: scale(0.95) translateY(-5px); }
.crumb-dropdown-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 6px; color: var(--text-muted); cursor: pointer; transition: all 0.2s ease; margin-bottom: 2px; }
.crumb-dropdown-item:last-child { margin-bottom: 0; }
.crumb-dropdown-item:hover { background: var(--hover-bg); color: var(--text-main); }
.crumb-dropdown-item.is-active { background: var(--apple-blue); color: #fff; }
.crumb-separator { display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 400; color: var(--text-muted); opacity: 0.4; margin: 0 6px; width: 12px; user-select: none; }

/* ================= 用户下拉菜单区 ================= */
.header-right { display: flex; align-items: center; }
.custom-dropdown-container { position: relative; }

.user-pill-btn { display: flex; align-items: center; gap: 10px; background: var(--pill-bg); border: 1px solid var(--pill-border); padding: 4px 12px 4px 4px; border-radius: 30px; cursor: pointer; transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1); }
.user-pill-btn:hover { background: var(--hover-bg); border-color: var(--border-color); }
.user-pill-btn.is-active { background: var(--active-bg); border-color: var(--border-color); }

/* ✅ 优化：用户头像阴影完全跟随全局强调色 */
.user-avatar-small { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, var(--apple-blue), color-mix(in srgb, var(--apple-blue) 70%, white)); color: #ffffff; font-weight: 600; font-size: 13px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px color-mix(in srgb, var(--apple-blue) 30%, transparent); text-shadow: 0 1px 2px rgba(0,0,0,0.1); overflow: hidden; }
.user-name { font-size: 13px; font-weight: 500; color: var(--text-main); }
.dropdown-icon { font-size: 11px; color: var(--text-muted); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.dropdown-icon.rotated { transform: rotate(180deg); }

.user-dropdown-panel { position: absolute; top: calc(100% + 14px); right: 0; background: var(--popup-bg); backdrop-filter: blur(32px) saturate(200%); -webkit-backdrop-filter: blur(32px) saturate(200%); border: 1px solid var(--border-color); border-radius: 16px; min-width: 240px; padding: 6px; box-shadow: 0 0 0 1px rgba(0,0,0,0.02), 0 10px 40px -10px var(--shadow-color), 0 4px 12px rgba(0,0,0,0.08); z-index: 1000; transform-origin: top right; }
.dropdown-profile-header { display: flex; align-items: center; gap: 14px; padding: 12px; margin-bottom: 2px; }
/* ✅ 优化：下拉列表中的大头像跟随全局强调色 */
.user-avatar-large { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, var(--apple-blue), color-mix(in srgb, var(--apple-blue) 70%, white)); color: #ffffff; font-weight: 600; font-size: 18px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 12px color-mix(in srgb, var(--apple-blue) 30%, transparent); text-shadow: 0 1px 2px rgba(0,0,0,0.1); overflow: hidden; }
.profile-info { display: flex; flex-direction: column; justify-content: center; overflow: hidden; }
.profile-name { font-size: 15px; font-weight: 600; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.3; }
.profile-email { font-size: 12px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }

.dropdown-divider { height: 1px; background: var(--border-color); margin: 6px 6px; }
.dropdown-action-group { display: flex; flex-direction: column; gap: 2px; }
.dropdown-item { width: 100%; display: flex; align-items: center; justify-content: space-between; background: transparent; border: none; border-radius: 8px; padding: 10px 12px; color: var(--text-main); cursor: pointer; transition: background 0.2s ease, color 0.2s ease, transform 0.1s ease; }
.dropdown-item:hover { background: var(--hover-bg); }
.dropdown-item:active { transform: scale(0.98); }
.item-main { display: flex; align-items: center; gap: 12px; }
.item-icon-wrapper { width: 18px; display: flex; align-items: center; justify-content: center; font-size: 15px; color: var(--text-muted); transition: color 0.2s ease; }
.item-text { font-size: 14px; font-weight: 500; }
.item-shortcut { font-size: 12px; color: var(--text-muted); font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; background: var(--hover-bg); padding: 2px 6px; border-radius: 4px; letter-spacing: 0.5px; }
.dropdown-item:hover .item-icon-wrapper { color: var(--text-main); }
.danger-item { color: #FF453A; }
.danger-item .item-icon-wrapper { color: #FF453A; }
.danger-item:hover { background: rgba(255, 69, 58, 0.1); color: #FF453A; }
.danger-item:hover .item-icon-wrapper { color: #FF453A; }

.apple-dropdown-enter-active, .apple-dropdown-leave-active { transition: opacity 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1); }
.apple-dropdown-enter-from, .apple-dropdown-leave-to { opacity: 0; transform: scale(0.96) translateY(-8px); }

/* ================= 滚动区域 ================= */
.apple-content-scroll { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 24px; scrollbar-width: thin; scrollbar-color: var(--border-color) transparent; }
.apple-content-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
.apple-content-scroll::-webkit-scrollbar-track { background: transparent; }
.apple-content-scroll::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 10px; }
.apple-content-scroll::-webkit-scrollbar-thumb:hover { background: var(--scrollbar-hover); }

.apple-content-inner { background: var(--content-bg); border: 1px solid var(--border-color); border-radius: 16px; min-height: 100%; padding: 24px; box-shadow: 0 4px 20px var(--shadow-color); transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease; }
.page-fade-enter-active, .page-fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.page-fade-enter-from { opacity: 0; transform: translateY(10px); }
.page-fade-leave-to { opacity: 0; transform: translateY(-10px); }

/* ================= 全局设置主弹窗 ================= */
.apple-modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 2000; display: flex; align-items: center; justify-content: center; }
.apple-modal-container {
  width: 820px; height: 580px; background: var(--modal-bg); border: 1px solid var(--border-color); border-radius: 16px; display: flex; overflow: hidden;
  box-shadow: 0 24px 48px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05); transform: scale(1); transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.apple-layout-root.theme-light .apple-modal-container { box-shadow: 0 24px 48px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05); }

.modal-sidebar { width: 240px; background: var(--sidebar-bg); border-right: 1px solid var(--border-color); padding: 24px 16px; display: flex; flex-direction: column; flex-shrink: 0; }
.modal-title { font-size: 13px; font-weight: 600; color: var(--text-muted); letter-spacing: 0.5px; margin-bottom: 16px; padding: 0 12px; text-transform: uppercase; }

.modal-nav { display: flex; flex-direction: column; gap: 4px; }
.modal-nav-item { display: flex; align-items: center; gap: 12px; padding: 8px 12px; border-radius: 8px; color: var(--text-main); font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; }
.modal-nav-item:hover { background: var(--hover-bg); }
.modal-nav-item.is-active { background: var(--active-bg); color: var(--apple-blue); font-weight: 600; }
.modal-nav-item.is-active .nav-icon { color: var(--apple-blue); }
.nav-icon { width: 20px; display: flex; justify-content: center; font-size: 14px; color: var(--text-muted); transition: color 0.2s; }

.modal-content-area { flex: 1; position: relative; display: flex; flex-direction: column; background: var(--content-bg); overflow: hidden; }

.modal-close-btn {
  position: absolute; top: 20px; right: 20px; width: 32px; height: 32px; border-radius: 50%; border: none; background: var(--pill-bg); color: var(--text-muted); z-index: 10;
  display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;
}
.modal-close-btn:hover { background: var(--hover-bg); color: var(--text-main); }

.settings-panel { flex: 1; display: flex; flex-direction: column; animation: fade-in 0.3s ease; overflow-y: auto; padding: 40px; scrollbar-width: none; }
.settings-panel::-webkit-scrollbar { display: none; }
@keyframes fade-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

/* 面板通用标题 */
.panel-header { font-size: 24px; font-weight: 700; color: var(--text-main); margin-bottom: 32px; flex-shrink: 0; display: none; }

/* ======== 个人资料 & 偏好 分组列表布局 ======== */
.profile-view { padding-top: 48px; }

/* 顶部 Hero */
.profile-hero-section { display: flex; align-items: center; gap: 24px; padding: 0 16px 32px 16px; }

.avatar-editable-wrapper {
  position: relative; width: 72px; height: 72px; border-radius: 50%; cursor: pointer;
  overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); flex-shrink: 0;
}
/* ✅ 优化：系统设置内极大的用户头像也一并跟随强调色 */
.avatar-huge {
  width: 100%; height: 100%; border-radius: 50%; background: linear-gradient(135deg, var(--apple-blue), color-mix(in srgb, var(--apple-blue) 70%, white));
  color: #fff; font-size: 28px; font-weight: 600; display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.avatar-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s ease;
}
.avatar-editable-wrapper:hover .avatar-overlay { opacity: 1; }
.camera-icon { color: #fff; font-size: 20px; }
.hidden-input { display: none; }

.hero-text-content { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; }
.hero-name { font-size: 24px; font-weight: 600; color: var(--text-main); margin: 0 0 4px 0; letter-spacing: -0.5px; }
.hero-email { font-size: 14px; color: var(--text-muted); margin: 0; }

/* 设置项分组 */
.settings-groups-container { display: flex; flex-direction: column; gap: 28px; max-width: 560px; padding: 0 16px; }

.settings-group { display: flex; flex-direction: column; gap: 10px; }
.group-title { font-size: 13px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; padding-left: 12px; margin: 0; letter-spacing: 0.5px; }

/* 独立卡片 */
.settings-card {
  background: var(--modal-card-bg); border-radius: 12px; overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05); border: 1px solid var(--border-color);
}
.interactive-card { transition: background 0.2s ease; cursor: pointer; }
.interactive-card:hover { background: var(--hover-bg); }

/* 数据行 */
.settings-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 16px; min-height: 48px; transition: background 0.2s ease;
}
.clickable-row { cursor: pointer; }

/* 左侧带彩色方块的 Label 结构 */
.row-label {
  display: flex; align-items: center; gap: 12px;
  font-size: 14px; font-weight: 500; color: var(--text-main);
  min-width: 100px;
}

/* 完美重置的 Icon 方块 */
.setting-icon-box {
  width: 26px; height: 26px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 13px; flex-shrink: 0;
}
/* 方块颜色 */
.bg-blue { background-color: #007aff; }
.bg-green { background-color: #34c759; }
.bg-orange { background-color: #ff9500; }
.bg-red { background-color: #ff3b30; }
.bg-grey { background-color: #8e8e93; }
.bg-indigo { background-color: #5856d6; }

.row-content { flex: 1; display: flex; justify-content: flex-end; align-items: center; text-align: right; }
.row-value { font-size: 14px; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.readonly-text { color: var(--text-muted); }

/* 左文右控件结构 */
.row-content-left { display: flex; flex-direction: column; justify-content: center; gap: 2px; }
.row-desc { font-size: 12px; color: var(--text-muted); }
.row-content-right { flex-shrink: 0; }

/* 换绑按钮操作文本 */
.action-text-btn { background: transparent; border: none; font-size: 14px; color: var(--apple-blue); cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: background 0.2s; flex-shrink: 0; }
.action-text-btn:hover { background: rgba(10, 132, 255, 0.1); }

/* 行内编辑输入框 */
.inline-edit-input {
  background: var(--bg-base); border: 1px solid var(--apple-blue); border-radius: 6px;
  padding: 4px 8px; font-size: 14px; color: var(--text-main); outline: none;
  width: 120px; text-align: right;
}

/* 可编辑文本样式 */
.editable-text {
  cursor: pointer; color: var(--text-main); transition: color 0.2s;
}
.editable-text:hover { color: var(--apple-blue); }

/* 分割线：精确对齐文本 */
.row-divider { height: 1px; background: var(--border-color); margin-left: 54px; }

/* 渐变过渡 */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-4px); }

/* ======== 系统偏好页增强 UI (选择器与色块) ======== */
.color-picker-group { display: flex; gap: 10px; align-items: center; }
.color-dot {
  width: 22px; height: 22px; border-radius: 50%; cursor: pointer;
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1);
  border: 2px solid transparent;
}
.color-dot:hover { transform: scale(1.1); }
.color-dot.active {
  transform: scale(1.2); border-color: var(--content-bg);
  box-shadow: 0 0 0 2px var(--apple-blue), inset 0 1px 2px rgba(0,0,0,0.3);
}

.apple-native-select {
  appearance: none; background-color: var(--hover-bg, rgba(255,255,255,0.05));
  border: 1px solid var(--border-color); color: var(--text-main);
  padding: 4px 28px 4px 12px; border-radius: 8px; font-size: 13px; font-weight: 500;
  outline: none; cursor: pointer;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat; background-position: right 8px center; background-size: 12px;
  transition: all 0.2s;
}
.apple-native-select:focus, .apple-native-select:hover { border-color: var(--apple-blue); background-color: var(--active-bg); }
.apple-layout-root.theme-light .apple-native-select {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
}

/* ======== 系统偏好页 Switch ======== */
.apple-switch { width: 50px; height: 30px; border-radius: 15px; background: rgba(120, 120, 128, 0.32); position: relative; cursor: pointer; transition: background 0.3s ease; display: flex; align-items: center; }
.apple-switch.is-on { background: #34C759; }
.apple-layout-root.theme-light .apple-switch { background: #E9E9EB; }
.apple-layout-root.theme-light .apple-switch.is-on { background: #34C759; }
.switch-knob { width: 26px; height: 26px; background: #fff; border-radius: 50%; position: absolute; left: 2px; box-shadow: 0 3px 8px rgba(0,0,0,0.15), 0 1px 1px rgba(0,0,0,0.16); transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); display: flex; align-items: center; justify-content: center; }
.apple-switch.is-on .switch-knob { transform: translateX(20px); }
.knob-icon { font-size: 12px; color: #1c1c1e; }
.knob-icon.light { color: #f5a623; }

/* 弹窗整体过渡动画 */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-active .apple-modal-container, .modal-fade-enter-active .apple-dialog { animation: modal-scale-in 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
.modal-fade-leave-active .apple-modal-container, .modal-fade-leave-active .apple-dialog { animation: modal-scale-out 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

@keyframes modal-scale-in { from { transform: scale(0.96); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes modal-scale-out { from { transform: scale(1); opacity: 1; } to { transform: scale(0.96); opacity: 0; } }

/* ================= 嵌套的换绑子弹窗 ================= */
.nested-overlay { z-index: 2500; background: rgba(0,0,0,0.5); }

.apple-dialog {
  width: 380px; background: var(--modal-card-bg); border-radius: 16px;
  padding: 32px 24px; display: flex; flex-direction: column; gap: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3); border: 1px solid var(--border-color);
}
.apple-layout-root.theme-light .apple-dialog { box-shadow: 0 20px 40px rgba(0,0,0,0.15); background: #ffffff; }

.dialog-title { font-size: 20px; font-weight: 600; text-align: center; color: var(--text-main); margin: 0; }
.dialog-subtitle { font-size: 14px; color: var(--text-muted); text-align: center; margin-top: -12px; margin-bottom: 8px; line-height: 1.4; }

.dialog-form { display: flex; flex-direction: column; gap: 16px; margin-top: 0; }
.apple-input-group { position: relative; display: flex; width: 100%; align-items: center; }

.input-icon-wrapper {
  position: absolute; left: 14px; color: var(--text-muted); font-size: 15px;
  display: flex; align-items: center; justify-content: center; pointer-events: none;
}

.apple-dialog-input {
  width: 100%; height: 44px; background: var(--bg-base); border: 1px solid var(--border-color);
  border-radius: 10px; padding: 12px 14px; color: var(--text-main); font-size: 15px;
  outline: none; transition: border-color 0.2s, box-shadow 0.2s;
}
.apple-dialog-input.has-icon { padding-left: 40px; }
.apple-dialog-input:focus { border-color: var(--apple-blue); }
.apple-dialog-input.is-error { border-color: #ff4d4f; }
.apple-dialog-input.is-error:focus { border-color: #ff4d4f; box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2); }
.apple-dialog-input:disabled { opacity: 0.6; cursor: not-allowed; background-color: var(--hover-bg); }

.input-icon-wrapper.success-icon { color: #32D74B !important; }
.apple-dialog-input.is-success { border-color: #32D74B; }
.apple-dialog-input.is-success:focus { border-color: #32D74B; box-shadow: 0 0 0 2px rgba(50, 215, 75, 0.2); }

.apple-layout-root.theme-light .input-icon-wrapper.success-icon { color: #34C759 !important; }
.apple-layout-root.theme-light .apple-dialog-input.is-success { border-color: #34C759; }
.apple-layout-root.theme-light .apple-dialog-input.is-success:focus { border-color: #34C759; box-shadow: 0 0 0 2px rgba(52, 199, 89, 0.2); }

.input-suffix-icon {
  position: absolute; right: 14px; color: var(--text-muted); font-size: 15px;
  display: flex; align-items: center; justify-content: center; cursor: pointer; transition: color 0.2s;
}
.input-suffix-icon:hover { color: var(--text-main); }

/* 密码强度样式 */
.password-strength-container { display: flex; align-items: center; gap: 8px; margin-top: -8px; margin-bottom: 4px; padding: 0 8px; }
.strength-bars { display: flex; gap: 4px; flex: 1; }
.strength-bar { height: 4px; flex: 1; border-radius: 2px; background-color: var(--border-color); transition: background-color 0.3s ease; }
.strength-text { font-size: 12px; font-weight: 600; min-width: 14px; text-align: right; transition: color 0.3s ease; }

/* 验证提示样式 */
.validation-message { font-size: 13px; color: #ff4d4f; margin-top: -8px; margin-bottom: 4px; padding: 0 8px; display: flex; align-items: center; gap: 6px; }

.dialog-btn {
  height: 44px; padding: 0 16px; border-radius: 10px; font-size: 15px; font-weight: 600;
  cursor: pointer; transition: all 0.2s; border: none; flex: 1; text-align: center;
}
.dialog-btn.primary { background: var(--apple-blue); color: #fff; }
.dialog-btn.primary:hover { filter: brightness(1.1); }
.dialog-btn.outline { background: transparent; border: 1px solid var(--border-color); color: var(--text-main); }
.dialog-btn.outline:hover { background: var(--hover-bg); }
.dialog-btn:disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }

.dialog-actions { display: flex; gap: 12px; margin-top: 8px; }
.send-code-btn { flex: 0 0 110px; padding: 0 8px; font-size: 14px; font-weight: 500; height: 44px; white-space: nowrap; border-radius: 10px; }

</style>