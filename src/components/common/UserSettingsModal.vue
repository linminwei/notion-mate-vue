<template>
  <div>
    <!-- ========== 主设置弹窗 ========== -->
    <transition name="modal-fade">
      <div v-if="visible" class="apple-modal-overlay" @click="close">
        <div class="apple-modal-container" @click.stop>
          <!-- 左侧导航侧边栏 -->
          <div class="modal-sidebar">
            <h3 class="modal-title">账号与设置</h3>
            <nav class="modal-nav">
              <div
                class="modal-nav-item"
                :class="{ 'is-active': activeTab === 'profile' }"
                @click="activeTab = 'profile'"
              >
                <div class="nav-icon"><font-awesome-icon :icon="['fas', 'user']" /></div>
                <span>个人设置</span>
              </div>
              <div
                class="modal-nav-item"
                :class="{ 'is-active': activeTab === 'preferences' }"
                @click="activeTab = 'preferences'"
              >
                <div class="nav-icon"><font-awesome-icon :icon="['fas', 'cog']" /></div>
                <span>系统偏好</span>
              </div>
            </nav>
          </div>

          <!-- 右侧内容区 -->
          <div class="modal-content-area">
            <button class="modal-close-btn" @click="close">
              <font-awesome-icon :icon="['fas', 'times']" />
            </button>

            <transition name="panel-fade" mode="out-in">
              <!-- 面板 1：个人设置 -->
              <div v-if="activeTab === 'profile'" class="settings-panel profile-view">
                <div class="profile-hero-section">
                  <div class="avatar-editable-wrapper" @click="triggerAvatarUpload">
                    <div class="avatar-huge">
                      <img v-if="previewAvatar" :src="previewAvatar" class="avatar-img" referrerpolicy="no-referrer" @error="onAvatarError" />
                      <span v-else>{{ userInfo?.nickname?.charAt(0) || userInfo?.username?.charAt(0) || '我' }}</span>
                    </div>
                    <div class="avatar-overlay">
                      <font-awesome-icon :icon="['fas', 'camera']" class="camera-icon" />
                    </div>
                    <input type="file" ref="avatarInput" accept="image/png, image/jpeg, image/webp" class="hidden-input" @change="handleAvatarChange" />
                  </div>
                  <div class="hero-text-content">
                    <h2 class="hero-name">{{ userInfo?.nickname || userInfo?.username || 'User' }}</h2>
                    <p class="hero-email">{{ userInfo?.email || '未绑定邮箱' }}</p>
                  </div>
                </div>

                <div class="settings-groups-container">
                  <!-- 分组 1: 基础信息 -->
                  <div class="settings-group">
                    <h3 class="group-title">基本信息</h3>
                    <div class="settings-card">
                      <div class="settings-row">
                        <div class="row-label">
                          <div class="setting-icon-box bg-grey"><font-awesome-icon :icon="['fas', 'fa-at']" /></div>
                          <span>用户名</span>
                        </div>
                        <div class="row-content">
                          <span class="row-value readonly-text">{{ userInfo?.username || 'admin' }}</span>
                        </div>
                      </div>
                      <div class="row-divider"></div>
                      <div class="settings-row">
                        <div class="row-label">
                          <div class="setting-icon-box bg-blue"><font-awesome-icon :icon="['fas', 'fa-eraser']" /></div>
                          <span>显示昵称</span>
                        </div>
                        <div class="row-content">
                          <input
                            v-if="isEditingNickname"
                            v-model="editNicknameValue"
                            class="inline-edit-input"
                            placeholder="请输入昵称"
                            @keyup.enter="saveNickname"
                            @blur="saveNickname"
                            ref="nicknameInputRef"
                          />
                          <span v-else class="row-value editable-text" @click="startEditNickname">{{ userInfo?.nickname || '未设置' }}</span>
                        </div>
                      </div>
                      <div class="row-divider"></div>
                      <div class="settings-row">
                        <div class="row-label">
                          <div class="setting-icon-box bg-orange"><font-awesome-icon :icon="['fas', 'user-shield']" /></div>
                          <span>角色信息</span>
                        </div>
                        <div class="row-content">
                          <span class="row-value readonly-text">{{ userInfo?.roles?.map(r => r.roleName).join(', ') || '暂无角色' }}</span>
                        </div>
                      </div>
                      <div class="row-divider"></div>
                      <div class="settings-row">
                        <div class="row-label">
                          <div class="setting-icon-box bg-green"><font-awesome-icon :icon="['fas', 'clock']" /></div>
                          <span>注册时间</span>
                        </div>
                        <div class="row-content">
                          <span class="row-value readonly-text">{{ formatTime((userInfo as any)?.createTime) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 分组 2: 账户安全 -->
                  <div class="settings-group">
                    <h3 class="group-title">账户安全</h3>
                    <div class="settings-card">
                      <div class="settings-row">
                        <div class="row-label">
                          <div class="setting-icon-box bg-red"><font-awesome-icon :icon="['fas', 'lock']" /></div>
                          <span>密码重置</span>
                        </div>
                        <div class="row-content">
                          <span class="row-value readonly-text">已设置</span>
                        </div>
                        <button class="action-text-btn ml-3" @click="handlePasswordReset">重置</button>
                      </div>
                      <div class="row-divider"></div>
                      <div class="settings-row">
                        <div class="row-label">
                          <div class="setting-icon-box bg-green"><font-awesome-icon :icon="['fas', 'mobile-alt']" /></div>
                          <span>手机号码</span>
                        </div>
                        <div class="row-content">
                          <span class="row-value" :class="{ 'placeholder-text': !userInfo?.phone }">{{ userInfo?.phone || '未绑定' }}</span>
                        </div>
                        <button class="action-text-btn ml-3" @click="openRebindModal">{{ userInfo?.phone ? '换绑' : '绑定' }}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 面板 2：系统偏好 -->
              <div v-else-if="activeTab === 'preferences'" class="settings-panel">
                <h2 class="panel-header">系统偏好</h2>
                <div class="settings-groups-container mt-2">
                  <div class="settings-group">
                    <h3 class="group-title">外观与显示</h3>
                    <div class="settings-card">
                      <div class="settings-row">
                        <div class="row-content-left">
                          <div class="row-label">
                            <div class="setting-icon-box bg-indigo"><font-awesome-icon :icon="['fas', 'palette']" /></div>
                            <span>外观主题</span>
                          </div>
                          <span class="row-desc ml-icon-offset">切换深色或浅色系统模式</span>
                        </div>
                        <div class="row-content-right">
                          <div class="apple-switch" :class="{ 'is-on': appStore.isDark }" @click="toggleTheme">
                            <div class="switch-knob">
                              <font-awesome-icon :icon="['fas', 'moon']" v-if="appStore.isDark" class="knob-icon" />
                              <font-awesome-icon :icon="['fas', 'sun']" v-else class="knob-icon light" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row-divider"></div>
                      <div class="settings-row">
                        <div class="row-content-left">
                          <div class="row-label">
                            <div class="setting-icon-box bg-orange"><font-awesome-icon :icon="['fas', 'paint-brush']" /></div>
                            <span>系统强调色</span>
                          </div>
                          <span class="row-desc ml-icon-offset">个性化您的系统主要操作与激活色彩</span>
                        </div>
                        <div class="row-content-right">
                          <div class="color-picker-group">
                            <div v-for="c in accentColors" :key="c.name"
                              class="color-dot"
                              :style="{ backgroundColor: appStore.isDark ? c.value : c.lightValue }"
                              :class="{ active: currentAccentName === c.name }"
                              @click="setAccentColor(c)">
                            </div>
                            <div class="color-dot custom-color-wrapper"
                              :class="{ active: currentAccentName === 'custom' }"
                              style="background: conic-gradient(from 180deg, #FF3B30, #FF9500, #FFCC00, #4CD964, #5AC8FA, #0A84FF, #BF5AF2, #FF3B30);"
                              title="自定义颜色"
                              @click="triggerCustomColor">
                              <input type="color" ref="customColorInput" v-model="customColorValue" class="invisible-color-input" tabindex="-1" @input="onCustomColorInput" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row-divider"></div>
                      <div class="settings-row">
                        <div class="row-content-left">
                          <div class="row-label">
                            <div class="setting-icon-box bg-blue"><font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" /></div>
                            <span>界面动画</span>
                          </div>
                          <span class="row-desc ml-icon-offset">开启系统级过渡与微动效（关闭可提升性能）</span>
                        </div>
                        <div class="row-content-right">
                          <div class="apple-switch" :class="{ 'is-on': animationsEnabled }" @click="toggleAnimations">
                            <div class="switch-knob"></div>
                          </div>
                        </div>
                      </div>
                      <div class="row-divider"></div>
                      <div class="settings-row">
                        <div class="row-content-left">
                          <div class="row-label">
                            <div class="setting-icon-box bg-red"><font-awesome-icon :icon="['fas', 'broom']" /></div>
                            <span>退出时清理缓存</span>
                          </div>
                          <span class="row-desc ml-icon-offset">注销账号时自动清理本地临时缓存数据</span>
                        </div>
                        <div class="row-content-right">
                          <div class="apple-switch" :class="{ 'is-on': clearCacheOnExit }" @click="toggleClearCache">
                            <div class="switch-knob"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </transition>

    <!-- ========== 手机换绑/绑定弹窗 ========== -->
    <transition name="modal-fade">
      <div v-if="isRebindModalOpen" class="apple-modal-overlay nested-overlay" @click="closeRebindModal">
        <div class="apple-dialog" @click.stop>
          <h3 class="dialog-title">{{ rebindStep === 1 ? '安全验证' : '绑定新手机号' }}</h3>
          <p class="dialog-subtitle">
            {{ rebindStep === 1 ? '为了您的账号安全，请先验证当前绑定的手机号。' : '请输入您的新手机号码并完成验证。' }}
          </p>
          <div class="dialog-form">
            <template v-if="rebindStep === 1">
              <div class="apple-input-group">
                <div class="input-icon-wrapper"><font-awesome-icon :icon="['fas', 'mobile-alt']" /></div>
                <input type="tel" :value="userInfo?.phone" class="apple-dialog-input has-icon" placeholder="当前绑定的手机号码" disabled />
              </div>
              <div class="apple-input-group flex-group">
                <div class="input-icon-wrapper verify-icon"><font-awesome-icon :icon="['fas', 'shield-alt']" /></div>
                <input type="text" v-model="rebindForm.oldVerifyCode" class="apple-dialog-input has-icon flex-1" placeholder="短信验证码" />
                <button class="dialog-btn outline send-code-btn" :disabled="countdown > 0" @click="sendOldPhoneCode">
                  {{ countdown > 0 ? `${countdown}s 后重试` : '获取验证码' }}
                </button>
              </div>
            </template>
            <template v-else>
              <div class="apple-input-group">
                <div class="input-icon-wrapper"><font-awesome-icon :icon="['fas', 'mobile-alt']" /></div>
                <input type="tel" v-model="rebindForm.newPhone" class="apple-dialog-input has-icon" placeholder="请输入新手机号码" />
              </div>
              <div class="apple-input-group flex-group">
                <div class="input-icon-wrapper verify-icon"><font-awesome-icon :icon="['fas', 'shield-alt']" /></div>
                <input type="text" v-model="rebindForm.newVerifyCode" class="apple-dialog-input has-icon flex-1" placeholder="短信验证码" />
                <button class="dialog-btn outline send-code-btn" :disabled="countdown > 0" @click="sendNewPhoneCode">
                  {{ countdown > 0 ? `${countdown}s 后重试` : '获取验证码' }}
                </button>
              </div>
            </template>
          </div>
          <div class="dialog-actions">
            <button class="dialog-btn outline" @click="closeRebindModal">取消</button>
            <button v-if="rebindStep === 1" class="dialog-btn primary" @click="nextRebindStep">下一步</button>
            <button v-else class="dialog-btn primary" @click="submitRebind">确认换绑</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ========== 密码重置弹窗 ========== -->
    <transition name="modal-fade">
      <div v-if="isResetPwdModalOpen" class="apple-modal-overlay nested-overlay" @click="closeResetPwdModal">
        <div class="apple-dialog" @click.stop>
          <h3 class="dialog-title">{{ resetPwdStep === 1 ? '安全验证' : '设置新密码' }}</h3>
          <p class="dialog-subtitle">
            {{ resetPwdStep === 1 ? '为了您的账号安全，请验证绑定的手机号。' : '请输入您的新密码并确认。' }}
          </p>
          <div class="dialog-form">
            <template v-if="resetPwdStep === 1">
              <div class="apple-input-group">
                <div class="input-icon-wrapper"><font-awesome-icon :icon="['fas', 'mobile-alt']" /></div>
                <input type="tel" v-model="resetPwdForm.phone" class="apple-dialog-input has-icon" placeholder="绑定的手机号码" disabled />
              </div>
              <div class="apple-input-group flex-group">
                <div class="input-icon-wrapper verify-icon"><font-awesome-icon :icon="['fas', 'shield-alt']" /></div>
                <input type="text" v-model="resetPwdForm.verifyCode" class="apple-dialog-input has-icon flex-1" placeholder="短信验证码" />
                <button class="dialog-btn outline send-code-btn" :disabled="resetPwdCountdown > 0" @click="sendResetPwdCode">
                  {{ resetPwdCountdown > 0 ? `${resetPwdCountdown}s 后重试` : '获取验证码' }}
                </button>
              </div>
            </template>
            <template v-else>
              <div class="apple-input-group">
                <div class="input-icon-wrapper"><font-awesome-icon :icon="['fas', 'lock']" /></div>
                <input :type="showNewPassword ? 'text' : 'password'" v-model="resetPwdForm.newPassword" class="apple-dialog-input has-icon" placeholder="请输入新密码" />
                <div class="input-suffix-icon" @click="showNewPassword = !showNewPassword">
                  <font-awesome-icon :icon="showNewPassword ? ['fas', 'eye'] : ['fas', 'eye-slash']" />
                </div>
              </div>
              <div class="password-strength-container" v-if="resetPwdForm.newPassword">
                <div class="strength-bars">
                  <div class="strength-bar" :style="{ backgroundColor: passwordStrength.score >= 1 ? passwordStrength.color : 'var(--border-color)' }"></div>
                  <div class="strength-bar" :style="{ backgroundColor: passwordStrength.score >= 2 ? passwordStrength.color : 'var(--border-color)' }"></div>
                  <div class="strength-bar" :style="{ backgroundColor: passwordStrength.score >= 3 ? passwordStrength.color : 'var(--border-color)' }"></div>
                </div>
                <span class="strength-text" :style="{ color: passwordStrength.color }">{{ passwordStrength.text }}</span>
              </div>
              <div class="apple-input-group">
                <div class="input-icon-wrapper" :class="{ 'success-icon': isPasswordMatching === true }">
                  <font-awesome-icon :icon="['fas', 'check-circle']" />
                </div>
                <input :type="showConfirmPassword ? 'text' : 'password'" v-model="resetPwdForm.confirmPassword" class="apple-dialog-input has-icon" :class="{ 'is-error': isPasswordMatching === false, 'is-success': isPasswordMatching === true }" placeholder="请确认新密码" />
                <div class="input-suffix-icon" @click="showConfirmPassword = !showConfirmPassword">
                  <font-awesome-icon :icon="showConfirmPassword ? ['fas', 'eye'] : ['fas', 'eye-slash']" />
                </div>
              </div>
              <div class="validation-message" v-if="isPasswordMatching === false">
                <font-awesome-icon :icon="['fas', 'exclamation-circle']" /> 两次输入的密码不一致
              </div>
            </template>
          </div>
          <div class="dialog-actions">
            <button class="dialog-btn outline" @click="closeResetPwdModal">取消</button>
            <button v-if="resetPwdStep === 1" class="dialog-btn primary" @click="nextResetPwdStep">下一步</button>
            <button v-else class="dialog-btn primary" @click="submitResetPwd">确认重置</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive, nextTick } from 'vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { sendCaptcha, verifyCaptcha, resetPassword, changePhone, updateCurrentUser } from '@/api/auth'
import { AppleAlert } from '@/components/common/AppleAlert'

const props = defineProps<{ visible: boolean; initialTab?: 'profile' | 'preferences' }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'logout'): void }>()

