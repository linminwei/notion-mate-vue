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
              <!-- 优化了流光渐变效果，并修复了g字母遮挡问题 -->
              <h2 class="slogan-title text-gradient slide-in-3">Intelligence.</h2>
            </div>

            <!-- 重新设计的描述卡片 -->
            <div class="desc-card slide-in-4">
              <!-- 装饰性光晕背景 -->
              <div class="desc-glow"></div>

              <div class="desc-content">
                <p class="main-desc">
                  打破数据孤岛。深度连接 <span class="highlight">MySQL</span> 与 <span class="highlight">Notion</span>，构建你的第二大脑。
                </p>
              </div>
            </div>
          </div>

          <!-- 右侧：固定组件展示区 -->
          <div class="feature-showcase">
            <!-- Widget 1: 投资理财 (恢复悬浮动画) -->
            <div class="widget-wrapper wrapper-analytics">
              <div class="glass-widget">
                <div class="widget-icon primary-bg"><line-chart-outlined /></div>
                <div class="widget-content">
                  <span class="widget-label">Investment Assets</span>
                  <span class="widget-value">¥1,249,300</span>
                  <span class="widget-trend positive">+14.5% All Time</span>
                </div>
              </div>
            </div>

            <!-- Widget 2: 同步引擎状态 (恢复悬浮动画) -->
            <div class="widget-wrapper wrapper-status">
              <div class="glass-widget widget-status-style">
                <div class="widget-row">
                  <div class="status-dot pulsing"></div>
                  <span class="status-text">MySQL ⇄ Notion</span>
                </div>
                <div class="status-graph">
                  <div class="graph-bar" style="height: 40%"></div>
                  <div class="graph-bar" style="height: 80%"></div>
                  <div class="graph-bar active" style="height: 100%"></div>
                  <div class="graph-bar" style="height: 60%"></div>
                  <div class="graph-bar" style="height: 30%"></div>
                  <div class="graph-bar" style="height: 50%"></div>
                </div>
              </div>
            </div>

            <!-- Widget 3: 生活娱乐 (恢复悬浮动画) -->
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

            <!-- 功能矩阵微卡片 (保持静止，无悬浮动画) -->
            <div class="widget-wrapper features-grid-wrapper">
              <div class="features-grid">
                <div class="feature-pill">
                  <span class="pill-icon">🎨</span>
                  <span class="pill-text">生活娱乐</span>
                </div>
                <div class="feature-divider"></div>
                <div class="feature-pill">
                  <span class="pill-icon">⚡️</span>
                  <span class="pill-text">工作待办</span>
                </div>
                <div class="feature-divider"></div>
                <div class="feature-pill">
                  <span class="pill-icon">📈</span>
                  <span class="pill-text">投资理财</span>
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

    <!-- 右侧：功能交互区 (保持不变) -->
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
  LineChartOutlined,
  DatabaseOutlined,
  CustomerServiceOutlined,
  PlayCircleOutlined,
  CheckSquareOutlined
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
  --visual-side-padding: clamp(24px, 4vw, 60px);
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

/* 新增：英雄区容器 (左右分栏) */
.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex: 1;
  gap: clamp(40px, 5vw, 100px); /* 左右间距 */
  position: relative;
  z-index: 5;
}

/* Feature Showcase (修改为静态布局) */
.feature-showcase {
  /* 移除绝对定位，改为 Flex 子项 */
  position: relative;
  width: auto;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end; /* 右对齐 */
  gap: clamp(16px, 3vh, 40px);
  padding-right: 0; /* 不再需要额外的 padding，由容器控制 */
  pointer-events: auto; /* 恢复交互 */
  z-index: 10;
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
.features-grid-wrapper {
  margin-top: 30px;
  margin-right: -10px;
  /* 无悬浮动画 */
}

.glass-widget {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: center center;
  cursor: default;
}
.glass-widget:hover {
  transform: translateY(-8px) scale(1.05);
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 40px 80px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.3);
}

