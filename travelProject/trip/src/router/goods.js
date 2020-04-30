export const goods = [
    {
        path: '/editProduct',
        name: 'editProduct',
        meta: {
          parentName: 'goods',
        },
        component: () => import('../views/goods/edit-product.vue'),
      },
      {
        path: '/productDetail',
        name: 'productDetail',
        meta: {
          parentName: 'goods',
        },
        component: () => import('../views/goods/product-detail.vue'),
      },
]