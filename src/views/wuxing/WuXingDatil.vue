<template>
  <div class="wu-xing-detail">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading Wu Xing attribute data...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <p>Failed to load data. Please try again later.</p>
      <button @click="loadWuXingData" class="retry-button">Reload Data</button>
    </div>

    <!-- 主内容区域 -->
    <div v-else-if="wuXingData.id" class="content-wrapper">
      <!-- 头部横幅区域 -->
      <section class="hero-section">
        <div class="hero-container">
          <div class="hero-image">
            <img
                v-if="wuXingData.symbolIconUrl"
                :src="wuXingData.symbolIconUrl"
                :alt="wuXingData.elementNameEn"
                class="hero-img"
            >
            <div class="image-placeholder">
              <span class="symbol-char">{{ wuXingData.symbolCharacter }}</span>
            </div>
          </div>
          <div class="hero-content">
            <div class="element-badge">
              <span class="category-tag">{{ wuXingData.elementCategory }}</span>
              <span class="tier-tag">Tier: {{ wuXingData.elementTier }}</span>
            </div>
            <h1 class="hero-title">{{ wuXingData.elementNameEn }}</h1>
            <p class="hero-description">{{ wuXingData.energyEssenceEn }}</p>
            <div class="symbol-display">
              <span class="symbol" :style="{ color: wuXingData.symbolColor }">
                {{ wuXingData.symbolCharacter }}
              </span>
              <div class="color-preview" :style="{ background: wuXingData.symbolColor }"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- 详细信息区域 -->
      <section class="details-section">
        <div class="details-container">
          <!-- 基础信息卡片 -->
          <div class="info-card">
            <h3 class="card-title">Basic Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>Element Key:</label>
                <span>{{ wuXingData.elementKey }}</span>
              </div>
              <div class="info-item">
                <label>Element Code:</label>
                <span>{{ wuXingData.elementCode }}</span>
              </div>
              <div class="info-item">
                <label>Category:</label>
                <span class="category-badge">{{ wuXingData.elementCategory }}</span>
              </div>
              <div class="info-item">
                <label>Tier:</label>
                <span>{{ wuXingData.elementTier }}</span>
              </div>
              <div class="info-item">
                <label>Sort Order:</label>
                <span>{{ wuXingData.sortOrder }}</span>
              </div>
              <div class="info-item">
                <label>Status:</label>
                <span :class="['status-dot', { active: wuXingData.isActive === 1 }]"></span>
                <span>{{ wuXingData.isActive === 1 ? 'Active' : 'Inactive' }}</span>
              </div>
            </div>
          </div>

          <!-- 象征属性卡片 -->
          <div class="info-card">
            <h3 class="card-title">Symbolic Attributes</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>Character:</label>
                <span class="symbol-large">{{ wuXingData.symbolCharacter }}</span>
              </div>
              <div class="info-item">
                <label>Color:</label>
                <div class="color-display">
                  <span>{{ wuXingData.symbolColor }}</span>
                  <div class="color-sample" :style="{ background: wuXingData.symbolColor }"></div>
                </div>
              </div>
              <div class="info-item">
                <label>Gradient:</label>
                <span>{{ wuXingData.symbolColorGradient }}</span>
              </div>
              <div class="info-item">
                <label>Direction:</label>
                <span>{{ wuXingData.symbolDirection }}</span>
              </div>
              <div class="info-item">
                <label>Season:</label>
                <span>{{ wuXingData.symbolSeason }}</span>
              </div>
              <div class="info-item">
                <label>Time:</label>
                <span>{{ wuXingData.symbolTime }}</span>
              </div>
            </div>
          </div>

          <!-- 自然象征卡片 -->
          <div class="info-card">
            <h3 class="card-title">Natural Symbols</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>Planet:</label>
                <span>{{ wuXingData.symbolPlanet }}</span>
              </div>
              <div class="info-item">
                <label>Weather:</label>
                <span>{{ wuXingData.symbolWeather }}</span>
              </div>
              <div class="info-item">
                <label>Landform:</label>
                <span>{{ wuXingData.symbolLandform }}</span>
              </div>
              <div class="info-item">
                <label>Animal:</label>
                <span>{{ wuXingData.symbolAnimal }}</span>
              </div>
              <div class="info-item">
                <label>Plant:</label>
                <span>{{ wuXingData.symbolPlant }}</span>
              </div>
              <div class="info-item">
                <label>Number:</label>
                <span>{{ wuXingData.symbolNumber }}</span>
              </div>
            </div>
          </div>

          <!-- 人体关联卡片 -->
          <div class="info-card">
            <h3 class="card-title">Body Associations</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>Organ:</label>
                <span>{{ wuXingData.symbolOrgan }}</span>
              </div>
              <div class="info-item">
                <label>Sense:</label>
                <span>{{ wuXingData.symbolSense }}</span>
              </div>
              <div class="info-item">
                <label>Tissue:</label>
                <span>{{ wuXingData.symbolTissue }}</span>
              </div>
              <div class="info-item">
                <label>Emotion:</label>
                <span>{{ wuXingData.symbolEmotion }}</span>
              </div>
              <div class="info-item">
                <label>Sound:</label>
                <span>{{ wuXingData.symbolSound }}</span>
              </div>
              <div class="info-item">
                <label>Taste:</label>
                <span>{{ wuXingData.symbolTaste }}</span>
              </div>
            </div>
          </div>

          <!-- 五行关系卡片 -->
          <div class="info-card">
            <h3 class="card-title">Element Relationships</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>Generates:</label>
                <span>{{ wuXingData.generatesElement }}</span>
              </div>
              <div class="info-item">
                <label>Generated By:</label>
                <span>{{ wuXingData.generatedByElement }}</span>
              </div>
              <div class="info-item">
                <label>Restrains:</label>
                <span>{{ wuXingData.restrainsElement }}</span>
              </div>
              <div class="info-item">
                <label>Restrained By:</label>
                <span>{{ wuXingData.restrainedByElement }}</span>
              </div>
            </div>
          </div>

          <!-- 哲学含义卡片 -->
          <div class="info-card full-width">
            <h3 class="card-title">Philosophical Meanings</h3>
            <div class="meaning-content">
              <div class="meaning-item">
                <p>{{wuXingData.philosophyMeaningEn }}</p>
              </div>
              <div class="meaning-item">
                <p>{{wuXingData.cosmologyMeaningEn }}</p>
              </div>
              <div class="meaning-item">
                <p>{{ wuXingData.lifePhilosophyEn }}</p>
              </div>
              <div class="meaning-item">
                <p>{{ wuXingData.changePrincipleEn }}</p>
              </div>
              <div class="meaning-item">
                <p>{{ wuXingData.culturalSymbolismEn }}</p>
              </div>
              <div class="meaning-item">
                <p>{{ wuXingData.mythologicalAssociationEn }}</p>
              </div>
              <div class="meaning-item">
                <p>{{ wuXingData.historicalReferenceEn }}</p>
              </div>
              <div class="meaning-item">
                <p>{{wuXingData.artisticExpressionEn }}</p>
              </div>
            </div>
          </div>

          <!-- 能量与灵性卡片 -->
          <div class="info-card full-width">
            <h3 class="card-title">Energy & Spirituality</h3>
            <div class="meaning-content">
              <div class="meaning-item">
                <p>{{ wuXingData.energyEssenceEn }}</p>
              </div>
              <div class="meaning-item">
                <p>{{ wuXingData.energyManifestationEn }}</p>
              </div>
              <div class="meaning-item">
                <p>{{ wuXingData.spiritualMeaningEn }}</p>
              </div>
              <div class="meaning-item">
                <p>{{ wuXingData.personalityArchetypeEn }}</p>
              </div>
              <div class="meaning-item">
                <p>{{  wuXingData.lifeGuidanceEn }}</p>
              </div>
              <div class="meaning-item">
                <p>{{wuXingData.healingPropertyEn }}</p>
              </div>
              <div class="meaning-item">
                <p>{{wuXingData.relationshipMeaningEn }}</p>
              </div>
            </div>
          </div>

          <!-- 图片资源卡片 -->
          <div class="info-card full-width">
            <h3 class="card-title">Image Resources</h3>
            <div class="image-grid">
              <div class="image-item" v-if="wuXingData.symbolIconUrl">
                <img :src="wuXingData.symbolIconUrl" alt="象征" class="resource-img">
              </div>
              <div class="image-item" v-if="wuXingData.philosophyImageUrl">
                <img :src="wuXingData.philosophyImageUrl" alt="哲学" class="resource-img">
              </div>
              <div class="image-item" v-if="wuXingData.energyFlowImageUrl">
                <img :src="wuXingData.energyFlowImageUrl" alt="能量" class="resource-img">
              </div>
              <div class="image-item no-image" v-if="!wuXingData.symbolIconUrl && !wuXingData.philosophyImageUrl && !wuXingData.energyFlowImageUrl">
                <span>No image resources available</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 无数据状态 -->
    <div v-else class="no-data-state">
      <p>No matching Wu Xing attribute data found</p>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'

