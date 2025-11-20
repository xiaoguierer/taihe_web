<template>
  <div class="product-page">
    <!-- 第一部分：左右分栏布局 -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-image" @click="goToProductDetail(heroData.id)">
          <img
            v-if="heroData.iconUrl"
            :src="heroData.iconUrl"
            :alt="heroData.intentNameZh || '珠宝展示图'"
            class="product-icon"
          />
          <!-- 如果没有图片，显示占位符 -->
          <div v-else class="image-placeholder">珠宝展示图</div>
        </div>
        <div class="hero-content">
          <h2 class="hero-title">{{ heroData.metaKeywordsEn }}-{{ heroData.culturalSignificanceEn }}-</h2>
          <p class="hero-description">{{ heroData.modernInterpretationEn }}</p>
        </div>
      </div>
    </section>

    <!-- 第二部分：商品网格布局 -->
    <section class="products-section">
      <div class="products-container">
        <div class="products-grid">
          <div
            class="product-card"
            v-for="(product, index) in products"
            :key="product.id || index"
          >
            <div class="product-image" @click="goToProductDetail(product.id)">
              <img
                v-if="product.mainImageUrl"
                :src="product.mainImageUrl"
                :alt="product.productNameEn"
                class="product-image-content"
              />
              <div v-else class="image-placeholder">
                <span class="placeholder-text">{{ product.productNameEn }}</span>
                <span class="placeholder-icon">🖼️</span>
              </div>
            </div>

            <div class="product-info">
              <h3 class="product-name">{{ product.productNameEn  }}</h3>
              <p class="product-meaning">{{ product.shortDescriptionEn }}</p>
              <p class="product-design" v-if="product.designConceptEn">
                {{ product.designConceptEn }}
              </p>
              <!-- 其他图片链接（调试用） -->
              <div class="image-links" v-if="false"> <!-- 设置为 false 隐藏调试信息 -->
                <small v-if="product.mainImageUrl">主图: {{ product.mainImageUrl }}</small>
                <small v-if="product.designImageUrl">设计图: {{ product.designImageUrl }}</small>
                <small v-if="product.conceptImageUrl">概念图: {{ product.conceptImageUrl }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 加载和错误状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载珠宝数据...</p>
    </div>
    <div v-else-if="error" class="error-state">
      <p>数据加载失败，请稍后重试</p>
      <button @click="retryLoading" class="retry-button">重新加载</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'emotionalProductList',
  data() {
    return {
      // 当前意图ID
      currentIntentId: '',
      // 第一部分数据
      // 第一部分数据 - 情感意图详情
      heroData: {
        // ==================== 基础标识字段 ====================
        id: '',
        intentKey: '',
        intentCode: '',
        intentCategory: '',

        // ==================== 多语言名称 ====================
        intentNameEn: '',
        intentNameZh: '',
        intentNameAr: '',

        // ==================== 核心象征属性 ====================
        symbolCharacter: '',
        symbolColor: '',
        symbolColorGradient: '',

        // ==================== 情感属性 ====================
        primaryEmotionZh: '',
        primaryEmotionEn: '',
        primaryEmotionAr: '',
        secondaryEmotionsZh: '',
        secondaryEmotionsEn: '',
        secondaryEmotionsAr: '',
        emotionalIntensity: 0,
        emotionalDirection: '',
        emotionalFrequency: '',

        // ==================== 哲学文化含义 ====================
        philosophyMeaningZh: '',
        philosophyMeaningEn: '',
        philosophyMeaningAr: '',
        culturalSignificanceZh: '',
        culturalSignificanceEn: '',
        culturalSignificanceAr: '',
        spiritualMeaningZh: '',
        spiritualMeaningEn: '',
        spiritualMeaningAr: '',
        modernInterpretationZh: '',
        modernInterpretationEn: '',
        modernInterpretationAr: '',

        // ==================== 实用属性描述 ====================
        personalityArchetypeZh: '',
        personalityArchetypeEn: '',
        personalityArchetypeAr: '',
        lifeGuidanceZh: '',
        lifeGuidanceEn: '',
        lifeGuidanceAr: '',
        healingPropertyZh: '',
        healingPropertyEn: '',
        healingPropertyAr: '',
        relationshipImpactZh: '',
        relationshipImpactEn: '',
        relationshipImpactAr: '',
        careerAlignmentZh: '',
        careerAlignmentEn: '',
        careerAlignmentAr: '',

        // ==================== 图片资源属性 ====================
        // 图像ID
        iconId: '',
        symbolImageId: '',
        energyImageId: '',
        applicationImageId: '',
        meditationImageId: '',

        // 图像URL
        iconUrl: '',
        symbolImageUrl: '',
        energyImageUrl: '',
        applicationImageUrl: '',
        meditationImageUrl: '',

        // ==================== SEO优化字段 ====================
        metaTitleZh: '',
        metaTitleEn: '',
        metaTitleAr: '',
        metaDescriptionZh: '',
        metaDescriptionEn: '',
        metaDescriptionAr: '',
        metaKeywordsZh: '',
        metaKeywordsEn: '',
        metaKeywordsAr: '',

        // ==================== 控制属性 ====================
        sortOrder: 0,
        intensityLevel: 0,
        popularityScore: 0,
        isActive: 1,
        showInNavigation: 1,
        showInFilter: 1,
        isFeatured: 0,

        // ==================== 审计字段 ====================
        createdTime: '',
        updatedTime: ''
      },
      // 第二部分数据
      products: [],
      // 单个产品的完整结构定义（用于参考或初始化）
      productStructure: {
        // 基础信息
        id: '',
        spuCode: '',

        // 多语言产品名称
        productNameEn: '',
        productNameZh: '',
        productNameAr: '',

        // 多语言简短描述
        shortDescriptionEn: '',
        shortDescriptionZh: '',
        shortDescriptionAr: '',

        // 多语言详细描述
        fullDescriptionEn: '',
        fullDescriptionZh: '',
        fullDescriptionAr: '',

        // 设计理念
        designConceptEn: '',
        designConceptZh: '',
        designConceptAr: '',

        // 用途说明
        intendedUsageEn: '',
        intendedUsageZh: '',
        intendedUsageAr: '',

        // 情感目的
        emotionalPurposeEn: '',
        emotionalPurposeZh: '',
        emotionalPurposeAr: '',

        // 灵性意义
        spiritualSignificanceEn: '',
        spiritualSignificanceZh: '',
        spiritualSignificanceAr: '',

        // 能量属性
        energyPropertiesEn: '',
        energyPropertiesZh: '',
        energyPropertiesAr: '',

        // 五行元素
        primaryElement: '',
        elementCombination: '',
        energyIntensityDefault: 0,

        // 标准配置
        materialStandards: '',
        craftsmanshipStandards: '',
        qualityStandards: '',

        // 生产指南
        productionGuidelinesEn: '',
        productionGuidelinesZh: '',
        productionGuidelinesAr: '',

        // 变体和定制
        variantDefinition: '',
        customizationOptions: '',
        productionLeadTime: 0,

        // 图片ID
        mainImageId: '',
        conceptImageId: '',
        designImageId: '',
        prototypeImageId: '',
        usageImageId: '',
        technicalImageId: '',

        // 图片URL
        mainImageUrl: '',
        conceptImageUrl: '',
        designImageUrl: '',
        prototypeImageUrl: '',
        usageImageUrl: '',
        technicalImageUrl: '',

        // 商品属性
        sortOrder: 0,
        isFeatured: false,
        isNewArrival: false,
        isAiDesigned: false,
        aiDesignScore: 0,
        isActive: true,

        // SEO信息
        metaTitleEn: '',
        metaTitleZh: '',
        metaTitleAr: '',
        metaDescriptionEn: '',
        metaDescriptionZh: '',
        metaDescriptionAr: '',
        metaKeywordsEn: '',
        metaKeywordsZh: '',
        metaKeywordsAr: '',

        // 系统字段
        createdBy: null,
        updatedBy: null,
        createdTime: null,
        updatedTime: null
      },
      // 加载状态
      loading: true,
      error: false
    }
  },
  watch: {
    // 监听路由变化，当意图ID改变时重新加载数据
    '$route.params.intentId': {
      immediate: true,
      handler(newIntentId) {
        if (newIntentId) {
          this.currentIntentId = newIntentId;
          this.loadAllData();
        }
      }
    }
  },
  async mounted() {
    // 初始化时获取路由参数
    this.currentIntentId = this.$route.params.intentId;
    if (this.currentIntentId) {
      await this.loadAllData();
    }
  },
  methods: {
    // 统一加载所有数据
    async loadAllData() {
      try {
        this.loading = true;
        this.error = false;

        if (!this.currentIntentId) {
          throw new Error('意图ID不能为空');
        }

        // 并行加载所有数据
        await Promise.all([
          this.fetchHeroData(),
          this.fetchProductsData()
        ]);

      } catch (error) {
        console.error('数据加载失败:', error);
        this.error = true;
      } finally {
        this.loading = false;
      }
    },

    // 重新加载
    retryLoading() {
      this.loadAllData();
    },

    // 跳转到商品详情页
    goToProductDetail(productId) {
      if (!productId) {
        console.warn('商品ID不存在');
        return;
      }

      this.$router.push({
        name: 'ProductDetail',
        params: {id: productId},
        query: {fromIntent: this.currentIntentId} // 传递来源意图
      });
    },

    // 获取第一部分数据 - 根据意图ID查询
    async fetchHeroData() {
      try {
        console.log("🔍 当前参数:", this.currentIntentId)
        const response = await fetch(`/api/emotional-intent/getByid/${this.currentIntentId}`);
        if (!response.ok) {
          throw new Error('获取英雄区数据失败');
        }
        const result = await response.json();
        console.info("result is  ：", result);
        this.heroData = result.data;
        console.info("this.heroData is  ：", this.heroData);
      } catch (error) {
        console.error('获取第一部分数据失败:', error);
      }
    },

    // 获取第二部分数据 - 根据意图ID查询
    async fetchProductsData() {
      try {
        const response = await fetch(`/api/product-spu/selectSpuByIntentId/${this.currentIntentId}`);
        if (!response.ok) {
          throw new Error('获取商品数据失败');
        }
        const result = await response.json();
        console.log("22---API响应---22  :", result);

        // ✅ 正确：提取 data 数组
        if (result.code === 200 && Array.isArray(result.data)) {
          this.products = result.data;
          console.log("22---商品数据---22  :", this.products);
        } else {
          throw new Error(result.message || '商品数据格式错误');
        }
      } catch (error) {
        console.error('获取商品数据失败:', error);
      }
    }
  }
}
</script>

