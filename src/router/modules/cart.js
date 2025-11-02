const cartRoutes = [
  {
    path: '/CartPage',
    name: 'CartPage',
    component: () => import('@/views/cart/CartPage.vue'),
    meta: {
      title: '购物车列表',
      requiresAuth: false
    }
  },{
    path: '/CartItemCard',
    name: 'CartItemCard',
    component: () => import('@/views/cart/CartItemCard.vue'),
    meta: {
      title: '购物车善品卡片',
      requiresAuth: false
    }
  },{
    path: '/CartSummaryBar',
    name: 'CartSummaryBar',
    component: () => import('@/views/cart/CartSummaryBar.vue'),
    meta: {
      title: '悬浮汇总',
      requiresAuth: false
    }
  }
]

export default cartRoutes