const appStore = useAppStore()
const userStore = useUserStore()

const activeTab = ref<'profile' | 'preferences'>('profile')

const close = () => emit('close')

// ====== 强调色 ======
const accentColors = [
  { value: '#0A84FF', lightValue: '#0066cc', name: 'blue' },
  { value: '#BF5AF2', lightValue: '#AF52DE', name: 'purple' },
  { value: '#FF453A', lightValue: '#FF3B30', name: 'red' },
  { value: '#FF9F0A', lightValue: '#FF9500', name: 'orange' },
  { value: '#32D74B', lightValue: '#28CD41', name: 'green' }
]
const currentAccentName = ref(localStorage.getItem('apple-accent-name') || 'blue')
const customColorValue = ref(localStorage.getItem('apple-custom-accent') || '#FF2D55')
const customColorInput = ref<HTMLInputElement | null>(null)

const setAccentColor = (colorObj: any) => {
  currentAccentName.value = colorObj.name
  localStorage.setItem('apple-accent-name', colorObj.name)
  applyAccentColor()
}

const triggerCustomColor = () => {
  currentAccentName.value = 'custom'
  localStorage.setItem('apple-accent-name', 'custom')
  applyAccentColor()
  customColorInput.value?.click()
}

const onCustomColorInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value
  customColorValue.value = val
  localStorage.setItem('apple-custom-accent', val)
  applyAccentColor()
}

