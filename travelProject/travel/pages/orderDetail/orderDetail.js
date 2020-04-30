// pages/orderDetail/orderDetail.js
const server = require('../../utils/server')
const {
  $Message
} = require('../../components/iview/base/index');
const userLocation = require('../../utils/userLocation.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDetail: false,
    showPay: false,
    orderData: {},
    showSuccess: false,
    region: {}, //选择地区默认数据
    customItem: '全部', //其他列的初始标题
    takeWay :"",
    myRemark: ""
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
    let that = this;
    server.sendRequest({
      url: '/TraveOrder/GetTraveOrderDetailVx?traveOrderId=' + this.data.orderid,
      method: 'post',
      success: res => {
        if(res.Data.TakeWay){
          that.setData({
            takeWay:res.Data.TakeWay
          })
          if (res.Data.TakeWay == 1 && res.Data.type == 3) {
            userLocation.getLocation({
              success(address) {
                that.setData({
                  region: address
                })
                userLocation.globalData.address = address;
              },
              fail(e) {
                $Message({
                  content: '定位失败,请手动选择所在区域！',
                  type: 'error'
                });
              }
            })
          }
        }
        
        this.setData({
          orderData: res.Data,
          MyDistId: wx.getStorageSync('MyDistId')
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
    this.setData({
      orderPriceList: []
    })

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
      url: '/TraveOrder/ConfirmTraveOrderVx',
      method: 'post',
      data: {
        "TraveOrderId": that.data.orderid,
        "UserRemark": that.data.myRemark
      },
      success: res => {
        that.orderPay();
      }
    })

  },
  orderPay() {
    var that = this;
    server.sendRequest({
      url: '/TraveOrder/WxPayApiTraveOrder',
      data: {
        TraveOrderId: that.data.orderid, //订单id
        Amount: that.data.orderData.ActualAmount, //支付金额,
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
  toOrderDetail() {
    wx.redirectTo({
      url: '/pages/myOrderDetail/myOrderDetail?orderid=' + this.data.orderid,
    })
  },
  bindRegionChange: function (e) {
    this.data.region.province = e.detail.value[0];
    this.data.region.city = e.detail.value[1];
    this.setData({
      region: this.data.region
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      myRemark: e.detail.value
    })
  }
})