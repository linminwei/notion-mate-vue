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

    <!-- ================= 全局导航栏 (Shared Navigation) ================= -->
    <div class="nav-container slide-down">
      <nav class="ray-nav">
        <div class="nav-left">
          <div class="ray-logo" @click="viewMode = 'landing'">
            <svg viewBox="0 0 24 24" fill="none" class="logo-svg">
              <path d="M4 22L20 2L12 22H4Z" fill="#FF6363"/>
            </svg>
            <span class="logo-text">Raycast</span>
          </div>
        </div>

        <div class="nav-center">
          <a href="#" class="nav-link" :class="{ active: viewMode === 'store' }" @click.prevent="viewMode = 'store'">集成</a>
          <a href="#" class="nav-link">Pro</a>
          <a href="#" class="nav-link">AI</a>
          <a href="#" class="nav-link">团队</a>
          <a href="#" class="nav-link">开发者</a>
          <a href="#" class="nav-link">更新日志</a>
          <a class="link-pricing">定价</a>
        </div>

        <div class="nav-right">
          <button class="login-btn-text" @click="switchToAuth">登录</button>
          <button class="download-btn-white" @click="switchToDownload">
            下载
          </button>
        </div>
      </nav>
    </div>

    <!-- ================= 主内容区域切换 ================= -->
    <transition name="fade-slow" mode="out-in">

      <!-- 视图 1: Landing Page Content (首页) -->
      <div v-if="viewMode === 'landing'" key="landing" class="landing-view">

        <!-- Hero 区域 -->
        <header class="hero-section">
          <div class="hero-inner">
            <h1 class="hero-title">
              <span class="line reveal-1">第二大脑，</span>
              <span class="line reveal-2 glow-text">开启自动驾驶。</span>
            </h1>
            <p class="hero-sub reveal-3">
              无缝同步豆瓣书影音、实时聚合财务流水、智能驱动生产力。<br class="desktop-br">
              Notion Mate 让数据在 Notion 与 MySQL 间自由流转，构建您的数字生命体。
            </p>
          </div>
        </header>

        <!-- 扩展展示区 (Extensions Showcase) -->
        <section class="extensions-section reveal-4">
          <div class="ext-header">
            <div class="ext-titles">
              <h2 class="ext-title">打破边界，无缝协作。</h2>
              <p class="ext-sub">告别频繁切换窗口的烦恼。在同一个入口，连接您所有的工具与服务。</p>
            </div>
            <div class="ext-tags">
              <span class="ext-tag active">生产力</span>
              <span class="ext-tag">工程</span>
              <span class="ext-tag">设计</span>
              <span class="ext-tag">写作</span>
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
                <p class="card-desc">无需离开键盘，即可创建、搜索和修改您的 Linear 议题。</p>
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
                    <span class="card-name">Google 翻译</span>
                  </div>
                  <div class="card-arrow-btn"><arrow-right-outlined /></div>
                </div>
                <p class="card-desc">打破语言障碍，极速翻译，沟通无界。</p>
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
                <p class="card-desc">掌控您的音乐律动。搜索、播放、管理，尽在指尖。</p>
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
                    <span class="card-name">Google 搜索</span>
                  </div>
                  <div class="card-arrow-btn"><arrow-right-outlined /></div>
                </div>
                <p class="card-desc">无需打开浏览器，直接从 Notion Mate 探索世界。</p>
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
                <p class="card-desc">捕捉瞬时灵感，无缝存入您的知识库。</p>
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

          <footer class="landing-footer">
            <p>为速度而生，为 Notion 爱好者而造。</p>
          </footer>
        </section>
      </div>

      <!-- 视图 4: Integrations Page (集成页) -->
      <div v-else-if="viewMode === 'store'" key="store" class="store-view">
        <div class="store-bg-glow"></div>

        <div class="store-content-wrapper">

          <!-- 图标云 Hero 区域 -->
          <div class="store-icon-cloud">
            <div class="cloud-row row-top">
              <div class="store-app-icon icon-blur-2"><thunderbolt-filled /></div>
              <div class="store-app-icon icon-blur-1 icon-figma"><bg-colors-outlined /></div>
              <div class="store-app-icon icon-focus icon-notion">
                <span class="notion-n">N</span>
              </div>
              <div class="store-app-icon icon-blur-1 icon-spotify"><customer-service-filled /></div>
              <div class="store-app-icon icon-blur-2 icon-vscode"><code-filled /></div>
            </div>
            <div class="cloud-row row-bottom">
              <div class="store-app-icon icon-blur-2 icon-google"><google-circle-filled /></div>
              <div class="store-app-icon icon-blur-1 icon-arc"><compass-filled /></div>
              <div class="store-app-icon icon-blur-2 icon-slack"><slack-circle-filled /></div>
            </div>
          </div>

          <!-- 标题区域：更新为中文营销文案 -->
          <div class="store-hero-text">
            <h1 class="store-title">原生集成</h1>
            <p class="store-subtitle">
              不仅仅是连接，更是智能管理。Notion Mate 内置全场景数据中枢，<br>
              自动同步豆瓣书影音库、聚合个人财务流水、驱动生产力看板。<br>
              无需第三方插件，让您的数据在 Notion 与 MySQL 间自由流转，构建完整的数字人生。
            </p>
          </div>

          <!-- 搜索框已移除 -->

          <!-- Top Picks Section -->
          <div class="top-picks-section">
            <h3 class="section-label">核心内置功能，即刻体验</h3>
            <div class="picks-grid">

              <!-- Pick 1: Douban Sync -->
              <div class="pick-card">
                <div class="pick-icon-wrapper bg-green-douban">
                  <read-outlined class="pick-icon" />
                </div>
                <h3 class="pick-name">豆瓣书影音同步</h3>
                <p class="pick-desc">自动捕获豆瓣标记，构建您的精神角落。数据实时流转至 Notion 与 MySQL，沉淀为永久资产。</p>
                <div class="pick-author">
                  <div class="author-avatar-team"><img src="https://api.dicebear.com/7.x/initials/svg?seed=NM" alt="NM"></div>
                  <span class="author-name">Notion Mate Team</span>
                </div>
                <button class="install-btn">立即启用</button>
              </div>

              <!-- Pick 2: Finance Manager (Replaced XKCD) -->
              <div class="pick-card">
                <div class="pick-icon-wrapper bg-orange-finance">
                  <bank-outlined class="pick-icon" />
                </div>
                <h3 class="pick-name">智能财务管家</h3>
                <p class="pick-desc">自动聚合多渠道账单，生成可视化财务报表。数据实时同步至 MySQL，助您轻松掌控个人收支。</p>
                <div class="pick-author">
                  <div class="author-avatar-team"><img src="https://api.dicebear.com/7.x/initials/svg?seed=NM" alt="NM"></div>
                  <span class="author-name">Notion Mate Team</span>
                </div>
                <button class="install-btn">立即启用</button>
              </div>

              <!-- Pick 3: Haystack (Productivity) -->
              <div class="pick-card">
                <div class="pick-icon-wrapper bg-yellow">
                  <deployment-unit-outlined class="pick-icon text-black" />
                </div>
                <h3 class="pick-name">全能生产力剪藏</h3>
                <p class="pick-desc">捕捉稍纵即逝的灵感。截图、链接、笔记，万物皆可剪藏，无缝融入您的 Notion 生产力工作流。</p>
                <div class="pick-author">
                  <div class="author-avatar-team"><img src="https://api.dicebear.com/7.x/initials/svg?seed=NM" alt="NM"></div>
                  <span class="author-name">Notion Mate Team</span>
                </div>
                <button class="install-btn">立即启用</button>
              </div>

            </div>
          </div>

        </div>
      </div>

      <!-- 视图 2: Download Page (下载页) -->
      <div v-else-if="viewMode === 'download'" key="download" class="download-view">
        <div class="download-bg-glow"></div>

        <div class="download-container">
          <!-- Hero Text -->
          <div class="download-header">
            <h1 class="download-title">全平台覆盖，<br>体验始终如一。</h1>
            <p class="download-subtitle">
              专为速度而生的原生架构。配置、脚本与数据在所有设备间实时同步。<br class="desktop-br">
              无论身处何地，Notion Mate 始终与您的思维同步。
            </p>
          </div>

          <!-- Primary Platform: Mac -->
          <div class="primary-dl-card">
            <div class="primary-content">
              <div class="os-icon-large mac-icon"><apple-filled /></div>
              <div class="dl-info">
                <h2 class="dl-os-name">macOS</h2>
                <p class="dl-os-desc">支持 Apple Silicon 和 Intel 芯片</p>
                <div class="dl-meta">
                  <span class="version-badge">v1.68.0</span>
                  <span class="req-text">需要 macOS 12+</span>
                </div>
              </div>
              <div class="dl-actions">
                <button class="dl-btn-primary">
                  <span class="btn-txt">下载 Mac 版本</span>
                </button>
              </div>
            </div>

            <div class="primary-visual">
              <!-- App Window Mock -->
              <div class="app-window-mock scale-in">
                <div class="win-bar">
                  <search-outlined class="win-search-icon" />
                  <div class="win-search-text">搜索 Notion Mate...</div>
                </div>
                <div class="win-list">
                  <div class="win-item active">
                    <div class="item-left"><sync-outlined class="item-icon" /><span class="item-text">同步数据中心</span></div>
                    <span class="item-key">↵</span>
                  </div>
                  <div class="win-item">
                    <div class="item-left"><video-camera-filled class="item-icon" /><span class="item-text">管理书影音库</span></div>
                  </div>
                  <div class="win-item">
                    <div class="item-left"><bank-outlined class="item-icon" /><span class="item-text">记录个人财务</span></div>
                  </div>
                  <div class="win-item">
                    <div class="item-left"><bar-chart-outlined class="item-icon" /><span class="item-text">个人生产力看板</span></div>
                  </div>
                </div>
                <div class="win-footer">
                  <div class="footer-actions"><span class="k">⌘</span><span class="k">K</span> <span class="t">操作</span></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Secondary Platforms Grid -->
          <div class="platforms-grid">

            <!-- Windows -->
            <div class="plat-item-card win-card">
              <div class="plat-icon-box win-icon"><windows-filled /></div>
              <div class="plat-details">
                <h3>Windows</h3>
                <p>Windows 10/11</p>
              </div>
              <button class="plat-dl-btn">下载</button>
            </div>

            <!-- iOS -->
            <div class="plat-item-card ios-card">
              <div class="plat-icon-box ios-icon"><apple-filled /></div>
              <div class="plat-details">
                <h3>iOS</h3>
                <p>iPhone & iPad</p>
              </div>
              <button class="plat-dl-btn">App Store</button>
            </div>

            <!-- Android -->
            <div class="plat-item-card android-card">
              <div class="plat-icon-box android-icon"><android-filled /></div>
              <div class="plat-details">
                <h3>Android</h3>
                <p>Android 10+</p>
              </div>
              <button class="plat-dl-btn">Google Play</button>
            </div>

            <!-- Linux -->
            <div class="plat-item-card linux-card coming-soon">
              <div class="plat-icon-box linux-icon"><code-filled /></div>
              <div class="plat-details">
                <h3>Linux</h3>
                <p style="opacity: 0; pointer-events: none;">Coming Soon</p>
              </div>
              <button class="plat-dl-btn disabled">敬请期待</button>
            </div>

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
            <button class="back-to-home" @click="viewMode = 'landing'"><arrow-left-outlined /> 返回</button>
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
  StepBackwardFilled, PlayCircleFilled, StepForwardFilled, CaretRightFilled,
  ThunderboltFilled, BgColorsOutlined, CodeFilled, CompassFilled, SlackCircleFilled,
  CalendarFilled, DeploymentUnitOutlined, SyncOutlined, VideoCameraFilled, BankOutlined, BarChartOutlined,
  ReadOutlined
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
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && (viewMode.value === 'store' || viewMode.value === 'download')) {
    // 允许 ESC 返回
    viewMode.value = 'landing'
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleKeydown)
  setTimeout(handleScroll, 100)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleKeydown)
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
.nav-link:hover, .nav-link.active { color: #fff; }
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

/* ================= Extensions Section ================= */
.extensions-section { position: relative; z-index: 10; max-width: 1200px; margin: 0 auto; padding: 0 24px 100px; }
.ext-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
.ext-title { font-size: 32px; font-weight: 700; color: #fff; margin-bottom: 8px; }
.ext-sub { font-size: 16px; color: #888; }
.ext-tags { display: none; }

.ext-grid-wrapper {
  overflow-x: auto;
  margin: 0 -24px;
  padding: 40px 24px 10px;
  scrollbar-width: none;
  -webkit-mask-image: none;
  mask-image: none;
  transition: mask-image 0.3s;
}

.ext-grid-wrapper.mask-l { mask-image: linear-gradient(to right, transparent 0, black 80px, black 100%); -webkit-mask-image: linear-gradient(to right, transparent 0, black 80px, black 100%); }
.ext-grid-wrapper.mask-r { mask-image: linear-gradient(to right, black 0, black calc(100% - 80px), transparent 100%); -webkit-mask-image: linear-gradient(to right, black 0, black calc(100% - 80px), transparent 100%); }
.ext-grid-wrapper.mask-l.mask-r { mask-image: linear-gradient(to right, transparent 0, black 80px, black calc(100% - 80px), transparent 100%); -webkit-mask-image: linear-gradient(to right, transparent 0, black 80px, black calc(100% - 80px), transparent 100%); }
.ext-grid-wrapper::-webkit-scrollbar { display: none; }
.ext-cards-grid { display: flex; gap: 24px; padding-bottom: 20px; }

.ext-card {
  flex-shrink: 0; width: 340px; height: 450px;
  background: var(--card-bg);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
  border-radius: 24px;
  padding: 32px;
  display: flex; flex-direction: column; position: relative; overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.4s, border-color 0.4s;
}
.ext-card:hover { transform: translateY(-8px); }

.card-linear { background: radial-gradient(circle at top right, rgba(99,102,241,0.15), transparent 60%), #131316; }
.card-linear:hover { border-color: rgba(99, 102, 241, 0.5); box-shadow: inset 0 0 20px rgba(99, 102, 241, 0.1), 0 0 0 1px rgba(99, 102, 241, 0.3), 0 20px 50px -10px rgba(0,0,0,0.8), 0 0 40px -10px rgba(99, 102, 241, 0.4); }
.card-translate { background: radial-gradient(circle at top right, rgba(59,130,246,0.15), transparent 60%), #131316; }
.card-translate:hover { border-color: rgba(59, 130, 246, 0.5); box-shadow: inset 0 0 20px rgba(59, 130, 246, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.3), 0 20px 50px -10px rgba(0,0,0,0.8), 0 0 40px -10px rgba(59, 130, 246, 0.4); }
.card-spotify { background: radial-gradient(circle at top right, rgba(16,185,129,0.15), transparent 60%), #131316; }
.card-spotify:hover { border-color: rgba(16, 185, 129, 0.5); box-shadow: inset 0 0 20px rgba(16, 185, 129, 0.1), 0 0 0 1px rgba(16, 185, 129, 0.3), 0 20px 50px -10px rgba(0,0,0,0.8), 0 0 40px -10px rgba(16, 185, 129, 0.4); }
.card-google { background: radial-gradient(circle at top right, rgba(255,255,255,0.1), transparent 60%), #131316; }
.card-google:hover { border-color: rgba(255, 255, 255, 0.3); box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.2), 0 20px 50px -10px rgba(0,0,0,0.8), 0 0 40px -10px rgba(255, 255, 255, 0.15); }
.card-obsidian { background: radial-gradient(circle at top right, rgba(168,85,247,0.15), transparent 60%), #131316; }
.card-obsidian:hover { border-color: rgba(168, 85, 247, 0.5); box-shadow: inset 0 0 20px rgba(168, 85, 247, 0.1), 0 0 0 1px rgba(168, 85, 247, 0.3), 0 20px 50px -10px rgba(0,0,0,0.8), 0 0 40px -10px rgba(168, 85, 247, 0.4); }

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
.spotify-album-wrapper { position: relative; width: 140px; height: 140px; transition: transform 0.4s ease; }
.ext-card:hover .spotify-album-wrapper { transform: translateY(-8px) scale(1.05); }
.s-img { width: 100%; height: 100%; object-fit: cover; border-radius: 12px; position: relative; z-index: 2; }
.s-glow-back { position: absolute; width: 100%; height: 100%; top: 0; left: 0; background: inherit; filter: blur(20px); opacity: 0.5; z-index: 1; }
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
.g-search-input { background: rgba(255,255,255,0.08); height: 40px; border-radius: 10px; display: flex; align-items: center; padding: 0 12px; font-size: 14px; color: #ccc; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 12px; width: 100%; }
.g-icon { margin-right: 12px; color: #888; }
.g-suggestions { display: flex; flex-direction: column; gap: 6px; width: 100%; }
.g-item { height: 32px; display: flex; align-items: center; gap: 12px; font-size: 13px; color: #888; padding: 0 12px; border-radius: 8px; }
.g-item.active { background: rgba(255,255,255,0.1); color: #fff; }
.obsidian-shard { width: 100px; height: 120px; background: linear-gradient(135deg, #a855f7, #6b21a8); clip-path: polygon(50% 0%, 100% 25%, 80% 100%, 20% 100%, 0% 25%); box-shadow: 0 0 50px rgba(168,85,247,0.5); position: relative; animation: float 6s ease-in-out infinite; }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }

.ext-footer-nav { display: flex; justify-content: flex-end; align-items: center; margin-top: 0; padding-right: 24px; position: relative; z-index: 10; }
.nav-controls { display: flex; gap: 12px; }
.nav-circle { width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
.nav-circle:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3); }
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

/* ================= 6. Integrations Page (原 Store Page) ================= */
.store-view {
  position: relative;
  width: 100%;
  min-height: 100vh;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 120px;
  padding-bottom: 100px; /* 增加底部 padding */
}

/* Store 的背景光效 */
.store-bg-glow {
  position: absolute; top: 100px; left: 50%; transform: translateX(-50%);
  width: 800px; height: 600px;
  background: radial-gradient(circle, rgba(255, 99, 99, 0.1) 0%, rgba(59, 130, 246, 0.05) 40%, transparent 70%);
  pointer-events: none; filter: blur(80px); z-index: -1;
}

.store-content-wrapper { position: relative; z-index: 10; width: 100%; max-width: 1000px; display: flex; flex-direction: column; align-items: center; text-align: center; }

/* Icon Cloud */
.store-icon-cloud { display: flex; flex-direction: column; align-items: center; gap: 24px; margin-bottom: 60px; perspective: 1000px; }
.cloud-row { display: flex; align-items: center; justify-content: center; gap: 24px; }
.row-top { margin-bottom: -10px; }

.store-app-icon {
  width: 72px; height: 72px; border-radius: 20px;
  background: rgba(30,30,30,0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
  display: flex; align-items: center; justify-content: center;
  font-size: 32px; color: #fff;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* Icon Specifics */
.icon-focus { width: 96px; height: 96px; z-index: 10; font-size: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.4); background: #111; transform: scale(1.05); }
.notion-n { font-family: "Segoe UI", serif; font-weight: 700; letter-spacing: -1px; }

.icon-blur-1 { opacity: 0.6; transform: scale(0.9); filter: blur(0.5px); }
.icon-blur-2 { opacity: 0.3; transform: scale(0.8); filter: blur(1.5px); }

.icon-figma { color: #f24e1e; }
.icon-spotify { color: #1db954; }
.icon-vscode { color: #007acc; }
.icon-google { background: #fff; color: #000; }
.icon-slack { background: #4a154b; color: #fff; }

.store-hero-text { margin-bottom: 50px; }
.store-title {
  font-size: 64px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #fff 0%, #ccc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.store-subtitle { font-size: 18px; color: #888; line-height: 1.6; max-width: 600px; margin: 0 auto; }

/* Store Search - Removed as requested */

/* ================= 7. New: Top Picks Section ================= */
.top-picks-section {
  width: 100%;
  margin-top: 80px;
  text-align: left;
}

.section-label {
  color: #888;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 24px;
  padding-left: 4px;
}

.picks-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  width: 100%;
}

.pick-card {
  background: #111;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 40px 24px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
}

.pick-card:hover {
  border-color: rgba(255,255,255,0.25);
  transform: translateY(-5px);
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);
  background: #141414;
}

.pick-icon-wrapper {
  width: 72px; height: 72px;
  border-radius: 18px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 24px;
  position: relative;
  box-shadow: 0 10px 20px rgba(0,0,0,0.3);
}

.bg-blue { background: #3b82f6; color: #fff; }
.bg-black { background: #000; border: 1px solid rgba(255,255,255,0.2); color: #fff; }
.bg-yellow { background: #eab308; color: #000; }
.bg-green-douban { background: #007722; color: #fff; }
.bg-orange-finance { background: #f97316; color: #fff; }

.pick-icon { font-size: 36px; }
.pick-icon.text-black { color: #1a1a1a; }
.pick-text-icon { font-family: 'Courier New', monospace; font-weight: 800; font-size: 20px; letter-spacing: -1px; }

.pick-icon-badge {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  color: #3b82f6;
  font-size: 18px;
  font-weight: 700;
  width: 32px; height: 32px;
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* Override for calendar icon specific look */
.bg-blue .pick-icon { display: none; } /* Hide the ANT icon to build custom badge */

.pick-name {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 10px;
}

.pick-desc {
  font-size: 14px;
  color: #888;
  line-height: 1.5;
  margin-bottom: 24px;
  flex-grow: 1; /* Pushes content apart if needed */
}

.pick-author {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}

.author-avatar {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: #333;
}

.author-avatar-team {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: #333;
  overflow: hidden;
}
.author-avatar-team img { width: 100%; height: 100%; object-fit: cover; }

.author-name {
  font-size: 13px;
  color: #999;
  font-weight: 500;
}

.install-btn {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  max-width: 160px;
}

.install-btn:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.4);
}

/* ================= 8. New: Download Page ================= */
.download-view {
  position: relative;
  width: 100%;
  min-height: 100vh;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
  padding-bottom: 100px;
}

.download-bg-glow {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: radial-gradient(circle at 50% 30%, rgba(255,255,255,0.03) 0%, transparent 50%);
  pointer-events: none; z-index: -1;
}

.download-container {
  width: 100%; max-width: 1000px;
  display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: 0 24px;
}

.download-header { margin-bottom: 60px; margin-top: 120px; /* Increased top margin */ }
.download-title {
  font-size: 64px; font-weight: 800; color: #fff; letter-spacing: -0.02em; margin-bottom: 20px;
  background: linear-gradient(135deg, #fff 0%, #ccc 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.download-subtitle { font-size: 20px; color: #888; line-height: 1.5; font-weight: 400; max-width: 600px; margin: 0 auto; }

/* Primary Mac Download Card */
.primary-dl-card {
  width: 100%;
  /* max-width: 900px; REMOVED to align with grid */
  height: 380px;
  background: #0d0d0d;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 24px;
  display: flex;
  align-items: stretch;
  overflow: hidden;
  margin-bottom: 60px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.primary-dl-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.2); }

.primary-content {
  flex: 1; padding: 48px;
  display: flex; flex-direction: column; align-items: flex-start; text-align: left;
  justify-content: space-between; z-index: 2; position: relative;
}

.os-icon-large { font-size: 48px; color: #fff; margin-bottom: 20px; }
.dl-info { margin-bottom: 30px; }
.dl-os-name { font-size: 32px; font-weight: 700; color: #fff; margin-bottom: 8px; }
.dl-os-desc { font-size: 16px; color: #999; margin-bottom: 16px; }
.dl-meta { display: flex; gap: 12px; align-items: center; }
.version-badge { background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; color: #ccc; }
.req-text { font-size: 13px; color: #666; }

.dl-actions { width: 100%; display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
.dl-btn-primary {
  background: #fff; color: #000;
  border: none; padding: 14px 28px;
  border-radius: 12px; font-size: 15px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
  display: flex; align-items: center; gap: 8px;
  box-shadow: 0 4px 12px rgba(255,255,255,0.15);
}
.dl-btn-primary:hover { transform: scale(1.02); background: #f0f0f0; box-shadow: 0 6px 16px rgba(255,255,255,0.2); }
/* Removed dl-sub-link */

.primary-visual {
  flex: 1.2;
  background: radial-gradient(circle at bottom right, rgba(255, 69, 58, 0.05), transparent 70%);
  position: relative;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}

/* App Window Mock inside visual */
.app-window-mock {
  width: 85%; height: auto; aspect-ratio: 16/10;
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  display: flex; flex-direction: column;
  transform: translateY(20px) rotateX(5deg) rotateY(-5deg);
  transition: transform 0.5s ease;
  padding: 12px;
}
.primary-dl-card:hover .app-window-mock { transform: translateY(10px) rotateX(0deg) rotateY(0deg); }

.win-bar { height: 44px; display: flex; align-items: center; padding: 0 12px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #888; font-size: 14px; gap: 12px; margin-bottom: 4px; }
.win-search-icon { font-size: 16px; color: #666; }
.win-search-text { flex: 1; font-size: 13px; opacity: 0.7; }

.win-list { flex: 1; padding: 4px 0; display: flex; flex-direction: column; gap: 2px; }
.win-item { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-radius: 6px; color: #ccc; font-size: 13px; transition: background 0.2s; }
.win-item.active { background: #FF6363; color: #fff; font-weight: 500; box-shadow: 0 2px 8px rgba(255, 99, 99, 0.3); }
.item-left { display: flex; align-items: center; gap: 10px; }
.item-icon { font-size: 16px; opacity: 0.8; }
.item-key { opacity: 0.6; font-size: 11px; font-family: monospace; }

.win-footer { height: 32px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; padding: 0 12px; font-size: 11px; color: #555; margin-top: 4px; }
.footer-actions { display: flex; align-items: center; gap: 6px; }
.footer-actions .k { background: rgba(255,255,255,0.1); padding: 2px 5px; border-radius: 4px; color: #777; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif; font-size: 10px; }
.footer-actions .t { font-weight: 500; }

/* Secondary Platforms Grid */
.platforms-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;
  width: 100%;
}

.plat-item-card {
  background: rgba(20,20,20,0.6);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 24px;
  display: flex; flex-direction: column; align-items: center;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative; overflow: hidden;
}

.plat-item-card:hover { transform: translateY(-4px); background: rgba(30,30,30,0.8); border-color: rgba(255,255,255,0.2); }

/* Brand Color Glows on Hover */
.win-card:hover { box-shadow: 0 10px 30px -5px rgba(0, 164, 239, 0.15); border-color: rgba(0, 164, 239, 0.3); }
.win-card:hover .win-icon { color: #00a4ef; transform: scale(1.1); }

.ios-card:hover { box-shadow: 0 10px 30px -5px rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.3); }
.ios-card:hover .ios-icon { color: #fff; transform: scale(1.1); }

.android-card:hover { box-shadow: 0 10px 30px -5px rgba(61, 220, 132, 0.15); border-color: rgba(61, 220, 132, 0.3); }
.android-card:hover .android-icon { color: #3ddc84; transform: scale(1.1); }

.linux-card:hover { border-color: rgba(252, 198, 36, 0.3); }
.linux-card:hover .linux-icon { color: #fcc624; transform: scale(1.1); }

.plat-icon-box { font-size: 32px; margin-bottom: 16px; color: #888; transition: all 0.3s; }

.plat-details h3 { font-size: 16px; font-weight: 600; margin-bottom: 4px; color: #fff; }
.plat-details p { font-size: 13px; color: #666; margin-bottom: 20px; transition: color 0.3s; }
.plat-item-card:hover p { color: #999; }

.plat-dl-btn {
  background: rgba(255,255,255,0.08);
  color: #fff; border: 1px solid transparent;
  padding: 8px 0; border-radius: 8px;
  font-size: 13px; font-weight: 500; cursor: pointer;
  transition: all 0.2s; width: 100%;
}
.plat-dl-btn:hover { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.1); }
.plat-dl-btn.disabled { opacity: 0.3; cursor: not-allowed; }
.plat-dl-btn.disabled:hover { background: rgba(255,255,255,0.08); border-color: transparent; }

.coming-soon { opacity: 0.7; }

/* 动画 */
.reveal-1 { animation: slideUp 0.8s 0.1s forwards; opacity: 0; }
.reveal-2 { animation: slideUp 0.8s 0.2s forwards; opacity: 0; }
.reveal-3 { animation: slideUp 0.8s 0.3s forwards; opacity: 0; }
.reveal-4 { animation: slideUp 0.8s 0.4s forwards; opacity: 0; }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.slide-down { animation: slideDown 0.8s forwards; opacity: 0; transform: translateY(-20px); }
@keyframes slideDown { to { opacity: 1; transform: translateY(0); } }
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
.zoom-fade-enter-active, .zoom-fade-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.zoom-fade-enter-from { opacity: 0; transform: scale(0.95); }
.zoom-fade-leave-to { opacity: 0; transform: scale(1.05); }

/* 响应式 */
@media (max-width: 900px) {
  .picks-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .nav-center { display: none; }
  .split-container { flex-direction: column; }
  .visual-side { flex: 0.4; }
  .platform-grid { grid-template-columns: repeat(2, 1fr); }
  .hero-title { font-size: 48px; }
  .store-title { font-size: 40px; }
  .store-app-icon { width: 56px; height: 56px; font-size: 24px; }
  .icon-focus { width: 72px; height: 72px; font-size: 32px; }
  .picks-grid { grid-template-columns: 1fr; }
}
</style>