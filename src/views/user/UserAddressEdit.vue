<template>
  <div class="address-dialog">
    <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        class="address-form"
    >
      <!-- 地址基本信息 -->
      <el-form-item label="地址ID" prop="id">
        <el-input v-model="formData.id" disabled placeholder="系统自动生成"/>
      </el-form-item>

      <el-form-item label="地址名称" prop="addressName">
        <el-input
            v-model="formData.addressName"
            placeholder="请输入地址名称（如：家、公司）"
            maxlength="50"
            show-word-limit
        />
      </el-form-item>

      <el-form-item label="是否默认地址" prop="isDefault">
        <el-radio-group v-model="formData.isDefault">
          <el-radio :value="0">是</el-radio>
          <el-radio :value="1">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="收货人姓名" prop="receiverName">
        <el-input
            v-model="formData.receiverName"
            placeholder="请输入收货人姓名"
            maxlength="100"
            show-word-limit
        />
      </el-form-item>

      <!-- 联系方式 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="国际区号" prop="phoneCountryCode">
            <el-input
                v-model="formData.phoneCountryCode"
                placeholder="如：+86"
                maxlength="10"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phoneNumber">
            <el-input
                v-model="formData.phoneNumber"
                placeholder="请输入手机号码"
                maxlength="50"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="邮箱地址" prop="email">
        <el-input
            v-model="formData.email"
            placeholder="请输入邮箱地址"
            maxlength="100"
        />
      </el-form-item>

      <!-- 地址信息 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="国家" prop="country">
            <el-input
                v-model="formData.country"
                placeholder="请输入国家"
                maxlength="100"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="省/州" prop="stateProvince">
            <el-input
                v-model="formData.stateProvince"
                placeholder="请输入省/州"
                maxlength="100"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="城市" prop="city">
            <el-input
                v-model="formData.city"
                placeholder="请输入城市"
                maxlength="100"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="区/县" prop="district">
            <el-input
                v-model="formData.district"
                placeholder="请输入区/县"
                maxlength="100"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="详细地址" prop="streetAddress">
        <el-input
            v-model="formData.streetAddress"
            type="textarea"
            :rows="3"
            placeholder="请输入详细地址"
            maxlength="500"
            show-word-limit
        />
      </el-form-item>

      <el-form-item label="邮编" prop="postalCode">
        <el-input
            v-model="formData.postalCode"
            placeholder="请输入邮编"
            maxlength="20"
        />
      </el-form-item>
      <!-- 操作按钮 -->
      <el-form-item class="form-actions">
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          {{ loading ? '保存中...' : '保存' }}
        </el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted,watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/store/auth'
const authStore = useAuthStore()
const token = authStore.token

// Emits
const emit = defineEmits(['close', 'success'])

// 响应式数据
const formRef = ref()
const loading = ref(false)

// 表单数据
const formData = reactive({
  id: '',
  addressName: '',
  isDefault: 0,
  receiverName: '',
  phoneCountryCode: '+86',
  phoneNumber: '',
  email: '',
  country: '中国',
  stateProvince: '',
  city: '',
  district: '',
  streetAddress: '',
  postalCode: ''
})

// 表单验证规则
const formRules = {
  id: [
    { required: true, message: '地址ID不能为空', trigger: 'blur' },
    { max: 50, message: '地址ID长度不能超过50个字符', trigger: 'blur' }
  ],
  isDefault: [
    { required: true, message: '请选择是否默认地址', trigger: 'change' }
  ],
  receiverName: [
    { required: true, message: '请输入收货人姓名', trigger: 'blur' },
    { max: 100, message: '收货人姓名长度不能超过100个字符', trigger: 'blur' }
  ],
  phoneCountryCode: [
    { required: true, message: '请输入国际区号', trigger: 'blur' },
    { max: 10, message: '国际区号长度不能超过10个字符', trigger: 'blur' }
  ],
  phoneNumber: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    {
      pattern: /^[0-9+\-\s()]{7,20}$/,
      message: '手机号码格式不正确',
      trigger: 'blur'
    },
    { max: 50, message: '手机号码长度不能超过50个字符', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
    { max: 100, message: '邮箱地址长度不能超过100个字符', trigger: 'blur' }
  ],
  country: [
    { required: true, message: '请输入国家', trigger: 'blur' },
    { max: 100, message: '国家长度不能超过100个字符', trigger: 'blur' }
  ],
  stateProvince: [
    { required: true, message: '请输入省/州', trigger: 'blur' },
    { max: 100, message: '省/州长度不能超过100个字符', trigger: 'blur' }
  ],
  city: [
    { required: true, message: '请输入城市', trigger: 'blur' },
    { max: 100, message: '城市长度不能超过100个字符', trigger: 'blur' }
  ],
  district: [
    { max: 100, message: '区/县长度不能超过100个字符', trigger: 'blur' }
  ],
  streetAddress: [
    { required: true, message: '请输入详细地址', trigger: 'blur' },
    { max: 500, message: '详细地址长度不能超过500个字符', trigger: 'blur' }
  ],
  postalCode: [
    { max: 20, message: '邮编长度不能超过20个字符', trigger: 'blur' }
  ]
}

// 获取地址详情（如果需要编辑现有地址）
const fetchAddressDetail = async (addressId) => {
  try {
    loading.value = true
    const response = await fetch(`/api/user-address/getById/${addressId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      }
    })
    if (!response.ok) {
      throw new Error(`请求失败，状态码: ${response.status}`)
    }
    console.log("response data is :",response)
    const result = await response.json()
    if (result.code === 200) {
      console.log("result data is :",result)
      Object.assign(formData, result.data)
      ElMessage.success('地址数据加载成功')
    } else {
      throw new Error(result.message || '获取地址信息失败')
    }
  } catch (error) {
    console.error('获取地址详情失败:', error)
    ElMessage.error('获取地址信息失败: ' + error.message)
    emit('close')
  } finally {
    loading.value = false
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    // 表单验证
    await formRef.value.validate()
    loading.value = true

    // 调用更新接口
    const response = await fetch(`/api/user-address/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(formData)
    })
    console.log("提交数据响应response：",response)
    if (!response.ok) {
      throw new Error(`HTTP错误! 状态码: ${response.status}`)
    }
    const result = await response.json()
    console.log("提交数据响应 result：",result)
    if (result.code === 200) {
      ElMessage.success('地址更新成功')
      emit('success')
      // router.push('/address/list')
    } else {
      throw new Error(result.message || '更新失败')
    }
  } catch (error) {
    console.error('更新地址失败:', error)
    ElMessage.error('更新失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

// 取消操作
const handleCancel = () => {
  emit('close')
}

// 组件挂载时加载数据（如果是编辑模式）
onMounted(() => {
  console.log("接收到的dataId:", props.dataId)
  if (props.dataId) {
    fetchAddressDetail(props.dataId)
  }
})

// 正确定义 props
const props = defineProps({
  dataId: { // 修改属性名以匹配父组件的传递
    type: String,
    default: ''
  }
})

// 监听addressId变化
watch(() => props.dataId, (newVal) => {
  if (newVal) {
    fetchAddressDetail(newVal)
  }
})
</script>

<style scoped>
.address-dialog {
  padding: 20px;
}

.address-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-actions {
  margin-top: 30px;
  text-align: center;
}

.form-actions .el-button {
  min-width: 100px;
  margin: 0 10px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input.is-disabled .el-input__inner) {
  background-color: #f5f7fa;
  color: #909399;
}

.el-row {
  margin-bottom: 0;
}

.el-col {
  margin-bottom: 0;
}
</style>