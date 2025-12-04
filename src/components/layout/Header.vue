<template>
  <header class="header">
    <!-- 品牌LOGO -->
    <div class="brand" @click="goToHome">
      <span class="brand-text">TAIHE</span>
      <span class="brand-subtitle">High Jewelry</span>
    </div>

    <!-- 主导航栏容器 -->
    <div class="nav-container" ref="navContainerRef">
      <nav class="main-nav">
        <!--zhu 导航-->
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
                <div v-if="getMenuData(navItem.id).loading" class="menu-loading">
                  <div class="loading-spinner"></div>
                  <span class="loading-text">加载中...</span>
                </div>

                <div v-else-if="getMenuData(navItem.id).error" class="menu-error">
                  <div class="error-content">
                    <span class="error-icon">⚠️</span>
                    <span class="error-text">数据加载失败</span>
                    <button class="retry-btn" @click.stop="retryLoadMenuData(navItem.id)">
                      <span class="retry-icon">🔄</span>
                      重试
                    </button>
                  </div>
                </div>

                <div v-else class="menu-content">
                  <div class="mega-menu-left">
                    <!--标签 -->
                    <div class="section">
                      <h4 class="section-title">按品类浏览</h4>
                      <div class="category-list">
                        <div
                          v-for="category in getMenuData(navItem.id).categories"
                          :key="category.id"
                          class="category-item"
                          @click.stop="navigateToCategory(navItem.id, category)"
                        >
                          <span class="item-prefix">•</span>
                          <span class="item-name">{{ category.tagName }}</span>
                          <span class="item-count">({{ category.productCount }})</span>
                        </div>
                        <div v-if="getMenuData(navItem.id).categories.length === 0" class="empty-state">
                          <span class="empty-icon">📦</span>
                          <span class="empty-text">暂无品类数据</span>
                        </div>
                      </div>
                    </div>
                    <!--能量 -->
                    <div class="section">
                      <h4 class="section-title">快速筛选能量</h4>
                      <div class="energy-list">
                        <div
                          v-for="energy in getMenuData(navItem.id).energies"
                          :key="energy.id"
                          class="energy-item"
                          :style="{ color: energy.colorCode || getEnergyColor(energy.tagName) }"
                          @click.stop="navigateToEnergy(navItem.id, energy)"
                        >
                          <span class="energy-icon">{{ getEnergyIcon(energy.tagName) }}</span>
                          <span class="item-prefix">•</span>
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

                  <div class="mega-menu-right">
                    <!--推荐商品 -->
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
                          @click.stop="navigateToProductDetail(product)"
                        >
                          <div class="product-image">
                            <div class="image-placeholder">
                              <span class="placeholder-icon">💎</span>
                            </div>
                            <div class="product-badges">
                              <span v-if="product.isBestSeller" class="badge best-seller">热销</span>
                              <span v-if="product.isFeatured" class="badge featured">精选</span>
                            </div>
                          </div>

                          <div class="product-info">
                            <h5 class="product-name">{{ product.productName }}</h5>
                            <div class="product-price">
                              <span class="retail-price">${{ formatPrice(product.salePrice) }}</span>
                              <span v-if="product.price" class="sale-price">${{
                                  formatPrice(product.price)
                                }}</span>
                            </div>
                            <div class="product-tags">
                              <span v-if="product.energyType" class="tag energy-tag">{{ product.energyType }}</span>
                              <span v-if="product.mainCategory" class="tag category-tag">{{
                                  product.mainCategory
                                }}</span>
                            </div>
                          </div>
                        </div>
                        <div v-if="getMenuData(navItem.id).products.length === 0" class="empty-state">
                          <span class="empty-icon">🛍</span>
                          <span class="empty-text">暂无推荐商品</span>
                        </div>
                      </div>
                    </div>

                    <div v-if="getMenuData(navItem.id).brandStory" class="brand-story">
                      <p class="story-text">{{ getMenuData(navItem.id).brandStory }}</p>
                    </div>

                    <div class="view-all-section">
                      <button class="view-all-btn" @click.stop="viewAllProducts(navItem.id)">
                        <span class="btn-text">查看全部{{ navItem.label }}商品</span>
                        <span class="btn-icon">→</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </transition>
        </div>
      </nav>

      <div v-if="showScrollHint" class="scroll-hint">
        <span class="hint-icon">←→</span>
      </div>
    </div>

    <div class="header-actions">
