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
  },
  {
    path: '/orders/OrderConfirmation',
    name: 'OrderConfirmation',
    component: () => import('@/views/orders/OrderConfirmation.vue'),
    meta: {
      title: '订单确认',
      requiresAuth: true
    }
  },
  {
    path: '/orders/PaymentChannel',
    name: 'PaymentChannel',
    component: () => import('@/views/orders/PaymentChannel.vue'),
    meta: {
      title: '支付渠道',
      requiresAuth: true
    }
  },
  {
    path: '/orders/PaySuccess',
    name: 'PaySuccess',
    component: () => import('@/views/orders/PaySuccess.vue'),
    meta: {
      title: '支付成功',
      requiresAuth: true
    }
  },
  {
    path: '/orders/PayError',
    name: 'PaySuccess',
    component: () => import('@/views/orders/PayError.vue'),
    meta: {
      title: '支付失败',
      requiresAuth: true
    }
  }
]

export default orderRoutes
