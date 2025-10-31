<template>
  <div class="home-view">
    <!-- 第二部分：全屏图片 -->
    <section class="hero-section">
      <div class="hero-text">
        <div class="hero-line1">东方雅韵 · 玉见美好</div>
        <div class="hero-line2">传承千年的东方美学</div>
        <div class="hero-line3">精选上等和田玉与翡翠，融合传统工艺与现代设计，打造具有东方美学的高端珠宝。每一件作品都蕴含着深厚的文化底蕴与匠心精神。</div>
      </div>
    </section>

    <!-- 第三部分：媒体背书 -->
    <section class="media-section">
      <h2 class="section-title">媒体认可</h2>
      <div class="media-container">
        <div class="media-logo" v-for="media in mediaLogos" :key="media" @click="handleMediaClick(media)">
          {{ media }}
        </div>
      </div>
    </section>

    <!-- 第四部分：双图展示 -->
    <section class="double-image-section">
      <h2 class="section-title">雅韵臻选</h2>
      <div class="image-pair">
        <div class="image-item" @click="navigateTo('/hetianyu')">
          <div class="image-placeholder">和田玉系列</div>
          <div class="image-text">
            <div class="text-line1">温润如玉</div>
            <div class="text-line2">精选上等和田白玉，质地温润细腻，雕刻精美如意纹样，寓意平安吉祥，福泽绵长。</div>
          </div>
        </div>
        <div class="image-item" @click="navigateTo('/feicui')">
          <div class="image-placeholder">翡翠珍品</div>
          <div class="image-text">
            <div class="text-line1">翠色欲滴</div>
            <div class="text-line2">A级翡翠配以18K黄金，传统招财辟邪之宝，守护财运，寓意财源广进，富贵吉祥。</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 第五部分：四图展示 -->
    <section class="four-image-section">
      <h2 class="section-title">热门系列</h2>
      <div class="four-image-container">
        <div class="small-image-item" v-for="series in hotSeries" :key="series.id"
             @click="navigateTo(series.path)"
             @mousedown="scaleImage($event, 0.98)"
             @mouseup="scaleImage($event, 1)"
             @mouseleave="scaleImage($event, 1)">
          <div class="small-image-placeholder">{{ series.name }}</div>
        </div>
      </div>
    </section>

    <!-- 第六部分：图文展示 -->
    <section class="text-image-section">
      <h2 class="section-title">玉之文化</h2>
      <div class="text-image-container">
        <div class="text-image-left" @click="navigateTo('/culture')">
          玉器文化图片
        </div>
        <div class="text-image-right">
          <h3 class="article-title">玉，石之美者</h3>
          <p class="article-content">
            在中国传统文化中，玉被赋予了仁、义、智、勇、洁五种美德，是君子品格的象征。
            自古以来，玉便是沟通天地的神器，象征权力与地位的礼器，以及寄托美好愿望的饰品。
            我们的每一件作品都严格遵循传统工艺，从选料、设计、雕刻到抛光，均由经验丰富的匠人手工完成。
          </p>
        </div>
      </div>
    </section>

    <!-- 第七部分：四图展示 -->
    <section class="second-four-image-section">
      <h2 class="section-title">匠心之作</h2>
      <div class="four-image-container">
        <div class="small-image-item" v-for="craft in craftsmanship" :key="craft.id"
             @click="navigateTo(craft.path)"
             @mousedown="scaleImage($event, 0.98)"
             @mouseup="scaleImage($event, 1)"
             @mouseleave="scaleImage($event, 1)">
          <div class="small-image-placeholder">{{ craft.name }}</div>
        </div>
      </div>
    </section>

    <!-- 第八部分：链接展示 -->
    <section class="links-section">
      <div class="links-container">
        <div class="links-column">
          <h3>产品系列</h3>
          <a href="#" v-for="link in productLinks" :key="link.text"
             @click.prevent="navigateTo(link.path)"
             @mousedown="changeLinkColor($event, '#5d4037')"
             @mouseup="changeLinkColor($event, '')"
             @mouseleave="changeLinkColor($event, '')">
            {{ link.text }}
          </a>
        </div>
        <div class="links-column">
          <h3>服务支持</h3>
          <a href="#" v-for="link in serviceLinks" :key="link.text"
             @click.prevent="navigateTo(link.path)"
             @mousedown="changeLinkColor($event, '#5d4037')"
             @mouseup="changeLinkColor($event, '')"
             @mouseleave="changeLinkColor($event, '')">
            {{ link.text }}
          </a>
        </div>
        <div class="links-column">
          <h3>关于我们</h3>
          <a href="#" v-for="link in aboutLinks" :key="link.text"
             @click.prevent="navigateTo(link.path)"
             @mousedown="changeLinkColor($event, '#5d4037')"
             @mouseup="changeLinkColor($event, '')"
             @mouseleave="changeLinkColor($event, '')">
            {{ link.text }}
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      mediaLogos: ['TikTok', 'YouTube', 'Instagram', 'VOGUE', 'ELLE', 'Harper\'s Bazaar'],
      hotSeries: [
        { id: 1, name: '平安扣系列', path: '/pingankou' },
        { id: 2, name: '龙凤对牌', path: '/longfeng' },
        { id: 3, name: '貔貅手串', path: '/pixiu' },
        { id: 4, name: '佛珠项链', path: '/fozhu' }
      ],
      craftsmanship: [
        { id: 1, name: '金镶玉系列', path: '/jinxiangyu' },
        { id: 2, name: '古法黄金', path: '/gufahuangjin' },
        { id: 3, name: '彩宝配饰', path: '/caibao' },
        { id: 4, name: '定制珠宝', path: '/custom' }
      ],
      productLinks: [
        { text: '和田玉系列', path: '/hetianyu' },
        { text: '翡翠珍品', path: '/feicui' },
        { text: '金镶玉饰', path: '/jinxiangyu' },
        { text: '生肖主题', path: '/shengxiao' },
        { text: '婚庆珠宝', path: '/wedding' }
      ],
      serviceLinks: [
        { text: '购买指南', path: '/guide' },
        { text: '配送信息', path: '/delivery' },
        { text: '退换政策', path: '/return' },
        { text: '珠宝保养', path: '/maintenance' },
        { text: '定制服务', path: '/custom' }
      ],
      aboutLinks: [
        { text: '品牌故事', path: '/story' },
        { text: '匠人团队', path: '/team' },
        { text: '媒体报导', path: '/media' },
        { text: '招贤纳士', path: '/careers' },
        { text: '联系我们', path: '/contact' }
      ]
    }
  },
  methods: {
    navigateTo(path) {
      // 在实际应用中，这里应该使用Vue Router进行路由跳转
      console.log('导航到:', path);
      // this.$router.push(path);

      // 临时效果：平滑滚动到顶部
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    },
    handleMediaClick(media) {
      console.log('点击媒体:', media);
    },
    scaleImage(event, scale) {
      event.currentTarget.style.transform = `scale(${scale})`;
      event.currentTarget.style.transition = 'transform 0.15s ease';
    },
    changeLinkColor(event, color) {
      event.currentTarget.style.color = color;
      event.currentTarget.style.transition = 'color 0.3s ease';
    }
  },
  mounted() {
    console.log('首页组件加载完成');
  }
}
</script>

<style>
/* 引入首页专用样式 */
@import url('@/styles/index.css');
/* 首页组件特有样式 */
.home-view {
  min-height: 100vh;
}
/* 响应式设计 */
@media (max-width: 768px) {
  .home-view {
    padding: 0 16px;
  }
}
</style>
