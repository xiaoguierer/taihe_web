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
          <h1 class="brand-title">灵性珠宝</h1>
          <p class="brand-subtitle">发现属于您的能量宝石</p>
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

      <!-- 右侧注册表单区 -->
      <div class="form-section">
        <div class="form-container">
          <h2 class="form-title">开启您的灵性之旅</h2>
          <p class="form-subtitle">注册会员，发现与您能量共鸣的珠宝</p>

          <form @submit.prevent="handleRegister" class="register-form">
            <!-- 邮箱输入 -->
            <div class="form-group">
              <label for="email" class="form-label">电子邮箱</label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                class="form-input"
                placeholder="请输入您的电子邮箱"
                required
              >
            </div>

            <!-- 密码输入 -->
            <div class="form-group">
              <label for="password" class="form-label">密码</label>
              <input
                id="password"
                v-model="formData.password"
                type="password"
                class="form-input"
                placeholder="请设置登录密码（至少8位字符）"
                required
                minlength="8"
              >
            </div>

            <!-- 出生日期输入 -->
            <div class="form-group">
              <label for="birthdaytime" class="form-label">
                出生时间
                <span class="optional-label">（选填）</span>
              </label>
              <el-date-picker
                v-model="formData.birthdaytime"
                type="datetime"
                placeholder="Select date and time"
                value-format="YYYY-MM-DD HH:mm:ss"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
              <p class="field-description">您的出生日期仅用于为您提供个性化的星座运势和产品推荐</p>
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
                  我已阅读并同意
                  <a href="#" class="privacy-link" @click.prevent="showPrivacyModal = true">《隐私政策》</a>
                </label>
              </div>
            </div>

            <!-- 激励提示 -->
            <div class="incentive-card" v-if="!formData.birthdaytime">
              <div class="incentive-icon">🎁</div>
              <div class="incentive-content">
                <h3>完善您的灵性档案</h3>
                <p>填写出生日期，即可获得<strong>200积分</strong>，并解锁高级运势报告</p>
              </div>
            </div>

            <!-- 提交按钮 -->
            <button
              type="submit"
              class="submit-button"
              :class="{ 'with-incentive': !formData.birthdate }"
              :disabled="!privacyAgreed"
            >
              注册会员
            </button>

            <!-- 登录链接 -->
            <p class="login-link">
              已有账户？<a href="#" @click="switchtologin">立即登录</a>
            </p>
          </form>
        </div>
      </div>
    </div>

    <!-- 隐私政策模态框 -->
    <div v-if="showPrivacyModal" class="modal-overlay" @click="showPrivacyModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>隐私政策</h3>
          <button class="modal-close" @click="showPrivacyModal = false">×</button>
        </div>
        <div class="modal-body">
          <h4>数据使用说明</h4>
          <p>我们非常重视您的隐私权，并致力于保护您的个人信息。以下是我们的数据使用政策：</p>

          <ul>
            <li><strong>邮箱地址：</strong>用于账户验证、登录和重要通知</li>
            <li><strong>密码：</strong>经过加密处理，我们无法查看您的原始密码</li>
            <li><strong>出生日期：</strong>仅用于为您提供个性化的星座运势和产品推荐，您可以选择不提供此信息</li>
          </ul>

          <h4>数据安全承诺</h4>
          <p>我们采用先进的加密技术保护您的数据，绝不会将您的个人信息出售给第三方。</p>

          <div class="modal-actions">
            <button class="btn-primary" @click="showPrivacyModal = false">我已了解</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import {ElMessage,} from "element-plus";
const router = useRouter()
// 定义事件
const switchtologin = () =>{
  router.push('/UserLogin')
}

// 响应式数据
const formData = reactive({
  email: '',
  password: '',
  birthdaytime: null
})

const privacyAgreed = ref(false)
const showPrivacyModal = ref(false)

// 注册处理函数
const handleRegister = async () => {
  if (!privacyAgreed.value) {
    alert('请先阅读并同意隐私政策')
    return
  }
  console.log('原始日期:', formData.birthdaytime)
  try {
    const formDataToSend = new FormData()

    const requestData = {
      email: formData.email,
      password: formData.password,
      birthdaytime: formData.birthdaytime
    }
    console.log('发送的请求数据:', JSON.stringify(requestData, null, 2))
    const requestBlob = new Blob([JSON.stringify(requestData)], {
      type: 'application/json'
    })
    formDataToSend.append('request', requestBlob)
    formDataToSend.append('avatarFile', new Blob([]), 'empty.txt')
    console.log('FormData 内容:',formDataToSend)
    const response = await fetch('/api/users/register', {
      method: 'POST',
      body: formDataToSend
    })
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('注册接口不存在，请检查后端服务')
      }
      try {
        const errorData = await response.json()
        throw new Error(errorData.message || '注册失败')
      } catch (e) {
        throw new Error(`HTTP错误: ${response.status}`)
      }
    }
    const result = await response.json()
    console.log('注册成功:', result)
    ElMessage.success('注册成功！' + (formData.birthdaytime ? '您已获得200积分奖励！' : ''))
  } catch (e) {
    console.log('注册失败')
  }
  console.error('注册失败')
  ElMessage.error(`注册失败: ${error.message}`)
}
</script>

<style scoped>
@import url('@/styles/user/userregister.css');
</style>