<!--   <div class="action-item" @click="search" title="搜索">
        <span class="action-icon">🔍</span>
      </div>-->

      <!-- 购物车 -->
      <div class="action-item cart-item" @click.stop="goToCart()" title="购物车">
        <span class="action-icon">🛒</span>
        <span v-if="cartCount > 0" class="cart-badge">{{ cartCount > 99 ? '99+' : cartCount }}</span>
      </div>

      <!-- 订单 -->
      <div class="action-item" @click="goToOrders()" title="订单信息">
        <span class="action-icon">📋</span>
      </div>
    </div>


    <!-- 修复：独立的用户操作区域 -->
    <div class="user-actions">
      <!-- 已登录状态 -->
      <div v-if="authStore?.isLoggedIn" class="logged-in-actions">
        <!-- 用户中心 -->
        <div class="action-item" @click="goToUserInfor()" title="用户中心">
          <span class="action-icon">⚙️</span>
        </div>
        <!-- 退出按钮 -->
        <div class="action-item logout-btn" @click="handleLogout()" title="退出登录">
          <span class="action-icon">🚪</span>
        </div>
      </div>
      <!-- 未登录状态 -->
      <div v-else class="action-item" @click="goToUser()" title="登录/注册">
        <span class="action-icon">👤</span>
      </div>
    </div>
  </header>
</template>

