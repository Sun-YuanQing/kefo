export const setting = [{
        path: 'merchant',
        meta: {
            parentName: 'setting',
            name: '商家设置'
        },
        redirect: '/setting/merchant/info',
        component: () => import('../views/setting/merchant/index.vue'),
        children: [{
                path: 'ascription',
                name: 'ascription',
                meta: {
                    parentName: 'setting',
                    name: '归属配置',
                },
                component: () => import('../views/setting/merchant/ascription.vue'),
            },
            {
                path: 'info',
                name: 'marchantInfo',
                meta: {
                    parentName: 'setting',
                    name: '商家信息'
                },
                component: () => import('../views/setting/merchant/marchant.vue'),
            }
        ]
    },
    {
        path: 'supplier',
        redirect: '/setting/supplier/list',
        meta: {
            parentName: 'setting',
            name: '供应商设置',
        },
        component: () => import('../views/setting/supplier/index.vue'),
        children: [{
                path: 'list',
                name: 'supplierList',
                meta: {
                    parentName: 'setting',
                    name: '供应商列表'
                },
                component: () => import('../views/setting/supplier/supplier-list.vue'),
            },
            {
                path: 'type',
                name: 'supplierType',
                meta: {
                    parentName: 'setting',
                    name: '供应商类型'
                },
                component: () => import('../views/setting/supplier/supplier-type.vue'),
            }
        ]
    },
    {
        path: 'productType',
        name: 'productType',
        meta: {
            parentName: 'setting',
            name: '产品设置',
        },
        component: () => import('../views/setting/product/product-type.vue')
    },
    {
        path: 'addProduct',
        name: 'addProduct',
        meta: {
            parentName: 'setting',
            name: '添加产品',
        },
        component: () => import('../views/setting/product/addProduct.vue')
    },
    {
        path: 'visitorType',
        name: 'visitorType',
        meta: {
            parentName: 'setting',
            name: '游客类型',
        },
        component: () => import('../views/setting/visitor-type.vue'),
    }
]