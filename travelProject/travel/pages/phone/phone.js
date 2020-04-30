// pages/phone/phone.js
const server = require('../../utils/server');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    showPower: 1,
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      merchant: wx.getStorageSync('merchant')
    })
    wx.login({
      success: res => {
        if (res.code) {
          that.setData({
            code: res.code
          })
          //存储登录返回的code
          // wx.setStorageSync("jsCode", res.code);
        } else {
          wx.showToast({
            title: res.errMsg,
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  },

  toLogin(res) {
    if (res.detail.errMsg == 'getUserInfo:ok') {
      let userInfo = {
        ...res.detail.userInfo
      }
      this.setData({
        userInfo,
        showPower: 2
      })
    }
  },

  getPhoneNumber(e) {
    let that = this;
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      wx.showLoading({
        title: '授权中',
        mask: true
      });
      // 检查登录是否过期
      wx.checkSession({
        success() {
          server.sendRequest({
            url: '/User/WeiXinLogin',
            data: {
              code: that.data.code,
              appId: server.getAppid(),
              siteId: wx.getStorageSync('siteId'),
            },
            method: 'post',
            header: {
              'content-type': 'application/json'
            },
            success: res => {
              let {
                Code,
                Data,
                Message
              } = res;
              //获取到用户凭证 存儲 3rd_session 
              // wx.setStorageSync("WxToken", Data.WxToken);
              //存储登录返回的OpenId
              wx.setStorageSync("OpenId", Data.OpenId);
              //登录
              that.getLogin(e.detail.encryptedData, e.detail.iv, Data.WxToken)
            }
          })
        }
      })
    }
  },
  getLogin(encryptedData, iv, token) {
    let that = this;
    server.sendRequest({
      url: "/User/GetGZGLAppUser",
      data: {
        encryptedData: encryptedData,
        iv: iv,
        appId: server.getAppid(),
        siteId: wx.getStorageSync('siteId')
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        "access-token": token
      },
      success: res => {
        let {
          Code,
          Data,
          Message
        } = res;
        //隐藏授权框
        wx.hideLoading()
        wx.setStorageSync("token", Data.Token);
        // 是否为管理员
        wx.setStorageSync("isAdmin", Data.IsAdmin);
        // 自己是否为分销员
        if (Data.MyDistId) {
          wx.setStorageSync("MyDistId", Data.MyDistId);
        } else {
          wx.removeStorageSync('MyDistId')
        }
        if (wx.getStorageSync('DistId')) {
          server.reportVisit()
        }
        server.getMerchant(4);
        this.setAvter();
      }
    })
  },
  setAvter() {
    let that = this;
    server.sendRequest({
      url: "/User/UpdateUserPhoto",
      data: {
        NickName: that.data.userInfo.nickName,
        Photo: that.data.userInfo.avatarUrl,
        sex: that.data.userInfo.gender
      },
      method: 'POST',
      success: res => {
        wx.setStorageSync('userInfo', that.data.userInfo)
        wx.navigateBack({
          delta: 1
        })
      }
    })
  }
})