<template>
  <div class="product-detail-page">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载商品信息...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="fetchProductData">重新加载</button>
    </div>

    <!-- 商品详情内容 -->
    <div v-else-if="productData" class="product-content">
      <!-- 第一部分：商品展示区 -->
      <section class="product-display-section">
        <div class="display-container">
          <!-- 左侧图片展示区 -->
          <div class="image-section">
            <div class="thumbnail-container">
              <div
                v-for="(img, index) in imageList"
                :key="index"
                class="thumbnail-item"
                :class="{ active: currentImageIndex === index }"
                @click="currentImageIndex = index"
              >

              </div>
            </div>
            <div class="main-image">

            </div>
          </div>

          <!-- 右侧信息展示区 -->
          <div class="info-section">
            <div class="product-info">
              <!-- SPU基本信息 -->
              <h1 class="product-name">{{ productData.spu.productNameZh }}</h1>
              <p class="product-subtitle">{{ productData.spu.shortDescriptionZh }}</p>

              <div class="basic-info">
                <span v-if="productData.spu.productCode" class="info-tag">编码: {{ productData.spu.productCode }}</span>
                <span v-if="productData.spu.brandNameZh" class="info-tag">品牌: {{ productData.spu.brandNameZh }}</span>
                <span v-if="productData.spu.categoryNameZh" class="info-tag">分类: {{ productData.spu.categoryNameZh }}</span>
                <span v-if="productData.spu.collectionNameZh" class="info-tag">系列: {{ productData.spu.collectionNameZh }}</span>
                <span v-if="productData.spu.productType" class="info-tag">类型: {{ productData.spu.productType }}</span>
                <span v-if="productData.spu.style" class="info-tag">风格: {{ productData.spu.style }}</span>
                <span v-if="productData.spu.theme" class="info-tag">主题: {{ productData.spu.theme }}</span>
              </div>

              <!-- 玄学标签 -->
              <div class="metaphysical-tags">
                <div class="tag-item" v-if="currentSkuElement">
                  <span class="icon">🌍</span>
                  <span>五行: {{ currentSkuElement }}</span>
                </div>
                <div class="tag-item" v-if="productData.spu.primaryElement">
                  <span class="icon">☯️</span>
                  <span>元素: {{ getElementName(productData.spu.primaryElement) }}</span>
                </div>
                <div class="tag-item" v-if="productData.spu.secondaryElement">
                  <span class="icon">🌟</span>
                  <span>次元素: {{ getElementName(productData.spu.secondaryElement) }}</span>
                </div>
                <div class="tag-item" v-if="currentSku.gemstoneType">
                  <span class="icon">💎</span>
                  <span>宝石: {{ currentSku.gemstoneType }}</span>
                </div>
                <div class="tag-item" v-if="productData.spu.targetZodiacSigns">
                  <span class="icon">♏️</span>
                  <span>星座: {{ productData.spu.targetZodiacSigns }}</span>
                </div>
                <div class="tag-item" v-if="productData.spu.targetChakra">
                  <span class="icon">🌀</span>
                  <span>脉轮: {{ productData.spu.targetChakra }}</span>
                </div>
                <div class="tag-item" v-if="currentSku.variantYuyiZh || productData.spu.emotionalPurposeZh">
                  <span class="icon">✨</span>
                  <span>寓意: {{ currentSku.variantYuyiZh || productData.spu.emotionalPurposeZh }}</span>
                </div>
              </div>

              <!-- SKU选择器 -->
              <div class="sku-selector" v-if="skuList.length > 0">
                <h3>选择规格:</h3>
                <div class="sku-options">
                  <div
                    v-for="sku in skuList"
                    :key="sku.id"
                    class="sku-option"
                    :class="{ active: currentSku.id === sku.id }"
                    @click="selectSku(sku)"
                  >
                    <div class="sku-info">
                      <span class="sku-name">{{ sku.skuNameZh || sku.skuName }}</span>
                      <span class="sku-code" v-if="sku.skuCode">({{ sku.skuCode }})</span>
                    </div>
                    <span class="sku-price">￥{{ formatPrice(sku.finalPrice || sku.retailPrice || sku.price) }}</span>
                  </div>
                </div>
              </div>

              <!-- 价格信息 -->
              <div class="price-section">
                <span class="price">￥{{ formatPrice(currentPrice) }}</span>
                <span v-if="hasDiscount" class="original-price">
                  ￥{{ formatPrice(currentSku.retailPrice) }}
                </span>
                <span v-if="currentSku.discountRate" class="discount-rate">-{{ currentSku.discountRate }}%</span>
                <span v-if="currentSku.priceUnit" class="price-unit">{{ currentSku.priceUnit }}</span>
              </div>

              <!-- 库存信息 -->
              <div class="stock-info">
                <span class="stock-label">库存:</span>
                <span class="stock-quantity" :class="{ 'low-stock': currentSku.stockQuantity < 10 }">
                  {{ currentSku.stockQuantity || 0 }}件
                </span>
                <span v-if="currentSku.stockQuantity < 10" class="stock-warning">（库存紧张）</span>
                <span v-if="currentSku.safetyStockQuantity" class="safety-stock">
                  安全库存: {{ currentSku.safetyStockQuantity }}件
                </span>
                <span v-if="currentSku.reservedQuantity" class="reserved-stock">
                  预留: {{ currentSku.reservedQuantity }}件
                </span>
                <span v-if="currentSku.availableQuantity" class="available-stock">
                  可用: {{ currentSku.availableQuantity }}件
                </span>
              </div>

              <!-- 信任标识 -->
              <div class="trust-badges">
                <div class="badge-item">
                  <span class="icon">⛭</span>
                  <span>全球免邮</span>
                </div>
                <div class="badge-item" v-if="currentSku.certificationType">
                  <span class="icon">📜</span>
                  <span>{{ currentSku.certificationType }}认证</span>
                </div>
                <div class="badge-item">
                  <span class="icon">↻</span>
                  <span>30天无忧退货</span>
                </div>
                <div class="badge-item">
                  <span class="icon">🔒</span>
                  <span>终身保养</span>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="action-buttons">
                <button class="btn-primary" @click="buyNow">🛒 立即购买</button>
                <button class="btn-secondary" @click="addToCart">❤️ 加入购物车</button>
                <button class="btn-wishlist" @click="addToWishlist">⭐ 收藏</button>
              </div>

              <!-- 快速信息 -->
              <div class="quick-info-grid">
                <div class="info-item" v-if="currentSku.skuCode">
                  <span class="label">SKU编码:</span>
                  <span class="value">{{ currentSku.skuCode }}</span>
                </div>
                <div class="info-item" v-if="currentSku.barCode">
                  <span class="label">条形码:</span>
                  <span class="value">{{ currentSku.barCode }}</span>
                </div>
                <div class="info-item" v-if="currentSku.modelNumber">
                  <span class="label">型号:</span>
                  <span class="value">{{ currentSku.modelNumber }}</span>
                </div>
                <div class="info-item" v-if="currentSku.countryOfOrigin">
                  <span class="label">原产国:</span>
                  <span class="value">{{ currentSku.countryOfOrigin }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- 第二部分：深度叙事与玄学内涵区 -->
      <section class="narrative-section">
        <div class="section-container">
          <h2 class="section-title">深度叙事与玄学内涵</h2>
          <div class="tab-container">
            <div class="tab-headers">
              <div
                v-for="(tab, index) in tabs"
                :key="index"
                class="tab-header"
                :class="{ active: activeTab === index }"
                @click="activeTab = index"
              >
                {{ tab.title }}
              </div>
            </div>

            <div class="tab-content">
              <!-- 能量故事 -->
              <div v-if="activeTab === 0" class="tab-panel">
                <h3>这件珠宝的起源</h3>

                <!-- SPU叙事信息 -->
                <div class="info-block" v-if="productData.spu.designConceptZh">
                  <h4>🎨 灵感叙事</h4>
                  <p>{{ productData.spu.designConceptZh }}</p>
                </div>

                <div class="info-block" v-if="productData.spu.spiritualSignificanceZh">
                  <h4>💎 宝石寓意</h4>
                  <p>{{ productData.spu.spiritualSignificanceZh }}</p>
                </div>

                <div class="info-block" v-if="productData.spu.emotionalPurposeZh">
                  <h4>❤️ 情感目的</h4>
                  <p>{{ productData.spu.emotionalPurposeZh }}</p>
                </div>

                <div class="info-block" v-if="productData.spu.energyPropertiesZh">
                  <h4>⚡ 能量属性</h4>
                  <p>{{ productData.spu.energyPropertiesZh }}</p>
                </div>

                <div class="info-block" v-if="productData.spu.intendedUsageZh">
                  <h4>🏠 使用场景</h4>
                  <p>{{ productData.spu.intendedUsageZh }}</p>
                </div>

                <div class="info-block" v-if="productData.spu.creationStoryZh">
                  <h4>📖 创作故事</h4>
                  <p>{{ productData.spu.creationStoryZh }}</p>
                </div>

                <div class="info-block" v-if="productData.spu.culturalContextZh">
                  <h4>🌍 文化背景</h4>
                  <p>{{ productData.spu.culturalContextZh }}</p>
                </div>

                <div class="info-block" v-if="productData.spu.metaphysicalBenefitsZh">
                  <h4>✨ 玄学益处</h4>
                  <p>{{ productData.spu.metaphysicalBenefitsZh }}</p>
                </div>

                <!-- SKU叙事信息 -->
                <div class="info-block" v-if="currentSku.variantStoryZh">
                  <h4>📝 规格故事</h4>
                  <p>{{ currentSku.variantStoryZh }}</p>
                </div>

                <div class="info-block" v-if="currentSku.variantYuyiZh">
                  <h4>💫 规格寓意</h4>
                  <p>{{ currentSku.variantYuyiZh }}</p>
                </div>

                <!-- 评分信息 -->
                <div class="score-section">
                  <h4>🏆 评分信息</h4>
                  <div class="scores-grid">
                    <div class="score-item" v-if="productData.spu.aiDesignScore">
                      <span class="score-label">AI设计评分:</span>
                      <span class="score-value">{{ productData.spu.aiDesignScore }}/100</span>
                    </div>

                    <div class="score-item" v-if="productData.spu.energyScore">
                      <span class="score-label">能量评分:</span>
                      <span class="score-value">{{ productData.spu.energyScore }}/10</span>
                    </div>

                    <div class="score-item" v-if="productData.spu.craftsmanshipScore">
                      <span class="score-label">工艺评分:</span>
                      <span class="score-value">{{ productData.spu.craftsmanshipScore }}/10</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 工艺与材质 -->
              <div v-if="activeTab === 1" class="tab-panel">
                <h3>工艺与材质细节</h3>

                <div class="specs-categories">
                  <!-- 基础信息 -->
                  <div class="spec-category">
                    <h4>📋 基础信息</h4>
                    <div class="specs-grid">
                      <div class="spec-item" v-if="productData.spu.productType">
                        <span class="spec-label">产品类型:</span>
                        <span class="spec-value">{{ productData.spu.productType }}</span>
                      </div>
                      <div class="spec-item" v-if="productData.spu.style">
                        <span class="spec-label">风格:</span>
                        <span class="spec-value">{{ productData.spu.style }}</span>
                      </div>
                      <div class="spec-item" v-if="productData.spu.theme">
                        <span class="spec-label">主题:</span>
                        <span class="spec-value">{{ productData.spu.theme }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.variantType">
                        <span class="spec-label">规格类型:</span>
                        <span class="spec-value">{{ currentSku.variantType }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.variantValue">
                        <span class="spec-label">规格值:</span>
                        <span class="spec-value">{{ currentSku.variantValue }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- 宝石信息 -->
                  <div class="spec-category">
                    <h4>💎 宝石信息</h4>
                    <div class="specs-grid">
                      <div class="spec-item" v-if="currentSku.gemstoneType">
                        <span class="spec-label">宝石类型:</span>
                        <span class="spec-value">{{ currentSku.gemstoneType }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.gemstoneWeightCt">
                        <span class="spec-label">宝石重量:</span>
                        <span class="spec-value">{{ currentSku.gemstoneWeightCt }}克拉</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.gemstoneCut">
                        <span class="spec-label">切割工艺:</span>
                        <span class="spec-value">{{ currentSku.gemstoneCut }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.gemstoneQuality">
                        <span class="spec-label">宝石品质:</span>
                        <span class="spec-value">{{ currentSku.gemstoneQuality }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.gemstoneColor">
                        <span class="spec-label">宝石颜色:</span>
                        <span class="spec-value">{{ currentSku.gemstoneColor }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.gemstoneClarity">
                        <span class="spec-label">宝石净度:</span>
                        <span class="spec-value">{{ currentSku.gemstoneClarity }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.gemstoneShape">
                        <span class="spec-label">宝石形状:</span>
                        <span class="spec-value">{{ currentSku.gemstoneShape }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.gemstoneTreatment">
                        <span class="spec-label">宝石处理:</span>
                        <span class="spec-value">{{ currentSku.gemstoneTreatment }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.gemstoneOrigin">
                        <span class="spec-label">宝石产地:</span>
                        <span class="spec-value">{{ currentSku.gemstoneOrigin }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- 金属信息 -->
                  <div class="spec-category">
                    <h4>⚱️ 金属信息</h4>
                    <div class="specs-grid">
                      <div class="spec-item" v-if="currentSku.primaryMaterial">
                        <span class="spec-label">主要材质:</span>
                        <span class="spec-value">{{ currentSku.primaryMaterial }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.metalWeightG">
                        <span class="spec-label">金属重量:</span>
                        <span class="spec-value">{{ currentSku.metalWeightG }}克</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.materialFinish">
                        <span class="spec-label">表面处理:</span>
                        <span class="spec-value">{{ currentSku.materialFinish }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.settingTechnique">
                        <span class="spec-label">镶嵌技术:</span>
                        <span class="spec-value">{{ currentSku.settingTechnique }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.metalPurity">
                        <span class="spec-label">金属纯度:</span>
                        <span class="spec-value">{{ currentSku.metalPurity }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.metalColor">
                        <span class="spec-label">金属颜色:</span>
                        <span class="spec-value">{{ currentSku.metalColor }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- 尺寸信息 -->
                  <div class="spec-category">
                    <h4>📏 尺寸信息</h4>
                    <div class="specs-grid">
                      <div class="spec-item" v-if="currentSku.chainLengthCm">
                        <span class="spec-label">链长:</span>
                        <span class="spec-value">{{ currentSku.chainLengthCm }}厘米</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.pendantSizeMm">
                        <span class="spec-label">吊坠尺寸:</span>
                        <span class="spec-value">{{ currentSku.pendantSizeMm }}毫米</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.totalWeightG">
                        <span class="spec-label">总重量:</span>
                        <span class="spec-value">{{ currentSku.totalWeightG }}克</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.ringSize">
                        <span class="spec-label">戒圈尺寸:</span>
                        <span class="spec-value">{{ currentSku.ringSize }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.lengthMm">
                        <span class="spec-label">长度:</span>
                        <span class="spec-value">{{ currentSku.lengthMm }}毫米</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.widthMm">
                        <span class="spec-label">宽度:</span>
                        <span class="spec-value">{{ currentSku.widthMm }}毫米</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.heightMm">
                        <span class="spec-label">高度:</span>
                        <span class="spec-value">{{ currentSku.heightMm }}毫米</span>
                      </div>
                    </div>
                  </div>

                  <!-- 技术信息 -->
                  <div class="spec-category">
                    <h4>🔧 技术信息</h4>
                    <div class="specs-grid">
                      <div class="spec-item" v-if="currentSku.certificationType">
                        <span class="spec-label">认证类型:</span>
                        <span class="spec-value">{{ currentSku.certificationType }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.certificationNumber">
                        <span class="spec-label">认证编号:</span>
                        <span class="spec-value">{{ currentSku.certificationNumber }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.careInstructions">
                        <span class="spec-label">保养说明:</span>
                        <span class="spec-value">{{ currentSku.careInstructions }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.waterResistance">
                        <span class="spec-label">防水等级:</span>
                        <span class="spec-value">{{ currentSku.waterResistance }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- 功能属性 -->
                  <div class="spec-category">
                    <h4>✨ 功能属性</h4>
                    <div class="specs-grid">
                      <div class="spec-item" v-if="currentSku.specialFeature">
                        <span class="spec-label">特色功能:</span>
                        <span class="spec-value">{{ currentSku.specialFeature }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.energyAttribute">
                        <span class="spec-label">能量属性:</span>
                        <span class="spec-value">{{ currentSku.energyAttribute }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.healingProperty">
                        <span class="spec-label">疗愈属性:</span>
                        <span class="spec-value">{{ currentSku.healingProperty }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.astrologicalAssociation">
                        <span class="spec-label">星座关联:</span>
                        <span class="spec-value">{{ currentSku.astrologicalAssociation }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.chakraAlignment">
                        <span class="spec-label">脉轮对应:</span>
                        <span class="spec-value">{{ currentSku.chakraAlignment }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- 商业信息 -->
                  <div class="spec-category">
                    <h4>💰 商业信息</h4>
                    <div class="specs-grid">
                      <div class="spec-item" v-if="currentSku.costPrice">
                        <span class="spec-label">成本价:</span>
                        <span class="spec-value">￥{{ formatPrice(currentSku.costPrice) }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.retailPrice">
                        <span class="spec-label">零售价:</span>
                        <span class="spec-value">￥{{ formatPrice(currentSku.retailPrice) }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.finalPrice">
                        <span class="spec-label">最终价:</span>
                        <span class="spec-value">￥{{ formatPrice(currentSku.finalPrice) }}</span>
                      </div>
                      <div class="spec-item" v-if="currentSku.taxRate">
                        <span class="spec-label">税率:</span>
                        <span class="spec-value">{{ currentSku.taxRate }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 专属推荐 -->
              <div v-if="activeTab === 2" class="tab-panel">
                <h3>您的专属能量搭配建议</h3>

                <div class="recommendations">
                  <div class="recommendation-item" v-if="currentSkuElement">
                    <h4>能量搭配</h4>
                    <p>根据{{ currentSkuElement }}元素特性，建议搭配水元素饰品增强流动性。</p>
                  </div>

                  <div class="recommendation-item" v-if="currentSku.suitableGender">
                    <h4>适合人群</h4>
                    <p>{{ getGenderText(currentSku.suitableGender) }}，年龄{{ currentSku.suitableAgeMin }}-{{ currentSku.suitableAgeMax }}岁</p>
                  </div>

                  <div class="recommendation-item" v-if="productData.spu.productionLeadTime">
                    <h4>制作周期</h4>
                    <p>预计{{ productData.spu.productionLeadTime }}天完成制作</p>
                  </div>

                  <div class="recommendation-item" v-if="currentSku.specialFeature">
                    <h4>特色功能</h4>
                    <p>{{ currentSku.specialFeature }}</p>
                  </div>

                  <div class="recommendation-item" v-if="currentSku.energyAttribute">
                    <h4>能量属性</h4>
                    <p>{{ currentSku.energyAttribute }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- 第三部分：建立信任与社群证明区 -->
      <section class="trust-section">
        <div class="section-container">
          <!-- 品质保障 -->
          <div class="quality-standards" v-if="hasQualityData">
            <h2 class="section-title">品质保障</h2>
            <div class="standards-list">
              <div class="standard-item" v-if="qualityData.warranty_period">
                <span class="icon">🛡️</span>
                <span>质保期限: {{ qualityData.warranty_period }}</span>
              </div>
              <div class="standard-item" v-if="qualityData.quality_grade">
                <span class="icon">⭐</span>
                <span>品质等级: {{ qualityData.quality_grade }}</span>
              </div>
              <div class="standard-item" v-if="qualityData.certification_required">
                <span class="icon">📋</span>
                <span>认证要求: {{ qualityData.certification_required ? '是' : '否' }}</span>
              </div>
              <div class="standard-item" v-if="qualityData.inspection_standard">
                <span class="icon">🔍</span>
                <span>检验标准: {{ qualityData.inspection_standard }}</span>
              </div>
              <div class="standard-item" v-if="qualityData.safety_standard">
                <span class="icon">⚠️</span>
                <span>安全标准: {{ qualityData.safety_standard }}</span>
              </div>
              <div class="standard-item" v-if="qualityData.environmental_standard">
                <span class="icon">🌱</span>
                <span>环保标准: {{ qualityData.environmental_standard }}</span>
              </div>
            </div>
          </div>

          <!-- 保修信息 -->
          <div class="warranty-info" v-if="productData.spu.warrantyInfo || currentSku.warrantyPeriod">
            <h2 class="section-title">保修服务</h2>
            <div class="warranty-details">
              <div class="warranty-item" v-if="productData.spu.warrantyInfo">
                <span class="icon">📄</span>
                <span>保修说明: {{ productData.spu.warrantyInfo }}</span>
              </div>
              <div class="warranty-item" v-if="currentSku.warrantyPeriod">
                <span class="icon">⏱️</span>
                <span>保修期限: {{ currentSku.warrantyPeriod }}</span>
              </div>
              <div class="warranty-item" v-if="productData.spu.warrantyType">
                <span class="icon">🔧</span>
                <span>保修类型: {{ productData.spu.warrantyType }}</span>
              </div>
              <div class="warranty-item" v-if="productData.spu.warrantyCoverage">
                <span class="icon">📊</span>
                <span>保修范围: {{ productData.spu.warrantyCoverage }}</span>
              </div>
            </div>
          </div>

          <!-- 退换政策 -->
          <div class="return-policy" v-if="productData.spu.returnPolicy || currentSku.returnDays">
            <h2 class="section-title">退换政策</h2>
            <div class="policy-details">
              <div class="policy-item" v-if="productData.spu.returnPolicy">
                <span class="icon">🔄</span>
                <span>退换政策: {{ productData.spu.returnPolicy }}</span>
              </div>
              <div class="policy-item" v-if="currentSku.returnDays">
                <span class="icon">📅</span>
                <span>退换天数: {{ currentSku.returnDays }}天</span>
              </div>
              <div class="policy-item" v-if="productData.spu.refundPolicy">
                <span class="icon">💳</span>
                <span>退款政策: {{ productData.spu.refundPolicy }}</span>
              </div>
              <div class="policy-item" v-if="productData.spu.exchangePolicy">
                <span class="icon">🔄</span>
                <span>换货政策: {{ productData.spu.exchangePolicy }}</span>
              </div>
            </div>
          </div>

          <!-- 配送信息 -->
          <div class="shipping-info" v-if="hasShippingInfo">
            <h2 class="section-title">配送信息</h2>
            <div class="shipping-details">
              <div class="shipping-item" v-if="currentSku.shippingWeightKg">
                <span class="icon">⚖️</span>
                <span>运输重量: {{ currentSku.shippingWeightKg }}kg</span>
              </div>
              <div class="shipping-item" v-if="currentSku.deliveryTimeDays">
                <span class="icon">🚚</span>
                <span>配送时间: {{ currentSku.deliveryTimeDays }}天</span>
              </div>
              <div class="shipping-item" v-if="currentSku.shippingCost">
                <span class="icon">💰</span>
                <span>运费: ￥{{ formatPrice(currentSku.shippingCost) }}</span>
              </div>
              <div class="shipping-item" v-if="currentSku.freeShippingThreshold">
                <span class="icon">🎁</span>
                <span>包邮门槛: ￥{{ formatPrice(currentSku.freeShippingThreshold) }}</span>
              </div>
              <div class="shipping-item" v-if="currentSku.shippingMethod">
                <span class="icon">📦</span>
                <span>配送方式: {{ currentSku.shippingMethod }}</span>
              </div>
              <div class="shipping-item" v-if="currentSku.shippingCarrier">
                <span class="icon">🏢</span>
                <span>承运商: {{ currentSku.shippingCarrier }}</span>
              </div>
            </div>
          </div>

          <!-- 供应商信息 -->
          <div class="supplier-info" v-if="hasSupplierInfo">
            <h2 class="section-title">供应商信息</h2>
            <div class="supplier-details">
              <div class="supplier-item" v-if="currentSku.supplierCode">
                <span class="icon">🏷️</span>
                <span>供应商编码: {{ currentSku.supplierCode }}</span>
              </div>
              <div class="supplier-item" v-if="currentSku.supplierName">
                <span class="icon">🏢</span>
                <span>供应商名称: {{ currentSku.supplierName }}</span>
              </div>
              <div class="supplier-item" v-if="currentSku.manufacturer">
                <span class="icon">🏭</span>
                <span>制造商: {{ currentSku.manufacturer }}</span>
              </div>
              <div class="supplier-item" v-if="currentSku.manufacturerCountry">
                <span class="icon">🌍</span>
                <span>生产国: {{ currentSku.manufacturerCountry }}</span>
              </div>
              <div class="supplier-item" v-if="currentSku.manufacturerAddress">
                <span class="icon">📍</span>
                <span>生产地址: {{ currentSku.manufacturerAddress }}</span>
              </div>
              <div class="supplier-item" v-if="currentSku.manufacturerContact">
                <span class="icon">📞</span>
                <span>联系方式: {{ currentSku.manufacturerContact }}</span>
              </div>
            </div>
          </div>

          <!-- 包装信息 -->
          <div class="packaging-info" v-if="hasPackagingInfo">
            <h2 class="section-title">包装信息</h2>
            <div class="packaging-details">
              <div class="packaging-item" v-if="currentSku.packagingType">
                <span class="icon">🎁</span>
                <span>包装类型: {{ currentSku.packagingType }}</span>
              </div>
              <div class="packaging-item" v-if="currentSku.packagingMaterial">
                <span class="icon">📦</span>
                <span>包装材料: {{ currentSku.packagingMaterial }}</span>
              </div>
              <div class="packaging-item" v-if="currentSku.packagingWeightG">
                <span class="icon">⚖️</span>
                <span>包装重量: {{ currentSku.packagingWeightG }}克</span>
              </div>
              <div class="packaging-item" v-if="currentSku.packagingDimensions">
                <span class="icon">📐</span>
                <span>包装尺寸: {{ currentSku.packagingDimensions }}</span>
              </div>
              <div class="packaging-item" v-if="currentSku.giftWrappingAvailable">
                <span class="icon">🎀</span>
                <span>礼品包装: {{ currentSku.giftWrappingAvailable ? '支持' : '不支持' }}</span>
              </div>
              <div class="packaging-item" v-if="currentSku.giftMessageAvailable">
                <span class="icon">💌</span>
                <span>礼品留言: {{ currentSku.giftMessageAvailable ? '支持' : '不支持' }}</span>
              </div>
            </div>
          </div>

          <!-- 合规信息 -->
          <div class="compliance-info" v-if="hasComplianceInfo">
            <h2 class="section-title">合规信息</h2>
            <div class="compliance-details">
              <div class="compliance-item" v-if="currentSku.complianceCertification">
                <span class="icon">📜</span>
                <span>合规认证: {{ currentSku.complianceCertification }}</span>
              </div>
              <div class="compliance-item" v-if="currentSku.safetyCertification">
                <span class="icon">⚠️</span>
                <span>安全认证: {{ currentSku.safetyCertification }}</span>
              </div>
              <div class="compliance-item" v-if="currentSku.environmentalCertification">
                <span class="icon">🌱</span>
                <span>环保认证: {{ currentSku.environmentalCertification }}</span>
              </div>
              <div class="compliance-item" v-if="currentSku.industryStandard">
                <span class="icon">🏭</span>
                <span>行业标准: {{ currentSku.industryStandard }}</span>
              </div>
              <div class="compliance-item" v-if="currentSku.regulatoryApproval">
                <span class="icon">✅</span>
                <span>监管批准: {{ currentSku.regulatoryApproval }}</span>
              </div>
            </div>
          </div>

          <!-- 其他技术信息 -->
          <div class="technical-info" v-if="hasTechnicalInfo">
            <h2 class="section-title">技术信息</h2>
            <div class="technical-details">
              <div class="technical-item" v-if="currentSku.hardness">
                <span class="icon">💎</span>
                <span>硬度: {{ currentSku.hardness }}</span>
              </div>
              <div class="technical-item" v-if="currentSku.durability">
                <span class="icon">🔨</span>
                <span>耐久性: {{ currentSku.durability }}</span>
              </div>
              <div class="technical-item" v-if="currentSku.materialComposition">
                <span class="icon">🧪</span>
                <span>材料成分: {{ currentSku.materialComposition }}</span>
              </div>
              <div class="technical-item" v-if="currentSku.manufacturingProcess">
                <span class="icon">⚙️</span>
                <span>制造工艺: {{ currentSku.manufacturingProcess }}</span>
              </div>
              <div class="technical-item" v-if="currentSku.qualityControl">
                <span class="icon">🔍</span>
                <span>质量控制: {{ currentSku.qualityControl }}</span>
              </div>
              <div class="technical-item" v-if="currentSku.testingMethod">
                <span class="icon">🧪</span>
                <span>测试方法: {{ currentSku.testingMethod }}</span>
              </div>
            </div>
          </div>

          <!-- 时间戳信息 -->
          <div class="timestamp-info" v-if="hasTimestampInfo">
            <h2 class="section-title">时间信息</h2>
            <div class="timestamp-details">
              <div class="timestamp-item" v-if="productData.spu.creationDate">
                <span class="icon">📅</span>
                <span>创建日期: {{ formatDate(productData.spu.creationDate) }}</span>
              </div>
              <div class="timestamp-item" v-if="productData.spu.updateDate">
                <span class="icon">🔄</span>
                <span>更新日期: {{ formatDate(productData.spu.updateDate) }}</span>
              </div>
              <div class="timestamp-item" v-if="productData.spu.releaseDate">
                <span class="icon">🚀</span>
                <span>发布日期: {{ formatDate(productData.spu.releaseDate) }}</span>
              </div>
              <div class="timestamp-item" v-if="currentSku.manufactureDate">
                <span class="icon">🏭</span>
                <span>生产日期: {{ formatDate(currentSku.manufactureDate) }}</span>
              </div>
              <div class="timestamp-item" v-if="currentSku.expirationDate">
                <span class="icon">⏰</span>
                <span>保质期: {{ formatDate(currentSku.expirationDate) }}</span>
              </div>
              <div class="timestamp-item" v-if="currentSku.shelfLifeDays">
                <span class="icon">📆</span>
                <span>保质天数: {{ currentSku.shelfLifeDays }}天</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 响应式数据
const loading = ref(true)
const error = ref(null)
const productData = ref(null)
const currentImageIndex = ref(0)
const activeTab = ref(0)
const currentSkuIndex = ref(0)

// 标签页配置
const tabs = [
  { title: '能量故事' },
  { title: '工艺与材质' },
  { title: '专属推荐' }
]

// 计算属性
const skuList = computed(() => {
  return productData.value?.sku?.data || productData.value?.sku || []
})

const currentSku = computed(() => {
  return skuList.value[currentSkuIndex.value] || {}
})

// 图片列表计算 - 包含所有SKU+SPU图片
const imageList = computed(() => {
  if (!productData.value) return []

  const allImages = []
  const spu = productData.value.spu

  // 1. 添加SPU的所有图片
  if (spu) {
    const spuImages = [
      spu.mainImageUrl,
      spu.conceptImageUrl,
      spu.designImageUrl,
      spu.usageImageUrl,
      spu.prototypeImageUrl,
      spu.technicalImageUrl,
      spu.image1Url,
      spu.image2Url,
      spu.image3Url,
      spu.image4Url,
      spu.image5Url,
      spu.detailImageUrl,
      spu.packagingImageUrl
    ].filter(url => url && url.trim() !== '')

    spuImages.forEach(url => {
      if (!allImages.some(img => img.src === url)) {
        allImages.push({
          src: url,
          alt: `${spu.productNameZh} - SPU图片`,
          type: 'spu'
        })
      }
    })
  }

  // 2. 添加所有SKU的图片（去重）
  if (skuList.value.length > 0) {
    skuList.value.forEach(sku => {
      const skuImages = [
        sku.mainImageUrl,
        sku.image1Url,
        sku.image2Url,
        sku.image3Url,
        sku.image4Url,
        sku.image5Url,
        sku.detailImageUrl,
        sku.certificateImageUrl,
        sku.packagingImageUrl,
        sku.angleImageUrl
      ].filter(url => url && url.trim() !== '')

      skuImages.forEach(url => {
        // 去重逻辑
        if (!allImages.some(img => img.src === url)) {
          allImages.push({
            src: url,
            alt: `${sku.skuNameZh || spu?.productNameZh} - SKU图片`,
            type: 'sku',
            skuId: sku.id
          })
        }
      })
    })
  }

  // 3. 如果没有图片，使用默认图片
  return allImages.length > 0 ? allImages : [{
    src: '/images/default-product.jpg',
    alt: '默认商品图片',
    type: 'default'
  }]
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
    'earth': '土',
    'water': '水',
    'fire': '火',
    'metal': '金',
    'wood': '木'
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

  try {
    const productId = route.params.id
    if (!productId) {
      throw new Error('商品ID不存在')
    }

    // 并行请求SPU和SKU数据
    const [spuResponse, skuResponse] = await Promise.all([
      fetch(`/api/product-spu/getByid/${productId}`),
      fetch(`/api/product-sku/spu/${productId}`)
    ])

    if (!spuResponse.ok) {
      throw new Error(`SPU数据获取失败: ${spuResponse.status}`)
    }
    if (!skuResponse.ok) {
      throw new Error(`SKU数据获取失败: ${skuResponse.status}`)
    }

    const spuResult = await spuResponse.json()
    const skuResult = await skuResponse.json()

    // 处理API响应数据结构
    const spuData = spuResult.data || spuResult
    const skuData = skuResult.data || skuResult

    if (!spuData) {
      throw new Error('SPU数据为空')
    }

    productData.value = {
      spu: spuData,
      sku: Array.isArray(skuData) ? { data: skuData } : skuData
    }

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

const selectSku = (sku) => {
  const index = skuList.value.findIndex(s => s.id === sku.id)
  if (index !== -1) {
    currentSkuIndex.value = index
    // 切换SKU时重置图片索引到第一张
    currentImageIndex.value = 0
  }
}

const getElementName = (element) => {
  const elementMap = {
    'earth': '土元素',
    'water': '水元素',
    'fire': '火元素',
    'metal': '金元素',
    'wood': '木元素'
  }
  return elementMap[element] || element
}

const getGenderText = (genderCode) => {
  const genderMap = {
    1: '男性',
    2: '女性',
    3: '中性',
    4: '通用'
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

const addToCart = () => {
  if (!currentSku.value.id) {
    alert('请选择商品规格')
    return
  }
  console.log('加入购物车', currentSku.value)
  // 实际业务逻辑：调用购物车API
  // cartApi.addToCart({
  //   skuId: currentSku.value.id,
  //   quantity: 1,
  //   price: currentPrice.value
  // })
}

const addToWishlist = () => {
  if (!currentSku.value.id) {
    alert('请选择商品规格')
    return
  }
  console.log('加入收藏', currentSku.value)
  // 实际业务逻辑：调用收藏API
  // wishlistApi.addToWishlist(currentSku.value.id)
}

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
  console.log('当前商品数据:', productData.value)
  console.log('当前SKU:', currentSku.value)
  console.log('图片列表:', imageList.value)
  console.log('SKU列表:', skuList.value)
  console.log('质量数据:', qualityData.value)
}

// 错误处理
const handleApiError = (error) => {
  console.error('API错误:', error)
  error.value = '数据加载失败，请稍后重试'
  loading.value = false
}

// 图片错误处理
const handleImageError = (event) => {
  event.target.src = '/images/default-product.jpg'
  event.target.alt = '图片加载失败'
}

// 导出方法供模板使用
defineExpose({
  debugProductData,
  handleImageError
})
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

/* 加载状态 */
.loading-state {
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 18px;
  color: #e0e0e0;
}

/* 错误状态 */
.error-state {
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
  border-left: 3px solid #ffd700;
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

.sku-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sku-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.sku-option:hover {
  border-color: #ffd700;
  transform: translateX(5px);
}

.sku-option.active {
  border-color: #ffd700;
  background: rgba(255, 215, 0, 0.05);
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.1);
}

.sku-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sku-name {
  font-weight: 500;
  color: #fff;
}

.sku-code {
  font-size: 12px;
  color: #b0b0b0;
}

.sku-price {
  font-weight: 600;
  color: #ffd700;
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

.badge-icon {
  font-size: 18px;
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
  background: #ffd700;
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

.tab-header.active {
  color: #ffd700;
  border-bottom-color: #ffd700;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px 8px 0 0;
}

.tab-header:hover:not(.active) {
  color: #ffd700;
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
  border-left: 4px solid #ffd700;
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
