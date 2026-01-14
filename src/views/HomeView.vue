<template>
  <div class="homepage">
    <!-- 循环单元 -->
    <div v-for="(intent, index) in emotionalIntents" :key="intent.id" class="intent-unit">
      <!-- 第一单元 -->
      <template v-if="index % 3 === 0">
        <section class="module-1">
          <div class="module-container">
            <div class="module-content">

              <div class="text-section">
                <h1 class="module-title">{{ intent.symbolCharacter }}-{{ intent.intentNameEn }}</h1>
                <div class="content-grid">
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.primaryEmotionEn }}/{{ intent.secondaryEmotionsEn }}</p>
                  </div>
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.philosophyMeaningEn }}-{{ intent.culturalSignificanceEn }}</p>
                  </div>
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.spiritualMeaningEn }}/{{ intent.careerAlignmentEn }}</p>
                  </div>
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.personalityArchetypeEn }}/{{ intent.healingPropertyEn }}</p>
                  </div>
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.relationshipImpactEn }}</p>
                  </div>
                </div>
              </div>
              <div class="image-section">
                <img
                  :src="intent.iconUrl"
                  :alt="intent.intentNameEn"
                  @click="navigateToIntentProducts(intent.id)"
                  class="adaptive-image fill-image"
                />
              </div>
            </div>
          </div>
        </section>

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
                    :src="product.mainImageUrl"
                    :alt="product.productNameEn"
                    class="product-image fill-image"
                  />
                </div>
                <div class="product-info strict-text-container">
                  <h3 class="product-name strict-text">{{ product.productNameEn }}</h3>
                  <h3 class="product-name strict-text">{{ product.shortDescriptionEn }}</h3>
<!--                  <h3 class="product-name strict-text">{{ product.emotionalPurposeEn }}</h3>-->
<!--                  <p class="product-desc strict-text">{{ product.fullDescriptionEn }}</p>-->
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>
      <!-- 第二单元 -->
      <template v-else-if="index % 3 === 1">
        <section class="module-3">
          <div class="module-container">
            <div :class="['module-content', 'reversed']">
              <div class="text-section">
                <h1 class="module-title">{{ intent.symbolCharacter }}-{{ intent.intentNameEn }}</h1>
                <div class="content-grid">

                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.primaryEmotionEn }}/{{ intent.secondaryEmotionsEn }}</p>
                  </div>
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.philosophyMeaningEn }}-{{ intent.culturalSignificanceEn }}</p>
                  </div>
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.spiritualMeaningEn }}/{{ intent.careerAlignmentEn }}</p>
                  </div>
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.personalityArchetypeEn }}/{{ intent.healingPropertyEn }}</p>
                  </div>
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.relationshipImpactEn }}</p>
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
                    :src="product.mainImageUrl"
                    :alt="product.productNameEn"
                    class="product-image fill-image"
                  />
                </div>
                <div class="product-info strict-text-container">
                  <h3 class="product-name strict-text">{{ product.productNameEn }}</h3>
                  <h3 class="product-name strict-text">{{ product.shortDescriptionEn }}</h3>
