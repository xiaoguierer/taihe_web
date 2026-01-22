<template>
  <div class="personal-center">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">Personal Center</h1>
      <p class="page-subtitle">Manage your personal information</p>
    </div>

    <!-- Google用户提示 -->
    <div v-if="isGoogleUser && user.isTemporary" class="google-user-notice">
      <div class="notice-content">
        <span class="notice-icon">🔐</span>
        <span>您正在使用Google临时会话登录</span>
        <button class="notice-action" @click="router.push('/UserEdit')">绑定账户</button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isInitializing || isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <span>加载用户信息中...</span>
    </div>

    <!-- 用户信息展示 -->
    <div class="info-card" @click="editProfile">
      <el-image
          v-if="user.avatarUrl"
          :src="user.avatarUrl"
          :preview-src-list="[user.avatarUrl]"
          fit="cover"
          class="avatar-image"
          :hide-on-click-modal="true"
      >
        <template #error>
          <div class="image-error">加载失败</div>
        </template>
      </el-image>
      <div class="info">
        <h3>{{ user.email || 'user' }}</h3>
<!--        <p>{{ user.nickname || '' }}</p>-->
        <p>{{ formatBirthday(user.birthdaytime)  }}</p>
      </div>
      <div class="arrow">›</div>
    </div>
    <!-- 分享链接 -->
    <div class="share-container">
      <div class="share-header">
        <span>Share link</span>
      </div>
      <div class="link-container">
        <div class="link-text" id="shareLink">https://www.zeniul.cn/users/register?inviteeId={{user.id}}</div>
        <button class="copy-btn" @click="copyShareLink()">
          复制链接分享
        </button>
      </div>
    </div>

    <!-- 功能列表 -->
    <div class="menu-container">
      <div class="menu-item" @click="manageAddress">
        <span>Shipping Address</span>
        <div class="arrow">›</div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from "element-plus"
import { useUserInfo } from '@/composables/useUserInfo'

const router = useRouter()
const {
  isLoggedIn,
  isGoogleUser,
  displayName,
  fullUserInfo,
  baseUserInfo,
  isLoading,
  error,
  loadFullUserInfo,
  getAvatarUrl,
  getMaskedEmail
} = useUserInfo()

const user = ref({})
const addressInfo = ref({})
const isInitializing = ref(true)

// 计算属性：获取当前用户的token
const currentToken = computed(() => baseUserInfo.value?.token)

// 获取用户基本信息（使用统一composable）
const fetchUserDetail = async () => {
  try {
    const userData = await loadFullUserInfo()

    if (userData) {
      // 将composable返回的数据映射到原有user对象结构
      user.value = {
        // 原有字段
        id: userData.id,
        email: userData.email,
        nickname: userData.nickname,
        avatarUrl: userData.avatar || userData.picture,
        birthdaytime: userData.birthday || userData.birthdaytime,

        // 扩展字段
        name: userData.name || userData.nickname,
        loginType: userData.loginType,
        isTemporary: userData.isTemporary,

        // 保留其他可能存在的字段
        ...userData
      }

      console.log('用户基本信息:', user.value)
      console.log('登录类型:', userData.loginType, '临时会话:', userData.isTemporary)
    }
  } catch (err) {
    console.error('获取用户信息失败:', err)
    // 错误消息已在composable中处理，这里仅记录
  }
}
// 添加生日格式化方法
const formatBirthday = (timeStr) => {
  if (!timeStr) return '';
  const date = new Date(timeStr);
  const monthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(date.getDate()).padStart(2, '0');
  const month = monthAbbr[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year} ${hours}:${minutes}`;
}
// 获取用户地址信息
const fetchAddressInfo = async () => {
  try {
    const userId = user.value?.id

    // 检查是否为Google临时用户
    if (isGoogleUser.value && user.value?.isTemporary) {
      console.log('Google临时用户，跳过地址信息获取')
      addressInfo.value = {}
      return
    }

    if (userId && currentToken.value) {
      const response = await fetch(`/api/user-address/getByUserId/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken.value}`,
        }
      })
      const data = await response.json()
      if (data && data.code === 200) {
        addressInfo.value = data.data || {}
        console.log('地址信息:', addressInfo.value)
      } else {
        throw new Error(data.message || '获取地址信息失败')
      }
    } else {
      console.warn('无法获取用户ID或token，跳过地址信息获取')
    }
  } catch (error) {
    console.error('获取地址信息失败:', error)
    // 对于非关键错误，仅记录不显示错误提示
    if (!error.message.includes('网络')) {
      ElMessage.warning('获取地址信息失败')
    }
  }
}

// 编辑个人信息
const editProfile = () => {
  router.push('/UserEdit')
}

// 管理收货地址
const manageAddress = () => {
  router.push('/UserAddresslist')
}
const copyShareLink = () =>{
  const linkText = `https://www.zeniul.cn/users/register?inviteeId=${user.value.id || ''}`
  navigator.clipboard.writeText(linkText).then(() => {
    ElMessage.success('链接已复制到剪贴板！')
  }).catch(() => {
    // 简单降级方案
    const input = document.createElement('input')
    input.value = linkText
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    ElMessage.success('链接已复制到剪贴板！')
  })
}
// 加载用户数据
onMounted(async () => {
  try {
    isInitializing.value = true

    // 先加载用户基本信息
    await fetchUserDetail()

    // 然后加载地址信息（如果不是Google临时用户）
    if (!(isGoogleUser.value && user.value?.isTemporary)) {
      await fetchAddressInfo()
    }

    console.log('用户中心初始化完成')
    console.log('用户类型:', isGoogleUser.value ? 'Google用户' : '普通用户')
    console.log('会话状态:', user.value?.isTemporary ? '临时会话' : '正式会话')

  } catch (err) {
    console.error('用户中心初始化失败:', err)
  } finally {
    isInitializing.value = false
  }
})
</script>