const applyAccentColor = () => {
  appStore.applyAccentColor()
}

// ====== 主题切换 ======
const toggleTheme = () => {
  appStore.toggleTheme()
}

// ====== 界面动画 ======
const animationsEnabled = ref(localStorage.getItem('apple-animations') !== 'false')
const toggleAnimations = () => {
  animationsEnabled.value = !animationsEnabled.value
  localStorage.setItem('apple-animations', animationsEnabled.value ? 'true' : 'false')
  if (!animationsEnabled.value) {
    document.body.classList.add('disable-animations')
  } else {
    document.body.classList.remove('disable-animations')
  }
}

// ====== 退出清理缓存 ======
const clearCacheOnExit = ref(localStorage.getItem('apple-clear-cache') === 'true')
const toggleClearCache = () => {
  clearCacheOnExit.value = !clearCacheOnExit.value
  localStorage.setItem('apple-clear-cache', clearCacheOnExit.value ? 'true' : 'false')
}

// ====== 个人资料 ======
const avatarInput = ref<HTMLInputElement | null>(null)
const previewAvatar = ref<string | null>(null)
const userInfo = computed(() => userStore.userInfo)

watch(userInfo, (val) => {
  if (val) previewAvatar.value = val.avatar || null
}, { immediate: true, deep: true })

