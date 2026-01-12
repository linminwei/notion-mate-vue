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
      <!-- 噪点纹理层：增加胶片质感 -->
      <div class="noise-overlay"></div>

      <!-- 磨砂玻璃前景 -->
      <div class="glass-foreground">
        <!-- 品牌 Logo -->
        <div class="brand-area">
          <div class="brand-logo-circle">
            <!-- 替换为数据库图标，象征数据源 -->
            <database-outlined />
          </div>
          <span class="brand-name">Notion Mate</span>
          <span class="brand-badge">AI</span>
        </div>

        <!-- 中间：悬浮功能演示区 (根据需求定制) -->
        <div class="feature-showcase">
          <!-- Widget 1: 投资理财 (保留原有结构，修改内容) -->
          <div class="glass-widget widget-analytics">
            <div class="widget-icon primary-bg"><line-chart-outlined /></div>
            <div class="widget-content">
              <span class="widget-label">Investment Assets</span>
              <span class="widget-value">¥1,249,300</span>
              <span class="widget-trend positive">+14.5% All Time</span>
            </div>
          </div>

          <!-- Widget 2: 同步引擎状态 (体现 MySQL <-> Notion) -->
          <div class="glass-widget widget-status">
            <div class="widget-row">
              <div class="status-dot pulsing"></div>
              <span class="status-text">MySQL ⇄ Notion</span>
            </div>
            <!-- 模拟数据流传输的动画条 -->
            <div class="status-graph">
              <div class="graph-bar" style="height: 40%"></div>
              <div class="graph-bar" style="height: 80%"></div>
              <div class="graph-bar active" style="height: 100%"></div>
              <div class="graph-bar" style="height: 60%"></div>
              <div class="graph-bar" style="height: 30%"></div>
              <div class="graph-bar" style="height: 50%"></div>
            </div>
          </div>

          <!-- Widget 3: 生活娱乐 (音乐/影视/待办) -->
          <div class="glass-widget widget-life">
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

        <!-- 营销 Slogan -->
        <div class="slogan-area">
          <h2 class="slogan-title">All In One.</h2>
          <h2 class="slogan-title text-gradient">Intelligence.</h2>
          <p class="slogan-desc">
            打破数据孤岛。<br>
            连接 MySQL 与 Notion，智能接管你的生活娱乐、工作待办与投资理财。
          </p>
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
        <!-- 移除了语言切换 Dropdown -->
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
            <!-- 移除了“记住我” Checkbox -->
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
  DatabaseOutlined, // 新增
  CustomerServiceOutlined, // 新增：音乐
  PlayCircleOutlined, // 新增：影视
  CheckSquareOutlined // 新增：待办
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

<style scoped>
.split-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

/* ================= 左侧视觉区 (Apple Style Redesign) ================= */
.visual-side {
  flex: 1.2;
  position: relative;
  overflow: hidden;
  background: #000; /* 底色 */
  color: #fff;
  perspective: 1000px; /* 为3D变换做准备 */
}

/* 动态网格背景 Mesh Gradient */
.mesh-background {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 0;
  filter: blur(80px); /* 极度模糊产生柔和光晕 */
  opacity: 0.8;
}

/* 噪点纹理 - 增加高级感 */
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
  animation-delay: 0s;
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
  padding: 60px;
  background: rgba(0, 0, 0, 0.1); /* 极轻微遮罩 */
  backdrop-filter: blur(20px) saturate(120%);
}

