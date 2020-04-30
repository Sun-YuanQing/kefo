// pages/mine/index/index.js
//获取应用实例
const server = require('../../../utils/server')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    other: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 查看是否授权
    // wx.getSetting({
    //   success(res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       wx.getUserInfo({
    //         success: function (res) {
    //           console.log(res.userInfo)
    //         }
    //       })
    //     }else{
    //       this.bindGetUserInfo()
    //     }
    //   }
    // })
  },

  // bindGetUserInfo(e) {
  //   console.log(e.detail.userInfo)
  // },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.queryUserInfo();
    this.queryOther();
  },
  
  layout: function () {
    wx.clearStorage();
    wx.redirectTo({
      url: "/pages/phone/phone",
    })
  },
  
  queryUserInfo: function () {
    const self = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    server.sendRequest({
      url: "/PhoneUser/GetPhoneUser",
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        wx.hideLoading();
        //console.log("res", res.data)
        let { Code, Data, Message } = res.data;
        if(Code == "0"){
          self.setData({
            userInfo: Data
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


        }else{
          wx.showToast({
            title: Message,
            icon: 'none',
            duration: 2000
          })
        }

      }
    })
  },

  queryOther: function () {
    const self = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    server.sendRequest({
      url:  "/Coupon/GetCouponCount",
      method: 'POST', 
      success: function (res) {
        wx.hideLoading();
        //console.log("other", res.data)
        let { Code, Data, Message } = res.data;
        if (Code == "0") {
          self.setData({
            other: Data
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

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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