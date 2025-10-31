const productRoutes = [
  {
    path: '/ProductList',
    name: 'ProductList',
    component: () => import('@/views/product/ProductList.vue'),
    meta: {
      title: '商品列表',
      requiresAuth: false  // 设置为true 则需要登录
    }
  },
  {
    path: '/ProductDatil',
    name: 'ProductDatil',
    component: () => import('@/views/product/ProductDatil.vue'),
    meta: {
      title: '商品详情',
      requiresAuth: false
    }
  }
]

export default productRoutes
