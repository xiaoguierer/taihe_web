<template>
  <div class="order-list-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">我的订单</h1>
      <p class="page-subtitle">管理您的所有订单，轻松追踪物流状态</p>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-sidebar">
      <div class="filter-row">
        <div class="filter-group">
          <span class="filter-label">时间筛选:</span>
          <el-select v-model="filters.timeRange" placeholder="选择时间范围" @change="handleFilterChange">
            <el-option label="近3个月订单" value="3m"></el-option>
            <el-option label="近6个月订单" value="6m"></el-option>
            <el-option label="今年内订单" value="year"></el-option>
            <el-option label="历史订单" value="history"></el-option>
            <el-option label="自定义时间" value="custom"></el-option>
          </el-select>
        </div>

        <div class="filter-group">
          <span class="filter-label">订单状态:</span>
          <el-radio-group v-model="filters.status" @change="handleFilterChange">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="pending_payment">待付款</el-radio-button>
            <el-radio-button label="pending_shipment">待发货</el-radio-button>
            <el-radio-button label="shipped">待收货</el-radio-button>
            <el-radio-button label="pending_review">待评价</el-radio-button>
            <el-radio-button label="completed">已完成</el-radio-button>
          </el-radio-group>
        </div>

        <div class="search-box">
          <el-input
            v-model="filters.keyword"
            placeholder="搜索商品名称、订单号..."
            clearable
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button icon="Search" @click="handleSearch" />
            </template>
          </el-input>
        </div>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="order-list-container">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="5" animated />
      </div>

      <!-- 订单列表 -->
      <div v-else-if="filteredOrders.length > 0">
        <OrderCard
          v-for="order in filteredOrders"
          :key="order.id"
          :order="order"
          @order-action="handleOrderAction"
        />

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[5, 10, 20, 50]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">📦</div>
        <div class="empty-text">您还没有任何订单</div>
        <el-button type="primary" @click="goShopping">去逛逛</el-button>
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
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import OrderCard from './OrderCard.vue'

const router = useRouter()

// 筛选条件
const filters = reactive({
  timeRange: '3m',
  status: 'all',
  keyword: ''
})

// 分页信息
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 10
})

// 加载状态
const loading = ref(false)

// 再次购买结果弹窗
const rebuyDialogVisible = ref(false)
const rebuyResult = ref(null)

