<template>
  <a-modal
      wrap-class-name="neo-modal"
      :open="open"
      @update:open="val => emit('update:open', val)"
      :closable="false"
      :footer="null"
      :width="width"
      :destroyOnClose="destroyOnClose"
      :centered="true"
  >
    <div class="neo-modal-content-wrap">
      <!-- 动态环境光晕 -->
      <div :class="['neo-modal-glow', `${theme}-glow`]"></div>

      <!-- 独立关闭按钮 -->
      <button class="neo-modal-close" @click="handleCancel">
        <font-awesome-icon :icon="['fas', 'times']" />
      </button>

      <!-- 自定义头部 -->
      <div class="neo-modal-header">
        <div :class="['header-icon-box', `${theme}-icon`]">
          <font-awesome-icon :icon="icon" v-if="icon" />
          <slot name="icon" v-else></slot>
        </div>
        <div class="header-text-content">
          <h3 class="custom-title">{{ title }}</h3>
          <p class="custom-subtitle">
            <slot name="subtitle">{{ subtitle }}</slot>
          </p>
        </div>
      </div>

      <!-- 高度集成的表单主体区 -->
      <div class="neo-modal-body">
        <a-form
            ref="formRef"
            class="neo-form hide-native-asterisk"
            layout="vertical"
            :model="model"
            :rules="rules"
        >
          <slot></slot>
        </a-form>
      </div>

      <!-- 底部操作栏 -->
      <div class="neo-modal-footer">
        <button class="neo-btn-flat" @click="handleCancel" :disabled="confirmLoading">
          {{ cancelText }}
        </button>
        <button :class="['neo-btn-solid', theme]" @click="handleConfirm" :disabled="confirmLoading">
          <span v-if="!confirmLoading">{{ confirmText }}</span>
          <font-awesome-icon :icon="['fas', 'spinner']" spin v-else />
        </button>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  open: boolean;
  title: string;
  subtitle?: string;
  width?: number | string;
  icon?: string[];
  theme?: 'primary' | 'success' | 'danger' | 'warning';
  confirmText?: string;
  cancelText?: string;
  confirmLoading?: boolean;
  destroyOnClose?: boolean;
  model?: any; // 接收表单对象
  rules?: any; // 接收表单规则
}>(), {
  width: 480,
  theme: 'primary',
  confirmText: '确定',
  cancelText: '取消',
  confirmLoading: false,
  destroyOnClose: false
})

const emit = defineEmits(['update:open', 'ok', 'cancel'])
const formRef = ref<any>()

// 透传底层 a-form 的校验方法，方便父组件通过 ref 直接调用
defineExpose({
  validate: (...args: any[]) => formRef.value?.validate(...args),
  validateFields: (...args: any[]) => formRef.value?.validateFields(...args),
  resetFields: (...args: any[]) => formRef.value?.resetFields(...args),
  clearValidate: (...args: any[]) => formRef.value?.clearValidate(...args),
})

const handleCancel = () => {
  if (props.confirmLoading) return
  emit('update:open', false)
  emit('cancel')
}

const handleConfirm = () => {
  if (props.confirmLoading) return
  emit('ok')
}
</script>

<style scoped>
/* ================== 全新重绘的桌面级高级弹窗 (Apple Style) ================== */
:global(.neo-modal) { top: 0 !important; }
:global(.neo-modal .ant-modal-content) { padding: 0 !important; background: transparent !important; box-shadow: none !important; }

