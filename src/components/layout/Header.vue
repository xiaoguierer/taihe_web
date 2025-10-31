<template>
  <header class="header">
    <div class="menu-container">
      <div class="menu-icon" @click="toggleMenu">
        <i class="fas fa-bars"></i> 菜单
      </div>
      <div class="menu-dropdown" :class="{ 'menu-show': isMenuOpen }">
        <a href="#" @click.prevent="navigateTo('/')">首页</a>
        <a href="#" @click.prevent="navigateTo('/jewelry')">珠宝系列</a>
        <a href="#" @click.prevent="navigateTo('/custom')">高级定制</a>
        <a href="#" @click.prevent="navigateTo('/story')">品牌故事</a>
        <a href="#" @click.prevent="navigateTo('/service')">客户服务</a>
        <a href="#" @click.prevent="navigateTo('/contact')">联系我们</a>
      </div>
    </div>

    <div class="brand" @click="goToHome">TAIHE</div>

    <div class="header-icons">
      <i class="fas fa-search" title="搜索" @click="search"></i>
      <i class="fas fa-user" title="用户" @click="navigateTo('/UserLogin')"></i>
      <i class="fas fa-shopping-bag" title="购物车" @click="navigateTo('/cart')">
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
      cartCount: 3
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    navigateTo(path) {
      this.$router.push(path);
      this.isMenuOpen = false;
    },
    // 新增：点击TAIHE返回首页的方法
    goToHome() {
      this.$router.push('/');
      this.isMenuOpen = false;
    },
    search() {
      console.log('打开搜索');
    },
    share() {
      console.log('分享功能');
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
</script>

<style scoped>
@import url('@/styles/components/header.css');
</style>
