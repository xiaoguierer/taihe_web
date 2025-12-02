<template>
  <div class="emotional-intent-detail">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Fetching emotional intent data...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <p>Failed to load data. Please try again later again.</p>
      <button @click="loadIntentData" class="retry-button">reloadData</button>
    </div>

    <!-- 主内容区域 -->
    <div v-else-if="intentData.id" class="content-wrapper">
      <!-- 头部横幅区域 -->
      <section class="hero-section">
        <div class="hero-container">
          <div class="hero-image">
            <img
              v-if="intentData.applicationImageUrl"
              :src="intentData.applicationImageUrl"
              :alt="intentData.intentNameZh"
              class="hero-img"
            >
            <div v-else class="image-placeholder">
              <span class="symbol-char">{{ intentData.symbolCharacter }}</span>
            </div>
          </div>
          <div class="hero-content">
            <div class="intent-badge">
              <span class="category-tag">{{ intentData.intentCategory }}</span>
              <span class="intensity-tag">Emotional Intensity: {{ intentData.emotionalIntensity }}/100</span>
            </div>
            <h1 class="hero-title">{{ intentData.intentNameEn }}</h1>

            <h2 class="hero-subtitle">Featured :  {{ intentData.intensityLevel }}   --  Popular : {{ intentData.popularityScore }}</h2>

            <p class="hero-description">{{ intentData.modernInterpretationEn }}</p>
            <div class="symbol-display">
              <span class="symbol" :style="{ color: intentData.symbolColor }">
                {{ intentData.symbolCharacter }}
              </span>
              <div class="color-preview" :style="{ background: intentData.symbolColor }"></div>
            </div>
          </div>
        </div>
      </section>
      <!-- 详细信息区域 -->
      <section class="details-section">
        <div class="details-container">
          <!-- 基础信息卡片 -->
          <div class="info-card">
            <h3 class="card-title">Base-Infor</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="category-badge">{{ intentData.intentCategory }}</span>
              </div>
              <div class="info-item">
                <span>{{ intentData.intentKey }}</span>
              </div>
              <div class="info-item">
                <span>{{ intentData.intentCode }}</span>
              </div>
              <div class="info-item">
                <span>{{ intentData.intentNameEn }}</span>
              </div>
            </div>
          </div>

          <!-- 情感属性卡片 -->
          <div class="info-card">
            <h3 class="card-title">Emotional Attributes</h3>
            <div class="info-grid">
              <div class="info-item">
                <span>{{ intentData.primaryEmotionEn }}</span>
              </div>
              <div class="info-item">
                <span>{{ intentData.emotionalDirection }}</span>
              </div>
              <div class="info-item">
                <span>{{ intentData.emotionalFrequency }}</span>
              </div>
            </div>
          </div>

          <!-- 象征属性卡片 -->
          <div class="info-card">
            <h3 class="card-title">Symbolic Attributes</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="symbol-large">{{ intentData.symbolCharacter }}</span>
              </div>
              <div class="info-item">
                <div class="color-display">
                  <span>{{ intentData.symbolColor }}</span>
                  <div class="color-sample" :style="{ background: intentData.symbolColor }"></div>
                </div>
              </div>
              <div class="info-item full-width">
                <span>{{ intentData.symbolColorGradient }}</span>
              </div>
            </div>
          </div>
          <!-- 在象征属性卡片后新增 -->
          <div class="info-card full-width">
            <h3 class="card-title">Life Guidance</h3>
            <div class="meaning-content">
              <div class="meaning-item">
                <p>{{ intentData.personalityArchetypeEn }}</p>
              </div>
              <div class="meaning-item">
                <p>{{ intentData.lifeGuidanceEn }}</p>
              </div>
              <div class="meaning-item">
                <p>{{ intentData.healingPropertyEn  }}</p>
              </div>
              <div class="meaning-item">
                <p>{{ intentData.relationshipImpactEn }}</p>
              </div>
              <div class="meaning-item">
                <p>{{ intentData.careerAlignmentEn  }}</p>
              </div>
              <div class="meaning-item">
                <p>{{ intentData.philosophyMeaningEn }}</p>
              </div>
              <div class="meaning-item">
                <p>{{ intentData.culturalSignificanceEn }}</p>
              </div>
              <div class="meaning-item">
                <p>{{ intentData.spiritualMeaningEn  }}</p>
              </div>
              <div class="meaning-item">
                <p>{{ intentData.modernInterpretationEn }}</p>
              </div>
              <div class="meaning-item">
                <p>{{ intentData.metaTitleEn  }}</p>
              </div>
              <div class="meaning-item">
                <p>{{  intentData.metaDescriptionEn }}</p>
              </div>
              <div class="meaning-item">
                <p>{{ intentData.metaKeywordsEn }}</p>
              </div>
            </div>
          </div>


          <!-- 图片资源卡片 -->
          <div class="info-card full-width">
            <h3 class="card-title">Picture</h3>
            <div class="image-grid">
              <div class="image-item" v-if="intentData.iconUrl">
                <img :src="intentData.iconUrl" alt="图标" class="resource-img">
              </div>
              <div class="image-item" v-if="intentData.symbolImageUrl">
                <img :src="intentData.symbolImageUrl" alt="象征图" class="resource-img">
              </div>
              <div class="image-item" v-if="intentData.energyImageUrl">
                <img :src="intentData.energyImageUrl" alt="能量图" class="resource-img">
              </div>
              <!-- 在图片资源卡片中补充 -->
              <div class="image-item" v-if="intentData.applicationImageUrl">
                <img :src="intentData.applicationImageUrl" alt="应用场景图" class="resource-img">
              </div>
              <div class="image-item" v-if="intentData.meditationImageUrl">
                <img :src="intentData.meditationImageUrl" alt="冥想引导图" class="resource-img">
              </div>
              <div class="image-item no-image" v-if="!intentData.iconUrl && !intentData.symbolImageUrl && !intentData.energyImageUrl && !intentData.applicationImageUrl && !intentData.meditationImageUrl">
                <span>暂无图片资源</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 无数据状态 -->
    <div v-else class="no-data-state">
      <p>No matching emotional intent data found</p>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import {Picture} from "@element-plus/icons-vue";

