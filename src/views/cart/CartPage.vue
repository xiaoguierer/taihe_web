<template>
  <div class="cart-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">Cart</h1>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner">Loading shopping cart data...</div>
    </div>

    <!-- 购物车内容 -->
    <div v-else class="cart-content">
      <!-- 全选操作栏 -->
      <div class="select-all-bar" v-if="cartItems.length > 0">
        <el-checkbox
          :model-value="isAllSelected"
          @change="handleSelectAll"
        >
          Select All
        </el-checkbox>
        <span class="selected-count">You have chosen {{ selectedCount }} item(s)</span>
      </div>

      <!-- 商品列表 -->
      <div class="product-list">
        <div v-if="cartItems.length === 0" class="empty-cart">
          <div class="empty-icon">🛒</div>
          <div class="empty-text">Your cart is empty.</div>
          <div class="empty-subtext">Shop your favorites now!</div>
          <el-button type="primary" @click="$router.push('/')">Start browsing now!</el-button>
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
            <div class="image-placeholder">📦
              <img
                  :src="item.skumainImageUrl"
                  :alt="item.skumainImageUrl"
                  @click="navigateToIntentProducts(item.spuId)"
                  class="adaptive-image fill-image"
              />
            </div>
          </div>

          <div class="item-info" @click="navigateToIntentProducts(item.spuId)">
            <div class="product-name">{{ item.productNameEn}} {{ item.skuNameEn}}</div>
            <div class="product-price">Unit price: ${{ (item.unitPrice || 0).toFixed(2) }}</div>
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
            <div class="subtotal">${{ ((item.unitPrice || 0) * item.quantity).toFixed(2) }}</div>
          </div>

          <div class="item-actions">
            <el-button type="danger" text @click="handleRemoveItem(item.id)">
              Remove
            </el-button>
          </div>
        </div>
      </div>

      <!-- 汇总信息 -->
      <div class="summary-section" v-if="cartItems.length > 0">
        <div class="summary-content">
          <div class="summary-info">
            <span class="selected-count">Selected: {{ selectedCount }} item(s)</span>
            <span class="total-amount">Subtotal: ${{ totalAmount.toFixed(2) }}</span>
          </div>
          <el-button
            type="primary"
            size="large"
            class="checkout-btn"
            @click="handleCheckout"
            :disabled="selectedCount === 0"
          >
            Go to checkout
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
import axios from "axios";

// 🔹 1. 获取路由实例 & Pinia store
const router = useRouter()
const authStore = useAuthStore()
const userId = authStore.userInfo?.userId
const token = authStore.token // 假设你的 authStore 有 token 字段，如没有请补充

// 🔹 2. 响应式数据定义
const loading = ref(false)
const cartItems = ref([])

// 分页参数（虽然你当前只取第一页，但保留结构以备扩展）
const pagination = reactive({
  currentPage: 1,
  pageSize: 50,
  total: 0
})

// 🔹 3. 接口方法封装

