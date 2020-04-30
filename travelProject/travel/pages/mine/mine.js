// pages/pdfFile/pdfFile.js
const server = require('../../utils/server');
const config = require('../../utils/config');
const {
  $Message
} = require('../../components/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // nvabarData: {
    //   showCapsule: 2, //显示左上角图标   1表示发现    0表示返回
    //   title: '我的', //导航栏 中间的标题
    // },
    isLogin: true,
    myDetail: {},
    orderDetail: [],
    userName: '',
    shopList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.DistId) {
      wx.setStorageSync('DistId', options.DistId);
      if (wx.getStorageSync('token')) {
        server.reportVisit()
      }
    }
    if (options.siteId) {
      wx.removeStorageSync('token');
      wx.removeStorageSync('userInfo');
      wx.setStorageSync('siteId', options.siteId);
      config.globalData.showSelect = true;
    }
    if (options.siteId || options.DistId) {
      server.getMerchant(4);
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //有无缓存店铺
    let storeArray = wx.getStorageSync("storeArray");
    let appId = server.getAppid();
    if (storeArray && storeArray.length > 0) {
      let array = storeArray.filter(item => item.appId == appId);
      this.setData({
        shopList: array
      })
    }
    if (wx.getStorageSync("token")) {
      this.loadData();
    } else {
      this.setData({
        myDetail: {},
        orderDetail: []
      })
      wx.removeStorageSync('userInfo')
    }
    this.setData({
      userInfo: wx.getStorageSync('userInfo') || ''
    })
  },

  navigateTo(option) {
    if (wx.getStorageSync("token")) {
      wx.navigateTo(option);
    } else {
      wx.navigateTo({
        url: '/pages/phone/phone',
      })
    }
  },

  toLogin(res) {
    if (!wx.getStorageSync('userInfo')) {
      wx.navigateTo({
        url: '/pages/phone/phone',
      })
    }
  },

  loadData() {
    server.sendRequest({
      url: '/TraveOrder/MyDetailVx',
      method: 'post',
      success: res => {
        wx.stopPullDownRefresh();
        if (res.Data.MyDistribution) {
          if (res.Data.MyDistribution.Status == 1) {
            wx.setStorageSync('MyDistId', res.Data.MyDistribution.DistId)
          } else if (res.Data.MyDistribution.Status == 2) {
            wx.removeStorageSync('MyDistId')
          }
        }
        this.setData({
          myDetail: res.Data,
          orderDetail: res.Data.MySeckillResultVx
        })
      }
    })
  },
  toMyOrder(e) {
    let state = e.currentTarget.dataset.index || '';
    this.navigateTo({
      url: '/pages/myOrder/myOrder?state=' + state,
    })
  },
  toKeFu() {
    wx.navigateTo({
      url: '/pages/service/service',
    })
  },
  toAbout() {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },
  toOtherShop() {
    wx.navigateTo({
      url: '/pages/selectShop/selectShop',
    })
  },

  toHotelInfo() {
    this.navigateTo({
      url: '/hotelPackage/pages/hotelInfo/infoList/infoList',
    })
  },

  toNavigation() {
    this.navigateTo({
      url: '/pages/distribution/ruleImg/ruleImg',
    })
  },

  toEarn() {
    this.navigateTo({
      url: '/pages/distribution/navigation/navigation',
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (wx.getStorageSync("token")) {
      this.loadData();
    } else {
      wx.stopPullDownRefresh();
      return false;
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let dist = wx.getStorageSync('MyDistId') || '';
    let siteId = wx.getStorageSync('siteId') || '';
    return {
      path: '/pages/mine/mine?DistId=' + dist + '&siteId=' + siteId
    }
  },
  toMedical() {
    var token = wx.getStorageSync("token");
    console.log(token);
    wx.navigateToMiniProgram({
      appId: "wx2956e9bf07205602",
      path: "pages/report/reportList/reportList?token=" + token,
      extraData: {
        token: token
      },
      envVersion: __wxConfig.envVersion,
      success(res) {
        console.log('跳转ok')
      },
      fail(res) {
        console.log('跳转出错')
      }
    })
  }
})