<template>
  <!-- 增加 auth-active 动态类，用于在打开认证模态框时进行全局样式的隐藏控制 -->
  <div class="app-root" :class="{ 'auth-active': ['auth', 'forgot-password', 'register', 'phone-login'].includes(viewMode) }">

    <!-- ================= 全局背景引擎 (Persistent Background) ================= -->
    <div class="ray-bg-engine">
      <div class="void-bg"></div>

      <!-- 动态线条层 ( 强化版：倾斜光栅 ) -->
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
            <img src="/notion-mate-dark.png" class="logo-svg">
            <span class="logo-text">Notion Mate</span>
          </div>
        </div>

        <div class="nav-center">
          <a href="#" class="nav-link" :class="{ active: viewMode === 'store' }" @click.prevent="viewMode = 'store'"> 集成 </a>
          <a href="#" class="nav-link" :class="{ active: viewMode === 'changelog' }" @click.prevent="viewMode = 'changelog'"> 更新日志 </a>
        </div>

        <div class="nav-right">
          <button class="login-btn-text" @click="switchToAuth"> 登录 </button>
          <button class="download-btn-white" @click="switchToDownload"> 下载 </button>
        </div>
      </nav>
    </div>

    <!-- ================= 主内容区域切换 ================= -->
    <transition name="fade-slow" mode="out-in">

      <!-- 视图 1: Landing Page Content ( 首页 ) -->
      <div v-if="viewMode === 'landing'" key="landing" class="landing-view">

        <!-- Hero 区域 -->
        <header class="hero-section">
          <div class="hero-inner">
            <h1 class="hero-title">
              <span class="line reveal-1">Notion 的超级伴侣 </span>
              <span class="line reveal-2 glow-text"> 数据自由流转 </span>
            </h1>
            <p class="hero-sub reveal-3">
              打破平台壁垒，管理您的每一比特数据。<br class="desktop-br">
              智能聚合生活娱乐、财务与生产力数据，全方位管理您的数字人生。
            </p>
          </div>
        </header>

        <!-- 扩展展示区 (Extensions Showcase) -->
        <section class="extensions-section reveal-4">
          <div class="ext-header">
            <div class="ext-titles">
              <h2 class="ext-title"> 万千功能，一呼百应。</h2>
              <p class="ext-sub"> 告别数据孤岛。在同一个入口，连接您所有的数据。</p>
            </div>
            <div class="ext-tags">
              <span class="ext-tag active"> 生产力 </span>
              <span class="ext-tag"> 工程 </span>
              <span class="ext-tag"> 设计 </span>
              <span class="ext-tag"> 写作 </span>
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
                <p class="card-desc"> 无需离开键盘，即可创建、搜索和修改您的 Linear 议题。</p>
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
                    <span class="card-name">Google 翻译 </span>
                  </div>
                  <div class="card-arrow-btn"><arrow-right-outlined /></div>
                </div>
                <p class="card-desc"> 打破语言障碍，极速翻译，沟通无界。</p>
                <div class="card-visual visual-translate">
                  <div class="trans-text t1">Omelette du fromage</div>
                  <div class="trans-text t2">Cheese Omelette</div>
                  <div class="trans-text t3">Tortilla de queso</div>
                  <div class="trans-text t4">K ä se omelett</div>
                  <div class="trans-text t5">Ushizi Omelette</div>
                </div>
              </div>

              <!-- Card: Spotify -->
              <div class="ext-card card-spotify">
                <div class="card-top">
                  <div class="card-head-left">
                    <div class="card-icon-box icon-green"><customer-service-filled /></div>
                    <span class="card-name">Music</span>
                  </div>
                  <div class="card-arrow-btn"><arrow-right-outlined /></div>
                </div>
                <p class="card-desc"> 掌控您的音乐律动。搜索、播放、管理，尽在指尖。</p>
                <div class="card-visual visual-spotify">
                  <div class="spotify-album-wrapper">
                    <img src="/public/最伟大的作品.jpg" alt="Album" class="s-img" onerror="this.style.backgroundColor='#333'">
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
                    <span class="card-name">Google 搜索 </span>
                  </div>
                  <div class="card-arrow-btn"><arrow-right-outlined /></div>
                </div>
                <p class="card-desc"> 无需打开浏览器，直接从 Notion Mate 探索世界。</p>
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
                <p class="card-desc"> 捕捉瞬时灵感，无缝存入您的知识库。</p>
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
            <p> 为速度而生，为 Notion 爱好者而造。</p>
          </footer>
        </section>
      </div>

      <!-- 视图 2: Integrations Page ( 集成页 ) -->
      <div v-else-if="viewMode === 'store'" key="store" class="store-view">
        <div class="store-bg-glow"></div>
        <div class="store-content-wrapper">
          <div class="store-icon-cloud">
            <div class="cloud-row row-top">
              <div class="store-app-icon icon-blur-2 bg-green-douban"><img src="/douban.png" class="notion-n" alt="douban"></div>
              <div class="store-app-icon icon-blur-1 icon-figma bg-black"><img src="/apple-tv.png" class="notion-n" alt="apple-tv"></div>
              <div class="store-app-icon icon-focus icon-notion"><img src="/notion.png" class="notion-n" alt="Notion"></div>
              <div class="store-app-icon icon-blur-1 icon-spotify bg-white"><img src="/netflix.png" class="notion-n" alt="netflix"></div>
              <div class="store-app-icon icon-blur-2 icon-vscode bg-red"><img src="/网易云.png" class="notion-n" alt="网易云"></div>
            </div>
            <div class="cloud-row row-bottom">
              <div class="store-app-icon icon-blur-2 icon-google bg-white"><img src="/notion-calendar.png" class="notion-n" alt="notion-calendar"></div>
              <div class="store-app-icon icon-blur-1 icon-arc bg-white"><img src="/google-calendar.png" class="notion-n" alt="google-calendar"></div>
              <div class="store-app-icon icon-blur-2 icon-slack bg-white"><img src="/wechat-pay.png" class="notion-n" alt=" 微信支付 "></div>
            </div>
          </div>
          <div class="store-hero-text">
            <h1 class="store-title"> 原生集成 </h1>
            <p class="store-subtitle"> 不仅仅是连接，更是智能数据中枢，构建自动化第二大脑 </p>
          </div>
          <div class="top-picks-section">
            <div class="picks-grid">
              <a href="https://www.notion.com/zh-cn" target="_blank" class="pick-card glass-card">
                <div class="pick-icon-wrapper bg-white"><img src="/notion.png" class="pick-icon"></div>
                <h3 class="pick-name">Notion</h3>
                <p class="pick-desc"> 一款集笔记、任务管理、数据库和团队协作于一体的全平台工作空间应用。</p>
              </a>
              <a href="https://www.douban.com/" target="_blank" class="pick-card glass-card">
                <div class="pick-icon-wrapper bg-green-douban"><img src="/douban.png" class="pick-icon"></div>
                <h3 class="pick-name"> 豆瓣 </h3>
                <p class="pick-desc"> 豆瓣网是一家基于用户对于图书、电影和音乐兴趣而搭建的社交网站。</p>
              </a>
              <a href="https://www.apple.com/apple-books/" target="_blank" class="pick-card glass-card">
                <div class="pick-icon-wrapper bg-ibook"><img src="/ibooks.png" class="pick-icon"></div>
                <h3 class="pick-name">iBooks</h3>
                <p class="pick-desc"> 苹果公司开发的内建应用，主要用于阅读和收听书籍及有声读物。</p>
              </a>

              <a href="https://www.apple.com/apple-tv/" target="_blank" class="pick-card glass-card">
                <div class="pick-icon-wrapper bg-black">
                  <img src="/apple-tv.png" class="pick-icon">
                </div>
                <h3 class="pick-name">Apple TV</h3>
                <p class="pick-desc">Apple TV 是苹果公司推出的流媒体播放器 </p>
              </a>

              <a href="https://www.netflix.com/hk/" target="_blank" class="pick-card glass-card">
                <div class="pick-icon-wrapper bg-white">
                  <img src="/netflix.png" class="pick-icon">
                </div>
                <h3 class="pick-name">Netflix</h3>
                <p class="pick-desc"> 美国会员订阅制的流媒体播放平台 </p>
              </a>

              <a href="https://music.apple.com/cn/new" target="_blank" class="pick-card glass-card">
                <div class="pick-icon-wrapper bg-apple-music">
                  <img src="/apple-music.png" class="pick-icon">
                </div>
                <h3 class="pick-name">Apple Music</h3>
                <p class="pick-desc">Apple Music 是苹果公司推出的一项流媒体音乐服务，提供数千万首歌曲的在线收听、下载和个性化推荐功能 </p>
              </a>

              <a href="https://open.spotify.com/" target="_blank" class="pick-card glass-card">
                <div class="pick-icon-wrapper bg-white">
                  <img src="/spotify.png" class="pick-icon">
                </div>
                <h3 class="pick-name">Spotify</h3>
                <p class="pick-desc"> 是一家全球领先的音乐流媒体服务平台，提供丰富的音乐库和多种订阅模式，用户可享受免费或付费的音乐体验 </p>
              </a>

              <a href="https://y.qq.com/" target="_blank" class="pick-card glass-card">
                <div class="pick-icon-wrapper bg-white">
                  <img src="/qq-music.png" class="pick-icon">
                </div>
                <h3 class="pick-name">QQ 音乐 </h3>
                <p class="pick-desc">QQ 音乐是腾讯音乐娱乐集团旗下的音乐流媒体平台，成立于 2005 年，提供丰富的音乐内容和多样化的服务 </p>
              </a>

              <a href="https://music.163.com/" target="_blank" class="pick-card glass-card">
                <div class="pick-icon-wrapper bg-red">
                  <img src="/网易云.png" class="pick-icon">
                </div>
                <h3 class="pick-name"> 网易云音乐 </h3>
                <p class="pick-desc"> 网易云音乐是一款由网易开发的在线音乐平台，致力于为用户提供丰富的音乐内容和社交体验 </p>
              </a>

              <a href="https://www.notion.com/zh-cn/product/calendar" target="_blank" class="pick-card glass-card">
                <div class="pick-icon-wrapper bg-white">
                  <img src="/notion-calendar.png" class="pick-icon">
                </div>
                <h3 class="pick-name">Notion Calendar</h3>
                <p class="pick-desc"> 是 Notion 推出的一款新产品，它能够将 Notion 数据库 和 Google Calendar 整合在一起，形成一个集中管理的日历工具。用户可以通过谷歌账号登录，支持多平台使用，方便管理工作和个人生活的活动。</p>
              </a>

              <a href="https://calendar.google.com/calendar/u/0/r?pli=1" target="_blank" class="pick-card glass-card">
                <div class="pick-icon-wrapper bg-white">
                  <img src="/google-calendar.png" class="pick-icon">
                </div>
                <h3 class="pick-name">Google Calendar</h3>
                <p class="pick-desc"> 是谷歌提供的一个强大的时间管理和调度工具，旨在帮助用户高效安排和管理日常活动 </p>
              </a>

              <a href="https://pay.weixin.qq.com/" target="_blank" class="pick-card glass-card">
                <div class="pick-icon-wrapper bg-white">
                  <img src="/wechat-pay.png" class="pick-icon">
                </div>
                <h3 class="pick-name"> 微信支付 </h3>
                <p class="pick-desc"> 微信支付是腾讯推出的一种便捷的移动支付方式，支持多种支付场景，已成为中国领先的第三方支付平台之一 </p>
              </a>

              <a href="https://www.alipay.com/" target="_blank" class="pick-card glass-card">
                <div class="pick-icon-wrapper bg-white">
                  <img src="/alipay.png" class="pick-icon">
                </div>
                <h3 class="pick-name"> 支付宝 </h3>
                <p class="pick-desc"> 支付宝是中国领先的第三方支付平台，成立于 2004 年，提供安全、便捷的在线支付解决方案，涵盖支付、理财、生活服务等多个领域 </p>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- 视图 3: Download Page ( 下载页 ) -->
      <div v-else-if="viewMode === 'download'" key="download" class="download-view">
        <div class="download-bg-glow"></div>
        <div class="download-container">
          <div class="download-header">
            <h1 class="download-title"> 跨越平台，如影随形 </h1>
            <p class="download-subtitle"> 为每一处平台打造的原生体验，尽享 Notion Mate 的极速快感 </p>
          </div>
          <div class="primary-dl-card">
            <div class="primary-content">
              <div class="os-icon-large mac-icon"><apple-filled /></div>
              <div class="dl-info">
                <h2 class="dl-os-name">macOS</h2>
                <p class="dl-os-desc"> 支持 Apple Silicon 和 Intel 芯片 </p>
                <div class="dl-meta"><span class="version-badge">v1.68.0</span><span class="req-text"> 需要 macOS 12+</span></div>
              </div>
              <div class="dl-actions">
                <button class="dl-btn-primary"><span class="btn-txt"> 下载 Mac 版本 </span></button>
              </div>
            </div>
            <div class="primary-visual">
              <div class="app-window-mock scale-in">
                <div class="win-bar"><search-outlined class="win-search-icon" /><div class="win-search-text"> 搜索 Notion Mate...</div></div>
                <div class="win-list">
                  <div class="win-item active"><div class="item-left"><sync-outlined class="item-icon" /><span class="item-text"> 同步数据中心 </span></div><span class="item-key">↵</span></div>
                  <div class="win-item"><div class="item-left"><video-camera-filled class="item-icon" /><span class="item-text"> 管理书影音库 </span></div></div>
                  <div class="win-item"><div class="item-left"><bank-outlined class="item-icon" /><span class="item-text"> 记录个人财务 </span></div></div>
                </div>
              </div>
            </div>
          </div>
          <div class="platforms-grid">
            <div class="plat-item-card win-card"><div class="plat-icon-box win-icon"><windows-filled /></div><div class="plat-details"><h3>Windows</h3><p>Windows 10/11</p></div><button class="plat-dl-btn"> 下载 </button></div>
            <div class="plat-item-card ios-card"><div class="plat-icon-box ios-icon"><apple-filled /></div><div class="plat-details"><h3>iOS</h3><p>iPhone & iPad</p></div><button class="plat-dl-btn">App Store</button></div>
            <div class="plat-item-card android-card"><div class="plat-icon-box android-icon"><android-filled /></div><div class="plat-details"><h3>Android</h3><p>Android 10+</p></div><button class="plat-dl-btn">Google Play</button></div>
            <div class="plat-item-card linux-card coming-soon"><div class="plat-icon-box linux-icon"><code-filled /></div><div class="plat-details"><h3>Linux</h3><p style="opacity: 0; pointer-events: none;">Coming Soon</p></div><button class="plat-dl-btn disabled"> 敬请期待 </button></div>
          </div>
        </div>
      </div>

      <!-- ================= 视图 4: Changelog Page ( 更新日志页 ) ================= -->
      <div v-else-if="viewMode === 'changelog'" key="changelog" class="changelog-view">
        <div class="changelog-bg-glow"></div>

        <div class="changelog-container">
          <header class="cl-header">
            <h1 class="cl-title"> 进化历程 </h1>
            <p class="cl-subtitle"> 持续迭代，只为打造最极致的 Notion 伴侣体验。</p>
          </header>

          <div class="timeline-wrapper">
            <div class="timeline-line"></div>

            <!-- Release 1.68.0 -->
            <div class="release-item current-release">
              <div class="release-meta">
                <span class="r-version">v1.68.0</span>
                <span class="r-date">2023.10.24</span>
                <div class="latest-badge">LATEST</div>
              </div>
              <div class="release-dot dot-active">
                <div class="dot-inner"></div>
              </div>
              <div class="release-content glass-card-premium">
                <div class="rc-header">
                  <h3 class="rc-title"> 全新集成生态 </h3>
                  <div class="rc-tags">
                    <span class="tag tag-new">New</span>
                    <span class="tag tag-impr">Core</span>
                  </div>
                </div>
                <p class="rc-desc"> 在这个版本中，我们极大地扩展了 Notion Mate 的边界。新增了对 Apple Music、 Netflix 和 Google Calendar 的原生支持，让您的娱乐与工作流无缝连接。</p>
                <ul class="rc-list">
                  <li><span class="li-icon"> ✨ </span> 新增 10+ 个流媒体平台数据同步支持。</li>
                  <li><span class="li-icon"> ⚡️</span> 重构了同步引擎，速度提升 40%。</li>
                  <li><span class="li-icon"> 🎨 </span> 优化了暗黑模式下的视觉体验。</li>
                </ul>
              </div>
            </div>

            <!-- Release 1.67.5 -->
            <div class="release-item">
              <div class="release-meta">
                <span class="r-version">v1.67.5</span>
                <span class="r-date">2023.10.10</span>
              </div>
              <div class="release-dot"></div>
              <div class="release-content glass-card-premium">
                <div class="rc-header">
                  <h3 class="rc-title"> 书影音自动化升级 </h3>
                  <div class="rc-tags">
                    <span class="tag tag-fix">Fix</span>
                  </div>
                </div>
                <p class="rc-desc"> 专注于修复用户反馈的元数据抓取问题，并增强了对豆瓣新版页面的解析能力。</p>
                <ul class="rc-list">
                  <li><span class="li-icon"> 🐛 </span> 修复了部分书籍封面无法获取的高清图源问题。</li>
                  <li><span class="li-icon"> 🖥️</span> 解决了 macOS Sonoma 下的窗口对齐 Bug。</li>
                </ul>
              </div>
            </div>

            <!-- Release 1.66.0 -->
            <div class="release-item">
              <div class="release-meta">
                <span class="r-version">v1.66.0</span>
                <span class="r-date">2023.09.28</span>
              </div>
              <div class="release-dot"></div>
              <div class="release-content glass-card-premium">
                <div class="rc-header">
                  <h3 class="rc-title"> 智能财务看板 </h3>
                  <div class="rc-tags">
                    <span class="tag tag-new">New</span>
                  </div>
                </div>
                <p class="rc-desc"> 引入了全新的财务数据可视化模块。现在，您可以直接在 Notion Mate 中预览您的收支趋势，并自动生成月度报表同步至 Notion。</p>
              </div>
            </div>

          </div>

          <div class="cl-footer">
            <p> 更多历史版本请查看 <a href="#" class="cl-link">GitHub Releases</a></p>
          </div>
        </div>
      </div>

    </transition>

    <!-- ================= 视图 5: Auth Wrapper (Auth/Forgot/Register) ================= -->
    <!-- 独立层级，全屏覆盖，增加 mode=out-in 以响应平滑淡出重定向 -->
    <transition name="fade-slow">
      <!-- 只要是认证相关的页面，都共用这个 Wrapper -->
      <div v-if="['auth', 'forgot-password', 'register', 'phone-login'].includes(viewMode)" class="auth-wrapper-new">
        <div class="auth-card-new">

          <!-- 全局关闭按钮 (移至最外层结构中，使其独立悬浮) -->
          <button class="close-auth-btn" @click="viewMode = 'landing'" aria-label="关闭">
            <close-outlined />
          </button>

          <!-- 左侧：视觉区域 ( 带轮播 ) -->
          <div class="auth-visual-side">
            <!-- 轮播背景图层 -->
            <div class="carousel-bg-wrapper">
              <transition-group name="fade-slide">
                <div v-for="(slide, index) in slides"
                     :key="index"
                     v-show="currentSlide === index"
                     class="carousel-slide"
                     :style="{ backgroundImage: `url(${slide.image})` }">
                </div>
              </transition-group>
            </div>

            <div class="visual-overlay"></div>

            <!-- Logo Badge -->
            <div class="auth-logo-badge">
              <img src="/notion-mate-dark.png" class="logo-svg">
              <span>Notion Mate</span>
            </div>

            <!-- Bottom Text Content (Dynamic) -->
            <div class="visual-content">
              <transition name="fade-text" mode="out-in">
                <div :key="currentSlide" class="slide-text-group">
                  <h2 class="visual-heading">{{ slides[currentSlide].title }}</h2>
                  <p class="visual-desc">{{ slides[currentSlide].desc }}</p>
                </div>
              </transition>

              <!-- Carousel Indicators -->
              <div class="visual-dots">
                <div v-for="(slide, index) in slides" :key="index"
                     class="dot-wrapper" @click="setSlide(index)">
                  <div class="dot-progress" :class="{ 'animating': currentSlide === index }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：表单区域包裹器 ( 固定的外壳，不滚动 ) -->
          <div class="auth-form-side">

            <!-- 移动端专属顶部导航栏 (Native App Header Style) -->
            <div class="mobile-auth-header">
              <!-- 仅在非登录页时显示后退箭头，且永远只回退到 auth (登录) 表单，模拟原生应用流 -->
              <button class="mobile-back-icon" v-if="viewMode !== 'auth'" @click="viewMode = 'auth'">
                <arrow-left-outlined />
              </button>
            </div>

            <!-- 内部独立滚动区域 ( 携带淡入淡出遮罩 ) -->
            <div class="auth-scroll-area" ref="authScrollRef" @scroll="handleAuthScroll">
              <div class="form-scroll-container">

                <!-- A. 登录表单 (Login Form) -->
                <transition name="fade-slow" mode="out-in">
                  <div v-if="viewMode === 'auth'" key="login-form" class="auth-inner-box">
                    <div class="form-header-new">
                      <h2 class="welcome-title"> 欢迎回来 👋 </h2>
                      <p class="welcome-sub"> 请登录您的账户以继续 </p>
                    </div>

                    <div class="form-fields-new">
                      <!-- Username Input -->
                      <div class="input-group">
                        <label> 用户名 </label>
                        <div class="input-wrapper" :class="{ 'has-error': errors.username }">
                          <user-outlined class="input-prefix-icon" />
                          <input
                              type="text"
                              placeholder=" 请输入用户名 "
                              v-model="formState.username"
                              @blur="handleInputBlur('username')"
                              @input="errors.username = ''"
                          >
                        </div>
                        <transition name="slide-fade">
                          <span class="error-message" v-if="errors.username">{{ errors.username }}</span>
                        </transition>
                      </div>

                      <!-- Password Input -->
                      <div class="input-group">
                        <label> 密码 </label>
                        <div class="input-wrapper" :class="{ 'has-error': errors.password }">
                          <lock-outlined class="input-prefix-icon" />
                          <input
                              :type="showPassword ? 'text' : 'password'"
                              placeholder=" 请输入密码 "
                              v-model="formState.password"
                              @blur="handleInputBlur('password')"
                              @input="errors.password = ''"
                              @keyup.enter="handleLogin"
                          >
                          <span class="input-suffix-icon" @click="togglePassword">
                            <eye-outlined v-if="showPassword" />
                            <eye-invisible-outlined v-else />
                          </span>
                        </div>
                        <transition name="slide-fade">
                          <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
                        </transition>
                      </div>

                      <!-- Forgot Password Link -->
                      <div class="form-actions-row" style="justify-content: flex-end;">
                        <a href="#" class="forgot-link" @click.prevent="viewMode = 'forgot-password'; forgotStep = 1; clearForgotForm()"> 忘记密码？</a>
                      </div>

                      <!-- Login Button (包含丝滑成功动效逻辑) -->
                      <button class="auth-btn-primary" :class="{'is-loading': isLoading, 'is-success': isLoginSuccess}" @click="handleLogin" :disabled="isLoading || isLoginSuccess">
                        <template v-if="isLoginSuccess">
                          <check-outlined class="success-pop-icon" />
                        </template>
                        <template v-else-if="!isLoading"> 登 录 </template>
                        <loading-outlined v-else class="spin-icon" spin />
                      </button>

                      <!-- Divider -->
                      <div class="auth-divider">
                        <span> 快速登录 </span>
                      </div>

                      <!-- Social Buttons -->
                      <div class="social-row">
                        <button class="auth-btn-secondary" @click="viewMode = 'phone-login'; clearPhoneLoginForm()">
                          <mobile-outlined class="s-icon" />
                          手机号登录
                        </button>
                      </div>

                      <!-- Register Footer -->
                      <div class="auth-footer-text">
                        还没有账户？ <a href="#" class="register-link" @click.prevent="viewMode = 'register'"> 立即注册 </a>
                      </div>
                    </div>
                  </div>

                  <!-- D. 手机号登录表单 (Phone Login Form) -->
                  <div v-else-if="viewMode === 'phone-login'" key="phone-login-form" class="auth-inner-box">
                    <div class="form-header-new">
                      <h2 class="welcome-title"> 快捷登录</h2>
                      <p class="welcome-sub"> 通过手机号登录 </p>
                    </div>

                    <div class="form-fields-new">
                      <!-- Step 1: Phone -->
                      <div class="input-group">
                        <label> 手机号码 </label>
                        <div class="input-wrapper" :class="{ 'has-error': phoneLoginErrors.phone }" style="padding-right: 8px;">
                          <mobile-outlined class="input-prefix-icon" />
                          <input
                              type="text"
                              placeholder=" 请输入手机号码 "
                              v-model="phoneLoginForm.phone"
                              @input="phoneLoginErrors.phone = ''"
                          >
                          <button class="sms-btn" :disabled="smsCountdown > 0" @click="handleSendLoginSms">
                            {{ smsCountdown > 0 ? `${smsCountdown}s` : ' 获取验证码 ' }}
                          </button>
                        </div>
                        <transition name="slide-fade">
                          <span class="error-message" v-if="phoneLoginErrors.phone">{{ phoneLoginErrors.phone }}</span>
                        </transition>
                      </div>

                      <!-- Step 2: Code -->
                      <div class="input-group">
                        <label> 验证码 </label>
                        <div class="otp-box-container">
                          <input
                              v-for="(digit, index) in 6"
                              :key="index"
                              :ref="el => { if(el) otpInputRefs[index] = el as HTMLInputElement }"
                              v-model="otpDigits[index]"
                              type="text"
                              maxlength="1"
                              class="otp-input"
                              :class="{ 'has-error': phoneLoginErrors.code }"
                              @input="handleOtpInput(index, $event, true)"
                              @keydown="handleOtpKeyDown(index, $event, true)"
                              @paste="e => handleOtpPaste(e, true)"
                          />
                        </div>
                        <transition name="slide-fade">
                          <span class="error-message" v-if="phoneLoginErrors.code">{{ phoneLoginErrors.code }}</span>
                        </transition>
                      </div>

                      <button class="auth-btn-primary" :class="{'is-loading': isLoading, 'is-success': isLoginSuccess}" @click="handlePhoneLogin" :disabled="isLoading || isLoginSuccess">
                        <template v-if="isLoginSuccess">
                          <check-outlined class="success-pop-icon" />
                        </template>
                        <template v-else-if="!isLoading"> 登 录 </template>
                        <loading-outlined v-else class="spin-icon" spin />
                      </button>

                      <div class="auth-footer-text">
                        <a href="#" class="register-link" @click.prevent="viewMode = 'auth'"> 返回账密登录 </a>
                      </div>
                    </div>
                  </div>

                  <!-- B. 忘记密码表单 (Forgot Password Form) -->
                  <div v-else-if="viewMode === 'forgot-password'" key="forgot-form" class="auth-inner-box">
                    <div class="form-header-new">
                      <h2 class="welcome-title">{{ forgotStep === 1 ? ' 安全验证 ' : ' 重置密码 ' }}</h2>
                      <p class="welcome-sub">
                        {{ forgotStep === 1 ? ' 请验证您的手机号以继续 ' : ' 设置您的新密码 ' }}
                      </p>
                    </div>

                    <div class="form-fields-new">
                      <!-- Step 1: Phone & Code -->
                      <template v-if="forgotStep === 1">
                        <div class="input-group">
                          <label> 手机号码 </label>
                          <div class="input-wrapper" :class="{ 'has-error': forgotErrors.phone }" style="padding-right: 8px;">
                            <mobile-outlined class="input-prefix-icon" />
                            <input
                                type="text"
                                placeholder=" 请输入手机号码 "
                                v-model="forgotForm.phone"
                                @blur="handleResetInputBlur('phone')"
                                @input="forgotErrors.phone = ''"
                            >
                            <button class="sms-btn" :disabled="smsCountdown > 0" @click="handleSendSms">
                              {{ smsCountdown > 0 ? `${smsCountdown}s` : ' 获取验证码 ' }}
                            </button>
                          </div>
                          <transition name="slide-fade">
                            <span class="error-message" v-if="forgotErrors.phone">{{ forgotErrors.phone }}</span>
                          </transition>
                        </div>

                        <div class="input-group">
                          <label> 验证码 </label>
                          <div class="otp-box-container">
                            <input
                                v-for="(digit, index) in 6"
                                :key="index"
                                :ref="el => { if(el) otpInputRefs[index] = el as HTMLInputElement }"
                                v-model="otpDigits[index]"
                                type="text"
                                maxlength="1"
                                class="otp-input"
                                :class="{ 'has-error': forgotErrors.code }"
                                @input="handleOtpInput(index, $event)"
                                @keydown="handleOtpKeyDown(index, $event)"
                                @paste="handleOtpPaste"
                            />
                          </div>
                          <transition name="slide-fade">
                            <span class="error-message" v-if="forgotErrors.code">{{ forgotErrors.code }}</span>
                          </transition>
                        </div>

                        <button class="auth-btn-primary" :class="{'is-loading': isLoading}" @click="handleVerifyNext" :disabled="isLoading">
                          <template v-if="!isLoading"> 下一步 </template>
                          <loading-outlined v-else class="spin-icon" spin />
                        </button>
                      </template>

                      <!-- Step 2: New Password ( 换行独立显示 ) -->
                      <template v-else>
                        <div class="input-group">
                          <label> 新密码 </label>
                          <div class="input-wrapper" :class="{ 'has-error': forgotErrors.newPassword }">
                            <lock-outlined class="input-prefix-icon" />
                            <input
                                :type="showNewPassword ? 'text' : 'password'"
                                placeholder=" 请输入新密码 "
                                v-model="forgotForm.newPassword"
                                @blur="handleResetInputBlur('newPassword')"
                                @input="forgotErrors.newPassword = ''"
                            >
                            <span class="input-suffix-icon" @click="showNewPassword = !showNewPassword">
                              <eye-outlined v-if="showNewPassword" />
                              <eye-invisible-outlined v-else />
                            </span>
                          </div>

                          <!-- 密码强度指示器 -->
                          <div class="password-strength-container" v-if="forgotForm.newPassword">
                            <div class="strength-bars">
                              <div class="strength-segment" :class="{ active: passwordStrength >= 1, [strengthLevel]: passwordStrength >= 1 }"></div>
                              <div class="strength-segment" :class="{ active: passwordStrength >= 2, [strengthLevel]: passwordStrength >= 2 }"></div>
                              <div class="strength-segment" :class="{ active: passwordStrength >= 3, [strengthLevel]: passwordStrength >= 3 }"></div>
                              <div class="strength-segment" :class="{ active: passwordStrength >= 4, [strengthLevel]: passwordStrength >= 4 }"></div>
                            </div>
                            <span class="strength-label" :class="strengthClass">{{ strengthLabel }}</span>
                          </div>

                          <transition name="slide-fade">
                            <span class="error-message" v-if="forgotErrors.newPassword">{{ forgotErrors.newPassword }}</span>
                          </transition>
                        </div>

                        <div class="input-group">
                          <label> 确认密码 </label>
                          <div class="input-wrapper" :class="{ 'has-error': forgotErrors.confirmPassword }">
                            <check-outlined class="input-prefix-icon" />
                            <input
                                :type="showConfirmPassword ? 'text' : 'password'"
                                placeholder=" 请再次输入 "
                                v-model="forgotForm.confirmPassword"
                                @blur="handleResetInputBlur('confirmPassword')"
                                @input="forgotErrors.confirmPassword = ''"
                            >
                            <span class="input-suffix-icon" @click="showConfirmPassword = !showConfirmPassword">
                              <eye-outlined v-if="showConfirmPassword" />
                              <eye-invisible-outlined v-else />
                            </span>
                          </div>
                          <transition name="slide-fade">
                            <span class="error-message" v-if="forgotErrors.confirmPassword">{{ forgotErrors.confirmPassword }}</span>
                          </transition>
                        </div>

                        <button class="auth-btn-primary" :class="{'is-loading': isLoading}" @click="handleResetConfirm" :disabled="isLoading">
                          <template v-if="!isLoading"> 确认修改 </template>
                          <loading-outlined v-else class="spin-icon" spin />
                        </button>
                      </template>

                      <div class="auth-footer-text">
                        <a href="#" class="register-link" @click.prevent="viewMode = 'auth'"> 返回登录 </a>
                      </div>
                    </div>
                  </div>

                  <!-- C. 注册表单 (Register Form) -->
                  <div v-else-if="viewMode === 'register'" key="register-form" class="auth-inner-box">
                    <div class="form-header-new">
                      <h2 class="welcome-title"> 创建账户</h2>
                      <p class="welcome-sub"> 免费开始您的 Notion Mate 之旅 </p>
                    </div>

                    <div class="form-fields-new">
                      <!-- Avatar Upload -->
                      <div class="avatar-upload-container">
                        <div class="avatar-wrapper" @click="triggerFileInput">
                          <img v-if="registerForm.avatar" :src="avatarPreviewUrl" class="avatar-img" />
                          <div v-else class="avatar-placeholder" :style="{ backgroundColor: registerForm.nickname ? '#2563eb' : '#e5e7eb' }">
                            <span class="avatar-char">{{ generatedAvatarChar }}</span>
                          </div>
                          <div class="avatar-overlay">
                            <camera-filled class="camera-icon" />
                          </div>
                        </div>
                        <input type="file" ref="fileInput" accept="image/*" style="display: none" @change="handleFileChange" />
                      </div>

                      <!-- Username & Nickname ( 使用 Grid 强制 1:1 等分 ) -->
                      <div class="form-row-group">
                        <div class="input-group flex-1">
                          <label> 用户名 </label>
                          <div class="input-wrapper" :class="{ 'has-error': registerErrors.username }">
                            <user-outlined class="input-prefix-icon" />
                            <input type="text" placeholder=" 用户名 " v-model="registerForm.username" @input="registerErrors.username = ''" />
                          </div>
                          <transition name="slide-fade">
                            <span class="error-message" v-if="registerErrors.username">{{ registerErrors.username }}</span>
                          </transition>
                        </div>

                        <div class="input-group flex-1">
                          <label> 昵称 </label>
                          <div class="input-wrapper" :class="{ 'has-error': registerErrors.nickname }">
                            <align-left-outlined class="input-prefix-icon" />
                            <input type="text" placeholder=" 昵称 " v-model="registerForm.nickname" @input="registerErrors.nickname = ''" />
                          </div>
                        </div>
                      </div>

                      <!-- Email 独立占据一行 -->
                      <div class="input-group">
                        <label> 电子邮箱 </label>
                        <div class="input-wrapper" :class="{ 'has-error': registerErrors.email }">
                          <mail-outlined class="input-prefix-icon" />
                          <input type="email" placeholder=" name@example.com " v-model="registerForm.email" @input="registerErrors.email = ''" />
                        </div>
                        <transition name="slide-fade">
                          <span class="error-message" v-if="registerErrors.email">{{ registerErrors.email }}</span>
                        </transition>
                      </div>

                      <!-- Phone 独立占据一行 -->
                      <div class="input-group">
                        <label> 手机号码 </label>
                        <div class="input-wrapper" :class="{ 'has-error': registerErrors.phone }" style="padding-right: 8px;">
                          <mobile-outlined v-if="!isPhoneVerified" class="input-prefix-icon" />
                          <check-outlined v-else class="success-prefix-icon" />
                          <input
                              type="text"
                              placeholder=" 输入手机号 "
                              v-model="registerForm.phone"
                              :disabled="isPhoneVerified"
                              @input="registerErrors.phone = ''"
                          >
                          <span v-if="isPhoneVerified" class="verified-badge"> 已验证 </span>
                          <button v-else class="sms-btn" :disabled="registerSmsCountdown > 0" @click="handleRegisterSms">
                            {{ registerSmsCountdown > 0 ? `${registerSmsCountdown}s` : ' 获取验证码 ' }}
                          </button>
                        </div>
                        <transition name="slide-fade">
                          <span class="error-message" v-if="registerErrors.phone">{{ registerErrors.phone }}</span>
                        </transition>
                      </div>

                      <!-- Verification Code -->
                      <transition name="slide-fade">
                        <div class="input-group" v-if="showRegisterCodeInput">
                          <label> 验证码 </label>
                          <div class="otp-box-container">
                            <input
                                v-for="(digit, index) in 6"
                                :key="index"
                                :ref="el => { if(el) otpInputRefs[index] = el as HTMLInputElement }"
                                v-model="otpDigits[index]"
                                type="text"
                                maxlength="1"
                                class="otp-input"
                                :class="{ 'has-error': registerErrors.code }"
                                @input="handleOtpInput(index, $event)"
                                @keydown="handleOtpKeyDown(index, $event)"
                                @paste="handleOtpPaste"
                            />
                          </div>
                          <transition name="slide-fade">
                            <span class="error-message" v-if="registerErrors.code">{{ registerErrors.code }}</span>
                          </transition>
                        </div>
                      </transition>

                      <!-- Password ( 独立占据一行 ) -->
                      <div class="input-group">
                        <label> 设置密码 </label>
                        <div class="input-wrapper" :class="{ 'has-error': registerErrors.password }">
                          <lock-outlined class="input-prefix-icon" />
                          <input :type="showPassword ? 'text' : 'password'" placeholder=" 至少 8 位字符 " v-model="registerForm.password" @input="registerErrors.password = ''" />
                          <span class="input-suffix-icon" @click="showPassword = !showPassword">
                            <eye-outlined v-if="showPassword" />
                            <eye-invisible-outlined v-else />
                          </span>
                        </div>

                        <!-- Password Strength -->
                        <div class="password-strength-container" v-if="registerForm.password">
                          <div class="strength-bars">
                            <div class="strength-segment" :class="{ active: registerPasswordStrength >= 1, [registerStrengthLevel]: registerPasswordStrength >= 1 }"></div>
                            <div class="strength-segment" :class="{ active: registerPasswordStrength >= 2, [registerStrengthLevel]: registerPasswordStrength >= 2 }"></div>
                            <div class="strength-segment" :class="{ active: registerPasswordStrength >= 3, [registerStrengthLevel]: registerPasswordStrength >= 3 }"></div>
                            <div class="strength-segment" :class="{ active: registerPasswordStrength >= 4, [registerStrengthLevel]: registerPasswordStrength >= 4 }"></div>
                          </div>
                          <span class="strength-label" :class="registerStrengthClass">{{ registerStrengthLabel }}</span>
                        </div>

                        <transition name="slide-fade">
                          <span class="error-message" v-if="registerErrors.password">{{ registerErrors.password }}</span>
                        </transition>
                      </div>

                      <!-- Confirm Password ( 独立占据一行 ) -->
                      <div class="input-group">
                        <label> 确认密码 </label>
                        <div class="input-wrapper" :class="{ 'has-error': registerErrors.confirmPassword }">
                          <check-outlined class="input-prefix-icon" />
                          <input :type="showConfirmPassword ? 'text' : 'password'" placeholder=" 请再次输入密码 " v-model="registerForm.confirmPassword" @blur="handleRegisterInputBlur('confirmPassword')" @input="registerErrors.confirmPassword = ''" />
                          <span class="input-suffix-icon" @click="showConfirmPassword = !showConfirmPassword">
                            <eye-outlined v-if="showConfirmPassword" />
                            <eye-invisible-outlined v-else />
                          </span>
                        </div>
                        <transition name="slide-fade">
                          <span class="error-message" v-if="registerErrors.confirmPassword">{{ registerErrors.confirmPassword }}</span>
                        </transition>
                      </div>

                      <button class="auth-btn-primary" @click="handleRegister" :disabled="isLoading">
                        <template v-if="!isLoading"> 立即注册 </template>
                        <loading-outlined v-else class="spin-icon" spin />
                      </button>

                      <div class="auth-footer-text">
                        已有账户？ <a href="#" class="register-link" @click.prevent="viewMode = 'auth'; clearRegisterForm()"> 立即登录 </a>
                      </div>
                    </div>
                  </div>

                </transition>
              </div>
            </div> <!-- End scroll area -->

            <!-- 全新：智能向下滚动浮动提示 -->
            <transition name="fade-slow">
              <div class="scroll-bottom-hint" v-show="showScrollHint">
                <span class="hint-text">滑动查看更多</span>
                <down-outlined class="bounce-icon" />
              </div>
            </transition>

          </div>

        </div>
      </div>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import {
  DatabaseOutlined, AppleFilled, WindowsFilled, AndroidFilled, ArrowLeftOutlined, UserOutlined, LockOutlined, MailOutlined, GoogleCircleFilled,
  SearchOutlined, ArrowRightOutlined, FileTextFilled, LeftOutlined, RightOutlined, RadarChartOutlined, TranslationOutlined, CustomerServiceFilled, CheckOutlined,
  StepBackwardFilled, StepForwardFilled, CaretRightFilled, CodeFilled,DeploymentUnitOutlined, SyncOutlined, VideoCameraFilled, BankOutlined, EyeInvisibleOutlined, EyeOutlined, LoadingOutlined, MobileOutlined, AlignLeftOutlined,
  CameraFilled, CloseOutlined, DownOutlined
} from '@ant-design/icons-vue'
import { AppleAlert } from "@/components/common/AppleAlert.ts"
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user.ts'
import { sendCaptcha, verifyCaptcha, resetPassword, register } from '@/api/auth.ts'
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const viewMode = ref('landing')
const appStore = reactive({ isDark: true })
const extGridRef = ref<HTMLElement | null>(null)
const isLoading = ref(false)

