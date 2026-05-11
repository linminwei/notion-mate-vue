<template>
  <a-modal
      wrap-class-name="neo-modal"
      :open="open"
      @update:open="val => emit('update:open', val)"
      :closable="false"
      :footer="null"
      :width="width"
      :destroyOnClose="destroyOnClose"
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
:global(.neo-modal) { top: 60px !important; }
:global(.neo-modal .ant-modal-content) { padding: 0 !important; background: transparent !important; box-shadow: none !important; }

.neo-modal-content-wrap {
  position: relative; background: var(--content-bg, #ffffff); border-radius: 20px; overflow: hidden;
  box-shadow: 0 20px 60px var(--shadow-color, rgba(0,0,0,0.15)), 0 0 0 1px var(--border-color, rgba(0,0,0,0.06));
}
/* dark mode for .neo-modal-content-wrap: see non-scoped <style> block below */

.neo-modal-close {
  position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; border-radius: 8px; border: none;
  background: var(--hover-bg, rgba(0,0,0,0.04)); color: var(--text-muted, #86868b);
  display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10; transition: all 0.2s ease;
}
.neo-modal-close:hover { background: var(--active-bg, rgba(0,0,0,0.08)); color: var(--text-main, #1d1d1f); transform: scale(0.95); }

/* 环境光晕动态映射 */
.neo-modal-glow { position: absolute; top: -50px; left: -50px; width: 240px; height: 240px; pointer-events: none; z-index: 0; }
.primary-glow { background: radial-gradient(circle, rgba(10, 132, 255, 0.12) 0%, transparent 60%); }
.success-glow { background: radial-gradient(circle, rgba(52, 199, 89, 0.12) 0%, transparent 60%); }
.danger-glow  { background: radial-gradient(circle, rgba(255, 69, 58, 0.12) 0%, transparent 60%); }
.warning-glow { background: radial-gradient(circle, rgba(255, 159, 10, 0.12) 0%, transparent 60%); }

.neo-modal-header { position: relative; z-index: 1; display: flex; align-items: center; gap: 16px; padding: 32px 32px 24px; }
.header-icon-box {
  width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px;
  background: var(--content-bg, #ffffff);
  box-shadow: 0 4px 12px var(--shadow-color, rgba(0,0,0,0.08)),
              inset 0 0 0 1px var(--border-color, rgba(0,0,0,0.05)),
              0 0 20px color-mix(in srgb, var(--apple-blue) 25%, transparent),
              0 0 40px color-mix(in srgb, var(--apple-blue) 12%, transparent);
}
.header-icon-box.primary-icon { color: var(--apple-blue, #0A84FF); }
.header-icon-box.success-icon { color: #34C759; }
.header-icon-box.danger-icon  { color: #FF453A; }
.header-icon-box.warning-icon { color: #FF9F0A; }

.header-text-content { display: flex; flex-direction: column; justify-content: center; }
.custom-title { font-size: 20px; font-weight: 700; color: var(--text-main, #1d1d1f); margin: 0 0 4px 0; letter-spacing: -0.01em; }
.custom-subtitle { font-size: 13px; color: var(--text-muted, #86868b); margin: 0; }
:global(.highlight-text) { color: var(--apple-blue, #0A84FF); font-weight: 600; }

/* ================== 表单区重塑 (全局注入NeoForm样式) ================== */
.neo-modal-body { position: relative; z-index: 1; padding: 0 32px 8px; }

:global(.form-grid) { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

:global(.neo-form .ant-form-item) { margin-bottom: 20px !important; transition: margin-bottom 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) !important; }
:global(.neo-form .ant-form-item.ant-form-item-with-help) { margin-bottom: 32px !important; }

:global(.neo-form .ant-form-item-label) { padding-bottom: 6px !important; }
:global(.neo-form .ant-form-item-label > label) { font-weight: 600; color: var(--text-main, #1d1d1f) !important; font-size: 13px; letter-spacing: 0.3px; display: flex; align-items: center; }

/* 纯 CSS 魔法：直接劫持原生必填状态，彻底干掉冗余组件 */
:global(.neo-form.hide-native-asterisk .ant-form-item-required::before) { display: none !important; }

/* 自动为所有必填的 a-form-item 注入 Apple 风格的 Tag */
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

:global(.neo-form .ant-input),
:global(.neo-form .ant-input-number-input),
:global(.neo-form .ant-select-selector) {
  border-radius: 10px !important; background: var(--content-bg, #ffffff) !important; border: 1px solid var(--border-color, #d1d1d6) !important;
  padding: 0 12px !important; height: 42px !important; font-size: 14px !important; color: var(--text-main, #1d1d1f) !important;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02) !important; transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
}
:global(.neo-form .ant-select-selector) { padding: 0 12px !important; display: flex; align-items: center; }
:global(.neo-form .ant-select-selection-item) { line-height: 40px !important; }
:global(.neo-form .ant-input-number) { width: 100% !important; border: none !important; box-shadow: none !important; }
:global(.neo-form .ant-input-number-handler-wrap) { display: none !important; }
:global(.neo-form textarea.ant-input) { height: auto !important; padding: 12px !important; min-height: 80px !important; line-height: 1.5 !important; }

:global(.neo-form .ant-input:focus),
:global(.neo-form .ant-input-focused),
:global(.neo-form .ant-input-number:focus-within),
:global(.neo-form .ant-select-focused .ant-select-selector) {
  background: var(--content-bg, #ffffff) !important; border-color: #0A84FF !important; box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.15) !important;
}

:global(.neo-form .ant-input[disabled]),
:global(.neo-form .ant-input-number-input[disabled]),
:global(.neo-form .ant-select-disabled .ant-select-selector),
:global(.neo-form textarea.ant-input[disabled]) {
  background-color: var(--hover-bg, rgba(240, 240, 245, 0.6)) !important; color: var(--text-muted, #8e8e93) !important; border-color: transparent !important;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.04) !important; cursor: not-allowed !important;
}

:global(.dark .neo-form .ant-input[disabled]),
:global(.dark .neo-form .ant-input-number-input[disabled]),
:global(.dark .neo-form .ant-select-disabled .ant-select-selector),
:global(.dark .neo-form textarea.ant-input[disabled]) {
  background-color: rgba(0, 0, 0, 0.2) !important; color: rgba(255, 255, 255, 0.3) !important;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4) !important; border-color: transparent !important;
}

:global(.neo-form .ant-form-item-has-error .ant-input),
:global(.neo-form .ant-form-item-has-error .ant-input-number-input),
:global(.neo-form .ant-form-item-has-error .ant-select-selector) {
  background: rgba(255, 69, 58, 0.04) !important; border-color: rgba(255, 69, 58, 0.4) !important; box-shadow: 0 0 0 4px rgba(255, 69, 58, 0.1) !important;
}

:global(.neo-form .ant-form-item-explain-error) {
  color: #FF453A !important; font-size: 12px !important; font-weight: 600 !important; margin-top: 8px !important; padding: 6px 12px 6px 8px !important;
  background: rgba(255, 69, 58, 0.08) !important; border-radius: 8px !important; display: inline-flex !important; align-items: center; line-height: 1.2 !important;
  animation: errorBubbleIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

:global(.neo-form .ant-form-item-explain-error::before) {
  content: '!'; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px;
  background: #FF453A; color: #ffffff; border-radius: 50%; font-size: 11px; font-weight: 800; margin-right: 6px;
}

@keyframes errorBubbleIn { from { opacity: 0; transform: translateY(-6px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }

/* ================== 底部操作栏重塑 ================== */
.neo-modal-footer {
  position: relative; z-index: 1; display: flex; justify-content: flex-end; gap: 12px; padding: 20px 32px 24px;
  border-top: 1px solid var(--border-color, rgba(0,0,0,0.06)); background: var(--hover-bg, rgba(249,249,250, 0.5));
}
.neo-btn-flat, .neo-btn-solid {
  min-width: 90px; height: 38px; padding: 0 20px; border-radius: 10px; font-size: 14px; font-weight: 600; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.neo-btn-flat { background: transparent; color: var(--text-main, #333); border: 1px solid var(--border-color, #d1d1d6); box-shadow: 0 1px 2px rgba(0,0,0,0.02); }
.neo-btn-flat:hover { background: var(--hover-bg, rgba(0,0,0,0.04)); border-color: #c7c7cc; }
.neo-btn-solid.primary { background: var(--apple-blue, #0A84FF); color: #ffffff; box-shadow: 0 2px 8px rgba(10, 132, 255, 0.2); }
.neo-btn-solid.primary:hover { background: #0071e3; box-shadow: 0 4px 12px rgba(10, 132, 255, 0.3); }
.neo-btn-solid.success { background: #34C759; color: #ffffff; box-shadow: 0 2px 8px rgba(52, 199, 89, 0.2); }
.neo-btn-solid.success:hover { background: #28a745; box-shadow: 0 4px 12px rgba(52, 199, 89, 0.3); }
.neo-btn-solid.danger { background: #FF453A; color: #ffffff; box-shadow: 0 2px 8px rgba(255, 69, 58, 0.2); }
.neo-btn-solid.danger:hover { background: #FF3B30; box-shadow: 0 4px 12px rgba(255, 69, 58, 0.3); }
.neo-btn-solid.warning { background: #FF9F0A; color: #ffffff; box-shadow: 0 2px 8px rgba(255, 159, 10, 0.2); }
.neo-btn-solid.warning:hover { background: #E88B00; box-shadow: 0 4px 12px rgba(255, 159, 10, 0.3); }

/* dark mode styles moved to non-scoped <style> block below */
</style>

<style>
/* ================== 暗黑模式完整适配 (非scoped，确保teleported modal正确匹配) ================== */
html.dark .neo-modal-content-wrap {
  background: #1c1c1e !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08) !important;
}

html.dark .neo-modal-close {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.6);
}
html.dark .neo-modal-close:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

html.dark .neo-modal-content-wrap .custom-title {
  color: #ffffff !important;
}
html.dark .neo-modal-content-wrap .custom-subtitle {
  color: rgba(255, 255, 255, 0.55) !important;
}

html.dark .neo-modal-content-wrap .header-icon-box {
  background: rgba(255, 255, 255, 0.05) !important;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1),
              0 0 24px color-mix(in srgb, var(--apple-blue) 35%, transparent),
              0 0 48px color-mix(in srgb, var(--apple-blue) 18%, transparent) !important;
}

html.dark .neo-modal-footer {
  background: rgba(0, 0, 0, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}

html.dark .neo-btn-flat {
  border-color: rgba(255, 255, 255, 0.15) !important;
  color: #ffffff !important;
}
html.dark .neo-btn-flat:hover {
  background: rgba(255, 255, 255, 0.08) !important;
}

html.dark .neo-form .ant-input,
html.dark .neo-form .ant-input-number-input,
html.dark .neo-form .ant-select-selector {
  background: rgba(255, 255, 255, 0.04) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
}

html.dark .neo-form .ant-form-item-label > label {
  color: #ffffff !important;
}

html.dark .neo-form .ant-input::placeholder,
html.dark .neo-form .ant-select-selection-placeholder {
  color: rgba(255, 255, 255, 0.35) !important;
}

html.dark .neo-form .ant-input:focus,
html.dark .neo-form .ant-input-focused,
html.dark .neo-form .ant-input-number:focus-within,
html.dark .neo-form .ant-select-focused .ant-select-selector {
  background: rgba(255, 255, 255, 0.06) !important;
  border-color: #0A84FF !important;
  box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.25) !important;
}

html.dark .neo-form .ant-input[disabled],
html.dark .neo-form .ant-input-number-input[disabled],
html.dark .neo-form .ant-select-disabled .ant-select-selector,
html.dark .neo-form textarea.ant-input[disabled] {
  background-color: rgba(0, 0, 0, 0.2) !important;
  color: rgba(255, 255, 255, 0.3) !important;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4) !important;
  border-color: transparent !important;
}

html.dark .neo-form .ant-select-arrow {
  color: rgba(255, 255, 255, 0.45) !important;
}
</style>