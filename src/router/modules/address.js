const addressRoutes = [
  {
    path: '/AddressPage',
    name: 'AddressPage',
    component: () => import('@/views/address/AddressPage.vue'),
    meta: {
      title: '收货地址',
      requiresAuth: true
    }
  }
]

export default addressRoutes