const formatTime = (timeStr?: string) => {
  if (!timeStr) return '未知'
  const date = new Date(timeStr)
  if (isNaN(date.getTime())) return timeStr
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

const onAvatarError = () => { previewAvatar.value = null }

// 昵称编辑
const isEditingNickname = ref(false)
const editNicknameValue = ref('')
const nicknameInputRef = ref<HTMLInputElement | null>(null)

const startEditNickname = () => {
  editNicknameValue.value = userInfo.value?.nickname || ''
  isEditingNickname.value = true
  nextTick(() => nicknameInputRef.value?.focus())
}

const saveNickname = async () => {
  if (!isEditingNickname.value) return
  const newNickname = editNicknameValue.value.trim()
  if (!newNickname) { AppleAlert.error('提示', '昵称不能为空'); return }
  if (newNickname === userInfo.value?.nickname) { isEditingNickname.value = false; return }
  try {
    await updateCurrentUser({ nickname: newNickname })
    await userStore.fetchUserInfo()
    AppleAlert.success('成功', '昵称修改成功')
    isEditingNickname.value = false
  } catch (error: any) {
    AppleAlert.error('修改失败', error.message || '昵称修改失败')
  }
}

const triggerAvatarUpload = () => avatarInput.value?.click()

const handleAvatarChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = async (ev) => {
    const base64 = ev.target?.result as string
    previewAvatar.value = base64
    try {
      await updateCurrentUser({ avatar: base64 })
      await userStore.fetchUserInfo()
      AppleAlert.success('成功', '头像修改成功')
    } catch (error: any) {
      AppleAlert.error('修改失败', error.message || '头像修改失败')
      previewAvatar.value = userInfo.value?.avatar || null
    }
  }
  reader.readAsDataURL(file)
  if (avatarInput.value) avatarInput.value.value = ''
}

// ====== 密码重置 ======
const isResetPwdModalOpen = ref(false)
const resetPwdStep = ref(1)
const resetPwdCountdown = ref(0)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
let resetPwdTimer: number | null = null
const resetPwdForm = reactive({ phone: '', verifyCode: '', newPassword: '', confirmPassword: '' })