const showMaskLeft = ref(false)
const showMaskRight = ref(false)

// 专门新增的控制登录成功动效的响应式变量
const isLoginSuccess = ref(false)

/* ----------------- 移动端默认视图逻辑 ----------------- */
// 专门针对移动端的视图拦截，强制手机用户初始直接显示登录窗
const checkMobileDefaultView = () => {
  if (window.innerWidth <= 768) {
    if (!['auth', 'forgot-password', 'register', 'phone-login'].includes(viewMode.value)) {
      viewMode.value = 'auth'
    }
  }
}

/* ----------------- Auto Scroll Hint Logic ( 轻量轮询，无惧动画干扰 ) ----------------- */
const authScrollRef = ref<HTMLElement | null>(null)
const showScrollHint = ref(false)
let scrollCheckInterval: ReturnType<typeof setInterval> | null = null

const handleAuthScroll = () => {
  if (!authScrollRef.value) return
  const { scrollTop, scrollHeight, clientHeight } = authScrollRef.value
  // 加入 15px 的容差，避免因为极微小的像素差导致滚动提示误显示
  showScrollHint.value = scrollHeight - (scrollTop + clientHeight) > 15
}

const startScrollCheck = () => {
  if (scrollCheckInterval) clearInterval(scrollCheckInterval)
  scrollCheckInterval = setInterval(handleAuthScroll, 300)
}

