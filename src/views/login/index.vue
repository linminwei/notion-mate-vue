<template>
  <div class="split-container" :class="{ 'dark-mode': appStore.isDark }">
    <aside class="visual-side">
      <div class="mesh-background">
        <div class="mesh-orb orb-1"></div>
        <div class="mesh-orb orb-2"></div>
        <div class="mesh-orb orb-3"></div>
      </div>
      <div class="noise-overlay"></div>

      <div class="glass-foreground">
        <div class="brand-area">
          <div class="brand-logo-circle">
            <database-outlined />
          </div>
          <span class="brand-name">Notion Mate</span>
          <div class="brand-badge-wrapper">
            <span class="brand-badge">AI</span>
          </div>
        </div>

        <div class="hero-content">
          <div class="slogan-area">
            <div class="title-wrapper">
              <h2 class="slogan-title slide-in-2">All In One.</h2>
              <h2 class="slogan-title text-gradient slide-in-3">Intelligence.</h2>
            </div>
            <div class="desc-card slide-in-4">
              <div class="desc-glow"></div>
              <div class="desc-content">
                <p class="main-desc">Notion 与 MySQL 的完美协奏。</p>
                <p class="main-desc">从投资理财、生产力到影音娱乐，智能托管您的每一比特数据。</p>
              </div>
            </div>
          </div>

          <div class="feature-showcase floating-group">
            <div class="bento-grid">
              <div class="glass-widget widget-sync grid-span-2">
                <div class="card-grid-bg"></div>
                <div class="sync-status-row">
                  <div class="status-indicator">
                    <div class="status-dot pulsing"></div>
                    <div class="status-ring"></div>
                  </div>
                  <div class="status-text-group">
                    <span class="status-text">双向同步</span>
                  </div>
                  <div class="latency-badge">
                    <div class="ping-signal"></div>
                    <span>24ms</span>
                  </div>
                </div>
                <div class="sync-flow-container">
                  <div class="node-wrapper">
                    <div class="node-glow blue-glow"></div>
                    <div class="impact-ring blue-impact"></div>
                    <div class="node-icon mysql">
                      <database-outlined />
                    </div>
                  </div>
                  <div class="connection-track">
                    <div class="track-base"></div>
                    <div class="track-stream"></div>
                    <div class="packet-stream stream-right">
                      <div class="packet packet-1"></div>
                      <div class="packet packet-2"></div>
                    </div>
                    <div class="packet-stream stream-left">
                      <div class="packet packet-3"></div>
                      <div class="packet packet-4"></div>
                    </div>
                    <div class="exchange-hub">
                      <div class="hub-core"></div>
                      <div class="hub-shockwave"></div>
                    </div>
                  </div>
                  <div class="node-wrapper">
                    <div class="node-glow green-glow"></div>
                    <div class="impact-ring green-impact"></div>
                    <div class="node-icon notion">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png" alt="N" class="notion-n" onerror="this.style.display='none'">
                    </div>
                  </div>
                </div>
              </div>

              <div class="glass-widget widget-music-reimagined grid-span-2">
                <div class="sonic-aura"></div>
                <div class="music-layout">
                  <div class="vinyl-wrapper">
                    <div class="vinyl-disc spinning">
                      <img class="vinyl-cover" src="/public/最伟大的作品.jpg" alt="Album Art" onerror="this.style.display='none';this.parentElement.style.background='#333'">
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
                      <div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div>
                      <div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="glass-widget widget-finance-pro grid-span-1">
                <div class="finance-bg-glow"></div>
                <div class="finance-content-pro">
                  <div class="fin-header">
                    <span class="fin-label">投资理财</span>
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

              <div class="glass-widget widget-task-minimal grid-span-1">
                <div class="min-header">
                  <span class="min-title">待办事项</span>
                  <div class="min-badge">2</div>
                </div>
                <div class="min-list">
                  <div class="min-item active">
                    <div class="min-check"></div>
                    <div class="min-content">
                      <div class="min-text">Deploy Schema</div>
                      <div class="min-time">14:00</div>
                    </div>
                  </div>
                  <div class="min-item">
                    <div class="min-check checked"><check-outlined /></div>
                    <div class="min-content">
                      <div class="min-text done">Review PR #82</div>
                      <div class="min-time">12:30</div>
                    </div>
                  </div>
                </div>
              </div>

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

        <div class="visual-footer">
          <div class="footer-line"></div>
          <p>Powered by Notion Mate Intelligent System</p>
        </div>
      </div>
    </aside>

    <main class="form-side">
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

      <div class="form-container">
        <transition name="view-slide" mode="out-in">

          <div v-if="currentView === 'login'" key="login" class="auth-view">
            <div class="header-spacer"></div>

            <div class="form-header">
              <h1 class="welcome-text">欢迎回来 👋</h1>
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
                    placeholder="用户名"
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
                <a class="forgot-link" @click="switchView('forgot')">忘记密码？</a>
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

            <div class="social-login-group">
              <a-button block class="apple-btn social-btn" @click="switchView('register')">
                <user-add-outlined /> 注册新账号
              </a-button>

              <a-button block class="apple-btn social-btn" @click="switchView('phone')">
                <mobile-outlined /> 手机号登录
              </a-button>
            </div>
          </div>

          <div v-else-if="currentView === 'register'" key="register" class="auth-view">
            <div class="back-nav-flow">
              <a-button type="text" class="back-btn" @click="switchView('login')">
                <template #icon><arrow-left-outlined /></template>
                返回登录
              </a-button>
            </div>

            <div class="form-header">
              <h1 class="welcome-text">创建账户 🚀</h1>
              <p class="subtitle-text">开启您的智能数据之旅</p>
            </div>

            <a-form :model="registerForm" :rules="registerRules" @finish="handleRegister" layout="vertical" class="apple-form">
              <a-form-item name="username">
                <a-input v-model:value="registerForm.username" size="large" placeholder="用户名" class="apple-input">
                  <template #prefix><user-outlined class="input-icon" /></template>
                </a-input>
              </a-form-item>

              <a-form-item name="email">
                <a-input v-model:value="registerForm.email" size="large" placeholder="电子邮箱" class="apple-input">
                  <template #prefix><mail-outlined class="input-icon" /></template>
                </a-input>
              </a-form-item>

              <a-form-item name="password">
                <a-input-password v-model:value="registerForm.password" size="large" placeholder="设置密码" class="apple-input">
                  <template #prefix><lock-outlined class="input-icon" /></template>
                </a-input-password>
              </a-form-item>

              <a-form-item class="submit-item">
                <a-button type="primary" html-type="submit" size="large" block :loading="loading" class="apple-btn primary-btn">
                  立即注册
                </a-button>
              </a-form-item>
            </a-form>
          </div>

          <div v-else-if="currentView === 'forgot'" key="forgot" class="auth-view">
            <div class="back-nav-flow">
              <a-button type="text" class="back-btn" @click="switchView('login')">
                <template #icon><arrow-left-outlined /></template>
                返回登录
              </a-button>
            </div>

            <div class="form-header">
              <h1 class="welcome-text">重置密码 🔒</h1>
              <p class="subtitle-text">输入邮箱以接收重置链接</p>
            </div>

            <a-form :model="forgotForm" :rules="forgotRules" @finish="handleForgot" layout="vertical" class="apple-form">
              <a-form-item name="email">
                <a-input v-model:value="forgotForm.email" size="large" placeholder="注册邮箱地址" class="apple-input">
                  <template #prefix><mail-outlined class="input-icon" /></template>
                </a-input>
              </a-form-item>

              <a-form-item class="submit-item">
                <a-button type="primary" html-type="submit" size="large" block :loading="loading" class="apple-btn primary-btn">
                  发送重置邮件
                </a-button>
              </a-form-item>
            </a-form>
          </div>

          <div v-else-if="currentView === 'phone'" key="phone" class="auth-view">
            <div class="back-nav-flow">
              <a-button type="text" class="back-btn" @click="switchView('login')">
                <template #icon><arrow-left-outlined /></template>
                返回登录
              </a-button>
            </div>

            <div class="form-header">
              <h1 class="welcome-text">手机验证 📱</h1>
              <p class="subtitle-text">快捷免密登录</p>
            </div>

            <a-form :model="phoneForm" :rules="phoneRules" @finish="handlePhoneLogin" layout="vertical" class="apple-form">
              <a-form-item name="phone">
                <a-input v-model:value="phoneForm.phone" size="large" placeholder="手机号码" class="apple-input">
                  <template #prefix><mobile-outlined class="input-icon" /></template>
                </a-input>
              </a-form-item>

              <a-form-item name="code">
                <a-input v-model:value="phoneForm.code" size="large" placeholder="验证码" class="apple-input">
                  <template #prefix><safety-outlined class="input-icon" /></template>
                  <template #suffix>
                    <a-button
                        type="link"
                        size="small"
                        :disabled="countdown > 0"
                        @click="sendVerifyCode"
                        class="verify-btn"
                    >
                      {{ countdown > 0 ? `${countdown}s 后重发` : '获取验证码' }}
                    </a-button>
                  </template>
                </a-input>
              </a-form-item>

              <a-form-item class="submit-item">
                <a-button type="primary" html-type="submit" size="large" block :loading="loading" class="apple-btn primary-btn">
                  登 录
                </a-button>
              </a-form-item>
            </a-form>
          </div>

        </transition>
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
  DatabaseOutlined,
  PlayCircleFilled,
  StarFilled,
  CheckOutlined,
  UserAddOutlined,
  MobileOutlined,
  MailOutlined,
  ArrowLeftOutlined,
  SafetyOutlined
} from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { AppleAlert } from "@/components/common/AppleAlert.ts"

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const appStore = useAppStore()
const loading = ref(false)