const passwordStrength = computed(() => {
  const pwd = resetPwdForm.newPassword
  if (!pwd) return { score: 0, text: '', color: '' }
  let score = 0
  if (pwd.length >= 8) score += 1
  if (/[A-Za-z]/.test(pwd) && /[0-9]/.test(pwd)) score += 1
  if (/[^A-Za-z0-9]/.test(pwd)) score += 1
  if (pwd.length > 0 && pwd.length < 8) score = 1
  if (score === 1) return { score: 1, text: '弱', color: '#ff4d4f' }
  if (score === 2) return { score: 2, text: '中', color: '#faad14' }
  if (score >= 3) return { score: 3, text: '强', color: '#52c41a' }
  return { score: 0, text: '', color: '' }
})

const isPasswordMatching = computed(() => {
  if (!resetPwdForm.confirmPassword) return null
  return resetPwdForm.newPassword === resetPwdForm.confirmPassword
})

const handlePasswordReset = () => {
  if (!userInfo.value?.phone) { AppleAlert.error('未绑定手机', '请先绑定手机号码后再进行密码重置操作。'); return }
  resetPwdForm.phone = userInfo.value.phone
  resetPwdForm.verifyCode = ''
  resetPwdForm.newPassword = ''
  resetPwdForm.confirmPassword = ''
  showNewPassword.value = false
  showConfirmPassword.value = false
  resetPwdStep.value = 1
  resetPwdCountdown.value = 0
  if (resetPwdTimer) clearInterval(resetPwdTimer)
  isResetPwdModalOpen.value = true
}

const closeResetPwdModal = () => {
  isResetPwdModalOpen.value = false
  if (resetPwdTimer) clearInterval(resetPwdTimer)
}

const sendResetPwdCode = async () => {
  if (resetPwdCountdown.value > 0) return
  if (!resetPwdForm.phone) { AppleAlert.error('错误', '手机号码不能为空'); return }
  try {
    await sendCaptcha(resetPwdForm.phone)
    AppleAlert.success('验证码已发送', '请注意查收短信')
    resetPwdCountdown.value = 60
    resetPwdTimer = window.setInterval(() => {
      resetPwdCountdown.value--
      if (resetPwdCountdown.value <= 0 && resetPwdTimer) clearInterval(resetPwdTimer)
    }, 1000)
  } catch (error: any) { AppleAlert.error('发送失败', error.message || '验证码发送失败') }
}

const nextResetPwdStep = async () => {
  if (!resetPwdForm.verifyCode) { AppleAlert.error('提示', '请输入验证码'); return }
  try {
    await verifyCaptcha(resetPwdForm.phone, resetPwdForm.verifyCode)
    resetPwdStep.value = 2
  } catch (error: any) { AppleAlert.error('验证失败', error.message || '验证码错误') }
}

const submitResetPwd = async () => {
  if (!resetPwdForm.newPassword || !resetPwdForm.confirmPassword) { AppleAlert.error('提示', '请填写完整密码信息'); return }
  if (resetPwdForm.newPassword !== resetPwdForm.confirmPassword) { AppleAlert.error('错误', '两次输入的密码不一致'); return }
  if (resetPwdForm.newPassword.length < 8) { AppleAlert.error('提示', '密码长度不能少于8位'); return }
  try {
    await resetPassword(resetPwdForm.phone, resetPwdForm.verifyCode, resetPwdForm.newPassword, resetPwdForm.confirmPassword)
    AppleAlert.success('重置成功', '密码已成功重置，请重新登录')
    closeResetPwdModal()
    close()
    emit('logout')
  } catch (error: any) { AppleAlert.error('重置失败', error.message || '密码重置失败') }
}

// ====== 手机换绑 ======
const isRebindModalOpen = ref(false)
const rebindStep = ref(1)
const countdown = ref(0)
let timer: number | null = null
const rebindForm = reactive({ oldVerifyCode: '', newPhone: '', newVerifyCode: '' })

const openRebindModal = () => {
  rebindForm.oldVerifyCode = ''
  rebindForm.newPhone = ''
  rebindForm.newVerifyCode = ''
  countdown.value = 0
  if (timer) clearInterval(timer)
  rebindStep.value = userInfo.value?.phone ? 1 : 2
  isRebindModalOpen.value = true
}

const closeRebindModal = () => {
  isRebindModalOpen.value = false
  if (timer) clearInterval(timer)
}

const startCountdown = () => {
  countdown.value = 60
  if (timer) clearInterval(timer)
  timer = window.setInterval(() => {
    countdown.value--
    if (countdown.value <= 0 && timer) clearInterval(timer)
  }, 1000)
}

const sendOldPhoneCode = async () => {
  if (countdown.value > 0) return
  if (!userInfo.value?.phone) return
  try {
    await sendCaptcha(userInfo.value.phone)
    AppleAlert.success('验证码已发送', '请注意查收短信')
    startCountdown()
  } catch (error: any) { AppleAlert.error('发送失败', error.message || '验证码发送失败') }
}

const nextRebindStep = async () => {
  if (!rebindForm.oldVerifyCode) { AppleAlert.error('提示', '请输入验证码'); return }
  try {
    await verifyCaptcha(userInfo.value!.phone, rebindForm.oldVerifyCode)
    rebindStep.value = 2
    countdown.value = 0
    if (timer) clearInterval(timer)
  } catch (error: any) { AppleAlert.error('验证失败', error.message || '验证码错误') }
}

