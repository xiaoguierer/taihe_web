<template>
  <div class="product-category-tag-detail">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载商品品类标签数据...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <p>数据加载失败，请稍后重试</p>
      <button @click="loadTagData" class="retry-button">重新加载</button>
    </div>

    <!-- 主内容区域 -->
    <div v-else-if="tagData.id" class="content-wrapper">
      <!-- 头部横幅区域 -->
      <section class="hero-section">
        <div class="hero-container">
          <div class="hero-image">
            <img
                v-if="tagData.iconPath"
                :src="tagData.iconPath"
                :alt="tagData.tagNameEn"
                class="hero-img"
            >
            <div v-else class="image-placeholder">
              <span class="symbol-char">{{ getInitials(tagData.tagNameEn) }}</span>
            </div>
          </div>
          <div class="hero-content">
            <div class="tag-badge">
<!--              <span class="type-tag">{{ getTagTypeText(tagData.tagType) }}</span>-->
<!--              <span class="status-tag" :class="{ active: tagData.isActive }">
                {{ tagData.isActive ? '已启用' : '已禁用' }}
              </span>-->
            </div>
            <h1 class="hero-title">{{ tagData.tagKey }}</h1>
            <h2 class="hero-subtitle">{{ tagData.tagNameEn }}</h2>
            <p class="hero-description">{{ tagData.descriptionEn }}</p>
            <p class="hero-description">{{ tagData.shortDescEn }}</p>
            <div class="color-display" v-if="tagData.colorCode">
              <span class="color-label"></span>
              <div class="color-preview" :style="{ background: tagData.colorCode }"></div>
              <span class="color-value">{{ tagData.colorCode }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 详细信息区域 -->
      <section class="details-section">
        <div class="details-container">
          <!-- SEO信息卡片 -->
          <div class="info-card full-width">
            <h3 class="card-title"> Base Infor</h3>
            <div class="info-grid">

              <div class="info-item full-width">
                <span>{{ tagData.metaTitleEn}}</span>
              </div>
              <div class="info-item full-width">
                <span>{{ tagData.metaDescriptionEn}}</span>
              </div>
              <div class="info-item full-width">
                <span>{{ tagData.metaKeywordsEn}}</span>
              </div>
            </div>
          </div>

          <!-- 图片资源卡片 -->
          <div class="info-card full-width">
            <h3 class="card-title"></h3>
            <div class="image-grid">
              <div class="image-item" v-if="tagData.iconPath">
                <img :src="tagData.iconPath" alt="图标" class="resource-img">
              </div>
              <div class="image-item" v-if="tagData.coverImageUrl">
                <img :src="tagData.coverImageUrl" alt="封面图标" class="resource-img">
              </div>
              <div class="image-item" v-if="tagData.hoverImageUrl">
                <img :src="tagData.hoverImageUrl" alt="悬停图标" class="resource-img">
              </div>
              <div class="image-item no-image" v-if="!tagData.iconPath && !tagData.coverImageUrl && !tagData.hoverImageUrl">
                <span>暂无图片资源</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 无数据状态 -->
    <div v-else class="no-data-state">
      <p>未找到匹配的商品品类标签数据</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCategoryTagDetail',

  data() {
    return {
      // 路由参数
      tagId: '',
      // 商品品类标签数据（完整映射文档3的所有字段）
      tagData: {
        // 主键字段
        id: '',

        // 基础标识字段
        tagKey: '',
        tagNameEn: '',
        tagNameZh: '',
        tagNameAr: '',

        // 描述信息
        descriptionEn: '',
        descriptionZh: '',
        descriptionAr: '',
        shortDescEn: '',
        shortDescZh: '',
        shortDescAr: '',

        // 图片资源
        iconId: '',
        iconPath: '',
        coverImageUrl: '',
        coverId: '',
        hoverImageUrl: '',
        hoverId: '',

        // 分类属性
        tagType: 1,
        parentTagId: '',
        colorCode: '',

        // 控制属性
        sortOrder: 0,
        isActive: true,
        showInFilter: true,
        showInNavigation: false,

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

        // 审计字段
        createdBy: '',
        updatedBy: '',
        createdTime: '',
        updatedTime: ''
      },

      // 界面状态
      loading: false,
      error: false,

      // 标签类型映射
      tagTypes: {
        1: '首饰类型',
        2: '材质',
        3: '宝石类型',
        4: '风格',
        5: '场合',
        6: '工艺',
        7: '人群',
        8: '五行属性'
      }
    }
  },

  watch: {
    '$route.params.id': {
      immediate: true,
      handler(newId) {
        if (newId && newId !== this.tagId) {
          this.tagId = newId
          this.loadTagData()
        }
      }
    }
  },

  mounted() {
    this.initializeComponent()
  },

  methods: {
    initializeComponent() {
      this.tagId = this.$route.params.id
      if (this.tagId) {
        this.loadTagData()
      } else {
        this.error = true
      }
    },

    async loadTagData() {
      try {
        this.loading = true
        this.error = false

        const response = await fetch(`/api/product-category-tags/getById/${this.tagId}`)
        if (!response.ok) {
          throw new Error(`HTTP错误! 状态: ${response.status}`)
        }

        const result = await response.json()
        if (result && result.data) {
          this.tagData = result.data
        } else {
          throw new Error("返回数据格式不正确")
        }

      } catch (error) {
        console.error('加载商品品类标签数据失败:', error)
        this.error = true
      } finally {
        this.loading = false
      }
    },

    getTagTypeText(type) {
      return this.tagTypes[type] || `未知类型(${type})`
    },

    getLanguageField(field, language) {
      const fieldName = `${field}${language}`
      return this.tagData[fieldName] || ''
    },

    getInitials(text) {
      return text ? text.charAt(0) : '?'
    },

    formatDate(dateString) {
      if (!dateString) return '未知'
      return new Date(dateString).toLocaleString('zh-CN')
    },

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
/* 这里放置与文档1完全相同的CSS样式 */
/* 由于字符限制，CSS样式与文档1保持一致，仅修改类名前缀 */
.product-category-tag-detail {
  font-family: 'Arial', 'Helvetica', sans-serif;
  background-color: #0a1a35;
  color: #f5f5f5;
  min-height: 100vh;
  padding: 0;
  margin: 0;
}

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

.no-data-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #a8a8a8;
  min-height: 50vh;
  text-align: center;
}

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

.tag-badge {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.type-tag, .status-tag {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.type-tag {
  background-color: #4ecdc4;
  color: white;
}

.status-tag {
  background-color: #ff6b6b;
  color: white;
}

.status-tag.active {
  background-color: #4ecdc4;
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

.color-display {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.color-label {
  color: #a8a8a8;
}

.color-preview {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.color-value {
  color: #e0e0e0;
}

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

.type-badge {
  padding: 0.2rem 0.6rem;
  background-color: rgba(78, 205, 196, 0.2);
  color: #4ecdc4;
  border-radius: 4px;
  font-size: 0.8rem;
}

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

.info-item span:empty::before {
  content: "空";
  color: #666;
  font-style: italic;
}

.info-item span {
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}
</style>