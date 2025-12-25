<template>
  <!-- Footer -->
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Zeniul Jewelry</h3>
          <router-link to="/about/about-us">About Us</router-link>
          <router-link to="/about/brand-story">Brand Story</router-link>
        </div>
        <div class="footer-section">
          <h4>Service</h4>
          <router-link to="/about/eastern-hilosophy">Eastern Philosophy </router-link>
          <router-link to="/about/energy-philosophy">Energy Philosophy</router-link>
        </div>
        <div class="footer-section">
          <h4>About</h4>
          <a href="#">Master Team</a>
          <a href="#">Social Responsibility</a>
        </div>
        <div class="footer-section">
          <h4>Follow Us</h4>
          <a href="#">WeChat</a>
          <a href="#">Weibo</a>
          <a href="#">Little Red Book</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>©2026 Zeniul Jewelry. All Rights Reserved.</p>
        <p>©ZENIUL High Jewelry | Inheriting Eastern Aesthetics, Interpreting the Elegance of Jade</p>
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
/* 保持原有样式不变，添加路由链接样式 */
.footer-section a,
.footer-section router-link {
  display: block;
  color: #f0f0f0;
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: color 0.3s;
}

.footer-section a:hover,
.footer-section router-link:hover {
  color: #d4af37;
}
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
