/**
 * 用户信息调试工具
 * 提供在浏览器控制台中调试用户信息的功能
 */

import { useAuthStore } from '@/store/auth'
import { getCurrentUser } from '@/composables/useUserInfo'

/**
 * 在控制台输出当前用户信息
 * @param {boolean} detailed - 是否输出详细信息
 */
export function debugUserInfo(detailed = false) {
  console.group('👤 用户信息调试工具')

  const authStore = useAuthStore()
  const currentUser = getCurrentUser()

  console.log('📅 调试时间:', new Date().toLocaleString())
  console.log('🌐 环境:', import.meta.env.MODE)

  // 登录状态
  console.log('🔐 认证状态:', {
    是否已登录: authStore.isLoggedIn,
    令牌存在: !!authStore.token,
    用户信息存在: !!authStore.userInfo,
    'Pinia登录状态': authStore.isLoggedIn
  })

  if (currentUser) {
    console.log('✅ 当前登录用户:')

    if (detailed) {
      // 详细输出
      console.log('📋 完整用户对象:', currentUser)
      console.table({
        '用户ID': currentUser.id,
        '邮箱': currentUser.email,
        '姓名': currentUser.name,
        '昵称': currentUser.nickname,
        '头像': currentUser.avatar ? '已设置' : '未设置',
        '登录类型': currentUser.loginType,
        '临时会话': currentUser.isTemporary ? '是' : '否',
        '令牌长度': currentUser.token?.length || 0
      })
    } else {
      // 简洁输出
      console.log(`📧 邮箱: ${currentUser.email}`)
      console.log(`👤 姓名: ${currentUser.name || currentUser.nickname || '未设置'}`)
      console.log(`🔑 登录类型: ${currentUser.loginType}`)
      console.log(`⏱️  临时会话: ${currentUser.isTemporary ? '是' : '否'}`)
      console.log(`🆔 用户ID: ${currentUser.id}`)
    }

    // 特殊处理Google用户
    if (currentUser.loginType === 'google') {
      console.log('🔵 Google用户信息:')
      console.log(`   📧 邮箱: ${currentUser.email}`)
      console.log(`   👤 姓名: ${currentUser.name}`)
      console.log(`   🖼️  头像: ${currentUser.avatar ? '已设置' : '未设置'}`)
      console.log(`   ⚠️  临时会话: ${currentUser.isTemporary ? '是（建议绑定账户）' : '否'}`)
    }
  } else {
    console.log('❌ 当前没有用户登录')
  }

  // localStorage信息
  console.log('💾 localStorage状态:', {
    auth_token: localStorage.getItem('auth_token')?.substring(0, 30) + '...',
    user_info: localStorage.getItem('user_info') ? '已存储' : '未存储',
    savedEmail: localStorage.getItem('savedEmail'),
    rememberMe: localStorage.getItem('rememberMe')
  })

  console.groupEnd()
}

/**
 * 导出用户对象到全局变量
 * @returns {Object|null} 当前用户对象或null
 */
export function exportUserToGlobal() {
  const user = getCurrentUser()
  if (user && typeof window !== 'undefined') {
    window.__CURRENT_USER = user
    console.log('📤 用户对象已导出到 window.__CURRENT_USER')
    return user
  }
  return null
}

/**
 * 检查认证状态并输出问题
 */
export function checkAuthStatus() {
  console.group('🔍 认证状态检查')

  const authStore = useAuthStore()
  const issues = []

  // 检查token
  if (!authStore.token) {
    issues.push('❌ 认证令牌不存在')
  } else if (authStore.token.length < 10) {
    issues.push('⚠️  认证令牌可能过短')
  }

  // 检查用户信息
  if (!authStore.userInfo) {
    issues.push('❌ 用户信息不存在')
  } else {
    if (!authStore.userInfo.userId) issues.push('⚠️  用户ID不存在')
    if (!authStore.userInfo.email) issues.push('⚠️  用户邮箱不存在')
  }

  // 检查localStorage一致性
  const storedToken = localStorage.getItem('auth_token')
  const storedUserInfo = localStorage.getItem('user_info')

  if (authStore.token !== storedToken) {
    issues.push('⚠️  Store令牌与localStorage不一致')
  }

  if (issues.length === 0) {
    console.log('✅ 认证状态正常')
  } else {
    console.log('⚠️  发现以下问题:')
    issues.forEach(issue => console.log('  ' + issue))
  }

  console.log('📊 状态摘要:', {
    'Store令牌': authStore.token ? `${authStore.token.length}字符` : '无',
    'Store用户信息': authStore.userInfo ? '存在' : '无',
    'localStorage令牌': storedToken ? '存在' : '无',
    'localStorage用户信息': storedUserInfo ? '存在' : '无',
    '是否登录': authStore.isLoggedIn ? '是' : '否'
  })

  console.groupEnd()
  return issues
}

