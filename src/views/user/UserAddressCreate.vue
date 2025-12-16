<template>
  <div class="create-container">
    <el-card class="create-card">
      <!-- 页面标题 -->
      <div class="page-header">
        <el-button type="info" @click="goBack">
          <el-icon>
            <ArrowLeft/>
          </el-icon>
          返回
        </el-button>
      </div>

      <!-- 表单区域 -->
      <el-form
          ref="dataForm"
          :model="formData"
          :rules="rules"
          label-width="120px"
          label-position="right"
          class="user-form"
      >

        <!-- 地址名称 -->
        <el-form-item label="地址名称" prop="addressName">
          <el-input v-model="formData.addressName" placeholder="如：家、公司"/>
        </el-form-item>

        <!-- 是否默认地址 -->
        <el-form-item label="默认地址" prop="isDefault">
          <el-radio-group v-model="formData.isDefault">
            <el-radio :value="0">是</el-radio>
            <el-radio :value="1">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 收货人信息 -->
        <el-form-item label="收货人姓名" prop="receiverName">
          <el-input v-model="formData.receiverName" placeholder="请输入收货人姓名"/>
        </el-form-item>

        <!-- 联系方式 -->
        <el-row>
          <el-col :span="8">
            <el-form-item label="国际区号" prop="phoneCountryCode">
              <el-input v-model="formData.phoneCountryCode" placeholder="如：+86"/>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="手机号码" prop="phoneNumber" label-width="100px">
              <el-input v-model="formData.phoneNumber" placeholder="请输入手机号码"/>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 邮箱 -->
        <el-form-item label="邮箱地址" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱地址"/>
        </el-form-item>

        <!-- 地址信息 -->
        <el-form-item label="国家" prop="country">
          <el-input v-model="formData.country" placeholder="请输入国家"/>
        </el-form-item>

        <el-form-item label="省/州" prop="stateProvince">
          <el-input v-model="formData.stateProvince" placeholder="请输入省/州"/>
        </el-form-item>

        <el-form-item label="城市" prop="city">
          <el-input v-model="formData.city" placeholder="请输入城市"/>
        </el-form-item>

        <el-form-item label="区/县" prop="district">
          <el-input v-model="formData.district" placeholder="请输入区/县"/>
        </el-form-item>

        <el-form-item label="详细地址" prop="streetAddress">
          <el-input
              v-model="formData.streetAddress"
              type="textarea"
              :rows="3"
              placeholder="请输入详细地址"
          />
        </el-form-item>

        <el-form-item label="邮编" prop="postalCode">
          <el-input v-model="formData.postalCode" placeholder="请输入邮编"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="loading">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import {ref, reactive} from 'vue'
import {ElMessage} from 'element-plus'
import {ArrowLeft} from '@element-plus/icons-vue'
import { useAuthStore } from '@/store/auth'
const authStore = useAuthStore()
const userId = authStore.userInfo?.userId
const token = authStore.token //

const emit = defineEmits(['close', 'success'])
const loading = ref(false)

// 返回按钮
const goBack = () => {
  emit('close')
}

// 表单数据 - 对应UserAddressCreateDTO
const formData = reactive({
  addressName: '公司地址',
  isDefault: 0,
  receiverName: '收件人',
  phoneCountryCode: '+86',
  phoneNumber: '18698767898',
  email: '1223@email.com',
  country: '中国',
  stateProvince: '北京',
  city: '北京',
  district: '西城区',
  streetAddress: '广阳路社区居委会',
  postalCode: '082977'
})

// 表单验证规则
const rules = reactive({
  receiverName: [
    { required: true, message: '请输入收货人姓名', trigger: 'blur' }
  ],
  phoneCountryCode: [
    { required: true, message: '请输入国际区号', trigger: 'blur' }
  ],
  phoneNumber: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  country: [
    { required: true, message: '请输入国家', trigger: 'blur' }
  ],
  stateProvince: [
    { required: true, message: '请输入省/州', trigger: 'blur' }
  ],
  city: [
    { required: true, message: '请输入城市', trigger: 'blur' }
  ],
  streetAddress: [
    { required: true, message: '请输入详细地址', trigger: 'blur' }
  ]
})

// 表单引用
const dataForm = ref(null)

// 提交表单
const submitForm = async () => {
  if (!dataForm.value) return

  try {
    const valid = await dataForm.value.validate()
    if (!valid) return

    loading.value = true

    // 构造请求数据 - 对应UserAddressCreateDTO
    const requestData = {
      userId:userId,
      addressName: formData.addressName,
      isDefault: formData.isDefault,
      receiverName: formData.receiverName,
      phoneCountryCode: formData.phoneCountryCode,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      country: formData.country,
      stateProvince: formData.stateProvince,
      city: formData.city,
      district: formData.district,
      streetAddress: formData.streetAddress,
      postalCode: formData.postalCode
    }

    console.log('提交的地址数据:', requestData)

    // 调用后端API - 使用/add端点
    const response = await fetch('/api/user-address/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(requestData)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '新增地址失败')
    }

    if (result.code && result.code !== 200) {
      throw new Error(result.message || '新增地址失败')
    }

    ElMessage.success('地址新增成功')
    emit('success') // 通知父组件关闭对话框并刷新列表
  } catch (error) {
    console.error('新增地址错误:', error)
    ElMessage.error(`新增失败: ${error.message}`)
  } finally {
    loading.value = false
  }
}

// 重置表单
const resetForm = () => {
  if (dataForm.value) {
    dataForm.value.resetFields()
    // 重置默认值
    formData.phoneCountryCode = '+86'
    formData.country = '中国'
    formData.isDefault = 0
  }
}
</script>

<style scoped>
.create-container {
  padding: 20px;
}

.create-card {
  max-width: 800px;
  margin: 0 auto;
  border-radius: 8px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.user-form {
  padding: 0 20px;
}

.el-form-item {
  margin-bottom: 22px;
}
</style>