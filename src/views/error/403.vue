<template>
  <div class="error-page">
    <!-- 背景光晕 -->
    <div class="bg-glow"></div>

    <div class="error-content">
      <!-- 锁插图 -->
      <div class="error-illustration fade-stagger fade-stagger-1">
        <div class="lock-ring">
          <div class="lock-icon">
            <div class="lock-shackle"></div>
            <div class="lock-body">
              <div class="lock-keyhole"></div>
            </div>
          </div>
          <div class="lock-pivot"></div>
        </div>
      </div>

      <h1 class="error-code fade-stagger fade-stagger-2">
        <span class="digit">4</span><span class="digit digit-zero">0</span><span class="digit">3</span>
      </h1>

      <div class="error-divider fade-stagger fade-stagger-3"></div>

      <p class="error-title fade-stagger fade-stagger-3">禁止访问</p>
      <p class="error-desc fade-stagger fade-stagger-4">
        抱歉，你没有权限访问此页面<br>如需帮助请联系管理员
      </p>

      <div class="error-actions fade-stagger fade-stagger-5">
        <a-button type="primary" @click="goBack">
          <arrow-left-outlined /> 返回上一页
        </a-button>
        <a-button class="btn-invert" @click="goHome">
          <home-outlined /> 返回首页
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const goBack = () => router.back()
const goHome = () => router.push('/')

// 从 localStorage 读取全局主题强调色，应用到 --apple-blue
const accentColors = [
  { value: '#0A84FF', lightValue: '#0066cc', name: 'blue' },
  { value: '#BF5AF2', lightValue: '#AF52DE', name: 'purple' },
  { value: '#FF453A', lightValue: '#FF3B30', name: 'red' },
  { value: '#FF9F0A', lightValue: '#FF9500', name: 'orange' },
  { value: '#32D74B', lightValue: '#28CD41', name: 'green' }
]

const applyAccentColor = () => {
  const root = document.documentElement
  const accentName = localStorage.getItem('apple-accent-name') || 'blue'
  if (accentName === 'custom') {
    const customColor = localStorage.getItem('apple-custom-accent') || '#FF2D55'
    root.style.setProperty('--apple-blue', customColor)
  } else {
    const colorObj = accentColors.find(c => c.name === accentName) || accentColors[0]
    const isDark = root.classList.contains('dark')
    root.style.setProperty('--apple-blue', isDark ? colorObj.value : colorObj.lightValue)
  }
}

onMounted(() => {
  applyAccentColor()
  const observer = new MutationObserver(() => {
    const accentName = localStorage.getItem('apple-accent-name') || 'blue'
    if (accentName !== 'custom') {
      applyAccentColor()
    }
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})
</script>

<!-- CSS 变量 — 非 scoped，403 页不在 BasicLayout 内需自行定义 -->
<style>
:root {
  --bg-base: #f5f5f7;
  --text-main: #1d1d1f;
  --text-muted: rgba(0, 0, 0, 0.50);
  --card-bg: #ffffff;
  --border-color: rgba(0, 0, 0, 0.08);
  --hover-bg: rgba(0, 0, 0, 0.05);
  --lock-ring-bg: rgba(0, 0, 0, 0.03);
  --lock-glow: color-mix(in srgb, var(--apple-blue) 10%, transparent);
  --apple-blue: #0A84FF;
  --digit-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  --btn-invert-bg: #1d1d1f;
  --btn-invert-text: #ffffff;
}

html.dark {
  --bg-base: #252523;
  --text-main: rgba(255, 255, 255, 0.92);
  --text-muted: rgba(255, 255, 255, 0.40);
  --card-bg: #1e1e1c;
  --border-color: rgba(255, 255, 255, 0.07);
  --hover-bg: rgba(255, 255, 255, 0.06);
  --lock-ring-bg: rgba(255, 255, 255, 0.03);
  --lock-glow: color-mix(in srgb, var(--apple-blue) 18%, transparent);
  --digit-shadow: 0 4px 32px rgba(0, 0, 0, 0.35);
  --btn-invert-bg: rgba(255, 255, 255, 0.92);
  --btn-invert-text: #1d1d1f;
}
</style>

<style scoped>
/* ================================================================
   页面布局
   ================================================================ */
.error-page {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--bg-base);
  transition: background 0.4s ease;
  overflow: hidden;
}

.bg-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -55%);
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    var(--lock-glow) 0%,
    transparent 65%
  );
  pointer-events: none;
  animation: glow-breathe 4s ease-in-out infinite;
  transition: background 0.4s ease;
}

.error-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 40px 24px;
  max-width: 520px;
}

/* ================================================================
   锁插图 — 160px 圆环 + CSS 锁图标
   ================================================================ */
.error-illustration {
  margin-bottom: 48px;
  display: flex;
  justify-content: center;
}

.lock-ring {
  position: relative;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  background: var(--lock-ring-bg);
  box-shadow:
    0 0 40px var(--lock-glow),
    0 0 80px var(--lock-glow),
    inset 0 0 24px rgba(0, 0, 0, 0.04);
  transition:
    border-color 0.4s ease,
    background 0.4s ease,
    box-shadow 0.4s ease;
  animation: ring-pulse 3.5s ease-in-out infinite;
}

/* 锁图标容器 — 居中于圆环内 */
.lock-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: lock-float 4s ease-in-out infinite;
}

/* 锁梁 — 半圆拱形 */
.lock-shackle {
  width: 32px;
  height: 26px;
  border: 4px solid var(--apple-blue);
  border-bottom: none;
  border-radius: 18px 18px 0 0;
  transition: border-color 0.4s ease;
}