// 视图状态管理
const currentView = ref('login') // 'login' | 'register' | 'forgot' | 'phone'
const switchView = (view: string) => {
  currentView.value = view
}

// ------------------- 登录逻辑 -------------------
const formState = reactive({ username: 'admin', password: 'admin123' })
const rules: Record<string, Rule[]> = {
  username: [{ required: true, message: '请输入您的账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入您的密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  loading.value = true
  setTimeout(async () => {
    try {
      await userStore.login({ username: formState.username, password: formState.password })
      const redirect = route.query.redirect as string
      router.push(redirect || '/')
      AppleAlert.success("登录成功", '欢迎回来:' + userStore.userInfo.nickname)
    } catch (error: any) {
      AppleAlert.error("登录失败", error.message)
    } finally {
      loading.value = false
    }
  }, 800)
}

// ------------------- 注册逻辑 -------------------
const registerForm = reactive({ username: '', email: '', password: '' })
const registerRules: Record<string, Rule[]> = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ required: true, type: 'email', message: '请输入有效的邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请设置密码', trigger: 'blur' }, { min: 6, message: '密码至少6位', trigger: 'blur' }]
}
const handleRegister = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    AppleAlert.success("注册成功", "请登录您的新账号")
    switchView('login')
  }, 1000)
}

