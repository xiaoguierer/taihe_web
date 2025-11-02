<template>
  <div class="order-card">
    <!-- 订单头部 -->
    <div class="order-header">
      <div class="order-info">
        <div class="order-info-item">
          <span class="info-label">订单号</span>
          <a class="info-value order-id" @click="emitAction('view-detail')">{{ order.id }}</a>
        </div>
        <div class="order-info-item">
          <span class="info-label">下单时间</span>
          <span class="info-value">{{ formatDate(order.createTime) }}</span>
        </div>
        <div class="order-info-item">
          <span class="info-label">实付金额</span>
          <span class="info-value">¥{{ order.totalAmount.toFixed(2) }}</span>
        </div>
      </div>
      <div :class="['order-status', `status-${order.status}`]">
        {{ getStatusText(order.status) }}
      </div>
    </div>

    <!-- 订单主体 -->
    <div class="order-body">
      <!-- 商品列表 -->
      <div class="product-list">
        <div v-for="(product, index) in visibleProducts"
             :key="product.id"
             class="product-item">
          <div class="product-image">
            <img :src="product.image" :alt="product.name">
          </div>
          <div class="product-details">
            <div>
              <div class="product-name" @click="goToProductDetail(product.id)">{{ product.name }}</div>
              <div class="product-spec">{{ product.spec }}</div>
            </div>
            <div>
              <span class="product-quantity">x{{ product.quantity }}</span>
              <span class="product-price">¥{{ product.price.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- 更多商品提示 -->
        <div v-if="order.products.length > 2" class="more-products" @click="toggleShowAll">
          {{ order.showAll ? '收起' : `及其他${order.products.length - 2}件商品` }}
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="order-actions">
        <button class="action-btn default-btn" @click="emitAction('view-detail')">订单详情</button>

        <!-- 根据订单状态显示不同按钮 -->
        <template v-if="order.status === 'pending_payment'">
          <button class="action-btn primary-btn" @click="emitAction('pay')">去支付</button>
          <button class="action-btn default-btn" @click="emitAction('cancel')">取消订单</button>
        </template>

        <template v-else-if="order.status === 'pending_shipment'">
          <button class="action-btn default-btn" @click="emitAction('remind')">提醒发货</button>
          <button class="action-btn default-btn" @click="emitAction('refund')">申请退款</button>
        </template>

        <template v-else-if="order.status === 'shipped'">
          <button class="action-btn default-btn" @click="emitAction('view-logistics')">查看物流</button>
          <button class="action-btn primary-btn" @click="emitAction('confirm')">确认收货</button>
        </template>

        <template v-else-if="order.status === 'pending_review'">
          <button class="action-btn default-btn" @click="emitAction('after-sale')">申请售后</button>
          <button class="action-btn primary-btn" @click="emitAction('review')">评价商品</button>
        </template>

        <template v-else-if="order.status === 'completed'">
          <button class="action-btn default-btn" @click="emitAction('after-sale')">申请售后</button>
          <button class="action-btn primary-btn" @click="emitAction('rebuy')">再次购买</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['order-action'])

// 计算可见商品列表
const visibleProducts = computed(() => {
  return props.order.showAll
    ? props.order.products
    : props.order.products.slice(0, 2)
})

// 状态文本映射
const statusTextMap = {
  pending_payment: '待付款',
  pending_shipment: '待发货',
  shipped: '待收货',
  pending_review: '待评价',
  completed: '交易成功'
}

// 触发操作事件
const emitAction = (action) => {
  emit('order-action', action, props.order)
}

// 切换显示全部商品
const toggleShowAll = () => {
  props.order.showAll = !props.order.showAll
}

// 格式化日期
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

// 获取状态文本
const getStatusText = (status) => {
  return statusTextMap[status] || status
}

// 跳转到商品详情
const goToProductDetail = (productId) => {
  router.push(`/product/${productId}`)
}
</script>

<style scoped>
.order-card {
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s, box-shadow 0.3s;
}

.order-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: rgba(15, 23, 42, 0.7);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.order-info {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.order-info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-label {
  font-size: 12px;
  color: #94a3b8;
}

.info-value {
  font-size: 14px;
  color: #e2e8f0;
}

.order-id {
  color: #60a5fa;
  cursor: pointer;
  text-decoration: none;
}

.order-id:hover {
  text-decoration: underline;
}

.order-status {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
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

.order-body {
  padding: 20px;
}

.product-list {
  margin-bottom: 20px;
}

.product-item {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.product-item:last-child {
  border-bottom: none;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 15px;
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 16px;
  color: #f1f5f9;
  margin-bottom: 5px;
  cursor: pointer;
}

.product-name:hover {
  color: #60a5fa;
}

.product-spec {
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 5px;
}

.product-quantity, .product-price {
  font-size: 14px;
  color: #cbd5e1;
}

.more-products {
  text-align: center;
  padding: 10px;
  color: #60a5fa;
  cursor: pointer;
  font-size: 14px;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.action-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.primary-btn {
  background: #3b82f6;
  color: white;
  border: none;
}

.primary-btn:hover {
  background: #2563eb;
}

.default-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.default-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

@media (max-width: 768px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .order-actions {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
