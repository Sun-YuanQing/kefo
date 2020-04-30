import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/iview.js'
import 'animate.css'
import './styles/index.less'
import 'src/assets/icons/index'

// import * as fundebug from "fundebug-javascript";
// import fundebugVue from "fundebug-vue";
// import './registerServiceWorker'
// fundebug.apikey = "fcf0a878a1a186a103dd9fd64c0e491de989aea131771dcd9bb1b86c53813e6c"
// fundebugVue(fundebug, Vue);

import GlobalComponent from 'src/components/index'

Vue.use(GlobalComponent)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