/* 品牌区域 */
.brand-area {
  display: flex;
  align-items: center;
  gap: 14px;
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
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.brand-badge {
  font-size: 10px;
  font-weight: 700;
  background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.5px;
  border: 0.5px solid rgba(255,255,255,0.3);
}

/* ========= 核心新增：悬浮 Widget 展示区 ========= */
.feature-showcase {
  position: relative;
  height: 240px;
  width: 100%;
  margin: auto 0;
  pointer-events: none; /* 让鼠标穿透，不影响背景 */
}

.glass-widget {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 20px;
  box-shadow:
      0 20px 40px rgba(0,0,0,0.2),
      inset 0 0 0 1px rgba(255,255,255,0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Widget 1: Analytics (Investment) */
.widget-analytics {
  top: 0;
  right: 10%;
  width: 220px;
  height: 120px;
  animation: float-card 8s infinite ease-in-out;
  z-index: 3;
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
.widget-value { font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
.widget-trend { font-size: 11px; color: #34d399; font-weight: 500; margin-top: 2px; }

/* Widget 2: Status (Sync Engine) */
.widget-status {
  top: 80px;
  left: 0;
  width: 200px; /* 稍微加宽以容纳文字 */
  height: 100px;
  animation: float-card 9s infinite ease-in-out reverse;
  animation-delay: -2s;
  z-index: 2;
  background: rgba(40, 40, 40, 0.4); /* 深色一点 */
}
.widget-row { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
.status-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 8px #22c55e; }
.pulsing { animation: pulse 2s infinite; }
.status-text { font-size: 13px; font-weight: 500; }
.status-graph { display: flex; align-items: flex-end; gap: 6px; height: 30px; }
.graph-bar { width: 6px; background: rgba(255,255,255,0.2); border-radius: 4px; transition: height 0.3s; }
.graph-bar.active { background: #22c55e; }

/* Widget 3: Life OS (Was User Team) */
.widget-life {
  bottom: 10px;
  right: 20%;
  width: 180px;
  padding: 16px;
  animation: float-card 10s infinite ease-in-out;
  animation-delay: -5s;
  z-index: 1;
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

/* Slogan 区域 */
.slogan-area {
  margin-bottom: 60px;
  position: relative;
  z-index: 4; /* 确保文字在 widget 之上 */
}

.slogan-title {
  font-family: "SF Pro Display", -apple-system, sans-serif;
  font-size: 82px;
  font-weight: 700;
  line-height: 0.95;
  margin: 0;
  letter-spacing: -3px;
  color: #fff;
  /* 增加一点文字阴影提升可读性 */
  text-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.text-gradient {
  background: linear-gradient(to right, #fff 20%, #a5b4fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.slogan-desc {
  font-size: 22px;
  margin-top: 32px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.4;
  font-weight: 400;
  max-width: 480px; /* 稍微加宽以容纳更多文字 */
  text-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

/* 底部版权 */
.visual-footer {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.footer-line {
  width: 40px;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

/* ================= 右侧表单区 ================= */
.form-side {
  flex: 1;
  background: #fff;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: background 0.3s ease;
}
:global(.dark) .form-side { background: #000; }

.top-actions {
  position: absolute;
  top: 30px;
  right: 30px;
  display: flex;
  gap: 16px;
  z-index: 10;
}

.icon-btn {
  font-size: 18px;
  color: #1d1d1f;
}
:global(.dark) .icon-btn { color: #f5f5f7; }

.form-container {
  width: 100%;
  max-width: 440px;
  margin: auto;
  padding: 0 40px;
}

.form-header {
  margin-bottom: 40px;
}
.welcome-text {
  font-size: 32px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 12px;
  letter-spacing: -0.5px;
}
:global(.dark) .welcome-text { color: #fff; }
.subtitle-text {
  color: #86868b;
  font-size: 16px;
}

/* 表单组件覆写 */
.apple-input :deep(.ant-input),
.apple-input :deep(.ant-input-password) {
  background: transparent !important;
}

.apple-input :deep(.ant-input-prefix) {
  margin-right: 12px;
  color: #86868b;
}

:deep(.ant-input-affix-wrapper) {
  background-color: #f5f5f7;
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: none;
  transition: all 0.3s;
}
:global(.dark) :deep(.ant-input-affix-wrapper) {
  background-color: #1c1c1e;
}

:deep(.ant-input-affix-wrapper:hover) {
  background-color: #e8e8ed;
}
:global(.dark) :deep(.ant-input-affix-wrapper:hover) {
  background-color: #2c2c2e;
}

:deep(.ant-input-affix-wrapper-focused) {
  background-color: #fff;
  border-color: #0071e3;
  box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
}
:global(.dark) :deep(.ant-input-affix-wrapper-focused) {
  background-color: #1c1c1e;
}

.form-actions {
  display: flex;
  justify-content: flex-end; /* 修改为右对齐，因为只有“忘记密码”了 */
  align-items: center;
  margin-bottom: 32px;
}

.apple-btn {
  height: 52px;
  border-radius: 14px;
  font-size: 17px;
  font-weight: 600;
  box-shadow: none;
}

.primary-btn {
  background: #0071e3; /* Classic Apple Blue */
}
.primary-btn:hover {
  background: #0077ED;
}

.divider {
  display: flex;
  align-items: center;
  margin: 32px 0;
  color: #86868b;
  font-size: 13px;
}
.divider::before, .divider::after {
  content: ''; flex: 1; height: 1px; background: #e5e5ea;
}
:global(.dark) .divider::before, :global(.dark) .divider::after { background: #38383a; }
.divider span { padding: 0 16px; }

.social-login {
  display: flex;
  gap: 16px;
}
.social-btn {
  background: #000;
  color: #fff;
  border: 1px solid transparent;
  transition: all 0.2s;
}
:global(.dark) .social-btn {
  background: #fff;
  color: #000;
}
.social-btn:hover {
  opacity: 0.85;
  transform: scale(1.01);
}

/* 响应式调整 */
@media (max-width: 900px) {
  .split-container {
    flex-direction: column;
  }
  .visual-side {
    flex: 0 0 240px;
    padding: 40px;
    overflow: hidden;
  }
  .feature-showcase {
    display: none; /* 移动端隐藏悬浮组件 */
  }
  .slogan-title { font-size: 40px; }
  .slogan-desc { display: none; }
  .visual-footer { display: none; }
  .form-side {
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    margin-top: -24px;
    z-index: 10;
  }
}
</style>