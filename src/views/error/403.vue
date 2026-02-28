<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-icon">
        <font-awesome-icon :icon="['fas', 'lock']" />
      </div>
      <h1 class="error-code">403</h1>
      <p class="error-title">无权限访问</p>
      <p class="error-desc">抱歉，您没有权限访问该页面</p>
      <div class="error-actions">
        <a-button type="primary" @click="goBack">
          <arrow-left-outlined /> 返回上一页
        </a-button>
        <a-button @click="goHome">
          <home-outlined /> 返回首页
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons-vue'

const router = useRouter()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--bg-base, #0b0c0e);
}

.error-content {
  text-align: center;
  padding: 40px;
}

.error-icon {
  font-size: 80px;
  color: #ff9500;
  margin-bottom: 24px;
}

.error-code {
  font-size: 120px;
  font-weight: 700;
  color: var(--text-main, #ffffff);
  margin: 0 0 16px 0;
  line-height: 1;
}

.error-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-main, #ffffff);
  margin: 0 0 8px 0;
}

.error-desc {
  font-size: 16px;
  color: var(--text-muted, rgba(255, 255, 255, 0.55));
  margin: 0 0 32px 0;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}
</style>
