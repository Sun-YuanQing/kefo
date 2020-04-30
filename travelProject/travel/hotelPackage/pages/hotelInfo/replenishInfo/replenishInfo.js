// hotelPackage/pages/hotelInfo/replenishInfo/replenishInfo.js
const server = require('../../../../utils/server');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tourData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderid: options.orderid
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
    if (wx.getStorageSync('tourData')) {
      this.setData({
        tourData: wx.getStorageSync('tourData')
      })
      wx.removeStorageSync('tourData')
    }
  },

  getName(e) {
    this.data.tourData.Name = e.detail.value;
    this.setData({
      tourData: this.data.tourData
    })
  },

  getPhone(e) {
    this.data.tourData.Phone = e.detail.value;
    this.setData({
      tourData: this.data.tourData
    })
  },

  getIdCard(e) {
    this.data.tourData.IdCard = e.detail.value;
    this.setData({
      tourData: this.data.tourData
    })
  },

  getRemark(e) {
    this.data.tourData.Remark = e.detail.value;
    this.setData({
      tourData: this.data.tourData
    })
  },

  toChoose() {
    wx.navigateTo({
      url: '/hotelPackage/pages/hotelInfo/infoList/infoList?type=1',
    })
  },

  toSave() {
    if (!this.data.tourData.Name) {
      $Message({
        content: '联系人不为空！！！',
        type: 'error'
      });
      return false;
    }
    if (!this.data.tourData.Phone) {
      $Message({
        content: '手机号不为空！！！',
        type: 'error'
      });
      return false;
    }
    if (!(/^1[3456789]\d{9}$/.test(this.data.tourData.Phone))) {
      $Message({
        content: '请填写正确的手机号！！！',
        type: 'error'
      });
      return false;
    }
    if (!this.data.tourData.IdCard) {
      $Message({
        content: '身份证号不为空！！！',
        type: 'error'
      });
      return false;
    }
    server.sendRequest({
      url: '/UserBooking/AddOrderUserBookingVX',
      method: 'post',
      data: {
        TraveOrderId: this.data.orderid,
        ...this.data.tourData
      },
      success: res => {
        wx.navigateTo({
          url: '/pages/myOrderDetail/myOrderDetail?orderid=' + this.data.orderid,
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