// pages/index/index.js
const config = require('../../utils/config');
const server = require('../../utils/server');
const {
  $Message
} = require('../../components/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    merchantInfo: {},
    showTel: false,
    recommendData: [],
    seckKillData: [],
    assemData: [],
    loadSpin: true,
    isAdmin: false,
    current: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.siteId) {
      wx.removeStorageSync('token');
      wx.removeStorageSync('userInfo');
      wx.setStorageSync('siteId', options.siteId)
      config.globalData.showSelect = true;
    }
    if (options.siteId || options.DistId) {
      server.getMerchant(4)
    }
    if (options.DistId) {
      wx.setStorageSync('DistId', options.DistId);
      if (wx.getStorageSync('token')) {
        server.reportVisit()
      }
    }
    if (!config.globalData.showShop.home) {
      this.setData({
        isAdmin: wx.getStorageSync("isAdmin"),
        loadSpin: true,
        recommendData: [],
        seckKillData: [],
        assemData: []
      })
      this.getHome();
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (config.globalData.showShop.home) {
      config.globalData.showShop.home = false;
      this.setData({
        isAdmin: wx.getStorageSync("isAdmin"),
        loadSpin: true,
        recommendData: [],
        seckKillData: [],
        assemData: []
      })
      this.getHome();
    }
  },
  // 获取首页内容
  getHome() {
    let that = this;
    server.sendRequest({
      url: '/TravelProduct/GetAppHomePage',
      data: {
        appId: server.getAppid(),
        siteId: wx.getStorageSync('siteId'),
        MyDistId: wx.getStorageSync('MyDistId') || null
      },
      method: 'post',
      success: res => {
        wx.stopPullDownRefresh();
        let merchantInfo = wx.getStorageSync("merchant");
        that.setData({
          merchantInfo,
          recommendData: res.Data.RecommendData,
          seckKillData: res.Data.SeckKillData,
          assemData: res.Data.AssemData,
          loadSpin: false
        })
        wx.setNavigationBarTitle({
          title: merchantInfo.Name
        })
      }
    })
  },
  // 地址导航
  getAddress() {
    let that = this;
    if (that.data.merchantInfo.Lat && that.data.merchantInfo.Lon) {
      wx.openLocation({
        latitude: parseFloat(that.data.merchantInfo.Lat),
        longitude: parseFloat(that.data.merchantInfo.Lon),
        scale: 18
      })
    } else {
      $Message({
        content: '暂无定位！',
        type: 'error'
      });
    }
  },
  makeCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.merchantInfo.Tel
    })
  },
  downphone() {
    this.setData({
      showTel: !this.data.showTel
    })
  },
  toshop() {
    wx.switchTab({
      url: '/pages/shopList/shopList',
    })
  },
  toSeckill() {
    wx.switchTab({
      url: '/pages/activity/activity',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    this.setData({
      recommendData: [],
      seckKillData: [],
      assemData: []
    })
    this.getHome();
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
    let siteId = wx.getStorageSync('siteId') || '';
    let dist = wx.getStorageSync('MyDistId') || "";
    return {
      title: this.data.merchantInfo.Name,
      path: '/pages/index/index?siteId=' + siteId + '&DistId=' + dist,
      imageUrl: this.data.merchantInfo.Photo[0],
    }
  }
})