// pages/card_bag/menber_center/menber_center.js
//获取应用实例
const server = require('../../../utils/server')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {},
    cardData: {}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      options: options
    });

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.queryCardList(this.options);
  },

  //请求卡包数据
  queryCardList: function(options) {
    const self = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    server.sendRequest({
      url: '/Card/GetCardListBySiteId',
      data: options,
      method: "POST",
      success(res) {
        wx.hideLoading()
        let {
          Code,
          Data,
          Message
        } = res.data;
        if (Code == "0") {
          self.setData({
            cardData: Data
          })
        } else if (Code == '400') {
          wx.showModal({
            title: '',
            content: Message,
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '/pages/phone/phone'
                })
              }
            }
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
  navigate(e) {
    let options = e.currentTarget.dataset.options;
    wx.navigateTo({
      url: '/pages/card_bag/balance/balance?SiteId=' + this.data.options.SiteId + '&UserId=' + this.data.options.UserId + '&CardId=' + options.CardId,
    })
  }
})