<template>
  <div class="neo-loading-cell">
    <div class="neo-loading-glass">
      <div class="neo-spinner-wrap">
        <div class="neo-spinner-track"></div>
        <div class="neo-spinner-fill"></div>
      </div>
      <p class="neo-loading-text">{{ text }}</p>
      <div class="neo-loading-dots"><span></span><span></span><span></span></div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ text?: string }>(), { text: '正在加载' })
</script>
