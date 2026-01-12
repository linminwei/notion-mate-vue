<template>
  <a-layout class="layout">
    <a-layout-sider v-model:collapsed="collapsed" collapsible :trigger="null" theme="dark">
      <div class="logo">
        <span v-if="!collapsed">权限管理系统</span>
        <span v-else>权</span>
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" theme="dark" mode="inline">
        <template v-for="menu in menus" :key="menu.id">
          <a-sub-menu v-if="menu.children && menu.children.length > 0" :key="`sub-${menu.id}`">
            <template #title>
              <component :is="getIcon(menu.icon)" />
              <span>{{ menu.menuName }}</span>
            </template>
            <a-menu-item v-for="child in menu.children" :key="child.path" @click="() => navigateTo(child.path)">
              <component :is="getIcon(child.icon)" />
              <span>{{ child.menuName }}</span>
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item v-else :key="menu.path" @click="() => navigateTo(menu.path)">
            <component :is="getIcon(menu.icon)" />
            <span>{{ menu.menuName }}</span>
          </a-menu-item>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="header">
        <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => collapsed = !collapsed" />
        <menu-fold-outlined v-else class="trigger" @click="() => collapsed = !collapsed" />
        <div class="header-right">
          <a-dropdown>
            <span class="user-info">
              <a-avatar :size="32">{{ userInfo?.nickname?.charAt(0) || 'U' }}</a-avatar>
              <span class="username">{{ userInfo?.nickname || userInfo?.username }}</span>
            </span>
            <template #overlay>
              <a-menu>
                <a-menu-item key="logout" @click="handleLogout">
                  <logout-outlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  UserOutlined,
  TeamOutlined,
  MenuOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'
import type { Component } from 'vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const collapsed = ref(false)
const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>([])

const userInfo = computed(() => userStore.userInfo)
const menus = computed(() => userStore.menus)

const iconMap: Record<string, Component> = {
  HomeOutlined,
  UserOutlined,
  TeamOutlined,
  MenuOutlined,
  SettingOutlined
}

const getIcon = (iconName: string) => {
  return iconMap[iconName] || SettingOutlined
}

const navigateTo = (path: string) => {
  router.push(path.startsWith('/') ? path : `/${path}`)
}

const handleLogout = async () => {
  await userStore.logout()
}

watch(() => route.path, (path) => {
  selectedKeys.value = [path]
}, { immediate: true })
</script>

<style scoped>
.layout {
  min-height: 100vh;
}
.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.1);
}
.header {
  background: #fff;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
.trigger {
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
}
.trigger:hover {
  color: #1890ff;
}
.header-right {
  display: flex;
  align-items: center;
}
.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.username {
  margin-left: 8px;
}
.content {
  margin: 24px 16px;
  padding: 24px;
  background: #fff;
  min-height: 280px;
  border-radius: 8px;
}
</style>
