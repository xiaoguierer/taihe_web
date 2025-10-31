<template>
  <div class="default-layout">
    <Header />
    <main class="main-content">
      <slot></slot>
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
export default {
  name: 'DefaultLayout',
  components: {
    Header,
    Footer
  }
}
</script>

<style scoped>
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 80px; /* 为固定头部留出空间 */
}
</style>