const sendNewPhoneCode = async () => {
  if (countdown.value > 0) return
  if (!rebindForm.newPhone) { AppleAlert.error('错误', '请输入新手机号码'); return }
  if (!/^1[3-9]\d{9}$/.test(rebindForm.newPhone)) { AppleAlert.error('错误', '手机号码格式不正确'); return }
  try {
    await sendCaptcha(rebindForm.newPhone)
    AppleAlert.success('验证码已发送', '请注意查收短信')
    startCountdown()
  } catch (error: any) { AppleAlert.error('发送失败', error.message || '验证码发送失败') }
}

const submitRebind = async () => {
  if (!rebindForm.newPhone || !rebindForm.newVerifyCode) { AppleAlert.error('提示', '请填写完整信息及验证码'); return }
  if (!/^1[3-9]\d{9}$/.test(rebindForm.newPhone)) { AppleAlert.error('错误', '手机号码格式不正确'); return }
  try {
    if (userInfo.value?.phone) {
      await changePhone({ oldPhone: userInfo.value.phone, oldCaptcha: rebindForm.oldVerifyCode, newPhone: rebindForm.newPhone, newCaptcha: rebindForm.newVerifyCode })
    } else {
      await verifyCaptcha(rebindForm.newPhone, rebindForm.newVerifyCode)
      await changePhone({ oldPhone: '', oldCaptcha: '', newPhone: rebindForm.newPhone, newCaptcha: rebindForm.newVerifyCode })
    }
    await userStore.fetchUserInfo()
    AppleAlert.success('成功', userInfo.value?.phone ? '手机号换绑成功' : '手机号绑定成功')
    closeRebindModal()
  } catch (error: any) { AppleAlert.error('操作失败', error.message || '换绑失败，请稍后重试') }
}

// 设置默认打开的 tab
watch(() => props.visible, (v) => {
  if (v) activeTab.value = props.initialTab || 'profile'
})
</script>

<style scoped>
/* ====== CSS 变量 ====== */
.apple-modal-overlay {
  --bg-base: #252523;
  --sidebar-bg: #252523;
  --content-bg: #252523;
  --modal-bg: #1e1e1c;
  --modal-card-bg: #191917;
  --hover-bg: rgba(255, 255, 255, 0.06);
  --active-bg: rgba(255, 255, 255, 0.10);
  --pill-bg: rgba(255, 255, 255, 0.04);
  --border-color: rgba(255, 255, 255, 0.07);
  --text-main: rgba(255, 255, 255, 0.92);
  --text-muted: rgba(255, 255, 255, 0.48);
}

html.dark .apple-modal-overlay {
  --bg-base: #252523;
  --sidebar-bg: #252523;
  --content-bg: #252523;
  --modal-bg: #1e1e1c;
  --modal-card-bg: #191917;
  --hover-bg: rgba(255, 255, 255, 0.06);
  --active-bg: rgba(255, 255, 255, 0.10);
  --pill-bg: rgba(255, 255, 255, 0.04);
  --border-color: rgba(255, 255, 255, 0.07);
  --text-main: rgba(255, 255, 255, 0.92);
  --text-muted: rgba(255, 255, 255, 0.48);
}

:root:not(.dark) .apple-modal-overlay,
html:not(.dark) .apple-modal-overlay {
  --bg-base: #f5f5f7;
  --sidebar-bg: #ffffff;
  --content-bg: #ffffff;
  --modal-bg: #ffffff;
  --modal-card-bg: #ffffff;
  --hover-bg: rgba(0, 0, 0, 0.05);
  --active-bg: rgba(0, 0, 0, 0.08);
  --pill-bg: rgba(255, 255, 255, 1);
  --border-color: rgba(0, 0, 0, 0.08);
  --text-main: #1d1d1f;
  --text-muted: rgba(0, 0, 0, 0.55);
}

/* ====== 主弹窗 ====== */
.apple-modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  z-index: 2000; display: flex; align-items: center; justify-content: center;
}

.apple-modal-container {
  width: 820px; height: 580px; background: var(--modal-bg);
  border: 1px solid var(--border-color); border-radius: 16px; display: flex; overflow: hidden;
  box-shadow: 0 24px 48px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05);
}

.apple-modal-overlay:not(.nested-overlay) {
  /* dark mode default */
}

:root:not(.dark) .apple-modal-overlay .apple-modal-container,
html:not(.dark) .apple-modal-overlay .apple-modal-container {
  box-shadow: 0 24px 48px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
}

.modal-sidebar {
  width: 240px; background: var(--sidebar-bg); border-right: 1px solid var(--border-color);
  padding: 24px 16px; display: flex; flex-direction: column; flex-shrink: 0;
}

.modal-title {
  font-size: 13px; font-weight: 600; color: var(--text-muted);
  letter-spacing: 0.5px; margin-bottom: 16px; padding: 0 12px; text-transform: uppercase;
}

