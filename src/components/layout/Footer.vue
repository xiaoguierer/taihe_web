<template>
  <!-- 页脚 -->
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>太和珠宝</h3>
          <a href="#">联系我们</a>
          <a href="#">品牌故事</a>
          <a href="#">东方哲学</a>
        </div>
        <div class="footer-section">
          <h4>客户服务</h4>
          <a href="#">配送信息</a>
          <a href="#">退换政策</a>
          <a href="#">保养指南</a>
        </div>
        <div class="footer-section">
          <h4>关于我们</h4>
          <a href="#">能量哲学</a>
          <a href="#">大师团队</a>
          <a href="#">社会责任</a>
        </div>
        <div class="footer-section">
          <h4>关注我们</h4>
          <a href="#">微信</a>
          <a href="#">微博</a>
          <a href="#">小红书</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>©2026 太和珠宝 版权所有</p>
        <p>©TAIHE 高端珠宝 | 传承东方美学，演绎玉之雅韵</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>

/* 页脚 */
.footer {
  background: rgba(5, 10, 25, 0.9);
  padding: 3rem 0 1rem;
  margin: 0 auto;
  width: 100%; /* 确保宽度为100% */
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

  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {

  .footer-content {
    grid-template-columns: 1fr;
  }
}

</style>
