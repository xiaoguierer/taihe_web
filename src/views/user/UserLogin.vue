<template>
  <div class="login-page">
    <!-- 使用头部组件 -->
    <Header/>
    <!-- 第二部分：登录表单 -->
    <section class="login-section">
      <div class="login-container">
        <h1 class="login-title">登录</h1>

        <p class="register-prompt">
          还没有账号？
          <a href="#" class="register-link" @click="goToRegister" >点击这里注册</a>
        </p>

        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label class="form-label" for="username">账号</label>
            <input
              type="text"
              id="username"
              class="form-input"
              placeholder="请输入手机号或邮箱"
              v-model="loginForm.username"
              required
            >
          </div>

          <div class="form-group">
            <label class="form-label" for="password">密码</label>
            <input
              type="password"
              id="password"
              class="form-input"
              placeholder="请输入密码"
              v-model="loginForm.password"
              required
            >
          </div>

          <button type="submit" class="login-button">登录</button>

          <a href="#" class="forgot-password" @click="goToForgotPassword">忘记密码？</a>

          <p class="policy-links">
            登录即表示您同意我们的
            <a href="#" class="policy-link" @click="goToPrivacyPolicy">隐私政策</a>
            和
            <a href="#" class="policy-link" @click="goToTerms">服务条款</a>
          </p>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
// 导入组件
import Header from '@/components/layout/Header.vue'
export default {
  name: 'UserLogin',
  components: {
    Header
  },
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      }
    };
  },
  methods: {
    handleLogin() {
      if (!this.loginForm.username || !this.loginForm.password) {
        alert('请输入账号和密码');
        return;
      }

      // 模拟登录请求
      console.log('登录信息:', this.loginForm);
      alert('登录成功！');

      // 在实际应用中，这里会调用API进行登录验证
      // 然后跳转到用户主页或返回之前的页面
      // this.$router.push('/dashboard');
    },
    goToRegister() {
      this.$router.push('/UserRegister');
    },
    goToForgotPassword() {
      this.$router.push('/UserGetmima');
    },
    goToPrivacyPolicy() {
      alert('跳转到隐私政策页面');
      // this.$router.push('/privacy-policy');
    },
    goToTerms() {
      alert('跳转到服务条款页面');
      // this.$router.push('/terms');
    }
  }
};
</script>

<style scoped>
@import url('@/styles/user/userlogin.css');
</style>
