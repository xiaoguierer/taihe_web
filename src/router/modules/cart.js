const cartRoutes = [
  {
    path: '/CartItemCard',
    name: 'CartItemCard',
    component: () => import('@/views/cart/CartItemCard.vue'),
    meta: {
      title: '购物车善品卡片',
      requiresAuth: true
    }
  },{
    path: '/CartSummaryBar',
    name: 'CartSummaryBar',
    component: () => import('@/views/cart/CartSummaryBar.vue'),
    meta: {
      title: '悬浮汇总',
      requiresAuth: true
    }
  }
]

export default cartRoutes