// 获取购物车列表
const getCartList = async (queryDTO, page = 1, size = 50) => {
  try {
    const response = await fetch(`/api/shopingcart/pageLstDetail?page=${page}&size=${size}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
  console.log("🔄 更新购物车项:", { id, data });
  // 找到对应的购物车项，获取spuId等必填字段
  const cartItem = cartItems.value.find(item => item.id === id);
  if (!cartItem) {
    throw new Error(`未找到ID为 ${id} 的购物车项`);
  }
  const updateDTO = {
    id: cartItem.id,                    // 必填：购物车项ID
    userId: userId,            // 可选：用户ID
    skuId: cartItem.skuId,     // 可选：商品SKU ID
    spuId: cartItem.spuId,     // 必填：商品SPU ID
    quantity: cartItem.quantity, // 可选：购买数量
    selected:cartItem.selected, // 是否选中 0-否, 1-是"
    unitPrice: cartItem.unitPrice, // 可选：单价
    currency: cartItem.currency || 'USD', // 可选：货币
    ...data                    // 更新的字段（selected, quantity等）
  };
  console.log("📤 发送的DTO:", updateDTO);
  try {
    const response = await fetch(`/api/shopingcart/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(updateDTO)
    })
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    const result = await response.json();
    console.log("✅ 更新成功:", result);
    return result;
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
        'Authorization': token ? `Bearer ${token}` : '',
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
    console.log("response 返回结果是：",response)
    if (response.code === 200) {
      cartItems.value = (response.data.list || []).map(item => ({
        ...item,
        selected: item.selected ?? 0,         // 默认未选中
        isValid: item.isValid !== false,     // 默认有效
        quantity: item.quantity ?? 1         // 默认数量为 1
      }))
      console.log("response.data 返回结果是：",response.data)
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
const navigateToIntentProducts = (spuId) =>{
  if (!spuId || spuId.includes('placeholder')) return
  router.push(`/product-spu/getByid/${spuId}`)
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
  // 保存旧值用于回滚
  const oldQuantity = item.quantity;
  try {
    item.quantity = quantity;
    await updateCartItem(itemId, { quantity })
    ElMessage.success('数量已更新')
  } catch (error) {
    // API失败时回滚前端状态
    item.quantity = oldQuantity;
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
  // 保存旧值用于回滚
  const oldSelected = item.selected;
  try {
    item.selected = selected ? 1 : 0
    await updateCartItem(itemId, { selected: selected ? 1 : 0 })
  } catch (error) {
    // API失败时回滚前端状态
    item.selected = oldSelected;
    console.error('更新选中状态失败:', error)
    ElMessage.error('操作失败')
  }
}

// 全选 / 取消全选
const handleSelectAll = async (selected) => {
  const validItems = cartItems.value.filter(item => item.isValid !== false);
  if (validItems.length === 0) return;
  // 保存旧状态用于回滚
  const oldStates = validItems.map(item => ({
    id: item.id,
    selected: item.selected
  }));
  try {
    // 先更新所有前端状态
    validItems.forEach(item => {
      item.selected = selected ? 1 : 0;
    });
    // 批量调用API - 现在包含所有必填字段
    const updatePromises = validItems.map(item =>
        updateCartItem(item.id, { selected: item.selected })
    );
    await Promise.all(updatePromises);
    ElMessage.success(selected ? '已全选' : '已取消全选');
  } catch (error) {
    // API失败时回滚所有前端状态
    oldStates.forEach(oldState => {
      const item = cartItems.value.find(item => item.id === oldState.id);
      if (item) item.selected = oldState.selected;
    });
    console.error('全选操作失败:', error);
    ElMessage.error('操作失败，请重试');
  }
}

// 去结算
const handleCheckout = async () => {
  if (!authStore.isLoggedIn) {
    alert('⚠️ 用户未登录，请先登录！')
    const url = `/users/login`
    router.push(url)// 通过路由路径导航
  }
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请选择要结算的商品')
    return
  }
  const checkoutData = {
    userId: userId,
    totalAmount: totalAmount.value.toFixed(2),//总金额
    SkuCount: selectedCount.value,//商品数量
    SpuCount: selectedItems.value.length,//商品种类
    items: selectedItems.value.map(item => ({
      cartItemId: item.id,//购物车id
      spuId: item.spuId,//spuid
      skuId: item.skuId,// skuid
      skumainImageUrl:item.skumainImageUrl,//sku图片
      productNameEn:item.productNameEn,//spu名称
      skuNameEn:item.skuNameEn,//sku名称
      unitPrice: (item.unitPrice || 0).toFixed(2),//单价
      quantity: item.quantity,  //sku数量
      subtotal: ((item.unitPrice || 0) * item.quantity).toFixed(2) //小计
    }))
  }
  console.log('结构化结算数据:', checkoutData)
  sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData))
  console.log('数据已存储到sessionStorage')
  router.push('/orders/OrderConfirmation')
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
  color: #ffff00;
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
  background-color: #facc15; /* 黄色 */
  color: #000000; /* 黑色文字 */
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
