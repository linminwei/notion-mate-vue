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

        <!-- 核心内容区域：左右分栏布局 -->
        <div class="hero-content">
          <!-- 左侧：营销 Slogan (文档流主体) -->
          <div class="slogan-area">
            <div class="title-wrapper">
              <h2 class="slogan-title slide-in-2">All In One.</h2>
              <!-- 优化了流光渐变效果 -->
              <h2 class="slogan-title text-gradient slide-in-3">Intelligence.</h2>
            </div>

            <!-- 描述卡片 -->
            <div class="desc-card slide-in-4">
              <div class="desc-glow"></div>
              <div class="desc-content">
                <p class="main-desc">
                  Notion 与 MySQL 的完美协奏。
                </p>
                <p class="main-desc">
                  从理财投资到影视娱乐，智能托管您的每一比特数据。
                </p>
              </div>
            </div>
          </div>

          <!-- 右侧：固定组件展示区 -->
          <div class="feature-showcase">

            <!-- Widget 1: 双向同步引擎 -->
            <div class="widget-wrapper wrapper-status">
              <div class="glass-widget widget-status-style sync-engine-card">
                <!-- 背景装饰层：扫描线与高光 -->
                <div class="card-scan-line"></div>
                <div class="card-glow-corner"></div>

                <!-- 顶部状态仪表盘 -->
                <div class="sync-header-row">
                  <div class="status-indicator">
                    <div class="signal-bars">
                      <div class="bar active"></div>
                      <div class="bar active"></div>
                      <div class="bar active"></div>
                      <div class="bar"></div>
                    </div>
                    <span class="status-label">双向同步</span>
                  </div>
                </div>

                <!-- 核心可视化区域 -->
                <div class="sync-visual-row">
                  <!-- MySQL 侧 (Data Source) -->
                  <div class="tech-node mysql-node">
                    <div class="node-halo halo-blue"></div>
                    <div class="node-housing">
                      <svg class="tech-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 3C7.58 3 4 4.79 4 7s3.58 4 8 4 8-1.79 8-4-3.58-4-8-4z"></path>
                        <path d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7"></path>
                        <path d="M4 12c0 2.21 3.58 4 8 4s8-1.79 8-4"></path>
                      </svg>
                    </div>
                    <div class="node-label-pill">MySQL</div>
                  </div>

                  <!-- 中间双向光缆通道 -->
                  <div class="bi-directional-bridge">
                    <div class="optic-cable cable-upper">
                      <div class="cable-groove"></div>
                      <div class="photon-packet packet-blue">
                        <div class="photon-core"></div>
                        <div class="photon-trail"></div>
                      </div>
                    </div>
                    <div class="optic-cable cable-lower">
                      <div class="cable-groove"></div>
                      <div class="photon-packet packet-green">
                        <div class="photon-core"></div>
                        <div class="photon-trail"></div>
                      </div>
                    </div>
                  </div>

                  <!-- Notion 侧 (Data Target) -->
                  <div class="tech-node notion-node">
                    <div class="node-halo halo-white"></div>
                    <div class="node-housing">
                      <img src="/public/notion.png" class="notion-n" alt="Notion" onerror="this.style.display='none'">
                    </div>
                    <div class="node-label-pill">Notion</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Widget 2: 个人理财管理 (背景已统一) -->
            <div class="widget-wrapper wrapper-analytics">
              <div class="glass-widget personal-finance-card">
                <!-- 顶部：总资产概览 -->
                <div class="pf-header">
                  <div class="pf-title-group">
                    <div class="pf-icon-box">
                      <wallet-outlined />
                    </div>
                    <span class="pf-title">个人理财</span>
                  </div>
                  <more-outlined class="pf-more-btn" />
                </div>

                <!-- 核心：大额数字展示 -->
                <div class="pf-balance-section">
                  <div class="pf-currency">$</div>
                  <div class="pf-amount">1,249,300</div>
                </div>

                <!-- 收益胶囊 -->
                <div class="pf-trend-row">
                  <div class="pf-trend-pill up">
                    <caret-up-outlined />
                    <span>+$14,290 (1.2%)</span>
                  </div>
                  <span class="pf-trend-period">Last 24h</span>
                </div>

                <!-- 视觉：资产增长曲线 (平滑、稳健) -->
                <div class="pf-chart-container">
                  <svg class="pf-chart" viewBox="0 0 140 35" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradientWealth" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stop-color="#10b981" stop-opacity="0.3"/>
                        <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
                      </linearGradient>
                    </defs>
                    <path d="M0,30 Q20,28 40,20 T80,15 T140,5 V35 H0 Z" fill="url(#chartGradientWealth)" />
                    <path d="M0,30 Q20,28 40,20 T80,15 T140,5" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" />
                  </svg>
                </div>

                <!-- 底部：资产配置管理 (Asset Allocation) -->
                <div class="pf-assets-allocation">
                  <div class="pf-asset-item">
                    <div class="pf-asset-info">
                      <span class="pf-asset-name">Stocks</span>
                      <span class="pf-asset-val">65%</span>
                    </div>
                    <div class="pf-progress-track">
                      <div class="pf-progress-bar bar-green" style="width: 65%"></div>
                    </div>
                  </div>
                  <div class="pf-asset-item">
                    <div class="pf-asset-info">
                      <span class="pf-asset-name">Crypto</span>
                      <span class="pf-asset-val">25%</span>
                    </div>
                    <div class="pf-progress-track">
                      <div class="pf-progress-bar bar-purple" style="width: 25%"></div>
                    </div>
                  </div>
                  <div class="pf-asset-item">
                    <div class="pf-asset-info">
                      <span class="pf-asset-name">Cash</span>
                      <span class="pf-asset-val">10%</span>
                    </div>
                    <div class="pf-progress-track">
                      <div class="pf-progress-bar bar-blue" style="width: 10%"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Widget 3: 生活娱乐 -->
            <div class="widget-wrapper wrapper-life">
              <div class="glass-widget">
                <div class="life-icons">
                  <div class="life-icon-item music"><customer-service-outlined /></div>
                  <div class="life-icon-item movie"><play-circle-outlined /></div>
                  <div class="life-icon-item task"><check-square-outlined /></div>
                </div>
                <div class="life-text">
                  <span>Life OS Active</span>
                  <small>Music · Movies · Tasks</small>
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
  CustomerServiceOutlined,
  PlayCircleOutlined,
  CheckSquareOutlined,
  SyncOutlined,
  CaretUpOutlined,
  WalletOutlined, // 新增
  MoreOutlined   // 新增
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