.neo-modal-content-wrap {
  position: relative;
  background: var(--content-bg, #ffffff);
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.08),
    0 8px 24px rgba(0, 0, 0, 0.12),
    0 32px 64px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

/* ---- 关闭按钮 ---- */
.neo-modal-close {
  position: absolute; top: 16px; right: 16px;
  width: 28px; height: 28px; border-radius: 50%; border: none;
  background: transparent; color: var(--text-muted, #86868b);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; z-index: 10;
  font-size: 12px;
  transition: all 0.2s ease;
}
.neo-modal-close:hover {
  background: rgba(0, 0, 0, 0.06);
  color: var(--text-main, #1d1d1f);
}
.neo-modal-close:active {
  transform: scale(0.9);
}

/* ---- 环境光晕 ---- */
.neo-modal-glow {
  position: absolute; top: -40px; left: -40px;
  width: 180px; height: 180px;
  pointer-events: none; z-index: 0;
  border-radius: 50%;
  filter: blur(40px);
}
.primary-glow { background: radial-gradient(circle, color-mix(in srgb, var(--apple-blue) 13%, transparent) 0%, transparent 70%); }
.success-glow { background: radial-gradient(circle, rgba(52, 199, 89, 0.13) 0%, transparent 70%); }
.danger-glow  { background: radial-gradient(circle, rgba(255, 69, 58, 0.13) 0%, transparent 70%); }
.warning-glow { background: radial-gradient(circle, rgba(255, 159, 10, 0.13) 0%, transparent 70%); }

/* ---- 头部区域 ---- */
.neo-modal-header {
  position: relative; z-index: 1;
  display: flex; align-items: center; gap: 14px;
  padding: 28px 24px 20px;
}
.header-icon-box {
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; color: #ffffff;
  flex-shrink: 0;
}
.header-icon-box.primary-icon {
  background: linear-gradient(135deg, var(--apple-blue) 0%, color-mix(in srgb, var(--apple-blue) 85%, black) 100%);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--apple-blue) 30%, transparent);
}
.header-icon-box.success-icon {
  background: linear-gradient(135deg, #34C759 0%, #28A745 100%);
  box-shadow: 0 4px 12px rgba(52, 199, 89, 0.3);
}
.header-icon-box.danger-icon {
  background: linear-gradient(135deg, #FF453A 0%, #E0392E 100%);
  box-shadow: 0 4px 12px rgba(255, 69, 58, 0.3);
}
.header-icon-box.warning-icon {
  background: linear-gradient(135deg, #FF9F0A 0%, #E08B00 100%);
  box-shadow: 0 4px 12px rgba(255, 159, 10, 0.3);
}

.header-text-content { display: flex; flex-direction: column; justify-content: center; }
.custom-title {
  font-size: 17px; font-weight: 650;
  color: var(--text-main, #1d1d1f);
  margin: 0 0 3px 0; letter-spacing: -0.01em;
}
.custom-subtitle {
  font-size: 13px; line-height: 1.4;
  color: var(--text-muted, #8e8e93); margin: 0;
}
:global(.highlight-text) { color: var(--apple-blue, #0A84FF); font-weight: 600; }

/* ================== 表单区 ================== */
.neo-modal-body {
  position: relative; z-index: 1;
  padding: 20px 24px;
  border-top: 1px solid var(--border-color, rgba(0, 0, 0, 0.06));
  max-height: 50vh;
  overflow-y: auto;
}

/* 滚动条美化 */
.neo-modal-body::-webkit-scrollbar { width: 5px; }
.neo-modal-body::-webkit-scrollbar-track { background: transparent; }
.neo-modal-body::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15); border-radius: 3px;
}
.neo-modal-body::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.25); }

:global(.form-grid) { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

:global(.neo-form .ant-form-item) { margin-bottom: 20px !important; transition: margin-bottom 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) !important; }
:global(.neo-form .ant-form-item.ant-form-item-with-help) { margin-bottom: 32px !important; }

:global(.neo-form .ant-form-item-label) { padding-bottom: 6px !important; }
:global(.neo-form .ant-form-item-label > label) {
  font-weight: 600; color: var(--text-main, #1d1d1f) !important;
  font-size: 13px; letter-spacing: 0.3px; display: flex; align-items: center;
}

/* 纯 CSS 魔法：直接劫持原生必填状态 */
:global(.neo-form.hide-native-asterisk .ant-form-item-required::before) { display: none !important; }

/* Apple 风格必填 Tag */
:global(.neo-form .ant-form-item-required::after) {
  content: '必填' !important;
  display: inline-block !important;
  font-size: 11px !important;
  color: #FF453A !important;
  background: rgba(255, 69, 58, 0.08) !important;
  padding: 0 6px !important;
  border-radius: 4px !important;
  margin-left: 8px !important;
  font-weight: 500 !important;
  letter-spacing: 0.5px !important;
  border: 1px solid rgba(255, 69, 58, 0.15) !important;
  line-height: 18px !important;
  position: relative;
  top: -1px;
}

:global(.neo-form .ant-input:not(textarea)),
:global(.neo-form .ant-input-number-input),
:global(.neo-form .ant-select-selector) {
  border-radius: 10px !important;
  background: var(--content-bg, #ffffff) !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  padding: 0 12px !important;
  height: 40px !important;
  font-size: 14px !important;
  color: var(--text-main, #1d1d1f) !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02) !important;
  transition: border-color 0.25s ease, box-shadow 0.25s ease !important;
}
:global(.neo-form .ant-input::placeholder),
:global(.neo-form .ant-select-selection-placeholder) {
  color: rgba(0, 0, 0, 0.28) !important;
}
:global(.neo-form .ant-select-selector) { padding: 0 12px !important; display: flex; align-items: center; }
:global(.neo-form .ant-select-selection-item) { line-height: 38px !important; }
:global(.neo-form .ant-input-number) { width: 100% !important; border: none !important; box-shadow: none !important; }
:global(.neo-form .ant-input-number-handler-wrap) { display: none !important; }
:global(.neo-form textarea.ant-input) { padding: 12px !important; min-height: 0; line-height: 1.5 !important; overflow: hidden; border-radius: 10px !important; background: var(--content-bg, #ffffff) !important; border: 1px solid rgba(0, 0, 0, 0.08) !important; color: var(--text-main, #1d1d1f) !important; font-size: 14px !important; }

/* 聚焦态 - 主题色跟随（默认 primary） */
:global(.neo-form .ant-input:focus),
:global(.neo-form .ant-input-focused),
:global(.neo-form .ant-input-number:focus-within),
:global(.neo-form .ant-select-focused .ant-select-selector) {
  background: var(--content-bg, #ffffff) !important;
  border-color: var(--neo-theme-color, #0A84FF) !important;
  box-shadow: 0 0 0 3px var(--neo-theme-glow, rgba(10, 132, 255, 0.12)) !important;
}

:global(.neo-form .ant-input[disabled]),
:global(.neo-form .ant-input-number-input[disabled]),
:global(.neo-form .ant-select-disabled .ant-select-selector),
:global(.neo-form textarea.ant-input[disabled]) {
  background-color: var(--hover-bg, rgba(240, 240, 245, 0.6)) !important;
  color: var(--text-muted, #8e8e93) !important;
  border-color: transparent !important;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.04) !important;
  cursor: not-allowed !important;
}

:global(.dark .neo-form .ant-input[disabled]),
:global(.dark .neo-form .ant-input-number-input[disabled]),
:global(.dark .neo-form .ant-select-disabled .ant-select-selector),
:global(.dark .neo-form textarea.ant-input[disabled]) {
  background-color: rgba(0, 0, 0, 0.2) !important;
  color: rgba(255, 255, 255, 0.3) !important;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4) !important;
  border-color: transparent !important;
}

:global(.neo-form .ant-form-item-has-error .ant-input),
:global(.neo-form .ant-form-item-has-error .ant-input-number-input),
:global(.neo-form .ant-form-item-has-error .ant-select-selector) {
  background: rgba(255, 69, 58, 0.04) !important;
  border-color: rgba(255, 69, 58, 0.4) !important;
  box-shadow: 0 0 0 3px rgba(255, 69, 58, 0.08) !important;
  animation: fieldShake 0.3s ease;
}

:global(.neo-form .ant-form-item-explain-error) {
  color: #FF453A !important; font-size: 12px !important; font-weight: 600 !important;
  margin-top: 8px !important; padding: 6px 12px 6px 8px !important;
  background: rgba(255, 69, 58, 0.08) !important; border-radius: 8px !important;
  display: inline-flex !important; align-items: center; line-height: 1.2 !important;
  animation: errorBubbleIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

:global(.neo-form .ant-form-item-explain-error::before) {
  content: '!'; display: inline-flex; align-items: center; justify-content: center;
  width: 14px; height: 14px;
  background: #FF453A; color: #ffffff; border-radius: 50%;
  font-size: 11px; font-weight: 800; margin-right: 6px;
}

@keyframes errorBubbleIn {
  from { opacity: 0; transform: translateY(-6px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes fieldShake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-3px); }
  40% { transform: translateX(3px); }
  60% { transform: translateX(-2px); }
  80% { transform: translateX(2px); }
}

/* ================== 底部操作栏 ================== */
.neo-modal-footer {
  position: relative; z-index: 1;
  display: flex; justify-content: flex-end; gap: 12px;
  padding: 16px 24px 20px;
  border-top: 1px solid var(--border-color, rgba(0, 0, 0, 0.06));
}
.neo-btn-flat, .neo-btn-solid {
  min-width: 88px; height: 38px; padding: 0 20px; border-radius: 10px;
  font-size: 14px; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.neo-btn-flat {
  background: transparent; color: var(--text-main, #333);
  border: 1px solid var(--border-color, #d1d1d6);
  font-weight: 500;
}
.neo-btn-flat:hover {
  background: rgba(0, 0, 0, 0.04);
  border-color: #c7c7cc;
}
.neo-btn-flat:active {
  background: rgba(0, 0, 0, 0.06);
}

/* 确认按钮 - 主题渐变 */
.neo-btn-solid {
  color: #ffffff; font-weight: 600;
}
.neo-btn-solid.primary {
  background: linear-gradient(135deg, var(--apple-blue) 0%, color-mix(in srgb, var(--apple-blue) 85%, black) 100%);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--apple-blue) 25%, transparent);
}
.neo-btn-solid.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px color-mix(in srgb, var(--apple-blue) 35%, transparent);
}
.neo-btn-solid.primary:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px color-mix(in srgb, var(--apple-blue) 20%, transparent);
}
.neo-btn-solid.success {
  background: linear-gradient(135deg, #34C759 0%, #28A745 100%);
  box-shadow: 0 2px 8px rgba(52, 199, 89, 0.25);
}
.neo-btn-solid.success:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(52, 199, 89, 0.35);
}
.neo-btn-solid.success:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(52, 199, 89, 0.2);
}
.neo-btn-solid.danger {
  background: linear-gradient(135deg, #FF453A 0%, #E0392E 100%);
  box-shadow: 0 2px 8px rgba(255, 69, 58, 0.25);
}
.neo-btn-solid.danger:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(255, 69, 58, 0.35);
}
.neo-btn-solid.danger:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(255, 69, 58, 0.2);
}
.neo-btn-solid.warning {
  background: linear-gradient(135deg, #FF9F0A 0%, #E08B00 100%);
  box-shadow: 0 2px 8px rgba(255, 159, 10, 0.25);
}
.neo-btn-solid.warning:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(255, 159, 10, 0.35);
}
.neo-btn-solid.warning:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(255, 159, 10, 0.2);
}

/* 加载 spinner 白色 */
.neo-btn-solid :deep(.fa-spinner) { color: #ffffff; }

/* 主题色 CSS 变量注入 */
.neo-modal-content-wrap { --neo-theme-color: var(--apple-blue); --neo-theme-glow: color-mix(in srgb, var(--apple-blue) 12%, transparent); }
</style>

<style>
/* ================== 暗黑模式完整适配 (非scoped，确保teleported modal正确匹配) ================== */
html.dark .neo-modal-content-wrap {
  background: var(--modal-bg) !important;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.06),
    0 8px 24px rgba(0, 0, 0, 0.4),
    0 32px 64px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.06) !important;
}

html.dark .neo-modal-close {
  background: transparent;
  color: var(--text-muted);
}
html.dark .neo-modal-close:hover {
  background: var(--active-bg);
  color: var(--text-main);
}

html.dark .neo-modal-content-wrap .custom-title {
  color: var(--text-main) !important;
}
html.dark .neo-modal-content-wrap .custom-subtitle {
  color: var(--text-muted) !important;
}

/* 图标盒子暗色模式 - 保持渐变背景，增强光晕 */
html.dark .neo-modal-content-wrap .header-icon-box.primary-icon {
  background: linear-gradient(135deg, var(--apple-blue) 0%, color-mix(in srgb, var(--apple-blue) 85%, black) 100%) !important;
  box-shadow: 0 4px 16px color-mix(in srgb, var(--apple-blue) 40%, transparent), 0 0 24px color-mix(in srgb, var(--apple-blue) 20%, transparent) !important;
}
html.dark .neo-modal-content-wrap .header-icon-box.success-icon {
  background: linear-gradient(135deg, #34C759 0%, #28A745 100%) !important;
  box-shadow: 0 4px 16px rgba(52, 199, 89, 0.4), 0 0 24px rgba(52, 199, 89, 0.2) !important;
}
html.dark .neo-modal-content-wrap .header-icon-box.danger-icon {
  background: linear-gradient(135deg, #FF453A 0%, #E0392E 100%) !important;
  box-shadow: 0 4px 16px rgba(255, 69, 58, 0.4), 0 0 24px rgba(255, 69, 58, 0.2) !important;
}
html.dark .neo-modal-content-wrap .header-icon-box.warning-icon {
  background: linear-gradient(135deg, #FF9F0A 0%, #E08B00 100%) !important;
  box-shadow: 0 4px 16px rgba(255, 159, 10, 0.4), 0 0 24px rgba(255, 159, 10, 0.2) !important;
}

html.dark .neo-modal-body {
  border-color: rgba(255, 255, 255, 0.06) !important;
}
html.dark .neo-modal-body::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
}
html.dark .neo-modal-body::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}

html.dark .neo-modal-footer {
  background: rgba(0, 0, 0, 0.15) !important;
  border-color: rgba(255, 255, 255, 0.06) !important;
}

html.dark .neo-btn-flat {
  background: var(--hover-bg) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  color: var(--text-main) !important;
}
html.dark .neo-btn-flat:hover {
  background: var(--active-bg) !important;
  border-color: rgba(255, 255, 255, 0.15) !important;
}

html.dark .neo-btn-solid.primary {
  box-shadow: 0 2px 12px color-mix(in srgb, var(--apple-blue) 35%, transparent) !important;
}
html.dark .neo-btn-solid.primary:hover {
  box-shadow: 0 4px 20px color-mix(in srgb, var(--apple-blue) 45%, transparent) !important;
}
html.dark .neo-btn-solid.success {
  box-shadow: 0 2px 12px rgba(52, 199, 89, 0.35) !important;
}
html.dark .neo-btn-solid.success:hover {
  box-shadow: 0 4px 20px rgba(52, 199, 89, 0.45) !important;
}
html.dark .neo-btn-solid.danger {
  box-shadow: 0 2px 12px rgba(255, 69, 58, 0.35) !important;
}
html.dark .neo-btn-solid.danger:hover {
  box-shadow: 0 4px 20px rgba(255, 69, 58, 0.45) !important;
}
html.dark .neo-btn-solid.warning {
  box-shadow: 0 2px 12px rgba(255, 159, 10, 0.35) !important;
}
html.dark .neo-btn-solid.warning:hover {
  box-shadow: 0 4px 20px rgba(255, 159, 10, 0.45) !important;
}

html.dark .neo-form .ant-input:not(textarea),
html.dark .neo-form .ant-input-number-input,
html.dark .neo-form .ant-select-selector {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  color: #ffffff !important;
}

html.dark .neo-form .ant-form-item-label > label {
  color: #ffffff !important;
}

html.dark .neo-form .ant-input::placeholder,
html.dark .neo-form .ant-select-selection-placeholder {
  color: rgba(255, 255, 255, 0.3) !important;
}

html.dark .neo-form .ant-input:focus,
html.dark .neo-form .ant-input-focused,
html.dark .neo-form .ant-input-number:focus-within,
html.dark .neo-form .ant-select-focused .ant-select-selector {
  background: rgba(255, 255, 255, 0.06) !important;
  border-color: var(--neo-theme-color, rgba(10, 132, 255, 0.7)) !important;
  box-shadow: 0 0 0 3px var(--neo-theme-glow, rgba(10, 132, 255, 0.2)) !important;
}

html.dark .neo-form .ant-input[disabled],
html.dark .neo-form .ant-input-number-input[disabled],
html.dark .neo-form .ant-select-disabled .ant-select-selector,
html.dark .neo-form textarea.ant-input[disabled] {
  background-color: rgba(0, 0, 0, 0.25) !important;
  color: rgba(255, 255, 255, 0.25) !important;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4) !important;
  border-color: transparent !important;
}

html.dark .neo-form textarea.ant-input {
  background: var(--input-bg) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  color: var(--text-main) !important;
}

html.dark .neo-form .ant-select-arrow {
  color: var(--text-muted) !important;
}
</style>