<!--                  <h3 class="product-name strict-text">{{ product.emotionalPurposeEn }}</h3>-->
<!--                  <p class="product-desc strict-text">{{ product.fullDescriptionEn }}</p>-->
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>
      <!-- 第三单元 -->
      <template v-else>
        <section class="module-5">
          <div class="module-container">
            <div class="vertical-split">
              <div class="image-top">
                <img
                  :src="intent.iconUrl"
                  :alt="intent.intentNameEn"
                  @click="navigateToIntentProducts(intent.id)"
                  class="adaptive-image fill-image"
                />
              </div>
              <div class="text-bottom">
                <h1 class="module-title">{{ intent.symbolCharacter }}-{{ intent.intentNameEn }}</h1>
                <div class="content-list">
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.primaryEmotionEn }}/{{ intent.secondaryEmotionsEn }}</p>
                  </div>
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.philosophyMeaningEn }}-{{ intent.culturalSignificanceEn }}</p>
                  </div>
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.spiritualMeaningEn }}/{{ intent.careerAlignmentEn }}</p>
                  </div>
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.personalityArchetypeEn }}/{{ intent.healingPropertyEn }}</p>
                  </div>
                  <div class="content-item">
                    <p class="content-text strict-text">{{ intent.relationshipImpactEn }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

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
                    :src="product.mainImageUrl"
                    :alt="product.productNameEn"
                    class="product-image fill-image"
                  />
                </div>
                <div class="product-info strict-text-container">
                  <h3 class="product-name strict-text">{{ product.productNameEn }}</h3>
                  <h3 class="product-name strict-text">{{ product.shortDescriptionEn }}</h3>
<!--                  <h3 class="product-name strict-text">{{ product.emotionalPurposeEn }}</h3>-->
<!--                  <p class="product-desc strict-text">{{ product.fullDescriptionEn }}</p>-->
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>
    </div>

    <!-- 最后一个独立单元 五行模块 -->
    <section class="wu-xing-module" v-if="wuXingAttributes.length > 0">
      <div class="module-spacer" v-if="wuXingAttributes.mythologicalAssociationEn">
        <div class="spacer-text">{{ wuXingAttributes.mythologicalAssociationEn }}</div>
      </div>
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
                :src="element.symbolIconUrl"
                :alt="element.elementCode"
                class="element-image fill-image"
              />
            </div>
            <div class="element-info strict-text-container">
<!--              <div class="element-name strict-text">{{ element.cosmologyMeaningEn }}</div>-->
              <div class="element-name strict-text">{{ element.philosophyMeaningEn }}</div>
<!--              <div class="element-name strict-text">{{ element.lifePhilosophyEn }}</div>
              <div class="element-philosophy strict-text">{{ element.culturalSymbolismEn }}</div>-->
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
//  console.info("导航navigateToIntentProducts-获取所属情感意图商品SPU集合，参数intentId is ：",intentId)
  if (!intentId || intentId.includes('placeholder')) return
  router.push(`/product-spu/selectSpuByIntentId/spu/${intentId}`)
}
// 商品详情
const navigateToProduct = (productId) => {
 // console.info("导航navigateToProduct - 获取商品详情，productId is ：",productId)
  if (!productId || productId.includes('placeholder')) return
  router.push(`/product-spu/getByid/${productId}`)
}
// 五行
const navigateToWuXing = (elementId) => {
 // console.info("导航navigateToWuXing - 五行详情，elementId is ：",elementId)
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
      isPlaceholder: true
    }))
    return [...products, ...placeholders]
  }
  return products.slice(0, PRODUCT_LIMIT)
}

// 修改商品点击处理，添加更详细的调试信息
const handleProductClick = (product) => {
  // console.log('点击的商品完整信息:', product)
  // console.log('商品ID字段详情:', {
  //   id: product.id,
  //   spuId: product.spuId,
  //   hasId: !!product.id,
  //   hasSpuId: !!product.spuId
  // })

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
   // console.log('占位商品，不可点击')
    return
  }

  console.log(`导航到商品详情: ${productId}`)
  navigateToProduct(productId)
}

