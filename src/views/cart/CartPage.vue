<template>
  <div class="cart-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">购物车</h1>
      <div class="header-actions">
        <el-button type="text" @click="clearCart">清空购物车</el-button>
      </div>
    </div>

    <!-- 顶部提示条 -->

    <!-- 购物车内容区域 -->
    <div class="cart-content">
      <!-- 商品列表区 -->
      <div class="product-list-section">
        <!-- 全选操作栏 -->
        <div class="select-all-bar">
          <el-checkbox v-model="selectAll" @change="handleSelectAll">
            全选
          </el-checkbox>
          <span class="selected-count">已选 {{ selectedCount }} 件商品</span>
        </div>

        <!-- 商品列表 -->
        <div class="product-list">
          <div v-if="cartItems.length === 0" class="empty-cart">
            <div class="empty-icon">🛒</div>
            <div class="empty-text">购物车是空的</div>
            <div class="empty-subtext">快去挑选心仪的商品吧</div>
            <el-button type="primary" @click="goShopping">去逛逛</el-button>
          </div>

          <!-- 商品卡片 -->
          <div v-for="item in cartItems" :key="item.id" class="cart-item-card" :class="{ 'invalid-item': !item.isValid }">
            <div class="item-select">
              <el-checkbox
                v-model="item.selected"
                :disabled="!item.isValid"
                @change="(val) => handleItemSelection(item.id, val)"
              />
            </div>

            <div class="item-image" @click="goToProductDetail(item.product.id)">
              <img :src="item.product.image" :alt="item.product.name">
            </div>

            <div class="item-info">
              <div class="product-name" @click="goToProductDetail(item.product.id)">{{ item.product.name }}</div>
              <div class="product-spec">{{ item.product.spec }}</div>
              <div v-if="!item.isValid" class="stock-warning">
                <el-icon><Warning /></el-icon>
                <span>库存不足</span>
              </div>
            </div>

            <div class="item-price">
              <div class="price">¥{{ item.product.price.toFixed(2) }}</div>
            </div>

            <div class="item-quantity">
              <el-input-number
                v-model="item.quantity"
                :min="1"
                :max="item.product.stock"
                :disabled="!item.isValid"
                @change="(val) => handleQuantityChange(item.id, val)"
              />
            </div>

            <div class="item-subtotal">
              <div class="subtotal">¥{{ (item.product.price * item.quantity).toFixed(2) }}</div>
            </div>

            <div class="item-actions">
              <el-button
                type="danger"
                text
                @click="handleRemoveItem(item.id)"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>

        <!-- 促销与优惠区 -->
