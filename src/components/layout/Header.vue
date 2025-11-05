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

    <div class="menu-container">
      <div class="menu-icon" @click="toggleMenu">
        <i class="fas fa-bars"></i> 菜单
      </div>
      <div class="menu-dropdown" :class="{ 'menu-show': isMenuOpen }">
        <!-- 动态渲染菜单 -->
        <a
          v-for="menuItem in menuItems"
          :key="menuItem.id"
          href="#"
          @click.prevent="navigateTo(menuItem.path)"
          :class="{ 'disabled': !menuItem.enabled }"
        >
          {{ menuItem.title }}
        </a>
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
export default {
  name: 'Header',
  data() {
    return {
      isMenuOpen: false,
      menuItems: [], // 初始为空数组，将通过API或本地数据填充
      cartCount: 0
    }
  },
  async created() {
    // 组件创建时获取菜单数据
    await this.fetchMenuData();
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    navigateTo(path) {
      // 简单的路由跳转，实际项目中可以使用Vue Router
      if (this.$router) {
        this.$router.push(path);
      } else {
        window.location.href = path;
      }
      this.isMenuOpen = false; // 跳转后关闭菜单
    },
    goToHome() {
      this.$router.push('/');
    },
    search() {
      console.log('打开搜索');
    },
    share() {
      console.log('分享功能');
    },// 获取菜单数据的多种方式
    async fetchMenuData() {
      try {
        const params = new URLSearchParams()
        params.append('page', 1)
        params.append('size', 5000) // 确保加载足够多的数据
        params.append('isDeleted', 0) // 只加载未删除的分类
        const response = await fetch(`/api/categories/categorieslist?${params.toString()}`)
        const result = await response.json()
        console.log(result)
        this.menuItems = response.data;
      } catch (error) {
        console.error('获取菜单数据失败:', error);
        // 降级方案：使用默认菜单数据
        this.menuItems = this.getDefaultMenuData();
      }
    },
    mounted() {
      document.addEventListener('click', (event) => {
        if (!event.target.closest('.menu-container')) {
          this.isMenuOpen = false;
        }
      });
    }
  }
}
</script>

<style scoped>
@import url('@/styles/components/header.css');
</style>
