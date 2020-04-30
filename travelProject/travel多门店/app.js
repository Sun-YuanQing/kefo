//app.js
App({
  onLaunch: function (options) {

  },
  onShow() {
    // 获取标题栏高度
    // this.globalData.allheight = wx.getMenuButtonBoundingClientRect();
  },
  globalData: {
    showSeck: false,
    seckId: '',
    appId: '',
    siteId: '',
    showShop: {
      home: false, //首页
      shop: false, //商城
      activity: false //活动
    },
    showSelect: false //从分享进来的直接进入index页面
  }
})