import { h, render, createVNode, Transition, defineComponent, ref, onMounted } from 'vue'

/* =================================================================
   1. 样式注入 (CSS-in-JS)
   为了保持单文件，我们将 CSS 作为字符串动态插入到 head 中
   ================================================================= */
const styleId = 'apple-alert-style'
const cssContent = `
.apple-alert-wrapper {
  position: fixed; top: 32px; left: 50%; transform: translateX(-50%);
  z-index: 9999; display: flex; justify-content: center; pointer-events: none;
}
.apple-alert-content {
  pointer-events: auto; position: relative; display: flex; align-items: center;
  padding: 14px 18px; gap: 14px;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-radius: 48px;
  box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.08), 0 4px 8px -2px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.02);
}
.apple-alert-glow {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 60%; height: 60%; filter: blur(50px); opacity: 0.15; z-index: -1; border-radius: 50%;
  transition: background 0.3s ease;
}
.apple-alert-icon { width: 32px; height: 32px; display:flex; align-items:center; justify-content:center; }
.apple-alert-text { flex: 1; display: flex; flex-direction: column; justify-content: center; margin-right: 8px; min-width: 180px; }
.apple-alert-title { font-family: -apple-system, sans-serif; font-size: 15px; font-weight: 600; color: #1d1d1f; margin: 0; line-height: 1.2; }
.apple-alert-desc { font-family: -apple-system, sans-serif; font-size: 13px; font-weight: 400; color: #86868b; margin: 3px 0 0 0; line-height: 1.2; }
.apple-alert-close { 
  background: rgba(0,0,0,0.04); border: none; color: #86868b; cursor: pointer; 
  width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; 
  border-radius: 50%; transition: all 0.2s; 
}
.apple-alert-close:hover { background: rgba(0,0,0,0.1); color: #1d1d1f; transform: scale(1.05); }

/* 类型配色 */
.type-error .apple-alert-glow { background: #FF3B30; }
.type-error .icon-color { color: #FF3B30; }
.type-success .apple-alert-glow { background: #34C759; }
.type-success .icon-color { color: #34C759; }
.type-warning .apple-alert-glow { background: #FF9500; }
.type-warning .icon-color { color: #FF9500; }

/* 动画 */
.apple-spring-enter-active { animation: spring-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.15); }
.apple-spring-leave-active { animation: slide-out 0.4s cubic-bezier(0.32, 0, 0.67, 0); }
@keyframes spring-in { 0% { transform: translate(-50%, -60px) scale(0.9); opacity: 0; } 100% { transform: translate(-50%, 0) scale(1); opacity: 1; } }
@keyframes slide-out { 0% { transform: translate(-50%, 0) scale(1); opacity: 1; } 100% { transform: translate(-50%, -30px) scale(0.9); opacity: 0; } }

/* Dark Mode 适配 */
.dark-mode .apple-alert-content { background: rgba(28, 28, 30, 0.75); border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 12px 40px -10px rgba(0, 0, 0, 0.8), inset 0 0 0 1px rgba(255, 255, 255, 0.08); }
.dark-mode .apple-alert-title { color: #f5f5f7; }
.dark-mode .apple-alert-desc { color: rgba(255,255,255,0.6); }
.dark-mode .apple-alert-close { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.5); }
.dark-mode .apple-alert-close:hover { background: rgba(255,255,255,0.2); color: #fff; }
`

// 初始化样式
if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = cssContent
    document.head.appendChild(style)
}

/* =================================================================
   2. 组件定义 (使用 h 函数渲染，无需 template)
   ================================================================= */
