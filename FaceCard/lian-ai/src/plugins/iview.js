import Vue from 'vue'
import iView from 'view-design'
// import 'view-design/dist/styles/iview.css';

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

