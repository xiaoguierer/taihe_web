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
          <h1 class="brand-title">Soul‑Kindled Adornments</h1>
          <p class="brand-subtitle">Welcome home to the sanctuary of your own radiant energy</p>
          <div class="brand-features">
            <div class="feature-item">
              <span class="feature-icon">💎</span>
              <span>Curated Jewels for Your Unique Essence</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">✨</span>
              <span>A Personal Insight into the Currents of Your Inner Power</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🔮</span>
              <span>Penetrating Insight into the Resonance of Your Being</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单区 -->
      <div class="form-section">
        <div class="form-container">
          <h2 class="form-title">Welcome back</h2>
          <p class="form-subtitle">enter your sanctuary and continue your journey among the jewels of energy</p>

          <form @submit.prevent="handleLogin" class="login-form">
            <!-- 邮箱输入 -->
            <div class="form-group">
              <label for="email" class="form-label">Beacon of Connection</label>
              <input
                ref="emailInput"
                id="email"
                v-model="formData.email"
                type="email"
                class="form-input"
                :class="{ 'error': emailError }"
                placeholder="Beacon of Connection"
                @input="validateEmail"
                @blur="validateEmail"
              >
              <div v-if="emailError" class="error-message">{{ emailError }}</div>
            </div>

            <!-- 密码输入 -->
            <div class="form-group">
              <label for="password" class="form-label">Key of Passage</label>
              <div class="password-input-container">
                <input
                  id="password"
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="Key of Passage"
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
                <label for="remember-me" class="checkbox-label">Hold My Presence</label>
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
              {{ isLoading ? 'Logging in...' : ' Log in' }}
            </button>

            <!-- 分隔线 -->
            <div class="divider">
<!--              <span>或使用其他方式登录</span>-->
            </div>

            <!-- Google登录按钮 -->
<!--            <div class="social-login">
              <div id="google-button-container" class="google-button-container"></div>
            </div>-->

            <!-- 注册链接 -->
            <p class="register-link">
              Don’t have an account？<a href="#" @click="switchToRegister">Register Now – Claim Your Sanctuary</a>
            </p>
          </form>
        </div>
      </div>
    </div>
    <!-- 成功通知 -->
    <div v-if="showSuccessNotification" class="success-notification">
      <div class="notification-content">
        <span class="notification-icon">✅</span>
        <span>Welcome back to the sanctuary of your radiant essence，{{ userDisplayName }}！</span>
        <button class="notification-close" @click="showSuccessNotification = false">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth';
import { ElMessage } from "element-plus";
import { loadGoogleIdentityServices, renderGoogleButton, parseGoogleCredential, sendGoogleAuthToBackend } from '@/utils/googleAuth';

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

  // 初始化Google登录
  initGoogleLogin()
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

// 初始化Google登录
const initGoogleLogin = async () => {
  try {
    // 加载Google Identity Services脚本
    await loadGoogleIdentityServices();

    // 渲染Google登录按钮
    renderGoogleButton('google-button-container', handleGoogleCredentialResponse);

    console.log('Google登录按钮初始化成功');
  } catch (error) {
    console.error('初始化Google登录失败:', error);
    ElMessage.warning('Google登录功能暂时不可用');
  }
};

