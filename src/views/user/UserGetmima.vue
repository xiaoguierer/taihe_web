<template>
  <div class="login-page">
    <!-- 第二部分：登录表单 -->
    <section class="login-section">
      <div class="login-container">
        <h1 class="login-title">找回密码</h1>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label class="form-label" for="email">邮箱</label>
            <input
              type="text"
              id="email"
              class="form-input"
              placeholder="请输入邮箱"
              v-model="loginForm.email"
              required
            >
          </div>
          <button type="submit" class="login-button">提交</button>
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
export default {
  name: 'UserLogin',
  data() {
    return {
      loginForm: {
        email: ''
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
    goToPrivacyPolicy() {
      this.$router.push('/Police');
    },
    goToTerms() {
      this.$router.push('/Service');
    }
  }
};
</script>

<style scoped>
@import url('@/styles/user/usergetmima.css');
</style>