const AppleAlertComponent = defineComponent({
    props: {
        title: String,
        message: String,
        type: { type: String, default: 'error' },
        duration: { type: Number, default: 3000 },
        destroy: Function
    },
    setup(props) {
        const visible = ref(false)
        let timer: any = null

        const close = () => { visible.value = false }

        // 动画结束后回调
        const onAfterLeave = () => {
            if (props.destroy) props.destroy()
        }

        onMounted(() => {
            visible.value = true
            if (props.duration > 0) {
                timer = setTimeout(close, props.duration)
            }
        })

        // 图标生成器
        const renderIcon = () => {
            const colorClass = 'icon-color'
            // Success Icon
            if (props.type === 'success') {
                return h('svg', { viewBox: '0 0 24 24', fill: 'none', width: 32, height: 32 }, [
                    h('circle', { cx: 12, cy: 12, r: 10, fill: 'currentColor', class: colorClass }),
                    h('path', { d: 'M8 12L11 15L16 9', stroke: 'white', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
                ])
            }
            // Error Icon
            if (props.type === 'error') {
                return h('svg', { viewBox: '0 0 24 24', fill: 'none', width: 32, height: 32 }, [
                    h('circle', { cx: 12, cy: 12, r: 10, fill: 'currentColor', class: colorClass }),
                    h('path', { d: 'M15 9L9 15', stroke: 'white', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
                    h('path', { d: 'M9 9L15 15', stroke: 'white', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
                ])
            }
            // Warning Icon
            return h('svg', { viewBox: '0 0 24 24', fill: 'none', width: 32, height: 32 }, [
                h('circle', { cx: 12, cy: 12, r: 10, fill: 'currentColor', class: colorClass }),
                h('path', { d: 'M12 8V12', stroke: 'white', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
                h('circle', { cx: 12, cy: 16, r: 1, fill: 'white' })
            ])
        }

        return () => {
            return h(Transition, { name: 'apple-spring', onAfterLeave: onAfterLeave }, {
                default: () => visible.value ? h('div', { class: ['apple-alert-wrapper', `type-${props.type}`] }, [
                    // 光晕
                    h('div', { class: 'apple-alert-glow' }),
                    // 内容卡片
                    h('div', { class: 'apple-alert-content' }, [
                        h('div', { class: 'apple-alert-icon' }, [renderIcon()]),
                        h('div', { class: 'apple-alert-text' }, [
                            h('h4', { class: 'apple-alert-title' }, props.title),
                            h('p', { class: 'apple-alert-desc' }, props.message)
                        ]),
                        // 关闭按钮
                        h('button', { class: 'apple-alert-close', onClick: close }, [
                            h('svg', { width: 12, height: 12, viewBox: '0 0 12 12', fill: 'none' }, [
                                h('path', { d: 'M9 3L3 9M3 3L9 9', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round' })
                            ])
                        ])
                    ])
                ]) : null
            })
        }
    }
})

/* =================================================================
   3. 挂载逻辑 (Singleton Logic)
   ================================================================= */
let currentContainer: HTMLElement | null = null

function mountAlert(type: 'success' | 'error' | 'warning', title: string, message: string = '') {
    // 1. 如果有旧的，先销毁
    if (currentContainer) {
        render(null, currentContainer) // 卸载旧组件
        if (document.body.contains(currentContainer)) document.body.removeChild(currentContainer)
        currentContainer = null
    }

    // 2. 创建新容器
    const container = document.createElement('div')

    // 3. 销毁回调
    const destroy = () => {
        render(null, container)
        if (document.body.contains(container)) document.body.removeChild(container)
        if (currentContainer === container) currentContainer = null
    }

    // 4. 创建 VNode
    const vnode = createVNode(AppleAlertComponent, {
        type,
        title,
        message,
        destroy
    })

    // 5. 挂载
    render(vnode, container)
    document.body.appendChild(container)
    currentContainer = container
}

/* =================================================================
   4. 导出纯函数 API
   ================================================================= */
export const AppleAlert = {
    success: (title: string, message?: string) => mountAlert('success', title, message || ''),
    error: (title: string, message?: string) => mountAlert('error', title, message || ''),
    warning: (title: string, message?: string) => mountAlert('warning', title, message || '')
}