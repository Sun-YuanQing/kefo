// pages/distribution/cumulative/cumulative.js
const server = require('../../../utils/server')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    earnList: [],
    page: 1,
    earnData: {},
    timeData: ''
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
      url: '/Distribution/GetDistReportDetail',
      method: 'post',
      data: {
        PageIndex: this.data.page,
        PageSize: 10,
        CurrentTime: this.data.timeData
      },
      success: res => {
        let earnList = this.data.page > 1 ? this.data.earnList : [];
        let page = res.Data.DistReportDetailItems.length > 0 ? ++this.data.page : this.data.page;
        earnList.push(...res.Data.DistReportDetailItems)
        this.setData({
          earnData: res.Data,
          earnList,
          page
        })
      }
    })
  },

  getTime(e) {
    this.setData({
      timeData: e.detail.value,
      page: 1
    })
    this.loadData();
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
    this.setData({
      page: 1
    })
    this.loadData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})