import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import './plugins/iview.js'
import './styles/index.less'
import './assets/icons/index'
import * as filters from './utils/filters.js'
import { getToken, getStoreType } from '@/utils/auth.js'

import LightTimeline from 'vue-light-timeline'
Vue.use(LightTimeline)   //时间轴

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

import EventBus from './bus'
Vue.prototype.$bus = EventBus

router.beforeEach((to, from, next) => {
  const token = getToken();
  const storeType = getStoreType();
  // console.log('to',to)marchantInfo
   if (!token && to.path !== '/login' && to.path !== '/register' && to.path !== '/process' && to.path !== '/forget') { 
     next('/login');
  }else if(storeType==1 && (to.name=='order' || to.meta.parentName=='order' || to.name=='storeSetting' || to.meta.parentName=='storeSetting' || to.name=='marketing' || to.meta.parentName=='marketing' || to.name=='preference' || to.meta.parentName=='preference')){
    next('/404');
  }else if(storeType==2 && (to.name=='marchantInfo')){
    next('/storeSetting/store');
  }else if(storeType==2 && (to.name=='stores' || to.meta.parentName=='stores' || to.name=='setting' || to.meta.parentName=='setting')){
    next('/404');
  }else if(storeType==3 && (to.name=='marchantInfo')){
    next('/setting/productType');
  }else if(storeType==3 && (to.name=='preference' || to.meta.parentName=='preference' || to.name=='ascription')){
    next('/404');
  }else{
     next();
   }
})

router.afterEach(() => {
  window.scrollTo(0,0);
})



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
