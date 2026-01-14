<template>
  <div class="split-container">
    <!-- 左侧：品牌与视觉沉浸区 -->
    <aside class="visual-side">
      <!-- 动态网格背景层 -->
      <div class="mesh-background">
        <div class="mesh-orb orb-1"></div>
        <div class="mesh-orb orb-2"></div>
        <div class="mesh-orb orb-3"></div>
      </div>
      <!-- 噪点纹理层 -->
      <div class="noise-overlay"></div>

      <!-- 磨砂玻璃前景 -->
      <div class="glass-foreground">
        <!-- 品牌 Logo -->
        <div class="brand-area">
          <div class="brand-logo-circle">
            <database-outlined />
          </div>
          <span class="brand-name">Notion Mate</span>
          <!-- 黑金流光 AI Badge -->
          <div class="brand-badge-wrapper">
            <span class="brand-badge">AI</span>
          </div>
        </div>

        <!-- 核心内容区域 -->
        <div class="hero-content">
          <!-- Slogan -->
          <div class="slogan-area">
            <div class="title-wrapper">
              <h2 class="slogan-title slide-in-2">All In One.</h2>
              <h2 class="slogan-title text-gradient slide-in-3">Intelligence.</h2>
            </div>
            <div class="desc-card slide-in-4">
              <div class="desc-glow"></div>
              <div class="desc-content">
                <p class="main-desc">Notion 与 MySQL 的完美协奏。</p>
                <p class="main-desc">智能托管您的每一比特数据。</p>
              </div>
            </div>
          </div>

          <!-- 右侧：Bento Grid 组件展示区 -->
          <div class="feature-showcase floating-group">
            <div class="bento-grid">

              <!-- 1. 双向同步引擎 -->
              <div class="glass-widget widget-sync grid-span-2">
                <div class="card-grid-bg"></div>
                <div class="sync-status-row">
                  <div class="status-dot pulsing"></div>
                  <span class="status-text">ENGINE ACTIVE</span>
                  <div class="latency-tag">24ms</div>
                </div>
                <div class="sync-flow-visual">
                  <div class="node-icon mysql"><database-outlined /></div>
                  <div class="flow-line">
                    <div class="packet packet-left"></div>
                    <div class="packet packet-right"></div>
                  </div>
                  <div class="node-icon notion"><img src="https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png" alt="N" class="notion-n" onerror="this.style.display='none'"></div>
                </div>
              </div>

              <!-- 2. 音乐组件 -->
              <div class="glass-widget widget-music-reimagined grid-span-2">
                <div class="sonic-aura"></div>
                <div class="music-layout">
                  <div class="vinyl-wrapper">
                    <div class="vinyl-disc spinning">
                      <img class="vinyl-cover" src="/public/最伟大的作品.jpg" alt="Album Art">
                      <div class="vinyl-center-hole"></div>
                      <div class="vinyl-reflection"></div>
                    </div>
                  </div>
                  <div class="player-interface">
                    <div class="song-info">
                      <h3 class="song-title">最伟大的作品</h3>
                      <p class="artist-name">周杰伦 • Jay Chou</p>
                    </div>
                    <div class="sound-wave-container">
                      <div class="wave-bar"></div>
                      <div class="wave-bar"></div>
                      <div class="wave-bar"></div>
                      <div class="wave-bar"></div>
                      <div class="wave-bar"></div>
                      <div class="wave-bar"></div>
                      <div class="wave-bar"></div>
                      <div class="wave-bar"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 3. 理财组件 -->
              <div class="glass-widget widget-finance-pro grid-span-1">
                <div class="finance-bg-glow"></div>
                <div class="finance-content-pro">
                  <div class="fin-header">
                    <span class="fin-label">NET WORTH</span>
                    <div class="fin-badge">+12.5%</div>
                  </div>
                  <div class="fin-main-number">
                    <span class="currency">$</span>14,290
                  </div>
                  <div class="fin-chart-abstract">
                    <div class="bar-col" style="height: 40%"></div>
                    <div class="bar-col" style="height: 70%"></div>
                    <div class="bar-col active" style="height: 100%"></div>
                    <div class="bar-col" style="height: 60%"></div>
                    <div class="bar-col" style="height: 80%"></div>
                  </div>
                </div>
              </div>

              <!-- 4. 待办组件 (UI 重构: Minimal Mode) -->
              <div class="glass-widget widget-task-minimal grid-span-1">
                <!-- 头部 -->
                <div class="min-header">
                  <span class="min-title">Upcoming</span>
                  <div class="min-badge">2</div>
                </div>

                <!-- 列表 -->
                <div class="min-list">
                  <!-- 任务 1: 当前 -->
                  <div class="min-item active">
                    <div class="min-check"></div>
                    <div class="min-content">
                      <div class="min-text">Deploy Schema</div>
                      <div class="min-time">14:00</div>
                    </div>
                  </div>

                  <!-- 任务 2: 已完成 -->
                  <div class="min-item">
                    <div class="min-check checked"><check-outlined /></div>
                    <div class="min-content">
                      <div class="min-text done">Review PR #82</div>
                      <div class="min-time">12:30</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 5. 影视组件 -->
              <div class="glass-widget widget-movie-pro grid-span-2">
                <div class="cinema-backdrop"></div>
                <div class="cinema-noise"></div>
                <div class="cinema-overlay"></div>

                <div class="cinema-content">
                  <div class="cinema-meta">
                    <span class="cinema-tag">IMAX 3D</span>
                    <div class="cinema-rating">
                      <star-filled class="star-icon" />
                      <span>9.8</span>
                    </div>
                  </div>
                  <div class="cinema-info">
                    <h3 class="cinema-title">疯狂动物城2</h3>
                    <div class="cinema-sub">Zootopia 2 • 2h 49m</div>
                  </div>
                  <button class="cinema-play-btn">
                    <play-circle-filled />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- 底部版权 -->
        <div class="visual-footer">
          <div class="footer-line"></div>
          <p>Powered by Notion Mate Intelligent System</p>
        </div>
      </div>
    </aside>

    <!-- 右侧：功能交互区 -->
    <main class="form-side">
      <!-- 顶部工具栏 -->
      <div class="top-actions">
        <a-button type="text" class="icon-btn" @click="toggleTheme">
          <template #icon>
            <transition name="fade-scale" mode="out-in">
              <bulb-outlined v-if="appStore.isDark" key="dark" />
              <bulb-filled v-else key="light" />
            </transition>
          </template>
        </a-button>
      </div>

      <!-- 登录表单容器 -->
      <div class="form-container">
        <div class="form-header">
          <h1 class="welcome-text">欢迎回来</h1>
          <p class="subtitle-text">请登录您的账户以继续</p>
        </div>

        <a-form
            :model="formState"
            :rules="rules"
            @finish="handleLogin"
            layout="vertical"
            class="apple-form"
        >
          <a-form-item name="username">
            <a-input
                v-model:value="formState.username"
                size="large"
                placeholder="Apple ID 或用户名"
                class="apple-input"
            >
              <template #prefix>
                <user-outlined class="input-icon" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item name="password">
            <a-input-password
                v-model:value="formState.password"
                size="large"
                placeholder="密码"
                class="apple-input"
            >
              <template #prefix>
                <lock-outlined class="input-icon" />
              </template>
            </a-input-password>
          </a-form-item>

          <div class="form-actions">
            <a class="forgot-link">忘记密码？</a>
          </div>

          <a-form-item class="submit-item">
            <a-button
                type="primary"
                html-type="submit"
                size="large"
                block
                :loading="loading"
                class="apple-btn primary-btn"
            >
              登 录
            </a-button>
          </a-form-item>
        </a-form>

        <div class="divider">
          <span>或</span>
        </div>

        <div class="social-login">
          <a-button block class="apple-btn social-btn apple-id-btn">
            <apple-filled /> 使用 Apple ID 登录
          </a-button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import {
  UserOutlined,
  LockOutlined,
  BulbOutlined,
  BulbFilled,
  AppleFilled,
  DatabaseOutlined,
  PlayCircleFilled,
  StarFilled,
  CheckOutlined,
  CheckSquareFilled
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const appStore = useAppStore()
const loading = ref(false)

const formState = reactive({
  username: 'admin',
  password: 'admin123'
})

const rules: Record<string, Rule[]> = {
  username: [{ required: true, message: '请输入您的账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入您的密码', trigger: 'blur' }]
}

const toggleTheme = () => {
  appStore.toggleTheme()
}

const handleLogin = async () => {
  loading.value = true
  setTimeout(async () => {
    try {
      await userStore.login({
        username: formState.username,
        password: formState.password
      })
      message.success({ content: '欢迎回来', key: 'login' })
      const redirect = route.query.redirect as string
      router.push(redirect || '/')
    } catch (error: any) {
      message.error(error.message || '账号或密码错误')
    } finally {
      loading.value = false
    }
  }, 800)
}
</script>

<style>
/* 全局重置 */
:root {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
  font-size: 16px;
  --visual-side-padding: clamp(24px, 3vw, 50px);
}

body {
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
</style>

<style scoped>
.split-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif;
  background-color: #fff;
}

/* ================= 左侧视觉区 ================= */
.visual-side {
  flex: 1.2;
  position: relative;
  overflow: hidden;
  background: #000;
  color: #fff;
  perspective: 1000px;
  min-width: 400px;
}

/* 动态网格背景 */
.mesh-background {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 0;
  filter: blur(80px);
  opacity: 0.8;
  will-change: transform;
}

.noise-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 1;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  pointer-events: none;
}

