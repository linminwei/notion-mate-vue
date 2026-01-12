<template>
  <div class="login-container">
    <div class="theme-switch">
      <a-button type="text" @click="appStore.toggleTheme">
        <template #icon>
          <bulb-outlined v-if="appStore.isDark" />
          <bulb-filled v-else />
        </template>
      </a-button>
    </div>
    <div class="login-box">
      <div class="login-title"> 权限管理系统 </div>
      <a-form :model="formState" :rules="rules" @finish="handleLogin">
        <a-form-item name="username">
          <a-input v-model:value="formState.username" size="large" placeholder=" 用户名 ">
            <template #prefix><user-outlined /></template>
          </a-input>
        </a-form-item>
        <a-form-item name="password">
          <a-input-password v-model:value="formState.password" size="large" placeholder=" 密码 ">
            <template #prefix><lock-outlined /></template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" size="large" block :loading="loading">
            登 录
          </a-button>
        </a-form-item>
      </a-form>
      <div class="login-tip"> 默认账号 : admin / admin123</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { UserOutlined, LockOutlined, BulbOutlined, BulbFilled } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const appStore = useAppStore()
const loading = ref(false)

const formState = reactive({
  username: 'admin',
  password: 'admin123'
})

const rules: Record<string, Rule[]> = {
  username: [{ required: true, message: ' 请输入用户名 ', trigger: 'blur' }],
  password: [{ required: true, message: ' 请输入密码 ', trigger: 'blur' }]
}

const handleLogin = async () => {
  loading.value = true
  try {
    await userStore.login(formState)
    message.success(' 登录成功 ')
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } catch (error: any) {
    message.error(error.message || ' 登录失败 ')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}
.theme-switch {
  position: absolute;
  top: 24px;
  right: 24px;
}
.theme-switch :deep(.ant-btn) {
  color: #fff;
  font-size: 20px;
}
.login-box {
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 1);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}
:global(.dark) .login-box {
  background: #1f1f1f;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}
.login-title {
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 40px;
  color: #333;
}
:global(.dark) .login-title {
  color: #e5eaf3;
}
.login-tip {
  text-align: center;
  color: #999;
  font-size: 12px;
  margin-top: 16px;
}
:global(.dark) .login-tip {
  color: #777;
}
</style>
