<template>
  <a-config-provider 
    :locale="zhCN"
    :theme="{
      algorithm: appStore.isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    }"
  >
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { theme } from 'ant-design-vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
