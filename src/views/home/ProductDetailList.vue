<template>
  <div class="product-detail-page">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading data...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="fetchProductData">Reload</button>
    </div>

    <!-- 商品详情内容 -->
    <div v-else-if="productData" class="product-content">
      <!-- 第一部分：商品展示区 -->
      <section class="product-display-section">
        <div class="display-container">
          <!-- 左侧图片展示区 -->
          <div class="image-section">
            <!-- 左侧SKU选择器（缩略图区域） -->
            <div class="thumbnail-container">
              <div
                v-for="(sku, index) in skuList"
                :key="sku.id"
                class="thumbnail-item"
                :class="{ active: currentSku.id === sku.id }"
                @click="selectSku(sku)"
              >
                <img
                  v-if="sku.mainImageUrl"
                  :src="sku.mainImageUrl"
                  @error="handleImageError"
                  class="thumbnail-img"
                  :alt="sku.skuNameEn"
                />
              </div>
            </div>

            <!-- 右侧主图区域 -->
            <div class="main-image-container">
              <div v-if="imageList.length > 0" class="image-carousel">
                <img
                  :src="currentImage.src"
                  @error="handleImageError"
                  class="main-image"
                  :alt="currentImage.alt"
                  :key="currentImage.uniqueKey"
                />
                <div class="image-meta">
<!--                  {{ currentImage.alt }} -->
                  ({{ currentImageIndex + 1 }}/{{ imageList.length }})
<!--                  <span style="font-size: 12px; color: #ccc;">{{ currentImage.fieldName }}</span>-->
                </div>

                <!-- 图片导航 -->
                <div class="image-navigation">
                  <button
                    @click="prevImage"
                    class="nav-btn prev"
                    :disabled="currentImageIndex === 0"
                  >
                    ‹
                  </button>
                  <span class="nav-info">{{ currentImageIndex + 1 }}/{{ imageList.length }}</span>
                  <button
                    @click="nextImage"
                    class="nav-btn next"
                    :disabled="currentImageIndex === imageList.length - 1"
                  >
                    ›
                  </button>
                </div>
              </div>
              <div v-else class="image-placeholder">
                NO Data
              </div>
            </div>
          </div>

          <!-- 右侧信息展示区 -->
          <div class="info-section">
            <div class="product-info">
              <!-- SPU基本信息 -->
              <h1 class="product-name">{{ productData.spu.productNameEn }}</h1>
              <p class="product-subtitle">{{ productData.spu.shortDescriptionEn }}</p>

<!--              <div class="basic-info">
                  <span v-if="productData.spu.spuCode" class="info-tag">Code: {{productData.spu.spuCode }}</span>
&lt;!&ndash;                <span v-if="productData.spu.brandNameZh" class="info-tag">品牌: {{productData.spu.brandNameZh }}</span>
                <span v-if="productData.spu.categoryNameZh" class="info-tag">分类: {{productData.spu.categoryNameZh }}</span>
                <span v-if="productData.spu.collectionNameZh" class="info-tag">系列: {{ productData.spu.collectionNameZh }}</span>
                <span v-if="productData.spu.productType" class="info-tag">类型: {{productData.spu.productType }}</span>
                <span v-if="productData.spu.style" class="info-tag">风格: {{ productData.spu.style }}</span>
                <span v-if="productData.spu.theme" class="info-tag">主题: {{ productData.spu.theme }}</span>&ndash;&gt;
              </div>-->

              <!-- 玄学标签 -->

              <div class="metaphysical-tags">
                <div class="tag-item" v-if="currentSkuElement">
                  <span class="icon">🌍</span>
                  <span>Five Elements: {{ currentSkuElement }}</span>
                </div>
                <div class="tag-item" v-if="productData.spu.primaryElement">
                  <span class="icon">☯️</span>
                  <span>Element: {{ getElementName(productData.spu.primaryElement) }}</span>
                </div>
                <div class="tag-item" v-if="currentSku.gemstoneType">
                  <span class="icon">💎</span>
                  <span>Gemstone: {{ currentSku.gemstoneType }}</span>
                </div>
