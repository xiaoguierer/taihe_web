const homeindexRoutes = [
  //根据商品SPU id展示商品详情和sku详情
  {
    path: '/product-spu/getByid/:id',
    name: 'ProductDetailList',
    component: () => import('/src/views/home/ProductDetailList.vue'),
    meta: {
      title: '商品SPU详情',
      requiresAuth: false
    }
  },
  // 根据情感意愿id展示情感意愿和spu
  {
    path: '/product-spu/selectSpuByIntentId/spu/:intentId',
    name: 'ProductEmotionalList',
    component: () => import('/src/views/home/ProductEmotionalList.vue'),
    meta: {
      title: '情感意愿商品列表',
      requiresAuth: false
    }
  },
  //根据情感意愿、标签展示商品SPU列表
  {
    path: '/product-spu/getProductsByIntentAndTag/:intentId/:tagId',
    name: 'ProductEmotionalTargetList',
    component: () => import('/src/views/home/ProductEmotionalTargetList.vue'),
    meta: {
      title: '商品SPU列表',
      requiresAuth: false
    }
  },
  //参数获取
  // import { useRoute } from 'vue-router'
  // const route = useRoute()
  // console.log('intentId:', route.params.intentId) // EI_PROTECT_CORE
  // console.log('tagId:', route.params.tagId)       // A0001


  //情感意图 emotionalIntent
  {
    path: '/emotional-intent/getByid/:id',
    name: 'EmotionalIntentList',
    component: () => import('/src/views/emotionalIntent/EmotionalIntentList.vue'),
    meta: {
      title: '情感意图详情',
      requiresAuth: false
    }
  },
]

export default homeindexRoutes
