// pages/collect/collect.js
const server = require('../../utils/server')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadData();
  },
  loadData() {
    let that = this;
    let phone = wx.getStorageSync('PhoneNumber');
    server.sendRequest({
      url: '/UserCardCollect/GetMyCardCollectResult?phone=' + wx.getStorageSync('PhoneNumber'),
      method: 'post',
      data: {
        ClassType: that.data.typeid,
        Key: ""
      },
      success: res => {
        console.log(res.data.Data)
        if (res.data.Code == 0) {
          for (let x in res.data.Data) {
            let feicard = res.data.Data[x].FeiKaPrice.toFixed(2);
            res.data.Data[x].feiHead = feicard.split('.')[0];
            res.data.Data[x].feiEnd = feicard.split('.')[1];
          }
          that.setData({
            detailList: res.data.Data
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
  todetail(e){
    wx.navigateTo({
      url: '/pages/cardDetail/cardDetail?cardid=' + e.currentTarget.dataset.cardid,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  changecollect(e) {
    let that = this;
    console.log(e.currentTarget.dataset)
    server.sendRequest({
      url: '/UserCardCollect/SetUserCardCollect',
      method: 'post',
      data: {
        CardId: e.currentTarget.dataset.cardid,
        IsCollect: false  //false为取消收藏
      },
      success: res => {
        console.log(res.data)
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
  }
})