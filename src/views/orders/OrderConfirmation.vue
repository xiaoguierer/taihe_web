<template>

  <div class="checkout-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">Order Confirmation</h1>
      <el-button type="primary" @click="$router.back()">Back to Cart</el-button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <!-- 订单确认内容 -->
    <div v-else class="checkout-content">
      <!-- 订单摘要 -->
      <div class="summary-card">
        <h3 class="section-title">Address Information</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <span class="label">Delivery Address：</span>
            <span class="value" v-if="userAddress">
        Recipient：{{ userAddress.receiverName }}
        -- Phone：{{ userAddress.phoneCountryCode }}|{{ userAddress.phoneNumber }}
        Full Address-- {{ userAddress.country }}/{{ userAddress.stateProvince }}/{{ userAddress.city }}/{{ userAddress.district }}/{{ userAddress.streetAddress }}
            </span>
            <span class="value" v-else>No default address available</span>
          </div>
        </div>
      </div>
      <!-- 订单摘要 -->
      <div class="summary-card">
        <h3 class="section-title">Order Summary</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <span class="label">Total：</span>
            <span class="value">¥{{ checkoutData.totalAmount }}  || Quantity：{{ checkoutData.SkuCount }}   ||  Product Types {{ checkoutData.SpuCount }}   </span>
          </div>
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="products-section">
        <h3 class="section-title">Product List</h3>
        <div class="products-list">
          <div v-for="(item, index) in checkoutData.items" :key="item.cartItemId" class="product-item">
            <div class="product-info">
              <div class="product-id">Cart ID: {{ item.cartItemId }}</div>
              <div class="product-spec">SPU: {{ item.spuId }} || SKU: {{ item.skuId }}</div>
            </div>
            <div class="product-price">Unit Price: ¥{{ item.unitPrice }} || Quantity: {{ item.quantity }} || Line Total: ¥{{ item.subtotal }}</div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button type="primary" size="large" @click="handleConfirmOrder">Confirm Order</el-button>
<!--        <el-button @click="$router.back()">取消</el-button>-->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/store/auth'
import axios from "axios";

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
// 用户地址数据
const userAddress = ref(null)
// 获取用户默认地址
const fetchUserAddress = async () => {
  try {
    const userId = authStore.userInfo?.userId
    if (!userId) {
      console.warn('❌ 用户ID为空，无法获取地址信息')
      return
    }
    const response = await fetch(`/api/user-address/selectDefaultByUserId/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    const result = await response.json()
    if (result.code === 200) {
      userAddress.value = result.data
      // 输出详细的地址信息
      if (userAddress.value) {
        //console.log('   - 地址ID:', userAddress.value.id)
      } else {
        console.log('⚠️ 用户没有默认地址')
      }
    } else {
      console.error('❌ 获取地址失败:', result.message)
    }
  } catch (error) {
    console.error('❌ 获取用户地址异常:', error)
  }
}

// 订单数据
const checkoutData = ref({
  userId: '',
  totalAmount: '0.00',
  SkuCount: 0,
  SpuCount: 0,
  userAddress,
  items: []
})

// 加载订单数据
const loadCheckoutData = async() => {
  loading.value = true
  try {
    // 加载用户地址信息
    await fetchUserAddress()
    const cartDataStr = sessionStorage.getItem('checkoutData')
    if (!cartDataStr) {
      console.error('checkoutData 不存在于 sessionStorage 中')
      ElMessage.warning('未找到订单数据，请返回购物车重新选择商品')
      return
    }
    const cartData = JSON.parse(cartDataStr)
    // 使用正确的数据格式
    checkoutData.value = {
      userId: cartData.userId || authStore.userInfo?.userId || '',
      totalAmount: cartData.totalAmount || '0.00',
      SkuCount: cartData.SkuCount || 0, // 注意大小写
      SpuCount: cartData.SpuCount || 0, // 注意大小写
      userAddressId:userAddress.value.id || null,
      items: (cartData.items || []).map(item => ({
        cartItemId: item.cartItemId || '',
        spuId: item.spuId || '',
        skuId: item.skuId || '',
        unitPrice: parseFloat(item.unitPrice || 0).toFixed(2),
        quantity: parseInt(item.quantity || 0),
        subtotal: (parseFloat(item.unitPrice || 0) * parseInt(item.quantity || 0)).toFixed(2)
      }))
    }
  } catch (error) {
    console.error('加载订单数据失败:', error)
    ElMessage.error('加载订单数据失败')
  } finally {
    loading.value = false
  }
}

// 确认下单
const handleConfirmOrder = async () => {
  try {
    loading.value = true
    //console.log('提交订单数据:', checkoutData.value)
    // 确保地址ID是最新的
    checkoutData.value.userAddressId = userAddress.value.id
    // 调用下单API
    const response = await axios.post('/api/order/checkout', checkoutData.value, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    const result = response.data;
    /*console.log("提交支付result is :",result)
    console.log("提交支付result.data is :",result.data)*/
    if (result.code === 200) {
      console.log("提交支付result.data is :",result.data)
      ElMessage.success('下单成功')
      sessionStorage.removeItem('checkoutData')
      const orderId = result.data.id
      console.log("订单id orderId  is :",orderId)
      router.push({
        path: '/orders/PaymentChannel',
        query: {
          orderId: orderId
        }
      })
      //router.push('/orders/PaymentChannel')
    } else {
      ElMessage.error(result.message || '下单失败')
    }
  } catch (error) {
    console.error('下单失败:', error)
    ElMessage.error('网络错误，请重试')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCheckoutData()
})
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background-color: #0f172a;
  color: #e2e8f0;
  padding-top: 80px;
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

.checkout-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.summary-card, .products-section {
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

.products-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
  align-items: center;
  padding: 16px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.product-item:hover {
  background: rgba(15, 23, 42, 0.7);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-id {
  color: #f1f5f9;
  font-size: 14px;
  font-weight: 500;
}

.product-spec {
  color: #94a3b8;
  font-size: 12px;
  font-family: 'Courier New', monospace;
}

.product-price {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: right;
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 500;
}

.product-price span {
  display: block;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
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
  .checkout-page {
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

  .product-item {
    grid-template-columns: 1fr;
    gap: 12px;
    text-align: center;
  }

  .product-price {
    text-align: center;
    flex-direction: row;
    justify-content: center;
    gap: 15px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 15px;
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
  .checkout-page {
    padding: 10px;
  }

  .summary-card, .products-section {
    padding: 15px;
  }

  .product-item {
    padding: 12px;
  }

  .section-title {
    font-size: 18px;
  }

  .product-price {
    flex-direction: column;
    gap: 5px;
  }
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #94a3b8;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 16px;
  margin-bottom: 8px;
}

.empty-subtext {
  font-size: 14px;
  opacity: 0.7;
}

/* 加载状态样式 */
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.loading-spinner::after {
  content: '';
  width: 40px;
  height: 40px;
  border: 3px solid rgba(59, 130, 246, 0.3);
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 金额高亮样式 */
.amount-highlight {
  color: #10b981;
  font-weight: 600;
}

.amount-total {
  color: #3b82f6;
  font-size: 18px;
  font-weight: 700;
}

/* 商品状态指示器 */
.status-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}

.status-available {
  background-color: #10b981;
}

.status-unavailable {
  background-color: #ef4444;
}

/* 打印样式 */
@media print {
  .action-buttons {
    display: none;
  }

  .checkout-page {
    background: white;
    color: black;
    padding: 0;
  }

  .summary-card, .products-section {
    background: white;
    border: 1px solid #ddd;
    box-shadow: none;
  }
}
</style>