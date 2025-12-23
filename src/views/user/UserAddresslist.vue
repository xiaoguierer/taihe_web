<template>
  <div class="management-container">
    <el-card class="management-card">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">Address Management</h1>
        <p class="page-subtitle">Manage your shipping addresses</p>
      </div>

      <!-- Action Buttons Area -->
      <div class="card-header">
        <div class="header-actions">
          <el-tooltip content="Back" placement="top">
            <el-button size="small" @click="goBack" :icon="ArrowLeft" circle />
          </el-tooltip>
          <el-tooltip content="Add Address" placement="top">
            <el-button size="small" type="primary" @click="showAddDialog" :icon="Plus" circle />
          </el-tooltip>
        </div>
      </div>

      <!-- Table Main Body -->
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
            empty-text="No data available"
        >
          <!-- Selection Column -->
          <el-table-column type="selection" align="center" width="50"/>
          <el-table-column prop="isDefault" label="Default Address" min-width="130">
            <template #header>
              <span class="column-header">Default Address</span>
            </template>
            <template #default="{ row }" >
              <el-tag :type="row.isDefault === 0 ? 'success' : 'info'" effect="plain">
                {{ row.isDefault === 0 ? 'Yes' : 'No' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="addressName" label="Address Info" min-width="100">
            <template #header>
              <span class="column-header">Address</span>
            </template>
            <template #default="{ row }">
              <div class="text-content">{{ row.addressName }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="phoneNumber" label="Phone" min-width="150">
            <template #header>
              <span class="column-header">Phone</span>
            </template>
            <template #default="{ row }">
              <div class="text-content">{{ row.phoneCountryCode }} {{ row.phoneNumber }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="postalCode" label="Postal Code" min-width="150">
            <template #header>
              <span class="column-header">Postal Code</span>
            </template>
            <template #default="{ row }">
              <div class="text-content">{{ row.postalCode }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="detailedAddress" label="Detailed Address" min-width="250">
            <template #header>
              <span class="column-header">Detailed Address</span>
            </template>
            <template #default="{ row }">
              <div class="text-content">{{ row.streetAddress }}/{{ row.district }}/{{ row.city }}/{{ row.stateProvince }}/{{ row.country }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="email" label="Email" min-width="150">
            <template #header>
              <span class="column-header">Email</span>
            </template>
            <template #default="{ row }">
              <div class="text-content">{{ row.email }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="updatedTime" label="Created Time" min-width="200">
            <template #header>
              <span class="column-header">Created Time</span>
            </template>
            <template #default="{ row }">
              <div class="text-content">{{ formatDate(row.updatedTime) }}</div>
            </template>
          </el-table-column>

          <!-- Actions Column -->
          <el-table-column label="Actions" width="240" fixed="right" align="center">
            <template #header>
              <span class="column-header">Actions</span>
            </template>
            <template #default="{ row }">
              <div class="action-buttons">
                <el-tooltip content="Edit" placement="top">
                  <el-button size="small" type="primary" @click="handleEdit(row)" circle>
                    <el-icon><Edit /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="Delete" placement="top">
                  <el-button size="small" type="danger" @click="handleDelete(row)" circle>
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- Error Alert -->
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

    <!-- Add Address Dialog -->
    <div v-if="isMounted">
      <el-dialog
          v-model="dialogVisible"
          title="Add New Address"
          width="50%"
          :close-on-click-modal="false"
      >
        <addCreate v-if="dialogVisible" @close="handleCloseDialog" @success="handleCreateSuccess"/>
      </el-dialog>
    </div>

    <!-- Edit Address Dialog -->
    <el-dialog
        v-model="editDialogVisible"
        :title="`Edit Address`"
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
// Import specific functions and methods
import {ref, onMounted} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {debounce} from 'lodash-es'
import {Plus, Edit, Delete, ArrowLeft } from '@element-plus/icons-vue'
// Data modification
import objEdit from './UserAddressEdit.vue'
import {useRouter} from 'vue-router'
// Add start ---------------------
import addCreate from './UserAddressCreate.vue'
const router = useRouter()
import { useAuthStore } from '@/store/auth'
const authStore = useAuthStore()
const userId = authStore.userInfo?.userId
const token = authStore.token //

// Reactive data
const datalist = ref([])
const loading = ref(false)
const errorMessage = ref('')
const formatDate = (dateString) => {
  if (!dateString) return 'None'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid date'
    return date.toLocaleString('en-US', {
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

// Get user data list page
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
    if (!response.ok) throw new Error(`Request failed: ${response.status}`)
    const result = await response.json()
    // Modification: Use code field to determine success, not success field
    if (result.code !== 200) throw new Error(result.message || 'Failed to get data')
    if (!result.data) throw new Error('Data is empty')
    datalist.value = result.data
  } catch (error) {
    console.error('Failed to get data:', error)
    ElMessage.error(error.message)
    datalist.value = []
  } finally {
    loading.value = false
  }
}, 300)

// Reactive data - added after original data
const editDialogVisible = ref(false)
const editingDataId = ref('')
const editingData = ref(null)

// Edit user
const handleEdit = async (row) => {
  try {
    if (!row?.id) {
      throw new Error('Invalid row data, missing ID')
    }
    editingDataId.value = row.id
    editingData.value = row
    editDialogVisible.value = true
    ElMessage.info(`Loading data information...`)
  } catch (error) {
    console.error('Failed to open edit dialog:', error)
    ElMessage.error('Failed to open edit page')
  }
}

// Close edit dialog
const handleCloseEditDialog = () => {
  editDialogVisible.value = false
  editingDataId.value = null
  editingData.value = null
}

// Edit success handling
const handleEditSuccess = () => {
  handleCloseEditDialog()
  fetchDataList() // Refresh user list
  ElMessage.success('User information updated successfully')
}

// Delete
const handleDelete = async (row) => {
  if (row.isDefault === 0) {
    ElMessage.info('Default address cannot be deleted')
    return
  }
  try {
    await ElMessageBox.confirm(`Are you sure you want to delete this address?`, 'Delete Confirmation', {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning'
    })

    // Use path parameters directly, remove URLSearchParams
    const response = await fetch(`/api/user-address/del/${row.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      }
    })
    console.log("Delete response:", response)
    if (!response.ok) throw new Error('Request failed')

    const result = await response.json()
    console.log("Delete response result:", result)
    if (result.code === 200) {
      ElMessage.success('Delete successful')
      fetchDataList()
    } else {
      throw new Error(result.message || 'Delete failed')
    }
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      ElMessage.error(error.message || 'Delete failed')
    }
  }
}

const isMounted = ref(false) // New state control

onMounted(() => {
  isMounted.value = true
  fetchDataList()
})

const dialogVisible = ref(false)
const showAddDialog = () => {
  dialogVisible.value = true
}

const goBack = () => {
  router.push(`/UserCenter`)// Navigate via route path
}

// Add dialog close handling method
const handleCloseDialog = () => {
  dialogVisible.value = false
}

// Add create success handling method
const handleCreateSuccess = () => {
  dialogVisible.value = false
  fetchDataList() // Refresh user list
  ElMessage.success('Address created successfully')
}
// Add end---------------------
</script>

<style scoped>
.management-container {
  min-height: 100vh;
  background-color: #0f172a;
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

.management-card {
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.card-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 24px 20px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.table-wrapper {
  padding: 0 24px 24px;
}

/* Table style optimization */
:deep(.el-table) {
  background: transparent;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table th) {
  background: rgba(15, 23, 42, 0.8) !important;
  color: #e2e8f0 !important;
  font-weight: 600;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

:deep(.el-table td) {
  background: rgba(30, 41, 59, 0.4) !important;
  color: #e2e8f0 !important;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background: rgba(30, 41, 59, 0.6) !important;
}

:deep(.el-table__row:hover td) {
  background: rgba(30, 41, 59, 0.8) !important;
}

.text-content {
  color: #000;         /* 黑色 */
  font-weight: 700;    /* 粗体 */
}

.column-header {
  color: #e2e8f0;
  font-weight: 600;
}

/* Tag style optimization */
:deep(.el-tag) {
  border: none;
  border-radius: 6px;
  font-weight: 500;
}

:deep(.el-tag--success) {
  background: rgba(72, 187, 120, 0.2);
  color: #48bb78;
  border: 1px solid rgba(72, 187, 120, 0.3);
}

:deep(.el-tag--info) {
  background: rgba(148, 163, 184, 0.2);
  color: #94a3b8;
  border: 1px solid rgba(148, 163, 184, 0.3);
}

/* Button style optimization */
.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

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

:deep(.el-button--danger) {
  background-color: #ef4444;
  border-color: #ef4444;
}

:deep(.el-button--danger:hover) {
  background-color: #dc2626;
  border-color: #dc2626;
}

/* Error alert */
.error-alert {
  margin-top: 16px;
}

/* Loading state optimization */
:deep(.el-loading-mask) {
  background-color: rgba(15, 23, 42, 0.8);
}

/* Responsive design */
@media (max-width: 768px) {
  .management-container {
    padding: 15px;
  }

  .page-header {
    margin-top: 30px;
  }

  .table-wrapper {
    padding: 0 16px 16px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }
}
</style>