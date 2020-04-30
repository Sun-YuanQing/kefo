// cardItem/pages/feicard/feicard.js
const server = require('../../utils/server')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listTab: [{
      id: '',
      name: '精选'
    }, {
      id: '次卡',
      name: '次卡'
    }, {
      id: '体验卡',
      name: '体验卡'
    }],
    typeid: '',
    detailList: [],
    resetImage: false,
    firstShow: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    setTimeout(function() {
      that.setData({
        firstShow: false
      })
    }, 3000)
  },
  loadData() {
    let that = this;
    server.sendRequest({
      url: '/UserCardCollect/GetCardProjectResult',
      method: 'post',
      data: {
        ClassType: that.data.typeid,
        Key: that.data.searchKey
      },
      success: res => {
        if (res.data.Code == 0) {
          wx.removeStorageSync('search');
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
  tosearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let searchKey = wx.getStorageSync('search') ? wx.getStorageSync('search') : "";
    this.setData({
      searchKey
    })
    this.loadData();
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
  changTab(e) {
    this.setData({
      typeid: e.currentTarget.dataset.id,
      detailList: []
    })
    this.loadData();
  },
  toCollect() {
    wx.navigateTo({
      url: '/pages/collect/collect',
    })
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
  toreset() {
    this.setData({
      detailList: []
    })
    this.loadData();
  },
  onPageScroll(event) {
    if (event.scrollTop > 300 && this.data.resetImage == false) {
      this.setData({
        resetImage: true
      })
    } else if (event.scrollTop < 300 && this.data.showTopImage == true) {
      this.setData({
        resetImage: false
      })
    }
  },
  todetail(e){
    wx.navigateTo({
      url: '/pages/cardDetail/cardDetail?cardid='+e.currentTarget.dataset.cardid,
    })
  }
})