const stopScrollCheck = () => {
  if (scrollCheckInterval) {
    clearInterval(scrollCheckInterval)
    scrollCheckInterval = null
  }
}

/* ----------------- 全局表单清空逻辑 ----------------- */
const clearLoginForm = () => {
  formState.username = ''
  formState.password = ''
  errors.username = ''
  errors.password = ''
  showPassword.value = false
  isLoginSuccess.value = false
}

const clearPhoneLoginForm = () => {
  phoneLoginForm.phone = ''
  phoneLoginForm.code = ''
  for (let i = 0; i < 6; i++) otpDigits[i] = ''
  Object.keys(phoneLoginErrors).forEach(key => phoneLoginErrors[key as keyof typeof phoneLoginErrors] = '')
  smsCountdown.value = 0
  if (smsTimer) clearInterval(smsTimer)
  isLoginSuccess.value = false
}

const clearForgotForm = () => {
  forgotStep.value = 1
  forgotForm.phone = ''
  forgotForm.code = ''
  forgotForm.newPassword = ''
  forgotForm.confirmPassword = ''
  showNewPassword.value = false
  showConfirmPassword.value = false
  for (let i = 0; i < 6; i++) otpDigits[i] = ''
  Object.keys(forgotErrors).forEach(key => forgotErrors[key as keyof typeof forgotErrors] = '')
  smsCountdown.value = 0
  if (smsTimer) clearInterval(smsTimer)
}

