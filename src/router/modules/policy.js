const policyRoutes = [
  {
    path: '/Police',
    name: 'Police',
    component: () => import('@/views/policy/Police.vue'),
    meta: {
      title: '政策列表',
      requiresAuth: true
    }
  },
  {
    path: '/Service',
    name: 'Service',
    component: () => import('@/views/policy/Service.vue'),
    meta: {
      title: '服务详情',
      requiresAuth: true
    }
  }
]

export default policyRoutes
