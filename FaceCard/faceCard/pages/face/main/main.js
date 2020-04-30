const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: "",
    isScan: false,
    devicePosition: "front",
    tipMsg: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  onUnload: function() {

  },
  toPhoto() {
    this.setData({
      isPhoto: true
    })
  },
  cancel() {
    wx.navigateBack({
      delta: 1
    })
  },
  reserve() {
    let data = this.data.devicePosition == "back" ? "front" : "back";
    this.setData({
      devicePosition: data
    })
  },
  // 识别
  takePhoto() {
    const self = this;
    this.setData({
      isScan: true
    })
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          imgSrc: res.tempImagePath,
        })
        this.upload(res.tempImagePath); //上传图片
      }
    })
  },
  error(e) {
    wx.showModal({
      title: '警告',
      content: e.detail,
    })
    // 您已禁止使用摄像头，请打开权限后重试！
  },

  // 上传相片
  upload: function(imgPath) {
    const self = this;
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // });
    wx.uploadFile({
      url: "https://www.linkedsign.cn/Beauty/PhoneUser/RegisterUser",
      filePath: imgPath,
      name: "Photo",
      method: 'POST',
      header: {
        "Content-Type": "multipart/form-data",
        "accept": "application/json",
        'access-token': wx.getStorageSync("WxToken")
      },
      formData: {
        "SiteId": wx.getStorageSync("SiteId")
      },
      success: function(res) {
        // wx.hideLoading();
        let {
          Code,
          Data,
          Message
        } = JSON.parse(res.data);
        self.setData({
          isScan: false
        })
        if (Code == 0) {
          if (Data.ExistRed == true) {
            app.globalData.existRed = true;
          }
          if (wx.getStorageSync("SiteId")) {
            wx.reLaunch({
              url: "/pages/new_user/success/success"
            })
          } else {
            wx.switchTab({
              url: "/pages/card_bag/index/index"
            })
          }
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
          self.setData({
            tipMsg: '未检测到数据'
          })
          wx.showToast({
            title: Message,
            icon: 'none',
            duration: 2000
          })
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }, 3500)
        }

      },
      fail: function(err) {
        self.setData({
          isScan: false
        })
        wx.showToast({
          title: err,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },


})