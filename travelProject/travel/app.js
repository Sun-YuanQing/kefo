//app.js
const server = require('./utils/server');
const config = require('./utils/config');
App({
  onLaunch: function (options) {

  },
  onShow() {
    if (wx.getStorageSync('DistId') && wx.getStorageSync("token")) {
      server.reportVisit()
    }
    if (!wx.getStorageSync("token")) {
      wx.removeStorageSync('MyDistId')
    }
  },
  onHide() {
    config.globalData = {
      showSeck: false,
      seckId: '',
      showShop: {
        home: false, //首页
        shop: false, //商城
        activity: false //活动
      },
      showSelect: false //从分享进来的直接进入index页面
    }
  }
})