<style scoped>
/* 全局样式 */
.product-page {
  font-family: 'Arial', 'Helvetica', sans-serif;
  background-color: #0a1a35;
  color: #f5f5f5;
  min-height: 100vh;
}

/* 第一部分样式 */
.hero-section {
  height: 15cm;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.hero-container {
  display: flex;
  width: 100%;
  height: 100%;
  margin: 0;
}

.hero-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem;
  overflow: hidden;
}

.hero-image {
  flex: 0 0 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hero-image:hover {
  transform: scale(1.02);
}

.hero-image img,
.image-placeholder {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: rgba(255, 215, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed;
  font-size: 1.2rem;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  width: 100%;
  text-align: left;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  max-height: 2.6em;
}

.hero-description {
  font-size: 1.2rem;
  line-height: 1.6;
  width: 100%;
  text-align: left;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 6.4em;
}

/* 第二部分样式 */
.products-section {
  min-height: 10cm;
  padding: 0.5cm 0;
}

.products-container {
  width: 100%;
  padding: 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5cm;
  padding: 0 0.5cm;
}

.product-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 0.5rem;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.1);
}

.product-image {
  height: 8cm;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5cm;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  border-radius: 4px;
}

.product-image:hover {
  transform: scale(1.05);
}

.product-image img,
.product-image .image-placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-image-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 4px;
}

