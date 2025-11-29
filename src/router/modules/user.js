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
]

export default userRoutes
