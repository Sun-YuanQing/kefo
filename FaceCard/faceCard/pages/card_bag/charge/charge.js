// pages/card_bag/charge/charge.js
//获取应用实例
const server = require('../../../utils/server')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disable: false,
    checked: false,
    options: {},
    selectedFlag: [],
    selected: {},
    array: [], //配置传给自定义充值页面
    cardInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      options: options,
    })
    this.queryPreferentials()
  },

  queryPreferentials: function() {
    const self = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    server.sendRequest({
      url: "/Recharge/GetAppPreferentials",
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      data: {
        SiteId: self.data.options.SiteId,
        CardId: self.data.options.CardId
      },
      success: function(res) {
        wx.hideLoading();
        let {
          Code,
          Data,
          Message
        } = res.data;
        if (Code == "0") {
          self.setData({
            cardInfo: Data,
            array: JSON.stringify(Data.Preferential)
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


        }
        // else {
        //   wx.showToast({
        //     title: Message,
        //     icon: 'none',
        //     duration: 2000
        //   })
        // }

      }
    })
  },

  //下单充值
  charge: function() {
    if (!this.data.disable) return;
    const self = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    server.sendRequest({
      url: "/Pay/WxPayApiRecharge",
      method: "POST",
      data: {
        SiteId: self.data.options.SiteId,
        UserId: self.data.options.UserId,
        CardId: self.data.options.CardId,
        Amount: self.data.selected.Amount,
        PreferentialAmount: self.data.selected.PreferentialAmount,
        OpenId: wx.getStorageSync("OpenId"),
      },
      success: function(res) {
        wx.hideLoading();
        let {
          Code,
          Data,
          Message
        } = res.data;
        if (Code == "0") {
          // let { timeStamp, nonceStr, paySign, signType, package } = Data.m_values;
          let data = Data.m_values;
          wx.requestPayment({
            'timeStamp': data.timeStamp,
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': data.signType,
            'paySign': data.paySign,
            'success': function(res) {
              if (res.errMsg == 'requestPayment:ok') {
                let amount = self.data.selected.Amount || self.data.amount;
                let preferentialAmount = self.data.selected.PreferentialAmount || 0;
                let total = Number(amount) + Number(preferentialAmount);
                let param = {
                  type: 0,
                  total: total
                }
                wx.navigateTo({
                  url: '/pages/card_bag/success/success?param=' + JSON.stringify(param)
                })
              }

            },
            'fail': function(res) {
              // wx.showToast({
              //   title: res.errMsg,
              //   icon: 'none',
              //   duration: 2000
              // })
            }
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


        }
        // else {
        //   wx.showToast({
        //     title: Message,
        //     icon: 'none',
        //     duration: 2000
        //   })
        // }

      },
      fail: function(err) {
        // wx.showToast({
        //   title: err,
        //   icon: 'none',
        //   duration: 2000
        // })
      }

    })
  },

  checkboxChange: function() {
    this.setData({
      checked: !this.data.checked
    })
    let boolean = this.data.selectedFlag.some(function(item) {
      return item == true
    })
    if (boolean && this.data.checked) {
      this.setData({
        disable: true
      })
    } else {
      this.setData({
        disable: false
      })
    }
  },

  changeToggle: function(e) {
    let index = e.currentTarget.dataset.index;
    let preferential = this.data.cardInfo.Preferential;
    for (let i = 0; i < preferential.length; i++) {
      if (index == i) {
        this.data.selectedFlag[i] = true;
        this.data.selected = preferential[i];
      } else {
        this.data.selectedFlag[i] = false;
      }
    }
    let boolean;
    if (this.data.checked) {
      boolean = true;
    } else {
      boolean = false;
    }
    this.setData({
      selectedFlag: this.data.selectedFlag,
      disable: boolean
    })

  },

  otherChoice: function() {
    let preferential = this.data.cardInfo.Preferential;
    for (let i = 0; i < preferential.length; i++) {
      this.data.selectedFlag[i] = false;
      this.setData({
        selectedFlag: this.data.selectedFlag,
        disable: false
      })
    }
  },

  goAgreement: function(e) {
    wx.navigateTo({
      url: '/pages/card_bag/agreement/agreement'
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