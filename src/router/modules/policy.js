const policyRoutes = [
  {
    path: '/Police',
    name: 'Police',
    component: () => import('@/views/policy/Police.vue'),
    meta: {
      title: '政策列表',
      requiresAuth: false
    }
  },
  {
    path: '/Service',
    name: 'Service',
    component: () => import('@/views/policy/Service.vue'),
    meta: {
      title: '服务详情',
      requiresAuth: false
    }
  }
]

export default policyRoutes
