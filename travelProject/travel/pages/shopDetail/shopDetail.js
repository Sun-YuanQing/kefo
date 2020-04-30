const server = require('../../utils/server');
const WxParse = require('../../wxParse/wxParse')
const {
  $Message
} = require('../../components/iview/base/index');
const config = require('../../utils/config');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailIndex: 1,
    showActive: false,
    showPay: false,
    goodsDetail: {},
    visitorType: [],
    orderPriceList: [],
    selIndex: 0,
    departureDate: '',
    showUnify: '', //是否统一售价
    unifyNum: 1,
    loadSpin: true,
    arrayHeight: [],
    takeWay: ''
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
      goodsId: options.Id,
      isAdmin: wx.getStorageSync('isAdmin')
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!wx.getStorageSync("token")) {
      wx.removeStorageSync('userInfo')
    }
    this.loadData();
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
        if (res.Data.TravelProfile) {
          var contain = res.Data.TravelProfile;
          WxParse.wxParse('contain', 'html', contain, that, 5);
        }
        // Type  3 其他   5 酒店
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
        for (let x in res.Data.MonthPrice) {
          for (let y in res.Data.MonthPrice[x].Dates) {
            res.Data.MonthPrice[x].Dates[y].chooseSel = false;
          }
        }
        that.setData({
          merchant: wx.getStorageSync('merchant'),
          goodsDetail: res.Data,
          loadSpin: false,
          MyDistId: wx.getStorageSync('MyDistId')
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
    let index = e.currentTarget.dataset.index;
    let timeItem = this.data.goodsDetail.MonthPrice[this.data.selIndex].Dates[index];
    if (timeItem.Show == false) {
      return false;
    }
    let showUnify = timeItem.UnifiedSale ? 1 : 2;
    if (this.data.goodsDetail.Type == 5) {
      timeItem.chooseSel = !timeItem.chooseSel;
    } else {
      for (let x in this.data.goodsDetail.MonthPrice) {
        for (let y in this.data.goodsDetail.MonthPrice[x].Dates) {
          this.data.goodsDetail.MonthPrice[x].Dates[y].chooseSel = false;
        }
      }
      timeItem.chooseSel = !timeItem.chooseSel;
    }
    this.setData({
      goodsDetail: this.data.goodsDetail,
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
    if (this.data.goodsDetail.Type == 5) {
      for (let ff in this.data.visitorType) {
        this.data.visitorType[ff].show = false;
      }
    }
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
      orderPriceList: this.data.orderPriceList,
      visitorType: this.data.visitorType
    })
  },
  changeNum(e) {
    if (this.data.showUnify == 2 && this.data.goodsDetail.Type != 5) {
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
      urls: that.data.goodsDetail.DisplayPhoto // 需要预览的图片http链接列表
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

  toEdit() {
    wx.navigateTo({
      url: '/hotelPackage/pages/goods/changeTime/changeTime?Id=' + this.data.goodsId,
    })
  },
  onPickingMethod(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      takeWay: index
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
    let siteId = wx.getStorageSync('siteId') || '';
    let dist = wx.getStorageSync('MyDistId') || "";
    return {
      title: this.data.goodsDetail.Name,
      path: '/pages/shopDetail/shopDetail?Id=' + this.data.goodsId + '&siteId=' + siteId + "&DistId=" + dist,
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
  toPay() {
    let that = this;
    //判断取货方式
    if (!that.data.takeWay && this.data.goodsDetail.Type == '3') {
      $Message({
        content: '请选择取货方式！！！',
        type: 'error'
      });
      return false;
    }

    if (this.data.goodsDetail.Type != '3') {
      let departure = [];
      this.data.goodsDetail.MonthPrice.map((item, index) => {
        item.Dates.map((time, timeIndex) => {
          if (time.chooseSel) {
            if (this.data.goodsDetail.Type == 5) {
              departure.push(time.ItemTime)
              that.data.departureDate = departure.join(',');
            } else {
              that.data.departureDate = time.ItemTime;
            }
          }
        })
      })
      if (!that.data.departureDate) {
        $Message({
          content: '请选择日期！！！',
          type: 'error'
        });
        return false;
      }
    }

    if (that.data.showUnify == 2) {
      if (that.data.goodsDetail.Type == 5) {
        that.data.orderPriceList[0].ItemNum = that.data.unifyNum;
      }
      if (that.data.orderPriceList.length <= 0) {
        $Message({
          content: '请选择类型！！！',
          type: 'error'
        });
        return false;
      }
    } else {
      if (that.data.goodsDetail.Type == 5) {
        let visitor = that.data.goodsDetail.OtherProduct.DisunityType || that.data.goodsDetail.OtherProduct.UnifyType;
        that.data.orderPriceList = [{
          ItemId: visitor[0].Id,
          ItemName: visitor[0].Name,
          ItemNum: that.data.unifyNum,
          ItemPrice: visitor[0].SalePrice || 0
        }]
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
    }
    var shipPrice = 0;
    var isSparpart = false;
    if (that.data.goodsDetail.Type == 3 && that.data.takeWay == 1) {
      //0是不包邮
      isSparpart = that.data.goodsDetail.Logistics.FreeShipping == '0' ? false : true;
      //不包邮要传价格,包邮去掉价格
      shipPrice = isSparpart ? 0 : that.data.goodsDetail.Logistics.ShipPrice;
    }

    server.sendRequest({
      url: '/TraveOrder/AddTraveOrderVx',
      method: 'post',
      data: {
        ProductId: that.data.goodsId,
        DepartureDate: that.data.departureDate,
        OrderPriceList: that.data.orderPriceList,
        DistId: wx.getStorageSync('DistId') || '',
        IsFreeShip: isSparpart,
        ExpressAmount: shipPrice,
        TakeWay: that.data.goodsDetail.Type == 3 ? that.data.takeWay : 2
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
})