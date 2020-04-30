// pages/distribution/editShop/editShop.js
const server = require('../../../utils/server');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopData: {},
    textNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData();
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

  loadData() {
    server.sendRequest({
      url: '/Distribution/GetSiteDist',
      method: 'post',
      success: res => {
        this.setData({
          shopData: res.Data
        })
      }
    })
  },

  getShopname(e) {
    this.data.shopData.SiteName = e.detail.value;
    this.setData({
      shopData: this.data.shopData
    })
  },

  getShopdesc(e) {
    this.data.shopData.SiteDesc = e.detail.value;
    this.setData({
      textNum: e.detail.cursor,
      shopData: this.data.shopData
    })
  },

  toForm() {
    server.sendRequest({
      url: '/Distribution/SetSiteDistVx',
      method: 'post',
      data: {
        ...this.data.shopData
      },
      success: res => {
        server.getMerchant(4)
        wx.navigateBack({
          delta: 1
        })
      }
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