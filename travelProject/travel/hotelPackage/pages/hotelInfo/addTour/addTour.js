// hotelPackage/pages/hotelInfo/addTour/addTour.js
const server = require('../../../../utils/server');
const {
  $Message
} = require('../../../components/iview/base/index');
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
    if (options.id) {
      this.setData({
        tourId: options.id
      })
      wx.setNavigationBarTitle({
        title: '修改入住人'
      })
      this.loadData();
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

  loadData() {
    server.sendRequest({
      url: '/UserBooking/GetUserBookingById?id=' + this.data.tourId,
      method: 'post',
      success: res => {
        this.setData({
          tourData: res.Data
        })
      }
    })
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
      url: '/UserBooking/AddUserBookingVX',
      method: 'post',
      data: {
        ...this.data.tourData
      },
      success: res => {
        $Message({
          content: '添加成功',
          type: 'success'
        });
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