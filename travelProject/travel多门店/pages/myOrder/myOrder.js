// pages/myOrder/myOrder.js
const server = require('../../utils/server');
const setting = require('../../utils/setting')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // nvabarData: {
    //   showCapsule: 0, //显示左上角图标   1表示发现    0表示返回
    //   title: '我的订单', //导航栏 中间的标题
    // },
    orderTitle: [{
      id: '',
      title: '全部'
    }, {
      id: '10',
      title: '待支付'
    }, {
      id: '11',
      title: '审核中'
    }, {
      id: '21',
      title: '待出行'
    }, {
      id: '0,12,22',
      title: '取消/退款'
    }],
    selOrder: '',
    page: 1,
    orderDetail: [],
    timer: '',
    noGoods: false,
    loadSpin: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      selOrder: options.state
    })
    this.loadData();
  },
  loadData() {
    let that = this;
    clearInterval(that.data.timer);
    server.sendRequest({
      url: '/TraveOrder/MyTraveOrderListVx',
      data: {
        State: that.data.selOrder,
        PageIndex: that.data.page,
        PageSize: 10
      },
      method: 'post',
      success: res => {
        wx.stopPullDownRefresh()
        let orderDetail = that.data.page > 1 ? that.data.orderDetail : [];
        let page = res.Data.Total.length > 0 ? ++page : that.data.page;
        orderDetail.push(...res.Data.MyTraveOrders)
        for (let x in orderDetail) {
          if (orderDetail[x].IsSeck && orderDetail[x].State == '10') {
            orderDetail[x].getTime = setting.calculate(orderDetail[x].EndTime)
          }
        }
        that.data.timer = setInterval(function () {
          for (let x in orderDetail) {
            if (orderDetail[x].IsSeck && orderDetail[x].State == '10') {
              orderDetail[x].getTime = setting.calculate(orderDetail[x].EndTime);
              that.setData({
                orderDetail
              })
            }
          }
        }, 1000);
        let noGoods = orderDetail.length > 0 ? false : true;
        that.setData({
          orderDetail,
          page,
          noGoods,
          loadSpin: false
        })
      }
    })
  },
  changeTab(e) {
    this.setData({
      selOrder: e.currentTarget.dataset.state,
      page: 1,
      loadSpin: true
    });
    this.loadData();
  },
  toOrderDetail(e) {
    let type = 1;
    if (e.currentTarget.dataset.state == '10') {
      type = 1
    } else if (e.currentTarget.dataset.state == '11') {
      type = 2
    } else if (e.currentTarget.dataset.state == '21') {
      type = 3
    } else if (e.currentTarget.dataset.state == '30') {
      type = 4
    }
    wx.navigateTo({
      url: '/pages/myOrderDetail/myOrderDetail?orderid=' + e.currentTarget.dataset.orderid,
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
    clearInterval(this.data.timer)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.timer)
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
    this.setData({
      page: 1
    })
    this.loadData();
  },
  toPay(e) {
    let that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    server.sendRequest({
      url: '/TraveOrder/WxPayApiTraveOrder',
      data: {
        TraveOrderId: e.currentTarget.dataset.orderid, //订单id
        Amount: e.currentTarget.dataset.amount, //支付金额
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