<!--        <div v-if="cartItems.length > 0" class="promotion-section">-->
<!--          <div class="section-title">优惠活动</div>-->
<!--          <div class="coupon-area">-->
<!--            <div class="coupon-info">-->
<!--              <span class="coupon-text">您有 {{ availableCoupons.length }} 张优惠券可用</span>-->
<!--              <el-button type="text" @click="showCouponDialog = true">查看优惠券</el-button>-->
<!--            </div>-->
<!--            <div v-if="shippingPromotion" class="shipping-promotion">-->
<!--              <span class="promotion-text">再购 ¥{{ shippingPromotion.remainingAmount }} 即可享受免邮</span>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->

        <!-- 关联推荐区 -->
        <div v-if="cartItems.length > 0" class="recommendation-section">
          <div class="section-title">猜你喜欢</div>
          <div class="recommendation-list">
            <div v-for="product in recommendedProducts" :key="product.id" class="recommendation-item">
              <div class="rec-image" @click="goToProductDetail(product.id)">
                <img :src="product.image" :alt="product.name">
              </div>
              <div class="rec-info">
                <div class="rec-name" @click="goToProductDetail(product.id)">{{ product.name }}</div>
                <div class="rec-price">¥{{ product.price.toFixed(2) }}</div>
                <el-button size="small" @click="addToCart(product)">加入购物车</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部汇总栏 -->
      <div class="summary-section">
        <div class="cart-summary-bar">
          <div class="summary-content">
            <div class="summary-header">
              <h3>订单汇总</h3>
            </div>

            <div class="summary-details">
              <div class="detail-item">
                <span class="label">商品总数：</span>
                <span class="value">{{ selectedItems.length }}件</span>
              </div>

              <div class="detail-item">
                <span class="label">商品小计：</span>
                <span class="value">¥{{ totalAmount.toFixed(2) }}</span>
              </div>

              <div class="detail-item">
                <span class="label">运费：</span>
                <span class="value" :class="{ 'free-shipping': shippingFee === 0 }">
                  {{ shippingFee === 0 ? '免费' : `¥${shippingFee.toFixed(2)}` }}
                </span>
              </div>

              <div class="detail-item" v-if="discountAmount > 0">
                <span class="label">优惠：</span>
                <span class="value discount">-¥{{ discountAmount.toFixed(2) }}</span>
              </div>

              <div class="divider"></div>

              <div class="detail-item total">
                <span class="label">实付款：</span>
                <span class="value total-amount">¥{{ finalAmount.toFixed(2) }}</span>
              </div>
            </div>

            <div class="summary-actions">
              <el-button
                type="primary"
                size="large"
                :disabled="isCheckoutDisabled"
                @click="handleCheckout"
                class="checkout-btn"
              >
                去结算
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 优惠券选择对话框 -->
    <el-dialog
      v-model="showCouponDialog"
      title="选择优惠券"
      width="500px"
    >
      <div class="coupon-list">
        <div v-for="coupon in availableCoupons" :key="coupon.id" class="coupon-item">
          <div class="coupon-content">
            <div class="coupon-value">
              <span class="value">¥{{ coupon.value }}</span>
              <span class="condition">满{{ coupon.minAmount }}可用</span>
            </div>
            <div class="coupon-info">
              <div class="coupon-name">{{ coupon.name }}</div>
              <div class="coupon-date">有效期至 {{ formatDate(coupon.expiryDate) }}</div>
            </div>
          </div>
          <el-button
            :type="selectedCoupon?.id === coupon.id ? 'primary' : 'default'"
            @click="selectCoupon(coupon)"
          >
            {{ selectedCoupon?.id === coupon.id ? '已选择' : '选择' }}
          </el-button>
        </div>
      </div>
      <template #footer>
        <el-button @click="showCouponDialog = false">取消</el-button>
        <el-button type="primary" @click="applyCoupon">确认</el-button>
      </template>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog
      v-model="showDeleteConfirm"
      title="确认删除"
      width="400px"
    >
      <p>确定要删除「{{ itemToDelete?.product.name }}」吗？</p>
      <template #footer>
        <el-button @click="showDeleteConfirm = false">取消</el-button>
        <el-button type="primary" @click="confirmDelete">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'CartPage',
  setup() {
    const router = useRouter()

    // 购物车数据
    const cartItems = ref([
      {
        id: 'cart_001',
        selected: true,
        product: {
          id: 'P001',
          name: '璀璨钻石项链',
          image: 'https://img2.baidu.com/it/u=2414743278,241672380&fm=253&app=138&f=JPEG?w=1067&h=800',
          spec: '链长40cm，玫瑰金',
          price: 2580.00,
          stock: 5
        },
        quantity: 1,
        isValid: true
      },
      {
        id: 'cart_002',
        selected: true,
        product: {
          id: 'P002',
          name: '蓝宝石耳环',
          image: 'https://img2.baidu.com/it/u=2414743278,241672380&fm=253&app=138&f=JPEG?w=1067&h=800',
          spec: '单只，铂金',
          price: 1945.00,
          stock: 3
        },
        quantity: 2,
        isValid: true
      },{
        id: 'cart_001',
        selected: true,
        product: {
          id: 'P001',
          name: '璀璨钻石项链',
          image: 'https://img2.baidu.com/it/u=2414743278,241672380&fm=253&app=138&f=JPEG?w=1067&h=800',
          spec: '链长40cm，玫瑰金',
          price: 2580.00,
          stock: 5
        },
        quantity: 1,
        isValid: true
      },
      {
        id: 'cart_002',
        selected: true,
        product: {
          id: 'P002',
          name: '蓝宝石耳环',
          image: 'https://img2.baidu.com/it/u=2414743278,241672380&fm=253&app=138&f=JPEG?w=1067&h=800',
          spec: '单只，铂金',
          price: 1945.00,
          stock: 3
        },
        quantity: 2,
        isValid: true
      }
    ])

    // 优惠券相关
    const showCouponDialog = ref(false)
    const availableCoupons = ref([
      {
        id: 'coupon_001',
        name: '新用户优惠券',
        value: 100,
        minAmount: 1000,
        expiryDate: '2023-12-31'
      }
    ])
    const selectedCoupon = ref(null)

    // 删除确认相关
    const showDeleteConfirm = ref(false)
    const itemToDelete = ref(null)

    // 推荐商品
    const recommendedProducts = ref([
      {
        id: 'P004',
        name: '祖母绿复古戒指',
        image: 'https://img0.baidu.com/it/u=2177321691,711594086&fm=253&app=138&f=JPEG?w=1067&h=800',
        price: 3200.00
      },{
        id: 'P004',
        name: '祖母绿复古戒指',
        image: 'https://img0.baidu.com/it/u=2177321691,711594086&fm=253&app=138&f=JPEG?w=1067&h=800',
        price: 3000.00
      }, {
        id: 'P004',
        name: '祖母绿复古戒指',
        image: 'https://img0.baidu.com/it/u=2177321691,711594086&fm=253&app=138&f=JPEG?w=1067&h=800',
        price: 3200.00
      },{
        id: 'P004',
        name: '祖母绿复古戒指',
        image: 'https://img0.baidu.com/it/u=2177321691,711594086&fm=253&app=138&f=JPEG?w=1067&h=800',
        price: 3000.00
      }, {
        id: 'P004',
        name: '祖母绿复古戒指',
        image: 'https://img0.baidu.com/it/u=2177321691,711594086&fm=253&app=138&f=JPEG?w=1067&h=800',
        price: 3200.00
      },{
        id: 'P004',
        name: '祖母绿复古戒指',
        image: 'https://img0.baidu.com/it/u=2177321691,711594086&fm=253&app=138&f=JPEG?w=1067&h=800',
        price: 3000.00
      }
    ])

    // 计算属性
    const selectedItems = computed(() => {
      return cartItems.value.filter(item => item.selected && item.isValid)
    })

    const selectedCount = computed(() => {
      return selectedItems.value.reduce((sum, item) => sum + item.quantity, 0)
    })

    const selectAll = computed({
      get: () => {
        const validItems = cartItems.value.filter(item => item.isValid)
        return validItems.length > 0 && validItems.every(item => item.selected)
      },
      set: (value) => {
        cartItems.value.forEach(item => {
          if (item.isValid) {
            item.selected = value
          }
        })
      }
    })

    const totalAmount = computed(() => {
      return selectedItems.value.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity)
      }, 0)
    })

    const discountAmount = computed(() => {
      if (selectedCoupon.value && totalAmount.value >= selectedCoupon.value.minAmount) {
        return selectedCoupon.value.value
      }
      return 0
    })

    const shippingFee = computed(() => {
      return totalAmount.value >= 5000 ? 0 : 15
    })

    const finalAmount = computed(() => {
      return totalAmount.value - discountAmount.value + shippingFee.value
    })

    const isCheckoutDisabled = computed(() => {
      return selectedItems.value.length === 0 || selectedItems.value.some(item => !item.isValid)
    })

    // 方法
    const handleSelectAll = (value) => {
      cartItems.value.forEach(item => {
        if (item.isValid) {
          item.selected = value
        }
      })
    }

    const handleItemSelection = (itemId, selected) => {
      const item = cartItems.value.find(item => item.id === itemId)
      if (item) {
        item.selected = selected
      }
    }

    const handleQuantityChange = (itemId, quantity) => {
      const item = cartItems.value.find(item => item.id === itemId)
      if (item) {
        item.quantity = quantity
        ElMessage.success('购物车已更新')
      }
    }

    const handleRemoveItem = (itemId) => {
      itemToDelete.value = cartItems.value.find(item => item.id === itemId)
      showDeleteConfirm.value = true
    }

    const confirmDelete = () => {
      if (itemToDelete.value) {
        const index = cartItems.value.findIndex(item => item.id === itemToDelete.value.id)
        if (index !== -1) {
          cartItems.value.splice(index, 1)
          ElMessage.success('商品已删除')
        }
      }
      showDeleteConfirm.value = false
      itemToDelete.value = null
    }

    const selectCoupon = (coupon) => {
      selectedCoupon.value = coupon
    }

    const applyCoupon = () => {
      showCouponDialog.value = false
      if (selectedCoupon.value) {
        ElMessage.success(`已应用优惠券：${selectedCoupon.value.name}`)
      }
    }

    const handleCheckout = async () => {
      try {
        // 最后一次库存校验
        const validationResult = await validateCartItems()
        if (!validationResult.valid) {
          ElMessage.error(validationResult.message)
          return
        }

        // 跳转到结算页
        ElMessage.success('跳转到结算页面')
        // router.push('/checkout')
      } catch (error) {
        ElMessage.error('结算失败，请稍后重试')
      }
    }

    const validateCartItems = async () => {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))

      // 检查是否有无效商品
      const invalidItems = selectedItems.value.filter(item => !item.isValid)
      if (invalidItems.length > 0) {
        return {
          valid: false,
          message: '部分商品库存不足，请重新选择'
        }
      }

      return { valid: true }
    }

    const clearCart = async () => {
      try {
        await ElMessageBox.confirm('确定要清空购物车吗？', '提示', {
          type: 'warning'
        })
        cartItems.value = []
        ElMessage.success('购物车已清空')
      } catch {
        // 用户取消操作
      }
    }

    const addToCart = (product) => {
      const existingItem = cartItems.value.find(item => item.product.id === product.id)
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        cartItems.value.push({
          id: `cart_${Date.now()}`,
          selected: true,
          product: {
            ...product,
            stock: 10 // 默认库存
          },
          quantity: 1,
          isValid: true
        })
      }
      ElMessage.success('商品已加入购物车')
    }

    const goToProductDetail = (productId) => {
      ElMessage.info(`跳转到商品详情页: ${productId}`)
      // router.push(`/product/${productId}`)
    }

    const goShopping = () => {
      ElMessage.info('跳转到商品列表页')
      // router.push('/products')
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('zh-CN')
    }

    return {
      cartItems,
      showCouponDialog,
      availableCoupons,
      selectedCoupon,
      showDeleteConfirm,
      itemToDelete,
      recommendedProducts,
      selectedItems,
      selectedCount,
      selectAll,
      totalAmount,
      discountAmount,
      shippingFee,
      finalAmount,
      isCheckoutDisabled,
      handleSelectAll,
      handleItemSelection,
      handleQuantityChange,
      handleRemoveItem,
      confirmDelete,
      selectCoupon,
      applyCoupon,
      handleCheckout,
      clearCart,
      addToCart,
      goToProductDetail,
      goShopping,
      formatDate
    }
  }
}
</script>

