<template>
  <div class="order-list-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title"> Order Management</h1>
      <p class="page-subtitle">Manage all orders in the system and easily track order status</p>
    </div>

    <!-- 筛选栏 -->
<!--
    <div class="filter-sidebar">
      <div class="filter-row">
        <div class="filter-group">
          <span class="filter-label">Order Status:</span>
          <el-select v-model="filters.status" placeholder=" Choose order status" @change="handleFilterChange">
            <el-option label="All" value=""></el-option>
            <el-option label="Pending Payment" value="1"></el-option>
            <el-option label="Pending Shipment" value="2"></el-option>
            <el-option label="Pending Receipt" value="3"></el-option>
            <el-option label="Completed" value="4"></el-option>
            <el-option label="Closed" value="5"></el-option>
          </el-select>
        </div>

        <div class="search-box">
          <el-input
            v-model="filters.orderSn"
            placeholder="Search order number...."
            clearable
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button icon="Search" @click="handleSearch" />
            </template>
          </el-input>
        </div>
      </div>
    </div>
-->

    <!-- 订单列表 -->
    <div class="order-list-container">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="5" animated />
      </div>

      <!-- 订单列表 -->
      <div v-else-if="orders.length > 0">
        <div v-for="order in orders" :key="order.id" class="order-card">
          <div class="order-header">
            <div class="order-info">
              <span class="order-id">Order Number : {{ order.orderSn }}</span>
              <span class="info-value">Currency & Amount : {{ order.currency }} - ${{ order.totalAmount }}</span>
              <span class="info-value">Product Types : {{ order.spuCount }}</span>
              <span class="info-value">Product Quantity : {{ order.skuCount }}</span>
              <span class="info-value">Order Time : {{ formatDateTime(order.createdTime) }}</span>
            </div>
            <span class="order-status" :class="getStatusClass(order.status)">
              {{ getStatusText(order.status) }}
            </span>
          </div>
<!--
          &lt;!&ndash; 订单详细信息 &ndash;&gt;
          <div class="order-details">
            <div class="detail-item">
              <span class="detail-label">收货电话:</span>
              <span class="detail-value">{{ order.receiverPhone }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">收货地址:</span>
              <span class="detail-value">{{ order.receiverAddress }}</span>
            </div>
          </div>
-->


          <div class="order-footer">
            <div class="order-actions">
              <el-button type="primary" size="small" @click="viewOrderDetail(order.id)">View Details</el-button>
              <el-button type="warning" size="small" v-if="order.status === 1" @click="handlePay(order.id)">Pay Now</el-button>
              <el-button type="danger" size="small" v-if="order.status === 1" @click="handleCancel(order.id)">Cancel Order</el-button>
<!--              <el-button type="success" size="small" v-if="order.status === 3" @click="handleConfirm(order.id)">确认收货</el-button>-->
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">📦📦</div>
        <div class="empty-text">No order data available at the moment</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import router from "@/router/index.js";
import { useAuthStore } from '@/store/auth'
const authStore = useAuthStore()
const userId = authStore.userInfo?.userId
const token = authStore.token //
// 筛选条件
const filters = reactive({
  status: '',
  orderSn: ''
})

// 加载状态
const loading = ref(false)

// 订单数据
const orders = ref([])

// 分页参数（虽然你当前只取第一页，但保留结构以备扩展）
const pagination = reactive({
  currentPage: 1,
  pageSize: 50,
  total: 0
})
const fetchOrders  = async (page = pagination.currentPage, size = pagination.pageSize) => {
  loading.value = true
  try {
    const queryDTO = {
      userId:userId
    }
    const response = await fetch(`/api/order/page?page=${page}&size=${size}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 如果后端需要身份验证，请加上这一行 👇
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(queryDTO)
    })
    const result = await response.json()
    if (result && result.code === 200) {
      const pageData = result.data
      // 赋值
      orders.value = pageData.list || []
      pagination.total = pageData.total || 0
      pagination.currentPage = pageData.pageNum || page
      console.log("🎯 fetchOrders执行完成")
    } else {
      ElMessage.error('获取订单数据失败：' + (result.message || '未知错误'))
    }
  } catch (error) {
    console.error('获取订单数据失败:', error)
    ElMessage.error('获取订单数据失败，请稍后重试')
  }finally {
    loading.value = false
    console.log("🏁 loading设置为false")
  }
}

// 处理筛选条件变化
const handleFilterChange = () => {
  fetchOrders()
}

// 处理搜索
const handleSearch = () => {
  fetchOrders()
}

// 格式化日期时间
const formatDateTime = (dateTime) => {
  if (!dateTime) return '-'
  return new Date(dateTime).toLocaleString('zh-CN')
}

// 获取订单状态文本
const getStatusText = (status) => {
  const statusMap = {
    1: 'Pending Payment',
    2: 'Pending Shipment',
    3: 'Awaiting Delivery',
    4: 'Completed',
    5: 'Closed'
  }
  return statusMap[status] || 'Unknown Status'
}

// 获取订单状态类名
const getStatusClass = (status) => {
  const statusClassMap = {
    1: 'status-pending_payment',
    2: 'status-pending_shipment',
    3: 'status-shipped',
    4: 'status-completed',
    5: 'status-closed'
  }
  return statusClassMap[status] || ''
}

// 查看订单详情
const viewOrderDetail = (orderId) => {
  // 这里应该使用路由跳转
  const url = `/order-item/order/${orderId}`
  router.push(url)// 通过路由路径导航
}

// 处理付款
const handlePay = async (orderId) => {
  try {
    loading.value = true

    // 1. 获取订单详情
    const response = await fetch(`/api/order-item/orderDetail/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 如果后端需要身份验证，请加上这一行 👇
        'Authorization': token ? `Bearer ${token}` : '',
      }
    })
    const result = await response.json()
    console.log("API返回数据:", result)
    if (result.code === 200) {
      const orderItems = result.data || []
      if (orderItems.length === 0) {
        ElMessage.error('订单中没有商品')
        return
      }
      // 从第一个订单项中获取订单基本信息
      const firstItem = orderItems[0]
      // 计算总金额和商品数量
      const totalAmount = orderItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0)
      const skuCount = orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
      const spuCount = new Set(orderItems.map(item => item.spuId)).size
      console.log("计算后的数据:", { totalAmount, skuCount, spuCount })
      // 2. 构建结算数据（与购物车结算数据结构保持一致）
      const checkoutData = {
        userId: userId,
        totalAmount: totalAmount.toFixed(2),
        SkuCount: skuCount,
        SpuCount: spuCount,
        orderId: orderId, // 添加订单ID标记来源
        items: orderItems.map(item => ({
          cartItemId: item.id, // 使用订单项ID
          spuId: item.spuId,
          skuId: item.skuId,
          skumainImageUrl: item.mainImageUrl, // 注意字段名不同
          productNameEn: item.productNameEn,
          skuNameEn: item.skuNameEn,
          unitPrice: (item.unitPrice || 0).toFixed(2),
          quantity: item.quantity,
          subtotal: ((item.unitPrice || 0) * item.quantity).toFixed(2)
        }))
      }
      console.log("构建的结算数据:", checkoutData)
      // 3. 存储到sessionStorage（与购物车流程一致）
      sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData))
      // 4. 跳转到确认页面
      ElMessage.success('跳转到支付确认页面')
      router.push('/orders/OrderConfirmation')
    } else {
      ElMessage.error('获取订单详情失败: ' + (result.message || '未知错误'))
    }
  } catch (error) {
    console.error('支付跳转失败:', error)
    ElMessage.error('系统错误，请重试: ' + error.message)
  } finally {
    loading.value = false
  }
}

