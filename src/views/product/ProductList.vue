<template>
  <div class="product-page">
    <!-- 第一部分：左右分栏布局 -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-image"  @click="goToProductDetail(heroData.id)">
          <img :src="heroData.imageUrl" :alt="heroData.title" v-if="heroData.imageUrl">
          <div class="image-placeholder" v-else>珠宝展示图</div>
        </div>
        <div class="hero-content">
          <h2 class="hero-title">{{ heroData.title || '高端珠宝系列' }}</h2>
          <p class="hero-description">{{ heroData.description || '每一件珠宝都是艺术与工艺的完美结合，彰显尊贵与品味' }}</p>
        </div>
      </div>
    </section>

    <!-- 第二部分：商品网格布局 -->
    <section class="products-section">
      <div class="products-container">
        <div class="products-grid">
          <div
            class="product-card"
            v-for="(product, index) in products"
            :key="index"
          >
            <div class="product-image" @click="goToProductDetail(product.id)">
              <img :src="product.imageUrl" :alt="product.name" v-if="product.imageUrl">
              <div class="image-placeholder" v-else>商品图片</div>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name || '珠宝名称' }}</h3>
              <p class="product-meaning">{{ product.meaning || '寓意深远' }}</p>
              <p class="product-element">{{ product.element || '五行适配: 金' }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ProductListPage',
  data() {
    return {
      // 第一部分数据
      heroData: {
        imageUrl: 'https://a.vpimg4.com/upload/merchandise/382845/HUAN-YD0321007-1.jpg',
        title: '',
        description: '',
        id: '004' // 确保heroData包含id字段
      },
      // 第二部分数据
      products: []
    }
  },
  async mounted() {
    // 组件挂载后获取数据
    await this.fetchHeroData();
    await this.fetchProductsData();
  },
  methods: {
    // 跳转到商品详情页
    goToProductDetail(productId) {
      if (!productId) {
        console.warn('商品ID不存在');
        return;
      }

      // 方式1：使用编程式导航
      this.$router.push({
        name: 'ProductDetail',
        params: { id: productId }
      });

      // 或者方式2：使用路径导航
      // this.$router.push(`/product/detail/${productId}`);
    },

    // 获取第一部分数据
    async fetchHeroData() {
      try {
        // 这里替换为实际的API接口
        const response = await fetch('/api/hero-section');
        const data = await response.json();
        this.heroData = data;
      } catch (error) {
        console.error('获取第一部分数据失败:', error);
        // 使用默认数据
        this.heroData = {
          imageUrl: '',
          title: '璀璨珠宝 奢华典藏',
          description: '精选全球顶级珠宝，融合寒假十课手机号数控技术凯水果湖是个撒刷卡机传统工艺与现代设计，中华传统文化',
          id:0  // 添加默认id
        };
      }
    },
    // 获取第二部分数据
    async fetchProductsData() {
      try {
        // 这里替换为实际的API接口
        const response = await fetch('/api/products');
        const data = await response.json();
        this.products = data;
      } catch (error) {
        console.error('获取商品数据失败:', error);
        // 使用默认数据
        this.products = Array(8).fill().map((_, index) => ({
          id: index, // 添加id字段
          imageUrl: '',
          name: `珠宝系列 ${index + 1}`,
          meaning: '象征永恒与尊贵',
          element: '五行适配: ' + ['金', '木', '水', '火', '土'][index % 5]
        }));
      }
    }
  }
}
</script>

<style scoped>
@import url('@/styles/product/productlist.css');
</style>
