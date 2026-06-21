<template>
  <!-- ================= Hero 欢迎区域 ================= -->
  <header class="portal-hero">
    <div class="hero-inner">
      <h1 class="hero-title">
        <span class="line">欢迎回来</span>
        <span class="line glow-text">{{ userInfo?.nickname || userInfo?.username }}</span>
      </h1>
      <p class="hero-sub">您的个人数据工作台，一切尽在掌控。</p>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)
</script>

<style scoped>
/* ================= Hero 区域 ================= */
.portal-hero {
  position: relative;
  z-index: 10;
  height: 100vh;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  pointer-events: none;
  padding: 0 20px;
  box-sizing: border-box;
}

.hero-inner {
  pointer-events: auto;
  margin-bottom: 20px;
  width: 100%;
}

.hero-title {
  font-size: clamp(36px, 6vw, 80px);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 24px;
  color: var(--text-primary);
  transition: color 0.4s ease;
}

.hero-title .line {
  display: block;
}

.glow-text {
  text-shadow: 0 0 50px rgba(80, 150, 255, 0.3), 0 0 100px rgba(60, 120, 255, 0.15);
}

.theme-light .glow-text {
  text-shadow: 0 0 50px rgba(0, 132, 255, 0.15);
}

.hero-sub {
  font-size: clamp(16px, 2vw, 20px);
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 48px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  transition: color 0.4s ease;
}
</style>