/**
 * 模拟登录/登出操作
 */
export function simulateAuthActions() {
  console.group('🎭 认证操作模拟')

  console.log('可用操作:')
  console.log('1. debugUser.login() - 模拟登录')
  console.log('2. debugUser.logout() - 模拟登出')
  console.log('3. debugUser.clear() - 清除所有存储')

  console.groupEnd()
}

/**
 * 初始化调试工具到全局window对象
 */
export function initUserDebugTools() {
  if (typeof window === 'undefined') return

  // 防止重复初始化
  if (window.__USER_DEBUG_INITIALIZED) {
    console.log('🛠️  用户调试工具已初始化')
    return
  }

  window.debugUser = {
    // 基本信息
    info: (detailed = false) => debugUserInfo(detailed),

    // 状态检查
    status: () => checkAuthStatus(),

    // 导出数据
    export: () => exportUserToGlobal(),

    // 模拟操作
    login: () => {
      console.log('🔐 模拟登录功能 - 请使用实际登录页面')
      console.log('💡 提示: 访问 /users/login 进行登录')
    },

    logout: () => {
      const authStore = useAuthStore()
      authStore.logout()
      console.log('🚪 已执行登出操作')
    },

    clear: () => {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_info')
      localStorage.removeItem('savedEmail')
      localStorage.removeItem('rememberMe')
      const authStore = useAuthStore()
      authStore.silentLogout()
      console.log('🗑️  所有认证缓存已清除')
    },

    // 工具函数
    getToken: () => {
      const authStore = useAuthStore()
      return authStore.token
    },

    getUser: () => getCurrentUser(),

    getStore: () => useAuthStore(),

    // 测试Google用户
    testGoogleUser: () => {
      console.log('🔵 Google用户测试模式')
      const testUser = {
        id: 'google-test-123',
        email: 'test.google@gmail.com',
        name: '测试Google用户',
        avatar: 'https://via.placeholder.com/150',
        loginType: 'google',
        isTemporary: true,
        token: 'google_test_token_' + Date.now()
      }
      console.log('测试用户:', testUser)
      console.log('💡 提示: 这只是测试数据，不会实际存储')
    }
  }

  window.__USER_DEBUG_INITIALIZED = true

  // 开发环境自动输出欢迎信息
  if (import.meta.env.DEV) {
    console.log('🛠️  用户信息调试工具已加载！')
    console.log('📌 使用方法:')
    console.log('  • debugUser.info() - 查看用户信息')
    console.log('  • debugUser.info(true) - 查看详细信息')
    console.log('  • debugUser.status() - 检查认证状态')
    console.log('  • debugUser.export() - 导出用户到全局变量')
    console.log('  • debugUser.getUser() - 获取当前用户对象')
    console.log('  • debugUser.getToken() - 获取当前令牌')
    console.log('  • debugUser.logout() - 登出')
    console.log('  • debugUser.clear() - 清除所有缓存')
  }
}

// 自动初始化（开发环境）
if (import.meta.env.DEV && typeof window !== 'undefined') {
  // 延迟初始化，确保Vue应用已加载
  setTimeout(() => {
    initUserDebugTools()
  }, 1000)
}

export default {
  debugUserInfo,
  exportUserToGlobal,
  checkAuthStatus,
  initUserDebugTools,
  simulateAuthActions
}