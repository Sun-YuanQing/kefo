// cardItem/pages/projectdetail/projectdetail.js
const {
  $Toast
} = require('../../compoment/iview/base/index');
const server = require('../../../utils/server')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible: false,
    telphone: [{
      name: '0755-86967063',
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      serviceid: options.serviceid,
      siteid: options.siteid
    })
    this.loadData();
    this.iniData();
  },
  loadData() {
    let that = this;
    server.sendRequest({
      url: "/Lable/GetSiteServiceById?serviceId=" + that.data.serviceid,
      method: 'POST',
      success: res => {
        console.log(res.data.Data)
        if (res.data.Code == 0) {
          res.data.Data.Price = res.data.Data.Price.toFixed(2);
          let sell = res.data.Data.SellPrice.toFixed(2);
          res.data.Data.sellHead = sell.split('.')[0];
          res.data.Data.sellEnd = sell.split('.')[1];
          that.setData({
            detailData: res.data.Data
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
  iniData() {
    let that = this;
    server.sendRequest({
      url: "/Site/GetSiteBaseInfo?siteId=" + that.data.siteid,
      method: 'POST',
      success: res => {
        console.log(res.data.Data, 11111)
        if (res.data.Code == 0) {
          this.setData({
            siteData: res.data.Data
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
      phoneNumber: '18664373579' //仅为示例，并非真实的电话号码
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
  toNowPay() {
    $Toast({
      content: '功能正在开发中，敬请期待！'
    });
    // wx.navigateTo({
    //   url: '/cardItem/pages/order/order',
    // })
  }
})