// pages/distribution/shareQrcode/shareQrcode.js

const server = require('../../../utils/server');
const {
  $Message
} = require('../../../components/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareImg: null,
    visible: false,
    actions: [{
        name: '取消',
        color: '#666',
      },
      {
        name: '去设置',
        color: '#19be6b'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  loadData() {
    let that = this;
    server.sendRequest({
      url: '/QRCoder/GetQRCoderUrl',
      method: 'post',
      success: res => {
        that.setData({
          shareImg: res.Data.QrCoderUrl
        })
      }
    })
  },

  preview() {
    wx.previewImage({
      urls: [this.data.shareImg]
    })
  },

  saveImg() {
    if (this.data.shareImg == null) {
      return;
    }
    wx.downloadFile({
      url: this.data.shareImg,
      success: res => {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: (res) => {
              $Message({
                content: '保存成功',
                type: 'success'
              });
              wx.navigateBack({
                delta: 1
              })
            },
            fail: (res) => {
              if (res.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                this.setData({
                  visible: true
                })
              } else {
                $Message({
                  content: '保存失败，请刷新后重试',
                  type: 'error'
                });
              }
            }
          })
        } else {
          $Message({
            content: '保存失败，请刷新后重试',
            type: 'error'
          });
        }
      },
      fail: () => {
        $Message({
          content: '保存失败，请刷新后重试',
          type: 'error'
        });
      }
    })
  },

  getAuth(res) {
    this.setData({
      visible: false
    })
    if (res.detail.index == 1) {
      wx.openSetting({
        success(settingdata) {}
      })
    } else {
      $Message({
        content: '暂无权限,请授权后再试',
        type: 'error'
      });
    }
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})