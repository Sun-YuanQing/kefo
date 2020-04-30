// cardItem/pages/cardEquity/cardEquity.js
const server = require('../../../utils/server');
const {
  $Message
} = require('../../compoment/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardDetail: "",
    showModal: false,
    modalList: [{
      name: '我再想想',
      color: '#666',
    }, {
      name: '马上激活',
      color: '#FF4142'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      cardId: options.cardid
    })
    this.loadData();
  },
  loadData() {
    let that = this;
    server.sendRequest({
      url: '/CardProject/GetUserCardProjectDetaiLByCardId?cardId=' + that.data.cardId,
      method: "post",
      success: res => {
        console.log(res.data.Data)
        if (res.data.Code == 0) {
          that.setData({
            cardDetail: res.data.Data
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
  toproject(e) {
    wx.navigateTo({
      url: '/cardItem/pages/projectdetail/projectdetail?serviceid=' + e.currentTarget.dataset.severid,
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
  toActive() {
    this.setData({
      showModal: true
    })
  },
  isModal({
    detail
  }) {
    let that = this;
    const index = detail.index;
    if (index === 1) {
      server.sendRequest({
        url: '/CardProject/SetUserCardAct?cardId=' + that.data.cardId,
        method: "post",
        success: res => {
          if (res.data.Code == 0) {
            $Message({
              content: '激活成功！',
              type: 'success'
            });
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
    that.setData({
      showModal: false
    });
  },
  torecord(){
    wx.navigateTo({
      url: '/cardItem/pages/userRecord/userRecord?cardid=' + this.data.cardId,
    })
  }
})