// 处理取消订单
const handleCancel = async (orderId) => {
  try {
    await ElMessageBox.confirm('确定要取消此订单吗？', '提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })

    loading.value = true
    // 调用更新订单状态API，状态5表示"已关闭"（取消）
    const response = await fetch(`/api/order/${orderId}/status/5`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      }
    })
    const result = await response.json()
    if (result.code === 200) {
      ElMessage.success('订单已取消')
      await fetchOrders() // 刷新订单列表
    } else {
      ElMessage.error(result.message || '取消订单失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消订单失败:', error)
      ElMessage.error('取消订单失败，请稍后重试')
    }
  } finally {
    loading.value = false
  }
}

// 处理确认收货
const handleConfirm = async (orderId) => {
  try {
    await ElMessageBox.confirm('确认收到商品后，货款将支付给卖家。请确保商品无误后再确认收货。', '确认收货', {
      type: 'warning'
    })

    loading.value = true
    const response = await axios.post(`/api/order/confirm/${orderId}`)

    if (response.data && response.data.success) {
      ElMessage.success('确认收货成功')
      fetchOrders() // 刷新订单列表
    } else {
      ElMessage.error('确认收货失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('确认收货失败:', error)
      ElMessage.error('确认收货失败，请稍后重试')
    }
  } finally {
    loading.value = false
  }
}

// 初始化
onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.order-list-page {
  min-height: 100vh;
  background-color: #0f172a;
  color: #e2e8f0;
  padding: 30px;
}

.page-header {
  margin-bottom: 10px;
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

.filter-sidebar {
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 20px;
  z-index: 100;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-label {
  color: #cbd5e1;
  font-size: 14px;
  white-space: nowrap;
}

.search-box {
  display: flex;
  gap: 10px;
  flex: 1;
  min-width: 300px;
}

.order-list-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.loading-container {
  padding: 20px;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-text {
  font-size: 18px;
  margin-bottom: 15px;
}

.order-card {
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.order-id {
  font-size: 16px;
  font-weight: 600;
  color: #f8fafc;
}

.order-time {
  color: #94a3b8;
  font-size: 14px;
}

.order-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-pending_payment {
  background-color: #fef3c7;
  color: #92400e;
}

.status-pending_shipment {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-shipped {
  background-color: #f0f9ff;
  color: #0369a1;
}

.status-pending_review {
  background-color: #f3e8ff;
  color: #7c3aed;
}

.status-completed {
  background-color: #d1fae5;
  color: #065f46;
}

.status-closed {
  background-color: #f1f5f9;
  color: #475569;
}

/* 订单主要信息一行展示 */
.order-main-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 15px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 8px;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.info-label {
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 5px;
}

.info-value {
  font-size: 16px;
  font-weight: 600;
  color: #f8fafc;
}

/* 订单详细信息 */
.order-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
  padding: 15px;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 8px;
}

.detail-item {
  display: flex;
  align-items: center;
}

.detail-label {
  font-size: 14px;
  color: #94a3b8;
  min-width: 80px;
}

.detail-value {
  font-size: 14px;
  color: #e2e8f0;
}

.order-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
}

.order-actions {
  display: flex;
  gap: 10px;
}

@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    min-width: 100%;
  }

  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .order-main-info {
    flex-direction: column;
    gap: 15px;
  }

  .info-item {
    align-items: flex-start;
    width: 100%;
  }

  .order-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .order-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
