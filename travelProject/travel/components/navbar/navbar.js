// components/navbar/navbar.js
const config = require('../../utils/config');
Component({
  properties: {
    navbarData: {
      type: Object,
      value: {},
      observer: function(newVal, oldVal) {}
    }
  },
  data: {
    allheight: {},
    navbarData: {
      showCapsule: 1 //1表示查询   2表示返回箭头
    }
  },
  attached: function() {
    // 获取是否是通过分享进入的小程序
    this.setData({
      share: config.globalData.share
    })
    // 定义导航栏的高度   方便对齐
    this.setData({
      allheight: config.globalData.allheight
    })
  },
  methods: {
    toSearch() {
      wx.navigateTo({
        url: '/pages/search/search',
      })
    },
    toBack() {
      wx.navigateBack({
        delta: 1
      })
    },
    toHome() {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  }
})