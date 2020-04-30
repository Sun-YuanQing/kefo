import Vue from 'vue'
import Router from 'vue-router'
import Wrapper from 'src/layouts/wrapper'

Vue.use(Router)

export default new Router({
  mode: 'history',
  // base: '/BeautyWeb/',
  routes: [{
      path: '/login',
      name: 'login',
      component: () => import('src/views/login/index')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('src/views/login/register')
    },
    {
      path: '/forget',
      name: 'forget',
      component: () => import('src/views/login/forget')
    },
    {
      path: '/selectStore',
      name: 'selectStore',
      component: () => import('src/views/login/select-store')
    },
    {
      path: '/createStore',
      name: 'createStore',
      component: () => import('src/views/login/create-store')
    },
    {
      path: '/personalInfo',
      name: 'personalInfo',
      component: () => import('src/views/login/personal-info')
    },
    {
      path: '/',
      component: Wrapper,
      redirect: '/index',
      children: [{
          path: 'index',
          name: 'index',
          component: () => import('src/views/index/index'),
          // meta: {
          //   keepAlive: true
          // }
        },
        {
          path: 'cashier',
          name: 'cashier',
          component: () => import('src/views/cashier/index.vue'),
        },
        {
          path: 'member',
          name: 'member',
          component: () => import('src/views/member/index.vue'),
        },
        {
          path: 'marketing',
          name: 'marketing',
          component: () => import('src/views/marketing/index.vue'),
        },
        {
          path: 'setting',
          name: 'setting',
          component: () => import('src/views/setting/index.vue')
        }
      ]
    },
    {
      path: '/findMember',
      name: 'findUser',
      component: () => import('src/views/member/find-member'),
    },
    {
      path: '/memberList',
      name: 'memberList',
      component: () => import('src/views/member/member-list'),
      // meta: {
      //   keepAlive: true
      // }
    },
    {
      path: '/todayMember',
      name: 'todayMember',
      component: () => import('src/views/member/today-member'),
      // meta: {
      //   keepAlive: true
      // }
    },
    {
      path: '/monthMember',
      name: 'monthMember',
      component: () => import('src/views/member/month-member'),
      // meta: {
      //   keepAlive: true
      // }
    },
    {
      path: '/userDetail',
      name: 'userDetail',
      component: () => import('src/views/member/memberDetail.vue')
    },
    {
      path: '/charge',
      name: 'charge',
      component: () => import('src/views/member/charge.vue')
    },
    {
      path: '/cash',
      name: 'cash',
      component: () => import('src/views/member/cash.vue')
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('src/views/member/order.vue')
    },
    {
      path: '/checkOut',
      name: 'checkOut',
      component: () => import('src/views/member/check-out.vue')
    },
    {
      path: '/cards',
      name: 'cards',
      component: () => import('src/views/member/cards.vue')
    },
    {
      path: '/chargeSetting',
      name: 'chargeSetting',
      component: () => import('src/views/marketing/charge-setting.vue')
    },
    {
      path: '/chargeSettingAdd',
      name: 'chargeSettingAdd',
      component: () => import('src/views/marketing/charge-setting-add.vue')
    },
    {
      path: '/memberDiscountSetting',
      name: 'memberDiscountSetting',
      component: () => import('src/views/marketing/member-discount-setting.vue')
    },
    {
      path: '/memberDiscountSettingAdd',
      name: 'memberDiscountSettingAdd',
      component: () => import('src/views/marketing/member-discount-setting-add.vue')
    },
    {
      path: '/discountSetting',
      name: 'discountSetting',
      component: () => import('src/views/marketing/discount-setting.vue')
    },
    {
      path: '/discountAdd',
      name: 'discountAdd',
      component: () => import('src/views/marketing/discount-add.vue')
    },
    {
      path: '/redpacketSetting',
      name: 'redpacketSetting',
      component: () => import('src/views/marketing/redpacket-setting.vue')
    },
    {
      path: '/redpacketAdd',
      name: 'redpacketAdd',
      component: () => import('src/views/marketing/redpacket-add.vue')
    },
    {
      path: '/cardSetting',
      name: 'cardSetting',
      component: () => import('src/views/setting/card-setting.vue')
    },
    {
      path: '/cardSettingConfig',
      name: 'cardSettingConfig',
      component: () => import('src/views/setting/card-setting-config.vue')
    },
    {
      path: '/qrcodeSetting',
      name: 'qrcodeSetting',
      component: () => import('src/views/setting/qrcode-setting.vue')
    },
    {
      path: '/qrcodeSettingConfig',
      name: 'qrcodeSettingConfig',
      component: () => import('src/views/setting/qrcode-setting-config.vue')
    },
    {
      path: '/rechargeSetting',
      name: 'rechargeSetting',
      component: () => import('src/views/setting/recharge-setting.vue')
    },
    {
      path: '/storeInfo',
      name: 'storeInfo',
      component: () => import('src/views/setting/store-info.vue')
    },
    {
      path: '/staffManage',
      name: 'staffManage',
      component: () => import('src/views/setting/staff-manage.vue')
    },
    {
      path: '/cashOutRecord',
      name: 'cashOutRecord',
      component: () => import('src/views/setting/cash-out-record.vue')
    },
    {
      path: '/cashOut',
      name: 'cashOut',
      component: () => import('src/views/setting/cash-out.vue')
    },
    {
      path: '/bankCardAdd',
      name: 'bankCardAdd',
      component: () => import('src/views/setting/bank-card-add.vue')
    },
    {
      path: '/bill',
      name: 'bill',
      component: () => import('src/views/cashier/bill.vue')
    },
    {
      path: '/cashRecord',
      name: 'cashRecord',
      component: () => import('src/views/cashier/cash-record.vue')
    },
    {
      path: '/chargeRecord',
      name: 'chargeRecord',
      component: () => import('src/views/cashier/charge-record.vue')
    },
    {
      path: '/billing',
      name: 'billing',
      component: () => import('src/views/setting/billing.vue')
    },
    {
      path: '/projectClass',
      name: 'projectClass',
      component: () => import('src/views/setting/project-service-class.vue')
    },
    {
      path: '/projectServe',
      name: 'projectServe',
      component: () => import('src/views/setting/project-serve.vue')
    },
    {
      path: '/addProject',
      name: 'addProject',
      component: () => import('src/views/setting/addProject.vue')
    },
    {
      path: '/productClass',
      name: 'productClass',
      component: () => import('src/views/setting/product-class.vue')
    },
    {
      path: '/productSale',
      name: 'productSale',
      component: () => import('src/views/setting/product-sale.vue')
    },
    {
      path: '/staffPosition',
      name: 'staffPosition',
      component: () => import('src/views/setting/staffPosition.vue')
    },
    {
      path: '/product',
      name: 'product',
      component: () => import('src/views/setting/product.vue')
    },
    {
      path: '/addProduct',
      name: 'addProduct',
      component: () => import('src/views/setting/addProduct.vue')
    },
    {
      path: '/committee',
      name: 'committee',
      component: () => import('src/views/setting/committee.vue')
    },
    {
      path: '/addCommit',
      name: 'addCommit',
      component: () => import('src/views/setting/addCommit.vue')
    },
    {
      path: '/cardManage',
      name: 'cardManage',
      component: () => import('src/views/card-manage/index.vue'),
    },
    {
      path: '/cardDetail',
      name: 'cardDetail',
      component: () => import('src/views/card-manage/detail.vue')
    },
    {
      path: '/editCard',
      name: 'editCard',
      component: () => import('src/views/card-manage/editCard.vue'),
    },
    {
      path: '/faceCardPrice',
      name: 'faceCardPrice',
      component: () => import('src/views/card-manage/faceCardPrice.vue')
    },
    
    {
      path: '*',
      redirect: '/'
    }
  ]
})