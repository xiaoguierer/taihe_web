import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/UserLogin',
    name: 'UserLogin',
    component: () => import('@/views/user/UserLogin.vue')
  },
  {
    path: '/UserRegister',
    name: 'UserRegister',
    component: () => import('@/views/user/UserRegister.vue')
  },
  {
    path: '/UserGetmima',
    name: 'UserGetmima',
    component: () => import('@/views/user/UserGetmima.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
