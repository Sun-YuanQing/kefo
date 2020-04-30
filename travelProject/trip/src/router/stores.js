export const stores = [
    {
        path: '/check',
        name: 'check',
        meta: {
          parentName: 'stores',
        },
        component: () => import('../views/stores/check.vue'),
      },
      {
        path: '/storeDetail',
        name: 'storeDetail',
        meta: {
          parentName: 'stores',
        },
        component: () => import('../views/stores/detail.vue'),
      },
      {
        path: '/storeEdit',
        name: 'storeEdit',
        meta: {
          parentName: 'stores',
        },
        component: () => import('../views/stores/edit.vue'),
      },
      {
        path: '/examine',
        name: 'examine',
        meta: {
          parentName: 'stores',
        },
        component: () => import('../views/stores/examine.vue'),
      },
]