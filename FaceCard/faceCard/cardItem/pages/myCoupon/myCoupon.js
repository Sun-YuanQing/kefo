// cardItem/pages/myCoupon/myCoupon.js
const { $Message } = require('../../compoment/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    this.setData({
      detailList: JSON.parse(options.detail),
      allprice: options.allprice
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  toOrder(e) {
    if (e.currentTarget.dataset.price > this.data.allprice) {
      $Message({
        content: '不满足优惠券条件',
        type: 'warning'
      });
      return false;
    }
    wx.setStorageSync('index', e.currentTarget.dataset.index + 1)
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})