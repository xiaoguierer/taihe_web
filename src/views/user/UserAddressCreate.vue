<template>
  <div class="create-container">
    <el-card class="create-card">
      <!-- Page Header -->
      <div class="page-header">
        <el-button type="info" @click="goBack">
          <el-icon>
            <ArrowLeft/>
          </el-icon>
          Back
        </el-button>
      </div>

      <!-- Form Area -->
      <el-form
          ref="dataForm"
          :model="formData"
          :rules="rules"
          label-width="120px"
          label-position="right"
          class="user-form"
      >

        <!-- Address Name -->
        <el-form-item label="Address Name" prop="addressName">
          <el-input v-model="formData.addressName" placeholder="e.g. Home, Office"/>
        </el-form-item>

        <!-- Default Address -->
        <el-form-item label="Default Address" prop="isDefault">
          <el-radio-group v-model="formData.isDefault">
            <el-radio :value="0">Yes</el-radio>
            <el-radio :value="1">No</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- Receiver Information -->
        <el-form-item label="Receiver Name" prop="receiverName">
          <el-input v-model="formData.receiverName" placeholder="Please enter receiver name"/>
        </el-form-item>

        <!-- Contact Information -->
        <el-row>
          <el-col :span="8">
            <el-form-item label="Country Code" prop="phoneCountryCode">
              <el-input v-model="formData.phoneCountryCode" placeholder="e.g. +86"/>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="Phone Number" prop="phoneNumber" label-width="100px">
              <el-input v-model="formData.phoneNumber" placeholder="Please enter phone number"/>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Email -->
        <el-form-item label="Email Address" prop="email">
          <el-input v-model="formData.email" placeholder="Please enter email address"/>
        </el-form-item>

        <!-- Address Information -->
        <el-form-item label="Country" prop="country">
          <el-input v-model="formData.country" placeholder="Please enter country"/>
        </el-form-item>

        <el-form-item label="State/Province" prop="stateProvince">
          <el-input v-model="formData.stateProvince" placeholder="Please enter state/province"/>
        </el-form-item>

        <el-form-item label="City" prop="city">
          <el-input v-model="formData.city" placeholder="Please enter city"/>
        </el-form-item>

        <el-form-item label="District" prop="district">
          <el-input v-model="formData.district" placeholder="Please enter district"/>
        </el-form-item>

        <el-form-item label="Street Address" prop="streetAddress">
          <el-input
              v-model="formData.streetAddress"
              type="textarea"
              :rows="3"
              placeholder="Please enter detailed address"
          />
        </el-form-item>

        <el-form-item label="Postal Code" prop="postalCode">
          <el-input v-model="formData.postalCode" placeholder="Please enter postal code"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="loading">Submit</el-button>
          <el-button @click="resetForm">Reset</el-button>
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

// Back button
const goBack = () => {
  emit('close')
}

// Form data - corresponds to UserAddressCreateDTO
const formData = reactive({
  addressName: 'Office Address',
  isDefault: 0,
  receiverName: 'Receiver',
  phoneCountryCode: '+86',
  phoneNumber: '18698767898',
  email: '1223@email.com',
  country: 'China',
  stateProvince: 'Beijing',
  city: 'Beijing',
  district: 'Xicheng District',
  streetAddress: 'Guangyang Road Community Committee',
  postalCode: '082977'
})

// Form validation rules
const rules = reactive({
  receiverName: [
    { required: true, message: 'Please enter receiver name', trigger: 'blur' }
  ],
  phoneCountryCode: [
    { required: true, message: 'Please enter country code', trigger: 'blur' }
  ],
  phoneNumber: [
    { required: true, message: 'Please enter phone number', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: 'Please enter valid phone number', trigger: 'blur' }
  ],
  country: [
    { required: true, message: 'Please enter country', trigger: 'blur' }
  ],
  stateProvince: [
    { required: true, message: 'Please enter state/province', trigger: 'blur' }
  ],
  city: [
    { required: true, message: 'Please enter city', trigger: 'blur' }
  ],
  streetAddress: [
    { required: true, message: 'Please enter detailed address', trigger: 'blur' }
  ]
})

// Form reference
const dataForm = ref(null)

// Submit form
const submitForm = async () => {
  if (!dataForm.value) return

  try {
    const valid = await dataForm.value.validate()
    if (!valid) return

    loading.value = true

    // Construct request data - corresponds to UserAddressCreateDTO
    const requestData = {
      userId: userId,
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

    console.log('Submitted address data:', requestData)

    // Call backend API - using /add endpoint
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
      throw new Error(result.message || 'Failed to add address')
    }

    if (result.code && result.code !== 200) {
      throw new Error(result.message || 'Failed to add address')
    }

    ElMessage.success('Address added successfully')
    emit('success') // Notify parent component to close dialog and refresh list
  } catch (error) {
    console.error('Add address error:', error)
    ElMessage.error(`Add failed: ${error.message}`)
  } finally {
    loading.value = false
  }
}

// Reset form
const resetForm = () => {
  if (dataForm.value) {
    dataForm.value.resetFields()
    // Reset default values
    formData.phoneCountryCode = '+86'
    formData.country = 'China'
    formData.isDefault = 0
  }
}
</script>

<style scoped>
.create-container {
  min-height: 100vh;
  background-color: #0f172a;
  padding: 30px;
}

.create-card {
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px 24px 0;
}

.user-form {
  padding: 0 24px 24px;
}

.el-form-item {
  margin-bottom: 22px;
}

/* Form label styling */
:deep(.el-form-item__label) {
  color: #e2e8f0 !important;
  font-weight: 500;
}

/* Input field styling */
:deep(.el-input__inner) {
  background-color: rgba(15, 23, 42, 0.5) !important;
  border: 1px solid rgba(148, 163, 184, 0.3) !important;
  color: #e2e8f0 !important;
}

:deep(.el-input__inner:focus) {
  border-color: #3b82f6 !important;
}

:deep(.el-textarea__inner) {
  background-color: rgba(15, 23, 42, 0.5) !important;
  border: 1px solid rgba(148, 163, 184, 0.3) !important;
  color: #e2e8f0 !important;
}

:deep(.el-textarea__inner:focus) {
  border-color: #3b82f6 !important;
}

/* Radio button styling */
:deep(.el-radio__label) {
  color: #e2e8f0 !important;
}

/* Button styling */
:deep(.el-button) {
  border-radius: 6px;
  transition: all 0.3s ease;
}

:deep(.el-button--primary) {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

:deep(.el-button--primary:hover) {
  background-color: #2563eb;
  border-color: #2563eb;
}

:deep(.el-button--info) {
  background-color: rgba(30, 41, 59, 0.8);
  border-color: rgba(148, 163, 184, 0.3);
  color: #e2e8f0;
}

:deep(.el-button--info:hover) {
  background-color: rgba(30, 41, 59, 1);
  border-color: #3b82f6;
}

/* Responsive design */
@media (max-width: 768px) {
  .create-container {
    padding: 15px;
  }

  .user-form {
    padding: 0 16px 16px;
  }

  .page-header {
    padding: 16px 16px 0;
  }
}
</style>