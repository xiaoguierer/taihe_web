<template>
  <div class="register-page">
    <!-- 背景装饰元素 -->
    <div class="bg-decoration bg-star-1"></div>
    <div class="bg-decoration bg-star-2"></div>
    <div class="bg-decoration bg-star-3"></div>

    <div class="register-container">
      <!-- 左侧品牌展示区 -->
      <div class="brand-section">
        <div class="brand-content">
          <h1 class="brand-title">Jewels of the Soul</h1>
          <p class="brand-subtitle">Discover the Gem That Resonates with Your Soul</p>
          <div class="brand-features">
            <div class="feature-item">
              <span class="feature-icon">💎</span>
              <span>Curated Jewels for Your Unique Essence</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">✨</span>
              <span>An Energy Reading Tailored to Your Soul</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🔮</span>
              <span>Profound Illumination of the Soul’s Wisdom</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧注册表单区 -->
      <div class="form-section">
        <div class="form-container">
          <h2 class="form-title">Embark Upon the Journey of Your Soul</h2>
          <p class="form-subtitle">Unearth the Gems Aligned with Your Radiant Energy</p>

          <form @submit.prevent="handleRegister" class="register-form">
            <!-- 邮箱输入 -->
            <div class="form-group">
              <label for="email" class="form-label">Sanctuary of Messages</label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                class="form-input"
                placeholder="Sanctuary of Messages"
                required
              >
            </div>

            <!-- 密码输入 -->
            <div class="form-group">
              <label for="password" class="form-label">Key of Passage</label>
              <input
                id="password"
                v-model="formData.password"
                type="password"
                class="form-input"
                placeholder="Key of Passage"
                required
                minlength="8"
              >
            </div>

            <!-- 出生日期输入 -->
            <div class="form-group">
              <label for="birthdaytime" class="form-label">
                Soul’s Genesis Moment
                <span class="optional-label">（Optional → If You Feel Called）</span>
              </label>
              <el-date-picker
                v-model="formData.birthdaytime"
                type="datetime"
                placeholder="Select date and time"
                value-format="YYYY-MM-DD HH:mm:ss"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
              <p class="field-description">Birth date → Soul’s Genesis Day / Celestial Arrival</p>
            </div>

            <!-- 隐私政策同意 -->
            <div class="privacy-section">
              <div class="checkbox-group">
                <input
                  id="privacy-agree"
                  v-model="privacyAgreed"
                  type="checkbox"
                  class="checkbox-input"
                  required
                >
                <label for="privacy-agree" class="checkbox-label">
                  I Have Received and Embraced the Covenant
                  <a href="#" class="privacy-link" @click.prevent="showPrivacyModal = true">《Sanctuary’s Covenant of Protection》</a>
                </label>
              </div>
            </div>

            <!-- 激励提示 -->
            <div class="incentive-card" v-if="!formData.birthdaytime">
              <div class="incentive-icon"></div>
              <div class="incentive-content">
                <h3>Deepen Your Soul’s Ledger</h3>
                <p>Share Your Celestial Genesis Moment to Unlock Advanced Starborne Guidance</p>
              </div>
            </div>

            <!-- 提交按钮 -->
            <button
              type="submit"
              class="submit-button"
              :class="{ 'with-incentive': !formData.birthdate }"
              :disabled="!privacyAgreed"
            >
              Join the Sanctuary as a Keeper of Radiant Gems
            </button>

            <!-- 登录链接 -->
            <p class="login-link">
              Your Sanctuary Remembers You？<a href="#" @click="switchtologin">Enter Your Sanctuary Now</a>
            </p>
          </form>
        </div>
      </div>
    </div>

    <!-- 隐私政策模态框 -->
    <div v-if="showPrivacyModal" class="modal-overlay" @click="showPrivacyModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Sanctuary’s Covenant of Protection</h3>
          <button class="modal-close" @click="showPrivacyModal = false">×</button>
        </div>
        <div class="modal-body">
          <h4>How We Attune Your Radiant Imprint</h4>
          <p>We hold your privacy as sacred as your soul’s essence.
            Our sanctuary is pledged to protect your personal imprint, so you may explore in trust and light.
            Below is how we attune your data to serve your journey:</p>

          <ul>
            <li><strong>Sanctuary of Messages (Email)：</strong>Used for verifying your presence, entry to your realm, and bearing radiant notices</li>
            <li><strong>Spirit Seal (Password)：</strong>Encrypted with care; the sanctuary cannot see your original seal</li>
            <li><strong>Celestial Genesis Moment (Birth Date)：</strong>Only to illuminate your starborne path and curate jewels that resonate with your essence. You may choose to keep this truth veiled.</li>
          </ul>

          <h4>Our Sacred Vow of Safekeeping</h4>
          <p>We guard your imprint with advanced light‑bound encryption, and will never sell your essence’s record to any outer realm</p>

          <div class="modal-actions">
            <button class="btn-primary" @click="showPrivacyModal = false">I Acknowledge and Honor the Path We Begin Together</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive,onMounted  } from 'vue'
