<template>
  <div class="payment-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">选择支付方式</h1>
      <el-button type="primary" @click="$router.back()">返回上一步</el-button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <!-- 支付内容 -->
    <div v-else class="payment-content">
      <!-- 订单信息 -->
      <div class="summary-card">
        <h3 class="section-title">订单信息</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <span class="label">订单号：</span>
            <span class="value">{{ orderInfo.orderSn }}</span>
          </div>
          <div class="summary-item">
            <span class="label">应付金额：</span>
            <span class="value amount-highlight">${{ orderInfo.totalAmount }}</span>
          </div>
          <div class="summary-item">
            <span class="label">商品数量：</span>
            <span class="value">{{ orderInfo.skuCount }} 件</span>
          </div>
        </div>
      </div>

      <!-- 支付渠道选择 -->
      <div class="summary-card">
        <h3 class="section-title">选择支付方式</h3>
        <div class="payment-methods">
          <div
              v-for="method in paymentMethods"
              :key="method.id"
              class="payment-method"
              :class="{ active: selectedMethod === method.id }"
              @click="selectPaymentMethod(method.id)"
          >
            <div class="method-icon">
              <span class="icon">{{ method.icon }}</span>
            </div>
            <div class="method-info">
              <div class="method-name">{{ method.name }}</div>
              <div class="method-desc">{{ method.description }}</div>
              <div v-if="method.discount" class="method-discount">{{ method.discount }}</div>
            </div>
            <div class="method-radio">
              <div class="radio" :class="{ checked: selectedMethod === method.id }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 支付按钮 -->
      <div class="action-buttons">
        <el-button
            type="primary"
            size="large"
            class="pay-button"
            :disabled="!selectedMethod"
            @click="handlePayment"
        >
          确认支付 ${{ orderInfo.totalAmount }}
        </el-button>
        <el-button @click="$router.back()">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/store/auth'
import axios from "axios";

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const loading = ref(false)
const selectedMethod = ref('')

// 订单信息
const orderInfo = ref({
  orderId: '',
  orderSn: '',
  totalAmount: '0.00',
  itemCount: 0
})

// 支付渠道列表
const paymentMethods = ref([
  {
    id: 'alipay',
    name: '支付宝',
    icon: '💰',
    description: '推荐支付宝用户使用',
    discount: '随机立减，最高88元'
  },
  {
    id: 'wechat',
    name: '微信支付',
    icon: '💳',
    description: '推荐微信用户使用',
    discount: '新用户首单立减5元'
  },
  {
    id: 'unionpay',
    name: '银联支付',
    icon: '🏦',
    description: '支持各大银行储蓄卡/信用卡',
    discount: ''
  },
  {
    id: 'creditcard',
    name: '信用卡支付',
    icon: '💎',
    description: 'Visa/MasterCard/JCB',
    discount: '分期付款0手续费'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: '🌍',
    description: '国际支付',
    discount: ''
  }
])

// 选择支付方式
const selectPaymentMethod = (methodId) => {
  selectedMethod.value = methodId
  console.log('选择的支付方式:', methodId)
}

