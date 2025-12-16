<template>
  <div class="edit-dialog">
    <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        class="edit-form"
    >
      <!-- 基本信息 -->
      <el-form-item label="用户ID" prop="id">
        <el-input v-model="formData.id" disabled placeholder="系统自动生成"/>
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" disabled placeholder="邮箱不可修改"/>
      </el-form-item>

      <el-form-item label="昵称" prop="nickname">
        <el-input
            v-model="formData.nickname"
            placeholder="请输入用户昵称"
            maxlength="20"
            show-word-limit
        />
      </el-form-item>

      <el-form-item label="出生时间" prop="birthdaytime">
        <el-date-picker
            v-model="formData.birthdaytime"
            type="datetime"
            placeholder="Select date and time"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="头像图" prop="avatar">
        <el-image
            style="width: 100px; height: 100px"
            :src="formData.avatar"
            :preview-src-list="formData.avatar ? [formData.avatar] : []"
            fit="cover"
            hide-on-click-modal
        >
          <template #error>
            <div class="image-slot">
              <span>暂无头像</span>
            </div>
          </template>
        </el-image>

        <el-upload
            v-model:file-list="fileList"
            class="upload-demo"
            :auto-upload="false"
            :on-change="handleFileChange"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :limit="1"
            :multiple="false"
            :on-exceed="handleExceed"
        >
          <el-button type="primary">Click to upload</el-button>
          <template #tip>
            <div class="el-upload__tip">
              jpg/png files with a size less than 500KB.
            </div>
          </template>
        </el-upload>
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
import {ref, reactive, onMounted} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import { useAuthStore } from '@/store/auth'
import {useRouter} from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const userId = authStore.userInfo?.userId
const token = authStore.token //

// Emits
const emit = defineEmits(['close', 'success'])
// 响应式数据
const formRef = ref()
const loading = ref(false)
const selectedFile = ref(null)  // ✅ 正确
const fileList = ref([])
const handleRemove = (file, uploadFiles) => {
  selectedFile.value = null
  fileList.value = [] // 清空文件列表
  console.log(file, uploadFiles)
}
// 文件选择变化处理
const handleFileChange = (file, fileList) => {
  if (fileList.length > 0) {
    selectedFile.value = file.raw // 保存原始文件对象
    formData.avatar = URL.createObjectURL(file.raw)
  } else {
    selectedFile.value = null
  }
}
const handlePreview = (uploadFile) => {
  console.log(uploadFile)
}

const handleExceed = (files, uploadFiles) => {
  ElMessage.warning(
      `The limit is 1, you selected ${files.length} files this time, add up to ${
          files.length + uploadFiles.length
      } totally`
  )
}

const beforeRemove = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(
      `Cancel the transfer of ${uploadFile.name} ?`
  ).then(
      () => true,
      () => false
  )
}
const formData = reactive({
  id: null,
  email: '',
  nickname: '',
  avatar: '',
  birthdaytime: null,
  status: 1
})
// 表单验证规则
const formRules = {
  nickname: [
    {required: true, message: '请输入昵称', trigger: 'blur'},
    {min: 2, max: 20, message: '昵称长度2-20个字符', trigger: 'blur'}
  ]
}
// 获取用户详情
const fetchDataDetail = async () => {
  try {
    loading.value = true
    const response = await fetch(`/api/users/getuserinfor/${userId}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error(`HTTP错误! 状态码: ${response.status}`)
    }
    const result = await response.json()
    // 根据实际结构判断：使用 code === 200 而不是 success 字段
    if (result.code === 200 && result.data) {
      Object.assign(formData, result.data)
      ElMessage.success(result.message || '用户数据加载成功')
    } else {
      throw new Error(result.message || '获取用户信息失败')
    }
  } catch (error) {
    console.error('获取用户详情失败:', error)
    ElMessage.error('获取信息失败: ' + error.message)
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
    // 创建 FormData 对象
    const formDataToSend = new FormData()
    // 添加普通字段
    formDataToSend.append('email', formData.email)
    formDataToSend.append('nickname', formData.nickname)
    formDataToSend.append('avatar', formData.avatar || '')
    formDataToSend.append('status', formData.status.toString())
    //时间
    if (formData.birthdaytime) {
      const date = new Date(formData.birthdaytime)
      const formattedDateTime = formatToLocalDateTime(date)
      formDataToSend.append('birthdaytime', formattedDateTime)
    } else {
      formDataToSend.append('birthdaytime', '')
    }

    // 如果有新选择的文件
    if (selectedFile.value) {
      formDataToSend.append('avatarFile', selectedFile.value)
    }
    // 调用更新接口
    const response = await fetch(`/api/users/${userId}/profile`, {
      method: 'PUT',
      headers:{
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: formDataToSend
    })
    console.log("response：",response)
    if (!response.ok) {
      throw new Error(`HTTP错误! 状态码: ${response.status}`)
    }
    const result = await response.json()
    console.log("result:：",result)
    if (result.success  === true) {
      ElMessage.success('信息更新成功')
      emit('success')
      router.push('/UserCenter')// 通过路由路径导航
    } else {
      throw new Error(result.message || '更新失败')
    }
  } catch (error) {
    console.error('更新数据失败:', error)
    ElMessage.error('更新失败: ' + error.message)
  } finally {
    loading.value = false
  }
}
// 取消编辑
const handleCancel = () => {
  ElMessageBox.confirm('确定要取消编辑吗？未保存的修改将会丢失。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    emit('close')
    router.push('/UserCenter')// 通过路由路径导航
  }).catch(() => {
    // 用户取消操作
  })
}
// 组件挂载时加载数据
onMounted(() => {
  fetchDataDetail()
})
// 日期时间格式化函数
const formatToLocalDateTime = (date) => {
  if (!date) return ''

  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  // 格式：yyyy-MM-dd HH:mm:ss
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
</script>


<style scoped>
.edit-dialog {
  padding-top: 80px;
  padding: 80px;
}

.edit-form {
  max-width: 600px;
  margin: 0 auto;
}

.avatar-preview {
  margin-top: 10px;
}

.avatar-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e4e7ed;
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
</style>
