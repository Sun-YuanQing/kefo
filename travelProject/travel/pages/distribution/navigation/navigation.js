// pages/distribution/navigation/navigation.js
const server = require('../../../utils/server');
const {
  $Message
} = require('../../../components/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    priceData: {}
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
      url: '/Distribution/GetDistReport',
      method: 'post',
      success: res => {
        this.setData({
          priceData: res.Data
        })
      }
    })
  },

  toCumulative() {
    wx.navigateTo({
      url: '/pages/distribution/cumulative/cumulative',
    })
  },

  navigateTo(e) {
    if (this.data.priceData.DistState == 2) {
      let phone = wx.getStorageSync('merchant').Tel;
      $Message({
        content: '您已不是分销员，如有疑问，请联系商家' + phone,
        type: 'warning'
      });
    } else {
      wx.navigateTo({
        url: e.url,
      })
    }

  },

  toSetting() {
    this.navigateTo({
      url: '/pages/distribution/setting/setting',
    })
  },

  toClient() {
    this.navigateTo({
      url: '/pages/distribution/clientele/clientele?id=' + this.data.priceData.DistId
    })
  },

  toMyOrder() {
    this.navigateTo({
      url: '/pages/myOrder/myOrder?distId=' + this.data.priceData.DistId
    })
  },

  toExplain() {
    this.navigateTo({
      url: '/pages/distribution/explain/explain',
    })
  },

  toShare(){
    wx.navigateTo({
      url: '/pages/distribution/shareQrcode/shareQrcode',
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