<style scoped>
.cart-page {
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
  margin-bottom: 20px;
  margin-top: 80px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #f8fafc;
}

.cart-tip {
  margin-bottom: 20px;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
  position: relative;
}

.product-list-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.select-all-bar {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  margin-bottom: 10px;
}

.selected-count {
  color: #94a3b8;
  font-size: 14px;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-text {
  font-size: 20px;
  color: #f1f5f9;
  margin-bottom: 10px;
}

.empty-subtext {
  color: #94a3b8;
  margin-bottom: 20px;
}

.cart-item-card {
  display: grid;
  grid-template-columns: 50px 100px 1fr auto auto auto 50px;
  gap: 15px;
  align-items: center;
  padding: 20px;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  transition: all 0.3s;
}

.cart-item-card:hover {
  background: rgba(30, 41, 59, 0.8);
  transform: translateY(-2px);
}

.cart-item-card.invalid-item {
  opacity: 0.6;
  background: rgba(30, 41, 59, 0.4);
}

.item-select {
  display: flex;
  justify-content: center;
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-name {
  font-size: 16px;
  color: #f1f5f9;
  cursor: pointer;
  font-weight: 500;
}

.product-name:hover {
  color: #60a5fa;
}

.product-spec {
  font-size: 14px;
  color: #94a3b8;
}

.stock-warning {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #ef4444;
  font-size: 14px;
}

.item-price,
.item-subtotal {
  text-align: right;
}

.price,
.subtotal {
  font-size: 16px;
  color: #f1f5f9;
  font-weight: 600;
}

.item-quantity {
  display: flex;
  justify-content: center;
}

.item-actions {
  display: flex;
  justify-content: center;
}

.promotion-section,
.recommendation-section {
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  padding: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #f1f5f9;
  margin-bottom: 15px;
}

.coupon-area {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.coupon-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.coupon-text {
  color: #e2e8f0;
}

.shipping-promotion {
  padding: 10px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 6px;
}

.promotion-text {
  color: #22c55e;
  font-size: 14px;
}

.recommendation-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.recommendation-item {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 8px;
  padding: 15px;
  transition: transform 0.2s;
}

.recommendation-item:hover {
  transform: translateY(-2px);
}

.rec-image {
  width: 100%;
  height: 240px;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 10px;
  cursor: pointer;
}

.rec-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rec-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rec-name {
  color: #f1f5f9;
  font-size: 14px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rec-name:hover {
  color: #60a5fa;
}

.rec-price {
  color: #3b82f6;
  font-weight: 600;
  font-size: 16px;
}

.summary-section {
  position: sticky;
  top: 20px;
  height: fit-content;
}

.cart-summary-bar {
  background: rgba(30, 41, 59, 0.8);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.summary-header {
  margin-bottom: 20px;
}

.summary-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #f1f5f9;
  margin: 0;
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-item.total {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 12px;
  margin-top: 8px;
}

.label {
  color: #94a3b8;
  font-size: 14px;
}

.value {
  color: #e2e8f0;
  font-size: 14px;
}

.value.discount {
  color: #10b981;
}

.value.free-shipping {
  color: #10b981;
  font-weight: 500;
}

.total-amount {
  font-size: 20px;
  font-weight: 600;
  color: #3b82f6;
}

.divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 8px 0;
}

.summary-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkout-btn {
  width: 100%;
  height: 50px;
  font-size: 16px;
  font-weight: 500;
}

.checkout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.coupon-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.coupon-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.coupon-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.coupon-value {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.coupon-value .value {
  font-size: 20px;
  font-weight: 600;
  color: #3b82f6;
}

.coupon-value .condition {
  font-size: 12px;
  color: #94a3b8;
}

.coupon-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.coupon-name {
  color: #e2e8f0;
  font-weight: 500;
}

.coupon-date {
  font-size: 12px;
  color: #94a3b8;
}

@media (max-width: 968px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .summary-section {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(10px);
    padding: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .recommendation-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .cart-item-card {
    grid-template-columns: 40px 80px 1fr;
    grid-template-rows: auto auto;
    gap: 10px;
    padding: 15px;
  }

  .item-price,
  .item-quantity,
  .item-subtotal,
  .item-actions {
    grid-column: 1 / -1;
    justify-self: start;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .item-price::before {
    content: "单价：";
    color: #94a3b8;
  }

  .item-subtotal::before {
    content: "小计：";
    color: #94a3b8;
  }
}

@media (max-width: 768px) {
  .cart-page {
    padding: 15px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .recommendation-list {
    grid-template-columns: 1fr;
  }
}
</style>
