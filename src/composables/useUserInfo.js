/**
 * 用户信息管理组合式函数
 * 提供统一的用户信息访问接口，支持Google登录和普通登录
 */

import { ref, computed, watchEffect } from 'vue'
import { useAuthStore } from '@/store/auth'
import { ElMessage } from 'element-plus'

/**
 * 用户信息接口
 * @typedef {Object} UserInfo
 * @property {string|number} [id] - 用户ID
 * @property {string} [email] - 用户邮箱
 * @property {string} [name] - 用户姓名
 * @property {string} [nickname] - 用户昵称
 * @property {string} [avatar] - 用户头像URL
 * @property {string} [picture] - Google头像URL (同avatar)
 * @property {string} [loginType] - 登录类型: 'google' | 'normal'
 * @property {boolean} [isTemporary] - 是否为临时会话
 * @property {Object} [additionalData] - 后端返回的附加数据
 */

/**
 * 使用用户信息
 * @returns {Object} 用户信息相关方法和状态
 */
export function useUserInfo() {
  const authStore = useAuthStore()

  // 状态
  const isLoading = ref(false)
  const error = ref(null)
  const detailedUserInfo = ref(null)
  const lastFetchTime = ref(0)
  const CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存

  // 基础用户信息（即时可用，来自store）
  const baseUserInfo = computed(() => {
    if (!authStore.isLoggedIn || !authStore.userInfo) {
      return null
    }

    const info = authStore.userInfo
    return {
      // 基础字段
      id: info.userId,
      email: info.email,
      name: info.name || info.nickname,
      nickname: info.nickname,
      avatar: info.picture || info.avatar,
      picture: info.picture || info.avatar,

      // 认证信息
      loginType: info.loginType || 'normal',
      isTemporary: info.isTemporary || false,
      token: authStore.token,

      // 时间戳
      lastUpdated: Date.now()
    }
  })

  // 是否已登录
  const isLoggedIn = computed(() => authStore.isLoggedIn)

  // 是否为Google用户
  const isGoogleUser = computed(() => baseUserInfo.value?.loginType === 'google')

  // 是否显示头像
  const hasAvatar = computed(() => !!baseUserInfo.value?.avatar)

  // 显示名称（优先显示姓名，其次邮箱用户名）
  const displayName = computed(() => {
    if (!baseUserInfo.value) return '用户'

    const user = baseUserInfo.value
    return user.name || user.nickname || (user.email ? user.email.split('@')[0] : '用户')
  })

  // 合并后的完整用户信息（基础信息 + 详细后端信息）
  const fullUserInfo = computed(() => {
    if (!baseUserInfo.value) return null

    const base = { ...baseUserInfo.value }
    const detailed = detailedUserInfo.value || {}

    // 合并策略：详细信息覆盖基础信息
    return {
      ...base,
      ...detailed,
      // 保留原始登录类型标识
      loginType: base.loginType,
      isTemporary: base.isTemporary
    }
  })

  /**
   * 获取用户详细信息的API调用
   * @returns {Promise<Object|null>} 用户详细信息或null
   */
  const fetchUserDetailFromAPI = async () => {
    const user = baseUserInfo.value
    const token = authStore.token

    if (!user || !user.id || !token) {
      return null
    }

    try {
      // 调用现有后端API
      const response = await fetch(`/api/users/getuserinfor/${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })

      const data = await response.json()

      if (data && data.code === 200) {
        return data.data
      } else {
        throw new Error(data?.message || '获取用户信息失败')
      }
    } catch (apiError) {
      console.warn('获取用户详细信息失败:', apiError)

      // Google临时用户特殊处理
      if (isGoogleUser.value && user.isTemporary) {
        console.log('Google临时用户，使用基础信息')
        return {
          // 将基础信息转换为后端格式
          id: user.id,
          email: user.email,
          nickname: user.name,
          avatar: user.avatar,
          loginType: 'google',
          isTemporary: true
        }
      }

      throw apiError
    }
  }

  /**
   * 加载完整用户信息
   * @param {boolean} [forceRefresh=false] 是否强制刷新（跳过缓存）
   * @returns {Promise<Object|null>} 完整用户信息
   */
  const loadFullUserInfo = async (forceRefresh = false) => {
    if (!isLoggedIn.value) {
      error.value = new Error('用户未登录')
      return null
    }

    // 检查缓存
    const now = Date.now()
    if (!forceRefresh &&
        detailedUserInfo.value &&
        now - lastFetchTime.value < CACHE_DURATION) {
      return fullUserInfo.value
    }

    isLoading.value = true
    error.value = null

    try {
      let apiData = null

      // 对于Google临时用户，可以跳过API调用
      if (isGoogleUser.value && baseUserInfo.value?.isTemporary) {
        console.log('Google临时用户，使用基础信息')
      } else {
        // 尝试从API获取详细信息
        apiData = await fetchUserDetailFromAPI()
      }

      detailedUserInfo.value = apiData
      lastFetchTime.value = Date.now()

      return fullUserInfo.value

    } catch (err) {
      error.value = err
      console.error('加载用户信息失败:', err)

      // 对于非关键错误，仍然返回基础信息
      if (err.message.includes('网络') || err.message.includes('失败')) {
        ElMessage.warning('获取用户详情失败，使用基础信息')
        return baseUserInfo.value
      }

      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 静默刷新用户信息（无加载状态）
   */
  const refreshSilently = async () => {
    try {
      const apiData = await fetchUserDetailFromAPI()
      if (apiData) {
        detailedUserInfo.value = apiData
        lastFetchTime.value = Date.now()
      }
    } catch (err) {
      console.debug('静默刷新用户信息失败:', err)
    }
  }

  /**
   * 获取用户头像URL
   * @param {string} [defaultAvatar] 默认头像URL
   * @returns {string} 头像URL
   */
  const getAvatarUrl = (defaultAvatar = null) => {
    const avatar = fullUserInfo.value?.avatar || baseUserInfo.value?.avatar
    return avatar || defaultAvatar || ''
  }

  /**
   * 获取用户邮箱（带掩码）
   * @returns {string} 邮箱（已掩码处理）
   */
  const getMaskedEmail = () => {
    const email = fullUserInfo.value?.email || baseUserInfo.value?.email
    if (!email) return ''

    const [name, domain] = email.split('@')
    if (name.length <= 2) return email

    const maskedName = name.substring(0, 2) + '*'.repeat(name.length - 2)
    return `${maskedName}@${domain}`
  }

  // 监听登录状态变化，自动刷新
  watchEffect(() => {
    if (authStore.isLoggedIn && baseUserInfo.value) {
      // 用户登录时自动加载详细信息
      loadFullUserInfo().catch(err => {
        console.debug('自动加载用户信息失败:', err)
      })
    } else {
      // 用户退出时清空状态
      detailedUserInfo.value = null
      error.value = null
      lastFetchTime.value = 0
    }
  })

  return {
    // 状态
    isLoading,
    error,

    // 计算属性
    isLoggedIn,
    isGoogleUser,
    hasAvatar,
    displayName,
    baseUserInfo,
    fullUserInfo,

    // 方法
    loadFullUserInfo,
    refreshSilently,
    getAvatarUrl,
    getMaskedEmail,

    // 原始store访问（备用）
    authStore,

    // 便捷方法
    getUserField: (field, defaultValue = null) => {
      return fullUserInfo.value?.[field] || baseUserInfo.value?.[field] || defaultValue
    }
  }
}

/**
 * 便捷函数：获取当前用户信息
 * @returns {Object|null} 用户信息或null
 */
export function getCurrentUser() {
  const authStore = useAuthStore()

  if (!authStore.isLoggedIn || !authStore.userInfo) {
    return null
  }

  const info = authStore.userInfo
  return {
    id: info.userId,
    email: info.email,
    name: info.name || info.nickname,
    avatar: info.picture || info.avatar,
    loginType: info.loginType || 'normal',
    isTemporary: info.isTemporary || false,
    token: authStore.token
  }
}