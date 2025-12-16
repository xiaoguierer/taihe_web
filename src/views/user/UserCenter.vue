<template>
  <div class="personal-center">
    <!-- 用户信息展示 -->
    <div class="info-card" @click="editProfile">
      <!-- 建议修改为 -->
      <el-image
          v-if="user.avatarUrl"
          :src="user.avatarUrl"
          :preview-src-list="[user.avatarUrl]"
          fit="cover"
          style="width: 50px; height: 50px"
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
    <div class="menu">
<!--      <div class="menu-item" @click="editProfile">
        <span>个人信息</span>
        <div class="arrow">›</div>
      </div>-->

      <div class="menu-item" @click="manageAddress">
        <span>收货地址</span>
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
const token = authStore.token //
const user = ref({})
const addressInfo = ref({})


// 获取订基本信息
const fetchUserDetail = async () => {
  try {
    const response = await fetch(`/api/users/getuserinfor/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 如果后端需要身份验证，请加上这一行 👇
        'Authorization': token ? `Bearer ${token}` : '',
      }
    })
    const data = await response.json()
    if (data && data.code === 200) {
      user.value = data.data
      console.log('用户基本信息:', user.value)
    } else {
      throw new Error(response.data.message || '用户基本信息失败')
    }
  } catch (error) {
    console.error('用户基本信息:', error)
    ElMessage.error('用户基本信息失败')
  }
}

// 获取用户地址信息（需要先获取当前用户ID）
const fetchAddressInfo = async () => {
  try {
    if (userId) {
      const response = await fetch(`/api/user-address/getByUserId/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 如果后端需要身份验证，请加上这一行 👇
          'Authorization': token ? `Bearer ${token}` : '',
        }
      })
      const data = await response.json()
      if (data && data.code === 200)  {
        addressInfo.value = data.data || {}
        console.log('地址信息:', addressInfo.value)
      } else {
        throw new Error(response.data.message || '获取地址信息失败')
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
  background: #f5f5f5;
  padding: 80px;
}

/* 用户信息卡片 */
.info-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  background: #f0f0f0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info {
  flex: 1;
}

.info h3 {
  margin: 0 0 5px 0;
  font-size: 18px;
  color: #333;
}

.info p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.arrow {
  color: #999;
  font-size: 20px;
}

/* 功能菜单 */
.menu {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.menu-item {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
}

.menu-item:hover {
  background: #f9f9f9;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item span {
  font-size: 16px;
  color: #333;
}
</style>