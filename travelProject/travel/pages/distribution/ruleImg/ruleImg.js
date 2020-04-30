// pages/distribution/ruleImg/ruleImg.js
const server = require('../../../utils/server');
const {
  $Message
} = require('../../../components/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false
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
      url: '/Distribution/GetAppIncome',
      method: 'post',
      data: {
        AppId: server.getAppid(),
        SiteId: wx.getStorageSync('siteId')
      },
      success: res => {
        this.setData({
          appIncome: res.Data.AppIncome
        })
      }
    })
  },

  doModal(res) {
    if (wx.getStorageSync("token")) {
      this.setData({
        showModal: !this.data.showModal
      })
    } else {
      wx.navigateTo({
        url: '/pages/phone/phone',
      })
    }
  },

  returnNo() {
    return false;
  },

  toInvite() {
    server.sendRequest({
      url: '/Distribution/AddSiteDistVx',
      method: 'post',
      success: res => {
        this.setData({
          showModal: false
        })
        $Message({
          content: '申请成功！请等待审核',
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