/* 锁体 — 圆角矩形 */
.lock-body {
  width: 38px;
  height: 30px;
  border-radius: 5px;
  background: var(--apple-blue);
  margin-top: -1px;
  position: relative;
  transition: background 0.4s ease;
}

/* 锁孔 */
.lock-keyhole {
  position: absolute;
  top: 7px;
  left: 50%;
  transform: translateX(-50%);
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--bg-base);
  transition: background 0.4s ease;
}

.lock-keyhole::after {
  content: '';
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 9px;
  background: var(--bg-base);
  transition: background 0.4s ease;
}

/* 底部铆钉点 */
.lock-pivot {
  position: absolute;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-muted);
  opacity: 0.35;
  transition: background 0.4s ease;
}

/* ================================================================
   403 数字 — 与 404 一致的超大超轻字重
   ================================================================ */
.error-code {
  font-size: 180px;
  font-weight: 200;
  line-height: 1;
  letter-spacing: -6px;
  margin: 0;
  font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--text-main);
  text-shadow: var(--digit-shadow);
  transition: color 0.4s ease;
  user-select: none;
}

.error-code .digit-zero {
  opacity: 0.82;
}

/* ================================================================
   装饰分割线
   ================================================================ */
.error-divider {
  width: 48px;
  height: 2px;
  border-radius: 1px;
  background: var(--border-color);
  margin: 32px auto 28px;
  transition: background 0.4s ease;
}

/* ================================================================
   标题与描述
   ================================================================ */
.error-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-main);
  margin: 0 0 16px 0;
  letter-spacing: -0.5px;
  transition: color 0.4s ease;
}

.error-desc {
  font-size: 15px;
  color: var(--text-muted);
  margin: 0 0 48px 0;
  line-height: 1.8;
  transition: color 0.4s ease;
}

/* ================================================================
   操作按钮
   ================================================================ */
.error-actions {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
}

.error-actions .ant-btn {
  height: 40px;
  min-width: 140px;
  padding: 0 22px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.error-actions .ant-btn:not(.ant-btn-primary):not(.btn-invert) {
  border-color: var(--border-color);
  color: var(--text-main);
  background: var(--card-bg);
}

.error-actions .ant-btn:not(.ant-btn-primary):not(.btn-invert):hover {
  border-color: var(--border-color);
  color: var(--text-main);
  background: var(--hover-bg);
  transform: translateY(-1px);
}

.error-actions .ant-btn-primary {
  background: var(--apple-blue) !important;
  border-color: var(--apple-blue) !important;
}

.error-actions .ant-btn-primary:hover {
  background: color-mix(in srgb, var(--apple-blue) 85%, #000) !important;
  border-color: color-mix(in srgb, var(--apple-blue) 85%, #000) !important;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px color-mix(in srgb, var(--apple-blue) 30%, transparent);
}

/* 返回首页 — 反转色 */
.error-actions .btn-invert {
  border-color: var(--btn-invert-bg) !important;
  color: var(--btn-invert-text) !important;
  background: var(--btn-invert-bg) !important;
}

.error-actions .btn-invert:hover {
  opacity: 0.88;
  transform: translateY(-1px);
}

/* ================================================================
   动画关键帧
   ================================================================ */

/* 错落入场 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-stagger {
  opacity: 0;
  animation: fadeInUp 0.7s cubic-bezier(0.22, 0.15, 0, 1) forwards;
}

.fade-stagger-1 { animation-delay: 0s; }
.fade-stagger-2 { animation-delay: 0.12s; }
.fade-stagger-3 { animation-delay: 0.24s; }
.fade-stagger-4 { animation-delay: 0.36s; }
.fade-stagger-5 { animation-delay: 0.52s; }

/* 圆环呼吸 */
@keyframes ring-pulse {
  0%, 100% {
    box-shadow:
      0 0 40px var(--lock-glow),
      0 0 80px var(--lock-glow),
      inset 0 0 24px rgba(0, 0, 0, 0.04);
  }
  50% {
    box-shadow:
      0 0 55px var(--lock-glow),
      0 0 100px var(--lock-glow),
      inset 0 0 24px rgba(0, 0, 0, 0.04);
  }
}

/* 锁图标微微浮动 */
@keyframes lock-float {
  0%, 100% { transform: translate(-50%, -50%) translateY(0); }
  50%      { transform: translate(-50%, -50%) translateY(-4px); }
}

/* 背景光晕呼吸 */
@keyframes glow-breathe {
  0%, 100% { opacity: 0.7; transform: translate(-50%, -55%) scale(1); }
  50%      { opacity: 1;   transform: translate(-50%, -55%) scale(1.08); }
}

/* ================================================================
   移动端适配
   ================================================================ */
@media (max-width: 480px) {
  .bg-glow {
    width: 320px;
    height: 320px;
  }

  .lock-ring {
    width: 130px;
    height: 130px;
  }

  .lock-shackle {
    width: 26px;
    height: 22px;
    border-width: 3px;
    border-radius: 15px 15px 0 0;
  }

  .lock-body {
    width: 32px;
    height: 26px;
  }

  .lock-keyhole {
    width: 7px;
    height: 7px;
    top: 5px;
  }

  .lock-keyhole::after {
    width: 3px;
    height: 7px;
    top: 4px;
  }

  .error-illustration {
    margin-bottom: 36px;
  }

  .error-code {
    font-size: 130px;
    letter-spacing: -4px;
  }

  .error-divider {
    width: 40px;
    margin: 24px auto 20px;
  }

  .error-title {
    font-size: 22px;
    margin-bottom: 12px;
  }

  .error-desc {
    font-size: 14px;
    margin-bottom: 36px;
    line-height: 1.7;
  }
}
</style>
