import userRoutes from './modules/user'
import policyRoutes from './modules/policy'
import productRoutes from './modules/product'

// 自动加载所有模块
const modules = import.meta.glob('./modules/*.js', { eager: true })

// 方法1：手动导入（推荐，清晰明确）
export const routes = [
  // 首页
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: '首页',
      requiresAuth: false
    }
  },
  // 用户模块
  ...userRoutes,
  // 政策模块
  ...policyRoutes,
  //商品没款
  ...productRoutes,
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '页面未找到'
    }
  }
]

// 方法2：自动导入所有模块
export const autoRoutes = Object.values(modules).flatMap(module =>
  module.default || []
)
