import Vue from 'vue'
import iView from 'iview'

// 重写 this.$Message.error, 最多同时显示一个错误
let errorFlag = true;
iView.Message.error = function(options) {
  if (!errorFlag) return false;
  errorFlag = false;
  setTimeout(() => {
    errorFlag = true;
  }, (options.duration || 3) * 1000);
  return this.message('error', options);
};

Vue.use(iView)

// import 'iview/dist/styles/iview.css'
