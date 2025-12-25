const aboutRoutes = [
//用户订单详情
    {
        path: '/about/about-us',
        name: 'about-us',
        component: () => import('@/views/about/about-us.vue'),
        meta: {
            title: 'about-us',
            requiresAuth: false
        }
    },
    {
        path: '/about/brand-story',
        name: 'brand-story',
        component: () => import('@/views/about/brand-story.vue'),
        meta: {
            title: 'brand-story',
            requiresAuth: false
        }
    },
    {
        path: '/about/eastern-hilosophy',
        name: 'eastern-hilosophy',
        component: () => import('@/views/about/eastern-hilosophy.vue'),
        meta: {
            title: 'eastern-hilosophy',
            requiresAuth: false
        }
    },
    {
        path: '/about/energy-philosophy',
        name: 'energy-philosophy',
        component: () => import('@/views/about/energy-philosophy.vue'),
        meta: {
            title: 'energy-philosophy',
            requiresAuth: false
        }
    },
    {
        path: '/about/master-team',
        name: 'master-team',
        component: () => import('@/views/about/master-team.vue'),
        meta: {
            title: 'master-team',
            requiresAuth: false
        }
    }
    ,
    {
        path: '/about/social-responsibility',
        name: 'social-responsibility',
        component: () => import('@/views/about/social-responsibility.vue'),
        meta: {
            title: 'social-responsibility',
            requiresAuth: false
        }
    }
]

export default aboutRoutes