// 模拟订单数据
const orders = ref([
  {
    id: 'ORD20231115001',
    createTime: '2023-11-15 14:30:22',
    status: 'completed',
    totalAmount: 2580.00,
    showAll: false,
    products: [
      {
        id: 'P001',
        name: '璀璨钻石项链',
        image: 'https://pic.rmb.bdstatic.com/bjh/bc119b9b6cfb/250917/c378a0e159d06c2ed39bc289ce94f6a6.jpeg?x-bce-process=image/resize,m_lfit,w_1242',
        spec: '链长40cm，玫瑰金',
        quantity: 1,
        price: 2580.00
      }
    ]
  },
  {
    id: 'ORD20231112002',
    createTime: '2023-11-12 09:15:47',
    status: 'pending_review',
    totalAmount: 3890.00,
    showAll: false,
    products: [
      {
        id: 'P002',
        name: '蓝宝石耳环',
        image: 'https://img2.baidu.com/it/u=845723931,3125861410&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=800',
        spec: '单只，铂金',
        quantity: 2,
        price: 1945.00
      }
    ]
  },
  {
    id: 'ORD20231108003',
    createTime: '2023-11-08 16:45:33',
    status: 'shipped',
    totalAmount: 1250.00,
    showAll: false,
    products: [
      {
        id: 'P003',
        name: '珍珠优雅手链',
        image: 'https://via.placeholder.com/80x80/ec4899/ffffff?text=Pearl',
        spec: '链长18cm，天然珍珠',
        quantity: 1,
        price: 1250.00
      }
    ]
  },
  {
    id: 'ORD20231105004',
    createTime: '2023-11-05 11:20:15',
    status: 'pending_shipment',
    totalAmount: 3200.00,
    showAll: false,
    products: [
      {
        id: 'P004',
        name: '祖母绿复古戒指',
        image: 'https://via.placeholder.com/80x80/10b981/ffffff?text=Emerald',
        spec: '指圈14号，18K金',
        quantity: 1,
        price: 3200.00
      }
    ]
  },
  {
    id: 'ORD20231101005',
    createTime: '2023-11-01 20:10:05',
    status: 'pending_payment',
    totalAmount: 1899.00,
    showAll: false,
    products: [
      {
        id: 'P005',
        name: '红宝石吊坠',
        image: 'https://via.placeholder.com/80x80/ef4444/ffffff?text=Ruby',
        spec: '主石0.5ct，白金',
        quantity: 1,
        price: 1899.00
      }
    ]
  },
  {
    id: 'ORD20231028006',
    createTime: '2023-10-28 13:40:18',
    status: 'completed',
    totalAmount: 4560.00,
    showAll: false,
    products: [
      {
        id: 'P006',
        name: '钻石永恒对戒',
        image: 'https://via.placeholder.com/80x80/8b5cf6/ffffff?text=Ring',
        spec: '男女对戒，铂金',
        quantity: 2,
        price: 2280.00
      },
      {
        id: 'P007',
        name: '定制刻字服务',
        image: 'https://via.placeholder.com/80x80/6b7280/ffffff?text=Custom',
        spec: '英文刻字，限10字符',
        quantity: 1,
        price: 0.00
      }
    ]
  },
  {
    id: 'ORD20231025007',
    createTime: '2023-10-25 17:55:42',
    status: 'completed',
    totalAmount: 750.00,
    showAll: false,
    products: [
      {
        id: 'P008',
        name: '简约银质手链',
        image: 'https://via.placeholder.com/80x80/9ca3af/ffffff?text=Silver',
        spec: '链长19cm，925银',
        quantity: 1,
        price: 750.00
      }
    ]
  },
  {
    id: 'ORD20231020008',
    createTime: '2023-10-20 10:30:29',
    status: 'completed',
    totalAmount: 2200.00,
    showAll: false,
    products: [
      {
        id: 'P009',
        name: '月光石项链',
        image: 'https://via.placeholder.com/80x80/60a5fa/ffffff?text=Moonstone',
        spec: '链长42cm，月光石主石',
        quantity: 1,
        price: 2200.00
      }
    ]
  },
  {
    id: 'ORD20231015009',
    createTime: '2023-10-15 15:20:11',
    status: 'completed',
    totalAmount: 1680.00,
    showAll: false,
    products: [
      {
        id: 'P010',
        name: '黑玛瑙男士手串',
        image: 'https://via.placeholder.com/80x80/1f2937/ffffff?text=Onyx',
        spec: '珠径8mm，弹力绳',
        quantity: 1,
        price: 1680.00
      }
    ]
  },
  {
    id: 'ORD20231010010',
    createTime: '2023-10-10 09:05:37',
    status: 'completed',
    totalAmount: 3100.00,
    showAll: false,
    products: [
      {
        id: 'P011',
        name: '黄金转运珠',
        image: 'https://via.placeholder.com/80x80/f59e0b/ffffff?text=Gold',
        spec: '足金999，约1g',
        quantity: 1,
        price: 3100.00
      },
      {
        id: 'P012',
        name: '红绳编织链',
        image: 'https://via.placeholder.com/80x80/dc2626/ffffff?text=Rope',
        spec: '可调节长度',
        quantity: 1,
        price: 0.00
      }
    ]
  }
])

// 过滤后的订单列表
const filteredOrders = computed(() => {
  let result = [...orders.value]

  // 状态筛选
  if (filters.status !== 'all') {
    result = result.filter(order => order.status === filters.status)
  }

  // 关键词搜索
  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase()
    result = result.filter(order =>
      order.id.toLowerCase().includes(keyword) ||
      order.products.some(product =>
        product.name.toLowerCase().includes(keyword)
      )
    )
  }

  // 分页
  const start = (pagination.currentPage - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return result.slice(start, end)
})

