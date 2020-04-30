// pages/myOrderDetail/myOrderDetail.js
const server = require('../../utils/server');
const setting = require('../../utils/setting.js');
const {
  $Message
} = require('../../components/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDetail: false,
    orderDetail: {},
    holdTime: null,
    showTel: false,
    showSuccess: false,
    loadSpin: true,
    userType: 1,
    showTake: false,
    doTake: [{
        name: '取消'
      },
      {
        name: '确认',
        color: '#ed3f14',
        loading: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.userType) {
      this.setData({
        userType: options.userType
      })
    }
    this.setData({
      orderId: options.orderid,
      merchantInfo: wx.getStorageSync('merchant')
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
      orderDetail: {},
      holdTime: null
    })
    this.loadData();
  },

  loadData() {
    let URL = this.data.userType == 1 ? '/TraveOrder/GetTraveOrderDetailVx?traveOrderId=' : '/Distribution/GetCustomerTraveOrderDetailVx?traveOrderId='
    server.sendRequest({
      url: URL + this.data.orderId,
      method: 'post',
      success: res => {
        if (res.Data.State == '10') {
          //日期转化为毫秒
          let date = res.Data.CreateTime.replace(new RegExp("-", "gm"), "/");
          let time = (new Date(date)).getTime() + 1000 * 60 * 30;
          //毫秒转化为时间
          let newDate = setting.formatTime(new Date(time));
          this.setData({
            holdTime: newDate
          })
        }
        this.setData({
          orderDetail: res.Data,
          loadSpin: false
        })
      }
    })
  },
  toShop() {
    if (this.data.orderDetail.IsSeck) {
      wx.navigateTo({
        url: '/pages/seckillDetail/seckillDetail?Id=' + this.data.orderDetail.SeckId,
      })
    } else {
      wx.navigateTo({
        url: '/pages/shopDetail/shopDetail?Id=' + this.data.orderDetail.ProductId,
      })
    }
  },
  makeCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.merchantInfo.Tel
    })
  },
  downphone() {
    this.setData({
      showTel: !this.data.showTel
    })
  },
  toPay() {
    let that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    server.sendRequest({
      url: '/TraveOrder/WxPayApiTraveOrder',
      data: {
        TraveOrderId: that.data.orderId, //订单id
        Amount: that.data.orderDetail.ActualAmount, //支付金额
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
              that.setData({
                showSuccess: true
              })
            }
          },
          'fail': function (res) {
            // wx.showToast({
            //   title: res.errMsg,
            //   icon: 'none',
            //   duration: 2000
            // })
          }
        })
      }
    })
  },

  toOrderDetail() {
    this.setData({
      showSuccess: false
    })
    this.loadData()
  },

  toEditInfo() {
    wx.navigateTo({
      url: '/hotelPackage/pages/hotelInfo/replenishInfo/replenishInfo?orderid=' + this.data.orderId,
    })
  },

  toExpress() {
    wx.navigateTo({
      url: '/pages/logistics/logistics?orderid=' + this.data.orderId,
    })
  },

  toTakeGoods() {
    this.setData({
      showTake: true
    })
  },

  doTakeGoods({
    detail
  }) {
    if (detail.index === 0) {
      this.setData({
        showTake: false
      });
    } else {
      const doTake = [...this.data.doTake];
      doTake[1].loading = true;
      this.setData({
        doTake: doTake
      });
      server.sendRequest({
        url: '/TraveOrder/SetTraveOrderDoneVX?traveOrderId=' + this.data.orderId,
        method: 'post',
        success: res => {
          this.loadData();
          doTake[1].loading = false;
          this.setData({
            showTake: false,
            doTake: doTake
          });
          $Message({
            content: '确认收货成功！',
            type: 'success'
          });
        }
      })
    }
  },

  toEditAddress() {
    wx.navigateTo({
      url: '/pages/address/shippingAddress/shippingAddress?TraveOrderId=' + this.data.orderId,
    })
  },

  toEditPhone() {
    wx.navigateTo({
      url: '/pages/address/userExtract/userExtract?TraveOrderId=' + this.data.orderId,
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
})