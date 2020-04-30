export const marketing = [
    {
        path: '/seckill',
        meta: {
            parentName: 'marketing',
            name: '秒杀',
            key: 'seckill'
        },
        component: () => import('../views/marketing/seckill/index.vue'),
    },
    {
        path: '/seckillDetail',
        meta: {
            parentName: 'marketing',
            name: '秒杀详情',
            key: 'seckillDetail'
        },
        component: () => import('../views/marketing/seckill/seckill-detail.vue'),
    },
    {
        path: '/editSeckill',
        meta: {
            parentName: 'marketing',
            name: '编辑秒杀',
            key: 'editSeckill'
        },
        component: () => import('../views/marketing/seckill/edit-seckill.vue'),
    },
    {
        path: '/groupBuying',
        meta: {
            parentName: 'marketing',
            name: '拼团',
            key: 'groupBuying'
        },
        component: () => import('../views/marketing/group-buying/index.vue'),
    },
    {
        path: '/groupBuyingDetail',
        meta: {
            parentName: 'marketing',
            name: '拼团详情',
            key: 'groupBuyingDetail'
        },
        component: () => import('../views/marketing/group-buying/group-buying-detail.vue'),
    },
    {
        path: '/editGroupBuying',
        meta: {
            parentName: 'marketing',
            name: '编辑拼团',
            key: 'editGroupBuying'
        },
        component: () => import('../views/marketing/group-buying/edit-group-buying.vue'),
    },
    {
        path: '/distributor',
        meta: {
            parentName: 'marketing',
            name: '分销员',
            key: 'distributor'
        },
        component: () => import('../views/marketing/distributor/index.vue'),
    },
    {
        path: '/distributorDetail',
        meta: {
            parentName: 'marketing',
            name: '分销员详情',
            key: 'distributorDetail'
        },
        component: () => import('../views/marketing/distributor/distributor-detail.vue'),
    },
]