.modal-nav { display: flex; flex-direction: column; gap: 4px; }
.modal-nav-item {
  display: flex; align-items: center; gap: 12px; padding: 8px 12px; border-radius: 8px;
  color: var(--text-main); font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s ease;
}
.modal-nav-item:hover { background: var(--hover-bg); }
.modal-nav-item.is-active { background: var(--active-bg); color: var(--apple-blue); font-weight: 600; }
.modal-nav-item.is-active .nav-icon { color: var(--apple-blue); }
.nav-icon { width: 20px; display: flex; justify-content: center; font-size: 14px; color: var(--text-muted); transition: color 0.2s; }

.modal-content-area {
  flex: 1; position: relative; display: flex; flex-direction: column;
  background: var(--content-bg); overflow: hidden;
}

.modal-close-btn {
  position: absolute; top: 20px; right: 20px; width: 32px; height: 32px; border-radius: 50%;
  border: none; background: var(--pill-bg); color: var(--text-muted); z-index: 10;
  display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;
}
.modal-close-btn:hover { background: var(--hover-bg); color: var(--text-main); }

.settings-panel {
  flex: 1; display: flex; flex-direction: column; overflow-y: auto;
  padding: 40px; scrollbar-width: none;
}
.settings-panel::-webkit-scrollbar { display: none; }

.panel-header { font-size: 24px; font-weight: 700; color: var(--text-main); margin-bottom: 32px; flex-shrink: 0; display: none; }

/* 个人资料 Hero */
.profile-view { padding-top: 48px; }
.profile-hero-section { display: flex; align-items: center; gap: 24px; padding: 0 16px 32px 16px; }

.avatar-editable-wrapper {
  position: relative; width: 72px; height: 72px; border-radius: 50%; cursor: pointer;
  overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); flex-shrink: 0;
}
.avatar-huge {
  width: 100%; height: 100%; border-radius: 50%;
  background: linear-gradient(135deg, var(--apple-blue), color-mix(in srgb, var(--apple-blue) 70%, white));
  color: #fff; font-size: 28px; font-weight: 600; display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.avatar-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.2s ease;
}
.avatar-editable-wrapper:hover .avatar-overlay { opacity: 1; }
.camera-icon { color: #fff; font-size: 20px; }
.hidden-input { display: none; }

.hero-text-content { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; }
.hero-name { font-size: 24px; font-weight: 600; color: var(--text-main); margin: 0 0 4px 0; letter-spacing: -0.5px; }
.hero-email { font-size: 14px; color: var(--text-muted); margin: 0; }

/* 设置项 */
.settings-groups-container { display: flex; flex-direction: column; gap: 28px; max-width: 560px; padding: 0 16px; }
.settings-group { display: flex; flex-direction: column; gap: 10px; }
.group-title { font-size: 13px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; padding-left: 12px; margin: 0; letter-spacing: 0.5px; }
.settings-card { background: var(--modal-card-bg); border-radius: 12px; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.05); border: 1px solid var(--border-color); }
.settings-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; min-height: 48px; transition: background 0.2s ease; }
.row-label { display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 500; color: var(--text-main); min-width: 100px; }

