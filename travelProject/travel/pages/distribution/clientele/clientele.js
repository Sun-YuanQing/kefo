// pages/distribution/clientele/clientele.js
const server = require('../../../utils/server')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    clientData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      distId: options.id
    })
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
      url: '/Distribution/GetDistCustomerByDistId',
      method: 'post',
      data: {
        PageIndex: this.data.page,
        PageSize: 10,
        DistId: this.data.distId
      },
      success: res => {
        wx.stopPullDownRefresh();
        let clientData = this.data.page == 1 ? [] : this.data.clientData;
        let page = res.Data.DistCustomes.length > 0 ? ++this.data.page : this.data.page;
        clientData.push(...res.Data.DistCustomes)
        this.setData({
          clientData,
          page
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
    this.setData({
      page: 1
    })
    this.loadData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})