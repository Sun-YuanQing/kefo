// pages/loading/loading.js
//获取应用实例
const app = getApp();
const setting = require('../../utils/setting');
const server = require('../../utils/server');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //扫码进入
    if (options.q) {
      wx.removeStorageSync('token');
      wx.removeStorageSync('userInfo');
      var url = decodeURIComponent(options.q);
      let variables = setting.getQueryVariable(url);

      let AppId = variables.AppId;
      let SiteId = variables.SiteId;
      let SeckId = variables.SeckId;
      app.globalData.appId = AppId;
      app.globalData.siteId = SiteId;

      // 获取商家信息
      server.getMerchant(1, AppId, SiteId, SeckId);

    } else {
      app.globalData.showSeck = false;
      //有无缓存的门店,同appid
      let storeArray = wx.getStorageSync("storeArray");
      let array = [];
      if (storeArray && storeArray.length > 0) {
        array = storeArray.filter(item => item.appId == server.getAppid());
      }
      if (app.globalData.showSelect) {
        app.globalData.showSelect = false;
        wx.switchTab({
          url: '/pages/index/index',
        })
      } else if (array.length > 0) {
        setTimeout(function () {
          wx.redirectTo({
            url: "/pages/selectShop/selectShop"
          })
        }, 2000)

      } else {
        // 获取商家信息
        server.getMerchant(2);
      }

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