.orb-1 {
  top: -10%; left: -10%;
  width: 70%; height: 70%;
  background: radial-gradient(circle, #4F46E5 0%, rgba(79, 70, 229, 0) 70%);
}
.orb-2 {
  bottom: -20%; right: -10%;
  width: 80%; height: 80%;
  background: radial-gradient(circle, #EC4899 0%, rgba(236, 72, 153, 0) 70%);
  animation-delay: -5s;
}
.orb-3 {
  top: 40%; left: 30%;
  width: 60%; height: 60%;
  background: radial-gradient(circle, #06B6D4 0%, rgba(6, 182, 212, 0) 70%);
  animation-delay: -10s;
  opacity: 0.6;
}

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
  gap: clamp(20px, 4vw, 100px);
  position: relative;
  z-index: 5;
  min-height: 0;
}

/* Feature Showcase */
.feature-showcase {
  position: relative;
  width: auto;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: clamp(16px, 3vh, 40px);
  padding-right: 0;
  pointer-events: auto;
  z-index: 10;
  transform-origin: right center;
  transition: transform 0.3s ease;
}

.widget-wrapper {
  position: relative;
  z-index: 2;
  will-change: transform;
  transition: z-index 0s 0.1s;
}
.widget-wrapper:hover {
  z-index: 10;
  transition: z-index 0s;
}

.glass-widget {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(30px) saturate(140%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  border-left: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  padding: 20px;
  box-shadow:
      0 20px 40px rgba(0,0,0,0.3),
      0 10px 10px rgba(0,0,0,0.1),
      inset 0 0 20px rgba(255,255,255,0.02);
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: center center;
  cursor: default;
}
.glass-widget:hover {
  transform: translateY(-8px) scale(1.03);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 40px 80px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.1);
}

/* Widget 1: Status */
.wrapper-status {
  margin-right: clamp(20px, 3vw, 40px);
  width: clamp(240px, 18vw, 280px);
  animation: float-card 9s infinite ease-in-out reverse;
  animation-delay: -2s;
}
.sync-engine-card {
  padding: 16px 20px;
  position: relative;
  overflow: hidden;
}
.sync-engine-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 16px 16px;
  opacity: 0.3;
  z-index: 0;
}
.card-scan-line {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 2px;
  background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.3), transparent);
  animation: scan-down 4s linear infinite;
  z-index: 1;
}
@keyframes scan-down {
  0% { transform: translateY(-10px); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(120px); opacity: 0; }
}
.sync-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
  z-index: 2;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding-bottom: 10px;
}
.status-indicator { display: flex; align-items: center; gap: 8px; }
.signal-bars { display: flex; align-items: flex-end; gap: 2px; height: 10px; }
.bar { width: 2px; background: rgba(255,255,255,0.2); border-radius: 1px; }
.bar:nth-child(1) { height: 40%; }
.bar:nth-child(2) { height: 60%; }
.bar:nth-child(3) { height: 100%; }
.bar:nth-child(4) { height: 80%; }
.bar.active { background: #4ade80; box-shadow: 0 0 4px #4ade80; }
.status-label {
  font-family: 'SF Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #4ade80;
  text-shadow: 0 0 10px rgba(74, 222, 128, 0.4);
}
.latency-meter {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0,0,0,0.2);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(255,255,255,0.05);
}
.latency-val { font-family: 'SF Mono', monospace; font-size: 11px; color: rgba(255,255,255,0.6); }
.sync-icon-mini { font-size: 10px; color: #38bdf8; opacity: 0.8; }
.sync-visual-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  height: 60px;
  z-index: 5;
}
.tech-node { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; z-index: 10; width: 48px; }
.node-housing {
  width: 42px; height: 42px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(145deg, #1e293b, #0f172a);
  border: 1px solid rgba(255,255,255,0.15);
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  position: relative;
  z-index: 2;
}
.notion-fallback { font-size: 18px; font-weight: 800; color: #fff; }
.node-label-pill {
  font-size: 9px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;
  background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px; color: rgba(255,255,255,0.4);
  border: 1px solid rgba(255,255,255,0.05);
}
.node-halo {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 140%; height: 140%; border-radius: 50%; z-index: 1; opacity: 0; filter: blur(8px);
}
.halo-blue { background: radial-gradient(circle, rgba(56, 189, 248, 0.6) 0%, transparent 70%); animation: halo-pulse 2.4s infinite ease-out 1s; }
.halo-white { background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%); animation: halo-pulse 2.4s infinite ease-out 1s; }
@keyframes halo-pulse {
  0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
  20% { opacity: 0.8; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0; }
  100% { opacity: 0; }
}
.bi-directional-bridge { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 12px; margin: 0 10px 20px; position: relative; }
.optic-cable { position: relative; width: 100%; height: 6px; border-radius: 3px; background: rgba(0, 0, 0, 0.3); box-shadow: inset 0 1px 2px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05); overflow: hidden; }
.photon-packet { position: absolute; top: 1px; height: 4px; width: 40px; display: flex; align-items: center; border-radius: 2px; filter: drop-shadow(0 0 4px currentColor); }
.cable-upper .photon-packet { left: 0; color: #38bdf8; flex-direction: row-reverse; animation: photon-right 2.4s infinite cubic-bezier(0.4, 0, 0.2, 1); }
.cable-lower .photon-packet { right: 0; color: #4ade80; flex-direction: row; animation: photon-left 2.4s infinite cubic-bezier(0.4, 0, 0.2, 1); animation-delay: 1.2s; }
.photon-core { width: 8px; height: 4px; background: #fff; border-radius: 2px; box-shadow: 0 0 8px 2px currentColor; z-index: 2; }
.photon-trail { flex: 1; height: 2px; background: linear-gradient(to right, transparent, currentColor); opacity: 0.8; }
.packet-to-left .photon-trail { background: linear-gradient(to left, transparent, currentColor); }
@keyframes photon-right { 0% { left: -20%; opacity: 0; width: 20px; } 10% { opacity: 1; width: 50px; } 80% { opacity: 1; width: 50px; } 100% { left: 110%; opacity: 0; width: 20px; } }
@keyframes photon-left { 0% { right: -20%; opacity: 0; width: 20px; } 10% { opacity: 1; width: 50px; } 80% { opacity: 1; width: 50px; } 100% { right: 110%; opacity: 0; width: 20px; } }

/* =================================================================
   Widget 2: Personal Finance (REFACTORED)
   ================================================================= */
.wrapper-analytics {
  margin-right: 0;
  width: clamp(210px, 17vw, 250px);
  animation: float-card 8s infinite ease-in-out;
}

.personal-finance-card {
  /* 已重置背景，与 Widget 3 统一使用 .glass-widget 样式 */
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  overflow: hidden;
}

/* Header */
.pf-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
.pf-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}
.pf-icon-box {
  width: 24px; height: 24px;
  border-radius: 6px;
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; color: #fff;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}
.pf-title {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255,255,255,0.7);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.pf-more-btn {
  color: rgba(255,255,255,0.3);
  font-size: 14px;
  cursor: pointer;
  transition: color 0.3s;
}
.pf-more-btn:hover { color: #fff; }

/* Balance */
.pf-balance-section {
  display: flex;
  align-items: flex-start;
  line-height: 1;
}
.pf-currency {
  font-size: 18px;
  font-weight: 500;
  color: rgba(255,255,255,0.6);
  margin-top: 4px;
  margin-right: 2px;
}
.pf-amount {
  font-family: 'SF Pro Display', 'SF Mono', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.5px;
  background: linear-gradient(180deg, #fff 20%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Trend Pill */
.pf-trend-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.pf-trend-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  font-size: 10px;
  font-weight: 700;
  color: #10b981;
}
.pf-trend-period {
  font-size: 10px;
  color: rgba(255,255,255,0.3);
}

/* Chart */
.pf-chart-container {
  width: 100%;
  height: 35px;
  margin-bottom: 12px;
  opacity: 0.8;
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}
.pf-chart { width: 100%; height: 100%; overflow: visible; }

/* Asset Allocation (New Feature) */
.pf-assets-allocation {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid rgba(255,255,255,0.08);
  padding-top: 12px;
}
.pf-asset-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.pf-asset-info {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  font-weight: 600;
}
.pf-asset-name { color: rgba(255,255,255,0.6); }
.pf-asset-val { color: #fff; font-family: 'SF Mono', monospace; }

.pf-progress-track {
  width: 100%;
  height: 4px;
  background: rgba(255,255,255,0.08);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}
.pf-progress-bar {
  height: 100%;
  border-radius: 2px;
  position: relative;
}
.pf-progress-bar::after {
  content: '';
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transform: translateX(-100%);
  animation: shimmer 2.5s infinite;
}

.bar-green { background: #10b981; box-shadow: 0 0 6px rgba(16, 185, 129, 0.4); }
.bar-purple { background: #8b5cf6; box-shadow: 0 0 6px rgba(139, 92, 246, 0.4); }
.bar-blue { background: #3b82f6; box-shadow: 0 0 6px rgba(59, 130, 246, 0.4); }

@keyframes shimmer {
  100% { transform: translateX(100%); }
}


/* Widget 3: Life */
.wrapper-life {
  margin-right: 0;
  width: clamp(130px, 10vw, 170px);
  animation: float-card 10s infinite ease-in-out;
  animation-delay: -5s;
}
.life-icons { display: flex; gap: 8px; margin-bottom: 12px; }
.life-icon-item {
  width: 32px; height: 32px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.1);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.wrapper-life:hover .life-icon-item:nth-child(1) { transform: translateY(-4px); }
.wrapper-life:hover .life-icon-item:nth-child(2) { transform: translateY(-4px); transition-delay: 0.05s; }
.wrapper-life:hover .life-icon-item:nth-child(3) { transform: translateY(-4px); transition-delay: 0.1s; }
.life-icon-item.music { background: linear-gradient(135deg, #f43f5e, #e11d48); }
.life-icon-item.movie { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
.life-icon-item.task { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.life-text { display: flex; flex-direction: column; }
.life-text span { font-size: 13px; font-weight: 600; color: #fff; }
.life-text small { font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 2px; }

@keyframes float-card {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(1deg); }
}

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