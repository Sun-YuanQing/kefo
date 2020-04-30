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
    options:{},
    PageIndex: 1,
    PageSize: 10,
    total: null,
    dataNone: "",
    isFinish: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log("options_bill",options)
    this.setData({
      options: options
    })
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.queryBill()
  },

  // 获取数据
  queryBill: function (options){
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
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        //console.log("bill",res.data)
        let { Code, Data, Message } = res.data;
        //隐藏授权框
        wx.hideLoading();
        if(Code == 0){
          if (Data.Total == 0){
            self.setData({
              dataNone: "暂无数据！"
            })
          }
          self.setData({
             statistics: Data.Statistics,
             records: Data.Records,
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

        }else{
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

  onPageScroll: function(e){
    // this.setData({
    //   scrollTop: e.scrollTop
    // })
  },

  //重新请求账单列表
  bindDateChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
    });
    this.queryBill()
  },

  //手风琴效果
  changeToggle: function(e){
    let index= e.currentTarget.dataset.index;
    if (this.data.selectedFlag[index]){
      this.data.selectedFlag[index] = false;
    }else{
      this.data.selectedFlag[index] = true;
    }
    this.setData({
      selectedFlag: this.data.selectedFlag
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        //console.log("bill",res.data)
        let { Code, Data, Message } = res.data;
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
      
    }else{
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
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function (res) {
          //console.log("bill",res.data)
          let { Code, Data, Message } = res.data;
          //隐藏授权框
          wx.hideLoading();
          if (Code == 0) {
            let oldData = self.data.records;
            self.setData({
              statistics: Data.Statistics,
              records: oldData.concat(Data.Records),
              total: Data.Total
            })
            if (self.data.records.length == Data.Total){
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

  }
})