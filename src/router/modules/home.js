const homeindexRoutes = [
  //根据商品SPU 唯一标识展示商品详情和sku详情以及五行表数据信息
  {
    path: '/product-spu/getByid/:id',
    name: 'ProductDetailList',
    component: () => import('/src/views/home/ProductDetailList.vue'),
    meta: {
      title: '商品SPU详情',
      requiresAuth: false
    }
  },
  // 情感意愿详情
  {
    path: '/emotional-intent/getByid/:id',
    name: 'EmotionalDetail',
    component: () => import('/src/views/emotionalIntent/EmotionalDetail.vue'),
    meta: {
      title: '情感意愿详情',
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
  //根据情感意愿、类型标签展示商品SPU列表
  {
    path: '/product-spu/getProductsByIntentAndTag/:intentId/:tagId',
    name: 'ProductsByIntentAndTagList',
    component: () => import('/src/views/home/ProductsByIntentAndTagList.vue'),
    meta: {
      title: '商品SPU列表',
      requiresAuth: false
    }
  },
  //根据情感意愿、五行能量标签展示商品SPU列表
  {
    path: '/product-spu/getProductsByIntentAndElementTag/:intentId/:elementTagId',
    name: 'ProductsByIntentAndElementTagList',
    component: () => import('/src/views/home/ProductsByIntentAndElementTagList.vue'),
    meta: {
      title: '商品SPU列表',
      requiresAuth: false
    }
  },
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
  //五行
  {
    path: '/wu-xing-attributes/getById/:id',
    name: 'WuXingDatil',
    component: () => import('/src/views/wuxing/WuXingDatil.vue'),
    meta: {
      title: '五行详情',
      requiresAuth: false
    }
  },
  // 购物车列表
  {
    path: '/shopingcart/page',
    name: 'CartPage',
    component: () => import('@/views/cart/CartPage.vue'),
    meta: {
      title: '购物车列表',
      requiresAuth: true
    }
  },
  // 订单列表
  {
    path: '/order/page',
    name: 'OrderList',
    component: () => import('@/views/orders/OrderList.vue'),
    meta: {
      title: '购物车列表',
      requiresAuth: true
    }
  },
  // 用户注册
  {
    path: '/users/register',
    name: 'UserRegister',
    component: () => import('@/views/user/UserRegister.vue'),
    meta: {
      title: '用户注册',
      requiresAuth: false
    }
  },
  //用户登录
  {
    path: '/users/login',
    name: 'UserLogin',
    component: () => import('@/views/user/UserLogin.vue'),
    meta: {
      title: '用户登录',
      requiresAuth: false
    }
  },
  //用户中心
  {
    path: '/users/:id',
    name: 'UserInfor',
    component: () => import('@/views/user/UserInfor.vue'),
    meta: {
      title: '用户中心',
      requiresAuth: false
    }
  },
]

export default homeindexRoutes
