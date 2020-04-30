// cardItem/pages/index/index.js
const {
  $Toast
} = require('../../compoment/iview/base/index');
const server = require('../../../utils/server')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    showsub: false,
    visible: false,
    telphone: [{
      name: '',
    }],
    projectList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      siteid: options.siteid
    })
  },
  loadData() {
    let that = this;
    server.sendRequest({
      url: "/Site/GetSiteBaseInfo?siteId=" + that.data.siteid,
      method: 'POST',
      success: res => {
        if (res.data.Code == 0) {
          that.data.telphone[0].name = res.data.Data.Tel
          that.setData({
            shopData: res.data.Data,
            telphone: that.data.telphone
          })
          that.getProject();
          that.getCard();
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
  getProject() {
    let that = this;
    server.sendRequest({
      url: "/Lable/GetServiceSiteRecom?siteId=" + that.data.siteid,
      method: 'POST',
      success: res => {
        if (res.data.Code == 0) {
          for (let x in res.data.Data) {
            res.data.Data[x].ruiling = res.data.Data[x].Price.toFixed(2);
            let sell = res.data.Data[x].SellPrice.toFixed(2);
            res.data.Data[x].sellHead = sell.split('.')[0];
            res.data.Data[x].sellEnd = sell.split('.')[1];
          }
          that.setData({
            projectList: res.data.Data
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
  getCard() {
    let that = this;
    server.sendRequest({
      url: "/CardProject/GetCardProjectBySiteRecom?siteId=" + that.data.siteid,
      method: 'POST',
      success: res => {
        console.log(res.data)
        if (res.data.Code == 0) {
          for (let y in res.data.Data) {
            let cardPrice = res.data.Data[y].CardPrice.toFixed(2);
            let feika = res.data.Data[y].FeiKaPrice.toFixed(2);
            res.data.Data[y].nowHead = cardPrice.split('.')[0];
            res.data.Data[y].nowEnd = cardPrice.split('.')[1];
            res.data.Data[y].feiHead = feika.split('.')[0];
            res.data.Data[y].feiEnd = feika.split('.')[1];
          }
          that.setData({
            cardList: res.data.Data
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.loadData();
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
  subheadtag() {
    this.setData({
      showsub: !this.data.showsub
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
        const longitude = gps[1]
        wx.openLocation({
          latitude,
          longitude,
          scale: 18
        })
      }
    })
  },
  toproject() {
    wx.navigateTo({
      url: '/cardItem/pages/project/project?siteid=' + this.data.siteid,
    })
  },
  tocard() {
    wx.navigateTo({
      url: '/cardItem/pages/cardlist/cardlist?siteid=' + this.data.siteid,
    })
  },
  toOrder() {
    $Toast({
      content: '功能正在开发中，敬请期待！'
    });
  },
  toProjectDetail(e) {
    wx.navigateTo({
      url: '/cardItem/pages/projectdetail/projectdetail?serviceid=' + e.currentTarget.dataset.serviceid + '&siteid=' + this.data.siteid,
    })
  },
  tocardDetail(e) {
    wx.navigateTo({
      url: '/cardItem/pages/cardDetail/cardDetail?cardid=' + e.currentTarget.dataset.cardid,
    })
  },
})