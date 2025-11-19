<template>
  <header class="header">
    <div class="brand" @click="goToHome">TAIHE</div>

    <!-- 动态菜单容器 -->
    <div class="menu-container">
      <div class="menu-dropdown">
        <a
          v-for="item in emotionalIntents"
          :key="item.id"
          href="#"
          @click.prevent="navigateToIntent(item)"
          :class="{ 'disabled': item.isActive !== 1 }"
        >
          {{ item.symbolCharacter }}-{{ item.intentNameEn }}
        </a>

        <!-- 如果没有数据时显示提示 -->
        <div v-if="emotionalIntents.length === 0" class="no-data">
          暂无导航数据
        </div>
      </div>
    </div>

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
        if (result && Array.isArray(result.data)) {
          emotionalIntents.value = result.data
            .filter(item => item.showInNavigation === 1)
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
        } else {
          emotionalIntents.value = []
          console.warn('返回数据格式不符，使用空数组')
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
    }

    // 通用导航方法
    const navigateTo = (path) => {
      router.push(path)
    }

    // 返回首页
    const goToHome = () => {
      router.push('/')
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
    })

    return {
      emotionalIntents,
      cartCount,
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
/* 页面头部 */
.header {
  height: 2cm;
  background-color: rgba(10, 17, 40, 0.9);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

/* 菜单容器 - 自动展示且在同一行 */
.menu-container {
  flex: 1;
  margin: 0 20px;
  overflow-x: auto;
}

.menu-dropdown {
  display: flex;
  align-items: center;
  gap: 0;
  white-space: nowrap;
  overflow-x: auto;
  padding: 10px 0;
}

.menu-dropdown a {
  display: inline-block;
  padding: 8px 16px;
  text-decoration: none;
  color: #FF8C00;
  border: 1px solid rgba(255, 140, 0, 0.3);
  border-radius: 20px;
  margin: 0 5px;
  transition: all 0.3s ease;
  background: rgba(255, 140, 0, 0.1);
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
}

.menu-dropdown a:hover {
  background: rgba(255, 140, 0, 0.2);
  color: #FFD700;
  border-color: #FFD700;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 140, 0, 0.3);
}

.menu-dropdown a.disabled {
  color: #666;
  border-color: #666;
  background: rgba(102, 102, 102, 0.1);
  cursor: not-allowed;
  opacity: 0.5;
}

.menu-dropdown a.disabled:hover {
  transform: none;
  box-shadow: none;
  background: rgba(102, 102, 102, 0.1);
}

/* 中间品牌LOGO */
.brand {
  font-size: 36px;
  font-weight: 700;
  background: linear-gradient(135deg, #FFD700, #FF8C00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2px;
  cursor: pointer;
  transition: opacity 0.3s ease;
  min-width: 120px;
}
.brand:hover {
  opacity: 0.8;
}

/* 右侧图标 */
.header-icons {
  display: flex;
  gap: 20px;
  min-width: 200px;
  justify-content: flex-end;
}

.header-icons i {
  font-size: 20px;
  color: #FF8C00;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  padding: 8px;
}

.header-icons i:hover {
  color: #FFD700;
  transform: translateY(-2px);
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #d32f2f;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 无数据提示 */
.no-data {
  color: #FF8C00;
  font-style: italic;
  padding: 10px;
  text-align: center;
}

/* 滚动条样式 */
.menu-container::-webkit-scrollbar {
  height: 6px;
}

.menu-container::-webkit-scrollbar-track {
  background: rgba(255, 140, 0, 0.1);
  border-radius: 3px;
}

.menu-container::-webkit-scrollbar-thumb {
  background: rgba(255, 140, 0, 0.5);
  border-radius: 3px;
}

.menu-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 140, 0, 0.7);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header {
    padding: 0 3%;
    height: 1.5cm;
  }

  .brand {
    font-size: 24px;
    min-width: 80px;
  }

  .menu-dropdown a {
    padding: 6px 12px;
    font-size: 12px;
    margin: 0 3px;
  }

  .header-icons {
    gap: 10px;
    min-width: 150px;
  }

  .header-icons i {
    font-size: 16px;
    padding: 6px;
  }
}
</style>
