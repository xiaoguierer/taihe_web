<template>
  <div class="personal-center">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">Personal Center</h1>
      <p class="page-subtitle">Manage your personal information and shipping addresses</p>
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
        <h3>{{ user.email || '用户' }}</h3>
        <p>{{ user.nickname || '' }}</p>
        <p>{{ user.birthdaytime || '' }}</p>
      </div>
      <div class="arrow">›</div>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {ElMessage} from "element-plus";
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()
const userId = authStore.userInfo?.userId
const token = authStore.token
const user = ref({})
const addressInfo = ref({})

// 获取用户基本信息
const fetchUserDetail = async () => {
  try {
    const response = await fetch(`/api/users/getuserinfor/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      }
    })
    const data = await response.json()
    if (data && data.code === 200) {
      user.value = data.data
      console.log('用户基本信息:', user.value)
    } else {
      throw new Error(data.message || '获取用户信息失败')
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败')
  }
}

// 获取用户地址信息
const fetchAddressInfo = async () => {
  try {
    if (userId) {
      const response = await fetch(`/api/user-address/getByUserId/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
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
      throw new Error('无法获取当前用户信息')
    }
  } catch (error) {
    console.error('获取地址信息失败:', error)
    ElMessage.error('获取地址信息失败')
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

// 加载用户数据
onMounted(async () => {
  await fetchUserDetail()
  await fetchAddressInfo()
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
}
</style>