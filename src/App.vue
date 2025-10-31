<template>
  <div id="app">
    <!-- 头部导航组件 -->
    <Header />
    <!-- 路由出口，首页内容会在这里渲染 -->
    <main class="main-content">
      <router-view></router-view>
    </main>

    <!-- 页脚组件 -->
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  }
}
</script>

<style>
/* 全局基础样式 */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style>
