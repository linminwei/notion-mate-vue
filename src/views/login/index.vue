<template>
  <div class="app-root">

    <!-- ================= 全局背景引擎 (Persistent Background) ================= -->
    <div class="ray-bg-engine">
      <div class="void-bg"></div>

      <!-- 动态线条层 (强化版：倾斜光栅) -->
      <div class="grid-lines-wrapper">
        <div class="grid-vertical"></div>
        <div class="grid-flow"></div>
      </div>

      <div class="ray-beams">
        <div class="beam beam-1"></div>
        <div class="beam beam-2"></div>
        <div class="beam beam-3"></div>
        <div class="beam beam-4"></div>
      </div>
      <div class="grid-overlay"></div>
      <div class="vignette"></div>
    </div>

    <!-- ================= 视图 1: Landing Page (着陆页) ================= -->
    <transition name="fade-slow" mode="out-in">
      <div v-if="viewMode === 'landing'" key="landing" class="landing-view">

        <!-- 顶部导航栏 -->
        <div class="nav-container slide-down">
          <nav class="ray-nav">
            <div class="nav-left">
              <div class="ray-logo">
                <svg viewBox="0 0 24 24" fill="none" class="logo-svg">
                  <path d="M4 22L20 2L12 22H4Z" fill="#FF6363"/>
                </svg>
                <span class="logo-text">Raycast</span>
              </div>
            </div>

            <div class="nav-center">
              <a href="#" class="nav-link">Store</a>
              <a href="#" class="nav-link">Pro</a>
              <a href="#" class="nav-link">AI</a>
              <a href="#" class="nav-link">Teams</a>
              <a href="#" class="nav-link">Developers</a>
              <a href="#" class="nav-link">Changelog</a>
              <a class="link-pricing">Pricing</a>
            </div>

            <div class="nav-right">
              <button class="login-btn-text" @click="switchToAuth">Log in</button>
              <button class="download-btn-white" @click="switchToDownload">
                Download
              </button>
            </div>
          </nav>
        </div>

        <!-- Hero 区域 -->
        <header class="hero-section">
          <div class="hero-inner">
            <h1 class="hero-title">
              <span class="line reveal-1">Your shortcut to</span>
              <span class="line reveal-2 glow-text">everything.</span>
            </h1>
            <p class="hero-sub reveal-3">
              Notion Mate is a collection of powerful productivity tools <br class="desktop-br">
              all within an extendable launcher. Fast, ergonomic and reliable.
            </p>
          </div>
        </header>

        <!-- 扩展展示区 (Extensions Showcase) -->
        <section class="extensions-section reveal-4">
          <div class="ext-header">
            <div class="ext-titles">
              <h2 class="ext-title">There's an extension for that.</h2>
              <p class="ext-sub">Use your favorite tools without even opening them.</p>
            </div>
            <div class="ext-tags">
              <span class="ext-tag active">Productivity</span>
              <span class="ext-tag">Engineering</span>
              <span class="ext-tag">Design</span>
              <span class="ext-tag">Writing</span>
            </div>
          </div>

          <div class="ext-grid-wrapper" ref="extGridRef" :class="{ 'mask-l': showMaskLeft, 'mask-r': showMaskRight }" @scroll="handleScroll">
            <div class="ext-cards-grid">

              <!-- Card: Linear -->
              <div class="ext-card card-linear">
                <div class="card-top">
                  <div class="card-head-left">
                    <div class="card-icon-box icon-linear"><radar-chart-outlined /></div>
                    <span class="card-name">Linear</span>
                  </div>
                  <div class="card-arrow-btn"><arrow-right-outlined /></div>
                </div>
                <p class="card-desc">Create, search and modify your issues without leaving your keyboard.</p>
                <div class="card-visual visual-linear">
                  <div class="linear-ring"></div>
                  <div class="linear-orbit"></div>
                  <div class="linear-icons">
                    <div class="l-icon i1"></div>
                    <div class="l-icon i2"></div>
                    <div class="l-icon i3"></div>
                    <div class="l-icon i4 active"><check-outlined /></div>
                  </div>
                </div>
              </div>

              <!-- Card: Google Translate -->
              <div class="ext-card card-translate">
                <div class="card-top">
                  <div class="card-head-left">
                    <div class="card-icon-box icon-blue"><translation-outlined /></div>
                    <span class="card-name">Google Translate</span>
                  </div>
                  <div class="card-arrow-btn"><arrow-right-outlined /></div>
                </div>
                <p class="card-desc">Use Google Translate to effortlessly translate into multiple languages.</p>
                <div class="card-visual visual-translate">
                  <div class="trans-text t1">Omelette du fromage</div>
                  <div class="trans-text t2">Cheese Omelette</div>
                  <div class="trans-text t3">Tortilla de queso</div>
                  <div class="trans-text t4">Käse omelett</div>
                  <div class="trans-text t5">Ushizi Omelette</div>
                </div>
              </div>

              <!-- Card: Spotify -->
              <div class="ext-card card-spotify">
                <div class="card-top">
                  <div class="card-head-left">
                    <div class="card-icon-box icon-green"><customer-service-filled /></div>
                    <span class="card-name">Spotify</span>
                  </div>
                  <div class="card-arrow-btn"><arrow-right-outlined /></div>
                </div>
                <p class="card-desc">Search for music and podcasts, browse your library, and control playback.</p>
                <div class="card-visual visual-spotify">
                  <div class="spotify-album-wrapper">
                    <img src="https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png" alt="Album" class="s-img" onerror="this.style.backgroundColor='#333'">
                    <div class="s-glow-back"></div>
                  </div>
                  <div class="spotify-controls">
                    <step-backward-filled class="s-ctrl-icon" />
                    <div class="s-play-btn">
                      <caret-right-filled class="s-play-icon" />
                    </div>
                    <step-forward-filled class="s-ctrl-icon" />
                  </div>
                </div>
              </div>

              <!-- Card: Google Search -->
              <div class="ext-card card-google">
                <div class="card-top">
                  <div class="card-head-left">
                    <div class="card-icon-box"><google-circle-filled /></div>
                    <span class="card-name">Google Search</span>
                  </div>
                  <div class="card-arrow-btn"><arrow-right-outlined /></div>
                </div>
                <p class="card-desc">Search Google directly from Notion Mate.</p>
                <div class="card-visual visual-google">
                  <div class="g-search-input">
                    <search-outlined class="g-icon" />
                    <span class="g-text">Unicor</span><span class="g-cursor">|</span>
                  </div>
                  <div class="g-suggestions">
                    <div class="g-item active"><search-outlined /> Unicorn Search</div>
                    <div class="g-item"><search-outlined /> Unicorn drawing</div>
                  </div>
                </div>
              </div>

              <!-- Card: Obsidian -->
              <div class="ext-card card-obsidian">
                <div class="card-top">
                  <div class="card-head-left">
                    <div class="card-icon-box icon-purple"><file-text-filled /></div>
                    <span class="card-name">Obsidian</span>
                  </div>
                  <div class="card-arrow-btn"><arrow-right-outlined /></div>
                </div>
                <p class="card-desc">Capture thoughts to your second brain.</p>
                <div class="card-visual visual-obsidian">
                  <div class="obsidian-shard"></div>
                </div>
              </div>

            </div>
          </div>

          <div class="ext-footer-nav">
            <div class="nav-controls">
              <button class="nav-circle" @click="scrollLeft"><left-outlined /></button>
              <button class="nav-circle" @click="scrollRight"><right-outlined /></button>
            </div>
          </div>
        </section>

        <footer class="landing-footer">
          <p>Designed for speed. Built for Notion lovers.</p>
        </footer>
      </div>
    </transition>

    <!-- ================= 视图 2: Download Page ================= -->
    <transition name="fade-fast">
      <div v-if="viewMode === 'download'" class="download-modal">
        <div class="modal-backdrop" @click="viewMode = 'landing'"></div>
        <div class="modal-content">
          <button class="modal-close" @click="viewMode = 'landing'"><close-outlined /></button>
          <div class="modal-header">
            <h2>Download Notion Mate</h2>
            <p>Available on all your favorite platforms.</p>
          </div>
          <div class="platform-grid">
            <div class="plat-card"><div class="plat-icon-wrapper"><apple-filled /></div><h3 class="plat-title">Mac</h3><p class="plat-desc">macOS 12+</p><button class="plat-action-btn">Download .dmg</button></div>
            <div class="plat-card"><div class="plat-icon-wrapper"><windows-filled /></div><h3 class="plat-title">Windows</h3><p class="plat-desc">Windows 10/11</p><button class="plat-action-btn">Download .exe</button></div>
            <div class="plat-card"><div class="plat-icon-wrapper"><apple-filled /></div><h3 class="plat-title">iOS</h3><p class="plat-desc">iOS 16+</p><button class="plat-action-btn">App Store</button></div>
            <div class="plat-card"><div class="plat-icon-wrapper"><tablet-filled /></div><h3 class="plat-title">iPad</h3><p class="plat-desc">iPadOS 16+</p><button class="plat-action-btn">App Store</button></div>
            <div class="plat-card"><div class="plat-icon-wrapper"><android-filled /></div><h3 class="plat-title">Android</h3><p class="plat-desc">Android 10+</p><button class="plat-action-btn">Google Play</button></div>
          </div>
        </div>
      </div>
    </transition>

    <!-- ================= 视图 3: Auth Page ================= -->
    <transition name="slide-up">
      <div v-if="viewMode === 'auth'" class="auth-container split-container">
        <aside class="visual-side">
          <div class="mesh-background"><div class="mesh-orb orb-1"></div><div class="mesh-orb orb-2"></div><div class="mesh-orb orb-3"></div></div>
          <div class="noise-overlay"></div>
          <div class="glass-foreground">
            <button class="back-to-home" @click="viewMode = 'landing'"><arrow-left-outlined /> Back</button>
            <div class="brand-area"><div class="brand-logo-circle"><database-outlined /></div><span class="brand-name">Notion Mate</span></div>
            <div class="hero-content"><div class="title-wrapper"><h2 class="slogan-title">All In One.</h2><h2 class="slogan-title text-gradient">Intelligence.</h2></div></div>
            <div class="visual-footer"><p>Powered by Notion Mate Intelligent System</p></div>
          </div>
        </aside>
        <main class="form-side">
          <div class="form-container">
            <div class="form-header"><h1 class="welcome-text">欢迎回来 👋</h1><p class="subtitle-text">请登录您的账户以继续</p></div>
            <a-form layout="vertical" class="apple-form">
              <a-form-item><a-input size="large" placeholder="用户名" class="apple-input"><template #prefix><user-outlined /></template></a-input></a-form-item>
              <a-form-item><a-input-password size="large" placeholder="密码" class="apple-input"><template #prefix><lock-outlined /></template></a-input-password></a-form-item>
              <a-button type="primary" size="large" block class="apple-btn primary-btn" @click="handleLogin">登 录</a-button>
            </a-form>
            <div class="divider"><span>或</span></div>
            <div class="social-login-group"><a-button block class="apple-btn social-btn"><google-circle-filled /> Google</a-button><a-button block class="apple-btn social-btn"><apple-filled /> Apple</a-button></div>
          </div>
        </main>
      </div>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import {
  DatabaseOutlined, CloseOutlined,
  AppleFilled, WindowsFilled, AndroidFilled, TabletFilled,
  ArrowLeftOutlined, UserOutlined, LockOutlined, GoogleCircleFilled,
  SearchOutlined, ArrowRightOutlined, FileTextFilled,
  LeftOutlined, RightOutlined,
  RadarChartOutlined, TranslationOutlined, CustomerServiceFilled, CheckOutlined,
  StepBackwardFilled, PlayCircleFilled, StepForwardFilled, CaretRightFilled
} from '@ant-design/icons-vue'
import { AppleAlert } from "@/components/common/AppleAlert.ts"

