<template>
  <div class="homepage">
    <!-- 模块一：英雄区 -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content" :class="heroLayout">
          <div class="hero-text">
            <div class="floating-tag">本月星座主打（天蝎座）</div>
            <h1 class="hero-title">「平衡之境」系列黑欧宝戒指</h1>
            <p class="hero-subtitle">为职场精英凝聚专注能量</p>
            <div class="value-points">
              <div class="value-item">
                <span class="value-icon">💎</span>
                <span>天然黑欧宝，公认的专注之石</span>
              </div>
              <div class="value-item">
                <span class="value-icon">☯️</span>
                <span>太极对称设计，助力能量平衡</span>
              </div>
              <div class="value-item">
                <span class="value-icon">🛡️</span>
                <span>附大师开光证书，专属守护</span>
              </div>
            </div>
            <div class="hero-actions">
              <button class="btn-primary">立即探索 - 平衡之境系列</button>
              <button class="btn-secondary">观看制作工艺视频</button>
            </div>
          </div>
          <div class="hero-visual">
            <div class="product-visual">
              <img :src="currentHeroImage" alt="平衡之境系列黑欧宝戒指" />
              <button class="visual-control" @click="toggleHeroLayout">A/B测试布局</button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- 模块三：精选商品分类导航 -->
    <section class="categories-section">
      <div class="section-container">
        <h2 class="section-title">按您的需求探索</h2>
        <div class="categories-grid">
          <div v-for="category in categories" :key="category.id" class="category-card" @click="navigateToCategory(category.id)">
            <span class="category-icon">{{ category.icon }}</span>
            <span class="category-name">{{ category.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 模块四：爆款产品网格展示 -->
    <section class="products-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">人气精选</h2>
          <div class="sort-options">
            <select v-model="sortBy" class="sort-select">
              <option value="default">综合排序</option>
              <option value="sales">销量</option>
              <option value="newest">最新</option>
              <option value="price">价格</option>
            </select>
          </div>
        </div>
        <div class="products-grid">
          <div v-for="product in sortedProducts" :key="product.id" class="product-card">
            <div class="product-image">
              <img :src="product.image" :alt="product.name" />
              <span v-if="product.isHot" class="hot-badge">热卖</span>
              <button class="wishlist-btn">❤️</button>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <div class="metaphysical-tags">
                <span class="tag">{{ product.tags.zodiac }}</span>
                <span class="tag">{{ product.tags.element }}</span>
              </div>
              <div class="product-price">¥{{ product.price.toLocaleString() }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 模块五：高客单价系列展示 -->
    <section class="premium-section">
      <div class="premium-container">
        <div class="premium-content">
          <div class="premium-text">
            <h2 class="premium-title">大师监制「传承」系列</h2>
            <p class="premium-subtitle">可传世的投资级珠宝</p>
            <p class="premium-desc">每件作品均由国际珠宝大师亲手打造，限量发售，配有独立编号与收藏证书</p>
            <div class="trust-badges">
              <div class="trust-badge">
                <span class="badge-icon">🔢</span>
                <span>独立编号</span>
              </div>
              <div class="trust-badge">
                <span class="badge-icon">📜</span>
                <span>收藏证书</span>
              </div>
              <div class="trust-badge">
                <span class="badge-icon">⭐</span>
                <span>限量发售</span>
              </div>
            </div>
            <button class="btn-primary">探索传承系列</button>
          </div>
          <div class="premium-visual">
            <img src="https://a.vpimg4.com/upload/merchandise/382845/HUAN-YD0321007-1.jpg" alt="传承系列珠宝" />
          </div>
        </div>
      </div>
    </section>

    <!-- 模块六：信任建立与社会证明 -->
    <section class="trust-section">
      <div class="section-container">
        <h2 class="section-title">能量见证</h2>
        <div class="trust-content">

          <div class="testimonials">
            <div class="testimonial-slider">
              <div v-for="(testimonial, index) in testimonials"
                   :key="index"
                   class="testimonial-item"
                   :class="{ active: currentTestimonial === index }">
                <div class="testimonial-content">
                  <p>"{{ testimonial.content }}"</p>
                  <div class="testimonial-author">
                    <span class="author-name">{{ testimonial.name }}</span>
                    <span class="author-details">{{ testimonial.details }}</span>
                  </div>
                </div>
                <div class="testimonial-image" v-if="testimonial.image">
                  <img :src="testimonial.image" :alt="testimonial.name" />
                </div>
              </div>
            </div>
            <div class="testimonial-controls">
              <button v-for="(_, index) in testimonials"
                      :key="index"
                      :class="{ active: currentTestimonial === index }"
                      @click="currentTestimonial = index"></button>
            </div>
          </div>

          <div class="trust-badges-list">
            <div class="trust-badge-item">
              <span class="badge-icon">📜</span>
              <div class="badge-content">
                <strong>GIA/GRS 权威认证</strong>
                <span>每颗宝石均有国际认证</span>
              </div>
            </div>
            <div class="trust-badge-item">
              <span class="badge-icon">✈️</span>
              <div class="badge-content">
                <strong>全球免邮与无忧退货</strong>
                <span>30天内无理由退换</span>
              </div>
            </div>
            <div class="trust-badge-item">
              <span class="badge-icon">🔒</span>
              <div class="badge-content">
                <strong>终身免费保养服务</strong>
                <span>专业护理，持久如新</span>
              </div>
            </div>
            <div class="trust-badge-item highlight">
              <span class="badge-icon">💎</span>
              <div class="badge-content">
                <strong>1对1视频选品顾问</strong>
                <span>专属服务，精准匹配</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 模块七：内容营销与交叉销售 -->
    <section class="content-section">
      <div class="section-container">
        <h2 class="section-title">灵性指南</h2>
        <div class="content-grid">
          <div class="blog-card">
            <div class="blog-image">
              <img src="https://a.vpimg4.com/upload/merchandise/382845/HUAN-YD0321007-1.jpg" alt="2024年水瓶座财富运势" />
            </div>
            <div class="blog-content">
              <h3>2024年水瓶座财富运势与开运宝石</h3>
              <p>探索2024年水瓶座的财富能量趋势，了解哪些宝石能够助您吸引丰盛与机遇...</p>
              <button class="btn-text">阅读全文</button>
            </div>
          </div>
          <div class="related-product">
            <div class="product-preview">
              <img src="https://a.vpimg4.com/upload/merchandise/382845/HUAN-YD0321007-1.jpg" alt="黄水晶丰饶手链" />
              <div class="product-details">
                <h4>文中同款黄水晶「丰饶」手链</h4>
                <p>增强财富能量的专属配饰</p>
                <div class="product-price">¥3,800</div>
                <button class="btn-small">立即购买</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- 最近浏览模块 -->
    <section class="recently-viewed" v-if="recentProducts.length > 0">
      <div class="section-container">
        <h2 class="section-title">最近浏览</h2>
        <div class="products-grid compact">
          <div v-for="product in recentProducts" :key="product.id" class="product-card">
            <div class="product-image">
              <img :src="product.image" :alt="product.name" />
              <button class="wishlist-btn">❤️</button>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <div class="product-price">¥{{ product.price.toLocaleString() }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- 登录模态框 -->
    <div v-if="showLogin" class="login-modal">
      <!-- 这里可以嵌入之前实现的登录组件 -->
      <div class="modal-content">
        <button class="modal-close" @click="showLogin = false">×</button>
        <h2>登录灵性珠宝</h2>
        <!-- 简化版登录表单 -->
        <div class="login-form">
          <input type="email" placeholder="电子邮箱地址" v-model="loginEmail" />
          <input type="password" placeholder="密码" v-model="loginPassword" />
          <button class="btn-primary" @click="handleLogin">登录</button>
          <p>还没有账户？<a href="#" @click.prevent="switchToRegister">立即注册</a></p>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>灵性珠宝</h3>
            <p>发现与您能量共鸣的专属珠宝</p>
          </div>
          <div class="footer-section">
            <h4>客户服务</h4>
            <a href="#">联系我们</a>
            <a href="#">配送信息</a>
            <a href="#">退换政策</a>
            <a href="#">保养指南</a>
          </div>
          <div class="footer-section">
            <h4>关于我们</h4>
            <a href="#">品牌故事</a>
            <a href="#">能量哲学</a>
            <a href="#">大师团队</a>
            <a href="#">社会责任</a>
          </div>
          <div class="footer-section">
            <h4>关注我们</h4>
            <div class="social-links">
              <a href="#">微信</a>
              <a href="#">微博</a>
              <a href="#">小红书</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2023 灵性珠宝 版权所有</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
// 响应式数据
const heroLayout = ref('left-right') // 可切换为 'right-left'
const isPersonalizationSticky = ref(false)
const sortBy = ref('default')
const currentTestimonial = ref(0)
const email = ref('')
const showExitPopup = ref(false)
const showLogin = ref(false)
const loginEmail = ref('')
const loginPassword = ref('')

// 英雄区图片切换
const currentHeroImage = ref('https://a.vpimg4.com/upload/merchandise/382845/HUAN-YD0321007-1.jpg')

// 分类数据
const categories = ref([
  { id: 1, icon: '❤️', name: '爱情与人际' },
  { id: 2, icon: '💰', name: '财富与事业' },
  { id: 3, icon: '🛡️', name: '健康与保护' },
  { id: 4, icon: '💡', name: '智慧与灵感' },
  { id: 5, icon: '♈', name: '星座专属' },
  { id: 6, icon: '🔥', name: '热销经典' }
])

// 产品数据
const products = ref([
  { id: 1, name: '【沧海月明】蓝宝石吊坠', price: 12800, image: 'https://a.vpimg4.com/upload/merchandise/382845/HUAN-YD0321007-1.jpg', isHot: true, tags: { zodiac: '星座：天蝎/双鱼', element: '五行：水' } },
  { id: 2, name: '【平衡之境】黑欧宝戒指', price: 9800, image: 'https://a.vpimg4.com/upload/merchandise/382845/HUAN-YD0321007-1.jpg', isHot: true, tags: { zodiac: '星座：金牛/处女', element: '五行：土' } },
  { id: 3, name: '【清音】海蓝宝耳钉', price: 6800, image: '/https://a.vpimg4.com/upload/merchandise/382845/HUAN-YD0321007-1.jpg', isHot: false, tags: { zodiac: '星座：双子/天秤', element: '五行：风' } },
  { id: 4, name: '【丰饶】黄水晶手链', price: 4200, image: '/https://a.vpimg4.com/upload/merchandise/382845/HUAN-YD0321007-1.jpg', isHot: true, tags: { zodiac: '星座：金牛/摩羯', element: '五行：土' } },
  { id: 5, name: '【守护】黑曜石挂坠', price: 3200, image: '/https://a.vpimg4.com/upload/merchandise/382845/HUAN-YD0321007-1.jpg', isHot: false, tags: { zodiac: '星座：天蝎/摩羯', element: '五行：水' } },
  { id: 6, name: '【灵感】紫水晶项链', price: 5600, image: '/https://a.vpimg4.com/upload/merchandise/382845/HUAN-YD0321007-1.jpg', isHot: true, tags: { zodiac: '星座：双鱼/射手', element: '五行：火' } }
])

// 用户见证数据
const testimonials = ref([
  {
    name: '张小姐',
    details: '购买「平衡之境」戒指一个月后',
    content: '佩戴后谈成了重要项目，感觉能量很足！团队沟通也更加顺畅了。',
    image: 'https://a.vpimg4.com/upload/merchandise/382845/HUAN-YD0321007-1.jpg'
  },
  {
    name: '李先生',
    details: '收藏「传承」系列已有半年',
    content: '不仅是珠宝，更是艺术品。每次佩戴都感受到大师的精湛工艺和能量祝福。',
    image: 'https://a.vpimg4.com/upload/merchandise/382845/HUAN-YD0321007-1.jpg'
  }
])

// 最近浏览产品
const recentProducts = ref(products.value.slice(0, 4))

// 计算属性：排序后的产品
const sortedProducts = computed(() => {
  const productsCopy = [...products.value]
  switch (sortBy.value) {
    case 'sales':
      // 模拟按销量排序（实际中会有销量字段）
      return productsCopy.sort((a, b) => (a.isHot === b.isHot ? 0 : a.isHot ? -1 : 1))
    case 'newest':
      // 模拟按新品排序
      return productsCopy.reverse()
    case 'price':
      return productsCopy.sort((a, b) => a.price - b.price)
    default:
      return productsCopy
  }
})

// 方法
const toggleHeroLayout = () => {
  heroLayout.value = heroLayout.value === 'left-right' ? 'right-left' : 'left-right'
  currentHeroImage.value = heroLayout.value === 'left-right'
    ? 'https://a.vpimg4.com/upload/merchandise/382845/HUAN-YD0321007-1.jpg'
    : 'https://a.vpimg4.com/upload/merchandise/382845/HUAN-YD0321007-1.jpg?type=alternate'
}

const navigateToCategory = (categoryId) => {
  // 这里可以跳转到对应分类页面
  console.log('跳转到分类:', categoryId)
}

// 滚动监听
const handleScroll = () => {
  isPersonalizationSticky.value = window.scrollY > 300
}

// 退出意图检测
let mouseLeaveTimer
const handleMouseLeave = (e) => {
  if (e.clientY < 50) {
    mouseLeaveTimer = setTimeout(() => {
      showExitPopup.value = true
    }, 500)
  }
}

const cancelMouseLeave = () => {
  clearTimeout(mouseLeaveTimer)
}

// 登录相关方法
const handleLogin = () => {
  // 简化版登录逻辑
  if (loginEmail.value && loginPassword.value) {
    showLogin.value = false
    alert('登录成功！')
  }
}

const switchToRegister = () => {
  // 切换到注册页面
  showLogin.value = false
  // 这里可以触发显示注册模态框
}

const applyDiscount = () => {
  showExitPopup.value = false
  alert('优惠码 FIRST10 已应用！')
}

// 生命周期
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('mouseleave', handleMouseLeave)
  document.addEventListener('mouseenter', cancelMouseLeave)

  // 自动切换用户见证
  setInterval(() => {
    currentTestimonial.value = (currentTestimonial.value + 1) % testimonials.value.length
  }, 5000)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('mouseleave', handleMouseLeave)
  document.removeEventListener('mouseenter', cancelMouseLeave)
})
</script>

<style scoped>
/* 基础样式 */
.homepage {
  background: linear-gradient(135deg, #0a1128 0%, #1a237e 100%);
  color: #f0f0f0;
  font-family: 'Noto Sans SC', sans-serif;
  min-height: 100vh;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 2.2rem;
  text-align: center;
  margin-bottom: 3rem;
  color: #d4af37;
  font-weight: 300;
  letter-spacing: 1px;
}

.nav-brand h1 {
  color: #d4af37;
  font-size: 1.8rem;
  margin: 0;
  font-weight: 300;
}

/* 英雄区 */
.hero-section {
  padding: 4rem 0;
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-content {
  display: flex;
  align-items: center;
  gap: 4rem;
}

.hero-content.left-right {
  flex-direction: row;
}

.hero-content.right-left {
  flex-direction: row-reverse;
}

.hero-text {
  flex: 1;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #ffffff;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #d4af37;
}

.value-points {
  margin-bottom: 2rem;
}

.value-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.value-icon {
  font-size: 1.5rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-primary {
  background: #d4af37;
  color: #0a1128;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #b8941f;
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: #d4af37;
  border: 1px solid #d4af37;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: rgba(212, 175, 55, 0.1);
}

.hero-visual {
  flex: 1;
  display: flex;
  justify-content: center;
}

.product-visual {
  position: relative;
}

.product-visual img {
  max-width: 100%;
  border-radius: 10px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.floating-tag {
  position: absolute;
  top: -10px;
  left: 20px;
  background: #d4af37;
  color: #0a1128;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.visual-control {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}


.personalization-content p {
  font-size: 1.2rem;
  margin: 0;
}


@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

/* 分类导航 */
.categories-section {
  padding: 4rem 0;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.category-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.category-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(212, 175, 55, 0.3);
}

.category-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.category-name {
  font-size: 1.2rem;
  font-weight: 500;
}

/* 产品网格 */
.products-section {
  padding: 4rem 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.sort-select {
  background: rgba(255, 255, 255, 0.05);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 8px 12px;
  border-radius: 4px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.products-grid.compact {
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.product-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.product-image {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.hot-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #ff4757;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.wishlist-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s;
}

.wishlist-btn:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.1);
}

.product-info {
  padding: 1.5rem;
}

.product-name {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.metaphysical-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  background: rgba(212, 175, 55, 0.2);
  color: #d4af37;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
}

.product-price {
  font-size: 1.3rem;
  font-weight: 600;
  color: #d4af37;
}

/* 高级系列部分 */
.premium-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(10, 17, 40, 0.8) 100%);
}

.premium-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.premium-content {
  display: flex;
  align-items: center;
  gap: 4rem;
}

.premium-text {
  flex: 1;
}

.premium-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #ffffff;
}

.premium-subtitle {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #d4af37;
}

.premium-desc {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.trust-badges {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.trust-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.badge-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.premium-visual {
  flex: 1;
}

.premium-visual img {
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

/* 信任部分 */
.trust-section {
  padding: 4rem 0;
}

.trust-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
}

.testimonials {
  position: relative;
}

.testimonial-slider {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.testimonial-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease;
  display: flex;
  gap: 1.5rem;
}

.testimonial-item.active {
  opacity: 1;
}

.testimonial-content {
  flex: 1;
}

.testimonial-content p {
  font-size: 1.1rem;
  line-height: 1.6;
  font-style: italic;
  margin-bottom: 1rem;
}

.testimonial-author {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
}

.author-details {
  font-size: 0.9rem;
  opacity: 0.7;
}

.testimonial-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
}

.testimonial-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.testimonial-controls {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.testimonial-controls button {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s;
}

.testimonial-controls button.active {
  background: #d4af37;
  transform: scale(1.2);
}

.trust-badges-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.trust-badge-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  transition: all 0.3s;
}

.trust-badge-item.highlight {
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.trust-badge-item:hover {
  transform: translateX(5px);
}

.badge-icon {
  font-size: 2rem;
}

.badge-content {
  display: flex;
  flex-direction: column;
}

.badge-content strong {
  font-size: 1.1rem;
  margin-bottom: 0.2rem;
}

.badge-content span {
  font-size: 0.9rem;
  opacity: 0.7;
}

/* 内容营销部分 */
.content-section {
  padding: 4rem 0;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
}

.blog-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  overflow: hidden;
}

.blog-image {
  height: 200px;
  overflow: hidden;
}

.blog-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.blog-content {
  padding: 1.5rem;
}

.blog-content h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.blog-content p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.btn-text {
  background: none;
  border: none;
  color: #d4af37;
  cursor: pointer;
  font-weight: 500;
  padding: 0;
}

.related-product {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 1.5rem;
}

.product-preview {
  display: flex;
  gap: 1rem;
}

.product-preview img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.product-details {
  flex: 1;
}

.product-details h4 {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.product-details p {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 0.5rem;
}

.btn-small {
  background: #d4af37;
  color: #0a1128;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: 500;
}


/* 最近浏览 */
.recently-viewed {
  padding: 4rem 0;
}



.popup-content h3 {
  margin-bottom: 1rem;
  color: #d4af37;
}

.popup-content p {
  margin-bottom: 1.5rem;
}

/* 登录模态框 */
.login-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #0a1128;
  border: 1px solid rgba(212, 175, 55, 0.5);
  border-radius: 15px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-content h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #d4af37;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-form input {
  padding: 12px 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.login-form a {
  color: #d4af37;
  text-decoration: none;
}

/* 页脚 */
.footer {
  background: rgba(5, 10, 25, 0.9);
  padding: 3rem 0 1rem;
  margin-top: 4rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3,
.footer-section h4 {
  color: #d4af37;
  margin-bottom: 1rem;
}

.footer-section a {
  display: block;
  color: #f0f0f0;
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: #d4af37;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .trust-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    gap: 2rem;
  }

  .hero-title {
    font-size: 2.2rem;
  }

  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .premium-content {
    flex-direction: column;
    gap: 2rem;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .footer-content {
    grid-template-columns: 1fr;
  }
}
</style>