.setting-icon-box { width: 26px; height: 26px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white; font-size: 13px; flex-shrink: 0; }
.bg-blue { background-color: #007aff; }
.bg-green { background-color: #34c759; }
.bg-orange { background-color: #ff9500; }
.bg-red { background-color: #ff3b30; }
.bg-grey { background-color: #8e8e93; }
.bg-indigo { background-color: #5856d6; }

.row-content { flex: 1; display: flex; justify-content: flex-end; align-items: center; text-align: right; }
.row-value { font-size: 14px; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.readonly-text { color: var(--text-muted); }
.row-content-left { display: flex; flex-direction: column; justify-content: center; gap: 2px; }
.row-desc { font-size: 12px; color: var(--text-muted); }
.row-content-right { flex-shrink: 0; }

.action-text-btn {
  background: transparent; border: none; font-size: 14px; color: var(--apple-blue);
  cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: background 0.2s; flex-shrink: 0;
}
.action-text-btn:hover { background: rgba(10, 132, 255, 0.1); }

.inline-edit-input {
  background: var(--bg-base); border: 1px solid var(--apple-blue); border-radius: 6px;
  padding: 4px 8px; font-size: 14px; color: var(--text-main); outline: none; width: 120px; text-align: right;
}
.editable-text { cursor: pointer; color: var(--text-main); transition: color 0.2s; }
.editable-text:hover { color: var(--apple-blue); }
.row-divider { height: 1px; background: var(--border-color); margin-left: 54px; }
.mt-2 { margin-top: 8px; }
.ml-3 { margin-left: 12px; }
.ml-icon-offset { margin-left: 38px; }
.placeholder-text { opacity: 0.5; }
.flex-1 { flex: 1; }
.flex-group { display: flex; gap: 8px; align-items: center; }

/* 强调色 */
.color-picker-group { display: flex; gap: 10px; align-items: center; }
.color-dot {
  width: 22px; height: 22px; border-radius: 50%; cursor: pointer;
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1);
}
.color-dot:hover { transform: scale(1.15); }
.color-dot.active { transform: scale(1.15); box-shadow: 0 0 0 2.5px var(--modal-card-bg), 0 0 0 4.5px var(--apple-blue), inset 0 1px 2px rgba(0,0,0,0.3); }
.custom-color-wrapper { position: relative; display: flex; align-items: center; justify-content: center; }
.invisible-color-input { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; pointer-events: none; }

/* Switch */
.apple-switch { width: 50px; height: 30px; border-radius: 15px; background: rgba(120,120,128,0.32); position: relative; cursor: pointer; transition: background 0.3s ease; display: flex; align-items: center; }
.apple-switch.is-on { background: #34C759; }
html:not(.dark) .apple-switch { background: #E9E9EB; }
html:not(.dark) .apple-switch.is-on { background: #34C759; }
.switch-knob {
  width: 26px; height: 26px; background: #fff; border-radius: 50%; position: absolute; left: 2px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.15), 0 1px 1px rgba(0,0,0,0.16);
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  display: flex; align-items: center; justify-content: center;
}
.apple-switch.is-on .switch-knob { transform: translateX(20px); }
.knob-icon { font-size: 12px; color: #1c1c1e; }
.knob-icon.light { color: #f5a623; }

/* 动画 */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active .apple-modal-container,
.modal-fade-enter-active .apple-dialog { animation: modal-scale-in 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
.modal-fade-leave-active .apple-modal-container,
.modal-fade-leave-active .apple-dialog { animation: modal-scale-out 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
@keyframes modal-scale-in { from { transform: scale(0.96); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes modal-scale-out { from { transform: scale(1); opacity: 1; } to { transform: scale(0.96); opacity: 0; } }
@keyframes fade-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

.panel-fade-enter-active, .panel-fade-leave-active { transition: opacity 0.2s ease; }
.panel-fade-enter-from, .panel-fade-leave-to { opacity: 0; }

/* 子弹窗 */
.nested-overlay { z-index: 2500; background: rgba(0,0,0,0.5); }
.apple-dialog {
  width: 380px; background: var(--modal-card-bg); border-radius: 16px;
  padding: 32px 24px; display: flex; flex-direction: column; gap: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3); border: 1px solid var(--border-color);
}
html:not(.dark) .apple-dialog { box-shadow: 0 20px 40px rgba(0,0,0,0.15); background: #ffffff; }

.dialog-title { font-size: 20px; font-weight: 600; text-align: center; color: var(--text-main); margin: 0; }
.dialog-subtitle { font-size: 14px; color: var(--text-muted); text-align: center; margin-top: -12px; margin-bottom: 8px; line-height: 1.4; }
.dialog-form { display: flex; flex-direction: column; gap: 16px; margin-top: 0; }
.apple-input-group { position: relative; display: flex; width: 100%; align-items: center; }
.input-icon-wrapper { position: absolute; left: 14px; color: var(--text-muted); font-size: 15px; display: flex; align-items: center; justify-content: center; pointer-events: none; }
.apple-dialog-input {
  width: 100%; height: 44px; background: var(--bg-base); border: 1px solid var(--border-color);
  border-radius: 10px; padding: 12px 14px; color: var(--text-main); font-size: 15px;
  outline: none; transition: border-color 0.2s, box-shadow 0.2s;
}
.apple-dialog-input.has-icon { padding-left: 40px; }
.apple-dialog-input:focus { border-color: var(--apple-blue); }
.apple-dialog-input.is-error { border-color: #ff4d4f; }
.apple-dialog-input.is-error:focus { border-color: #ff4d4f; box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2); }
.apple-dialog-input:disabled { opacity: 0.6; cursor: not-allowed; background-color: var(--hover-bg); }
.input-icon-wrapper.success-icon { color: #32D74B !important; }
.apple-dialog-input.is-success { border-color: #32D74B; }
.apple-dialog-input.is-success:focus { border-color: #32D74B; box-shadow: 0 0 0 2px rgba(50, 215, 75, 0.2); }
html:not(.dark) .input-icon-wrapper.success-icon { color: #34C759 !important; }
html:not(.dark) .apple-dialog-input.is-success { border-color: #34C759; }
html:not(.dark) .apple-dialog-input.is-success:focus { border-color: #34C759; box-shadow: 0 0 0 2px rgba(52, 199, 89, 0.2); }

.input-suffix-icon { position: absolute; right: 14px; color: var(--text-muted); font-size: 15px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: color 0.2s; }
.input-suffix-icon:hover { color: var(--text-main); }

.password-strength-container { display: flex; align-items: center; gap: 8px; margin-top: -8px; margin-bottom: 4px; padding: 0 8px; }
.strength-bars { display: flex; gap: 4px; flex: 1; }
.strength-bar { height: 4px; flex: 1; border-radius: 2px; background-color: var(--border-color); transition: background-color 0.3s ease; }
.strength-text { font-size: 12px; font-weight: 600; min-width: 14px; text-align: right; transition: color 0.3s ease; }
.validation-message { font-size: 13px; color: #ff4d4f; margin-top: -8px; margin-bottom: 4px; padding: 0 8px; display: flex; align-items: center; gap: 6px; }

.dialog-btn { height: 44px; padding: 0 16px; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; flex: 1; text-align: center; }
.dialog-btn.primary { background: var(--apple-blue); color: #fff; }
.dialog-btn.primary:hover { filter: brightness(1.1); }
.dialog-btn.outline { background: transparent; border: 1px solid var(--border-color); color: var(--text-main); }
.dialog-btn.outline:hover { background: var(--hover-bg); }
.dialog-btn:disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
.dialog-actions { display: flex; gap: 12px; margin-top: 8px; }
.send-code-btn { flex: 0 0 110px; padding: 0 8px; font-size: 14px; font-weight: 500; height: 44px; white-space: nowrap; border-radius: 10px; }
</style>
