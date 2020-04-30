Page({

  /**
   * 页面的初始数据
   */
  data: {
    startNow: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onUnload: function() {

  },
  toPhoto() {
    var that = this;
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.camera']) {
          wx.authorize({
            scope: 'scope.camera',
            success(res) {
              wx.navigateTo({
                url: "/pages/face/main/main"
              })
            },
            fail(err) {
              if (err.errMsg) {
                wx.showToast({
                  title: '您已关闭摄像头!!',
                })
                that.setData({
                  startNow: false
                })
              }
            }
          })
        } else {
          if (res.authSetting['scope.camera'] == false) {
            wx.showToast({
              title: '您已关闭摄像头!!',
            })
            that.setData({
              startNow: false
            })
          } else {
            that.setData({
              startNow: true
            })
            wx.navigateTo({
              url: "/pages/face/main/main"
            })
          }
        }
      }
    })
  },
  getShou(e) {
    if (e.detail.authSetting['scope.camera'] == false) {
      wx.showToast({
        title: '您已关闭摄像头!!',
      })
      this.setData({
        startNow: false
      })
    } else {
      this.setData({
        startNow: true
      })
      wx.navigateTo({
        url: "/pages/face/main/main"
      })
    }
  }

})