.product-image-content img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-image:hover .product-image-content img {
  transform: scale(1.1);
}

.product-info {
  text-align: center;
  width: 100%;
  padding: 0 0.5rem 0.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.3rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.6em;
}

.product-meaning {
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
  color: #e0e0e0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.8em;
}

.product-element {
  font-size: 0.85rem;
  color: #a8a8a8;
  margin-bottom: 0.3rem;
}

.product-design {
  font-size: 0.8rem;
  color: #b0b0b0;
  margin-top: 0.3rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.6em;
}

.product-tags {
  display: flex;
  gap: 0.3rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.tag {
  padding: 0.2rem 0.5rem;
  border-radius: 0.2rem;
  font-size: 0.7rem;
  font-weight: bold;
  white-space: nowrap;
}

.tag.featured {
  background-color: #ff6b6b;
  color: white;
}

.tag.new {
  background-color: #4ecdc4;
  color: white;
}

.tag.ai {
  background-color: #45b7aa;
  color: white;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #fff;
  min-height: 20vh;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 错误状态 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #ff6b6b;
  min-height: 20vh;
  text-align: center;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background-color: #4ecdc4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 0.9rem;
}

.retry-button:hover {
  background-color: #45b7aa;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .hero-title {
    font-size: 2.2rem;
  }

  .hero-description {
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .hero-container {
    flex-direction: column;
  }

  .hero-image {
    flex: 0 0 40%;
    width: 100%;
  }

  .hero-content {
    flex: 1;
    align-items: center;
    text-align: center;
    padding: 1rem;
  }

  .hero-title {
    font-size: 2rem;
    text-align: center;
  }

  .hero-description {
    font-size: 1rem;
    -webkit-line-clamp: 3;
    text-align: center;
  }

  .hero-section {
    height: auto;
    min-height: 15cm;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.3cm;
    padding: 0 0.3cm;
  }

  .product-image {
    height: 6cm;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
    gap: 0.2cm;
    padding: 0 0.2cm;
  }

  .hero-title {
    font-size: 1.8rem;
  }

  .hero-description {
    font-size: 0.9rem;
  }

  .product-image {
    height: 5cm;
  }

  .product-name {
    font-size: 1rem;
  }

  .product-meaning {
    font-size: 0.85rem;
  }
}
</style>
