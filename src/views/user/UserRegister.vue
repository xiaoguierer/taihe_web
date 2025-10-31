<template>
  <div class="login-page">
    <!-- 使用头部组件 -->
    <Header />
    <!-- 第二部分：登录表单 -->
    <section class="login-section">
      <div class="login-container">
        <h1 class="login-title">注册</h1>
        <p class="register-prompt">
          已有账号？
          <a href="#" class="register-link" @click="goToLogin" >点击这里登录</a>
        </p>

        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label class="form-label" for="firstname">First name</label>
            <input
              type="text"
              id="firstname"
              class="form-input"
              placeholder="请输入firstname"
              v-model="registerForm.firstname"
              required
            >
          </div>

          <div class="form-group">
          <label class="form-label" for="secondname">Second name</label>
          <input
            type="text"
            id="secondname"
            class="form-input"
            placeholder="请输入secondname"
            v-model="registerForm.secondname"
            required
          >
          </div>

          <div class="form-group">
            <label class="form-label" for="email">Email</label>
            <input
              type="text"
              id="email"
              class="form-input"
              placeholder="请输入email"
              v-model="registerForm.email"
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
              v-model="registerForm.password"
              required
            >
          </div>

          <button type="submit" class="login-button">注册</button>
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
  name: 'UserRegister',
  components: {
    Header
  },
  data() {
    return {
      registerForm: {
        firstname: '',
        secondname: '',
        email:'',
        password: ''
      }
    };
  },
  methods: {
    handleRegister() {
      if (!this.registerForm.firstname || !this.registerForm.firstname) {
        alert('请输入账号和密码');
        return;
      }

      // 模拟登录请求
      console.log('登录信息:', this.registerForm);
      alert('登录成功！');

      // 在实际应用中，这里会调用API进行登录验证
      // 然后跳转到用户主页或返回之前的页面
      // this.$router.push('/dashboard');
    },
    goToLogin() {
      this.$router.push('/UserLogin');
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
@import url('@/styles/user/userregister.css');
</style>
