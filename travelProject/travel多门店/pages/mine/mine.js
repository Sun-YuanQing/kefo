// pages/pdfFile/pdfFile.js
const server = require('../../utils/server');
var app = getApp();
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
    let appId = app.globalData.appId || server.getAppid();
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
      $Message({
        content: '请先登录！',
        type: 'warning'
      });
    }
  },

  toLogin(res) {
    if (res.detail.errMsg == 'getUserInfo:ok') {
      let userInfo = {
        ...res.detail.userInfo
      }
      wx.setStorageSync('userInfo', userInfo)
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

  }
})