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
/* 全局样式 */
.product-page {
  font-family: 'Arial', 'Helvetica', sans-serif;
  background-color: #0a1a35; /* 深邃夜空蓝 */
  color: #f5f5f5;
  min-height: 100vh;
}

/* 第一部分样式 */
.hero-section {
  height: 15cm;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.hero-container {
  display: flex;
  width: 100%;
  height: 100%;
  margin: 0;
}
.hero-content{
  flex: 1; /* 占据剩余50%空间 */
  display: flex;
  flex-direction: column; /* 改为垂直排列 */
  align-items: flex-start; /* 改为左对齐 */
  justify-content: center;
  padding: 2rem;
  overflow: hidden; /* 防止内容溢出 */
}
.hero-image{
  flex: 0 0 50%; /* 固定50%宽度，不伸缩 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  cursor: pointer; /* 添加点击手势 */
  transition: all 0.3s ease; /* 添加悬停效果 */
}

.hero-image img, .image-placeholder {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.image-placeholder {
  width: 100%;
  height: 100%;
 /* background: rgba(255, 215, 0, 0.1); !* 金色半透明背景 *!*/
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed;
  font-size: 1.2rem;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  width: 100%; /* 确保宽度100% */
  text-align: left; /* 改为左对齐 */

  /* 自动换行设置 */
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;

  /* 多行截断显示... */
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 最多显示2行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  max-height: 2.6em; /* 2行文字高度 */
}

.hero-description {
  font-size: 1.2rem;
  line-height: 1.6;
  width: 100%; /* 确保宽度100% */
  text-align: left; /* 改为左对齐 */

  /* 自动换行设置 */
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;

  /* 多行截断显示... */
  display: -webkit-box;
  -webkit-line-clamp: 4; /* 最多显示4行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 6.4em; /* 4行文字高度 */
}

/* 第二部分样式 */
.products-section {
  min-height: 10cm;
  padding: 0.5cm 0;
}

.products-container {
  width: 100%;
  padding: 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5cm;
  padding: 0 0.5cm;
}

.product-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.product-image {
  height: 8cm;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5cm;
  cursor: pointer; /* 添加点击手势 */
  transition: all 0.3s ease; /* 添加悬停效果 */
}

.product-image img, .product-image .image-placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  text-align: center;
  width: 100%;
}

.product-name {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.3rem;
}

.product-meaning {
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
  color: #e0e0e0;
}

.product-element {
  font-size: 0.85rem;
  color: #a8a8a8;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-container {
    flex-direction: column;
  }
  .hero-image {
    flex: 0 0 40%; /* 移动端图片占40%高度 */
    width: 100%;
  }
  .hero-content {
    flex: 1;
    align-items: center; /* 移动端居中对齐 */
    text-align: center;
  }
  .hero-title {
    font-size: 2rem;
    -webkit-line-clamp: 2;
    text-align: center;
    max-height: 2.6em;
  }

  .hero-description {
    font-size: 1rem;
    -webkit-line-clamp: 3; /* 移动端显示3行 */
    text-align: center;
    max-height: 4.8em; /* 3行文字高度 */
  }
  .hero-section {
    height: auto;
    min-height: 15cm;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }


}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
  .hero-title {
    font-size: 1.8rem;
    -webkit-line-clamp: 2;
  }

  .hero-description {
    font-size: 0.9rem;
    -webkit-line-clamp: 3;
  }
}

</style>
