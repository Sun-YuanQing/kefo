import Vue from 'vue'
import iView from 'view-design'
import 'view-design/dist/styles/iview.css';
import '@/styles/theme.less'

// 重写 this.$Message.error, 最多同时显示一个错误
// let errorFlag = true;
// iView.Message.error = function(options) {
//   if (!errorFlag) return false;
//   errorFlag = false;
//   setTimeout(() => {
//     errorFlag = true;
//   }, (options.duration || 2) * 1000);
//   return this.message('error', options);
// };

//重写iview InputNumber浮点方法
iView.InputNumber.computed.precisionValue = function () {
  let arr = (this.currentValue + '').split('.')
  if (this.precision && arr[1] && this.precision < arr[1].length)
    return this.currentValue.toFixed(this.precision)
  return this.currentValue;
};

Vue.use(iView)


