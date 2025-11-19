<template>
  <header class="header">
    <!-- 品牌LOGO -->
    <div class="brand" @click="goToHome">
      <span class="brand-text">TAIHE</span>
      <span class="brand-subtitle">高级珠宝</span>
    </div>

    <!-- 主导航栏容器 -->
    <div class="nav-container" ref="navContainerRef">
      <nav class="main-nav">
        <div
          v-for="navItem in navigationItems"
          :key="navItem.id"
          :class="['nav-item', {
            active: activeNav === navItem.id,
            'has-mega-menu': navItem.megaMenu,
            'loading': getMenuData(navItem.id).loading
          }]"
          @mouseenter="handleNavHover(navItem)"
          @mouseleave="handleNavLeave"
          @click="navigateToNav(navItem)"
        >
          <span class="nav-label">
            {{ navLabel(navItem) }}
            <span v-if="getMenuData(navItem.id).loading" class="nav-loading-dot">●</span>
          </span>

          <!-- 巨型菜单 -->
          <transition name="mega-menu">
            <div
              v-if="navItem.megaMenu && activeMegaMenu === navItem.id && showMegaMenu"
              class="mega-menu"
              @mouseenter="handleMegaMenuHover"
              @mouseleave="handleMegaMenuLeave"
            >
              <div class="mega-menu-content">
                <!-- 加载状态 -->
                <div v-if="getMenuData(navItem.id).loading" class="menu-loading">
                  <div class="loading-spinner"></div>
                  <span class="loading-text">加载中...</span>
                </div>

                <!-- 内容区域 -->
                <div v-else-if="!getMenuData(navItem.id).error" class="menu-content">
                  <!-- 左侧导航区 -->
                  <div class="mega-menu-left">
                    <!-- 品类浏览区域 -->
                    <div class="section">
                      <h4 class="section-title">按品类浏览</h4>
                      <div class="category-list">
                        <div
                          v-for="category in getMenuData(navItem.id).categories"
                          :key="category.id"
                          class="category-item"
                          @click="navigateToCategory(navItem.id, category)"
                        >
                          <span class="item-prefix">•</span>
                          <!--点击标签 打开spu列表页  需要传递intentId 和 category.id-->
                          <span class="item-name">{{ category.tagName }}</span>
                          <span class="item-count">({{ category.productCount }})</span>
                        </div>
                        <div v-if="getMenuData(navItem.id).categories.length === 0" class="empty-state">
                          <span class="empty-icon">📦</span>
                          <span class="empty-text">暂无品类数据</span>
                        </div>
                      </div>
                    </div>

                    <!-- 能量筛选区域 -->
                    <div class="section">
                      <h4 class="section-title">快速筛选能量</h4>
                      <div class="energy-list">
                        <div
                          v-for="energy in getMenuData(navItem.id).energies"
                          :key="energy.id"
                          class="energy-item"
                          :style="{ color: energy.colorCode || getEnergyColor(energy.tagName) }"
                          @click="navigateToEnergy(navItem.id, energy)"
                        >
                          <span class="energy-icon">{{ getEnergyIcon(energy.tagName) }}</span>
                          <span class="item-prefix">•</span>
                          <!--点击标签 打开spu列表页  需要传递intentId 和 category.id-->
                          <span class="item-name">{{ energy.tagName }}</span>
                          <span class="item-count">({{ energy.productCount }})</span>
                        </div>
                        <div v-if="getMenuData(navItem.id).energies.length === 0" class="empty-state">
                          <span class="empty-icon">⚡</span>
                          <span class="empty-text">暂无能量数据</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 右侧内容区 -->
                  <div class="mega-menu-right">
                    <!-- 主打商品 -->
                    <div class="featured-section">
                      <div class="section-header">
                        <span class="featured-icon">🎯</span>
                        <h4 class="section-title">本系列主打商品</h4>
                      </div>

                      <div class="featured-products">
                        <div
                          v-for="product in getMenuData(navItem.id).products"
                          :key="product.id"
                          class="product-card"
                          @click="navigateToProduct(product)"
                        >
                          <div class="product-image">
                            <div class="image-placeholder">
                              <span class="placeholder-icon">💎</span>
                            </div>
                            <!-- 商品标签 -->
                            <div class="product-badges">
                              <span v-if="product.isBestSeller" class="badge best-seller">热销</span>
                              <span v-if="product.isFeatured" class="badge featured">精选</span>
                            </div>
                          </div>

                          <div class="product-info">
                            <h5 class="product-name">{{ product.productName }}</h5>
                            <div class="product-price">
                              <span class="retail-price">¥{{ formatPrice(product.price) }}</span>
                              <span v-if="product.salePrice" class="sale-price">¥{{ formatPrice(product.salePrice) }}</span>
                            </div>
                            <div class="product-tags">
                              <span v-if="product.energyType" class="tag energy-tag">{{ product.energyType }}</span>
                              <span v-if="product.mainCategory" class="tag category-tag">{{ product.mainCategory }}</span>
                            </div>
                          </div>
                        </div>
                        <div v-if="getMenuData(navItem.id).products.length === 0" class="empty-state">
                          <span class="empty-icon">🛍️</span>
                          <span class="empty-text">暂无推荐商品</span>
                        </div>
                      </div>
                    </div>

                    <!-- 品牌故事 -->
                    <div v-if="getMenuData(navItem.id).brandStory" class="brand-story">
                      <p class="story-text">{{ getMenuData(navItem.id).brandStory }}</p>
                    </div>

                    <!-- 查看全部按钮 -->
                    <div class="view-all-section">
                      <button class="view-all-btn" @click="viewAllProducts(navItem.id)">
                        <span class="btn-text">查看全部{{ navItem.label }}商品</span>
                        <span class="btn-icon">→</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- 错误状态 -->
                <div v-else-if="getMenuData(navItem.id).error" class="menu-error">
                  <div class="error-content">
                    <span class="error-icon">⚠️</span>
                    <span class="error-text">数据加载失败</span>
                    <button class="retry-btn" @click="retryLoadMenuData(navItem.id)">
                      <span class="retry-icon">🔄</span>
                      重试
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </nav>

      <!-- 滚动提示 -->
      <div v-if="showScrollHint" class="scroll-hint">
        <span class="hint-icon">←→</span>
      </div>
    </div>

    <!-- 右侧功能图标 -->
    <div class="header-actions">
      <div class="action-item" @click="search" title="搜索">
        <span class="action-icon">🔍</span>
      </div>
      <div class="action-item" @click="navigateTo('/UserLogin')" title="用户">
        <span class="action-icon">👤</span>
      </div>
      <div class="action-item cart-item" @click="navigateTo('/CartPage')" title="购物车">
        <span class="action-icon">🛒</span>
        <span v-if="cartCount > 0" class="cart-badge">{{ cartCount > 99 ? '99+' : cartCount }}</span>
      </div>
      <div class="action-item" @click="share" title="分享">
        <span class="action-icon">↗️</span>
      </div>
      <div class="action-item" @click="navigateTo('/wishlist')" title="收藏">
        <span class="action-icon">❤️</span>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'GlobalHeader',
  setup() {
    const router = useRouter()

    // 响应式数据
    const emotionalIntents = ref([])
    const cartCount = ref(0)
    const navigationItems = ref([])
    const activeNav = ref(null)
    const activeMegaMenu = ref(null)
    const showMegaMenu = ref(false)
    const menuDataCache = ref(new Map())
    const isHoveringMegaMenu = ref(false)
    const hoverTimer = ref(null)
    const showScrollHint = ref(false)
    const navContainerRef = ref(null)

    // 配置常量 - 修正图标重复问题
    const ENERGY_CONFIG = {
      '木能量': { icon: '🌳', color: '#4CAF50' },
      '水能量': { icon: '💧', color: '#2196F3' },
      '火能量': { icon: '🔥', color: '#F44336' },
      '土能量': { icon: '⛰️', color: '#795548' },
      '金能量': { icon: '⚱️', color: '#FFD700' },
      '木': { icon: '🌳', color: '#4CAF50' },
      '水': { icon: '💧', color: '#2196F3' },
      '火': { icon: '🔥', color: '#F44336' },
      '土': { icon: '⛰️', color: '#795548' },
      '金': { icon: '⚱️', color: '#FFD700' },
      '默认': { icon: '💎', color: '#FF8C00' }
    }

    const DEFAULT_MENU_DATA = {
      loading: false,
      error: null,
      categories: [],
      energies: [],
      products: [],
      brandStory: ''
    }

    // 工具函数
    const getEnergyIcon = (energyName) => {
      if (!energyName) return ENERGY_CONFIG['默认'].icon
      return ENERGY_CONFIG[energyName]?.icon || ENERGY_CONFIG['默认'].icon
    }

    const getEnergyColor = (energyName) => {
      if (!energyName) return ENERGY_CONFIG['默认'].color
      return ENERGY_CONFIG[energyName]?.color || ENERGY_CONFIG['默认'].color
    }

    const formatPrice = (price) => {
      if (!price) return '0.00'
      const num = parseFloat(price)
      return isNaN(num) ? '0.00' : num.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }

    const navLabel = (navItem) => {
      const label = navItem.label || ''
      // 如果标签过长，进行截断处理
      if (label.length > 10) {
        return label.substring(0, 8) + '...'
      }
      return label
    }

    // 数据管理
    const getMenuData = (intentId) => {
      if (!menuDataCache.value.has(intentId)) {
        menuDataCache.value.set(intentId, { ...DEFAULT_MENU_DATA })
      }
      return menuDataCache.value.get(intentId)
    }

    // 检查是否需要显示滚动提示
    const checkScrollNeeded = () => {
      if (navContainerRef.value) {
        const nav = navContainerRef.value.querySelector('.main-nav')
        if (nav) {
          showScrollHint.value = nav.scrollWidth > navContainerRef.value.offsetWidth
        }
      }
    }

    // 事件处理
    const handleNavHover = async (navItem) => {
      clearTimeout(hoverTimer.value)
      activeNav.value = navItem.id

      if (navItem.megaMenu) {
        activeMegaMenu.value = navItem.id
        showMegaMenu.value = true

        const menuData = getMenuData(navItem.id)
        if (!menuData.loading && !menuData.error &&
          menuData.categories.length === 0 &&
          menuData.energies.length === 0 &&
          menuData.products.length === 0) {
          await loadMegaMenuData(navItem.id)
        }
      }
    }

    const handleNavLeave = () => {
      hoverTimer.value = setTimeout(() => {
        if (!isHoveringMegaMenu.value) {
          resetNavigation()
        }
      }, 150)
    }

    const handleMegaMenuHover = () => {
      clearTimeout(hoverTimer.value)
      isHoveringMegaMenu.value = true
    }

    const handleMegaMenuLeave = () => {
      isHoveringMegaMenu.value = false
      hoverTimer.value = setTimeout(resetNavigation, 200)
    }

    const resetNavigation = () => {
      showMegaMenu.value = false
      activeMegaMenu.value = null
      activeNav.value = null
    }

    // 数据加载
    const loadMegaMenuData = async (intentId) => {
      const menuData = getMenuData(intentId)
      menuData.loading = true
      menuData.error = null

      try {
        const [categories, energies, products] = await Promise.allSettled([
          fetchCategoriesByIntent(intentId),
          fetchEnergiesByIntent(intentId),
          fetchFeaturedProducts(intentId, 6)
        ])

        menuData.categories = categories.status === 'fulfilled' ? (categories.value || []) : []
        menuData.energies = energies.status === 'fulfilled' ? (energies.value || []) : []
        menuData.products = products.status === 'fulfilled' ? (products.value || []) : []

        // 提取品牌故事
        if (menuData.products.length > 0) {
          const product = menuData.products[0]
          menuData.brandStory = product.brandStory || product.description || ''
        }

        if (categories.status === 'rejected' && energies.status === 'rejected' && products.status === 'rejected') {
          menuData.error = '数据加载失败'
        }

      } catch (error) {
        console.error('加载菜单数据失败:', error)
        menuData.error = error.message
      } finally {
        menuData.loading = false
      }
    }

    // API调用  根据情感意愿id 对所属商品spu的标签统计
    const fetchCategoriesByIntent = async (intentId) => {
      try {
        console.log("🔍 -----------开始获取标签数据------------")
        console.log("🔍 开始获取品类数据，intentId:", intentId)
        const response = await fetch(`/api/product-category-tags/JewelryTagByIntentId/${intentId}`)
        console.log("📡 JewelryTagByIntentId API响应状态:", response.status, response.ok)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const result = await response.json()
        console.log("📊 JewelryTagByIntentId 原始API数据:", JSON.stringify(result, null, 2))
        // 检查数据结构
        if (result.code === 200) {
          console.log("✅ JewelryTagByIntentId 数据条数:", result.data?.length || 0)
          console.log("📋 JewelryTagByIntentId 数据内容:", result.data)
        }
        return normalizeApiResponse(result)
      } catch (error) {
        console.error("❌ JewelryTagByIntentId 获取品类数据失败:", error)
        return []
      }
    }
    // API调用  根据情感意愿id 对所属商品spu的能量标签统计
    const fetchEnergiesByIntent = async (intentId) => {
      try {
        console.log("🔍 -----------开始获取能量数据------------")
        console.log("🔍 开始获取能量数据，intentId:", intentId)
        const response = await fetch(`/api/product-category-tags/JEnergyInfoByIntentId/${intentId}`)
        console.log("📡 JEnergyInfoByIntentId API响应状态:", response.status, response.ok)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const result = await response.json()
        console.log("📊 JEnergyInfoByIntentId 原始API数据:", JSON.stringify(result, null, 2))
        // 检查数据结构
        if (result.code === 200) {
          console.log("✅ JEnergyInfoByIntentId 数据条数:", result.data?.length || 0)
          console.log("📋 JEnergyInfoByIntentId 数据内容:", result.data)
        }
        return normalizeApiResponse(result)
      }catch (error) {
        console.error("❌ JewelryTagByIntentId 获取品类数据失败:", error)
        return []
      }
    }
    // 根据情感意图ID查询推荐商品列表（包含主品类信息）
    const fetchFeaturedProducts = async (intentId, limit) => {
      try {
        const url = `/api/product-spu/getRecommendProducts/${intentId}/${limit}`
        console.log("🌐 请求推荐商品:", url)

        const response = await fetch(url)
        console.log("📡 响应状态:", response.status, response.ok)

        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const result = await response.json()
        console.log("📊 API响应数据:", {
          code: result.code,
          message: result.message,
          dataCount: result.data?.length || 0,
          sampleData: result.data ? result.data.slice(0, 2) : '无数据'
        })

        const products = normalizeProductResponse(result)
        console.log("🔄 标准化后的商品:", products.map(p => ({
          id: p.id,
          name: p.productName,
          price: p.price,
          category: p.mainCategory,
          image: p.imageUrl ? '有图片' : '无图片'
        })))

        return products.slice(0, limit)

      } catch (error) {
        console.error('❌ 获取推荐商品失败:', error)
        return []
      }
    }

    const normalizeApiResponse = (result) => {
      if (result.code === 200 && Array.isArray(result.data)) {
        return result.data.map(item => ({
          id: item.id,                    // 保留原始ID
          tagId: item.id,                 // 同时作为tagId保留
          tagName: item.tagNameEn,       // 使用英文名称
          name: item.tagNameEn,           // 兼容name字段
          productCount: item.productCount || 0,  // 使用API返回的数量
          count: item.productCount || 0,          // 兼容count字段
          // 保留其他可能用到的字段
          tagNameZh: item.tagNameZh,      // 保留中文名称
          colorCode: item.colorCode,      // 保留颜色代码
          tagKey: item.tagKey,            // 保留标签键: "wuxing"
          shortDescEn: item.shortDescEn   // 保留描述
        }))
      }
      return []
    }

    // 专门针对推荐商品API的标准化函数
    const normalizeProductResponse = (result) => {
      if (result.code === 200 && Array.isArray(result.data)) {
        return result.data.map(product => ({
          // 主键字段
          id: product.spuId,                    // SPU001
          spuId: product.spuId,                 // SPU001
          skuId: product.skuId,                 // SKU002

          // 商品名称（优先显示英文名称）
          productName: product.productNameEn || product.productNameZh,
          name: product.productNameEn || product.productNameZh,
          productNameZh: product.productNameZh,  // 保留中文名称
          productNameEn: product.productNameEn,  // 保留英文名称

          // 价格信息
          price: product.retailPrice,            // 1800
          retailPrice: product.retailPrice,       // 1800
          salePrice: product.salePrice,          // null

          // 图片信息
          imageUrl: product.mainImageUrl,        // /images/gold/sku2_main.jpg
          mainImageUrl: product.mainImageUrl,

          // 商品属性
          isFeatured: product.isFeatured !== false, // true
          isBestSeller: product.isBestSeller !== false, // true
          mainCategory: product.mainCategory,     // "项链"

          // 其他可能需要的字段
          category: product.mainCategory,
          tags: product.isBestSeller ? ['热销'] : [],
          energyType: extractEnergyType(product.productNameEn || product.productNameZh)
        }))
      }
      return []
    }

// 从商品名称中提取能量类型
    const extractEnergyType = (productName) => {
      const energyMap = {
        'golden': '金能量',
        'earth': '土能量',
        'wood': '木能量',
        'fire': '火能量',
        'water': '水能量',
        '金': '金能量',
        '土': '土能量',
        '木': '木能量',
        '火': '火能量',
        '水': '水能量'
      }

      const lowerName = productName.toLowerCase()
      for (const [key, value] of Object.entries(energyMap)) {
        if (lowerName.includes(key.toLowerCase())) {
          return value
        }
      }

      return '五行能量'
    }

    // 导航功能
    const navigateToCategory = (intentId, category) => {
      const tagId = category.id || category.tagId
      router.push({
        path: '/ProductList',
        query: { intentId, tagId, source: 'category' }
      })
    }

    const navigateToEnergy = (intentId, energy) => {
      const tagId = energy.id || energy.tagId
      router.push({
        path: '/ProductList',
        query: { intentId, tagId, source: 'energy' }
      })
    }

    const navigateToProduct = (product) => {
      console.log("📍 导航到商品详情:", {
        spuId: product.spuId,
        skuId: product.skuId,
        productName: product.productName,
        price: product.price,
        energyType: product.energyType,
        category: product.mainCategory
      })

      router.push({
        path: '/ProductDetail',
        query: {
          spuId: product.spuId,
          skuId: product.skuId,
          from: 'mega-menu',
          intentId: activeNav.value,
          productName: product.productName,
          category: product.mainCategory
        }
      })
    }

    const viewAllProducts = (intentId) => {
      router.push(`/selectSpuByIntentId/${intentId}`)
    }

    const navigateToNav = (navItem) => {
      if (navItem.megaMenu) {
        window.open(`/api/emotional-intent/getByid/${navItem.id}`, '_blank')
      } else {
        router.push(navItem.path)
      }
    }

    const goToHome = () => router.push('/')
    const navigateTo = (path) => router.push(path)
    const search = () => console.log('打开搜索')
    const share = () => console.log('分享功能')

    const retryLoadMenuData = async (intentId) => {
      await loadMegaMenuData(intentId)
    }

    // 初始化
    const fetchEmotionalIntents = async () => {
      try {
        //主导航
        const response = await fetch('/api/emotional-intent/list')
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const result = await response.json()
        if (result?.data) {
          emotionalIntents.value = result.data
            .filter(item => item.showInNavigation === 1)
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))

          navigationItems.value = emotionalIntents.value.map(item => ({
            id:  item.id,
            label: item.intentNameEn,
            intentId:item.id,
            path: '/ProductList',
            megaMenu: true
          }))

          // 数据加载后检查滚动
          nextTick(() => {
            checkScrollNeeded()
          })
        }
      } catch (error) {
        console.error('初始化导航数据失败:', error)
      }
    }

    onMounted(() => {
      fetchEmotionalIntents()
      // 监听窗口大小变化
      window.addEventListener('resize', checkScrollNeeded)
    })

    onUnmounted(() => {
      if (hoverTimer.value) {
        clearTimeout(hoverTimer.value)
      }
      window.removeEventListener('resize', checkScrollNeeded)
    })

    return {
      // 响应式数据
      emotionalIntents,
      cartCount,
      navigationItems,
      activeNav,
      activeMegaMenu,
      showMegaMenu,
      showScrollHint,
      navContainerRef,

      // 方法
      getMenuData,
      getEnergyIcon,
      getEnergyColor,
      formatPrice,
      navLabel,
      handleNavHover,
      handleNavLeave,
      handleMegaMenuHover,
      handleMegaMenuLeave,
      navigateToCategory,
      navigateToEnergy,
      navigateToProduct,
      viewAllProducts,
      navigateToNav,
      goToHome,
      navigateTo,
      search,
      share,
      retryLoadMenuData
    }
    // 图片错误处理
    const handleImageError = (event) => {
      const img = event.target
      img.style.display = 'none'
      img.parentNode.querySelector('.image-placeholder').style.display = 'flex'
    }
  }
}
</script>
<style scoped>
@import url('@/styles/components/header.css');
</style>

