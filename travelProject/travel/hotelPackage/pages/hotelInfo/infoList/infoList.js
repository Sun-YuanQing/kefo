// hotelPackage/pages/hotelInfo/infoList/infoList.js
const server = require('../../../../utils/server');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type) {
      this.setData({
        infoType: options.type
      })
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
    this.loadData();
  },

  loadData() {
    server.sendRequest({
      url: '/UserBooking/GetUserBookinglistVX',
      method: 'post',
      success: res => {
        this.setData({
          infoList: res.Data
        })
      }
    })
  },

  toAdd(e) {
    if (this.data.infoType) {
      let index = e.currentTarget.dataset.index;
      wx.setStorageSync('tourData', this.data.infoList[index])
      wx.navigateBack({
        delta: 1
      })
    } else {
      let id = e.currentTarget.dataset.id || '';
      wx.navigateTo({
        url: '/hotelPackage/pages/hotelInfo/addTour/addTour?id=' + id,
      })
    }
  },

  toEdit(e) {
    wx.navigateTo({
      url: '/hotelPackage/pages/hotelInfo/addTour/addTour?id=' + e.currentTarget.dataset.id,
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