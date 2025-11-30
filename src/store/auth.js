import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // ✅ 修复：统一使用 auth_token 和 user_info
  const token = ref(localStorage.getItem('auth_token'));
  const userInfo = ref(JSON.parse(localStorage.getItem('user_info') || 'null'));

  // ✅ 保持：isLoggedIn 计算属性
  const isLoggedIn = computed(() => {
    console.log('🔐 检查登录状态, token存在:', !!token.value);
    return !!token.value;
  });

  // ✅ 修改：统一 login 方法，使用一致的键名
  const login = (userData, userToken) => {
    try {
      console.log('🔐 开始登录流程', {
        userData: userData ? '有数据' : '无数据',
        tokenLength: userToken?.length
      });

      token.value = userToken;
      userInfo.value = userData; // ✅ 修复：统一使用 userInfo

      // ✅ 修复：统一使用 auth_token 和 user_info
      localStorage.setItem('auth_token', userToken);
      localStorage.setItem('user_info', JSON.stringify(userData));

      console.log('✅ 登录成功', {
        token: userToken ? `${userToken.substring(0, 10)}...` : '空',
        userInfo: userData
      });

    } catch (error) {
      console.error('❌ 登录保存失败:', error);
      throw new Error('登录状态保存失败');
    }
  };

  // ✅ 修改：增强 loginSuccess 方法，保持一致性
  const loginSuccess = (newToken, newUserInfo) => {
    try {
      console.log('🔐 开始保存认证信息', {
        tokenLength: newToken?.length,
        userInfo: newUserInfo ? '有数据' : '无数据'
      });

      token.value = newToken;
      userInfo.value = newUserInfo;

      localStorage.setItem('auth_token', newToken);
      localStorage.setItem('user_info', JSON.stringify(newUserInfo));

      console.log('✅ 登录状态保存成功', {
        storeToken: token.value ? '已设置' : '未设置',
        storeUserInfo: userInfo.value ? '已设置' : '未设置'
      });

    } catch (error) {
      console.error('❌ 登录状态保存失败:', error);
      throw new Error('认证信息保存失败');
    }
  };

  // ✅ 修改：增强退出方法，添加后端调用和错误处理
  const logout = async () => {
    try {
      console.log('🚪 开始退出登录流程', {
        hasToken: !!token.value,
        hasUserInfo: !!userInfo.value
      });

      const currentToken = token.value;

      // 1. 调用后端退出接口（如果token存在）
      if (currentToken) {
        try {
          await callBackendLogout(currentToken);
          console.log('✅ 后端退出成功');
        } catch (error) {
          console.warn('⚠️ 后端退出失败，继续前端清理:', error.message);
        }
      }

      // 2. 清除前端状态（无论后端是否成功）
      clearAuthState();

      console.log('✅ 退出登录完成');

    } catch (error) {
      console.error('❌ 退出过程异常:', error);
      // 即使异常也要清除状态
      clearAuthState();
      throw error;
    }
  };

  // ✅ 新增：清除认证状态的内部方法
  const clearAuthState = () => {
    console.log('🧹 清除认证状态');

    // 清除Store状态
    token.value = null;
    userInfo.value = null;

    // ✅ 修复：统一清除 auth_token 和 user_info
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');

    // 清除可能存在的旧键名（兼容性清理）
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    console.log('✅ 认证状态清除完成');
  };

  // ✅ 新增：调用后端退出接口
  const callBackendLogout = async (token) => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`后端退出调用失败: ${error.message}`);
    }
  };

  // ✅ 新增：静默退出（不调用后端）
  const silentLogout = () => {
    console.log('🔇 执行静默退出');
    clearAuthState();
  };

  // ✅ 新增：检查并恢复认证状态
  const checkAuthStatus = () => {
    // 如果Store中状态为空，尝试从localStorage恢复
    if (!token.value) {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        token.value = storedToken;
        console.log('🔄 从localStorage恢复token');
      }
    }

    if (!userInfo.value) {
      const storedUserInfo = localStorage.getItem('user_info');
      if (storedUserInfo) {
        try {
          userInfo.value = JSON.parse(storedUserInfo);
          console.log('🔄 从localStorage恢复userInfo');
        } catch (e) {
          console.error('解析userInfo失败:', e);
        }
      }
    }

    return isLoggedIn.value;
  };

  return {
    // State
    token,
    userInfo,

    // Getters
    isLoggedIn,

    // Actions
    login,
    loginSuccess,
    logout,
    silentLogout,
    checkAuthStatus
  };
});
