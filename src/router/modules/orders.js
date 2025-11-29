const orderRoutes = [
//用户订单详情
  {
    path: '/order-item/order/:orderId',
    name: 'OrderDatil',
    component: () => import('@/views/orders/OrderDatil.vue'),
    meta: {
      title: '订单详情',
      requiresAuth: true
    }
  },
  {
    path: '/OrderCard',
    name: 'OrderCard',
    component: () => import('@/views/orders/OrderCard.vue'),
    meta: {
      title: '服务订单',
      requiresAuth: true
    }
  }
]

export default orderRoutes