<!--                <div class="tag-item" v-if="productData.spu.targetZodiacSigns">
                  <span class="icon">♏️</span>
                  <span>Zodiac: {{ productData.spu.targetZodiacSigns }}</span>
                </div>
                <div class="tag-item" v-if="productData.spu.targetChakra">
                  <span class="icon">🌀</span>
                  <span>Chakra: {{ productData.spu.targetChakra }}</span>
                </div>-->
                <div class="tag-item" v-if="currentSku.variantYuyiEn">
                  <span class="icon">✨</span>
                  <span>Symbolism: {{ currentSku.variantYuyiEn }}</span>
                </div>
              </div>
              <!-- SKU选择器 -->
              <div class="sku-selector" v-if="skuList.length > 0">
                <h3>Select Specifications:</h3>
                <div class="sku-dropdown">
                  <select
                    v-model="currentSkuIndex"
                    @change="onSkuDropdownChange"
                    class="sku-select"
                  >
                    <option
                      v-for="(sku, index) in skuList"
                      :key="sku.id"
                      :value="index"
                    >
                      {{ sku.skuNameEn || sku.skuNameEn }}
                      <span v-if="sku.skuCode">({{ sku.skuCode }})</span>
                      - ${{ formatPrice(sku.finalPrice || sku.retailPrice || sku.price) }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- 价格信息 -->
              <div class="price-section">
                <span class="price">${{ formatPrice(currentPrice) }}</span>
                <span v-if="hasDiscount" class="original-price">
                  ${{ formatPrice(currentSku.retailPrice) }}
                </span>
                <span v-if="currentSku.discountRate" class="discount-rate">-{{ currentSku.discountRate }}%</span>
                <span v-if="currentSku.priceUnit" class="price-unit">{{ currentSku.priceUnit }}</span>
              </div>

              <!-- 库存信息 -->
              <div class="stock-info">
                <span class="stock-label">Stock:</span>
                <span class="stock-quantity" :class="{ 'low-stock': currentSku.stockQuantity < 10 }">
                 {{ currentSku.stockQuantity || 0 }} pcs
                </span>
                <span v-if="currentSku.stockQuantity < 10" class="stock-warning">(Low Stock)</span>
                <span v-if="currentSku.safetyStockQuantity" class="safety-stock">
                Safety Stock: {{ currentSku.safetyStockQuantity }} pcs
                </span>
                <span v-if="currentSku.reservedQuantity" class="reserved-stock">
                  Reserved: {{ currentSku.reservedQuantity }} pcs
                </span>
                <span v-if="currentSku.availableQuantity" class="available-stock">
                 Available: {{ currentSku.availableQuantity }} pcs
                </span>
              </div>

              <!-- 信任标识 -->
<!--              <div class="trust-badges">
                <div class="badge-item">
                  <span class="icon">⛭</span>
                  <span>Free Global Shipping</span>
                </div>
                <div class="badge-item" v-if="currentSku.certificationType">
                  <span class="icon">📜</span>
                  <span>{{ currentSku.certificationType }} Certified</span>
                </div>
                <div class="badge-item">
                  <span class="icon">↻</span>
                  <span>30-Day Return (No Questions Asked)</span>
                </div>
              </div>-->
              <!-- 操作按钮 -->
              <div class="action-buttons">
<!--                <button class="btn-secondary" @click="buyNow">🛒 Buy Now</button>-->
                <button class="btn-primary" @click="addToCart">❤️ Add to Cart 🛒 </button>
              </div>
              <!-- 快速信息 -->
<!--              <div class="quick-info-grid">
                <div class="info-item" v-if="currentSku.skuCode">
                  <span class="value">{{ currentSku.skuCode }}</span>
                </div>
              </div>-->
            </div>
          </div>
        </div>
      </section>


      <!-- 第二部分：深度叙事与内涵区 -->
      <section class="narrative-section">
        <div class="section-container">
          <h2 class="section-title">Deep Narrative and Connotation</h2>
          <div class="tab-container">
            <div class="tab-content">
              <!-- 工艺与材质 -->
              <div class="tab-panel">
                <div class="specs-categories">
                  <!-- 宝石信息 -->
                  <div class="spec-category">
                    <div class="specs-grid">
                      <div class="spec-item" v-if="currentSku.gemstoneType">
                        <span class="spec-value">{{ currentSku.gemstoneType }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.gemstoneWeightCt">
                        <span class="spec-value">{{ currentSku.gemstoneWeightCt }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.gemstoneCut">
                        <span class="spec-value">{{ currentSku.gemstoneCut }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.gemstoneQuality">
                        <span class="spec-value">{{ currentSku.gemstoneQuality }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.gemstoneShape">
                        <span class="spec-value">{{ currentSku.gemstoneShape }}</span>
                      </div>
                    </div>
                  </div>
                  <!-- 金属信息 -->
                  <div class="spec-category">
                    <div class="specs-grid">
                      <div class="spec-item" v-if="currentSku.primaryMaterial">
                        <span class="spec-value">{{ currentSku.primaryMaterial }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.metalWeightG">
                        <span class="spec-value">{{ currentSku.metalWeightG }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.materialFinish">
                        <span class="spec-value">{{ currentSku.materialFinish }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.settingTechnique">
                        <span class="spec-value">{{ currentSku.settingTechnique }}</span>
                      </div>
                    </div>
                  </div>
                  <!-- 尺寸信息 -->
                  <div class="spec-category">
                    <div class="specs-grid">
                      <div class="spec-item" v-if="currentSku.chainLengthCm">
                        <span class="spec-value">{{ currentSku.chainLengthCm }}CM</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.pendantSizeMm">
                        <span class="spec-value">{{ currentSku.pendantSizeMm }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.totalWeightG">
                        <span class="spec-value">{{ currentSku.totalWeightG }}g</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div class="tab-panel">
                <div class="info-block">
                  <img
                    v-if="productData.spu.mainImageUrl"
                    :src="productData.spu.mainImageUrl"
                  >
                </div>
                <!-- SPU叙事信息 -->
                <div class="info-block" v-if="productData.spu.primaryElement">
                  <p>{{ productData.spu.primaryElement }}</p>
                </div>
                <div class="info-block" v-if="productData.spu.elementCombination">
                  <p>{{ productData.spu.elementCombination }}</p>
                </div>
<!--                <div class="info-block" v-if="productData.spu.materialStandards">-->
<!--                  <p>{{ productData.spu.materialStandards }}</p>-->
<!--                </div>-->
                <div class="info-block">
                  <img
                    v-if="productData.spu.designImageUrl"
                    :src="productData.spu.designImageUrl"
                  >
                </div>
<!--                <div class="info-block" v-if="productData.spu.craftsmanshipStandards">-->
<!--                  <p>{{ productData.spu.craftsmanshipStandards }}</p>-->
<!--                </div>-->
<!--                <div class="info-block" v-if="productData.spu.qualityStandards">-->
<!--                  <p>{{ productData.spu.qualityStandards }}</p>-->
<!--                </div>-->
                <div class="info-block" v-if="productData.spu.productionGuidelinesEn">
                  <p>{{ productData.spu.productionGuidelinesEn }}</p>
                </div>
                <img
                  v-if="productData.spu.prototypeImageUrl"
                  :src="productData.spu.prototypeImageUrl"
                >
                <div class="info-block" v-if="productData.spu.productNameEn">
                  <p>{{ productData.spu.productNameEn }}</p>
                </div>
                <div class="info-block" v-if="productData.spu.shortDescriptionEn">
                  <p>{{ productData.spu.shortDescriptionEn }}</p>
                </div>
                <div class="info-block" v-if="productData.spu.fullDescriptionEn">
                  <p>{{ productData.spu.fullDescriptionEn }}</p>
                </div>
                <div class="info-block">
                  <img
                    v-if="productData.spu.conceptImageUrl"
                    :src="productData.spu.conceptImageUrl"
                  >
                </div>
                <div class="info-block" v-if="productData.spu.designConceptEn">
                  <p>{{ productData.spu.designConceptEn }}</p>
                </div>
                <div class="info-block" v-if="productData.spu.intendedUsageEn">
                  <p>{{ productData.spu.intendedUsageEn }}</p>
                </div>
                <div class="info-block" v-if="productData.spu.emotionalPurposeEn">
                  <p>{{ productData.spu.emotionalPurposeEn }}</p>
                </div>
                <div class="info-block">
                  <img
                    v-if="productData.spu.usageImageUrl"
                    :src="productData.spu.usageImageUrl"
                  >
                </div>
                <div class="info-block" v-if="productData.spu.spiritualSignificanceEn">
                  <p>{{ productData.spu.spiritualSignificanceEn }}</p>
                </div>
                <div class="info-block" v-if="productData.spu.energyPropertiesEn">
                  <p>{{ productData.spu.energyPropertiesEn }}</p>
                </div>

                <div class="info-block" v-if="productData.spu.metaTitleEn">
                  <p>{{ productData.spu.metaTitleEn }}</p>
                </div>
                <div class="info-block" v-if="productData.spu.metaDescriptionEn">
                  <p>{{ productData.spu.metaDescriptionEn }}</p>
                </div>
                <div class="info-block" v-if="productData.spu.metaKeywordsEn">
                  <p>{{ productData.spu.metaKeywordsEn }}</p>
                </div>
                <div class="info-block">
                  <img
                    v-if="productData.spu.technicalImageUrl"
                    :src="productData.spu.technicalImageUrl"
                  >
                </div>
                <!-- 评分信息 -->
                <div class="score-section">
                  <h4>Sorts 🏆</h4>
                  <div class="scores-grid">
                    <div class="score-item" v-if="productData.spu.aiDesignScore">
                      <span class="score-value">{{ productData.spu.aiDesignScore }}/100</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 第三部分：五行叙事信息 -->
      <section class="narrative-section">
        <div class="section-container">
          <h2 class="section-title">Five Elements Attribute Details</h2>
          <div class="tab-container"  v-if="wuxingList && wuxingList.length > 0">
            <div class="tab-content"  v-for="(wuxing, index) in wuxingList" :key="wuxing.id || index">
              <div class="tab-panel">
                <div class="info-block">
                  <img
                    v-if="wuxing.energyFlowImageUrl"
                    :src="wuxing.energyFlowImageUrl"
                  >
                </div>
                <div class="info-block" v-if="wuxing.elementNameEn">
                  <span>{{ wuxing.elementNameEn }}</span>
                </div>

                <div class="info-block" v-if="wuxing.artisticExpressionEn">
                  <span> {{ wuxing.artisticExpressionEn }}</span>
                </div>
                <div class="info-block" v-if="wuxing.changePrincipleEn">
                  <span>{{ wuxing.changePrincipleEn }}</span>
                </div>

                <div class="info-block" v-if="wuxing.cosmologyMeaningEn">
                  <span> {{ wuxing.cosmologyMeaningEn }}</span>
                  <div class="info-block">
                    <img
                      v-if="wuxing.symbolIconUrl"
                      :src="wuxing.symbolIconUrl"
                    >
                  </div>
                </div>
                <div class="info-block" v-if="wuxing.culturalSymbolismEn">
                  <span>{{ wuxing.culturalSymbolismEn }}</span>
                </div>
                <div class="info-block" v-if="wuxing.energyEssenceEn">
                  <span> {{ wuxing.energyEssenceEn }}</span>
                </div>
                <div class="info-block" v-if="wuxing.energyManifestationEn">
                  <span>{{ wuxing.energyManifestationEn }}</span>
                </div>

                <div class="info-block" v-if="wuxing.healingPropertyEn">
                  <span> {{ wuxing.healingPropertyEn }}</span>
                </div>
                <div class="info-block" v-if="wuxing.historicalReferenceEn">
                  <span>{{ wuxing.historicalReferenceEn }}</span>
                </div>

                <div class="info-block" v-if="wuxing.lifePhilosophyEn">
                  <span> {{ wuxing.lifePhilosophyEn }}</span>
                </div>
                <div class="info-block" v-if="wuxing.mythologicalAssociationEn">
                  <span>{{ wuxing.mythologicalAssociationEn }}</span>
                </div>
                <div class="info-block">
                  <img
                    v-if="wuxing.symbolIconUrl"
                    :src="wuxing.symbolIconUrl"
                  >
                </div>
                <div class="info-block" v-if="wuxing.personalityArchetypeEn">
                  <span> {{ wuxing.personalityArchetypeEn }}</span>
                </div>
                <div class="info-block" v-if="wuxing.philosophyMeaningEn">
                  <span>{{ wuxing.philosophyMeaningEn }}</span>
                </div>

                <div class="info-block" v-if="wuxing.relationshipMeaningEn">
                  <span> {{ wuxing.relationshipMeaningEn }}</span>
                </div>
                <div class="info-block" v-if="wuxing.spiritualMeaningEn">
                  <span>{{ wuxing.spiritualMeaningEn }}</span>
                </div>

                <div class="info-block" v-if="wuxing.lifePhilosophyEn">
                  <span> {{ wuxing.lifePhilosophyEn }}</span>
                </div>
                <div class="info-block" v-if="wuxing.mythologicalAssociationEn">
                  <span>{{ wuxing.mythologicalAssociationEn }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- ------------------ -->
<!--      <section class="trust-section">-->
<!--        <div class="section-container">-->
<!--          &lt;!&ndash; 保修信息 &ndash;&gt;-->
<!--          <div class="warranty-info" v-if="productData.spu.warrantyInfo || currentSku.warrantyPeriod">-->
<!--            <h2 class="section-title">保修服务</h2>-->
<!--            <div class="warranty-details">-->
<!--              <div class="warranty-item" v-if="productData.spu.warrantyInfo">-->
<!--                <span class="icon">📄</span>-->
<!--                <span>保修说明: {{ productData.spu.warrantyInfo }}</span>-->
<!--              </div>-->
<!--              <div class="warranty-item" v-if="currentSku.warrantyPeriod">-->
<!--                <span class="icon">⏱️</span>-->
<!--                <span>保修期限: {{ currentSku.warrantyPeriod }}</span>-->
<!--              </div>-->
<!--              <div class="warranty-item" v-if="productData.spu.warrantyType">-->
<!--                <span class="icon">🔧</span>-->
<!--                <span>保修类型: {{ productData.spu.warrantyType }}</span>-->
<!--              </div>-->
<!--              <div class="warranty-item" v-if="productData.spu.warrantyCoverage">-->
<!--                <span class="icon">📊</span>-->
<!--                <span>保修范围: {{ productData.spu.warrantyCoverage }}</span>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </section>-->

    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed, watch} from 'vue'
import {useRoute} from 'vue-router'
import {useAuthStore} from "@/store/auth.js";
import router from "@/router/index.js";

const route = useRoute()
const authStore = useAuthStore()
/*console.log('🔍 [GlobalHeader] ------------------当前 authStore 对象:', authStore);
console.log('🔍 [GlobalHeader] ------------------当前登录状态:', authStore.isLoggedIn);*/
// 响应式数据
const loading = ref(true)
const error = ref(null)
const productData = ref(null)
const currentImageIndex = ref(0)
const activeTab = ref(0)
const currentSkuIndex = ref(0)

// 修复图片错误处理函数
const handleImageError = (event) => {
  const img = event.target
  console.warn('图片加载失败:', img.src)
}
// 标签页配置
const tabs = [
  {title: '能量故事'},
  {title: '工艺与材质'},
  {title: '专属推荐'}
]

// 计算属性
const skuList = computed(() => {
  return productData.value?.sku?.data || productData.value?.sku || []
})
const currentSku = computed(() => {
  return skuList.value[currentSkuIndex.value] || {}
})

const wuxingList = computed(() => {
  return productData.value?.wuxing?.data || productData.value?.wuxing || []
})

const currentWuxing = computed(() => {
  return wuxingList.value[currentWuxing.value] || {}
})

// 图片列表计算 - 不去重版本
const imageList = computed(() => {
  if (!currentSku.value) return []

  const sku = currentSku.value
  const images = []

  /*console.log('🖼️ 不去重图片处理开始:')*/

  // 强制添加所有图片，完全不去重
  const addImage = (url, type, fieldName) => {
    if (url && typeof url === 'string' && url.trim() !== '') {
      images.push({
        src: url,
        type,
        fieldName, // 记录来源字段
        uniqueKey: `${fieldName}-${images.length}`, // 基于字段和顺序的唯一key
        alt: `${sku.skuNameZh} - ${type}`
      })
     // console.log(`✅ 添加图片 [${fieldName}]:`, url)
    } else {
     // console.log(`❌ 空图片字段: ${fieldName}`, url)
    }
  }

  // 强制添加所有6个图片字段，不去重
  addImage(sku.mainImageUrl, '主图', 'mainImageUrl')
  addImage(sku.image1Url, '细节图1', 'image1Url')
  addImage(sku.image2Url, '细节图2', 'image2Url')
  addImage(sku.image3Url, '细节图3', 'image3Url')
  addImage(sku.image4Url, '细节图4', 'image4Url')
 /* console.log('📊 不去重最终结果:', {
    总图片数: images.length,
    图片列表: images.map(img => ({
      字段: img.fieldName,
      类型: img.type,
      URL: img.src,
      唯一键: img.uniqueKey
    }))
  })*/

  addImage(sku.image5Url, '细节图5', 'image5Url')

  return images
})

const currentImage = computed(() => {
  return imageList.value[currentImageIndex.value] || {}
})

const currentPrice = computed(() => {
  const sku = currentSku.value
  return sku.finalPrice || sku.retailPrice || sku.price || 0
})

const hasDiscount = computed(() => {
  const sku = currentSku.value
  return sku.finalPrice && sku.retailPrice && sku.finalPrice < sku.retailPrice
})

const currentSkuElement = computed(() => {
  const element = productData.value?.spu?.primaryElement
  const elementMap = {
    'earth': '🏔️⛰️🏜️ EARTH',
    'water': '💧🌊💦 WATER',
    'fire': '🔥🌋🎇 WATER',
    'metal': '💎🔗✨METAL',
    'wood': '🌳🌿🍃 WOOD'
  }
  return elementMap[element] || element
})

const qualityData = computed(() => {
  try {
    return JSON.parse(productData.value?.spu?.qualityStandards || '{}')
  } catch {
    return {}
  }
})

// 条件计算属性
const hasQualityData = computed(() => {
  return Object.keys(qualityData.value).length > 0
})

const hasShippingInfo = computed(() => {
  return currentSku.value.shippingWeightKg || currentSku.value.deliveryTimeDays ||
    currentSku.value.shippingCost || currentSku.value.shippingMethod
})

const hasSupplierInfo = computed(() => {
  return currentSku.value.supplierCode || currentSku.value.supplierName ||
    currentSku.value.manufacturer
})

const hasPackagingInfo = computed(() => {
  return currentSku.value.packagingType || currentSku.value.packagingMaterial ||
    currentSku.value.packagingWeightG
})

const hasComplianceInfo = computed(() => {
  return currentSku.value.complianceCertification || currentSku.value.safetyCertification ||
    currentSku.value.environmentalCertification
})

const hasTechnicalInfo = computed(() => {
  return currentSku.value.hardness || currentSku.value.durability ||
    currentSku.value.materialComposition
})

const hasTimestampInfo = computed(() => {
  return productData.value?.spu?.creationDate || productData.value?.spu?.updateDate ||
    currentSku.value.manufactureDate || currentSku.value.expirationDate
})

// 方法
const fetchProductData = async () => {
  loading.value = true
  error.value = null
  // 添加请求头避免被拦截
  const headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
  try {
    const productId = route.params.id
    if (!productId) {
      throw new Error('商品ID不存在')
    }

    // 并行请求SPU和SKU数据
    const [spuResponse, skuResponse, wuxingResponse] = await Promise.all([
      fetch(`/api/product-spu/getByid/${productId}`),
      fetch(`/api/product-sku/spu/${productId}`),
      fetch(`/api/wu-xing-attributes/selectBySpuID/${productId}`)
    ])

    if (!spuResponse.ok) {
      throw new Error(`SPU数据获取失败: ${spuResponse.status}`)
    }
    if (!skuResponse.ok) {
      throw new Error(`SKU数据获取失败: ${skuResponse.status}`)
    }
    if (!wuxingResponse.ok) {
      throw new Error(`五行数据获取失败: ${wuxingResponse.status}`)
    }

    const spuResult = await spuResponse.json()
    const skuResult = await skuResponse.json()
    const wuxingResult = await wuxingResponse.json()

    // 处理API响应数据结构
    const spuData = spuResult.data || spuResult
    const skuData = skuResult.data || skuResult
    const wuxingData = wuxingResult.data || wuxingResult
  /*  console.info('=11111== spuData ===', spuData)
    console.info('=22222== skuData ===', skuData)
    console.info('=33333== wuxingData ===', wuxingData)*/

    if (!spuData) {
      throw new Error('SPU数据为空')
    }
    // 添加数据集合
    productData.value = {
      spu: spuData,
      sku: Array.isArray(skuData) ? {data: skuData} : skuData,
      wuxing: Array.isArray(wuxingData) ? {data: wuxingData} : wuxingData
    }
    //输出集合数据
   /* console.info('=== productData ===')
    console.log('SKU列表数量:', skuList.value.length)
    console.log('wuxing列表数量:', wuxingList.value.length)*/
    //输出spu输出
    /*console.log('productData is', productData.value)
    console.log('SPU ID:', productData.value.spu.id)
    console.log('SPU spuCode:', productData.value.spu.spuCode)
    console.log('SPU productNameEn:', productData.value.spu.productNameEn)
    console.log('SPU productNameZh:', productData.value.spu.productNameZh)
    console.log('SPU productNameAr:', productData.value.spu.productNameAr)
    console.log('SPU shortDescriptionEn:', productData.value.spu.shortDescriptionEn)
    console.log('SPU shortDescriptionZh:', productData.value.spu.shortDescriptionZh)
    console.log('SPU shortDescriptionAr:', productData.value.spu.shortDescriptionAr)
    console.log('SPU fullDescriptionEn:', productData.value.spu.fullDescriptionEn)
    console.log('SPU fullDescriptionZh:', productData.value.spu.fullDescriptionZh)
    console.log('SPU fullDescriptionAr:', productData.value.spu.fullDescriptionAr)
    console.log('SPU designConceptEn:', productData.value.spu.designConceptEn)
    console.log('SPU designConceptZh:', productData.value.spu.designConceptZh)
    console.log('SPU designConceptAr:', productData.value.spu.designConceptAr)
    console.log('SPU intendedUsageEn:', productData.value.spu.intendedUsageEn)
    console.log('SPU intendedUsageZh:', productData.value.spu.intendedUsageZh)
    console.log('SPU intendedUsageAr:', productData.value.spu.intendedUsageAr)
    console.log('SPU emotionalPurposeEn:', productData.value.spu.emotionalPurposeEn)
    console.log('SPU emotionalPurposeZh:', productData.value.spu.emotionalPurposeZh)
    console.log('SPU emotionalPurposeAr:', productData.value.spu.emotionalPurposeAr)
    console.log('SPU spiritualSignificanceEn:', productData.value.spu.spiritualSignificanceEn)
    console.log('SPU spiritualSignificanceZh:', productData.value.spu.spiritualSignificanceZh)
    console.log('SPU spiritualSignificanceAr:', productData.value.spu.spiritualSignificanceAr)
    console.log('SPU energyPropertiesEn:', productData.value.spu.energyPropertiesEn)
    console.log('SPU energyPropertiesZh:', productData.value.spu.energyPropertiesZh)
    console.log('SPU energyPropertiesAr:', productData.value.spu.energyPropertiesAr)
    console.log('SPU primaryElement:', productData.value.spu.primaryElement)
    console.log('SPU elementCombination:', productData.value.spu.elementCombination)
    console.log('SPU energyIntensityDefault:', productData.value.spu.energyIntensityDefault)
    console.log('SPU materialStandards:', productData.value.spu.materialStandards)
    console.log('SPU craftsmanshipStandards:', productData.value.spu.craftsmanshipStandards)
    console.log('SPU qualityStandards:', productData.value.spu.qualityStandards)
    console.log('SPU productionGuidelinesEn:', productData.value.spu.productionGuidelinesEn)
    console.log('SPU productionGuidelinesZh:', productData.value.spu.productionGuidelinesZh)
    console.log('SPU productionGuidelinesAr:', productData.value.spu.productionGuidelinesAr)
    console.log('SPU variantDefinition:', productData.value.spu.variantDefinition)
    console.log('SPU customizationOptions:', productData.value.spu.customizationOptions)
    console.log('SPU productionLeadTime:', productData.value.spu.productionLeadTime)
    console.log('SPU mainImageUrl:', productData.value.spu.mainImageUrl)
    console.log('SPU conceptImageUrl:', productData.value.spu.conceptImageUrl)
    console.log('SPU designImageUrl:', productData.value.spu.designImageUrl)
    console.log('SPU prototypeImageUrl:', productData.value.spu.prototypeImageUrl)
    console.log('SPU usageImageUrl:', productData.value.spu.usageImageUrl)
    console.log('SPU technicalImageUrl:', productData.value.spu.technicalImageUrl)
    console.log('SPU sortOrder:', productData.value.spu.sortOrder)
    console.log('SPU isFeatured:', productData.value.spu.isFeatured)
    console.log('SPU isNewArrival:', productData.value.spu.isNewArrival)
    console.log('SPU isAiDesigned:', productData.value.spu.isAiDesigned)
    console.log('SPU aiDesignScore:', productData.value.spu.aiDesignScore)
    console.log('SPU isActive:', productData.value.spu.isActive)
    console.log('SPU metaTitleEn:', productData.value.spu.metaTitleEn)
    console.log('SPU metaTitleZh:', productData.value.spu.metaTitleZh)
    console.log('SPU metaTitleAr:', productData.value.spu.metaTitleAr)
    console.log('SPU metaDescriptionEn:', productData.value.spu.metaDescriptionEn)
    console.log('SPU metaDescriptionZh:', productData.value.spu.metaDescriptionZh)
    console.log('SPU metaDescriptionAr:', productData.value.spu.metaDescriptionAr)
    console.log('SPU metaKeywordsEn:', productData.value.spu.metaKeywordsEn)
    console.log('SPU metaKeywordsZh:', productData.value.spu.metaKeywordsZh)
    console.log('SPU metaKeywordsAr:', productData.value.spu.metaKeywordsAr)
    console.log('SPU createdBy:', productData.value.spu.createdBy)
    console.log('SPU updatedBy:', productData.value.spu.updatedBy)
    console.log('SPU createdTime:', productData.value.spu.createdTime)
    console.log('SPU updatedTime:', productData.value.spu.updatedTime)*/

    //循环输出skuID  只输出2个数据值
    console.log('wuxing is', productData.value.wuxing)
    wuxingList.value.forEach((wuxing, index) => {
      console.log(`WUXING ${index + 1}:`, {
        elementKey: wuxing.elementKey,
       /* elementCode: wuxing.elementCode,
        elementCategory: wuxing.elementCategory,
        elementNameEn: wuxing.elementNameEn,
        elementNameZh: wuxing.elementNameZh,
        elementNameAr: wuxing.elementNameAr,
        symbolCharacter: wuxing.symbolCharacter,
        symbolColor: wuxing.symbolColor,
        symbolColorGradient: wuxing.symbolColorGradient,
        symbolDirection: wuxing.symbolDirection,
        symbolSeason: wuxing.symbolSeason,
        symbolTime: wuxing.symbolTime,
        symbolPlanet: wuxing.symbolPlanet,
        symbolWeather: wuxing.symbolWeather,
        symbolLandform: wuxing.symbolLandform,
        symbolAnimal: wuxing.symbolAnimal,
        symbolPlant: wuxing.symbolPlant,
        symbolOrgan: wuxing.symbolOrgan,
        symbolSense: wuxing.symbolSense,
        symbolTissue: wuxing.symbolTissue,
        symbolEmotion: wuxing.symbolEmotion,
        symbolSound: wuxing.symbolSound,
        symbolTaste: wuxing.symbolTaste,
        symbolVirtue: wuxing.symbolVirtue,
        symbolCareer: wuxing.symbolCareer,
        symbolNumber: wuxing.symbolNumber,
        symbolMusic: wuxing.symbolMusic,
        philosophyMeaningZh: wuxing.philosophyMeaningZh,
        philosophyMeaningEn: wuxing.philosophyMeaningEn,
        cosmologyMeaningZh: wuxing.cosmologyMeaningZh,
        cosmologyMeaningEn: wuxing.cosmologyMeaningEn,
        lifePhilosophyZh: wuxing.lifePhilosophyZh,
        lifePhilosophyEn: wuxing.lifePhilosophyEn,
        changePrincipleZh: wuxing.changePrincipleZh,
        changePrincipleEn: wuxing.changePrincipleEn,
        culturalSymbolismZh: wuxing.culturalSymbolismZh,
        culturalSymbolismEn: wuxing.culturalSymbolismEn,
        mythologicalAssociationZh: wuxing.mythologicalAssociationZh,
        mythologicalAssociationEn: wuxing.mythologicalAssociationEn,
        historicalReferenceZh: wuxing.historicalReferenceZh,
        historicalReferenceEn: wuxing.historicalReferenceEn,
        artisticExpressionZh: wuxing.artisticExpressionZh,
        artisticExpressionEn: wuxing.artisticExpressionEn,
        energyEssenceZh: wuxing.energyEssenceZh,
        energyEssenceEn: wuxing.energyEssenceEn,
        energyManifestationZh: wuxing.energyManifestationZh,
        energyManifestationEn: wuxing.energyManifestationEn,
        spiritualMeaningZh: wuxing.spiritualMeaningZh,
        spiritualMeaningEn: wuxing.spiritualMeaningEn,
        personalityArchetypeZh: wuxing.personalityArchetypeZh,
        personalityArchetypeEn: wuxing.personalityArchetypeEn,
        lifeGuidanceZh: wuxing.lifeGuidanceZh,
        lifeGuidanceEn: wuxing.lifeGuidanceEn,
        healingPropertyZh: wuxing.healingPropertyZh,
        healingPropertyEn: wuxing.healingPropertyEn,
        generatesElement: wuxing.generatesElement,
        generatedByElement: wuxing.generatedByElement,
        restrainsElement: wuxing.restrainsElement,
        restrainedByElement: wuxing.restrainedByElement,
        relationshipMeaningZh: wuxing.relationshipMeaningZh,
        relationshipMeaningEn: wuxing.relationshipMeaningEn,
        symbolIconUrl: wuxing.symbolIconUrl,
        philosophyImageUrl: wuxing.philosophyImageUrl,
        energyFlowImageUrl: wuxing.energyFlowImageUrl,
        sortOrder: wuxing.sortOrder,
        elementTier: wuxing.elementTier,
        isActive: wuxing.isActive,
        createdTime: wuxing.createdTime,*/
        updatedTime: wuxing.updatedTime
      })
    })

    //循环输出skuID
    skuList.value.forEach((sku, index) => {
      console.log(`SKU ${index + 1}:`, {
        id: sku.id,
        /*spuId: sku.spuId,
        skuCode: sku.skuCode,
        skuNameEn: sku.skuNameEn,
        skuNameZh: sku.skuNameZh,
        skuNameAr: sku.skuNameAr,
        variantDescriptionEn: sku.variantDescriptionEn,
        variantDescriptionZh: sku.variantDescriptionZh,
        variantDescriptionAr: sku.variantDescriptionAr,
        variantYuyiEn: sku.variantYuyiEn,
        variantYuyiZh: sku.variantYuyiZh,
        variantYuyiAr: sku.variantYuyiAr,
        primaryMaterial: sku.primaryMaterial,
        materialPurity: sku.materialPurity,
        materialColor: sku.materialColor,
        materialFinish: sku.materialFinish,
        materialThicknessMm: sku.materialThicknessMm,
        gemstoneType: sku.gemstoneType,
        gemstoneShape: sku.gemstoneShape,
        gemstoneCut: sku.gemstoneCut,
        gemstoneSizeMm: sku.gemstoneSizeMm,
        gemstoneWeightCt: sku.gemstoneWeightCt,
        gemstoneQuality: sku.gemstoneQuality,
        gemstoneCount: sku.gemstoneCount,
        lengthCm: sku.lengthCm,
        widthCm: sku.widthCm,
        heightCm: sku.heightCm,
        chainLengthCm: sku.chainLengthCm,
        pendantSizeMm: sku.pendantSizeMm,
        totalWeightG: sku.totalWeightG,
        metalWeightG: sku.metalWeightG,
        gemstoneWeightG: sku.gemstoneWeightG,
        craftsmanshipLevel: sku.craftsmanshipLevel,
        settingTechnique: sku.settingTechnique,
        claspType: sku.claspType,
        chainType: sku.chainType,
        suitableGender: sku.suitableGender,
        suitableAgeMin: sku.suitableAgeMin,
        suitableAgeMax: sku.suitableAgeMax,
        sizeStandard: sku.sizeStandard,
        stockQuantity: sku.stockQuantity,
        reservedQuantity: sku.reservedQuantity,
        safetyStock: sku.safetyStock,
        reorderPoint: sku.reorderPoint,
        stockStatus: sku.stockStatus,
        lowStockAlert: sku.lowStockAlert,
        lastStockUpdate: sku.lastStockUpdate,
        costPrice: sku.costPrice,
        retailPrice: sku.retailPrice,
        salePrice: sku.salePrice,
        memberPrice: sku.memberPrice,
        priceCurrency: sku.priceCurrency,
        discountRate: sku.discountRate,
        discountAmount: sku.discountAmount,
        discountStartDate: sku.discountStartDate,
        discountEndDate: sku.discountEndDate,
        taxRate: sku.taxRate,
        priceAdjustmentReason: sku.priceAdjustmentReason,
        lastPriceUpdate: sku.lastPriceUpdate,
        mainImageUrl: sku.mainImageUrl,
        image1Url: sku.image1Url,
        image2Url: sku.image2Url,
        image3Url: sku.image3Url,
        image4Url: sku.image4Url,
        image5Url: sku.image5Url,
        availableDate: sku.availableDate,
        availableEndDate: sku.availableEndDate,
        isNewArrival: sku.isNewArrival,
        status: sku.status,
        isAvailable: sku.isAvailable,
        isFeatured: sku.isFeatured,
        isBestSeller: sku.isBestSeller,
        sortOrder: sku.sortOrder,
        visibility: sku.visibility,
        createdBy: sku.createdBy,
        updatedBy: sku.updatedBy,
        createdTime: sku.createdTime,
        updatedTime: sku.updatedTime,
        availableQuantity: sku.availableQuantity,*/
        finalPrice: sku.finalPrice
      })
    })
    // 如果有SKU数据，设置默认选中的SKU
    if (skuList.value.length > 0) {
      currentSkuIndex.value = 0
    }

  } catch (err) {
    error.value = err.message || '获取商品数据失败'
    console.error('API调用错误:', err)
  } finally {
    loading.value = false
  }
}

const formatPrice = (price) => {
  if (!price && price !== 0) return '0.00'
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numPrice)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleDateString('zh-CN')
  } catch {
    return dateString
  }
}

// 确保缩略图点击时切换SKU并重置图片索引
const selectSku = (sku) => {
  const index = skuList.value.findIndex(s => s.id === sku.id)
  if (index !== -1) {
    currentSkuIndex.value = index
    // 切换SKU时重置图片索引到第一张
    currentImageIndex.value = 0

    /*console.log('🔄 SKU切换:', {
      新SKU: sku.id,
      SKU名称: sku.skuNameZh,
      图片数量: imageList.value.length,
      主图mainImageUrl: sku.mainImageUrl
    })*/
  }
}
// 下拉框变更处理方法
const onSkuDropdownChange = (event) => {
  const selectedIndex = parseInt(event.target.value)
  if (selectedIndex >= 0 && selectedIndex < skuList.value.length) {
    currentSkuIndex.value = selectedIndex
    // 切换SKU时重置图片索引到第一张
    currentImageIndex.value = 0

   /* console.log('🔄 SKU下拉选择切换:', {
      新SKU索引: selectedIndex,
      新SKU: currentSku.value.id,
      SKU名称: currentSku.value.skuNameZh,
      图片数量: imageList.value.length
    })*/
  }
}

const getElementName = (element) => {
  const elementMap = {
    'earth': '🏔️',
    'water': '🌊',
    'fire': '🔥',
    'metal': '💎',
    'wood': '🌿'
  }
  return elementMap[element] || element
}

const getGenderText = (genderCode) => {
  const genderMap = {
    1: 'Men',
    2: 'Women',
    3: 'Unisex',
    4: 'Universal'
  }
  return genderMap[genderCode] || '通用'
}

const getStatusText = (status) => {
  const statusMap = {
    'active': '上架',
    'inactive': '下架',
    'draft': '草稿',
    'pending': '待审核',
    'approved': '已审核',
    'rejected': '已拒绝',
    'deleted': '已删除'
  }
  return statusMap[status] || status
}

// 操作方法
const buyNow = () => {
  if (!currentSku.value.id) {
    alert('请选择商品规格')
    return
  }
  console.log('立即购买', currentSku.value)
  // 实际业务逻辑：跳转到订单确认页
  // router.push(`/order/confirm?skuId=${currentSku.value.id}`)
}
//添加购物车
// 在现有的响应式数据后面添加
const cartLoading = ref(false)

// 添加购物车方法
const addToCart = async () => {
  if (!authStore.isLoggedIn) {
    alert('⚠️ 用户未登录，请先登录！')
    const url = `/users/login`
    await router.push(url)// 通过路由路径导航
    };
  if (!currentSku.value.id) {
    alert('请选择商品规格')
  }
  cartLoading.value = true
  const userId = authStore.userInfo?.userId;
  console.log('✅ 当前登录用户ID:', userId);
  try {
    const cartData = {
      userId: userId,
      skuId: currentSku.value.id, // 商品SKU ID（必填）
      spuId: productData.value.spu.id,
      quantity: 1, // 购买数量（默认1）
      selected: 1, // 是否选中: 0-否, 1-是（默认1）
      unitPrice: currentPrice.value, // 加入时单价（必填）
      currency: 'USD' // 货币（默认USD）
    }
    console.log('🛒 准备添加到购物车:', cartData)
    // 调用后端购物车接口
    const response = await fetch('/api/shopingcart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(cartData)
    })
    const result = await response.json()
    console.log('📦 result后端响应:', result)
    console.log('📦 response后端响应:', response)
    if (result.code === 200) {
      // 添加成功，显示提示
      alert('✅ 商品已成功添加到购物车！')
      console.log('✅ 添加购物车成功:', result)
    } else {
      throw new Error(result.message || '添加购物车失败')
    }
  } catch (error) {
    console.error('❌ 添加购物车异常:')
    alert('❌ ' + (error.message || '添加购物车失败，请重试'))
  } finally {
    cartLoading.value = false
  }
}

// 添加购物车操作


// 监听路由变化
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      fetchProductData()
    }
  }
)

// 监听SKU切换
watch(
  () => currentSkuIndex.value,
  (newIndex, oldIndex) => {
    if (newIndex !== oldIndex) {
      console.log('SKU切换至:', currentSku.value)
    }
  }
)

// 在watch中添加更多调试信息
watch([currentSku, imageList], ([newSku, newImages]) => {
 /* console.group('🖼️ SKU图片变化详情')
  console.log('当前SKU:', newSku?.id, newSku?.skuNameZh)
  console.log('主图URL:', newSku?.mainImageUrl)
  console.log('其他图片:')
  console.log('  image1Url:', newSku?.image1Url)
  console.log('  image2Url:', newSku?.image2Url)
  console.log('  image3Url:', newSku?.image3Url)
  console.log('  image4Url:', newSku?.image4Url)
  console.log('  image5Url:', newSku?.image5Url)
  console.log('可用图片列表:')*/
  newImages.forEach((img, i) => {
    //console.log(`  ${i}. ${img.src} (${img.type})`)
  })
  console.groupEnd()
}, {immediate: true})

// 生命周期
onMounted(() => {
  if (!route.params.id) {
    error.value = '商品ID不存在'
    loading.value = false
    return
  }

  fetchProductData()
})

// 调试方法（开发环境使用）
const debugProductData = () => {
  /*console.log('当前商品数据:', productData.value)
  console.log('当前SKU:', currentSku.value)
  console.log('图片列表:', imageList.value)
  console.log('SKU列表:', skuList.value)
  console.log('质量数据:', qualityData.value)*/
}

// 错误处理
const handleApiError = (error) => {
  console.error('API错误:', error)
  error.value = '数据加载失败，请稍后重试'
  loading.value = false
}


// 在 script setup 中添加图片导航方法

// 上一张图片
const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

// 下一张图片
const nextImage = () => {
  if (currentImageIndex.value < imageList.value.length - 1) {
    currentImageIndex.value++
  }
}


</script>

<style scoped>
/* 全局样式 */
.product-detail-page {
  font-family: 'Arial', 'Helvetica', sans-serif;
  background-color: #0a1a35;
  color: #f5f5f5;
  min-height: 100vh;
  padding: 20px 0;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.1);
  border-top: 5px solid #ffd700;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-state p {
  font-size: 18px;
  color: #e0e0e0;
}

.error-state p {
  font-size: 18px;
  color: #ff6b6b;
  margin-bottom: 20px;
}

.retry-button {
  background: #4ecdc4;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.retry-button:hover {
  background: #45b7aa;
}

/* 修正加载状态类名 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  margin: 20px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* 修正错误状态类名 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  margin: 20px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.error-container p {
  font-size: 18px;
  color: #ff6b6b;
  margin-bottom: 20px;
}

.error-container button {
  background: #4ecdc4;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.error-container button:hover {
  background: #45b7aa;
}

/* 商品内容区域 */
.product-content {
  max-width: 1400px;
  margin: 0 auto;
}

/* 商品展示区 */
.product-display-section {
  padding: 40px 0;
  background: rgba(255, 255, 255, 0.05);
  margin: 20px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.display-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  gap: 40px;
}

/* 图片展示区 */
.image-section {
  flex: 1;
  display: flex;
  gap: 20px;
}

.thumbnail-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 80px;
}

.thumbnail-item {
  width: 80px;
  height: 80px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffd700;
  font-size: 24px;
}

.thumbnail-item.active {
  border-color: #ffd700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.main-image {
  flex: 1;
  height: 500px;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffd700;
  font-size: 48px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: rgba(255, 215, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed rgba(255, 255, 255, 0.3);
  font-size: 1.2rem;
}

.thumbnail-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 主图容器样式 */
.main-image-container {
  flex: 1;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.main-image {
  width: 100%;
  height: 500px;
  object-fit: contain;
  background: rgba(255, 255, 255, 0.02);
}

.image-meta {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px 15px;
  color: #fff;
  font-size: 14px;
  text-align: center;
}

/* 图片轮播导航 */
.image-carousel {
  position: relative;
  width: 100%;
  height: 100%;
}

.image-navigation {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  padding: 0 15px;
}

.nav-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  color: #0a1a35;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.nav-btn:hover:not(:disabled) {
  background: rgba(255, 215, 0, 0.9);
  transform: scale(1.1);
}

.nav-btn:disabled {
  background: rgba(255, 255, 255, 0.3);
  color: rgba(0, 0, 0, 0.3);
  cursor: not-allowed;
}

.image-placeholder {
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 215, 0, 0.1);
  border: 2px dashed rgba(255, 255, 255, 0.3);
  color: #ffd700;
  font-size: 1.2rem;
}

/* 信息展示区 */
.info-section {
  flex: 1;
  padding: 20px 0;
}

.product-info {
  max-width: 500px;
}

.product-name {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #fff;
  line-height: 1.3;
}

.product-subtitle {
  font-size: 16px;
  color: #b0b0b0;
  margin-bottom: 20px;
  font-style: italic;
  line-height: 1.5;
}

/* 基本信息标签 */
.basic-info {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 25px;
}

.info-tag {
  background: rgba(255, 255, 255, 0.1);
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 12px;
  color: #b0b0b0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 玄学标签 */
.metaphysical-tags {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 25px;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  padding: 12px;
  border-radius: 8px;
  transition: transform 0.2s;
}

.tag-item:hover {
  transform: translateY(-2px);
}

.tag-icon {
  font-size: 18px;
}

/* SKU选择器 */
.sku-selector {
  margin-bottom: 25px;
}

.sku-selector h3 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #fff;
  font-weight: bold;
}

/* SKU下拉选择器样式 */
.sku-dropdown {
  margin-bottom: 15px;
}

.sku-select {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.sku-select:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
}

.sku-select:hover {
  border-color: rgba(255, 255, 255, 0.3);
}

.sku-select option {
  background: #0a1a35;
  color: #fff;
  padding: 10px;
}


/* 价格信息 */
.price-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.price {
  font-size: 28px;
  font-weight: bold;
  color: #ffd700;
}

.original-price {
  font-size: 18px;
  color: #95a5a6;
  text-decoration: line-through;
}

.discount-rate {
  background: #ff6b6b;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

/* 库存信息 */
.stock-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 25px;
  font-size: 14px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.stock-label {
  font-weight: 500;
  color: #fff;
}

.stock-quantity {
  font-weight: 600;
}

.stock-quantity.low-stock {
  color: #ff6b6b;
}

.stock-warning {
  color: #ff6b6b;
  font-weight: 500;
}

/* 信任标识 */
.trust-badges {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 25px;
}

.badge-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s;
}

.badge-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}


