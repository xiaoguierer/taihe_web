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
                <h1 class="module-title">{{ intent.symbolCharacter }} {{ intent.intentNameEn }}</h1>
                <div class="content-grid">
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.primaryEmotionEn }}</p>
                  </div>
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.secondaryEmotionsEn }}</p>
                  </div>
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.philosophyMeaningEn }}</p>
                  </div>
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.spiritualMeaningEn }}</p>
                  </div>
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.modernInterpretationEn }}</p>
                  </div>
                </div>
              </div>
              <div class="image-section">
                <img
                  :src="intent.iconUrl || defaultIntentImage"
                  :alt="intent.intentNameEn"
                  @click="navigateToIntentProducts(intent.id)"
                  class="adaptive-image fill-image"
                />
              </div>
            </div>
          </div>
        </section>
        <!-- 模块间分隔文字 -->
        <div class="module-spacer" v-if="intent.modernInterpretationEn">
          <div class="spacer-text">{{ intent.modernInterpretationEn }}</div>
        </div>

        <section class="module-2">
          <div class="module-container">
            <div class="products-grid strict-grid">
              <div
                v-for="product in getIntentProducts(intent.id)"
                :key="product.id"
                class="product-card"
                @click="handleProductClick(product)"
              >
                <div class="image-container">
                  <img
                    :src="product.mainImageUrl || defaultProductImage"
                    :alt="product.productNameEn"
                    class="product-image fill-image"
                  />
                </div>
                <div class="product-info strict-text-container">
                  <h3 class="product-name strict-text">{{ product.productNameEn }}</h3>
                  <p class="product-desc strict-text">{{ product.shortDescriptionEn }}</p>
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
                  :src="intent.iconUrl || defaultIntentImage"
                  :alt="intent.intentNameEn"
                  @click="navigateToIntentProducts(intent.id)"
                  class="adaptive-image fill-image"
                />
              </div>
              <div class="text-section">
                <h1 class="module-title">{{ intent.symbolCharacter }} {{ intent.intentNameEn }}</h1>
                <div class="content-grid">
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.primaryEmotionEn }}</p>
                  </div>
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.secondaryEmotionsEn }}</p>
                  </div>
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.philosophyMeaningEn }}</p>
                  </div>
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.spiritualMeaningEn }}</p>
                  </div>
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.modernInterpretationEn }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <!-- 模块间分隔文字 -->
        <div class="module-spacer" v-if="intent.modernInterpretationEn">
          <div class="spacer-text">{{ intent.modernInterpretationEn }}</div>
        </div>
        <section class="module-4">
          <div class="module-container">
            <div class="products-grid strict-grid">
              <div
                v-for="product in getIntentProducts(intent.id)"
                :key="product.id"
                class="product-card"
                @click="handleProductClick(product)"
              >
                <div class="image-container">
                  <img
                    :src="product.mainImageUrl || defaultProductImage"
                    :alt="product.productNameEn"
                    class="product-image fill-image"
                  />
                </div>
                <div class="product-info strict-text-container">
                  <h3 class="product-name strict-text">{{ product.productNameEn }}</h3>
                  <p class="product-desc strict-text">{{ product.shortDescriptionEn }}</p>
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
            <div class="vertical-split">
              <div class="image-top">
                <img
                  :src="intent.iconUrl || defaultIntentImage"
                  :alt="intent.intentNameEn"
                  @click="navigateToIntentProducts(intent.id)"
                  class="adaptive-image fill-image"
                />
              </div>
              <div class="text-bottom">
                <h1 class="module-title">{{ intent.symbolCharacter }} {{ intent.intentNameEn }}</h1>
                <div class="content-list">
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.primaryEmotionEn }}</p>
                  </div>
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.secondaryEmotionsEn }}</p>
                  </div>
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.philosophyMeaningEn }}</p>
                  </div>
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.spiritualMeaningEn }}</p>
                  </div>
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.modernInterpretationEn }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <!-- 模块间分隔文字 -->
        <div class="module-spacer" v-if="intent.modernInterpretationEn">
          <div class="spacer-text">{{ intent.modernInterpretationEn }}</div>
        </div>
        <section class="module-6">
          <div class="module-container">
            <div class="products-grid strict-grid">
              <div
                v-for="product in getIntentProducts(intent.id)"
                :key="product.id"
                class="product-card"
                @click="handleProductClick(product)"
              >
                <div class="image-container">
                  <img
                    :src="product.mainImageUrl || defaultProductImage"
                    :alt="product.productNameEn"
                    class="product-image fill-image"
                  />
                </div>
                <div class="product-info strict-text-container">
                  <h3 class="product-name strict-text">{{ product.productNameEn }}</h3>
                  <p class="product-desc strict-text">{{ product.shortDescriptionEn }}</p>
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
            <div class="image-container">
              <img
                :src="element.symbolIconUrl || defaultIntentImage"
                :alt="element.elementNameEn"
                class="element-image fill-image"
              />
            </div>
            <div class="element-info strict-text-container">
              <div class="element-name strict-text">{{ element.elementNameEn }}</div>
              <div class="element-philosophy strict-text">{{ element.philosophyMeaningEn }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 常量定义
const DEFAULT_INTENT_IMAGE = '/api/files/PRODUCTEMO/2025/11/21/94688275ff404a3e9de0c48d1a6f47d9.jpeg'
const DEFAULT_PRODUCT_IMAGE = '/api/files/PRODUCDETAIL/2025/11/21/86a8c9b27b1049319afd74f5dadc19f7.jpeg'
const PRODUCT_LIMIT = 10

// 响应式数据
const emotionalIntents = ref([])
const wuXingAttributes = ref([])
const productMap = ref(new Map())

// 统一的API响应数据处理
const extractDataFromResponse = (result) => {
  if (!result) return null

  if (Array.isArray(result)) {
    return result
  }

  const dataFields = ['data', 'result', 'list', 'items', 'records', 'content']
  for (const field of dataFields) {
    if (Array.isArray(result[field])) {
      return result[field]
    }
  }

  if (result.records && Array.isArray(result.records)) {
    return result.records
  }

  console.warn('无法从API响应中提取数组数据:', result)
  return null
}

// 导航方法-获取所属意图下的商品spu集合
const navigateToIntentProducts = (intentId) => {
  console.info("导航navigateToIntentProducts-获取所属情感意图商品SPU集合，参数intentId is ：",intentId)
  if (!intentId || intentId.includes('placeholder')) return
  router.push(`/product-spu/selectSpuByIntentId/spu/${intentId}`)
}
// 商品详情
const navigateToProduct = (productId) => {
  console.info("导航navigateToProduct - 获取商品详情，productId is ：",productId)
  if (!productId || productId.includes('placeholder')) return
  router.push(`/product-spu/getByid/${productId}`)
}

const navigateToWuXing = (elementId) => {
  console.info("导航navigateToWuXing - 五行详情，elementId is ：",elementId)
  if (!elementId) return
  router.push(`/wu-xing-attributes/getById/${elementId}`)
}

// 获取商品数据
const getIntentProducts = (intentId) => {
  if (!intentId) return []

  const products = productMap.value.get(intentId) || []

  if (products.length < PRODUCT_LIMIT) {
    const placeholders = Array(PRODUCT_LIMIT - products.length).fill().map((_, index) => ({
      id: `placeholder-${intentId}-${index}`,
      productNameEn: 'Coming Soon',
      shortDescriptionEn: 'Product in development',
      mainImageUrl: DEFAULT_PRODUCT_IMAGE,
      isPlaceholder: true
    }))
    return [...products, ...placeholders]
  }

  return products.slice(0, PRODUCT_LIMIT)
}

// 商品点击处理
// 修改商品点击处理，添加更详细的调试信息
const handleProductClick = (product) => {
  console.log('点击的商品完整信息:', product)
  console.log('商品ID字段详情:', {
    id: product.id,
    spuId: product.spuId,
    hasId: !!product.id,
    hasSpuId: !!product.spuId
  })

  if (!product) {
    console.error('商品对象为空')
    return
  }

  const productId = product.id
  if (!productId) {
    console.error('商品ID为空，商品信息:', product)
    return
  }

  if (product.isPlaceholder) {
    console.log('占位商品，不可点击')
    return
  }

  console.log(`导航到商品详情: ${productId}`)
  navigateToProduct(productId)
}

// API调用方法
const fetchEmotionalIntents = async () => {
  try {
    console.info('----------------------开始获取情感意图数据---------------------------...')
    const response = await fetch('/api/emotional-intent/list')
    console.info("获取情感意图 API 数据response:",response)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.info('情感意图API原始响应:', result)

    const intentsData = extractDataFromResponse(result)

    if (!Array.isArray(intentsData)) {
      throw new Error('情感意图数据格式不正确')
    }

    emotionalIntents.value = intentsData.map(preprocessIntentData)
    console.info('情感意图数据获取成功:', intentsData.length, '条记录')

    if (intentsData.length > 0) {
      await fetchAllIntentProducts(intentsData)
    }
  } catch (error) {
    console.error('获取情感意图数据失败:', error)
    emotionalIntents.value = []
  }
}

const fetchIntentProducts = async (intentId) => {
  try {
    console.info('----------------------开始获所属取情感意图SPU数据---------------------------...')
    console.log(`获取意图 ${intentId} 的商品数据...`)
    // 使用现有正常工作的接口格式
    const response = await fetch(`/api/product-spu/getRecommendProducts/${intentId}/10`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log(`意图 ${intentId} 商品API原始响应:`, result)

    const productsData = extractDataFromResponse(result)

    if (!Array.isArray(productsData)) {
      console.warn(`意图 ${intentId} 商品数据格式不正确:`, productsData)
      return []
    }

    const processedProducts = productsData.map(preprocessProductData)
    console.log(`意图 ${intentId} 商品数据获取成功:`, processedProducts.length, '个商品')
    return processedProducts
  } catch (error) {
    console.error(`获取意图 ${intentId} 商品数据失败:`, error)
    return []
  }
}

const fetchAllIntentProducts = async (intents) => {
  if (!intents || !Array.isArray(intents) || intents.length === 0) return

  try {
    const promises = intents.map(intent => fetchIntentProducts(intent.id))
    const results = await Promise.allSettled(promises)

    results.forEach((result, index) => {
      const intent = intents[index]
      if (result.status === 'fulfilled') {
        productMap.value.set(intent.id, result.value)
      } else {
        console.error(`获取意图 ${intent.id} 商品数据失败:`, result.reason)
        productMap.value.set(intent.id, [])
      }
    })
  } catch (error) {
    console.error('获取商品数据过程中发生错误:', error)
  }
}

const fetchWuXingAttributes = async () => {
  try {
    console.log('---------------开始获取五行属性数据-------------...')

    // 关键修正：使用现有正常工作的接口地址
    const response = await fetch('/api/wu-xing-attributes/tier/1')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log('五行属性API原始响应:', result)

    const wuXingData = extractDataFromResponse(result)

    if (!Array.isArray(wuXingData)) {
      console.warn('五行属性数据格式不正确:', wuXingData)
      wuXingAttributes.value = []
      return
    }

    wuXingAttributes.value = wuXingData.map(preprocessWuXingData)
    console.log('五行属性数据获取成功:', wuXingData.length, '条记录')
  } catch (error) {
    console.error('获取五行属性数据失败:', error)
    wuXingAttributes.value = []
  }
}

// 数据预处理
const preprocessIntentData = (intent) => {
  return {
    ...intent,
    primaryEmotionEn: processText(intent.primaryEmotionEn, 130),
    secondaryEmotionsEn: processText(intent.secondaryEmotionsEn, 130),
    philosophyMeaningEn: processText(intent.philosophyMeaningEn, 130),
    spiritualMeaningEn: processText(intent.spiritualMeaningEn, 130),
    modernInterpretationEn: processText(intent.modernInterpretationEn, 130)
  }
}

const preprocessProductData = (product) => {
  // 关键修复：统一ID字段映射
  const processedProduct = {
    ...product,
    // 统一ID字段：spuId -> id
    id: product.spuId || product.id,
    // 确保必要字段存在
    productNameEn: processText(product.productNameEn || '', 130),
    shortDescriptionEn: processText(product.shortDescriptionEn || '', 25),
    mainImageUrl: product.mainImageUrl || DEFAULT_PRODUCT_IMAGE
  }
  console.log(`商品数据映射: spuId=${product.spuId} -> id=${processedProduct.id}`)
  return processedProduct
}

const preprocessWuXingData = (element) => {
  return {
    ...element,
    elementNameEn: processText(element.elementNameEn, 15),
    philosophyMeaningEn: processText(element.philosophyMeaningEn, 30)
  }
}

// 文本处理
const processText = (text, maxLength = 30) => {
  if (!text) return ''
  const cleanText = text.replace(/\s+/g, ' ').trim()
  return cleanText.length > maxLength ? cleanText.substring(0, maxLength) + '...' : cleanText
}

// 生命周期
onMounted(() => {
  fetchEmotionalIntents()
  fetchWuXingAttributes()
})
</script>

<style scoped>
/* 基础样式重置 - 确保无间距 */
.homepage {
  background: linear-gradient(135deg, #0a1128 0%, #1a237e 100%);
  color: #f0f0f0;
  font-family: 'Noto Sans SC', sans-serif;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* 严格的容器设置 */
.module-container {
  width: 100vw;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.intent-unit {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* 严格的图片填充样式 */
.fill-image {
  width: 100%;
  height: 100%;
  object-fit: fill; /* 关键：完全拉伸填充 */
  display: block;
  margin: 0;
  padding: 0;
}

.image-container {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* 严格的文本约束 */
.strict-text {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* 单行显示，确保不换行 */
  line-height: 1.2;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.strict-text-container {
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ========== 模块1样式 ========== */
.module-1 {
  height: 70vh; /* 严格10厘米高度 */
  width: 100vw;
  margin: 0;
  padding: 0;
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
  flex: 50%; /* 严格50%宽度 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.module-1 .image-section {
  flex: 50%; /* 严格50%宽度 */
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.module-1 .content-grid {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.3cm; /* 适度行距 */
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.module-1 .content-item {
  width: 100%;
  text-align: center;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* ========== 模块2样式 ========== */
.module-2 {
  height: 50vh; /* 严格12厘米高度 */
  width: 100vw;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.module-2 .products-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 严格5列 */
  grid-template-rows: repeat(2, minmax(0, 1fr)); /* 关键：最小高度为0，最大1fr */
  grid-auto-rows: 1fr; /* 确保自动创建的行也等高 */
  gap: 0.3cm; /* 图片间适度空隙 */
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0.5cm; /* 容器内边距 */
  box-sizing: border-box;
  align-items: stretch; /* 单元格内容拉伸 */
}

.module-2 .product-card {
  cursor: pointer;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.2cm;
  margin: 0;
  padding: 0.2cm;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%; /* 占满网格单元格 */
  min-height: 0; /* 关键：允许在网格中收缩 */
  transition: all 0.3s;
}

.module-2 .product-card:hover {
  transform: translateY(-0.1cm);
  background: rgba(255, 255, 255, 0.1);
}
.module-2 .image-container {
  width: 100%;
  height: 70%; /* 固定图片区域比例 */
  margin: 0;
  padding: 0;
  overflow: hidden;
  flex-shrink: 0; /* 防止被压缩 */
  min-height: 0; /* 允许收缩 */
}
.module-2 .product-image {
  width: 100%;
  height: 70%; /* 图片占卡片70%高度 */
  margin: 0;
  padding: 0;
  border-radius: 0.15cm;
  object-fit: fill; /* 完全填充 */
  flex-shrink: 0;
}

.module-2 .product-info {
  height: 30%; /* 文字占卡片30%高度 */
  margin: 0;
  padding: 0.2cm 0.1cm;
  box-sizing: border-box;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 0; /* 允许收缩 */
}
/* 确保模块4和模块6也使用相同的样式 */
.module-4 .products-grid,
.module-6 .products-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(2, minmax(0, 1fr));
  grid-auto-rows: 1fr;
  gap: 0.3cm;
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0.5cm;
  box-sizing: border-box;
  align-items: stretch;
}

.module-4 .product-card,
.module-6 .product-card {
  cursor: pointer;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.2cm;
  margin: 0;
  padding: 0.2cm;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  transition: all 0.3s;
}

.module-4 .image-container,
.module-6 .image-container {
  width: 100%;
  height: 70%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  flex-shrink: 0;
  min-height: 0;
}

.module-4 .product-info,
.module-6 .product-info {
  height: 30%;
  margin: 0;
  padding: 0.2cm 0.1cm;
  box-sizing: border-box;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 0;
}

/* ========== 模块3样式 ========== */
.module-3 {
  height: 60vh; /* 严格10厘米高度 */
  width: 100vw;
  margin: 0;
  padding: 0;
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
  flex-direction: row-reverse; /* 左右互换 */
}

.module-3 .text-section {
  flex: 50%; /* 严格50%宽度 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.module-3 .image-section {
  flex: 50%; /* 严格50%宽度 */
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* ========== 模块4样式 ========== */
.module-4 {
  height: 12cm; /* 严格12厘米高度 */
  width: 100vw;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.module-4 .products-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 严格5列 */
  grid-template-rows: repeat(2, 1fr); /* 严格2行 */
  gap: 0.3cm; /* 图片间适度空隙 */
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0.5cm;
  box-sizing: border-box;
}

/* ========== 模块5样式 ========== */
.module-5 {
  height: 70vh; /* 严格13厘米高度 */
  width: 100vw;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.module-5 .vertical-split {
  display: flex;
  flex-direction: column; /* 上下布局 */
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

.module-5 .image-top {
  height: 60%; /* 严格60%高度 */
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  flex-shrink: 0;
}
.module-5 .image-top img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 关键：保持比例填充区域 */
  display: block;
}
.module-5 .text-bottom {
  height: 40%; /* 严格40%高度 */
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
  flex-shrink: 0;
}

.module-5 .content-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.2cm;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
}

/* ========== 模块6样式 ========== */
.module-6 {
  height: 12cm; /* 严格12厘米高度 */
  width: 100vw;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.module-6 .products-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 严格5列 */
  grid-template-rows: repeat(2, 1fr); /* 严格2行 */
  gap: 0.3cm; /* 图片间适度空隙 */
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0.5cm;
  box-sizing: border-box;
}

/* ========== 模块间分隔文字 ========== */
.module-spacer {
  width: 100vw;
  margin: 0;
  padding: 0.5cm 0; /* 3行间距 */
  box-sizing: border-box;
  background: transparent;
}

.spacer-text {
  text-align: center;
  font-style: italic;
  font-size: 0.4cm;
  color: #d4af37;
  background: rgba(212, 175, 55, 0.1);
  margin: 0;
  padding: 0.2cm;
  border-radius: 0.1cm;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  box-sizing: border-box;
}

/* ========== 五行模块样式 ========== */
.wu-xing-module {
  height: 8cm; /* 严格8厘米高度 */
  width: 100vw;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.wu-xing-grid {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0.5cm;
  box-sizing: border-box;
}

.element-card {
  text-align: center;
  cursor: pointer;
  flex: 1;
  margin: 0 0.2cm;
  max-width: 20%; /* 一行5个，每个20% */
  height: 80%;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.2cm;
  padding: 0.2cm;
  transition: all 0.3s;
}

.element-card:hover {
  transform: translateY(-0.1cm);
  background: rgba(255, 255, 255, 0.1);
}

.element-card .image-container {
  height: 60%; /* 图像占60%高度 */
  margin-bottom: 0.2cm;
  flex-shrink: 0;
}

.element-card .element-info {
  height: 40%; /* 文字占40%高度 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
  flex-shrink: 0;
}

/* ========== 文本样式 ========== */
.module-title {
  font-size: 0.8cm;
  text-align: center;
  margin: 0 0 0.4cm 0;
  padding: 0;
  color: #d4af37;
  font-weight: 600;
  line-height: 1.2;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
}

.content-text {
  font-size: 0.3cm;
  line-height: 1.3;
  margin: 0;
  padding: 0;
  color: #f0f0f0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
}

.product-name {
  font-size: 0.25cm;
  margin: 0 0 0.1cm 0;
  padding: 0;
  font-weight: 500;
  line-height: 1.2;
  color: #ffffff;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
}

.product-desc {
  font-size: 0.2cm;
  color: #cccccc;
  line-height: 1.2;
  margin: 0;
  padding: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
}

.element-name {
  font-size: 0.25cm;
  font-weight: 600;
  margin: 0 0 0.1cm 0;
  padding: 0;
  line-height: 1.2;
  color: #d4af37;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
}

.element-philosophy {
  font-size: 0.2cm;
  color: #cccccc;
  line-height: 1.2;
  margin: 0;
  padding: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
}

/* ========== 响应式设计 ========== */
@media (max-width: 1024px) {
  .module-2 .products-grid,
  .module-4 .products-grid,
  .module-6 .products-grid {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 0.2cm;
  }

  .wu-xing-grid {
    flex-wrap: wrap;
    gap: 0.2cm;
  }

  .element-card {
    flex: 0 0 calc(33.333% - 0.2cm);
    max-width: calc(33.333% - 0.2cm);
    height: 45%;
  }
}

@media (max-width: 768px) {
  .module-1 .module-content,
  .module-3 .module-content {
    flex-direction: column;
  }

  .module-1 .text-section,
  .module-3 .text-section {
    flex: 1;
    max-width: 100%;
    height: 50%;
  }

  .module-1 .image-section,
  .module-3 .image-section {
    flex: 1;
    max-width: 100%;
    height: 50%;
  }

  .module-2 .products-grid,
  .module-4 .products-grid,
  .module-6 .products-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: 0.15cm;
  }

  .wu-xing-grid {
    flex-wrap: wrap;
    gap: 0.15cm;
  }

  .element-card {
    flex: 0 0 calc(50% - 0.15cm);
    max-width: calc(50% - 0.15cm);
    height: 30%;
  }

  .module-title {
    font-size: 0.6cm;
  }

  .content-text {
    font-size: 0.25cm;
  }
}

@media (max-width: 480px) {
  .module-2 .products-grid,
  .module-4 .products-grid,
  .module-6 .products-grid {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(10, 1fr);
    gap: 0.1cm;
  }

  .element-card {
    flex: 0 0 100%;
    max-width: 100%;
    height: 15%;
  }

  .module-title {
    font-size: 0.5cm;
  }

  .content-text {
    font-size: 0.2cm;
  }
}

/* 严格的溢出控制 */
.module-1,
.module-2,
.module-3,
.module-4,
.module-5,
.module-6,
.wu-xing-module {
  overflow: hidden;
}

.text-section > *,
.text-bottom > *,
.content-grid > *,
.content-list > *,
.product-info > *,
.element-info > * {
  max-width: 100% !important;
  overflow: hidden !important;
  box-sizing: border-box !important;
}

/* 确保所有元素都不会产生滚动条 */
* {
  box-sizing: border-box;
}
</style>