<script>
import {ref, onMounted, onUnmounted, nextTick} from 'vue'
import {useRouter} from 'vue-router'
import {useAuthStore} from "@/store/auth.js";
export default {
  name: 'GlobalHeader',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    // console.log('🔍 [GlobalHeader] 当前 authStore 对象:', authStore);
    // console.log('🔍 [GlobalHeader] 当前登录状态:', authStore.isLoggedIn);
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
    // console.log('🔍 当前 authStore 对象:', authStore);
    // console.log('🔍 当前登录状态:', authStore?.isLoggedIn);
    // 配置常量 - 修正图标重复问题
    const ENERGY_CONFIG = {
      '木能量': {icon: '🌳', color: '#4CAF50'},
      '水能量': {icon: '💧', color: '#2196F3'},
      '火能量': {icon: '🔥', color: '#F44336'},
      '土能量': {icon: '⛰️', color: '#795548'},
      '金能量': {icon: '⚱️', color: '#FFD700'},
      '木': {icon: '🌳', color: '#4CAF50'},
      '水': {icon: '💧', color: '#2196F3'},
      '火': {icon: '🔥', color: '#F44336'},
      '土': {icon: '⛰️', color: '#795548'},
      '金': {icon: '⚱️', color: '#FFD700'},
      '默认': {icon: '💎', color: '#FF8C00'}
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
        menuDataCache.value.set(intentId, {...DEFAULT_MENU_DATA})
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
          fetchFeaturedProducts(intentId, 5)
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
        // console.log("🔍 -----------开始获取标签数据------------")
        // console.log("🔍 开始获取品类数据，intentId:", intentId)
        const response = await fetch(`/api/product-category-tags/JewelryTagByIntentId/${intentId}`)
        //  console.log("📡 JewelryTagByIntentId API响应状态:", response.status, response.ok)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const result = await response.json()
        //  console.log("📊 JewelryTagByIntentId 原始API数据:", JSON.stringify(result, null, 2))
        // 检查数据结构
        if (result.code === 200) {
          // console.log("✅ JewelryTagByIntentId 数据条数:", result.data?.length || 0)
          // console.log("📋 JewelryTagByIntentId 数据内容:", result.data)
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
        // console.log("🔍 -----------开始获取能量数据------------")
        // console.log("🔍 开始获取能量数据，intentId:", intentId)
        const response = await fetch(`/api/product-category-tags/JEnergyInfoByIntentId/${intentId}`)
        //    console.log("📡 JEnergyInfoByIntentId API响应状态:", response.status, response.ok)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const result = await response.json()
        //   console.log("📊 JEnergyInfoByIntentId 原始API数据:", JSON.stringify(result, null, 2))
        // 检查数据结构
        if (result.code === 200) {
          // console.log("✅ JEnergyInfoByIntentId 数据条数:", result.data?.length || 0)
          // console.log("📋 JEnergyInfoByIntentId 数据内容:", result.data)
        }
        return normalizeApiResponse(result)
      } catch (error) {
        console.error("❌ JewelryTagByIntentId 获取品类数据失败:", error)
        return []
      }
    }
    // 根据情感意图ID查询推荐商品列表（包含主品类信息）
    const fetchFeaturedProducts = async (intentId, limit) => {
      try {
        const url = `/api/product-spu/getRecommendProducts/${intentId}/${limit}`
        //const url = `/api/getRecommendProducts/${intentId}?limit=${limit}`
        // console.log("🌐 请求推荐商品:", url)
        const response = await fetch(url)
        //   console.log("📡 响应状态:", response.status, response.ok)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const result = await response.json()
        // console.log("📊 API响应数据:", {
        //   code: result.code,
        //   message: result.message,
        //   dataCount: result.data?.length || 0,
        //   sampleData: result.data ? result.data.slice(0, 2) : '无数据'
        // })
        const products = normalizeProductResponse(result)
        // console.log("🔄 标准化后的商品:", products.map(p => ({
        //   id: p.id,
        //   name: p.productName,
        //   price: p.price,
        //   category: p.mainCategory,
        //   image: p.imageUrl ? '有图片' : '无图片'
        // })))
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

    // 巨型导航品类标签导航下钻功能
    const navigateToCategory = (intentId, category) => {
      const tagId = category.id
      // console.log('🔍 品类标签数据下钻...')
      // console.log('📦 情感意图标识:', intentId)
      // console.log('📦 品类标签:', tagId)
      const url = `/product-spu/getProductsByIntentAndTag/${intentId}/${tagId}`
      // console.log('🔗 目标URL:', url)
      // // 添加导航前后的详细日志
      // console.log('📍 当前路由:', router.currentRoute.value.fullPath)
      router.push(url).then(() => {
        // console.log('✅ 导航成功完成')
        // console.log('📍 新路由:', router.currentRoute.value.fullPath)
      }).catch(error => {
        console.error('❌ 导航失败:', error)
      })
    }
    // 巨型菜单能量标签数据下钻
    const navigateToEnergy = (intentId, energy) => {
      const elementTagId = energy.id
      // console.log('🔍 能量标签数据下钻...')
      // console.log('📦 情感意图标识:', intentId)
      // console.log('📦 能量标签:', elementTagId)
      const url = `/product-spu/getProductsByIntentAndElementTag/${intentId}/${elementTagId}`
     // console.log('🔗 目标URL:', url)
      // 添加导航前后的详细日志
    //  console.log('📍 当前路由:', router.currentRoute.value.fullPath)
      router.push(url).then(() => {
        // console.log('✅ 导航成功完成')
        // console.log('📍 新路由:', router.currentRoute.value.fullPath)
      }).catch(error => {
        console.error('❌ 导航失败:', error)
      })
    }

    //根据商品spu主键打开详情页
    const navigateToProductDetail = (product) => {
      // console.log('🔍 开始导航到商品详情...')
      // console.log('📦 商品对象:', product)
      const url = `/product-spu/getByid/${product.id}`
     // console.log('🔗 目标URL:', url)
      // 添加导航前后的详细日志
    //  console.log('📍 当前路由:', router.currentRoute.value.fullPath)
      router.push(url).then(() => {
        // console.log('✅ 导航成功完成')
        // console.log('📍 新路由:', router.currentRoute.value.fullPath)
      }).catch(error => {
        console.error('❌ 导航失败:', error)
      })
    }
    // 根据情感意图id 查询商品信息
    const viewAllProducts = (intentId) => {
      const url = `/product-spu/selectSpuByIntentId/spu/${intentId}`;
    //  console.info("根据情感意图id 查询商品信息url is :", url);
      router.push(url)// 通过路由路径导航
    }
    // 情感意愿详情
    const navigateToNav = (navItem) => {
      const url = `/emotional-intent/getByid/${navItem.id}`;
   //   console.info("根据情感意图ID查看详情 :", url);
      router.push(url)// 通过路由路径导航
    }
    // 购物车
    const goToCart = () => {
      const url = `/shopingcart/pageLst`
   //   console.info("购物车url is :", url);
      router.push(url)// 通过路由路径导航
    }
    // 订单
    const goToOrders = () => {
      const url = `/order/page`
   //   console.info("订单url is :", url);
      router.push(url)// 通过路由路径导航
    }
    const goToHome = () => router.push('/')

    // 用户信息
    const goToUser = () => {
      // console.log('Token:', authStore.token)
      // console.log('User信息:', authStore.userInfo)
      // console.log('User的userId信息:', authStore.userInfo.userId)
      // console.log('是否已登录:', authStore.isLoggedIn)
      // console.log('🔐 认证信息:')

      const url = `/users/login`
  //    console.info("用户登錄url is :", url);
      router.push(url)// 通过路由路径导航
    }
    //导航用户中心
    const goToUserInfor = () => {
  //    console.log('🔐 用户中心信息:')
      router.push(`/users/${authStore.userInfo.userId}`)// 通过路由路径导航
    }
    // 退出登录
    const handleLogout = async () => {
      console.log('🔐 开始退出登录流程');
      try {
        // 1. 获取当前认证状态
        const token = authStore.token;
        const hasValidToken = token && authStore.isLoggedIn;
        console.log('🔍 当前认证状态:', {
          hasToken: !!token,
          isLoggedIn: authStore.isLoggedIn
        });
        // 2. 调用后端退出接口（如果有有效token）
        if (hasValidToken) {
          try {
            console.log('📡 调用后端退出接口...');
            const response = await fetch('/api/users/logout', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            if (response.ok) {
              const result = await response.json();
              console.log('✅ 后端退出成功:', result.message);
            } else {
              console.warn('⚠️ 后端退出失败，继续前端清理');
            }
          } catch (apiError) {
            console.warn('⚠️ 后端退出接口调用失败，继续前端清理:', apiError.message);
          }
        } else {
          console.log('ℹ️ 无有效token，跳过后端退出调用');
        }
        // 3. 统一清理前端状态
        await performFrontendCleanup();
        // 4. 跳转页面
        console.log('🔄 跳转到首页...');
        router.push('/');
        // 5. 可选：重置页面状态
        window.scrollTo(0, 0);
        console.log('✅ 退出登录流程完成');
      } catch (error) {
        console.error('❌ 退出流程异常:', error);
        // 异常情况下强制清理并跳转
        await emergencyCleanup();
        router.push('/');
      }
    };

    /**
     * 统一清理前端状态
     */
    const performFrontendCleanup = async () => {
      console.log('🧹 开始清理前端状态...');
      try {
        // 1. 清除 Pinia Store 状态
        authStore.logout();
        console.log('✅ Pinia Store 状态已清除');

        // 2. 统一清理 localStorage（避免重复和遗漏）
        const itemsToRemove = [
          'auth_token', 'user_info', 'token', 'userInfo',
          'remember_me', 'saved_email', 'user_settings'
        ];

        itemsToRemove.forEach(key => {
          localStorage.removeItem(key);
        });
        console.log('✅ localStorage 已清理');

        // 3. 清理 sessionStorage
        sessionStorage.clear();
        console.log('✅ sessionStorage 已清理');

        // 4. 清理定时器（如果存在）
        if (refreshTokenTimer) {
          clearInterval(refreshTokenTimer);
          console.log('✅ 定时器已清理');
        }

      } catch (cleanupError) {
        console.error('❌ 前端清理失败:', cleanupError);
        throw cleanupError;
      }
    };

    /**
     * 紧急清理（用于异常情况）
     */
    const emergencyCleanup = async () => {
      console.warn('🚨 执行紧急清理...');

      try {
        // 强制清除所有存储
        localStorage.clear();
        sessionStorage.clear();

        // 重置 Store 状态
        if (authStore && typeof authStore.logout === 'function') {
          authStore.logout();
        }

        console.log('✅ 紧急清理完成');
      } catch (error) {
        console.error('❌ 紧急清理失败:', error);
      }
    };
    const search = () => console.log('打开搜索')


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
        //过滤showInNavigation为1 且按照sortOrder升序排序
        if (result?.data) {
          emotionalIntents.value = result.data
            .filter(item => item.showInNavigation === 1)
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
          //点击路由配置路径
          navigationItems.value = emotionalIntents.value.map(item => ({
            id: item.id,
            label: item.intentNameEn,
            intentId: item.id,
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
      navigateToProductDetail,
      viewAllProducts,
      navigateToNav,
      goToHome,
      goToUser,
      goToUserInfor,
      handleLogout,
      search,
      goToOrders,
      retryLoadMenuData,
      goToCart,
      authStore
    }
  }
}
</script>
<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 头部样式 - 提升到全局最高层级 */
.header {
  height: 80px;
  background: linear-gradient(135deg, rgba(10, 17, 40, 0.95) 0%, rgba(20, 30, 60, 0.95) 100%);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 140, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 3%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100000; /* 提升到全局最高层级 */
  gap: 20px;
}

/* 品牌LOGO */
.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  min-width: 100px;
  flex-shrink: 0;
  transition: all 0.3s ease;
  z-index: 100001;
}

.brand:hover {
  transform: scale(1.05);
}

.brand-text {
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #FFD700 0%, #FF8C00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2px;
  line-height: 1;
}

.brand-subtitle {
  font-size: 9px;
  color: rgba(255, 140, 0, 0.7);
  letter-spacing: 1px;
  margin-top: 1px;
}

/* 导航容器 */
.nav-container {
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
  min-width: 0;
  max-width: calc(100% - 280px);
  margin: 0 15px;
  height: 100%;
  z-index: 100001;
}

/* 主导航 */
.main-nav {
  display: flex;
  gap: 20px;
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 5px 0;
  width: 100%;
  flex-wrap: nowrap;
  height: 100%;
}

/* 隐藏滚动条 */
.main-nav::-webkit-scrollbar {
  display: none;
}

/* 导航项 */
.nav-item {
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  height: 100%;
  display: flex;
  align-items: center;
}

.nav-label {
  color: #FF8C00;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  min-width: fit-content;
}

.nav-item:hover .nav-label {
  background: rgba(255, 140, 0, 0.1);
  color: #FFD700;
  transform: translateY(-1px);
}

.nav-item.active .nav-label {
  background: rgba(255, 140, 0, 0.15);
  color: #FFD700;
  box-shadow: 0 2px 8px rgba(255, 140, 0, 0.3);
}

.nav-loading-dot {
  animation: pulse 1.5s infinite;
  color: #FFD700;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

/* 滚动提示 */
.scroll-hint {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 140, 0, 0.1);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: bounce 2s infinite;
  z-index: 100002;
}

.hint-icon {
  font-size: 12px;
  color: #FF8C00;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(-50%) translateX(0);
  }
  40% {
    transform: translateY(-50%) translateX(-3px);
  }
  60% {
    transform: translateY(-50%) translateX(-2px);
  }
}

/* 巨型菜单主容器 - 关键修复：提升到全局最高层级 */
.mega-menu {
  position: fixed; /* 改为fixed定位，脱离文档流 */
  top: 80px; /* 距离顶部80px，在header下方 */
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  max-width: 90vw;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(40px);
  border-radius: 16px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25),
  0 0 0 1px rgba(255, 140, 0, 0.3);
  border: 1px solid rgba(255, 140, 0, 0.3);
  overflow: hidden;
  z-index: 1000000; /* 提升到最高层级，确保在所有内容之上 */
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

/* 确保巨型菜单的动画容器也有高z-index */
.mega-menu-enter-active,
.mega-menu-leave-active {
  z-index: 1000000;
}

.mega-menu-enter-active {
  animation: slideDown 0.3s ease-out;
}

.mega-menu-leave-active {
  animation: slideUp 0.2s ease-in;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  to {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
}

.mega-menu-content {
  min-height: 450px;
  position: relative;
  z-index: 1;
}

/* 加载状态 */
.menu-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 40px;
  color: #666;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(255, 140, 0, 0.1);
  border-top: 3px solid #FF8C00;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.loading-text {
  font-size: 14px;
  color: #999;
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
.menu-error {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
}

.error-content {
  text-align: center;
}

.error-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.error-text {
  color: #d32f2f;
  font-size: 14px;
  margin-bottom: 20px;
  display: block;
}

.retry-btn {
  background: #FF8C00;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.retry-btn:hover {
  background: #FFD700;
  transform: translateY(-1px);
}

/* 菜单内容布局 */
.menu-content {
  display: flex;
  padding: 32px;
  gap: 40px;
  min-height: 450px;
}

.mega-menu-left {
  flex: 0 0 280px;
  border-right: 1px solid rgba(255, 140, 0, 0.1);
  padding-right: 32px;
}

.mega-menu-right {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

/* 分区样式 */
.section {
  margin-bottom: 32px;
}

.section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  letter-spacing: 1px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.featured-icon {
  font-size: 18px;
}

/* 列表项样式 */
.category-list,
.energy-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-item,
.energy-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #555;
}

.category-item:hover,
.energy-item:hover {
  background: rgba(255, 140, 0, 0.08);
  color: #333;
  transform: translateX(4px);
}

.energy-item {
  color: inherit;
}

.energy-item:hover {
  color: inherit;
}

.item-prefix {
  font-weight: bold;
  color: inherit;
}

.item-name {
  flex: 1;
  font-size: 13px;
  color: inherit;
}

.item-count {
  font-size: 11px;
  color: #999;
}

.energy-icon {
  font-size: 14px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #999;
  text-align: center;
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-text {
  font-size: 12px;
}

/* 商品卡片 */
.featured-products {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.product-card {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 140, 0, 0.1);
  background: white;
}

.product-card:hover {
  border-color: rgba(255, 140, 0, 0.3);
  box-shadow: 0 4px 16px rgba(255, 140, 0, 0.15);
  transform: translateY(-2px);
}

.product-image {
  position: relative;
  flex: 0 0 60px;
  height: 60px;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 140, 0, 0.1) 0%, rgba(255, 215, 0, 0.1) 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  font-size: 20px;
  opacity: 0.7;
}

.product-badges {
  position: absolute;
  top: -5px;
  right: -5px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.badge {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: 600;
}

.best-seller {
  background: #d32f2f;
  color: white;
}

.featured {
  background: #FF8C00;
  color: white;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.retail-price {
  font-size: 14px;
  font-weight: 700;
  color: #d32f2f;
}

.sale-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
}

.product-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 500;
}

.energy-tag {
  background: rgba(255, 140, 0, 0.1);
  color: #FF8C00;
}

.category-tag {
  background: rgba(33, 150, 243, 0.1);
  color: #2196F3;
}

/* 品牌故事 */
.brand-story {
  padding: 16px;
  background: rgba(255, 140, 0, 0.05);
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 3px solid #FF8C00;
}

.story-text {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
  font-style: italic;
  margin: 0;
}

/* 查看全部按钮 */
.view-all-section {
  margin-top: auto;
}

.view-all-btn {
  width: 100%;
  background: linear-gradient(135deg, #FF8C00 0%, #FFD700 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 600;
}

.view-all-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(255, 140, 0, 0.3);
}

.btn-text {
  flex: 1;
  text-align: center;
}

.btn-icon {
  font-size: 16px;
}

/* 右侧功能图标 */
.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  min-width: 180px;
  justify-content: flex-end;
  flex-shrink: 0;
  z-index: 100001;
}

.action-item {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.action-item:hover {
  background: rgba(255, 140, 0, 0.2);
  transform: translateY(-2px);
}

.action-icon {
  font-size: 16px;
}

.cart-item {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #d32f2f;
  color: white;
  border-radius: 10px;
  min-width: 18px;
  height: 18px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  padding: 0 4px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .mega-menu {
    width: 800px;
  }

  .main-nav {
    gap: 15px;
  }
}

@media (max-width: 1024px) {
  .header {
    padding: 0 2%;
  }

  .mega-menu {
    width: 95vw;
  }

  .menu-content {
    flex-direction: column;
    gap: 24px;
  }

  .mega-menu-left {
    flex: none;
    border-right: none;
    border-bottom: 1px solid rgba(255, 140, 0, 0.1);
    padding-right: 0;
    padding-bottom: 24px;
  }

  .nav-container {
    max-width: calc(100% - 200px);
    margin: 0 10px;
  }

  .main-nav {
    gap: 12px;
  }

  .nav-label {
    padding: 6px 10px;
    font-size: 13px;
  }

  .header-actions {
    min-width: 150px;
    gap: 10px;
  }

  .action-item {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 768px) {
  .header {
    height: 70px;
    padding: 0 1%;
    gap: 10px;
  }

  .mega-menu {
    top: 70px;
    max-height: calc(100vh - 80px);
  }

  .brand {
    min-width: 70px;
  }

  .brand-text {
    font-size: 20px;
  }

  .nav-container {
    max-width: calc(100% - 160px);
    margin: 0 5px;
  }

  .main-nav {
    gap: 8px;
  }

  .nav-label {
    padding: 5px 8px;
    font-size: 12px;
  }

  .header-actions {
    min-width: 120px;
    gap: 8px;
  }

  .action-item {
    width: 28px;
    height: 28px;
  }

  .action-icon {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .nav-container {
    max-width: calc(100% - 140px);
  }

  .main-nav {
    gap: 6px;
  }

  .nav-label {
    padding: 4px 6px;
    font-size: 11px;
  }

  .scroll-hint {
    display: none;
  }
}

/* 全局样式覆盖，确保其他页面元素不会遮挡头部 */
::v-deep * {
  /* 确保页面主要内容在头部下方 */
  position: relative;
  z-index: auto !important;
}

/* 确保模态框等特殊组件也不会遮挡 */
::v-deep .modal,
::v-deep .dialog,
::v-deep .popup,
::v-deep .tooltip,
::v-deep .dropdown {
  z-index: 99999 !important; /* 低于头部组件的层级 */
}

/* 打印样式 */
@media print {
  .header {
    position: static;
    background: white;
    border-bottom: 1px solid #ccc;
    z-index: auto;
  }

  .mega-menu {
    display: none;
  }
}
.logged-in-actions {
  display: flex;
  align-items: center;
  gap: 8px; /* 按钮间距，可调整 */
}

</style>