const clearRegisterForm = () => {
  registerForm.username = ''
  registerForm.nickname = ''
  registerForm.email = ''
  registerForm.phone = ''
  registerForm.code = ''
  registerForm.password = ''
  registerForm.confirmPassword = ''
  registerForm.avatar = null as unknown as File
  Object.keys(registerErrors).forEach(key => registerErrors[key as keyof typeof registerErrors] = '')
  isPhoneVerified.value = false
  showRegisterCodeInput.value = false
  showPassword.value = false
  showConfirmPassword.value = false
  registerSmsCountdown.value = 0
  if (registerSmsTimer) { clearInterval(registerSmsTimer); registerSmsTimer = null }
  for (let i = 0; i < 6; i++) { otpDigits[i] = '' }
}

const clearAllAuthForms = () => {
  clearLoginForm()
  clearPhoneLoginForm()
  clearForgotForm()
  clearRegisterForm()
}

/* ----------------- Login Form Logic ----------------- */
const formState = reactive({ username: '', password: '' })
const errors = reactive({ username: '', password: '' })
const showPassword = ref(false)

const togglePassword = () => { showPassword.value = !showPassword.value }

const validateField = (field: 'username' | 'password') => {
  if (field === 'username') { errors.username = !formState.username.trim() ? '请输入用户名' : '' }
  if (field === 'password') { errors.password = !formState.password.trim() ? '请输入密码' : '' }
}

const handleInputBlur = (field: 'username' | 'password') => { validateField(field) }

const handleLogin = async () => {
  validateField('username')
  validateField('password')
  if (errors.username || errors.password) return
  isLoading.value = true

  setTimeout(async () => {
    try {
      await userStore.login({username:formState.username,password:formState.password})
      isLoading.value = false

      // 触发丝滑的登录成功绿勾动效
      isLoginSuccess.value = true
      AppleAlert.success("登录成功", "欢迎回来 : " + userStore.userInfo?.nickname)

      // 延迟等待成功态的绿色打勾动画播放完毕，再平滑关闭整个模态框
      setTimeout(() => {
        viewMode.value = 'landing'

        // 再延迟等待模态框淡出动画(约400ms)结束后，进行系统跳转或刷新
        setTimeout(() => {
          const redirect = route.query.redirect as string
          if (redirect && redirect !== '/') {
            router.push(redirect)
          } else {
            window.location.reload()
          }
        }, 400)
      }, 800)

    } catch (error: any){
      isLoading.value = false
      AppleAlert.error("登录失败", error.message)
    }
  }, 800)
}

/* ----------------- Forgot Password & Phone Login Logic (OTP 6-digits) ----------------- */
const forgotStep = ref(1)
const smsCountdown = ref(0)
let smsTimer: any = null

const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const otpDigits = reactive(['', '', '', '', '', ''])
const otpInputRefs = ref<HTMLInputElement[]>([])

const forgotForm = reactive({ phone: '', code: '', newPassword: '', confirmPassword: '' })
const forgotErrors = reactive({ phone: '', code: '', newPassword: '', confirmPassword: '' })

const phoneLoginForm = reactive({ phone: '', code: '' })
const phoneLoginErrors = reactive({ phone: '', code: '' })

const passwordStrength = computed(() => {
  const val = forgotForm.newPassword
  if (!val) return 0
  let score = 0
  if (val.length >= 8) score++
  if (/[A-Z]/.test(val)) score++
  if (/[0-9]/.test(val)) score++
  if (/[^A-Za-z0-9]/.test(val)) score++
  return score
})
const strengthLevel = computed(() => { const s = passwordStrength.value; if (s < 2) return 'weak'; if (s < 4) return 'medium'; return 'strong' })
const strengthLabel = computed(() => { const s = passwordStrength.value; if (s === 0) return ''; if (s < 2) return '安全性较弱'; if (s < 4) return '强度中等'; return '极其安全' })
const strengthClass = computed(() => { const s = passwordStrength.value; if (s < 2) return 'text-weak'; if (s < 4) return 'text-medium'; return 'text-strong' })

const syncCode = (isPhoneLogin = false) => {
  const code = otpDigits.join('')
  const mode = viewMode.value
  if (mode === 'phone-login') { phoneLoginForm.code = code; if (phoneLoginForm.code.length > 0) phoneLoginErrors.code = '' }
  else if (mode === 'forgot-password') { forgotForm.code = code; if (forgotForm.code.length > 0) forgotErrors.code = '' }
  else if (mode === 'register') { registerForm.code = code; if (registerForm.code.length > 0) registerErrors.code = '' }
}