export default {
  name: 'EmotionalIntentDetail',
  components: {Picture},

  data() {
    return {
      // 路由参数
      intentId: '',
      // 情感意图数据（完整映射文档2的所有字段）
      intentData: {
        // ==================== 主键字段 ====================
        id: '',

        // ==================== 基础标识字段 ====================
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

      // 界面状态
      loading: false,
      error: false,
      activeLanguage: 'Zh',
      activeTab: 'Zh',      // 实用属性描述标签页
      activeSeoTab: 'Zh'    // SEO信息标签页
    }
  },

  // 移除所有计算属性，直接展示原始数据
  watch: {
    '$route.params.id': {
      immediate: true,
      handler(newId) {
        if (newId && newId !== this.intentId) {
          this.intentId = newId
          this.loadIntentData()
        }
      }
    }
  },

  mounted() {
    this.initializeComponent()
  },

  methods: {
    // 初始化组件 - 仅获取参数和加载数据
    initializeComponent() {
      this.intentId = this.$route.params.id
      if (this.intentId) {
        this.loadIntentData()
      } else {
        this.error = true
      }
    },

    // 加载情感意图数据 - 仅获取和赋值，不处理数据
    async loadIntentData() {
      try {
        //console.log(`开始请求情感意图数据，ID: ${this.intentId}`)
        // 1. 发起请求
        const response = await fetch(`/api/emotional-intent/getByid/${this.intentId}`)
       // console.log("原始响应对象:", response)  // 这是Response对象，不是数据
        // 2. 检查响应状态
        if (!response.ok) {
          throw new Error(`HTTP错误! 状态: ${response.status}`)
        }
        // 3. 解析JSON数据
        const result = await response.json()
        //console.log("解析后的JSON数据:", result)
        // 4. 检查数据结构
        if (result && result.data) {
          this.intentData = result.data
          //console.log("成功设置intentData:", this.intentData)
        } else {
          throw new Error("返回数据格式不正确，缺少data字段")
        }

      } catch (error) {
        //console.error('加载情感意图数据失败:', error)
        this.error = true
      }
    },

    // 仅保留最基本的图片错误处理
    handleImageError(event) {
      event.target.style.display = 'none'
      const placeholder = event.target.parentNode.querySelector('.image-placeholder')
      if (placeholder) {
        placeholder.style.display = 'flex'
      }
    }
  }
}
</script>

<style scoped>
/* 全局样式 */
.emotional-intent-detail {
  font-family: 'Arial', 'Helvetica', sans-serif;
  background-color: #0a1a35;
  color: #f5f5f5;
  min-height: 100vh;
  padding: 0;
  margin: 0;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #fff;
  min-height: 50vh;
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误状态 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #ff6b6b;
  min-height: 50vh;
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

/* 无数据状态 */
.no-data-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #a8a8a8;
  min-height: 50vh;
  text-align: center;
}

/* 头部横幅区域 */
.hero-section {
  height: 15cm;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  background: linear-gradient(135deg, rgba(10, 26, 53, 0.9) 0%, rgba(20, 40, 80, 0.8) 100%);
}

.hero-container {
  display: flex;
  width: 100%;
  height: 100%;
  margin: 0;
  max-width: 1200px;
}

.hero-image {
  flex: 0 0 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.hero-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.image-placeholder {
  width: 200px;
  height: 200px;
  background: rgba(255, 215, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  font-size: 3rem;
}

.symbol-char {
  font-size: 4rem;
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

.intent-badge {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.category-tag, .intensity-tag {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.category-tag {
  background-color: #4ecdc4;
  color: white;
}

.intensity-tag {
  background-color: #ff6b6b;
  color: white;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  width: 100%;
  text-align: left;
  word-wrap: break-word;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: #a8a8a8;
  margin-bottom: 1.5rem;
  width: 100%;
  text-align: left;
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.6;
  width: 100%;
  text-align: left;
  color: #e0e0e0;
  margin-bottom: 2rem;
}

.symbol-display {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.symbol {
  font-size: 3rem;
}

.color-preview {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

/* 详细信息区域 */
.details-section {
  padding: 2rem 0;
  background-color: #0a1a35;
}

.details-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.info-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.info-card.full-width {
  grid-column: 1 / -1;
}

.card-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #4ecdc4;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.5rem;
}

.info-grid {
  display: grid;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.info-item.full-width {
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  font-weight: bold;
  color: #a8a8a8;
  min-width: 120px;
  flex-shrink: 0;
}

.info-item span {
  word-break: break-word;
  line-height: 1.4;
}

.symbol-large {
  font-size: 2rem;
}

.color-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-sample {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.category-badge {
  padding: 0.2rem 0.6rem;
  background-color: rgba(78, 205, 196, 0.2);
  color: #4ecdc4;
  border-radius: 4px;
  font-size: 0.8rem;
}

/* 多语言标签页 */
.language-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tab-button {
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  color: #a8a8a8;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.tab-button.active {
  color: #4ecdc4;
  border-bottom-color: #4ecdc4;
}

.tab-button:hover {
  color: #fff;
}

.meaning-content {
  display: grid;
  gap: 1rem;
}

.meaning-item {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 4px;
  border-left: 3px solid #4ecdc4;
}

.meaning-item strong {
  display: block;
  margin-bottom: 0.5rem;
  color: #a8a8a8;
}

.meaning-item p {
  margin: 0;
  line-height: 1.5;
  color: #e0e0e0;
}

/* 图片网格 */
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.image-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.image-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.image-label {
  font-size: 0.8rem;
  color: #a8a8a8;
}

/* 状态网格 */
.status-grid {
  display: grid;
  gap: 0.8rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.5rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.02);
}

.status-item.active {
  background: rgba(76, 175, 80, 0.1);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ff6b6b;
}

.status-item.active .status-dot {
  background-color: #4ecdc4;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .details-container {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }

  .hero-title {
    font-size: 2.2rem;
  }

  .hero-subtitle {
    font-size: 1.3rem;
  }
}

@media (max-width: 768px) {
  .hero-container {
    flex-direction: column;
    height: auto;
    min-height: 15cm;
  }

  .hero-image {
    flex: 0 0 auto;
    width: 100%;
    padding: 1rem;
  }

  .hero-content {
    padding: 1rem;
    align-items: center;
    text-align: center;
  }

  .hero-title, .hero-subtitle, .hero-description {
    text-align: center;
  }

  .details-container {
    grid-template-columns: 1fr;
    padding: 0 0.5rem;
  }

  .info-item {
    flex-direction: column;
    gap: 0.3rem;
  }

  .info-item label {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .info-card {
    padding: 1rem;
  }

  .card-title {
    font-size: 1.1rem;
  }

  .image-grid {
    grid-template-columns: 1fr;
  }
}

/* 空数据状态显示 */
.info-item span:empty::before {
  content: "空";
  color: #666;
  font-style: italic;
}

/* 长文本换行处理 */
.info-item span {
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}
</style>