// 处理筛选条件变化
const handleFilterChange = () => {
  pagination.currentPage = 1
  fetchOrders()
}

// 处理搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchOrders()
}

// 处理分页变化
const handleCurrentChange = (page) => {
  pagination.currentPage = page
  fetchOrders()
}

// 处理每页大小变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  fetchOrders()
}

// 处理订单操作
const handleOrderAction = (action, order) => {
  switch (action) {
    case 'view-detail':
      goToOrderDetail(order.id)
      break
    case 'rebuy':
      handleRebuy(order)
      break
    case 'pay':
      handlePay(order.id)
      break
    case 'cancel':
      handleCancel(order.id)
      break
    case 'remind':
      handleRemind(order.id)
      break
    case 'refund':
      handleRefund(order.id)
      break
    case 'view-logistics':
      handleViewLogistics(order.id)
      break
    case 'confirm':
      handleConfirm(order.id)
      break
    case 'after-sale':
      handleAfterSale(order.id)
      break
    case 'review':
      handleReview(order.id)
      break
  }
}

// 获取订单列表
const fetchOrders = async () => {
  loading.value = true
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  loading.value = false
}

// 再次购买
const handleRebuy = async (order) => {
  try {
    loading.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 模拟API响应
    const mockResponse = {
      success: true,
      successItems: order.products.slice(0, 2),
      failedItems: order.products.length > 2 ? [{
        id: order.products[2].id,
        name: order.products[2].name,
        reason: '商品已下架'
      }] : []
    }

    if (mockResponse.successItems.length === order.products.length) {
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
  } finally {
    loading.value = false
  }
}

// 去购物车
const goToCart = () => {
  rebuyDialogVisible.value = false
  router.push('/cart')
}

// 去订单详情
const goToOrderDetail = () => {
  router.push(`/OrderDatil`)
}

// 去购物
const goShopping = () => {
  router.push('/products')
}

// 其他订单操作处理函数
const handlePay = (orderId) => {
  ElMessage.info(`支付订单 ${orderId}`)
}

const handleCancel = async (orderId) => {
  try {
    await ElMessageBox.confirm('确定要取消此订单吗？', '提示', {
      type: 'warning'
    })
    ElMessage.success('订单已取消')
  } catch {
    // 用户取消操作
  }
}

const handleRemind = (orderId) => {
  ElMessage.success('已提醒卖家尽快发货')
}

const handleRefund = (orderId) => {
  router.push(`/after-sale/apply/${orderId}`)
}

const handleViewLogistics = (orderId) => {
  ElMessage.info(`查看订单 ${orderId} 的物流信息`)
}

const handleConfirm = async (orderId) => {
  try {
    await ElMessageBox.confirm('确认收到商品后，货款将支付给卖家。请确保商品无误后再确认收货。', '确认收货', {
      type: 'warning'
    })
    ElMessage.success('确认收货成功')
  } catch {
    // 用户取消操作
  }
}

const handleAfterSale = (orderId) => {
  router.push(`/after-sale/apply/${orderId}`)
}

const handleReview = (orderId) => {
  router.push(`/order/review/${orderId}`)
}

// 初始化
onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.order-list-page {
  min-height: 100vh;
  background-color: #0f172a;
  color: #e2e8f0;
  padding: 20px;
}

.page-header {
  margin-bottom: 10px;
  margin-top: 50px;
  text-align: center;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 10px;
}

.page-subtitle {
  color: #94a3b8;
  font-size: 16px;
}

.filter-sidebar {
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 20px;
  z-index: 100;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-label {
  color: #cbd5e1;
  font-size: 14px;
  white-space: nowrap;
}

.search-box {
  display: flex;
  gap: 10px;
  flex: 1;
  min-width: 300px;
}

.order-list-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.loading-container {
  padding: 20px;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-text {
  font-size: 18px;
  margin-bottom: 15px;
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
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    min-width: 100%;
  }
}
</style>
