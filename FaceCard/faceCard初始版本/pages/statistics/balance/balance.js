const server = require('../../../utils/server')
//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    siteAmount: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAmount()
  },
  
  getAmount: function () {
    const self = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    server.sendRequest({
      url: "/ConsumeRecord/GetAppSiteCardAmount",
      data: {},
      method: 'POST', 
      success: function (res) {
        let { Code, Data, Message } = res.data;
        //隐藏授权框
        wx.hideLoading();
        if (Code == 0) {
          self.setData({
            siteAmount: Data.SiteAmount
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
  toBalance(e){
    let options = e.currentTarget.dataset.options;
    wx.navigateTo({
      url: "/pages/card_bag/balance/balance?CardId=" + options.CardId,
    })
  }
})