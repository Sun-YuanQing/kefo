// pages/mine/order/order.js
const server = require('../../../utils/server')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    this.loadData();
  },

  loadData() {
    let that = this;
    server.sendRequest({
      url: '/UserCardProject/MyUserCardProjectList?phone=' + wx.getStorageSync('PhoneNumber'),
      method: 'post',
      success: res => {
        let {
          Code,
          Message,
          Data
        } = res.data;
        if (Code == '0') {
          that.setData({
            orderList: Data
          })
        } else {
          wx.showToast({
            title: Message,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail(err) {
        wx.showToast({
          title: err,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  todetail(e) {
    wx.navigateTo({
      url: '/pages/mine/orderDetail/orderDetail?cardid=' + e.currentTarget.dataset.id,
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