/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 25px;
}

.btn-primary, .btn-secondary, .btn-wishlist {
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary {
  background: #ffd700;
  color: #0a1a35;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
}

.btn-primary:hover {
  background: #e6c200;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.btn-wishlist {
  background: transparent;
  color: #ffd700;
  border: 1px solid #ffd700;
}

.btn-wishlist:hover {
  background: rgba(255, 215, 0, 0.1);
  transform: translateY(-2px);
}

/* 快速信息 */
.quick-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 25px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-label {
  color: #b0b0b0;
  font-size: 14px;
}

.info-value {
  font-weight: 500;
  color: #fff;
  font-size: 14px;
}

/* 深度叙事与玄学内涵区 */
.narrative-section {
  padding: 40px 0;
  background: rgba(255, 255, 255, 0.05);
  margin: 20px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: #fff;
  position: relative;
}

.section-title:after {
  content: '';
  display: block;
  width: 60px;
  height: 3px;
  margin: 10px auto 0;
}

/* 标签页 */
.tab-container {
  margin-top: 30px;
}

.tab-headers {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px 8px 0 0;
  padding: 0 10px;
}

.tab-header {
  padding: 15px 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  border-bottom: 3px solid transparent;
  color: #b0b0b0;
}


.tab-content {
  min-height: 400px;
}

.tab-panel h3 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #fff;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

/* 信息块 */
.info-block {
  margin-bottom: 25px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  transition: transform 0.2s;
}

.info-block:hover {
  transform: translateY(-2px);
}

.info-block h4 {
  font-size: 16px;
  margin-bottom: 10px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-block p {
  line-height: 1.6;
  color: #e0e0e0;
  margin: 0;
}

/* 评分部分 */
.score-section {
  margin-top: 30px;
}

.scores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.score-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.score-label {
  color: #b0b0b0;
}

.score-value {
  font-weight: 600;
  color: #ffd700;
}

/* 规格分类 */
.specs-categories {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.spec-category {
  margin-bottom: 20px;
}

.spec-category h4 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.spec-label {
  color: #b0b0b0;
  font-size: 14px;
}

.spec-value {
  font-weight: 500;
  color: #fff;
  font-size: 14px;
}

/* 建立信任与社群证明区 */
.trust-section {
  padding: 40px 0;
  background: rgba(255, 255, 255, 0.05);
  margin: 20px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.quality-standards, .warranty-info, .return-policy,
.shipping-info, .supplier-info, .packaging-info {
  margin-bottom: 40px;
}

.standards-list, .warranty-details, .policy-details,
.shipping-details, .supplier-details, .packaging-details {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.standard-item, .warranty-item, .policy-item,
.shipping-item, .supplier-item, .packaging-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.2s;
}

.standard-item:hover, .warranty-item:hover, .policy-item:hover,
.shipping-item:hover, .supplier-item:hover, .packaging-item:hover {
  transform: translateY(-2px);
}

.standard-icon, .warranty-icon, .policy-icon,
.shipping-icon, .supplier-icon, .packaging-icon {
  font-size: 18px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .display-container {
    gap: 30px;
  }

  .main-image {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .product-detail-page {
    padding: 10px 0;
  }

  .display-container {
    flex-direction: column;
    gap: 20px;
  }

  .image-section {
    flex-direction: column-reverse;
  }

  .thumbnail-container {
    flex-direction: row;
    width: 100%;
    overflow-x: auto;
    padding-bottom: 10px;
  }

  .thumbnail-item {
    min-width: 80px;
  }

  .main-image {
    height: 300px;
  }

  .metaphysical-tags, .trust-badges {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .quick-info-grid, .specs-grid {
    grid-template-columns: 1fr;
  }

  .standards-list, .warranty-details, .policy-details,
  .shipping-details, .supplier-details, .packaging-details {
    grid-template-columns: 1fr;
  }

  .tab-headers {
    flex-direction: column;
    background: none;
    padding: 0;
  }

  .tab-header {
    border-radius: 8px;
    margin-bottom: 5px;
  }

  .tab-header.active {
    border-radius: 8px;
    border-bottom: 3px solid #ffd700;
  }

  .product-display-section, .narrative-section, .trust-section {
    margin: 10px;
    padding: 20px 0;
  }

  .section-container {
    padding: 0 15px;
  }

  .product-name {
    font-size: 24px;
  }

  .price {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .main-image {
    height: 250px;
  }

  .product-name {
    font-size: 20px;
  }

  .section-title {
    font-size: 20px;
  }

  .tab-header {
    padding: 12px 20px;
  }
}
</style>
