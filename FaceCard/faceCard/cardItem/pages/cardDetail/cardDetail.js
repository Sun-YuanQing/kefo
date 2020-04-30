// cardItem/pages/cardDetail/cardDetail.js
const server = require('../../../utils/server')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible: false,
    telphone: [{
      name: '',
    }],
    showways: false,
    chooseBuy: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      cardid: options.cardid
    })
    this.loadData(); 
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  loadData() {
    let that = this;
    server.sendRequest({
      url: "/CardProject/GetCardProjectDetaiById?cardId=" + that.data.cardid,
      method: 'post',
      success: res => {
        let {
          Code,
          Data,
          Message
        } = res.data;
        if (Code == 0) {
          console.log(Data)
          let cardprice = Data.CardPrice.toFixed(2);
          let feiprice = Data.FeiKaPrice.toFixed(2);
          Data.cardHead = cardprice.split('.')[0];
          Data.cardEnd = cardprice.split('.')[1];
          Data.feiHead = feiprice.split('.')[0];
          Data.feiEnd = feiprice.split('.')[1];
          that.setData({
            cardData: Data,
            siteid: Data.SiteId
          })
          this.iniData();
        } else {
          wx.showToast({
            title: Message,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail(err) {
        wx.showToast({
          title: err,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  iniData() {
    let that = this;
    server.sendRequest({
      url: "/Site/GetSiteBaseInfo?siteId=" + that.data.siteid,
      method: 'POST',
      success: res => {
        if (res.data.Code == 0) {
          that.data.telphone[0].name = res.data.Data.Tel
          this.setData({
            siteData: res.data.Data,
            telphone: that.data.telphone
          })
        } else {
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail(err) {
        wx.showToast({
          title: err,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  toInfo() {
    wx.navigateTo({
      url: '/cardItem/pages/about/about',
    })
  },
  toCardPrice() {
    wx.navigateTo({
      url: '/cardItem/pages/cardPrice/cardPrice?cardid=' + this.data.cardid +'&siteid=' +this.data.siteid,
    })
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
    wx.makePhoneCall({
      phoneNumber: this.data.telphone[0].name
    })
  },
  getLocaltion() {
    if (this.data.shopData.Gps == "-") {
      return false;
    }
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        let gps = this.data.shopData.Gps.split('-');
        const latitude = gps[0]
        const longitude = rgps[1]
        wx.openLocation({
          latitude,
          longitude,
          scale: 18
        })
      }
    })
  },
  toNowPay() {
    if (this.data.cardData.FeiKaPrice > 0) {
      this.setData({
        showways: true
      })
    } else {
      this.tobuy();
    }

  },
  tobuy() {
    wx.navigateTo({
      url: '/cardItem/pages/order/order?buy=' + this.data.chooseBuy + "&cardid=" + this.data.cardData.Id + '&siteid='+this.data.siteid,
    })
  },
  changeBuy(e) {
    this.setData({
      chooseBuy: e.currentTarget.dataset.buyid
    })
  },
  showclose() {
    this.setData({
      showways: false
    })
  },
  toproject(e) {
    wx.navigateTo({
      url: '/cardItem/pages/projectdetail/projectdetail?serviceid=' + e.currentTarget.dataset.severid,
    })
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

  }
})