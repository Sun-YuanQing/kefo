const server = require('../../../utils/server')
var common_js = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //scrollTop: 0,
    height: 0,
    selectedFlag: [true],
    statistics: {},
    records: [],
    date: common_js.formatTime(),
    options: {},
    PageIndex: 1,
    PageSize: 10,
    isFinish: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      options: options
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.queryBill()
  },

  // 获取数据
  queryBill: function(options) {
    const self = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    server.sendRequest({
      url: "/ConsumeRecord/GetConsumeRecords",
      data: {
        "SiteId": self.data.options.SiteId,
        "UserId": self.data.options.UserId,
        "PageIndex": self.data.PageIndex,
        "PageSize": self.data.PageSize,
        "Date": self.data.date
      },
      method: 'POST',
      success: function(res) {
        let {
          Code,
          Data,
          Message
        } = res.data;
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        //隐藏授权框
        wx.hideLoading();
        if (Code == 0) {
          let records = self.data.PageIndex == 1 ? [] : self.data.records;
          let pageIndex = self.data.records.length <= 0 ? self.data.PageIndex : ++self.data.PageIndex;
          if (Data.Records) {
            records.push(...Data.Records);
          }
          self.setData({
            PageIndex: pageIndex,
            statistics: Data.Statistics,
            records,
            isFinish: true
          })

        } else if (Code == '400') {
          wx.showModal({
            title: '',
            content: Message,
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '/pages/phone/phone'
                })
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
      fail(err) {
        wx.showToast({
          title: err,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  onPageScroll: function(e) {
    // this.setData({
    //   scrollTop: e.scrollTop
    // })
  },

  //重新请求账单列表
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value,
      pageIndex: 1,
      records: []
    });
    this.queryBill()
  },

  //手风琴效果
  changeToggle: function(e) {
    let index = e.currentTarget.dataset.index;
    if (this.data.selectedFlag[index]) {
      this.data.selectedFlag[index] = false;
    } else {
      this.data.selectedFlag[index] = true;
    }
    this.setData({
      selectedFlag: this.data.selectedFlag
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作，下拉刷新
   */
  onPullDownRefresh: function() {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.setData({
      PageIndex: 1,
      records: []
    })
    this.queryBill();
  },

  /**
   * 页面上拉触底事件的处理函数,上拉加载数据
   */
  onReachBottom: function() {
    this.setData({
      isFinish: false
    });
    this.queryBill();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})