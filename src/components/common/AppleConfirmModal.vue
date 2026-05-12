<template>
  <transition name="apple-alert-fade">
    <div v-if="visible" class="apple-alert-overlay" @click="handleOverlayClick">
      <div class="apple-alert-box" @click.stop>

        <!-- 动态图标与背景 -->
        <div class="apple-alert-icon-wrapper" :class="type">
          <div class="alert-icon-bg"></div>
          <!-- 可以根据需要扩展不同类型的图标，这里统一使用 WarningFilled -->
          <warning-filled class="alert-icon" />
        </div>

        <!-- 标题与描述 -->
        <h3 class="apple-alert-title">{{ title }}</h3>
        <p class="apple-alert-desc">
          <slot name="desc">{{ desc }}</slot>
        </p>

        <!-- 操作按钮 -->
        <div class="apple-alert-actions">
          <button class="alert-btn cancel" @click="handleCancel" :disabled="loading">
            {{ cancelText }}
          </button>
          <button class="alert-btn" :class="type" @click="handleConfirm" :disabled="loading">
            <span v-if="!loading">{{ confirmText }}</span>
            <loading-outlined v-else />
          </button>
        </div>

      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { WarningFilled, LoadingOutlined } from '@ant-design/icons-vue'

const props = withDefaults(defineProps<{
  visible: boolean;
  type?: 'danger' | 'warning';
  title?: string;
  desc?: string;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
}>(), {
  type: 'danger',
  title: '确认操作',
  desc: '您确定要执行此操作吗？此操作可能无法撤销。',
  loading: false,
  confirmText: '确认',
  cancelText: '取消'
})

const emit = defineEmits(['update:visible', 'confirm', 'cancel'])

const handleOverlayClick = () => {
  if (!props.loading) {
    emit('update:visible', false)
    emit('cancel')
  }
}

const handleCancel = () => {
  emit('update:visible', false)
  emit('cancel')
}

const handleConfirm = () => {
  emit('confirm')
}
</script>

<style scoped>
/* ================== Apple 风格自定义确认弹窗 ================== */
.apple-alert-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.apple-alert-box {
  width: 320px;
  background: var(--content-bg, #ffffff);
  border-radius: 20px;
  padding: 32px 24px 24px;
  box-shadow: 0 24px 48px var(--shadow-color, rgba(0, 0, 0, 0.2)), 0 0 0 1px var(--border-color, rgba(0,0,0,0.05));
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.apple-alert-icon-wrapper {
  position: relative;
  width: 56px;
  height: 56px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert-icon-bg {
  position: absolute;
  inset: 0;
  border-radius: 50%;
}
.alert-icon {
  font-size: 28px;
  z-index: 1;
}

/* --- 高风险操作 (Danger - Apple Red) --- */
.apple-alert-icon-wrapper.danger .alert-icon-bg { background: #FF453A; opacity: 0.15; }
.apple-alert-icon-wrapper.danger .alert-icon { color: #FF453A; }

.alert-btn.danger { background: #FF453A; color: #fff; box-shadow: 0 4px 12px rgba(255, 69, 58, 0.3); }
.alert-btn.danger:hover { background: #FF3B30; transform: translateY(-1px); }

/* --- 警告操作 (Warning - Apple Orange) --- */
.apple-alert-icon-wrapper.warning .alert-icon-bg { background: #FF9F0A; opacity: 0.15; }
.apple-alert-icon-wrapper.warning .alert-icon { color: #FF9F0A; }

.alert-btn.warning { background: #FF9F0A; color: #fff; box-shadow: 0 4px 12px rgba(255, 159, 10, 0.3); }
.alert-btn.warning:hover { background: #E88B00; transform: translateY(-1px); }

/* --- 文本与布局 --- */
.apple-alert-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main, #333);
  margin: 0 0 10px;
  letter-spacing: 0.5px;
}
.apple-alert-desc {
  font-size: 14px;
  color: var(--text-muted, #666);
  line-height: 1.5;
  margin: 0 0 28px;
}

.apple-alert-actions { display: flex; width: 100%; gap: 12px; }
.alert-btn {
  flex: 1;
  height: 44px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.alert-btn.cancel { background: var(--hover-bg, #f5f5f7); color: var(--text-main, #333); }
.alert-btn.cancel:hover { filter: brightness(0.9); }

.alert-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

/* --- 动画 --- */
.apple-alert-fade-enter-active, .apple-alert-fade-leave-active { transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }
.apple-alert-fade-enter-from, .apple-alert-fade-leave-to { opacity: 0; }
.apple-alert-fade-enter-from .apple-alert-box, .apple-alert-fade-leave-to .apple-alert-box { transform: scale(0.92); opacity: 0; }
</style>

<style>
/* 暗黑模式适配 - 实色递进层次感 */
html.dark .apple-alert-box {
  background: #1e1e22;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06);
}

html.dark .alert-btn.cancel {
  background: #2a2a2e;
  color: #e0e0e0;
}
</style>