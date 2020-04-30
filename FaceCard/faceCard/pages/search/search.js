// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historylist: [],
    oninput: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadData()
  },
  loadData() {
    let that = this;
    let hisStorage = wx.getStorageSync('history') ? wx.getStorageSync('history') : [];
    that.setData({
      historylist: hisStorage,
    });

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
  onInput(e) {
    this.setData({
      oninput: e.detail.value
    })
  },
  tosearch() {
    if (this.data.oninput != '') {
      this.data.historylist.unshift(this.data.oninput);
      if (this.data.historylist.length > 7) {
        this.data.historylist.splice(8, 1)
      }
    }
    wx.setStorageSync('history', this.data.historylist);
    wx.setStorageSync('search', this.data.oninput);
    wx.switchTab({
      url: '/pages/feicard/feicard',
    })
  },
  delAll() {
    wx.removeStorageSync('history');
    this.loadData();
  },
  toFind(e) {
    wx.setStorageSync('search', e.currentTarget.dataset.findname);
    wx.switchTab({
      url: '/pages/feicard/feicard',
    })
  }
})