// ------------------- 忘记密码逻辑 -------------------
const forgotForm = reactive({ email: '' })
const forgotRules: Record<string, Rule[]> = {
  email: [{ required: true, type: 'email', message: '请输入注册邮箱', trigger: 'blur' }]
}
const handleForgot = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    AppleAlert.success("邮件已发送", "请检查您的邮箱以重置密码")
    switchView('login')
  }, 1000)
}

// ------------------- 手机号登录逻辑 -------------------
const phoneForm = reactive({ phone: '', code: '' })
const countdown = ref(0)
const phoneRules: Record<string, Rule[]> = {
  phone: [{ required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

const sendVerifyCode = () => {
  if (!/^1[3-9]\d{9}$/.test(phoneForm.phone)) {
    AppleAlert.error("错误", "请输入正确的手机号")
    return
  }
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) clearInterval(timer)
  }, 1000)
  AppleAlert.success("验证码已发送", "测试验证码: 123456")
}

const handlePhoneLogin = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    AppleAlert.success("登录成功", "欢迎回来")
    router.push('/')
  }, 800)
}

const toggleTheme = () => {
  appStore.toggleTheme()
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
/* 容器布局 */
.split-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif;
  background-color: #fff;
  transition: background-color 0.3s ease;
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
  z-index: 20;
  box-shadow: 20px 0 70px -10px rgba(0, 0, 0, 0.65), inset -1px 0 0 rgba(255, 255, 255, 0.15);
}

