const server = require('../../../utils/server')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // options.type   1、充值   3、消费
    this.setData({
      typeNum: options.type,
      goodId: options.id
    })
    if (options.type == 1) {
      wx.setNavigationBarTitle({
        title: '累计充值详情'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '累计消费详情'
      })
    }
    this.loadData();
  },
  loadData() {
    let that = this;
    server.sendRequest({
      url: '/ConsumeRecord/GetAppRecordDetailById',
      data: {
        ID: that.data.goodId
      },
      method: 'post',
      success: function(res) {
        that.setData({
          detailData: res.data.Data.Record
        })
      }
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