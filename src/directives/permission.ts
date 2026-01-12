import type { Directive, DirectiveBinding } from 'vue'
import { useUserStore } from '@/stores/user'

// v-permission 权限指令
export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
    const { value } = binding
    const userStore = useUserStore()
    
    if (value && !userStore.hasPermission(value)) {
      el.parentNode?.removeChild(el)
    }
  }
}

// v-role 角色指令
export const role: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const { value } = binding
    const userStore = useUserStore()
    
    if (value) {
      const roles = userStore.userInfo?.roles || []
      const requiredRoles = Array.isArray(value) ? value : [value]
      const hasRole = requiredRoles.some(role => roles.includes(role))
      
      if (!hasRole) {
        el.parentNode?.removeChild(el)
      }
    }
  }
}

export default {
  permission,
  role
}