.mesh-background { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; filter: blur(80px); opacity: 0.8; will-change: transform; }
.noise-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; opacity: 0.05; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); pointer-events: none; }
.mesh-orb { position: absolute; border-radius: 50%; animation: float-mesh 20s infinite ease-in-out; }
.orb-1 { top: -10%; left: -10%; width: 70%; height: 70%; background: radial-gradient(circle, #4338ca 0%, rgba(67, 56, 202, 0) 70%); }
.orb-2 { bottom: -20%; right: -10%; width: 80%; height: 80%; background: radial-gradient(circle, #db2777 0%, rgba(219, 39, 119, 0) 70%); animation-delay: -5s; }
.orb-3 { top: 40%; left: 30%; width: 60%; height: 60%; background: radial-gradient(circle, #0891b2 0%, rgba(8, 145, 178, 0) 70%); animation-delay: -10s; opacity: 0.6; }

@keyframes float-mesh {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}

.glass-foreground { position: relative; z-index: 2; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: var(--visual-side-padding); background: rgba(0, 0, 0, 0.1); backdrop-filter: blur(20px) saturate(120%); box-shadow: inset 0 0 200px rgba(0,0,0,0.6); }

.brand-area { display: flex; align-items: center; gap: 14px; position: relative; z-index: 10; flex-shrink: 0; height: 44px; }
.brand-logo-circle { width: 44px; height: 44px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.25); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2); backdrop-filter: blur(5px); }
.brand-name { font-size: 22px; font-weight: 600; letter-spacing: -0.01em; line-height: 1; padding-bottom: 2px; white-space: nowrap; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
.brand-badge-wrapper { display: flex; align-items: center; height: 100%; }
.brand-badge { display: inline-flex; align-items: center; justify-content: center; height: 22px; padding: 0 8px; border-radius: 6px; font-size: 11px; font-weight: 800; letter-spacing: 0.5px; color: #FCD34D; background: linear-gradient(145deg, #292524 0%, #000000 100%); border: 1px solid rgba(251, 191, 36, 0.3); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15); position: relative; overflow: hidden; margin-top: -1px; }
.brand-badge::after { content: ''; position: absolute; top: 0; left: -150%; width: 150%; height: 100%; background: linear-gradient(110deg, transparent 30%, rgba(251, 191, 36, 0.6) 45%, rgba(253, 224, 71, 0.8) 50%, rgba(251, 191, 36, 0.6) 55%, transparent 70%); transform: skewX(-20deg); animation: gilded-shine 4s infinite cubic-bezier(0.4, 0, 0.2, 1); pointer-events: none; }
@keyframes gilded-shine { 0% { left: -150%; opacity: 0; } 10% { opacity: 1; } 30% { left: 150%; opacity: 1; } 100% { left: 150%; opacity: 0; } }

.hero-content { display: flex; align-items: center; justify-content: space-between; width: 100%; flex: 1; gap: clamp(20px, 4vw, 80px); position: relative; z-index: 5; min-height: 0; }
.feature-showcase { position: relative; width: auto; flex-shrink: 0; z-index: 10; }
.floating-group { animation: float-group 10s ease-in-out infinite; transform-origin: center center; }
@keyframes float-group { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
.bento-grid { display: grid; grid-template-columns: repeat(2, 150px); grid-template-rows: repeat(4, auto); gap: 16px; }
.grid-span-1 { grid-column: span 1; } .grid-span-2 { grid-column: span 2; }

/* Widgets */
.glass-widget { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(40px) saturate(160%); border-top: 1px solid rgba(255, 255, 255, 0.15); border-left: 1px solid rgba(255, 255, 255, 0.1); border-right: 1px solid rgba(255, 255, 255, 0.05); border-bottom: 1px solid rgba(255, 255, 255, 0.02); border-radius: 20px; overflow: hidden; position: relative; transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); box-shadow: 0 15px 35px -5px rgba(0,0,0,0.4), 0 5px 15px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.03); }
.glass-widget:hover { transform: translateY(-6px) scale(1.02); background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.25); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5), 0 10px 20px -5px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.08); z-index: 10; }

/* Widget Inner Contents */
.widget-sync { height: 90px; padding: 12px 16px; display: flex; flex-direction: column; justify-content: space-between; background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(56, 189, 248, 0.08) 100%); }
.card-grid-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 16px 16px; z-index: 0; pointer-events: none; mask-image: radial-gradient(circle at center, black 40%, transparent 100%); }
.sync-status-row { display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 2; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px; }
.status-indicator { position: relative; width: 10px; height: 10px; display: flex; align-items: center; justify-content: center; }
.status-dot { width: 6px; height: 6px; background: #4ade80; border-radius: 50%; box-shadow: 0 0 8px #4ade80; z-index: 2; }
.pulsing { animation: pulse-light 2s infinite ease-in-out; }
.status-ring { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; height: 100%; border-radius: 50%; border: 1px solid #4ade80; opacity: 0; animation: radar-ping 2.5s infinite; }
@keyframes pulse-light { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.9); } }
@keyframes radar-ping { 0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.6; } 100% { transform: translate(-50%, -50%) scale(2.8); opacity: 0; } }
.status-text-group { display: flex; flex-direction: column; margin-left: 8px; margin-right: auto; }
.status-text { font-size: 9px; font-weight: 800; color: #4ade80; letter-spacing: 0.8px; text-shadow: 0 0 12px rgba(74, 222, 128, 0.5); }
.latency-badge { font-family: 'SF Mono', monospace; font-size: 9px; color: rgba(255,255,255,0.6); background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 4px; }
.ping-signal { width: 4px; height: 4px; background: #38bdf8; border-radius: 50%; animation: blink-sharp 1s infinite steps(2); }
@keyframes blink-sharp { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
.sync-flow-container { display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 2; flex: 1; padding-top: 4px; }
.node-wrapper { position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; }
.node-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; height: 100%; border-radius: 50%; filter: blur(8px); opacity: 0.4; animation: breathe-glow 3s infinite ease-in-out; }
.blue-glow { background: #38bdf8; } .green-glow { background: #4ade80; animation-delay: 1.5s; }
@keyframes breathe-glow { 0%, 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.2; } 50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0.6; } }
.impact-ring { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; height: 100%; border-radius: 50%; border: 1px solid currentColor; opacity: 0; }
.blue-impact { color: #38bdf8; animation: impact-ripple 2s infinite cubic-bezier(0, 0, 0.2, 1); animation-delay: 0.9s; }
.green-impact { color: #4ade80; animation: impact-ripple 2s infinite cubic-bezier(0, 0, 0.2, 1); animation-delay: 1.9s; }
@keyframes impact-ripple { 0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; } 20% { opacity: 0.8; } 50% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; } 100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; } }
.node-icon { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: rgba(20, 20, 20, 0.6); backdrop-filter: blur(4px); border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); font-size: 14px; color: #fff; z-index: 2; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
.node-icon.mysql { color: #38bdf8; }
.connection-track { flex: 1; height: 2px; position: relative; margin: 0 12px; display: flex; align-items: center; justify-content: center; }
.track-base { width: 100%; height: 1px; background: rgba(255,255,255,0.15); position: absolute; }
.track-stream { width: 100%; height: 1px; position: absolute; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); background-size: 50% 100%; animation: stream-flow 1.5s infinite linear; }
@keyframes stream-flow { from { background-position: -100% 0; } to { background-position: 200% 0; } }
.packet-stream { position: absolute; width: 100%; height: 100%; pointer-events: none; }
.packet { position: absolute; top: 50%; transform: translateY(-50%); height: 2px; border-radius: 2px; filter: drop-shadow(0 0 4px currentColor); opacity: 0; }
.stream-right .packet { background: linear-gradient(90deg, transparent, #38bdf8); color: #38bdf8; }
.packet-1 { width: 24px; animation: flow-right 2s infinite cubic-bezier(0.4, 0, 0.2, 1); }
.packet-2 { width: 12px; animation: flow-right 2s infinite cubic-bezier(0.4, 0, 0.2, 1); animation-delay: 0.3s; }
.stream-left .packet { background: linear-gradient(270deg, transparent, #4ade80); color: #4ade80; }
.packet-3 { width: 24px; right: 0; animation: flow-left 2s infinite cubic-bezier(0.4, 0, 0.2, 1); animation-delay: 1s; }
.packet-4 { width: 12px; right: 0; animation: flow-left 2s infinite cubic-bezier(0.4, 0, 0.2, 1); animation-delay: 1.3s; }
@keyframes flow-right { 0% { left: 0; width: 8px; opacity: 0; } 20% { opacity: 1; width: 24px; } 80% { left: 80%; opacity: 1; width: 24px; } 100% { left: 100%; width: 4px; opacity: 0; } }
@keyframes flow-left { 0% { right: 0; width: 8px; opacity: 0; } 20% { opacity: 1; width: 24px; } 80% { right: 80%; opacity: 1; width: 24px; } 100% { right: 100%; width: 4px; opacity: 0; } }
.exchange-hub { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 6px; height: 6px; display: flex; align-items: center; justify-content: center; }
.hub-core { width: 100%; height: 100%; background: #fff; border-radius: 50%; box-shadow: 0 0 10px rgba(255,255,255,0.9); animation: hub-pulse 1s infinite alternate; z-index: 2; }
.hub-shockwave { position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 1px solid rgba(255,255,255,0.5); animation: shockwave 1.5s infinite linear; }
@keyframes hub-pulse { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.4); opacity: 1; } }
@keyframes shockwave { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(4); opacity: 0; } }
.widget-music-reimagined { height: 100px; position: relative; overflow: hidden; padding: 0; border: 1px solid rgba(255,255,255,0.12); background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.3) 100%); }
.sonic-aura { position: absolute; width: 300px; height: 300px; background: radial-gradient(circle, rgba(236,72,153,0.15), transparent 70%); top: -100px; left: -100px; animation: aura-breathe 8s infinite alternate ease-in-out; pointer-events: none; }
@keyframes aura-breathe { 0% { opacity: 0.3; transform: scale(0.8); } 100% { opacity: 0.6; transform: scale(1.1); } }
.music-layout { display: flex; align-items: center; height: 100%; width: 100%; padding: 0 16px; gap: 16px; }
.vinyl-wrapper { flex-shrink: 0; width: 72px; height: 72px; display: flex; align-items: center; justify-content: center; position: relative; }
.vinyl-disc { width: 70px; height: 70px; border-radius: 50%; background: #111; background-image: repeating-radial-gradient(#111 0, #111 2px, #222 3px, #111 4px); position: relative; box-shadow: 0 4px 15px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; }
.spinning { animation: vinyl-spin 6s linear infinite; }
@keyframes vinyl-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.vinyl-cover { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; z-index: 2; border: 2px solid #000; }
.vinyl-center-hole { position: absolute; width: 6px; height: 6px; background: #000; border-radius: 50%; z-index: 3; top: 50%; left: 50%; transform: translate(-50%, -50%); }
.vinyl-reflection { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 50%; background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(255,255,255,0.02) 100%); z-index: 4; pointer-events: none; }
.player-interface { flex: 1; display: flex; flex-direction: row; align-items: center; justify-content: space-between; min-width: 0; position: relative; }
.song-info { flex: 1; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; text-align: left; position: relative; z-index: 2; padding: 0 4px; }
.song-title { font-size: 14px; font-weight: 700; color: #fff; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: 0.3px; max-width: 100%; }
.artist-name { font-size: 10px; color: rgba(255,255,255,0.6); margin: 6px 0 0; text-transform: uppercase; letter-spacing: 0.5px; max-width: 100%; }
.sound-wave-container { display: flex; gap: 3px; align-items: center; opacity: 0.8; height: 20px; flex-shrink: 0; }
.wave-bar { width: 3px; background: linear-gradient(to top, #ec4899, #8b5cf6); border-radius: 2px; animation: wave-dance 1.2s infinite ease-in-out; }
.wave-bar:nth-child(1) { height: 8px; animation-delay: 0s; } .wave-bar:nth-child(2) { height: 16px; animation-delay: 0.2s; }
.wave-bar:nth-child(3) { height: 12px; animation-delay: 0.1s; } .wave-bar:nth-child(4) { height: 20px; animation-delay: 0.3s; }
.wave-bar:nth-child(5) { height: 14px; animation-delay: 0.15s; } .wave-bar:nth-child(6) { height: 10px; animation-delay: 0.25s; }
.wave-bar:nth-child(7) { height: 18px; animation-delay: 0.05s; } .wave-bar:nth-child(8) { height: 6px; animation-delay: 0.35s; }
@keyframes wave-dance { 0%, 100% { transform: scaleY(0.5); opacity: 0.5; } 50% { transform: scaleY(1.2); opacity: 1; } }
.widget-finance-pro { height: 120px; padding: 16px; display: flex; flex-direction: column; position: relative; overflow: hidden; border: 1px solid rgba(16, 185, 129, 0.25); background: radial-gradient(circle at top right, rgba(16, 185, 129, 0.15), transparent 70%); }
.finance-bg-glow { position: absolute; bottom: -20px; left: 0; width: 100%; height: 50%; background: linear-gradient(to top, rgba(16, 185, 129, 0.1), transparent); filter: blur(20px); z-index: 0; }
.finance-content-pro { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; justify-content: space-between; }
.fin-header { display: flex; justify-content: space-between; align-items: center; }
.fin-label { font-size: 9px; font-weight: 800; color: rgba(255,255,255,0.7); letter-spacing: 1px; }
.fin-badge { font-size: 9px; font-weight: 700; color: #10b981; background: rgba(16, 185, 129, 0.15); padding: 2px 6px; border-radius: 6px; box-shadow: 0 0 10px rgba(16, 185, 129, 0.25); }
.fin-main-number { font-size: 26px; font-weight: 800; color: #fff; letter-spacing: -0.5px; text-shadow: 0 2px 10px rgba(0,0,0,0.3); }
.fin-main-number .currency { font-size: 16px; color: #10b981; margin-right: 2px; }
.fin-chart-abstract { display: flex; align-items: flex-end; gap: 4px; height: 24px; opacity: 0.8; }
.bar-col { flex: 1; background: rgba(255,255,255,0.1); border-radius: 2px; transition: height 0.3s; }
.bar-col.active { background: #10b981; box-shadow: 0 0 12px #10b981; }
.widget-task-minimal { height: 120px; padding: 16px; display: flex; flex-direction: column; background: rgba(255, 255, 255, 0.03); }
.min-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.min-title { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 1px; }
.min-badge { background: rgba(255,255,255,0.15); color: #fff; font-size: 10px; font-weight: 600; padding: 1px 6px; border-radius: 4px; }
.min-list { display: flex; flex-direction: column; gap: 6px; flex: 1; justify-content: center; }
.min-item { display: flex; align-items: center; gap: 10px; padding: 6px 8px; margin: 0 -8px; border-radius: 8px; transition: all 0.2s; cursor: default; }
.min-item:hover { background: rgba(255,255,255,0.08); }
.min-item.active { background: rgba(255,255,255,0.06); }
.min-check { width: 14px; height: 14px; border-radius: 4px; border: 1.5px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; font-size: 8px; color: transparent; transition: all 0.2s; flex-shrink: 0; }
.min-item.active .min-check { border-color: #38bdf8; box-shadow: 0 0 8px rgba(56, 189, 248, 0.3); }
.min-check.checked { background: rgba(255,255,255,0.25); border-color: transparent; color: #fff; }
.min-content { flex: 1; display: flex; justify-content: space-between; align-items: center; min-width: 0; }
.min-text { font-size: 12px; color: rgba(255,255,255,0.95); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.min-text.done { color: rgba(255,255,255,0.4); text-decoration: line-through; }
.min-time { font-size: 10px; color: rgba(255,255,255,0.4); font-family: 'SF Mono', monospace; margin-left: 8px; }
.widget-movie-pro { height: 100px; position: relative; overflow: hidden; padding: 0; border: 1px solid rgba(255,255,255,0.15); }
.cinema-backdrop { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('https://th.bing.com/th/id/R.b12ba99367fe3c1c5e91156d8fbd751d?rik=9usLu3OH20LPsw&riu=http%3a%2f%2fn.sinaimg.cn%2fsinakd20240707s%2f491%2fw600h691%2f20240707%2f9646-80ad3439466935220f214033eea06480.jpg&ehk=0LwGQLF0QNXsoRaYjrnaMZaaSVkHYyuTuOKspnOLAAE%3d&risl=&pid=ImgRaw&r=0'); background-size: cover; background-position: center; transition: transform 5s ease-out; filter: blur(2px) brightness(0.7); }
.widget-movie-pro:hover .cinema-backdrop { transform: scale(1.1); filter: blur(0) brightness(0.8); }
.cinema-noise { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.1'/%3E%3C/svg%3E"); mix-blend-mode: overlay; pointer-events: none; }
.cinema-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to right, #000 0%, rgba(0,0,0,0.6) 40%, transparent 100%); z-index: 1; }
.cinema-content { position: relative; z-index: 2; height: 100%; width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; }
.cinema-meta { display: flex; flex-direction: column; gap: 4px; align-items: flex-start; }
.cinema-tag { font-size: 8px; font-weight: 800; color: #000; background: #fff; padding: 2px 4px; border-radius: 2px; }
.cinema-rating { display: flex; align-items: center; gap: 4px; color: #fbbf24; font-size: 10px; font-weight: 700; margin-top: 2px; }
.cinema-info { flex: 1; margin-left: 16px; display: flex; flex-direction: column; justify-content: center; }
.cinema-title { font-family: 'SF Pro Display', sans-serif; font-size: 20px; font-weight: 900; color: #fff; margin: 0; letter-spacing: 1px; text-shadow: 0 4px 10px rgba(0,0,0,0.5); text-transform: uppercase; }
.cinema-sub { font-size: 10px; color: rgba(255,255,255,0.7); margin-top: 2px; }
.cinema-play-btn { width: 36px; height: 36px; border-radius: 50%; border: none; background: rgba(255,255,255,0.15); backdrop-filter: blur(4px); color: #fff; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; border: 1px solid rgba(255,255,255,0.25); }
.cinema-play-btn:hover { background: #fff; color: #000; transform: scale(1.1); }
.slogan-area { flex: 1; display: flex; flex-direction: column; justify-content: center; position: relative; padding-left: 4px; min-width: 0; }
.slogan-title { font-family: "SF Pro Display", -apple-system, sans-serif; font-size: clamp(28px, 4vw, 85px); font-weight: 800; line-height: 1.05; margin-bottom: 0; letter-spacing: -0.03em; color: #fff; text-shadow: 0 10px 30px rgba(0,0,0,0.4); opacity: 0; transform: translateY(30px); white-space: nowrap; max-width: 100%; }
.text-gradient { background-image: linear-gradient(110deg, #ffffff 0%, #ffffff 30%, #c4b5fd 45%, #a855f7 55%, #ec4899 65%, #fbcfe8 80%, #ffffff 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block; line-height: 1.1; padding-bottom: 0.2em; margin-bottom: -0.1em; filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.4)); animation: gradient-flow 5s linear infinite; }
@keyframes gradient-flow { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
.desc-card { margin-top: 48px; position: relative; display: flex; flex-direction: column; opacity: 0; transform: translateY(20px); max-width: 500px; }
.desc-content { position: relative; z-index: 2; padding: 0; }
.main-desc { font-size: clamp(14px, 1.2vw, 18px); line-height: 1.5; color: rgba(255, 255, 255, 0.75); font-weight: 400; margin-bottom: 12px; }
.slide-in-2 { animation: slide-up-fade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; animation-delay: 0.1s; }
.slide-in-3 { animation: slide-up-fade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; animation-delay: 0.2s; }
.slide-in-4 { animation: slide-up-fade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; animation-delay: 0.4s; }
@keyframes slide-up-fade { to { opacity: 1; transform: translateY(0); } }
.visual-footer { font-size: 12px; color: rgba(255, 255, 255, 0.4); font-weight: 500; display: flex; flex-direction: column; gap: 16px; position: relative; z-index: 10; flex-shrink: 0; }
.footer-line { width: 40px; height: 2px; background: rgba(255, 255, 255, 0.2); border-radius: 2px; }

/* ================= 右侧表单区域样式 (Form Side) ================= */
.form-side {
  flex: 1;
  background: #fff;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: background 0.3s ease;
  min-width: 320px;
  z-index: 1;

  /* 布局核心：使用顶部内边距而非垂直居中，防止高度跳动 */
  justify-content: flex-start;
  padding-top: calc(20vh + 40px);
}

.form-container {
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
}

/* 优化的流式布局返回导航 (Flow Layout Back Nav) */
.back-nav-flow {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 强制左对齐 */
  margin-bottom: 24px;         /* 按钮与下方标题的间距 */
  margin-top: -10px;           /* 微调顶部空间，避免离顶部太远 */
}

.back-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 34px;

  /* 关键修改：左侧内边距减小，让箭头更靠近对齐线 */
  /* 右侧保留较多留白，维持视觉平衡 */
  padding: 0 12px 0 6px;

  border-radius: 17px; /* 保持圆润 */
  color: #86868b;      /* 次级灰色 */
  font-size: 14px;
  font-weight: 500;

  background: transparent;
  border: none;
  box-shadow: none;

  /* 交互过渡 */
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);

  /* 视觉修正：让鼠标 hover 时的背景左边缘与标题完全对齐 */
  margin-left: -6px;
}

.back-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #1d1d1f;
}

.back-btn :deep(.anticon) {
  margin-right: 4px;
  font-size: 14px;
  transition: transform 0.2s ease;
}

.back-btn:hover :deep(.anticon) {
  transform: translateX(-3px);
}

/* Dark Mode 适配 */
.dark-mode.split-container { background-color: #000; }
.dark-mode .form-side { background: #000 !important; color: #fff; }
.dark-mode .icon-btn { color: #f5f5f7; }
.dark-mode .welcome-text { color: #fff; }
.dark-mode :deep(.ant-input-affix-wrapper) { background-color: #1c1c1e; border-color: #2c2c2e; }
.dark-mode :deep(.ant-input-affix-wrapper:hover) { background-color: #2c2c2e; }
.dark-mode :deep(.ant-input-affix-wrapper-focused) { background-color: #1c1c1e; box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.25) !important; border-color: #0071e3 !important; }
.dark-mode :deep(input.ant-input), .dark-mode :deep(input.ant-input-password) { color: #fff !important; }
.dark-mode .forgot-link { color: #0071e3 !important; }
.dark-mode .divider::before, .dark-mode .divider::after { background: #38383a; }
.dark-mode .social-btn { background: #fff; color: #000; }
.dark-mode :deep(.ant-input-prefix) { color: rgba(255, 255, 255, 0.45); }
.dark-mode .verify-btn { color: #0a84ff; }
.dark-mode .back-btn { color: #98989d; }
.dark-mode .back-btn:hover { background: rgba(255, 255, 255, 0.12); color: #fff; }

.top-actions { position: absolute; top: 30px; right: 30px; display: flex; gap: 16px; z-index: 10; }
.icon-btn { font-size: 18px; color: #1d1d1f; }
.form-header { margin-bottom: 40px; }
.welcome-text { font-size: 32px; font-weight: 700; color: #1d1d1f; margin: 0 0 12px; letter-spacing: -0.5px; }
.subtitle-text { color: #86868b; font-size: 16px; }

.apple-input :deep(.ant-input), .apple-input :deep(.ant-input-password) { background: transparent !important; }
.apple-input :deep(.ant-input-prefix) { margin-right: 12px; color: #86868b; }
.apple-input :deep(.ant-input-suffix) { margin-left: 12px; }

:deep(.ant-input-affix-wrapper) { background-color: #f5f5f7; border: 1px solid transparent; border-radius: 12px; padding: 12px 16px; box-shadow: none; transition: all 0.3s; }
:deep(.ant-input-affix-wrapper:hover) { background-color: #e8e8ed; }
:deep(.ant-input-affix-wrapper-focused) { background-color: #fff; border-color: #0071e3; box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.15); }

.form-actions { display: flex; justify-content: flex-end; align-items: center; margin-bottom: 32px; }
.forgot-link { color: #0071e3; cursor: pointer; font-size: 14px; font-weight: 500; }

.apple-btn { height: 52px; border-radius: 14px; font-size: 17px; font-weight: 600; box-shadow: none; transition: transform 0.1s ease, background-color 0.2s; }
.primary-btn { background: #0071e3; }
.primary-btn:hover { background: #0077ED; transform: scale(1.01); }
.primary-btn:active { transform: scale(0.98); }
.divider { display: flex; align-items: center; margin: 32px 0; color: #86868b; font-size: 13px; }
.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: #e5e5ea; }
.divider span { padding: 0 16px; }
.social-login-group { display: flex; gap: 16px; }

.social-btn { background: #000; color: #fff; border: 1px solid transparent; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
.social-btn:hover { opacity: 0.85; transform: scale(1.01); }
.social-btn .anticon { margin-right: 8px; font-size: 18px; }

.verify-btn { font-weight: 600; padding: 0; height: auto; }

/* 视图切换动画 */
.view-slide-enter-active, .view-slide-leave-active { transition: all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1); }
.view-slide-enter-from { opacity: 0; transform: translateX(20px); }
.view-slide-leave-to { opacity: 0; transform: translateX(-20px); }

/* Response Adjustments */
@media (max-width: 1440px) { .slogan-title { font-size: 3.5vw; } .feature-showcase { transform: scale(0.9); transform-origin: center right; } .desc-card { margin-top: 32px; } }
@media (max-width: 1280px) { .hero-content { gap: 20px; } .feature-showcase { transform: scale(0.8); } .slogan-title { font-size: 3vw; } }
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
  .form-side { flex: 1; border-top-left-radius: 24px; border-top-right-radius: 24px; margin-top: -24px; z-index: 10; padding-bottom: 40px; padding-top: 60px; /* 移动端调整 */ justify-content: flex-start; }
  .form-container { padding-top: 0; }
  .social-login-group { flex-direction: column; }
}
@media (max-height: 800px) {
  .feature-showcase { gap: 10px; transform: scale(0.85); transform-origin: center right; }
  .slogan-title { font-size: clamp(32px, 5vw, 60px); }
  .desc-card { margin-top: 20px; }
  .visual-side { padding: 20px 30px; }
  .brand-area { height: 36px; margin-bottom: 10px;}
  .brand-logo-circle { width: 36px; height: 36px; font-size: 20px; }
  .brand-name { font-size: 18px; }
  .form-side { padding-top: 100px; } /* 小屏幕调整 */
}
.tech-svg, .notion-n, .node-housing > svg, .node-housing > img { width: 24px !important; height: 24px !important; min-width: 24px; min-height: 24px; object-fit: contain; display: block; }
.tech-svg { color: #38bdf8; }
.notion-n { fill: #fff; }

/* Error Validation */
@keyframes shake-horizontal { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-4px); } 40%, 80% { transform: translateX(4px); } }
:deep(.ant-form-item-has-error .ant-input-affix-wrapper) { animation: shake-horizontal 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both; background-color: rgba(255, 59, 48, 0.04) !important; border-color: #ff3b30 !important; box-shadow: 0 0 0 4px rgba(255, 59, 48, 0.1) !important; }
:deep(.ant-form-item-has-error .ant-input-prefix) { color: #ff3b30 !important; transition: color 0.3s; }
:deep(.ant-form-item-explain-error) { color: #ff3b30; font-size: 13px; font-weight: 500; margin-top: 6px; margin-bottom: 12px; margin-left: 4px; display: flex; align-items: center; gap: 6px; opacity: 0; animation: slide-down-error 0.3s ease-out forwards; }
@keyframes slide-down-error { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
:deep(.ant-form-item-explain-error)::before { content: '!'; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: #ff3b30; color: #fff; border-radius: 50%; font-size: 10px; font-weight: bold; flex-shrink: 0; }
.dark-mode :deep(.ant-form-item-has-error .ant-input-affix-wrapper) { background-color: rgba(255, 69, 58, 0.15) !important; border-color: #ff453a !important; box-shadow: 0 0 0 4px rgba(255, 69, 58, 0.15) !important; }
.dark-mode :deep(.ant-form-item-has-error .ant-input-prefix) { color: #ff453a !important; }
.dark-mode :deep(.ant-form-item-explain-error) { color: #ff453a; }
.dark-mode :deep(.ant-form-item-explain-error)::before { background: #ff453a; color: #000; }
</style>