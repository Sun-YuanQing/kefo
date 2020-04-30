const server = require('../../utils/server');
const {
  $Message
} = require('../../components/iview/base/index');
const setting = require('../../utils/setting');
const WxParse = require('../../wxParse/wxParse');
const config = require('../../utils/config');
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
    shareall: false,
    showSuccess: false,
    showUnify: '', //是否统一售价
    visitorType: [],
    unifyNum: 1,
    loadSpin: true,
    arrayHeight: [],
    takeWay: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let goodsId = config.globalData.showSeck ? config.globalData.seckId : options.Id;
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
      goodsId,
      activityType: options.type
    })
    this.loadData();
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
    if (!wx.getStorageSync("token")) {
      wx.removeStorageSync('userInfo')
    }
    this.setData({
      shareall: false,
      showPay: false
    })
  },

  loadData() {
    let that = this;
    let dataDetail = {
      url: that.data.activityType == 'assem' ? '/Assem/GetAssemDatailByAssemIdVx?assemId=' + that.data.goodsId : '/TravelProduct/GetAppSeckillProductDetail',
      data: that.data.activityType == 'assem' ? '' : {
        Id: that.data.goodsId
      }
    }
    server.sendRequest({
      ...dataDetail,
      method: 'post',
      success: res => {
        if (res.Data.TravelProfile) {
          var contain = res.Data.TravelProfile;
          WxParse.wxParse('contain', 'html', contain, that, 5);
        }
        this.calculate(res.Data.EndTime)
        if (res.Data.Type == '3') {
          this.setData({
            visitorType: res.Data.OtherProduct.DisunityType || res.Data.OtherProduct.UnifyType,
            showUnify: '2'
          })
        } else if (res.Data.Type == 5) {
          this.setData({
            visitorType: res.Data.OtherProduct.DisunityType || res.Data.OtherProduct.UnifyType
          })
        }
        that.setData({
          seckillDetail: res.Data,
          merchant: wx.getStorageSync('merchant'),
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
    if (this.data.activityType == 'seck' || (this.data.activityType == 'assem' && this.data.isAssem)) {
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
    } else if (this.data.activityType == 'assem' && !this.data.isAssem) {
      let index = e.currentTarget.dataset.index;
      this.data.visitorType[index].show = !this.data.visitorType[index].show;
      this.data.orderPriceList = [];
      this.data.visitorType.filter(item => {
        if (item.show) {
          let needData = {
            ItemId: item.Id,
            ItemName: item.Name,
            MaxAge: item.MaxAge || null,
            MinAge: item.MinAge || null,
            ItemNum: 1,
            ItemPrice: item.SalePrice || 0
          }
          this.data.orderPriceList.push(needData)
        }
      })
      this.setData({
        visitorType: this.data.visitorType,
        orderPriceList: this.data.orderPriceList
      })
    }
  },
  changeNum(e) {
    if (this.data.showUnify == 2 && this.data.seckillDetail.Type != 5) {
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
  toNowPay(e) {

    if (wx.getStorageSync('token')) {
      if (this.data.seckillDetail.StockNum > this.data.seckillDetail.SellNum) {
        if (this.data.seckillDetail.Type == '1' || this.data.seckillDetail.Type == '2') {
          if (e.currentTarget.dataset.type) {
            this.getType();
          }
        }
        this.setData({
          isAssem: e.currentTarget.dataset.type ? true : false,
          showPay: true
        })
      } else {
        $Message({
          content: '该商品已售罄！',
          type: 'error'
        });
      }
    } else {
      wx.navigateTo({
        url: '/pages/phone/phone',
      })
    }
  },
  closePay() {
    this.setData({
      showPay: false
    })
  },
  onPickingMethod(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      takeWay: index
    })
  },
  toPay(e) {
    let that = this;

    let dataDeatil = {};
    //判断取货方式
    if (!that.data.takeWay && this.data.seckillDetail.Type == '3') {
      $Message({
        content: '请选择取货方式！！！',
        type: 'error'
      });
      return false;
    }
    if (!that.data.departureDate && that.data.seckillDetail.Type != 3) {
      $Message({
        content: '请选择出发日期！',
        type: 'error'
      });
      return false;
    }
    if (that.data.activityType == 'seck' || (that.data.activityType == 'assem' && that.data.isAssem)) {
      if (that.data.orderPriceList.length <= 0) {
        $Message({
          content: that.data.seckillDetail.Type == 3 ? '请选择类型！' : '请选择游客类型！',
          type: 'error'
        });
        return false;
      }
      if (this.data.seckillDetail.Type == 5) {
        that.data.orderPriceList[0].ItemNum = that.data.unifyNum
      }
      if (that.data.activityType == 'seck') {
        dataDeatil = {
          ProductId: that.data.seckillDetail.Id,
          SeckId: that.data.goodsId,
          DepartureDate: that.data.departureDate,
          OrderPriceList: that.data.orderPriceList,
          DistId: wx.getStorageSync('DistId') || ''
        }
      } else {
        dataDeatil = {
          ProductId: that.data.seckillDetail.Id,
          AssemId: that.data.seckillDetail.AssemId,
          DepartureDate: that.data.departureDate,
          OrderPriceList: that.data.orderPriceList,
          SeckId: '',
          LaunchAssemId: '',
          DistId: wx.getStorageSync('DistId') || ''
        }
      }
    } else if (that.data.activityType == 'assem' && !that.data.isAssem) {
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
          ItemPrice: that.data.visitorType[0].SalePrice || 0
        }]
      }
      dataDeatil = {
        ProductId: that.data.seckillDetail.Id,
        DepartureDate: that.data.departureDate,
        OrderPriceList: that.data.orderPriceList,
        IsSparpart: false,
        DistId: wx.getStorageSync('DistId') || ''
      }
    }
    var shipPrice = 0;
    var isSparpart = false;
    if (that.data.seckillDetail.Type == 3 && that.data.takeWay == 1) {
      //0是不包邮
      isSparpart = that.data.seckillDetail.Logistics.FreeShipping == '0' ? false : true;
      //不包邮要传价格,包邮去掉价格
      shipPrice = isSparpart ? 0 : that.data.seckillDetail.Logistics.ShipPrice;
    }
    server.sendRequest({
      url: '/TraveOrder/AddTraveOrderVx',
      method: 'post',
      data: {
        ...dataDeatil,
        IsFreeShip: isSparpart,
        ExpressAmount: shipPrice,
        TakeWay: that.data.seckillDetail.Type == 3 ? that.data.takeWay : 2
      },
      success: res => {
        that.setData({
          showPay: false
        })
        let orderid = '';
        if (that.data.activityType == 'assem' && that.data.isAssem) {
          let Data = JSON.parse(res.Data);
          orderid = Data.TraveOrderId
        } else {
          orderid = res.Data;
        }
        wx.navigateTo({
          url: '/pages/orderDetail/orderDetail?orderid=' + orderid + '&unify=' + that.data.showUnify,
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
    if (this.data.activityType == 'assem') {
      wx.navigateTo({
        url: '/pages/shareImg/shareImg?id=' + this.data.goodsId + '&assemid=' + this.data.seckillDetail.AssemId
      })
    } else {
      wx.navigateTo({
        url: '/pages/shareImg/shareImg?id=' + this.data.goodsId
      })
    }
  },
  toOffered() {
    wx.navigateTo({
      url: '/pages/groupBook/invite/invite?id=' + this.data.launchAssemId,
    })
  },
  toOffer(res) {
    if (wx.getStorageSync('token')) {
      wx.navigateTo({
        url: '/pages/groupBook/invite/invite?id=' + res.currentTarget.dataset.id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/phone/phone',
      })
    }
  },
  toOrderDetail() {
    wx.navigateTo({
      url: '/pages/myOrderDetail/myOrderDetail?orderid=' + this.data.orderId,
    })
  },

  previewImg(e) {
    const that = this;
    let imgUrl = e.currentTarget.dataset.img;
    wx.previewImage({
      current: imgUrl, // 当前显示图片的http链接
      urls: that.data.seckillDetail.DisplayPhoto // 需要预览的图片http链接列表
    })
  },

  previewDetail(e) {
    const that = this;
    let imgUrl = e.currentTarget.dataset.img;
    wx.previewImage({
      current: imgUrl, // 当前显示图片的http链接
      urls: that.data.goodsDetail.TravelPhoto // 需要预览的图片http链接列表
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
    let dist = wx.getStorageSync('MyDistId') || "";
    let siteId = wx.getStorageSync('siteId') || '';
    return {
      title: this.data.seckillDetail.Name,
      path: '/pages/seckillDetail/seckillDetail?Id=' + this.data.goodsId + '&type=' + this.data.activityType + '&siteId=' + siteId + "&DistId=" + dist,
      imageUrl: this.data.seckillDetail.DisplayPhoto[0],
    }
  }
})