// pages/pdfFile/pdfFile.js
const server = require('../../utils/server')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // nvabarData: {
    //   showCapsule: 0, //显示左上角图标   1表示发现    0表示返回
    //   title: '产品详情', //导航栏 中间的标题
    // },
    imgUrl: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      goodsId: options.id
    })
    this.loadData();
  },
  loadData() {
    server.sendRequest({
      url: '/TravelProduct/GetPdfImages',
      data: {
        Id: this.data.goodsId
      },
      method: 'post',
      success: res => {
        this.setData({
          imgUrl: res.Data
        })
      }
    })
  },
  previewImg(e) {
    wx.previewImage({
      urls: this.data.imgUrl.Images,
      current: e.currentTarget.dataset.img
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