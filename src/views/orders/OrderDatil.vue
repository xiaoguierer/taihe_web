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
      <el-button type="primary" @click="$router.back()">返回订单列表</el-button>
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
              <span class="info-label">订单ID：</span>
              <span class="info-value">{{ orderDetail.id || '-' }}</span>
              <el-button v-if="orderDetail.id" link @click="copyOrderId">复制</el-button>
            </div>
            <div class="info-item">
              <span class="info-label">下单时间：</span>
              <span class="info-value">{{ formatDateTime(orderDetail.createdTime) }}</span>
            </div>
          </div>
        </div>

        <!-- 收货信息 -->
        <div class="info-card">
          <h3 class="info-title">收货信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">收货人：</span>
              <span class="info-value">{{ orderDetail.receiverName || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">联系电话：</span>
              <span class="info-value">{{ orderDetail.receiverPhone || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">收货地址：</span>
              <span class="info-value">{{ orderDetail.receiverAddress || '-' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 商品信息 -->
      <div class="products-section">
        <div class="section-header">
          <h3 class="section-title">商品信息</h3>
        </div>
        <div v-if="orderItems.length > 0" class="products-list">
          <div v-for="item in orderItems" :key="item.id" class="product-item">
            <div class="product-image">

            </div>
            <div class="product-info">
              <div class="product-name">{{ item.productName }}</div>
              <div class="product-spec">SKU ID: {{ item.skuId }}</div>
              <div class="product-price">单价: ¥{{ item.unitPrice?.toFixed(2) || '0.00' }}</div>
            </div>
            <div class="product-quantity">数量: x{{ item.quantity }}</div>
            <div class="product-subtotal">小计: ¥{{ item.totalPrice?.toFixed(2) || '0.00' }}</div>
            <!-- 退款信息 -->
            <div v-if="item.refundQuantity > 0" class="refund-info">
              <span class="refund-label">已退款：</span>
              <span class="refund-value">{{ item.refundQuantity }}件 / ¥{{ item.refundAmount?.toFixed(2) || '0.00' }}</span>
              <span class="refund-status" :class="getRefundStatusClass(item.refundStatus)">
                {{ getRefundStatusText(item.refundStatus) }}
              </span>
            </div>
          </div>
        </div>
        <div v-else class="empty-products">
          <div class="empty-icon">📦</div>
          <div class="empty-text">暂无商品信息</div>
        </div>
      </div>

      <!-- 价格信息 -->
      <div class="price-section">
        <div class="price-card">
          <h3 class="section-title">价格明细</h3>
          <div class="price-list">
            <div class="price-item">
              <span class="label">商品总价：</span>
              <span class="value">¥ {{ calculateTotalAmount().toFixed(2) }}</span>
            </div>
            <div class="price-item total">
              <span class="label">实付金额：</span>
              <span class="value">¥ {{ calculateTotalAmount().toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const orderId = route.params.orderId

// 响应式数据
const loading = ref(false)
const orderDetail = ref({})
const orderItems = ref([])

// 初始化订单详情
const initOrderDetail = () => {
  orderDetail.value = {
    id: orderId,
    createdTime: '',
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    totalAmount: 0,
    status: 1
  }
}

// 获取订单详情数据 - 只调用一个接口
const fetchOrderDetail = async () => {
  loading.value = true
  console.log('开始获取订单详情，订单ID:', orderId)

  try {
    // 调用后端提供的唯一接口 - 获取订单商品列表
    const response = await axios.get(`/api/order-item/order/${orderId}`)
    console.log('订单商品列表响应:', response.data)

    if (response.data && response.data.code === 200) {
      // 直接使用后端返回的商品列表数据
      orderItems.value = response.data.data || []
      console.log('订单商品列表数据:', orderItems.value)

      // 从商品列表中提取显示所需的信息
      if (orderItems.value.length > 0) {
        const firstItem = orderItems.value[0]
        orderDetail.value = {
          id: orderId,
          createdTime: firstItem.createdTime || '',
          receiverName: '收货人',
          receiverPhone: '联系电话',
          receiverAddress: '收货地址',
          totalAmount: calculateTotalAmount(),
          status: 3
        }
      } else {
        // 如果没有商品，使用默认信息
        orderDetail.value = {
          id: orderId,
          createdTime: '',
          receiverName: '无收货信息',
          receiverPhone: '无联系电话',
          receiverAddress: '无收货地址',
          totalAmount: 0,
          status: 1
        }
      }
    } else {
      console.error('获取订单商品失败:', response.data)
      ElMessage.error('获取订单详情失败：' + (response.data.message || '未知错误'))
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
    ElMessage.error('获取订单详情失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 计算商品总金额
const calculateTotalAmount = () => {
  return orderItems.value.reduce((total, item) => {
    return total + (item.totalPrice || 0)
  }, 0)
}

// 获取商品图片
const getProductImage = (item) => {
  return `https://via.placeholder.com/100x100/4f46e5/ffffff?text=${encodeURIComponent(item.productName?.substring(0, 2) || 'PD')}`
}

// 处理图片加载错误
const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/100x100/64748b/ffffff?text=No+Image'
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
  initOrderDetail()
  fetchOrderDetail()
})
</script>

<style scoped>
.order-detail-page {
  min-height: 100vh;
  background-color: #0f172a;
  color: #e2e8f0;
  padding: 20px;
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
