export const storeSetting = [
    {
        path: 'store',
        name: 'shopSetting',
        meta: {
            parentName: 'storeSetting',
            name: '店铺设置',
        },
        component: () => import('../views/store-setting/store.vue'),
    },
    {
        path: 'member',
        name: 'memberSetting',
        meta: {
            parentName: 'storeSetting',
            name: '会员设置',
        },
        component: () => import('../views/store-setting/member.vue'),
    },
    {
        path: 'qrCode',
        name: 'qrCodeSetting',
        meta: {
            parentName: 'storeSetting',
            name: '二维码设置',
        },
        component: () => import('../views/store-setting/qrCode.vue'),
    },
    {
        path: 'distributor',
        name: 'distributorSetting',
        redirect: '/storeSetting/distributor/royalty',
        meta: {
            parentName: 'storeSetting',
            name: '分销员设置',
        },
        component: () => import('../views/store-setting/distributor/index.vue'),
        children: [
            {
                path: 'royalty',
                name: 'distributorRroyalty',
                meta: {
                    parentName: 'storeSetting',
                    name: '提成设置'
                },
                component: () => import('../views/store-setting/distributor/royalty.vue'),
            },
            {
                path: 'discount',
                name: 'distributorDiscount',
                meta: {
                    parentName: 'storeSetting',
                    name: '优惠设置'
                },
                component: () => import('../views/store-setting/distributor/discount.vue'),
            }
        ]
    }
]