const handleOtpInput = (index: number, e: Event, isPhoneLogin = false) => {
  const target = e.target as HTMLInputElement
  let val = target.value
  if (!/^\d*$/.test(val)) { otpDigits[index] = ''; return }
  if (val.length > 1) { val = val.slice(-1); otpDigits[index] = val }
  if (val && index < 5) { otpInputRefs.value[index + 1]?.focus() }
  syncCode(isPhoneLogin)
  if (viewMode.value === 'register' && otpDigits.join('').length === 6) { handleRegisterVerifyCode() }
}

const handleOtpKeyDown = (index: number, e: KeyboardEvent, isPhoneLogin = false) => {
  if (e.key === 'Backspace') {
    if (!otpDigits[index] && index > 0) {
      otpDigits[index - 1] = ''
      otpInputRefs.value[index - 1]?.focus()
      syncCode(isPhoneLogin)
    }
  }
}

const handleOtpPaste = (e: ClipboardEvent, isPhoneLogin = false) => {
  const pasteData = e.clipboardData?.getData('text') || ''
  if (!/^\d{6}$/.test(pasteData)) return
  e.preventDefault()
  const digits = pasteData.split('')
  digits.forEach((d, i) => { if (i < 6) otpDigits[i] = d })
  otpInputRefs.value[5]?.focus()
  syncCode(isPhoneLogin)
  if (viewMode.value === 'register' && otpDigits.join('').length === 6) { handleRegisterVerifyCode() }
}

const handleSendSms = async () => {
  const isPhoneLogin = viewMode.value === 'phone-login'
  const phone = isPhoneLogin ? phoneLoginForm.phone : forgotForm.phone
  const errorsObj = isPhoneLogin ? phoneLoginErrors : forgotErrors

  if (!phone) { errorsObj.phone = '请输入手机号码'; return }
  if (!/^1[3-9]\d{9}$/.test(phone)) { errorsObj.phone = '请输入有效的手机号码'; return }

  try {
    await sendCaptcha(phone)
    smsCountdown.value = 60
    AppleAlert.success("验证码发送成功", "请注意查收短信")
    smsTimer = setInterval(() => {
      smsCountdown.value--
      if (smsCountdown.value <= 0) clearInterval(smsTimer)
    }, 1000)
  } catch (error: any) { AppleAlert.error("验证码发送失败", error.message || "验证码发送失败，请稍后重试") }
}

const handleSendLoginSms = () => handleSendSms()

const handleVerifyNext = async () => {
  if (!forgotForm.phone) { return forgotErrors.phone = '请输入手机号码' }
  syncCode()
  if (!forgotForm.code) { return forgotErrors.code = '请输入验证码' }
  if (forgotForm.code.length !== 6) { return forgotErrors.code = '验证码格式错误' }
  isLoading.value = true
  try { await verifyCaptcha(forgotForm.phone, forgotForm.code); forgotStep.value = 2 }
  catch (error: any) { AppleAlert.error("验证失败", error.message || "验证码错误或已过期") }
  finally { isLoading.value = false }
}

const handlePhoneLogin = async () => {
  if (!phoneLoginForm.phone) { return phoneLoginErrors.phone = '请输入手机号码' }
  syncCode(true)
  if (!phoneLoginForm.code) { return phoneLoginErrors.code = '请输入验证码' }
  if (phoneLoginForm.code.length !== 6) { return phoneLoginErrors.code = '验证码格式错误' }

  isLoading.value = true
  setTimeout(async () => {
    try {
      await userStore.loginByPhone(phoneLoginForm.phone,phoneLoginForm.code)
      isLoading.value = false

      // 同步触发丝滑的绿勾动效
      isLoginSuccess.value = true
      AppleAlert.success("登录成功","欢迎回来 : " + userStore.userInfo?.nickname)

      setTimeout(() => {
        viewMode.value = 'landing'
        setTimeout(() => {
          const redirect = route.query.redirect as string
          if (redirect && redirect !== '/') {
            router.push(redirect)
          } else {
            window.location.reload()
          }
        }, 400)
      }, 800)

    }catch (error: any) {
      isLoading.value = false
      AppleAlert.error("登录失败",error.message)
    }
  },800)
}

const handleResetInputBlur = (field: 'newPassword' | 'confirmPassword' | 'phone') => {
  if (field === 'phone') {
    if (!forgotForm.phone) { forgotErrors.phone = '请输入手机号码' }
    else if (!/^1[3-9]\d{9}$/.test(forgotForm.phone)) { forgotErrors.phone = '请输入有效的手机号码' }
    else { forgotErrors.phone = '' }
  }
  if (field === 'newPassword') {
    if (!forgotForm.newPassword) { forgotErrors.newPassword = '请输入新密码' }
    else if (forgotForm.newPassword.length < 8) { forgotErrors.newPassword = '密码至少需要 8 位' }
    else { forgotErrors.newPassword = '' }
  }
  if (field === 'confirmPassword') {
    if (!forgotForm.confirmPassword) { forgotErrors.confirmPassword = '请再次输入新密码' }
    else if (forgotForm.newPassword !== forgotForm.confirmPassword) { forgotErrors.confirmPassword = '两次输入密码不一致' }
    else { forgotErrors.confirmPassword = '' }
  }
}

const handleResetConfirm = async () => {
  handleResetInputBlur('newPassword')
  handleResetInputBlur('confirmPassword')
  if (forgotErrors.newPassword || forgotErrors.confirmPassword) return
  isLoading.value = true
  try {
    await resetPassword(forgotForm.phone,forgotForm.code,forgotForm.newPassword,forgotForm.confirmPassword)
    AppleAlert.success("重置密码成功","您的密码已修改, 请重新登录")
    viewMode.value = 'auth'
  }catch (error: any) { AppleAlert.error("重置密码失败",error.message) }
  finally { isLoading.value = false }
}

/* ----------------- Register Logic ----------------- */
const registerForm = reactive({ username: '', nickname: '', email: '', phone: '', code: '', password: '', confirmPassword: '', avatar: null as unknown as File })
const registerErrors = reactive({ username: '', nickname: '', email: '', phone: '', code: '', password: '', confirmPassword: '' })
const isPhoneVerified = ref(false)
const showRegisterCodeInput = ref(false)
const registerSmsCountdown = ref(0)
let registerSmsTimer: any = null

const fileInput = ref<HTMLInputElement | null>(null)
const triggerFileInput = () => fileInput.value?.click()
const handleFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files[0]) { registerForm.avatar = files[0] }
}

const generateDefaultAvatar = async (): Promise<File> => {
  const canvas = document.createElement('canvas'); canvas.width = 200; canvas.height = 200;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#0A84FF'; ctx.fillRect(0, 0, 200, 200);
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 80px -apple-system, BlinkMacSystemFont, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const char = registerForm.nickname ? registerForm.nickname.charAt(0).toUpperCase() : 'U';
    ctx.fillText(char, 100, 100);
  }
  return new Promise((resolve) => { canvas.toBlob((blob) => { if (blob) { const file = new File([blob], 'default-avatar.png', { type: 'image/png' }); resolve(file); } }, 'image/png'); });
}

const generatedAvatarChar = computed(() => registerForm.nickname ? registerForm.nickname.charAt(0).toUpperCase() : 'U')
const avatarPreviewUrl = computed(() => registerForm.avatar ? URL.createObjectURL(registerForm.avatar) : '')

const registerPasswordStrength = computed(() => {
  const val = registerForm.password; if (!val) return 0; let score = 0
  if (val.length >= 8) score++; if (/[A-Z]/.test(val)) score++; if (/[0-9]/.test(val)) score++; if (/[^A-Za-z0-9]/.test(val)) score++; return score
})
const registerStrengthLevel = computed(() => { const s = registerPasswordStrength.value; if (s < 2) return 'weak'; if (s < 4) return 'medium'; return 'strong' })
const registerStrengthLabel = computed(() => { const s = registerPasswordStrength.value; if (s === 0) return ''; if (s < 2) return '安全性较弱'; if (s < 4) return '强度中等'; return '极其安全' })
const registerStrengthClass = computed(() => { const s = registerPasswordStrength.value; if (s < 2) return 'text-weak'; if (s < 4) return 'text-medium'; return 'text-strong' })

const handleRegisterSms = async () => {
  if (!registerForm.phone) { return registerErrors.phone = '请输入手机号码' }
  if (!/^1[3-9]\d{9}$/.test(registerForm.phone)) { return registerErrors.phone = '请输入有效的手机号码' }
  try {
    await sendCaptcha(registerForm.phone)
    showRegisterCodeInput.value = true
    for (let i = 0; i < 6; i++) otpDigits[i] = ''
    registerForm.code = ''
    registerSmsCountdown.value = 60
    AppleAlert.success("验证码发送成功", "请注意查收短信")
    registerSmsTimer = setInterval(() => { registerSmsCountdown.value--; if (registerSmsCountdown.value <= 0) clearInterval(registerSmsTimer) }, 1000)
  } catch (error: any) { AppleAlert.error("发送失败", error.message) }
}

const handleRegisterVerifyCode = async () => {
  syncCode()
  if (!registerForm.code) { return registerErrors.code = '请输入验证码' }
  try {
    await verifyCaptcha(registerForm.phone, registerForm.code)
    isPhoneVerified.value = true; showRegisterCodeInput.value = false
    AppleAlert.success("验证成功", "手机号已验证")
  } catch (error: any) { registerErrors.code = '验证码错误'; AppleAlert.error("验证失败", error.message) }
}

const handleRegister = async () => {
  if (!registerForm.username) registerErrors.username = '请输入用户名'
  if (!registerForm.nickname) registerErrors.nickname = '请输入昵称'
  if (!registerForm.email) registerErrors.email = '请输入电子邮箱'
  if (!registerForm.phone) registerErrors.phone = '请输入手机号码'
  if (!isPhoneVerified.value) registerErrors.phone = '请先验证手机号码'
  if (!registerForm.password) registerErrors.password = '请输入密码'
  if (registerForm.password !== registerForm.confirmPassword) registerErrors.confirmPassword = '两次密码不一致'
  if (Object.values(registerErrors).some(x => x)) return

  isLoading.value = true
  try {
    let avatarFile = registerForm.avatar; if (!avatarFile) { avatarFile = await generateDefaultAvatar(); }
    const registerData = { username: registerForm.username, nickname: registerForm.nickname, email: registerForm.email, phone: registerForm.phone, avatar: avatarFile, password: registerForm.password, confirmPassword: registerForm.confirmPassword, captcha: registerForm.code }
    await userStore.register(registerData)
    AppleAlert.success("注册成功", "请登录您的账户")
    viewMode.value = 'auth'
  } catch (error: any) { AppleAlert.error("注册失败", error.message) }
  finally { isLoading.value = false }
}

const handleRegisterInputBlur = (field: string) => {
  if (field === 'confirmPassword') {
    if (registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword) { registerErrors.confirmPassword = '两次密码不一致' }
    else { registerErrors.confirmPassword = '' }
  }
}

/* ----------------- Carousel Logic ----------------- */
const currentSlide = ref(0)
let carouselTimer: any = null

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop',
    title: '高效构建知识库',
    desc: '在一个统一的平台轻松追踪笔记、任务与数据流，告别繁琐的手动管理，让知识产生复利。'
  },
  {
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
    title: '无缝连接工作流',
    desc: '深度集成 Spotify、Linear、Google Calendar 等您喜爱的工具，打破数据孤岛，实现自动化流转。'
  },
  {
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
    title: '数据可视化洞察',
    desc: '通过强大的可视化仪表盘，将枯燥的原始数据转化为直观的图表与洞察，助力科学决策。'
  }
]

const startCarousel = () => {
  stopCarousel()
  carouselTimer = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length
  }, 5000)
}

const stopCarousel = () => {
  if (carouselTimer) clearInterval(carouselTimer)
}

const setSlide = (index: number) => {
  currentSlide.value = index
  startCarousel()
}