/* Widget 1: Investment Assets - 恢复悬浮动画 */
.wrapper-analytics {
  margin-right: 0;
  width: clamp(160px, 13vw, 200px);
  animation: float-card 8s infinite ease-in-out;
}
.widget-icon {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #34d399 0%, #059669 100%);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
}
.widget-content { display: flex; flex-direction: column; }
.widget-label { font-size: 12px; color: rgba(255,255,255,0.6); }
.widget-value {
  font-size: clamp(18px, 1.2vw, 22px);
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-top: 2px;
}
.widget-trend { font-size: 11px; color: #34d399; font-weight: 500; margin-top: 4px; }

/* Widget 2: Status - 恢复悬浮动画 */
.wrapper-status {
  margin-right: clamp(20px, 3vw, 40px);
  width: clamp(150px, 11vw, 190px);
  animation: float-card 9s infinite ease-in-out reverse;
  animation-delay: -2s;
}
.widget-status-style { background: rgba(20, 20, 20, 0.4); }
.widget-status-style:hover { background: rgba(40, 40, 40, 0.6); }
.widget-row { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
.status-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 8px #22c55e; }
.pulsing { animation: pulse 2s infinite; }
.status-text { font-size: 13px; font-weight: 500; }
.status-graph { display: flex; align-items: flex-end; gap: 6px; height: 30px; }
.graph-bar { width: 6px; background: rgba(255,255,255,0.2); border-radius: 4px; transition: height 0.3s; }
.graph-bar.active { background: #22c55e; }

/* Widget 3: Life - 恢复悬浮动画 */
.wrapper-life {
  margin-right: 0;
  width: clamp(140px, 11vw, 170px);
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
}
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
@keyframes pulse {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
  100% { opacity: 1; transform: scale(1); }
}

/* ========= 核心优化：Slogan 区域 ========= */
.slogan-area {
  /* 修改为 Flex 子项，移除之前的绝对/固定宽限制 */
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  /* max-width: 65%;  移除这个限制，由 flex 控制 */
  padding-left: 4px;
}

/* --- 新增：胶囊标签 --- */
.slogan-header {
  margin-bottom: 24px;
  opacity: 0;
  transform: translateY(10px);
}
.capsule-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}
.pulse-dot {
  width: 6px; height: 6px;
  background-color: #4ade80;
  border-radius: 50%;
  box-shadow: 0 0 8px #4ade80;
  animation: pulse 2s infinite;
}
.tag-text {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.9);
}

/* 标题样式 */
.slogan-title {
  font-family: "SF Pro Display", -apple-system, sans-serif;
  font-size: clamp(80px, 11vw, 150px);
  font-weight: 800;
  line-height: 1.05; /* 更紧凑的行高 */
  margin-bottom: 0;
  letter-spacing: -0.04em;
  color: #fff;
  text-shadow: 0 10px 30px rgba(0,0,0,0.3);
  /* 初始状态：透明且下移 */
  opacity: 0;
  transform: translateY(30px);
}

/* 动态流体渐变 - 优化配色 */
.text-gradient {
  /* 使用高对比度、高饱和度的颜色组合 */
  background-image: linear-gradient(
      110deg,
      #ffffff 0%,
      #e0f2fe 10%,
      #38bdf8 30%,
      #a855f7 50%,
      #ec4899 70%,
      #ffffff 90%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;

  /* 修复 G 字母遮挡：增加行高和底部内边距，确保 descenders 不被切断 */
  line-height: 1.2;
  padding-bottom: 0.2em;
  margin-bottom: -0.1em; /* 补偿 padding 带来的位移 */

  /* 更强的辉光 */
  filter: drop-shadow(0 0 30px rgba(168, 85, 247, 0.4));
  animation: gradient-flow 5s linear infinite;
}

@keyframes gradient-flow {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

/* 描述卡片容器 - 优化 */
.desc-card {
  margin-top: 48px;
  position: relative;
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateY(20px);
  max-width: 500px;
}

/* 描述内容 */
.desc-content {
  position: relative;
  z-index: 2;
  /* 去掉厚重的背景，改用更轻盈的 padding */
  padding: 0;
}

/* 核心描述文本 */
.main-desc {
  font-size: clamp(16px, 1.4vw, 18px);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
  margin-bottom: 24px;
}
.highlight {
  color: #fff;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

/* 功能胶囊网格 */
.features-grid {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 10px 20px;
  border-radius: 16px;
  width: fit-content;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}
.feature-pill {
  display: flex;
  align-items: center;
  gap: 6px;
}
.pill-icon {
  font-size: 16px;
}
.pill-text {
  font-size: 13px;
  font-weight: 500;
  color: #fff;
}
.feature-divider {
  width: 1px;
  height: 14px;
  background: rgba(255, 255, 255, 0.15);
}

/* 错峰入场动画 */
.slide-in-1 {
  animation: slide-up-fade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
.slide-in-2 {
  animation: slide-up-fade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  animation-delay: 0.1s;
}
.slide-in-3 {
  animation: slide-up-fade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  animation-delay: 0.2s;
}
.slide-in-4 {
  animation: slide-up-fade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  animation-delay: 0.4s;
}

@keyframes slide-up-fade {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 底部版权 */
.visual-footer {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  z-index: 10;
  flex-shrink: 0;
}
.footer-line { width: 40px; height: 2px; background: rgba(255, 255, 255, 0.3); border-radius: 2px; }

/* 右侧表单区 */
.form-side {
  flex: 1;
  background: #fff;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: background 0.3s ease;
  justify-content: center;
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

/* 表单组件覆写 */
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

/* 响应式调整 */
@media (max-width: 900px) {
  .split-container { flex-direction: column; height: auto; min-height: 100dvh; overflow-y: auto; }
  .visual-side { flex: 0 0 40vh; padding: 30px; overflow: hidden; }
  /* 修改移动端显示逻辑 */
  .hero-content { flex-direction: column; gap: 20px; align-items: center; text-align: center; }
  .feature-showcase { display: none; } /* 移动端暂时隐藏复杂组件，保持简洁 */

  .slogan-area { max-width: 100%; align-items: center; text-align: center; padding-left: 0; }
  .slogan-title { font-size: 56px; letter-spacing: -2px; opacity: 1; transform: none; animation: none; }
  .slogan-header { opacity: 1; transform: none; margin-bottom: 16px; }

  /* 移动端描述区调整 */
  .desc-card { margin-top: 16px; display: block; opacity: 1; transform: none; animation: none; max-width: 100%; text-align: center; }
  .main-desc { margin-bottom: 16px; font-size: 15px; }
  .features-grid { margin: 0 auto; }

  .visual-footer { display: none; }
  .form-side { flex: 1; border-top-left-radius: 24px; border-top-right-radius: 24px; margin-top: -24px; z-index: 10; padding-bottom: 40px; }
  .form-container { padding-top: 40px; }
}

@media (max-height: 800px) {
  /* 调整小屏幕高度适配 */
  .feature-showcase { gap: 8px; transform: scale(0.9); transform-origin: center right; }
  .widget-wrapper { transform: none; } /* 移除单个缩放，改用整体缩放 */
  .slogan-title { font-size: 60px; }
}
</style>