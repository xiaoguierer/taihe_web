const homeindexRoutes = [
  {
    path: '/product-spu/selectSpuByIntentId/spu/:intentId',
    name: 'ProductEmotionalList',
    component: () => import('/src/views/home/ProductEmotionalList.vue'),
    meta: {
      title: '情感意愿商品列表',
      requiresAuth: false
    }
  }
]

export default homeindexRoutes
