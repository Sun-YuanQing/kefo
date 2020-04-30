// cardItem/pages/order/order.js
const server = require('../../../utils/server');
const {
  $Message
} = require('../../compoment/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible: false,
    telphone: [{
      name: '',
    }],
    showPayWay: false,
    payList: [{
      name: '会员卡支付',
      money: 0
    }, {
      name: '微信支付',
      color: "#000",
      font: 24
    }],
    allprice: 0,
    headall: 0,
    endall: '00',
    flag: false,
    myCouponIndex: "",
    myCoupon: [],
    success: false,
    couponid: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      allData: options,
      siteid: options.siteid
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (wx.getStorageSync('index')) {
      this.setData({
        myCouponIndex: wx.getStorageSync('index')
      });
      wx.removeStorageSync('index');
    }
    this.loadData();
  },
  loadData() {
    let that = this;
    server.sendRequest({
      url: '/UserCardProject/GetCardOrderDetail',
      method: 'post',
      data: {
        phone: wx.getStorageSync('PhoneNumber'),
        "CardProjectId": that.data.allData.cardid,
        "SiteId": that.data.siteid,
        "FeikaCard": that.data.allData.buy
      },
      success: res => {
        console.log(res.data.Data)
        let {
          Code,
          Data,
          Message
        } = res.data;
        that.data.telphone[0].name = Data.UserPhone; //商家电话
        let feicard = Data.FeikaPrice.toFixed(2); //菲卡价保留两位小数
        let card = Data.CardPrice.toFixed(2); //原价价格样式调整
        Data.cardHead = card.split('.')[0];
        Data.cardEnd = card.split('.')[1];
        Data.feiHead = feicard.split('.')[0];
        Data.feiEnd = feicard.split('.')[1];
        that.data.payList[0].money = Data.Collect.Amount;
        let data = {
          cardprice: Data.CardPrice, //商品原价
          discount: Data.Collect.Discount // 会员卡折扣
        }
        // 是否有优惠券
        if (that.data.myCouponIndex) {
          data.mycoupon = Data.Collect.MyCoupons[that.data.myCouponIndex - 1].PreferentialAmount;
          that.setData({
            myCoupon: Data.Collect.MyCoupons[that.data.myCouponIndex - 1]
          })
        }
        // allprice 合计
        let allprice = this.realprice(data).toFixed(2);
        that.data.headall = allprice.split('.')[0];
        that.data.endall = allprice.split('.')[1];
        // discount 原价打了多少折扣
        let discount = (data.cardprice - (data.cardprice * data.discount / 10)).toFixed(2);
        // 赠送的最佳优惠券
        let b = 0;
        for (let x in Data.Collect.Coupons) {
          if (allprice > Data.Collect.Coupons[x].LimitAmount && Data.Collect.Coupons[x].PreferentialAmount > b) {
            b = Data.Collect.Coupons[x].PreferentialAmount;
            that.data.couponid = Data.Collect.Coupons[x].CouponId;
          } else {
            that.data.couponid = "";
          }
        }
        that.setData({
          telphone: that.data.telphone,
          detailList: res.data.Data,
          discount,
          allprice,
          headall: that.data.headall,
          endall: that.data.endall,
          payList: that.data.payList,
          couponid: that.data.couponid
        })
      }
    })
  },
  realprice(data) {
    let price = data.cardprice * (data.discount / 10);
    if (data.mycoupon) {
      price = price - data.mycoupon;
    }
    return price;
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  showphone() {
    this.setData({
      visible: true
    });
  },
  downphone() {
    this.setData({
      visible: false
    });
  },
  handleClickItem({
    detail
  }) {
    console.log(detail)
    wx.makePhoneCall({
      phoneNumber: this.data.detailList.UserPhone
    })
  },
  getLocaltion() {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.openLocation({
          latitude,
          longitude,
          scale: 18
        })
      }
    })
  },
  openPay() {
    this.setData({
      showPayWay: true
    })
  },
  closeaway() {
    this.setData({
      showPayWay: false
    })
  },
  tocoupon() {
    let allprice = this.data.allprice - this.data.discount;
    wx.navigateTo({
      url: '/cardItem/pages/myCoupon/myCoupon?detail=' + JSON.stringify(this.data.detailList.Collect.MyCoupons) + '&allprice=' + allprice
    })
  },
  trueaway({
    detail
  }) {
    const that = this;
    const index = detail.index + 1;
    if (that.data.detailList.Collect.Amount < that.data.allprice && index == 1) {
      $Message({
        content: '余额不足！请优先充值',
        type: 'warning'
      });
      return false;
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    let MyCouponId = that.data.myCouponIndex ? that.data.myCoupon.MyCouponId : '';

    server.sendRequest({
      url: "/Pay/WxPayApiBuyCard",
      method: "POST",
      data: {
        "PayType": index, //1.会员卡  2.微信
        "VipCardId": that.data.detailList.Collect.CardId, //会员卡id
        "CardProjectId": that.data.detailList.CardProjectId,
        "UserId": that.data.detailList.Collect.UserId,
        "SiteId": that.data.siteid,
        "Amount": that.data.detailList.Collect.Amount,
        MyCouponId,
        "CouponId": that.data.couponid,
        "Discount": that.data.detailList.Collect.Discount,
        "DiscountAmount": that.data.discount,
        "RedPacketId": that.data.detailList.Collect.RedPacketId,
        "RedAmount": that.data.detailList.Collect.RedAmount,
        "ActualAmount": that.data.allprice,
        OpenId: wx.getStorageSync('OpenId')
      },
      success: function(res) {
        console.log(res.data, 1111)
        wx.hideLoading();
        let {
          Code,
          Data,
          Message
        } = res.data;
        if (Code == "0") {
          if (index == 2) {
            let data = Data.m_values;
            wx.requestPayment({
              'timeStamp': data.timeStamp,
              'nonceStr': data.nonceStr,
              'package': data.package,
              'signType': data.signType,
              'paySign': data.paySign,
              'success': function(res) {
                if (res.errMsg == 'requestPayment:ok') {
                  that.setData({
                    showPayWay: false,
                    success: true
                  })
                }
              },
              'fail': function(res) {
                wx.showToast({
                  title: res.errMsg,
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          } else {
            that.setData({
              showPayWay: false,
              success: true
            })
          }
        } else if (Code == '400') {
          wx.showModal({
            title: '',
            content: Message,
            showCancel: false,
            success(res) {
              if (res.confirm) {

              }
            }
          })


        } else {
          wx.showToast({
            title: Message,
            icon: 'none',
            duration: 2000
          })
        }

      },
      fail: function(err) {
        wx.showToast({
          title: err,
          icon: 'none',
          duration: 2000
        })
      }

    })
  },
  toHome() {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  toDetail() {
    wx.redirectTo({
      url: '/pages/mine/order/order',
    })
  },
  toabout() {
    wx.navigateTo({
      url: '/cardItem/pages/about/about',
    })
  }
})