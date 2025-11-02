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
              <a href="#" class="forgot-password" @click.prevent="switchToForgotPassword">
                忘记密码？
              </a>
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

            <!-- 社交登录 -->
            <div class="social-login">
              <div class="divider">
                <span>或使用以下方式登录</span>
              </div>
              <div class="social-buttons">
                <button type="button" class="social-button wechat" @click="socialLogin('wechat')">
                  <span class="social-icon">💬</span>
                  Gmail登录
                </button>
              </div>
            </div>

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
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 保存登录状态（实际项目中应使用安全的HttpOnly Token）
    if (formData.rememberMe) {
      localStorage.setItem('savedEmail', formData.email)
      localStorage.setItem('rememberMe', 'true')
    } else {
      localStorage.removeItem('savedEmail')
      localStorage.removeItem('rememberMe')
    }

    // 显示成功通知
    userDisplayName.value = formData.email.split('@')[0]
    showSuccessNotification.value = true

    // 模拟登录成功后的操作
    setTimeout(() => {
      // 在实际项目中，这里会进行页面跳转或状态更新
      console.log('登录成功:', formData)
      isLoading.value = false
    }, 1000)

  } catch (error) {
    console.error('登录失败:', error)
    isLoading.value = false
  }
}

// 社交登录
const socialLogin = (provider) => {
  console.log(`使用 ${provider} 登录`)
  // 实际项目中这里会进行OAuth跳转
  alert(`即将跳转到${provider}授权页面`)
}

// 切换到注册页面
const switchToRegister = () => {
  router.push('/UserRegister')
}

// 切换到忘记密码页面
const switchToForgotPassword = () => {
  emit('switch-to-forgot-password')
}
</script>

<style scoped>
@import url('@/styles/user/userlogin.css');
</style>