const viewMode = ref('landing')
const appStore = reactive({ isDark: true })
const extGridRef = ref<HTMLElement | null>(null)

const showMaskLeft = ref(false)
const showMaskRight = ref(false)

const handleScroll = () => {
  if (!extGridRef.value) return
  const { scrollLeft, scrollWidth, clientWidth } = extGridRef.value
  showMaskLeft.value = scrollLeft > 10
  showMaskRight.value = (scrollLeft + clientWidth) < (scrollWidth - 10)
}

const handleResize = () => handleScroll()

onMounted(() => {
  window.addEventListener('resize', handleResize)
  setTimeout(handleScroll, 100)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const switchToAuth = () => viewMode.value = 'auth'
const switchToDownload = () => viewMode.value = 'download'

const scrollLeft = () => { if (extGridRef.value) extGridRef.value.scrollBy({ left: -360, behavior: 'smooth' }) }
const scrollRight = () => { if (extGridRef.value) extGridRef.value.scrollBy({ left: 360, behavior: 'smooth' }) }

const handleLogin = () => { setTimeout(() => { AppleAlert.success("Welcome Back", "Successfully logged in") }, 1000) }
</script>

<style scoped>
/* ================= 全局变量 ================= */
:root {
  --bg-color: #0b0c0e;
  --nav-bg: rgba(20, 20, 20, 0.75);
  --text-white: #ffffff;
  --text-grey: #8e8e93;
  --ray-red: #FF6363;
  --card-bg: #131313;
}

.app-root { width: 100%; min-height: 100vh; background-color: var(--bg-color); font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif; color: var(--text-white); overflow-x: hidden; position: relative; }

/* ================= 1. 背景引擎 ================= */
.ray-bg-engine { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; z-index: 0; pointer-events: none; }
.void-bg { position: absolute; width: 100%; height: 100%; background: radial-gradient(circle at 50% 0%, #2a1010 0%, #0b0c0e 60%); }
.grid-lines-wrapper { position: absolute; top: -150%; left: -150%; width: 400%; height: 400%; z-index: 1; transform: rotate(-60deg); pointer-events: none; }
.grid-vertical { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: repeating-linear-gradient(90deg, transparent 0, transparent 39px, rgba(255, 255, 255, 0.08) 40px, transparent 41px); mask-image: radial-gradient(circle at center, black 0%, transparent 80%); animation: grid-scan 30s linear infinite; }
.grid-flow { position: absolute; top: 0; left: 0; width: 100%; height: 200%; background: linear-gradient(180deg, transparent 0%, rgba(255, 99, 99, 0.15) 30%, transparent 60%); background-size: 100% 200px; animation: flow-drop 12s linear infinite; mix-blend-mode: screen; }
@keyframes grid-scan { 0% { transform: translateX(0); } 100% { transform: translateX(41px); } }
@keyframes flow-drop { 0% { transform: translateY(-50%); } 100% { transform: translateY(0); } }
.grid-overlay { position: absolute; width: 100%; height: 100%; background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 40px 40px; mask-image: radial-gradient(circle at center, black 50%, transparent 90%); }
.vignette { position: absolute; width: 100%; height: 100%; background: radial-gradient(circle at center, transparent 40%, #0b0c0e 100%); }
.ray-beams { position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; transform: rotate(-60deg); opacity: 0.8; }
.beam { position: absolute; background: linear-gradient(180deg, rgba(255, 69, 58, 0) 0%, rgba(255, 69, 58, 0.5) 50%, rgba(255, 69, 58, 0) 100%); width: 300px; height: 100%; filter: blur(50px); mix-blend-mode: screen; animation: beam-flow 20s infinite ease-in-out alternate; }
.beam-1 { left: 45%; animation-delay: 0s; width: 360px; opacity: 0.8; }
.beam-2 { left: 55%; width: 240px; opacity: 0.6; animation-delay: -2s; }
.beam-3 { left: 40%; width: 440px; opacity: 0.4; animation-delay: -4s; }
.beam-4 { left: 50%; width: 200px; opacity: 0.5; animation-delay: -1s; transform: translateY(100px); }
@keyframes beam-flow { from { transform: translateY(-40px) scale(1); opacity: 0.5; } to { transform: translateY(40px) scale(1.1); opacity: 0.9; } }
.landing-view { position: relative; min-height: 100vh; z-index: 1; cursor: default; }

/* ================= 2. 顶部导航栏 ================= */
.nav-container { position: fixed; top: 20px; left: 0; width: 100%; display: flex; justify-content: center; z-index: 100; padding: 0 24px; }
.ray-nav { display: flex; align-items: center; justify-content: space-between; width: 100%; max-width: 960px; height: 48px; background: #151515; border: 1px solid rgba(255,255,255,0.08); border-radius: 99px; padding: 0 6px 0 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); cursor: default; }
.nav-left { display: flex; align-items: center; }
.ray-logo { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.logo-svg { width: 20px; height: 20px; }
.logo-text { font-weight: 600; font-size: 15px; letter-spacing: -0.01em; color: #fff; }
.nav-center { display: flex; gap: 24px; }
.nav-link { color: #888; font-size: 13px; font-weight: 500; text-decoration: none; transition: color 0.2s; }
.nav-link:hover { color: #fff; }
.link-pricing { color: #888; font-size: 13px; font-weight: 500; }
.nav-right { display: flex; align-items: center; gap: 12px; }
.login-btn-text { background: none; border: none; color: #fff; font-size: 13px; font-weight: 500; cursor: pointer; transition: opacity 0.2s; }
.login-btn-text:hover { opacity: 0.7; }
.download-btn-white { background: #ffffff; color: #000000; border: none; height: 36px; padding: 0 18px; border-radius: 18px; font-size: 13px; font-weight: 600; cursor: pointer; transition: transform 0.1s; }
.download-btn-white:hover { transform: scale(1.02); }

/* ================= 3. Hero Section ================= */
.hero-section { position: relative; z-index: 10; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding-top: 0; pointer-events: none; min-height: 600px; }
.hero-inner { pointer-events: auto; margin-bottom: 20px; }
.hero-title { font-size: clamp(48px, 6vw, 80px); font-weight: 800; line-height: 1.05; letter-spacing: -0.03em; margin-bottom: 24px; color: #fff; }
.hero-title .line { display: block; }
.glow-text { text-shadow: 0 0 50px rgba(255,255,255,0.3); }
.hero-sub { font-size: 20px; color: #999; line-height: 1.5; margin-bottom: 48px; }

/* ================= NEW: Extensions Section ================= */
.extensions-section { position: relative; z-index: 10; max-width: 1200px; margin: 0 auto; padding: 0 24px 100px; }
.ext-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
.ext-title { font-size: 32px; font-weight: 700; color: #fff; margin-bottom: 8px; }
.ext-sub { font-size: 16px; color: #888; }
.ext-tags { display: none; } /* User requested removal */

.ext-grid-wrapper {
  overflow-x: auto;
  margin: 0 -24px;
  padding: 40px 24px 10px;
  scrollbar-width: none;
  -webkit-mask-image: none;
  mask-image: none;
  transition: mask-image 0.3s;
}

.ext-grid-wrapper.mask-l {
  -webkit-mask-image: linear-gradient(to right, transparent 0, black 80px, black 100%);
  mask-image: linear-gradient(to right, transparent 0, black 80px, black 100%);
}

.ext-grid-wrapper.mask-r {
  -webkit-mask-image: linear-gradient(to right, black 0, black calc(100% - 80px), transparent 100%);
  mask-image: linear-gradient(to right, black 0, black calc(100% - 80px), transparent 100%);
}

.ext-grid-wrapper.mask-l.mask-r {
  -webkit-mask-image: linear-gradient(to right, transparent 0, black 80px, black calc(100% - 80px), transparent 100%);
  mask-image: linear-gradient(to right, transparent 0, black 80px, black calc(100% - 80px), transparent 100%);
}

.ext-grid-wrapper::-webkit-scrollbar { display: none; }
.ext-cards-grid { display: flex; gap: 24px; padding-bottom: 20px; }

/* 通用卡片样式 */
.ext-card {
  flex-shrink: 0; width: 340px; height: 450px;
  background: var(--card-bg);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
  border-radius: 24px;
  padding: 32px;
  display: flex; flex-direction: column; position: relative; overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.4s, border-color 0.4s; /* 增加 border-color 过渡 */
}
.ext-card:hover { transform: translateY(-8px); }

/* 卡片专属渐变与光效 - 增强版 */
.card-linear { background: radial-gradient(circle at top right, rgba(99,102,241,0.15), transparent 60%), #131316; }
.card-linear:hover {
  border-color: rgba(99, 102, 241, 0.5); /* 边框变亮 */
  box-shadow:
      inset 0 0 20px rgba(99, 102, 241, 0.1), /* 内发光 */
      0 0 0 1px rgba(99, 102, 241, 0.3), /* 外边框光晕 */
      0 20px 50px -10px rgba(0,0,0,0.8), /* 底部阴影 */
      0 0 40px -10px rgba(99, 102, 241, 0.4); /* 外部扩散光效 */
}

.card-translate { background: radial-gradient(circle at top right, rgba(59,130,246,0.15), transparent 60%), #131316; }
.card-translate:hover {
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow:
      inset 0 0 20px rgba(59, 130, 246, 0.1),
      0 0 0 1px rgba(59, 130, 246, 0.3),
      0 20px 50px -10px rgba(0,0,0,0.8),
      0 0 40px -10px rgba(59, 130, 246, 0.4);
}

.card-spotify { background: radial-gradient(circle at top right, rgba(16,185,129,0.15), transparent 60%), #131316; }
.card-spotify:hover {
  border-color: rgba(16, 185, 129, 0.5);
  box-shadow:
      inset 0 0 20px rgba(16, 185, 129, 0.1),
      0 0 0 1px rgba(16, 185, 129, 0.3),
      0 20px 50px -10px rgba(0,0,0,0.8),
      0 0 40px -10px rgba(16, 185, 129, 0.4);
}

.card-google { background: radial-gradient(circle at top right, rgba(255,255,255,0.1), transparent 60%), #131316; }
.card-google:hover {
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow:
      inset 0 0 20px rgba(255, 255, 255, 0.05),
      0 0 0 1px rgba(255, 255, 255, 0.2),
      0 20px 50px -10px rgba(0,0,0,0.8),
      0 0 40px -10px rgba(255, 255, 255, 0.15);
}

.card-obsidian { background: radial-gradient(circle at top right, rgba(168,85,247,0.15), transparent 60%), #131316; }
.card-obsidian:hover {
  border-color: rgba(168, 85, 247, 0.5);
  box-shadow:
      inset 0 0 20px rgba(168, 85, 247, 0.1),
      0 0 0 1px rgba(168, 85, 247, 0.3),
      0 20px 50px -10px rgba(0,0,0,0.8),
      0 0 40px -10px rgba(168, 85, 247, 0.4);
}

.card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; width: 100%; }
.card-head-left { display: flex; align-items: center; gap: 14px; }
.card-icon-box { width: 48px; height: 48px; background: rgba(255,255,255,0.06); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; box-shadow: inset 0 1px 0 rgba(255,255,255,0.1); }

.icon-linear { color: #818cf8; background: rgba(99, 102, 241, 0.15); }
.icon-blue { color: #60a5fa; background: rgba(59, 130, 246, 0.15); }
.icon-green { color: #34d399; background: rgba(16, 185, 129, 0.15); }
.icon-purple { color: #c084fc; background: rgba(168, 85, 247, 0.15); }

.card-name { font-size: 16px; font-weight: 600; color: #fff; letter-spacing: -0.01em; }
.card-arrow-btn { width: 36px; height: 36px; border-radius: 12px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.4); transition: all 0.2s; font-size: 14px; }
.ext-card:hover .card-arrow-btn { background: rgba(255,255,255,0.15); color: #fff; }

.card-desc { font-size: 14px; color: #9ca3af; line-height: 1.6; margin-bottom: auto; z-index: 2; position: relative; min-height: 46px; }

.card-visual { flex: 1; margin-top: 20px; position: relative; overflow: visible; display: flex; align-items: center; justify-content: center; width: 100%; }

.visual-spotify { flex-direction: column; justify-content: flex-end; gap: 24px; padding-bottom: 10px; }
.spotify-album-art { width: 140px; height: 140px; border-radius: 12px; position: relative; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.6); transition: transform 0.4s ease; }
.ext-card:hover .spotify-album-art { transform: translateY(-8px) scale(1.05); box-shadow: 0 30px 60px -15px rgba(0,0,0,0.7); }
.s-img { width: 100%; height: 100%; object-fit: cover; border-radius: 12px; position: relative; z-index: 2; }
.s-glow-back { position: absolute; width: 100%; height: 100%; top: 0; left: 0; background: inherit; filter: blur(20px); opacity: 0.5; z-index: 1; }
.spotify-album-wrapper { position: relative; width: 140px; height: 140px; }
.spotify-controls { display: flex; align-items: center; gap: 24px; color: rgba(255,255,255,0.6); width: 100%; justify-content: center; }
.s-ctrl-icon { font-size: 20px; cursor: pointer; transition: color 0.2s; }
.s-ctrl-icon:hover { color: #fff; }
.s-play-btn { width: 44px; height: 44px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #000; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transition: transform 0.2s; }
.s-play-btn:hover { transform: scale(1.1); }
.s-play-icon { font-size: 24px; margin-left: 3px; }

.visual-linear { position: relative; }
.linear-ring { width: 140px; height: 140px; border: 1px solid rgba(255,255,255,0.1); border-radius: 50%; position: absolute; }
.linear-orbit { width: 12px; height: 12px; background: #818cf8; border-radius: 50%; position: absolute; top: 0; left: 50%; transform: translate(-50%, -50%); box-shadow: 0 0 15px #818cf8; }
.linear-icons { display: flex; gap: 12px; align-items: flex-end; margin-bottom: -20px; }
.l-icon { width: 32px; height: 32px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.2); background: transparent; }
.l-icon.active { background: #818cf8; border-color: #818cf8; display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 0 20px rgba(129, 140, 248, 0.4); width: 40px; height: 40px; font-size: 18px; }

.visual-translate { flex-direction: column; align-items: flex-start; gap: 12px; padding-left: 10px; width: 100%; mask-image: linear-gradient(to bottom, black 40%, transparent 100%); }
.trans-text { font-size: 16px; font-weight: 500; color: rgba(255,255,255,0.3); width: 100%; }
.trans-text.t2 { color: #fff; font-size: 20px; font-weight: 600; text-shadow: 0 0 20px rgba(59, 130, 246, 0.4); }

.visual-google { background: transparent; display: flex; flex-direction: column; width: 100%; padding: 0 4px; justify-content: flex-start; padding-top: 20px; }
.g-search-bar { background: rgba(255,255,255,0.08); height: 40px; border-radius: 10px; display: flex; align-items: center; padding: 0 12px; font-size: 14px; color: #ccc; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 12px; width: 100%; }
.g-icon { margin-right: 12px; color: #888; }
.g-results { display: flex; flex-direction: column; gap: 6px; width: 100%; }
.g-row { height: 32px; display: flex; align-items: center; gap: 12px; font-size: 13px; color: #888; padding: 0 12px; border-radius: 8px; }
.g-row.active { background: rgba(255,255,255,0.1); color: #fff; }

.obsidian-crystal { width: 100px; height: 120px; background: linear-gradient(135deg, #a855f7, #6b21a8); clip-path: polygon(50% 0%, 100% 25%, 80% 100%, 20% 100%, 0% 25%); box-shadow: 0 0 50px rgba(168,85,247,0.5); position: relative; animation: float 6s ease-in-out infinite; }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }

.ext-footer-nav { display: flex; justify-content: flex-end; align-items: center; margin-top: 0; padding-right: 24px; position: relative; z-index: 10; }
.nav-controls { display: flex; gap: 12px; }
.nav-circle { width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
.nav-circle:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3); }

/* Landing Footer */
.landing-footer { position: absolute; bottom: 30px; width: 100%; text-align: center; color: #444; font-size: 12px; pointer-events: none; }

/* ================= 4. Download Modal ================= */
.download-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 200; display: flex; align-items: center; justify-content: center; }
.modal-backdrop { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(12px); }
.modal-content { position: relative; z-index: 10; width: 100%; max-width: 1200px; padding: 40px; text-align: center; animation: pop-in 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes pop-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.modal-close { position: absolute; top: 0; right: 40px; width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.modal-close:hover { background: rgba(255,255,255,0.15); transform: rotate(90deg); }
.modal-header { margin-bottom: 60px; }
.modal-header h2 { font-size: 42px; font-weight: 800; margin-bottom: 12px; color: #fff; }
.modal-header p { font-size: 16px; color: #888; }
.platform-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; justify-content: center; }
.plat-card { background: linear-gradient(180deg, #1a1a1a, #161616); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 20px; padding: 32px 24px; display: flex; flex-direction: column; align-items: center; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); position: relative; overflow: hidden; }
.plat-card:hover { transform: translateY(-8px); background: linear-gradient(180deg, #222, #1a1a1a); border-color: rgba(255, 255, 255, 0.3); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5); }
.plat-icon-wrapper { width: 64px; height: 64px; border-radius: 18px; background: #000; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 32px; color: #fff; margin-bottom: 24px; box-shadow: inset 0 1px 0 rgba(255,255,255,0.1); }
.plat-title { font-size: 20px; font-weight: 700; color: #fff; margin: 0 0 6px; }
.plat-desc { font-size: 13px; color: #666; margin-bottom: 28px; font-weight: 500; }
.plat-action-btn { width: 100%; height: 40px; background: #fff; color: #000; border: none; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.plat-action-btn:hover { background: #e0e0e0; }

/* ================= 5. Auth Split Container ================= */
.auth-container { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; z-index: 300; background: #fff; }
.split-container { display: flex; width: 100%; height: 100vh; }
.visual-side { flex: 1.2; position: relative; background: #000; overflow: hidden; }
.glass-foreground { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2; padding: 40px; display: flex; flex-direction: column; justify-content: space-between; }
.back-to-home { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 8px 16px; border-radius: 20px; width: fit-content; cursor: pointer; display: flex; align-items: center; gap: 8px; backdrop-filter: blur(5px); }
.brand-area { display: flex; align-items: center; gap: 12px; }
.brand-logo-circle { width: 40px; height: 40px; background: rgba(255,255,255,0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
.brand-name { font-size: 20px; font-weight: 600; }
.form-side { flex: 1; display: flex; align-items: center; justify-content: center; background: #fff; color: #000; }
.form-container { width: 100%; max-width: 400px; padding: 40px; }
.apple-input { background: #f5f5f7; border: none; padding: 10px; border-radius: 8px; margin-bottom: 16px; }
.apple-btn { background: #0071e3; color: #fff; height: 44px; border-radius: 12px; font-weight: 600; border: none; cursor: pointer; width: 100%; }
.social-login-group { display: flex; gap: 12px; margin-top: 24px; }
.social-btn { background: #000; color: #fff; }

/* 动画 */
.reveal-1 { animation: slideUp 0.8s 0.1s forwards; opacity: 0; }
.reveal-2 { animation: slideUp 0.8s 0.2s forwards; opacity: 0; }
.reveal-3 { animation: slideUp 0.8s 0.3s forwards; opacity: 0; }
.reveal-4 { animation: slideUp 0.8s 0.4s forwards; opacity: 0; }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.slide-down { animation: slideDown 0.8s forwards; opacity: 0; transform: translateY(-20px); }
@keyframes slideDown { to { opacity: 1; transform: translateY(0); } }
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

/* 响应式 */
@media (max-width: 768px) {
  .nav-center { display: none; }
  .split-container { flex-direction: column; }
  .visual-side { flex: 0.4; }
  .platform-grid { grid-template-columns: repeat(2, 1fr); }
  .hero-title { font-size: 48px; }
  .ext-header { flex-direction: column; align-items: flex-start; gap: 16px; }
  .nav-controls { display: none; }
}
</style>