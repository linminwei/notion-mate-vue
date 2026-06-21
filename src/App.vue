<template>
  <a-config-provider 
    :locale="zhCN"
    :theme="antdTheme"
  >
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { theme } from 'ant-design-vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

// 从 CSS 变量 --apple-blue 读取主题色，传递给 antd ConfigProvider
const primaryColor = ref('#0A84FF')

const syncPrimaryColor = () => {
  const val = getComputedStyle(document.documentElement).getPropertyValue('--apple-blue').trim()
  if (val) primaryColor.value = val
}

// 监听强调色版本变化（切主题/换强调色时触发）
watch(() => appStore.accentVersion, () => {
  nextTick(syncPrimaryColor)
})

// 初始读取
onMounted(syncPrimaryColor)

const antdTheme = computed(() => ({
  algorithm: appStore.isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: { colorPrimary: primaryColor.value },
}))
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