.mesh-orb {
  position: absolute;
  border-radius: 50%;
  animation: float-mesh 20s infinite ease-in-out;
}

.orb-1 { top: -10%; left: -10%; width: 70%; height: 70%; background: radial-gradient(circle, #4F46E5 0%, rgba(79, 70, 229, 0) 70%); }
.orb-2 { bottom: -20%; right: -10%; width: 80%; height: 80%; background: radial-gradient(circle, #EC4899 0%, rgba(236, 72, 153, 0) 70%); animation-delay: -5s; }
.orb-3 { top: 40%; left: 30%; width: 60%; height: 60%; background: radial-gradient(circle, #06B6D4 0%, rgba(6, 182, 212, 0) 70%); animation-delay: -10s; opacity: 0.6; }

@keyframes float-mesh {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}

/* 磨砂玻璃前景布局 */
.glass-foreground {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--visual-side-padding);
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px) saturate(120%);
}

.brand-area {
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
  z-index: 10;
  flex-shrink: 0;
  height: 44px;
}
.brand-logo-circle {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}
.brand-name {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1;
  padding-bottom: 2px;
  white-space: nowrap;
}

/* AI Badge */
.brand-badge-wrapper {
  display: flex;
  align-items: center;
  height: 100%;
}
.brand-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: #FCD34D;
  background: linear-gradient(145deg, #1c1917 0%, #000000 100%);
  border: 1px solid rgba(251, 191, 36, 0.3);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  margin-top: -1px;
}
.brand-badge::after {
  content: '';
  position: absolute;
  top: 0; left: -150%; width: 150%; height: 100%;
  background: linear-gradient(110deg, transparent 30%, rgba(251, 191, 36, 0.6) 45%, rgba(253, 224, 71, 0.8) 50%, rgba(251, 191, 36, 0.6) 55%, transparent 70%);
  transform: skewX(-20deg);
  animation: gilded-shine 4s infinite cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}
@keyframes gilded-shine {
  0% { left: -150%; opacity: 0; }
  10% { opacity: 1; }
  30% { left: 150%; opacity: 1; }
  100% { left: 150%; opacity: 0; }
}

/* Hero Content */
.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex: 1;
  gap: clamp(20px, 4vw, 80px);
  position: relative;
  z-index: 5;
  min-height: 0;
}

/* =================================================================
   Bento Grid Layout
   ================================================================= */
.feature-showcase {
  position: relative;
  width: auto;
  flex-shrink: 0;
  z-index: 10;
}
.floating-group {
  animation: float-group 10s ease-in-out infinite;
  transform-origin: center center;
}
@keyframes float-group {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(2, 150px);
  grid-template-rows: repeat(4, auto);
  gap: 16px;
}
.grid-span-1 { grid-column: span 1; }
.grid-span-2 { grid-column: span 2; }

/* 通用玻璃卡片 */
.glass-widget {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(40px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}
.glass-widget:hover {
  transform: translateY(-4px) scale(1.02);
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 16px 40px rgba(0,0,0,0.3);
  z-index: 10;
}

/* --- 1. 双向同步引擎 (Compact) --- */
.widget-sync {
  height: 90px;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.card-grid-bg {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 16px 16px;
  z-index: 0; pointer-events: none;
}
.sync-status-row {
  display: flex; align-items: center; gap: 8px; position: relative; z-index: 2;
}
.status-dot { width: 6px; height: 6px; background: #4ade80; border-radius: 50%; box-shadow: 0 0 8px #4ade80; }
.pulsing { animation: pulse 2s infinite; }
.status-text { font-size: 10px; font-weight: 700; color: #4ade80; letter-spacing: 0.5px; }
.latency-tag { font-family: 'SF Mono', monospace; font-size: 9px; color: rgba(255,255,255,0.4); margin-left: auto; border: 1px solid rgba(255,255,255,0.1); padding: 1px 4px; border-radius: 4px; }

.sync-flow-visual {
  display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 2; height: 32px;
}
.node-icon { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); font-size: 14px; color: #fff; }
.node-icon.mysql { color: #38bdf8; }
.node-icon.notion img { width: 14px; height: 14px; filter: brightness(1.2); }
.flow-line { flex: 1; height: 2px; background: rgba(255,255,255,0.1); margin: 0 8px; position: relative; border-radius: 2px; overflow: hidden; }
.packet { position: absolute; top: 0; width: 20px; height: 100%; border-radius: 2px; filter: blur(1px); }
.packet-left { left: 0; background: linear-gradient(90deg, transparent, #38bdf8); animation: flow-r 2s infinite linear; }
.packet-right { right: 0; background: linear-gradient(270deg, transparent, #4ade80); animation: flow-l 2s infinite linear 1s; }
@keyframes flow-r { 0% { left: -20%; opacity: 0; } 50% { opacity: 1; } 100% { left: 100%; opacity: 0; } }
@keyframes flow-l { 0% { right: -20%; opacity: 0; } 50% { opacity: 1; } 100% { right: 100%; opacity: 0; } }

/* --- 2. 音乐组件 (Redesign: Sonic Vinyl) --- */
.widget-music-reimagined {
  height: 100px;
  position: relative;
  overflow: hidden;
  padding: 0;
  border: 1px solid rgba(255,255,255,0.12);
  background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.2) 100%);
}

/* 背景光晕 */
.sonic-aura {
  position: absolute; width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(236,72,153,0.2), transparent 70%);
  top: -100px; left: -100px;
  animation: aura-breathe 8s infinite alternate ease-in-out;
  pointer-events: none;
}
@keyframes aura-breathe { 0% { opacity: 0.3; transform: scale(0.8); } 100% { opacity: 0.6; transform: scale(1.1); } }

.music-layout {
  display: flex; align-items: center; height: 100%; width: 100%; padding: 0 16px; gap: 16px;
}

/* 左侧黑胶区域 */
.vinyl-wrapper {
  flex-shrink: 0; width: 72px; height: 72px;
  display: flex; align-items: center; justify-content: center;
  position: relative;
}
.vinyl-disc {
  width: 70px; height: 70px; border-radius: 50%;
  background: #111;
  background-image: repeating-radial-gradient(#111 0, #111 2px, #222 3px, #111 4px);
  position: relative;
  box-shadow: 0 4px 15px rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
}
.spinning { animation: vinyl-spin 6s linear infinite; }
@keyframes vinyl-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* 修改后的封面尺寸：从 34px 增大到 48px，比例更协调 */
.vinyl-cover { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; z-index: 2; border: 2px solid #000; }
.vinyl-center-hole {
  position: absolute; width: 6px; height: 6px; background: #000; border-radius: 50%; z-index: 3; top: 50%; left: 50%; transform: translate(-50%, -50%);
}
.vinyl-reflection {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 50%;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%);
  z-index: 4; pointer-events: none;
}

/* 右侧界面 - 布局调整 */
.player-interface {
  flex: 1;
  display: flex;
  flex-direction: row; /* 水平布局 */
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  position: relative;
}

.song-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 左对齐 */
  justify-content: center;
  text-align: left; /* 左对齐 */
  position: relative;
  z-index: 2;
  padding: 0 4px;
}
.song-title { font-size: 14px; font-weight: 700; color: #fff; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: 0.3px; max-width: 100%; }
.artist-name { font-size: 10px; color: rgba(255,255,255,0.5); margin: 6px 0 0; text-transform: uppercase; letter-spacing: 0.5px; max-width: 100%; }

/* 动态波形 - 稍微调整位置 */
.sound-wave-container {
  display: flex; gap: 3px; align-items: center;
  opacity: 0.6; height: 20px;
  flex-shrink: 0;
}
.wave-bar { width: 3px; background: linear-gradient(to top, #ec4899, #8b5cf6); border-radius: 2px; animation: wave-dance 1.2s infinite ease-in-out; }
.wave-bar:nth-child(1) { height: 8px; animation-delay: 0s; }
.wave-bar:nth-child(2) { height: 16px; animation-delay: 0.2s; }
.wave-bar:nth-child(3) { height: 12px; animation-delay: 0.1s; }
.wave-bar:nth-child(4) { height: 20px; animation-delay: 0.3s; }
.wave-bar:nth-child(5) { height: 14px; animation-delay: 0.15s; }
.wave-bar:nth-child(6) { height: 10px; animation-delay: 0.25s; }
.wave-bar:nth-child(7) { height: 18px; animation-delay: 0.05s; }
.wave-bar:nth-child(8) { height: 6px; animation-delay: 0.35s; }

@keyframes wave-dance {
  0%, 100% { transform: scaleY(0.5); opacity: 0.5; }
  50% { transform: scaleY(1.2); opacity: 1; }
}


/* --- 3. 理财组件 (Wealth Prism - 保留) --- */
.widget-finance-pro {
  height: 120px;
  padding: 16px;
  display: flex; flex-direction: column;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(16, 185, 129, 0.2);
  background: radial-gradient(circle at top right, rgba(16, 185, 129, 0.1), transparent 70%);
}
.finance-bg-glow {
  position: absolute; bottom: -20px; left: 0; width: 100%; height: 50%;
  background: linear-gradient(to top, rgba(16, 185, 129, 0.1), transparent);
  filter: blur(20px); z-index: 0;
}
.finance-content-pro { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; justify-content: space-between; }
.fin-header { display: flex; justify-content: space-between; align-items: center; }
.fin-label { font-size: 9px; font-weight: 800; color: rgba(255,255,255,0.6); letter-spacing: 1px; }
.fin-badge { font-size: 9px; font-weight: 700; color: #10b981; background: rgba(16, 185, 129, 0.15); padding: 2px 6px; border-radius: 6px; box-shadow: 0 0 10px rgba(16, 185, 129, 0.2); }
.fin-main-number { font-size: 26px; font-weight: 800; color: #fff; letter-spacing: -0.5px; text-shadow: 0 2px 10px rgba(0,0,0,0.2); }
.fin-main-number .currency { font-size: 16px; color: #10b981; margin-right: 2px; }
.fin-chart-abstract { display: flex; align-items: flex-end; gap: 4px; height: 24px; opacity: 0.7; }
.bar-col { flex: 1; background: rgba(255,255,255,0.1); border-radius: 2px; transition: height 0.3s; }
.bar-col.active { background: #10b981; box-shadow: 0 0 8px #10b981; }


/* --- 4. 待办组件 (UI 重构: Minimal Mode) --- */
.widget-task-minimal {
  height: 120px;
  padding: 16px;
  display: flex; flex-direction: column;
  background: rgba(255, 255, 255, 0.03); /* 轻微背景 */
}

/* Header */
.min-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 10px;
}
.min-title { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; }
.min-badge {
  background: rgba(255,255,255,0.1); color: #fff; font-size: 10px; font-weight: 600;
  padding: 1px 6px; border-radius: 4px;
}

/* List */
.min-list { display: flex; flex-direction: column; gap: 6px; flex: 1; justify-content: center; }

/* Item */
.min-item {
  display: flex; align-items: center; gap: 10px;
  padding: 6px 8px; margin: 0 -8px;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: default;
}
.min-item:hover { background: rgba(255,255,255,0.06); }
.min-item.active { background: rgba(255,255,255,0.05); }

/* Checkbox */
.min-check {
  width: 14px; height: 14px; border-radius: 4px;
  border: 1.5px solid rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 8px; color: transparent;
  transition: all 0.2s;
  flex-shrink: 0;
}
.min-item.active .min-check { border-color: #38bdf8; box-shadow: 0 0 8px rgba(56, 189, 248, 0.2); }
.min-check.checked { background: rgba(255,255,255,0.2); border-color: transparent; color: #fff; }

/* Content */
.min-content { flex: 1; display: flex; justify-content: space-between; align-items: center; min-width: 0; }
.min-text { font-size: 12px; color: rgba(255,255,255,0.9); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.min-text.done { color: rgba(255,255,255,0.4); text-decoration: line-through; }
.min-time { font-size: 10px; color: rgba(255,255,255,0.3); font-family: 'SF Mono', monospace; margin-left: 8px; }


/* --- 5. 影视组件 (Cinema Scope - 保留) --- */
.widget-movie-pro {
  height: 100px;
  position: relative;
  overflow: hidden;
  padding: 0;
  border: 1px solid rgba(255,255,255,0.1);
}
.cinema-backdrop {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background-image: url('https://th.bing.com/th/id/R.b12ba99367fe3c1c5e91156d8fbd751d?rik=9usLu3OH20LPsw&riu=http%3a%2f%2fn.sinaimg.cn%2fsinakd20240707s%2f491%2fw600h691%2f20240707%2f9646-80ad3439466935220f214033eea06480.jpg&ehk=0LwGQLF0QNXsoRaYjrnaMZaaSVkHYyuTuOKspnOLAAE%3d&risl=&pid=ImgRaw&r=0');
  background-size: cover; background-position: center;
  transition: transform 5s ease-out;
  filter: blur(2px) brightness(0.7);
}
.widget-movie-pro:hover .cinema-backdrop { transform: scale(1.1); filter: blur(0) brightness(0.8); }
.cinema-noise {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.1'/%3E%3C/svg%3E");
  mix-blend-mode: overlay; pointer-events: none;
}
.cinema-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to right, #000 0%, rgba(0,0,0,0.6) 40%, transparent 100%);
  z-index: 1;
}
.cinema-content {
  position: relative; z-index: 2; height: 100%; width: 100%;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px;
}
.cinema-meta { display: flex; flex-direction: column; gap: 4px; align-items: flex-start; }
.cinema-tag { font-size: 8px; font-weight: 800; color: #000; background: #fff; padding: 2px 4px; border-radius: 2px; }
.cinema-rating { display: flex; align-items: center; gap: 4px; color: #fbbf24; font-size: 10px; font-weight: 700; margin-top: 2px; }
.cinema-info { flex: 1; margin-left: 16px; display: flex; flex-direction: column; justify-content: center; }
.cinema-title {
  font-family: 'SF Pro Display', sans-serif; font-size: 20px; font-weight: 900; color: #fff; margin: 0;
  letter-spacing: 1px; text-shadow: 0 4px 10px rgba(0,0,0,0.5); text-transform: uppercase;
}
.cinema-sub { font-size: 10px; color: rgba(255,255,255,0.7); margin-top: 2px; }
.cinema-play-btn {
  width: 36px; height: 36px; border-radius: 50%; border: none;
  background: rgba(255,255,255,0.15); backdrop-filter: blur(4px);
  color: #fff; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all 0.2s; border: 1px solid rgba(255,255,255,0.2);
}
.cinema-play-btn:hover { background: #fff; color: #000; transform: scale(1.1); }


/* Slogan Area */
.slogan-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  padding-left: 4px;
  min-width: 0;
}
.slogan-title {
  font-family: "SF Pro Display", -apple-system, sans-serif;
  font-size: clamp(32px, 5.5vw, 110px);
  font-weight: 800;
  line-height: 0.95;
  margin-bottom: 0;
  letter-spacing: -0.04em;
  color: #fff;
  text-shadow: 0 10px 30px rgba(0,0,0,0.3);
  opacity: 0;
  transform: translateY(30px);
  white-space: nowrap;
}
.text-gradient {
  background-image: linear-gradient(
      110deg,
      #ffffff 0%,
      #ffffff 20%,
      #c4b5fd 35%,
      #a855f7 50%,
      #ec4899 65%,
      #fbcfe8 80%,
      #ffffff 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  line-height: 1.0;
  padding-bottom: 0.2em;
  margin-bottom: -0.1em;
  filter: drop-shadow(0 0 25px rgba(168, 85, 247, 0.5));
  animation: gradient-flow 6s linear infinite;
}
@keyframes gradient-flow {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
.desc-card { margin-top: 48px; position: relative; display: flex; flex-direction: column; opacity: 0; transform: translateY(20px); max-width: 500px; }
.desc-content { position: relative; z-index: 2; padding: 0; }
.main-desc { font-size: clamp(14px, 1.2vw, 18px); line-height: 1.4; color: rgba(255, 255, 255, 0.7); font-weight: 400; margin-bottom: 12px; }
.slide-in-2 { animation: slide-up-fade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; animation-delay: 0.1s; }
.slide-in-3 { animation: slide-up-fade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; animation-delay: 0.2s; }
.slide-in-4 { animation: slide-up-fade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; animation-delay: 0.4s; }
@keyframes slide-up-fade { to { opacity: 1; transform: translateY(0); } }

/* Footer */
.visual-footer {
  font-size: 12px; color: rgba(255, 255, 255, 0.5); font-weight: 500; display: flex; flex-direction: column; gap: 16px; position: relative; z-index: 10; flex-shrink: 0;
}
.footer-line { width: 40px; height: 2px; background: rgba(255, 255, 255, 0.3); border-radius: 2px; }

/* Right Side Form */
.form-side {
  flex: 1;
  background: #fff;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: background 0.3s ease;
  justify-content: center;
  min-width: 320px;
}
:global(.dark) .form-side { background: #000; }
.top-actions { position: absolute; top: 30px; right: 30px; display: flex; gap: 16px; z-index: 10; }
.icon-btn { font-size: 18px; color: #1d1d1f; }
:global(.dark) .icon-btn { color: #f5f5f7; }
.form-container { width: 100%; max-width: 440px; margin: auto; padding: 0 40px; }
.form-header { margin-bottom: 40px; }
.welcome-text { font-size: 32px; font-weight: 700; color: #1d1d1f; margin: 0 0 12px; letter-spacing: -0.5px; }
:global(.dark) .welcome-text { color: #fff; }
.subtitle-text { color: #86868b; font-size: 16px; }
.apple-input :deep(.ant-input), .apple-input :deep(.ant-input-password) { background: transparent !important; }
.apple-input :deep(.ant-input-prefix) { margin-right: 12px; color: #86868b; }
:deep(.ant-input-affix-wrapper) { background-color: #f5f5f7; border: 1px solid transparent; border-radius: 12px; padding: 12px 16px; box-shadow: none; transition: all 0.3s; }
:global(.dark) :deep(.ant-input-affix-wrapper) { background-color: #1c1c1e; }
:deep(.ant-input-affix-wrapper:hover) { background-color: #e8e8ed; }
:global(.dark) :deep(.ant-input-affix-wrapper:hover) { background-color: #2c2c2e; }
:deep(.ant-input-affix-wrapper-focused) { background-color: #fff; border-color: #0071e3; box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1); }
:global(.dark) :deep(.ant-input-affix-wrapper-focused) { background-color: #1c1c1e; }
.form-actions { display: flex; justify-content: flex-end; align-items: center; margin-bottom: 32px; }
.apple-btn { height: 52px; border-radius: 14px; font-size: 17px; font-weight: 600; box-shadow: none; }
.primary-btn { background: #0071e3; }
.primary-btn:hover { background: #0077ED; }
.divider { display: flex; align-items: center; margin: 32px 0; color: #86868b; font-size: 13px; }
.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: #e5e5ea; }
:global(.dark) .divider::before, :global(.dark) .divider::after { background: #38383a; }
.divider span { padding: 0 16px; }
.social-login { display: flex; gap: 16px; }
.social-btn { background: #000; color: #fff; border: 1px solid transparent; transition: all 0.2s; }
:global(.dark) .social-btn { background: #fff; color: #000; }
.social-btn:hover { opacity: 0.85; transform: scale(1.01); }

/* Response Adjustments */
@media (max-width: 1440px) {
  .slogan-title { font-size: 5vw; white-space: nowrap; }
  .feature-showcase { transform: scale(0.9); transform-origin: center right; }
  .desc-card { margin-top: 32px; }
}
@media (max-width: 1280px) {
  .hero-content { gap: 20px; }
  .feature-showcase { transform: scale(0.8); }
  .slogan-title { font-size: 4.5vw; }
}
@media (max-width: 900px) {
  .split-container { flex-direction: column; height: auto; min-height: 100dvh; overflow-y: auto; }
  .visual-side { flex: 0 0 40vh; padding: 30px; overflow: hidden; min-width: auto; }
  .hero-content { flex-direction: column; gap: 20px; align-items: center; text-align: center; }
  .feature-showcase { display: none; }
  .slogan-area { max-width: 100%; align-items: center; text-align: center; padding-left: 0; }
  .slogan-title { font-size: 56px; letter-spacing: -2px; opacity: 1; transform: none; animation: none; white-space: normal; }
  .desc-card { margin-top: 16px; display: block; opacity: 1; transform: none; animation: none; max-width: 100%; text-align: center; }
  .main-desc { margin-bottom: 16px; font-size: 15px; }
  .visual-footer { display: none; }
  .form-side { flex: 1; border-top-left-radius: 24px; border-top-right-radius: 24px; margin-top: -24px; z-index: 10; padding-bottom: 40px; }
  .form-container { padding-top: 40px; }
}
@media (max-height: 800px) {
  .feature-showcase { gap: 10px; transform: scale(0.85); transform-origin: center right; }
  .slogan-title { font-size: clamp(32px, 5vw, 60px); }
  .desc-card { margin-top: 20px; }
  .visual-side { padding: 20px 30px; }
  .brand-area { height: 36px; margin-bottom: 10px;}
  .brand-logo-circle { width: 36px; height: 36px; font-size: 20px; }
  .brand-name { font-size: 18px; }
}
.tech-svg, .notion-n, .node-housing > svg, .node-housing > img { width: 24px !important; height: 24px !important; min-width: 24px; min-height: 24px; object-fit: contain; display: block; }
.tech-svg { color: #38bdf8; }
.notion-n { fill: #fff; }
</style>