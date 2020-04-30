const server = require('../../utils/server');
const {
  $Message
} = require('../../components/iview/base/index');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailIndex: 1,
    showActive: false,
    showPay: false,
    goodsType: 1,
    goodsDetail: {},
    visitorType: [],
    orderPriceList: [],
    selIndex: 0,
    departureDate: '',
    showUnify: '', //是否统一售价
    unifyNum: 1,
    loadSpin: true,
    arrayHeight: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.siteId) {
      wx.removeStorageSync('token');
      wx.removeStorageSync('userInfo');
      app.globalData.siteId = options.siteId;
      app.globalData.showSelect = true;
      server.getMerchant(4, '', app.globalData.siteId)
    }
    this.setData({
      goodsId: options.Id
    })
    this.loadData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!wx.getStorageSync("token")) {
      wx.removeStorageSync('userInfo')
    }
  },

  loadData() {
    let that = this;
    server.sendRequest({
      url: '/TravelProduct/GetAppTravelProductDetail',
      data: {
        Id: that.data.goodsId
      },
      method: 'post',
      success: res => {
        if (res.Data.Type == '3') {
          this.setData({
            visitorType: res.Data.OtherProduct.DisunityType || res.Data.OtherProduct.UnifyType,
            showUnify: '2'
          })
        }
        that.setData({
          merchant: wx.getStorageSync('merchant'),
          goodsDetail: res.Data,
          loadSpin: false
        })
      }
    })
  },
  getType() {
    let that = this;
    server.sendRequest({
      url: '/Lable/GetVisitorTypes',
      method: 'post',
      success: res => {
        let visitor = [];
        res.Data.VisitorTypes.map((item, index) => {
          visitor.push(
            Object.assign({}, item, {
              show: false
            })
          )
        })
        that.setData({
          visitorType: visitor
        })
      }
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
    let showUnify = e.currentTarget.dataset.unify ? 1 : 2;
    this.setData({
      departureDate: e.currentTarget.dataset.time,
      showUnify
    })
  },
  changeIndex(e) {
    this.setData({
      selIndex: e.currentTarget.dataset.index
    })
  },
  changeType(e) {
    let index = e.currentTarget.dataset.index;
    this.data.visitorType[index].show = !this.data.visitorType[index].show;
    this.data.orderPriceList = [];
    for (let x in this.data.visitorType) {
      if (this.data.visitorType[x].show) {
        let needData = {
          ItemId: this.data.visitorType[x].Id,
          ItemName: this.data.visitorType[x].Name,
          MaxAge: this.data.visitorType[x].MaxAge || null,
          MinAge: this.data.visitorType[x].MinAge || null,
          ItemNum: 1,
          ItemPrice: this.data.visitorType[x].SalePrice || 0
        }
        this.data.orderPriceList.push(needData)
      }
    }
    this.setData({
      visitorType: this.data.visitorType,
      orderPriceList: this.data.orderPriceList
    })
  },
  changeNum(e) {
    if (this.data.showUnify == 2) {
      let index = e.currentTarget.dataset.index;
      this.data.orderPriceList[index].ItemNum = e.detail.value;
      this.setData({
        orderPriceList: this.data.orderPriceList
      })
    } else {
      this.setData({
        unifyNum: e.detail.value
      })
    }
  },
  noneAddr() {
    $Message({
      content: '暂无定位！',
      type: 'error'
    });
  },

  previewImg(e) {
    const that = this;
    let imgUrl = e.currentTarget.dataset.img;
    wx.previewImage({
      current: imgUrl, // 当前显示图片的http链接
      urls: [imgUrl] // 需要预览的图片http链接列表
    })
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
      title: this.data.goodsDetail.Name,
      path: '/pages/shopDetail/shopDetail?Id=' + this.data.goodsId + '&siteId=' + app.globalData.siteId,
      imageUrl: this.data.goodsDetail.DisplayPhoto[0],
    }
  },
  currentChange(e) {
    let index = e.detail.current;
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
  toNowPay(res) {
    if (wx.getStorageSync('token')) {
      if (this.data.goodsDetail.Type == '1' || this.data.goodsDetail.Type == '2') {
        this.getType();
      }
      this.setData({
        showPay: true
      })
    } else {
      if (res.detail.errMsg == 'getUserInfo:ok') {
        let userInfo = {
          ...res.detail.userInfo
        }
        wx.setStorageSync('userInfo', userInfo)
        wx.navigateTo({
          url: '/pages/phone/phone',
        })
      }
    }

  },
  closePay() {
    this.setData({
      showPay: false
    })
  },
  toPay() {
    let that = this;
    if (!that.data.departureDate && that.data.goodsDetail.Type != '3') {
      return false;
    }
    if (that.data.showUnify == 2) {
      if (that.data.orderPriceList.length <= 0) {
        return false;
      }
    } else {
      that.data.orderPriceList = [{
        ItemId: that.data.visitorType[0].Id,
        ItemName: that.data.visitorType[0].Name,
        MaxAge: that.data.visitorType[0].MaxAge || null,
        MinAge: that.data.visitorType[0].MinAge || null,
        ItemNum: that.data.unifyNum,
        ItemPrice: this.data.visitorType[0].SalePrice || 0
      }]
    }
    server.sendRequest({
      url: '/TraveOrder/AddTraveOrderVx',
      method: 'post',
      data: {
        ProductId: that.data.goodsId,
        DepartureDate: that.data.departureDate,
        IsSparpart: false,
        OrderPriceList: that.data.orderPriceList
      },
      success: res => {
        this.setData({
          showPay: false
        })
        wx.navigateTo({
          url: '/pages/orderDetail/orderDetail?orderid=' + res.Data + '&unify=' + that.data.showUnify,
        })
      }
    })
  },
  // swiperHeight(e) {
  //   let index = e.currentTarget.dataset.index;
  //   let winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
  //   let imgh = e.detail.height; //图片高度
  //   let imgw = e.detail.width; //图片宽度
  //   let swiperH = winWid * imgh / imgw + "px"
  //   this.data.arrayHeight[index] = swiperH;
  //   this.setData({
  //     imgHeight: this.data.arrayHeight[0],
  //     arrayHeight: this.data.arrayHeight //设置高度
  //   })
  // },
})