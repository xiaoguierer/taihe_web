<template>
  <div class="order-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">订单详情</h1>
        <div class="order-status-info">
          <span class="status-label">订单状态：</span>
          <span :class="['status-badge', `status-${orderDetail.status}`]">
            {{ getStatusText(orderDetail.status) }}
          </span>
        </div>
      </div>
      <el-button type="primary" @click="$router.back()">返回订单列表</el-button>
    </div>

    <!-- 订单基本信息 -->
    <div class="order-basic-info">
      <div class="info-card">
        <h3 class="info-title">订单信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">订单编号：</span>
            <span class="info-value">{{ orderDetail.id }}</span>
            <el-button type="text" @click="copyOrderId">复制</el-button>
          </div>
          <div class="info-item">
            <span class="info-label">下单时间：</span>
            <span class="info-value">{{ formatDate(orderDetail.createTime) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">支付方式：</span>
            <span class="info-value">{{ orderDetail.paymentMethod || '在线支付' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">支付时间：</span>
            <span class="info-value">{{ formatDate(orderDetail.payTime) }}</span>
          </div>
        </div>
      </div>

      <!-- 物流信息 -->
      <div v-if="orderDetail.status !== 'pending_payment'" class="info-card">
        <h3 class="info-title">物流信息</h3>
        <div class="logistics-info">
          <div v-if="orderDetail.logistics" class="logistics-detail">
            <div class="logistics-item">
              <span class="label">物流公司：</span>
              <span class="value">{{ orderDetail.logistics.company }}</span>
            </div>
            <div class="logistics-item">
              <span class="label">运单号码：</span>
              <span class="value">{{ orderDetail.logistics.trackingNumber }}</span>
              <el-button type="text" @click="copyTrackingNumber">复制</el-button>
            </div>
            <div class="logistics-item">
              <span class="label">收货地址：</span>
              <span class="value">{{ orderDetail.shippingAddress }}</span>
            </div>
          </div>
          <div v-else class="no-logistics">
            暂未发货
          </div>
        </div>
      </div>
    </div>

    <!-- 商品信息 -->
    <div class="products-section">
      <div class="section-header">
        <h3 class="section-title">商品信息</h3>
      </div>
      <div class="products-list">
        <div v-for="product in orderDetail.products" :key="product.id" class="product-item">
          <div class="product-image">
            <img :src="product.image" :alt="product.name" @click="goToProductDetail(product.id)">
          </div>
          <div class="product-info">
            <div class="product-name" @click="goToProductDetail(product.id)">{{ product.name }}</div>
            <div class="product-spec">{{ product.spec }}</div>
            <div class="product-price">¥{{ product.price.toFixed(2) }}</div>
          </div>
          <div class="product-quantity">x{{ product.quantity }}</div>
          <div class="product-subtotal">¥{{ (product.price * product.quantity).toFixed(2) }}</div>
        </div>
      </div>
    </div>

    <!-- 价格信息 -->
    <div class="price-section">
      <div class="price-card">
        <h3 class="section-title">价格明细</h3>
        <div class="price-list">
          <div class="price-item">
            <span class="label">商品总价：</span>
            <span class="value">¥{{ orderDetail.totalAmount.toFixed(2) }}</span>
          </div>
          <div class="price-item">
            <span class="label">运费：</span>
            <span class="value">¥{{ orderDetail.shippingFee.toFixed(2) }}</span>
          </div>
          <div class="price-item">
            <span class="label">优惠金额：</span>
            <span class="value discount">-¥{{ orderDetail.discountAmount.toFixed(2) }}</span>
          </div>
          <div class="price-item total">
            <span class="label">实付金额：</span>
            <span class="value">¥{{ orderDetail.finalAmount.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 物流跟踪 -->
    <div v-if="orderDetail.logistics && orderDetail.logistics.tracking" class="logistics-track">
      <div class="section-header">
        <h3 class="section-title">物流跟踪</h3>
      </div>
      <div class="track-timeline">
        <el-timeline>
          <el-timeline-item
            v-for="(track, index) in orderDetail.logistics.tracking"
            :key="index"
            :timestamp="formatTrackTime(track.time)"
            :type="index === 0 ? 'primary' : ''"
          >
            {{ track.description }}
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <div class="button-group">
        <el-button @click="contactCustomerService">联系客服</el-button>
        <el-button v-if="orderDetail.status === 'pending_payment'" type="primary" @click="handlePay">
          立即支付
        </el-button>
        <el-button v-if="orderDetail.status === 'pending_payment'" @click="handleCancel">
          取消订单
        </el-button>
        <el-button v-if="orderDetail.status === 'pending_shipment'" @click="handleRemind">
          提醒发货
        </el-button>
        <el-button v-if="orderDetail.status === 'shipped'" type="primary" @click="handleConfirm">
          确认收货
        </el-button>
        <el-button v-if="orderDetail.status === 'pending_review'" type="primary" @click="handleReview">
          评价商品
        </el-button>
        <el-button v-if="orderDetail.status === 'completed'" type="primary" @click="handleRebuy">
          再次购买
        </el-button>
        <el-button v-if="orderDetail.status !== 'pending_payment'" @click="handleAfterSale">
          申请售后
        </el-button>
      </div>
    </div>

    <!-- 再次购买结果弹窗 -->
    <el-dialog
      v-model="rebuyDialogVisible"
      title="再次购买结果"
      width="500px"
      center
    >
      <div v-if="rebuyResult">
        <p v-if="rebuyResult.successItems.length > 0" class="success-text">
          成功添加 {{ rebuyResult.successItems.length }} 件商品到购物车：
        </p>
        <ul v-if="rebuyResult.successItems.length > 0" class="item-list">
          <li v-for="item in rebuyResult.successItems" :key="item.id">
            {{ item.name }}
          </li>
        </ul>

        <p v-if="rebuyResult.failedItems.length > 0" class="error-text">
          以下商品添加失败：
        </p>
        <ul v-if="rebuyResult.failedItems.length > 0" class="item-list">
          <li v-for="item in rebuyResult.failedItems" :key="item.id">
            {{ item.name }} - {{ item.reason }}
          </li>
        </ul>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="rebuyDialogVisible = false">继续购物</el-button>
          <el-button type="primary" @click="goToCart">去购物车结算</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()

const orderId = route.params.orderId

// 订单详情数据
const orderDetail = ref({
  id: orderId,
  createTime: '2023-11-15 14:30:22',
  status: 'completed',
  paymentMethod: '微信支付',
  payTime: '2023-11-15 14:35:18',
  totalAmount: 2580.00,
  shippingFee: 0.00,
  discountAmount: 0.00,
  finalAmount: 2580.00,
  shippingAddress: '北京市朝阳区建国路88号SOHO现代城A座1001室 张三 13800138000',
  logistics: {
    company: '顺丰速运',
    trackingNumber: 'SF1234567890123',
    tracking: [
      {
        time: '2023-11-16 09:30:00',
        description: '已签收，感谢使用顺丰速运'
      },
      {
        time: '2023-11-16 08:15:00',
        description: '快件已到达【北京朝阳建国路营业点】'
      },
      {
        time: '2023-11-15 19:20:00',
        description: '快件已发车'
      },
      {
        time: '2023-11-15 18:30:00',
        description: '顺丰速运已收件'
      }
    ]
  },
  products: [
    {
      id: 'P001',
      name: '璀璨钻石项链',
      image: 'https://via.placeholder.com/100x100/4f46e5/ffffff?text=Diamond',
      spec: '链长40cm，玫瑰金',
      quantity: 1,
      price: 2580.00
    }
  ]
})

// 再次购买相关
const rebuyDialogVisible = ref(false)
const rebuyResult = ref(null)

// 状态文本映射
const statusTextMap = {
  pending_payment: '待付款',
  pending_shipment: '待发货',
  shipped: '运输中',
  pending_review: '待评价',
  completed: '交易成功'
}

// 获取订单详情
const fetchOrderDetail = async () => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    // 实际项目中这里应该调用API获取订单详情
    // const response = await orderApi.getOrderDetail(orderId)
    // orderDetail.value = response.data
  } catch (error) {
    ElMessage.error('获取订单详情失败')
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN')
}

// 格式化物流时间
const formatTrackTime = (timeString) => {
  return new Date(timeString).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取状态文本
const getStatusText = (status) => {
  return statusTextMap[status] || status
}

// 复制订单号
const copyOrderId = async () => {
  try {
    await navigator.clipboard.writeText(orderDetail.value.id)
    ElMessage.success('订单号已复制到剪贴板')
  } catch (err) {
    ElMessage.error('复制失败')
  }
}

// 复制运单号
const copyTrackingNumber = async () => {
  try {
    await navigator.clipboard.writeText(orderDetail.value.logistics.trackingNumber)
    ElMessage.success('运单号已复制到剪贴板')
  } catch (err) {
    ElMessage.error('复制失败')
  }
}

// 跳转到商品详情
const goToProductDetail = (productId) => {
  router.push(`/product/${productId}`)
}

// 联系客服
const contactCustomerService = () => {
  ElMessage.info('正在联系客服...')
  // 实际项目中可以跳转到客服页面或打开客服对话框
}

// 立即支付
const handlePay = () => {
  ElMessage.info('跳转到支付页面...')
  // 实际项目中跳转到支付页面
}

// 取消订单
const handleCancel = async () => {
  try {
    await ElMessageBox.confirm('确定要取消此订单吗？', '提示', {
      type: 'warning'
    })
    // 调用取消订单API
    ElMessage.success('订单已取消')
    // 重新加载订单详情
    fetchOrderDetail()
  } catch {
    // 用户取消操作
  }
}

// 提醒发货
const handleRemind = () => {
  ElMessage.success('已提醒卖家尽快发货')
}

// 确认收货
const handleConfirm = async () => {
  try {
    await ElMessageBox.confirm('确认收到商品后，货款将支付给卖家。请确保商品无误后再确认收货。', '确认收货', {
      type: 'warning'
    })
    // 调用确认收货API
    ElMessage.success('确认收货成功')
    fetchOrderDetail()
  } catch {
    // 用户取消操作
  }
}

// 评价商品
const handleReview = () => {
  router.push(`/order/review/${orderId}`)
}

// 再次购买
const handleRebuy = async () => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    const mockResponse = {
      success: true,
      successItems: orderDetail.value.products,
      failedItems: []
    }

    if (mockResponse.successItems.length === orderDetail.value.products.length) {
      ElMessage.success('商品已成功加入购物车！')
      setTimeout(() => {
        router.push('/cart')
      }, 1500)
    } else {
      rebuyResult.value = mockResponse
      rebuyDialogVisible.value = true
    }
  } catch (error) {
    ElMessage.error('操作失败，请稍后重试')
  }
}

// 申请售后
const handleAfterSale = () => {
  router.push(`/after-sale/apply/${orderId}`)
}

// 去购物车
const goToCart = () => {
  rebuyDialogVisible.value = false
  router.push('/cart')
}

// 初始化
onMounted(() => {
  fetchOrderDetail()
})
</script>

<style scoped>
.order-detail-page {
  min-height: 100vh;
  background-color: #0f172a;
  color: #e2e8f0;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
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
  background: #fef3c7;
  color: #92400e;
}

.status-pending_shipment {
  background: #dbeafe;
  color: #1e40af;
}

.status-shipped {
  background: #f0f9ff;
  color: #0369a1;
}

.status-pending_review {
  background: #f3e8ff;
  color: #7e22ce;
}

.status-completed {
  background: #f0fdf4;
  color: #166534;
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
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
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

.logistics-info {
  display: grid;
  gap: 10px;
}

.logistics-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.no-logistics {
  color: #94a3b8;
  font-style: italic;
}

.products-section, .price-section, .logistics-track {
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
}

.product-item {
  display: grid;
  grid-template-columns: 80px 1fr auto auto;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  align-items: center;
}

.product-item:last-child {
  border-bottom: none;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
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
  cursor: pointer;
}

.product-name:hover {
  color: #60a5fa;
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

.price-card {
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  padding: 20px;
  max-width: 400px;
  margin-left: auto;
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

.discount {
  color: #10b981;
}

.track-timeline {
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  padding: 20px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.button-group {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.success-text {
  color: #10b981;
  font-weight: 500;
  margin-bottom: 10px;
}

.error-text {
  color: #ef4444;
  font-weight: 500;
  margin-top: 15px;
  margin-bottom: 10px;
}

.item-list {
  margin-left: 20px;
  margin-bottom: 10px;
}

.item-list li {
  margin-bottom: 5px;
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

  .button-group {
    flex-direction: column;
    width: 100%;
  }

  .button-group .el-button {
    width: 100%;
  }
}
</style>
