<template>
  <a-config-provider 
    :locale="zhCN"
    :theme="antdTheme"
  >
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { theme } from 'ant-design-vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

// 从 CSS 变量 --apple-blue 读取主题色，传递给 antd ConfigProvider
const primaryColor = ref('#0A84FF')
onMounted(() => {
  const val = getComputedStyle(document.documentElement).getPropertyValue('--apple-blue').trim()
  if (val) primaryColor.value = val
})

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
