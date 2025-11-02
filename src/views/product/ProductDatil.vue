<template>
  <div class="product-detail-page">
    <!-- 第一部分：商品展示区 -->
    <section class="product-display-section">
      <div class="display-container">
        <!-- 左侧图片展示区 -->
        <div class="image-section">
          <div class="thumbnail-container">
            <div
              v-for="(img, index) in thumbnails"
              :key="index"
              class="thumbnail-item"
              :class="{ active: currentImageIndex === index }"
              @click="currentImageIndex = index"
            >
              <img :src="img.src" :alt="img.alt" />
            </div>
          </div>
          <div class="main-image">
            <img :src="thumbnails[currentImageIndex].src" :alt="thumbnails[currentImageIndex].alt" />
          </div>
        </div>

        <!-- 右侧信息展示区 -->
        <div class="info-section">
          <div class="product-info">
            <h1 class="product-name">【沧海月明】蓝宝石吊坠</h1>
            <p class="product-subtitle">- 守护直觉与沟通的智慧之石 -</p>

            <div class="metaphysical-tags">
              <div class="tag-item">
                <span class="icon">♏️</span>
                <span>星座：天蝎/双鱼</span>
              </div>
              <div class="tag-item">
                <span class="icon">💧</span>
                <span>五行：水</span>
              </div>
              <div class="tag-item">
                <span class="icon">🌀</span>
                <span>脉轮：喉轮</span>
              </div>
              <div class="tag-item">
                <span class="icon">🧠</span>
                <span>寓意：智慧/守护</span>
              </div>
            </div>

            <div class="price-section">
              <span class="price">￥12,800</span>
            </div>

            <div class="trust-badges">
              <div class="badge-item">
                <span class="icon">⛭</span>
                <span>全球免邮</span>
              </div>
              <div class="badge-item">
                <span class="icon">📜</span>
                <span>GIA认证</span>
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

            <div class="action-buttons">
              <button class="btn-primary">🛒 加入购物车</button>
              <button class="btn-secondary">❤️ 加入心愿单</button>
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
            <div v-if="activeTab === 0" class="tab-panel">
              <h3>这件珠宝的起源</h3>
              <p><strong>灵感叙事：</strong>「沧海月明」的灵感，源于唐代诗人李商隐那句'沧海月明珠有泪'。我们想象，每一颗深海蓝宝石，都是凝固的月光与泪珠，承载着千年的智慧与深情。</p>
              <p><strong>宝石寓意：</strong>主石选用矢车菊蓝宝石，在能量学中被誉为'真理之石'，它能激活喉轮，助您清晰表达内心所想，并在重要沟通中带来冷静与智慧。</p>
              <p><strong>设计哲学：</strong>不对称的泪滴造型，暗合道家'阴中有阳'的平衡之道。并非完美的对称，才是世间最动人的和谐。</p>
              <p><strong>大师寄语：</strong>本品特邀新加坡风水大师陈先生进行能量祝福，愿为其主人带来清明与守护。</p>
              <div class="master-signature">
                <img src="https://b0.bdstatic.com/ugc/22nlEjz2oaIJdXj0rhV44g85ead81e3ac1dc17f2b17201df096af4.jpg" alt="大师签名" />
              </div>
            </div>

            <div v-if="activeTab === 1" class="tab-panel">
              <h3>可佩戴的艺术</h3>
              <div class="specs-list">
                <div class="spec-item">
                  <span class="icon">💎</span>
                  <div class="spec-details">
                    <strong>主石：</strong>天然矢车菊蓝宝石，1.5克拉，椭圆形切割，产地斯里兰卡。
                  </div>
                </div>
                <div class="spec-item">
                  <span class="icon">⚱️</span>
                  <div class="spec-details">
                    <strong>金属：</strong>18K玫瑰金，重3.2克。
                  </div>
                </div>
                <div class="spec-item">
                  <span class="icon">🔧</span>
                  <div class="spec-details">
                    <strong>工艺：</strong>意大利手工微钉镶工艺，确保宝石稳固且最大限度折射光芒。
                  </div>
                </div>
                <div class="spec-item">
                  <span class="icon">📏</span>
                  <div class="spec-details">
                    <strong>尺寸：</strong>吊坠尺寸为20mm x 15mm。
                  </div>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 2" class="tab-panel">
              <h3>您的专属能量搭配</h3>
              <div class="recommendations">
                <div class="recommendation-item">
                  <p><strong>场景1：</strong>想增强沟通力？可搭配同系列「清音」海蓝宝耳钉，协同激活能量。</p>
                </div>
                <div class="recommendation-item">
                  <p><strong>场景2：</strong>根据您的金牛座特质，这款黄水晶「丰饶」手链能助您稳固财富能量。</p>
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
        <div class="testimonials">
          <h2 class="section-title">能量见证</h2>
          <div class="testimonial-cards">
            <div class="testimonial-card" v-for="(testimonial, index) in testimonials" :key="index">
              <div class="user-info">
                <span class="user-name">{{ testimonial.name }}</span>
                <span class="user-zodiac">{{ testimonial.zodiac }}</span>
                <span class="purchase-date">{{ testimonial.date }}</span>
              </div>
              <p class="testimonial-content">{{ testimonial.content }}</p>
              <div class="user-image" v-if="testimonial.image">
                <img :src="testimonial.image" :alt="testimonial.name" />
              </div>
            </div>
          </div>
        </div>

        <div class="faq-section">
          <h2 class="section-title">常见疑问</h2>
          <div class="accordion">
            <div
              v-for="(faq, index) in faqs"
              :key="index"
              class="accordion-item"
            >
              <div
                class="accordion-header"
                @click="toggleFaq(index)"
              >
                <span>Q: {{ faq.question }}</span>
                <span class="accordion-icon">{{ expandedFaq === index ? '−' : '+' }}</span>
              </div>
              <div
                class="accordion-content"
                :class="{ expanded: expandedFaq === index }"
              >
                <p>A: {{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 第四部分：个性化推荐与行动闭环 -->
    <section class="recommendation-section">
      <div class="section-container">
        <h2 class="section-title">需要增强其他能量？</h2>
        <div class="energy-filters">
          <span
            v-for="(filter, index) in energyFilters"
            :key="index"
            class="energy-filter"
            :class="{ active: activeFilter === index }"
            @click="activeFilter = index"
          >
            {{ filter }}
          </span>
        </div>
        <div class="product-cards">
          <div class="product-card" v-for="(product, index) in recommendedProducts" :key="index">
            <div class="product-image">
              <img :src="product.image" :alt="product.name" />
            </div>
            <div class="product-info">
              <h4 class="product-title">{{ product.name }}</h4>
              <div class="product-tags">
                <span class="tag" v-for="(tag, tagIndex) in product.tags" :key="tagIndex">{{ tag }}</span>
              </div>
              <div class="product-price">{{ product.price }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 底部浮动行动栏 -->
<!--    <div class="floating-action-bar" :class="{ visible: isActionBarVisible }">-->
<!--      <div class="action-bar-content">-->
<!--        <div class="product-preview">-->
<!--          <img :src="thumbnails[0].src" alt="产品预览" />-->
<!--          <div class="preview-info">-->
<!--            <span class="product-name">【沧海月明】蓝宝石吊坠</span>-->
<!--            <span class="product-price">￥12,800</span>-->
<!--          </div>-->
<!--        </div>-->
<!--        <button class="btn-primary">加入购物车</button>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 响应式数据
const currentImageIndex = ref(0)
const activeTab = ref(0)
const expandedFaq = ref(0)
const activeFilter = ref(0)
const isActionBarVisible = ref(false)

// 图片数据
const thumbnails = ref([
  { src: 'https://b0.bdstatic.com/ugc/22nlEjz2oaIJdXj0rhV44g85ead81e3ac1dc17f2b17201df096af4.jpg', alt: '整体图' },
  { src: 'https://b0.bdstatic.com/ugc/22nlEjz2oaIJdXj0rhV44g85ead81e3ac1dc17f2b17201df096af4.jpg', alt: '宝石切面特写' },
  { src: 'https://b0.bdstatic.com/ugc/22nlEjz2oaIJdXj0rhV44g85ead81e3ac1dc17f2b17201df096af4.jpg', alt: '镶嵌工艺特写' },
  { src: 'https://b0.bdstatic.com/ugc/22nlEjz2oaIJdXj0rhV44g85ead81e3ac1dc17f2b17201df096af4.jpg', alt: '刻印Logo特写' },
  { src: 'https://b0.bdstatic.com/ugc/22nlEjz2oaIJdXj0rhV44g85ead81e3ac1dc17f2b17201df096af4.jpg', alt: '模特佩戴图' },
  { src: 'https://b0.bdstatic.com/ugc/22nlEjz2oaIJdXj0rhV44g85ead81e3ac1dc17f2b17201df096af4.jpg', alt: '尺寸标注图' },
  { src: 'https://b0.bdstatic.com/ugc/22nlEjz2oaIJdXj0rhV44g85ead81e3ac1dc17f2b17201df096af4.jpg', alt: '包装图' }
])

// Tab数据
const tabs = ref([
  { title: '能量故事' },
  { title: '工艺与材质' },
  { title: '专属推荐' }
])

// 用户见证数据
const testimonials = ref([
  {
    name: 'Catherine L.',
    zodiac: '天蝎座',
    date: '2023-10-15',
    content: '佩戴一个月，在每次重要会议前都会握住它静心，感觉表达更自信了。',
    image: 'https://img0.baidu.com/it/u=797264583,1900186394&fm=253&app=138&f=JPEG?w=800&h=1200'
  },
  {
    name: '张小姐',
    zodiac: '双鱼座',
    date: '2023-09-22',
    content: '蓝宝石的光泽非常迷人，佩戴后感觉沟通更加顺畅，同事都说我最近表达更清晰了。'
  },{
    name: 'Catherine L.',
    zodiac: '天蝎座',
    date: '2023-10-15',
    content: '佩戴一个月，在每次重要会议前都会握住它静心，感觉表达更自信了。',
    image: 'https://img0.baidu.com/it/u=797264583,1900186394&fm=253&app=138&f=JPEG?w=800&h=1200'
  },
  {
    name: '张小姐',
    zodiac: '双鱼座',
    date: '2023-09-22',
    content: '蓝宝石的光泽非常迷人，佩戴后感觉沟通更加顺畅，同事都说我最近表达更清晰了。'
  },{
    name: 'Catherine L.',
    zodiac: '天蝎座',
    date: '2023-10-15',
    content: '佩戴一个月，在每次重要会议前都会握住它静心，感觉表达更自信了。',
    image: 'https://img0.baidu.com/it/u=797264583,1900186394&fm=253&app=138&f=JPEG?w=800&h=1200'
  },
  {
    name: '张小姐',
    zodiac: '双鱼座',
    date: '2023-09-22',
    content: '蓝宝石的光泽非常迷人，佩戴后感觉沟通更加顺畅，同事都说我最近表达更清晰了。'
  }
])

// FAQ数据
const faqs = ref([
  {
    question: '如何清洁和保养这件珠宝？',
    answer: '建议每月用软布和清水擦拭...也可使用随赠的白水晶簇进行能量净化。'
  },
  {
    question: '是否可以调节链长？',
    answer: '是的，我们提供免费调节一次的服务...'
  },{
    question: '如何清洁和保养这件珠宝？',
    answer: '建议每月用软布和清水擦拭...也可使用随赠的白水晶簇进行能量净化。'
  },
  {
    question: '是否可以调节链长？',
    answer: '是的，我们提供免费调节一次的服务...'
  }
])

// 能量筛选器
const energyFilters = ref(['❤️ 爱情', '💰 财富', '🛡️ 保护', '☯️ 平衡'])

// 推荐产品数据
const recommendedProducts = ref([
  {
    name: '【清音】海蓝宝耳钉',
    price: '￥6,800',
    image: 'https://img0.baidu.com/it/u=797264583,1900186394&fm=253&app=138&f=JPEG?w=800&h=1200',
    tags: ['沟通', '喉轮', '水元素']
  },
  {
    name: '【丰饶】黄水晶手链',
    price: '￥4,200',
    image: 'https://img0.baidu.com/it/u=797264583,1900186394&fm=253&app=138&f=JPEG?w=800&h=1200',
    tags: ['财富', '土元素', '金牛座']
  },{
    name: '【清音】海蓝宝耳钉',
    price: '￥6,800',
    image: 'https://img0.baidu.com/it/u=797264583,1900186394&fm=253&app=138&f=JPEG?w=800&h=1200',
    tags: ['沟通', '喉轮', '水元素']
  },
  {
    name: '【丰饶】黄水晶手链',
    price: '￥4,200',
    image: 'https://img0.baidu.com/it/u=797264583,1900186394&fm=253&app=138&f=JPEG?w=800&h=1200',
    tags: ['财富', '土元素', '金牛座']
  },
])

// 方法
const toggleFaq = (index) => {
  expandedFaq.value = expandedFaq.value === index ? -1 : index
}

// 滚动监听
const handleScroll = () => {
  isActionBarVisible.value = window.scrollY > 300
}

// 生命周期
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
@import url('@/styles/product/productdetail.css');
</style>
