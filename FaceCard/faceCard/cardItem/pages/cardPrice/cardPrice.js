// cardItem/pages/cardPrice/cardPrice.js
const server = require('../../../utils/server')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    telphone: [{
      name: ""
    }],
    siteData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      cardid: options.cardid,
      siteid:options.siteid
    })
    this.loadData();
    this.iniData();
  },
  loadData() {
    let that = this;
    server.sendRequest({
      url: "/CardProject/GetCardProjectDetaiById?cardId=" + that.data.cardid,
      method: 'post',
      success: res => {
        if (res.data.Code == 0) {
          console.log(res.data.Data)
          let cardprice = res.data.Data.CardPrice.toFixed(2);
          let feiprice = res.data.Data.FeiKaPrice.toFixed(2);
          res.data.Data.cardHead = cardprice.split('.')[0];
          res.data.Data.cardEnd = cardprice.split('.')[1];
          res.data.Data.feiHead = feiprice.split('.')[0];
          res.data.Data.feiEnd = feiprice.split('.')[1];
          that.setData({
            cardData: res.data.Data
          })
        } else {
          wx.showToast({
            title: res.data.Message,
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
  iniData() {
    let that = this;
    server.sendRequest({
      url: "/Site/GetSiteBaseInfo?siteId=" + that.data.siteid,
      method: 'POST',
      success: res => {
        if (res.data.Code == 0) {
          that.data.telphone[0].name = res.data.Data.Tel
          this.setData({
            siteData: res.data.Data,
            telphone: that.data.telphone
          })
        } else {
          wx.showToast({
            title: res.data.Message,
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

  },
  toFei() {
    wx.navigateTo({
      url: '/cardItem/pages/about/about',
    })
  }
})