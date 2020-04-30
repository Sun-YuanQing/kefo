// pages/cardDetail/cardDetail.js
const server = require('../../utils/server')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailList: {},
    showsub: false,
    visible: false,
    telphone: [{
      name: ""
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      cardid: options.cardid
    })
    this.loadData()
  },
  loadData() {
    let that = this;
    server.sendRequest({
      url: '/UserCardCollect/GetCardProjectDetailByCardId?cardid=' + that.data.cardid,
      method: 'post',
      success: res => {
        console.log(res.data.Data)
        let card = res.data.Data.CardPrice.toFixed(2);
        let feicard = res.data.Data.FeiKaPrice.toFixed(2);
        res.data.Data.cardHead = card.split('.')[0];
        res.data.Data.cardEnd = card.split('.')[1];
        res.data.Data.feiHead = feicard.split('.')[0];
        res.data.Data.feiEnd = feicard.split('.')[1];
        that.data.telphone[0].name = res.data.Data.Tel;
        that.setData({
          detailList: res.data.Data,
          telphone: that.data.telphone
        })
      }
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
  showphone() {
    if (!this.data.telphone[0].name) {
      return false;
    }
    this.setData({
      visible: true
    });
  },
  handleClickItem({
    detail
  }) {
    console.log(detail)
    wx.makePhoneCall({
      phoneNumber: this.data.telphone[0].name //仅为示例，并非真实的电话号码
    })
  },
  downphone() {
    this.setData({
      visible: false
    });
  },
  changecollect(e) {
    let that = this;
    server.sendRequest({
      url: '/UserCardCollect/SetUserCardCollect',
      method: 'post',
      data: {
        CardId: e.currentTarget.dataset.cardid,
        IsCollect: e.currentTarget.dataset.collect
      },
      success: res => {
        if (res.data.Code == 0) {
          that.loadData();
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
  subheadtag() {
    this.setData({
      showsub: !this.data.showsub
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  toNowPay() {
    wx.navigateTo({
      url: '/cardItem/pages/cardDetail/cardDetail?cardid=' + this.data.detailList.CardId,
    })
  },
  toinfo() {
    wx.navigateTo({
      url: '/cardItem/pages/about/about',
    })
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

  }
})