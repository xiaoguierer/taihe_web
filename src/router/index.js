import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { useAuthStore } from '@/store/auth'

const router = createRouter({
  history: createWebHistory(),
  routes,
  // 路由滚动行为
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  console.log('🛡️ 路由守卫检查--router/index.js輸出:')
  console.log('🛡️ 路由守卫检查:', to.name, '需要登录:', to.meta.requiresAuth)
  console.log('🛡️ 路由守卫详细调试信息:')
  console.log('目标路由:', to.name)
  console.log('需要登录:', to.meta?.requiresAuth)
  console.log('当前authStore:', authStore)
  console.log('当前登录状态:', authStore.isLoggedIn)
  console.log('token值:', authStore.token)
  console.log('用户信息:', authStore.userInfo)


  // 如果需要登录且未登录
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    console.log('❌ 未登录，跳转到登录页')
    next({
      path: '/users/login',
      query: { redirect: to.fullPath } // 记录要跳转的页面
    })
  } else {
    console.log('✅ 已登录或无需登录，放行')
    // 放行
    next()
  }
})

router.afterEach((to, from) => {
  // 页面访问统计
  console.log(`Navigated to: ${to.name}`)
})

export default router

//按模块拆分路由文件（推荐）
