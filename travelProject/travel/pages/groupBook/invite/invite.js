// pages/groupBuying/groupBuying.js
const server = require('../../../utils/server.js');
const setting = require('../../../utils/setting.js');
const config = require('../../../utils/config');
const {
  $Message
} = require('../../../components/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '用户',
    status: 1,
    showModal: false,
    getTime: {
      hour: "00",
      minute: "00",
      second: "00"
    },
    timer: '',
    showActive: false,
    showSuccess: false,
    myRemark: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.DistId) {
      wx.setStorageSync('DistId', options.DistId);
      if (wx.getStorageSync('token')) {
        server.reportVisit()
      }
    }
    if (options.siteId) {
      wx.removeStorageSync('token');
      wx.removeStorageSync('userInfo');
      wx.setStorageSync('siteId', options.siteId)
      config.globalData.showSelect = true;
    }
    if (options.siteId || options.DistId) {
      server.getMerchant(4)
    }
    this.setData({
      groupId: options.id,
      merchant: wx.getStorageSync('merchant')
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
    clearInterval(this.data.timer);
    if (!wx.getStorageSync("token")) {
      wx.removeStorageSync('userInfo')
    }
    this.setData({
      token: wx.getStorageSync("token")
    })
    this.loadData();
  },
  loadData() {
    let that = this;
    clearInterval(that.data.timer);
    server.sendRequest({
      url: '/Assem/GetAssemOpenDatailByLaunchAssemIdVx?launchAssemId=' + this.data.groupId,
      method: 'post',
      success: res => {
        wx.stopPullDownRefresh();
        that.data.getTime = setting.calculate(res.Data.EndTime);
        that.data.timer = setInterval(function () {
          that.data.getTime = setting.calculate(res.Data.EndTime)
          that.setData({
            getTime: that.data.getTime
          })
        }, 1000)
        if (res.Data.LaunchState == 2) {
          $Message({
            content: '您已成功参加拼团活动',
            type: 'success'
          });
        }
        that.setData({
          groupDetail: res.Data,
          getTime: that.data.getTime
        })
      }
    })
  },

  changeActive() {
    this.setData({
      showActive: !this.data.showActive
    })
  },

  toLogin(res) {
    wx.navigateTo({
      url: '/pages/phone/phone',
    })
  },
  toAssem() {
    let that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var shipPrice = 0;
    var isSparpart = false;
    if (that.data.groupDetail.Type == 3 && that.data.groupDetail.TakeWay == 1) {
      isSparpart = that.data.groupDetail.Logistics.FreeShipping == '0' ? false : true;
      //不包邮要传价格,包邮去掉价格
      shipPrice = isSparpart ? 0 : that.data.groupDetail.Logistics.ShipPrice;
    }
    server.sendRequest({
      url: '/TraveOrder/AddTraveOrderVx',
      method: 'post',
      data: {
        ProductId: that.data.groupDetail.Id,
        AssemId: that.data.groupDetail.AssemId,
        DepartureDate: that.data.groupDetail.DepartureDate,
        LaunchAssemId: that.data.groupId,
        OrderPriceList: [{
          ItemId: that.data.groupDetail.VisitorType,
          ItemName: that.data.groupDetail.VisitorTypeName,
          ItemNum: 1
        }],
        SeckId: '',
        DistId: wx.getStorageSync('DistId') || '',
        IsFreeShip: isSparpart,
        ExpressAmount: shipPrice,
        TakeWay: that.data.groupDetail.TakeWay,
      },
      success: res => {
        let Data = JSON.parse(res.Data)
        this.setData({
          orderId: Data.TraveOrderId
        })
        server.sendRequest({
          url: '/TraveOrder/ConfirmTraveOrderVx',
          data: {
            traveorderId: that.data.orderId,
            UserRemark: this.data.myRemark
          },
          method: 'post',
          success: res => {
            that.orderPay();
          }
        })
      }
    })
  },
  orderPay() {
    let that = this;
    server.sendRequest({
      url: '/TraveOrder/WxPayApiTraveOrder',
      data: {
        TraveOrderId: that.data.orderId, //订单id
        Amount: that.data.groupDetail.ActTotalAmount, //支付金额
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
                showModal: true,
                showSuccess: true
              })
            }
          },
          'fail': function (err) {
            console.log(err)
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
  toOffered() {
    this.loadData();
    this.setData({
      showSuccess: false
    })
  },
  toOrderDetail() {
    wx.navigateTo({
      url: '/pages/myOrderDetail/myOrderDetail?orderid=' + this.data.groupDetail.TraveOrderId,
    })
  },
  toDetail() {
    wx.switchTab({
      url: '/pages/activity/activity',
    })
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

  closeModal() {
    this.setData({
      showModal: false
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadData();
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
    let dist = wx.getStorageSync('MyDistId') || "";
    let siteId = wx.getStorageSync('siteId') || '';
    return {
      title: this.data.groupDetail.Extens,
      imageUrl: this.data.groupDetail.Coverphoto[0],
      path: '/pages/groupBook/invite/invite?id=' + this.data.groupId + '&siteId=' + siteId + "&DistId=" + dist
    }
  }
})