/* ----------------- Watcher for Auth Modal Entry/Exit ----------------- */
// 侦听视图切换，进入或退出 Auth 模态框时做相应的初始化和清空工作
watch(viewMode, (newVal, oldVal) => {
  const authModes = ['auth', 'forgot-password', 'register', 'phone-login']
  const isEnteringAuth = authModes.includes(newVal)
  const isLeavingAuth = authModes.includes(oldVal) && !authModes.includes(newVal)

  // 1. 如果完全退出了弹窗，清空所有表单数据
  if (isLeavingAuth) {
    clearAllAuthForms()
  }

  // 2. 状态调整与滚动监听
  if (isEnteringAuth) {
    startCarousel()
    nextTick(() => {
      // 重置滚动条并启动高度轮询检测
      if (authScrollRef.value) authScrollRef.value.scrollTop = 0
      handleAuthScroll()
      startScrollCheck()
    })
  } else {
    stopCarousel()
    showScrollHint.value = false
    stopScrollCheck()
  }
})

/* ----------------- Other Logic ----------------- */
const handleScroll = () => {
  if (!extGridRef.value) return
  const { scrollLeft, scrollWidth, clientWidth } = extGridRef.value
  showMaskLeft.value = scrollLeft > 10
  showMaskRight.value = (scrollLeft + clientWidth) < (scrollWidth - 10)
}

const handleResize = () => {
  handleScroll()
  if (['auth', 'forgot-password', 'register', 'phone-login'].includes(viewMode.value)) {
    handleAuthScroll()
  }
  // 如果窗口改变后进入了移动端宽度，自动强制调起登录（满足移动端纯App原生化体验）
  checkMobileDefaultView()
}

const handleKeydown = (e: KeyboardEvent) => {
  // ESC 键触发全局退出并清空数据
  if (e.key === 'Escape') {
    const authModes = ['auth', 'forgot-password', 'register', 'phone-login']
    if (authModes.includes(viewMode.value)) {
      if (window.innerWidth > 768) {
        viewMode.value = 'landing' // PC 端直接关闭
      } else {
        if (viewMode.value !== 'auth') viewMode.value = 'auth' // 移动端只退回登录页
      }
    }
  }
}

onMounted(() => {
  // 组件挂载时检查是否为移动端，是则直接展示登录窗
  checkMobileDefaultView()

  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleKeydown)
  setTimeout(handleScroll, 100)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleKeydown)
  stopCarousel()
  stopScrollCheck()
})

const switchToAuth = () => viewMode.value = 'auth'
const switchToDownload = () => viewMode.value = 'download'

const scrollLeft = () => { if (extGridRef.value) extGridRef.value.scrollBy({ left: -360, behavior: 'smooth' }) }
const scrollRight = () => { if (extGridRef.value) extGridRef.value.scrollBy({ left: 360, behavior: 'smooth' }) }
</script>

