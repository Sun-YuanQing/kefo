import Vue from 'vue'
import VueRouter from 'vue-router'
import Wrapper from '../views/layout/wrapper.vue'
import { setting } from './setting.js'
import { stores } from './stores.js'
import { storeSetting } from './store-setting.js'
import { goods } from './goods.js'
import { marketing } from './marketing.js'
import { physical } from './physical.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    redirect: '/'
  },
  {
    path: '/401',
    name: 'error_401',
    component: () => import('@/views/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    component: () => import('@/views/error-page/500.vue')
  },
  {
    path: '/404',
    name: 'error_404',
    component: () => import('@/views/error-page/404.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/user/login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/user/register.vue')
  },
  {
    path: '/process',
    name: 'process',
    component: () => import('../views/user/process.vue')
  },
  {
    path: '/forget',
    name: 'forget',
    component: () => import('../views/user/forget.vue')
  },
  {
    path: '/',
    component: Wrapper,
    redirect: '/setting/merchant/info',
    children: [{
        path: '/preference',
        name: 'preference',
        component: () => import('../views/preference/index.vue')
      },
      {
        path: '/goods',
        name: 'goods',
        redirect: '/goods/productList',
        component: () => import('../views/goods/index.vue'),
        children: [
          {
            path: 'checkPending',
            name: 'checkPending',
            meta: {
              parentName: 'goods',
              name: '待审核商品',
            },
            component: () => import('../views/goods/check-pending.vue'),
          },
          {
            path: 'uploadProduct',
            name: 'uploadProduct',
            meta: {
              parentName: 'goods',
              name: '商品上传管理',
            },
            component: () => import('../views/goods/upload-product.vue'),
          },
          {
            path: 'productList',
            name: 'productList',
            meta: {
              parentName: 'goods',
              name: '商品库/产品',
            },
            component: () => import('../views/goods/product-list.vue'),
          },
        ]
      },
      {
        path: '/order',
        name: 'order',
        component: () => import('../views/order/index.vue'),
      },
      {
        path: '/stores',
        name: 'stores',
        component: () => import('../views/stores/index.vue'),
      },
      {
        path: '/physicalIndex',
        name: 'physicalIndex',
        component: () => import('../views/physical/index.vue')
    },
      {
        path: '/storeSetting',
        name: 'storeSetting',
        redirect: '/storeSetting/store',
        component: () => import('../views/store-setting/index.vue'),
        children: storeSetting
      },
      {
        path: '/marketing',
        name: 'marketing',
        component: () => import('../views/marketing/index.vue'),
      },
      {
        path: '/statistics',
        name: 'statistics',
        component: () => import('../views/statistics/index.vue')
      },
      {
        path: '/setting',
        name: 'setting',
        redirect: '/setting/merchant/info',
        component: () => import('../views/setting/index.vue'),
        children: setting,
      }
    ]
  },
  
  //setting
  {
    path: '/storeOwnership',
    name: 'storeOwnership',
    meta: {
      parentName: 'setting',
    },
    component: () => import('../views/setting/merchant/store-ownership.vue'),
  },
  {
    path: '/editSupplier',
    name: 'editSupplier',
    meta: {
      parentName: 'setting',
    },
    component: () => import('../views/setting/supplier/edit-supplier.vue'),
  },
  {
    path: '/supplierDetail',
    name: 'supplierDetail',
    meta: {
      parentName: 'setting',
    },
    component: () => import('../views/setting/supplier/supplier-detail.vue'),
  },
  
  // stores
  ...stores,

  //goods
  ...goods,

  //preference
  {
    path: '/findGoods',
    name: 'findGoods',
    meta: {
      parentName: 'preference',
    },
    component: () => import('../views/preference/find-goods.vue'),
  },

  //marketing
  ...marketing,

  //order
  {
    path: '/orderDetail',
    name: 'orderDetail',
    meta: {
      parentName: 'order',
    },
    component: () => import('../views/order/order-detail.vue'),
  },

  // 医疗体检
  ...physical,
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes 
})

export default router