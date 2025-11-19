<template>
  <header class="header">
    <div class="menu-container">
      <div class="menu-icon" @click="toggleMenu1">
        <i class="fas fa-bars"></i> 测试
      </div>
      <div class="menu-dropdown" :class="{ 'menu-show': isMenuOpen }">
        <a href="#" @click.prevent="navigateTo('/')">首页-此处为产品分类</a>
        <a href="#" @click.prevent="navigateTo('/ProductList')">产品列表页</a>
        <a href="#" @click.prevent="navigateTo('/ProductDatil')">产品详情页</a>
        <a href="#" @click.prevent="navigateTo('/OrderList')">订单列表</a>
        <a href="#" @click.prevent="navigateTo('/CartPage')">购物车</a>
        <a href="#" @click.prevent="navigateTo('/AddressPage')">收货地址</a>
      </div>
    </div>

    <!-- 动态菜单容器 -->
    <div class="menu-container">
      <div class="menu-icon" @click="toggleMenu">
        <i class="fas fa-bars"></i> 菜单
      </div>
      <div class="menu-dropdown" :class="{ 'menu-show': isMenuOpen }">
        <a
          v-for="item in emotionalIntents"
          :key="item.id"
          href="#"
          @click.prevent="navigateToIntent(item)"
          :class="{ 'disabled': item.isActive !== 1 }"
        >
          ({{ item.symbolCharacter }})-{{ item.intentNameEn }}
        </a>

        <!-- 如果没有数据时显示提示 -->
        <div v-if="emotionalIntents.length === 0" class="no-data">
          暂无导航数据
        </div>
      </div>
    </div>

    <div class="brand" @click="goToHome">TAIHE</div>

    <div class="header-icons">
      <i class="fas fa-search" title="搜索" @click="search"></i>
      <i class="fas fa-user" title="用户" @click="navigateTo('/UserLogin')"></i>
      <i class="fas fa-shopping-bag" title="购物车" @click="navigateTo('/CartPage')">
        <span class="cart-count">{{ cartCount }}</span><a href="#"></a>
      </i>
      <i class="fas fa-share-alt" title="分享" @click="share"></i>
      <i class="fas fa-heart" title="收藏" @click="navigateTo('/wishlist')"></i>
    </div>
  </header>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Header',
  setup() {
    const router = useRouter()
    const isIntentMenuOpen = ref(false)
    const isFunctionalMenuOpen = ref(false)
    const emotionalIntents = ref([])
    const cartCount = ref(0)

    // 获取情感意图数据
    const fetchEmotionalIntents = async () => {
      try {
        const response = await fetch('/api/emotional-intent/list')

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        console.log("API情感意图数据:", result.data)

        // 直接使用API返回的数据
        if (result && Array.isArray(result.data)) {
          emotionalIntents.value = result.data
            .filter(item => item.showInNavigation === 1)
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
        } else {
          emotionalIntents.value = []
          console.warn('API返回数据格式不符，使用空数组')
        }
      } catch (error) {
        console.error('获取情感意图数据失败:', error)
        emotionalIntents.value = []
      }
    }

    // 导航到情感意图页面
    const navigateToIntent = (item) => {
      if (item.isActive !== 1) return

      router.push({
        path: '/ProductList',
        query: {
          emotionalIntent: item.intentKey,
          intentCode: item.intentCode
        }
      })
      isIntentMenuOpen.value = false
    }

    // 通用导航方法
    const navigateTo = (path) => {
      router.push(path)
      isFunctionalMenuOpen.value = false
    }

    // 切换菜单显示
    const toggleIntentMenu = () => {
      isIntentMenuOpen.value = !isIntentMenuOpen.value
      isFunctionalMenuOpen.value = false
    }

    const toggleFunctionalMenu = () => {
      isFunctionalMenuOpen.value = !isFunctionalMenuOpen.value
      isIntentMenuOpen.value = false
    }

    // 返回首页
    const goToHome = () => {
      router.push('/')
    }

    // 点击外部关闭菜单
    const handleClickOutside = (event) => {
      if (!event.target.closest('.menu-container')) {
        isIntentMenuOpen.value = false
        isFunctionalMenuOpen.value = false
      }
    }

    // 搜索功能
    const search = () => {
      console.log('打开搜索')
    }

    // 分享功能
    const share = () => {
      console.log('分享功能')
    }

    // 生命周期
    onMounted(() => {
      fetchEmotionalIntents()
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      isIntentMenuOpen,
      isFunctionalMenuOpen,
      emotionalIntents,
      cartCount,
      toggleIntentMenu,
      toggleFunctionalMenu,
      navigateTo,
      navigateToIntent,
      goToHome,
      search,
      share
    }
  }
}
</script>

<style scoped>
@import url('@/styles/components/header.css');
</style>
