<template>
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
</template>

<script setup>
defineProps({
  selectedItems: {
    type: Array,
    default: () => []
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  shippingFee: {
    type: Number,
    default: 0
  },
  finalAmount: {
    type: Number,
    default: 0
  },
  isCheckoutDisabled: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['checkout'])

const handleCheckout = () => {
  emit('checkout')
}
</script>

<style scoped>
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

@media (max-width: 968px) {
  .cart-summary-bar {
    border-radius: 0;
    padding: 15px;
  }

  .summary-header {
    margin-bottom: 15px;
  }

  .summary-details {
    margin-bottom: 15px;
  }
}
</style>
