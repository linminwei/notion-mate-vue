<template>
  <div class="error-page">
    <!-- 背景光晕 -->
    <div class="bg-glow"></div>

    <div class="error-content">
      <div class="error-illustration fade-stagger fade-stagger-1">
        <div class="compass">
          <span class="compass-mark compass-n">N</span>
          <span class="compass-mark compass-s">S</span>
          <span class="compass-mark compass-e">E</span>
          <span class="compass-mark compass-w">W</span>
          <span class="compass-dot dot-ne"></span>
          <span class="compass-dot dot-se"></span>
          <span class="compass-dot dot-sw"></span>
          <span class="compass-dot dot-nw"></span>
          <div class="compass-needle"></div>
          <div class="compass-pivot"></div>
        </div>
      </div>

      <h1 class="error-code fade-stagger fade-stagger-2">
        <span class="digit">4</span><span class="digit digit-zero">0</span><span class="digit">4</span>
      </h1>

      <div class="error-divider fade-stagger fade-stagger-3"></div>

      <p class="error-title fade-stagger fade-stagger-3">迷路了？</p>
      <p class="error-desc fade-stagger fade-stagger-4">
        你访问的页面不存在或已被移除<br>检查一下地址再试试吧
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
  // 监听暗黑模式切换，非自定义色时重新应用强调色
  const observer = new MutationObserver(() => {
    const accentName = localStorage.getItem('apple-accent-name') || 'blue'
    if (accentName !== 'custom') {
      applyAccentColor()
    }
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})
</script>

<!-- CSS 变量 — 非 scoped，404 页不在 BasicLayout 内需自行定义 -->
<style>
:root {
  --bg-base: #f5f5f7;
  --text-main: #1d1d1f;
  --text-muted: rgba(0, 0, 0, 0.50);
  --card-bg: #ffffff;
  --border-color: rgba(0, 0, 0, 0.08);
  --hover-bg: rgba(0, 0, 0, 0.05);
  --compass-ring-bg: rgba(0, 0, 0, 0.03);
  --compass-glow: color-mix(in srgb, var(--apple-blue) 10%, transparent);
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
  --compass-ring-bg: rgba(255, 255, 255, 0.03);
  --compass-glow: color-mix(in srgb, var(--apple-blue) 18%, transparent);
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

/* 背景放射光晕 — 指南针后方微弱的蓝色辉光 */
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
    var(--compass-glow) 0%,
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
   指南针插图 — 160px，2px 细边框
   ================================================================ */
.error-illustration {
  margin-bottom: 48px;
  display: flex;
  justify-content: center;
}

.compass {
  position: relative;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  background: var(--compass-ring-bg);
  box-shadow:
    0 0 40px var(--compass-glow),
    0 0 80px var(--compass-glow),
    inset 0 0 24px rgba(0, 0, 0, 0.04);
  transition:
    border-color 0.4s ease,
    background 0.4s ease,
    box-shadow 0.4s ease;
  animation: compass-pulse 3.5s ease-in-out infinite;
}

/* 方位字母 */
.compass-mark {
  position: absolute;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.5px;
  font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif;
  transition: color 0.4s ease;
  user-select: none;
  opacity: 0.7;
}

.compass-n {
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--apple-blue);
  opacity: 1;
}

.compass-s { bottom: 8px; left: 50%; transform: translateX(-50%); }
.compass-e { top: 50%; right: 8px; transform: translateY(-50%); }
.compass-w { top: 50%; left: 8px; transform: translateY(-50%); }

/* 45° 刻度圆点 */
.compass-dot {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--text-muted);
  opacity: 0.3;
  transition: background 0.4s ease;
}

.dot-ne { top: calc(50% - 50px); left: calc(50% + 50px); transform: translate(-50%, -50%); }
.dot-se { top: calc(50% + 50px); left: calc(50% + 50px); transform: translate(-50%, -50%); }
.dot-sw { top: calc(50% + 50px); left: calc(50% - 50px); transform: translate(-50%, -50%); }
.dot-nw { top: calc(50% - 50px); left: calc(50% - 50px); transform: translate(-50%, -50%); }

/* 摇摆指针 */
.compass-needle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 3px;
  height: 94px;
  margin-top: -47px;
  margin-left: -1.5px;
  border-radius: 1.5px;
  background: linear-gradient(
    to bottom,
    var(--apple-blue) 0%,
    var(--apple-blue) 45%,
    var(--text-muted) 55%,
    var(--text-muted) 100%
  );
  transition: background 0.4s ease;
  animation: compass-wobble 4.5s cubic-bezier(0.45, 0, 0.55, 1) infinite;
}

.compass-needle::before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
  border-bottom: 24px solid var(--apple-blue);
  filter: drop-shadow(0 0 5px var(--compass-glow));
  transition: border-bottom-color 0.4s ease;
}

.compass-needle::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 16px solid var(--text-muted);
  opacity: 0.55;
  transition: border-top-color 0.4s ease;
}

/* 中心铆钉帽 */
.compass-pivot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--bg-base);
  border: 2px solid var(--apple-blue);
  box-shadow: 0 0 10px var(--compass-glow);
  z-index: 2;
  transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
}

.compass-pivot::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--apple-blue);
}

/* ================================================================
   404 数字 — 超大超轻字重 + 阴影层次
   ================================================================ */
.error-code {
  font-size: 180px;
  font-weight: 200;
  line-height: 1;
  letter-spacing: -6px;
  margin: 0 0 0 0;
  font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--text-main);
  text-shadow: var(--digit-shadow);
  transition: color 0.4s ease;
  user-select: none;
}

/* 中间 "0" 略微淡化 — 微妙的不对称美 */
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

/* 指南针指针 — 更平滑的摇摆 */
@keyframes compass-wobble {
  0%   { transform: rotate(0deg); }
  15%  { transform: rotate(10deg); }
  35%  { transform: rotate(-7deg); }
  55%  { transform: rotate(4deg); }
  72%  { transform: rotate(-2deg); }
  88%  { transform: rotate(1deg); }
  100% { transform: rotate(0deg); }
}

/* 指南针光环呼吸 */
@keyframes compass-pulse {
  0%, 100% {
    box-shadow:
      0 0 40px var(--compass-glow),
      0 0 80px var(--compass-glow),
      inset 0 0 24px rgba(0, 0, 0, 0.04);
  }
  50% {
    box-shadow:
      0 0 55px var(--compass-glow),
      0 0 100px var(--compass-glow),
      inset 0 0 24px rgba(0, 0, 0, 0.04);
  }
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

  .compass {
    width: 130px;
    height: 130px;
  }

  .compass-needle {
    height: 76px;
    margin-top: -38px;
  }

  .dot-ne { top: calc(50% - 40px); left: calc(50% + 40px); }
  .dot-se { top: calc(50% + 40px); left: calc(50% + 40px); }
  .dot-sw { top: calc(50% + 40px); left: calc(50% - 40px); }
  .dot-nw { top: calc(50% - 40px); left: calc(50% - 40px); }

  .error-code {
    font-size: 130px;
    letter-spacing: -4px;
  }

  .error-illustration {
    margin-bottom: 36px;
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
