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
import { useAuthStore } from '@/store/auth';

const router = useRouter()
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
      birthdaytime: formData.birthdaytime
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

    console.log('FormData表单参数 内容:')
    for (let [key, value] of formDataToSend.entries()) {
      console.log(key, value)
    }

    const response = await fetch('/api/users/register', {
      method: 'POST',
      body: formDataToSend
    })
    console.info("用户注册API返回数据 response：", response)
    if (!response.ok) {
      ElMessage.error("注册失败")
    }
    const result = await response.json()
    // 重点：输出 message 和 data 字段
    console.info("=== 用户注册API返回数据详情 ===")
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

    console.log('注册成功:', result)
    ElMessage.success('注册成功！')
    console.log('注册成功:', result)
    ElMessage.success('注册成功！')

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

      // 2. 保存到认证状态管理（假设你已经有authStore）
      if (typeof useAuthStore !== 'undefined') {
        const authStore = useAuthStore();
        authStore.loginSuccess(token, userInfo);
        console.log('✅ 认证信息已保存到状态管理');
      } else {
        // 如果还没有authStore，先保存到localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_info', JSON.stringify(userInfo));
        console.log('✅ 认证信息已保存到localStorage');
      }

      // 3. 注册成功后的逻辑，跳转首页
      console.log('🔄 即将跳转到首页...');
      setTimeout(() => {
        router.push('/');
      }, 1500); // 1.5秒后跳转，让用户看到成功提示

    } else {
      console.warn('⚠️ 返回数据格式异常，无法完成自动登录');
      ElMessage.warning('注册成功，但自动登录失败，请手动登录');
     router.push('/users/login');
    }
   // 🎯 【新增关键代码结束】
  } catch (error) {
    console.info('注册失败:')
    ElMessage.error(`注册失败`)
  }
}
</script>

<style scoped>
@import url('@/styles/user/userregister.css');
</style>
