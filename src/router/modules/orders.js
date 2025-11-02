const orderRoutes = [
  {
    path: '/OrderList',
    name: 'OrderList',
    component: () => import('@/views/orders/OrderList.vue'),
    meta: {
      title: '订单列表',
      requiresAuth: false
    }
  },
  {
    path: '/OrderDatil',
    name: 'OrderDatil',
    component: () => import('@/views/orders/OrderDatil.vue'),
    meta: {
      title: '服务详情',
      requiresAuth: false
    }
  },
  {
    path: '/OrderCard',
    name: 'OrderCard',
    component: () => import('@/views/orders/OrderCard.vue'),
    meta: {
      title: '服务订单',
      requiresAuth: false
    }
  }
]

export default orderRoutes