<style scoped>
.personal-center {
  min-height: 100vh;
  background-color: #0f172a;
  color: #e2e8f0;
  padding: 30px;
}

.page-header {
  margin-bottom: 30px;
  margin-top: 50px;
  text-align: center;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 10px;
}

.page-subtitle {
  color: #94a3b8;
  font-size: 16px;
}

.info-card {
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.info-card:hover {
  background: rgba(30, 41, 59, 0.8);
  transform: translateY(-2px);
}

.avatar-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
}

.image-error {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.5);
  color: #94a3b8;
  font-size: 12px;
}

.info {
  flex: 1;
}

.info h3 {
  font-size: 18px;
  color: #f8fafc;
  margin-bottom: 5px;
}

.info p {
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 3px;
}

.arrow {
  color: #94a3b8;
  font-size: 24px;
  font-weight: bold;
}

.menu-container {
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.menu-item {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  transition: background 0.3s ease;
}

.menu-item:hover {
  background: rgba(30, 41, 59, 0.8);
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item span {
  font-size: 16px;
  color: #e2e8f0;
}
.share-container {
  margin-top: 20px;
  padding: 15px;
  background: #0f172a;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.share-header {
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 12px;
  font-size: 16px;
}

.link-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.link-text {
  flex: 1;
  padding: 10px 12px;
  background: #0f172a;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 14px;
  color: #e2e8f0;
  word-break: break-all;
  overflow-wrap: break-word;
}

.copy-btn {
  padding: 10px 20px;
  background: #0f172a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
}

.copy-btn:hover {
  background: #2980b9;
}

.share-hint {
  font-size: 12px;
  color: #6c757d;
  line-height: 1.4;
}

/* Google用户提示样式 */
.google-user-notice {
  background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 20px;
  color: white;
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
  animation: slideIn 0.5s ease-out;
}

.notice-content {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.notice-icon {
  font-size: 18px;
}

.notice-action {
  margin-left: auto;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
}

.notice-action:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

/* 加载状态样式 */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 10px;
  margin-bottom: 20px;
  color: #94a3b8;
}

.loading-state .loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid #d4af37;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .personal-center {
    padding: 15px;
  }

  .page-header {
    margin-top: 30px;
  }

  .info-card {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }

  .info {
    width: 100%;
  }

  /* 移动端适配 */
  .google-user-notice {
    padding: 10px 12px;
    margin-bottom: 15px;
  }

  .notice-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .notice-action {
    margin-left: 0;
    width: 100%;
    text-align: center;
  }

  .loading-state {
    padding: 15px;
    flex-direction: column;
    text-align: center;
  }
}
</style>