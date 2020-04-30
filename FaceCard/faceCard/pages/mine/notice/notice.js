// pages/mine/notice/notice.js
//获取应用实例
const server = require('../../../utils/server')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeList: [],
    PageIndex: 1,
    PageSize: 10,
    total: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.queryNotice();

  },

  // 请求消息列表
  queryNotice() {
    const self = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    server.sendRequest({
      url: "/Message/GetMessages",
      data: {
        "PageIndex": self.data.PageIndex,
        "PageSize": self.data.PageSize
      },
      method: 'POST',
      success: function(res) {
        wx.hideLoading();
        //console.log("notice",res.data);
        let {
          Code,
          Message,
          Data
        } = res.data;
        if (Code == '0') {

          self.setData({
            noticeList: Data.Messages,
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
      fail: function(err) {
        wx.hideLoading();
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
   * 页面相关事件处理函数--监听用户下拉动作 下拉刷新
   */
  onPullDownRefresh: function() {
    // 显示顶部刷新图标
    const self = this;
    wx.showNavigationBarLoading();
    server.sendRequest({
      url: "/Message/GetMessages",
      data: {
        "PageIndex": self.data.PageIndex,
        "PageSize": self.data.PageSize
      },
      method: 'POST',
      success: function(res) {
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        // console.log("notice", res.data);
        let {
          Code,
          Message,
          Data
        } = res.data;
        if (Code == '0') {
          self.setData({
            noticeList: Data.Messages,
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
      fail: function(err) {
        wx.hideLoading();
        wx.showToast({
          title: err,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数 上拉加载数据
   */
  onReachBottom: function() {

    const self = this;
    if (self.data.noticeList.length == this.data.total) {
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
        url: "/Message/GetMessages",
        data: {
          "PageIndex": self.data.PageIndex,
          "PageSize": self.data.PageSize,
        },
        method: 'POST',
        success: function(res) {
          //console.log("bill",res.data)
          let {
            Code,
            Data,
            Message
          } = res.data;
          //隐藏授权框
          wx.hideLoading();
          if (Code == 0) {
            let oldData = self.data.noticeList;
            self.setData({
              noticeList: oldData.concat(Data.Messages),
              total: Data.Total
            })
            if (self.data.noticeList.length == Data.Total) {
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
  onShareAppMessage: function() {

  }
})