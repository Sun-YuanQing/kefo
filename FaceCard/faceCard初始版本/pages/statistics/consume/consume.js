const server = require('../../../utils/server')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //scrollTop: 0,
    height: 0,
    selectedFlag: [true],
    records: [],
    date: "",
    item: "",
    options: {},
    PageIndex: 1,
    PageSize: 10,
    total: null,
    dataNone: "",
    isFinish: false,
    isShowTypes: false,
    typeList: ["全部", "美容美发", "生活服务", "学习机构", "健身房", "餐饮", "超市", "其他"],
    seltype: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  showType: function () {
    this.setData({
      isShowTypes: true
    })
  },

  // 获取数据
  queryData: function (options) {
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
      success: function (res) {
        let {
          Code,
          Data,
          Message
        } = res.data;
        //隐藏授权框
        wx.hideLoading();
        if (Code == 0) {
          if (Data.Total == 0) {
            self.setData({
              dataNone: "暂无数据！"
            })
          }
          self.setData({
            records: Data.Recodes,
            total: Data.Total
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

  onPageScroll: function (e) {
    // this.setData({
    //   scrollTop: e.scrollTop
    // })
  },

  //重新请求账单列表
  bindDateChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
      dataNone: '',
      PageIndex: 1
    });
    this.queryData()
  },

  //手风琴效果
  changeToggle: function (e) {
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
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    const self = this;
    wx.showNavigationBarLoading();
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
      success: function (res) {
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        let {
          Code,
          Data,
          Message
        } = res.data;
        if (Code == 0) {
          if (Data.Total == 0) {
            self.setData({
              dataNone: "暂无数据！"
            })
          }
          self.setData({
            statistics: Data.Statistics,
            records: Data.Records,
            total: Data.Total
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

  /**
   * 页面上拉触底事件的处理函数,上拉加载数据
   */
  onReachBottom: function () {
    const self = this;
    if (self.data.records.length == this.data.total) {
      self.setData({
        isFinish: true
      });

    } else {
      let pageIndex = parseInt(self.data.PageIndex) + 1;
      self.setData({
        PageIndex: pageIndex
      })
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
        success: function (res) {
          let {
            Code,
            Data,
            Message
          } = res.data;
          //隐藏授权框
          wx.hideLoading();
          if (Code == 0) {
            let oldData = self.data.records;
            self.setData({
              statistics: Data.Statistics,
              records: oldData.concat(Data.Records),
              total: Data.Total
            })
            if (self.data.records.length == Data.Total) {
              self.setData({
                isFinish: true
              })
            }
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
    }


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
  allNo() { },
  closeTrue() {
    this.setData({
      item: this.data.typeList[this.data.seltype],
      isShowTypes: false,
      dataNone: '',
      PageIndex: 1
    })
    this.queryData()
  },
  toDetail(e) {
    wx.navigateTo({
      url: '/pages/statistics/detail/detail?type=' + this.data.typeName + '&id=' + e.currentTarget.dataset.id,
    })
  }
})