// 处理支付
const handlePayment = async () => {
  if (!authStore.isLoggedIn) {
    alert('⚠️ 用户未登录，请先登录！')
    const url = `/users/login`
    router.push(url)// 通过路由路径导航
  }
  if (!selectedMethod.value) {
    ElMessage.warning('请选择支付方式')
    return
  }
  try {
    loading.value = true
    console.log('开始支付，方式:', selectedMethod.value, '订单:', orderInfo.value.orderId)
    // 构建完整的回调URL（确保是绝对路径）
   /* const baseUrl = window.location.origin
    const successUrl = `https://www.zeniul.cn/orders/PaySuccess`
    const cancelUrl = `https://www.zeniul.cn/orders/PayError`*/
    const baseUrl = window.location.origin
    /*const successUrl = `http://localhost:3000/orders/PaySuccess`
    const cancelUrl = `http://localhost:3000/orders/PayError`*/

    // 根据DTO文档构建正确的请求参数
    const paymentRequestDTO = {
      orderId: orderInfo.value.orderId, // 订单id
      //total: orderInfo.value.totalAmount, // 订单总金额
      total: 0.01, // 订单总金额
      currency: orderInfo.value.currency || 'USD', // 货币类型
      method: selectedMethod.value, // 支付方式
      intent: 'sale', // 支付意图
      description: `订单支付 - ${orderInfo.value.orderSn}` // 订单描述
     /* successUrl: successUrl, // 使用构建的完整URL
      cancelUrl: cancelUrl    // 使用构建的完整URL*/
    }
    console.log('支付请求数据:', paymentRequestDTO)
    // 模拟支付API调用
    // 调用后端支付创建接口
    const response = await axios.post('/api/payment/create', paymentRequestDTO, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore?.token || ''}`
      }
    })
    const result = await response.data
    console.log('支付创建响应:', result)
    if (result.paymentId && result.approvalUrl) {
      // 保存支付会话数据
      sessionStorage.setItem('paymentData', JSON.stringify({
        paymentId: result.paymentId,
        orderSn: orderInfo.value.orderSn,
        status: result.status
      }))

      ElMessage.success('正在跳转到支付页面...')
      setTimeout(() => {
        window.location.href = result.approvalUrl
      }, 1500)
    } else {
      ElMessage.error(result.error || '支付创建失败')
    }

  } catch (error) {
    console.error('支付失败:', error)
    ElMessage.error('网络错误，请重试')
  } finally {
    loading.value = false
  }
}

// 加载订单信息
const loadOrderInfo = async() => {
  loading.value = true
  try {
    // 从路由参数或sessionStorage获取订单信息
    const orderId = route.query.orderId || sessionStorage.getItem('currentOrderId')
    if (!orderId) {
      ElMessage.error('未找到订单信息')
      //router.push('/orders')
      return
    }
    // 调用后端接口获取真实订单信息
    const response = await axios.get(`/api/order/getById/${orderId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore?.token || ''}`
      }
    })
    const result = response.data
    /*console.log('订单result详情接口响应:', result)
    console.log('订单result.data()详情接口响应:', result.data)*/
    if (result.code === 200 && result.data) {
      const orderData = result.data
      // 根据实体类字段映射数据
      orderInfo.value = {
        // 主键信息
        id: orderData.id || '',
        orderId: orderData.id || '',
        orderSn: orderData.orderSn || '',
        userId: orderData.userId || '',
        // 状态信息
        status: Number(orderData.status), // 默认待付款
        // 商品信息
        spuCount: Number(orderData.spuCount), // 商品种类
        skuCount: Number(orderData.skuCount) , // 商品数量
        // 金额信息
        totalAmount: orderData.totalAmount ? Number(orderData.totalAmount) : 0, // 订单总金额
        currency: orderData.currency || 'USD', // 货币
        // 收货地址信息
        addressId: orderData.addressId || '',
        receiverName: orderData.receiverName || '',
        receiverPhone: orderData.receiverPhone || '',
        receiverAddress: orderData.receiverAddress || '',
        // 时间信息
        createdTime: orderData.createdTime || '', // 下单时间
        paymentTime: orderData.paymentTime || '', // 付款时间
        shippingTime: orderData.shippingTime || '', // 发货时间
        completedTime: orderData.completedTime || '', // 完成时间
        // 状态文本（前端显示用）
        //statusText: getStatusText(Number(orderData.status) || 1)
      }
    //  console.log('加载的真实订单信息:', orderInfo.value)
    }else {
      ElMessage.error(result.message || '获取订单信息失败')
      orderInfo.value = null
    }
  } catch (error) {
    console.error('加载订单信息失败:', error)
    if (error.response) {
      const errorMsg = error.response.data?.message || '获取订单信息失败'
      ElMessage.error(`错误: ${errorMsg}`)
    } else if (error.request) {
      ElMessage.error('网络连接失败，请检查网络')
    } else {
      ElMessage.error('获取订单信息失败')
    }

    orderInfo.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadOrderInfo()
})
</script>

<style scoped>
.payment-page {
  min-height: 100vh;
  background-color: #0f172a;
  color: #e2e8f0;
  padding: 20px;
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

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #f8fafc;
  margin: 0;
}

.loading-container {
  padding: 40px 20px;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
}

.payment-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.summary-card {
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #f1f5f9;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-grid {
  display: grid;
  gap: 15px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-item:last-child {
  border-bottom: none;
}

.label {
  color: #94a3b8;
  font-size: 14px;
  font-weight: 500;
}

.value {
  color: #e2e8f0;
  font-size: 16px;
  font-weight: 600;
}

.amount-highlight {
  color: #10b981;
  font-weight: 600;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.payment-method {
  display: flex;
  align-items: center;
  padding: 16px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.payment-method:hover {
  background: rgba(15, 23, 42, 0.7);
  transform: translateY(-1px);
}

.payment-method.active {
  border-color: #3b82f6;
  background: rgba(15, 23, 42, 0.8);
}

.method-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-right: 15px;
}

.icon {
  font-size: 20px;
}

.method-info {
  flex: 1;
}

.method-name {
  color: #f1f5f9;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.method-desc {
  color: #94a3b8;
  font-size: 12px;
}

.method-discount {
  color: #10b981;
  font-size: 12px;
  font-weight: 500;
  margin-top: 2px;
}

.method-radio {
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio {
  width: 20px;
  height: 20px;
  border: 2px solid #94a3b8;
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
}

.radio.checked {
  border-color: #3b82f6;
  background: #3b82f6;
}

.radio.checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.pay-button {
  width: 200px;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #10b981, #34d399);
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.pay-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #10b981);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.pay-button:disabled {
  background: #64748b;
  cursor: not-allowed;
  transform: none;
}

/* Element Plus 组件样式覆盖 */
:deep(.el-button) {
  font-weight: 500;
  transition: all 0.3s ease;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  border: none;
  color: white;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

:deep(.el-button--primary:active) {
  transform: translateY(0);
}

:deep(.el-skeleton) {
  background: rgba(255, 255, 255, 0.1);
}

:deep(.el-skeleton__item) {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.2) 37%, rgba(255, 255, 255, 0.1) 63%);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .payment-page {
    padding: 15px;
  }

  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .page-title {
    font-size: 24px;
  }

  .payment-method {
    padding: 12px;
  }

  .method-icon {
    width: 36px;
    height: 36px;
    margin-right: 12px;
  }

  .icon {
    font-size: 18px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 15px;
  }

  .pay-button {
    width: 100%;
  }

  .summary-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .value {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .payment-page {
    padding: 10px;
  }

  .summary-card {
    padding: 15px;
  }

  .payment-method {
    padding: 12px;
  }

  .section-title {
    font-size: 18px;
  }
}
</style>
