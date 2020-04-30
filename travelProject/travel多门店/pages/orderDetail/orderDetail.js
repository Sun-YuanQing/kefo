// pages/orderDetail/orderDetail.js
const server = require('../../utils/server')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // nvabarData: {
    //   showCapsule: 0, //显示左上角图标   1表示发现    0表示返回
    //   title: '确认订单', //导航栏 中间的标题
    // },
    showDetail: false,
    showPay: false,
    orderData: {},
    showSuccess: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderid: options.orderid,
      unify: options.unify
    })
    this.loadData();
  },
  loadData() {
    server.sendRequest({
      url: '/TraveOrder/GetTraveOrderDetailVx?traveOrderId=' + this.data.orderid,
      method: 'post',
      success: res => {
        this.setData({
          orderData: res.Data
        })
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
  changeDetail() {
    this.setData({
      showDetail: !this.data.showDetail
    })
  },
  changePay() {
    this.setData({
      showPay: !this.data.showPay
    })
  },
  toPay() {
    let that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    server.sendRequest({
      url: '/TraveOrder/ConfirmTraveOrderVx?traveorderId=' + that.data.orderid,
      method: 'post',
      success: res => {
        that.orderPay();
      }
    })

  },
  orderPay() {
    let that = this;
    server.sendRequest({
      url: '/TraveOrder/WxPayApiTraveOrder',
      data: {
        TraveOrderId: that.data.orderid, //订单id
        Amount: that.data.orderData.ActualAmount, //支付金额
        OpenId: wx.getStorageSync("OpenId")
      },
      method: 'post',
      success: res => {
        wx.hideLoading();
        let {
          Code,
          Data,
          Message
        } = res;
        let data = Data.m_values;
        wx.requestPayment({
          'timeStamp': data.timeStamp,
          'nonceStr': data.nonceStr,
          'package': data.package,
          'signType': data.signType,
          'paySign': data.paySign,
          'success': function (res) {
            if (res.errMsg == 'requestPayment:ok') {
              wx.setNavigationBarTitle({
                title: ''
              })
              that.setData({
                showSuccess: true
              })
            }
          },
          'fail': function (err) {
            wx.redirectTo({
              url: '/pages/myOrderDetail/myOrderDetail?orderid=' + that.data.orderid,
            })
          }
        })
      }
    })
  },
  toHome() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  toOrderDetail() {
    wx.redirectTo({
      url: '/pages/myOrderDetail/myOrderDetail?orderid=' + this.data.orderid,
    })
  }
})