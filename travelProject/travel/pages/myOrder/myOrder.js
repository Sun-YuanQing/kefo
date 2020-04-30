// pages/myOrder/myOrder.js
const server = require('../../utils/server');
const setting = require('../../utils/setting');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderTitle: [{
      id: '',
      title: '全部'
    }, {
      id: '10',
      title: '待支付'
    }, {
      id: '11',
      title: '审核中',
      type: 1
    }, {
      id: '21',
      title: '待出行',
      type: 1
    }, {
      id: '0,12,22',
      title: '取消/退款'
    }],
    hotelOrder: [{
      id: '',
      title: '全部'
    }, {
      id: '10',
      title: '待支付'
    }, {
      id: '11',
      title: '确认中',
      type: 1
    }, {
      id: '21',
      title: '待入住',
      type: 1
    }, {
      id: '30',
      title: '已完成',
      type: 1
    }, {
      id: '0,12,22',
      title: '取消/退款'
    }],
    otherOrder: [{
      id: '',
      title: '全部'
    }, {
      id: '10',
      title: '待支付'
    }, {
      id: '11',
      title: '待发货',
      type: 1
    }, {
      id: '21',
      title: '待收货',
      type: 1
    }, {
      id: '23',
      title: '待提货',
      type: 1
    }, {
      id: '30',
      title: '已完成',
      type: 1
    }, {
      id: '0,12,22',
      title: '取消/退款'
    }],
    selOrder: '',
    page: 1,
    orderDetail: [],
    timer: '',
    noGoods: false,
    loadSpin: true,
    userType: 1, //userType 1自身订单  2客户订单
    showSuccess: false,
    productData: [],
    selProduct: '',
    showType: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.distId) {
      wx.setNavigationBarTitle({
        title: '客户订单'
      })
      this.setData({
        distId: options.distId,
        userType: 2
      })
    }
    if (options.state) {
      this.setData({
        selOrder: options.state
      })
    }
    this.iniData();
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

  iniData() {
    let that = this;
    server.sendRequest({
      url: '/TravelProductClass/GetSiteClassListVx',
      method: 'post',
      data: {
        AppId: server.getAppid(),
        SiteId: wx.getStorageSync('siteId')
      },
      success: res => {
        if (res.Data.length == 1) {
          that.setData({
            showType: res.Data[0].Type
          })
        }
        that.setData({
          productData: res.Data
        })
        this.loadData();
      }
    })
  },

  loadData() {
    let that = this;
    clearInterval(that.data.timer);
    let URL = that.data.userType == 1 ? '/TraveOrder/MyTraveOrderListVx' : '/Distribution/GetCustomerTraveOrderListVx';
    let user = {};
    if (this.data.distId) {
      user = {
        DistId: this.data.distId
      }
    }
    server.sendRequest({
      url: URL,
      data: {
        State: that.data.selOrder,
        PageIndex: that.data.page,
        PageSize: 10,
        Type: that.data.showType,
        ...user
      },
      method: 'post',
      success: res => {
        wx.stopPullDownRefresh();
        let orderDetail = that.data.page > 1 ? that.data.orderDetail : [];
        let page = res.Data.MyTraveOrders.length > 0 ? ++that.data.page : that.data.page;
        if (that.data.userType == 1) {
          orderDetail.push(...res.Data.MyTraveOrders)
        } else {
          orderDetail.push(...res.Data.CustomerTraveOrders)
        }
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

  changeProduct(e) {
    if (e.currentTarget.dataset.index) {
      let index = e.currentTarget.dataset.index - 1;
      this.setData({
        selProduct: this.data.productData[index].Id,
        showType: this.data.productData[index].Type
      });
    } else {
      this.setData({
        selProduct: '',
        showType: -1
      });
    }
    this.setData({
      selOrder: '',
      page: 1,
      loadSpin: true
    })
    this.loadData();
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
    this.setData({
      showSuccess: false
    })
    wx.navigateTo({
      url: '/pages/myOrderDetail/myOrderDetail?orderid=' + e.currentTarget.dataset.orderid + '&userType=' + this.data.userType,
    })
  },

  toAddInfo(e) {
    wx.navigateTo({
      url: '/hotelPackage/pages/hotelInfo/replenishInfo/replenishInfo?orderid=' + e.currentTarget.dataset.orderid,
    })
  },

  toAddress(e) {
    if (e.currentTarget.dataset.type == 1) {
      wx.navigateTo({
        url: '/pages/address/shippingAddress/shippingAddress?TraveOrderId=' + e.currentTarget.dataset.orderid,
      })
    } else {
      wx.navigateTo({
        url: '/pages/address/userExtract/userExtract?TraveOrderId=' + e.currentTarget.dataset.orderid,
      })
    }
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
    this.loadData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})