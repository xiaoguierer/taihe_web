<template>
  <!-- 只在开发环境显示 -->
  <div v-if="isDevelopment" class="user-debug-panel">
    <!-- 标题栏（可点击展开/收起） -->
    <div class="debug-header" @click="toggleExpanded">
      <div class="header-left">
        <span class="debug-icon">🔍</span>
        <span class="debug-title">用户信息调试面板</span>
        <span class="debug-badge" :class="isLoggedIn ? 'logged-in' : 'logged-out'">
          {{ isLoggedIn ? '已登录' : '未登录' }}
        </span>
        <span v-if="isGoogleUser && user?.isTemporary" class="google-badge">
          Google临时会话
        </span>
      </div>
      <div class="header-right">
        <span class="toggle-icon">{{ expanded ? '▼' : '▲' }}</span>
      </div>
    </div>

    <!-- 展开内容 -->
    <div v-if="expanded" class="debug-content">
      <!-- 登录状态 -->
      <div class="debug-section">
        <h4 class="section-title">
          <span class="section-icon">🔐</span>
          登录状态
        </h4>
        <div class="status-grid">
          <div class="status-item">
            <span class="status-label">登录状态:</span>
            <span class="status-value" :class="isLoggedIn ? 'success' : 'error'">
              {{ isLoggedIn ? '已登录' : '未登录' }}
            </span>
          </div>
          <div class="status-item">
            <span class="status-label">登录类型:</span>
            <span class="status-value">{{ loginTypeText }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">临时会话:</span>
            <span class="status-value">{{ isTemporaryText }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">令牌长度:</span>
            <span class="status-value">{{ tokenLength }} 字符</span>
          </div>
        </div>
      </div>

      <!-- 用户基本信息 -->
      <div class="debug-section">
        <h4 class="section-title">
          <span class="section-icon">👤</span>
          用户信息
        </h4>
        <div class="user-grid">
          <div class="user-item">
            <span class="user-label">用户ID:</span>
            <code class="user-value">{{ user?.id || 'N/A' }}</code>
          </div>
          <div class="user-item">
            <span class="user-label">邮箱:</span>
            <code class="user-value">{{ user?.email || 'N/A' }}</code>
          </div>
          <div class="user-item">
            <span class="user-label">姓名:</span>
            <code class="user-value">{{ user?.name || user?.nickname || 'N/A' }}</code>
          </div>
          <div class="user-item">
            <span class="user-label">头像:</span>
            <code class="user-value">{{ user?.avatar ? '已设置' : '未设置' }}</code>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="debug-section">
        <h4 class="section-title">
          <span class="section-icon">🛠️</span>
          调试操作
        </h4>
        <div class="action-buttons">
          <button @click="outputToConsole" class="action-btn console-btn" title="输出到控制台">
            <span class="btn-icon">📋</span>
            控制台输出
          </button>
          <button @click="copyToClipboard" class="action-btn copy-btn" title="复制到剪贴板">
            <span class="btn-icon">📎</span>
            复制信息
          </button>
          <button @click="refreshInfo" class="action-btn refresh-btn" title="刷新信息">
            <span class="btn-icon">🔄</span>
            刷新
          </button>
          <button @click="clearStorage" class="action-btn clear-btn" title="清除缓存">
            <span class="btn-icon">🗑️</span>
            清除缓存
          </button>
        </div>
      </div>

      <!-- 原始数据（可折叠） -->
      <div class="debug-section">
        <div class="raw-data-header" @click="toggleRawData">
          <h4 class="section-title">
            <span class="section-icon">📊</span>
            原始数据
            <span class="raw-toggle">{{ showRawData ? '▼' : '▶' }}</span>
          </h4>
        </div>
        <div v-if="showRawData" class="raw-data-content">
          <pre class="raw-data-pre">{{ formattedRawData }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserInfo } from '@/composables/useUserInfo'
import { useAuthStore } from '@/store/auth'
import { ElMessage } from 'element-plus'

const { isLoggedIn, isGoogleUser, fullUserInfo, baseUserInfo, loadFullUserInfo } = useUserInfo()
const authStore = useAuthStore()

const expanded = ref(true)
const showRawData = ref(false)
const isDevelopment = import.meta.env.DEV

// 计算属性
const user = computed(() => fullUserInfo.value || baseUserInfo.value)
const loginTypeText = computed(() => {
  if (!isLoggedIn.value) return 'N/A'
  return isGoogleUser.value ? 'Google登录' : '普通登录'
})
const isTemporaryText = computed(() => {
  if (!isLoggedIn.value) return 'N/A'
  return user.value?.isTemporary ? '是' : '否'
})
const tokenLength = computed(() => authStore.token?.length || 0)

const formattedRawData = computed(() => {
  const data = {
    timestamp: new Date().toISOString(),
    environment: import.meta.env.MODE,
    user: user.value,
    authStore: {
      token: authStore.token,
      userInfo: authStore.userInfo
    },
    localStorage: {
      auth_token: localStorage.getItem('auth_token'),
      user_info: localStorage.getItem('user_info')
    }
  }
  return JSON.stringify(data, null, 2)
})

// 方法
const toggleExpanded = () => {
  expanded.value = !expanded.value
}

const toggleRawData = () => {
  showRawData.value = !showRawData.value
}

const outputToConsole = () => {
  console.group('🎯 用户信息调试输出')
  console.log('📅 时间:', new Date().toLocaleString())
  console.log('🔐 登录状态:', isLoggedIn.value ? '已登录' : '未登录')

  if (isLoggedIn.value) {
    console.log('👤 用户类型:', isGoogleUser.value ? 'Google用户' : '普通用户')
    console.log('🏷️  显示信息:', {
      用户ID: user.value?.id,
      邮箱: user.value?.email,
      姓名: user.value?.name,
      昵称: user.value?.nickname,
      头像: user.value?.avatar,
      登录类型: user.value?.loginType,
      临时会话: user.value?.isTemporary
    })
  }

  console.log('💾 认证存储:', {
    token: authStore.token,
    userInfo: authStore.userInfo
  })
  console.groupEnd()

  ElMessage.success('信息已输出到控制台')
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(formattedRawData.value)
    ElMessage.success('用户信息已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
    ElMessage.error('复制失败，请检查控制台')
  }
}

const refreshInfo = async () => {
  try {
    await loadFullUserInfo(true)
    ElMessage.success('用户信息已刷新')
  } catch (err) {
    console.error('刷新失败:', err)
    ElMessage.warning('刷新失败，请检查网络连接')
  }
}

const clearStorage = () => {
  if (confirm('确定要清除所有登录缓存吗？这将导致您需要重新登录。')) {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_info')
    authStore.silentLogout()
    ElMessage.success('缓存已清除，请重新登录')
  }
}

// 组件挂载时自动输出一次（开发环境）
onMounted(() => {
  if (isDevelopment) {
    console.log('🛠️  用户信息调试面板已加载')
    console.log('📌 点击右上角的调试面板查看更多信息')

    // 如果已登录，自动输出一次
    if (isLoggedIn.value) {
      setTimeout(() => {
        outputToConsole()
      }, 1000)
    }
  }
})
</script>

<style scoped>
.user-debug-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(30, 41, 59, 0.95);
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 12px;
  color: #e2e8f0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 13px;
  z-index: 9999;
  min-width: 320px;
  max-width: 400px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.debug-header {
  padding: 12px 16px;
  background: rgba(15, 23, 42, 0.8);
  border-radius: 12px 12px 0 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.2s;
  user-select: none;
}

.debug-header:hover {
  background: rgba(15, 23, 42, 0.9);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.debug-icon {
  font-size: 16px;
}

.debug-title {
  font-weight: 600;
  font-size: 14px;
}

.debug-badge {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 600;
}

.debug-badge.logged-in {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.debug-badge.logged-out {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.google-badge {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  background: rgba(66, 133, 244, 0.2);
  color: #60a5fa;
  border: 1px solid rgba(66, 133, 244, 0.3);
}

.toggle-icon {
  color: #94a3b8;
  font-size: 12px;
}

.debug-content {
  padding: 16px;
  max-height: 500px;
  overflow-y: auto;
}

.debug-section {
  margin-bottom: 16px;
}

.debug-section:last-child {
  margin-bottom: 0;
}

.section-title {
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 600;
  color: #d4af37;
  display: flex;
  align-items: center;
  gap: 6px;
}

.section-icon {
  font-size: 14px;
}

.status-grid, .user-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.status-item, .user-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.status-label, .user-label {
  font-size: 11px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-value, .user-value {
  font-size: 12px;
  font-weight: 500;
  color: #e2e8f0;
}

.status-value.success {
  color: #4ade80;
}

.status-value.error {
  color: #f87171;
}

.user-value {
  font-family: 'Courier New', monospace;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 8px;
  border-radius: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.action-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.console-btn {
  background: rgba(79, 195, 247, 0.2);
  color: #4fc3f7;
  border: 1px solid rgba(79, 195, 247, 0.3);
}

.console-btn:hover {
  background: rgba(79, 195, 247, 0.3);
}

.copy-btn {
  background: rgba(51, 207, 102, 0.2);
  color: #51cf66;
  border: 1px solid rgba(51, 207, 102, 0.3);
}

.copy-btn:hover {
  background: rgba(51, 207, 102, 0.3);
}

.refresh-btn {
  background: rgba(255, 212, 59, 0.2);
  color: #ffd43b;
  border: 1px solid rgba(255, 212, 59, 0.3);
}

.refresh-btn:hover {
  background: rgba(255, 212, 59, 0.3);
}

.clear-btn {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.clear-btn:hover {
  background: rgba(255, 107, 107, 0.3);
}

.btn-icon {
  font-size: 14px;
}

.raw-data-header {
  cursor: pointer;
  user-select: none;
}

.raw-toggle {
  margin-left: auto;
  font-size: 12px;
  color: #94a3b8;
}

.raw-data-content {
  margin-top: 8px;
}

.raw-data-pre {
  margin: 0;
  padding: 12px;
  background: rgba(15, 23, 42, 0.8);
  border-radius: 6px;
  font-size: 11px;
  line-height: 1.4;
  max-height: 200px;
  overflow: auto;
  color: #abb2bf;
  font-family: 'Courier New', monospace;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

/* 滚动条样式 */
.raw-data-pre::-webkit-scrollbar,
.debug-content::-webkit-scrollbar {
  width: 6px;
}

.raw-data-pre::-webkit-scrollbar-track,
.debug-content::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 3px;
}

.raw-data-pre::-webkit-scrollbar-thumb,
.debug-content::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 3px;
}

.raw-data-pre::-webkit-scrollbar-thumb:hover,
.debug-content::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-debug-panel {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }

  .status-grid, .user-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    grid-template-columns: 1fr;
  }
}
</style>