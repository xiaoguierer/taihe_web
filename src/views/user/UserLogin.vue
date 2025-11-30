<template>
  <div class="login-page">
    <!-- 背景装饰元素 -->
    <div class="bg-decoration bg-star-1"></div>
    <div class="bg-decoration bg-star-2"></div>
    <div class="bg-decoration bg-star-3"></div>

    <div class="login-container">
      <!-- 左侧品牌展示区 -->
      <div class="brand-section">
        <div class="brand-content">
          <h1 class="brand-title">灵性珠宝</h1>
          <p class="brand-subtitle">欢迎回到您的能量空间</p>
          <div class="brand-features">
            <div class="feature-item">
              <span class="feature-icon">💎</span>
              <span>个性化宝石推荐</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">✨</span>
              <span>专属能量分析</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🔮</span>
              <span>深度灵性洞察</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单区 -->
      <div class="form-section">
        <div class="form-container">
          <h2 class="form-title">欢迎回来</h2>
          <p class="form-subtitle">登录您的账户，继续探索能量珠宝</p>

          <form @submit.prevent="handleLogin" class="login-form">
            <!-- 邮箱输入 -->
            <div class="form-group">
              <label for="email" class="form-label">电子邮箱地址</label>
              <input
                ref="emailInput"
                id="email"
                v-model="formData.email"
                type="email"
                class="form-input"
                :class="{ 'error': emailError }"
                placeholder="请输入您的电子邮箱"
                @input="validateEmail"
                @blur="validateEmail"
              >
              <div v-if="emailError" class="error-message">{{ emailError }}</div>
            </div>

            <!-- 密码输入 -->
            <div class="form-group">
              <label for="password" class="form-label">密码</label>
              <div class="password-input-container">
                <input
                  id="password"
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="请输入您的密码"
                  required
                >
                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>

            <!-- 选项区域 -->
            <div class="options-row">
              <div class="checkbox-group">
                <input
                  id="remember-me"
                  v-model="formData.rememberMe"
                  type="checkbox"
                  class="checkbox-input"
                >
                <label for="remember-me" class="checkbox-label">记住我</label>
              </div>
<!--              <a href="#" class="forgot-password" @click.prevent="switchToForgotPassword">-->
<!--                忘记密码？-->
<!--              </a>-->
            </div>

            <!-- 登录按钮 -->
            <button
              type="submit"
              class="submit-button"
              :disabled="!isFormValid || isLoading"
            >
              <span v-if="isLoading" class="loading-spinner"></span>
              {{ isLoading ? '登录中...' : '登录' }}
            </button>

            <!-- 注册链接 -->
            <p class="register-link">
              还没有账户？<a href="#" @click="switchToRegister">立即注册</a>
            </p>
          </form>
        </div>
      </div>
    </div>

    <!-- 成功通知 -->
    <div v-if="showSuccessNotification" class="success-notification">
      <div class="notification-content">
        <span class="notification-icon">✅</span>
        <span>欢迎回来，{{ userDisplayName }}！</span>
        <button class="notification-close" @click="showSuccessNotification = false">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth';
import {ElMessage} from "element-plus";

const router = useRouter()
// 定义事件
const emit = defineEmits(['switch-to-register', 'switch-to-forgot-password'])
// 响应式数据
const formData = reactive({
  email: '',
  password: '',
  rememberMe: false
})
const emailInput = ref(null)
const showPassword = ref(false)
const isLoading = ref(false)
const emailError = ref('')
const showSuccessNotification = ref(false)
const userDisplayName = ref('')
// 自动聚焦
onMounted(() => {
  nextTick(() => {
    if (emailInput.value) {
      emailInput.value.focus()
    }
  })

  // 检查是否有保存的登录状态
  checkSavedLogin()
})

// 表单验证
const isFormValid = computed(() => {
  return formData.email && formData.password && !emailError.value
})

// 邮箱验证
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.email) {
    emailError.value = '请输入邮箱地址'
  } else if (!emailRegex.test(formData.email)) {
    emailError.value = '请输入有效的邮箱地址'
  } else {
    emailError.value = ''
  }
}

// 检查保存的登录状态
const checkSavedLogin = () => {
  const savedEmail = localStorage.getItem('savedEmail')
  const rememberMe = localStorage.getItem('rememberMe') === 'true'

  if (rememberMe && savedEmail) {
    formData.email = savedEmail
    formData.rememberMe = true
  }
}

// 登录处理函数
const handleLogin = async () => {
  if (!isFormValid.value) return
  isLoading.value = true

  try {
    // 调用后端登录接口
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      })
    })

    console.info("用户登录API返回数据 response：", response)
    if (!response.ok) {
      ElMessage.error("登录失败")
    }
    const result = await response.json()
// 重点：输出 message 和 data 字段
    console.info("=== 用户登录API返回数据详情 ===")
    console.info("JWT Token (message):", result.message)
    console.info("用户数据 (data):", result.data)
    console.info("完整返回结果:", result)

    // 单独输出 data 中的各个字段
    console.info("=== 用户详细信息 ===")
    console.info("用户ID:", result.data.id)
    console.info("邮箱:", result.data.email)
    console.info("昵称:", result.data.nickname)
    console.info("头像:", result.data.avatar)
    console.info("状态:", result.data.status)
    console.info("时间:", result.data.createdAt)

    console.log('登录成功:', result)
    ElMessage.success('登录成功！')
    console.log('登录成功:', result)
    ElMessage.success('登录成功！')

    // 保存记住我设置
    if (formData.rememberMe) {
      localStorage.setItem('savedEmail', formData.email)
      localStorage.setItem('rememberMe', 'true')
    } else {
      localStorage.removeItem('savedEmail')
      localStorage.removeItem('rememberMe')
    }

    // 🎯 【新增关键代码开始】注册成功后的处理逻辑
    if (result.message && result.data) {
      // 1. 从返回数据中提取token和用户信息
      const token = result.message; // 你的token在message字段
      const userInfo = {
        userId: result.data.id,        // 注意字段映射
        email: result.data.email,
        nickname: result.data.nickname,
        avatar: result.data.avatar,
        status: result.data.status,
        createdAt: result.data.createdAt
      };

      console.info("=== 准备保存认证信息 ===");
      console.info("Token长度:", token.length);
      console.info("用户信息:", userInfo);
// ✅ 直接使用authStore，移除错误的条件判断
      const authStore = useAuthStore()
      authStore.loginSuccess(token, userInfo)

      ElMessage.success('登录成功！即将自动跳转...')

      // ✅ 统一跳转逻辑
      setTimeout(() => {
        router.push('/users/login')
      }, 1500)

    } else {
      throw new Error('返回数据格式异常')
    }
  } catch (error) {
    console.error('登录失败:', error)
    isLoading.value = false
    // 显示错误提示
    ElMessage.error(error.message || '登录失败，请检查邮箱和密码')
  }
}

// 切换到注册页面
const switchToRegister = () => {
  router.push('/users/register')
}

// 切换到忘记密码页面
const switchToForgotPassword = () => {
  emit('switch-to-forgot-password')
}
</script>

<style scoped>
@import url('@/styles/user/userlogin.css');
</style>
