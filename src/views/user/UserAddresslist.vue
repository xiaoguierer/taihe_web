<template>
  <div class="management-container">
    <el-card class="management-card">
      <!-- 操作按钮区域 - 放在表格外部 -->
      <div class="card-header">
        <div class="header-content">
          <h2 class="page-title">用户地址管理</h2>
        </div>
        <div class="header-actions">
          <!-- 返回按钮 -->
          <el-tooltip content="返回" placement="top">
            <el-button
                size="small"
                @click="goBack"
                :icon="ArrowLeft"
                circle
            >
            </el-button>
          </el-tooltip>
          <!-- 新增按钮放在这里 -->
          <el-tooltip content="新增地址" placement="top">
            <el-button
                size="small"
                type="primary"
                @click="showAddDialog"
                :icon="Plus"
                circle
            >
            </el-button>
          </el-tooltip>
        </div>
      </div>
      <!-- 表格主体 -->
      <div class="table-wrapper">
        <el-table
            :data="datalist"
            style="width: 100%"
            :fit="true"
            v-loading="loading"
            stripe
            border
            row-key="id"
            :default-sort="{ prop: 'id', order: 'descending' }"
            empty-text="暂无数据"
        >
          <!-- 选择列 -->
          <el-table-column type="selection" align="center" width="50"/>
          <!-- 基本信息列 -->
          <el-table-column prop="id" label="ID" width="100" align="center" sortable>
            <template #header>
              <span class="column-header">ID</span>
            </template>
          </el-table-column>

          <el-table-column prop="isDefault" label="默认地址" min-width="130">
            <template #header>
              <span class="column-header">是否默认地址</span>
            </template>
            <template #default="{ row }">
              <el-tag
                  :type="row.isDefault === 0 ? 'success' : 'info'"
                  effect="plain"
              >
                {{ row.isDefault === 0 ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="addressName" label="地址信息" min-width="100">
            <template #header>
              <span class="column-header">地址</span>
            </template>
            <template #default="{ row }">
              <el-tag effect="plain" type="info">
                {{ row.addressName }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="phoneNumber" label="电话" min-width="150">
            <template #header>
              <span class="column-header">电话</span>
            </template>
            <template #default="{ row }">
              <el-tag effect="plain" type="info">
                {{ row.phoneCountryCode }} {{ row.phoneNumber }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="postalCode" label="邮编" min-width="150">
            <template #header>
              <span class="column-header">邮编</span>
            </template>
            <template #default="{ row }">
              <el-tag effect="plain" type="info">
                {{ row.postalCode }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="postalCode" label="详细地址" min-width="250">
            <template #header>
              <span class="column-header">详细地址</span>
            </template>
            <template #default="{ row }">
              <el-tag effect="plain" type="info">
                {{ row.streetAddress }}/ {{ row.district }}/{{ row.city }}/{{ row.stateProvince }}/{{ row.country }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="email" label="邮箱" min-width="150">
            <template #header>
              <span class="column-header">邮箱</span>
            </template>
            <template #default="{ row }">
              <el-tag effect="plain" type="info">
                {{ row.email }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="updatedTime" label="创建时间" min-width="200">
            <template #header>
              <span class="column-header">创建时间</span>
            </template>
            <template #default="{ row }">
              <el-tag effect="plain" type="info">
                {{ row.updatedTime }}
              </el-tag>
            </template>
          </el-table-column>


          <!-- 操作列 -->
          <el-table-column label="操作" width="240" fixed="right" align="center">
            <template #header>
              <span class="column-header">操作</span>
            </template>

            <template #default="{ row }">
              <div class="action-buttons">
                <el-tooltip content="编辑" placement="top">
                  <el-button size="small" type="primary" @click="handleEdit(row)" circle>
                    <el-icon>
                      <Edit/>
                    </el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <el-button size="small" type="danger" @click="handleDelete(row)" circle>
                    <el-icon>
                      <Delete/>
                    </el-icon>
                  </el-button>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 错误提示 -->
        <el-alert
            v-if="errorMessage"
            :title="errorMessage"
            type="error"
            show-icon
            closable
            @close="errorMessage = ''"
            class="error-alert"
        />

      </div>
    </el-card>
    <!-- 添加用户对话框 -->
    <div v-if="isMounted">
      <el-dialog
          v-model="dialogVisible"
          title="新增数据"
          width="50%"
          :close-on-click-modal="false"
      >
        <addCreate v-if="dialogVisible" @close="handleCloseDialog" @success="handleCreateSuccess"/>
      </el-dialog>
    </div>
    <!-- 编辑用户对话框  高级用法  自定义关闭逻辑-->
    <el-dialog
        v-model="editDialogVisible"
        :title="`编辑数据 `"
        width="50%"
        :close-on-click-modal="false"
        destroy-on-close
    >
      <objEdit
          v-if="editDialogVisible && editingDataId"
          :dataId="editingDataId"
          @close="handleCloseEditDialog"
          @success="handleEditSuccess"
      />
    </el-dialog>
  </div>
</template>

<script setup>
// 导入特定的功能和方法
import {ref, onMounted, reactive} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {debounce} from 'lodash-es'
import {Plus, Edit, Delete, ArrowLeft } from '@element-plus/icons-vue'
// 修改数据
import objEdit from './UserAddressEdit.vue'
import {useRouter} from 'vue-router'
// 新增开始 ---------------------
import addCreate from './UserAddressCreate.vue'
const router = useRouter()
import { useAuthStore } from '@/store/auth'
const authStore = useAuthStore()
const userId = authStore.userInfo?.userId
const token = authStore.token //
// 响应式数据
const datalist = ref([])
const loading = ref(false)
const errorMessage = ref('')
const formatDate = (dateString) => {
  if (!dateString) return '无'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '无效日期'
    return date.toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(/\//g, '-')
  } catch {
    return dateString
  }
}

// 获取用户数据列表页
const fetchDataList = debounce(async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    const response = await fetch(`/api/user-address/getByUserId/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      }
    })
    if (!response.ok) throw new Error(`请求失败: ${response.status}`)
    const result = await response.json()
    // 修改：使用 code 字段判断成功，而不是 success 字段
    if (result.code !== 200) throw new Error(result.message || '获取数据失败')
    if (!result.data) throw new Error('数据为空')
    datalist.value = result.data
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error(error.message)
    datalist.value = []
  } finally {
    loading.value = false
  }
}, 300)
// 响应式数据 - 在原有数据后添加
const editDialogVisible = ref(false)
const editingDataId = ref('')
const editingData = ref(null)
// 编辑用户
const handleEdit = async (row) => {
  try {
    if (!row?.id) {
      throw new Error('无效的行数据，缺少 ID')
    }
    editingDataId.value = row.id
    editingData.value = row
    editDialogVisible.value = true
    ElMessage.info(`正在加载数据信息...`)
  } catch (error) {
    console.error('打开编辑对话框失败:', error)
    ElMessage.error('打开编辑页面失败')
  }
}
// 关闭编辑对话框
const handleCloseEditDialog = () => {
  editDialogVisible.value = false
  editingDataId.value = null
  editingData.value = null
}
// 编辑成功处理
const handleEditSuccess = () => {
  handleCloseEditDialog()
  fetchDataList() // 刷新用户列表
  ElMessage.success('用户信息更新成功')
}

// 删除
const handleDelete = async (row) => {
  if (row.isDefault === 0) {
    ElMessage.info('默认地址不能删除')
    return
  }
  try {
    await ElMessageBox.confirm(`确定要删除地址吗?`, '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 直接使用路径参数，去掉URLSearchParams
    const response = await fetch(`/api/user-address/del/${row.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      }
    })
    console.log("删除  响应  response ：",response)
    if (!response.ok) throw new Error('请求失败')

    const result = await response.json()
    console.log("删除  响应  result ：",result)
    if (result.code === 200) {
      ElMessage.success('删除成功')
      fetchDataList()
    } else {
      throw new Error(result.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

const isMounted = ref(false) // 新增状态控制

onMounted(() => {
  isMounted.value = true
  fetchDataList()
})
const dialogVisible = ref(false)
const showAddDialog = () => {
  dialogVisible.value = true
}
const goBack = () => {
  router.push(`/UserCenter`)// 通过路由路径导航
}
// 新增对话框关闭处理方法
const handleCloseDialog = () => {
  dialogVisible.value = false
}
// 新增创建成功处理方法
const handleCreateSuccess = () => {
  dialogVisible.value = false
  fetchDataList() // 刷新用户列表
  ElMessage.success('用户创建成功')
}
// 新增结束---------------------
// 快速查看和详情
const handleQuickView = (row) => {
  ElMessage.success('信息查看成功')
}
const handleDetail = (row) => {
  ElMessage.success('详情成功')
}
</script>

<style scoped>
.management-container {
  padding: 100px;
  background-color: #f5f7fa;
  min-height: 100vh;
  box-sizing: border-box;
}

.management-card {
  border-radius: 0;
  box-shadow: none;
  border: none;
  min-height: calc(100vh - 60px);
  transition: margin-left 0.3s ease;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  margin-bottom: 0;
  border-bottom: 1px solid #e6e6e6;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
  text-align: center;
  display: block !important;
  width: 100%;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  right: 24px;
}

.add-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
  border-radius: 6px;
  font-weight: 500;
  padding: 8px 16px;
  height: 32px;
}

.add-btn:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.refresh-btn {
  background: #3b82f6;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
}

.refresh-btn:hover {
  background: #2563eb;
  transform: rotate(90deg);
  transition: transform 0.3s ease;
}

.table-wrapper {
  padding: 20px;
  overflow-x: auto;
  background: #fff;
  margin: 0;
}

/* 表格自适应样式 */
:deep(.el-table) {
  width: 100% !important;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table__body),
:deep(.el-table__header) {
  width: 100% !important;
}

:deep(.el-table th) {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9) !important;
  color: #374151;
  font-weight: 600;
  font-size: 14px;
  padding: 12px 8px;
  border-bottom: 2px solid #e5e7eb;
}

:deep(.el-table td) {
  padding: 12px 8px;
  border-bottom: 1px solid #f3f4f6;
  color: #6b7280;
  font-size: 14px;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: #fafbfc;
}

:deep(.el-table__row:hover td) {
  background-color: #f8fafc !important;
}

/* 状态标签优化 */
:deep(.el-tag) {
  border: none;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  min-width: 60px;
  text-align: center;
}

:deep(.el-tag--success) {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

:deep(.el-tag--danger) {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

/* 操作按钮优化 */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}

:deep(.el-button--small) {
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

:deep(.el-button--primary) {
  background: #3b82f6;
  border-color: #3b82f6;
}

:deep(.el-button--danger) {
  background: #ef4444;
  border-color: #ef4444;
}

/* 分页居中 */
:deep(.el-pagination) {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

:deep(.el-pagination .btn-prev),
:deep(.el-pagination .btn-next),
:deep(.el-pagination .number) {
  border-radius: 6px;
  border: 1px solid #d1d5db;
  margin: 0 2px;
}

:deep(.el-pagination .active) {
  background: #3b82f6;
  border-color: #3b82f6;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .management-card {
    margin-left: 180px;
  }

  .table-wrapper {
    padding: 16px;
  }
}

@media (max-width: 992px) {
  .management-card {
    margin-left: 0;
    min-height: 100vh;
  }

  .card-header {
    flex-direction: column;
    gap: 12px;
    padding: 16px;
  }

  .header-content {
    order: 1;
    width: 100%;
  }

  .header-actions {
    position: static;
    order: 2;
    justify-content: center;
    width: 100%;
  }

  .page-title {
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .table-wrapper {
    padding: 12px;
  }

  :deep(.el-table) {
    font-size: 12px;
  }

  :deep(.el-table th),
  :deep(.el-table td) {
    padding: 8px 4px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }

  :deep(.el-button--small) {
    padding: 4px;
    min-width: 28px;
    height: 28px;
  }
}

@media (max-width: 480px) {
  .card-header {
    padding: 12px;
  }

  .header-actions {
    flex-direction: column;
    gap: 8px;
  }

  .add-btn {
    width: 100%;
    justify-content: center;
  }

  :deep(.el-pagination) {
    flex-wrap: wrap;
    gap: 8px;
  }
}

/* 滚动条优化 */
.table-wrapper::-webkit-scrollbar {
  height: 6px;
}

.table-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.table-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.table-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 加载状态优化 */
:deep(.el-loading-mask) {
  background-color: rgba(255, 255, 255, 0.8);
}
</style>