// API调用方法
const fetchEmotionalIntents = async () => {
  try {
    //console.info('----------------------开始获取情感意图数据---------------------------...')
    const response = await fetch('/api/emotional-intent/list')
   // console.info("获取情感意图 API 数据response:",response)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const result = await response.json()
    console.info('情感意图---------------API原始响应:', result)
    const intentsData = extractDataFromResponse(result)
    if (!Array.isArray(intentsData)) {
      throw new Error('情感意图数据格式不正确')
    }
    emotionalIntents.value = intentsData.map(preprocessIntentData)
  //  console.info('情感意图数据获取成功:', intentsData.length, '条记录')

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
  //  console.log('----------------------开始获所属取情感意图   ${intentId}   SPU数据---------------------------')
   // console.log(`获取意图 ${intentId} 的商品数据...`)
    // 使用现有正常工作的接口格式
    const response = await fetch(`/api/product-spu/selectProductsByIntentIdIndex/${intentId}/10`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const result = await response.json()
   // console.log(`意图 ${intentId} 商品API原始响应:`, result)
    const productsData = extractDataFromResponse(result)
    if (!Array.isArray(productsData)) {
      console.warn(`意图 ${intentId} 商品数据格式不正确:`, productsData)
      return []
    }
    const processedProducts = productsData.map(preprocessProductData)
  //  console.log(`----888-----意图 ${intentId} 商品数据获取成功:`, processedProducts.length, '个SPU商品')
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
 //   console.log('---------------开始获取五行属性数据-------------...')
    // 关键修正：使用现有正常工作的接口地址
    const response = await fetch('/api/wu-xing-attributes/tier/1')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const result = await response.json()
  //  console.log('五行属性API原始响应:', result)
    const wuXingData = extractDataFromResponse(result)
    if (!Array.isArray(wuXingData)) {
      console.warn('五行属性数据格式不正确:', wuXingData)
      wuXingAttributes.value = []
      return
    }
    wuXingAttributes.value = wuXingData.map(preprocessWuXingData)
   // console.log('五行属性数据获取成功:', wuXingData.length, '条记录')
  } catch (error) {
    console.error('获取五行属性数据失败:', error)
    wuXingAttributes.value = []
  }
}

// 数据预处理
const preprocessIntentData = (intent) => {
  return {
    ...intent,
    primaryEmotionEn: processText(intent.primaryEmotionEn, 5000),
    secondaryEmotionsEn: processText(intent.secondaryEmotionsEn, 5000),
    philosophyMeaningEn: processText(intent.philosophyMeaningEn, 5000),
    spiritualMeaningEn: processText(intent.spiritualMeaningEn, 5000),
    modernInterpretationEn: processText(intent.modernInterpretationEn, 5000)
  }
}

const preprocessProductData = (product) => {
  // 明确ID优先级：spuId > id
  const productId = product.spuId || product.id;

  if (!productId) {
    console.warn('商品数据缺少ID字段:', product);
  }

  // 关键修复：统一ID字段映射
  const processedProduct = {
    ...product,
    // 统一ID字段：spuId -> id
    id: productId,
    // 确保必要字段存在
    productNameEn: processText(product.productNameEn || '', 1300),
    shortDescriptionEn: processText(product.shortDescriptionEn || '', 2500),
    mainImageUrl: product.mainImageUrl
  }
  //console.log(`商品数据映射: spuId=${product.id} -> id=${processedProduct.id}`)
  return processedProduct
}

const preprocessWuXingData = (element) => {
  return {
    ...element,
    elementNameEn: processText(element.elementNameEn, 1500),
    philosophyMeaningEn: processText(element.philosophyMeaningEn, 3000)
  }
}

// 文本处理
const processText = (text, maxLength = 3000) => {
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
  height: auto;
  /* object-fit: fill; 关键：完全拉伸填充 */
  /* display: block; */
  /* margin: 0; */
  /* padding: 0; */
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
  line-height: 1.3;
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
  height: 70vh;
  min-height: 500px;
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
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 15px;
  box-sizing: border-box;
  overflow: hidden;
}

.module-1 .image-section {
  flex: 1;
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* 图片自适应填充 - 简化版 */
.module-1 .adaptive-image {
  width: auto;
  height: auto;
  object-fit: cover; /* 自动缩放填充 */
  object-position: center;
  display: block;
}
/* ========== 模块2样式 ========== */
.module-2 {
  height: auto; /* 改为自适应高度 */
  min-height: 60vh; /* 最小高度保障2行显示 */
  width: 100vw;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.module-2 .products-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  /* 删除或注释掉下面这行 */
  /* grid-template-rows: repeat(2, minmax(0, 1fr)); */
  grid-auto-rows: auto; /* 自动行高 */
  gap: 0.3cm;
  height: auto; /* 自适应高度 */
  width: 100%;
  margin: 0;
  padding: 0.5cm;
  box-sizing: border-box;
  align-items: stretch;
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
  /* height: 70%; 固定图片区域比例 */
  margin: 0;
  padding: 0;
  overflow: hidden;
  /* flex-shrink: 0; 防止被压缩 */
  min-height: 0; /* 允许收缩 */
}
.module-2 .product-image {
  width: 100%;
  height: 100%; /* 图片占卡片70%高度 */
  margin: 0;
  padding: 0;
  border-radius: 0.15cm;
  object-fit: fill; /* 完全填充 */
  flex-shrink: 0;
}

.module-2 .product-info {
  height: auto; /* 自适应高度 */
  min-height: 10%; /* 最小高度保障 */
  margin: 0;
  padding: 0.1cm 0.05cm; /* 减小内边距 */
  box-sizing: border-box;
  overflow: visible; /* 显示所有内容 */
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 顶部对齐 */
  gap: 0.1cm; /* 行间距 */
}
/* 确保模块4和模块6也使用相同的样式 */
.module-4 .products-grid,
.module-6 .products-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(2, minmax(300px, 1fr)); /* 添加最小高度约束 */
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

.module-4 .image-container {
  width: 100%;
  height: 90%; /* 固定图片区域比例 */
  margin: 0;
  padding: 0;
  overflow: hidden;
  flex-shrink: 0; /* 防止被压缩 */
  min-height: 0; /* 允许收缩 */
}

.module-4 .product-image {
  width: 100%;
  height: 100%; /* 图片占卡片70%高度 */
  margin: 0;
  padding: 0;
  border-radius: 0.15cm;
  object-fit: fill; /* 完全填充 */
  flex-shrink: 0;
}

.module-6 .image-container {
  width: 100%;
  height: 90%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  flex-shrink: 0;
  min-height: 0;
}

.module-4 .product-info,
.module-6 .product-info {
  height: auto; /* 自适应高度 */
  min-height: 10%; /* 最小高度保障 */
  margin: 0;
  padding: 0.1cm 0.05cm; /* 减小内边距 */
  box-sizing: border-box;
  overflow: visible; /* 显示所有内容 */
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 顶部对齐 */
  gap: 0.1cm; /* 行间距 */
}

/* ========== 模块3样式 ========== */
.module-3 {
  height: 60vh;
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
  flex: 1; /* 严格50%宽度 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 15px;
  box-sizing: border-box;
  overflow: hidden;
}
.module-3 .image-section {
  flex: 1; /* 严格50%宽度 */
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: visible; /* 改为visible，不隐藏溢出 */
  position: relative;
  display: flex; /* 使用flex布局 */
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  background: rgba(0, 0, 0, 0.02); /* 可选的背景色 */
}

.module-3 .adaptive-image {
  /* 核心自适应设置 */
  max-width: 100%; /* 最大不超过容器宽度 */
  max-height: 100%; /* 最大不超过容器高度 */
  width: auto; /* 宽度自适应 */
  height: auto; /* 高度自适应 */
  object-fit: contain; /* 保持比例，完整显示 */
  object-position: center; /* 居中显示 */
  display: block;
  margin: auto; /* 自动居中 */
}

/* ========== 模块4样式 ========== */
.module-4 {
  /* height: 12cm; 严格12厘米高度 */
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
  //height: 70vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.module-5 .vertical-split {
  display: flex;
  flex-direction: column; /* 上下布局 */
  height: 80vh; /* 全屏高度 */
  min-height: 800px; /* 最小高度保障 */
  width: 100%;
  margin: 0;
  padding: 0;
}

.module-5 .image-top {
  height: 40%; /* 严格60%高度 */
  min-height: 40vh; /* 最小高度保障 */
  display: flex; /* ✅ 改为flex布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  overflow: visible; /* ✅ 允许图片完整显示 */
  position: relative;
  width: 100%;
  margin: 0;
  padding: 0;
  flex-shrink: 0;
}
.module-5 .image-top img {
  width: 100%;
  height: 100%;
  object-fit: contain !important; /* ✅ 不裁剪，完整显示 */
  display: block;
}
.module-5 .text-bottom {
  height: 60%; /* 严格40%高度 */
  min-height: 60vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 15px;
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
  padding-right: 15px;
  box-sizing: border-box;
  overflow: hidden;
}

/* ========== 模块6样式 ========== */
.module-6 {
  /* height: 12cm; 严格12厘米高度 */
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
.module-6 .product-image {
  width: 100%;
  height: 100%;
  object-fit:  fill !important; /* 改为fill填充 */
  object-position: center; /* 居中显示 */
  border-radius: 0.15cm;
}

/* ========== 模块间分隔文字 ========== */
.module-spacer {
  width: 100vw;
  margin: 0;
  padding: 0.5cm 0;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spacer-text {
  font-family: 'Brush Script MT', cursive, serif; /* 艺术字体 */
  font-size: 0.8cm;
  font-weight: bold;  /* 添加这一行 */
  color: #d4af37;
  text-align: center;
  line-height: 1.6;
  margin: 0 auto;
  padding: 0.3cm 0.5cm;
  //background: rgba(212, 175, 55, 0.1);
  border-radius: 0.2cm;
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: unset !important;
  word-wrap: break-word !important;
  word-break: break-word !important;
  display: block !important;
  max-width: 100% !important;
  height: auto !important;
  min-height: auto !important;
  max-height: none !important;
  -webkit-line-clamp: unset !important;
  -webkit-box-orient: unset !important;
}

/* ========== 五行模块样式 ========== */
.wu-xing-module {
  /* height: 8cm; 严格8厘米高度 */
  width: 100vw;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.wu-xing-grid {
  display: flex;
  flex-wrap: nowrap; /* 确保不换行 */
  justify-content: space-around;
  align-items: stretch; /* 确保所有卡片等高 */
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0.5cm;
  box-sizing: border-box;
  gap: 0.3cm; /* 使用gap替代margin */
}

.element-card {
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
  /* height: 100%; 占满容器高度 */
  min-height: 0; /* 关键：允许在网格中收缩 */
  transition: all 0.3s;
  flex: 1; /* 平均分配空间 */
}

.element-card:hover {
  transform: translateY(-0.1cm);
  background: rgba(255, 255, 255, 0.1);
}

.element-card .image-container {
  width: 100%;
  height: 90%; /* 固定图片区域比例，与product-card一致 */
  margin: 0;
  padding: 0;
  overflow: hidden;
  flex-shrink: 0; /* 防止被压缩 */
  min-height: 0; /* 允许收缩 */
}

.element-card .element-image {
  width: 100%;
  height: 100%; /* 填充整个image-container */
  margin: 0;
  padding: 0;
  border-radius: 0.15cm; /* 与product-image一致 */
  object-fit: fill; /* 完全填充，与product-image一致 */
  flex-shrink: 0;
}

.element-card .element-info {
  height: 10%; /* 文字占卡片30%高度，与product-info一致 */
  margin: 0;
  padding: 0.2cm 0.1cm; /* 与product-info一致 */
  box-sizing: border-box;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 与product-info一致 */
  min-height: 0; /* 允许收缩 */
}

.element-card .element-info.strict-text-container {
  overflow: hidden; /* 与product-info一致 */
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
  font-size: 0.45cm;
  line-height: 1.5;
  margin: 0;
  padding: 0;
  color: #f0f0f0;
  max-width: 100%;
  box-sizing: border-box;
}

.product-name {
  font-family: 'Montserrat', 'Arial', sans-serif;
  font-size:15px; /* 稍微减小字体 */
  margin: 0;
  padding: 0;
  font-weight: 500;
  line-height: 1.1; /* 紧凑行高 */
  color: #ffffff;
  max-width: 100%;
  box-sizing: border-box;
  white-space: normal; /* 允许多行 */
  overflow: visible; /* 显示所有内容 */
  display: block;
}

.product-desc {
  font-size:10px; /* 稍微减小字体 */
  color: #cccccc;
  line-height: 1.1; /* 紧凑行高 */
  margin: 0;
  padding: 0;
  max-width: 100%;
  white-space: normal; /* 允许多行 */
  overflow: visible; /* 显示所有内容 */
  text-overflow: unset; /* 移除省略号 */
  display: block;
  box-sizing: border-box;
}

.element-name {
  font-size: 0.28cm;
  font-weight: 600;
  margin: 0;
  padding: 0.02cm 0;
  line-height: 1.4;
  color: #d4af37;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
  text-align: center;
  display: block; /* 确保显示 */
}

.element-philosophy {
  font-size: 0.22cm;
  color: #cccccc;
  line-height: 1.4;
  margin: 0;
  padding: 0.02cm 0;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
  text-align: center;
  display: block; /* 确保显示 */
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
.element-info > *,
.spacer-text {
  max-width: 100% !important;
  overflow: visible !important; /* ✅ 改为可见 */
  box-sizing: border-box !important;
  text-align: center;
  white-space: normal !important; /* ✅ 添加允许换行 */
}

/* 确保所有元素都不会产生滚动条 */
* {
  box-sizing: border-box;
}
</style>
