// pages/selectShop/selectShop.js
const server = require('../../utils/server');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: -1,
    list_style: '',
    startX: 0,
    rate: 2,
    isSureDelect: false,
    shopList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let rate = 750 / wx.getSystemInfoSync().screenWidth;
    this.setData({
      rate: rate,
    })

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
    let storeArray = wx.getStorageSync("storeArray");
    let appId = server.getAppid();
    if (storeArray && storeArray.length > 0) {
      let array = storeArray.filter(item => item.appId == appId);
      this.setData({
        shopList: array
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  selectShop(e) {
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('token');
    wx.removeStorageSync('MyDistId');
    wx.removeStorageSync('DistId');
    wx.setStorageSync("isAdmin", false);
    let index = e.currentTarget.dataset.index;
    let siteId = this.data.shopList[index].siteId;
    wx.setStorageSync('siteId', siteId)
    // 获取商家信息
    server.getMerchant(3);
  },

  touchstart(e) {
    let startX = e.touches[0].clientX;
    this.setData({
      startX: startX
    })
  },

  touchmove(e) {
    let moveX = e.touches[0].clientX;
    let dis = (this.data.startX - moveX) * this.data.rate; // 换算成rpx
    let activeIndex = e.currentTarget.dataset.index;
    let left = 160;
    if (dis <= 0) {
      left = 160
    } else if (dis >= 160) {
      left = 0
    } else {
      left = 160 - dis
    }
    this.setData({
      list_style: 'transform:translateX(' + left + 'rpx)',
      activeIndex: activeIndex
    })
  },

  touchend(e) {
    let endX = e.changedTouches[0].clientX;
    let dis = (this.data.startX - endX) * this.data.rate;
    let activeIndex = e.currentTarget.dataset.index;
    let left = 0
    if (dis >= 200) {
      left = 0
    } else {
      left = 160
    }
    this.setData({
      activeIndex: activeIndex,
      list_style: 'transform:translateX(' + left + 'rpx)',
      isSureDelect: false
    })
  },

  //删除事件
  delete(e) {
    if (!this.data.isSureDelect) {
      this.setData({
        isSureDelect: true
      })
    } else {
      this.data.shopList.splice(this.data.activeIndex, 1);
      wx.setStorageSync('storeArray', this.data.shopList);
      this.setData({
        shopList: this.data.shopList,
        isSureDelect: false,
        list_style: 'transform:translateX(160rpx)'
      })
    }

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