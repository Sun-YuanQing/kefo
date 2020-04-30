// pages/phone/phone.js
const server = require('../../utils/server')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
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
              siteId: app.globalData.siteId,
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
        siteId: app.globalData.siteId
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
        this.setAvter();
      }
    })
  },
  setAvter() {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    server.sendRequest({
      url: "/User/UpdateUserPhoto",
      data: {
        NickName: userInfo.nickName,
        Photo: userInfo.avatarUrl
      },
      method: 'POST',
      success: res => {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  }
})