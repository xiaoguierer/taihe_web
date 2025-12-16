<template>
  <div class="order-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">订单详情</h1>
        <div class="order-status-info">
          <span class="status-label">订单状态：</span>
          <span :class="['status-badge', getStatusClass(orderDetail.status)]">
            {{ getStatusText(orderDetail.status) }}
          </span>
        </div>
      </div>
      <el-button type="primary" @click="$router.back()">Return to order list</el-button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 订单详情内容 -->
    <div v-else class="order-content">
      <!-- 订单基本信息 -->
      <div class="order-basic-info">
        <div class="info-card">
          <h3 class="info-title">订单信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">订单编号：</span>
              <span class="info-value">{{ orderDetail.id || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">商品种类：</span>
              <span class="info-value">{{ orderDetail.spuCount || 0 }} 种</span>
            </div>
            <div class="info-item">
              <span class="info-label">商品数量：</span>
              <span class="info-value">{{ orderDetail.skuCount || 0 }} 件</span>
            </div>
            <div class="info-item">
              <span class="info-label">订单时间：</span>
              <span class="info-value">{{ formatDateTime(orderDetail.createdTime) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">订单金额：</span>
              <span class="info-value">${{ (orderDetail.totalAmount || 0).toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- 收货信息 -->
        <div class="info-card">
          <h3 class="info-title">收货信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">收货人：</span>
              <span class="info-value">{{ addressInfo.length > 0 ? addressInfo[0].receiverName : orderDetail.receiverName }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">联系电话：</span>
              <span class="info-value">{{ addressInfo.length > 0 ? addressInfo[0].phoneCountryCode : orderDetail.receiverPhone}}-
                                       {{ addressInfo.length > 0 ? addressInfo[0].phoneNumber : orderDetail.phoneNumber}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">邮编：</span>
              <span class="info-value">{{ addressInfo.length > 0 ? addressInfo[0].postalCode : orderDetail.receiverAddress}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">收货地址：</span>
              <span class="info-value">{{ addressInfo.length > 0 ? addressInfo[0].addressName : orderDetail.receiverAddress }}-
                 | {{ addressInfo.length > 0 ? addressInfo[0].district : orderDetail.district }}
                 | {{ addressInfo.length > 0 ? addressInfo[0].streetAddress : orderDetail.streetAddress }}
                 | {{ addressInfo.length > 0 ? addressInfo[0].city : orderDetail.city }}
                 | {{ addressInfo.length > 0 ? addressInfo[0].stateProvince : orderDetail.stateProvince }}
                 | {{ addressInfo.length > 0 ? addressInfo[0].country : orderDetail.country }}  </span>
            </div>

          </div>
        </div>
      </div>

      <!-- 支付信息 -->
      <div  v-if="paymentInfo.length > 0"  class="info-card">
        <h3 class="info-title">支付信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">支付方式：</span>
            <span class="info-value">{{ paymentInfo[0].paymentMethod}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">支付金额：</span>
            <span class="info-value">${{ (paymentInfo[0].paymentAmount || 0).toFixed(2) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">支付时间：</span>
            <span class="info-value">{{ formatDateTime(paymentInfo[0].paidTime) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">支付状态：</span>
            <span class="info-value">{{ paymentInfo[0].paymentStatus }}</span>
          </div>
        </div>
      </div>

      <!-- 商品明细信息 -->
      <div class="products-section">
        <div class="section-header">
          <h3 class="section-title">商品信息</h3>
        </div>
        <div v-if="orderItems.length > 0" class="products-list">
          <div v-for="item in orderItems" :key="item.id" class="product-item">
            <div class="product-image">
              <!-- 商品图片占位 -->
              <div style="width:80px;height:80px;background:#374151;display:flex;align-items:center;justify-content:center;color:#9CA3AF">图片</div>
            </div>
            <div class="product-info">
              <div class="product-name">{{ item.id }}</div>
              <div class="product-spec">SKU: {{ item.skuId || '-' }}</div>
              <div class="product-price">单价: ¥{{ (item.unitPrice || 0).toFixed(2) }}</div>
            </div>
            <div class="product-quantity">数量: x{{ item.quantity || 0 }}</div>
            <div class="product-subtotal">小计: ¥{{ (item.totalPrice || 0).toFixed(2) }}</div>
            <!-- 退款信息 -->
            <div v-if="item.refundQuantity > 0" class="refund-info">
              <span class="refund-label">已退款：</span>
              <span class="refund-value">{{ item.refundQuantity }}件 / ¥{{ (item.refundAmount || 0).toFixed(2) }}</span>
              <span class="refund-status" :class="getRefundStatusClass(item.refundStatus)">
                {{ getRefundStatusText(item.refundStatus) }}
              </span>
            </div>
          </div>
        </div>
        <div v-else class="empty-products">
          <div class="empty-icon">📦📦</div>
          <div class="empty-text">暂无商品明细信息</div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/store/auth'
const authStore = useAuthStore()
const userId = authStore.userInfo?.userId
const token = authStore.token //

const route = useRoute()
const router = useRouter()
const orderId = route.params.orderId

// 响应式数据
const loading = ref(false)
const orderDetail = ref({})
const orderItems = ref([])
const paymentInfo = ref({})
const addressInfo = ref({})

    // 获取订基本信息
const fetchOrderDetail = async () => {
  try {
    const response = await fetch(`/api/order/getById/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 如果后端需要身份验证，请加上这一行 👇
        'Authorization': token ? `Bearer ${token}` : '',
      }
    })
    const data = await response.json()
    if (data && data.code === 200) {
      orderDetail.value = data.data
      console.log('订单基本信息:', orderDetail.value)
    } else {
      throw new Error(response.data.message || '获取订单信息失败')
    }
  } catch (error) {
    console.error('获取订单信息失败:', error)
    ElMessage.error('获取订单信息失败')
  }
}
// 获取订单明细（商品信息）
const fetchOrderItems = async () => {
  try {
    const response = await fetch(`/api/order-item/order/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 如果后端需要身份验证，请加上这一行 👇
        'Authorization': token ? `Bearer ${token}` : '',
      }
    })
    const data = await response.json()
    if (data && data.code === 200) {
      orderItems.value = data.data || []
      console.log('订单明细:', orderItems.value)
    } else {
      throw new Error(response.data.message || '获取订单明细失败')
    }
  } catch (error) {
    console.error('获取订单明细失败:', error)
    ElMessage.error('获取订单明细失败')
  }
}
// 获取支付信息
const fetchPaymentInfo = async () => {
  try {
    const response = await fetch(`/api/order-payment/order/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 如果后端需要身份验证，请加上这一行 👇
        'Authorization': token ? `Bearer ${token}` : '',
      }
    })
    const data = await response.json()
    if (data && data.code === 200) {
      paymentInfo.value = data.data || {}
      console.log('支付信息:', paymentInfo.value)
    } else {
      throw new Error(response.data.message || '获取支付信息失败')
    }
  } catch (error) {
    console.error('获取支付信息失败:', error)
    ElMessage.error('获取支付信息失败')
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


// 获取数据 - 只调用4个接口
const fetchAllData  = async () => {
  loading.value = true
  try {
    await Promise.all([
      fetchOrderDetail(),
      fetchOrderItems(),
      fetchPaymentInfo(),
      fetchAddressInfo()
    ])
    console.log('所有数据加载完成')
  } catch (error) {
    console.error('数据加载失败:', error)
    ElMessage.error('数据加载失败，请刷新页面重试')
  } finally {
    loading.value = false
  }
}



// 格式化日期时间
const formatDateTime = (dateTime) => {
  if (!dateTime) return '-'
  try {
    return new Date(dateTime).toLocaleString('zh-CN')
  } catch (error) {
    return dateTime
  }
}

// 获取订单状态文本
const getStatusText = (status) => {
  const statusMap = {
    1: '待付款',
    2: '待发货',
    3: '待收货',
    4: '已完成',
    5: '已关闭'
  }
  return statusMap[status] || '未知状态'
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

// 获取退款状态文本
const getRefundStatusText = (refundStatus) => {
  const refundStatusMap = {
    0: '无退款',
    1: '部分退款',
    2: '全部退款'
  }
  return refundStatusMap[refundStatus] || '未知'
}

// 获取退款状态类名
const getRefundStatusClass = (refundStatus) => {
  const refundStatusClassMap = {
    0: 'refund-none',
    1: 'refund-partial',
    2: 'refund-full'
  }
  return refundStatusClassMap[refundStatus] || ''
}

// 复制订单ID
const copyOrderId = async () => {
  try {
    await navigator.clipboard.writeText(orderDetail.value.id)
    ElMessage.success('订单ID已复制到剪贴板')
  } catch (err) {
    ElMessage.error('复制失败')
  }
}

// 初始化
onMounted(() => {
  console.log('订单详情页面初始化，订单ID:', orderId)
  fetchAllData()
})
</script>

<style scoped>
.order-detail-page {
  min-height: 100vh;
  background-color: #0f172a;
  color: #e2e8f0;
  padding: 80px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 30px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #f8fafc;
  margin: 0;
}

.order-status-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-label {
  color: #94a3b8;
  font-size: 16px;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
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

.status-completed {
  background-color: #d1fae5;
  color: #065f46;
}

.status-closed {
  background-color: #f1f5f9;
  color: #475569;
}

.loading-container {
  padding: 20px;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
}

.order-content {
  max-width: 1200px;
  margin: 0 auto;
}

.order-basic-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.info-card {
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.info-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #f1f5f9;
}

.info-grid {
  display: grid;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-label {
  color: #94a3b8;
  font-size: 14px;
  min-width: 80px;
}

.info-value {
  color: #e2e8f0;
  font-size: 14px;
  flex: 1;
}

.products-section, .price-section {
  margin-bottom: 30px;
}

.section-header {
  margin-bottom: 15px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #f1f5f9;
}

.products-list {
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.product-item {
  display: grid;
  grid-template-columns: 80px 1fr auto auto;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  align-items: center;
  position: relative;
}

.product-item:last-child {
  border-bottom: none;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.product-name {
  font-size: 16px;
  color: #f1f5f9;
  font-weight: 500;
}

.product-spec {
  font-size: 14px;
  color: #94a3b8;
}

.product-price {
  font-size: 16px;
  color: #e2e8f0;
  font-weight: 500;
}

.product-quantity {
  color: #cbd5e1;
  font-size: 14px;
}

.product-subtotal {
  font-size: 16px;
  color: #f1f5f9;
  font-weight: 600;
}

.refund-info {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  font-size: 12px;
}

.refund-label {
  color: #94a3b8;
}

.refund-value {
  color: #e2e8f0;
}

.refund-status {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 500;
}

.refund-none {
  background: #f1f5f9;
  color: #475569;
}

.refund-partial {
  background: #fef3c7;
  color: #92400e;
}

.refund-full {
  background: #d1fae5;
  color: #065f46;
}

.empty-products {
  text-align: center;
  padding: 60px 20px;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  color: #94a3b8;
}

.empty-icon {
  font-size: 60px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-text {
  font-size: 16px;
}

.price-card {
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  padding: 20px;
  max-width: 400px;
  margin-left: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.price-list {
  display: grid;
  gap: 12px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-item.total {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 12px;
  font-size: 18px;
  font-weight: 600;
}

.label {
  color: #94a3b8;
}

.value {
  color: #e2e8f0;
}

@media (max-width: 768px) {
  .order-basic-info {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .product-item {
    grid-template-columns: 60px 1fr;
    gap: 15px;
  }

  .product-quantity, .product-subtotal {
    grid-column: 1 / -1;
    text-align: right;
  }

  .price-card {
    max-width: 100%;
  }
}
</style>
