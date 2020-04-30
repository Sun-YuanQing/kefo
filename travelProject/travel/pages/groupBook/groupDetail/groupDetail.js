// pages/groupBook/groupDetail/groupDetail.js
const server = require('../../../utils/server');
const {
  $Message
} = require('../../../components/iview/base/index');
const setting = require('../../../utils/setting')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seckillDetail: {},
    detailIndex: 1,
    showActive: false,
    selIndex: 0,
    timer: '',
    getTime: {
      hour: '00',
      minute: '00',
      second: '00'
    },
    selVisitor: '',
    orderPriceList: [],
    shareall: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let goodsId = app.showSeck ? app.seckId : options.Id;
    this.setData({
      goodsId
    })
    this.loadData();
  },
  loadData() {
    let that = this;
    server.sendRequest({
      url: '/TravelProduct/GetAppSeckillProductDetail',
      data: {
        Id: that.data.goodsId
      },
      method: 'post',
      success: res => {
        this.calculate(res.Data.EndTime)
        that.setData({
          seckillDetail: res.Data
        })
      }
    })
  },
  calculate(endtime) {
    let that = this;
    clearTimeout(that.data.timer)
    let getTime = setting.calculate(endtime);
    that.setData({
      getTime
    })
    this.data.timer = setTimeout(function () {
      that.calculate(endtime);
    }, 1000)
  },

  changeActive() {
    this.setData({
      showActive: !this.data.showActive
    })
  },

  currentChange(e) {
    this.setData({
      detailIndex: e.detail.current + 1
    })
  },
  goHome() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  changeDate(e) {
    if (e.currentTarget.dataset.show == false) {
      return false;
    }
    this.setData({
      departureDate: e.currentTarget.dataset.time
    })
  },
  changeIndex(e) {
    this.setData({
      selIndex: e.currentTarget.dataset.index
    })
  },
  changeType(e) {
    let typeId = e.currentTarget.dataset.id;
    let selVisitor = e.currentTarget.dataset.id == this.data.selVisitor ? '' : this.data.seckillDetail.VisitorType;
    this.data.orderPriceList = e.currentTarget.dataset.id == this.data.selVisitor ? [] : [{
      ItemId: this.data.seckillDetail.VisitorType,
      ItemName: this.data.seckillDetail.VisitorTypeName,
      ItemNum: 1
    }];
    this.setData({
      selVisitor,
      orderPriceList: this.data.orderPriceList
    })
  },
  changeNum(e) {
    let index = e.currentTarget.dataset.index;
    this.data.orderPriceList[index].ItemNum = e.detail.value;
    this.setData({
      orderPriceList: this.data.orderPriceList
    })
  },
  currentChange(e) {
    this.setData({
      detailIndex: e.detail.current + 1
    })
  },
  toLookPDF() {
    wx.navigateTo({
      url: '/pages/pdfFile/pdfFile?id=' + this.data.goodsId,
    })
  },
  changeActive() {
    this.setData({
      showActive: !this.data.showActive
    })
  },
  toNowPay() {
    if (this.data.seckillDetail.StockNum > this.data.seckillDetail.SellNum) {
      this.setData({
        showPay: true
      })
    } else {
      $Message({
        content: '该商品已售罄！',
        type: 'error'
      });
    }
  },
  closePay() {
    this.setData({
      showPay: false
    })
  },
  toPay() {
    let that = this;
    if (!that.data.departureDate && that.data.seckillDetail.Type != 3) {
      $Message({
        content: '请选择出发日期！',
        type: 'error'
      });
      return false;
    }
    if (that.data.orderPriceList.length <= 0) {
      $Message({
        content: that.data.seckillDetail.Type == 3 ? '请选择类型！' : '请选择游客类型！',
        type: 'error'
      });
      return false;
    }
    server.sendRequest({
      url: '/TraveOrder/AddTraveOrderVx',
      method: 'post',
      data: {
        ProductId: that.data.seckillDetail.Id,
        SeckId: that.data.goodsId,
        DepartureDate: that.data.departureDate,
        OrderPriceList: that.data.orderPriceList,
        DistId: wx.getStorageSync('DistId') || ''
      },
      success: res => {
        this.setData({
          showPay: false
        })
        wx.navigateTo({
          url: '/pages/orderDetail/orderDetail?orderid=' + res.Data,
        })
      }
    })
  },
  noneAddr() {
    $Message({
      content: '暂无定位！',
      type: 'error'
    });
  },
  shareshare: function () {
    this.setData({
      shareall: true
    })
  },
  nosharebu: function () {
    this.setData({
      shareall: false
    })
  },
  noBubbling() {
    return false;
  },
  gotoShare: function () {
    wx.navigateTo({
      url: '/pages/shareImg/shareImg?id=' + this.data.goodsId
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
    return {
      title: this.data.seckillDetail.Name,
      path: '/pages/seckillDetail/seckillDetail?Id=' + this.data.goodsId,
      imageUrl: this.data.seckillDetail.DisplayPhoto[0],
    }
  }
})