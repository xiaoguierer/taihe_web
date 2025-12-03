<template>
  <div class="cart-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">购物车</h1>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner">正在加载购物车数据...</div>
    </div>

    <!-- 购物车内容 -->
    <div v-else class="cart-content">
      <!-- 全选操作栏 -->
      <div class="select-all-bar" v-if="cartItems.length > 0">
        <el-checkbox
          :model-value="isAllSelected"
          @change="handleSelectAll"
        >
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
          <el-button type="primary" @click="$router.push('/')">去逛逛</el-button>
        </div>

        <!-- 商品卡片 -->
        <div v-for="item in cartItems" :key="item.id" class="cart-item-card">
          <div class="item-select">
            <el-checkbox
              :model-value="item.selected === 1"
              @change="(val) => handleSelectItem(item.id, val)"
            />
          </div>

          <div class="item-image">
            <div class="image-placeholder">📦</div>
          </div>

          <div class="item-info">
            <div class="product-name">{{ item.productName || `商品 ${item.skuId}` }}</div>
            <div class="product-spec">SKU: {{ item.skuId }}</div>
            <div class="product-price">单价: ¥{{ (item.unitPrice || 0).toFixed(2) }}</div>
          </div>

          <div class="item-quantity">
            <el-input-number
              v-model="item.quantity"
              :min="1"
              :max="10"
              @change="(val) => handleQuantityChange(item.id, val)"
            />
          </div>

          <div class="item-subtotal">
            <div class="subtotal">¥{{ ((item.unitPrice || 0) * item.quantity).toFixed(2) }}</div>
          </div>

          <div class="item-actions">
            <el-button type="danger" text @click="handleRemoveItem(item.id)">
              删除
            </el-button>
          </div>
        </div>
      </div>

      <!-- 汇总信息 -->
      <div class="summary-section" v-if="cartItems.length > 0">
        <div class="summary-content">
          <div class="summary-info">
            <span class="selected-count">已选 {{ selectedCount }} 件商品</span>
            <span class="total-amount">总计: ¥{{ totalAmount.toFixed(2) }}</span>
          </div>
          <el-button
            type="primary"
            size="large"
            class="checkout-btn"
            @click="handleCheckout"
            :disabled="selectedCount === 0"
          >
            去结算
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/store/auth'

// 🔹 1. 获取路由实例 & Pinia store
const router = useRouter()
const authStore = useAuthStore()
const userId = authStore.userInfo?.userId
const token = authStore.token // 假设你的 authStore 有 token 字段，如没有请补充

console.info("-----userId  -----:",userId)

// 🔹 2. 响应式数据定义
const loading = ref(false)
const cartItems = ref([])

// 分页参数（虽然你当前只取第一页，但保留结构以备扩展）
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 🔹 3. 接口方法封装

// 获取购物车列表
const getCartList = async (queryDTO, page = 1, size = 50) => {
  try {
    const response = await fetch(`/api/shopingcart/pageLst?page=${page}&size=${size}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 如果后端需要身份验证，请加上这一行 👇
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(queryDTO)
    })
    return await response.json()
  } catch (error) {
    console.error('获取购物车数据失败:', error)
    throw error
  }
}

// 更新购物车项（比如数量、选中状态）
const updateCartItem = async (id, data) => {
  try {
    const response = await fetch(`/api/shopingcart/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // 如果后端需要身份验证，请加上这一行 👇
        // 'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(data)
    })
    return await response.json()
  } catch (error) {
    console.error('更新购物车项失败:', error)
    throw error
  }
}