import { useRouter,useRoute  } from 'vue-router'
import {ElMessage,} from "element-plus";
import { useAuthStore } from '@/store/auth';

const router = useRouter()
const route = useRoute() // 添加这行
// 检查URL参数
onMounted(() => {
  if (route.query.inviteeId) {
    inviteeId.value = route.query.inviteeId
  }
})
// 定义事件
const switchtologin = () =>{
  router.push('/users/login')
}

// 响应式数据
const formData = reactive({
  email: '',
  password: '',
  birthdaytime: null
})

const privacyAgreed = ref(false)
const showPrivacyModal = ref(false)
const inviteeId = ref(null)
// 注册处理函数
const handleRegister = async () => {
  if (!privacyAgreed.value) {
    alert('请先阅读并同意隐私政策')
    return
  }
  try {
    const formDataToSend = new FormData()
    const requestData = {
      email: formData.email,
      password: formData.password,
      birthdaytime: formData.birthdaytime,
      ...(inviteeId.value && { inviteeId: inviteeId.value })
    }
    const requestBlob = new Blob([JSON.stringify(requestData)], {
      type: 'application/json'
    })
    formDataToSend.append('request', requestBlob)
    // 如果有头像文件，这样添加，否则可以省略
    if (formData.avatarFile) {
      formDataToSend.append('avatarFile', formData.avatarFile)
    } else {
      // 如果不传头像文件，后端可能要求必须有这个字段
      formDataToSend.append('avatarFile', new Blob([]), 'empty.txt')
    }
    const response = await fetch('/api/users/register', {
      method: 'POST',
      body: formDataToSend
    })
   // console.info("用户注册API返回数据 response：", response)
    if (!response.ok) {
      ElMessage.error("注册失败")
    }
    const result = await response.json()
    // 重点：输出 message 和 data 字段
    // console.info("=== 用户注册API返回数据详情 ===")
    // console.info("JWT Token (message):", result.message)
    // console.info("用户数据 (data):", result.data)
    // console.info("完整返回结果:", result)
    // // 单独输出 data 中的各个字段
    // console.info("=== 用户详细信息 ===")
    // console.info("用户ID:", result.data.id)
    // console.info("邮箱:", result.data.email)
    // console.info("昵称:", result.data.nickname)
    // console.info("头像:", result.data.avatar)
    // console.info("状态:", result.data.status)
    // console.info("时间:", result.data.createdAt)
    // console.log('注册成功:', result)

    ElMessage.success('注册成功！')
    console.log('注册成功:', result)

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

      ElMessage.success('注册成功！即将自动登录...')
      // ✅ 统一跳转逻辑
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } else {
      throw new Error('返回数据格式异常')
    }

  } catch (error) {
    console.info('注册失败:')
    ElMessage.error(`注册失败`)
  }
}
</script>

<style scoped>
@import url('@/styles/user/userregister.css');
</style>
