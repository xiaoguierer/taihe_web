<template>
  <div class="payment-success-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
      </div>
      <p>正在验证PayPal支付结果...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h3>支付验证失败</h3>
      <p>{{ error }}</p>
      <div class="error-actions">
        <button @click="retryVerification" class="btn btn-primary">
          <i class="fas fa-redo"></i> 重新验证
        </button>
        <button @click="contactSupport" class="btn btn-outline">
          <i class="fas fa-headset"></i> 联系客服
        </button>
        <button @click="backToOrder" class="btn btn-secondary">
          <i class="fas fa-arrow-left"></i> 返回订单
        </button>
      </div>
    </div>

    <!-- 支付成功状态 -->
    <div v-else-if="paymentStatus === 'success'" class="success-content">
      <!-- 头部成功信息 -->
      <div class="success-header">
        <div class="success-icon">
          <i class="fab fa-paypal paypal-icon"></i>
          <i class="fas fa-check-circle check-icon"></i>
        </div>
        <h1>PayPal支付成功！</h1>
        <p class="success-subtitle">感谢您使用PayPal完成支付</p>
      </div>

      <!-- PayPal支付信息 -->
      <div class="info-card">
        <div class="info-section">
          <h3><i class="fab fa-paypal"></i> PayPal支付详情</h3>
          <div class="payment-result">
            <div class="result-item">
              <span class="label">支付状态：</span>
              <span class="value status-success">
                <i class="fas fa-check-circle"></i> 支付成功
              </span>
            </div>
            <div class="result-item">
              <span class="label">PayPal支付ID：</span>
              <span class="value payment-id">{{ paymentData.paymentId }}</span>
            </div>
            <div class="result-item">
              <span class="label">订单号：</span>
              <span class="value">{{ paymentData.orderSn }}</span>
            </div>
            <div class="result-item">
              <span class="label">支付金额：</span>
              <span class="value amount">${{ formatAmount(paymentData.amount) }}</span>
            </div>
            <div class="result-item">
              <span class="label">货币类型：</span>
              <span class="value">{{ paymentData.currency || 'USD' }}</span>
            </div>
            <div class="result-item">
              <span class="label">支付时间：</span>
              <span class="value">{{ formatTime(paymentData.createTime) }}</span>
            </div>
            <div v-if="paymentData.payerEmail" class="result-item">
              <span class="label">PayPal账号：</span>
              <span class="value">{{ paymentData.payerEmail }}</span>
            </div>
            <div v-if="paymentData.transactionId" class="result-item">
              <span class="label">交易号：</span>
              <span class="value transaction-no">{{ paymentData.transactionId }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 订单信息 -->
      <div class="info-card">
        <div class="info-section">
          <h3><i class="fas fa-receipt"></i> 订单信息</h3>
          <div class="order-info">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">订单状态：</span>
                <span class="info-value status-completed">已完成支付</span>
              </div>
              <div class="info-item">
                <span class="info-label">商品数量：</span>
                <span class="info-value">{{ orderInfo.itemCount || 0 }} 件</span>
              </div>
              <div class="info-item">
                <span class="info-label">订单总额：</span>
                <span class="info-value amount">${{ formatAmount(orderInfo.totalAmount) }}</span>
              </div>
              <div class="info-item full-width">
                <span class="info-label">订单描述：</span>
                <span class="info-value">{{ orderInfo.description || '商品购买' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button @click="viewOrderDetail" class="btn btn-primary">
          <i class="fas fa-eye"></i> 查看订单详情
        </button>
        <button @click="continueShopping" class="btn btn-secondary">
          <i class="fas fa-shopping-cart"></i> 继续购物
        </button>
        <button @click="printReceipt" class="btn btn-outline">
          <i class="fas fa-print"></i> 打印收据
        </button>
      </div>

      <!-- PayPal安全保障 -->
      <div class="security-info">
        <h3><i class="fas fa-shield-alt"></i> PayPal安全保障</h3>
        <div class="security-features">
          <div class="feature-item">
            <i class="fas fa-lock"></i>
            <span>加密交易</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-user-shield"></i>
            <span>买家保护</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-undo"></i>
            <span>退款保障</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 支付取消状态 -->
    <div v-else-if="paymentStatus === 'cancelled'" class="cancelled-content">
      <div class="cancelled-header">
        <div class="cancelled-icon">
          <i class="fas fa-times-circle"></i>
        </div>
        <h1>支付已取消</h1>
        <p class="cancelled-subtitle">您在PayPal取消了支付操作</p>
      </div>

      <div class="cancelled-actions">
        <button @click="retryPayment" class="btn btn-primary">
          <i class="fab fa-paypal"></i> 重新支付
        </button>
        <button @click="backToOrder" class="btn btn-secondary">
          <i class="fas fa-edit"></i> 修改订单
        </button>
        <button @click="continueShopping" class="btn btn-outline">
          <i class="fas fa-shopping-cart"></i> 继续购物
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/store/auth'

// 路由和状态管理
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const loading = ref(true)
const error = ref('')
const paymentStatus = ref('') // success, cancelled, failed
const paymentData = ref({})
const orderInfo = ref({})

// 从URL参数获取PayPal支付信息
const getPayPalPaymentParams = () => {
  // PayPal支付成功后会重定向到successUrl，并携带以下参数：
  // paymentId: PayPal支付ID
  // PayerID: 付款人ID
  // token: 支付令牌
  const params = route.query
  console.log('PayPal回调参数:', params)
  return {
    paymentId: params.paymentId,
    payerId: params.PayerID,
    token: params.token
  }
}

// 检查是否是支付取消
const checkIfCancelled = () => {
  const params = route.query
  // 如果只有token参数，通常是用户取消了支付
  if (params.token && !params.paymentId && !params.PayerID) {
    return true
  }
  return false
}

// 执行PayPal支付
const executePayPalPayment = async () => {
  try {
    loading.value = true
    error.value = ''

    const paypalParams = getPayPalPaymentParams()
    console.log('支付网关PayPal回调参数:', paypalParams)
    if (!paypalParams.paymentId || !paypalParams.payerId || !paypalParams.token) {
      throw new Error('缺少必要的PayPal支付参数')
    }
    // 调用后端执行PayPal支付接口
    const response = await axios.post('/api/payment/execute', null, {
      params: {  // 使用params而不是data
        paymentId: paypalParams.paymentId,
        token: paypalParams.token,
        PayerID: paypalParams.payerId
      },
      headers: {
        'Authorization': `Bearer ${authStore?.token || ''}`,
        'Content-Type': 'application/json'
      }
    })
    console.log('支付执行响应:', response.data)
    // 根据paymentId获取支付记录
    // 根据支付记录中的

  } catch (err) {
    console.error('PayPal支付执行失败:', err)
    error.value = err.response?.data?.message || err.message || '支付处理失败，请稍后重试'
    paymentStatus.value = 'failed'
  } finally {
    loading.value = false
  }
}
// 重新验证
const retryVerification = () => {
  error.value = ''
  loading.value = true
  executePayPalPayment()
}

// 重新支付
const retryPayment = () => {
  // 从sessionStorage获取订单信息重新支付
  const orderData = sessionStorage.getItem('currentOrder')
  if (orderData) {
    router.push('/payment?orderSn=' + JSON.parse(orderData).orderSn)
  } else {
    router.push('/orders')
  }
}

// 联系客服
const contactSupport = () => {
  window.open('https://www.paypal.com/smarthelp/contact-us', '_blank')
}

// 返回订单
const backToOrder = () => {
  router.push('/order/page')
}

// 查看订单详情
const viewOrderDetail = () => {
  if (paymentData.value.orderSn) {
    router.push(`/order/detail/${paymentData.value.orderSn}`)
  } else {
    router.push('/order/list')
  }
}

// 继续购物
const continueShopping = () => {
  router.push('/')
}

// 打印收据
const printReceipt = () => {
  window.print()
}

// 格式化金额
const formatAmount = (amount) => {
  if (!amount) return '0.00'
  return Number(amount).toFixed(2)
}

// 格式化时间
const formatTime = (timeString) => {
  if (!timeString) return '--'
  try {
    return new Date(timeString).toLocaleString('zh-CN')
  } catch {
    return timeString
  }
}

// 组件挂载时执行
onMounted(() => {
  // 检查是否是支付取消
  if (checkIfCancelled()) {
    paymentStatus.value = 'cancelled'
    loading.value = false
    return
  }

  // 执行PayPal支付
  executePayPalPayment()
})
</script>

<style scoped>
.payment-success-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* 加载状态 */
.loading-container {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  font-size: 48px;
  color: #4CAF50;
  margin-bottom: 20px;
}

.loading-container p {
  color: #666;
  font-size: 16px;
}

/* 错误状态 */
.error-container {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.error-icon {
  font-size: 60px;
  color: #f44336;
  margin-bottom: 20px;
}

.error-container h3 {
  margin-bottom: 10px;
  color: #333;
}

.error-container p {
  color: #666;
  margin-bottom: 20px;
}

.error-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 成功内容 */
.success-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px 20px;
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
  color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.paypal-icon {
  color: #003087;
  font-size: 48px;
}

.check-icon {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: white;
  border-radius: 50%;
  color: #4CAF50;
  font-size: 20px;
}

.success-header .success-icon {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
}

.success-header h1 {
  font-size: 28px;
  margin-bottom: 10px;
}

.success-subtitle {
  font-size: 16px;
  opacity: 0.9;
}

/* 信息卡片 */
.info-card {
  background: white;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.info-section h3 {
  color: #2E7D32;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-section h3 i {
  color: #4CAF50;
}

.payment-result {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed #eee;
}

.result-item:last-child {
  border-bottom: none;
}

.label {
  color: #666;
  font-weight: 500;
  min-width: 120px;
}

.value {
  font-weight: 500;
  text-align: right;
  word-break: break-word;
}

.amount {
  color: #2E7D32;
  font-weight: bold;
  font-size: 16px;
}

.status-success {
  color: #2E7D32;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}

.payment-id, .transaction-no {
  font-family: monospace;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

/* 订单信息 */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

@media (max-width: 600px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed #eee;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  color: #666;
  font-weight: 500;
}

.status-completed {
  color: #2E7D32;
  font-weight: 600;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin: 30px 0;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  min-width: 140px;
  justify-content: center;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background: #3d8b40;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.btn-secondary {
  background: #2196F3;
  color: white;
}

.btn-secondary:hover {
  background: #1976D2;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.btn-outline {
  background: white;
  color: #333;
  border: 1px solid #ddd;
}

.btn-outline:hover {
  background: #f5f5f5;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.retry-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.retry-btn:hover {
  background: #3d8b40;
}

/* PayPal安全保障 */
.security-info {
  background: linear-gradient(135deg, #003087, #009cde);
  color: white;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
}

.security-info h3 {
  margin-bottom: 15px;
  text-align: center;
}

.security-features {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
}

.feature-item i {
  font-size: 24px;
  margin-bottom: 5px;
}

/* 取消状态 */
.cancelled-content {
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.cancelled-icon {
  font-size: 80px;
  color: #f44336;
  margin-bottom: 20px;
}

.cancelled-header h1 {
  color: #f44336;
  margin-bottom: 10px;
}

.cancelled-subtitle {
  color: #666;
  margin-bottom: 30px;
}

.cancelled-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}
</style>