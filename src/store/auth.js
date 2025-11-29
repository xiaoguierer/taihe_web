import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('auth_token'));
  const userInfo = ref(JSON.parse(localStorage.getItem('user_info') || 'null'));

  // 确保 isLoggedIn 计算属性正确
  const isLoggedIn = computed(() => {
    console.log('🔐 检查登录状态, token:', token.value)
    return !!token.value
  })
  const login = (userData, userToken) => {
    token.value = userToken
    user.value = userData
    localStorage.setItem('token', userToken)
    localStorage.setItem('user', JSON.stringify(userData))
    console.log('✅ 登录成功，设置token:', userToken)
  }
  const loginSuccess = (newToken, newUserInfo) => {
    token.value = newToken;
    userInfo.value = newUserInfo;
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('user_info', JSON.stringify(newUserInfo));
    console.log('✅ 登录状态保存成功');
  };

  const logout = () => {
    token.value = null;
    userInfo.value = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
  };

  return {
    token,
    userInfo,
    isLoggedIn,
    loginSuccess,
    login,
    logout
  };
});
