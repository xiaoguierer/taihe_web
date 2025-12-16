const userRoutes = [
  {
    path: '/users/login',
    name: 'UserLogin',
    component: () => import('@/views/user/UserLogin.vue'),
    meta: {
      title: '用户登录',
      requiresAuth: false
    }
  },
  {
    path: '/users/register',
    name: 'UserRegister',
    component: () => import('@/views/user/UserRegister.vue'),
    meta: {
      title: '用户注册',
      requiresAuth: false
    }
  },
  {
    path: '/UserGetmima',
    name: 'UserGetmima',
    component: () => import('@/views/user/UserGetmima.vue'),
    meta: {
      title: '找回密码',
      requiresAuth: true
    }
  }
  ,
  {
    path: '/UserCenter',
    name: 'UserCenter',
    component: () => import('@/views/user/UserCenter.vue'),
    meta: {
      title: '用户中心',
      requiresAuth: true
    }
  }
  ,
  {
    path: '/UserEdit',
    name: 'UserEdit',
    component: () => import('@/views/user/UserEdit.vue'),
    meta: {
      title: '用户中心-用户信息编辑',
      requiresAuth: true
    }
  }
  ,
  {
    path: '/UserAddresslist',
    name: 'UserAddresslist',
    component: () => import('@/views/user/UserAddresslist.vue'),
    meta: {
      title: '用户中心-收货地址信息维护',
      requiresAuth: true
    }
  }
  ,
  {
    path: '/UserAddressEdit',
    name: 'UserAddressEdit',
    component: () => import('@/views/user/UserAddressEdit.vue'),
    meta: {
      title: '用户中心-编辑收货地址信息',
      requiresAuth: true
    }
  }
  ,
  {
    path: '/UserAddressCreate',
    name: 'UserAddressCreate',
    component: () => import('@/views/user/UserAddressCreate.vue'),
    meta: {
      title: '用户中心-新增收货信息',
      requiresAuth: true
    }
  }
]

export default userRoutes