// 删除购物车项
const deleteCartItem = async (id) => {
  try {
    const response = await fetch(`/api/shopingcart/del/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // 如果后端需要身份验证，请加上这一行 👇
        // 'Authorization': token ? `Bearer ${token}` : '',
      }
    })
    return await response.json()
  } catch (error) {
    console.error('删除购物车项失败:', error)
    throw error
  }
}

// 🔹 4. 加载购物车数据
const loadCartData = async () => {
  loading.value = true
  try {
    const queryDTO = { userId }  // 传入当前用户 ID

    const response = await getCartList(queryDTO, pagination.currentPage, pagination.pageSize)

    if (response.code === 200) {
      cartItems.value = (response.data.list || []).map(item => ({
        ...item,
        selected: item.selected ?? 0,         // 默认未选中
        isValid: item.isValid !== false,     // 默认有效
        quantity: item.quantity ?? 1         // 默认数量为 1
      }))
      pagination.total = response.data.total ?? 0
    } else {
      ElMessage.error(response.message || '获取购物车数据失败')
      cartItems.value = []
    }
  } catch (error) {
    console.error('加载购物车数据异常:', error)
    ElMessage.error('网络错误，请稍后重试')
    cartItems.value = []
  } finally {
    loading.value = false
  }
}

// 🔹 5. 计算属性

// 已勾选的有效商品
const selectedItems = computed(() => {
  return cartItems.value.filter(item => item.selected === 1 && item.isValid)
})

// 已勾选商品的总数量
const selectedCount = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

// 已勾选商品的总金额
const totalAmount = computed(() => {
  return selectedItems.value.reduce((sum, item) => {
    return sum + (item.unitPrice * item.quantity)
  }, 0)
})

// 是否全选（仅针对有效的商品）
const isAllSelected = computed(() => {
  const validItems = cartItems.value.filter(item => item.isValid !== false)
  return validItems.length > 0 && validItems.every(item => item.selected === 1)
})

// 🔹 6. 方法定义

// 修改商品数量
const handleQuantityChange = async (itemId, quantity) => {
  if (quantity < 1) return
  const item = cartItems.value.find(item => item.id === itemId)
  if (!item) return

  try {
    await updateCartItem(itemId, { quantity })
    item.quantity = quantity
    ElMessage.success('数量已更新')
  } catch (error) {
    console.error('更新数量失败:', error)
    ElMessage.error('更新失败')
  }
}

// 删除商品
const handleRemoveItem = async (itemId) => {
  try {
    await ElMessageBox.confirm('确定要删除这个商品吗？', '提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })

    const response = await deleteCartItem(itemId)
    if (response.code === 200) {
      ElMessage.success('商品已删除')
      await loadCartData() // 重新加载列表
    } else {
      ElMessage.error(response.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除商品失败:', error)
      ElMessage.error('删除失败，请重试')
    }
  }
}

// 勾选/取消勾选单个商品
const handleSelectItem = async (itemId, selected) => {
  const item = cartItems.value.find(item => item.id === itemId)
  if (!item) return

  try {
    await updateCartItem(itemId, { selected: selected ? 1 : 0 })
    item.selected = selected ? 1 : 0
  } catch (error) {
    console.error('更新选中状态失败:', error)
    ElMessage.error('操作失败')
  }
}

// 全选 / 取消全选
const handleSelectAll = async (selected) => {
  try {
    const updatePromises = cartItems.value
      .filter(item => item.isValid !== false)
      .map(item => {
        item.selected = selected ? 1 : 0
        return updateCartItem(item.id, { selected: item.selected })
      })

    await Promise.all(updatePromises)
    ElMessage.success(selected ? '已全选' : '已取消全选')
  } catch (error) {
    console.error('全选操作失败:', error)
    ElMessage.error('操作失败')
  }
}

// 去结算
const handleCheckout = () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请选择要结算的商品')
    return
  }
  ElMessage.success('跳转到结算页面')
  // TODO: 实际项目中替换为真实跳转，如：router.push('/checkout')
  // router.push('/checkout')
}

// 🔹 7. 页面初始化加载
onMounted(() => {
  if (!userId) {
    ElMessage.warning('请先登录')
    router.push('/login') // 请确保你有登录页路由
    return
  }
  loadCartData()
})

// 🔹 8. 暴露给模板的数据与方法（在 <script setup> 中无需手动 return，它们天然可用）
// 所有用到的：loading, cartItems, selectedCount, totalAmount, isAllSelected...
// 以及：handleQuantityChange, handleRemoveItem, handleSelectItem, handleSelectAll, handleCheckout
// 都可以直接在 <template> 中使用，无需 return！
</script>


<style scoped>
.cart-page {
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
  margin-bottom: 20px;
  margin-top: 80px;
}

.page-title {
  font-size: 28px;
  color: #f1f5f9;
  font-weight: 600;
  margin: 0;
}

.loading-container {
  padding: 40px 20px;
  text-align: center;
}

.loading-spinner {
  color: #94a3b8;
  font-size: 16px;
}

.select-all-bar {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background: rgba(30, 41, 59, 0.8);
  border-radius: 12px;
  margin-bottom: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  padding: 80px 20px;
  background: rgba(30, 41, 59, 0.8);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
  color: #e2e8f0;
}

.empty-text {
  font-size: 20px;
  color: #f1f5f9;
  margin-bottom: 10px;
  font-weight: 500;
}

.empty-subtext {
  color: #94a3b8;
  margin-bottom: 20px;
  font-size: 14px;
}

.cart-item-card {
  display: grid;
  grid-template-columns: 50px 100px 1fr auto auto auto 100px;
  gap: 20px;
  align-items: center;
  padding: 20px;
  background: rgba(30, 41, 59, 0.8);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
}

.cart-item-card:hover {
  background: rgba(30, 41, 59, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.2);
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
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.image-placeholder {
  font-size: 40px;
  opacity: 0.7;
  color: #e2e8f0;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #e2e8f0;
}

.product-name {
  font-size: 16px;
  color: #f1f5f9;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s ease;
  margin: 0;
}

.product-name:hover {
  color: #60a5fa;
}

.product-spec, .product-price {
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
}

.item-quantity {
  display: flex;
  justify-content: center;
}

.item-subtotal {
  text-align: right;
}

.subtotal {
  font-size: 16px;
  color: #f1f5f9;
  font-weight: 600;
  margin: 0;
}

.item-actions {
  display: flex;
  justify-content: center;
}

.summary-section {
  position: sticky;
  bottom: 20px;
  margin-top: 20px;
  background: rgba(30, 41, 59, 0.9);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.summary-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.summary-info .selected-count {
  color: #94a3b8;
  font-size: 14px;
}

.total-amount {
  font-size: 24px;
  font-weight: 600;
  color: #3b82f6;
  margin: 0;
}

.checkout-btn {
  width: 140px;
  height: 50px;
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: white;
}

.checkout-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  background: linear-gradient(135deg, #2563eb, #3b82f6);
}

.checkout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  background: #64748b;
}

/* 响应式设计 */
@media (max-width: 968px) {
  .cart-item-card {
    grid-template-columns: 40px 80px 1fr;
    grid-template-rows: auto auto;
    gap: 15px;
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
    margin-top: 10px;
  }

  .item-price::before {
    content: "单价：";
    color: #94a3b8;
    font-size: 14px;
  }

  .item-subtotal::before {
    content: "小计：";
    color: #94a3b8;
    font-size: 14px;
  }

  .summary-content {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .checkout-btn {
    width: 100%;
    margin-top: 10px;
  }
}

@media (max-width: 768px) {
  .cart-page {
    padding: 15px;
  }

  .page-header {
    margin-top: 60px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .page-title {
    font-size: 24px;
  }

  .cart-item-card {
    gap: 12px;
    padding: 12px;
  }

  .item-image {
    width: 80px;
    height: 80px;
  }

  .image-placeholder {
    font-size: 32px;
  }
}

/* Element Plus 组件样式覆盖 - 确保在深色主题下可见 */
:deep(.el-checkbox) {
  color: #e2e8f0;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

:deep(.el-checkbox__inner) {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 03);
}

:deep(.el-checkbox__label) {
  color: #e2e8f0;
  font-size: 14px;
}

:deep(.el-input-number) {
  width: 120px;
}

:deep(.el-input-number .el-input__inner) {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  color: #e2e8f0 !important;
  font-weight: 500;
  text-align: center;
}

:deep(.el-input-number .el-input-number__decrease),
:deep(.el-input-number .el-input-number__increase) {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #e2e8f0 !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  width: 32px;
}

:deep(.el-input-number .el-input-number__decrease:hover),
:deep(.el-input-number .el-input-number__increase:hover) {
  background: rgba(255, 255, 255, 0.2) !important;
  color: #ffffff !important;
}

:deep(.el-input-number.is-disabled .el-input__inner) {
  background: rgba(255, 255, 255, 0.02) !important;
  color: #94a3b8 !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.el-input__inner) {
  background: rgba(255, 255, 2550.05);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #e2e8f0;
}

:deep(.el-input__inner:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

:deep(.el-button--danger) {
  color: #ef4444;
  background: transparent;
  border: none;
}

:deep(.el-button--danger:hover) {
  color: #dc2626;
  background: rgba(239, 68, 68, 0.1);
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  border: none;
  color: white;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white;
}

:deep(.el-button--primary:disabled) {
  background: #64748b;
  color: #cbd5e1;
  cursor: not-allowed;
}

:deep(.el-message) {
  background: rgba(30, 41, 59, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
}

:deep(.el-message-box) {
  background: rgba(30, 41, 59, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
}

:deep(.el-message-box__content) {
  color: #e2e8f0;
}
</style>