// 处理Google登录响应
const handleGoogleCredentialResponse = async (response) => {
  try {
    console.log('Google登录响应:', response);

    if (!response.credential) {
      throw new Error('Google登录失败: 未收到有效凭据');
    }

    // 解析Google凭据
    const googleUser = parseGoogleCredential(response.credential);
    console.log('Google用户信息:', googleUser);

    // 显示加载状态
    isLoading.value = true;

    try {
      // 尝试发送到后端验证
      const authResult = await sendGoogleAuthToBackend(response.credential);

      // 使用现有的认证系统
      const authStore = useAuthStore();
      authStore.loginSuccess(authResult.token, authResult.user);

      // 🎯 增强：输出Google登录成功的详细信息（后端验证模式）
      console.group('✅ Google登录成功 - 后端验证模式')
      console.log('📅 登录时间:', new Date().toLocaleString())
      console.log('👤 Google用户信息:', {
        Google用户ID: googleUser.id,
        邮箱: googleUser.email,
        姓名: googleUser.name,
        头像: googleUser.picture ? '已设置' : '未设置',
        邮箱已验证: googleUser.emailVerified,
        区域设置: googleUser.locale
      })
      console.log('🔑 系统令牌信息:', {
        令牌类型: '后端验证JWT',
        令牌长度: authResult.token?.length || 0,
        用户数据: authResult.user
      })
      console.log('💾 存储状态:', {
        auth_token已存储: !!localStorage.getItem('auth_token'),
        user_info已存储: !!localStorage.getItem('user_info')
      })
      console.groupEnd()

      ElMessage.success('Google登录成功！');

      // 跳转到首页
      setTimeout(() => {
        router.push('/');
      }, 1000);

    } catch (backendError) {
      console.warn('后端验证失败，使用前端验证:', backendError);

      // 如果后端端点不存在，使用前端验证并创建临时用户
      const authStore = useAuthStore();
      const temporaryToken = `google_${Date.now()}_${Math.random().toString(36).substr(2)}`;
      const temporaryUser = {
        userId: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        loginType: 'google',
        isTemporary: true
      };

      authStore.loginSuccess(temporaryToken, temporaryUser);

      // 🎯 增强：输出Google登录成功的详细信息（前端临时模式）
      console.group('✅ Google登录成功 - 前端临时会话模式')
      console.log('📅 登录时间:', new Date().toLocaleString())
      console.log('⚠️  注意: 使用前端临时会话，建议绑定账户')
      console.log('👤 Google用户信息:', {
        Google用户ID: googleUser.id,
        邮箱: googleUser.email,
        姓名: googleUser.name,
        头像: googleUser.picture ? '已设置' : '未设置',
        邮箱已验证: googleUser.emailVerified,
        区域设置: googleUser.locale
      })
      console.log('🔑 系统令牌信息:', {
        令牌类型: '前端临时令牌',
        令牌长度: temporaryToken.length,
        令牌示例: temporaryToken.substring(0, 30) + '...',
        用户数据: temporaryUser
      })
      console.log('💾 存储状态:', {
        auth_token已存储: !!localStorage.getItem('auth_token'),
        user_info已存储: !!localStorage.getItem('user_info'),
        临时会话标识: true
      })

      console.log('💡 建议: 访问用户中心绑定账户以获得完整功能')
      console.groupEnd()

      ElMessage.success('Google登录成功（临时会话）');

      // 跳转到首页
      setTimeout(() => {
        router.push('/');
      }, 1000);
    }

  } catch (error) {
    console.error('Google登录处理失败:', error);
    ElMessage.error(error.message || 'Google登录失败');
  } finally {
    isLoading.value = false;
  }
};

// 登录处理函数
const handleLogin = async () => {
  if (!isFormValid.value) return
  isLoading.value = true
  try {
    // 调用后端登录接口
    //console.info("formData.email is :",formData.email)
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email: formData.email,
        password: formData.password
      }).toString()
    })
    //console.info("用户登录API返回数据 response：", response)
    if (!response.ok) {
      ElMessage.error("登录失败")
    }
    const result = await response.json()
// 重点：输出 message 和 data 字段
//     console.info("=== 用户登录API返回数据详情 ===")
//     console.info("JWT Token (message):", result.message)
//     console.info("用户数据 (data):", result.data)
//     console.info("完整返回结果:", result)

    // 单独输出 data 中的各个字段
    // console.info("=== 用户详细信息 ===")
    // console.info("用户ID:", result.data.id)
    // console.info("邮箱:", result.data.email)
    // console.info("昵称:", result.data.nickname)
    // console.info("头像:", result.data.avatar)
    // console.info("状态:", result.data.status)
    // console.info("时间:", result.data.createdAt)
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

      // console.info("=== 准备保存认证信息 ===");
      // console.info("Token长度:", token.length);
      // console.info("用户信息:", userInfo);
// ✅ 直接使用authStore，移除错误的条件判断
      const authStore = useAuthStore()
      authStore.loginSuccess(token, userInfo)

      // 🎯 增强：输出登录成功的详细信息
      console.group('✅ 普通登录成功 - 用户账号信息')
      console.log('📅 登录时间:', new Date().toLocaleString())
      console.log('📧 登录邮箱:', formData.email)
      console.log('🔑 JWT令牌长度:', token.length)
      console.log('👤 用户详细信息:', {
        用户ID: result.data.id,
        邮箱: result.data.email,
        昵称: result.data.nickname,
        头像: result.data.avatar ? '已设置' : '未设置',
        账户状态: result.data.status,
        注册时间: result.data.createdAt
      })
      console.log('💾 存储状态:', {
        auth_token已存储: !!localStorage.getItem('auth_token'),
        user_info已存储: !!localStorage.getItem('user_info'),
        记住我: formData.rememberMe
      })
      console.groupEnd()

      ElMessage.success('登录成功！即将自动跳转...')
      // ✅ 统一跳转逻辑
      setTimeout(() => {
        router.push('/')
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
@import url('@/styles/user/google-auth.css');
</style>