export default {
  name: 'WuXingAttributeDetail',

  data() {
    return {
      // 路由参数
      attributeId: '',
      // 五行属性数据（严格匹配文档2字段）
      wuXingData: {
        id: '',
        elementKey: '',
        elementCode: '',
        elementCategory: '',
        elementNameEn: '',
        elementNameZh: '',
        elementNameAr: '',
        symbolCharacter: '',
        symbolColor: '',
        symbolColorGradient: '',
        symbolDirection: '',
        symbolSeason: '',
        symbolTime: '',
        symbolPlanet: '',
        symbolWeather: '',
        symbolLandform: '',
        symbolAnimal: '',
        symbolPlant: '',
        symbolOrgan: '',
        symbolSense: '',
        symbolTissue: '',
        symbolEmotion: '',
        symbolSound: '',
        symbolTaste: '',
        symbolVirtue: '',
        symbolCareer: '',
        symbolNumber: null,
        symbolMusic: '',
        philosophyMeaningZh: '',
        philosophyMeaningEn: '',
        cosmologyMeaningZh: '',
        cosmologyMeaningEn: '',
        lifePhilosophyZh: '',
        lifePhilosophyEn: '',
        changePrincipleZh: '',
        changePrincipleEn: '',
        culturalSymbolismZh: '',
        culturalSymbolismEn: '',
        mythologicalAssociationZh: '',
        mythologicalAssociationEn: '',
        historicalReferenceZh: '',
        historicalReferenceEn: '',
        artisticExpressionZh: '',
        artisticExpressionEn: '',
        energyEssenceZh: '',
        energyEssenceEn: '',
        energyManifestationZh: '',
        energyManifestationEn: '',
        spiritualMeaningZh: '',
        spiritualMeaningEn: '',
        personalityArchetypeZh: '',
        personalityArchetypeEn: '',
        lifeGuidanceZh: '',
        lifeGuidanceEn: '',
        healingPropertyZh: '',
        healingPropertyEn: '',
        generatesElement: '',
        generatedByElement: '',
        restrainsElement: '',
        restrainedByElement: '',
        relationshipMeaningZh: '',
        relationshipMeaningEn: '',
        symbolIconUrl: '',
        philosophyImageUrl: '',
        energyFlowImageUrl: '',
        symbolIconId: '',
        philosophyImageId: '',
        energyFlowImageId: '',
        sortOrder: 0,
        elementTier: 0,
        isActive: 1,
        createdTime: '',
        updatedTime: ''
      },

      // 界面状态
      loading: false,
      error: false,
      activeTab: 'Zh',
      activeEnergyTab: 'Zh'
    }
  },

  watch: {
    '$route.params.id': {
      immediate: true,
      handler(newId) {
        if (newId && newId !== this.attributeId) {
          this.attributeId = newId
          this.loadWuXingData()
        }
      }
    }
  },

  mounted() {
    this.initializeComponent()
  },

  methods: {
    initializeComponent() {
      this.attributeId = this.$route.params.id
      if (this.attributeId) {
        this.loadWuXingData()
      } else {
        this.error = true
      }
    },

    async loadWuXingData() {
      this.loading = true
      this.error = false

      try {
        const response = await fetch(`/api/wu-xing-attributes/getById/${this.attributeId}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        if (result && result.data) {
          this.wuXingData = result.data
        } else {
          throw new Error('Invalid data format')
        }

      } catch (error) {
        console.error('Failed to load Wu Xing attribute data:', error)
        this.error = true
      } finally {
        this.loading = false
      }
    },

    handleImageError(event) {
      event.target.style.display = 'none'
      const placeholder = event.target.parentNode.querySelector('.image-placeholder')
      if (placeholder) {
        placeholder.style.display = 'flex'
      }
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleString()
    }
  }
}
</script>

<style scoped>
.wu-xing-detail {
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

.element-badge {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.category-tag, .tier-tag {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.category-tag {
  background-color: #4ecdc4;
  color: white;
}

.tier-tag {
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

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ff6b6b;
}

.status-dot.active {
  background-color: #4ecdc4;
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

.image-item.no-image {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 4px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
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

  .element-badge {
    flex-direction: column;
    gap: 0.5rem;
  }

  .image-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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

  .language-tabs {
    flex-wrap: wrap;
  }

  .tab-button {
    flex: 1;
    min-width: 80px;
    text-align: center;
  }
}

/* 空数据状态显示 */
.info-item span:empty::before {
  content: "N/A";
  color: #666;
  font-style: italic;
}

/* 长文本换行处理 */
.info-item span {
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

/* 图片错误处理 */
.image-error {
  display: none;
}

.image-placeholder {
  display: none;
}


/* 滚动条样式 */
.details-container::-webkit-scrollbar {
  width: 6px;
}

.details-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.details-container::-webkit-scrollbar-thumb {
  background: #4ecdc4;
  border-radius: 3px;
}

.details-container::-webkit-scrollbar-thumb:hover {
  background: #45b7aa;
}

/* 动画效果 */
.info-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.tab-button {
  transition: all 0.3s ease;
}

.retry-button {
  transition: all 0.3s ease;
}

/* 焦点状态 */
.tab-button:focus,
.retry-button:focus {
  outline: 2px solid #4ecdc4;
  outline-offset: 2px;
}

/* 高对比度支持 */
@media (prefers-contrast) {
  .wu-xing-detail {
    background-color: #000;
    color: #fff;
  }

  .info-card {
    border: 2px solid #fff;
  }

  .card-title {
    color: #fff;
  }
}

/* 减少动画支持 */
@media (prefers-reduced-motion: reduce) {
  .loading-spinner,
  .info-card,
  .tab-button,
  .retry-button {
    transition: none;
    animation: none;
  }
}
</style>
