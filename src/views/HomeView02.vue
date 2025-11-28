<template>
  <div class="homepage">
    <!-- 情感意图循环单元 -->
    <div v-for="(intent, index) in emotionalIntents" :key="intent.id" class="intent-unit">
      <!-- 根据索引决定单元类型 -->
      <template v-if="index % 3 === 0">
        <!-- 单元类型1: 模块1 + 模块2 -->
        <section class="module-1">
          <div class="module-container">
            <div class="module-content">
              <div class="text-section">
                <h1 class="module-title">{{ intent.symbolCharacter }}-{{ intent.intentNameEn }}</h1>
                <div class="content-grid">
                  <div class="content-item">
                  </div>
                  <div class="content-item">
                    <p>{{ intent.secondaryEmotionsEn }}</p>
                  </div>
                  <div class="content-item">
                    <p>{{ intent.philosophyMeaningEn }}</p>
                  </div>
                  <div class="content-item">
                    <p>{{ intent.spiritualMeaningEn }}</p>
                  </div>
                  <div class="content-item">
                    <p>{{ intent.modernInterpretationEn }}</p>
                  </div>
                </div>
              </div>
              <div class="image-section">
                <img
                  :src="intent.iconUrl"
                  :alt="intent.intentNameEn"
                  @click="navigateToIntentProducts(intent.id)"
                  class="adaptive-image"
                />
              </div>
            </div>
          </div>
        </section>

        <section class="module-2">
          <div class="module-container">
            <div class="modern-interpretation">
              <p>{{ intent.modernInterpretationEn }}</p>
            </div>
            <div class="products-grid">
              <div
                v-for="product in getIntentProducts(intent.id)"
                :key="product.id"
                class="product-card"
                @click="navigateToProduct(product.id)"
              >
                <img
                  :src="product.mainImageUrl"
                  :alt="product.productNameEn"
                  class="product-image adaptive-image"
                />
                <div class="product-info">
                  <h3 class="product-name">{{ product.productNameEn }}</h3>
                  <p class="product-desc">{{ product.shortDescriptionEn }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>

      <template v-else-if="index % 3 === 1">
        <!-- 单元类型2: 模块3 + 模块4 -->
        <section class="module-3">
          <div class="module-container">
            <div class="module-content reversed">
              <div class="image-section">
                <img
                  :src="intent.iconUrl"
                  :alt="intent.intentNameEn"
                  @click="navigateToIntentProducts(intent.id)"
                  class="adaptive-image"
                />
              </div>
              <div class="text-section">
                <h1 class="module-title">{{ intent.symbolCharacter }} {{ intent.intentNameEn }}</h1>
                <div class="content-grid">
                  <div class="content-item">
                    <p>{{ intent.primaryEmotionEn }}</p>
                  </div>
                  <div class="content-item">
                    <p>{{ intent.secondaryEmotionsEn }}</p>
                  </div>
                  <div class="content-item">
                    <p>{{ intent.philosophyMeaningEn }}</p>
                  </div>
                  <div class="content-item">
                    <p>{{ intent.spiritualMeaningEn }}</p>
                  </div>
                  <div class="content-item">
                    <p>{{ intent.modernInterpretationEn }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="module-4">
          <div class="module-container">
            <div class="modern-interpretation">
              <p>{{ intent.modernInterpretationEn }}</p>
            </div>
            <div class="products-grid">
              <div
                v-for="product in getIntentProducts(intent.id)"
                :key="product.id"
                class="product-card"
                @click="navigateToProduct(product.id)"
              >
                <img
                  :src="product.mainImageUrl"
                  :alt="product.productNameEn"
                  class="product-image adaptive-image"
                />
                <div class="product-info">
                  <h3 class="product-name">{{ product.productNameEn }}</h3>
                  <p class="product-desc">{{ product.shortDescriptionEn }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>

      <template v-else>
        <!-- 单元类型3: 模块5 + 模块6 -->
        <section class="module-5">
          <div class="module-container">
            <div class="split-layout">
              <div class="image-half">
                <img
                  :src="intent.iconUrl"
                  :alt="intent.intentNameEn"
                  class="adaptive-image"
                />
              </div>
              <div class="text-half">
                <h1 class="module-title">{{ intent.symbolCharacter }} {{ intent.intentNameEn }}</h1>
                <div class="content-list">
                  <div class="content-item">
                    <p>{{ intent.primaryEmotionEn }}</p>
                  </div>
                  <div class="content-item">
                    <p>{{ intent.secondaryEmotionsEn }}</p>
                  </div>
                  <div class="content-item">
                    <p>{{ intent.philosophyMeaningEn }}</p>
                  </div>
                  <div class="content-item">
                    <p>{{ intent.spiritualMeaningEn }}</p>
                  </div>
                  <div class="content-item">
                    <p>{{ intent.modernInterpretationEn }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="module-6">
          <div class="module-container">
            <div class="modern-interpretation">
              <p>{{ intent.modernInterpretationEn }}</p>
            </div>
            <div class="products-grid">
              <div
                v-for="product in getIntentProducts(intent.id)"
                :key="product.id"
                class="product-card"
                @click="navigateToProduct(product.id)"
              >
                <img
                  :src="product.mainImageUrl"
                  :alt="product.productNameEn"
                  class="product-image adaptive-image"
                />
                <div class="product-info">
                  <h3 class="product-name">{{ product.productNameEn }}</h3>
                  <p class="product-desc">{{ product.shortDescriptionEn }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>
    </div>

    <!-- 五行模块 -->
    <section class="wu-xing-module" v-if="wuXingAttributes.length > 0">
      <div class="module-container">
        <div class="wu-xing-grid">
          <div
            v-for="element in wuXingAttributes"
            :key="element.id"
            class="element-card"
            @click="navigateToWuXing(element.id)"
          >
            <img
              :src="element.symbolIconUrl"
              :alt="element.elementNameEn"
              class="element-image adaptive-image"
            />
            <div class="element-name">{{ element.elementNameEn }}</div>
            <div class="element-philosophy">{{ element.philosophyMeaningEn }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'

const router = useRouter()

// 响应式数据
const emotionalIntents = ref([])
const wuXingAttributes = ref([])
const productMap = ref(new Map()) // 存储每个意图的商品数据

// 导航方法
const navigateToIntentProducts = (intentId) => {
  router.push(`/product-spu/selectSpuByIntentId/spu/${intentId}`)
}

const navigateToProduct = (productId) => {
  router.push(`/product-spu/getByid/${productId}`)
}

const navigateToWuXing = (elementId) => {
  router.push(`/wu-xing-attributes/getById/${elementId}`)
}

// 获取商品数据
const getIntentProducts = (intentId) => {
  return productMap.value.get(intentId) || []
}

// API调用方法
const fetchEmotionalIntents = async () => {
  try {
    console.log('开始获取情感意图数据...')
    const response = await fetch('/api/emotional-intent/list')
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const result = await response.json()

    // 调试输出完整响应结构
    console.log('API响应结构:', result)

    // 根据实际API响应结构调整数据提取
    let intentsData = result
    if (result.data) {
      intentsData = result.data // 如果数据在 data 字段中
    } else if (result.result) {
      intentsData = result.result // 如果数据在 result 字段中
    }

    // 确保是数组
    if (!Array.isArray(intentsData)) {
      throw new Error('情感意图数据不是数组格式')
    }

    emotionalIntents.value = intentsData
    console.log('情感意图数据获取成功:', intentsData.length, '条记录')

    // 为每个意图获取商品数据
    await fetchAllIntentProducts(intentsData)
  } catch (error) {
    console.error('获取情感意图数据失败:', error)
  }
}

const fetchIntentProducts = async (intentId) => {
  try {
    console.log(`获取意图 ${intentId} 的商品数据...`)
    const response = await fetch(`/api/product-spu/getRecommendProducts/${intentId}/10`)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const result = await response.json()

    // 调试输出商品API响应结构
    console.log(`意图 ${intentId} 商品API响应结构:`, result)

    // 根据实际API响应结构调整数据提取
    let productsData = result
    if (result.data) {
      productsData = result.data
    } else if (result.result) {
      productsData = result.result
    }

    // 确保是数组
    if (!Array.isArray(productsData)) {
      console.warn(`意图 ${intentId} 商品数据不是数组格式:`, productsData)
      return []
    }

    console.log(`意图 ${intentId} 商品数据获取成功:`, productsData.length, '个商品')
    return productsData
  } catch (error) {
    console.error(`获取意图 ${intentId} 商品数据失败:`, error)
    return []
  }
}

const fetchAllIntentProducts = async (intents) => {
  if (!intents || !Array.isArray(intents)) {
    console.error('fetchAllIntentProducts: intents 参数无效', intents)
    return
  }

  for (const intent of intents) {
    const products = await fetchIntentProducts(intent.id)

    // 确保 products 是数组再调用 slice
    if (Array.isArray(products)) {
      productMap.value.set(intent.id, products.slice(0, 5))
    } else {
      console.warn(`意图 ${intent.id} 的商品数据不是数组:`, products)
      productMap.value.set(intent.id, [])
    }
  }
}

const fetchWuXingAttributes = async () => {
  try {
    console.log('开始获取五行属性数据...')
    const response = await fetch('/api/wu-xing-attributes/tier/1')
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const data = await response.json()
    wuXingAttributes.value = data
    console.log('五行属性数据获取成功:', data.length, '条记录')
  } catch (error) {
    console.error('获取五行属性数据失败:', error)
  }
}

// 生命周期
onMounted(() => {
  fetchEmotionalIntents()
  fetchWuXingAttributes()
})
</script>

<style scoped>
.homepage {
  background: linear-gradient(135deg, #0a1128 0%, #1a237e 100%);
  color: #f0f0f0;
  font-family: 'Noto Sans SC', sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
}

/* 通用模块样式 */
.module-container {
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 自适应图像 */
.adaptive-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ========== 模块1样式 ========== */
.module-1 {
  height: 60vh; /* 40vh * 3 = 120vh */
  width: 100%;
  box-sizing: border-box;
}

.module-1 .module-content {
  display: flex;
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

.module-1 .text-section {
  flex: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem; /* 保持原有内边距 */
  box-sizing: border-box;
  overflow: hidden;
  max-width: 60%;
}

.module-1 .image-section {
  flex: 40%;
  height: 100%;
  max-width: 40%;
  overflow: hidden;
}

/* ========== 模块1样式 ========== */
.module-1 .content-grid {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.0rem; /* 0.8rem * 1.5 = 1.2rem */
  max-width: 100%;
  overflow: hidden;
}

.module-1 .content-item p {
  font-size: 1.0rem; /* 0.9rem * 1.5 = 1.35rem */
  line-height: 1.5; /* 1.3 * 1.5 = 1.95 */
  margin: 0;
  max-width: 100%;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-word;
  white-space: normal; /* 确保自动换行 */
  display: block; /* 改为block以确保正常换行 */
  -webkit-box-orient: unset; /* 移除弹性盒方向 */
}

/* ========== 模块2样式 ========== */
.module-2 {
  width: 100%;
  padding: 1rem 0; /* 保持原有内边距 */
  height: 90vh; /* 30vh * 3 = 90vh */
  box-sizing: border-box;
}

.module-2 .products-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.8rem;
  padding: 0 1rem;
  box-sizing: border-box;
  height: auto; /* 改为自动高度 */
  min-height: 40vh; /* 添加最小高度 */
}

.module-2 .product-card {
  cursor: pointer;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 0.5rem;
  transition: all 0.3s;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.module-2 .product-image {
  width: 100%;
  height: 100%; /* 完全填充容器 */
  min-height: 180px;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  object-fit: cover; /* 保持图像比例 */
  flex: 1; /* 图像占据所有可用空间 */
}

.module-2 .product-info {
  padding: 0.5rem;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  flex-shrink: 0; /* 信息区域不伸缩 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: auto; /* 自动高度 */
}
/* 模块2和模块3之间的间距控制 */
.module-2 + .module-3 {
  margin-top: -3rem; /* 根据需要调整这个值 */
}
/* ========== 模块3样式 ========== */
.module-3 {
  height: 60vh; /* 40vh * 3 = 120vh */
  width: 100%;
  box-sizing: border-box;
}

.module-3 .module-content {
  display: flex;
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

.module-3 .module-content.reversed {
  flex-direction: row-reverse;
}

.module-3 .text-section {
  flex: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem; /* 保持原有内边距 */
  box-sizing: border-box;
  overflow: hidden;
  max-width: 60%;
}

.module-3 .image-section {
  flex: 40%;
  height: 100%;
  max-width: 40%;
  overflow: hidden;
}

/* ========== 模块4样式 ========== */
.module-4 {
  width: 100%;
  padding: 1rem 0; /* 保持原有内边距 */
  min-height: 90vh; /* 30vh * 3 = 90vh */
  box-sizing: border-box;
}

.module-4 .products-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.8rem; /* 保持原有间距 */
  padding: 0 1rem; /* 保持原有内边距 */
  box-sizing: border-box;
}

/* ========== 模块5样式 ========== */
.module-5 {
  height: 90vh; /* 30vh * 3 = 90vh */
  width: 100%;
  box-sizing: border-box;
}

.module-5 .split-layout {
  display: flex;
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

.module-5 .image-half {
  flex: 50%;
  height: 100%;
  max-width: 50%;
  overflow: hidden;
}

.module-5 .text-half {
  flex: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem; /* 保持原有内边距 */
  box-sizing: border-box;
  overflow: hidden;
  max-width: 50%;
}

/* ========== 模块6样式 ========== */
.module-6 {
  width: 100%;
  padding: 1rem 0; /* 保持原有内边距 */
  min-height: 90vh; /* 30vh * 3 = 90vh */
  box-sizing: border-box;
}

.module-6 .products-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.8rem; /* 保持原有间距 */
  padding: 0 1rem; /* 保持原有内边距 */
  box-sizing: border-box;
}

/* ========== 五行模块样式 ========== */
.wu-xing-module {
  height: 75vh; /* 25vh * 3 = 75vh */
  width: 100%;
  padding: 1rem 0; /* 保持原有内边距 */
  box-sizing: border-box;
}

.wu-xing-grid {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  padding: 0 1rem; /* 保持原有内边距 */
  box-sizing: border-box;
}

.element-card {
  text-align: center;
  cursor: pointer;
  flex: 1;
  margin: 0 0.5rem; /* 保持原有外边距 */
  max-width: 20%;
  box-sizing: border-box;
  overflow: hidden;
}

.element-image {
  height: 60%; /* 保持原有高度比例 */
  max-height: 80px; /* 保持原有最大高度 */
  margin-bottom: 0.5rem; /* 保持原有下边距 */
  object-fit: contain;
}

/* ========== 产品卡片样式 ========== */
.product-card {
  cursor: pointer;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px; /* 保持原有圆角 */
  padding: 0.5rem; /* 保持原有内边距 */
  transition: all 0.3s;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-2px); /* 保持原有悬停效果 */
  background: rgba(255, 255, 255, 0.1);
}

.product-image {
  height: 120px; /* 保持原有高度 */
  width: 100%;
  margin-bottom: 0.5rem; /* 保持原有下边距 */
  border-radius: 6px; /* 保持原有圆角 */
  object-fit: cover;
  flex-shrink: 0;
}

.product-info {
  padding: 0.5rem; /* 保持原有内边距 */
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* ========== 文本样式 ========== */
.module-title {
  font-size: 1.8rem; /* 保持原有字体大小 */
  text-align: center;
  margin-bottom: 1.5rem; /* 保持原有下边距 */
  color: #d4af37;
  font-weight: 600;
  line-height: 1.2; /* 保持原有行高 */
  max-width: 100%;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-word;
}

.content-grid {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.8rem; /* 保持原有间距 */
  max-width: 100%;
  overflow: hidden;
}

.content-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* 保持原有间距 */
  max-width: 100%;
  overflow: hidden;
}

.content-item {
  width: 100%;
  text-align: center;
  margin-bottom: 0;
  overflow: hidden;
}

.content-item h3 {
  font-size: 1rem; /* 保持原有字体大小 */
  color: #d4af37;
  margin-bottom: 0.3rem; /* 保持原有下边距 */
  font-weight: 500;
  line-height: 1.2; /* 保持原有行高 */
  max-width: 100%;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-word;
}

.content-item p {
  font-size: 0.9rem; /* 保持原有字体大小 */
  line-height: 1.3; /* 保持原有行高 */
  margin: 0;
  max-width: 100%;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 保持原有显示行数 */
  -webkit-box-orient: vertical;
}

.modern-interpretation {
  text-align: center;
  padding: 0.8rem 1rem; /* 保持原有内边距 */
  font-style: italic;
  font-size: 1rem; /* 保持原有字体大小 */
  background: rgba(212, 175, 55, 0.1);
  margin: 0.8rem 0; /* 保持原有外边距 */
  border-radius: 6px; /* 保持原有圆角 */
  box-sizing: border-box;
  overflow: hidden;
  max-width: 100%;
}

.modern-interpretation p {
  margin: 0;
  line-height: 1.4; /* 保持原有行高 */
  max-width: 100%;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 保持原有显示行数 */
  -webkit-box-orient: vertical;
}

/* ========== 产品文本控制 ========== */
.product-name {
  font-size: 0.85rem; /* 保持原有字体大小 */
  margin-bottom: 0.3rem; /* 保持原有下边距 */
  font-weight: 500;
  line-height: 1.2; /* 保持原有行高 */
  max-width: 100%;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  flex-shrink: 0;
}

.product-desc {
  font-size: 0.75rem; /* 保持原有字体大小 */
  color: #cccccc;
  line-height: 1.2; /* 保持原有行高 */
  max-width: 100%;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  flex: 1;
}

/* ========== 五行模块文本控制 ========== */
.element-name {
  font-size: 0.9rem; /* 保持原有字体大小 */
  font-weight: 600;
  margin-bottom: 0.3rem; /* 保持原有下边距 */
  line-height: 1.2; /* 保持原有行高 */
  max-width: 100%;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.element-philosophy {
  font-size: 0.75rem; /* 保持原有字体大小 */
  color: #cccccc;
  line-height: 1.2; /* 保持原有行高 */
  max-width: 100%;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* ========== 严格的文本换行控制 ========== */
.text-section,
.text-half,
.content-item,
.content-item p,
.modern-interpretation,
.modern-interpretation p,
.product-info,
.product-name,
.product-desc,
.element-name,
.element-philosophy {
  word-wrap: break-word !important;
  word-break: break-word !important;
  overflow-wrap: break-word !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
}

/* 确保所有文本元素不会溢出 */
.text-section *,
.text-half *,
.content-item *,
.product-info *,
.element-card * {
  max-width: 100% !important;
  box-sizing: border-box !important;
}

/* ========== 响应式设计 ========== */
@media (max-width: 1024px) {
  .module-2 .products-grid,
  .module-4 .products-grid,
  .module-6 .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.6rem; /* 保持原有间距 */
  }

  .module-title {
    font-size: 1.5rem; /* 保持原有字体大小 */
    margin-bottom: 1rem; /* 保持原有下边距 */
  }

  .content-item h3 {
    font-size: 0.9rem; /* 保持原有字体大小 */
  }

  .content-item p {
    font-size: 0.8rem; /* 保持原有字体大小 */
  }
}

@media (max-width: 1024px) {
  .module-2 .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.6rem;
  }

  .module-2 .product-image {
    height: 100%;
    min-height: 140px;
    flex: 1;
  }
}

@media (max-width: 768px) {
  .module-2 .product-image {
    height: 200px; /* 移动端固定高度 */
    min-height: auto;
    flex: none;
  }

  .module-2 .product-info {
    height: auto;
  }
}

@media (max-width: 480px) {
  .module-2 .products-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .module-2 .product-image {
    max-height: 80px; /* 调整最大高度 */
  }
}

@media (max-width: 768px) {
  .module-1,
  .module-3 {
    height: auto;
    min-height: 150vh; /* 50vh * 3 = 150vh */
  }

  .module-5 {
    height: auto;
    min-height: 120vh; /* 40vh * 3 = 120vh */
  }

  .module-1 .module-content,
  .module-3 .module-content,
  .module-5 .split-layout {
    flex-direction: column;
  }

  .module-1 .text-section,
  .module-3 .text-section,
  .module-5 .text-half {
    flex: 1;
    max-width: 100%;
    padding: 1rem; /* 保持原有内边距 */
    min-height: 50%;
  }

  .module-1 .image-section,
  .module-3 .image-section,
  .module-5 .image-half {
    flex: 1;
    max-width: 100%;
    height: 200px; /* 保持原有高度 */
    min-height: 200px;
  }

  .module-2 .products-grid,
  .module-4 .products-grid,
  .module-6 .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem; /* 保持原有间距 */
  }

  .wu-xing-grid {
    flex-wrap: wrap;
    gap: 0.5rem; /* 保持原有间距 */
  }

  .element-card {
    flex: 0 0 calc(50% - 1rem);
    max-width: calc(50% - 1rem);
    margin-bottom: 0.5rem; /* 保持原有下边距 */
  }

  .product-image {
    height: 100px; /* 保持原有高度 */
  }

  .module-title {
    font-size: 1.3rem; /* 保持原有字体大小 */
    margin-bottom: 0.8rem; /* 保持原有下边距 */
  }

  .modern-interpretation {
    padding: 0.6rem 0.8rem; /* 保持原有内边距 */
    font-size: 0.9rem; /* 保持原有字体大小 */
    margin: 0.6rem 0; /* 保持原有外边距 */
  }
}

@media (max-width: 480px) {
  .module-2 .products-grid,
  .module-4 .products-grid,
  .module-6 .products-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem; /* 保持原有间距 */
  }

  .element-card {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .module-title {
    font-size: 1.1rem; /* 保持原有字体大小 */
  }

  .content-item h3 {
    font-size: 0.85rem; /* 保持原有字体大小 */
  }

  .content-item p {
    font-size: 0.75rem; /* 保持原有字体大小 */
  }

  .product-name {
    font-size: 0.8rem; /* 保持原有字体大小 */
  }

  .product-desc {
    font-size: 0.7rem; /* 保持原有字体大小 */
  }
}

/* 确保所有容器都不会溢出 */
.module-1,
.module-2,
.module-3,
.module-4,
.module-5,
.module-6,
.wu-xing-module {
  overflow: hidden;
}

.intent-unit {
  overflow: hidden;
}

/* 强制所有文本内容在容器内 */
.text-section > *,
.text-half > *,
.content-grid > *,
.content-list > * {
  max-width: 100% !important;
  overflow: hidden !important;
}
</style>