<style scoped>
/* ================= 全局变量 ================= */
:root {
  --bg-color: #0b0c0e;
  --text-white: #ffffff;
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
.nav-container { position: fixed; top: 20px; left: 0; width: 100%; display: flex; justify-content: center; z-index: 100; padding: 0 24px; box-sizing: border-box; }
.ray-nav { display: flex; align-items: center; justify-content: space-between; width: 100%; max-width: 960px; height: 48px; background: #151515; border: 1px solid rgba(255,255,255,0.08); border-radius: 99px; padding: 0 6px 0 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); transition: all 0.3s ease; }
.nav-left { display: flex; align-items: center; height: 100%; }
.ray-logo { display: flex; align-items: center; gap: 8px; cursor: pointer; height: 100%; }
.logo-svg { width: 20px; height: 20px; display: block; object-fit: contain; }
.logo-text { font-weight: 600; font-size: 15px; letter-spacing: -0.01em; color: #fff; white-space: nowrap; line-height: 1; display: flex; align-items: center; }
.nav-center { display: flex; gap: 24px; align-items: center; height: 100%; }
.nav-link { color: #888; font-size: 13px; font-weight: 500; text-decoration: none; transition: color 0.2s; white-space: nowrap; display: flex; align-items: center; line-height: 1; }
.nav-link:hover, .nav-link.active { color: #fff; }
.link-pricing { color: #888; font-size: 13px; font-weight: 500; }
.nav-right { display: flex; align-items: center; gap: 12px; height: 100%; }
.login-btn-text { background: none; border: none; color: #fff; font-size: 13px; font-weight: 500; cursor: pointer; transition: opacity 0.2s; white-space: nowrap; display: flex; align-items: center; line-height: 1; padding: 0; }
.login-btn-text:hover { opacity: 0.7; }
.download-btn-white { background: #ffffff; color: #000000; border: none; height: 36px; padding: 0 18px; border-radius: 18px; font-size: 13px; font-weight: 600; cursor: pointer; transition: transform 0.1s; white-space: nowrap; display: flex; align-items: center; justify-content: center; line-height: 1; }
.download-btn-white:hover { transform: scale(1.02); }

@media (max-width: 768px) {
  .nav-center { display: none; }
  .ray-nav { padding: 0 6px 0 16px; }
  .login-btn-text { font-size: 13px; }
  .download-btn-white { padding: 0 14px; height: 34px; font-size: 13px; }
  .logo-text { font-size: 15px; }
}

/* ================= 3. Hero Section ================= */
.hero-section { position: relative; z-index: 10; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding-top: 0; pointer-events: none; min-height: 600px; padding: 0 20px; box-sizing: border-box; }
.hero-inner { pointer-events: auto; margin-bottom: 20px; width: 100%; }
.hero-title { font-size: clamp(36px, 6vw, 80px); font-weight: 800; line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 24px; color: #fff; }
.hero-title .line { display: block; }
.glow-text { text-shadow: 0 0 50px rgba(255,255,255,0.3); }
.hero-sub { font-size: clamp(16px, 2vw, 20px); color: #999; line-height: 1.5; margin-bottom: 48px; max-width: 800px; margin-left: auto; margin-right: auto; }

/* ================= 4. Extensions Section ================= */
.extensions-section { position: relative; z-index: 10; max-width: 1200px; margin: 0 auto; padding: 0 24px 100px; box-sizing: border-box; }
.ext-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
.ext-title { font-size: clamp(24px, 4vw, 32px); font-weight: 700; color: #fff; margin-bottom: 8px; }
.ext-sub { font-size: clamp(14px, 2vw, 16px); color: #888; }
.ext-tags { display: none; }

.ext-grid-wrapper { overflow-x: auto; margin: 0 -24px; padding: 40px 24px 10px; scrollbar-width: none; transition: mask-image 0.3s; }
.ext-grid-wrapper.mask-l { mask-image: linear-gradient(to right, transparent 0, black 80px, black 100%); -webkit-mask-image: linear-gradient(to right, transparent 0, black 80px, black 100%); }
.ext-grid-wrapper.mask-r { mask-image: linear-gradient(to right, black 0, black calc(100% - 80px), transparent 100%); -webkit-mask-image: linear-gradient(to right, black 0, black calc(100% - 80px), transparent 100%); }
.ext-grid-wrapper.mask-l.mask-r { mask-image: linear-gradient(to right, transparent 0, black 80px, black calc(100% - 80px), transparent 100%); -webkit-mask-image: linear-gradient(to right, transparent 0, black 80px, black calc(100% - 80px), transparent 100%); }
.ext-grid-wrapper::-webkit-scrollbar { display: none; }
.ext-cards-grid { display: flex; gap: 24px; padding-bottom: 20px; }

.ext-card { flex-shrink: 0; width: 340px; height: 450px; background: #131313; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08); border-radius: 24px; padding: 32px; display: flex; flex-direction: column; position: relative; overflow: hidden; transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.4s, border-color 0.4s; }
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

/* ================= 5. Integrations Page ================= */
.store-view { position: relative; width: 100%; min-height: 100vh; z-index: 10; display: flex; flex-direction: column; align-items: center; padding-top: 120px; padding-bottom: 100px; box-sizing: border-box; }
.store-bg-glow { position: absolute; top: 100px; left: 50%; transform: translateX(-50%); width: 100%; max-width: 800px; height: 600px; background: radial-gradient(circle, rgba(255, 99, 99, 0.1) 0%, rgba(59, 130, 246, 0.05) 40%, transparent 70%); pointer-events: none; filter: blur(80px); z-index: -1; }
.store-content-wrapper { position: relative; z-index: 10; width: 100%; max-width: 1000px; padding: 0 24px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; text-align: center; }

.store-icon-cloud { display: flex; flex-direction: column; align-items: center; gap: 24px; margin-bottom: 60px; perspective: 1000px; width: 100%; }
.cloud-row { display: flex; align-items: center; justify-content: center; gap: 24px; flex-wrap: wrap; }
.row-top { margin-bottom: -10px; }
.store-app-icon { width: 72px; height: 72px; border-radius: 20px; background: rgba(30,30,30,0.6); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 32px; color: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.5); transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); overflow: hidden; }
.icon-focus { width: 96px; height: 96px; z-index: 10; font-size: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.4); background: #111; transform: scale(1.05); }
.notion-n { width: 60%; height: 60%; object-fit: contain; display: block; border-radius: 4px; }
.icon-blur-1 { opacity: 0.6; transform: scale(0.9); filter: blur(0.5px); }
.icon-blur-2 { opacity: 0.3; transform: scale(0.8); filter: blur(1.5px); }
.icon-figma { color: #f24e1e; }
.icon-spotify { color: #1db954; }
.icon-vscode { color: #007acc; }
.icon-google { background: #fff; color: #000; }
.icon-slack { background: #4a154b; color: #fff; }

.store-hero-text { margin-bottom: 50px; width: 100%; }
.store-title { font-size: clamp(40px, 6vw, 64px); font-weight: 800; color: #fff; margin-bottom: 16px; letter-spacing: -0.02em; background: linear-gradient(135deg, #fff 0%, #ccc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.store-subtitle { font-size: clamp(15px, 2vw, 18px); color: #888; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 0 10px; }

.top-picks-section { width: 100%; margin-top: 80px; text-align: left; }
.picks-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; width: 100%; }
.pick-card { background: #111; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px 24px 32px; display: flex; flex-direction: column; align-items: center; text-align: center; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); position: relative; text-decoration: none; }
.glass-card { background: rgba(20, 20, 20, 0.5); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
.pick-card:hover { border-color: rgba(255,255,255,0.25); transform: translateY(-5px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5); background: #141414; }
.glass-card:hover { background: rgba(30, 30, 30, 0.7); }

.pick-icon-wrapper { width: 72px; height: 72px; border-radius: 18px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; position: relative; box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
.bg-white { background: white; border: 1px solid rgba(255,255,255,0.2); color: #fff; }
.bg-black { background: #171f20}
.bg-red { background: #ea2000}
.bg-ibook { background: #f98b00; color: #000; }
.bg-green-douban { background: #00b51d; color: #fff; }
.bg-apple-music { background: #ff2f56; color: #fff; }
.bg-orange-finance { background: #f97316; color: #fff; }
.pick-icon { font-size: 36px; }
img.pick-icon { width: 48px; height: 48px; object-fit: contain; border-radius: 8px; }
.pick-name { font-size: 18px; font-weight: 700; color: #fff; margin: 0 0 10px; }
.pick-desc { font-size: 14px; color: #888; line-height: 1.5; margin-bottom: 24px; flex-grow: 1; }

/* ================= 6. Download Page ================= */
.download-view { position: relative; width: 100%; min-height: 100vh; z-index: 10; display: flex; flex-direction: column; align-items: center; padding-top: 100px; padding-bottom: 100px; box-sizing: border-box; }
.download-bg-glow { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at 50% 30%, rgba(255,255,255,0.03) 0%, transparent 50%); pointer-events: none; z-index: -1; }
.download-container { width: 100%; max-width: 1000px; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 24px; box-sizing: border-box; }
.download-header { margin-bottom: 60px; margin-top: 60px; width: 100%; }
.download-title { font-size: clamp(36px, 6vw, 64px); font-weight: 800; color: #fff; letter-spacing: -0.02em; margin-bottom: 20px; background: linear-gradient(135deg, #fff 0%, #ccc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.download-subtitle { font-size: clamp(15px, 2vw, 20px); color: #888; line-height: 1.5; font-weight: 400; max-width: 600px; margin: 0 auto; }

.primary-dl-card { width: 100%; height: 380px; background: #0d0d0d; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; display: flex; align-items: stretch; overflow: hidden; margin-bottom: 60px; box-shadow: 0 20px 60px rgba(0,0,0,0.6); transition: transform 0.3s; }
.primary-dl-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.2); }
.primary-content { flex: 1; padding: 48px; display: flex; flex-direction: column; align-items: flex-start; text-align: left; justify-content: space-between; z-index: 2; position: relative; }
.os-icon-large { font-size: 48px; color: #fff; margin-bottom: 20px; }
.dl-info { margin-bottom: 30px; }
.dl-os-name { font-size: 32px; font-weight: 700; color: #fff; margin-bottom: 8px; }
.dl-os-desc { font-size: 16px; color: #999; margin-bottom: 16px; }
.dl-meta { display: flex; gap: 12px; align-items: center; }
.version-badge { background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; color: #ccc; }
.req-text { font-size: 13px; color: #666; }
.dl-actions { width: 100%; display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
.dl-btn-primary { background: #fff; color: #000; border: none; padding: 14px 28px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(255,255,255,0.15); }
.dl-btn-primary:hover { transform: scale(1.02); background: #f0f0f0; box-shadow: 0 6px 16px rgba(255,255,255,0.2); }

.primary-visual { flex: 1.2; background: radial-gradient(circle at bottom right, rgba(255, 69, 58, 0.05), transparent 70%); position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.app-window-mock { width: 85%; height: auto; aspect-ratio: 16/10; background: rgba(20, 20, 20, 0.8); backdrop-filter: blur(20px); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 50px rgba(0,0,0,0.5); display: flex; flex-direction: column; transform: translateY(20px) rotateX(5deg) rotateY(-5deg); transition: transform 0.5s ease; padding: 12px; box-sizing: border-box; }
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

.platforms-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; width: 100%; }
.plat-item-card { background: rgba(20,20,20,0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; align-items: center; transition: all 0.3s; position: relative; overflow: hidden; box-sizing: border-box; }
.plat-item-card:hover { transform: translateY(-4px); background: rgba(30,30,30,0.8); border-color: rgba(255,255,255,0.2); }
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
.plat-dl-btn { background: rgba(255,255,255,0.08); color: #fff; border: 1px solid transparent; padding: 8px 0; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; width: 100%; box-sizing: border-box; }
.plat-dl-btn:hover { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.1); }
.plat-dl-btn.disabled { opacity: 0.3; cursor: not-allowed; }
.plat-dl-btn.disabled:hover { background: rgba(255,255,255,0.08); border-color: transparent; }
.coming-soon { opacity: 0.7; }

/* ================= 7. Changelog Page ================= */
.changelog-view { position: relative; width: 100%; min-height: 100vh; z-index: 10; display: flex; flex-direction: column; align-items: center; padding-top: 120px; padding-bottom: 100px; box-sizing: border-box; }
.changelog-bg-glow { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at 70% 20%, rgba(255,255,255,0.03) 0%, transparent 50%); pointer-events: none; z-index: -1; }
.changelog-container { width: 100%; max-width: 800px; display: flex; flex-direction: column; align-items: center; padding: 0 24px; box-sizing: border-box; }
.cl-header { margin-bottom: 60px; text-align: center; }
.cl-title { font-size: clamp(40px, 6vw, 56px); font-weight: 800; color: #fff; margin-bottom: 16px; letter-spacing: -0.02em; background: linear-gradient(135deg, #fff 0%, #ccc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.cl-subtitle { font-size: clamp(15px, 2vw, 18px); color: #888; }

.timeline-wrapper { position: relative; width: 100%; padding-left: 120px; box-sizing: border-box; }
.timeline-line { position: absolute; left: 120px; top: 20px; bottom: 0; width: 2px; background: linear-gradient(to bottom, rgba(255,255,255,0.1), transparent); }

.release-item { position: relative; margin-bottom: 60px; animation: slideUp 0.6s ease both; }
.release-item:nth-child(2) { animation-delay: 0.1s; }
.release-item:nth-child(3) { animation-delay: 0.2s; }
.release-item:nth-child(4) { animation-delay: 0.3s; }

.release-meta { position: absolute; left: -140px; top: 0; width: 120px; text-align: right; padding-right: 24px; display: flex; flex-direction: column; align-items: flex-end; box-sizing: border-box; }
.r-version { display: block; font-family: monospace; font-size: 16px; font-weight: 700; background: linear-gradient(90deg, #fff, #bbb); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 4px; }
.r-date { font-size: 12px; color: #666; font-family: -apple-system, BlinkMacSystemFont, "Inter", monospace; }
.latest-badge { margin-top: 8px; font-size: 10px; font-weight: 700; color: #000; background: #fff; padding: 2px 6px; border-radius: 4px; display: inline-block; letter-spacing: 0.5px; }

.release-dot { position: absolute; left: -6px; top: 6px; width: 14px; height: 14px; border-radius: 50%; background: #000; border: 2px solid #444; z-index: 2; transition: all 0.3s; display: flex; align-items: center; justify-content: center; }
.dot-inner { width: 6px; height: 6px; background: transparent; border-radius: 50%; transition: all 0.3s; }
.release-dot.dot-active { border-color: #fff; box-shadow: 0 0 15px rgba(255,255,255,0.3); }
.release-dot.dot-active .dot-inner { background: #fff; }
.release-item:hover .release-dot { border-color: #fff; transform: scale(1.1); }

.glass-card-premium { background: rgba(20,20,20,0.4); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 32px; box-shadow: 0 4px 24px rgba(0,0,0,0.2); transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); position: relative; overflow: hidden; box-sizing: border-box; }
.glass-card-premium::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); opacity: 0; transition: opacity 0.4s; }
.glass-card-premium:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.15); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5); background: rgba(25,25,25,0.5); }
.glass-card-premium:hover::before { opacity: 1; }

.rc-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.rc-title { font-size: 24px; font-weight: 700; color: #fff; margin: 0; letter-spacing: -0.01em; }
.rc-tags { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
.tag { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: inline-flex; align-items: center; }
.tag-new { background: rgba(59, 130, 246, 0.1); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.2); }
.tag-fix { background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); }
.tag-impr { background: rgba(16, 185, 129, 0.1); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.2); }

.rc-desc { font-size: 15px; color: #a1a1aa; line-height: 1.7; margin-bottom: 24px; }
.rc-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
.rc-list li { position: relative; font-size: 14px; color: #d4d4d8; display: flex; align-items: flex-start; gap: 12px; line-height: 1.5; }
.li-icon { font-size: 16px; line-height: 1.5; display: inline-block; width: 20px; text-align: center; }

.cl-footer { margin-top: 60px; font-size: 14px; color: #666; transition: opacity 0.3s; }
.cl-footer:hover { opacity: 0.8; }
.cl-link { color: #888; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.2); transition: all 0.2s; padding-bottom: 2px; }
.cl-link:hover { color: #fff; border-bottom-color: #fff; }

/* ================= 8. Animations ================= */
/* 原生应用级的柔和缩放与淡入淡出动效 */
.fade-slow-enter-active, .fade-slow-leave-active { transition: opacity 0.4s ease; }
.fade-slow-enter-from, .fade-slow-leave-to { opacity: 0; }

.fade-slow-enter-active .auth-card-new { animation: modalScaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.fade-slow-leave-active .auth-card-new { animation: modalScaleOut 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

@keyframes modalScaleIn {
  from { transform: scale(0.95) translateY(10px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}
@keyframes modalScaleOut {
  from { transform: scale(1) translateY(0); opacity: 1; }
  to { transform: scale(0.97) translateY(10px); opacity: 0; }
}

.reveal-1 { animation: slideUp 0.8s 0.1s both; }
.reveal-2 { animation: slideUp 0.8s 0.2s both; }
.reveal-3 { animation: slideUp 0.8s 0.3s both; }
.reveal-4 { animation: slideUp 0.8s 0.4s both; }

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.slide-down { animation: slideDown 0.8s forwards; opacity: 0; transform: translateY(-20px); }
@keyframes slideDown { to { opacity: 1; transform: translateY(0); } }

.scale-in { animation: scaleIn 0.8s cubic-bezier(0.25, 0.8, 0.25, 1) forwards; opacity: 0; transform: scale(0.9); }
@keyframes scaleIn { to { opacity: 1; transform: scale(1); } }


/* ================= 9. Auth Wrapper ( 高级深色毛玻璃左右分栏 ) ================= */
.auth-wrapper-new {
  position: fixed; top: 0; left: 0; width: 100%; height: 100vh; z-index: 999;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box;
}

.auth-card-new {
  width: 100%; max-width: 1000px; height: 600px; min-height: 600px;
  background: rgba(20, 20, 22, 0.5);
  backdrop-filter: blur(40px) saturate(150%);
  -webkit-backdrop-filter: blur(40px) saturate(150%);
  border-radius: 24px; overflow: hidden;
  display: flex;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
}

.close-auth-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 999;
  color: #9ca3af;
  transition: all 0.2s ease;
}
.close-auth-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

/* Left Side: Visual */
.auth-visual-side {
  flex: 0.45; position: relative; background-color: transparent;
  padding: 40px; display: flex; flex-direction: column; justify-content: space-between;
  overflow: hidden; box-sizing: border-box;
}
.carousel-bg-wrapper { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; }
.carousel-slide { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: cover; background-position: center; transition: transform 6s ease; transform: scale(1.05); }
.carousel-slide[style*="display: none"] { transform: scale(1); }

.fade-slide-enter-active, .fade-slide-leave-active { transition: opacity 1s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; }
.visual-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%); z-index: 1; pointer-events: none; }

.auth-logo-badge { position: relative; z-index: 2; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.2); padding: 10px 16px; border-radius: 50px; display: inline-flex; align-items: center; gap: 8px; width: fit-content; color: #fff; font-weight: 600; font-size: 14px; }
.badge-icon { font-size: 16px; }

.visual-content { position: relative; z-index: 2; color: #fff; display: flex; flex-direction: column; gap: 20px; margin-bottom: 20px; }
.slide-text-group { margin-bottom: 10px; }
.visual-heading { font-size: 36px; font-weight: 700; margin-bottom: 12px; line-height: 1.2; letter-spacing: -0.02em; }
.visual-desc { font-size: 15px; color: rgba(255,255,255,0.8); line-height: 1.6; max-width: 90%; }
.fade-text-enter-active, .fade-text-leave-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.fade-text-enter-from { opacity: 0; transform: translateY(10px); }
.fade-text-leave-to { opacity: 0; transform: translateY(-10px); }

.visual-dots { display: flex; gap: 8px; margin-top: 10px; }
.dot-wrapper { width: 40px; height: 4px; background: rgba(255, 255, 255, 0.2); border-radius: 2px; overflow: hidden; cursor: pointer; position: relative; }
.dot-progress { width: 0; height: 100%; background: #fff; border-radius: 2px; }
.dot-progress.animating { animation: progressFill 5s linear forwards; }
@keyframes progressFill { 0% { width: 0; } 100% { width: 100%; } }


/* ================= 10. Right Side: Form & Scroll Logic ================= */
.auth-form-side {
  flex: 0.55; position: relative;
  background: transparent;
  display: flex; flex-direction: column;
  border-left: 1px solid rgba(255,255,255,0.05);
  overflow: hidden;
}

.auth-scroll-area {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  scrollbar-width: none;
  -ms-overflow-style: none;
  mask-image: linear-gradient(to bottom, transparent 0%, black 40px, black calc(100% - 40px), transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 40px, black calc(100% - 40px), transparent 100%);
}

.auth-scroll-area::before,
.auth-scroll-area::after {
  content: '';
  flex: auto;
}

.auth-scroll-area::-webkit-scrollbar {
  display: none;
}

.mobile-auth-header { display: none; }

.form-scroll-container {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 40px 48px 80px;
  flex-shrink: 0;
  box-sizing: border-box;
}

/* -------- 动态滚动提示 (浮动在右下角) -------- */
.scroll-bottom-hint {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.6);
  pointer-events: none;
  z-index: 100;
}
.scroll-bottom-hint .hint-text {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1px;
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 12px;
  border-radius: 12px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.scroll-bottom-hint .bounce-icon {
  font-size: 14px;
  background: rgba(0, 0, 0, 0.5);
  padding: 6px;
  border-radius: 50%;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: bounce-down 2s infinite ease-in-out;
}
@keyframes bounce-down {
  0%, 100% { transform: translateY(0); opacity: 0.6; }
  50% { transform: translateY(6px); opacity: 1; }
}

/* ---------------- 统一的暗黑风格输入表单样式 ---------------- */
.form-header-new { margin-bottom: 32px; text-align: left; }
.welcome-title { font-size: 26px; font-weight: 700; color: #ffffff; margin-bottom: 8px; letter-spacing: -0.01em; }
.welcome-sub { color: #a1a1aa; font-size: 14px; }

.form-fields-new { display: flex; flex-direction: column; gap: 20px; }
.input-group { display: flex; flex-direction: column; gap: 8px; width: 100%; }
.input-group label { font-size: 13px; font-weight: 500; color: #d1d5db; display: inline-block; }

.input-wrapper { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 0 16px; display: flex; align-items: center; transition: all 0.2s ease; height: 48px; box-sizing: border-box; }
.input-wrapper:focus-within { background: rgba(255,255,255,0.08); border-color: #0A84FF; box-shadow: 0 0 0 4px rgba(10, 132, 255, 0.2); }
.input-wrapper.has-error { border-color: #FF453A; background: rgba(255, 69, 58, 0.05); }
.input-wrapper.has-error:focus-within { box-shadow: 0 0 0 4px rgba(255, 69, 58, 0.2); }

.input-prefix-icon { color: rgba(255,255,255,0.4); font-size: 16px; margin-right: 12px; transition: color 0.2s ease; display: flex; align-items: center; }
.input-wrapper:focus-within .input-prefix-icon { color: #0A84FF; }
.input-wrapper.has-error .input-prefix-icon { color: #FF453A; }
.success-prefix-icon { color: #32D74B; font-size: 16px; margin-right: 12px; display: flex; align-items: center; }

/* 增加 input { min-width: 0 } 防止默认 size="20" 撑破 flex/grid */
.input-wrapper input { flex: 1; min-width: 0; border: none; outline: none; width: 100%; font-size: 14px; color: #ffffff; background: transparent; }
.input-wrapper input::placeholder { color: rgba(255,255,255,0.3); }
.input-suffix-icon { color: rgba(255,255,255,0.4); cursor: pointer; font-size: 16px; display: flex; align-items: center; transition: color 0.2s; }
.input-suffix-icon:hover { color: #fff; }

.error-message { color: #FF453A; font-size: 12px; font-weight: 500; margin-top: 2px; padding-left: 4px; display: block; }

.form-actions-row { display: flex; justify-content: space-between; align-items: center; margin-top: -8px; }
.forgot-link { color: #0A84FF; font-size: 13px; text-decoration: none; font-weight: 500; }
.forgot-link:hover { text-decoration: underline; }

/* 登录/主要操作按钮与成功态动效 */
.auth-btn-primary {
  width: 100%; height: 48px;
  background: #0A84FF; border: none; border-radius: 12px;
  color: #fff; font-size: 15px; font-weight: 600; cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  margin-top: 12px; display: flex; justify-content: center; align-items: center;
  box-sizing: border-box;
  position: relative; overflow: hidden;
}
.auth-btn-primary:hover { background: #0071E3; transform: scale(0.99); }
.auth-btn-primary:active { transform: scale(0.97); }
.auth-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

/* 登录成功状态的按钮变身样式 */
.auth-btn-primary.is-success {
  background-color: #32D74B !important; /* Apple Green */
  color: #fff;
  opacity: 1 !important;
  transform: scale(1.02);
  box-shadow: 0 10px 20px rgba(50, 215, 75, 0.2);
}
.success-pop-icon {
  font-size: 22px;
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
@keyframes popIn {
  0% { transform: scale(0.5) rotate(-15deg); opacity: 0; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

/* 核心修复：添加 inline-block 让 spin transform 起作用 */
.spin-icon {
  font-size: 20px;
  color: #fff;
  display: inline-block;
  animation: customSpin 1s linear infinite;
}
@keyframes customSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.auth-divider { display: flex; align-items: center; text-align: center; margin: 24px 0; }
.auth-divider::before, .auth-divider::after { content: ""; flex: 1; height: 1px; background: rgba(255, 255, 255, 0.1); }
.auth-divider span { padding: 0 12px; color: rgba(255, 255, 255, 0.4); font-size: 13px; font-weight: 500; background: transparent; }

.social-row { display: flex; gap: 16px; }
.auth-btn-secondary { width: 100%; height: 48px; background: rgba(255,255,255,0.08); border: none; border-radius: 12px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 14px; font-weight: 600; color: #ffffff; cursor: pointer; transition: all 0.2s ease; box-sizing: border-box; }
.auth-btn-secondary:hover { background: rgba(255,255,255,0.12); }
.auth-btn-secondary .s-icon { font-size: 16px; color: #ffffff; }

.auth-footer-text { text-align: center; font-size: 13px; color: rgba(255,255,255,0.5); margin-top: 24px; padding-bottom: 20px; font-weight: 500; }
.register-link { color: #0A84FF; font-weight: 600; text-decoration: none; margin-left: 4px; }
.register-link:hover { text-decoration: underline; }

.sms-btn { border: none; background: none; color: #0A84FF; font-weight: 600; font-size: 13px; cursor: pointer; padding: 4px 8px; white-space: nowrap; transition: color 0.2s; }
.sms-btn:hover { color: #0071E3; }
.sms-btn:disabled { color: rgba(255,255,255,0.3); cursor: not-allowed; }

/* 验证码框 */
.otp-box-container { display: flex; justify-content: space-between; gap: 8px; width: 100%; }
.otp-input { flex: 1; min-width: 0; max-width: 54px; aspect-ratio: 1 / 1.1; height: auto; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); text-align: center; font-size: 24px; font-weight: 600; background: rgba(255,255,255,0.05); color: #fff; outline: none; transition: all 0.2s ease; box-sizing: border-box; padding: 0; }
.otp-input:focus { border-color: #0A84FF; background: rgba(255,255,255,0.08); box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.2); }
.otp-input.has-error { border-color: #FF453A; color: #FF453A; }

.password-strength-container { margin-top: 4px; display: flex; flex-direction: column; gap: 6px; }
.strength-bars { display: flex; gap: 4px; height: 4px; width: 100%; }
.strength-segment { flex: 1; background-color: rgba(255,255,255,0.1); border-radius: 2px; transition: all 0.3s ease; }
.strength-segment.active.weak { background-color: #FF453A; }
.strength-segment.active.medium { background-color: #FF9F0A; }
.strength-segment.active.strong { background-color: #32D74B; }
.strength-label { font-size: 11px; font-weight: 600; text-align: right; transition: color 0.3s ease; min-height: 16px; }
.text-weak { color: #FF453A; }
.text-medium { color: #FF9F0A; }
.text-strong { color: #32D74B; }

/* 头像上传区 */
.avatar-upload-container { display: flex; flex-direction: column; align-items: center; gap: 8px; margin-bottom: 8px; }
.avatar-wrapper { position: relative; width: 64px; height: 64px; border-radius: 50%; overflow: hidden; cursor: pointer; transition: transform 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
.avatar-wrapper:hover { transform: scale(1.05); }
.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.avatar-placeholder { width: 100%; height: 100%; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 24px; font-weight: 700; }
.avatar-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; }
.avatar-wrapper:hover .avatar-overlay { opacity: 1; }
.camera-icon { color: #fff; font-size: 20px; }
.avatar-text-hint { font-size: 12px; color: rgba(255,255,255,0.4); }

/* 并排输入框彻底修复挤压：升级为 CSS Grid 网格布局 */
.form-row-group { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; width: 100%; }
.flex-1 { min-width: 0; }
.verified-badge { font-size: 12px; color: #32D74B; font-weight: 600; padding: 0 8px; white-space: nowrap; display: flex; align-items: center; }

/* ================= 11. 移动端原生化适配 ================= */
@media (max-width: 768px) {
  .auth-active .landing-view,
  .auth-active .store-view,
  .auth-active .download-view,
  .auth-active .changelog-view,
  .auth-active .nav-container {
    display: none !important;
  }

  .auth-wrapper-new { padding: 0; background: transparent; align-items: flex-start; }

  .auth-card-new {
    flex-direction: column;
    height: 100vh;
    max-height: 100vh;
    min-height: 100vh;
    border-radius: 0;
    background: rgba(18, 18, 20, 0.85);
    backdrop-filter: blur(30px) saturate(180%);
    -webkit-backdrop-filter: blur(30px) saturate(180%);
    border: none;
  }

  .auth-visual-side { display: none; }
  .auth-form-side { flex: 1; width: 100%; min-width: auto; border-left: none; background: transparent; }
  .auth-scroll-area { -webkit-mask-image: none; mask-image: none; }
  .auth-scroll-area::before, .auth-scroll-area::after { content: none; }

  .close-auth-btn { display: none; }

  .mobile-auth-header { display: flex; align-items: center; padding: 20px 24px 0; background: transparent; z-index: 10; position: relative; min-height: 64px; box-sizing: border-box; }
  .mobile-back-icon { background: transparent; border: none; font-size: 24px; color: rgba(255,255,255,0.9); padding: 8px 16px 8px 0; margin-left: -8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: opacity 0.2s; }
  .mobile-back-icon:active { opacity: 0.6; }

  .form-scroll-container { padding: 0 24px 80px; justify-content: flex-start; max-width: 100%; margin: auto 0; }
  .scroll-bottom-hint { bottom: 16px; }

  .welcome-title { font-size: 28px; font-weight: 800; margin-bottom: 8px; color: #fff; }
  .welcome-sub { font-size: 15px; margin-bottom: 32px; color: rgba(255,255,255,0.5); }

  .form-fields-new { gap: 20px; }
  .input-group { gap: 10px; }
  .input-group label { font-size: 14px; color: rgba(255,255,255,0.8); }

  .input-wrapper { height: 56px; border-radius: 16px; background: rgba(255,255,255,0.05); padding: 0 20px; border-color: rgba(255,255,255,0.08); }
  .input-wrapper input { font-size: 16px; }
  .input-prefix-icon { font-size: 20px; margin-right: 14px; }

  .form-row-group { display: flex; flex-direction: column; gap: 20px; }

  .auth-btn-primary, .auth-btn-secondary { height: 56px; font-size: 17px; border-radius: 16px; }
  .otp-input { height: 56px; font-size: 24px; border-radius: 14px; }

  .auth-footer-text, .forgot-link { font-size: 14px; }

  /* 其他保持原样 */
  .store-title { font-size: 36px; }
  .picks-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .pick-card { padding: 20px 12px 16px; border-radius: 14px; min-height: 160px; }
  .pick-icon-wrapper { width: 52px; height: 52px; margin-bottom: 12px; border-radius: 14px; }
  img.pick-icon { width: 32px; height: 32px; border-radius: 6px; }
  .pick-name { font-size: 15px; margin-bottom: 6px; }
  .pick-desc { font-size: 12px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: auto; }
  .cloud-row { gap: 12px; }
  .store-app-icon { width: 56px; height: 56px; border-radius: 14px; font-size: 24px; }
  .icon-focus { width: 72px; height: 72px; font-size: 32px; }
  .primary-dl-card { flex-direction: column; height: auto; }
  .primary-content { padding: 32px 24px; align-items: center; text-align: center; }
  .dl-actions { align-items: center; width: 100%; }
  .dl-btn-primary { width: 100%; justify-content: center; height: 50px; border-radius: 16px; }
  .primary-visual { padding: 40px 20px; }
  .app-window-mock { width: 100%; max-width: 100%; transform: none; }
  .platforms-grid { grid-template-columns: 1fr 1fr; gap: 16px; }
  .timeline-wrapper { padding-left: 24px; margin-top: 20px; }
  .timeline-line { left: 8px; }
  .release-dot { left: -22px; width: 12px; height: 12px; }
  .release-meta { position: relative; left: 0; width: 100%; text-align: left; flex-direction: row; align-items: center; gap: 12px; margin-bottom: 12px; }
  .glass-card-premium { padding: 24px; border-radius: 16px; }
  .rc-header { flex-direction: column; gap: 8px; align-items: flex-start; }
}

@media (max-width: 480px) {
  .platforms-grid { grid-template-columns: 1fr; }
}
</style>