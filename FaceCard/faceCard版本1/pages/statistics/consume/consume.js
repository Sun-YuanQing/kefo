const server = require('../../../utils/server')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedFlag: [true],
    records: [],
    date: "",
    item: "",
    options: {},
    PageIndex: 1,
    PageSize: 10,
    isFinish: false,
    isShowTypes: false,
    typeList: ["全部", "美容美发", "生活服务", "学习机构", "健身房", "餐饮", "超市", "其他"],
    seltype: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // options.type   1、充值   3、消费
    if (options.type == 1) {
      wx.setNavigationBarTitle({
        title: '累计充值明细'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '累计消费明细'
      })
    }
    this.setData({
      typeName: options.type
    })
    this.queryData()
  },

  showType: function() {
    this.setData({
      isShowTypes: true
    })
  },

  // 获取数据
  queryData: function(options) {
    const self = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    server.sendRequest({
      url: "/Report/GetAppRecordDetail",
      data: {
        TYPE: self.data.typeName, //1. 充值 3. 消费 
        Date: self.data.date, //传空取所有
        ITEM: self.data.item, //默认传全部
        PageIndex: self.data.PageIndex,
        PageSize: self.data.PageSize
      },
      method: 'POST',
      success: function(res) {
        let {
          Code,
          Data,
          Message
        } = res.data;
        //隐藏授权框
        wx.hideLoading();
        wx.stopPullDownRefresh();
        if (Code == 0) {
          let records = self.data.PageIndex == 1 ? [] : self.data.records;
          let pageIndex = self.data.records.length <= 0 ? self.data.PageIndex : ++self.data.PageIndex;
          if (Data.Recodes) {
            records.push(...Data.Recodes);
          }
          self.setData({
            records,
            isFinish: true,
            PageIndex: pageIndex
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
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
      PageIndex: 1,
      records: []
    });
    this.queryData()
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
    this.setData({
      PageIndex: 1,
      records: []
    })
    this.queryData()
  },

  /**
   * 页面上拉触底事件的处理函数,上拉加载数据
   */
  onReachBottom: function() {
    wx.showNavigationBarLoading();
    this.setData({
      isFinish: false
    })
    this.queryData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  choseItem(e) {
    this.setData({
      seltype: e.currentTarget.dataset.index
    })
  },
  closeClass() {
    this.setData({
      isShowTypes: false
    })
  },
  allNo() {},
  closeTrue() {
    this.setData({
      item: this.data.typeList[this.data.seltype],
      isShowTypes: false,
      PageIndex: 1,
      records: []
    })
    this.queryData()
  },
  toDetail(e) {
    wx.navigateTo({
      url: '/pages/statistics/detail/detail?type=' + this.data.typeName + '&id=' + e.currentTarget.dataset.id,
    })
  }
})