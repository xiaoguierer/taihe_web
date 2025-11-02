<template>
  <div class="cart-item-card" :class="{ 'invalid-item': !item.isValid }">
    <div class="item-select">
      <el-checkbox
        v-model="selected"
        :disabled="!item.isValid"
        @change="handleSelectionChange"
      />
    </div>

    <div class="item-image" @click="goToProductDetail">
      <img :src="item.product.image" :alt="item.product.name">
    </div>

    <div class="item-info">
      <div class="product-name" @click="goToProductDetail">{{ item.product.name }}</div>
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
        v-model="quantity"
        :min="1"
        :max="item.product.stock"
        :disabled="!item.isValid"
        @change="handleQuantityChange"
      />
    </div>

    <div class="item-subtotal">
      <div class="subtotal">¥{{ (item.product.price * item.quantity).toFixed(2) }}</div>
    </div>

    <div class="item-actions">
      <el-button
        type="danger"
        text
        :icon="Delete"
        @click="handleRemove"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Delete, Warning } from '@element-plus/icons-vue'

const router = useRouter()
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update-selection', 'update-quantity', 'remove-item'])

const selected = ref(props.item.selected)
const quantity = ref(props.item.quantity)

// 监听props变化
watch(() => props.item.selected, (newVal) => {
  selected.value = newVal
})

watch(() => props.item.quantity, (newVal) => {
  quantity.value = newVal
})

const handleSelectionChange = (value) => {
  emit('update-selection', props.item.id, value)
}

const handleQuantityChange = (value) => {
  if (value !== props.item.quantity) {
    emit('update-quantity', props.item.id, value)
  }
}

const handleRemove = () => {
  emit('remove-item', props.item.id)
}

const goToProductDetail = () => {
  router.push(`/product/${props.item.product.id}`)
}
</script>

<style scoped>
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

@media (max-width: 768px) {
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
</style>
