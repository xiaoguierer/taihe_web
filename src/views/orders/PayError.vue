<template>
  <div class="pay-error-container">
    <div style="color: red; font-size: 24px; padding: 20px; background: yellow;">
      ✅ 路由测试成功！如果看到这个文字，说明路由系统正常
      当前路由: {{ $route.path }}
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const $route = useRoute()
console.log('当前路由信息:', $route)

onMounted(() => {
  console.log('PayError组件已挂载')
  // 检查DOM元素是否存在
  const container = document.getElementById('pay-error-container')
  console.log('容器元素:', container)

  // 检查body和html的高度
  console.log('body高度:', document.body.offsetHeight)
  console.log('html高度:', document.documentElement.offsetHeight)
})
</script>
<style scoped>
.pay-error-container {
  min-height: 100vh;
  padding-top: 50px; /* 为顶部元素留出空间 */
  background: #f8f8f8;
  display: flex;
  justify-content: center;
}
</style>
